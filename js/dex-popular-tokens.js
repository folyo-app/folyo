/**
 * Folyo - Popular DEX Tokens Configuration
 * Lists of most liquid and traded tokens per blockchain
 * Used to fetch top trading pairs from DexScreener API
 *
 * Last updated: 2025-10-26
 */

const DEXPopularTokens = {
    /**
     * Ethereum - Top 25 most traded tokens
     */
    ethereum: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH - Wrapped Ether
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT - Tether USD
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC - USD Coin
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC - Wrapped Bitcoin
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI - Dai Stablecoin
        '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK - Chainlink
        '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC - Polygon
        '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // SHIB - Shiba Inu
        '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI - Uniswap
        '0x6982508145454Ce325dDbE47a25d4ec3d2311933', // PEPE - Pepe
        '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE - Aave
        '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // stETH - Lido Staked Ether
        '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', // BAT - Basic Attention Token
        '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', // SNX - Synthetix
        '0x4d224452801ACEd8B2F0aebE155379bb5D594381', // APE - ApeCoin
        '0x6810e776880C02933D47DB1b9fc05908e5386b96', // GNO - Gnosis
        '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', // BNB - Binance Coin
        '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', // YFI - yearn.finance
        '0x111111111117dC0aa78b770fA6A738034120C302', // 1INCH - 1inch
        '0x853d955aCEf822Db058eb8505911ED77F175b99e', // FRAX - Frax
        '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', // LDO - Lido DAO
        '0xd533a949740bb3306d119CC777fa900bA034cd52', // CRV - Curve DAO
        '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR - Maker
        '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', // ENS - Ethereum Name Service
        '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0'  // FXS - Frax Share
    ],

    /**
     * BSC - Top 25 most traded tokens
     */
    bsc: [
        '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB - Wrapped BNB
        '0x55d398326f99059fF775485246999027B3197955', // USDT - Tether USD
        '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD - Binance USD
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC - USD Coin
        '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', // ETH - Ethereum
        '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // BTCB - Bitcoin BEP2
        '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', // CAKE - PancakeSwap
        '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', // ADA - Cardano
        '0xbA2aE424d960c26247Dd6c32edC70B295c744C43', // DOGE - Dogecoin
        '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE', // XRP - Ripple
        '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD', // LINK - Chainlink
        '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1', // UNI - Uniswap
        '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf', // BCH - Bitcoin Cash
        '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402', // DOT - Polkadot
        '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94', // LTC - Litecoin
        '0xCC42724C6683B7E57334c4E856f4c9965ED682bD', // MATIC - Polygon
        '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', // DAI - Dai Stablecoin
        '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D', // SHIB - Shiba Inu
        '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153', // FIL - Filecoin
        '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0', // AXS - Axie Infinity
        '0xa2B726B1145A4773F68593CF171187d8EBe4d495', // INJ - Injective
        '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6', // EOS - EOS
        '0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377', // MBOX - Mobox
        '0xfb6115445Bff7b52FeB98650C87f44907E58f802', // AAVE - Aave
        '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e'  // YFI - yearn.finance
    ],

    /**
     * Solana - Top 20 most traded tokens
     */
    solana: [
        'So11111111111111111111111111111111111111112',  // SOL - Wrapped SOL
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC - USD Coin
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT - Tether USD
        '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', // WETH - Wrapped Ether (Wormhole)
        'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',  // mSOL - Marinade staked SOL
        'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK - Bonk
        '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', // POPCAT - Popcat
        'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',  // JUP - Jupiter
        'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', // PYTH - Pyth Network
        'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL',  // JTO - Jito
        'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',   // WEN - Wen
        '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm', // INF - Infinity
        'hntyVP6YFm1Hg25TN9WGLqM12b1TRezrhrnrSi8k4May', // HNT - Helium
        'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',  // SBR - Saber
        'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',  // MNDE - Marinade
        'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',  // SRM - Serum
        'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp', // FIDA - Bonfida
        'BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA', // BLZE - Blaze
        'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',  // ORCA - Orca
        'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6'   // KIN - Kin
    ],

    /**
     * Polygon - Top 20 most traded tokens
     */
    polygon: [
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC/WPOL - Wrapped Polygon
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT - Tether USD
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC - USD Coin (bridged)
        '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC - USD Coin (native)
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH - Wrapped Ether
        '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', // WBTC - Wrapped Bitcoin
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI - Dai Stablecoin
        '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', // AAVE - Aave
        '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', // LINK - Chainlink
        '0xb33EaAd8d922B1083446DC23f610c2567fB5180f', // UNI - Uniswap
        '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', // SUSHI - SushiSwap
        '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7', // GHST - Aavegotchi
        '0x580A84C73811E1839F75d86d75d88cCa0c241fF4', // QI - Qi Dao
        '0x172370d5Cd63279eFa6d502DAB29171933a610AF', // CRV - Curve DAO
        '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3', // BAL - Balancer
        '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7', // MATIC (old)
        '0x831753DD7087CaC61aB5644b308642cc1c33Dc13', // QUICK - QuickSwap
        '0x61299774020dA444Af134c82fa83E3810b309991', // RNDR - Render Token
        '0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369', // DFX - DFX Finance
        '0xc4Ce1D6F5D98D65eE25Cf85e9F2E9DcFEe6Cb5d6'  // cxDOGE - Polygon DOGE
    ],

    /**
     * Arbitrum - Top 20 most traded tokens
     */
    arbitrum: [
        '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH - Wrapped Ether
        '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT - Tether USD
        '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC (bridged)
        '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC - USD Coin
        '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', // WBTC - Wrapped Bitcoin
        '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI - Dai Stablecoin
        '0x912CE59144191C1204E64559FE8253a0e49E6548', // ARB - Arbitrum
        '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', // LINK - Chainlink
        '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0', // UNI - Uniswap
        '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', // GMX - GMX
        '0x539bdE0d7Dbd336b79148AA742883198BBF60342', // MAGIC - Magic
        '0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978', // CRV - Curve DAO
        '0x6694340fc020c5E6B96567843da2df01b2CE1eb6', // STG - Stargate Finance
        '0xd4d42F0b6DEF4CE0383636770eF773390d85c61A', // SUSHI - SushiSwap
        '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55', // DPX - Dopex
        '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F', // FRAX - Frax
        '0x23A941036Ae778Ac51Ab04CEa08Ed6e2FE103614', // GRT - The Graph
        '0x080F6AEd32Fc474DD5717105Dba5ea57268F46eb', // SYN - Synapse
        '0x55904F416586b5140A0f666CF5AcF320AdF64846', // LPT - Livepeer
        '0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF'  // SPELL - Spell Token
    ],

    /**
     * Optimism - Top 15 most traded tokens
     */
    optimism: [
        '0x4200000000000000000000000000000000000006', // WETH - Wrapped Ether
        '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // USDT - Tether USD
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // USDC (bridged)
        '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC - USD Coin
        '0x68f180fcCe6836688e9084f035309E29Bf0A2095', // WBTC - Wrapped Bitcoin
        '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI - Dai Stablecoin
        '0x4200000000000000000000000000000000000042', // OP - Optimism
        '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6', // LINK - Chainlink
        '0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4', // SNX - Synthetix
        '0x9e1028F5F1D5eDE59748FFceE5532509976840E0', // PERP - Perpetual Protocol
        '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9', // sUSD - Synth sUSD
        '0x76FB31fb4af56892A25e32cFC43De717950c9278', // AAVE - Aave
        '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb', // wstETH - Lido wstETH
        '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1', // WLD - Worldcoin
        '0x8Ae125E8653821E851F12A49F7765db9a9ce7384'  // DOLA - Dola USD Stablecoin
    ],

    /**
     * Avalanche - Top 15 most traded tokens
     */
    avalanche: [
        '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX - Wrapped AVAX
        '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // USDT - Tether USD
        '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // USDC - USD Coin
        '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', // WETH.e - Wrapped Ether
        '0x50b7545627a5162F82A992c33b87aDc75187B218', // WBTC.e - Wrapped Bitcoin
        '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', // DAI.e - Dai Stablecoin
        '0x5947BB275c521040051D82396192181b413227A3', // LINK.e - Chainlink
        '0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE', // SUSHI.e - SushiSwap
        '0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580', // UNI.e - Uniswap
        '0xB09FE1613fE03E7361319d2a43eDc17422f36B09', // QI - Qi Dao
        '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', // JOE - Joe
        '0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4', // XAVA - Avalaunch
        '0x60781C2586D68229fde47564546784ab3fACA982', // PNG - Pangolin
        '0x130966628846BFd36ff31a822705796e8cb8C18D', // MIM - Magic Internet Money
        '0xfcc6CE74f4cd7eDEF0C5429bB99d38A3608043a5'  // GMBL - Gamble
    ],

    /**
     * Base - Top 15 most traded tokens
     */
    base: [
        '0x4200000000000000000000000000000000000006', // WETH - Wrapped Ether
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC - USD Coin
        '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // DAI - Dai Stablecoin
        '0x940181a94A35A4569E4529A3CDfB74e38FD98631', // AERO - Aerodrome
        '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', // cbETH - Coinbase Wrapped Staked ETH
        '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC - USD Base Coin (bridged)
        '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9', // BRETT - Based Brett
        '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c', // RBTC - Rari Bitcoin
        '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN - Degen
        '0x0000000000000000000000000000000000000000', // ETH - Native Ether
        '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b', // WELL - Moonwell
        '0xA88594D404727625A9437C3f886C7643872296AE', // WELL (old)
        '0x532f27101965dd16442E59d40670FaF5eBB142E4', // BRETT (old)
        '0xb79DD08EA68A908A97220C76d19A6aA9cBDE4376', // USD+
        '0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE'  // TOSHI - Toshi
    ],

    /**
     * Get token addresses for a specific chain
     * @param {string} chainId - Chain identifier (lowercase)
     * @returns {Array<string>} Array of token addresses
     */
    getTokens(chainId) {
        const normalizedChainId = chainId.toLowerCase();
        return this[normalizedChainId] || [];
    },

    /**
     * Get comma-separated string of token addresses for API call
     * @param {string} chainId - Chain identifier
     * @param {number} limit - Maximum number of tokens (default: 25, max: 30)
     * @returns {string} Comma-separated token addresses
     */
    getTokensString(chainId, limit = 25) {
        const tokens = this.getTokens(chainId);
        return tokens.slice(0, Math.min(limit, 30)).join(',');
    },

    /**
     * Check if a chain has configured popular tokens
     * @param {string} chainId - Chain identifier
     * @returns {boolean}
     */
    hasTokens(chainId) {
        const normalizedChainId = chainId.toLowerCase();
        return this[normalizedChainId] && this[normalizedChainId].length > 0;
    }
};
