"""
WSGI config for temple-management-system project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from django.conf import settings

BASE_DIR = os.path.dirname(os.path.abspath(__name__))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tms.settings')

application = get_wsgi_application()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(
    BASE_DIR, "keys", settings.GOOGLE_APPLICATION_CREDENTIALS)
