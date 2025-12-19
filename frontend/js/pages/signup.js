// Signup page
const SignupPage = {
    render() {
        const html = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md fade-in">
                    <div class="text-center mb-8">
                        <h1 class="text-4xl font-bold gradient-text mb-2">Create Account</h1>
                        <p class="text-gray-600">Join CivicEvents+ today</p>
                    </div>
                    
                    <form id="signup-form" class="space-y-4">
                        <div>
                            <label for="full_name" class="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="John Doe"
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
                                placeholder="Create a strong password"
                            />
                            
                            <!-- Password Strength Indicator -->
                            <div class="mt-2">
                                <div class="progress-bar">
                                    <div id="password-strength-bar" class="progress-bar-fill" style="width: 0%"></div>
                                </div>
                                <p id="password-strength-text" class="text-xs text-gray-500 mt-1"></p>
                            </div>
                            
                            <!-- Password Requirements -->
                            <div id="password-requirements" class="mt-3 text-xs space-y-1">
                                <div id="req-length" class="text-gray-400">✗ At least 8 characters</div>
                                <div id="req-uppercase" class="text-gray-400">✗ One uppercase letter</div>
                                <div id="req-lowercase" class="text-gray-400">✗ One lowercase letter</div>
                                <div id="req-number" class="text-gray-400">✗ One number</div>
                                <div id="req-special" class="text-gray-400">✗ One special character</div>
                            </div>
                        </div>
                        
                        <div>
                            <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Re-enter your password"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            class="w-full btn-primary text-white py-3 rounded-lg font-semibold transition"
                        >
                            Create Account
                        </button>
                    </form>
                    
                    <p class="mt-6 text-center text-sm text-gray-600">
                        Already have an account?
                        <a href="#/login" class="text-blue-600 hover:underline font-medium">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        this.attachEvents();
    },
    
    attachEvents() {
        // Password strength validation
        $('#password').on('input', (e) => {
            const password = e.target.value;
            const validation = Utils.validatePassword(password);
            const strength = Utils.getPasswordStrength(password);
            
            // Update progress bar
            $('#password-strength-bar').css('width', `${strength}%`);
            
            // Update strength text and color
            let strengthText = '';
            let strengthClass = '';
            
            if (strength === 0) {
                strengthText = '';
            } else if (strength < 40) {
                strengthText = 'Weak';
                strengthClass = 'password-strength-weak';
            } else if (strength < 80) {
                strengthText = 'Medium';
                strengthClass = 'password-strength-medium';
            } else {
                strengthText = 'Strong';
                strengthClass = 'password-strength-strong';
            }
            
            $('#password-strength-text').text(strengthText);
            $('#password-strength-bar')
                .removeClass('password-strength-weak password-strength-medium password-strength-strong')
                .addClass(strengthClass);
            
            // Update requirements
            $('#req-length').toggleClass('text-green-600', validation.minLength)
                           .toggleClass('text-gray-400', !validation.minLength)
                           .html(validation.minLength ? '✓ At least 8 characters' : '✗ At least 8 characters');
            
            $('#req-uppercase').toggleClass('text-green-600', validation.hasUppercase)
                              .toggleClass('text-gray-400', !validation.hasUppercase)
                              .html(validation.hasUppercase ? '✓ One uppercase letter' : '✗ One uppercase letter');
            
            $('#req-lowercase').toggleClass('text-green-600', validation.hasLowercase)
                              .toggleClass('text-gray-400', !validation.hasLowercase)
                              .html(validation.hasLowercase ? '✓ One lowercase letter' : '✗ One lowercase letter');
            
            $('#req-number').toggleClass('text-green-600', validation.hasNumber)
                           .toggleClass('text-gray-400', !validation.hasNumber)
                           .html(validation.hasNumber ? '✓ One number' : '✗ One number');
            
            $('#req-special').toggleClass('text-green-600', validation.hasSpecial)
                            .toggleClass('text-gray-400', !validation.hasSpecial)
                            .html(validation.hasSpecial ? '✓ One special character' : '✗ One special character');
        });
        
        // Form submission
        $('#signup-form').on('submit', async (e) => {
            e.preventDefault();
            
            const fullName = $('#full_name').val().trim();
            const email = $('#email').val().trim();
            const password = $('#password').val();
            const confirmPassword = $('#confirm_password').val();
            
            // Validate inputs
            if (!fullName || !email || !password || !confirmPassword) {
                Toast.error('Please fill in all fields');
                return;
            }
            
            if (!Utils.validateEmail(email)) {
                Toast.error('Please enter a valid email address');
                return;
            }
            
            const validation = Utils.validatePassword(password);
            if (!validation.isValid) {
                Toast.error('Password does not meet requirements');
                return;
            }
            
            if (password !== confirmPassword) {
                Toast.error('Passwords do not match');
                return;
            }
            
            // Show loading
            const submitBtn = $('#signup-form button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('Creating Account...');
            
            try {
                await API.signup({
                    full_name: fullName,
                    email: email,
                    password: password,
                    role: 'user'
                });
                
                Toast.success(CONFIG.SUCCESS_MESSAGES.SIGNUP);
                
                // Redirect to login
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 1500);
            } catch (error) {
                Toast.error(error.message);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

window.SignupPage = SignupPage;
