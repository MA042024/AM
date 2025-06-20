import json
import uuid
from pathlib import Path
from time import time

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from . import tools_codes as tc

def sheets_names(request):
    if request.method == 'POST' and request.FILES.get('excelFile'):
        excel_file = request.FILES['excelFile']
        file_id = str(uuid.uuid4())
        save_path = Path('uploaded_excels') / f'{file_id}_{excel_file.name}'
        save_path.parent.mkdir(parents=True, exist_ok=True)
        with open(save_path, 'wb') as f:
            for chunk in excel_file.chunks():
                f.write(chunk)
        with open(save_path, 'rb') as f:
            file_bytes = f.read()
        sheets = tc.get_sheets_names(file_bytes)
        return JsonResponse({'sheets': sheets, 'file_path': str(save_path)})
    return JsonResponse({'error': 'No file uploaded'}, status=400)

def deploy_df(request):
    if request.method == 'POST':
        file_path = request.POST.get('file_path')
        sheet_name = request.POST.get('sheet_name')
        start_row = int(request.POST.get('start_row'))
        session_id = request.POST.get('session_id')
        if not (file_path and sheet_name and session_id):
            return JsonResponse({'error': 'Missing parameters'}, status=400)
        try:
            pickle_path, df = tc.save_dataframe(file_path, sheet_name, start_row, session_id)
            if df.empty:
                return JsonResponse({'error': 'DataFrame is empty'}, status=400)
            return JsonResponse({'success': True, 'pickle_path': str(pickle_path)})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def get_columns(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    df = tc.get_dataframe(session_id)
    if df is not None:
        columns = tc.get_numeric_column_names(df)
        return JsonResponse({'columns': columns})
    else:
        return JsonResponse({'columns': []})

def show_stat_table(request):
    if request.method == "POST":
        data = json.loads(request.body)
        session_id = data.get('session_id')
        columns = data.get('columns', [])
        filter_columns = data.get('filter_columns', [])
        if not session_id or not columns:
            return JsonResponse({'error': 'Session or columns missing.'}, status=400)
        df = tc.get_dataframe(session_id)
        if df is None:
            return JsonResponse({'error': 'No DataFrame found for this session.'}, status=400)
        try:
            html_stats = tc.show_stat(df, columns, filter_columns)
            return JsonResponse({'html_stats': html_stats})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

def show_histograms(request):
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        columns = data.get('columns')
        if not session_id or not columns:
            return JsonResponse({'error': 'Session or columns missing.'}, status=400)
        label_fontsize = int(data.get("label_fontsize", 14))
        ticks_fontsize = int(data.get("ticks_fontsize", 10))
        bar_color = data.get("bar_color", "green")
        bar_width = float(data.get("bar_width", 0.8))
        kde_line = bool(data.get("kde_line", False))
        df = tc.get_dataframe(session_id)
        if df is None:
            return JsonResponse({'error': 'No DataFrame found for this session.'}, status=400)
        img_url = tc.plot_histograms(
            df,
            columns=columns,
            session_id=session_id,
            label_fontsize=label_fontsize,
            ticks_fontsize=ticks_fontsize,
            bar_color=bar_color,
            bar_width=bar_width,
            kde_line=kde_line
        )
        img_url = f"{img_url}?ts={int(time())}"
        return JsonResponse({'img_url': img_url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
        
@csrf_exempt
@require_POST
def get_all_columns(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    df = tc.get_dataframe(session_id)
    columns = tc.get_column_names(df) if df is not None else []
    return JsonResponse({'columns': columns})

def rename_column(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    old_name = data.get('old_name')
    new_name = data.get('new_name')
    if not session_id or not old_name or not new_name:
        return JsonResponse({'error': 'Missing data'}, status=400)
    df = tc.get_dataframe(session_id)
    if df is None or old_name not in df.columns:
        return JsonResponse({'error': 'Invalid column/session'}, status=400)
    try:
        tc.rename_columns(df, {old_name: new_name})
        pickle_path = Path('saved_dfs') / f'df_{session_id}.pkl'
        df.to_pickle(pickle_path)
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def delete_column(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    column_name = data.get('column_name')
    if not session_id or not column_name:
        return JsonResponse({'error': 'Missing data'}, status=400)
    df = tc.get_dataframe(session_id)
    if df is None or column_name not in df.columns:
        return JsonResponse({'error': 'Invalid column/session'}, status=400)
    try:
        tc.delete_columns(df, column_name)
        pickle_path = Path('saved_dfs') / f'df_{session_id}.pkl'
        df.to_pickle(pickle_path)
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def show_correlation(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    columns = data.get('columns')
    df = tc.get_dataframe(session_id)
    if df is None or not columns:
        return JsonResponse({'error': 'No DataFrame or columns.'}, status=400)
    try:
        tc.Correlation_Matrix(df, columns, session_id)
        img_url = f"/media/correlation_{session_id}.png?ts={int(time())}"
        return JsonResponse({'img_url': img_url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def show_correlation(request):
    data = json.loads(request.body)
    session_id = data.get('session_id')
    columns = data.get('columns')
    if not session_id or not columns:
        return JsonResponse({'error': 'No session or columns provided.'}, status=400)
    df = tc.get_dataframe(session_id)
    if df is None:
        return JsonResponse({'error': 'DataFrame not found for the session.'}, status=404)
    try:    
        tc.Correlation_Matrix(
            df=df,
            selected_ordered_col=columns,
            session_id=session_id,
            corr_mthd = data.get('corr_method'),
            box_padding=float(data.get('box_padding')),
            corr_fontsize=int(data.get('corr_fontsize')),
            axis_fontsize=int(data.get('axis_fontsize')),
            hist_color=data.get('hist_color'),
            line_color=data.get('line_color'),
            scatter_color=data.get('scatter_color'),
            scatter_alpha=float(data.get('scatter_alpha')),
            hue_start=int(data.get('hue_start')),
            hue_end=int(data.get('hue_end')),
            palette_saturation=int(data.get('palette_saturation'))
        )
        img_url = f"/media/correlation_{session_id}.png?ts={int(time())}"
        return JsonResponse({'img_url': img_url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def single_plot(request):
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    session_id = data.get('session_id')
    x = data.get('x')
    y = data.get('y')
    if not (session_id and x and y):
        return JsonResponse({'error': 'Missing required parameters (session_id, x, y).'}, status=400)
    df = tc.get_dataframe(session_id)
    if df is None:
        return JsonResponse({'error': 'No DataFrame found for this session.'}, status=404)
    opt_keys = [
        'color', 'marker', 'title', 'xlabel', 'ylabel',
        'title_fontsize', 'label_fontsize', 'tick_fontsize',
        'xmin', 'xmax', 'ymin', 'ymax', 'figsize',
        'add_corr_title', 'corr_type', 'show_trendline',
        'trendline_color', 'trendline_style', 'trendline_width', 'show_ci'
    ]
    opts = {}
    for k in opt_keys:
        v = data.get(k)
        if v is not None:
            opts[k] = v
    if 'figsize' in opts:
        try:
            if isinstance(opts['figsize'], list) and len(opts['figsize']) == 2:
                opts['figsize'] = (float(opts['figsize'][0]), float(opts['figsize'][1]))
            elif isinstance(opts['figsize'], str):
                parts = [float(x) for x in opts['figsize'].replace('(', '').replace(')', '').split(',')]
                if len(parts) == 2:
                    opts['figsize'] = tuple(parts)
        except Exception:
            opts['figsize'] = (8, 6)
    try:
        img_url = tc.Single_Plot(
            df, x, y, session_id=session_id, **opts
        )
        img_url = f"{img_url}?ts={int(time())}"
        return JsonResponse({'img_url': img_url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ---------------------------------------------------------------------------
# Live Insights
# ---------------------------------------------------------------------------
from . import live_insights_service as li
from .live_insights_fields import TEST_LABELS


@login_required
def live_insights_workspaces(request):
    return JsonResponse({'workspaces': li.get_accessible_workspaces(request.user)})


def _parse_workspace_ids(request):
    # workspace_id may carry multiple comma-separated ids (multi-workspace
    # scope), e.g. "?workspace_id=3,7,12".
    raw = request.GET.get('workspace_id', '')
    return [w for w in raw.split(',') if w]


def _parse_mix_types(request):
    raw = request.GET.get('mix_type', '')
    return [m for m in raw.split(',') if m]


def _parse_years(request):
    raw = request.GET.get('year', '')
    return [y for y in raw.split(',') if y]


def _parse_binder_grades(request):
    raw = request.GET.get('binder_grade', '')
    return [b for b in raw.split(',') if b]


def _workspace_scope_denied(request, scope):
    # Workspace scope is per-user data; anonymous visitors get 'all' only.
    if scope == 'workspace' and not request.user.is_authenticated:
        return JsonResponse({'error': 'Sign in to filter by workspace.'}, status=403)
    return None


def live_insights_mix_types(request):
    if not request.user.is_authenticated:
        return JsonResponse({'mix_types': []})
    workspace_ids = _parse_workspace_ids(request)
    return JsonResponse({
        'mix_types': li.get_workspace_mix_types(workspace_ids, request.user)
    })


def live_insights_years(request):
    if not request.user.is_authenticated:
        return JsonResponse({'years': []})
    workspace_ids = _parse_workspace_ids(request)
    return JsonResponse({
        'years': li.get_workspace_years(workspace_ids, request.user)
    })


def live_insights_binder_grades(request):
    if not request.user.is_authenticated:
        return JsonResponse({'binder_grades': []})
    workspace_ids = _parse_workspace_ids(request)
    return JsonResponse({
        'binder_grades': li.get_workspace_binder_grades(workspace_ids, request.user)
    })


def live_insights_overview(request):
    scope = request.GET.get('scope', 'all')
    workspace_ids = _parse_workspace_ids(request)
    mix_types = _parse_mix_types(request)
    years = _parse_years(request)
    binder_grades = _parse_binder_grades(request)
    denied = _workspace_scope_denied(request, scope)
    if denied:
        return denied
    try:
        return JsonResponse(li.get_overview(scope, workspace_ids, request.user, mix_types, years, binder_grades))
    except li.LiveInsightsError as e:
        return JsonResponse({'error': str(e)}, status=400)


def live_insights_test_detail(request, test_key):
    scope = request.GET.get('scope', 'all')
    workspace_ids = _parse_workspace_ids(request)
    mix_types = _parse_mix_types(request)
    years = _parse_years(request)
    binder_grades = _parse_binder_grades(request)
    denied = _workspace_scope_denied(request, scope)
    if denied:
        return denied
    try:
        return JsonResponse(li.get_test_detail(test_key, scope, workspace_ids, request.user, mix_types, years, binder_grades))
    except li.LiveInsightsError as e:
        status = 403 if 'access' in str(e).lower() else 400
        return JsonResponse({'error': str(e)}, status=status)


def live_insights_tests(request):
    return JsonResponse({'tests': [{'key': k, 'label': v} for k, v in TEST_LABELS.items()]})


def live_insights_correlation_pair(request, test_key, field_a, field_b):
    scope = request.GET.get('scope', 'all')
    workspace_ids = _parse_workspace_ids(request)
    mix_types = _parse_mix_types(request)
    years = _parse_years(request)
    binder_grades = _parse_binder_grades(request)
    denied = _workspace_scope_denied(request, scope)
    if denied:
        return denied
    try:
        return JsonResponse(li.get_correlation_pair(test_key, field_a, field_b, scope, workspace_ids, request.user, mix_types, years, binder_grades))
    except li.LiveInsightsError as e:
        status = 403 if 'access' in str(e).lower() else 400
        return JsonResponse({'error': str(e)}, status=status)
