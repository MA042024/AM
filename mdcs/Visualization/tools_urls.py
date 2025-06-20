from django.conf.urls import include
from django.contrib import admin
from django.urls import re_path
from . import toolsviews
from django.conf import settings
from django.conf.urls.static import static

from core_main_app.admin import core_admin_site

admin.autodiscover()

urlpatterns = [
  # Data Analysis tab disabled — routes closed while the page is public
  # re_path(r"^visu/get_excel_sheets/", toolsviews.sheets_names, name='sheets_names'),
  # re_path(r"^visu/deploy_df/", toolsviews.deploy_df, name='deploy_df'),
  # re_path(r"^visu/get_columns/", toolsviews.get_columns, name='get_columns'),
  # re_path(r"^visu/show_stat_table/", toolsviews.show_stat_table, name='show_stat_table'),
  # re_path(r"^visu/show_histograms/", toolsviews.show_histograms, name='show_histograms'),
  # re_path(r"^visu/get_all_columns/", toolsviews.get_all_columns, name='get_all_columns'),
  # re_path(r"^visu/rename_column/", toolsviews.rename_column, name='rename_column'),
  # re_path(r"^visu/delete_column/", toolsviews.delete_column, name='delete_column'),
  # re_path(r"^visu/show_correlation/", toolsviews.show_correlation, name='show_correlation'),
  # re_path(r"^visu/single_plot/", toolsviews.single_plot, name='single_plot'),
  re_path(r"^visu/live-insights/workspaces/", toolsviews.live_insights_workspaces, name='live_insights_workspaces'),
  re_path(r"^visu/live-insights/tests/", toolsviews.live_insights_tests, name='live_insights_tests'),
  re_path(r"^visu/live-insights/overview/", toolsviews.live_insights_overview, name='live_insights_overview'),
  re_path(r"^visu/live-insights/test/(?P<test_key>[\w-]+)/correlation/(?P<field_a>[\w-]+)/(?P<field_b>[\w-]+)/", toolsviews.live_insights_correlation_pair, name='live_insights_correlation_pair'),
  re_path(r"^visu/live-insights/test/(?P<test_key>[\w-]+)/", toolsviews.live_insights_test_detail, name='live_insights_test_detail'),
]

#if settings.DEBUG:
#  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

