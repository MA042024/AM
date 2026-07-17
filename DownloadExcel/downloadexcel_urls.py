from django.conf.urls import include
from django.contrib import admin
from django.urls import re_path
from . import downloadexcelviews
from django.conf import settings

from core_main_app.admin import core_admin_site

admin.autodiscover()

urlpatterns = [
    re_path(r"^download-from-workspace/", downloadexcelviews.download_from_workspace, name='download-from-workspace'),
    re_path(r"^download-from-user-data/", downloadexcelviews.download_from_user_data, name='download-from-user-data'),
    re_path(r"^download-status/", downloadexcelviews.download_status, name='download-status'),
    re_path(r"^download-all-data/", downloadexcelviews.download_all_data, name='download-all-data'),
    re_path(r"^download-selected-data/", downloadexcelviews.download_selected_data, name='download-selected-data'),
]
