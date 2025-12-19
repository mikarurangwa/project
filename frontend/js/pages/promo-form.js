const PromoFormPage = {
    render() {
        const html = `
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onclick="history.back()" class="text-blue-600 hover:underline mb-4">
                    ← Back
                </button>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">Create Promo</h1>
                    
                    <form id="promo-form" enctype="multipart/form-data">
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
                                    placeholder="Promo title"
                                />
                            </div>
                            
                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows="4"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe the promo..."
                                ></textarea>
                            </div>
                            
                            <div>
                                <label for="video" class="block text-sm font-medium text-gray-700 mb-2">
                                    Video File *
                                </label>
                                <input
                                    type="file"
                                    id="video"
                                    name="video"
                                    accept="video/mp4,video/webm,video/ogg"
                                    required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p class="text-xs text-gray-500 mt-1">Max size: 50MB. Formats: MP4, WebM, OGG</p>
                            </div>
                            
                            <div>
                                <label for="caption_text" class="block text-sm font-medium text-gray-700 mb-2">
                                    Captions (Optional)
                                </label>
                                <textarea
                                    id="caption_text"
                                    name="caption_text"
                                    rows="4"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add captions for accessibility..."
                                ></textarea>
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
                                    Publish promo
                                </label>
                            </div>
                            
                            <div class="flex gap-4">
                                <button
                                    type="submit"
                                    class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    Create Promo
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
        $('#video').on('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!Utils.validateFileSize(file, CONFIG.FILE_LIMITS.VIDEO_MAX_SIZE)) {
                    Toast.error(`Video size must be less than ${Utils.formatFileSize(CONFIG.FILE_LIMITS.VIDEO_MAX_SIZE)}`);
                    $('#video').val('');
                    return;
                }
                
                if (!Utils.validateFileType(file, CONFIG.FILE_LIMITS.ALLOWED_VIDEO_TYPES)) {
                    Toast.error('Please select a valid video file (MP4, WebM, OGG)');
                    $('#video').val('');
                    return;
                }
            }
        });
        
        $('#promo-form').on('submit', async (e) => {
            e.preventDefault();
            
            const title = $('#title').val().trim();
            const description = $('#description').val().trim();
            const videoFile = $('#video')[0].files[0];
            const captionText = $('#caption_text').val().trim();
            const published = $('#published').is(':checked');
            
            if (!videoFile) {
                Toast.error('Please select a video file');
                return;
            }
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('video', videoFile);
            if (captionText) formData.append('caption_text', captionText);
            formData.append('published', published);
            
            const submitBtn = $('#promo-form button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('Uploading...');
            
            try {
                await API.createPromo(formData);
                Toast.success(CONFIG.SUCCESS_MESSAGES.PROMO_CREATED);
                setTimeout(() => {
                    window.location.hash = '#/promos';
                }, 1000);
            } catch (error) {
                Toast.error(error.message);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

window.PromoFormPage = PromoFormPage;
