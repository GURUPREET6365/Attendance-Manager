from .models import Attendance
from django.shortcuts import render, get_object_or_404





# Create your views here.

def dashboard(request):
    return render(request, 'main.html')