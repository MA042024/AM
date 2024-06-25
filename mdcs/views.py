import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware

def gensel_view(request):
    return render(request, 'gensel.html')
