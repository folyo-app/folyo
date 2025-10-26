<?php
/**
 * Folyo - Cryptocurrency API Proxy
 * Resolves CORS issues by proxying requests to the crypto data API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Load environment variables
function loadEnv() {
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) {
        return null;
    }
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
    return $_ENV['CMC_API_KEY'] ?? null;
}

/**
 * Transform DexScreener pair data to match CMC format expected by UI
 * @param array $dexPair DexScreener pair object
 * @return array Transformed pair in CMC-compatible format
 */
function transformDexScreenerPair($dexPair) {
    return [
        'name' => ($dexPair['baseToken']['symbol'] ?? 'N/A') . '/' . ($dexPair['quoteToken']['symbol'] ?? 'N/A'),
        'base_asset_symbol' => $dexPair['baseToken']['symbol'] ?? 'N/A',
        'base_asset_name' => $dexPair['baseToken']['name'] ?? 'N/A',
        'base_asset_address' => $dexPair['baseToken']['address'] ?? '',
        'base_asset_contract_address' => $dexPair['baseToken']['address'] ?? '',
        'quote_asset_symbol' => $dexPair['quoteToken']['symbol'] ?? 'N/A',
        'quote_asset_name' => $dexPair['quoteToken']['name'] ?? 'N/A',
        'quote_asset_contract_address' => $dexPair['quoteToken']['address'] ?? '',
        'contract_address' => $dexPair['pairAddress'] ?? '',
        'network_slug' => $dexPair['chainId'] ?? 'ethereum',
        'dex_id' => $dexPair['dexId'] ?? '',
        'dex_slug' => $dexPair['dexId'] ?? '',
        'url' => $dexPair['url'] ?? '',
        'created_at' => $dexPair['pairCreatedAt'] ?? null,
        'quote' => [[
            'price' => (float) ($dexPair['priceUsd'] ?? 0),
            'volume_24h' => (float) ($dexPair['volume']['h24'] ?? 0),
            'liquidity' => (float) ($dexPair['liquidity']['usd'] ?? 0),
            'percent_change_price_24h' => (float) ($dexPair['priceChange']['h24'] ?? 0),
            'percent_change_price_1h' => (float) ($dexPair['priceChange']['h1'] ?? 0),
            'percent_change_price_6h' => (float) ($dexPair['priceChange']['h6'] ?? 0),
            'fully_diluted_value' => (float) ($dexPair['fdv'] ?? 0),
        ]],
        'num_transactions_24h' => ((int) ($dexPair['txns']['h24']['buys'] ?? 0)) + ((int) ($dexPair['txns']['h24']['sells'] ?? 0)),
        'txns' => [
            'm5' => $dexPair['txns']['m5'] ?? ['buys' => 0, 'sells' => 0],
            'h1' => $dexPair['txns']['h1'] ?? ['buys' => 0, 'sells' => 0],
            'h6' => $dexPair['txns']['h6'] ?? ['buys' => 0, 'sells' => 0],
            'h24' => $dexPair['txns']['h24'] ?? ['buys' => 0, 'sells' => 0],
        ],
        'volume' => [
            'm5' => (float) ($dexPair['volume']['m5'] ?? 0),
            'h1' => (float) ($dexPair['volume']['h1'] ?? 0),
            'h6' => (float) ($dexPair['volume']['h6'] ?? 0),
            'h24' => (float) ($dexPair['volume']['h24'] ?? 0),
        ],
        'fdv' => (float) ($dexPair['fdv'] ?? 0),
        'market_cap' => (float) ($dexPair['marketCap'] ?? 0),
        'pair_created_at' => $dexPair['pairCreatedAt'] ?? null,
        'info' => [
            'imageUrl' => $dexPair['info']['imageUrl'] ?? null,
            'header' => $dexPair['info']['header'] ?? null,
            'websites' => $dexPair['info']['websites'] ?? [],
            'socials' => $dexPair['info']['socials'] ?? [],
        ],
        // Security scan not available in DexScreener
        'security_scan' => []
    ];
}

