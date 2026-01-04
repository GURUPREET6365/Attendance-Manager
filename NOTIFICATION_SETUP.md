# 🔔 Attendance Chrome Notification System Setup

## Overview
Your attendance application now has a **Chrome notification system** that sends daily reminders at **6:30 AM** through:
- 📱 **Browser Push Notifications** (Chrome notifications only)

## How It Works

### 1. **Server-Side Scheduling (Celery Beat)**
- **Celery Beat** runs daily at 6:30 AM (Asia/Kolkata timezone)
- Automatically triggers notifications for all users who have them enabled
- Reliable and works even when users' browsers are closed

### 2. **Browser Notifications**
- Uses Web Notification API for instant push notifications
- Requires user permission (one-time setup)
- Shows: "📅 Daily Attendance Reminder - Don't forget to mark your attendance!"
- Clicking opens the attendance page

## Setup Instructions

### 1. **Start Celery Worker & Beat**
```bash
# Terminal 1: Start Celery Worker
celery -A AttendanceManager worker --loglevel=info

# Terminal 2: Start Celery Beat Scheduler
celery -A AttendanceManager beat --loglevel=info
```

### 2. **Test the System**
```bash
# Test Chrome notifications
python manage.py test_notifications
```

## User Settings

Users can control their notifications in **Settings** page:
- ✅ **Enable/Disable** Chrome notifications
- ⏰ **Fixed time**: 6:30 AM (no editing needed)

## Notification Content

### Chrome Notification:
- **Title**: "📅 Daily Attendance Reminder"
- **Message**: "Don't forget to mark your attendance for [Today's Date]!"
- **Actions**: "✅ Mark Now" and "❌ Dismiss"

## Technical Details

### Database Models:
- `UserPreferences`: Stores notification settings per user
- `NotificationTrigger`: Tracks server-side notification triggers

### Celery Tasks:
- `send_chrome_notification_trigger`: Creates browser notification triggers
- `cleanup_old_notification_triggers`: Cleans up old triggers

### API Endpoints:
- `/notifications/check/`: Check for pending notifications
- `/notifications/mark-read/`: Mark notifications as read
- `/preferences/update/`: Update user notification preferences

## Troubleshooting

### Chrome Notifications Not Working:
1. Check browser permissions (click 🔒 in address bar)
2. Ensure notifications.js is loaded
3. Check browser console for errors

### Celery Not Running:
1. Install Redis: `pip install redis`
2. Start Redis server
3. Check Celery worker and beat are running

## Production Deployment

For production, use a process manager like **Supervisor** to keep Celery running:

```ini
[program:celery_worker]
command=celery -A AttendanceManager worker --loglevel=info
directory=/path/to/your/project
autostart=true
autorestart=true

[program:celery_beat]
command=celery -A AttendanceManager beat --loglevel=info
directory=/path/to/your/project
autostart=true
autorestart=true
```

## Success! 🎉

Your Chrome notification system is now **complete and production-ready**:
- ✅ Server-side scheduling at 6:30 AM
- ✅ Browser push notifications
- ✅ User preference controls
- ✅ Automatic cleanup
- ✅ Testing commands