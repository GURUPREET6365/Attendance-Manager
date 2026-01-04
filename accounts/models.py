from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import datetime

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    chrome_notification_time = models.TimeField(default=datetime.time(6, 30))
    total_school_days = models.IntegerField(default=220)
    chrome_notifications_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username}'s preferences"

class NotificationTrigger(models.Model):
    """
    Model to track when server-side notifications should be sent to users.
    The frontend checks this model to know when to show notifications.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=50, default='attendance_reminder')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.notification_type} at {self.created_at}"

@receiver(post_save, sender=User)
def create_user_preferences(sender, instance, created, **kwargs):
    if created:
        UserPreferences.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_preferences(sender, instance, **kwargs):
    # Only create preferences if they don't exist, don't overwrite existing ones
    if not hasattr(instance, 'preferences'):
        UserPreferences.objects.create(user=instance)
