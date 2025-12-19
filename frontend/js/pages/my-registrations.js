const MyRegistrationsPage = {
    async render() {
        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">My Registered Events</h1>
                <div id="registrations-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </div>
        `;
        
        $('#app-content').html(html);
        await this.loadRegistrations();
    },
    
    async loadRegistrations() {
        try {
            Loading.show('Loading your registrations...');
            const response = await API.getMyRegistrations();
            const registrations = response.registrations || [];
            this.renderRegistrations(registrations);
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderRegistrations(registrations) {
        if (registrations.length === 0) {
            $('#registrations-grid').html(`
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg mb-4">You haven't registered for any events yet</p>
                    <a href="#/events" class="text-blue-600 hover:underline">Browse Events</a>
                </div>
            `);
            return;
        }
        
        const html = registrations.map(reg => {
            const event = reg.event;
            const imageUrl = event.metadata?.image_url ? 
                Utils.getImageUrl(event.metadata.image_url) : 
                'https://via.placeholder.com/400x300?text=Event';
            
            return `
                <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                    <img src="${imageUrl}" alt="${Utils.escapeHtml(event.title)}" class="w-full h-48 object-cover" />
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">${Utils.escapeHtml(event.title)}</h3>
                        <div class="space-y-2 text-sm text-gray-500 mb-4">
                            <p>📍 ${Utils.escapeHtml(event.location || 'TBA')}</p>
                            <p>📅 ${Utils.formatDate(event.starts_at, true)}</p>
                            <p class="text-green-600 font-semibold">✓ Registered</p>
                        </div>
                        <div class="flex gap-2">
                            <a href="#/event-detail?id=${event.id}" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition">
                                View Details
                            </a>
                            <button class="cancel-registration bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" data-id="${event.id}">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        $('#registrations-grid').html(html);
        
        $('.cancel-registration').on('click', async (e) => {
            const eventId = $(e.target).data('id');
            if (!confirm('Are you sure you want to cancel this registration?')) return;
            
            try {
                Loading.show('Cancelling registration...');
                await API.cancelEventRegistration(eventId);
                Toast.success(CONFIG.SUCCESS_MESSAGES.UNREGISTERED);
                await this.loadRegistrations();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.MyRegistrationsPage = MyRegistrationsPage;
