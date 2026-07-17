""" Site-wide template context processors for AsphaltMine.
"""
from django.conf import settings


def app_version(request):
    """Exposes settings.APP_VERSION to every template as APP_VERSION.

    Bump the version in one place (settings.py) instead of editing the
    footer HTML for every release.
    """
    return {"APP_VERSION": getattr(settings, "APP_VERSION", "")}
