import pandas as pd
import numpy as np
import math
from io import BytesIO
from pathlib import Path
import uuid
import time
import matplotlib.pyplot as plt
import seaborn as sns
import re
from django.conf import settings
from django.core.cache import cache

def get_sheets_names(file_content):
    excel_file = BytesIO(file_content)
    xls = pd.ExcelFile(excel_file)
    return xls.sheet_names

SAVE_DIR = Path('saved_dfs')
#SAVE_DIR = Path(settings.MEDIA_ROOT) / 'saved_dfs'


def save_dataframe(file_path, sheet_name, start_row, session_id):
    header_rows = list(range(start_row - 1)) if start_row > 1 else 0
    df = pd.read_excel(file_path, sheet_name=sheet_name, header=header_rows)
    SAVE_DIR.mkdir(parents=True, exist_ok=True)
    pickle_path = SAVE_DIR / f'df_{session_id}.pkl'
    df.to_pickle(pickle_path)
    cache.set(f'df_path_{session_id}', str(pickle_path), timeout=3600)
    return pickle_path, df

def get_dataframe(session_id):
    pickle_path = cache.get(f'df_path_{session_id}')
    if pickle_path and Path(pickle_path).exists():
        return pd.read_pickle(pickle_path)
    else:
        return None
        
def cleanup_expired_files(timeout_seconds=3600):
    now = time.time()
    for path in SAVE_DIR.glob("df_*.pkl"):
        if now - path.stat().st_mtime > timeout_seconds:
            try:
                path.unlink()
            except FileNotFoundError:
                pass

def get_column_names(df):
    return list(df.columns)

def get_numeric_column_names(df):
    df_temp = df.copy()
    for col in df_temp.columns:
        df_temp[col] = pd.to_numeric(df_temp[col], errors='ignore')
    return df_temp.select_dtypes(include=[np.number]).columns.tolist()
    
def rename_columns(df, rename_dict):
    df.rename(columns=rename_dict, inplace=True)

def delete_columns(df, column_name):
    df.drop(columns=[column_name], inplace=True)

def basic_statistics_exclude(df, columns, exclude_columns=None):
    if exclude_columns:
        columns = [col for col in columns if col not in exclude_columns]
    stats = df[columns].describe().T
    stats['std'] = df[columns].std()
    stats['CV'] = stats['std'] / stats['mean']
    rounding = {
        'count': 0,
        'mean': 2,
        'std': 2,
        'min': 2,
        '25%': 2,
        '50%': 2,
        '75%': 2,
        'max': 2,
        'CV': 3
    }
    for col, ndigits in rounding.items():
        if col in stats.columns:
            if col == 'count':
                stats[col] = stats[col].astype(float).round(ndigits).astype(int)
            else:
                stats[col] = stats[col].round(ndigits)
    return stats
    
def show_stat(df, columns, non_missing_columns=None):
    if non_missing_columns:
        df1 = df.dropna(subset=non_missing_columns, how='any')
    else: 
        df1 = df
    stats = basic_statistics_exclude(df1, columns, non_missing_columns)
    columns_rename = {
        'count': 'Count',
        'mean': 'Mean',
        'std': 'Std Dev',
        'min': 'Minimum',
        '25%': '1st Quartile',
        '50%': 'Median',
        '75%': '3rd Quartile',
        'max': 'Maximum',
        'CV': 'Coeff. of Variation'
    }
    stats = stats.rename(columns=columns_rename)
    html_stats = stats.to_html(classes='stats-table')
    return html_stats

def plot_histograms(
    df, 
    columns, 
    session_id,
    label_fontsize=14,
    ticks_fontsize=10,
    bar_color='green',
    bar_width=0.8,
    kde_line=False
):
    n_cols = len(columns)
    if n_cols <= 4:
        nrows, ncols = 1, n_cols
    else:
        root = int(math.sqrt(n_cols))
        if root * root == n_cols:
            nrows, ncols = root, root
        elif root * (root + 1) >= n_cols:
            nrows, ncols = root, root + 1
        else:
            nrows, ncols = root + 1, root + 1
    fig = plt.figure(figsize=(5 * ncols, 4 * nrows))
    for i, column in enumerate(columns):
        plt.subplot(nrows, ncols, i + 1)
        sns.histplot(
            df[column],
            kde=kde_line,
            color=bar_color,
            binwidth=None,
            edgecolor='black',
            linewidth=0.5,
            alpha=0.8,
            stat='count',
            element='bars'
        )
        plt.xlabel(column, fontsize=label_fontsize)
        plt.xticks(fontsize=ticks_fontsize)
        plt.yticks(fontsize=ticks_fontsize)
        for patch in plt.gca().patches:
            patch.set_width(bar_width * patch.get_width())
    plt.tight_layout()
    img_path = Path(settings.MEDIA_ROOT) / f'histograms_{session_id}.png'
    plt.savefig(img_path, dpi=300, bbox_inches='tight')
    plt.close(fig)
    return f"/media/histograms_{session_id}.png"

