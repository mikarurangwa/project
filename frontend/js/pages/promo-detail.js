const PromoDetailPage = {
    async render(params) {
        const promoId = params.id;
        
        if (!promoId) {
            Toast.error('Promo ID is required');
            window.location.hash = '#/promos';
            return;
        }
        
        try {
            Loading.show('Loading promo...');
            const promo = await API.getPromo(promoId);
            this.renderPromo(promo);
        } catch (error) {
            Toast.error(error.message);
            window.location.hash = '#/promos';
        } finally {
            Loading.hide();
        }
    },
    
    renderPromo(promo) {
        const videoUrl = Utils.getVideoUrl(promo.video_url);
        
        const html = `
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onclick="history.back()" class="text-blue-600 hover:underline mb-4">
                    ← Back to Promos
                </button>
                
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">${Utils.escapeHtml(promo.title)}</h1>
                    <p class="text-gray-600 mb-6">${Utils.escapeHtml(promo.description || '')}</p>
                    
                    <div class="mb-6">
                        <video controls class="w-full rounded-lg" controlsList="nodownload">
                            <source src="${videoUrl}" type="video/mp4">
                            ${promo.caption_text ? `<track kind="captions" src="data:text/vtt;base64,${btoa(promo.caption_text)}" srclang="en" label="English" default>` : ''}
                            Your browser does not support the video element.
                        </video>
                    </div>
                    
                    ${Auth.isAdmin() ? `
                        <div class="flex gap-2">
                            ${promo.published ? `
                                <button id="unpublish-btn" class="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition">
                                    Unpublish
                                </button>
                            ` : `
                                <button id="publish-btn" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                                    Publish
                                </button>
                            `}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        $('#app-content').html(html);
        
        $('#publish-btn').on('click', async () => {
            try {
                Loading.show('Publishing...');
                await API.publishPromo(promo.id);
                Toast.success('Promo published');
                window.location.reload();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
        
        $('#unpublish-btn').on('click', async () => {
            try {
                Loading.show('Unpublishing...');
                await API.unpublishPromo(promo.id);
                Toast.success('Promo unpublished');
                window.location.reload();
            } catch (error) {
                Toast.error(error.message);
            } finally {
                Loading.hide();
            }
        });
    }
};

window.PromoDetailPage = PromoDetailPage;