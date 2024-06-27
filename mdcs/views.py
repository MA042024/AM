import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware

def gensel_view(request):
    return render(request, 'gensel.html')

def gensel_edit(request):
    data_id = request.session.get('data_id')
    data_content = request.session.get('data_content')
    data_title = request.session.get('data_title')

    return render(request, 'gensel.html', {
        'data_id': data_id,
        'data_content': data_content,
        'data_title': data_title,
    })
