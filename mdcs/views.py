import json

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware

def gensel_view(request):
    return render(request, 'gensel.html')

@csrf_exempt
def gensel_show(request):
    data_id = request.session.get('data_id')
    data_content = request.session.get('data_content')

    print(f"I got: {data_id}")
    
    context = {
        'data_id': data_id,
        'data_content': data_content,
    }
    
    return render(request, 'gensel.html', context)
