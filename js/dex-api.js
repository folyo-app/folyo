/**
 * Folyo - DEX API Functions
 * Using DexScreener API for multi-chain DEX data
 */

const DEXAPI = {
    /**
     * Fetch DEX pairs from DexScreener API
     * @param {string} networkSlug - Network slug (e.g., 'ethereum', 'bsc', 'solana')
     * @param {number} limit - Number of pairs to fetch (ignored, uses popular tokens list)
     * @param {string} scrollId - Scroll ID for pagination (deprecated, not used)
     * @param {string} sort - Sort field (deprecated, sorted by volume on server)
     * @returns {Promise<object>}
     */
    async getDexPairs(networkSlug = 'ethereum', limit = 25, scrollId = '', sort = 'volume_24h') {
        try {
            // Convert network slug to lowercase chain ID
            const chainId = networkSlug.toLowerCase();

            // Get popular token addresses for this chain
            if (!DEXPopularTokens.hasTokens(chainId)) {
                console.warn(`No popular tokens configured for chain: ${chainId}`);
                return { data: [], status: { error_code: 0, error_message: null } };
            }

            const tokenAddresses = DEXPopularTokens.getTokensString(chainId, 25);

            const params = new URLSearchParams({
                endpoint: 'dex-screener-tokens',
                chain_id: chainId,
                token_addresses: tokenAddresses
            });

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
        // Get all pairs and return top N by volume
        const allPairs = await this.getDexPairs(networkSlug, 25);

        if (allPairs.data && allPairs.data.length > 0) {
            return {
                data: allPairs.data.slice(0, limit),
                status: allPairs.status
            };
        }

        return allPairs;
    },

    /**
     * Fetch all available networks data for network cards
     * @returns {Promise<array>}
     */
    async getAllNetworksTopTokens() {
        const availableNetworks = DEXNetworks.getAvailable();
        const promises = availableNetworks.map(network =>
            this.getTopTokensByNetwork(network.slug.toLowerCase(), 3)
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
    },

    /**
     * Search for DEX pairs via DexScreener search API
     * @param {string} query - Search query (token name, symbol, or address)
     * @returns {Promise<object>}
     */
    async getDexSearch(query) {
        try {
            if (!query || query.trim().length === 0) {
                return { data: [], status: { error_code: 0, error_message: null } };
            }

            const params = new URLSearchParams({
                endpoint: 'dex-screener-search',
                q: query.trim()
            });

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
            console.error('Error searching DEX pairs:', error);
            throw error;
        }
    }
};
