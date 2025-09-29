// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Auth elements
    const authContainer = document.getElementById('auth-container');
    const appContent = document.getElementById('app-content');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Dashboard elements
    const userName = document.getElementById('user-name');
    const userStatus = document.getElementById('user-status');
    const startJourneyBtn = document.getElementById('start-journey');
    const arrivedSafeBtn = document.getElementById('arrived-safe');
    const emergencyBtn = document.getElementById('emergency');
    const journeyDetails = document.getElementById('journey-details');
    const journeyStartTime = document.getElementById('journey-start-time');
    const journeyEta = document.getElementById('journey-eta');
    const journeyContacts = document.getElementById('journey-contacts');

    // Contacts elements
    const contactsList = document.getElementById('contacts-list');
    const addContactBtn = document.getElementById('add-contact');
    const contactModal = document.getElementById('contact-modal');
    const addContactForm = document.getElementById('add-contact-form');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // Journey elements
    const journeyModal = document.getElementById('journey-modal');
    const journeyForm = document.getElementById('journey-form');
    const contactCheckboxes = document.getElementById('contact-checkboxes');

    // Map element
    const mapContainer = document.getElementById('map-container');
    const map = document.getElementById('map');

    // Mock user data (in a real app, this would come from a database)
    let currentUser = null;
    let contacts = [];
    let activeJourney = null;
    let watchId = null; // For geolocation tracking

    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Mock login (in a real app, this would validate against a database)
        if (email && password) {
            // Mock user data
            currentUser = {
                name: 'Jane Doe',
                email: email,
                phone: '+46701234567',
                status: 'safe'
            };
            
            // Show app content and hide auth container
            authContainer.classList.add('hidden');
            appContent.classList.remove('hidden');
            
            // Update user info in the dashboard
            updateUserInfo();
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        
        // Mock registration (in a real app, this would save to a database)
        if (name && email && phone && password) {
            // Mock user data
            currentUser = {
                name: name,
                email: email,
                phone: phone,
                status: 'safe'
            };
            
            // Show app content and hide auth container
            authContainer.classList.add('hidden');
            appContent.classList.remove('hidden');
            
            // Update user info in the dashboard
            updateUserInfo();
        }
    });

    // Update user information in the dashboard
    function updateUserInfo() {
        if (currentUser) {
            userName.textContent = currentUser.name;
            userStatus.textContent = currentUser.status;
            userStatus.className = `status ${currentUser.status}`;
        }
    }

    // Add contact button click
    addContactBtn.addEventListener('click', () => {
        contactModal.style.display = 'flex';
    });

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            contactModal.style.display = 'none';
            journeyModal.style.display = 'none';
        });
    });

    // Add contact form submission
    addContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const email = document.getElementById('contact-email').value;
        
        if (name && (phone || email)) {
            const contactId = Date.now().toString();
            const newContact = {
                id: contactId,
                name: name,
                phone: phone,
                email: email
            };
            
            // Add to contacts array
            contacts.push(newContact);
            
            // Update contacts list
            updateContactsList();
            
            // Close modal and reset form
            contactModal.style.display = 'none';
            addContactForm.reset();
        }
    });

    // Update contacts list in the UI
    function updateContactsList() {
        contactsList.innerHTML = '';
        
        if (contacts.length === 0) {
            contactsList.innerHTML = '<p class="empty-state">No trusted contacts added yet</p>';
            return;
        }
        
        contacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.className = 'contact-item';
            contactElement.innerHTML = `
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p>${contact.phone || contact.email}</p>
                </div>
                <div class="contact-actions">
                    <button class="btn secondary-btn btn-sm delete-contact" data-id="${contact.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            contactsList.appendChild(contactElement);
            
            // Add delete event listener
            const deleteBtn = contactElement.querySelector('.delete-contact');
            deleteBtn.addEventListener('click', () => {
                contacts = contacts.filter(c => c.id !== contact.id);
                updateContactsList();
            });
        });
    }

    // Start journey button click
    startJourneyBtn.addEventListener('click', () => {
        // Update contact checkboxes in journey modal
        updateContactCheckboxes();
        journeyModal.style.display = 'flex';
    });

    // Update contact checkboxes in journey modal
    function updateContactCheckboxes() {
        contactCheckboxes.innerHTML = '';
        
        if (contacts.length === 0) {
            contactCheckboxes.innerHTML = '<p class="empty-state">No contacts available</p>';
            return;
        }
        
        contacts.forEach(contact => {
            const checkbox = document.createElement('div');
            checkbox.className = 'checkbox-item';
            checkbox.innerHTML = `
                <input type="checkbox" id="contact-${contact.id}" name="selected-contacts" value="${contact.id}">
                <label for="contact-${contact.id}">${contact.name}</label>
            `;
            contactCheckboxes.appendChild(checkbox);
        });
    }

    // Journey form submission
    journeyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destination = document.getElementById('destination').value;
        const eta = document.getElementById('eta').value;
        const selectedContactIds = Array.from(
            document.querySelectorAll('input[name="selected-contacts"]:checked')
        ).map(checkbox => checkbox.value);
        
        const selectedContacts = contacts.filter(contact => 
            selectedContactIds.includes(contact.id)
        );
        
        // Create active journey
        activeJourney = {
            destination: destination,
            startTime: new Date(),
            eta: eta,
            selectedContacts: selectedContacts
        };
        
        // Update UI for active journey
        startActiveJourney();
        
        // Close modal and reset form
        journeyModal.style.display = 'none';
        journeyForm.reset();
    });

    // Start active journey
    function startActiveJourney() {
        // Update user status
        currentUser.status = 'journey';
        updateUserInfo();
        
        // Show journey details and arrived button
        journeyDetails.classList.remove('hidden');
        startJourneyBtn.classList.add('hidden');
        arrivedSafeBtn.classList.remove('hidden');
        
        // Update journey details
        const startTimeFormatted = formatTime(activeJourney.startTime);
        journeyStartTime.textContent = startTimeFormatted;
        journeyEta.textContent = activeJourney.eta;
        
        if (activeJourney.selectedContacts.length > 0) {
            const contactNames = activeJourney.selectedContacts.map(c => c.name).join(', ');
            journeyContacts.textContent = contactNames;
        } else {
            journeyContacts.textContent = 'No contacts';
        }
        
        // Start location tracking
        startLocationTracking();
    }

    // Format time for display
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Start location tracking
    function startLocationTracking() {
        if (navigator.geolocation) {
            // Show map with loading indicator
            map.innerHTML = '<div class="map-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Getting your location...</p></div>';
            
            // Start watching position
            watchId = navigator.geolocation.watchPosition(
                updateLocation,
                handleLocationError,
                { enableHighAccuracy: true }
            );
        } else {
            map.innerHTML = '<div class="map-placeholder"><i class="fas fa-exclamation-circle"></i><p>Geolocation is not supported by this browser</p></div>';
        }
    }

    // Update location on map
    function updateLocation(position) {
        const { latitude, longitude } = position.coords;
        
        // In a real app, this would update a real map (Google Maps, Leaflet, etc.)
        // For this demo, we'll just show the coordinates
        map.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marker-alt"></i>
                <p>Your current location:</p>
                <p>Latitude: ${latitude.toFixed(6)}</p>
                <p>Longitude: ${longitude.toFixed(6)}</p>
                <p class="map-note">In a real app, this would show an interactive map</p>
            </div>
        `;
        
        // In a real app, this would also send the location to selected contacts
        console.log(`Location updated: ${latitude}, ${longitude}`);
    }

    // Handle location error
    function handleLocationError(error) {
        let errorMessage;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "Location access denied. Please enable location services.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "Location request timed out.";
                break;
            default:
                errorMessage = "An unknown error occurred.";
                break;
        }
        
        map.innerHTML = `<div class="map-placeholder"><i class="fas fa-exclamation-circle"></i><p>${errorMessage}</p></div>`;
    }

    // Arrived safe button click
    arrivedSafeBtn.addEventListener('click', () => {
        // Stop location tracking
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        
        // Update user status
        currentUser.status = 'safe';
        updateUserInfo();
        
        // Reset UI
        journeyDetails.classList.add('hidden');
        arrivedSafeBtn.classList.add('hidden');
        startJourneyBtn.classList.remove('hidden');
        
        // Reset map
        map.innerHTML = '<div class="map-placeholder"><i class="fas fa-map-marked-alt"></i><p>Map will appear here during active journey</p></div>';
        
        // In a real app, this would notify selected contacts
        if (activeJourney && activeJourney.selectedContacts.length > 0) {
            console.log(`Notifying contacts that ${currentUser.name} has arrived safely`);
        }
        
        // Clear active journey
        activeJourney = null;
    });

    // Emergency button click
    emergencyBtn.addEventListener('click', () => {
        if (confirm('This will alert your emergency contacts with your current location. Continue?')) {
            // Update user status
            currentUser.status = 'emergency';
            updateUserInfo();
            
            // In a real app, this would send emergency alerts to contacts
            alert('Emergency alert sent to your contacts with your current location');
            
            // After a few seconds, reset status (in a real app, this would be handled differently)
            setTimeout(() => {
                currentUser.status = activeJourney ? 'journey' : 'safe';
                updateUserInfo();
            }, 5000);
        }
    });

    // Initialize the app
    updateContactsList();
});