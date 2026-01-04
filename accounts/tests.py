from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import UserPreferences
from django.urls import reverse
import json

class AccountsApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='password123', first_name='OldFirst', last_name='OldLast')
        self.client.login(username='testuser', password='password123')
        # Preferences are created by signal, get it
        self.preferences = UserPreferences.objects.get(user=self.user)

    def test_change_firstname(self):
        url = reverse('changefirstname')
        response = self.client.post(url, {'first_name': 'NewFirst'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['success'], True)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'NewFirst')

    def test_change_lastname(self):
        url = reverse('changelastname')
        response = self.client.post(url, {'last_name': 'NewLast'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['success'], True)
        self.user.refresh_from_db()
        self.assertEqual(self.user.last_name, 'NewLast')

    def test_update_preferences(self):
        url = reverse('update_preferences')
        data = {
            'total_school_days': 240,
            'email_notification_time': '10:00',
            'chrome_notification_time': '09:00',
            'email_notifications_enabled': 'false',
            'chrome_notifications_enabled': 'true'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['success'], True)
        
        self.preferences.refresh_from_db()
        self.assertEqual(self.preferences.total_school_days, 240)
        self.assertEqual(str(self.preferences.email_notification_time), '10:00:00')
        self.assertFalse(self.preferences.email_notifications_enabled)
        self.assertTrue(self.preferences.chrome_notifications_enabled)

    def test_change_firstname_empty(self):
        url = reverse('changefirstname')
        response = self.client.post(url, {'first_name': ''})
        self.assertEqual(json.loads(response.content)['success'], False)
