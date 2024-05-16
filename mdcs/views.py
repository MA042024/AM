import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth.decorators import login_required

@login_required
def gensel_view(request):
    return render(request, 'gensel.html')

def gensel_edit(request):
    
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
    
    return render(request, 'gensel.html', context)    

@login_required
def ml_prediction_view(request):
    return render(request, 'ml_external.html')
    #return HttpResponseRedirect('https://www.ml.asphaltmine.org')

@login_required
def tutorial_view(request):
    return render(request, 'tutorial.html')

@login_required
def exa_view(request):
    return render(request, 'Exa.html')
