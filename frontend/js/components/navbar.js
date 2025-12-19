// Navigation bar component
const Navbar = {
    render() {
        const user = Auth.getUser();
        if (!user) {
            $('#navbar').addClass('hidden');
            $('#footer').addClass('hidden');
            return;
        }
        
        $('#navbar').removeClass('hidden');
        $('#footer').removeClass('hidden');
        
        const isAdmin = Auth.isAdmin();
        
        const navHtml = `
            <nav class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <a href="#/events" class="text-2xl font-bold gradient-text">CivicEvents+</a>
                        </div>
                        
                        <!-- Desktop Menu -->
                        <div class="hidden md:flex items-center space-x-6">
                            <a href="#/events" class="nav-link text-gray-700 hover:text-blue-600 transition">
                                Events
                            </a>
                            <a href="#/announcements" class="nav-link text-gray-700 hover:text-blue-600 transition">
                                Announcements
                            </a>
                            <a href="#/promos" class="nav-link text-gray-700 hover:text-blue-600 transition">
                                Promos
                            </a>
                            <a href="#/my-registrations" class="nav-link text-gray-700 hover:text-blue-600 transition">
                                My Events
                            </a>
                            ${isAdmin ? `
                                <a href="#/admin-dashboard" class="nav-link text-gray-700 hover:text-blue-600 transition">
                                    Dashboard
                                </a>
                            ` : ''}
                            
                            <!-- User Dropdown -->
                            <div class="relative">
                                <button id="user-menu-button" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                                    <span class="font-medium">${Utils.escapeHtml(user.full_name)}</span>
                                    <span class="text-sm">▼</span>
                                </button>
                                <div id="user-dropdown" class="dropdown-menu">
                                    <a href="#/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </a>
                                    ${isAdmin ? `
                                        <a href="#/admin-users" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Manage Users
                                        </a>
                                    ` : ''}
                                    <button id="logout-btn" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Mobile Menu Button -->
                        <button id="mobile-menu-button" class="md:hidden text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden md:hidden border-t">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <a href="#/events" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Events
                        </a>
                        <a href="#/announcements" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Announcements
                        </a>
                        <a href="#/promos" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Promos
                        </a>
                        <a href="#/my-registrations" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            My Events
                        </a>
                        ${isAdmin ? `
                            <a href="#/admin-dashboard" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                                Dashboard
                            </a>
                        ` : ''}
                        <a href="#/profile" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Profile
                        </a>
                        ${isAdmin ? `
                            <a href="#/admin-users" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                                Manage Users
                            </a>
                        ` : ''}
                        <button id="mobile-logout-btn" class="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        `;
        
        $('#navbar').html(navHtml);
        this.attachEvents();
    },
    
    attachEvents() {
        // User menu dropdown
        $('#user-menu-button').on('click', (e) => {
            e.stopPropagation();
            $('#user-dropdown').toggleClass('show');
        });
        
        // Close dropdown when clicking outside
        $(document).on('click', () => {
            $('#user-dropdown').removeClass('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        $('#user-dropdown').on('click', (e) => {
            e.stopPropagation();
        });
        
        // Mobile menu toggle
        $('#mobile-menu-button').on('click', () => {
            $('#mobile-menu').toggleClass('hidden');
        });
        
        // Logout buttons
        $('#logout-btn, #mobile-logout-btn').on('click', () => {
            Auth.logout();
            Toast.success(CONFIG.SUCCESS_MESSAGES.LOGOUT);
        });
        
        // Close mobile menu on link click
        $('#mobile-menu a').on('click', () => {
            $('#mobile-menu').addClass('hidden');
        });
    }
};

window.Navbar = Navbar;
