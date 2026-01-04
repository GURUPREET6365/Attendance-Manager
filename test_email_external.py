#!/usr/bin/env python
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AttendanceManager.settings')
django.setup()

from django.core.mail import send_mail

def test_external_email():
    try:
        print("Testing email to external account...")
        
        # Send test email to your other account
        send_mail(
            subject='Test Email - Attendance Manager System',
            message='''
Hello!

This is a test email from the Attendance Manager application.

The email system is working correctly and can send notifications to external email addresses.

Features tested:
✅ SMTP Connection
✅ Email Delivery
✅ External Account Delivery

Best regards,
Attendance Manager System
            ''',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['kumargurupreet2008@gmail.com'],
            fail_silently=False,
        )
        print("✅ Email sent successfully to kumargurupreet2008@gmail.com!")
        print("Please check your inbox (and spam folder if needed)")
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        print(f"Email settings:")
        print(f"  EMAIL_HOST: {settings.EMAIL_HOST}")
        print(f"  EMAIL_PORT: {settings.EMAIL_PORT}")
        print(f"  EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
        print(f"  EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")

if __name__ == "__main__":
    test_external_email()