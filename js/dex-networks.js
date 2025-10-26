/**
 * Folyo - DEX Networks Configuration
 */

const DEXNetworks = {
    /**
     * Available networks for DEX trading
     *
     * API Testing Results (2025-10-26):
     * - Ethereum: ✅ Has data (Uniswap V2/V3, Curve, etc.)
     * - BSC, Solana, Polygon, Base: ❌ API accepts but returns 0 pairs
     * - Arbitrum, Avalanche, Optimism: ❌ API accepts but returns 0 pairs
     * - Fantom, Tron: ❌ API accepts but returns 0 pairs
     *
     * Conclusion: Free tier DEX API only provides Ethereum data
     */
    networks: [
        {
            slug: 'Ethereum',
            name: 'Ethereum',
            shortName: 'ETH',
            icon: 'Ξ',
            color: '#627EEA',
            gradient: 'linear-gradient(135deg, #627EEA 0%, #8A9FFE 100%)',
            available: true,
            tested: true,
            hasPairs: true
        },
        {
            slug: 'BSC',
            name: 'BNB Smart Chain',
            shortName: 'BSC',
            icon: 'Ⓑ',
            color: '#F3BA2F',
            gradient: 'linear-gradient(135deg, #F3BA2F 0%, #FDD85D 100%)',
            available: false,
            tested: true,
            hasPairs: false
        },
        {
            slug: 'Solana',
            name: 'Solana',
            shortName: 'SOL',
            icon: 'Ⓢ',
            color: '#14F195',
            gradient: 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
            available: false,
            tested: true,
            hasPairs: false
        },
        {
            slug: 'Polygon',
            name: 'Polygon',
            shortName: 'MATIC',
            icon: '⬡',
            color: '#8247E5',
            gradient: 'linear-gradient(135deg, #8247E5 0%, #B47CFF 100%)',
            available: false,
            tested: true,
            hasPairs: false
        },
        {
            slug: 'Base',
            name: 'Base',
            shortName: 'BASE',
            icon: 'Ⓑ',
            color: '#0052FF',
            gradient: 'linear-gradient(135deg, #0052FF 0%, #4C8BFF 100%)',
            available: false,
            tested: true,
            hasPairs: false
        },
        {
            slug: 'Arbitrum',
            name: 'Arbitrum',
            shortName: 'ARB',
            icon: 'Ⓐ',
            color: '#28A0F0',
            gradient: 'linear-gradient(135deg, #28A0F0 0%, #7CC5F5 100%)',
            available: false,
            tested: true,
            hasPairs: false
        },
        {
            slug: 'Optimism',
            name: 'Optimism',
            shortName: 'OP',
            icon: 'Ⓞ',
            color: '#FF0420',
            gradient: 'linear-gradient(135deg, #FF0420 0%, #FF5A70 100%)',
            available: false,
            tested: true,
            hasPairs: false
        },
        {
            slug: 'Avalanche',
            name: 'Avalanche',
            shortName: 'AVAX',
            icon: '△',
            color: '#E84142',
            gradient: 'linear-gradient(135deg, #E84142 0%, #F57C7D 100%)',
            available: false,
            tested: true,
            hasPairs: false
        }
    ],

    /**
     * Get network by slug
     * @param {string} slug
     * @returns {object|null}
     */
    getBySlug(slug) {
        return this.networks.find(n => n.slug === slug) || null;
    },

    /**
     * Get all available networks
     * @returns {array}
     */
    getAvailable() {
        return this.networks.filter(n => n.available);
    },

    /**
     * Get network color
     * @param {string} slug
     * @returns {string}
     */
    getColor(slug) {
        const network = this.getBySlug(slug);
        return network ? network.color : '#666666';
    },

    /**
     * Get network gradient
     * @param {string} slug
     * @returns {string}
     */
    getGradient(slug) {
        const network = this.getBySlug(slug);
        return network ? network.gradient : 'linear-gradient(135deg, #666666 0%, #999999 100%)';
    },

    /**
     * Get network name
     * @param {string} slug
     * @returns {string}
     */
    getName(slug) {
        const network = this.getBySlug(slug);
        return network ? network.name : slug;
    },

    /**
     * Get network short name
     * @param {string} slug
     * @returns {string}
     */
    getShortName(slug) {
        const network = this.getBySlug(slug);
        return network ? network.shortName : slug;
    },

    /**
     * Get network icon
     * @param {string} slug
     * @returns {string}
     */
    getIcon(slug) {
        const network = this.getBySlug(slug);
        return network ? network.icon : '●';
    }
};
