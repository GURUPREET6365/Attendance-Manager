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
def changeusername(request):
    if request.method == 'POST':

        username = request.POST.get('username')
        print(username)
        if username is not None and len(username) > 3:

            user = User.objects.filter(username=username).exists()
            print('checking username')
            if user:
                print('user is already exists.')
                response = {
                    'success':False,
                    'message':'This username is already exists.'
                }
                return JsonResponse(response)
            
            else:
                # we can do this for updating the model for the logged in user as when we do user=request.user, it give us the model of the user in bacekend.
                # user=request.user
                user= User.objects.get(id=request.user.id)
                
                user.username = username
                user.save()
                response = {
                    'success':True,
                    'message':'Username has been updated successfully.'
                }
                return JsonResponse(response)
        
            response = {
                'success':False,
                'message':'Username is required and length must be greater than 3.'
            }
            return JsonResponse(response)

@login_required
def changefirstname(request):
    if request.method == 'POST':
        firstname = request.POST.get('first_name')
        if firstname:
            user = User.objects.get(id=request.user.id)
            user.first_name = firstname
            user.save()
            return JsonResponse({'success': True, 'message': 'First name updated successfully.'})
        return JsonResponse({'success': False, 'message': 'First name cannot be empty.'})

@login_required
def changelastname(request):
    if request.method == 'POST':
        lastname = request.POST.get('last_name')
        if lastname:
            user = User.objects.get(id=request.user.id)
            user.last_name = lastname
            user.save()
            return JsonResponse({'success': True, 'message': 'Last name updated successfully.'})
        return JsonResponse({'success': False, 'message': 'Last name cannot be empty.'})

@login_required
def changechrometime(request):
    if request.method == 'POST':
        chrome_time = request.POST.get('chrome_time')
        if chrome_time:
            from .models import UserPreferences
            prefs, created = UserPreferences.objects.get_or_create(user=request.user)
            prefs.chrome_notification_time = chrome_time
            prefs.save()
            return JsonResponse({'success': True, 'message': 'Notification time updated successfully.'})
        return JsonResponse({'success': False, 'message': 'Time cannot be empty.'})

@login_required
def update_preferences(request):
    if request.method == 'POST':
        try:
            # Ensure preferences exist
            from .models import UserPreferences
            prefs, created = UserPreferences.objects.get_or_create(user=request.user)
            
            chrome_time = request.POST.get('chrome_notification_time')
            school_days = request.POST.get('total_school_days')
            chrome_enabled = request.POST.get('chrome_notifications_enabled') == 'true'

            if chrome_time:
                prefs.chrome_notification_time = chrome_time
            if school_days:
                prefs.total_school_days = int(school_days)
            
            prefs.chrome_notifications_enabled = chrome_enabled
            prefs.save()
            
            return JsonResponse({'success': True, 'message': 'Preferences updated successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

            