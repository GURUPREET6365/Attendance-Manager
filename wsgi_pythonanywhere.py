"""
WSGI config for PythonAnywhere deployment.
Copy this content to your WSGI configuration file on PythonAnywhere.
"""

import os
import sys

# Add your project directory to the sys.path
path = '/home/gurupreetattenda/mysite'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'AttendanceManager.production_settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()