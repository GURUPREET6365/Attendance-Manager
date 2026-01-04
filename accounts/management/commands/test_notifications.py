from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.tasks import send_chrome_notification_trigger


class Command(BaseCommand):
    help = 'Test the Chrome notification system by manually triggering notifications'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🔔 Testing Chrome notifications...')
        )
        
        # Check if there are any users
        user_count = User.objects.count()
        if user_count == 0:
            self.stdout.write(
                self.style.ERROR('❌ No users found in the database')
            )
            return
        
        self.stdout.write('📱 Triggering Chrome notifications...')
        result = send_chrome_notification_trigger.delay()
        self.stdout.write(
            self.style.SUCCESS(f'✅ Chrome notification task queued: {result.id}')
        )
        
        self.stdout.write(
            self.style.SUCCESS('🎯 Test notifications triggered successfully!')
        )
        self.stdout.write(
            '💡 Check your browser for notifications.'
        )