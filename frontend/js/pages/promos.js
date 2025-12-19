const PromosPage = {
    async render() {
        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Promotional Videos</h1>
                    ${Auth.isAdmin() ? `
                        <a href="#/promo-form" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            Create Promo
                        </a>
                    ` : ''}
                </div>
                
                <div id="promos-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Promos will be loaded here -->
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        await this.loadPromos();
    },
    
    async loadPromos() {
        try {
            Loading.show('Loading promos...');
            const response = await API.getPromos();
            const promos = response.promos || [];
            this.renderPromos(promos);
        } catch (error) {
            Toast.error(error.message);
        } finally {
            Loading.hide();
        }
    },
    
    renderPromos(promos) {
        if (promos.length === 0) {
            $('#promos-grid').html(`
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No promos found</p>
                </div>
            `);
            return;
        }
        
        const html = promos.map(promo => `
            <div class="promo-card bg-white rounded-lg shadow-md overflow-hidden card-hover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${Utils.escapeHtml(promo.title)}</h3>
                    <p class="text-gray-600 text-sm mb-4">${Utils.truncateText(Utils.escapeHtml(promo.description || ''), 100)}</p>
                    <div class="flex gap-2">
                        <a href="#/promo-detail?id=${promo.id}" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition">
                            Watch
                        </a>
                        ${Auth.isAdmin() ? `
                            <button class="delete-promo bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" data-id="${promo.id}">
                                Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        $('#promos-grid').html(html);
        
        $('.delete-promo').on('click', async (e) => {
            const id = $(e.target).data('id');
            if (!confirm('Are you sure you want to delete this promo?')) return;
            
            try {
                Loading.show('Deleting...');
                await API.deletePromo(id);
                Toast.success('Promo deleted successfully');
                await this.loadPromos();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.PromosPage = PromosPage;