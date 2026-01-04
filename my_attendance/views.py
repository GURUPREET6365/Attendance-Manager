from .models import Attendance
from django.shortcuts import render, get_object_or_404

# Create your views here.

def home(request):
    context = {}
    if request.user.is_authenticated:
        attendance_records = Attendance.objects.filter(user=request.user).order_by('-date')
        context['attendance_records'] = attendance_records
    return render(request, 'my_attendance/home.html', context)

def about(request):
    return render(request, 'my_attendance/about.html')