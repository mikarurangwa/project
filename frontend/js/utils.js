// Utility functions for CivicEvents+ Frontend

const Utils = {
    /**
     * Format date to readable string
     */
    formatDate(dateString, includeTime = false) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Format date for input fields
     */
    formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    /**
     * Validate password strength
     */
    validatePassword(password) {
        const rules = CONFIG.PASSWORD_RULES;
        const results = {
            minLength: password.length >= rules.MIN_LENGTH,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        results.isValid = results.minLength && 
                         results.hasUppercase && 
                         results.hasLowercase && 
                         results.hasNumber && 
                         results.hasSpecial;
        
        return results;
    },

    /**
     * Get password strength score (0-100)
     */
    getPasswordStrength(password) {
        const validation = this.validatePassword(password);
        let score = 0;
        
        if (validation.minLength) score += 20;
        if (validation.hasUppercase) score += 20;
        if (validation.hasLowercase) score += 20;
        if (validation.hasNumber) score += 20;
        if (validation.hasSpecial) score += 20;
        
        return score;
    },

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate file size
     */
    validateFileSize(file, maxSize) {
        return file.size <= maxSize;
    },

    /**
     * Validate file type
     */
    validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    },

    /**
     * Format file size to readable string
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * Truncate text
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    /**
     * Generate random ID
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Parse query string
     */
    parseQueryString(queryString) {
        const params = {};
        const queries = queryString.replace('?', '').split('&');
        
        queries.forEach(query => {
            const [key, value] = query.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    },

    /**
     * Build query string
     */
    buildQueryString(params) {
        return Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    },

    /**
     * Get average rating
     */
    getAverageRating(feedbacks) {
        if (!feedbacks || feedbacks.length === 0) return 0;
        const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
        return (sum / feedbacks.length).toFixed(1);
    },

    /**
     * Generate star rating HTML
     */
    generateStarRating(rating, maxStars = 5) {
        let html = '';
        for (let i = 1; i <= maxStars; i++) {
            if (i <= rating) {
                html += '<span class="star filled">★</span>';
            } else {
                html += '<span class="star">☆</span>';
            }
        }
        return html;
    },

    /**
     * Copy to clipboard
     */
    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    },

    /**
     * Check if user is on mobile device
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Scroll to top
     */
    scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    },

    /**
     * Get image URL
     */
    getImageUrl(filename) {
        if (!filename) return 'https://via.placeholder.com/400x300?text=No+Image';
        if (filename.startsWith('http')) return filename;
        return `${CONFIG.API_BASE_URL.replace('/api', '')}/uploads/events/${filename}`;
    },

    /**
     * Get audio URL
     */
    getAudioUrl(filename) {
        if (!filename) return '';
        if (filename.startsWith('http')) return filename;
        return `${CONFIG.API_BASE_URL.replace('/api', '')}/uploads/announcements/${filename}`;
    },

    /**
     * Get video URL
     */
    getVideoUrl(filename) {
        if (!filename) return '';
        if (filename.startsWith('http')) return filename;
        return `${CONFIG.API_BASE_URL.replace('/api', '')}/uploads/promos/${filename}`;
    },

    /**
     * Format duration in seconds to readable time
     */
    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Check if date is past
     */
    isPastDate(dateString) {
        return new Date(dateString) < new Date();
    },

    /**
     * Get time ago string
     */
    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 7) {
            return this.formatDate(dateString);
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMins > 0) {
            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }
};

// Make Utils available globally
window.Utils = Utils;