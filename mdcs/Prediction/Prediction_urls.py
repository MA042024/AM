from django.conf.urls import include
from django.contrib import admin
from django.urls import re_path
from . import Predictionviews
from django.conf import settings
from django.conf.urls.static import static

from core_main_app.admin import core_admin_site

admin.autodiscover()

urlpatterns = [
  re_path(r"^Predict/Marshall/", Predictionviews.predict_marshall, name='predict_marshall'),
]

#if settings.DEBUG:
#  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