def Correlation_Matrix(
    df,
    selected_ordered_col,
    session_id,
    corr_mthd='pearson',               # Correlation mehtod
    box_padding=0.15,                  # Space between boxes
    corr_fontsize=14,                  # Font size for numbers in upper triangle
    axis_fontsize=16,                  # Font size for axis labels
    hist_color='grey',                 # Histogram Color
    line_color='red',                  # Color of regression line
    scatter_color='green',             # Scatter color in lower triangle
    scatter_alpha=0.7,                 # Alpha for scatter points
    hue_start=220,                     # Start hue
    hue_end=10,                        # End hue
    palette_saturation=99,             # Color Intensity
):
    plt.rcParams['font.family'] = 'DejaVu Sans'
    numerical_cols = df.select_dtypes(include=['float64', 'int64']).columns
    cols = [col for col in selected_ordered_col if col in numerical_cols]
    if len(cols) < 2:
        raise ValueError("Select at least two numeric columns.")
    corr_matrix = df[cols].corr(method=corr_mthd)
    def wrap_text(text, width=15):
        words = re.findall(r'\S+', text)
        lines = []
        current_line = ''
        for word in words:
            while len(word) > width:
                if current_line:
                    lines.append(current_line)
                    current_line = ''
                lines.append(word[:width])
                word = word[width:]
            if len(current_line) + len(word) + (1 if current_line else 0) <= width:
                if current_line:
                    current_line += ' '
                current_line += word
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)
        return '\n'.join(lines)
    n = len(cols)
    fig, axes = plt.subplots(n, n, figsize=(16, 15), gridspec_kw={'wspace': box_padding, 'hspace': box_padding})
    cmap_obj = sns.diverging_palette(hue_start, hue_end, s=palette_saturation, as_cmap=True)
    for i in range(n):
        for j in range(n):
            ax = axes[i, j]
            if i == j:
                ax.hist(df[cols[i]].dropna(), bins=20, color=hist_color)
            else:
                corr_val = corr_matrix.iloc[i, j]
                if np.isnan(corr_val):
                    ax.set_visible(False)
                elif i < j:
                    # Color background using specified colormap
                    ax.set_facecolor(cmap_obj((corr_val + 1) / 2))
                    ax.text(
                        0.5, 0.5, f"{corr_val:.2f}",
                        ha='center', va='center',
                        fontsize=corr_fontsize,
                        transform=ax.transAxes
                    )
                else:
                    x = df[cols[j]]
                    y = df[cols[i]]
                    valid = x.notna() & y.notna()
                    if valid.any():
                        sns.regplot(
                            x=x[valid], y=y[valid], ax=ax,
                            scatter_kws={'s': 10, 'color': scatter_color, 'alpha': scatter_alpha},
                            line_kws={'color': line_color}
                        )
                    ax.set_xlabel('')
                    ax.set_ylabel('')
            ax.tick_params(
                axis='both', which='both',
                bottom=False, top=False, left=False, right=False,
                labelbottom=False, labelleft=False
            )
    wrapped_cols = [wrap_text(col, 15) for col in cols]
    for i, label in enumerate(wrapped_cols):
        axes[i, 0].set_ylabel(label, rotation=0, ha='right', va='center', fontsize=axis_fontsize, labelpad=40)
    for j, label in enumerate(wrapped_cols):
        axes[-1, j].set_xlabel(label, fontsize=axis_fontsize, labelpad=20, rotation=90, ha='center', va='top')
    fig.text(
        0.5, -0.1,
        'Figures on the diagonal: histogram distributions;'
        '    Upper Triangle: Colored correlation values ranging from -1 to 1;'
        '\n Lower Triangle: Scatter plots with regression line',
        ha='center', fontsize=axis_fontsize, fontstyle='italic'
    )
    img_path = Path(settings.MEDIA_ROOT) / f'correlation_{session_id}.png'
    plt.savefig(img_path, dpi=300, bbox_inches='tight')
    plt.close(fig)
    return f"/media/correlation_{session_id}.png"

def Single_Plot(
    df, x, y,
    session_id,
    color='blue',
    marker='o',
    title=None,
    xlabel=None,
    ylabel=None,
    title_fontsize=14,
    label_fontsize=12,
    tick_fontsize=12,
    xmin=None, xmax=None, ymin=None, ymax=None,
    figsize=(8, 6),
    add_corr_title=True,
    corr_type='pearson',          # 'pearson' or 'spearman'
    show_trendline=False,
    trendline_color='red',
    trendline_style='-',
    trendline_width=2,
    show_ci=True,
):
    plt.figure(figsize=figsize)
    ax = sns.scatterplot(data=df, x=x, y=y, color=color, marker=marker)
    if show_trendline:
        sns.regplot(
            data=df, x=x, y=y,
            scatter=False,
            ax=ax,
            color=trendline_color,
            line_kws={'linestyle': trendline_style, 'linewidth': trendline_width},
            ci=95 if show_ci else None
        )
    plt.xlabel(xlabel or x, fontsize=label_fontsize)
    plt.ylabel(ylabel or y, fontsize=label_fontsize)
    if xmin is not None or xmax is not None:
        plt.xlim(left=xmin, right=xmax)
    if ymin is not None or ymax is not None:
        plt.ylim(bottom=ymin, top=ymax)
    corr_coef = df[x].corr(df[y], method=corr_type)
    if add_corr_title:
        corr_label = corr_type.capitalize()
        plot_title = f'{title or ""} ({corr_label} Correlation: {corr_coef:.2f})' if title else f'{corr_label} Correlation: {corr_coef:.2f}'
        plt.title(plot_title, fontsize=title_fontsize)
    elif title:
        plt.title(title, fontsize=title_fontsize)
    plt.xticks(fontsize=tick_fontsize)
    plt.yticks(fontsize=tick_fontsize)
    plt.tight_layout()
    img_path = Path(settings.MEDIA_ROOT) / f'singleplot_{session_id}.png'
    plt.savefig(img_path, dpi=300, bbox_inches='tight')
    plt.close()
    return f'/media/singleplot_{session_id}.png'
