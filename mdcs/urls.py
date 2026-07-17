"""mdcs URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  re_path(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  re_path(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  re_path(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.contrib import admin
from django.urls import re_path
from . import views

from core_main_app.admin import core_admin_site

admin.autodiscover()

urlpatterns = [
    re_path(r"^admin/", admin.site.urls),
    re_path(r"^core-admin/", core_admin_site.urls),
    re_path(r"^admin/defender/", include("defender.urls")),
    re_path(r"^captcha/", include("captcha.urls")),
    re_path(
        r"^o/", include("oauth2_provider.urls", namespace="oauth2_provider")
    ),
    re_path(r"^$", views.gvform_view, name="core_main_app_homepage"),
    re_path(r"^", include("core_main_app.urls")),
    re_path(r"^gvform$", views.gvform_view, name='gvform'),
    re_path(r"^gvform/edit", views.gvform_edit, name='gvform_edit'),
    re_path(r"^bulkupload/workspaces/", views.bulk_upload_workspaces, name='bulk_upload_workspaces'),
    re_path(r"^bulkupload/assign-workspace/", views.bulk_upload_assign_workspace, name='bulk_upload_assign_workspace'),
    re_path(r"^bulkupload", views.bulk_upload_view, name='bulk_upload'),
    re_path(r"^visualization/", views.vis_view, name='visualization'),
    re_path(r"^prediction/", views.ml_prediction_view, name='machine_learning_prediction'),
    re_path(r"^", include('Visualization.tools_urls')),
    re_path(r"^", include('DownloadExcel.downloadexcel_urls')),
    re_path(r"^", include('Prediction.Prediction_urls')),
    re_path(r"^tutorial/", views.tutorial_view, name='tutorial'),
    re_path(r"^", include("core_website_app.urls")),
    re_path(r"^curate/", include("core_curate_app.urls")),
    re_path(r"^composer/", include("core_composer_app.urls")),
    re_path(r"^parser/", include("core_parser_app.urls")),
    re_path(r"^exporter/", include("core_exporters_app.urls")),
    re_path(r"^explore/common/", include("core_explore_common_app.urls")),
    re_path(r"^explore/example/", include("core_explore_example_app.urls")),
    re_path(
        r"^explore/federated/search/",
        include("core_explore_federated_search_app.urls"),
    ),
    re_path(r"^federated/search/", include("core_federated_search_app.urls")),
    re_path(r"^explore/keyword/", include("core_explore_keyword_app.urls")),
    re_path(r"^dashboard/", include("core_dashboard_app.urls")),
    re_path(r"^file-preview/", include("core_file_preview_app.urls")),
    re_path(r"^", include("core_module_blob_host_app.urls")),
    re_path(r"^", include("core_module_remote_blob_host_app.urls")),
    re_path(r"^", include("core_module_advanced_blob_host_app.urls")),
    re_path(r"^", include("core_module_excel_uploader_app.urls")),
    re_path(r"^", include("core_module_text_area_app.urls")),
    re_path(r"^pid/", include("core_linked_records_app.urls")),
]
