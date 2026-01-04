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
        const username_display_field = document.getElementById('username_display')
        const old_username_content = username_display_field ? username_display_field.textContent : '';
        const username_input = document.getElementById('usernameInput')
        const username_message = document.getElementById('username_message')
        const username_save_button = document.getElementById('username_edit_save')
        const profile_header_username = document.getElementById('profile_header_username')
        
        const usernamePattern = /^[a-zA-Z0-9@#\.]+$/;

        username_edit_btn.addEventListener('click', function(){
            username_show_container.classList.add('hidden')
            username_input_container.classList.remove('hidden')
            username_input.focus()
        });

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
                        
                        // Update both displays
                        if (username_display_field) username_display_field.textContent = value
                        if (profile_header_username) profile_header_username.textContent = '@' + value
                        
                        username_message.classList.add('hidden')
                    }, 1000);
                } else {
                    showMessage(username_message, data.message)
                }
            })
            .catch(err => showMessage(username_message, "An error occurred"));
        });
    }

    // --- First Name Edit Logic ---
    const firstname_edit_btn = document.getElementById('firstname_edit');
    if (firstname_edit_btn) {
        const firstname_show_container = document.getElementById('firstname_show_field');
        const firstname_input_container = document.getElementById('firstname_input_container');
        const firstname_input = document.getElementById('firstnameInput');
        const firstname_message = document.getElementById('firstname_message');
        const firstname_save_button = document.getElementById('firstname_edit_save');
        const firstname_display = document.getElementById('firstname');

        firstname_edit_btn.addEventListener('click', function() {
            firstname_show_container.classList.add('hidden');
            firstname_input_container.classList.remove('hidden');
            firstname_input.focus();
        });

        if (firstname_save_button) {
            firstname_save_button.addEventListener('click', function() {
                const value = firstname_input.value.trim();
                if (value.length === 0) {
                    showMessage(firstname_message, 'First name cannot be empty.');
                    return;
                }

                const formdata = new FormData();
                formdata.append('first_name', value);

                fetch('/change/firstname/', {
                    method: 'POST',
                    headers: { "X-CSRFToken": getCSRFToken() },
                    body: formdata
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showSuccessmsg(firstname_message, data.message);
                        setTimeout(() => {
                            firstname_show_container.classList.remove('hidden');
                            firstname_input_container.classList.add('hidden');
                            firstname_display.textContent = value;
                            firstname_message.classList.add('hidden'); 
                        }, 1000);
                    } else {
                        showMessage(firstname_message, data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    showMessage(firstname_message, "Failed to update first name.");
                });
            });
        }
    }

    // --- Last Name Edit Logic ---
    const lastname_edit_btn = document.getElementById('lastname_edit');
    if (lastname_edit_btn) {
        const lastname_show_container = document.getElementById('lastname_show_field');
        const lastname_input_container = document.getElementById('lastname_input_container');
        const lastname_input = document.getElementById('lastnameInput');
        const lastname_message = document.getElementById('lastname_message');
        const lastname_save_button = document.getElementById('lastname_edit_save');
        const lastname_display = document.getElementById('lastname');

        lastname_edit_btn.addEventListener('click', function() {
            lastname_show_container.classList.add('hidden');
            lastname_input_container.classList.remove('hidden');
            lastname_input.focus();
        });

        if (lastname_save_button) {
            lastname_save_button.addEventListener('click', function() {
                const value = lastname_input.value.trim();
                if (value.length === 0) {
                    showMessage(lastname_message, 'Last name cannot be empty.');
                    return;
                }

                const formdata = new FormData();
                formdata.append('last_name', value);

                fetch('/change/lastname/', {
                    method: 'POST',
                    headers: { "X-CSRFToken": getCSRFToken() },
                    body: formdata
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showSuccessmsg(lastname_message, data.message);
                        setTimeout(() => {
                            lastname_show_container.classList.remove('hidden');
                            lastname_input_container.classList.add('hidden');
                            lastname_display.textContent = value;
                            lastname_message.classList.add('hidden'); 
                        }, 1000);
                    } else {
                        showMessage(lastname_message, data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    showMessage(lastname_message, "Failed to update last name.");
                });
            });
        }
    }

    // --- Chrome Time Edit Logic ---
    const chrometime_edit_btn = document.getElementById('chrometime_edit');
    if (chrometime_edit_btn) {
        const chrometime_show_container = document.getElementById('chrometime_show_field');
        const chrometime_input_container = document.getElementById('chrometime_input_container');
        const chrometime_input = document.getElementById('chrometimeInput');
        const chrometime_message = document.getElementById('chrometime_message');
        const chrometime_save_button = document.getElementById('chrometime_edit_save');
        const chrometime_display = document.getElementById('chrometime');

        chrometime_edit_btn.addEventListener('click', function() {
            chrometime_show_container.classList.add('hidden');
            chrometime_input_container.classList.remove('hidden');
            chrometime_input.focus();
        });

        if (chrometime_save_button) {
            chrometime_save_button.addEventListener('click', function() {
                const value = chrometime_input.value.trim();
                if (value.length === 0) {
                    showMessage(chrometime_message, 'Time cannot be empty.');
                    return;
                }

                const formdata = new FormData();
                formdata.append('chrome_time', value);

                fetch('/change/chrometime/', {
                    method: 'POST',
                    headers: { "X-CSRFToken": getCSRFToken() },
                    body: formdata
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showSuccessmsg(chrometime_message, data.message);
                        setTimeout(() => {
                            chrometime_show_container.classList.remove('hidden');
                            chrometime_input_container.classList.add('hidden');
                            chrometime_display.textContent = value;
                            chrometime_message.classList.add('hidden'); 
                        }, 1000);
                    } else {
                        showMessage(chrometime_message, data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    showMessage(chrometime_message, "Failed to update time.");
                });
            });
        }
    }

    // --- Notification Permission Logic ---
    function updatePermissionUI(permission) {
        const enableChromeBtn = document.getElementById('enableChromeBtn');
        const chromePermissionMsg = document.getElementById('chromePermissionMsg');
        const chromeToggle = document.getElementById('chromeToggle');
        const chromeTimeContainer = document.getElementById('chromeTimeContainer');

        if (permission === 'granted') {
            if (enableChromeBtn) enableChromeBtn.classList.add('hidden');
            if (chromePermissionMsg) chromePermissionMsg.classList.add('hidden');
        } else if (permission === 'denied') {
            if (enableChromeBtn) {
                enableChromeBtn.classList.remove('hidden');
                enableChromeBtn.textContent = 'Notifications Blocked - Check Browser Settings';
            }
            if (chromePermissionMsg) {
                chromePermissionMsg.classList.remove('hidden');
                chromePermissionMsg.textContent = 'Notifications blocked. Please enable them in your browser settings.';
            }
        } else if (permission === 'default') {
            if (enableChromeBtn) {
                enableChromeBtn.classList.remove('hidden');
                enableChromeBtn.textContent = 'Enable Notifications';
            }
        }
    }

    // --- Chrome Notification Toggle Logic ---
    const chromeToggle = document.getElementById('chromeToggle');
    const chromeTimeContainer = document.getElementById('chromeTimeContainer');
    const enableChromeBtn = document.getElementById('enableChromeBtn');
    
    if (chromeToggle) {
        chromeToggle.addEventListener('change', () => {
            if (chromeToggle.checked && Notification.permission !== 'granted') {
                chromeToggle.checked = false;
                alert("Please enable browser notifications first using the 'Enable Notifications' button.");
                if(enableChromeBtn) enableChromeBtn.classList.remove('hidden');
            } else {
                if (chromeTimeContainer) {
                    chromeTimeContainer.classList.toggle('hidden', !chromeToggle.checked);
                }
                // Save the toggle state immediately
                saveNotificationToggle(chromeToggle.checked);
            }
        });
    }
    
    // Check permission on load and show/hide permission button
    if ('Notification' in window) {
        updatePermissionUI(Notification.permission);
    }
    
    if (enableChromeBtn) {
        enableChromeBtn.addEventListener('click', () => {
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    updatePermissionUI(permission);
                    if (permission === 'granted' && chromeToggle) {
                        chromeToggle.checked = true;
                        if (chromeTimeContainer) chromeTimeContainer.classList.remove('hidden');
                        saveNotificationToggle(true);
                    }
                });
            } else {
                alert('Your browser does not support notifications.');
            }
        });
    }

    // Function to save notification toggle state
    function saveNotificationToggle(enabled) {
        const data = new FormData();
        const totalSchoolDaysInput = document.getElementById('totalSchoolDays');
        const chrometimeDisplay = document.getElementById('chrometime');
        
        data.append('total_school_days', totalSchoolDaysInput ? totalSchoolDaysInput.value : '220');
        data.append('chrome_notifications_enabled', enabled);
        data.append('chrome_notification_time', chrometimeDisplay ? chrometimeDisplay.textContent : '08:30');
        
        fetch('/preferences/update/', {
            method: 'POST',
            headers: { "X-CSRFToken": getCSRFToken() },
            body: data
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                console.error('Failed to save notification toggle:', data.message);
            }
        })
        .catch(err => {
            console.error('Error saving notification toggle:', err);
        });
    }

    // --- School Days Save Logic ---
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', () => {
            const data = new FormData();
            const totalSchoolDaysInput = document.getElementById('totalSchoolDays');
            const chrometimeDisplay = document.getElementById('chrometime');
            
            data.append('total_school_days', totalSchoolDaysInput ? totalSchoolDaysInput.value : '220');
            data.append('chrome_notifications_enabled', chromeToggle ? chromeToggle.checked : false);
            data.append('chrome_notification_time', chrometimeDisplay ? chrometimeDisplay.textContent : '08:30');
            
            const msgDiv = document.getElementById('preferencesMsg');
            
            fetch('/preferences/update/', {
                method: 'POST',
                headers: { "X-CSRFToken": getCSRFToken() },
                body: data
            })
            .then(res => res.json())
            .then(data => {
                if (msgDiv) {
                    msgDiv.classList.remove('hidden');
                    if (data.success) {
                        msgDiv.textContent = data.message;
                        msgDiv.className = "p-4 rounded-xl text-center text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20";
                        setTimeout(() => msgDiv.classList.add('hidden'), 3000);
                    } else {
                        msgDiv.textContent = data.message;
                        msgDiv.className = "p-4 rounded-xl text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20";
                    }
                }
            })
            .catch(err => {
                if (msgDiv) {
                    msgDiv.classList.remove('hidden');
                    msgDiv.textContent = "Error saving preferences";
                    msgDiv.className = "p-4 rounded-xl text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20";
                }
            });
        });
    }

});