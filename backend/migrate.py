import sys
import os
from tms.settings import PROJECT_APPS


def migrate():
    apps = PROJECT_APPS.copy()

    apps_formatted = list()

    for app in apps:
        splitted = app.split('.')
        apps_formatted.append(splitted[len(splitted)-1])

    status = os.system('python3 manage.py makemigrations %s' % ' '.join(apps_formatted))

    if status == 0:
        os.system('python3 manage.py migrate')

