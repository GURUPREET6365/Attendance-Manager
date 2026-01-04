document.addEventListener('DOMContentLoaded', function() {
    
    function showMessage(element, message) {
        if (!element) return;
        element.classList.remove('hidden')
        element.textContent = message
        element.classList.remove('text-green-400')
        element.classList.add('text-red-400')
    }

    function showSuccessmsg(element, message) {
        if (!element) return;
        element.classList.remove('hidden')
        element.textContent = message
        element.classList.remove('text-red-400')
        element.classList.add('text-green-400')
    }
    
    // Helper for CSRF token
    function getCSRFToken() {
        const cookies = document.cookie.split("; ");
        const csrfCookie = cookies.find(cookie => cookie.startsWith("csrftoken="));
        if (!csrfCookie) return null;
        return csrfCookie.split("=")[1];
    }

    // --- Username Edit Logic ---
    const username_edit_btn = document.getElementById('username_edit')
    if (username_edit_btn) {
        const username_show_container = document.getElementById('username_show_field')
        const username_input_container = document.getElementById('username_input_container')
        const old_username_content = document.getElementById('username').textContent
        const username_input = document.getElementById('usernameInput')
        const username_message = document.getElementById('username_message')
        const username_save_button = document.getElementById('username_edit_save')
        const username_display = document.getElementById('username')
        
        const usernamePattern = /^[a-zA-Z0-9@#\.]+$/; // Added dot just in case

        username_edit_btn.addEventListener('click', function(){
            username_show_container.classList.add('hidden')
            username_input_container.classList.remove('hidden')
            username_input.focus()
        });

        // Separate save listener to avoid duplicate bindings
        username_save_button.addEventListener('click', function() {
            const value = username_input.value.trim();
            
            if (old_username_content === value){
                showMessage(username_message, 'New username must be different')
                return;
            }
            if (!usernamePattern.test(value)) {
                showMessage(username_message, 'Username cannot be empty or contain invalid characters.')
                return;
            }
            if (value.length < 4) {
                showMessage(username_message, 'Username must be longer than 4 characters.')
                return;
            }
            
            showMessage(username_message ,'') // Clear error
            
            const formdata = new FormData()
            formdata.append('username', value)
            
            fetch('/change/username/',{
                method: 'POST',
                headers: { "X-CSRFToken": getCSRFToken() },
                body: formdata
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessmsg(username_message, data.message)
                    setTimeout(() => {
                        username_show_container.classList.remove('hidden')
                        username_input_container.classList.add('hidden')
                        username_display.textContent = value
                        username_message.classList.add('hidden')
                    }, 1000);
                } else {
                    showMessage(username_message, data.message)
                }
            })
            .catch(err => showMessage(username_message, "An error occurred"));
        });
    }

    // --- Generic Field Edit Logic (Firstname/Lastname) ---
    function setupFieldEdit(fieldPrefix, url, valueParamName) {
        const editBtn = document.getElementById(`${fieldPrefix}_edit`);
        const showContainer = document.getElementById(`${fieldPrefix}_show_field`);
        const inputContainer = document.getElementById(`${fieldPrefix}_input_container`); // Checked HTML, this matches
        const input = document.getElementById(`${fieldPrefix}Input`);
        const message = document.getElementById(`${fieldPrefix}_message`);
        const saveBtn = document.getElementById(`${fieldPrefix}_edit_save`);
        const displayElement = document.getElementById(fieldPrefix);
        
        if (!editBtn || !saveBtn || !input) {
            console.warn(`Elements missing for ${fieldPrefix} edit`);
            return; 
        }

        editBtn.addEventListener('click', function() {
            showContainer.classList.add('hidden');
            inputContainer.classList.remove('hidden');
            input.focus();
        });

        saveBtn.addEventListener('click', function() {
            const value = input.value.trim();
            if (value.length === 0) {
                showMessage(message, 'Field cannot be empty.');
                return;
            }

            const formdata = new FormData();
            formdata.append(valueParamName, value);

            fetch(url, {
                method: 'POST',
                headers: { "X-CSRFToken": getCSRFToken() },
                body: formdata
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessmsg(message, data.message);
                    setTimeout(() => {
                        showContainer.classList.remove('hidden');
                        inputContainer.classList.add('hidden');
                        displayElement.textContent = value;
                        message.classList.add('hidden'); 
                    }, 1000);
                } else {
                    showMessage(message, data.message);
                }
            })
            .catch(err => {
                console.error(err);
                showMessage(message, "Failed to update.");
            });
        });
    }

    // Initialize edit fields
    setupFieldEdit('firstname', '/change/firstname/', 'first_name');
    setupFieldEdit('lastname', '/change/lastname/', 'last_name');


    // --- Preferences Logic ---
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    if (savePreferencesBtn) {
        const chromeToggle = document.getElementById('chromeToggle');
        const chromeTimeContainer = document.getElementById('chromeTimeContainer');
        const enableChromeBtn = document.getElementById('enableChromeBtn');
        
        if (chromeToggle) {
            chromeToggle.addEventListener('change', () => {
                if (chromeToggle.checked && Notification.permission !== 'granted') {
                    chromeToggle.checked = false;
                    alert("Please enable browser notifications first using the 'Request Permission' button.");
                    if(enableChromeBtn) enableChromeBtn.classList.remove('hidden');
                } else {
                    chromeTimeContainer.classList.toggle('hidden', !chromeToggle.checked);
                }
            });
        }
        
        // Check permission on load
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            if(enableChromeBtn) enableChromeBtn.classList.remove('hidden');
        }
        
        if (enableChromeBtn) {
            enableChromeBtn.addEventListener('click', () => {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        enableChromeBtn.classList.add('hidden');
                        const pMsg = document.getElementById('chromePermissionMsg');
                        if(pMsg) pMsg.classList.add('hidden');
                        if(chromeToggle) {
                            chromeToggle.checked = true;
                            chromeTimeContainer.classList.remove('hidden');
                        }
                    }
                });
            });
        }

        // Save logic
        savePreferencesBtn.addEventListener('click', () => {
            const data = new FormData();
            data.append('total_school_days', document.getElementById('totalSchoolDays').value);
            data.append('chrome_notifications_enabled', chromeToggle.checked);
            data.append('chrome_notification_time', document.getElementById('chromeTime').value);
            
            const msgDiv = document.getElementById('preferencesMsg');
            
            fetch('/preferences/update/', {
                method: 'POST',
                headers: { "X-CSRFToken": getCSRFToken() },
                body: data
            })
            .then(res => res.json())
            .then(data => {
                msgDiv.classList.remove('hidden');
                if (data.success) {
                    msgDiv.textContent = data.message;
                    msgDiv.className = "p-4 rounded-xl text-center text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20";
                    setTimeout(() => msgDiv.classList.add('hidden'), 3000);
                } else {
                    msgDiv.textContent = data.message;
                    msgDiv.className = "p-4 rounded-xl text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20";
                }
            })
            .catch(err => {
                msgDiv.classList.remove('hidden');
                msgDiv.textContent = "Error saving preferences";
                msgDiv.className = "p-4 rounded-xl text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20";
            });
        });
    }

});
function showSuccessmsg(element, message) {
    element.classList.remove('hidden')
    element.textContent = message
    element.classList.remove('text-red-400')
    element.classList.add('text-green-400')
}


