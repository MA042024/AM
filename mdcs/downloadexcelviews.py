from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from . import downloadexcel_codes as dc
from core_main_app.components.data.models import Data
from core_main_app.settings import (DATA_SORTING_FIELDS)
from core_main_app.rest.data.serializers import (DataSerializer)

import os
import json
from django.conf import settings
from .tasks import generate_excel_file
from celery.result import AsyncResult

def launch_excel_export(export_type, object_id, xml_list):
    task = generate_excel_file.delay(export_type, object_id, xml_list)
    return task.id

@login_required
def download_status(request):
    task_id = request.GET.get('task_id')
    if not task_id:
        return JsonResponse({'error': 'Missing task_id'}, status=400)
        
    result = AsyncResult(task_id)
    if result.state == 'SUCCESS':
        filename = result.result
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        if os.path.exists(file_path):
            download_url = settings.MEDIA_URL + filename
            return JsonResponse({'ready': True, 'download_url': download_url})
        else:
            return JsonResponse({'ready': False, 'error': 'File not found'})
    elif result.state == 'FAILURE':
        return JsonResponse({'ready': False, 'state': 'FAILURE', 'error': str(result.result)})
    else:
        return JsonResponse({'ready': False, 'state': result.state})

def download_from_workspace(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST requests allowed.')
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON.')

    workspace_id = data.get('workspace_id')
    if not workspace_id:
        return JsonResponse({'error': 'Invalid or missing Workspace ID.'}, status=400)
    try:
        dt_titles=Data.get_all_by_workspace(workspace_id, order_by_field=DATA_SORTING_FIELDS)
        serializer = DataSerializer(dt_titles, many=True, context={'request': request})
        dt = serializer.data
        xml_list = [item.get('xml_content') for item in dt]
        
        task_id = launch_excel_export('workspace', workspace_id, xml_list)
        return JsonResponse({'task_id': task_id}, status=202)
        
    except IOError as e:
        return JsonResponse({'error': f'File error: {str(e)}'}, status=500)

def download_from_user_data(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST requests allowed.')
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON.')

    user_id = data.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'Invalid or missing User ID.'}, status=400)
    try:
        dt_titles=Data.get_all_by_user_id(user_id, order_by_field=DATA_SORTING_FIELDS)
        serializer = DataSerializer(dt_titles, many=True, context={'request': request})
        dt = serializer.data
        xml_list = [item.get('xml_content') for item in dt]
        
        task_id = launch_excel_export('user', user_id, xml_list)
        return JsonResponse({'task_id': task_id}, status=202)
        
    except IOError as e:
        return JsonResponse({'error': f'File error: {str(e)}'}, status=500)

def download_all_data(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST requests allowed.')
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON.')

    query_id = data.get('query_id')
    if not query_id:
        return JsonResponse({'error': 'Invalid or missing Query ID.'}, status=400)
    try:
        dt_titles=Data.execute_query(query_id, order_by_field=DATA_SORTING_FIELDS)
        serializer = DataSerializer(dt_titles, many=True, context={'request': request})
        dt = serializer.data
        xml_list = [item.get('xml_content') for item in dt]
        
        task_id = launch_excel_export('query_id', query_id, xml_list)
        return JsonResponse({'task_id': task_id}, status=202)
        
    except IOError as e:
        return JsonResponse({'error': f'File error: {str(e)}'}, status=500)
