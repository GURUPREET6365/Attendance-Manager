from django.urls import path
from . import views

urlpatterns = [
    path('',views.home, name='home'),
    path('about/', views.about, name='about'),
    path('mark/', views.mark_attendance, name='mark_attendance'),
    
    # API endpoints for notifications
    path('api/attendance/today/', views.check_today_attendance, name='api_check_today'),
    path('api/attendance/stats/', views.get_attendance_stats, name='api_attendance_stats'),
]