// This is for username edit button
const username_edit_btn = document.getElementById('username_edit')
const username_show_container = document.getElementById('username_show_field')
const username_input_container = document.getElementById('username_input_container')
const old_username_content = document.getElementById('username').textContent
const username_input = document.getElementById('usernameInput')
const username_message = document.getElementById('username_message')
const username_save_button = document.getElementById('username_edit_save')
const username = document.getElementById('username')

const usernamePattern = /^[a-zA-Z0-9@#]+$/;


// show message function 
console.log('adding event listener to the username edit button.')
username_edit_btn.addEventListener('click', function(){
    username_show_container.classList.add('hidden')
    username_input_container.classList.remove('hidden')
    username_input.focus()
    username_input.addEventListener('input', function(){
        const value = username_input.value
        if (old_username_content === value){
            showMessage(username_message, 'old and new username must be different')
        }
        
        else if (!usernamePattern.test(username_input.value)) {
            showMessage(username_message, 'username can not be empty or not contains space.')
        }
        
        else if (value.length < '4') {
            showMessage(username_message, 'username should greater than 4.')
        }
        else{
            showMessage(username_message ,'')
            
            
            
            username_save_button.addEventListener('click', function() {
                function getCSRFToken() {
                    const cookies = document.cookie.split("; ");
        
                    const csrfCookie = cookies.find(
                        cookie => cookie.startsWith("csrftoken=")
                    );
        
                    if (!csrfCookie) return null;
        
                    return csrfCookie.split("=")[1];
                }
           
                const formdata = new FormData()
                formdata.append('username',value)
                console.log('button is clicked.')
                fetch('/change/username/',{
                    method: 'POST',
                    headers: {
                        
                        "X-CSRFToken": getCSRFToken()
                    },
                    body:formdata
                    
                })
                .then(
                    function(response) {
                        return response.json()
                    }
                )
                .then(function(data){
                    if (data.success) {
                        showSuccessmsg(username_message, data.message)
                        username_show_container.classList.remove('hidden')
                        username_input_container.classList.add('hidden')
                        username.textContent = value
                        username_show_container.textContent = value
                    }
                })
            })

        }
    })
})


// Helper for CSRF token
function getCSRFToken() {
    const cookies = document.cookie.split("; ");
    const csrfCookie = cookies.find(cookie => cookie.startsWith("csrftoken="));
    if (!csrfCookie) return null;
    return csrfCookie.split("=")[1];
}

// Generic function to handle field editing
function setupFieldEdit(fieldPrefix, url, valueParamName) {
    const editBtn = document.getElementById(`${fieldPrefix}_edit`);
    const showContainer = document.getElementById(`${fieldPrefix}_show_field`);
    const inputContainer = document.getElementById(`${fieldPrefix}_input_container`);
    const input = document.getElementById(`${fieldPrefix}Input`);
    const message = document.getElementById(`${fieldPrefix}_message`);
    const saveBtn = document.getElementById(`${fieldPrefix}_edit_save`);
    const displayElement = document.getElementById(fieldPrefix);
    
    if (!editBtn) return; // Guard against missing elements

    editBtn.addEventListener('click', function() {
        showContainer.classList.add('hidden');
        inputContainer.classList.remove('hidden');
        input.focus();
    });

    saveBtn.addEventListener('click', function() {
        const value = input.value.trim();
        if (value.length === 0) {
            showMessage(message, 'Field cannot be empty.');
            return;
        }

        const formdata = new FormData();
        formdata.append(valueParamName, value);

        fetch(url, {
            method: 'POST',
            headers: { "X-CSRFToken": getCSRFToken() },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessmsg(message, data.message);
                setTimeout(() => {
                    showContainer.classList.remove('hidden');
                    inputContainer.classList.add('hidden');
                    displayElement.textContent = value;
                    message.classList.add('hidden'); // Hide message after success
                }, 1000);
            } else {
                showMessage(message, data.message);
            }
        });
    });
}

// Initialize edit fields
setupFieldEdit('firstname', '/change/firstname/', 'first_name');
setupFieldEdit('lastname', '/change/lastname/', 'last_name');


// Test Notification Button
const testNotificationBtn = document.getElementById('testNotificationBtn');
if (testNotificationBtn) {
    testNotificationBtn.addEventListener('click', () => {
        if (Notification.permission === 'granted') {
            new Notification('🎯 Attendance Reminder', {
                body: 'Don\'t forget to mark your attendance today!',
                icon: '/static/favicon.ico',
                badge: '/static/favicon.ico'
            });
        } else if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('🎯 Attendance Reminder', {
                        body: 'Don\'t forget to mark your attendance today!',
                        icon: '/static/favicon.ico',
                        badge: '/static/favicon.ico'
                    });
                }
            });
        } else {
            alert('Notifications are blocked. Please enable them in your browser settings.');
        }
    });
}
