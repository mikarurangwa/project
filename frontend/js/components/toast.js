// Toast notification component
const Toast = {
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'error', 'info', 'warning'
     * @param {number} duration - Duration in milliseconds (default: 4000)
     */
    show(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        const toastId = Utils.generateId();
        const iconMap = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        };
        
        const toast = $(`
            <div id="${toastId}" class="toast toast-${type} rounded-lg shadow-lg p-4 mb-3 flex items-center gap-3 text-white animate-slide-in">
                <span class="text-xl font-bold">${iconMap[type]}</span>
                <span class="flex-1">${Utils.escapeHtml(message)}</span>
                <button class="close-toast hover:opacity-75 transition">
                    <span class="text-xl">×</span>
                </button>
            </div>
        `);
        
        $('#toast-container').append(toast);
        
        // Close button click
        toast.find('.close-toast').on('click', () => {
            this.hide(toastId);
        });
        
        // Auto-hide after duration
        setTimeout(() => {
            this.hide(toastId);
        }, duration);
    },
    
    /**
     * Hide a specific toast
     */
    hide(toastId) {
        const toast = $(`#${toastId}`);
        toast.fadeOut(300, function() {
            $(this).remove();
        });
    },
    
    /**
     * Show success toast
     */
    success(message) {
        this.show(message, 'success');
    },
    
    /**
     * Show error toast
     */
    error(message) {
        this.show(message, 'error');
    },
    
    /**
     * Show info toast
     */
    info(message) {
        this.show(message, 'info');
    },
    
    /**
     * Show warning toast
     */
    warning(message) {
        this.show(message, 'warning');
    }
};

window.Toast = Toast;
