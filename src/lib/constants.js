// ─── CONFIG & STATIC DATA ───────────────────────────────────────
export const TABS = ["Dashboard", "Thesis", "Strategy", "Headlines", "Adoption", "Analysis"];

export const TOTAL_SUPPLY = 21000000;
export const ESTIMATED_LOST = 3000000; // 2.3M–3.7M BTC permanently lost (avg ~3M)
export const HALVING_BLOCK = 1050000;

// API endpoints — all free, public, CORS-enabled, no auth.
export const COINBASE_TICKER_URL = "https://api.exchange.coinbase.com/products/BTC-USD/ticker";
export const COINGECKO_MARKET_URL = "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true";
export const MEMPOOL_BLOCK_URL = "https://mempool.space/api/blocks/tip/height";
export const MEMPOOL_HASHRATE_URL = "https://mempool.space/api/v1/mining/hashrate/3d";
export const MEMPOOL_FEES_URL = "https://mempool.space/api/v1/fees/recommended";
export const MEMPOOL_MEMPOOL_URL = "https://mempool.space/api/mempool";
export const MEMPOOL_BLOCKS_URL = "https://mempool.space/api/v1/blocks";
export const MEMPOOL_DIFFICULTY_URL = "https://mempool.space/api/v1/difficulty-adjustment";
export const MEMPOOL_LIGHTNING_URL = "https://mempool.space/api/v1/lightning/statistics/latest";
export const COINGECKO_GLOBAL_URL = "https://api.coingecko.com/api/v3/global";
// blockchain.info exposes full daily BTC price history (CORS-enabled, no auth).
// CoinGecko's market_chart endpoint requires a paid plan for ranges > 1 year as of 2025.
export const LONG_TERM_CHART_URL = "https://api.blockchain.info/charts/market-price?timespan=all&format=json&cors=true";
// CoinGecko market_chart for last 90 days — free-tier, auto-hourly granularity (≤90 days), covers 1M + 3M ranges.
export const MEDIUM_TERM_CHART_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=90";
export const FEAR_GREED_URL = "https://api.alternative.me/fng/?limit=2";
export const LIVE_PRICE_POLL_MS = 12 * 1000;
export const MARKET_DATA_POLL_MS = 5 * 60 * 1000;
export const SLOW_DATA_POLL_MS = 15 * 60 * 1000;     // Fear & Greed updates daily; difficulty + lightning hourly-ish
export const LAST_BLOCK_POLL_MS = 30 * 1000;         // re-fetch block list every 30s; display ticks every 1s client-side
export const LONG_TERM_POLL_MS = 20 * 60 * 1000;     // blockchain.info daily data; 20-min poll keeps it fresh without hammering
export const MEDIUM_TERM_POLL_MS = 15 * 60 * 1000;   // CoinGecko hourly data; 15-min poll is well within free-tier rate limits
export const RSS2JSON_URL = "https://api.rss2json.com/v1/api.json?rss_url=";

// Headlines / deep-analysis / adoption data live in src/data/*.js — see imports above.
