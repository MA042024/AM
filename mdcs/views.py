import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware

def gensel_view(request):
    return render(request, 'gensel.html')

def gensel_edit(request):
    
    edit_record_data = request.session.get('edit_record_data')

    if not edit_record_data:
        return HttpResponseBadRequest("No data found in session.")
    
    print(f"IDDD:{ edit_record_data.get('data_id')}")
    print(f"Contt:{edit_record_data.get('data_content')}")
    print(f"Titttt:{edit_record_data.get('data_title')}")
    
    context = {
        'data_id_edit': edit_record_data.get('data_id'),
        'data_content_edit': edit_record_data.get('data_content'),
        'data_title_edit': edit_record_data.get('data_title'),
        'edit': edit_record_data.get('edit'),
    }
    
    return render(request, 'gensel.html', context)
