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

# Override STATICFILES_DIRS for production (empty for collectstatic)
STATICFILES_DIRS = []

# Media files (if you have any)
MEDIA_ROOT = '/home/gurupreetattendancemanager/mysite/media'
MEDIA_URL = '/media/'

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# SOCIAL AUTH SETTINGS
SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile', 
            'email',
        ],
    }
}

SOCIALACCOUNT_LOGIN_ON_GET = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = "none"

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
LOGIN_URL = '/login'

# Email Settings (from secrets.py)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = EMAIL_HOST
EMAIL_PORT = EMAIL_PORT
EMAIL_USE_TLS = EMAIL_USE_TLS
EMAIL_HOST_USER = EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = EMAIL_HOST_PASSWORD