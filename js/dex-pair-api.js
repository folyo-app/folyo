/**
 * Folyo - DEX Pair API Functions
 * Using DexScreener API for pair details
 */

const DexPairAPI = {
    /**
     * Fetch DEX pair quotes from DexScreener API
     * @param {string} contractAddress - Pair contract address
     * @param {string} networkSlug - Network slug (e.g., 'ethereum', 'bsc', 'solana')
     * @returns {Promise<object>}
     */
    async getPairQuotes(contractAddress, networkSlug = 'ethereum') {
        try {
            const chainId = networkSlug.toLowerCase();

            const params = new URLSearchParams({
                endpoint: 'dex-screener-pair',
                chain_id: chainId,
                pair_address: contractAddress
            });

            const url = `${CONFIG.API_BASE_URL}?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Error fetching DEX pair quotes:', error);
            throw error;
        }
    }
};
