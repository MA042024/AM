import __main__
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
from matplotlib.ticker import FixedLocator, StrMethodFormatter

BASE_DIR = Path(__file__).resolve().parent
MEDIA_ROOT = Path(getattr(settings, "MEDIA_ROOT", "media"))
MEDIA_URL = getattr(settings, "MEDIA_URL", "/media/")

@dataclass
class ANNConfig:
    data_cols: List[str]
    y_col: str
    catg_cols: List[str] = field(default_factory=list)
    batch_size: int = 128
    lr: float = 7e-4
    epochs: int = 10000
    patience: int = 1000
    split_seed: int = 42
    train_seed: int = 0
    hidden: int = 128
    layers: int = 3
    dropout: float = 0.0
    weight_decay: float = 0.0
    grad_clip: Optional[float] = 1.0
    target_scale: float = 1.0
    k_folds: int = 5
    test_frac: float = 0.10
    shuffle_dev: bool = True
    num_workers: int = 0
    loss_mode: str = "wmse"
    weight_power: float = 2.0
    lambda_w: float = 0.2
    sigma_min: float = 0.008
    sigma_max: float = 0.023
    eps_sigma: float = 1e-8
    learn_sigma_scale: bool = False
    early_stop_metric: str = "rmse"
    early_stop_min_delta: float = 1e-8

class Preprocessor:
    def __init__(self, cfg: ANNConfig):
        self.cfg = cfg
        self.feature_names: List[str] = []
        self.x_mean: Optional[np.ndarray] = None
        self.x_std: Optional[np.ndarray] = None
        self.cat_levels: Dict[str, List[str]] = {}

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
        X_df = self._build_design(df_any)
        X = X_df.values.astype(np.float32)
        Xn = (X - self.x_mean) / self.x_std
        y = df_any[self.cfg.y_col].astype(np.float32).values / getattr(self.cfg, 'target_scale', 1.0)
        y = y.reshape(-1, 1).astype(np.float32)
        sigma = np.ones_like(y)
        y_pack = np.concatenate([y, sigma], axis=1).astype(np.float32)
        return Xn, y_pack

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
            if dropout > 0:
                mods += [nn.Dropout(dropout)]
            d = hidden
        self.backbone = nn.Sequential(*mods)
        self.head = nn.Linear(d, 1)
        nn.init.xavier_uniform_(self.head.weight)
        nn.init.zeros_(self.head.bias)

    def forward(self, x):
        h = self.backbone(x)
        y_pred = F.softplus(self.head(h)) + 1e-6
        y_pred = torch.clamp(y_pred, 0.0, 10000)
        return y_pred.squeeze(-1)

class ANNModel(nn.Module):
    def __init__(self, in_dim: int, hidden: int, layers: int, dropout: float, learn_sigma_scale: bool):
        super().__init__()
        self.nn = MLP(in_dim, hidden, layers, dropout)
        self.learn_sigma_scale = bool(learn_sigma_scale)
        if self.learn_sigma_scale:
            self.log_alpha = nn.Parameter(torch.tensor(0.0))
        else:
            self.register_buffer("log_alpha", torch.tensor(0.0), persistent=False)

    def forward(self, x):
        return self.nn(x)

    def alpha(self):
        return torch.exp(self.log_alpha)

# The checkpoint pickles its Preprocessor/ANNConfig instances as `__main__` objects
# (they were defined in the training notebook's top-level scope), so they must be
# resolvable under `__main__` here too for torch.load to unpickle them.
__main__.ANNConfig = ANNConfig
__main__.Preprocessor = Preprocessor

def load_UWNN_model(path):
    checkpoint = torch.load(path, map_location="cpu", weights_only=False)
    loaded_model = ANNModel(
        in_dim=checkpoint['in_dim'],
        hidden=checkpoint['hidden'],
        layers=checkpoint['layers'],
        dropout=checkpoint['dropout'],
        learn_sigma_scale=checkpoint['learn_sigma_scale']
    )
    loaded_model.load_state_dict(checkpoint['model_state_dict'])
    loaded_model.eval()
    preproc = checkpoint['preprocessor']
    return loaded_model, preproc

