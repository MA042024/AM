from django.shortcuts import render

def new_tab_view(request):
    return render(request, 'gensel.html')

