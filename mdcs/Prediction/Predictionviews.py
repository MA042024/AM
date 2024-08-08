import json
from time import time

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie

from .Marshall import predict_marshall_outputs

@require_http_methods(["POST"])
def predict_marshall(request):
    try:
        session_id = request.POST.get('session_id')
        if not session_id:
            return JsonResponse({
                'success': False,
                'error': 'Missing session_id'
            }, status=400)
        max_density = float(request.POST.get('MaximumDensity', 0))
        bulk_density = float(request.POST.get('BulkDensityValue', 0))
        penetration = float(request.POST.get('Penetration', 0))
        softening = float(request.POST.get('Softening', 0))
        binder_content = float(request.POST.get('BinderContent', 0))
        sieve_data = {
            '0.063': float(request.POST.get('sieve_0_063', 0)),
            '0.125': float(request.POST.get('sieve_0_125', 0)),
            '0.25': float(request.POST.get('sieve_0_25', 0)),
            '0.5': float(request.POST.get('sieve_0_5', 0)),
            '1': float(request.POST.get('sieve_1', 0)),
            '2': float(request.POST.get('sieve_2', 0)),
            '4': float(request.POST.get('sieve_4', 0)),
            '5.6': float(request.POST.get('sieve_5_6', 0)),
            '8': float(request.POST.get('sieve_8', 0)),
            '11.2': float(request.POST.get('sieve_11_2', 0)),
            '16': float(request.POST.get('sieve_16', 0)),
            '22.4': float(request.POST.get('sieve_22_4', 0)),
            '31.5': float(request.POST.get('sieve_31_5', 0)),
            '45': float(request.POST.get('sieve_45', 0)),
        }

        out = predict_marshall_outputs(
            max_density=max_density,
            bulk_density=bulk_density,
            penetration=penetration,
            softening=softening,
            binder_content=binder_content,
            sieve_data=sieve_data,
            session_id=session_id,
        )

        return JsonResponse({
            'success': True,
            'message': 'Prediction completed successfully!',
            'predictions': out['predictions'],
            'Mar_prop_url': out['Mar_prop_url'],
            'Mar_pred_url': out['Mar_pred_url'],
        })

    except ValueError as e:
        return JsonResponse({
            'success': False,
            'error': f'Invalid input values: {str(e)}'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