def PredictVolumetricProperties(model, preprocessor, input_dict):
    df_input = pd.DataFrame([input_dict])
    y_col = preprocessor.cfg.y_col
    df_input[y_col] = 0.0
    X_norm, _ = preprocessor.transform(df_input)
    X_tensor = torch.from_numpy(X_norm).float()

    with torch.no_grad():
        y_pred_scaled = model(X_tensor).numpy()[0]
    target_scale = getattr(preprocessor.cfg, 'target_scale', 1.0)
    y_pred = y_pred_scaled * target_scale

    p11 = float(input_dict['<11.2 mm'])
    gmm = float(input_dict['Maximum Density (Mg/m3)'])
    if p11 <= 1.5:
        A = (1.0 - p11) * 100.0
        p_lt_11_2 = p11 * 100.0
    else:
        A = (100.0 - p11)
        p_lt_11_2 = p11
    sigma_raw = (8.0 + 0.2 * A) * 1e-3
    sigma_raw = max(sigma_raw, 1e-6)
    alpha = model.alpha().item() if model.learn_sigma_scale else 1.0
    sigma_used_bd = max(sigma_raw * alpha, 1e-6)

    air_voids_pred = 100.0 * (1.0 - (y_pred / gmm))
    p_gt_11_2 = 100.0 - p_lt_11_2
    sigma_av = (0.8 / gmm) + 0.02 * (p_gt_11_2 / gmm)

    z_val = 2.77
    R_margin_bd = z_val * sigma_used_bd
    R_margin_av = z_val * sigma_av
    return {
        "bd_pred": y_pred,
        "bd_sigma": sigma_used_bd,
        "bd_sigma_minus": y_pred - sigma_used_bd,
        "bd_sigma_plus": y_pred + sigma_used_bd,
        "bd_R_margin": R_margin_bd,
        "bd_R_minus": y_pred - R_margin_bd,
        "bd_R_plus": y_pred + R_margin_bd,
        "av_pred": air_voids_pred,
        "av_sigma": sigma_av,
        "av_sigma_minus": air_voids_pred - sigma_av,
        "av_sigma_plus": air_voids_pred + sigma_av,
        "av_R_margin": R_margin_av,
        "av_R_minus": air_voids_pred - R_margin_av,
        "av_R_plus": air_voids_pred + R_margin_av,
    }

def plot_volumetric_summary(
    sieve_sizes, sieve_values,
    rap_content, binder_content, max_density,
    gradation_path,
    dpi_gradation=200,
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
        f"RAP content (%):         {rap_content:.0f}",
        "",
        f"Binder content (%):      {binder_content:.2f}",
        "",
        f"Maximum Density (Mg/m³): {max_density:.3f}",
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

# ---------- #
# Load model #
# ---------- #

MODEL_PATH = BASE_DIR / "UWNN_model.pth"
model, preproc = load_UWNN_model(MODEL_PATH)

# ------- #
# Predict #
# ------- #

def predict_volumetric_outputs(
    rap_content: float,
    binder_content: float,
    max_density: float,
    sieve_data: Dict[str, float],
    session_id: str,
) -> Dict[str, Any]:

    sieve_sizes = [0.063, 0.5, 1.0, 2.0, 4.0, 8.0, 11.2, 22.4]
    sieve_values = [
        float(sieve_data.get('0.063', 0.0)),
        float(sieve_data.get('0.5', 0.0)),
        float(sieve_data.get('1', 0.0)),
        float(sieve_data.get('2', 0.0)),
        float(sieve_data.get('4', 0.0)),
        float(sieve_data.get('8', 0.0)),
        float(sieve_data.get('11.2', 0.0)),
        float(sieve_data.get('22.4', 0.0)),
    ]

    input_data = {
        'RAP content (%)': rap_content,
        'Binder content (%)': binder_content,
        'Maximum Density (Mg/m3)': max_density,
        '<0.063 mm': sieve_values[0],
        '<0.5 mm': sieve_values[1],
        '<1 mm': sieve_values[2],
        '<2 mm': sieve_values[3],
        '<4 mm': sieve_values[4],
        '<8 mm': sieve_values[5],
        '<11.2 mm': sieve_values[6],
        '<22.4 mm': sieve_values[7],
    }

    res = PredictVolumetricProperties(model, preproc, input_data)

    MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
    vol_prop_filename = f"volumetric_prop_{session_id}.png"
    vol_prop_path = MEDIA_ROOT / vol_prop_filename

    plot_volumetric_summary(
        sieve_sizes, sieve_values,
        rap_content, binder_content, max_density,
        gradation_path=str(vol_prop_path),
    )

    ts = int(time())
    vol_prop_url = f"{MEDIA_URL}{vol_prop_filename}?ts={ts}"

    return {
        "predictions": res,
        "mixture": {
            "rap_content": rap_content,
            "binder_content": binder_content,
            "max_density": max_density,
        },
        "Vol_prop_url": vol_prop_url,
    }
