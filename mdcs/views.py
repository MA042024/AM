from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect

def gensel_view(request):
    return render(request, 'gensel.html')

@csrf_protect
@require_POST
def gensel_recieve(request):
    data_id = request.POST.get('data_id')
    data_content = request.POST.get('data_content')

    # Process the received data as needed
    # For example, you might save it to the database or perform some action

    # Return a response
    return JsonResponse({'message': 'Data received successfully', 'data_id': data_id, 'data_content': data_content})
