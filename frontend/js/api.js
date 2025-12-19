// API module for CivicEvents+
// Handles all API requests to the backend

const API = {
    /**
     * Make a GET request
     */
    async get(endpoint, params = {}) {
        const queryString = Utils.buildQueryString(params);
        const url = `${CONFIG.API_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeader()
                }
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Make a POST request
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Make a PUT request
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Make a PATCH request
     */
    async patch(endpoint, data = {}) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Make a DELETE request
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...Auth.getAuthHeader()
                }
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Upload file with form data
     */
    async uploadFormData(endpoint, formData, method = 'POST') {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    ...Auth.getAuthHeader()
                },
                body: formData
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Handle API response
     */
    async handleResponse(response) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
            Auth.handleUnauthorized();
            throw new Error(CONFIG.ERROR_MESSAGES.UNAUTHORIZED);
        }

        // Handle 403 Forbidden
        if (response.status === 403) {
            Auth.handleForbidden();
            throw new Error(CONFIG.ERROR_MESSAGES.FORBIDDEN);
        }

        // Handle 404 Not Found
        if (response.status === 404) {
            throw new Error(CONFIG.ERROR_MESSAGES.NOT_FOUND);
        }

        // Parse response
        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
            throw new Error(data.message || data.error || CONFIG.ERROR_MESSAGES.SERVER_ERROR);
        }

        return data;
    },

    /**
     * Handle API errors
     */
    handleError(error) {
        console.error('API Error:', error);
        
        if (error.message) {
            return error;
        }
        
        if (!navigator.onLine) {
            return new Error(CONFIG.ERROR_MESSAGES.NETWORK);
        }
        
        return new Error(CONFIG.ERROR_MESSAGES.SERVER_ERROR);
    },

    // ========== Auth Endpoints ==========
    
    login(email, password) {
        return this.post('/auth/login', { email, password });
    },

    signup(userData) {
        return this.post('/auth/signup', userData);
    },

    // ========== User Endpoints ==========
    
    getUsers() {
        return this.get('/users');
    },

    getUser(userId) {
        return this.get(`/users/${userId}`);
    },

    getProfile() {
        return this.get('/users/profile/me');
    },

    updateProfile(data) {
        return this.patch('/users/profile/me', data);
    },

    enableUser(userId) {
        return this.patch(`/users/${userId}/enable`);
    },

    disableUser(userId) {
        return this.patch(`/users/${userId}/disable`);
    },

    // ========== Event Endpoints ==========
    
    getEvents(params = {}) {
        return this.get('/events', params);
    },

    getEvent(eventId) {
        return this.get(`/events/${eventId}`);
    },

    createEvent(formData) {
        return this.uploadFormData('/events', formData, 'POST');
    },

    updateEvent(eventId, formData) {
        return this.uploadFormData(`/events/${eventId}`, formData, 'PUT');
    },

    deleteEvent(eventId) {
        return this.delete(`/events/${eventId}`);
    },

    // ========== Event Registration Endpoints ==========
    
    registerForEvent(eventId) {
        return this.post('/event-registrations/register', { event_id: eventId });
    },

    cancelEventRegistration(eventId) {
        return this.post('/event-registrations/cancel', { event_id: eventId });
    },

    getMyRegistrations() {
        return this.get('/event-registrations/my-registrations');
    },

    getEventAttendees(eventId) {
        return this.get(`/event-registrations/event/${eventId}/attendees`);
    },

    // ========== Event Feedback Endpoints ==========
    
    submitFeedback(eventId, rating, comment) {
        return this.post('/event-feedback', { event_id: eventId, rating, comment });
    },

    updateFeedback(feedbackId, rating, comment) {
        return this.put(`/event-feedback/${feedbackId}`, { rating, comment });
    },

    getMyFeedback() {
        return this.get('/event-feedback/my-feedback');
    },

    getEventFeedback(eventId) {
        return this.get(`/event-feedback/event/${eventId}`);
    },

    // ========== Announcement Endpoints ==========
    
    getAnnouncements() {
        return this.get('/announcements');
    },

    getAnnouncement(announcementId) {
        return this.get(`/announcements/${announcementId}`);
    },

    createAnnouncement(formData) {
        return this.uploadFormData('/announcements', formData, 'POST');
    },

    updateAnnouncement(announcementId, formData) {
        return this.uploadFormData(`/announcements/${announcementId}`, formData, 'PUT');
    },

    deleteAnnouncement(announcementId) {
        return this.delete(`/announcements/${announcementId}`);
    },

    publishAnnouncement(announcementId) {
        return this.patch(`/announcements/${announcementId}/publish`);
    },

    unpublishAnnouncement(announcementId) {
        return this.patch(`/announcements/${announcementId}/unpublish`);
    },

    // ========== Promo Endpoints ==========
    
    getPromos() {
        return this.get('/promos');
    },

    getPromo(promoId) {
        return this.get(`/promos/${promoId}`);
    },

    createPromo(formData) {
        return this.uploadFormData('/promos', formData, 'POST');
    },

    updatePromo(promoId, formData) {
        return this.uploadFormData(`/promos/${promoId}`, formData, 'PUT');
    },

    deletePromo(promoId) {
        return this.delete(`/promos/${promoId}`);
    },

    publishPromo(promoId) {
        return this.patch(`/promos/${promoId}/publish`);
    },

    unpublishPromo(promoId) {
        return this.patch(`/promos/${promoId}/unpublish`);
    },

    // ========== Notification Endpoints ==========
    
    getNotifications() {
        return this.get('/notifications');
    },

    getNotification(notificationId) {
        return this.get(`/notifications/${notificationId}`);
    },

    deleteNotification(notificationId) {
        return this.delete(`/notifications/${notificationId}`);
    },

    // ========== Dashboard Endpoints ==========
    
    getAdminDashboard() {
        return this.get('/dashboard/admin');
    },

    getUserDashboard() {
        return this.get('/dashboard/me');
    }
};

// Make API available globally
window.API = API;