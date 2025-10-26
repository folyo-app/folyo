/**
 * Folyo - DEX Pair Detail Page
 * Handles DEX pair detail page logic
 */

const DexPairDetail = {
    contractAddress: null,
    networkSlug: null,
    pairData: null,
    refreshIntervalId: null,

    /**
     * Initialize the page
     */
    async init() {
        // Get contract address and network slug from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.contractAddress = urlParams.get('contract');
        this.networkSlug = urlParams.get('network') || 'Ethereum';

        if (!this.contractAddress) {
            this.showError('No pair contract address specified');
            return;
        }

        // Initialize managers
        ThemeManager.init();

        // Setup event listeners
        this.setupEventListeners();

        // Load data
        await this.loadData();

        // Setup auto-refresh for quotes
        this.setupAutoRefresh();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
    },

    /**
     * Load all data
     */
    async loadData() {
        try {
            this.showLoading();

            // Fetch pair quotes
            const response = await DexPairAPI.getPairQuotes(this.contractAddress, this.networkSlug);

            // Extract data (API returns array with single pair)
            if (!response.data || response.data.length === 0) {
                throw new Error('Pair not found');
            }

            this.pairData = response.data[0];

            // Render page
            this.renderPage();

            this.hideLoading();

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load DEX pair data. Please try again.');
        }
    },

    /**
     * Render page with data
     */
    renderPage() {
        const quote = this.pairData.quote?.[0] || {};

        // Update page title
        document.getElementById('page-title').textContent = `${this.pairData.name} - ${this.networkSlug} | Folyo`;

        // Update breadcrumb
        document.getElementById('breadcrumb-name').textContent = this.pairData.name;

        // Pair Header - Token Icons
        const baseTokenIcon = this.pairData.base_asset_ucid
            ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${this.pairData.base_asset_ucid}.png`
            : '';
        const quoteTokenIcon = this.pairData.quote_asset_ucid
            ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${this.pairData.quote_asset_ucid}.png`
            : '';

        if (baseTokenIcon) {
            document.getElementById('base-token-logo').src = baseTokenIcon;
            document.getElementById('base-token-logo').alt = this.pairData.base_asset_symbol;
        }
        if (quoteTokenIcon) {
            document.getElementById('quote-token-logo').src = quoteTokenIcon;
            document.getElementById('quote-token-logo').alt = this.pairData.quote_asset_symbol;
        }

        // Pair Name
        document.getElementById('pair-name').textContent = this.pairData.name;

        // Network Badge
        const networkColor = DEXNetworks.getColor(this.networkSlug);
        const networkIcon = DEXNetworks.getIcon(this.networkSlug);
        const networkBadge = document.getElementById('network-badge');
        networkBadge.textContent = this.networkSlug;
        networkBadge.style.background = networkColor;
        if (networkIcon) {
            networkBadge.innerHTML = `${networkIcon} ${this.networkSlug}`;
        }

        // DEX Badge
        const dexName = this.formatDexName(this.pairData.dex_slug);
        document.getElementById('dex-badge').textContent = dexName;

        // Price
        document.getElementById('pair-price').textContent = '$' + this.formatPrice(quote.price || 0);

        // Price changes
        this.renderPriceChange('change-1h', quote.percent_change_price_1h, '1h');
        this.renderPriceChange('change-24h', quote.percent_change_price_24h, '24h');

        // Stats
        document.getElementById('stat-liquidity').textContent = '$' + Utils.formatFullNumber(quote.liquidity || 0);
        document.getElementById('stat-volume').textContent = '$' + Utils.formatFullNumber(quote.volume_24h || 0);
        document.getElementById('stat-txns').textContent = Utils.formatFullNumber(this.pairData.num_transactions_24h || 0, 0);
        document.getElementById('stat-fdv').textContent = '$' + Utils.formatFullNumber(quote.fully_diluted_value || 0);
        document.getElementById('stat-dex').textContent = dexName;

        // Created date
        if (this.pairData.created_at) {
            const date = new Date(this.pairData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            document.getElementById('stat-created').textContent = date;
        } else {
            document.getElementById('stat-created').textContent = '-';
        }

        // Pair Info Tab
        this.renderPairInfo();

        // Links Tab
        this.renderLinks();
    },

    /**
     * Render price change indicator
     * @param {string} elementId
     * @param {number} value
     * @param {string} label
     */
    renderPriceChange(elementId, value, label) {
        const element = document.getElementById(elementId);
        if (value === null || value === undefined) {
            element.textContent = '-';
            element.className = 'price-change';
            return;
        }

        const className = value >= 0 ? 'price-change positive' : 'price-change negative';
        const arrow = value >= 0 ? '▲' : '▼';
        element.className = className;
        element.textContent = `${arrow} ${Math.abs(value).toFixed(2)}% (${label})`;
    },

    /**
     * Render pair info tab
     */
    renderPairInfo() {
        // Base Token
        document.getElementById('base-token-name').textContent = this.pairData.base_asset_name || '-';
        document.getElementById('base-token-symbol').textContent = this.pairData.base_asset_symbol || '-';
        document.getElementById('base-token-contract').textContent = this.formatAddress(this.pairData.base_asset_contract_address);

        // Quote Token
        document.getElementById('quote-token-name').textContent = this.pairData.quote_asset_name || '-';
        document.getElementById('quote-token-symbol').textContent = this.pairData.quote_asset_symbol || '-';
        document.getElementById('quote-token-contract').textContent = this.formatAddress(this.pairData.quote_asset_contract_address);
    },

    /**
     * Render links tab (contract addresses on block explorers)
     */
    renderLinks() {
        const explorerUrl = this.getBlockExplorerUrl(this.networkSlug);

        // Pair Contract
        const pairLink = `<a href="${explorerUrl}/address/${this.pairData.contract_address}" target="_blank" rel="noopener" class="link-item">${this.pairData.contract_address}</a>`;
        document.getElementById('links-pair').innerHTML = pairLink;

        // Base Token Contract
        const baseLink = `<a href="${explorerUrl}/token/${this.pairData.base_asset_contract_address}" target="_blank" rel="noopener" class="link-item">${this.pairData.base_asset_contract_address}</a>`;
        document.getElementById('links-base').innerHTML = baseLink;

        // Quote Token Contract
        const quoteLink = `<a href="${explorerUrl}/token/${this.pairData.quote_asset_contract_address}" target="_blank" rel="noopener" class="link-item">${this.pairData.quote_asset_contract_address}</a>`;
        document.getElementById('links-quote').innerHTML = quoteLink;
    },

    /**
     * Get block explorer URL for network
     * @param {string} network
     * @returns {string}
     */
    getBlockExplorerUrl(network) {
        const explorers = {
            'Ethereum': 'https://etherscan.io',
            'BSC': 'https://bscscan.com',
            'Polygon': 'https://polygonscan.com',
            'Avalanche': 'https://snowtrace.io',
            'Arbitrum': 'https://arbiscan.io',
            'Optimism': 'https://optimistic.etherscan.io',
            'Base': 'https://basescan.org',
            'Solana': 'https://solscan.io'
        };
        return explorers[network] || 'https://etherscan.io';
    },

    /**
     * Format contract address (show first 6 and last 4 characters)
     * @param {string} address
     * @returns {string}
     */
    formatAddress(address) {
        if (!address || address.length < 10) return address || '-';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    },

    /**
     * Format DEX name from slug
     * @param {string} slug
     * @returns {string}
     */
    formatDexName(slug) {
        if (!slug) return '-';

        // Common DEX name mappings
        const names = {
            'uniswap-v2': 'Uniswap V2',
            'uniswap-v3': 'Uniswap V3',
            'uniswap-v4': 'Uniswap V4',
            'pancakeswap': 'PancakeSwap',
            'pancakeswap-v2': 'PancakeSwap V2',
            'pancakeswap-v3': 'PancakeSwap V3',
            'curve-finance': 'Curve Finance',
            'sushiswap': 'SushiSwap',
            'balancer': 'Balancer',
            'quickswap': 'QuickSwap',
            'trader-joe': 'Trader Joe'
        };

        return names[slug] || slug.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    /**
     * Format price
     * @param {number} price
     * @returns {string}
     */
    formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else if (price >= 0.01) {
            return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
        } else {
            return price.toLocaleString('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 });
        }
    },

    /**
     * Switch tab
     * @param {string} tabName
     */
    switchTab(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
    },

    /**
     * Refresh quotes data
     */
    async refreshQuotes() {
        try {
            const response = await DexPairAPI.getPairQuotes(this.contractAddress, this.networkSlug);

            if (response.data && response.data.length > 0) {
                this.pairData = response.data[0];

                // Re-render price section only
                const quote = this.pairData.quote?.[0] || {};
                document.getElementById('pair-price').textContent = '$' + this.formatPrice(quote.price || 0);
                this.renderPriceChange('change-1h', quote.percent_change_price_1h, '1h');
                this.renderPriceChange('change-24h', quote.percent_change_price_24h, '24h');

                // Update stats
                document.getElementById('stat-liquidity').textContent = '$' + Utils.formatFullNumber(quote.liquidity || 0);
                document.getElementById('stat-volume').textContent = '$' + Utils.formatFullNumber(quote.volume_24h || 0);
                document.getElementById('stat-txns').textContent = Utils.formatFullNumber(this.pairData.num_transactions_24h || 0, 0);

                // Update last update time
                this.updateLastUpdateTime();
            }
        } catch (error) {
            console.error('Error refreshing quotes:', error);
        }
    },

    /**
     * Setup auto-refresh
     */
    setupAutoRefresh() {
        // Refresh quotes every 60 seconds
        this.refreshIntervalId = setInterval(() => {
            this.refreshQuotes();
        }, 60000);

        console.log('⏱️ Auto-refresh enabled (every 60 seconds)');
    },

    /**
     * Update last update time
     */
    updateLastUpdateTime() {
        const now = new Date();
        const timeText = Utils.getTimeAgo(now);
        document.getElementById('last-update').textContent = timeText;
    },

    /**
     * Show loading state
     */
    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        document.getElementById('pair-detail').style.display = 'none';
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('pair-detail').style.display = 'block';
    },

    /**
     * Show error
     * @param {string} message
     */
    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        document.getElementById('pair-detail').style.display = 'none';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DexPairDetail.init();
});

// Stop auto-refresh when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (DexPairDetail.refreshIntervalId) {
            clearInterval(DexPairDetail.refreshIntervalId);
        }
    } else {
        DexPairDetail.setupAutoRefresh();
        DexPairDetail.refreshQuotes();
    }
});
