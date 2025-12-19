// Configuration file for CivicEvents+ Frontend

const CONFIG = {
    // API Base URL - Change this to your backend URL
    API_BASE_URL: 'http://localhost:4000/api',
    
    // App Settings
    APP_NAME: 'CivicEvents+',
    APP_VERSION: '1.0.0',
    
    // Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'civicevents_token',
        USER: 'civicevents_user',
        REMEMBER_ME: 'civicevents_remember'
    },
    
    // Password Validation Rules
    PASSWORD_RULES: {
        MIN_LENGTH: 8,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL: true
    },
    
    // Pagination
    ITEMS_PER_PAGE: 9,
    
    // File Upload Limits
    FILE_LIMITS: {
        IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
        AUDIO_MAX_SIZE: 10 * 1024 * 1024, // 10MB
        VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
        ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg']
    },
    
    // Toast Notification Duration
    TOAST_DURATION: 4000,
    
    // Date Format
    DATE_FORMAT: {
        DISPLAY: 'MMM DD, YYYY',
        DATETIME: 'MMM DD, YYYY hh:mm A',
        INPUT: 'YYYY-MM-DD',
        DATETIME_INPUT: 'YYYY-MM-DDTHH:mm'
    },
    
    // Error Messages
    ERROR_MESSAGES: {
        NETWORK: 'Network error. Please check your connection.',
        UNAUTHORIZED: 'Your session has expired. Please login again.',
        FORBIDDEN: 'You do not have permission to perform this action.',
        NOT_FOUND: 'The requested resource was not found.',
        SERVER_ERROR: 'Server error. Please try again later.',
        VALIDATION: 'Please check your input and try again.'
    },
    
    // Success Messages
    SUCCESS_MESSAGES: {
        LOGIN: 'Login successful!',
        LOGOUT: 'Logged out successfully',
        SIGNUP: 'Account created successfully!',
        EVENT_CREATED: 'Event created successfully',
        EVENT_UPDATED: 'Event updated successfully',
        EVENT_DELETED: 'Event deleted successfully',
        REGISTERED: 'Registration successful',
        UNREGISTERED: 'Registration cancelled',
        FEEDBACK_SUBMITTED: 'Feedback submitted successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
        ANNOUNCEMENT_CREATED: 'Announcement created successfully',
        PROMO_CREATED: 'Promo created successfully'
    },
    
    // Routes
    ROUTES: {
        LOGIN: 'login',
        SIGNUP: 'signup',
        EVENTS: 'events',
        EVENT_DETAIL: 'event-detail',
        EVENT_FORM: 'event-form',
        ANNOUNCEMENTS: 'announcements',
        ANNOUNCEMENT_DETAIL: 'announcement-detail',
        ANNOUNCEMENT_FORM: 'announcement-form',
        PROMOS: 'promos',
        PROMO_DETAIL: 'promo-detail',
        PROMO_FORM: 'promo-form',
        PROFILE: 'profile',
        MY_REGISTRATIONS: 'my-registrations',
        ADMIN_DASHBOARD: 'admin-dashboard',
        ADMIN_USERS: 'admin-users'
    },
    
    // User Roles
    ROLES: {
        USER: 'user',
        ADMIN: 'admin'
    }
};

// Make CONFIG available globally

window.CONFIG = CONFIG;
