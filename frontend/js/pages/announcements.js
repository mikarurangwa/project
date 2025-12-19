const AnnouncementsPage = {
    async render() {
        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Announcements</h1>
                    ${Auth.isAdmin() ? `
                        <a href="#/announcement-form" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            Create Announcement
                        </a>
                    ` : ''}
                </div>
                
                <div id="announcements-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Announcements will be loaded here -->
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        await this.loadAnnouncements();
    },
    
    async loadAnnouncements() {
        try {
            Loading.show('Loading announcements...');
            const response = await API.getAnnouncements();
            const announcements = response.announcements || [];
            this.renderAnnouncements(announcements);
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderAnnouncements(announcements) {
        if (announcements.length === 0) {
            $('#announcements-grid').html(`
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No announcements found</p>
                </div>
            `);
            return;
        }
        
        const html = announcements.map(announcement => `
            <div class="announcement-card bg-white rounded-lg shadow-md p-6 card-hover">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">${Utils.escapeHtml(announcement.title)}</h3>
                <p class="text-sm text-gray-500 mb-4">📅 ${Utils.formatDate(announcement.created_at)}</p>
                <div class="flex gap-2">
                    <a href="#/announcement-detail?id=${announcement.id}" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition">
                        Listen
                    </a>
                    ${Auth.isAdmin() ? `
                        <button class="delete-announcement bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" data-id="${announcement.id}">
                            Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        $('#announcements-grid').html(html);
        
        $('.delete-announcement').on('click', async (e) => {
            const id = $(e.target).data('id');
            if (!confirm('Are you sure you want to delete this announcement?')) return;
            
            try {
                Loading.show('Deleting...');
                await API.deleteAnnouncement(id);
                Toast.success('Announcement deleted successfully');
                await this.loadAnnouncements();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.AnnouncementsPage = AnnouncementsPage;