const ProfilePage = {
    user: null,
    
    async render() {
        await this.loadProfile();
    },
    
    async loadProfile() {
        try {
            Loading.show('Loading profile...');
            this.user = await API.getProfile();
            this.renderProfile();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderProfile() {
        const html = `
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            ${this.user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">${Utils.escapeHtml(this.user.full_name)}</h2>
                            <p class="text-gray-600">${Utils.escapeHtml(this.user.email)}</p>
                            <span class="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                                this.user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }">
                                ${this.user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                        </div>
                    </div>
                    
                    <form id="profile-form">
                        <div class="space-y-6">
                            <div>
                                <label for="full_name" class="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    required
                                    value="${Utils.escapeHtml(this.user.full_name)}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value="${Utils.escapeHtml(this.user.email)}"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div class="pt-4">
                                <button
                                    type="submit"
                                    class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    Update Profile
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
        $('#profile-form').on('submit', async (e) => {
            e.preventDefault();
            
            const fullName = $('#full_name').val().trim();
            const email = $('#email').val().trim();
            
            if (!Utils.validateEmail(email)) {
                Toast.error('Please enter a valid email address');
                return;
            }
            
            const submitBtn = $('#profile-form button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('Updating...');
            
            try {
                const response = await API.updateProfile({ full_name: fullName, email });
                Auth.updateUser(response.user);
                Toast.success(CONFIG.SUCCESS_MESSAGES.PROFILE_UPDATED);
                await this.loadProfile();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

window.ProfilePage = ProfilePage;
