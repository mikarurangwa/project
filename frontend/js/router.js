// Client-side router for CivicEvents+
const Router = {
    routes: {},
    
    /**
     * Register a route
     */
    register(path, handler) {
        this.routes[path] = handler;
    },
    
    /**
     * Navigate to a route
     */
    navigate(path, params = {}) {
        window.location.hash = `#/${path}`;
        this.handleRoute(path, params);
    },
    
    /**
     * Handle route change
     */
    handleRoute(path, params = {}) {
        // Check authentication
        if (!Auth.isAuthenticated() && path !== 'login' && path !== 'signup') {
            window.location.hash = '#/login';
            return;
        }
        
        // Redirect authenticated users away from login/signup
        if (Auth.isAuthenticated() && (path === 'login' || path === 'signup')) {
            Auth.redirectAfterAuth();
            return;
        }
        
        // Check if route requires admin
        if (Auth.requiresAdmin(path) && !Auth.isAdmin()) {
            Toast.error('Access denied. Admin privileges required.');
            Auth.redirectAfterAuth();
            return;
        }
        
        // Execute route handler
        const handler = this.routes[path];
        if (handler) {
            // Clear previous content
            $('#app-content').empty();
            
            // Render navbar
            Navbar.render();
            
            // Scroll to top
            Utils.scrollToTop();
            
            // Execute handler
            handler(params);
        } else {
            this.handle404();
        }
    },
    
    /**
     * Handle 404 - Route not found
     */
    handle404() {
        $('#app-content').html(`
            <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div class="text-center">
                    <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p class="text-xl text-gray-600 mb-8">Page not found</p>
                    <a href="#/events" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                        Go to Events
                    </a>
                </div>
            </div>
        `);
    },
    
    /**
     * Get current route
     */
    getCurrentRoute() {
        const hash = window.location.hash.replace('#/', '');
        return hash.split('?')[0] || 'login';
    },
    
    /**
     * Get route parameters from hash
     */
    getRouteParams() {
        const hash = window.location.hash;
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        return Utils.parseQueryString(queryString);
    },
    
    /**
     * Initialize router
     */
    init() {
        // Register all routes
        this.register('login', LoginPage.render);
        this.register('signup', SignupPage.render);
        this.register('events', EventsPage.render);
        this.register('event-detail', EventDetailPage.render);
        this.register('event-form', EventFormPage.render);
        this.register('announcements', AnnouncementsPage.render);
        this.register('announcement-detail', AnnouncementDetailPage.render);
        this.register('announcement-form', AnnouncementFormPage.render);
        this.register('promos', PromosPage.render);
        this.register('promo-detail', PromoDetailPage.render);
        this.register('promo-form', PromoFormPage.render);
        this.register('profile', ProfilePage.render);
        this.register('my-registrations', MyRegistrationsPage.render);
        this.register('admin-dashboard', AdminDashboardPage.render);
        this.register('admin-users', AdminUsersPage.render);
        
        // Handle hash change
        $(window).on('hashchange', () => {
            const route = this.getCurrentRoute();
            const params = this.getRouteParams();
            this.handleRoute(route, params);
        });
        
        // Handle initial route
        const initialRoute = this.getCurrentRoute();
        const initialParams = this.getRouteParams();
        
        // If no hash, redirect to appropriate page
        if (!window.location.hash) {
            if (Auth.isAuthenticated()) {
                Auth.redirectAfterAuth();
            } else {
                window.location.hash = '#/login';
            }
        } else {
            this.handleRoute(initialRoute, initialParams);
        }
    }
};

window.Router = Router;
