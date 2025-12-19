// Event form page (Create/Edit)
const EventFormPage = {
    eventId: null,
    isEditMode: false,
    imagePreview: null,
    
    async render(params) {
        this.eventId = params.id || null;
        this.isEditMode = !!this.eventId;
        
        if (this.isEditMode) {
            await this.loadEvent();
        } else {
            this.renderForm();
        }
    },
    
    async loadEvent() {
        try {
            Loading.show('Loading event...');
            const event = await API.getEvent(this.eventId);
            this.renderForm(event);
        } catch (error) {
            Toast.error(error.message);
            window.location.hash = '#/events';
        } finally {
            Loading.hide();
        }
    },
    
    renderForm(event = null) {
        const html = `
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onclick="history.back()" class="text-blue-600 hover:underline mb-4">
                    ← Back
                </button>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">
                        ${this.isEditMode ? 'Edit Event' : 'Create New Event'}
                    </h1>
                    
                    <form id="event-form" enctype="multipart/form-data">
                        <div class="space-y-6">
                            <div>
                                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value="${event ? Utils.escapeHtml(event.title) : ''}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Community Town Hall Meeting"
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
                                    rows="6"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Provide details about the event..."
                                >${event ? Utils.escapeHtml(event.description || '') : ''}</textarea>
                            </div>
                            
                            <div>
                                <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    value="${event ? Utils.escapeHtml(event.location || '') : ''}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., City Hall, 123 Main St"
                                />
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="starts_at" class="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="starts_at"
                                        name="starts_at"
                                        required
                                        value="${event ? Utils.formatDateForInput(event.starts_at) : ''}"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label for="ends_at" class="block text-sm font-medium text-gray-700 mb-2">
                                        End Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="ends_at"
                                        name="ends_at"
                                        required
                                        value="${event ? Utils.formatDateForInput(event.ends_at) : ''}"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
                                    Event Image ${this.isEditMode ? '(Leave empty to keep current image)' : '*'}
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    ${!this.isEditMode ? 'required' : ''}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p class="text-xs text-gray-500 mt-1">Max size: 5MB. Formats: JPG, PNG, GIF</p>
                            </div>
                            
                            ${event && event.metadata?.image_url ? `
                                <div>
                                    <p class="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                                    <img src="${Utils.getImageUrl(event.metadata.image_url)}" alt="Current event image" class="max-w-sm rounded-lg" />
                                </div>
                            ` : ''}
                            
                            <div id="image-preview" class="hidden">
                                <p class="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                                <img id="preview-img" src="" alt="Preview" class="max-w-sm rounded-lg" />
                            </div>
                            
                            <div class="flex items-center">
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    ${!event || event.published ? 'checked' : ''}
                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label for="published" class="ml-2 text-sm text-gray-700">
                                    Publish event (make it visible to users)
                                </label>
                            </div>
                            
                            <div class="flex gap-4">
                                <button
                                    type="submit"
                                    class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    ${this.isEditMode ? 'Update Event' : 'Create Event'}
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
        // Image preview
        $('#image').on('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size
                if (!Utils.validateFileSize(file, CONFIG.FILE_LIMITS.IMAGE_MAX_SIZE)) {
                    Toast.error(`Image size must be less than ${Utils.formatFileSize(CONFIG.FILE_LIMITS.IMAGE_MAX_SIZE)}`);
                    $('#image').val('');
                    return;
                }
                
                // Validate file type
                if (!Utils.validateFileType(file, CONFIG.FILE_LIMITS.ALLOWED_IMAGE_TYPES)) {
                    Toast.error('Please select a valid image file (JPG, PNG, GIF)');
                    $('#image').val('');
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    $('#preview-img').attr('src', e.target.result);
                    $('#image-preview').removeClass('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                $('#image-preview').addClass('hidden');
            }
        });
        
        // Form submission
        $('#event-form').on('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const title = $('#title').val().trim();
            const description = $('#description').val().trim();
            const location = $('#location').val().trim();
            const startsAt = $('#starts_at').val();
            const endsAt = $('#ends_at').val();
            const published = $('#published').is(':checked');
            const imageFile = $('#image')[0].files[0];
            
            // Validate dates
            if (new Date(startsAt) >= new Date(endsAt)) {
                Toast.error('End date must be after start date');
                return;
            }
            
            // Validate image for new events
            if (!this.isEditMode && !imageFile) {
                Toast.error('Please select an image');
                return;
            }
            
            // Create FormData
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('starts_at', startsAt);
            formData.append('ends_at', endsAt);
            formData.append('published', published);
            
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            // Show loading
            const submitBtn = $('#event-form button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text(this.isEditMode ? 'Updating...' : 'Creating...');
            
            try {
                if (this.isEditMode) {
                    await API.updateEvent(this.eventId, formData);
                    Toast.success(CONFIG.SUCCESS_MESSAGES.EVENT_UPDATED);
                } else {
                    await API.createEvent(formData);
                    Toast.success(CONFIG.SUCCESS_MESSAGES.EVENT_CREATED);
                }
                
                setTimeout(() => {
                    window.location.hash = '#/events';
                }, 1000);
            } catch (error) {
                Toast.error(error.message);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

window.EventFormPage = EventFormPage;