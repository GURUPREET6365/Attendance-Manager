// Complete Chrome Notification System
class AttendanceNotificationManager {
    constructor() {
        this.isSupported = 'Notification' in window;
        this.permission = this.isSupported ? Notification.permission : 'denied';
        this.init();
    }

    init() {
        console.log('🔔 Notification Manager initialized');
        console.log('📱 Browser support:', this.isSupported);
        console.log('🔐 Permission status:', this.permission);
        
        if (this.isSupported) {
            this.setupEventListeners();
            this.checkScheduledNotifications();
        }
    }

    async requestPermission() {
        if (!this.isSupported) {
            alert('❌ Your browser does not support notifications');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                this.showTestNotification();
                return true;
            } else {
                console.log('❌ Notification permission denied');
                alert('❌ Notification permission denied. Please enable notifications in your browser settings.');
                return false;
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
            return false;
        }
    }

    showTestNotification() {
        if (this.permission !== 'granted') return;

        const notification = new Notification('🎯 Attendance Manager', {
            body: '✅ Notifications are now enabled! You\'ll receive daily reminders.',
            icon: '/static/images/logo.png',
            badge: '/static/images/badge.png',
            tag: 'test-notification',
            requireInteraction: false,
            silent: false
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }

    showAttendanceReminder() {
        if (this.permission !== 'granted') return;

        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const notification = new Notification('📅 Daily Attendance Reminder', {
            body: `Don't forget to mark your attendance for ${today}!`,
            icon: '/static/images/logo.png',
            badge: '/static/images/badge.png',
            tag: 'attendance-reminder',
            requireInteraction: true,
            actions: [
                { action: 'mark', title: '✅ Mark Now' },
                { action: 'dismiss', title: '❌ Dismiss' }
            ]
        });

        notification.onclick = () => {
            window.open('/', '_blank');
            notification.close();
        };

        return notification;
    }

    setupEventListeners() {
        // Manual trigger button
        const triggerBtn = document.getElementById('manualNotificationTrigger');
        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => {
                if (this.permission === 'granted') {
                    this.showAttendanceReminder();
                } else {
                    this.requestPermission();
                }
            });
        }

        // Permission request button
        const permissionBtn = document.getElementById('requestNotificationPermission');
        if (permissionBtn) {
            permissionBtn.addEventListener('click', () => {
                this.requestPermission();
            });
        }
    }

    checkScheduledNotifications() {
        // Check every minute if it's time for notification
        setInterval(() => {
            this.checkNotificationTime();
            this.checkServerTriggers(); // Check server-side triggers
        }, 60000); // Check every minute

        // Also check immediately
        this.checkNotificationTime();
        this.checkServerTriggers();
    }

    async checkServerTriggers() {
        try {
            const response = await fetch('/notifications/check/', {
                method: 'GET',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success && data.count > 0) {
                // Show notification for each trigger
                for (const trigger of data.triggers) {
                    this.showAttendanceReminder();
                    
                    // Mark as read
                    await this.markTriggerAsRead(trigger.id);
                }
                
                console.log(`🔔 Processed ${data.count} server-side notification triggers`);
            }
        } catch (error) {
            console.error('Error checking server triggers:', error);
        }
    }

    async markTriggerAsRead(triggerId) {
        try {
            await fetch('/notifications/mark-read/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trigger_id: triggerId })
            });
        } catch (error) {
            console.error('Error marking trigger as read:', error);
        }
    }

    getCSRFToken() {
        // Try to get from cookie first
        const cookies = document.cookie.split("; ");
        const csrfCookie = cookies.find(cookie => cookie.startsWith("csrftoken="));
        if (csrfCookie) {
            return csrfCookie.split("=")[1];
        }
        
        // Fallback to meta tag
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
        
        return null;
    }

    checkNotificationTime() {
        if (this.permission !== 'granted') return;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // Get notification time from dashboard data
        const dashboardData = document.getElementById('dashboardData');
        if (!dashboardData) return;

        const chromeEnabled = dashboardData.dataset.chromeEnabled === 'true';
        const chromeTime = dashboardData.dataset.chromeTime;

        if (chromeEnabled && chromeTime && currentTime === chromeTime) {
            // Check if we already sent notification today
            const lastNotification = localStorage.getItem('lastAttendanceNotification');
            const today = now.toDateString();

            if (lastNotification !== today) {
                this.showAttendanceReminder();
                localStorage.setItem('lastAttendanceNotification', today);
                console.log('🔔 Scheduled notification sent at', currentTime);
            }
        }
    }

    // Method to manually trigger notification (for testing)
    triggerManualNotification() {
        console.log('🔔 Manual notification triggered');
        if (this.permission === 'granted') {
            this.showAttendanceReminder();
        } else {
            console.log('❌ Permission not granted, requesting...');
            this.requestPermission().then(granted => {
                if (granted) {
                    this.showAttendanceReminder();
                }
            });
        }
    }
}

// Initialize notification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.notificationManager = new AttendanceNotificationManager();
});

// Global function for manual trigger
window.triggerNotification = function() {
    if (window.notificationManager) {
        window.notificationManager.triggerManualNotification();
    }
};