import numpy as np
import pandas as pd
from dataclasses import dataclass, field
from typing import List, Optional, Tuple, Dict, Any
import torch
import torch.nn as nn
import torch.nn.functional as F
from pathlib import Path
from time import time
from django.conf import settings
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from matplotlib.patches import Rectangle

BASE_DIR = Path(__file__).resolve().parent
MEDIA_ROOT = Path(getattr(settings, "MEDIA_ROOT", "media"))
MEDIA_URL = getattr(settings, "MEDIA_URL", "/media/")

@dataclass
class PINNverseConfig:
    data_cols: List[str]
    S_col: str
    F_col: str
    catg_cols: List[str] = field(default_factory=list)
    batch_size: int = 128
    lr: float = 5e-4
    epochs: int = 100000
    patience: int = 1000
    seed: int = 42
    hidden: int = 64
    layers: int = 3
    dropout: float = 0.0
    weight_decay: float = 0.0
    grad_clip: Optional[float] = 1.0
    diameter_mm: float = 101.6
    height_mm: float = 63.5
    rate_mm_per_min: float = 50.0
    target_S_scale: float = 1.0
    target_F_scale: float = 1.0
    tol_phys: float = 1e-3
    rho_phys_init: float = 1.0
    rho_growth: float = 2.0
    growth_patience: int = 10
    k_folds: int = 10
    test_frac: float = 0.10
    shuffle_dev: bool = True
    num_workers: int = 0
    repro_sigma_S: float = 0.78
    repro_sigma_F: float = 0.29
    pic_level: float = 0.99

