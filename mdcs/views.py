import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required

@login_required
def gvform_view(request):
    return render(request, 'gvform.html')

@login_required
def gvform_edit(request):
    
    edit_record_data = request.session.get('edit_record_data')

    if not edit_record_data:
        return HttpResponseBadRequest("No data found in session.")
    
    context = {
        'data_id_edit': edit_record_data.get('data_id'),
        'data_content_edit': edit_record_data.get('data_content'),
        'data_title_edit': edit_record_data.get('data_title'),
        'test_id_edit': edit_record_data.get('test_id'),
        'edit': edit_record_data.get('edit'),
    }
    
    return render(request, 'gvform.html', context)

def vis_view(request):
    return render(request, 'visualization.html')

#@login_required
@ensure_csrf_cookie 
def ml_prediction_view(request):
    return render(request, 'prediction.html')

def tutorial_view(request):
    return render(request, 'tutorial.html')

@login_required
def bulk_upload_view(request):
    return render(request, 'bulkupload.html')

@login_required
def bulk_upload_workspaces(request):
    """Workspaces the current user may assign records to. Only write access
    counts here: a read-only workspace would reject the assignment on save."""
    from core_main_app.components.workspace import api as workspace_api

    owned = list(workspace_api.get_all_by_owner(request.user))
    writable = list(workspace_api.get_all_workspaces_with_write_access_by_user(request.user))
    merged = owned + [ws for ws in writable if ws not in owned]
    return JsonResponse({'workspaces': [
        {'id': str(ws.id), 'title': ws.title, 'is_public': ws.is_public} for ws in merged
    ]})

@login_required
@require_POST
def bulk_upload_assign_workspace(request):
    """Move records saved by the bulk upload page into a workspace. Kept here
    rather than in the curate save endpoint so the assignment lives in this
    repository."""
    from core_main_app.components.data import api as data_api
    from core_main_app.components.workspace import api as workspace_api

    workspace_id = request.POST.get('workspace_id')
    data_ids = request.POST.getlist('data_ids[]') or request.POST.getlist('data_ids')
    if not workspace_id or not data_ids:
        return JsonResponse({'error': 'Missing workspace or records.'}, status=400)

    try:
        workspace = workspace_api.get_by_id(workspace_id)
    except Exception:
        return JsonResponse({'error': 'Unknown workspace.'}, status=400)

    if not workspace_api.can_user_write_workspace(workspace, request.user):
        return JsonResponse({'error': 'No write access to this workspace.'}, status=403)

    assigned, failed = 0, []
    for data_id in data_ids:
        try:
            data_api.assign(data_api.get_by_id(data_id, request.user), workspace, request.user)
            assigned += 1
        except Exception as exception:
            failed.append({'id': data_id, 'error': str(exception)})

    return JsonResponse({'assigned': assigned, 'failed': failed, 'workspace': workspace.title})
