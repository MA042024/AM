from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

def gensel_view(request):
    return render(request, 'gensel.html')

@csrf_exempt
@require_POST
def gensel_recieve(request):
    #print("CSRF token received:", request.META.get("HTTP_X_CSRFTOKEN"))  # Debugging line
    #print("Request method:", request.method)  # Debugging line

     print(f"Entire request object:\n{request.__dict__}")  # Print entire request object for debugging
    
    data_id = request.POST.get('data_id')
    data_content = request.POST.get('data_content')

    print(f"data_id in gensel_recieve:{data_id}")
    print(f"data_content in gensel_recieve:{data_content}")
    
    if not data_id or not data_content:
        return JsonResponse({'error': 'Invalid data'}, status=400)

    return JsonResponse({'message': 'Data received successfully', 'data_id': data_id, 'data_content': data_content})
