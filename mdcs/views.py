import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.middleware.csrf import CsrfViewMiddleware

def gensel_view(request):
    return render(request, 'gensel.html')

@csrf_protect
@require_POST
def gensel_recieve(request):
    csrf_middleware = CsrfViewMiddleware()
    
    # Print CSRF token received in the request headers
    csrf_token = request.META.get('HTTP_X_CSRFTOKEN')
    print(f"CSRF token received: {csrf_token}")
    
    # Verify CSRF token
    if not csrf_middleware.process_view(request, None, gensel_recieve, (), {}):
        return JsonResponse({'error': 'CSRF verification failed.'}, status=403)
    
    # Proceed with processing the request
    try:
        data = json.loads(request.body.decode('utf-8'))
        data_id = data.get('data_id')
        data_content = data.get('data_content')
        
        print(f"data_id in gensel_recieve: {data_id}")
        print(f"data_content in gensel_recieve: {data_content}")
        
        if not data_id or not data_content:
            return JsonResponse({'error': 'Invalid data'}, status=400)
        
        # Process the received data
        
        return JsonResponse({'message': 'Data received successfully', 'data_id': data_id, 'data_content': data_content})
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
