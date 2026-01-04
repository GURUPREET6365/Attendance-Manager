from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth import logout


# Create your views here.

# This is for login.
def login(request):
    return render(request, 'accounts/login.html')


def Logout(request):
    logout(request)
    return redirect('home')

@login_required(login_url='login')
def settings(request):
    from .models import UserPreferences
    UserPreferences.objects.get_or_create(user=request.user)
    return render(request, 'accounts/settings.html', {'user': request.user})


@login_required
def update_preferences(request):
    if request.method == 'POST':
        try:
            import json
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                chrome_enabled = data.get('chrome_notifications_enabled')
                chrome_time = data.get('chrome_notification_time')
                school_days = data.get('total_school_days')
            else:
                chrome_enabled = request.POST.get('chrome_notifications_enabled') == 'true'
                chrome_time = request.POST.get('chrome_notification_time')
                school_days = request.POST.get('total_school_days')
            
            # Ensure preferences exist
            from .models import UserPreferences
            prefs, created = UserPreferences.objects.get_or_create(user=request.user)
            
            if chrome_time:
                prefs.chrome_notification_time = chrome_time
            if school_days:
                prefs.total_school_days = int(school_days)
            
            if chrome_enabled is not None:
                prefs.chrome_notifications_enabled = chrome_enabled
            
            prefs.save()
            
            return JsonResponse({'success': True, 'message': 'Preferences updated successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

@login_required
def check_notification_triggers(request):
    """
    API endpoint for frontend to check if there are any pending notification triggers.
    """
    from .models import NotificationTrigger
    
    # Get unread notification triggers for the current user
    triggers = NotificationTrigger.objects.filter(
        user=request.user,
        is_read=False
    ).values('id', 'notification_type', 'created_at')
    
    return JsonResponse({
        'success': True,
        'triggers': list(triggers),
        'count': len(triggers)
    })

@login_required
def mark_notification_read(request):
    """
    Mark a notification trigger as read.
    """
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            trigger_id = data.get('trigger_id')
            
            from .models import NotificationTrigger
            trigger = NotificationTrigger.objects.get(
                id=trigger_id,
                user=request.user
            )
            trigger.is_read = True
            trigger.save()
            
            return JsonResponse({'success': True, 'message': 'Notification marked as read.'})
        except NotificationTrigger.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Notification not found.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

            