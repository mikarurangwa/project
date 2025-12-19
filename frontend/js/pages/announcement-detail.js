const AnnouncementDetailPage = {
    async render(params) {
        const announcementId = params.id;
        
        if (!announcementId) {
            Toast.error('Announcement ID is required');
            window.location.hash = '#/announcements';
            return;
        }
        
        try {
            Loading.show('Loading announcement...');
            const announcement = await API.getAnnouncement(announcementId);
            this.renderAnnouncement(announcement);
        } catch (error) {
            Toast.error(error.message);
            window.location.hash = '#/announcements';
        } finally {
            Loading.hide();
        }
    },
    
    renderAnnouncement(announcement) {
        const audioUrl = Utils.getAudioUrl(announcement.audio_url);
        
        const html = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onclick="history.back()" class="text-blue-600 hover:underline mb-4">
                    ← Back to Announcements
                </button>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">${Utils.escapeHtml(announcement.title)}</h1>
                    <p class="text-gray-500 mb-6">📅 ${Utils.formatDate(announcement.created_at, true)}</p>
                    
                    <div class="mb-6">
                        <audio controls class="w-full" controlsList="nodownload">
                            <source src="${audioUrl}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                    
                    ${Auth.isAdmin() ? `
                        <div class="flex gap-2">
                            ${announcement.published ? `
                                <button id="unpublish-btn" class="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition">
                                    Unpublish
                                </button>
                            ` : `
                                <button id="publish-btn" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                                    Publish
                                </button>
                            `}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        
        $('#publish-btn').on('click', async () => {
            try {
                Loading.show('Publishing...');
                await API.publishAnnouncement(announcement.id);
                Toast.success('Announcement published');
                window.location.reload();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
        
        $('#unpublish-btn').on('click', async () => {
            try {
                Loading.show('Unpublishing...');
                await API.unpublishAnnouncement(announcement.id);
                Toast.success('Announcement unpublished');
                window.location.reload();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.AnnouncementDetailPage = AnnouncementDetailPage;