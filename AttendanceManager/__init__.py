import os

# Only import Celery in development (when DEBUG=True)
if os.getenv('DEBUG', 'False') == 'True':
    try:
        from .celery import app as celery_app
        __all__ = ('celery_app',)
    except ImportError:
        # Celery not available, skip
        pass
else:
    # Production - no Celery
    __all__ = ()