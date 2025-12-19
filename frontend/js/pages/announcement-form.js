const AnnouncementFormPage = {
    render() {
        const html = `
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onclick="history.back()" class="text-blue-600 hover:underline mb-4">
                    ← Back
                </button>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">Create Announcement</h1>
                    
                    <form id="announcement-form" enctype="multipart/form-data">
                        <div class="space-y-6">
                            <div>
                                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Announcement title"
                                />
                            </div>
                            
                            <div>
                                <label for="audio" class="block text-sm font-medium text-gray-700 mb-2">
                                    Audio File *
                                </label>
                                <input
                                    type="file"
                                    id="audio"
                                    name="audio"
                                    accept="audio/mpeg,audio/mp3,audio/wav"
                                    required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p class="text-xs text-gray-500 mt-1">Max size: 10MB. Formats: MP3, WAV</p>
                            </div>
                            
                            <div class="flex items-center">
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked
                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label for="published" class="ml-2 text-sm text-gray-700">
                                    Publish announcement
                                </label>
                            </div>
                            
                            <div class="flex gap-4">
                                <button
                                    type="submit"
                                    class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    Create Announcement
                                </button>
                                <button
                                    type="button"
                                    onclick="history.back()"
                                    class="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        this.attachEvents();
    },
    
    attachEvents() {
        $('#audio').on('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!Utils.validateFileSize(file, CONFIG.FILE_LIMITS.AUDIO_MAX_SIZE)) {
                    Toast.error(`Audio size must be less than ${Utils.formatFileSize(CONFIG.FILE_LIMITS.AUDIO_MAX_SIZE)}`);
                    $('#audio').val('');
                    return;
                }
                
                if (!Utils.validateFileType(file, CONFIG.FILE_LIMITS.ALLOWED_AUDIO_TYPES)) {
                    Toast.error('Please select a valid audio file (MP3, WAV)');
                    $('#audio').val('');
                    return;
                }
            }
        });
        
        $('#announcement-form').on('submit', async (e) => {
            e.preventDefault();
            
            const title = $('#title').val().trim();
            const audioFile = $('#audio')[0].files[0];
            const published = $('#published').is(':checked');
            
            if (!audioFile) {
                Toast.error('Please select an audio file');
                return;
            }
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('audio', audioFile);
            formData.append('published', published);
            
            const submitBtn = $('#announcement-form button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('Creating...');
            
            try {
                await API.createAnnouncement(formData);
                Toast.success(CONFIG.SUCCESS_MESSAGES.ANNOUNCEMENT_CREATED);
                setTimeout(() => {
                    window.location.hash = '#/announcements';
                }, 1000);
            } catch (error) {
                Toast.error(error.message);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

window.AnnouncementFormPage = AnnouncementFormPage;