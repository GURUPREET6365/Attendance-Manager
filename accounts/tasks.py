from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.utils import timezone
import datetime

@shared_task
def send_attendance_reminder_emails():
    # In a real production system, you would check 
    # UserPreferences.email_notification_time matching current time.
    # For now, we will send to all users who have enabled notifications.
    from .emails import send_attendance_reminder
    
    users = User.objects.filter(preferences__email_notifications_enabled=True)
    
    count = 0
    for user in users:
        if send_attendance_reminder(user):
            count += 1
            
    return f"Sent {count} reminder emails"
