from celery import shared_task
from . import downloadexcel_codes as dc
import os
from django.conf import settings
import shutil
import uuid
import time

@shared_task
def generate_excel_file(export_type, object_id, xml_list):
    dc.main(xml_list)
    unique_suffix = uuid.uuid4().hex
    if export_type == 'user':
        filename = f"AsphaltMine_My_Data_{object_id}{unique_suffix}.xlsx"
    elif export_type == 'workspace':
        filename = f"AsphaltMine_Workspace_Data_{object_id}{unique_suffix}.xlsx"
    elif export_type == 'query':
        filename = f"AsphaltMine_All_Viewable_Data_{object_id}{unique_suffix}.xlsx"
    excel_file_path = os.path.join('media', filename)
    shutil.move(os.path.join(settings.BASE_DIR, "Download_Final.xlsx"), excel_file_path)
    return filename

@shared_task
def cleanup_media(max_age_hours=1):
    now = time.time()
    max_age_seconds = max_age_hours * 3600
    for dirname, _, filenames in os.walk(settings.MEDIA_ROOT):
        for filename in filenames:
            filepath = os.path.join(dirname, filename)
            if os.path.isfile(filepath):
                file_age = now - os.path.getmtime(filepath)
                if file_age > max_age_seconds:
                    os.remove(filepath)
