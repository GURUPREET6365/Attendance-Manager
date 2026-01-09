from .models import Attendance
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from datetime import date, datetime
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt # Using JS csrf token helper instead

# Create your views here.

def home(request):
    context = {}
    if request.user.is_authenticated:
        # Get date filter parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        # Base queryset for ALL records (for stats calculation)
        all_attendance_records = Attendance.objects.filter(user=request.user)
        
        # Filtered queryset for display
        attendance_records = all_attendance_records
        
        # Apply date filters if provided (only for display, not stats)
        if start_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                attendance_records = attendance_records.filter(date__gte=start_date_obj)
                context['start_date'] = start_date
            except ValueError:
                pass
                
        if end_date:
            try:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                attendance_records = attendance_records.filter(date__lte=end_date_obj)
                context['end_date'] = end_date
            except ValueError:
                pass
        
        attendance_records = attendance_records.order_by('-date')
        context['attendance_records'] = attendance_records
        
        # Calculate stats from ALL records (not filtered ones)
        present_count = all_attendance_records.filter(is_present=True).count()
        school_off_count = all_attendance_records.filter(is_school_off=True).count()
        # Absent is when not present AND not school off
        absent_count = all_attendance_records.filter(is_present=False, is_school_off=False).count()
        
        context['present_count'] = present_count
        context['absent_count'] = absent_count
        context['school_off_count'] = school_off_count
        
        # Calculate attendance percentage from ALL records
        total_days = all_attendance_records.count()
        if total_days > 0:
            attendance_percentage = (present_count / total_days) * 100
            context['attendance_percentage'] = round(attendance_percentage, 1)
        else:
            context['attendance_percentage'] = 0
        
    return render(request, 'my_attendance/home.html', context)

def about(request):
    return render(request, 'my_attendance/about.html')


@login_required
@require_POST
def mark_attendance(request):
    print(f"Received attendance request from user: {request.user}")  # Debug log
    print(f"POST data: {request.POST}")  # Debug log
    
    status = request.POST.get('status')
    attendance_date = request.POST.get('date')  # New: allow custom date
    
    if not status:
        print("No status provided")  # Debug log
        return JsonResponse({'success': False, 'message': 'Status is required.'})

    # Use provided date or default to today
    if attendance_date:
        try:
            target_date = datetime.strptime(attendance_date, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Invalid date format.'})
    else:
        target_date = date.today()
    
    print(f"Marking attendance for date: {target_date}")  # Debug log
    
    # Check if record exists for this user and target date
    attendance_qs = Attendance.objects.filter(user=request.user, date=target_date)
    
    if attendance_qs.exists():
        attendance = attendance_qs.first()
        created = False
        message = f"Attendance updated successfully for {target_date.strftime('%B %d, %Y')}."
    else:
        # Create new record
        attendance = Attendance(
            user=request.user,
            date=target_date,
            day=target_date.day,
            month=target_date.month,
        )
        created = True
        message = f"Attendance marked successfully for {target_date.strftime('%B %d, %Y')}."

    # Update logic
    if status == 'present':
        attendance.is_present = True
        attendance.is_school_off = False
    elif status == 'absent':
        attendance.is_present = False
        attendance.is_school_off = False
    elif status == 'school_off':
        attendance.is_present = False
        attendance.is_school_off = True
    else:
        return JsonResponse({'success': False, 'message': 'Invalid status assignment.'})
        
    attendance.save()
    print(f"Attendance saved successfully: {attendance}")  # Debug log
    
    return JsonResponse({
        'success': True, 
        'message': message,
        'status': status,
        'date': str(target_date)
    })
@require_GET
def check_today_attendance(request):
    """API endpoint to check if attendance is marked for today"""
    today = date.today()
    attendance_exists = Attendance.objects.filter(
        user=request.user,
        date=today
    ).exists()
    
    return JsonResponse({
        'marked': attendance_exists,
        'date': str(today)
    })

@login_required
@require_GET
def get_attendance_stats(request):
    """API endpoint to get user's attendance statistics"""
    attendance_records = Attendance.objects.filter(user=request.user)
    
    total_count = attendance_records.count()
    present_count = attendance_records.filter(is_present=True).count()
    absent_count = attendance_records.filter(is_present=False, is_school_off=False).count()
    school_off_count = attendance_records.filter(is_school_off=True).count()
    
    percentage = 0
    if total_count > 0:
        percentage = round((present_count / total_count) * 100, 1)
    
    return JsonResponse({
        'total': total_count,
        'present': present_count,
        'absent': absent_count,
        'school_off': school_off_count,
        'percentage': percentage
    })
