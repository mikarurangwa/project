// Event detail page
const EventDetailPage = {
    eventId: null,
    event: null,
    isRegistered: false,
    
    async render(params) {
        this.eventId = params.id;
        
        if (!this.eventId) {
            Toast.error('Event ID is required');
            window.location.hash = '#/events';
            return;
        }
        
        await this.loadEvent();
    },
    
    async loadEvent() {
        try {
            Loading.show('Loading event details...');
            this.event = await API.getEvent(this.eventId);
            await this.checkRegistrationStatus();
            this.renderEvent();
            await this.loadFeedback();
            if (Auth.isAdmin()) {
                await this.loadAttendees();
            }
        } catch (error) {
            Toast.error(error.message);
            window.location.hash = '#/events';
        } finally {
            Loading.hide();
        }
    },
    
    async checkRegistrationStatus() {
        try {
            const response = await API.getMyRegistrations();
            this.isRegistered = response.registrations?.some(reg => reg.event_id === this.eventId);
        } catch (error) {
            this.isRegistered = false;
        }
    },
    
    renderEvent() {
        const imageUrl = this.event.metadata?.image_url ? 
            Utils.getImageUrl(this.event.metadata.image_url) : 
            'https://via.placeholder.com/800x400?text=Event';
        
        const html = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onclick="history.back()" class="text-blue-600 hover:underline mb-4">
                    ← Back to Events
                </button>
                
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src="${imageUrl}" alt="${Utils.escapeHtml(this.event.title)}" class="w-full h-96 object-cover" />
                    
                    <div class="p-8">
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">${Utils.escapeHtml(this.event.title)}</h1>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div class="flex items-start gap-2">
                                <span class="text-2xl">📅</span>
                                <div>
                                    <p class="font-semibold">Date & Time</p>
                                    <p class="text-gray-600">${Utils.formatDate(this.event.starts_at, true)}</p>
                                    <p class="text-gray-600">to ${Utils.formatDate(this.event.ends_at, true)}</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-2">
                                <span class="text-2xl">📍</span>
                                <div>
                                    <p class="font-semibold">Location</p>
                                    <p class="text-gray-600">${Utils.escapeHtml(this.event.location || 'TBA')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <h2 class="text-2xl font-bold mb-3">Description</h2>
                            <p class="text-gray-700 whitespace-pre-line">${Utils.escapeHtml(this.event.description || 'No description provided')}</p>
                        </div>
                        
                        ${!Auth.isAdmin() ? `
                            <div class="mb-8">
                                ${this.isRegistered ? `
                                    <button id="cancel-registration-btn" class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition">
                                        Cancel Registration
                                    </button>
                                    <p class="text-green-600 mt-2">✓ You are registered for this event</p>
                                ` : `
                                    <button id="register-btn" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                                        Register for Event
                                    </button>
                                `}
                            </div>
                        ` : ''}
                        
                        ${Auth.isAdmin() ? `
                            <div id="attendees-section" class="mb-8">
                                <h2 class="text-2xl font-bold mb-3">Registered Attendees</h2>
                                <div id="attendees-list"></div>
                            </div>
                        ` : ''}
                        
                        <div id="feedback-section">
                            <h2 class="text-2xl font-bold mb-4">Event Feedback</h2>
                            <div id="feedback-stats" class="mb-4"></div>
                            <div id="feedback-list" class="space-y-4"></div>
                            
                            ${!Auth.isAdmin() ? `
                                <div class="mt-6 p-6 bg-gray-50 rounded-lg">
                                    <h3 class="text-xl font-semibold mb-4">Leave Your Feedback</h3>
                                    <form id="feedback-form">
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                            <div class="rating-stars">
                                                <span class="star text-4xl cursor-pointer" data-rating="1">☆</span>
                                                <span class="star text-4xl cursor-pointer" data-rating="2">☆</span>
                                                <span class="star text-4xl cursor-pointer" data-rating="3">☆</span>
                                                <span class="star text-4xl cursor-pointer" data-rating="4">☆</span>
                                                <span class="star text-4xl cursor-pointer" data-rating="5">☆</span>
                                            </div>
                                            <input type="hidden" id="rating" name="rating" value="0" required />
                                        </div>
                                        
                                        <div class="mb-4">
                                            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                rows="4"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Share your experience..."
                                            ></textarea>
                                        </div>
                                        
                                        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                                            Submit Feedback
                                        </button>
                                    </form>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        this.attachEvents();
    },
    
    async loadFeedback() {
        try {
            const response = await API.getEventFeedback(this.eventId);
            const feedbacks = response.feedback || [];
            
            if (feedbacks.length > 0) {
                const avgRating = Utils.getAverageRating(feedbacks);
                $('#feedback-stats').html(`
                    <div class="flex items-center gap-4">
                        <div class="text-4xl font-bold">${avgRating}</div>
                        <div>
                            <div class="rating-stars">
                                ${Utils.generateStarRating(parseFloat(avgRating))}
                            </div>
                            <p class="text-sm text-gray-600">${feedbacks.length} review${feedbacks.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                `);
                
                const feedbackHtml = feedbacks.map(feedback => `
                    <div class="border rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <p class="font-semibold">${Utils.escapeHtml(feedback.user_name || 'Anonymous')}</p>
                                <div class="rating-stars text-sm">
                                    ${Utils.generateStarRating(feedback.rating)}
                                </div>
                            </div>
                            <p class="text-sm text-gray-500">${Utils.getTimeAgo(feedback.created_at)}</p>
                        </div>
                        <p class="text-gray-700">${Utils.escapeHtml(feedback.comment || '')}</p>
                    </div>
                `).join('');
                
                $('#feedback-list').html(feedbackHtml);
            } else {
                $('#feedback-stats').html('<p class="text-gray-500">No ratings yet</p>');
                $('#feedback-list').html('<p class="text-gray-500">No feedback yet. Be the first to review!</p>');
            }
        } catch (error) {
            console.error('Error loading feedback:', error);
        }
    },
    
    async loadAttendees() {
        try {
            const response = await API.getEventAttendees(this.eventId);
            const attendees = response.attendees || [];
            
            if (attendees.length > 0) {
                const attendeesHtml = `
                    <p class="text-gray-600 mb-3">${attendees.length} registered attendee${attendees.length !== 1 ? 's' : ''}</p>
                    <div class="space-y-2">
                        ${attendees.map(attendee => `
                            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
                                <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                    ${attendee.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p class="font-medium">${Utils.escapeHtml(attendee.full_name)}</p>
                                    <p class="text-sm text-gray-600">${Utils.escapeHtml(attendee.email)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                $('#attendees-list').html(attendeesHtml);
            } else {
                $('#attendees-list').html('<p class="text-gray-500">No registrations yet</p>');
            }
        } catch (error) {
            console.error('Error loading attendees:', error);
        }
    },
    
    attachEvents() {
        // Registration
        $('#register-btn').on('click', async () => {
            try {
                Loading.show('Registering...');
                await API.registerForEvent(this.eventId);
                Toast.success(CONFIG.SUCCESS_MESSAGES.REGISTERED);
                await this.loadEvent();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
        
        // Cancel registration
        $('#cancel-registration-btn').on('click', async () => {
            if (!confirm('Are you sure you want to cancel your registration?')) return;
            
            try {
                Loading.show('Cancelling registration...');
                await API.cancelEventRegistration(this.eventId);
                Toast.success(CONFIG.SUCCESS_MESSAGES.UNREGISTERED);
                await this.loadEvent();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
        
        // Rating stars
        let selectedRating = 0;
        $('.star').on('click', function() {
            selectedRating = $(this).data('rating');
            $('#rating').val(selectedRating);
            
            $('.star').each(function(index) {
                if (index < selectedRating) {
                    $(this).text('★').addClass('filled');
                } else {
                    $(this).text('☆').removeClass('filled');
                }
            });
        });
        
        // Feedback form
        $('#feedback-form').on('submit', async (e) => {
            e.preventDefault();
            
            const rating = parseInt($('#rating').val());
            const comment = $('#comment').val().trim();
            
            if (rating === 0) {
                Toast.error('Please select a rating');
                return;
            }
            
            try {
                Loading.show('Submitting feedback...');
                await API.submitFeedback(this.eventId, rating, comment);
                Toast.success(CONFIG.SUCCESS_MESSAGES.FEEDBACK_SUBMITTED);
                $('#feedback-form')[0].reset();
                $('#rating').val(0);
                $('.star').text('☆').removeClass('filled');
                await this.loadFeedback();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.EventDetailPage = EventDetailPage;
