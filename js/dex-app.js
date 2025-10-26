/**
 * Folyo - DEX Application
 */

const DEXApp = {
    /**
     * Initialize the DEX application
     */
    async init() {
        try {
            // Initialize managers from main app
            ThemeManager.init();
            // Note: Currency selector not available on DEX page

            // Render network filters
            DEXUI.renderNetworkFilters();

            // Load pairs data
            await this.loadPairs();

        } catch (error) {
            console.error('Error initializing DEX app:', error);
            console.error('Error stack:', error.stack);
            DEXUI.showError(`Failed to initialize DEX page: ${error.message}. Please check console for details.`);
        }
    },

    /**
     * Load DEX pairs
     * @param {string} scrollId - Optional scroll ID for pagination
     */
    async loadPairs(scrollId = '') {
        try {
            DEXUI.showLoading();
            DEXUI.hideError();

            const network = DEXUI.currentNetwork;

            // Note: DEX API free tier has limit of 25 items per page
            const data = await DEXAPI.getDexPairs(network, 25, scrollId);

            if (data.data && data.data.length > 0) {
                // Extract scroll_id from first item
                const nextScrollId = data.data[0].scroll_id || null;
                DEXUI.currentScrollId = nextScrollId;

                // Render table
                DEXUI.renderPairsTable(data.data);

                // Update pagination
                this.updatePaginationState();
            } else {
                DEXUI.renderPairsTable([]);
            }

            DEXUI.hideLoading();

        } catch (error) {
            console.error('Error loading pairs:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            DEXUI.hideLoading();
            DEXUI.showError(`Failed to load DEX pairs: ${error.message}. Check console for details.`);
        }
    },

    /**
     * Load next page
     */
    async loadNextPage() {
        if (!DEXUI.currentScrollId) return;

        // Save current scroll ID to history
        DEXUI.previousScrollIds.push(DEXUI.currentScrollId);

        await this.loadPairs(DEXUI.currentScrollId);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Load previous page
     */
    async loadPrevPage() {
        if (DEXUI.previousScrollIds.length === 0) {
            // First page - reload without scroll_id
            await this.loadPairs('');
        } else {
            // Go back to previous scroll_id
            const prevScrollId = DEXUI.previousScrollIds.pop();
            await this.loadPairs(prevScrollId);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Update pagination button states
     */
    updatePaginationState() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (prevBtn) {
            prevBtn.disabled = DEXUI.previousScrollIds.length === 0 && !DEXUI.currentScrollId;
        }

        if (nextBtn) {
            nextBtn.disabled = !DEXUI.currentScrollId;
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DEXApp.init());
} else {
    DEXApp.init();
}
