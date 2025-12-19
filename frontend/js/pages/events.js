// Events listing page
const EventsPage = {
    currentPage: 1,
    itemsPerPage: 9,
    allEvents: [],
    filteredEvents: [],
    
    async render() {
        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Upcoming Events</h1>
                    ${Auth.isAdmin() ? `
                        <a href="#/event-form" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            Create Event
                        </a>
                    ` : ''}
                </div>
                
                <!-- Search and Filter -->
                <div class="mb-6 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        id="search-events"
                        placeholder="Search events..."
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        id="filter-date"
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        id="filter-location"
                        placeholder="Filter by location..."
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <!-- Events Grid -->
                <div id="events-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Events will be loaded here -->
                </div>
                
                <!-- Pagination -->
                <div id="pagination" class="flex justify-center gap-2"></div>
            </div>
        `;
        
        $('#app-content').html(html);
        await this.loadEvents();
        this.attachEvents();
    },
    
    async loadEvents() {
        try {
            Loading.show('Loading events...');
            const response = await API.getEvents();
            this.allEvents = response.events || [];
            this.filteredEvents = [...this.allEvents];
            this.renderEvents();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderEvents() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const eventsToShow = this.filteredEvents.slice(start, end);
        
        if (eventsToShow.length === 0) {
            $('#events-grid').html(`
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No events found</p>
                </div>
            `);
            $('#pagination').empty();
            return;
        }
        
        const eventsHtml = eventsToShow.map(event => {
            const imageUrl = event.metadata?.image_url ? 
                Utils.getImageUrl(event.metadata.image_url) : 
                'https://via.placeholder.com/400x300?text=Event';
            
            return `
                <div class="event-card bg-white rounded-lg shadow-md overflow-hidden card-hover">
                    <img src="${imageUrl}" alt="${Utils.escapeHtml(event.title)}" class="w-full h-48 object-cover" />
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">${Utils.escapeHtml(event.title)}</h3>
                        <p class="text-gray-600 text-sm mb-4">${Utils.truncateText(Utils.escapeHtml(event.description || ''), 100)}</p>
                        <div class="space-y-2 text-sm text-gray-500">
                            <p>📍 ${Utils.escapeHtml(event.location || 'TBA')}</p>
                            <p>📅 ${Utils.formatDate(event.starts_at, true)}</p>
                        </div>
                        <div class="mt-4 flex gap-2">
                            <a href="#/event-detail?id=${event.id}" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition">
                                View Details
                            </a>
                            ${Auth.isAdmin() ? `
                                <a href="#/event-form?id=${event.id}" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
                                    Edit
                                </a>
                                <button class="delete-event bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" data-id="${event.id}">
                                    Delete
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        $('#events-grid').html(eventsHtml);
        this.renderPagination();
        
        // Attach delete event handlers
        $('.delete-event').on('click', (e) => {
            const eventId = $(e.target).data('id');
            this.deleteEvent(eventId);
        });
    },
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            $('#pagination').empty();
            return;
        }
        
        let paginationHtml = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100';
            paginationHtml += `
                <button class="pagination-btn px-4 py-2 border rounded ${activeClass}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        
        $('#pagination').html(paginationHtml);
        
        $('.pagination-btn').on('click', (e) => {
            this.currentPage = parseInt($(e.target).data('page'));
            this.renderEvents();
            Utils.scrollToTop();
        });
    },
    
    filterEvents() {
        const searchTerm = $('#search-events').val().toLowerCase();
        const dateFilter = $('#filter-date').val();
        const locationFilter = $('#filter-location').val().toLowerCase();
        
        this.filteredEvents = this.allEvents.filter(event => {
            const matchesSearch = !searchTerm || 
                event.title.toLowerCase().includes(searchTerm) || 
                (event.description && event.description.toLowerCase().includes(searchTerm));
            
            const matchesDate = !dateFilter || 
                event.starts_at.startsWith(dateFilter);
            
            const matchesLocation = !locationFilter || 
                (event.location && event.location.toLowerCase().includes(locationFilter));
            
            return matchesSearch && matchesDate && matchesLocation;
        });
        
        this.currentPage = 1;
        this.renderEvents();
    },
    
    async deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }
        
        try {
            Loading.show('Deleting event...');
            await API.deleteEvent(eventId);
            Toast.success(CONFIG.SUCCESS_MESSAGES.EVENT_DELETED);
            await this.loadEvents();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    attachEvents() {
        const debounceFilter = Utils.debounce(() => this.filterEvents(), 300);
        
        $('#search-events').on('input', debounceFilter);
        $('#filter-date').on('change', debounceFilter);
        $('#filter-location').on('input', debounceFilter);
    }
};

window.EventsPage = EventsPage;
