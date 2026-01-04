from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.Logout, name='logout'),
    path('preferences/update/', views.update_preferences, name='update_preferences'),
    path('notifications/check/', views.check_notification_triggers, name='check_notification_triggers'),
    path('notifications/mark-read/', views.mark_notification_read, name='mark_notification_read'),
    path('settings/', views.settings, name='settings')
]