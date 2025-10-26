/**
 * Folyo - DEX API Functions
 */

const DEXAPI = {
    /**
     * Fetch DEX pairs from API
     * @param {string} networkSlug - Network slug (e.g., 'Ethereum')
     * @param {number} limit - Number of pairs to fetch (max 25 for free tier)
     * @param {string} scrollId - Scroll ID for pagination (optional)
     * @param {string} sort - Sort field (default: volume_24h)
     * @returns {Promise<object>}
     */
    async getDexPairs(networkSlug = 'Ethereum', limit = 25, scrollId = '', sort = 'volume_24h') {
        try {
            const params = new URLSearchParams({
                endpoint: 'dex-pairs',
                network_slug: networkSlug,
                limit: limit.toString(),
                sort: sort,
                aux: 'num_transactions_24h,security_scan'
            });

            if (scrollId) {
                params.append('scroll_id', scrollId);
            }

            const url = `${CONFIG.API_BASE_URL}?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status && data.status.error_code !== '0' && data.status.error_code !== 0) {
                throw new Error(data.status.error_message || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('Error fetching DEX pairs:', error);
            throw error;
        }
    },

    /**
     * Fetch top tokens for a specific network (for network cards)
     * @param {string} networkSlug - Network slug
     * @param {number} limit - Number of tokens (default: 3)
     * @returns {Promise<object>}
     */
    async getTopTokensByNetwork(networkSlug, limit = 3) {
        return this.getDexPairs(networkSlug, limit, '', 'volume_24h');
    },

    /**
     * Fetch all available networks data for network cards
     * @returns {Promise<array>}
     */
    async getAllNetworksTopTokens() {
        const availableNetworks = DEXNetworks.getAvailable();
        const promises = availableNetworks.map(network =>
            this.getTopTokensByNetwork(network.slug, 3)
                .catch(error => {
                    console.warn(`Failed to fetch ${network.slug} data:`, error);
                    return { data: [], network: network.slug };
                })
        );

        try {
            const results = await Promise.all(promises);
            return results.map((result, index) => ({
                network: availableNetworks[index],
                pairs: result.data || []
            }));
        } catch (error) {
            console.error('Error fetching networks top tokens:', error);
            return [];
        }
    }
};
