// Login page
const LoginPage = {
    render() {
        const html = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md fade-in">
                    <div class="text-center mb-8">
                        <h1 class="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
                        <p class="text-gray-600">Sign in to continue to CivicEvents+</p>
                    </div>
                    
                    <form id="login-form" class="space-y-5">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <div class="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label for="remember" class="ml-2 text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            class="w-full btn-primary text-white py-3 rounded-lg font-semibold transition"
                        >
                            Sign In
                        </button>
                    </form>
                    
                    <p class="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?
                        <a href="#/signup" class="text-blue-600 hover:underline font-medium">
                            Sign up
                        </a>
                    </p>
                    
                    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p class="text-xs text-gray-600 mb-2 font-semibold">Demo Accounts:</p>
                        <p class="text-xs text-gray-600">Admin: admin@gmail.com / Password123@</p>
                        <p class="text-xs text-gray-600">User: user@gmail.com / Password123@</p>
                    </div>
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        this.attachEvents();
    },
    
    attachEvents() {
        $('#login-form').on('submit', async (e) => {
            e.preventDefault();
            
            const email = $('#email').val().trim();
            const password = $('#password').val();
            const remember = $('#remember').is(':checked');
            
            // Validate inputs
            if (!email || !password) {
                Toast.error('Please fill in all fields');
                return;
            }
            
            if (!Utils.validateEmail(email)) {
                Toast.error('Please enter a valid email address');
                return;
            }
            
            // Show loading
            const submitBtn = $('#login-form button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('Signing in...');
            
            try {
                const response = await API.login(email, password);
                Auth.setAuth(response.token, response.user, remember);
                Toast.success(CONFIG.SUCCESS_MESSAGES.LOGIN);
                
                // Redirect based on role
                setTimeout(() => {
                    Auth.redirectAfterAuth();
                }, 500);
            } catch (error) {
                Toast.error(error.message);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

window.LoginPage = LoginPage;
