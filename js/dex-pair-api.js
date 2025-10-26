/**
 * Folyo - DEX Pair API Functions
 */

const DexPairAPI = {
    /**
     * Fetch DEX pair quotes from API
     * @param {string} contractAddress - Pair contract address
     * @param {string} networkSlug - Network slug (e.g., 'Ethereum')
     * @returns {Promise<object>}
     */
    async getPairQuotes(contractAddress, networkSlug = 'Ethereum') {
        try {
            const params = new URLSearchParams({
                endpoint: 'dex-pair-quotes',
                contract_address: contractAddress,
                network_slug: networkSlug
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
            console.error('Error fetching DEX pair quotes:', error);
            throw error;
        }
    }
};
