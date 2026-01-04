from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.Logout, name='logout'),
    path('change/username/', views.changeusername, name='changeusername'),
    path('change/firstname/', views.changefirstname, name='changefirstname'),
    path('change/lastname/', views.changelastname, name='changelastname'),
    path('change/chrometime/', views.changechrometime, name='changechrometime'),
    path('preferences/update/', views.update_preferences, name='update_preferences'),
    path('settings/', views.settings, name='settings')
]