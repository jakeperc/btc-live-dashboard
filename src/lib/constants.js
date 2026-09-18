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

// Polling cadence. Every timer pauses while the tab is hidden and each fetcher
// backs off (skips 1, 2, 4… ticks) after a failure — see createPoller in
// src/hooks/ui.jsx. The page is a weekly briefing with a live price on top, not
// a trading terminal, so these are deliberately calm.
export const LIVE_PRICE_POLL_MS = 30 * 1000;         // Coinbase ticker; the header price and the hero card
export const MARKET_DATA_POLL_MS = 10 * 60 * 1000;   // CoinGecko market data + mempool basics; the 7-day sparkline only moves hourly
export const SLOW_DATA_POLL_MS = 30 * 60 * 1000;     // Fear & Greed updates daily; difficulty + lightning hourly-ish
export const LAST_BLOCK_POLL_MS = 60 * 1000;         // re-fetch the block list every 60s; the "time since" display ticks every 1s client-side
export const LONG_TERM_POLL_MS = 60 * 60 * 1000;     // blockchain.info daily closes; one new point a day, so hourly is plenty
export const MEDIUM_TERM_POLL_MS = 30 * 60 * 1000;   // CoinGecko hourly data; a new point every hour, well within free-tier limits
export const NEWS_POLL_MS = 10 * 60 * 1000;          // RSS via rss2json; headlines rarely change faster than this
// Backoff ceilings: after repeated failures a fetcher never waits longer than
// this between attempts. Live price recovers fastest; everything else can wait.
export const LIVE_PRICE_BACKOFF_CAP_MS = 10 * 60 * 1000;
export const POLL_BACKOFF_CAP_MS = 60 * 60 * 1000;
export const RSS2JSON_URL = "https://api.rss2json.com/v1/api.json?rss_url=";

// Headlines / deep-analysis / adoption data live in src/data/*.js — see imports above.
