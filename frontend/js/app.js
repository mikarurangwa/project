// Main application initializer
$(document).ready(function() {
    console.log('CivicEvents+ Frontend Initialized');
    
    // Initialize router
    Router.init();
    
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        Toast.error('An unexpected error occurred');
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        Toast.error('An unexpected error occurred');
    });
});
