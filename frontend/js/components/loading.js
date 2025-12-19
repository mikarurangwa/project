// Loading overlay component
const Loading = {
    /**
     * Show loading overlay
     */
    show(message = 'Loading...') {
        $('#loading-overlay').html(`
            <div class="bg-white rounded-lg p-6 text-center">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-gray-700">${Utils.escapeHtml(message)}</p>
            </div>
        `).removeClass('hidden');
    },
    
    /**
     * Hide loading overlay
     */
    hide() {
        $('#loading-overlay').addClass('hidden');
    }
};

window.Loading = Loading;
