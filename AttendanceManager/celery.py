import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AttendanceManager.settings')

app = Celery('AttendanceManager')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Celery Beat Schedule for daily notifications at 6:30 AM
app.conf.beat_schedule = {
    'trigger-chrome-notifications': {
        'task': 'accounts.tasks.send_chrome_notification_trigger',
        'schedule': crontab(hour=6, minute=30),  # 6:30 AM daily
    },
    'cleanup-old-triggers': {
        'task': 'accounts.tasks.cleanup_old_notification_triggers',
        'schedule': crontab(hour=2, minute=0),  # 2:00 AM daily cleanup
    },
}

app.conf.timezone = 'Asia/Kolkata'

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
