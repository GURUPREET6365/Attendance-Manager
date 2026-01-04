
// Expose function globally for onclick handlers
window.markAttendance = function(status) {
    const msgDiv = document.getElementById('markMsg');
    
    // Helper for CSRF token (reused)
    function getCSRFToken() {
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

    const formData = new FormData();
    formData.append('status', status);

    const csrfToken = getCSRFToken();
    console.log('CSRF Token:', csrfToken); // Debug log
    console.log('Marking attendance with status:', status); // Debug log

    fetch('/mark/', {
        method: 'POST',
        headers: { "X-CSRFToken": csrfToken },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (msgDiv) {
            msgDiv.classList.remove('hidden');
            if (data.success) {
                msgDiv.textContent = data.message;
                msgDiv.className = "mt-4 p-4 rounded-xl text-center text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20";
                // Reload after short delay to show stats update
                setTimeout(() => window.location.reload(), 1000);
            } else {
                msgDiv.textContent = data.message;
                msgDiv.className = "mt-4 p-4 rounded-xl text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20";
            }
        }
    })
    .catch(err => {
        console.error(err);
        if (msgDiv) {
            msgDiv.classList.remove('hidden');
            msgDiv.textContent = "An error occurred";
            msgDiv.className = "mt-4 p-4 rounded-xl text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20";
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('dashboardData');
    if (!dataContainer) {
        console.log("Dashboard data not found, skipping chart init");
        return; 
    }

    // 1. Chart Initialization
    const present = parseInt(dataContainer.dataset.present) || 0;
    const absent = parseInt(dataContainer.dataset.absent) || 0;
    const off = parseInt(dataContainer.dataset.off) || 0;
    
    // Check if Chart is defined (loaded from CDN)
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('attendanceChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Present', 'Absent', 'School Off'],
                    datasets: [{
                        data: [present, absent, off],
                        backgroundColor: [
                            '#4ade80', // green-400
                            '#f87171', // red-400
                            '#60a5fa', // blue-400
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8' }
                        }
                    },
                    cutout: '70%',
                }
            });
        }
    } else {
        console.warn("Chart.js library not loaded");
    }

    // 2. Chrome Notification Logic
    const chromeEnabled = dataContainer.dataset.chromeEnabled === 'true';
    const chromeTime = dataContainer.dataset.chromeTime; // "HH:MM"

    if (chromeEnabled && chromeTime) {
        // Check time every minute
        setInterval(() => {
            const now = new Date();
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;

            if (currentTime === chromeTime && Notification.permission === 'granted') {
                const lastShown = localStorage.getItem('lastAttendanceNotification');
                const today = new Date().toDateString();
                
                if (lastShown !== today) {
                    new Notification('Attendance Reminder', {
                        body: 'Don\'t forget to mark your attendance today!',
                        icon: '/static/images/logo.png'
                    });
                    localStorage.setItem('lastAttendanceNotification', today);
                }
            }
        }, 60000); // Check every minute
    }
});