/**
 * Transform array of DexScreener pairs to CMC format
 * @param array $dexPairs Array of DexScreener pair objects
 * @return array Response in CMC-compatible format
 */
function transformDexScreenerData($dexPairs) {
    if (!is_array($dexPairs)) {
        return ['data' => []];
    }

    $transformed = array_map('transformDexScreenerPair', $dexPairs);

    // Sort by volume 24h descending
    usort($transformed, function($a, $b) {
        $volA = $a['quote'][0]['volume_24h'] ?? 0;
        $volB = $b['quote'][0]['volume_24h'] ?? 0;
        return $volB <=> $volA;
    });

    return [
        'data' => $transformed,
        'status' => [
            'error_code' => 0,
            'error_message' => null,
        ]
    ];
}

$apiKey = loadEnv();

// Check if endpoint requires API key (DexScreener endpoints don't need it)
$endpoint = $_GET['endpoint'] ?? '';
$requiresApiKey = !in_array($endpoint, ['fear-greed', 'dex-screener-tokens', 'dex-screener-pair', 'dex-screener-search']);

if ($requiresApiKey && !$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API key not configured']);
    exit;
}

// Get parameters (endpoint already retrieved above for API key check)
$start = $_GET['start'] ?? '1';
$limit = $_GET['limit'] ?? '100';
$convert = $_GET['convert'] ?? 'USD';
$ids = $_GET['ids'] ?? '';
$slug = $_GET['slug'] ?? '';
$symbol = $_GET['symbol'] ?? '';

// Base URL
$baseUrl = 'https://pro-api.coinmarketcap.com';
$url = '';

