"""
Production settings for PythonAnywhere deployment
"""
from .settings import *
from .secrets import *

# Security settings for production
DEBUG = False
ALLOWED_HOSTS = [
    'gurupreetattendancemanager.pythonanywhere.com',
    'www.gurupreetattendancemanager.pythonanywhere.com',
]

# Database configuration for MySQL on PythonAnywhere
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# Static files configuration
STATIC_ROOT = '/home/gurupreetattendancemanager/mysite/static'
STATIC_URL = '/static/'

# Media files (if you have any)
MEDIA_ROOT = '/home/gurupreetattendancemanager/mysite/media'
MEDIA_URL = '/media/'

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True