const AdminUsersPage = {
    async render() {
        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
                <div id="users-table" class="bg-white rounded-lg shadow-lg overflow-hidden"></div>
            </div>
        `;
        
        $('#app-content').html(html);
        await this.loadUsers();
    },
    
    async loadUsers() {
        try {
            Loading.show('Loading users...');
            const response = await API.getUsers();
            const users = response.users || [];
            this.renderUsers(users);
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderUsers(users) {
        const html = `
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${users.map(user => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                        ${user.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-medium text-gray-900">${Utils.escapeHtml(user.full_name)}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Utils.escapeHtml(user.email)}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }">
                                    ${user.role}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${user.is_active ? 'Active' : 'Disabled'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                ${user.is_active ? `
                                    <button class="disable-user text-red-600 hover:text-red-800" data-id="${user.id}">
                                        Disable
                                    </button>
                                ` : `
                                    <button class="enable-user text-green-600 hover:text-green-800" data-id="${user.id}">
                                        Enable
                                    </button>
                                `}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        $('#users-table').html(html);
        
        $('.enable-user').on('click', async (e) => {
            const userId = $(e.target).data('id');
            try {
                Loading.show('Enabling user...');
                await API.enableUser(userId);
                Toast.success('User enabled successfully');
                await this.loadUsers();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
        
        $('.disable-user').on('click', async (e) => {
            const userId = $(e.target).data('id');
            if (!confirm('Are you sure you want to disable this user?')) return;
            
            try {
                Loading.show('Disabling user...');
                await API.disableUser(userId);
                Toast.success('User disabled successfully');
                await this.loadUsers();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.AdminUsersPage = AdminUsersPage;