// Build URL based on endpoint
switch ($endpoint) {
    case 'listings':
        $url = "$baseUrl/v1/cryptocurrency/listings/latest?start=$start&limit=$limit&convert=$convert";
        break;

    case 'global-metrics':
        $url = "$baseUrl/v1/global-metrics/quotes/latest?convert=$convert";
        break;

    case 'fear-greed':
        // Using Alternative.me API (free, no key required)
        $url = "https://api.alternative.me/fng/";
        break;

    case 'crypto-info':
        if (empty($ids) && empty($slug)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ids or slug parameter']);
            exit;
        }
        $params = [];
        if (!empty($ids)) $params[] = "id=$ids";
        if (!empty($slug)) $params[] = "slug=$slug";
        $queryString = implode('&', $params);
        $url = "$baseUrl/v2/cryptocurrency/info?$queryString";
        break;

    case 'crypto-quotes':
        if (empty($ids) && empty($slug) && empty($symbol)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ids, slug, or symbol parameter']);
            exit;
        }
        $params = [];
        if (!empty($ids)) $params[] = "id=$ids";
        if (!empty($slug)) $params[] = "slug=$slug";
        if (!empty($symbol)) $params[] = "symbol=$symbol";
        $params[] = "convert=$convert";
        $queryString = implode('&', $params);
        $url = "$baseUrl/v2/cryptocurrency/quotes/latest?$queryString";
        break;

    case 'ohlcv-historical':
        if (empty($ids)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ids parameter']);
            exit;
        }
        $count = $_GET['count'] ?? '8';
        $interval = $_GET['interval'] ?? 'daily';
        $timePeriod = $_GET['time_period'] ?? 'daily';
        $url = "$baseUrl/v2/cryptocurrency/ohlcv/historical?id=$ids&count=$count&time_period=$timePeriod&interval=$interval&convert=$convert";
        break;

    case 'dex-pairs':
        // DEX pairs endpoint
        $networkSlug = $_GET['network_slug'] ?? 'Ethereum';
        $dexLimit = $_GET['limit'] ?? '100';
        $scrollId = $_GET['scroll_id'] ?? '';
        $sort = $_GET['sort'] ?? 'volume_24h';
        $aux = $_GET['aux'] ?? 'num_transactions_24h,security_scan';

        $params = [
            "network_slug=$networkSlug",
            "limit=$dexLimit",
            "sort=$sort",
            "aux=$aux"
        ];

        if (!empty($scrollId)) {
            $params[] = "scroll_id=$scrollId";
        }

        $queryString = implode('&', $params);
        $url = "$baseUrl/v4/dex/spot-pairs/latest?$queryString";
        break;

    case 'dex-pair-quotes':
        // DEX pair quotes endpoint (CoinMarketCap - legacy)
        $contractAddress = $_GET['contract_address'] ?? '';
        $networkSlug = $_GET['network_slug'] ?? 'Ethereum';

        if (empty($contractAddress)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing contract_address parameter']);
            exit;
        }

        $url = "$baseUrl/v4/dex/pairs/quotes/latest?contract_address=$contractAddress&network_slug=$networkSlug";
        break;

    case 'dex-screener-tokens':
        // DexScreener API - Get pairs for specific tokens
        $chainId = strtolower($_GET['chain_id'] ?? 'ethereum');
        $tokenAddresses = $_GET['token_addresses'] ?? '';

        if (empty($tokenAddresses)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing token_addresses parameter']);
            exit;
        }

        // Make direct request to DexScreener
        $dexScreenerUrl = "https://api.dexscreener.com/tokens/v1/$chainId/$tokenAddresses";
        $dexResponse = file_get_contents($dexScreenerUrl);

        if ($dexResponse === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch from DexScreener']);
            exit;
        }

        $dexData = json_decode($dexResponse, true);

        // Transform DexScreener format to match our current UI expectations
        $transformed = transformDexScreenerData($dexData);

        http_response_code(200);
        echo json_encode($transformed);
        exit;

    case 'dex-screener-pair':
        // DexScreener API - Get specific pair details
        $chainId = strtolower($_GET['chain_id'] ?? 'ethereum');
        $pairAddress = $_GET['pair_address'] ?? '';

        if (empty($pairAddress)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing pair_address parameter']);
            exit;
        }

        // Use search endpoint to find the pair
        $dexScreenerUrl = "https://api.dexscreener.com/latest/dex/search?q=$pairAddress";
        $dexResponse = file_get_contents($dexScreenerUrl);

        if ($dexResponse === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch from DexScreener']);
            exit;
        }

        $dexData = json_decode($dexResponse, true);

        // Transform and return first matching pair
        if (isset($dexData['pairs']) && count($dexData['pairs']) > 0) {
            $transformed = transformDexScreenerPair($dexData['pairs'][0]);
            http_response_code(200);
            echo json_encode([
                'data' => [$transformed],
                'status' => [
                    'error_code' => 0,
                    'error_message' => null
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pair not found']);
        }
        exit;

    case 'dex-screener-search':
        // DexScreener API - Search for pairs
        $query = $_GET['q'] ?? '';

        if (empty($query)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing query parameter']);
            exit;
        }

        // Make direct request to DexScreener search endpoint
        $dexScreenerUrl = "https://api.dexscreener.com/latest/dex/search?q=" . urlencode($query);
        $dexResponse = file_get_contents($dexScreenerUrl);

        if ($dexResponse === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch from DexScreener']);
            exit;
        }

        $dexData = json_decode($dexResponse, true);

        // Transform DexScreener format to match our current UI expectations
        // DexScreener search returns {schemaVersion, pairs}, we need just the pairs array
        $pairs = $dexData['pairs'] ?? [];
        $transformed = transformDexScreenerData($pairs);

        http_response_code(200);
        echo json_encode($transformed);
        exit;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid endpoint']);
        exit;
}

// Make request to API
$ch = curl_init();

// Prepare headers (Alternative.me doesn't need API key)
$headers = ["Accept: application/json"];
if ($endpoint !== 'fear-greed') {
    $headers[] = "X-CMC_PRO_API_KEY: $apiKey";
}

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Request failed: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $response;
?>