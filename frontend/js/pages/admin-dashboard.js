const AdminDashboardPage = {
    async render() {
        const html = `../index.html
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
                
                <!-- Statistics Cards -->
                <div id="stats-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"></div>
                
                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="#/event-form" class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center">
                        <div class="text-4xl mb-2">📅</div>
                        <div class="font-semibold">Create Event</div>
                    </a>
                    <a href="#/announcement-form" class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center">
                        <div class="text-4xl mb-2">📢</div>
                        <div class="font-semibold">Create Announcement</div>
                    </a>
                    <a href="#/promo-form" class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center">
                        <div class="text-4xl mb-2">🎬</div>
                        <div class="font-semibold">Create Promo</div>
                    </a>
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        await this.loadStats();
    },
    
    async loadStats() {
        try {
            Loading.show('Loading dashboard...');
            const stats = await API.getAdminDashboard();
            this.renderStats(stats);
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderStats(stats) {
        const cards = [
            { title: 'Total Events', value: stats.totalEvents || 0, icon: '📅', color: 'blue' },
            { title: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'green' },
            { title: 'Registrations', value: stats.totalRegistrations || 0, icon: '✓', color: 'purple' },
            { title: 'Announcements', value: stats.totalAnnouncements || 0, icon: '📢', color: 'orange' }
        ];
        
        const html = cards.map(card => `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm mb-1">${card.title}</p>
                        <p class="text-3xl font-bold text-gray-900">${card.value}</p>
                    </div>
                    <div class="text-4xl">${card.icon}</div>
                </div>
            </div>
        `).join('');
        
        $('#stats-cards').html(html);
    }
};

window.AdminDashboardPage = AdminDashboardPage;
