/**
 * Folyo - DEX API Functions
 * Using DexScreener API for multi-chain DEX data with boost-based token discovery
 */

const DEXAPI = {
    /**
     * Fetch DEX pairs using boost-based token discovery
     * @param {string} networkSlug - Network slug (e.g., 'ethereum', 'bsc', 'solana')
     * @param {number} limit - Number of pairs to fetch (default: 30, max per API)
     * @returns {Promise<object>}
     */
    async getDexPairs(networkSlug = 'ethereum', limit = 30) {
        try {
            const chainId = networkSlug.toLowerCase();

            // 1. Fetch latest boosted tokens
            const latestBoosts = await this.getTokenBoostsLatest();

            // 2. Fetch top boosted tokens
            const topBoosts = await this.getTokenBoostsTop();

            // 3. Filter by network (if 'all', don't filter)
            const latestFiltered = chainId === 'all'
                ? latestBoosts
                : latestBoosts.filter(token => token.chainId === chainId);
            const topFiltered = chainId === 'all'
                ? topBoosts
                : topBoosts.filter(token => token.chainId === chainId);

            // 4. Deduplicate (latest has priority) and add badges
            const seen = new Set();
            const tokens = [];

            // Add latest tokens (marked as BOOSTED)
            latestFiltered.forEach(token => {
                const key = `${token.chainId}:${token.tokenAddress.toLowerCase()}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    tokens.push({ ...token, badge: 'BOOSTED' });
                }
            });

            // Add top tokens not in latest (marked as TRENDING)
            topFiltered.forEach(token => {
                const key = `${token.chainId}:${token.tokenAddress.toLowerCase()}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    tokens.push({ ...token, badge: 'TRENDING' });
                }
            });

            // 5. If no tokens, return empty
            if (tokens.length === 0) {
                return { data: [], status: { error_code: 0, error_message: null } };
            }

            // 6. Limit to max tokens
            const tokensToFetch = tokens.slice(0, Math.min(limit, 30));

            // 7. Fetch pair data from DexScreener
            // For 'all' networks, group by chain and fetch separately
            let pairsData;
            if (chainId === 'all') {
                pairsData = await this.getTokenPairsMultiChain(tokensToFetch);
            } else {
                const addresses = tokensToFetch.map(t => t.tokenAddress).join(',');
                pairsData = await this.getTokenPairs(chainId, addresses);
            }

            // 8. Map pairs to tokens and add badge info
            const results = this.mapTokensToPairs(tokensToFetch, pairsData.data || []);

            return {
                data: results,
                status: { error_code: 0, error_message: null }
            };

        } catch (error) {
            console.error('Error fetching DEX pairs:', error);
            throw error;
        }
    },

    /**
     * Fetch latest boosted tokens
     * @returns {Promise<array>}
     */
    async getTokenBoostsLatest() {
        try {
            const url = `${CONFIG.API_BASE_URL}?endpoint=token-boosts-latest`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching latest token boosts:', error);
            return []; // Return empty array on error to allow fallback
        }
    },

    /**
     * Fetch top boosted tokens
     * @returns {Promise<array>}
     */
    async getTokenBoostsTop() {
        try {
            const url = `${CONFIG.API_BASE_URL}?endpoint=token-boosts-top`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching top token boosts:', error);
            return []; // Return empty array on error to allow fallback
        }
    },

    /**
     * Fetch pair data for specific token addresses
     * @param {string} chainId - Chain identifier
     * @param {string} tokenAddresses - Comma-separated token addresses
     * @returns {Promise<object>}
     */
    async getTokenPairs(chainId, tokenAddresses) {
        try {
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
            return data;
        } catch (error) {
            console.error('Error fetching token pairs:', error);
            throw error;
        }
    },

    /**
     * Fetch pair data for tokens across multiple chains
     * @param {array} tokens - Array of token objects with chainId and tokenAddress
     * @returns {Promise<object>}
     */
    async getTokenPairsMultiChain(tokens) {
        try {
            // Group tokens by chainId
            const tokensByChain = {};
            tokens.forEach(token => {
                const chain = token.chainId;
                if (!tokensByChain[chain]) {
                    tokensByChain[chain] = [];
                }
                tokensByChain[chain].push(token.tokenAddress);
            });

            // Fetch pairs for each chain in parallel
            const promises = Object.entries(tokensByChain).map(([chainId, addresses]) => {
                const addressString = addresses.join(',');
                return this.getTokenPairs(chainId, addressString)
                    .catch(error => {
                        console.warn(`Failed to fetch pairs for ${chainId}:`, error);
                        return { data: [] }; // Return empty on error
                    });
            });

            const results = await Promise.all(promises);

            // Combine all results
            const allPairs = results.reduce((acc, result) => {
                if (result.data && Array.isArray(result.data)) {
                    acc.push(...result.data);
                }
                return acc;
            }, []);

            return {
                data: allPairs,
                status: { error_code: 0, error_message: null }
            };
        } catch (error) {
            console.error('Error fetching multi-chain pairs:', error);
            throw error;
        }
    },

    /**
     * Map tokens to their best pairs and preserve badge/boost info
     * @param {array} tokens - Array of token objects with badge info
     * @param {array} pairs - Array of pair objects from DexScreener
     * @returns {array} Sorted array of pairs with badge info
     */
    mapTokensToPairs(tokens, pairs) {
        const results = [];

        tokens.forEach(token => {
            // Find all pairs for this token
            const tokenPairs = pairs.filter(pair =>
                pair.base_asset_address?.toLowerCase() === token.tokenAddress.toLowerCase() ||
                pair.quote_asset_contract_address?.toLowerCase() === token.tokenAddress.toLowerCase()
            );

            if (tokenPairs.length === 0) {
                return; // Skip tokens without pairs
            }

            // Get the pair with highest liquidity for this token
            const bestPair = tokenPairs.reduce((best, current) => {
                const bestLiq = best.quote?.[0]?.liquidity || 0;
                const currentLiq = current.quote?.[0]?.liquidity || 0;
                return currentLiq > bestLiq ? current : best;
            }, tokenPairs[0]);

            // Add badge and boost info to the pair
            results.push({
                ...bestPair,
                badge: token.badge,
                boostAmount: token.totalAmount || 0,
                boostDescription: token.description || ''
            });
        });

        return results;
    },

    /**
     * Fetch top tokens for a specific network (for network cards)
     * @param {string} networkSlug - Network slug
     * @param {number} limit - Number of tokens (default: 3)
     * @returns {Promise<object>}
     */
    async getTopTokensByNetwork(networkSlug, limit = 3) {
        // Get all pairs and return top N
        const allPairs = await this.getDexPairs(networkSlug, 30);

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
