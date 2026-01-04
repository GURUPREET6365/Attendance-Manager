from django.core.mail import send_mail
from django.conf import settings
from datetime import date

def send_attendance_reminder(user):
    """
    Sends an attendance reminder email to the user.
    """
    subject = f"Attendance Reminder - {date.today().strftime('%d %b %Y')}"
    message = f"""
    Hi {user.first_name},

    This is a quick reminder to mark your attendance for today, {date.today().strftime('%A, %d %B %Y')}.

    Stay consistent to meet your school day targets!

    Best regards,
    Attendance Manager Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send email to {user.email}: {e}")
        return False