class Preprocessor:
    def __init__(self, cfg: PINNverseConfig):
        self.cfg = cfg
        self.feature_names: List[str] = []
        self.x_mean: Optional[np.ndarray] = None
        self.x_std: Optional[np.ndarray] = None
        self.cat_levels: Dict[str, List[str]] = {}
    def fit(self, df_train: pd.DataFrame):
        X_num = df_train[self.cfg.data_cols].astype(np.float32).copy()
        self.cat_levels = {}
        for c in self.cfg.catg_cols:
            col = df_train[c].astype("category")
            levels = [str(v) for v in col.cat.categories.tolist()]
            self.cat_levels[c] = levels
        X_train_df = self._build_design(df_train)
        X = X_train_df.values.astype(np.float32)
        self.x_mean = X.mean(axis=0, keepdims=True)
        self.x_std = X.std(axis=0, keepdims=True) + 1e-6
        self.feature_names = list(X_train_df.columns)
    def _build_design(self, df_any: pd.DataFrame) -> pd.DataFrame:
        X_num = df_any[self.cfg.data_cols].astype(np.float32).copy()
        X_cat_blocks = []
        for c in self.cfg.catg_cols:
            levels = self.cat_levels.get(c, [])
            ser = df_any[c].astype("string")
            data = {}
            for lvl in levels:
                col_name = f"{c}__{lvl}"
                data[col_name] = (ser == lvl).astype(np.float32).values
            X_cat_blocks.append(pd.DataFrame(data, index=df_any.index, dtype=np.float32))
        X_cat = pd.concat(X_cat_blocks, axis=1) if X_cat_blocks else pd.DataFrame(index=df_any.index, dtype=np.float32)
        X_df = pd.concat([X_num, X_cat], axis=1)
        if self.feature_names:
            for col in self.feature_names:
                if col not in X_df.columns:
                    X_df[col] = 0.0
            X_df = X_df[self.feature_names]
        return X_df
    def transform(self, df_any: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        assert self.x_mean is not None and self.x_std is not None, "Before Transform, Preprocessor must be fit."
        X_df = self._build_design(df_any)
        X = X_df.values.astype(np.float32)
        Xn = (X - self.x_mean) / self.x_std
        S = df_any[self.cfg.S_col].astype(np.float32).values / self.cfg.target_S_scale
        Fv = df_any[self.cfg.F_col].astype(np.float32).values / self.cfg.target_F_scale
        y = np.vstack([S, Fv]).T.astype(np.float32)
        return Xn, y
        
class MLP(nn.Module):
    def __init__(self, in_dim: int, hidden: int, layers: int, dropout: float):
        super().__init__()
        mods = []
        d = in_dim
        for _ in range(layers):
            lin = nn.Linear(d, hidden)
            nn.init.xavier_uniform_(lin.weight)
            nn.init.zeros_(lin.bias)
            mods += [lin, nn.Tanh()]
            if dropout > 0: mods += [nn.Dropout(dropout)]
            d = hidden
        self.backbone = nn.Sequential(*mods)
        self.head_sigma = nn.Linear(d, 1)
        self.head_eps = nn.Linear(d, 1)
        self.head_eps_pl = nn.Linear(d, 1)
        nn.init.xavier_uniform_(self.head_sigma.weight); nn.init.zeros_(self.head_sigma.bias)
        nn.init.xavier_uniform_(self.head_eps.weight); nn.init.zeros_(self.head_eps.bias)
        nn.init.xavier_uniform_(self.head_eps_pl.weight); nn.init.zeros_(self.head_eps_pl.bias)
    def forward(self, x):
        h = self.backbone(x)
        sigma_pred = F.softplus(self.head_sigma(h)) + 1e-6
        eps_pred   = F.softplus(self.head_eps(h)) + 1e-9
        eps_pl_pred= F.softplus(self.head_eps_pl(h)) + 1e-12
        sigma_pred = torch.clamp(sigma_pred, 0.0, 1e3)
        eps_pred   = torch.clamp(eps_pred, 0.0, 10.0)
        eps_pl_pred= torch.clamp(eps_pl_pred, 0.0, 10.0)
        return sigma_pred.squeeze(-1), eps_pred.squeeze(-1), eps_pl_pred.squeeze(-1)
    
class MarshallSurrogate(nn.Module):
    def __init__(self, in_dim: int, hidden: int, layers: int, dropout: float):
        super().__init__()
        self.nn = MLP(in_dim, hidden, layers, dropout)
        self.raw_varrho_S = nn.Parameter(torch.zeros(1), requires_grad=False)
    def _pos(self, x):
        return F.softplus(x) + 1e-8
    @property
    def varrho_S(self):
        return self._pos(self.raw_varrho_S)
    def forward(self, x):
        return self.nn(x)

def load_pinnverse(path):
    chk = torch.load(path, map_location="cpu", weights_only=False)
    cfg = PINNverseConfig(**chk["cfg_dict"])
    preproc = Preprocessor(cfg)
    preproc.feature_names = chk["preproc"]["feature_names"]
    preproc.x_mean = chk["preproc"]["x_mean"]
    preproc.x_std = chk["preproc"]["x_std"]
    preproc.cat_levels = chk["preproc"]["cat_levels"]
    in_dim = len(preproc.feature_names)
    model = MarshallSurrogate(
        in_dim=in_dim,
        hidden=cfg.hidden,
        layers=cfg.layers,
        dropout=cfg.dropout,
    )
    model.nn.load_state_dict(chk["nn_state"])
    with torch.no_grad():
        model.raw_varrho_S.copy_(chk["raw_varrho_S"])
    model.eval()
    return model, preproc, cfg
  
def Predict(model, config, preprocessor, input_dict, 
                             sigma_S=0.78, sigma_F=0.29, R_S=2.2 , R_F=0.8 ):
    df_input = pd.DataFrame([input_dict])
    df_input[config.S_col] = 0.0
    df_input[config.F_col] = 0.0
    X_norm, _ = preprocessor.transform(df_input)
    X_tensor = torch.from_numpy(X_norm).float()
    with torch.no_grad():
        sigma_pred, eps_pred, _ = model(X_tensor)
        D_sp = config.diameter_mm
        H_sp = config.height_mm
        rhoS = float(model.varrho_S.item())
        S_pred = (D_sp * H_sp / rhoS) * sigma_pred.item()
        F_pred = D_sp * eps_pred.item()
    return {
        "S_pred_kN":     round(S_pred, 1),
        "S_sigma_kN-":   round(S_pred - sigma_S, 1),
        "S_sigma_kN+":   round(S_pred + sigma_S, 1),
        "S_R_kN-":       round(S_pred - R_S, 1),
        "S_R_kN+":       round(S_pred + R_S, 1),
        "F_pred_mm":     round(F_pred, 1),
        "F_sigma_mm-":   round(F_pred - sigma_F, 1),
        "F_sigma_mm+":   round(F_pred + sigma_F, 1),
        "F_R_mm-":       round(F_pred - R_F, 1),
        "F_R_mm+":       round(F_pred + R_F, 1),
    }

#def fit_maa_q_single(sieve_sizes, sieve_values, dmin_fixed=0.01, q_min=0.05, q_max=0.90, q_step=0.001):
#    sizes_mm = np.array(sieve_sizes, dtype=float)
#    P = np.array(sieve_values, dtype=float)
#    mask_100 = P >= 100.0
#    if np.any(mask_100):
#        first_100_idx = np.argmax(mask_100)
#        Dmax = sizes_mm[first_100_idx]
#    else:
#        Dmax = sizes_mm[-1]
#    in_window = (sizes_mm >= dmin_fixed) & (sizes_mm <= Dmax) & np.isfinite(P)
#    D_use = sizes_mm[in_window]
#    P_use = P[in_window]
#    if D_use.size < 3:
#        return {"q_best": np.nan, "r2": np.nan, "Dmax": Dmax, "used_sieves": int(D_use.size)}
#    q_grid = np.arange(q_min, q_max + 1e-12, q_step)
#    Dq = D_use[None, :]
#    num = np.power(Dq, q_grid[:, None]) - np.power(dmin_fixed, q_grid)[:, None]
#    den = np.power(Dmax, q_grid)[:, None] - np.power(dmin_fixed, q_grid)[:, None]
#    den = np.where(np.isclose(den, 0.0), np.finfo(float).eps, den)
#    P_hat_all = 100.0 * (num / den)
#    sse = np.sum((P_hat_all - P_use[None, :]) ** 2, axis=1)
#    best_i = int(np.argmin(sse))
#    q_best = float(q_grid[best_i])
#    P_hat = P_hat_all[best_i, :]
#    ss_res = np.sum((P_use - P_hat) ** 2)
#    ss_tot = np.sum((P_use - np.mean(P_use)) ** 2)
#    r2 = 1.0 if np.isclose(ss_tot, 0.0) else (1.0 - ss_res / ss_tot)
#    return {"q_best": q_best, "r2": r2, "Dmax": Dmax, "used_sieves": int(D_use.size)}

def fit_maa_q_single(sieve_sizes, sieve_values, dmin_fixed=0.01, q_min=0.05, q_max=0.90, q_step=0.001):
    sizes_mm = np.array(sieve_sizes, dtype=float)
    P = np.array(sieve_values, dtype=float)
    start_idx = len(P) - 1
    for i in range(len(P) - 1, 0, -1):
        if abs(P[i] - P[i - 1]) < 3.0:
            start_idx = i - 1
        else:
            break
    Dmax = sizes_mm[start_idx]
    in_window = (sizes_mm >= dmin_fixed) & (sizes_mm <= Dmax) & np.isfinite(P)
    D_use = sizes_mm[in_window]
    P_use = P[in_window]
    if D_use.size < 3:
        return {"q_best": np.nan, "r2": np.nan, "Dmax": Dmax, "used_sieves": int(D_use.size)}
    q_grid = np.arange(q_min, q_max + 1e-12, q_step)
    Dq = D_use[None, :]
    num = np.power(Dq, q_grid[:, None]) - np.power(dmin_fixed, q_grid)[:, None]
    den = np.power(Dmax, q_grid)[:, None] - np.power(dmin_fixed, q_grid)[:, None]
    den = np.where(np.isclose(den, 0.0), np.finfo(float).eps, den)
    P_hat_all = 100.0 * (num / den)
    sse = np.sum((P_hat_all - P_use[None, :]) ** 2, axis=1)
    best_i = int(np.argmin(sse))
    q_best = float(q_grid[best_i])
    P_hat = P_hat_all[best_i, :]
    ss_res = np.sum((P_use - P_hat) ** 2)
    ss_tot = np.sum((P_use - np.mean(P_use)) ** 2)
    r2 = 1.0 if np.isclose(ss_tot, 0.0) else (1.0 - ss_res / ss_tot)
    return {"q_best": q_best, "r2": r2, "Dmax": Dmax, "used_sieves": int(D_use.size)}
    
def plot_marshall_summary(
    sieve_sizes, sieve_values,
    binderC, Va, Vma, Pen, PI, MR,
    maxD, bulkD, Soft,
    res,
    gradation_path,
    sf_path,
    dpi_gradation=200,
    dpi_sf=400,
):
    plt.style.use("seaborn-v0_8-whitegrid")
    fig1 = plt.figure(figsize=(8, 4))
    gs = GridSpec(1, 2, figure=fig1, width_ratios=[1, 0.5])
    ax_sieve = fig1.add_subplot(gs[0, 0])
    ax_sieve.set_title("Gradation Curve")
    ax_sieve.set_xscale("log")
    ax_sieve.set_xlabel("Sieve size (mm)")
    ax_sieve.set_ylabel("Percentage passing (%)")
    x = np.array(sieve_sizes, dtype=float)
    y = np.array(sieve_values, dtype=float)
    ax_sieve.plot(x, y, "-o", color="#3CACA8", lw=2, ms=5)
    ax_sieve.set_xlim(0.05, 50)
    ax_sieve.set_ylim(0, 102)
    ax_sieve.set_xticks(x)
    ax_sieve.get_xaxis().set_major_formatter(plt.ScalarFormatter())
    from matplotlib.ticker import FixedLocator, StrMethodFormatter
    ax_sieve.xaxis.set_major_locator(FixedLocator(x))
    ax_sieve.minorticks_off()
    ax_sieve.tick_params(
        axis="x",
        which="major",
        bottom=True, labelbottom=True,
        top=False, labeltop=False,
        direction="out",
        length=5,
    )
    ax_sieve.xaxis.set_major_formatter(StrMethodFormatter("{x:g}"))

    ax_sieve.set_yticks(np.arange(0, 110, 10))
    ax_sieve.tick_params(
        axis="y",
        which="major",
        left=True, labelleft=True,
        right=False, labelright=False,
        direction="out",
        length=5,
    )

    ax_sieve.grid(True, which="both", ls=":", alpha=0.6)

    for spine in ax_sieve.spines.values():
        spine.set_color("black")
        spine.set_linewidth(1.2)

    plt.setp(ax_sieve.get_xticklabels(), rotation=45, ha="right")

    ax_info = fig1.add_subplot(gs[0, 1])
    ax_info.axis("off")
    ax_info.set_title("Mixture Properties")

    for spine in ax_info.spines.values():
        spine.set_color("black")
        spine.set_linewidth(1.2)

    lines = [
        "",
        f"Binder content (%):      {binderC:.2f}",
        "",
        f"Maximum Density (Mg/m³): {maxD:.3f}",
        f"Bulk Density (Mg/m³):    {bulkD:.3f}",
        f"Air voids (%):           {Va:.2f}",
        f"VMA (%):                 {Vma:.2f}",
        "",
        f"Penetration (0.1mm):       {Pen:.0f}",
        f"Softening point (°C):    {Soft:.1f}",
        f"Penetration Index:       {PI:.2f}",
        "",
        f"Modulus of Richness:     {MR:.1f}",
    ]
    ax_info.text(
        0.02, 0.98,
        "\n".join(lines),
        va="top", ha="left",
        family="monospace", fontsize=10
    )
    fig1.tight_layout(rect=[0, 0, 1, 0.95])
    fig1.savefig(gradation_path, dpi=dpi_gradation, bbox_inches="tight")
    plt.close(fig1)

    plt.style.use("seaborn-v0_8-white")
    S_std_lo = res["S_sigma_kN-"]
    S_std_hi = res["S_sigma_kN+"]
    S_R_lo   = res["S_R_kN-"]
    S_R_hi   = res["S_R_kN+"]
    F_std_lo = res["F_sigma_mm-"]
    F_std_hi = res["F_sigma_mm+"]
    F_R_lo   = res["F_R_mm-"]
    F_R_hi   = res["F_R_mm+"]
    y_max = 22.5 if S_R_hi <= 22.5 else S_R_hi + 1.0
    x_max = 6.0  if F_R_hi <= 6.0  else F_R_hi + 0.5
    x_label_y_offset = y_max * 0.025
    y_label_x_offset = x_max * 0.025
    line_x_offset = x_max * 0.025
    line_y_offset = y_max * 0.02
    fig2, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlabel("Marshall Flow (mm)", fontsize=12)
    ax.set_ylabel("Marshall Stability (kN)", fontsize=12)
    ax.set_xlim(0, x_max)
    ax.set_ylim(0, y_max)
    ax.grid(False)
    ax.tick_params(
        axis="both",
        direction="out",
        length=5,
        width=1,
    )
    sigma_color = "#FF7F7F"
    R_color = "#3CACA8" 
    rect_std = Rectangle(
        (F_std_lo, S_std_lo),
        F_std_hi - F_std_lo,
        S_std_hi - S_std_lo,
        facecolor=sigma_color, alpha=0.25,
        edgecolor=sigma_color, linewidth=2,
        label=r"± $\sigma_R$",
    )
    ax.add_patch(rect_std)
    rect_R = Rectangle(
        (F_R_lo, S_R_lo),
        F_R_hi - F_R_lo,
        S_R_hi - S_R_lo,
        facecolor=R_color, alpha=0.15,
        edgecolor=R_color, linewidth=2,
        label="± R",
    )
    ax.add_patch(rect_R)
    for x in (F_R_lo, F_R_hi):
        ax.axvline(
            x=x,
            ymin=0,
            ymax=S_R_lo / y_max,
            color=R_color,
            linestyle="dashed",
            linewidth=1,
        )
    for y in (S_R_lo, S_R_hi):
        ax.axhline(
            y=y,
            xmin=0,
            xmax=F_R_lo / x_max,
            color=R_color,
            linestyle="dashed",
            linewidth=1,
        )
    for x in (F_std_lo, F_std_hi):
        ax.axvline(
            x=x,
            ymin=0,
            ymax=S_std_lo / y_max,
            color=sigma_color,
            linestyle="dashed",
            linewidth=1,
        )
    for y in (S_std_lo, S_std_hi):
        ax.axhline(
            y=y,
            xmin=0,
            xmax=F_std_lo / x_max,
            color=sigma_color,
            linestyle="dashed",
            linewidth=1,
        )
    ax.text(
        F_R_lo - line_x_offset, x_label_y_offset, f"{F_R_lo:.1f}",
        ha="center", va="bottom", fontsize=11, color=R_color,
    )
    ax.text(
        F_R_hi + line_x_offset, x_label_y_offset, f"{F_R_hi:.1f}",
        ha="center", va="bottom", fontsize=11, color=R_color,
    )
    ax.text(
        F_std_lo - line_x_offset, x_label_y_offset * 1.3, f"{F_std_lo:.1f}",
        ha="center", va="bottom", fontsize=11, color=sigma_color,
    )
    ax.text(
        F_std_hi + line_x_offset, x_label_y_offset * 1.3, f"{F_std_hi:.1f}",
        ha="center", va="bottom", fontsize=11, color=sigma_color,
    )
    ax.text(
        y_label_x_offset, S_R_lo - line_y_offset, f"{S_R_lo:.1f}",
        ha="left", va="center", fontsize=11, color=R_color,
    )
    ax.text(
        y_label_x_offset, S_R_hi + line_y_offset, f"{S_R_hi:.1f}",
        ha="left", va="center", fontsize=11, color=R_color,
    )
    ax.text(
        y_label_x_offset * 1.3, S_std_lo - line_y_offset, f"{S_std_lo:.1f}",
        ha="left", va="center", fontsize=11, color=sigma_color,
    )
    ax.text(
        y_label_x_offset * 1.3, S_std_hi + line_y_offset, f"{S_std_hi:.1f}",
        ha="left", va="center", fontsize=11, color=sigma_color,
    )

    ax.legend(
        loc="lower center",
        bbox_to_anchor=(0.5, 1.02),
        ncol=2,
        fontsize=11,
        frameon=False,
    )

    fig2.tight_layout(rect=[0, 0, 1, 0.95])
    fig2.savefig(sf_path, dpi=dpi_sf, bbox_inches="tight")
    plt.close(fig2)
    
# ---------- #
# Load model #
# ---------- #

MODEL_PATH = BASE_DIR / "MarshallPINN.pt"
model, preproc, cfg = load_pinnverse(MODEL_PATH)

# ------- #
# Predict #
# ------- #

def predict_marshall_outputs(
    max_density: float,
    bulk_density: float,
    penetration: float,
    softening: float,
    binder_content: float,
    sieve_data: Dict[str, float],
    session_id: str,
) -> Dict[str, Any]:
  
    # Volumetric properties
    Va = (1.0 - (bulk_density / max_density)) * 100.0
    Vma = ((Va / 100.0) + ((bulk_density * (binder_content / 100.0)) / 1.03)) * 100.0
  
    # Sieve sizes and values (must match your training setup)
    sieve_sizes = [0.063, 0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 5.6, 8.0, 11.2, 16.0, 22.4, 31.5, 45.0]
    sieve_values = [
        float(sieve_data.get("0.063", 0.0)),
        float(sieve_data.get("0.125", 0.0)),
        float(sieve_data.get("0.25", 0.0)),
        float(sieve_data.get("0.5", 0.0)),
        float(sieve_data.get("1", 0.0)),
        float(sieve_data.get("2", 0.0)),
        float(sieve_data.get("4", 0.0)),
        float(sieve_data.get("5.6", 0.0)),
        float(sieve_data.get("8", 0.0)),
        float(sieve_data.get("11.2", 0.0)),
        float(sieve_data.get("16", 0.0)),
        float(sieve_data.get("22.4", 0.0)),
        float(sieve_data.get("31.5", 0.0)),
        float(sieve_data.get("45", 0.0)),
    ]

    # Bailey's ratios
    threshold = 90.0
    NMAS = sieve_sizes[0]
    for i in reversed(range(len(sieve_sizes))):
        if sieve_values[i] < threshold:
            NMAS = sieve_sizes[i]
            break
    def closest_sieve_index(target):
        diffs = [abs(s - target) for s in sieve_sizes]
        return int(diffs.index(min(diffs)))
      
    PCS_target = NMAS * 0.22
    PCS_idx = closest_sieve_index(PCS_target)
    PCS = sieve_sizes[PCS_idx]
    SCS_target = PCS * 0.22
    SCS_idx = closest_sieve_index(SCS_target)
    SCS = sieve_sizes[SCS_idx]
    TCS_target = SCS * 0.22
    TCS_idx = closest_sieve_index(TCS_target)
    TCS = sieve_sizes[TCS_idx]
    HS_target = NMAS * 0.5
    HS_idx = closest_sieve_index(HS_target)
    HS = sieve_sizes[HS_idx]
    PM_PCS = sieve_values[PCS_idx]
    PM_SCS = sieve_values[SCS_idx]
    PM_TCS = sieve_values[TCS_idx]
    PM_HS = sieve_values[HS_idx]
    CA = (PM_HS - PM_PCS) / (100.0 - PM_HS)
    FAc = PM_SCS / PM_PCS if PM_PCS != 0 else 0.0
    FAf = PM_TCS / PM_SCS if PM_SCS != 0 else 0.0

    # Distribution modulus
    maa_results = fit_maa_q_single(sieve_sizes, sieve_values)
    q_best = maa_results["q_best"]

    # Modulus of richness
    sieve_4 = sieve_data.get("4", 0.0)
    sieve_0_25 = sieve_data.get("0.25", 0.0)
    sieve_0_063 = sieve_data.get("0.063", 0.0)
    Sa = (0.25 * (100.0 - sieve_4) + 2.3 * (sieve_4 - sieve_0_25) + 12.0 * (sieve_0_25 - sieve_0_063) + 150.0 * sieve_0_063 )
    alpha = (2.65 * (1.02 - (max_density * binder_content) / 100.0)) / ( max_density * 1.02 * (1.0 - binder_content / 100.0))
    MR = round((binder_content / (alpha * (Sa / 100.0) ** (1.0 / 5.0))), 1)

    # Penetration index
    PI = (20.0 * softening + 500.0 * np.log10(penetration) - 1952.0) / ( softening - 50.0 * np.log10(penetration) + 120.0 )

    input_data = {
        "Binder content (%)": binder_content,
        "Air Voids (%)": Va,
        "Voids in Mineral Aggregate (%)": Vma,
        "Penetration (dmm)": penetration,
        "Penetration Index": PI,
        "<0.063 mm": sieve_0_063,
        "<2 mm": sieve_data.get("2", 0.0),
        "<4 mm": sieve_4,
        "CA": CA,
        "FAf": FAf,
        "Distribution Modulus": q_best,
        "Modulus of Richness": MR,
    }

    res = Predict(model=model, config=cfg, preprocessor=preproc, input_dict=input_data)

    MEDIA_ROOT.mkdir(parents=True, exist_ok=True)

    mar_prop_filename = f"marshall_prop_{session_id}.png"
    mar_pred_filename = f"marshall_pred_{session_id}.png"

    mar_prop_path = MEDIA_ROOT / mar_prop_filename
    mar_pred_path = MEDIA_ROOT / mar_pred_filename

    plot_marshall_summary(
        sieve_sizes, sieve_values, binder_content, Va, Vma,
        penetration, PI, MR, max_density, bulk_density, softening,
        res,
        gradation_path=str(mar_prop_path),
        sf_path=str(mar_pred_path),
    )

    ts = int(time())
    mar_prop_url = f"{MEDIA_URL}{mar_prop_filename}?ts={ts}"
    mar_pred_url = f"{MEDIA_URL}{mar_pred_filename}?ts={ts}"

    return {
        "predictions": res,
        "Mar_prop_url": mar_prop_url,
        "Mar_pred_url": mar_pred_url,
    }

