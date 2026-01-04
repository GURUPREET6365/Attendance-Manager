from celery import shared_task
from django.contrib.auth.models import User
from django.utils import timezone
import datetime
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_chrome_notification_trigger():
    """
    Trigger chrome notifications for users who have them enabled.
    This creates a database record that the frontend can check.
    """
    from .models import UserPreferences, NotificationTrigger
    
    # Get users with chrome notifications enabled
    users = User.objects.filter(preferences__chrome_notifications_enabled=True)
    
    count = 0
    for user in users:
        try:
            # Create a notification trigger record
            NotificationTrigger.objects.create(
                user=user,
                notification_type='attendance_reminder',
                created_at=timezone.now()
            )
            count += 1
            logger.info(f"Chrome notification trigger created for {user.username}")
        except Exception as e:
            logger.error(f"Failed to create notification trigger for {user.username}: {str(e)}")
    
    logger.info(f"Created {count} chrome notification triggers")
    return f"Created {count} chrome notification triggers"

@shared_task
def cleanup_old_notification_triggers():
    """
    Clean up notification triggers older than 24 hours.
    """
    from .models import NotificationTrigger
    
    cutoff_time = timezone.now() - datetime.timedelta(hours=24)
    deleted_count = NotificationTrigger.objects.filter(created_at__lt=cutoff_time).delete()[0]
    
    logger.info(f"Cleaned up {deleted_count} old notification triggers")
    return f"Cleaned up {deleted_count} old notification triggers"
