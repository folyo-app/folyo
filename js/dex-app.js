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

            // Setup search functionality
            DEXUI.setupSearch();

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
     */
    async loadPairs() {
        try {
            DEXUI.showLoading();
            DEXUI.hideError();

            const network = DEXUI.currentNetwork;

            // Fetch top 30 pairs for this network (or all networks)
            const data = await DEXAPI.getDexPairs(network, 30);

            if (data.data && data.data.length > 0) {
                // Render table
                DEXUI.renderPairsTable(data.data);

                // Update network name in info text
                const currentNetworkSpan = document.getElementById('current-network');
                if (currentNetworkSpan) {
                    const networkName = network === 'all' ? 'all networks' : DEXNetworks.getName(network);
                    currentNetworkSpan.textContent = networkName;
                }
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
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DEXApp.init());
} else {
    DEXApp.init();
}
