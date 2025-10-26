/**
 * Folyo - DEX UI Functions
 */

const DEXUI = {
    currentNetwork: 'ethereum',
    currentScrollId: null,
    previousScrollIds: [],
    allPairs: [],

    /**
     * Render network filter chips
     */
    renderNetworkFilters() {
        const container = document.getElementById('network-filters');
        if (!container) {
            console.warn('network-filters container not found');
            return;
        }

        const html = `
            <div class="network-chip active" data-network="all">
                <span class="network-chip-icon">🌐</span>
                <span>All Networks</span>
            </div>
            ${DEXNetworks.networks.map(network => `
                <div class="network-chip ${!network.available ? 'disabled' : ''}"
                     data-network="${network.slug}"
                     ${!network.available ? `title="No data available with free API tier"` : ''}>
                    <span class="network-chip-icon">${network.icon}</span>
                    <span>${network.shortName}</span>
                </div>
            `).join('')}
        `;

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.network-chip:not(.disabled)').forEach(chip => {
            chip.addEventListener('click', () => {
                const network = chip.dataset.network;
                DEXUI.selectNetwork(network);
            });
        });
    },

    /**
     * Select network filter
     * @param {string} network
     */
    selectNetwork(network) {
        // Update active chip
        document.querySelectorAll('.network-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector(`[data-network="${network}"]`).classList.add('active');

        // Update current network
        this.currentNetwork = network === 'all' ? 'ethereum' : network;
        this.currentScrollId = null;
        this.previousScrollIds = [];

        // Reload data
        if (typeof DEXApp !== 'undefined' && DEXApp.loadPairs) {
            DEXApp.loadPairs();
        }
    },

    /**
     * Render network cards (top tokens per network)
     * @param {array} networksData
     */
    renderNetworkCards(networksData) {
        const container = document.getElementById('network-cards');
        if (!container) return;

        if (!networksData || networksData.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);">Loading network data...</p>';
            return;
        }

        const html = networksData.map(({ network, pairs }) => {
            if (!pairs || pairs.length === 0) return '';

            return `
                <div class="network-card">
                    <div class="network-card-header">
                        <div class="network-icon" style="background: ${network.gradient};">
                            ${network.icon}
                        </div>
                        <div class="network-name">${network.shortName}</div>
                    </div>
                    <div class="network-tokens-list">
                        ${pairs.slice(0, 3).map(pair => {
                            const quote = pair.quote?.[0] || {};
                            const change24h = quote.percent_change_price_24h || 0;
                            const changeClass = change24h >= 0 ? 'positive' : 'negative';
                            const changeSign = change24h >= 0 ? '+' : '';

                            return `
                                <div class="network-token-item">
                                    <div>
                                        <div class="network-token-name">${this.escapeHtml(pair.name || 'N/A')}</div>
                                        <div class="network-token-price">$${this.formatPrice(quote.price || 0)}</div>
                                    </div>
                                    <div class="network-token-change ${changeClass}">
                                        ${changeSign}${Math.abs(change24h).toFixed(2)}%
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Add info message about other networks
        const infoMessage = `
            <div style="grid-column: 1 / -1; padding: 16px; text-align: center; color: var(--text-secondary); font-size: 14px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                ℹ️ Currently showing Ethereum DEX pairs only. Other networks (BSC, Solana, Polygon, etc.) will be available with premium API access.
            </div>
        `;

        container.innerHTML = html + infoMessage || '<p style="text-align:center;color:var(--text-secondary);">No data available</p>';
    },

    /**
     * Render DEX pairs table
     * @param {array} pairs
     */
    renderPairsTable(pairs) {
        const tbody = document.getElementById('dex-table-body');
        if (!tbody) return;

        if (!pairs || pairs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-secondary);">No pairs available</td></tr>';
            return;
        }

        this.allPairs = pairs;

        const html = pairs.map((pair, index) => {
            const quote = pair.quote?.[0] || {};
            const price = quote.price || 0;
            const volume24h = quote.volume_24h || 0;
            const liquidity = quote.liquidity || 0;
            const change24h = quote.percent_change_price_24h || 0;
            const txns24h = pair.num_transactions_24h || 0;

            const changeClass = change24h >= 0 ? 'positive' : 'negative';
            const changeSign = change24h >= 0 ? '+' : '';

            const networkColor = DEXNetworks.getColor(pair.network_slug);
            const networkIcon = DEXNetworks.getIcon(pair.network_slug);
            const networkShortName = DEXNetworks.getShortName(pair.network_slug);

            // DEX name
            const dexName = pair.dex_id ? this.formatDexName(pair.dex_id) : '';

            // Token icon URL (from DexScreener info.imageUrl or fallback)
            const tokenIcon = pair.info?.imageUrl || null;

            // Use only the base asset symbol (predominant token) instead of full pair name
            const tokenSymbol = pair.base_asset_symbol || 'N/A';

            return `
                <tr onclick="window.location.href='pair/index.html?contract=${encodeURIComponent(pair.contract_address)}&network=${encodeURIComponent(pair.network_slug)}';" style="cursor: pointer;">
                    <td>${index + 1}</td>
                    <td>
                        <div class="pair-name-cell">
                            ${tokenIcon ? `<img src="${tokenIcon}" alt="${tokenSymbol}" class="pair-icon" onerror="this.style.display='none'">` : ''}
                            <span class="pair-name">${this.escapeHtml(tokenSymbol)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="network-badge" style="background: ${networkColor};">
                            <span class="network-badge-icon">${networkIcon}</span>
                            ${networkShortName}
                        </span>
                    </td>
                    <td><span class="dex-price">$${this.formatPrice(price)}</span></td>
                    <td><span class="dex-liquidity">$${this.formatNumber(liquidity)}</span></td>
                    <td><span class="dex-volume">$${this.formatNumber(volume24h)}</span></td>
                    <td><span class="dex-txns">${this.formatNumber(txns24h, 0)}</span></td>
                    <td><span class="dex-change ${changeClass}">${changeSign}${Math.abs(change24h).toFixed(2)}%</span></td>
                    <td><span class="dex-name">${dexName}</span></td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;
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
     * Format number (for volume, liquidity, etc.)
     * @param {number} num
     * @param {number} decimals
     * @returns {string}
     */
    formatNumber(num, decimals = 2) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(decimals) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(decimals) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(decimals) + 'K';
        } else {
            return num.toFixed(decimals);
        }
    },

    /**
     * Escape HTML
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Format DEX name for display
     * @param {string} dexId - DEX identifier (e.g., 'uniswap-v3', 'pancakeswap')
     * @returns {string} Formatted DEX name
     */
    formatDexName(dexId) {
        if (!dexId) return '';

        // Map of known DEXes to proper names
        const dexNames = {
            'uniswap': 'Uniswap',
            'uniswap-v2': 'Uniswap V2',
            'uniswap-v3': 'Uniswap V3',
            'pancakeswap': 'PancakeSwap',
            'pancakeswap-v2': 'PancakeSwap V2',
            'pancakeswap-v3': 'PancakeSwap V3',
            'sushiswap': 'SushiSwap',
            'curve': 'Curve',
            'balancer': 'Balancer',
            'raydium': 'Raydium',
            'orca': 'Orca',
            'jupiter': 'Jupiter',
            'aerodrome': 'Aerodrome',
            'velodrome': 'Velodrome',
            'quickswap': 'QuickSwap',
            'trader-joe': 'Trader Joe',
            'spookyswap': 'SpookySwap',
            'spiritswap': 'SpiritSwap'
        };

        // Return mapped name or capitalize first letter of each word
        if (dexNames[dexId.toLowerCase()]) {
            return dexNames[dexId.toLowerCase()];
        }

        // Fallback: capitalize and replace hyphens
        return dexId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    /**
     * Show loading state
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';

        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) tableContainer.style.opacity = '0.5';
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';

        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) tableContainer.style.opacity = '1';
    },

    /**
     * Show error
     * @param {string} message
     */
    showError(message) {
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('error-message');

        if (errorDiv && errorMessage) {
            errorMessage.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    /**
     * Hide error
     */
    hideError() {
        const errorDiv = document.getElementById('error');
        if (errorDiv) errorDiv.style.display = 'none';
    }
};
