// Authentication module for CivicEvents+
// This module handles user authentication, token management, and session handling

const Auth = {
    /**
     * Get authentication token from storage
     * Checks both localStorage (persistent) and sessionStorage (session-only)
     */
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN) || 
               sessionStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    },

    /**
     * Get current user data from storage
     */
    getUser() {
        const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER) || 
                        sessionStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    },

    /**
     * Save authentication data to storage
     * @param {string} token - JWT token
     * @param {object} user - User object
     * @param {boolean} persistent - If true, use localStorage; otherwise sessionStorage
     */
    setAuth(token, user, persistent = false) {
        const storage = persistent ? localStorage : sessionStorage;
        storage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
        storage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        
        // Clear the other storage to avoid conflicts
        if (persistent) {
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        }
    },

    /**
     * Clear authentication data from storage
     */
    clearAuth() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Check if user is admin
     */
    isAdmin() {
        const user = this.getUser();
        return user && user.role === CONFIG.ROLES.ADMIN;
    },

    /**
     * Check if user is regular user
     */
    isUser() {
        const user = this.getUser();
        return user && user.role === CONFIG.ROLES.USER;
    },

    /**
     * Get user role
     */
    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    /**
     * Get user ID
     */
    getUserId() {
        const user = this.getUser();
        return user ? user.id : null;
    },

    /**
     * Get user full name
     */
    getUserName() {
        const user = this.getUser();
        return user ? user.full_name : 'User';
    },

    /**
     * Update user data in storage
     */
    updateUser(userData) {
        const currentUser = this.getUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            const isPersistent = !!localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
            const storage = isPersistent ? localStorage : sessionStorage;
            storage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        }
    },

    /**
     * Login user
     */
    async login(email, password, remember = false) {
        try {
            const response = await API.post('/auth/login', { email, password });
            this.setAuth(response.token, response.user, remember);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Signup user
     */
    async signup(userData) {
        try {
            const response = await API.post('/auth/signup', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout() {
        this.clearAuth();
        window.location.hash = '#/login';
    },

    /**
     * Handle unauthorized access (401 error)
     * This is called when the token expires or is invalid
     */
    handleUnauthorized() {
        this.clearAuth();
        Toast.show(CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 'error');
        setTimeout(() => {
            window.location.hash = '#/login';
        }, 1000);
    },

    /**
     * Handle forbidden access (403 error)
     */
    handleForbidden() {
        Toast.show(CONFIG.ERROR_MESSAGES.FORBIDDEN, 'error');
    },

    /**
     * Check if route requires authentication
     */
    requiresAuth(route) {
        const publicRoutes = [CONFIG.ROUTES.LOGIN, CONFIG.ROUTES.SIGNUP];
        return !publicRoutes.includes(route);
    },

    /**
     * Check if route requires admin role
     */
    requiresAdmin(route) {
        const adminRoutes = [
            CONFIG.ROUTES.ADMIN_DASHBOARD,
            CONFIG.ROUTES.ADMIN_USERS,
            CONFIG.ROUTES.EVENT_FORM,
            CONFIG.ROUTES.ANNOUNCEMENT_FORM,
            CONFIG.ROUTES.PROMO_FORM
        ];
        return adminRoutes.includes(route);
    },

    /**
     * Check if user can access route
     */
    canAccessRoute(route) {
        // Public routes - anyone can access
        if (!this.requiresAuth(route)) {
            return true;
        }

        // Authenticated routes - must be logged in
        if (!this.isAuthenticated()) {
            return false;
        }

        // Admin routes - must be admin
        if (this.requiresAdmin(route) && !this.isAdmin()) {
            return false;
        }

        return true;
    },

    /**
     * Redirect to appropriate page based on auth status
     */
    redirectAfterAuth() {
        if (this.isAdmin()) {
            window.location.hash = '#/admin-dashboard';
        } else {
            window.location.hash = '#/events';
        }
    },

    /**
     * Get authorization header
     */
    getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// Make Auth available globally
window.Auth = Auth;