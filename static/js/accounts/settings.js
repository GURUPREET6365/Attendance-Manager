document.addEventListener('DOMContentLoaded', () => {

    /* ---------- ELEMENTS ---------- */
    const chromeToggle = document.getElementById('chromeToggle');
    const chromeTimeContainer = document.getElementById('chromeTimeContainer');

    /* ---------- HELPERS ---------- */
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

    /* ---------- TOGGLE NOTIFICATION ---------- */
    chromeToggle.addEventListener('change', () => {
        const enabled = chromeToggle.checked;

        chromeTimeContainer.classList.toggle('hidden', !enabled);

        fetch('/preferences/update/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chrome_notifications_enabled: enabled
            })
        }).catch(() => {
            chromeToggle.checked = !enabled;
            chromeTimeContainer.classList.toggle('hidden', enabled);
        });
    });

});
