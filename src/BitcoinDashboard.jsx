import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Line, ReferenceLine, ReferenceArea } from "recharts";

// ─── DATA IMPORTS ────────────────────────────────────────────────
// Refresh-skill-owned data lives in src/data/. To edit any of these constants
// open the per-domain file directly — do NOT Read this 7K-line component file.
import { FALLBACK_MINED, FALLBACK_BLOCK, FALLBACK_PRICE, FALLBACK_ATH, FALLBACK_ATH_DATE } from "./data/fallbacks.js";
import { MARKET_THEME, CURATED_MARKET_UPDATES, NEWS_FEEDS, FALLBACK_NEWS } from "./data/market-news.js";
import { HISTORICAL_HIGHLIGHTS, SIX_MONTH_HIGHLIGHTS } from "./data/headlines.js";
import { DEEP_ANALYSIS } from "./data/deep-analysis.js";
import { DIP_EXPLAINER } from "./data/explainer.js";
import { ADOPTION_DATA, ADOPTION_INDEX_TOP20, COUNTRY_HOLDINGS, COMPANY_HOLDINGS } from "./data/adoption.js";
import { SUPPLY_HISTORY } from "./data/supply-history.js";
import {
  THESIS_METRICS, THESIS_EPIGRAPH, SOFT_MONEY_COSTS,
  MONEY_INTRO, MONEY_SCORECARD,
  SILENT_TAX_PIN_TOP, SILENT_TAX_M2_DATA, SILENT_TAX_CHAPTERS, SILENT_TAX_EVENTS,
  SILENT_TAX_GUESS, SILENT_TAX_STEPS, SILENT_TAX_CODA,
  PP_BY_YEAR, SILENT_TAX_CAVEAT, SILENT_TAX_INTL,
  BTC_ISSUANCE_DATA, MONEY_HISTORY, DIGITAL_SCARCITY, SUPPLY_CAP_GUESS,
  HARDNESS_DATA, PROPERTIES_MATRIX, MYTHS,
  TIME_PREFERENCE, TIME_PREFERENCE_STORY, THESIS_FLOW, POSITIONING_LENSES,
} from "./data/thesis.js";
import {
  WORKED_EXAMPLE, RETAIL_REALITY, STRATEGY_RULES, CUSTODY_LADDER,
  ALLOCATION_BANDS, COMMON_MISTAKES, HISTORICAL_DRAWDOWNS, DRAWDOWN_CAVEAT,
  STRATEGY_SOURCES, DCA_WEEKLY_OPTIONS,
} from "./data/strategy.js";

// ─── CONFIG & STATIC DATA ───────────────────────────────────────
const TABS = ["Dashboard", "Thesis", "Strategy", "Headlines", "Adoption", "Analysis"];

const TOTAL_SUPPLY = 21000000;
const ESTIMATED_LOST = 3000000; // 2.3M–3.7M BTC permanently lost (avg ~3M)
const HALVING_BLOCK = 1050000;

// API endpoints — all free, public, CORS-enabled, no auth.
const COINBASE_TICKER_URL = "https://api.exchange.coinbase.com/products/BTC-USD/ticker";
const COINGECKO_MARKET_URL = "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true";
const MEMPOOL_BLOCK_URL = "https://mempool.space/api/blocks/tip/height";
const MEMPOOL_HASHRATE_URL = "https://mempool.space/api/v1/mining/hashrate/3d";
const MEMPOOL_FEES_URL = "https://mempool.space/api/v1/fees/recommended";
const MEMPOOL_MEMPOOL_URL = "https://mempool.space/api/mempool";
const MEMPOOL_BLOCKS_URL = "https://mempool.space/api/v1/blocks";
const MEMPOOL_DIFFICULTY_URL = "https://mempool.space/api/v1/difficulty-adjustment";
const MEMPOOL_LIGHTNING_URL = "https://mempool.space/api/v1/lightning/statistics/latest";
const COINGECKO_GLOBAL_URL = "https://api.coingecko.com/api/v3/global";
// blockchain.info exposes full daily BTC price history (CORS-enabled, no auth).
// CoinGecko's market_chart endpoint requires a paid plan for ranges > 1 year as of 2025.
const LONG_TERM_CHART_URL = "https://api.blockchain.info/charts/market-price?timespan=all&format=json&cors=true";
// CoinGecko market_chart for last 90 days — free-tier, auto-hourly granularity (≤90 days), covers 1M + 3M ranges.
const MEDIUM_TERM_CHART_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=90";
const FEAR_GREED_URL = "https://api.alternative.me/fng/?limit=2";
const LIVE_PRICE_POLL_MS = 12 * 1000;
const MARKET_DATA_POLL_MS = 5 * 60 * 1000;
const SLOW_DATA_POLL_MS = 15 * 60 * 1000;     // Fear & Greed updates daily; difficulty + lightning hourly-ish
const LAST_BLOCK_POLL_MS = 30 * 1000;         // re-fetch block list every 30s; display ticks every 1s client-side
const LONG_TERM_POLL_MS = 20 * 60 * 1000;     // blockchain.info daily data; 20-min poll keeps it fresh without hammering
const MEDIUM_TERM_POLL_MS = 15 * 60 * 1000;   // CoinGecko hourly data; 15-min poll is well within free-tier rate limits
const RSS2JSON_URL = "https://api.rss2json.com/v1/api.json?rss_url=";

// Headlines / deep-analysis / adoption data live in src/data/*.js — see imports above.

// ─── UTILITIES ──────────────────────────────────────────────────
const fmt = (n, decimals = 0) => (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtUSD = (n) => "$" + fmt(n, 2);

const toFiniteNumber = (value) => {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

const formatRelativeDate = (unixSeconds) => {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Human-readable "time remaining" — used for difficulty-retarget countdown.
const formatRemainingTime = (ms) => {
  if (!Number.isFinite(ms) || ms <= 0) return "soon";
  const days = ms / 86400000;
  if (days >= 2) return `${Math.round(days)} days`;
  const hours = ms / 3600000;
  if (hours >= 2) return `${Math.round(hours)} hours`;
  const minutes = Math.max(1, Math.round(ms / 60000));
  return `${minutes} min`;
};

// "X min Y sec ago" style — used for time-since-last-block ticker.
const formatElapsed = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "just now";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s ago`;
  return `${m}m ${s.toString().padStart(2, "0")}s ago`;
};

// Friendly market-cap size comparison for newbies — pick the closest familiar
// reference point so $1.6T reads as "≈ size of Google".
const marketCapComparison = (usd) => {
  if (!Number.isFinite(usd) || usd <= 0) return null;
  const refs = [
    { name: "Apple", value: 3.4e12 },
    { name: "NVIDIA", value: 3.1e12 },
    { name: "Microsoft", value: 3.0e12 },
    { name: "Google", value: 2.1e12 },
    { name: "Amazon", value: 1.9e12 },
    { name: "silver", value: 1.7e12 },
    { name: "Saudi Aramco", value: 1.6e12 },
    { name: "Meta", value: 1.4e12 },
    { name: "Berkshire Hathaway", value: 1.0e12 },
    { name: "Tesla", value: 8.0e11 },
  ];
  let best = refs[0];
  let bestDiff = Math.abs(Math.log(refs[0].value / usd));
  for (const r of refs) {
    const diff = Math.abs(Math.log(r.value / usd));
    if (diff < bestDiff) { best = r; bestDiff = diff; }
  }
  return `≈ size of ${best.name}`;
};

const TAG_COLORS = {
  MACRO:       { bg: "rgba(239,68,68,0.15)",    text: "#f87171" },
  FED:         { bg: "rgba(245,158,11,0.15)",   text: "#fbbf24" },
  PRICE:       { bg: "rgba(34,197,94,0.15)",    text: "#4ade80" },
  DERIVATIVES: { bg: "rgba(168,85,247,0.15)",   text: "#c084fc" },
  GEOPOLITICS: { bg: "rgba(244,114,182,0.15)",  text: "#f472b6" },
  MINING:      { bg: "rgba(6,182,212,0.15)",    text: "#22d3ee" },
  ALTCOINS:    { bg: "rgba(234,179,8,0.15)",    text: "#facc15" },
  ETFs:        { bg: "rgba(59,130,246,0.15)",   text: "#60a5fa" },
  ANALYSIS:    { bg: "rgba(168,85,247,0.15)",   text: "#c084fc" },
  CORPORATE:   { bg: "rgba(99,102,241,0.15)",   text: "#a5b4fc" },
  REGULATION:  { bg: "rgba(251,146,60,0.15)",   text: "#fb923c" },
  RESERVES:    { bg: "rgba(247,147,26,0.15)",   text: "#fbbf24" },
  SENTIMENT:   { bg: "rgba(234,179,8,0.15)",    text: "#facc15" },
  "ON-CHAIN":  { bg: "rgba(34,197,94,0.15)",    text: "#4ade80" },
  TRADING:     { bg: "rgba(34,197,94,0.15)",    text: "#4ade80" },
  EXCHANGE:    { bg: "rgba(59,130,246,0.15)",   text: "#60a5fa" },
  TECHNOLOGY:  { bg: "rgba(34,197,94,0.15)",    text: "#4ade80" },
  BUSINESS:    { bg: "rgba(99,102,241,0.15)",   text: "#a5b4fc" },
  MARKET:      { bg: "rgba(239,68,68,0.15)",    text: "#f87171" },
  NEWS:        { bg: "rgba(107,114,128,0.15)",  text: "#9ca3af" },
};

const TAG_FALLBACK = { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };

const decodeEntities = (str) => {
  if (!str) return "";
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
};

const stripHtml = (str) => decodeEntities((str || "").replace(/<[^>]*>/g, "")).trim();

// rss2json returns categories as an array of strings. Pick the first matching tag.
const pickTagFromArray = (cats) => {
  if (!cats || cats.length === 0) return "NEWS";
  const upper = cats.map((c) => String(c).trim().toUpperCase()).filter(Boolean);
  for (const c of upper) {
    if (TAG_COLORS[c]) return c;
    if (c.includes("BITCOIN") || c === "BTC") return "PRICE";
    if (c.includes("MINING")) return "MINING";
    if (c.includes("ETF")) return "ETFs";
    if (c.includes("REGULAT")) return "REGULATION";
    if (c.includes("MARKET")) return "MARKET";
    if (c.includes("FINANCE")) return "MACRO";
    if (c.includes("TECH")) return "TECHNOLOGY";
  }
  return "NEWS";
};

const isBitcoinRelevant = (title, categories) => {
  const haystack = (title + " " + (categories || []).join(" ")).toLowerCase();
  return /bitcoin|btc|satoshi|halving|lightning|mining|hash\s?rate|bitcoin\s?mag/.test(haystack);
};

// Heuristic — flags high-impact stories so the UI can star them.
// Triggers on macro/regulatory events, ATHs, billion-dollar flows, and major
// state/corporate moves. Tuned to be conservative; better to miss than over-star.
const isImportantHeadline = (title) => {
  const t = (title || "").toLowerCase();
  if (/all[-\s]?time high|\bath\b|record high|new high/.test(t)) return true;
  if (/\$\d+(\.\d+)?\s?(b|bn|billion|trillion|t\b)/.test(t)) return true;
  if (/strategic (bitcoin )?reserve|executive order|white house/.test(t)) return true;
  if (/\b(sec|fed|federal reserve|treasury|cftc|fdic)\b/.test(t) && /(approve|reject|cut|hike|rule|ruling|policy|signal)/.test(t)) return true;
  if (/halving|difficulty.*(ath|record)|hashrate.*(ath|record)/.test(t)) return true;
  if (/\b(strategy|microstrategy|metaplanet|blackrock|fidelity)\b.*(buy|purchase|add|accumulate|holding)/.test(t)) return true;
  if (/spot (bitcoin )?etf.*(inflow|outflow|aum|approve|launch)/.test(t)) return true;
  if (/breaks?\s?\$\d|reclaims?\s?\$\d|crosses?\s?\$\d/.test(t)) return true;
  return false;
};

// ─── HOOKS ──────────────────────────────────────────────────────

// Live Bitcoin market data. Coinbase drives the fast price refresh; CoinGecko is
// cached more heavily, so it is used for slower market metadata.
const BTC_CACHE_KEY = "btc-dashboard.priceCache";
const readPriceCache = () => {
  try {
    const raw = localStorage.getItem(BTC_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (Date.now() - c.ts > 86400000) return null;
    return c;
  } catch { return null; }
};

const useBitcoinData = () => {
  const cached = readPriceCache();
  const [data, setData] = useState({
    price: cached?.price ?? null,
    change24h: cached?.change24h ?? null,
    marketCap: null,
    circulatingSupply: null,
    totalVolume: null,
    high24h: null,
    low24h: null,
    ath: null,
    athDate: null,
    chartData: [],
    longTermChart: [],
    mediumTermChart: [],
    blockHeight: null,
    hashrate: null,
    difficulty: null,
    fastFee: null,
    hourFee: null,
    mempoolCount: null,
    change7d: null,
    atl: null,
    atlDate: null,
    dominance: null,
    fearGreed: null,
    difficultyAdjust: null,
    lastBlock: null,
    lightning: null,
    lastUpdate: cached ? new Date(cached.ts) : null,
    loading: !cached,
    error: null,
  });
  const fetchersRef = useRef(null);

  useEffect(() => {
    const ac = new AbortController();
    let liveTimer;
    let marketTimer;
    let slowTimer;
    let lastBlockTimer;
    let cancelled = false;
    let liveInFlight = false;
    let marketInFlight = false;
    let slowInFlight = false;
    let lastBlockInFlight = false;
    let longTermInFlight = false;
    let mediumTermInFlight = false;

    const downsampleSparkline = (prices, currentPrice) => {
      if (!prices || prices.length === 0) return [];
      const total = prices.length; // ~168 hourly prices from CoinGecko sparkline_7d
      const step = 1;              // keep every point — 168 hourly points renders fast and gives full resolution
      const now = Date.now();
      const startMs = now - 7 * 24 * 3600 * 1000;
      const msPerPoint = (7 * 24 * 3600 * 1000) / total;
      const out = [];
      for (let i = 0; i < total - step; i += step) {
        const t = startMs + i * msPerPoint;
        out.push({
          t,
          date: new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: prices[i],
        });
      }
      out.push({
        t: now,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: currentPrice ?? prices[prices.length - 1],
      });
      return out;
    };

    // blockchain.info returns all-time daily { x: unixSec, y: priceUSD } points (~5500+ from 2010).
    // Keep full daily resolution so PriceChart can slice any sub-range and apply per-range downsampling.
    const downsampleLongTerm = (values) => {
      if (!Array.isArray(values) || values.length === 0) return [];
      const out = [];
      for (const entry of values) {
        if (!entry || typeof entry.x !== "number" || typeof entry.y !== "number") continue;
        out.push({
          t: entry.x * 1000,
          // Default label kept "Mon YYYY" for back-compat with DCA / drawdown displays.
          // PriceChart overrides this with day-level labels for short ranges.
          date: new Date(entry.x * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          price: entry.y,
        });
      }
      return out;
    };

    // CoinGecko market_chart returns [[timestamp_ms, price], ...] — already in ms, no conversion.
    // Covers the last 90 days at hourly granularity (~2160 pts) on the free tier.
    const downsampleMediumTerm = (prices) => {
      if (!Array.isArray(prices) || prices.length === 0) return [];
      return prices.map(([t, price]) => ({
        t,
        date: new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price,
      }));
    };

    const refreshChartPrice = (chartData, price) => {
      if (!Array.isArray(chartData) || chartData.length === 0 || price == null) {
        return chartData || [];
      }

      const next = [...chartData];
      next[next.length - 1] = {
        ...next[next.length - 1],
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price,
      };
      return next;
    };

    const fetchLivePrice = async () => {
      if (liveInFlight) return;
      liveInFlight = true;

      try {
        const res = await fetch(COINBASE_TICKER_URL, { signal: ac.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`Coinbase HTTP ${res.status}`);

        const ticker = await res.json();
        const price = toFiniteNumber(ticker.price);
        if (price == null) throw new Error("Coinbase returned no BTC price");

        if (cancelled) return;

        setData((prev) => {
          try { localStorage.setItem(BTC_CACHE_KEY, JSON.stringify({ price, change24h: prev.change24h, ts: Date.now() })); } catch {}
          return {
            ...prev,
            price,
            marketCap: prev.circulatingSupply ? price * prev.circulatingSupply : prev.marketCap,
            chartData: refreshChartPrice(prev.chartData, price),
            lastUpdate: new Date(),
            loading: false,
            error: null,
          };
        });
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: e.message || "Live price update failed",
        }));
      } finally {
        liveInFlight = false;
      }
    };

    const fetchMarketData = async () => {
      if (marketInFlight) return;
      marketInFlight = true;

      try {
        const [cgRes, blockRes, hashRes, feesRes, mempoolRes, globalRes] = await Promise.all([
          fetch(COINGECKO_MARKET_URL, { signal: ac.signal, cache: "no-store" }),
          fetch(MEMPOOL_BLOCK_URL, { signal: ac.signal }).catch(() => null),
          fetch(MEMPOOL_HASHRATE_URL, { signal: ac.signal }).catch(() => null),
          fetch(MEMPOOL_FEES_URL, { signal: ac.signal }).catch(() => null),
          fetch(MEMPOOL_MEMPOOL_URL, { signal: ac.signal }).catch(() => null),
          fetch(COINGECKO_GLOBAL_URL, { signal: ac.signal, cache: "no-store" }).catch(() => null),
        ]);

        if (!cgRes.ok) throw new Error(`CoinGecko HTTP ${cgRes.status}`);
        const cg = await cgRes.json();
        const md = cg.market_data;

        let blockHeight = null;
        if (blockRes && blockRes.ok) {
          const txt = await blockRes.text();
          const n = parseInt(txt, 10);
          if (Number.isFinite(n)) blockHeight = n;
        }

        let hashrate = null;
        let difficulty = null;
        if (hashRes && hashRes.ok) {
          const h = await hashRes.json().catch(() => null);
          if (h) {
            hashrate = toFiniteNumber(h.currentHashrate);
            difficulty = toFiniteNumber(h.currentDifficulty);
          }
        }

        let fastFee = null;
        let hourFee = null;
        if (feesRes && feesRes.ok) {
          const f = await feesRes.json().catch(() => null);
          if (f) {
            fastFee = toFiniteNumber(f.fastestFee);
            hourFee = toFiniteNumber(f.hourFee);
          }
        }

        let mempoolCount = null;
        if (mempoolRes && mempoolRes.ok) {
          const m = await mempoolRes.json().catch(() => null);
          if (m) mempoolCount = toFiniteNumber(m.count);
        }

        let dominance = null;
        if (globalRes && globalRes.ok) {
          const g = await globalRes.json().catch(() => null);
          const v = g?.data?.market_cap_percentage?.btc;
          dominance = toFiniteNumber(v);
        }

        if (cancelled) return;

        const price = md.current_price?.usd ?? null;
        const sparkline = md.sparkline_7d?.price ?? [];

        setData((prev) => {
          const livePrice = prev.price ?? price;

          return {
            ...prev,
            price: livePrice,
            change24h: md.price_change_percentage_24h ?? null,
            change7d: md.price_change_percentage_7d ?? null,
            marketCap: md.market_cap?.usd ?? null,
            circulatingSupply: md.circulating_supply ?? null,
            totalVolume: md.total_volume?.usd ?? null,
            high24h: md.high_24h?.usd ?? null,
            low24h: md.low_24h?.usd ?? null,
            ath: md.ath?.usd ?? null,
            athDate: md.ath_date?.usd ?? null,
            atl: md.atl?.usd ?? null,
            atlDate: md.atl_date?.usd ?? null,
            chartData: downsampleSparkline(sparkline, livePrice),
            blockHeight: blockHeight ?? prev.blockHeight,
            hashrate: hashrate ?? prev.hashrate,
            difficulty: difficulty ?? prev.difficulty,
            fastFee: fastFee ?? prev.fastFee,
            hourFee: hourFee ?? prev.hourFee,
            mempoolCount: mempoolCount ?? prev.mempoolCount,
            dominance: dominance ?? prev.dominance,
            lastUpdate: prev.lastUpdate ?? new Date(),
            loading: false,
            error: prev.error?.startsWith("Coinbase") ? prev.error : null,
          };
        });
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: prev.price == null ? e.message || "Network error" : prev.error,
        }));
      } finally {
        marketInFlight = false;
      }
    };

    // Fear & Greed + Difficulty Adjustment + Lightning Network — all change slowly.
    // Each request is isolated via .catch(() => null) so one failure doesn't block the others.
    const fetchSlowData = async () => {
      if (slowInFlight) return;
      slowInFlight = true;

      try {
        const [fgRes, diffRes, lnRes] = await Promise.all([
          fetch(FEAR_GREED_URL, { signal: ac.signal }).catch(() => null),
          fetch(MEMPOOL_DIFFICULTY_URL, { signal: ac.signal }).catch(() => null),
          fetch(MEMPOOL_LIGHTNING_URL, { signal: ac.signal }).catch(() => null),
        ]);

        let fearGreed = null;
        if (fgRes && fgRes.ok) {
          const j = await fgRes.json().catch(() => null);
          const entries = j?.data;
          if (Array.isArray(entries) && entries.length > 0) {
            const today = entries[0];
            const prev = entries[1];
            const value = toFiniteNumber(today.value);
            if (value != null) {
              fearGreed = {
                value,
                classification: today.value_classification || "",
                previousValue: prev ? toFiniteNumber(prev.value) : null,
              };
            }
          }
        }

        let difficultyAdjust = null;
        if (diffRes && diffRes.ok) {
          const d = await diffRes.json().catch(() => null);
          if (d) {
            difficultyAdjust = {
              difficultyChange: toFiniteNumber(d.difficultyChange),
              remainingBlocks: toFiniteNumber(d.remainingBlocks),
              remainingTimeMs: toFiniteNumber(d.remainingTime),
              estimatedRetargetDate: toFiniteNumber(d.estimatedRetargetDate),
            };
          }
        }

        let lightning = null;
        if (lnRes && lnRes.ok) {
          const j = await lnRes.json().catch(() => null);
          const l = j?.latest;
          if (l) {
            lightning = {
              capacitySats: toFiniteNumber(l.total_capacity),
              channelCount: toFiniteNumber(l.channel_count),
              nodeCount: toFiniteNumber(l.node_count),
            };
          }
        }

        if (cancelled) return;
        if (fearGreed || difficultyAdjust || lightning) {
          setData((prev) => ({
            ...prev,
            fearGreed: fearGreed ?? prev.fearGreed,
            difficultyAdjust: difficultyAdjust ?? prev.difficultyAdjust,
            lightning: lightning ?? prev.lightning,
          }));
        }
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        // swallow — non-essential data, page still works without it
      } finally {
        slowInFlight = false;
      }
    };

    // Last block — fetches the most recent block's timestamp + miner pool.
    // Display ticks every 1s client-side via useElapsed; we only re-fetch every 30s.
    const fetchLastBlock = async () => {
      if (lastBlockInFlight) return;
      lastBlockInFlight = true;

      try {
        const res = await fetch(MEMPOOL_BLOCKS_URL, { signal: ac.signal });
        if (!res.ok) return;
        const blocks = await res.json().catch(() => null);
        const b = Array.isArray(blocks) && blocks.length > 0 ? blocks[0] : null;
        if (!b) return;

        const timestamp = toFiniteNumber(b.timestamp);
        const height = toFiniteNumber(b.height);
        const poolName = b.extras?.pool?.name || null;

        if (cancelled || timestamp == null) return;
        setData((prev) => ({
          ...prev,
          lastBlock: { timestamp, height, poolName },
        }));
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
      } finally {
        lastBlockInFlight = false;
      }
    };

    const fetchLongTermChart = async () => {
      if (longTermInFlight) return;
      longTermInFlight = true;
      try {
        const res = await fetch(LONG_TERM_CHART_URL, { signal: ac.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`blockchain.info market-price HTTP ${res.status}`);
        const json = await res.json();
        const downsampled = downsampleLongTerm(json?.values);
        if (cancelled || downsampled.length === 0) return;
        setData((prev) => ({ ...prev, longTermChart: downsampled }));
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        // Silent failure — the 7-day chart owns the top-level error UI
      } finally {
        longTermInFlight = false;
      }
    };

    const fetchMediumTermChart = async () => {
      if (mediumTermInFlight) return;
      mediumTermInFlight = true;
      try {
        const res = await fetch(MEDIUM_TERM_CHART_URL, { signal: ac.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`CoinGecko market_chart HTTP ${res.status}`);
        const json = await res.json();
        const processed = downsampleMediumTerm(json?.prices);
        if (cancelled || processed.length === 0) return;
        setData((prev) => ({ ...prev, mediumTermChart: processed }));
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
      } finally {
        mediumTermInFlight = false;
      }
    };

    fetchersRef.current = { fetchLivePrice, fetchMarketData, fetchSlowData, fetchLastBlock, fetchLongTermChart, fetchMediumTermChart };
    fetchMarketData();
    fetchLivePrice();
    fetchSlowData();
    fetchLastBlock();
    fetchLongTermChart();
    fetchMediumTermChart();
    liveTimer = setInterval(fetchLivePrice, LIVE_PRICE_POLL_MS);
    marketTimer = setInterval(fetchMarketData, MARKET_DATA_POLL_MS);
    slowTimer = setInterval(fetchSlowData, SLOW_DATA_POLL_MS);
    lastBlockTimer = setInterval(fetchLastBlock, LAST_BLOCK_POLL_MS);
    const longTermTimer = setInterval(fetchLongTermChart, LONG_TERM_POLL_MS);
    const mediumTermTimer = setInterval(fetchMediumTermChart, MEDIUM_TERM_POLL_MS);

    return () => {
      cancelled = true;
      ac.abort();
      clearInterval(liveTimer);
      clearInterval(marketTimer);
      clearInterval(slowTimer);
      clearInterval(lastBlockTimer);
      clearInterval(longTermTimer);
      clearInterval(mediumTermTimer);
    };
  }, []);

  const refresh = useCallback(() => {
    const f = fetchersRef.current;
    if (!f) return;
    f.fetchLivePrice();
    f.fetchMarketData();
    f.fetchSlowData();
    f.fetchLastBlock();
  }, []);

  return { ...data, refresh };
};

// Live Bitcoin news — multiple RSS feeds via rss2json proxy. Refreshed every 5 minutes.
const useBitcoinNews = () => {
  const [state, setState] = useState({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ac = new AbortController();
    let timer;
    let cancelled = false;

    const fetchNews = async () => {
      try {
        const results = await Promise.all(
          NEWS_FEEDS.map((feed) =>
            fetch(RSS2JSON_URL + encodeURIComponent(feed.url), { signal: ac.signal })
              .then((r) => (r.ok ? r.json() : null))
              .then((j) => {
                if (!j || j.status !== "ok") return [];
                return (j.items || []).map((it) => ({ ...it, _source: feed.source, _btcOnly: feed.btcOnly }));
              })
              .catch(() => [])
          )
        );

        const merged = results.flat();
        if (merged.length === 0) throw new Error("All news feeds failed");

        const filtered = merged.filter((it) => it._btcOnly || isBitcoinRelevant(it.title, it.categories));
        const items = filtered
          .map((it) => {
            const title = stripHtml(it.title);
            return {
              date: it.pubDate ? new Date(it.pubDate.replace(" ", "T") + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
              ts: it.pubDate ? new Date(it.pubDate.replace(" ", "T") + "Z").getTime() : 0,
              title,
              source: it._source,
              tag: pickTagFromArray(it.categories),
              url: it.link,
              important: isImportantHeadline(title),
            };
          })
          .sort((a, b) => b.ts - a.ts)
          .slice(0, 25);

        if (cancelled) return;
        setState({ items, loading: false, error: null });
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setState((prev) => ({
          items: prev.items.length ? prev.items : FALLBACK_NEWS,
          loading: false,
          error: e.message || "Network error",
        }));
      }
    };

    fetchNews();
    timer = setInterval(fetchNews, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      ac.abort();
      clearInterval(timer);
    };
  }, []);

  return state;
};

// Animates from previous value to target over `duration`. Uses setInterval (not rAF) so
// it ticks reliably even when the tab is throttled (puppeteer/background tab).
const useAnimatedValue = (target, duration = 1500) => {
  const [value, setValue] = useState(target ?? 0);
  const fromRef = useRef(target ?? 0);
  useEffect(() => {
    if (target == null || !Number.isFinite(target)) return;
    const from = fromRef.current;
    if (Math.abs(target - from) < 1) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const v = from + (target - from) * eased;
      fromRef.current = v;
      setValue(v);
      if (progress >= 1) clearInterval(timer);
    };
    const timer = setInterval(tick, 33);
    tick();
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

// Re-renders every second with the elapsed seconds since a given Unix-seconds timestamp.
// Used by Time-Since-Last-Block so the display ticks live without re-fetching the API.
const useElapsed = (unixSeconds) => {
  const [elapsed, setElapsed] = useState(() => unixSeconds ? Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds) : null);
  useEffect(() => {
    if (!Number.isFinite(unixSeconds)) {
      setElapsed(null);
      return;
    }
    const tick = () => setElapsed(Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [unixSeconds]);
  return elapsed;
};

// ─── PRESENTATION COMPONENTS ────────────────────────────────────

const useOnlineStatus = () => {
  const [online, setOnline] = useState(() => typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
};

const usePullToRefresh = (onRefresh, enabled = true) => {
  const startY = useRef(null);
  const pulling = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const threshold = 80;

    const onTouchStart = (e) => {
      if (window.scrollY > 5) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };
    const onTouchMove = (e) => {
      if (!pulling.current || startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy < 0) { pulling.current = false; setPullDistance(0); return; }
      const deltaX = Math.abs(e.touches[0].clientX - (e.touches[0].clientX));
      if (window.scrollY > 5) { pulling.current = false; setPullDistance(0); return; }
      setPullDistance(Math.min(dy * 0.5, 120));
    };
    const onTouchEnd = () => {
      if (pulling.current && pullDistance >= threshold && !refreshing) {
        setRefreshing(true);
        onRefresh();
        setTimeout(() => setRefreshing(false), 1200);
      }
      pulling.current = false;
      startY.current = null;
      setPullDistance(0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, onRefresh, pullDistance, refreshing]);

  return { pullDistance, refreshing };
};

const useSwipeNavigation = (activeTab, setActiveTab, tabCount, enabled = true) => {
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const isScrollable = (el) => {
      while (el && el !== document.body) {
        const s = window.getComputedStyle(el);
        if ((s.overflowX === "auto" || s.overflowX === "scroll") && el.scrollWidth > el.clientWidth) return true;
        el = el.parentElement;
      }
      return false;
    };

    const onStart = (e) => {
      if (isScrollable(e.target)) { startRef.current = null; return; }
      startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e) => {
      if (!startRef.current) return;
      const dx = e.changedTouches[0].clientX - startRef.current.x;
      const dy = e.changedTouches[0].clientY - startRef.current.y;
      startRef.current = null;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < 60) return;
      if (dx < 0 && activeTab < tabCount - 1) {
        setActiveTab(activeTab + 1);
        if (navigator.vibrate) navigator.vibrate(10);
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (dx > 0 && activeTab > 0) {
        setActiveTab(activeTab - 1);
        if (navigator.vibrate) navigator.vibrate(10);
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [enabled, activeTab, setActiveTab, tabCount]);
};

const Pulse = ({ color = "#f7931a" }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
    <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", backgroundColor: color, opacity: 0.75, animation: "scaleIn 1.5s ease-in-out infinite" }} />
    <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", backgroundColor: color }} />
  </span>
);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useIsMobile = (breakpoint = 540) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
};

const shouldAnimate = () =>
  !prefersReducedMotion() &&
  typeof window !== "undefined" &&
  (!window.matchMedia || !window.matchMedia("(max-width: 760px)").matches);

const Reveal = ({ children, delay = 0, scale = false, className = "", as: Tag = "div", style }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());
  useEffect(() => {
    if (prefersReducedMotion()) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${scale ? "reveal-scale" : "reveal"} ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: delay + "s", ...style }}>
      {children}
    </Tag>
  );
};

// Latest-passed-section tracker. Active = highest-index ref whose top has
// crossed above `triggerRatio * viewportHeight`. Uses IntersectionObserver
// (cheaper and more reliable than scroll-event polling) with a top rootMargin
// that defines the trigger line. Better than useScrollSpy for long-form pages
// where sections vary in height: the chip says "you're reading section N"
// until section N+1 actually starts.
const useActiveSection = (refs, { triggerRatio = 0.3 } = {}) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const recompute = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const threshold = vh * triggerRatio;
      let best = 0;
      for (let i = 0; i < refs.length; i++) {
        const el = refs[i] && refs[i].current;
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) best = i;
        else break;
      }
      setActive(best);
    };
    recompute();
    window.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute, { passive: true });
    return () => {
      window.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [refs, triggerRatio]);
  return active;
};

const useScrollSpy = (refs, { centerRatio = 0.4 } = {}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const elements = refs.map((r) => r && r.current).filter(Boolean);
    if (elements.length === 0) return;
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const target = vh * centerRatio;
      let best = 0;
      let bestDist = Infinity;
      elements.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const elCenter = (r.top + r.bottom) / 2;
        const dist = Math.abs(elCenter - target);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActiveIndex(best);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [refs, centerRatio]);
  return activeIndex;
};

// `pinned` mode treats progress as the distance the wrap has been scrolled
// past its sticky pin-point: progress=0 while the wrap is entering view (so
// scrollytelling chapters stay locked on chapter 0 until the full stage is
// in view) and progress=1 when the wrap is about to release the pin.
// `pinTop` is the sticky offset in px (e.g. the page-header height).
const useScrollProgress = (ref, { pinned = false, pinTop = 0 } = {}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      let p;
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (pinned) {
          const total = rect.height - vh + pinTop;
          p = total > 0 ? Math.max(0, Math.min(1, (pinTop - rect.top) / total)) : 0;
        } else {
          const total = rect.height + vh;
          const seen = vh - rect.top;
          p = total > 0 ? Math.max(0, Math.min(1, seen / total)) : 0;
        }
      } else {
        const doc = document.documentElement;
        const max = (doc.scrollHeight - doc.clientHeight) || 1;
        p = Math.max(0, Math.min(1, (window.scrollY || doc.scrollTop) / max));
      }
      setProgress(p);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [ref, pinned, pinTop]);
  return progress;
};

const useScrolled = (threshold = 24) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const evaluate = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled((prev) => {
        if (prev && y < threshold - 8) return false;
        if (!prev && y > threshold) return true;
        return prev;
      });
    };
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, [threshold]);
  return scrolled;
};

const PageScrollProgressBar = () => {
  const ref = useRef(null);
  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const p = Math.max(0, Math.min(1, (window.scrollY || doc.scrollTop) / max));
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);
  return <span ref={ref} className="thesis-progress-fill" aria-hidden="true" />;
};

const useCountUp = (target, { trigger = true, duration = 1400, from = 0 } = {}) => {
  const [value, setValue] = useState(prefersReducedMotion() ? target : from);
  useEffect(() => {
    if (!trigger) return;
    if (prefersReducedMotion()) { setValue(target); return; }
    let rafId = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => { if (rafId) window.cancelAnimationFrame(rafId); };
  }, [target, trigger, duration]);
  return value;
};

const parseNumericMetric = (raw) => {
  const match = String(raw).match(/^(~)?([\d.]+)([A-Za-z+/].*)?$/);
  if (!match) return null;
  const num = parseFloat(match[2]);
  if (!isFinite(num)) return null;
  return { prefix: match[1] || "", target: num, suffix: match[3] || "", decimals: (match[2].split(".")[1] || "").length };
};

const Skeleton = ({ width = "100%", height = 16, radius = 6, style }) => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-block",
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg, var(--bg-card) 25%, var(--border-subtle) 50%, var(--bg-card) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s ease-in-out infinite",
      ...style,
    }}
  />
);

// Per-panel data source + freshness attribution.
const DataSource = ({ source, updatedAt }) => {
  if (!source) return null;
  const diff = updatedAt ? Math.floor((Date.now() - updatedAt.getTime()) / 1000) : null;
  const rel = diff == null ? null : diff < 60 ? `${diff}s ago` : diff < 3600 ? `${Math.floor(diff / 60)}m ago` : `${Math.floor(diff / 3600)}h ago`;
  return (
    <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--border-subtle)", letterSpacing: "0.04em" }}>
      Source: {source}{rel ? ` · Updated ${rel}` : ""}
    </div>
  );
};

// Subtle attribution link used inside StatCard's `sub` prop.
const SourceLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    onClick={(e) => e.stopPropagation()}
    style={{ color: "var(--text-dim)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 2 }}
  >
    {label}
  </a>
);

const TERM_DEFINITIONS = {
  hashrate:   "Total computing power securing Bitcoin. More hashrate means harder to attack.",
  halving:    "Every ~4 years, new BTC issuance cuts in half. Programmed scarcity built into the protocol.",
  difficulty: "Mining auto-adjusts every 2,016 blocks to keep new blocks arriving ~every 10 minutes.",
  dominance:  "Bitcoin's share of the total crypto market value.",
  lightning:  "A faster, cheaper payment layer built on top of Bitcoin for small, near-instant transactions.",
  etf:        "Exchange-Traded Fund: a way to buy Bitcoin through your regular brokerage as a stock-like share. Lets pension funds and 401(k)s hold BTC without touching crypto directly.",
  probability: "My estimated chance this happens, between 0 (impossible) and 1 (certain). 0.60 means I think it's modestly more likely than not.",
  brier:      "A score for how well-calibrated my past forecasts have been. Lower is better — 0 is perfect, 0.25 is coin-flip level, anything under 0.10 is strong.",
  distribution: "When existing holders are selling down their position over time — the opposite of accumulation.",
  liquidation: "When a trader who borrowed money to bet on Bitcoin is automatically sold out because the price moved against them. Lots of these at once snowball into a fast drop.",
  leverage: "Borrowing money to make a bigger bet than your own cash allows — it magnifies both gains and losses.",
  deleveraging: "A wave of borrowed-money bets being unwound — traders selling to pay back loans. It pushes prices down fast, then burns itself out.",
  drawdown: "How far the price has fallen from its most recent peak, in percent. A 50% drawdown means it's half its high.",
  sats: "Short for 'satoshis' — the smallest unit of Bitcoin. 100,000,000 sats = 1 BTC, the same way 100 cents = $1.",
  selfcustody: "Holding your own private keys instead of leaving your Bitcoin on an exchange or with a custodian. Nobody can move it without you — but nobody can recover it for you either.",
  coldstorage: "Keeping private keys on a device that's never connected to the internet (like a hardware wallet), so remote hackers can't reach them.",
  m2: "A measure of the total money supply — cash, checking accounts, and easily-accessible savings. When M2 grows faster than the economy produces goods, each existing dollar's claim on those goods shrinks.",
  dca: "Dollar-cost averaging: buying a fixed amount on a fixed schedule (e.g. $50 every week) instead of trying to time the market. Removes the decision of 'is now the right time?' entirely.",
  seedphrase: "A list of 12–24 words that can recreate your private keys on any wallet. Anyone who has it can spend your Bitcoin — anyone who loses it, permanently, can't.",
};

const Term = ({ k, children }) => {
  const def = TERM_DEFINITIONS[k];
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  if (!def) return <>{children}</>;

  const onTap = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const POP_W = 240;
      const MARGIN = 12;
      let left = r.left + r.width / 2 - POP_W / 2;
      left = Math.max(MARGIN, Math.min(left, window.innerWidth - POP_W - MARGIN));
      setPos({ top: r.bottom + 8, left });
    }
    setOpen(p => !p);
  };

  const childText = typeof children === "string" ? children : "term";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-label={`Define ${childText}`}
        onClick={onTap}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          color: "inherit",
          font: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textDecorationColor: "var(--text-dim)",
          textUnderlineOffset: 2,
          cursor: "help",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          role="tooltip"
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 200,
            maxWidth: 240,
            background: "var(--bg-overlay)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 12.5,
            lineHeight: 1.45,
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            letterSpacing: "normal",
            textTransform: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          {def}
        </div>,
        document.body
      )}
    </>
  );
};

const TabNavChip = ({ label, tab, setActiveTab }) => (
  <button
    type="button"
    onClick={() => {
      setActiveTab(tab);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
    }}
    style={{
      fontSize: "var(--fs-xs)", fontFamily: "var(--font-sans)", fontWeight: 600,
      color: "var(--text-secondary)", background: "var(--bg-card-soft, var(--bg-base))",
      border: "1px solid var(--border-subtle)", borderRadius: 999,
      padding: "6px 12px", cursor: "pointer",
    }}
  >
    {label}
  </button>
);

const StatCard = ({ label, value, sub, accent, large, loading, source, updatedAt }) => (
  <div style={{
    background: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    padding: large ? "28px 24px" : "20px 18px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
  }}>
    <div style={{
      position: "absolute", top: 0, right: 0, width: 80, height: 80,
      background: `radial-gradient(circle at top right, ${accent || "var(--accent-bitcoin)"}18, transparent 70%)`,
    }} />
    {loading ? (
      <Skeleton height={large ? 32 : 26} width="65%" />
    ) : (
      <div style={{ fontSize: large ? "var(--fs-2xl)" : "clamp(22px, 1.5vw + 14px, 30px)", fontWeight: 900, color: "var(--text-primary)", fontFamily: "var(--font-mono)", lineHeight: 1.05, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    )}
    {sub && !loading && <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", marginTop: 5, fontFamily: "var(--font-mono)" }}>{sub}</div>}
    {sub && loading && <div style={{ marginTop: 6 }}><Skeleton height={12} width="50%" /></div>}
    <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginTop: 10, fontFamily: "var(--font-mono)" }}>{label}</div>
    {source && <DataSource source={source} updatedAt={updatedAt} />}
  </div>
);

// Tier-3 stat strip: borderless, just a top hairline rule. Used to demote the
// 8 "detail" metrics from competing cards to quiet scannable readouts.
const StatStrip = ({ label, value, sub, valueColor, loading }) => (
  <div className="tier3-strip">
    <div className="tier3-label">{label}</div>
    {loading ? (
      <Skeleton height={18} width="65%" />
    ) : (
      <div className="tier3-value" style={valueColor ? { color: valueColor } : undefined}>{value}</div>
    )}
    {sub && !loading && <div className="tier3-sub">{sub}</div>}
    {sub && loading && <div style={{ marginTop: 2 }}><Skeleton height={10} width="45%" /></div>}
  </div>
);

// Section group title: small Outfit ExtraBold caps + analytical hairline rule.
// Used to give the Dashboard's stat-strip rows semantic grouping (Market /
// Network / Mining & Supply).
const SectionGroup = ({ title, children, collapsible = false, defaultExpanded = true }) => {
  const isMobile = useIsMobile(760);
  const canCollapse = collapsible && isMobile;
  const [expanded, setExpanded] = useState(canCollapse ? defaultExpanded : true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div
        className="group-title-row"
        role={canCollapse ? "button" : undefined}
        tabIndex={canCollapse ? 0 : undefined}
        aria-expanded={canCollapse ? expanded : undefined}
        onClick={canCollapse ? () => setExpanded(p => !p) : undefined}
        onKeyDown={canCollapse ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(p => !p); } } : undefined}
        style={canCollapse ? { cursor: "pointer", userSelect: "none" } : undefined}
      >
        <span className="group-title">{title}</span>
        {canCollapse && (
          <span className="section-chevron" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 20, height: 20, fontSize: 10, color: "var(--text-dim)",
            transition: "transform 0.25s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            marginRight: 4,
          }}>▼</span>
        )}
        <span className="group-title-rule" aria-hidden="true" />
      </div>
      <div className="tier3-strip-row" style={{
        ...(canCollapse ? {
          maxHeight: expanded ? 600 : 0,
          overflow: "hidden",
          opacity: expanded ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.2s ease",
        } : {}),
      }}>{children}</div>
    </div>
  );
};

// "Supply Left to Mine" meter. Frames Bitcoin's hard cap from the scarcity lens: the headline is
// how little is LEFT (~4.6% of 21M), shown as a bright, shrinking sliver against the muted
// already-mined backdrop, plus a legible year ledger of what % was still left at each past Jan 1
// (49% in 2013 → ~5% now). History is static (src/data/supply-history.js, deterministic); the
// current point is appended live so the sliver + hero always equal the live remaining supply.
const SUPPLY_CAP_PAD = 8; // px of screen-space padding inside the meter; x stays LINEAR in pct
const supplyPctToLeft = (pct) => {
  const p = Math.max(0, Math.min(100, pct));
  return `calc(${SUPPLY_CAP_PAD}px + (100% - ${2 * SUPPLY_CAP_PAD}px) * ${p / 100})`;
};
const fmtBtcCompact = (n) => {
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return Math.round(n / 1e3) + "K";
  return String(Math.round(n));
};

const SupplyMeter = ({ mined, total, history }) => {
  const isMobile = useIsMobile(540);
  const reduced = prefersReducedMotion();
  const pctMined = total ? (mined / total) * 100 : 0;
  const pctLeft = Math.max(0, 100 - pctMined);
  const remaining = Math.max(0, total - mined);

  // Static anchors + the live point, sorted oldest→newest; each carries % left, BTC left, and the
  // amount mined since the prior point (how much the "left" sliver shrank).
  const points = useMemo(() => {
    const sorted = [...history].sort((a, b) => a.pctMined - b.pctMined);
    const nowYear = typeof Date !== "undefined" ? new Date().getUTCFullYear() : 2026;
    const all = [...sorted, { label: "Now", year: nowYear, minedBTC: mined, pctMined, live: true }];
    return all.map((p, i) => ({
      ...p,
      pctLeft: Math.max(0, 100 - p.pctMined),
      leftBTC: Math.max(0, total - p.minedBTC),
      minedSincePrev: i > 0 ? p.minedBTC - all[i - 1].minedBTC : null,
      prevLabel: i > 0 ? all[i - 1].label : null,
    }));
  }, [history, mined, pctMined, total]);

  const liveIdx = points.length - 1;
  const [selected, setSelected] = useState(liveIdx);
  useEffect(() => { setSelected(liveIdx); }, [liveIdx]); // keep the default pinned to "now"
  const sel = points[Math.min(selected, liveIdx)] || points[liveIdx];

  // Hero count-up to the % LEFT, once on mount; then track the live value directly so 5-minute
  // live polls don't re-trigger a count-from-zero. The whole card already fades in on scroll via
  // its <Reveal> wrapper, so the inner visuals render at their final state and the entrance is
  // pure enhancement — nothing here is hidden behind an observer that could fail to fire.
  const [heroVal, setHeroVal] = useState(reduced ? pctLeft : 0);
  const playedRef = useRef(false);
  useEffect(() => {
    if (reduced || playedRef.current) { setHeroVal(pctLeft); return; }
    if (!isFinite(pctLeft)) return;
    playedRef.current = true;
    let raf = 0;
    const t0 = performance.now();
    const target = pctLeft;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      setHeroVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = window.requestAnimationFrame(tick);
      else setHeroVal(target);
    };
    raf = window.requestAnimationFrame(tick);
    return () => { if (raf) window.cancelAnimationFrame(raf); };
  }, [pctLeft, reduced]);

  const meterH = isMobile ? 50 : 64;
  const animate = !reduced; // entrance animation; never gates visibility

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "24px 20px" }}>
      {/* HERO — how little is LEFT to mine */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <span style={{ display: "inline-flex", alignItems: "center", fontSize: "var(--fs-xs)", color: "var(--text-muted)", letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--status-up)", marginRight: 8, animation: reduced ? "none" : "glowPulse 2.4s ease-in-out infinite" }} />
          Supply Left to Mine
        </span>
        <span aria-label={`${pctLeft.toFixed(2)} percent of the 21 million bitcoin cap is still left to mine`} style={{ display: "inline-flex", alignItems: "baseline", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: "clamp(38px, 6vw, 58px)", lineHeight: 1, color: "var(--accent-bitcoin)" }}>
          {heroVal.toFixed(2)}
          <span style={{ fontSize: "0.3em", color: "var(--text-dim)", marginLeft: 6, letterSpacing: 1 }}>% LEFT</span>
        </span>
      </div>

      {/* METER — muted "already mined" backdrop; the bright shrinking sliver is what's LEFT */}
      <div role="group" aria-label="Bitcoin supply still left to mine before the 21 million cap" style={{ position: "relative", height: meterH }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-md)", background: "var(--bg-base)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
          {/* already mined — muted backdrop */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pctMined}%`, background: "var(--bg-card-elevated)", borderRight: "1px solid var(--border-strong)" }} />
          {/* still left to mine — bright sliver, grows in from the cap edge */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${pctLeft}%`, background: "linear-gradient(90deg, var(--accent-bitcoin), var(--accent-bitcoin-bright))", boxShadow: "0 0 24px var(--accent-bitcoin-glow)", transformOrigin: "right center", transform: animate ? undefined : (reduced ? undefined : "scaleX(0)"), animation: animate ? "hardnessBarGrow 0.95s var(--ease-out) both" : "none" }} />
        </div>
        {/* frontier node — the boundary between mined and left ("now") */}
        <div aria-hidden="true" style={{ position: "absolute", left: `calc(${supplyPctToLeft(pctMined)} - 6px)`, top: "calc(50% - 6px)", width: 12, height: 12, borderRadius: "50%", background: "var(--accent-bitcoin-bright)", border: "2px solid var(--bg-card)", boxShadow: "0 0 0 4px var(--accent-bitcoin-glow), 0 0 14px var(--accent-bitcoin-glow)", opacity: animate ? 1 : (reduced ? 1 : 0), transform: animate ? "scale(1)" : (reduced ? "scale(1)" : "scale(0.4)"), transition: reduced ? "none" : "opacity 0.4s ease 0.55s, transform 0.5s var(--ease-out) 0.55s" }} />
      </div>

      {/* FRONTIER RAIL — one dot per past Jan 1 (+ now); they crowd right as the sliver shrinks */}
      <div style={{ position: "relative", height: 16, marginTop: 8 }}>
        {points.map((p, i) => (
          <div key={"dot-" + p.label} className="meter-tick" data-selected={selected === i} data-live={p.live ? "true" : "false"}
            style={{ left: `calc(${supplyPctToLeft(p.pctMined)} - 3.5px)`, opacity: animate ? undefined : (reduced ? undefined : 0), animation: animate ? `meterTickIn 0.5s var(--ease-out) ${150 + i * 45}ms backwards` : "none" }} />
        ))}
      </div>

      {/* TEACHING CAPTION */}
      <div style={{ marginTop: 8, fontSize: "var(--fs-xs)", color: "var(--text-dim)", fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>
        Each dot is a past Jan 1 — the slice left to mine keeps shrinking, and ever more slowly as issuance halves.
      </div>

      {/* READOUT — detail for the selected point (defaults to today) */}
      <div aria-live="polite" style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        <strong style={{ fontWeight: 700, color: sel.live ? "var(--accent-bitcoin)" : "var(--accent-analytical-bright)" }}>{sel.live ? "Today" : sel.label}</strong>
        {" · "}{sel.pctLeft.toFixed(2)}% left{" · "}{fmt(Math.round(sel.leftBTC))} BTC left
        {sel.minedSincePrev != null && (
          <span style={{ color: "var(--text-dim)" }}>{`  ·  ${fmtBtcCompact(sel.minedSincePrev)} mined since ${sel.prevLabel}`}</span>
        )}
      </div>

      {/* YEAR LEDGER — % LEFT at each anchor, legible and click/hover-linked to the meter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {points.map((p, i) => {
          const on = selected === i;
          return (
            <button key={"pill-" + p.label} type="button" onMouseEnter={() => setSelected(i)} onFocus={() => setSelected(i)} onClick={() => setSelected(i)}
              aria-label={`${p.live ? "Today" : p.label}: ${p.pctLeft.toFixed(2)} percent left to mine`}
              style={{ display: "inline-flex", alignItems: "baseline", gap: 5, cursor: "pointer", padding: "5px 9px", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", background: on ? "var(--accent-bitcoin-soft)" : "var(--bg-base)", border: `1px solid ${on ? "var(--accent-bitcoin)" : "var(--border-subtle)"}`, transition: "background 0.2s ease, border-color 0.2s ease" }}>
              <span style={{ fontSize: "var(--fs-xs)", fontWeight: 600, color: p.live ? "var(--accent-bitcoin-bright)" : "var(--text-muted)" }}>{p.live ? "NOW" : "'" + String(p.year).slice(2)}</span>
              <span style={{ fontSize: "var(--fs-sm)", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: p.live ? "var(--accent-bitcoin)" : "var(--text-secondary)" }}>{p.pctLeft.toFixed(1)}%</span>
            </button>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--accent-bitcoin)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{fmt(Math.round(remaining))} BTC left to mine</span>
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{fmt(Math.round(mined))} of 21M mined</span>
      </div>
    </div>
  );
};

// Beginner-first explainer: "Why does Bitcoin fall like this?" Evergreen mechanics
// (copy in data/explainer.js) + a live strip read from existing props (% from ATH +
// current Market Pulse theme). Collapsed by default so the live price stays high.
// Uses distance from all-time high rather than a short-window % change — a weekly
// change can read "up" even while price is still deep below its ATH, which undercuts
// the explainer's premise.
const DipExplainerCard = ({ fromATH, theme, setActiveTab }) => {
  const [open, setOpen] = useState(false);
  const ath = typeof fromATH === "number" ? fromATH : null;
  const down = (ath || 0) < 0;
  const movePhrase = ath == null
    ? "Bitcoin's price swings a lot — here's why."
    : down
      ? `Bitcoin is down ${Math.abs(ath).toFixed(1)}% from its all-time high.`
      : "Bitcoin is at a new all-time high.";

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "18px 22px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
    }}>
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer",
          textAlign: "left", gap: 12,
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            New to Bitcoin?
          </span>
          <span style={{ fontSize: "var(--fs-md)", color: "var(--text-primary)", fontWeight: 800, fontFamily: "var(--font-sans)", lineHeight: 1.3 }}>
            {DIP_EXPLAINER.title}
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
          {open ? "Hide" : "Explain"}
          <span style={{ display: "inline-block", fontSize: 10, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
        </span>
      </button>

      {/* Live strip — always visible, reads existing data (no fetch, no stale copy) */}
      <div style={{
        marginTop: 12,
        display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 8,
        padding: "10px 12px",
        background: "var(--bg-base)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md, 10px)",
        borderLeft: `3px solid ${down ? "var(--status-down)" : "var(--status-up)"}`,
      }}>
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", fontWeight: 700 }}>
          {movePhrase}
        </span>
        {theme?.title && (
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
            What's driving it right now: {theme.title} — see Market Pulse above.
          </span>
        )}
      </div>

      {open && (
        <div className="tab-panel-enter" style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.65, margin: 0 }}>
            {DIP_EXPLAINER.intro}
          </p>

          {/* Drivers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DIP_EXPLAINER.drivers.map((d, i) => (
              <div key={d.name} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-bitcoin)", fontWeight: 800, minWidth: 20, flexShrink: 0, lineHeight: 1.6 }}>0{i + 1}</span>
                <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                    {d.term ? <Term k={d.term}>{d.name}</Term> : d.name}.
                  </strong>{" "}
                  {d.plain}
                </span>
              </div>
            ))}
          </div>

          {/* Perspective — the calm, time-preference framing */}
          <div style={{
            padding: "14px 16px",
            background: "var(--accent-bitcoin-faint, var(--bg-card-soft))",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md, 10px)",
            borderLeft: "3px solid var(--accent-bitcoin)",
          }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
              {DIP_EXPLAINER.perspective.heading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DIP_EXPLAINER.perspective.body.map((p, i) => (
                <p key={i} style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.6, margin: 0 }}>{p}</p>
              ))}
            </div>
          </div>

          {/* Audience chips → deeper tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "New here? · Start with the Thesis", tab: 1 },
              { label: "Want the deep read? · Forecast & Analysis", tab: 5 },
            ].map(chip => (
              <button
                key={chip.tab}
                type="button"
                onClick={() => setActiveTab(chip.tab)}
                style={{
                  fontSize: "var(--fs-xs)", fontFamily: "var(--font-sans)", fontWeight: 600,
                  color: "var(--text-secondary)", background: "var(--bg-card-soft, var(--bg-base))",
                  border: "1px solid var(--border-subtle)", borderRadius: 999,
                  padding: "6px 12px", cursor: "pointer",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-sans)", lineHeight: 1.5, margin: 0 }}>
            Educational only — not financial advice. Bitcoin can fall further, or for longer, than any single explanation expects.
          </p>
        </div>
      )}
    </div>
  );
};

const PriceDisplay = ({ price, change24h, lastUpdate, loading, fearGreedValue, fearGreedClass }) => {
  const isDown = (change24h || 0) < 0;
  const fg = typeof fearGreedValue === "number" ? fearGreedValue : null;
  const fgTone =
    fg == null ? null :
    fg < 30 ? { fg: "var(--status-down)", bg: "var(--status-down-soft)" } :
    fg < 50 ? { fg: "var(--status-warn)", bg: "var(--status-warn-soft)" } :
              { fg: "var(--status-up)",   bg: "var(--status-up-soft)" };
  return (
    <div className="price-display" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)",
      padding: "32px 28px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: -40, right: -40, width: 180, height: 180,
        background: "radial-gradient(circle, var(--accent-bitcoin-glow), transparent 65%)",
      }} />
      <div className="price-display-head" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: "space-between", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Pulse />
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-mono)" }}>Bitcoin Live Price</span>
        </div>
        {fg != null && (
          <span className="fg-pill" style={{
            fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", fontWeight: 700,
            letterSpacing: 1.1, textTransform: "uppercase",
            color: fgTone.fg, background: fgTone.bg,
            padding: "4px 10px", borderRadius: "var(--radius-sm)",
            whiteSpace: "nowrap",
          }} title="Crypto Fear & Greed Index">
            Fear &amp; Greed · {fg}{fearGreedClass ? <span className="fg-pill-class"> · {fearGreedClass}</span> : null}
          </span>
        )}
      </div>
      {loading || price == null ? (
        <Skeleton height={48} width="55%" />
      ) : (
        <div className="price-display-value" style={{ fontSize: "var(--fs-hero)", fontWeight: 900, color: "var(--text-primary)", fontFamily: "var(--font-sans)", lineHeight: 1, letterSpacing: -1 }}>
          {fmtUSD(price)}
        </div>
      )}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        {change24h != null && !loading && (
          <span style={{
            fontSize: "var(--fs-md)", fontWeight: 700, fontFamily: "var(--font-mono)",
            color: isDown ? "var(--status-down)" : "var(--status-up)",
            background: isDown ? "var(--status-down-soft)" : "var(--status-up-soft)",
            padding: "4px 10px", borderRadius: "var(--radius-sm)",
          }}>
            {isDown ? "▼" : "▲"} {Math.abs(change24h).toFixed(2)}%
          </span>
        )}
        {lastUpdate && (
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

const ErrorBanner = ({ message, lastUpdate }) => {
  if (!message) return null;
  const ageMin = lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / 60000) : null;
  return (
    <div role="status" aria-live="polite" style={{
      background: "var(--status-down-soft)",
      border: "1px solid var(--status-down)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: "var(--fs-sm)", color: "var(--status-down)", fontFamily: "var(--font-mono)",
    }}>
      <span aria-hidden="true">⚠</span>
      <span>
        Live data fetch failed{lastUpdate ? ` — showing cached values from ${ageMin}m ago` : ""}. Will retry shortly.
      </span>
    </div>
  );
};

// ─── PREFERENCES + STATUS COMPONENTS ────────────────────────────

// localStorage-backed state. Silent in SSR / private mode.
const usePersistedState = (key, fallback) => {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
};

// Bundles the dominant market theme with sentiment values.
// Theme is the editorial lede; F&G is surfaced separately by the price card.
const buildMarketPulse = ({ change24h, fearGreed, theme }) => {
  const pct = typeof change24h === "number" ? change24h : null;
  return {
    theme,
    change24h: pct,
    fearGreedValue: fearGreed?.value,
    fearGreedClass: fearGreed?.classification,
  };
};

const MarketPulseCard = ({ pulse, streakDays, setActiveTab }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = pulse.theme;
  const toneColor = {
    advancing: "var(--status-up)",
    passed: "var(--status-up)",
    active: "var(--status-info)",
    stalled: "var(--status-warn)",
  }[theme?.statusTone] || "var(--accent-bitcoin)";

  const toneSoft = {
    advancing: "var(--status-up-soft)",
    passed: "var(--status-up-soft)",
    active: "var(--status-info-soft)",
    stalled: "var(--status-warn-soft)",
  }[theme?.statusTone] || "var(--bg-card-elevated)";

  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="market-pulse-card" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderLeft: `3px solid ${toneColor}`,
      borderRadius: "var(--radius-lg)",
      padding: "18px 22px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {theme && (
        <>
          {theme.asOf && (
            <div style={{
              fontSize: "var(--fs-xs)", color: "var(--text-muted)",
              fontFamily: "var(--font-mono)", fontWeight: 700,
              letterSpacing: 1.2, textTransform: "uppercase",
            }}>
              {(() => {
                if (!theme.refreshedAt) return `Monday Briefing · Week of ${theme.asOf}`;
                const d = new Date(theme.refreshedAt);
                const tz = 'America/New_York';
                const day = d.toLocaleDateString('en-US', { timeZone: tz, weekday: 'long' });
                const mon = d.toLocaleDateString('en-US', { timeZone: tz, month: 'short' });
                const dom = d.toLocaleDateString('en-US', { timeZone: tz, day: 'numeric' });
                const yr = d.toLocaleDateString('en-US', { timeZone: tz, year: 'numeric' });
                const time = d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });
                return `Updated ${day} · ${mon} ${dom}, ${yr} ${time}`;
              })()}
            </div>
          )}
          <div className="market-pulse-title-row" style={{
            display: "flex", alignItems: "flex-start", gap: 12, justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
            <div style={{
              fontSize: "var(--fs-lg)", fontWeight: 800, color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.3, flex: "1 1 240px",
            }}>
              {theme.title}
            </div>
            {theme.status && (
              <span style={{
                fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", fontWeight: 700,
                color: toneColor, background: toneSoft,
                padding: "4px 10px", borderRadius: "var(--radius-sm)",
                textTransform: "uppercase", letterSpacing: 1.1, whiteSpace: "nowrap",
              }}>
                {theme.status}
              </span>
            )}
          </div>

          {theme.milestone && (
            <div style={{
              fontSize: "var(--fs-sm)", color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.5,
              padding: "8px 12px", background: toneSoft,
              borderRadius: "var(--radius-sm)",
              borderLeft: `2px solid ${toneColor}`,
            }}>
              <span style={{
                fontWeight: 700, color: toneColor,
                fontSize: "var(--fs-xs)", textTransform: "uppercase",
                letterSpacing: 1.1, fontFamily: "var(--font-mono)", marginRight: 8,
              }}>
                {theme.milestoneLabel || "Next Checkpoint"}
              </span>
              {theme.milestone}
            </div>
          )}


          {setActiveTab && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8,
              paddingTop: 4,
            }}>
              {[
                { label: "New to BTC? → Thesis", tab: 1 },
                { label: "Following along? → Headlines", tab: 3 },
              ].map(chip => (
                <button
                  key={chip.tab}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveTab(chip.tab); }}
                  className="audience-chip card-hover"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: "6px 12px",
                    fontSize: "var(--fs-xs)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {expanded && (
            <>
              <div style={{
                fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)", lineHeight: 1.55,
              }}>
                {theme.narrative}
              </div>

              {theme.whyItMatters && (
                <div style={{
                  fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)", lineHeight: 1.55,
                }}>
                  <span style={{
                    fontWeight: 700, color: "var(--text-primary)",
                    fontSize: "var(--fs-xs)", textTransform: "uppercase",
                    letterSpacing: 1.1, fontFamily: "var(--font-mono)", marginRight: 8,
                  }}>
                    Why it matters
                  </span>
                  {theme.whyItMatters}
                </div>
              )}

              <div className="market-pulse-footer" style={{
                display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end",
                flexWrap: "wrap",
                paddingTop: 10, borderTop: "1px solid var(--border-subtle)",
                fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {streakDays != null && Math.abs(streakDays) >= 2 && (
                    <span style={{
                      fontWeight: 700,
                      color: streakDays > 0 ? "var(--status-up)" : "var(--status-down)",
                      background: streakDays > 0 ? "var(--status-up-soft)" : "var(--status-down-soft)",
                      padding: "3px 8px", borderRadius: "var(--radius-sm)",
                    }}>
                      {streakDays > 0 ? "▲" : "▼"} {Math.abs(streakDays)}-day {streakDays > 0 ? "green" : "red"} run
                    </span>
                  )}
                  {theme?.sources?.length > 0 && (
                    <span>
                      {theme.sources.map((s, i) => (
                        <span key={s.url}>
                          {i > 0 && <span style={{ margin: "0 6px", color: "var(--border-subtle)" }}>·</span>}
                          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
                            color: "var(--text-muted)", textDecoration: "underline",
                            textDecorationColor: "var(--border-subtle)",
                            textUnderlineOffset: 2,
                          }}>
                            {s.label}
                          </a>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              alignSelf: "flex-start",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", fontWeight: 700,
              color: toneColor, letterSpacing: 0.8,
              padding: "2px 0", display: "flex", alignItems: "center", gap: 5,
              opacity: 0.85,
            }}
            aria-expanded={expanded}
          >
            <span style={{
              display: "inline-block",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              fontSize: 10,
            }}>▼</span>
            {expanded ? "Show less" : "Read analysis"}
          </button>
        </>
      )}
    </div>
  );
};

const DataStatus = ({ lastUpdate, error, loading }) => {
  // Recompute "age" every 5s so the pill self-updates.
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const ageMs = lastUpdate ? Date.now() - lastUpdate.getTime() : null;
  let label, color, ariaLabel;
  if (loading && !lastUpdate) {
    label = "Connecting"; color = "var(--text-dim)"; ariaLabel = "Connecting to live data";
  } else if (error && ageMs != null && ageMs > 5 * 60 * 1000) {
    label = "Offline"; color = "var(--status-down)"; ariaLabel = "Live data unavailable, showing cached values";
  } else if (ageMs == null) {
    label = "Idle"; color = "var(--text-dim)"; ariaLabel = "Awaiting first update";
  } else if (ageMs < 60 * 1000) {
    label = "Live"; color = "var(--status-up)"; ariaLabel = `Live, updated ${Math.round(ageMs / 1000)} seconds ago`;
  } else if (ageMs < 5 * 60 * 1000) {
    label = "Recent"; color = "var(--accent-bitcoin)"; ariaLabel = `Updated ${Math.round(ageMs / 60000)} minute(s) ago`;
  } else {
    label = "Stale"; color = "var(--status-warn)"; ariaLabel = `Data stale, ${Math.round(ageMs / 60000)} minutes since last update`;
  }

  return (
    <span aria-label={ariaLabel} title={ariaLabel} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 9px 3px 8px", borderRadius: 999,
      background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
      fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", fontWeight: 700,
      letterSpacing: 0.6, textTransform: "uppercase",
      color: "var(--text-tertiary)",
    }}>
      <span aria-hidden="true" style={{
        width: 7, height: 7, borderRadius: "50%", background: color,
        animation: label === "Live" ? "liveBlink 2.2s ease-in-out infinite" : "none",
      }} />
      <span>{label}</span>
    </span>
  );
};

const ThemeToggle = ({ theme, onChange }) => {
  const isDark = theme !== "light";
  const nextTheme = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      className="theme-toggle"
      onClick={() => onChange(nextTheme)}
      aria-label={label}
      title={label}
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        cursor: "pointer",
        color: "var(--text-tertiary)",
        fontSize: 15, lineHeight: 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
};

// ─── PRICE CHART (unified, time-range selector) ─────────────────
// target = number of visual data points to render for each range (uniform density)
const PRICE_CHART_RANGES = [
  { id: "7D",  label: "7D",  days: 7,        source: "seven",  target: 168 },  // all ~168 hourly pts from sparkline
  { id: "1M",  label: "1M",  days: 30,       source: "medium", target: 180 },  // ~720 hourly pts → 180 visual
  { id: "3M",  label: "3M",  days: 90,       source: "medium", target: 180 },  // ~2160 hourly pts → 180 visual
  { id: "1Y",  label: "1Y",  days: 365,      source: "long",   target: 250 },  // ~365 daily pts → 250 (all daily)
  { id: "5Y",  label: "5Y",  days: 1825,     source: "long",   target: 200 },  // ~1825 daily pts → 200 visual
  { id: "ALL", label: "ALL", days: Infinity,  source: "long",   target: 300 },  // all-time → 300 visual
];

const ChartTooltipBody = ({ active, payload, prevPrice }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  const delta = prevPrice != null && p.price != null ? p.price - prevPrice : null;
  const deltaPct = delta != null && prevPrice ? (delta / prevPrice) * 100 : null;
  const up = delta != null && delta >= 0;
  return (
    <div style={{
      background: "var(--bg-card-elevated)", border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-md)", padding: "12px 14px",
      fontFamily: "var(--font-mono)", fontSize: 13,
      boxShadow: "0 12px 32px rgba(0,0,0,0.32)",
      minWidth: 132,
      maxWidth: "calc(100vw - 32px)",
    }}>
      <div style={{
        color: "var(--text-muted)", marginBottom: 6,
        letterSpacing: "var(--tracking-caps)", textTransform: "uppercase",
        fontSize: 10, fontWeight: 500,
      }}>{p.date}</div>
      <div style={{
        color: "var(--text-primary)", fontWeight: 800, fontSize: 15,
        letterSpacing: "var(--tracking-tight)",
      }}>{fmtUSD(p.price)}</div>
      {deltaPct != null && (
        <div style={{
          color: up ? "var(--status-up)" : "var(--status-down)",
          marginTop: 4, fontWeight: 600,
          letterSpacing: "0.04em",
        }}>
          {up ? "▲" : "▼"} {Math.abs(deltaPct).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

const PriceChart = ({ sevenDay, mediumTerm, longTerm }) => {
  const [range, setRange] = usePersistedState("btc-dashboard.chartRange", "7D");
  const cfg = PRICE_CHART_RANGES.find((r) => r.id === range) || PRICE_CHART_RANGES[0];
  const isMobile = useIsMobile();

  // Source selection: seven=7D sparkline, medium=CoinGecko 90d hourly, long=blockchain.info all-time daily.
  const sourceData = cfg.source === "seven" ? sevenDay : cfg.source === "medium" ? mediumTerm : longTerm;
  const data = (() => {
    if (!Array.isArray(sourceData) || sourceData.length === 0) return [];
    if (cfg.source === "seven") return sourceData;

    // Long-term data is daily. Filter to the requested window by timestamp (not
    // by point count), then downsample uniformly to cfg.target points.
    const sliced = cfg.days === Infinity
      ? sourceData
      : (() => {
          const cutoffMs = Date.now() - cfg.days * 24 * 3600 * 1000;
          return sourceData.filter(p => p.t >= cutoffMs);
        })();
    let visual = sliced;
    if (sliced.length > cfg.target) {
      const step = Math.round(sliced.length / cfg.target);
      visual = [];
      for (let i = 0; i < sliced.length; i += step) visual.push(sliced[i]);
      const last = sliced[sliced.length - 1];
      if (visual[visual.length - 1] !== last) visual.push(last);
    }

    // Day-level labels for ≤ 1Y; month+year for 5Y and ALL.
    const useDayLevel = cfg.days <= 365;
    return visual.map((p) => ({
      ...p,
      date: p.t
        ? new Date(p.t).toLocaleDateString("en-US",
            useDayLevel ? { month: "short", day: "numeric" } : { month: "short", year: "numeric" })
        : p.date,
    }));
  })();

  const prices = data.map((d) => d.price).filter((p) => typeof p === "number");
  const min = prices.length ? Math.min(...prices) : null;
  const max = prices.length ? Math.max(...prices) : null;
  const first = data[0]?.price;
  const last = data[data.length - 1]?.price;
  const pct = first && last ? ((last - first) / first) * 100 : null;
  const up = pct != null && pct >= 0;

  const fmtRangeDate = (t) => t != null
    ? new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  const rangeStart = fmtRangeDate(data[0]?.t);
  const rangeEnd   = fmtRangeDate(data[data.length - 1]?.t);
  const rangeLabel = cfg.days === Infinity
    ? "All time"
    : rangeStart && rangeEnd
      ? `${rangeStart} – ${rangeEnd}`
      : cfg.label;

  return (
    <div className="chart-card" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "18px 16px 14px",
    }}>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "center" : "space-between",
        alignItems: "center",
        gap: isMobile ? 8 : 12,
        marginBottom: 12,
      }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <div style={{
            fontSize: "var(--fs-xs)", color: "var(--text-muted)",
            letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700,
            fontFamily: "var(--font-mono)", marginBottom: 4,
          }}>Price History</div>
          {data.length > 0 && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: isMobile ? "center" : "flex-start" }}>
              {pct != null && (
                <span style={{
                  fontSize: "var(--fs-md)", color: up ? "var(--status-up)" : "var(--status-down)",
                  fontWeight: 800, fontFamily: "var(--font-mono)",
                }}>
                  {up ? "+" : ""}{pct.toFixed(2)}%
                </span>
              )}
              <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                {rangeLabel}
              </span>
            </div>
          )}
        </div>
        <div role="radiogroup" aria-label="Chart time range" className="segmented-pill">
          {PRICE_CHART_RANGES.map((r) => {
            const active = range === r.id;
            return (
              <button
                key={r.id}
                role="radio"
                aria-checked={active}
                onClick={() => setRange(r.id)}
              >{r.label}</button>
            );
          })}
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ height: isMobile ? 180 : 360, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)" }}>Loading chart…</div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 180 : 380}>
          <AreaChart data={data} margin={{ top: 12, right: isMobile ? 4 : 8, left: isMobile ? 2 : 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradUnified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f7931a" stopOpacity={0.28} />
                <stop offset="60%" stopColor="#f7931a" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#f7931a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 9, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false}
              tickLine={false}
              interval={data.length > 12 ? Math.max(0, Math.floor(data.length / 6)) : "preserveStartEnd"}
              minTickGap={20}
              tickFormatter={(v) => String(v ?? "").toUpperCase()}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 9, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(v >= 100000 ? 0 : 1)}K`}
              width={isMobile ? 52 : 50}
            />
            <Tooltip
              cursor={{ stroke: "var(--border-strong)", strokeDasharray: "2 4", strokeWidth: 1 }}
              content={<ChartTooltipBody prevPrice={first} />}
              position={isMobile ? { y: 0 } : undefined}
              allowEscapeViewBox={isMobile ? { x: false, y: true } : undefined}
            />
            {min != null && (
              <ReferenceLine y={min} stroke="var(--status-down)" strokeDasharray="2 4" strokeOpacity={0.32} />
            )}
            {max != null && (
              <ReferenceLine y={max} stroke="var(--status-up)" strokeDasharray="2 4" strokeOpacity={0.32} />
            )}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              fill="url(#priceGradUnified)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: isMobile ? 6 : 4, fill: "#f7931a", stroke: "var(--bg-card-elevated)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {min != null && max != null && (
        <div style={{
          display: "flex", justifyContent: "space-between", gap: 12,
          marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border-subtle)",
          fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", color: "var(--text-dim)",
        }}>
          <span>Low <span style={{ color: "var(--status-down)", fontWeight: 700 }}>{fmtUSD(min)}</span></span>
          <span>High <span style={{ color: "var(--status-up)", fontWeight: 700 }}>{fmtUSD(max)}</span></span>
        </div>
      )}
    </div>
  );
};

// ─── POWER-LAW (LOG-SCALE) CHART ────────────────────────────────
// A log-scale price chart with halving epochs marked, plus an optional power-law
// regression band. The "rainbow chart," done honestly: bands are residual quantiles
// of a disclosed log-log regression, NOT eyeballed colour zones, and the fit is FROZEN
// at FIT_FREEZE_MS so everything after it is genuine out-of-sample — no look-ahead.
// Model: ln(price) = a + b·ln(days since genesis). Reports a, b, R², residual σ,
// current σ-deviation, and out-of-sample calibration. No buy/sell labels by design.
const BTC_GENESIS_MS = Date.UTC(2009, 0, 3);   // genesis block, 2009-01-03
const FIT_FREEZE_MS = Date.UTC(2021, 0, 1);    // fit uses data through 2020-12-31; later = out-of-sample
const FIT_FREEZE_LABEL = "Jan 2021";
const HALVINGS = [
  { label: "1st", t: Date.UTC(2012, 10, 28) },  // 2012-11-28
  { label: "2nd", t: Date.UTC(2016, 6, 9) },    // 2016-07-09
  { label: "3rd", t: Date.UTC(2020, 4, 11) },   // 2020-05-11
  { label: "4th", t: Date.UTC(2024, 3, 20) },   // 2024-04-20 (block 840,000)
];

// Ordinary least-squares fit of ln(price) on ln(days since genesis).
const fitPowerLaw = (points) => {
  const xs = [], ys = [];
  for (const p of points) {
    if (!p || typeof p.price !== "number" || p.price <= 0 || p.t == null) continue;
    const days = (p.t - BTC_GENESIS_MS) / 86400000;
    if (days <= 0) continue;
    xs.push(Math.log(days));
    ys.push(Math.log(p.price));
  }
  const n = xs.length;
  if (n < 2) return null;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx; sxx += dx * dx; sxy += dx * (ys[i] - my); }
  if (sxx === 0) return null;
  const b = sxy / sxx;
  const a = my - b * mx;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) { const yh = a + b * xs[i]; ssRes += (ys[i] - yh) ** 2; ssTot += (ys[i] - my) ** 2; }
  return { a, b, sigma: Math.sqrt(ssRes / n), r2: ssTot > 0 ? 1 - ssRes / ssTot : null, n };
};

const trendAt = (model, t) => {
  const days = (t - BTC_GENESIS_MS) / 86400000;
  return days > 0 ? Math.exp(model.a + model.b * Math.log(days)) : null;
};

const PowerLawTooltip = ({ active, payload, model }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  if (d == null || d.price == null) return null;
  const dev = d.trend ? Math.log(d.price / d.trend) / model.sigma : null;
  const dateStr = d.t ? new Date(d.t).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  return (
    <div style={{
      background: "var(--bg-card-elevated)", border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-md)", padding: "12px 14px",
      fontFamily: "var(--font-mono)", fontSize: 13,
      boxShadow: "0 12px 32px rgba(0,0,0,0.32)", minWidth: 150,
    }}>
      <div style={{ color: "var(--text-muted)", marginBottom: 6, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", fontSize: 10, fontWeight: 500 }}>{dateStr}</div>
      <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: 15 }}>{fmtUSD(d.price)}</div>
      {d.trend != null && (
        <div style={{ color: "var(--text-dim)", marginTop: 4, fontSize: 11 }}>Trend {fmtUSD(d.trend)}</div>
      )}
      {dev != null && (
        <div style={{ color: dev >= 0 ? "var(--status-up)" : "var(--status-down)", marginTop: 2, fontWeight: 600 }}>
          {dev >= 0 ? "+" : ""}{dev.toFixed(2)}σ vs trend
        </div>
      )}
    </div>
  );
};

const PowerLawChart = ({ longTerm }) => {
  const [showBand, setShowBand] = usePersistedState("btc-dashboard.powerLawBand", true);
  const isMobile = useIsMobile();

  const calc = useMemo(() => {
    if (!Array.isArray(longTerm) || longTerm.length < 2) return null;
    const fitPts = longTerm.filter((p) => p.t != null && p.t < FIT_FREEZE_MS && p.price > 0);
    // Need a meaningful frozen window; fall back to the full series only if pre-2021 data is missing.
    const model = fitPowerLaw(fitPts.length >= 100 ? fitPts : longTerm);
    if (!model) return null;
    const { a, b, sigma } = model;

    const series = longTerm
      .filter((p) => p.t != null && p.price > 0)
      .map((p) => {
        const trend = trendAt(model, p.t);
        return trend == null ? null : {
          t: p.t,
          price: p.price,
          trend,
          band1: [trend * Math.exp(-sigma), trend * Math.exp(sigma)],
          band2: [trend * Math.exp(-2 * sigma), trend * Math.exp(2 * sigma)],
        };
      })
      .filter(Boolean);
    if (series.length === 0) return null;

    // Out-of-sample calibration: of points AFTER the frozen fit, what share land within ±1σ / ±2σ.
    let oos = 0, w1 = 0, w2 = 0;
    for (const p of longTerm) {
      if (p.t == null || p.t < FIT_FREEZE_MS || !(p.price > 0)) continue;
      const days = (p.t - BTC_GENESIS_MS) / 86400000;
      if (days <= 0) continue;
      const resid = Math.abs(Math.log(p.price) - (a + b * Math.log(days)));
      oos++;
      if (resid <= sigma) w1++;
      if (resid <= 2 * sigma) w2++;
    }

    const lastPt = series[series.length - 1];
    const z = Math.log(lastPt.price / lastPt.trend) / sigma;

    // Log-scale Y domain snapped to whole decades spanning the bands + price.
    let lo = Infinity, hi = -Infinity;
    for (const d of series) {
      lo = Math.min(lo, d.band2[0], d.price);
      hi = Math.max(hi, d.band2[1], d.price);
    }
    lo = Math.max(0.1, lo);
    const loDec = Math.pow(10, Math.floor(Math.log10(lo)));
    const hiDec = Math.pow(10, Math.ceil(Math.log10(hi)));
    const decades = [];
    for (let e = Math.round(Math.log10(loDec)); e <= Math.round(Math.log10(hiDec)); e++) decades.push(Math.pow(10, e));

    const tMin = series[0].t, tMax = lastPt.t;
    const halvings = HALVINGS.filter((h) => h.t >= tMin && h.t <= tMax);

    return { model, series, oos, cal1: oos ? (w1 / oos) * 100 : null, cal2: oos ? (w2 / oos) * 100 : null, z, domain: [loDec, hiDec], decades, halvings, currentPrice: lastPt.price, currentTrend: lastPt.trend };
  }, [longTerm]);

  const fmtDecade = (v) => (v >= 1e6 ? `$${v / 1e6}M` : v >= 1000 ? `$${v / 1000}K` : `$${v}`);
  const yearFmt = (t) => new Date(t).getFullYear();

  return (
    <div className="chart-card" style={{
      background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)", padding: "18px 16px 14px",
    }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: isMobile ? 8 : 12, marginBottom: 12 }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)", marginBottom: 4 }}>Power-Law Trend · Log Scale</div>
          <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            {calc ? <>Halvings marked · fit frozen at {FIT_FREEZE_LABEL}</> : "All-time daily closes"}
          </div>
        </div>
        <button
          onClick={() => setShowBand((v) => !v)}
          aria-pressed={showBand}
          style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", fontWeight: 700,
            letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer",
            padding: "6px 12px", borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            background: showBand ? "var(--accent-bitcoin)" : "transparent",
            color: showBand ? "#0b0b0d" : "var(--text-dim)",
          }}
        >{showBand ? "Band ON" : "Band OFF"}</button>
      </div>

      {!calc ? (
        <div style={{ height: isMobile ? 200 : 380, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)" }}>Loading chart…</div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 400}>
          <ComposedChart data={calc.series} margin={{ top: 12, right: isMobile ? 6 : 10, left: isMobile ? 2 : 0, bottom: 0 }}>
            <defs>
              <linearGradient id="plBand2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="plBand1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t" type="number" scale="time" domain={["dataMin", "dataMax"]}
              tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 9, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false} tickLine={false} tickFormatter={yearFmt} minTickGap={40}
            />
            <YAxis
              scale="log" domain={calc.domain} ticks={calc.decades} allowDataOverflow
              tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 9, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false} tickLine={false} tickFormatter={fmtDecade} width={isMobile ? 48 : 46}
            />
            <Tooltip content={<PowerLawTooltip model={calc.model} />} cursor={{ stroke: "var(--border-strong)", strokeDasharray: "2 4", strokeWidth: 1 }} />
            {calc.halvings.map((h) => (
              <ReferenceLine key={h.t} x={h.t} stroke="var(--text-muted)" strokeDasharray="3 4" strokeOpacity={0.5}
                label={{ value: `⌛${h.label}`, position: "insideTopLeft", fill: "var(--text-dim)", fontSize: 9, fontFamily: "var(--font-mono)" }} />
            ))}
            {showBand && <Area type="monotone" dataKey="band2" stroke="none" fill="url(#plBand2)" isAnimationActive={false} dot={false} activeDot={false} />}
            {showBand && <Area type="monotone" dataKey="band1" stroke="none" fill="url(#plBand1)" isAnimationActive={false} dot={false} activeDot={false} />}
            {showBand && <Line type="monotone" dataKey="trend" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />}
            <Line type="monotone" dataKey="price" stroke="#f7931a" strokeWidth={2.25} dot={false} isAnimationActive={false} activeDot={{ r: 4, fill: "#f7931a", stroke: "var(--bg-card-elevated)", strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {calc && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
            <PowerLawStat label="Exponent (b)" value={calc.model.b.toFixed(2)} />
            <PowerLawStat label="Fit R²" value={calc.model.r2 != null ? calc.model.r2.toFixed(3) : "—"} />
            <PowerLawStat label="Now vs trend" value={`${calc.z >= 0 ? "+" : ""}${calc.z.toFixed(2)}σ`} accent={calc.z >= 0 ? "var(--status-up)" : "var(--status-down)"} />
            <PowerLawStat label="Residual σ" value={`±${(calc.model.sigma * 100).toFixed(0)}% log`} />
          </div>
          <div style={{ marginTop: 10, fontSize: "var(--fs-xs)", lineHeight: 1.5, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Model: <span style={{ color: "var(--text-muted)" }}>ln(price) = {calc.model.a.toFixed(2)} + {calc.model.b.toFixed(2)}·ln(days since genesis)</span>, fit on {fmt(calc.model.n)} daily closes through {FIT_FREEZE_LABEL}.
            {calc.cal1 != null && <> Out-of-sample, price closed within ±1σ on <span style={{ color: "var(--text-muted)" }}>{calc.cal1.toFixed(0)}%</span> and ±2σ on <span style={{ color: "var(--text-muted)" }}>{calc.cal2.toFixed(0)}%</span> of {fmt(calc.oos)} days.</>}
            {" "}A power law assumes a non-stationary process keeps behaving — it can break. Descriptive, not a forecast or buy/sell signal. <SourceLink href="https://www.blockchain.com/explorer/charts/market-price" label="blockchain.com" />
          </div>
        </>
      )}
    </div>
  );
};

const PowerLawStat = ({ label, value, accent }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-mono)", marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: "var(--fs-md)", fontWeight: 800, fontFamily: "var(--font-mono)", color: accent || "var(--text-primary)" }}>{value}</div>
  </div>
);

// ─── DASHBOARD TAB ──────────────────────────────────────────────
// Probability badge — green (≥0.65), amber (0.45–0.65), warn (<0.45). Module-scope so
// AnalysisCard, WatchRow, and DeepAnalysisTab all share one renderer.
const pBadge = (p, label = "p") => {
  if (p == null) return null;
  const pct = Math.round(p * 100);
  const color = p >= 0.65
    ? "var(--status-up, #2ecc71)"
    : p >= 0.45
    ? "var(--accent-bitcoin)"
    : "var(--status-warn, #ffb347)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", fontWeight: 800,
      color, background: "var(--bg-card-elevated)",
      padding: "3px 8px", borderRadius: "var(--radius-sm)",
      letterSpacing: 0.6, textTransform: "uppercase",
      border: `1px solid ${color}`,
    }}>
      {label} {pct}%
    </span>
  );
};

// Collapse-by-default card for the Analysis tab: an easy-to-read summary stays in the
// header; the technical depth lives in the expanded body. Mirrors DipExplainerCard's
// toggle so it collapses on every viewport (SectionGroup is desktop-always-open).
const AnalysisCard = ({ eyebrow, eyebrowColor, summary, badge, accent, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderLeft: accent ? `3px solid ${accent}` : "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "16px 20px",
    }}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer",
          textAlign: "left", gap: 12,
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "var(--fs-xs)", color: eyebrowColor || "var(--accent-bitcoin)",
              textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700,
              fontFamily: "var(--font-mono)",
            }}>
              {eyebrow}
            </span>
            {badge}
          </span>
          <span style={{
            fontSize: "var(--fs-md)", color: "var(--text-primary)", fontWeight: 700,
            fontFamily: "var(--font-sans)", lineHeight: 1.4,
          }}>
            {summary}
          </span>
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)",
          flexShrink: 0,
        }}>
          {open ? "Less" : "Details"}
          <span style={{ display: "inline-block", fontSize: 10, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
        </span>
      </button>
      {open && (
        <div className="tab-panel-enter" style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// One "What to watch" row: collapses to window + event + probability; the dense signal
// reasoning is one tap away in the expand.
const WatchRow = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "14px 18px",
    }}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer",
          textAlign: "left", gap: 12,
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "var(--fs-xs)", color: "var(--accent-bitcoin)",
              fontFamily: "var(--font-mono)", fontWeight: 800,
              letterSpacing: 0.6, textTransform: "uppercase",
            }}>
              {item.window}
            </span>
            {item.category && (
              <span style={{
                fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700,
                color: "var(--text-muted)", background: "var(--bg-card-elevated)",
                padding: "3px 8px", borderRadius: "var(--radius-sm)",
                letterSpacing: 0.5, textTransform: "uppercase",
                border: "1px solid var(--border-subtle)",
              }}>
                {item.category}
              </span>
            )}
          </span>
          <span style={{
            fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-primary)",
            fontFamily: "var(--font-sans)", lineHeight: 1.45,
          }}>
            {item.plain || item.event}
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {pBadge(item.probability)}
          <span style={{ display: "inline-block", fontSize: 10, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
        </span>
      </button>
      {open && (
        <div className="tab-panel-enter" style={{
          marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border-subtle)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {item.plain && (
            <div style={{
              fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.4,
            }}>
              Watching for: {item.event}
            </div>
          )}
          <div style={{
            fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)", lineHeight: 1.65,
          }}>
            {item.signal}
          </div>
        </div>
      )}
    </div>
  );
};

const DeepAnalysisTab = () => {
  const a = DEEP_ANALYSIS;
  if (!a) return null;

  // Defensive: contrarianTake migrated from string → object in v2.
  const contrarian = typeof a.contrarianTake === "string"
    ? { body: a.contrarianTake, probability: null }
    : (a.contrarianTake || null);

  const primary = a.primaryAnalysis || {};
  const calibration = a.calibration || null;

  // Plain-English layer (owner schema, written weekly by /refresh-deep-analysis). Degrade
  // gracefully to the existing, more technical fields if a refresh ever omits a plain*.
  const firstSentence = (s) => {
    if (!s) return null;
    const m = String(s).match(/^[\s\S]*?[.!?](\s|$)/);
    return (m ? m[0] : String(s)).trim();
  };
  const plainSummary = a.plainSummary || a.headline;
  const primaryPlain = primary.plain || primary.themeTitle;
  const contrarianPlain = contrarian && (contrarian.plain || firstSentence(contrarian.body));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header + plain bottom-line — always visible */}
      <div className="analysis-header" style={{ paddingBottom: 14, borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{
            fontSize: "var(--fs-xs)", color: "var(--text-muted)", letterSpacing: 1.3,
            textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)",
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "var(--accent-bitcoin)", marginRight: 8, verticalAlign: "middle",
            }} aria-hidden="true" />
            Deep AI Analysis · {a.asOf}
          </div>
          <span style={{
            fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", fontWeight: 700,
            color: "var(--accent-bitcoin)", background: "var(--status-up-soft, rgba(247,147,26,0.12))",
            padding: "5px 11px", borderRadius: "var(--radius-sm)",
            textTransform: "uppercase", letterSpacing: 1.1, whiteSpace: "nowrap",
          }}>
            Weekly synthesis
          </span>
        </div>
        {/* Plain-English lead — the bottom line for anyone, front and centre */}
        <div style={{
          fontSize: "var(--fs-xl, 22px)", fontWeight: 800, color: "var(--text-primary)",
          fontFamily: "var(--font-sans)", lineHeight: 1.3, maxWidth: 920, marginTop: 10,
        }}>
          {plainSummary}
        </div>
        {/* The original, denser framing kept as secondary detail */}
        {a.headline && a.headline !== plainSummary && (
          <div style={{
            fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)", lineHeight: 1.6, maxWidth: 920, marginTop: 8,
          }}>
            {a.headline}
          </div>
        )}
      </div>

      {/* The main read — collapsed by default; folds in market backdrop + cross-currents */}
      {primary.themeTitle && (
        <AnalysisCard
          eyebrow="The main read · our base case"
          accent="var(--accent-bitcoin)"
          badge={pBadge(primary.thesisProbability, "Thesis")}
          summary={primaryPlain}
        >
          <div style={{
            fontSize: "var(--fs-lg)", fontWeight: 800, color: "var(--text-primary)",
            fontFamily: "var(--font-sans)", lineHeight: 1.3,
          }}>
            {primary.themeTitle}
          </div>
          {(primary.body || []).map((p, i) => (
            <p key={i} style={{
              fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.7, margin: 0,
            }}>
              {p}
            </p>
          ))}

          {a.marketContext && (
            <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{
                fontSize: "var(--fs-xs)", color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: 1.1, fontWeight: 700,
                fontFamily: "var(--font-mono)", marginBottom: 6,
              }}>
                Market backdrop
              </div>
              <div style={{
                fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)", lineHeight: 1.65,
              }}>
                {a.marketContext}
              </div>
            </div>
          )}

          {a.crossCurrents && a.crossCurrents.length > 0 && (
            <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{
                fontSize: "var(--fs-xs)", color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: 1.1, fontWeight: 700,
                fontFamily: "var(--font-mono)", marginBottom: 8,
              }}>
                How the forces connect
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {a.crossCurrents.map((c, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)", lineHeight: 1.35, marginBottom: 2,
                    }}>
                      {c.title}
                    </div>
                    <div style={{
                      fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                      fontFamily: "var(--font-sans)", lineHeight: 1.6,
                    }}>
                      {c.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {primary.falsificationConditions && primary.falsificationConditions.length > 0 && (
            <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{
                fontSize: "var(--fs-xs)", color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: 1.1, fontWeight: 700,
                fontFamily: "var(--font-mono)", marginBottom: 8,
              }}>
                How we'd be wrong · falsification conditions
              </div>
              <ul style={{
                margin: 0, paddingLeft: 20, color: "var(--text-secondary)",
                fontSize: "var(--fs-sm)", fontFamily: "var(--font-sans)", lineHeight: 1.6,
              }}>
                {primary.falsificationConditions.map((c, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </AnalysisCard>
      )}

      {/* Cross-Currents are folded into the main-read card above ("How the forces connect"). */}

      {/* What to watch — collapsed card; each row then expands for its signal */}
      {a.watchList && a.watchList.length > 0 && (
        <AnalysisCard
          eyebrow={`What to watch · ${a.watchList.length} dated signals`}
          summary="The checkpoints that will tell us whether the calm case is holding — tap any one for the detail."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {a.watchList.map((w, i) => (
              <WatchRow key={i} item={w} />
            ))}
          </div>
        </AnalysisCard>
      )}

      {/* The other side (contrarian) — collapsed by default */}
      {contrarian && contrarian.body && (
        <AnalysisCard
          eyebrow="The other side · counterpoint"
          eyebrowColor="var(--status-warn, #ffb347)"
          accent="var(--status-warn, #ffb347)"
          badge={pBadge(contrarian.probability, "Vindication")}
          summary={contrarianPlain}
        >
          <div style={{
            fontSize: "var(--fs-sm)", color: "var(--text-primary)",
            fontFamily: "var(--font-sans)", lineHeight: 1.65,
          }}>
            {contrarian.body}
          </div>
        </AnalysisCard>
      )}

      {/* Primary sources — collapsed card */}
      {a.sources && a.sources.length > 0 && (
        <AnalysisCard
          eyebrow={`Primary sources · ${a.sources.length}`}
          summary="Where this week's analysis comes from — all primary sources."
        >
          <div style={{
            display: "flex", flexDirection: "column", gap: 8,
            fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
          }}>
            {a.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                color: "var(--text-muted)", textDecoration: "underline",
                textDecorationColor: "var(--border-subtle)",
                textUnderlineOffset: 2,
              }}>
                {s.label}
              </a>
            ))}
          </div>
        </AnalysisCard>
      )}

      {/* Forecast calibration — letter-grade confidence badge */}
      {calibration && (() => {
        const b = calibration.aggregateBrier;
        const gradeInfo = b == null ? null
          : b < 0.06 ? { grade: "A+", color: "var(--status-up)",    label: "Exceptional" }
          : b < 0.10 ? { grade: "A",  color: "var(--status-up)",    label: "Strong" }
          : b < 0.14 ? { grade: "B+", color: "#4ade80",             label: "Good" }
          : b < 0.18 ? { grade: "B",  color: "var(--accent-bitcoin)", label: "Adequate" }
          : b < 0.22 ? { grade: "C+", color: "var(--status-warn)",  label: "Fair" }
          :             { grade: "C",  color: "var(--status-down)",  label: "Recalibrating" };
        const prob = primary.thesisProbability;
        const pct = prob != null ? Math.round(prob * 100) : null;
        const probColor = pct != null
          ? pct >= 65 ? "var(--status-up)" : pct >= 45 ? "var(--accent-bitcoin)" : "var(--status-warn)"
          : null;
        const brierTip = b != null
          ? `Brier score: ${b.toFixed(3)} — measures forecast accuracy (0 = perfect, 0.25 = random). Lower is better.${calibration.nResolved ? ` Based on ${calibration.nResolved} resolved forecasts.` : ""}`
          : "Forecast calibration score";
        return (
          <div className="confidence-panel">
            {gradeInfo && (
              <div className="confidence-grade-badge" style={{ color: gradeInfo.color, background: `color-mix(in srgb, ${gradeInfo.color} 10%, transparent)` }}>
                {gradeInfo.grade}
              </div>
            )}
            <div className="confidence-meta">
              <div className="confidence-label-row">
                <span className="confidence-label"><Term k="brier">Forecast Calibration</Term></span>
                <span className="confidence-tooltip-trigger" title={brierTip} aria-label="Brier score explanation">?</span>
                {gradeInfo && (
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: gradeInfo.color }}>{gradeInfo.label}</span>
                )}
              </div>
              {calibration.briefSummary && (
                <div className="confidence-summary">{calibration.briefSummary}</div>
              )}
              {pct != null && (
                <div className="confidence-prob-row">
                  <span className="confidence-prob-pill" style={{ color: probColor, background: `color-mix(in srgb, ${probColor} 12%, transparent)` }}>
                    {pct}% confidence
                  </span>
                  <div className="confidence-prob-bar-wrap">
                    <div className="confidence-prob-bar" style={{ width: `${pct}%`, background: probColor }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

const DashboardTab = ({ btc, setActiveTab }) => {
  const [updatesExpanded, setUpdatesExpanded] = useState(false);
  const {
    price, change24h, change7d, lastUpdate,
    marketCap, circulatingSupply, ath, athDate,
    chartData, longTermChart, mediumTermChart, blockHeight, hashrate, fastFee, hourFee, mempoolCount,
    dominance, fearGreed, difficultyAdjust, lastBlock, lightning,
    loading, error,
  } = btc;

  const liveMined = circulatingSupply || FALLBACK_MINED;
  const liveMarketCap = marketCap || (price || 0) * liveMined;
  const liveATH = ath || FALLBACK_ATH;
  const liveATHDateRaw = athDate || FALLBACK_ATH_DATE;
  const liveATHDate = new Date(liveATHDateRaw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fromATH = (liveATH && price) ? ((price - liveATH) / liveATH * 100) : 0;

  const liveBlock = blockHeight || FALLBACK_BLOCK;
  const blocksToHalving = Math.max(0, HALVING_BLOCK - liveBlock);
  const hashrateEH = hashrate ? hashrate / 1e18 : null;
  const change7dPct = typeof change7d === "number" ? change7d : null;

  // Halving ETA — Bitcoin avg ~10 min per block.
  const halvingEtaDays = Math.round((blocksToHalving * 10) / 60 / 24);

  // Live ticker for time-since-last-block (re-renders every second).
  const elapsedSinceBlock = useElapsed(lastBlock?.timestamp);

  // Fee → typical-tx USD estimate. A typical send is ~140 vBytes.
  const typicalTxBtc = fastFee != null ? (fastFee * 140) / 1e8 : null;
  const typicalTxUsd = typicalTxBtc != null && price != null ? typicalTxBtc * price : null;

  // Lightning capacity in BTC (sats / 1e8).
  const lightningBtc = lightning?.capacitySats != null ? lightning.capacitySats / 1e8 : null;

  // Difficulty arrow direction (gets harder vs easier).
  const diffPct = difficultyAdjust?.difficultyChange;
  const diffHarder = diffPct != null && diffPct >= 0;

  // Fear & Greed delta vs yesterday (used as sub-label arrow).
  const fgValue = fearGreed?.value;
  const fgPrev = fearGreed?.previousValue;
  const fgDelta = fgValue != null && fgPrev != null ? fgValue - fgPrev : null;

  // Pulse interpretation from already-loaded state — no extra fetches.
  // Lede is the dominant market theme (e.g. CLARITY Act). Tape state is secondary.
  const marketPulse = buildMarketPulse({
    change24h, fearGreed, theme: MARKET_THEME,
  });

  // Compute a green/red day streak from the 7-day series.
  const streakDays = (() => {
    if (!Array.isArray(chartData) || chartData.length < 3) return null;
    let dir = null, count = 0;
    for (let i = chartData.length - 1; i > 0; i--) {
      const delta = chartData[i].price - chartData[i - 1].price;
      const d = delta > 0 ? 1 : delta < 0 ? -1 : 0;
      if (d === 0) break;
      if (dir == null) { dir = d; count = 1; continue; }
      if (d === dir) count++; else break;
    }
    return dir != null ? dir * count : null;
  })();

  // Adoption rollups — derived once from the curated tables in this file so the
  // dashboard always reflects the same canonical holdings as the Adoption tab.
  const corpHoldingsTotal = COMPANY_HOLDINGS.reduce((s, c) => s + (c.btc || 0), 0);
  const corpCount = COMPANY_HOLDINGS.length;
  const corpPctOfSupply = (corpHoldingsTotal / liveMined) * 100;
  const sovereignNations = COUNTRY_HOLDINGS.filter(c => (c.btc || 0) > 0).length;
  const sovereignTotal = COUNTRY_HOLDINGS.reduce((s, c) => s + (c.btc || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Reveal>
        <MarketPulseCard pulse={marketPulse} streakDays={streakDays} setActiveTab={setActiveTab} />
      </Reveal>
      <Reveal delay={0.05}>
        <PriceDisplay
          price={price}
          change24h={change24h}
          lastUpdate={lastUpdate}
          loading={loading && price == null}
          fearGreedValue={marketPulse.fearGreedValue}
          fearGreedClass={marketPulse.fearGreedClass}
        />
      </Reveal>

      {error && (
        <Reveal>
          <ErrorBanner message={error} lastUpdate={lastUpdate} />
        </Reveal>
      )}

      {/* MARKET — Tier 2 essentials, always visible. PriceChart leads the section. */}
      <Reveal delay={0.04}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="group-title-row">
            <span className="group-title">Market</span>
            <span className="group-title-rule" aria-hidden="true" />
          </div>
          <PriceChart sevenDay={chartData} mediumTerm={mediumTermChart} longTerm={longTermChart} />
          <PowerLawChart longTerm={longTermChart} />
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <div className="card-hover"><StatCard
              label="Market Cap"
              value={liveMarketCap ? "$" + (liveMarketCap / 1e12).toFixed(2) + "T" : "—"}
              sub={<>{marketCapComparison(liveMarketCap) || "#1 Cryptocurrency"} · <SourceLink href="https://www.coingecko.com" label="coingecko.com" /></>}
              accent="#3b82f6"
              loading={loading && price == null}
            /></div>
            <div className="card-hover"><StatCard
              label="% From All-Time High"
              value={price != null ? `${fromATH >= 0 ? "+" : ""}${fromATH.toFixed(1)}%` : "—"}
              sub={<>ATH {fmtUSD(liveATH)} on {liveATHDate} · <SourceLink href="https://www.coingecko.com/en/coins/bitcoin" label="coingecko.com" /></>}
              accent={fromATH >= 0 ? "#22c55e" : "#f59e0b"}
              loading={loading && price == null}
            /></div>
            <div className="card-hover"><StatCard
              label={<>BTC <Term k="dominance">Dominance</Term></>}
              value={dominance != null ? `${dominance.toFixed(1)}%` : "—"}
              sub={<>Of total crypto market cap · <SourceLink href="https://www.coingecko.com/en/global-charts" label="coingecko.com" /></>}
              accent="#f7931a"
              loading={dominance == null && loading}
            /></div>
            <div className="card-hover"><StatCard
              label="Fear & Greed Index"
              value={fgValue != null ? `${fgValue}` : "—"}
              sub={fearGreed ? <>{fearGreed.classification}{fgDelta != null ? ` · ${fgDelta >= 0 ? "▲" : "▼"} ${Math.abs(fgDelta)} vs yesterday` : ""} · <SourceLink href="https://alternative.me/crypto/fear-and-greed-index/" label="alternative.me" /></> : "Market sentiment gauge"}
              accent={fgValue != null && fgValue < 50 ? "#ef4444" : "#22c55e"}
              loading={fgValue == null}
            /></div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <DipExplainerCard fromATH={fromATH} theme={MARKET_THEME} setActiveTab={setActiveTab} />
      </Reveal>

      {/* ── CURATED MARKET UPDATES ── */}
      <Reveal delay={0.05}>
        <div className="market-updates-section" onClick={() => { if (!updatesExpanded) setUpdatesExpanded(true); }} style={{ cursor: updatesExpanded ? "default" : "pointer" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setUpdatesExpanded(prev => !prev); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: 0, marginBottom: 10,
            }}
            aria-expanded={updatesExpanded}
          >
            <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Market Updates</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Click to Expand
              <span style={{ display: "inline-block", fontSize: 10, transform: updatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
            </span>
          </button>
          {!updatesExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CURATED_MARKET_UPDATES.map((update, i) => (
                <div key={update.title} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent-bitcoin)", fontWeight: 800, minWidth: 18, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", fontWeight: 600, lineHeight: 1.35 }}>{update.title}</span>
                </div>
              ))}
            </div>
          )}
          {updatesExpanded && (
            <div className="market-updates-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}>
              {CURATED_MARKET_UPDATES.map((update, index) => (
                <div key={update.title} className="curated-card card-hover" style={{
                  background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-elevated) 100%)",
                  border: "1px solid var(--border-subtle)",
                  borderTop: "2px solid var(--accent-bitcoin)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px 18px 16px",
                  minHeight: 184,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 12,
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                      <span style={{
                        fontSize: "var(--fs-xs)", fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase",
                        color: "var(--accent-bitcoin)", fontFamily: "var(--font-mono)",
                        background: "var(--accent-bitcoin-soft)", padding: "4px 9px", borderRadius: "var(--radius-sm)",
                        lineHeight: 1.2,
                      }}>{update.label}</span>
                      <span style={{
                        color: "var(--text-dim)", fontSize: "var(--fs-md)", fontWeight: 800,
                        fontFamily: "var(--font-mono)", lineHeight: 1,
                      }}>0{index + 1}</span>
                    </div>
                    <div style={{ fontSize: "var(--fs-lg)", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-sans)", lineHeight: 1.25, marginBottom: 8 }}>
                      {update.title}
                    </div>
                    <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", lineHeight: 1.55 }}>
                      {update.detail}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {update.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "var(--text-tertiary)", textDecoration: "none", fontSize: "var(--fs-xs)",
                          fontFamily: "var(--font-mono)", border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)", padding: "4px 8px", background: "var(--bg-base)",
                        }}
                      >
                        {source.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* NETWORK — Tier 3 stat strip row */}
      <Reveal delay={0.06}>
        <SectionGroup title="Network" collapsible defaultExpanded={true}>
          <StatStrip
            label="Last Block"
            value={elapsedSinceBlock != null ? formatElapsed(elapsedSinceBlock) : "—"}
            sub={lastBlock ? (lastBlock.poolName ? `Mined by ${lastBlock.poolName}` : `Block ${fmt(lastBlock.height)}`) : "Network heartbeat"}
            valueColor="var(--accent-bitcoin)"
            loading={lastBlock == null}
          />
          <StatStrip
            label={<>Network <Term k="hashrate">Hashrate</Term></>}
            value={hashrateEH != null ? `${hashrateEH.toFixed(0)} EH/s` : "—"}
            sub="Computing power securing the network"
            loading={loading && hashrate == null}
          />
          <StatStrip
            label={<><Term k="difficulty">Difficulty</Term> Adjustment</>}
            value={diffPct != null ? `${diffPct >= 0 ? "+" : ""}${diffPct.toFixed(2)}%` : "—"}
            sub={difficultyAdjust ? `${diffHarder ? "Harder" : "Easier"} in ${formatRemainingTime(difficultyAdjust.remainingTimeMs)}` : "Self-regulating target"}
            valueColor={diffHarder ? "var(--status-up)" : "var(--status-warn)"}
            loading={diffPct == null}
          />
          <StatStrip
            label="Pending Transactions"
            value={mempoolCount != null ? `${fmt(mempoolCount)} tx` : "—"}
            sub="Awaiting confirmation"
            loading={loading && mempoolCount == null}
          />
        </SectionGroup>
      </Reveal>

      {/* MINING & SUPPLY — Tier 3 stat strip row */}
      <Reveal delay={0.08}>
        <SectionGroup title="Mining & Supply" collapsible defaultExpanded={true}>
          <StatStrip
            label={<>Next <Term k="halving">Halving</Term></>}
            value={blocksToHalving > 0 ? `~${halvingEtaDays}d` : "Soon"}
            sub={`${fmt(blocksToHalving)} blocks · 3.125 → 1.5625 BTC`}
            loading={loading && blockHeight == null}
          />
          <StatStrip
            label="Network Fee"
            value={fastFee != null ? `${fastFee} sat/vB` : "—"}
            sub={typicalTxUsd != null ? `≈ $${typicalTxUsd.toFixed(2)} typical send` : (hourFee != null ? `Hour: ${hourFee} sat/vB` : "Next-block priority")}
            loading={loading && fastFee == null}
          />
          <StatStrip
            label={<><Term k="lightning">Lightning</Term> Capacity</>}
            value={lightningBtc != null ? `${fmt(Math.round(lightningBtc))} BTC` : "—"}
            sub={lightning ? `${fmt(lightning.channelCount)} channels` : "Instant-payment layer"}
            loading={lightning == null}
          />
          <StatStrip
            label="7-Day Change"
            value={change7dPct != null ? `${change7dPct >= 0 ? "+" : ""}${change7dPct.toFixed(2)}%` : "—"}
            sub="Week-over-week price"
            valueColor={change7dPct != null && change7dPct >= 0 ? "var(--status-up)" : (change7dPct != null ? "var(--status-down)" : undefined)}
            loading={loading && price == null}
          />
        </SectionGroup>
      </Reveal>

      {/* SOVEREIGN ADOPTION — who's putting bitcoin on a nation-state balance sheet */}
      <Reveal delay={0.1}>
        <SectionGroup title="Sovereign Adoption" collapsible defaultExpanded={true}>
          <StatStrip
            label="US Strategic Reserve"
            value="328,000 BTC"
            sub={<>Executive Order, Mar 6 2025 · <SourceLink href="https://www.whitehouse.gov/presidential-actions/2025/03/establishment-of-the-strategic-bitcoin-reserve-and-united-states-digital-asset-stockpile/" label="whitehouse.gov" /></>}
            valueColor="var(--accent-bitcoin)"
          />
          <StatStrip
            label="Nations Holding BTC"
            value={`${sovereignNations} nations`}
            sub={<>~{fmt(Math.round(sovereignTotal / 1000))}k BTC on sovereign balance sheets · <SourceLink href="https://bitbo.io/treasuries/" label="bitbo.io" /></>}
          />
          <StatStrip
            label="El Salvador"
            value="Legal Tender"
            sub={<>Since Sept 2021 · 35% ownership — highest in world · <SourceLink href="https://www.imf.org/en/Countries/SLV" label="imf.org" /></>}
            valueColor="var(--status-up)"
          />
          <StatStrip
            label="Bhutan (Druk Holding)"
            value="13,029 BTC"
            sub={<>Hydro-powered sovereign mining program · <SourceLink href="https://arkhamintelligence.com/research/bhutan-bitcoin-holdings" label="arkhamintelligence.com" /></>}
          />
        </SectionGroup>
      </Reveal>

      {/* CORPORATE & MARKETS — institutional balance sheets, ETFs, holder base */}
      <Reveal delay={0.12}>
        <SectionGroup title="Corporate & Markets" collapsible defaultExpanded={true}>
          <StatStrip
            label="Public Companies Holding BTC"
            value={`${corpCount} firms`}
            sub={<>~{(corpHoldingsTotal / 1e6).toFixed(2)}M BTC · {corpPctOfSupply.toFixed(1)}% of circulating supply · <SourceLink href="https://bitcointreasuries.net/" label="bitcointreasuries.net" /></>}
            valueColor="var(--accent-bitcoin)"
          />
          <StatStrip
            label="Strategy (MSTR)"
            value="819,404 BTC"
            sub={<>Largest single corporate holder · ~3.9% of supply · <SourceLink href="https://www.strategy.com/" label="strategy.com" /></>}
          />
          <StatStrip
            label="US Spot Bitcoin ETFs"
            value="~1.30M BTC"
            sub={<>~$130B AUM · 6.6% of supply · <SourceLink href="https://farside.co.uk/btc/" label="farside.co.uk" /></>}
            valueColor="var(--status-up)"
          />
          <StatStrip
            label="Global Crypto Holders"
            value="~660M"
            sub={<>≈ 8% of world population owns crypto · <SourceLink href="https://www.triple-a.io/crypto-ownership-data" label="triple-a.io" /></>}
          />
        </SectionGroup>
      </Reveal>

      <Reveal delay={0.05}>
        <SupplyMeter mined={liveMined} total={TOTAL_SUPPLY} history={SUPPLY_HISTORY} />
      </Reveal>
    </div>
  );
};

// ─── HEADLINES TAB ──────────────────────────────────────────────
// A starred (★) item is one flagged `important` — either curated in the fallback
// arrays or detected by isImportantHeadline for live RSS items.

// Live RSS items carry a direct article URL. Curated entries don't, so fall
// back to a Google News search on the title — surfaces relevant coverage even
// when no specific article link is tracked.
const headlineHref = (item) =>
  item.url || `https://news.google.com/search?q=${encodeURIComponent(item.title || "")}&hl=en-US`;

const StarBadge = () => (
  <span title="Key story" aria-label="Key story" style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 18, height: 18, borderRadius: 4,
    background: "rgba(247, 147, 26, 0.15)", color: "#f7931a",
    fontSize: 12, lineHeight: 1, fontWeight: 700, flexShrink: 0, marginTop: 1,
  }}>★</span>
);

const HeadlineCard = ({ item, i, forceStar = false, variant = "standard" }) => {
  const tc = TAG_COLORS[item.tag] || TAG_FALLBACK;
  const starred = forceStar || item.important;

  // Tier-1 lede treatment — promoted #1 starred story per section.
  if (variant === "lede") {
    return (
      <Reveal delay={Math.min(i * 0.04, 0.4)}>
        <a
          href={headlineHref(item)}
          target="_blank"
          rel="noopener noreferrer"
          className="lede-card"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="lede-eyebrow">{item.tag}</span>
            <span style={{ fontSize: 10, color: "var(--accent-bitcoin)", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "var(--tracking-caps-tight)" }}>★ KEY STORY</span>
          </div>
          <div className="lede-title">{item.title}</div>
          <div className="lede-meta">{item.date} · {item.source}</div>
        </a>
      </Reveal>
    );
  }

  const Body = (
    <>
      <div className="headline-date" style={{ minWidth: 48, fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-mono)", paddingTop: 2 }}>{item.date}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div className="headline-title" style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600, lineHeight: 1.4, fontFamily: "var(--font-sans)" }}>{item.title}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: tc.bg, color: tc.text, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{item.tag}</span>
          <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{item.source}</span>
        </div>
      </div>
    </>
  );
  const cardStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
    borderLeft: starred ? "3px solid var(--accent-bitcoin)" : "1px solid var(--border-subtle)",
    borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12,
  };
  return (
    <Reveal delay={Math.min(i * 0.04, 0.4)}>
      <a href={headlineHref(item)} target="_blank" rel="noopener noreferrer" className="card-hover headline-card" style={{ textDecoration: "none", ...cardStyle }}>
        {Body}
      </a>
    </Reveal>
  );
};

const SectionHeading = ({ title, subtitle }) => (
  <div className="section-heading" style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "20px 0 10px", flexWrap: "wrap" }}>
    <div className="section-heading-title" style={{ fontSize: 15, fontWeight: 700, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3 }}>{title}</div>
    {subtitle && <div className="section-heading-sub" style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</div>}
  </div>
);

const HeadlinesTab = ({ news }) => {
  const [filter, setFilter] = useState("ALL");
  const hasLive = news.items.length > 0;

  // Time bucketing:
  //   Latest        = top 5 most important from past 48h
  //   Past 4 weeks  = older than ~48h, up to 28 days back, *important only*
  //   Past 6 months = curated top 10, older than 4 weeks
  // Live items use real timestamps; the curated fallback arrays are already
  // partitioned by date so we just trust them when live data is missing.
  const now = Date.now();
  const LATEST_HOURS = 48;
  const HISTORICAL_DAYS = 28;
  const latestCutoff = now - LATEST_HOURS * 60 * 60 * 1000;
  const historicalCutoff = now - HISTORICAL_DAYS * 24 * 60 * 60 * 1000;

  // Live: rank past-48h items by importance (flagged first) then recency,
  // take top 5. Fallback: use curated FALLBACK_NEWS as-is.
  const latest = hasLive
    ? [...news.items]
        .filter(n => !n.ts || n.ts >= latestCutoff)
        .sort((a, b) => {
          const ai = a.important ? 1 : 0;
          const bi = b.important ? 1 : 0;
          if (ai !== bi) return bi - ai;
          return (b.ts || 0) - (a.ts || 0);
        })
        .slice(0, 5)
    : FALLBACK_NEWS.slice(0, 5);

  // Important historical = live items in (48h, 4w] flagged important, merged
  // with the curated HISTORICAL_HIGHLIGHTS. Deduped by title prefix to avoid
  // showing the same story twice when RSS feeds carry older items.
  const liveHistorical = hasLive
    ? news.items.filter(n => n.ts && n.ts < latestCutoff && n.ts >= historicalCutoff && n.important)
    : [];
  const seenTitles = new Set(liveHistorical.map(n => (n.title || "").toLowerCase().slice(0, 40)));
  const curatedHistorical = HISTORICAL_HIGHLIGHTS.filter(n => !seenTitles.has((n.title || "").toLowerCase().slice(0, 40)));
  const importantHistorical = [...liveHistorical, ...curatedHistorical].sort((a, b) => {
    if (a.ts && b.ts) return b.ts - a.ts;
    if (a.ts) return -1;
    if (b.ts) return 1;
    return 0;
  });

  const sixMonth = SIX_MONTH_HIGHLIGHTS;

  const allItems = [...latest, ...importantHistorical, ...sixMonth];
  const tags = ["ALL", ...Array.from(new Set(allItems.map(n => n.tag)))];

  const latestFiltered = filter === "ALL" ? latest : latest.filter(n => n.tag === filter);
  const historicalFiltered = filter === "ALL" ? importantHistorical : importantHistorical.filter(n => n.tag === filter);
  const sixMonthFiltered = filter === "ALL" ? sixMonth : sixMonth.filter(n => n.tag === filter);

  const subtitle = news.loading
    ? "Loading latest…"
    : news.error
    ? "Live news unavailable — showing curated headlines"
    : `Live from Cointelegraph, CoinDesk, Bitcoin Magazine • top ${latest.length} latest + ${importantHistorical.length} past 4 weeks + ${sixMonth.length} past 6 months`;

  return (
    <div>
      <div className="page-title-block" style={{ marginBottom: 16 }}>
        <div className="page-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>
          Bitcoin Headlines
        </div>
        <div className="page-subtitle" style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</div>
      </div>

      {news.error && <div style={{ marginBottom: 12 }}><ErrorBanner message={news.error} /></div>}

      {news.loading && !hasLive ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12 }}>
              <Skeleton width={48} height={14} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Skeleton height={14} width="80%" />
                <Skeleton height={10} width="40%" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="headlines-filter-wrap" style={{ position: "relative", marginBottom: 4 }}>
            <div className="headlines-filter-fade" style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: 40, zIndex: 2,
              background: "linear-gradient(to right, transparent, var(--bg-base))",
              pointerEvents: "none",
            }} />
            <div className="headlines-filter-row" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tags.map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{
                  padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
                  background: filter === t ? "#f7931a" : "var(--bg-card)",
                  color: filter === t ? "#000" : "var(--text-muted)",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}>{t}</button>
              ))}
            </div>
          </div>

          <SectionHeading title="Most Important Headlines • Past 48 Hours" subtitle={`Top ${latestFiltered.length} stor${latestFiltered.length === 1 ? "y" : "ies"} • ★ marks key stories`} />
          {latestFiltered.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", padding: "12px 4px" }}>No stories match this filter.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {latestFiltered.map((item, i) => (
                <HeadlineCard
                  key={item.url || `lt-${i}`}
                  item={item}
                  i={i}
                  variant={i === 0 && (item.important || filter !== "ALL") ? "lede" : "standard"}
                />
              ))}
            </div>
          )}

          <SectionHeading title="Most Important Headlines • Past 4 Weeks" subtitle={`2 days to 4 weeks ago • ${historicalFiltered.length} stor${historicalFiltered.length === 1 ? "y" : "ies"} • ★ marks key stories`} />
          {historicalFiltered.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", padding: "12px 4px" }}>No stories match this filter.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {historicalFiltered.map((item, i) => (
                <HeadlineCard
                  key={item.url || `hh-${i}`}
                  item={item}
                  i={i}
                  forceStar
                  variant={i === 0 ? "lede" : "standard"}
                />
              ))}
            </div>
          )}

          <SectionHeading title="Most Important Headlines • Past 6 Months" subtitle={`Top ${sixMonthFiltered.length} high-impact stor${sixMonthFiltered.length === 1 ? "y" : "ies"} • ★ marks key stories`} />
          {sixMonthFiltered.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", padding: "12px 4px" }}>No stories match this filter.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sixMonthFiltered.map((item, i) => (
                <HeadlineCard
                  key={item.url || `sm-${i}`}
                  item={item}
                  i={i}
                  forceStar
                  variant={i === 0 ? "lede" : "standard"}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── ADOPTION TAB ───────────────────────────────────────────────
const AdoptionTab = ({ price }) => {
  const [view, setView] = useState("companies");
  const sorted = [...ADOPTION_DATA].sort((a, b) => b.rate - a.rate);

  return (
    <div>
      <div className="page-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>
        Global Bitcoin & Crypto Adoption
      </div>
      <div className="page-subtitle" style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Corporate treasuries, government reserves, ownership rates, and Chainalysis index</div>

      <div className="adoption-view-bar segmented-pill segmented-pill-analytical" role="tablist" style={{ marginBottom: 20 }}>
        <button
          aria-checked={view === "companies"}
          role="radio"
          onClick={() => setView("companies")}
        >Companies</button>
        <button
          aria-checked={view === "holdings"}
          role="radio"
          onClick={() => setView("holdings")}
        >Governments</button>
        <button
          aria-checked={view === "ownership"}
          role="radio"
          onClick={() => setView("ownership")}
        >Ownership %</button>
        <button
          aria-checked={view === "index"}
          role="radio"
          onClick={() => setView("index")}
        >Adoption Index</button>
      </div>

      {view === "companies" ? (
        <CompaniesTab price={price} />
      ) : view === "holdings" ? (
        <HoldingsTab price={price} />
      ) : view === "ownership" ? (
        <div>
          <div className="group-title-row" style={{ marginBottom: 6 }}>
            <span className="group-title">Personal Adoption Rate</span>
            <span className="group-title-rule" aria-hidden="true" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {sorted.map((c, i) => {
              const maxRate = sorted[0].rate;
              const isTop = i < 3;
              return (
                <div
                  key={c.country}
                  className="adoption-row adoption-ownership-row"
                  style={{ gridTemplateColumns: "32px 28px minmax(0, 1fr) 96px 72px" }}
                >
                  <span className={`adoption-rank${isTop ? " is-top" : ""}`}>{i + 1}</span>
                  <span className="adoption-flag" aria-hidden="true">{c.flag}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="adoption-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.country}</div>
                    <div className="adoption-meta">{c.region}</div>
                  </div>
                  <div className="adoption-bar" style={{ height: 4, borderRadius: 2, background: "var(--bg-base)", overflow: "hidden", minWidth: 60 }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${(c.rate / maxRate) * 100}%`,
                      background: isTop ? "linear-gradient(90deg, var(--accent-analytical), var(--accent-analytical-bright))" : "var(--accent-analytical)",
                      opacity: 0.45 + (c.rate / maxRate) * 0.55,
                    }} />
                  </div>
                  <span className="adoption-value">{c.rate}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            padding: "10px 0 14px", fontSize: 12, color: "var(--text-dim)",
            fontFamily: "var(--font-mono)", lineHeight: 1.55,
          }}>
            Chainalysis 2026 Global Crypto Adoption Index — measures on-chain activity, DeFi usage, P2P volume, and centralized exchange activity weighted by GDP per capita.
          </div>
          <div className="group-title-row" style={{ marginBottom: 6 }}>
            <span className="group-title">Adoption Index — Top 20</span>
            <span className="group-title-rule" aria-hidden="true" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {ADOPTION_INDEX_TOP20.map((c, i) => (
              <div
                key={c.country}
                className="adoption-row adoption-index-row"
                style={{ gridTemplateColumns: "32px 28px minmax(0, 1fr) minmax(80px, 1fr) 56px" }}
              >
                <span className={`adoption-rank${i < 3 ? " is-top" : ""}`}>{c.rank}</span>
                <span className="adoption-flag" aria-hidden="true">{c.flag}</span>
                <span className="adoption-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.country}</span>
                <div className="adoption-bar" style={{ height: 4, borderRadius: 2, background: "var(--bg-base)", overflow: "hidden", minWidth: 60 }}>
                  <div style={{ height: "100%", width: `${c.score * 100}%`, borderRadius: 2, background: "linear-gradient(90deg, var(--accent-analytical), var(--accent-analytical-bright))" }} />
                </div>
                <span className="adoption-value">{c.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── COMPANY HOLDINGS TAB ───────────────────────────────────────
// Custom bar shape that draws diagonal break marks + inline real-value label
// when the underlying holding has been visually capped (isBroken === true).
const BrokenBarShape = (props) => {
  const { x, y, width, height, fill, payload } = props;
  if (width <= 0 || height <= 0) return null;
  const r = Math.min(8, height / 2, width / 2);
  const path =
    `M${x},${y} L${x + width - r},${y} ` +
    `Q${x + width},${y} ${x + width},${y + r} ` +
    `L${x + width},${y + height - r} ` +
    `Q${x + width},${y + height} ${x + width - r},${y + height} ` +
    `L${x},${y + height} Z`;
  return (
    <g>
      <path d={path} fill={fill} />
      {payload?.isBroken && (
        <g>
          <line x1={x + width - 14} y1={y - 4} x2={x + width - 22} y2={y + height + 4}
            stroke="#0d0d1a" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={x + width - 6}  y1={y - 4} x2={x + width - 14} y2={y + height + 4}
            stroke="#0d0d1a" strokeWidth={2.5} strokeLinecap="round" />
          <text
            x={x + width - 32}
            y={y + height / 2}
            dy={4}
            textAnchor="end"
            fill="#0d0d1a"
            fontSize={11}
            fontWeight={800}
            fontFamily="'JetBrains Mono', monospace"
            style={{ pointerEvents: "none" }}
          >
            {fmt(payload.btc)} BTC
          </text>
        </g>
      )}
    </g>
  );
};

const SortTh = ({ children, colKey, activeSortKey, activeSortDir, onSort, className }) => (
  <th
    className={`${className || ""}${activeSortKey === colKey ? " sort-active" : ""}`}
    onClick={() => onSort(colKey)}
    aria-sort={activeSortKey === colKey ? (activeSortDir === "desc" ? "descending" : "ascending") : "none"}
  >
    {children}
    <span className="sort-icon" aria-hidden="true">
      {activeSortKey === colKey ? (activeSortDir === "desc" ? "▼" : "▲") : "▼"}
    </span>
  </th>
);

const CompaniesTab = ({ price }) => {
  const isMobile = useIsMobile();
  const safePrice = price || FALLBACK_PRICE;
  const totalBtc = COMPANY_HOLDINGS.reduce((s, c) => s + c.btc, 0);
  const [sortKey, setSortKey] = useState("btc");
  const [sortDir, setSortDir] = useState("desc");
  const handleSort = (key) => {
    setSortDir(prev => (sortKey === key && prev === "desc") ? "asc" : "desc");
    setSortKey(key);
  };
  const sorted = [...COMPANY_HOLDINGS].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  const top8 = sorted.slice(0, 8);
  // Visually cap any outlier so other companies remain comparable.
  // Cap = ~1.5× the 2nd-largest holder; outliers get a broken-axis treatment.
  const secondBtc = top8[1]?.btc ?? 0;
  const BREAK_CAP = Math.max(secondBtc * 1.5, 1);
  const top8Display = top8.map((c) => ({
    ...c,
    displayBtc: Math.min(c.btc, BREAK_CAP),
    isBroken: c.btc > BREAK_CAP,
  }));
  const hasBreak = top8Display.some((c) => c.isBroken);
  return (
    <div>
      <div className="page-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>
        Public Company Bitcoin Holdings
      </div>
      <div className="page-subtitle" style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
        Top publicly traded companies by BTC on balance sheet — March 2026
      </div>
      <div className="holdings-summary" style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20, padding: "10px 14px", background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
        Tracked corporate BTC: <span style={{ color: "#f7931a", fontWeight: 700 }}>{fmt(totalBtc)} BTC</span> across <span style={{ color: "#f7931a", fontWeight: 700 }}>{COMPANY_HOLDINGS.length} companies</span> — worth ~<span style={{ color: "#22c55e", fontWeight: 700 }}>${(totalBtc * safePrice / 1e9).toFixed(1)}B</span>
      </div>

      <div className="holdings-chart-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "16px 8px", marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={isMobile ? 360 : 300}>
          <BarChart data={top8Display} margin={{ left: 0, right: isMobile ? 12 : 20, top: 4, bottom: 4 }} layout="vertical">
            <XAxis type="number" tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 10 : 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v/1000).toFixed(0) + "K" : v} tickCount={isMobile ? 4 : 6} />
            <YAxis type="category" dataKey="company" tick={{ fill: "var(--text-secondary)", fontSize: isMobile ? 11 : 12, fontFamily: "'Outfit', sans-serif" }} axisLine={false} tickLine={false} width={isMobile ? 108 : 100} interval={0} tickFormatter={n => isMobile && n.length > 14 ? n.slice(0, 13) + "…" : n} />
            <Tooltip
              contentStyle={{ background: "var(--bg-card-elevated)", border: "1px solid #f7931a66", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "10px 14px", maxWidth: "calc(100vw - 32px)", color: "var(--text-primary)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
              labelStyle={{ color: "#f7931a", fontWeight: 800, marginBottom: 4 }}
              itemStyle={{ color: "var(--text-secondary)", fontWeight: 600 }}
              formatter={(_, __, entry) => {
                const actual = entry?.payload?.btc ?? 0;
                return [fmt(actual) + " BTC  ·  $" + (actual * safePrice / 1e9).toFixed(2) + "B", "Holdings"];
              }}
            />
            <Bar dataKey="displayBtc" shape={<BrokenBarShape />} isAnimationActive={false}>
              {top8Display.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#f7931a" : i === 1 ? "#e67e22" : i === 2 ? "#d4a574" : "#8b7355"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {hasBreak && (
          <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", textAlign: "center", marginTop: 6, paddingRight: 8 }}>
            // axis break — top holder's bar truncated so other companies remain comparable
          </div>
        )}
      </div>

      <div className="holdings-table-wrap">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Company</th>
              <SortTh colKey="btc" activeSortKey={sortKey} activeSortDir={sortDir} onSort={handleSort} className="num">BTC Holdings</SortTh>
              <th className="num">USD Value</th>
              {!isMobile && <th>Method</th>}
              {!isMobile && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => (
              <tr key={c.company}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }} aria-hidden="true">{c.country}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-sans)", fontSize: 13 }}>{c.company}</div>
                      <div style={{ fontSize: 10, color: "var(--accent-bitcoin)", fontWeight: 700, letterSpacing: "0.04em", marginTop: 1 }}>{c.ticker}</div>
                    </div>
                  </div>
                </td>
                <td className="num" style={{ color: "var(--accent-bitcoin)" }}>{fmt(c.btc)}</td>
                <td className="num" style={{ color: "var(--status-up)" }}>${(c.btc * safePrice / 1e9).toFixed(2)}B</td>
                {!isMobile && <td style={{ color: "var(--text-dim)", fontSize: 11 }}>{c.method}</td>}
                {!isMobile && <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{c.status}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── COUNTRY HOLDINGS TAB ───────────────────────────────────────
const HoldingsTab = ({ price }) => {
  const safePrice = price || FALLBACK_PRICE;
  const isMobile = useIsMobile();
  const [sortKey, setSortKey] = useState("btc");
  const [sortDir, setSortDir] = useState("desc");
  const handleSort = (key) => {
    setSortDir(prev => (sortKey === key && prev === "desc") ? "asc" : "desc");
    setSortKey(key);
  };
  const sortedCountries = [...COUNTRY_HOLDINGS].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  return (
    <div>
      <div className="page-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>
        Government Bitcoin Holdings
      </div>
      <div className="page-subtitle" style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
        Nation-state BTC reserves as of March 2026
      </div>
      <div className="holdings-summary" style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20, padding: "10px 14px", background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
        Total government-held BTC: <span style={{ color: "#f7931a", fontWeight: 700 }}>650,288 BTC</span> across <span style={{ color: "#f7931a", fontWeight: 700 }}>13 entities</span> — worth ~<span style={{ color: "#22c55e", fontWeight: 700 }}>${(650288 * safePrice / 1e9).toFixed(1)}B</span>
      </div>

      <div className="holdings-chart-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "16px 8px", marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={isMobile ? 320 : 280}>
          <BarChart data={COUNTRY_HOLDINGS.filter(c => c.btc > 0)} margin={{ left: 0, right: isMobile ? 12 : 20, top: 4, bottom: 4 }} layout="vertical">
            <XAxis type="number" tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 10 : 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000).toFixed(0) + "K"} tickCount={isMobile ? 4 : 6} />
            <YAxis type="category" dataKey="country" tick={{ fill: "var(--text-secondary)", fontSize: isMobile ? 11 : 12, fontFamily: "'Outfit', sans-serif" }} axisLine={false} tickLine={false} width={isMobile ? 84 : 110} interval={0} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid #f7931a44", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "8px 12px", maxWidth: "calc(100vw - 32px)" }} formatter={(v) => [fmt(v) + " BTC ($" + (v * safePrice / 1e9).toFixed(2) + "B)", "Holdings"]} />
            <Bar dataKey="btc" radius={[0, 8, 8, 0]}>
              {COUNTRY_HOLDINGS.filter(c => c.btc > 0).map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#f7931a" : i === 1 ? "#e67e22" : i === 2 ? "#d4a574" : "#8b7355"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="holdings-table-wrap">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Country</th>
              <SortTh colKey="btc" activeSortKey={sortKey} activeSortDir={sortDir} onSort={handleSort} className="num">BTC Holdings</SortTh>
              <th className="num">USD Value</th>
              {!isMobile && <th>Method</th>}
              {!isMobile && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {sortedCountries.map((c) => (
              <tr key={c.country}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }} aria-hidden="true">{c.flag}</span>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-sans)", fontSize: 13 }}>{c.country}</span>
                  </div>
                </td>
                <td className="num" style={{ color: c.btc > 0 ? "var(--accent-bitcoin)" : "var(--status-down)" }}>
                  {c.btc > 0 ? fmt(c.btc) : "0"}
                </td>
                <td className="num" style={{ color: c.btc > 0 ? "var(--status-up)" : "var(--text-dim)" }}>
                  {c.btc > 0 ? `$${(c.btc * safePrice / 1e9).toFixed(2)}B` : "—"}
                </td>
                {!isMobile && <td style={{ color: "var(--text-dim)", fontSize: 11 }}>{c.method}</td>}
                {!isMobile && <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{c.status}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Thesis tab static data lives in src/data/thesis.js — see imports at top of file.

// Linear interpolation through SILENT_TAX_M2_DATA. Scroll progress 0..1 → real historical state.
// Used by the pinned scrolly's counter, year ticker, and playhead — drives the *actual* decay curve.
const silentTaxDataAtProgress = (p) => {
  const data = SILENT_TAX_M2_DATA;
  const last = data.length - 1;
  const idx = Math.max(0, Math.min(last, p * last));
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, last);
  const t = idx - lo;
  const a = data[lo];
  const b = data[hi];
  return {
    year:   a.year + (b.year - a.year) * t,
    m2:     a.m2   + (b.m2   - a.m2)   * t,
    pp:     a.pp   + (b.pp   - a.pp)   * t,
    intIdx: lo,
  };
};

// Thesis & Strategy static data live in src/data/thesis.js and src/data/strategy.js.

// Simulate periodic DCA over the existing 5-year price history.
// The chart is downsampled to ~60 monthly points; we treat each point as one
// buy interval. To preserve the "weekly" framing in the UI, we convert the
// chosen weekly amount into the equivalent dollars per interval.
// Returns { totalInvested, btcAccumulated, currentValue, roi, series }.
const computeDcaOutcome = (longTermChart, weeklyAmount, currentPrice) => {
  if (!Array.isArray(longTermChart) || longTermChart.length === 0 || !currentPrice) {
    return { totalInvested: 0, btcAccumulated: 0, currentValue: 0, roi: 0, series: [] };
  }
  const fiveYearsAgo = Date.now() - 5 * 365.25 * 24 * 60 * 60 * 1000;
  const data = longTermChart.filter(p => p.t >= fiveYearsAgo);
  if (data.length === 0) return { totalInvested: 0, btcAccumulated: 0, currentValue: 0, roi: 0, series: [] };

  const intervals = data.length;
  const yearsCovered = 5;
  const totalWeeks = yearsCovered * 52;
  const weeksPerInterval = totalWeeks / intervals;
  const dollarsPerInterval = weeklyAmount * weeksPerInterval;

  let cumulativeInvested = 0;
  let cumulativeBtc = 0;
  const series = [];
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    if (!point || typeof point.price !== "number" || point.price <= 0) continue;
    cumulativeInvested += dollarsPerInterval;
    cumulativeBtc += dollarsPerInterval / point.price;
    series.push({
      date: point.date,
      t: point.t,
      invested: Math.round(cumulativeInvested),
      value: Math.round(cumulativeBtc * point.price),
    });
  }
  // Final point uses current spot price to reflect today's value.
  const currentValue = cumulativeBtc * currentPrice;
  if (series.length > 0) {
    series[series.length - 1] = {
      ...series[series.length - 1],
      value: Math.round(currentValue),
    };
  }
  const roi = cumulativeInvested > 0 ? (currentValue - cumulativeInvested) / cumulativeInvested : 0;
  return {
    totalInvested: cumulativeInvested,
    btcAccumulated: cumulativeBtc,
    currentValue,
    roi,
    series,
  };
};

// Find the largest peak-to-trough drawdown in the visible price history.
const computeMaxDrawdown = (longTermChart) => {
  if (!Array.isArray(longTermChart) || longTermChart.length < 2) {
    return { drawdownPct: 0, peakDate: null, troughDate: null };
  }
  let peakPrice = longTermChart[0].price;
  let peakIdx = 0;
  let worst = { drawdownPct: 0, peakDate: longTermChart[0].date, troughDate: longTermChart[0].date };
  for (let i = 0; i < longTermChart.length; i++) {
    const p = longTermChart[i].price;
    if (p > peakPrice) {
      peakPrice = p;
      peakIdx = i;
    }
    const dd = (peakPrice - p) / peakPrice;
    if (dd > worst.drawdownPct) {
      worst = {
        drawdownPct: dd,
        peakDate: longTermChart[peakIdx].date,
        troughDate: longTermChart[i].date,
      };
    }
  }
  return { drawdownPct: worst.drawdownPct * 100, peakDate: worst.peakDate, troughDate: worst.troughDate };
};

// Phase header — banner that introduces each chapter of the thesis journey (Basics → Intermediate → Advanced).
const PhaseHeader = ({ phase, label, title, sub, accent = "#f7931a", phaseRef, idAnchor }) => {
  const phaseNum = parseInt(phase, 10);
  return (
    <Reveal>
      <div ref={phaseRef} id={idAnchor} className="thesis-phase-header" style={{ borderColor: `${accent}33`, scrollMarginTop: 110 }}>
        <div className="thesis-phase-badge" style={{ background: `${accent}10`, borderColor: `${accent}55` }}>
          <span className="thesis-phase-num" style={{ color: accent }}>{phase}</span>
          <span className="thesis-phase-divider" style={{ background: `${accent}55` }} />
          <span className="thesis-phase-label" style={{ color: accent }}>{label}</span>
        </div>
        <div className="thesis-phase-title">{title}</div>
        <div className="thesis-phase-sub">{sub}</div>
        <div className="thesis-phase-dots" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`thesis-phase-dot${n <= phaseNum ? " filled" : ""}${n === phaseNum ? " active" : ""}`}
              style={n <= phaseNum ? { background: accent } : undefined}
            />
          ))}
          <span className="thesis-phase-dots-label">{phaseNum} of 3</span>
        </div>
      </div>
    </Reveal>
  );
};

// Silent Tax — the centerpiece visualization. Money printing as the invisible tax savers have been paying since 1971.
// ─── Silent Tax: Pinned Scrollytelling ───────────────────────────────
// A viewport-locked walk through 54 years of dollar decay. Counter, year,
// and playhead scrub continuously from real SILENT_TAX_M2_DATA; the right-
// column text snaps to chapter boundaries; events flash as the playhead
// crosses them; the coda swaps to Bitcoin's halving curve. Mobile and
// reduced-motion users get a stacked-cards fallback with the same content.

// Imperatively updates counter/year/playhead from scroll progress without
// triggering a parent re-render on every frame. Reports integer data-point
// crossings up via setPlayheadIdx so the chart's bright slice stays in sync.
const SilentTaxPlayheadDriver = ({ wrapRef, counterRef, yearRef, chartRef, setPlayheadIdx, codaActive }) => {
  // Pinned mode + 79px page-header offset → playhead stays at 1971 until the
  // wrap is fully pinned, so the chart only starts scrubbing once the full
  // stage is in view.
  const progress = useScrollProgress(wrapRef, { pinned: true, pinTop: SILENT_TAX_PIN_TOP });
  const lastIdxRef = useRef(-1);
  useEffect(() => {
    if (codaActive) return;
    // Chapters 0..5 are the data walk; chapter 6 (coda) holds at the end state.
    const dataMaxP = 6 / 7;
    const dataP = Math.min(1, progress / dataMaxP);
    const d = silentTaxDataAtProgress(dataP);
    if (counterRef.current) counterRef.current.textContent = "$" + d.pp.toFixed(2);
    if (yearRef.current)    yearRef.current.textContent    = String(Math.round(d.year));
    if (chartRef.current) {
      const pct = Math.max(0, Math.min(1, (d.year - 1971) / 54));
      chartRef.current.style.setProperty("--playhead-pct", String(pct));
    }
    if (d.intIdx !== lastIdxRef.current) {
      lastIdxRef.current = d.intIdx;
      setPlayheadIdx(d.intIdx);
    }
  }, [progress, codaActive, counterRef, yearRef, chartRef, setPlayheadIdx]);
  return null;
};

const SilentTaxScrollHint = ({ wrapRef }) => {
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);
  const progress = useScrollProgress(wrapRef, { pinned: true, pinTop: SILENT_TAX_PIN_TOP });
  useEffect(() => {
    if (shownRef.current) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("btc-dashboard.silent-tax.hint") === "dismissed") {
        shownRef.current = true;
        return;
      }
    } catch (e) {}
    if (progress > 0.02 && progress < 0.12) {
      shownRef.current = true;
      const showTid = setTimeout(() => setVisible(true), 700);
      const dismiss = () => {
        setVisible(false);
        try { sessionStorage.setItem("btc-dashboard.silent-tax.hint", "dismissed"); } catch (e) {}
      };
      window.addEventListener("wheel",     dismiss, { once: true, passive: true });
      window.addEventListener("touchmove", dismiss, { once: true, passive: true });
      window.addEventListener("keydown",   dismiss, { once: true });
      const autoDismiss = setTimeout(dismiss, 5000);
      return () => { clearTimeout(showTid); clearTimeout(autoDismiss); };
    }
  }, [progress]);
  if (!visible) return null;
  return (
    <div className="thesis-pinned-hint" aria-hidden="true">
      <span className="thesis-pinned-hint-arrow">↓</span>
      <span>Scroll to walk through 54 years</span>
    </div>
  );
};

const ThesisSilentTaxPinnedDesktop = () => {
  const wrapRef = useRef(null);
  const sceneRefs = useRef(SILENT_TAX_CHAPTERS.map(() => ({ current: null })));
  const refsArray = sceneRefs.current;
  const activeIndex = useScrollSpy(refsArray, { centerRatio: 0.5 });
  const counterRef = useRef(null);
  const yearRef = useRef(null);
  const chartRef = useRef(null);
  const [playheadIdx, setPlayheadIdx] = useState(0);

  const activeChapter = SILENT_TAX_CHAPTERS[activeIndex] || SILENT_TAX_CHAPTERS[0];
  const codaActive = !!activeChapter.isCoda;
  const counterColor = activeChapter.color;

  const sliceIdx = Math.min(playheadIdx + 2, SILENT_TAX_M2_DATA.length);
  const pastSlice = SILENT_TAX_M2_DATA.slice(0, sliceIdx);

  return (
    <section className="thesis-pinned-wrap" ref={wrapRef} aria-label="The silent tax: a guided walk through 54 years of dollar decay">
      <div className="thesis-pinned-stage">
        {/* LEFT — visual */}
        <div className="thesis-pinned-stage-left">
          <div className="thesis-pinned-eyebrow">The Silent Tax</div>
          <div className="thesis-pinned-year" ref={yearRef} aria-hidden="true">1971</div>

          <div
            className={`thesis-pinned-chart${codaActive ? " coda" : ""}`}
            ref={chartRef}
            style={{ "--playhead-color": counterColor }}
          >
            {!codaActive && (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={SILENT_TAX_M2_DATA} margin={{ top: 22, right: 14, left: 0, bottom: 6 }}>
                    <defs>
                      <linearGradient id="silentTaxM2Bright" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"  stopColor="#f7931a" stopOpacity={0.62} />
                        <stop offset="100%" stopColor="#f7931a" stopOpacity={0.04} />
                      </linearGradient>
                      <linearGradient id="silentTaxM2Dim" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"  stopColor="#f7931a" stopOpacity={0.14} />
                        <stop offset="100%" stopColor="#f7931a" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="year"
                      type="number"
                      domain={[1971, 2025]}
                      ticks={[1971, 1980, 1990, 2000, 2010, 2020]}
                      tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="m2"
                      orientation="left"
                      tick={{ fill: "var(--text-dim)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => "$" + v + "T"}
                      width={48}
                      domain={[0, 24]}
                    />
                    <Area
                      yAxisId="m2"
                      type="monotone"
                      dataKey="m2"
                      stroke="#f7931a44"
                      strokeWidth={1}
                      fill="url(#silentTaxM2Dim)"
                      isAnimationActive={false}
                      data={SILENT_TAX_M2_DATA}
                    />
                    <Area
                      yAxisId="m2"
                      type="monotone"
                      dataKey="m2"
                      stroke="#f7931a"
                      strokeWidth={2.5}
                      fill="url(#silentTaxM2Bright)"
                      isAnimationActive={false}
                      data={pastSlice}
                    />
                    {SILENT_TAX_EVENTS.map((evt) => {
                      const reached = pastSlice.length > 0 && pastSlice[pastSlice.length - 1].year >= evt.year;
                      return (
                        <ReferenceLine
                          key={evt.year}
                          yAxisId="m2"
                          x={evt.year}
                          stroke={reached ? "#ef4444" : "#3a3a5a"}
                          strokeWidth={reached ? 1.5 : 1}
                          strokeDasharray={reached ? undefined : "3 4"}
                          label={reached ? ({ viewBox }) => (
                            <text
                              x={evt.anchor === "start" ? viewBox.x + 6 : viewBox.x - 6}
                              y={viewBox.y + 12}
                              fill="#ef4444"
                              fontSize={10}
                              fontFamily="'JetBrains Mono', monospace"
                              fontWeight={700}
                              textAnchor={evt.anchor}
                            >
                              {evt.label}
                            </text>
                          ) : undefined}
                        />
                      );
                    })}
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="thesis-pinned-playhead" aria-hidden="true" />
              </>
            )}
            {codaActive && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={BTC_ISSUANCE_DATA} margin={{ top: 22, right: 14, left: 0, bottom: 6 }}>
                  <defs>
                    <linearGradient id="silentTaxBTC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#f7931a" stopOpacity={0.58} />
                      <stop offset="100%" stopColor="#f7931a" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="halving"
                    tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#f7931a", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v + "%"}
                    width={48}
                    domain={[0, 2]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#f7931a"
                    strokeWidth={2.5}
                    fill="url(#silentTaxBTC)"
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="thesis-pinned-counter-row">
            <div
              className="thesis-pinned-counter"
              ref={counterRef}
              style={{ color: counterColor, textShadow: `0 0 32px ${counterColor}33` }}
              aria-hidden="true"
            >
              {codaActive ? "0.83%" : "$1.00"}
            </div>
            <div className="thesis-pinned-counter-label">
              {codaActive ? "Bitcoin's annual issuance — halving toward zero" : "Purchasing power of $1 saved in 1971"}
            </div>
          </div>
        </div>

        {/* RIGHT — chapter text stack */}
        <div className="thesis-pinned-stage-right">
          <div className="thesis-pinned-progress" aria-hidden="true">
            {SILENT_TAX_CHAPTERS.map((ch, i) => (
              <span
                key={i}
                className={`thesis-pinned-progress-dot${i === activeIndex ? " active" : ""}${i < activeIndex ? " past" : ""}`}
                style={i <= activeIndex ? { background: ch.color, borderColor: ch.color } : undefined}
              />
            ))}
          </div>
          {SILENT_TAX_CHAPTERS.map((ch, i) => (
            <article
              key={i}
              className={`thesis-pinned-chapter${i === activeIndex ? " active" : ""}`}
              aria-hidden={i === activeIndex ? "false" : "true"}
            >
              <div className="thesis-pinned-chapter-eyebrow" style={{ color: ch.color }}>{ch.eyebrow}</div>
              <h3 className="thesis-pinned-chapter-headline">{ch.headline}</h3>
              <p className="thesis-pinned-chapter-body">{ch.body}</p>
              {ch.ppTarget !== null && (
                <div className="thesis-pinned-chapter-stat">
                  <span className="thesis-pinned-chapter-stat-label">$1 from 1971 buys</span>
                  <span className="thesis-pinned-chapter-stat-value" style={{ color: ch.color }}>
                    ${ch.ppTarget.toFixed(2)}
                  </span>
                </div>
              )}
              {ch.isCoda && (
                <div className="thesis-pinned-chapter-stat thesis-pinned-chapter-stat-coda">
                  <span className="thesis-pinned-chapter-stat-label">BTC issuance, 2024–2028</span>
                  <span className="thesis-pinned-chapter-stat-value" style={{ color: ch.color }}>
                    0.83%
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>

        <SilentTaxScrollHint wrapRef={wrapRef} />
      </div>

      {/* Sentinels drive useScrollSpy. 7 chapters × 100vh = 700vh total. */}
      {SILENT_TAX_CHAPTERS.map((_, i) => (
        <div
          key={i}
          ref={refsArray[i]}
          className="thesis-pinned-sentinel"
          style={{ top: `${i * 100}vh` }}
          aria-hidden="true"
        />
      ))}

      <SilentTaxPlayheadDriver
        wrapRef={wrapRef}
        counterRef={counterRef}
        yearRef={yearRef}
        chartRef={chartRef}
        setPlayheadIdx={setPlayheadIdx}
        codaActive={codaActive}
      />
    </section>
  );
};

const ThesisSilentTaxFallback = () => {
  return (
    <section className="thesis-pinned-fallback">
      <Reveal>
        <div className="thesis-pinned-fallback-head">
          <div className="thesis-pinned-fallback-eyebrow">The Silent Tax</div>
          <h2 className="thesis-pinned-fallback-title">$1 saved in 1971 is now worth $0.13.</h2>
          <p className="thesis-pinned-fallback-sub">
            Since Nixon ended gold convertibility, the U.S. money supply has grown 32x. The bill is paid — quietly, decade by decade — by anyone holding cash.
          </p>
        </div>
      </Reveal>

      <div className="thesis-pinned-fallback-stack">
        {SILENT_TAX_CHAPTERS.map((ch, i) => (
          <Reveal key={i} delay={Math.min(0.04 * i, 0.18)}>
            <article className="thesis-pinned-fallback-chapter" style={{ borderLeftColor: ch.color }}>
              <div className="thesis-pinned-fallback-chapter-eyebrow" style={{ color: ch.color }}>{ch.eyebrow}</div>
              <h3 className="thesis-pinned-fallback-chapter-headline">{ch.headline}</h3>
              <p className="thesis-pinned-fallback-chapter-body">{ch.body}</p>
              {ch.ppTarget !== null && (
                <div className="thesis-pinned-fallback-chapter-stat" style={{ borderColor: ch.color + "55" }}>
                  <span>$1 from 1971 →</span>
                  <span style={{ color: ch.color, fontWeight: 900 }}>${ch.ppTarget.toFixed(2)}</span>
                </div>
              )}
              {ch.isCoda && (
                <div className="thesis-pinned-fallback-chapter-stat" style={{ borderColor: ch.color + "55" }}>
                  <span>BTC issuance 2024–2028</span>
                  <span style={{ color: ch.color, fontWeight: 900 }}>0.83%</span>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// ─── Silent Tax: Mobile "stepped" rebuild ────────────────────────────────
// Beginner-first, plain-language walk with one predict-then-reveal moment.
// Replaces the static fallback on phones (≤760px). Desktop and desktop
// reduced-motion paths are untouched. Numbers count once on scroll-into-view
// and snap to final under prefers-reduced-motion (handled inside useCountUp).
const SilentTaxStepCard = ({ step, from }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.45 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const val = useCountUp(step.pp, { trigger: inView, duration: 1100, from });
  return (
    <article ref={ref} className="thesis-tax-step" style={{ borderLeftColor: step.color }}>
      <div className="thesis-tax-step-eyebrow" style={{ color: step.color }}>{step.eyebrow}</div>
      <h3 className="thesis-tax-step-headline">{step.headline}</h3>
      <p className="thesis-tax-step-body">{step.body}</p>
      <div className="thesis-tax-step-meter">
        <div className="thesis-tax-step-num" style={{ color: step.color }} aria-hidden="true">
          ${val.toFixed(2)}
        </div>
        <div className="thesis-tax-step-num-label">what your 1971 dollar buys</div>
      </div>
    </article>
  );
};

const GuessReveal = ({ quiz: g, groupLabel }) => {
  const [picked, setPicked] = useState(null);
  return (
    <div className={`thesis-tax-guess${picked ? " answered" : ""}`}>
      <div className="thesis-tax-guess-prompt">{g.prompt}</div>
      <div className="thesis-tax-guess-options" role="group" aria-label={groupLabel}>
        {g.options.map((o) => {
          const isPicked = picked && picked.label === o.label;
          const state = !picked ? "" : o.correct ? " correct" : isPicked ? " wrong" : " dim";
          return (
            <button
              key={o.label}
              type="button"
              className={`thesis-tax-guess-opt${state}`}
              onClick={() => {
                if (picked) return;
                setPicked(o);
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8);
              }}
              disabled={!!picked}
              aria-pressed={isPicked}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="thesis-tax-guess-reveal" aria-live="polite">
          <div className="thesis-tax-guess-answer">It&apos;s <strong>{g.revealValue}</strong>.</div>
          <p className="thesis-tax-guess-feedback">{picked.correct ? g.revealCorrect : g.revealWrong}</p>
          <p className="thesis-tax-guess-lead">{g.revealLead}</p>
        </div>
      )}
    </div>
  );
};

const ThesisSilentTaxStepped = () => {
  const g = SILENT_TAX_GUESS;
  return (
    <section className="thesis-tax-stepped" aria-label="The silent tax: how a saved dollar loses value">
      <Reveal>
        <div className="thesis-tax-head">
          <div className="thesis-tax-eyebrow">{g.eyebrow}</div>
          <h2 className="thesis-tax-anchor">{g.anchor}</h2>
          <p className="thesis-tax-setup">{g.setup}</p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <GuessReveal quiz={g} groupLabel="Guess what $1 from 1971 buys today" />
      </Reveal>

      <div className="thesis-tax-walk">
        {SILENT_TAX_STEPS.map((step, i) => (
          <Reveal key={i} delay={Math.min(0.03 * i, 0.12)}>
            <SilentTaxStepCard step={step} from={i === 0 ? 1 : SILENT_TAX_STEPS[i - 1].pp} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="thesis-tax-coda" style={{ borderColor: SILENT_TAX_CODA.color + "55" }}>
          <div className="thesis-tax-coda-eyebrow" style={{ color: SILENT_TAX_CODA.color }}>{SILENT_TAX_CODA.eyebrow}</div>
          <h3 className="thesis-tax-coda-headline">{SILENT_TAX_CODA.headline}</h3>
          <p className="thesis-tax-coda-body">{SILENT_TAX_CODA.body}</p>
          <div className="thesis-tax-coda-stat">
            <span>{SILENT_TAX_CODA.statLabel}</span>
            <span style={{ color: SILENT_TAX_CODA.color, fontWeight: 900 }}>{SILENT_TAX_CODA.statValue}</span>
          </div>
          <p className="thesis-tax-coda-bridge">{SILENT_TAX_CODA.bridge}</p>
        </div>
      </Reveal>
    </section>
  );
};

const SilentTaxIntro = () => {
  const g = SILENT_TAX_GUESS;
  return (
    <div className="thesis-tax-intro">
      <Reveal>
        <div className="thesis-tax-head">
          <div className="thesis-tax-eyebrow">{g.eyebrow}</div>
          <h2 className="thesis-tax-anchor">{g.anchor}</h2>
          <p className="thesis-tax-setup">{g.setup}</p>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <GuessReveal quiz={g} groupLabel="Guess what $1 from 1971 buys today" />
      </Reveal>
    </div>
  );
};

const ThesisSilentTaxPinned = () => {
  const isMobile = useIsMobile(760);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  if (isMobile) {
    return <ThesisSilentTaxStepped />;
  }
  return (
    <>
      <SilentTaxIntro />
      {reduceMotion ? <ThesisSilentTaxFallback /> : <ThesisSilentTaxPinnedDesktop />}
    </>
  );
};

const ThesisMetricCard = ({ metric, index }) => {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const parsed = parseNumericMetric(metric.value);
  const animated = useCountUp(parsed ? parsed.target : 0, { trigger: inView && !!parsed, duration: 1400 });
  const display = parsed
    ? `${parsed.prefix}${animated.toFixed(parsed.decimals)}${parsed.suffix}`
    : metric.value;
  return (
    <Reveal delay={0.05 + index * 0.07}>
      <div
        ref={cardRef}
        className="card-hover thesis-metric-card"
        style={{
          background: "#111629",
          border: "1px solid #242b49",
          borderRadius: 16,
          padding: "18px",
          minHeight: 138,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 900, color: "#f7931a", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
          {display}
        </div>
        <div>
          <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: 5 }}>
            {metric.label}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.45 }}>
            {metric.sub}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const ThesisHero = () => {
  const heroRef = useRef(null);
  const heroProgress = useScrollProgress(heroRef);
  const parallaxY = prefersReducedMotion() ? 0 : (heroProgress - 0.5) * -36;
  return (
    <section ref={heroRef} className="thesis-hero-grid" style={{
      display: "grid",
      gridTemplateColumns: "var(--thesis-hero-columns, minmax(0, 1.08fr) minmax(300px, 0.92fr))",
      gap: 22,
      alignItems: "stretch",
    }}>
      <Reveal>
        <div className="thesis-hero-card" style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #121728 0%, #171d33 58%, #211400 100%)",
          border: "1px solid #f7931a33",
          borderRadius: 18,
          padding: "28px",
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-20% -10% -20% -10%",
              background: "radial-gradient(60% 50% at 80% 20%, #f7931a22 0%, transparent 60%), radial-gradient(50% 40% at 10% 90%, #f7931a18 0%, transparent 65%)",
              transform: `translate3d(0, ${parallaxY}px, 0)`,
              willChange: "transform",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
              The Bitcoin Thesis
            </div>
            <blockquote style={{ margin: "0 0 16px", padding: "2px 0 2px 14px", borderLeft: "2px solid #f7931a55" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e4e8f5", fontFamily: "'Outfit', sans-serif", fontStyle: "italic", lineHeight: 1.4 }}>
                “{THESIS_EPIGRAPH.quote}”
              </div>
              <div style={{ fontSize: 11, color: "#8f9ab3", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>
                — {THESIS_EPIGRAPH.attribution}
              </div>
            </blockquote>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.03, marginBottom: 10, maxWidth: 720 }}>
              Every fiat currency loses value. Bitcoin can't.
            </div>
            <div style={{ fontSize: 12, color: "#6c7690", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, marginBottom: 14, maxWidth: 700 }}>
              {THESIS_EPIGRAPH.genesis}
            </div>
            <div style={{ fontSize: 15, color: "#b4bed4", lineHeight: 1.75, fontFamily: "'Outfit', sans-serif", maxWidth: 700 }}>
              For five thousand years money kept getting harder to produce — until 1971. Bitcoin restarts that progression: a 21-million-coin ceiling no government, bank, or crisis can move. The thesis isn't "number go up." It's what happens when humans finally get the option to save in money that doesn't decay.
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
            {["Scarce", "Verifiable", "Portable", "Owner-controlled"].map((label, i) => (
              <Reveal key={label} delay={0.15 + i * 0.06}>
                <span style={{
                  display: "inline-block",
                  fontSize: 10,
                  color: "#f7931a",
                  background: "#f7931a12",
                  border: "1px solid #f7931a22",
                  borderRadius: 999,
                  padding: "5px 9px",
                  fontWeight: 800,
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}>
                  {label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
      }} className="thesis-metrics-grid">
        {THESIS_METRICS.map((metric, i) => (
          <ThesisMetricCard key={metric.label} metric={metric} index={i} />
        ))}
      </div>
    </section>
  );
};

const ThesisWhatIsMoney = () => (
  <section className="thesis-money-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
          {MONEY_INTRO.eyebrow}
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 10 }}>
          {MONEY_INTRO.headline}
        </div>
        {MONEY_INTRO.body.map((p, i) => (
          <div key={i} style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 760, marginTop: i === 0 ? 0 : 10 }}>
            {p}
          </div>
        ))}
      </div>
    </Reveal>
    <div className="thesis-money-grid">
      {MONEY_SCORECARD.map((panel, i) => (
        <Reveal key={panel.key} delay={0.05 + i * 0.06}>
          <div className="thesis-money-panel">
            <div className="thesis-money-panel-title">{panel.title}</div>
            <div className="thesis-money-panel-question">{panel.question}</div>
            <div className="thesis-money-panel-body">{panel.body}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const ThesisProblem = () => (
  <section className="thesis-problem-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
          The Problem
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 8 }}>
          Soft money taxes patience — and almost everyone is paying it.
        </div>
        <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 760 }}>
          When governments can issue money at will, the rules of saving change underneath you. Holders pay an invisible tax through dilution. The people closest to the printer get the benefit first; wage earners and savers get the bill later. This is the actual pain Bitcoin is designed to solve.
        </div>
      </div>
    </Reveal>
    <div className="thesis-problem-grid">
      {SOFT_MONEY_COSTS.map((cost, i) => (
        <Reveal key={cost.label} delay={0.05 + i * 0.08}>
          <div className="card-hover thesis-problem-card" style={{
            background: "linear-gradient(160deg, #1c1422 0%, #0f1426 100%)",
            border: "1px solid #3a1f2a",
            borderRadius: 14,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minHeight: 208,
          }}>
            <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1.2, textTransform: "uppercase" }}>
              {cost.label}
            </div>
            <div style={{ fontSize: 16, color: "#ffffff", fontWeight: 800, fontFamily: "'Outfit', sans-serif", lineHeight: 1.25 }}>
              {cost.title}
            </div>
            <div style={{ fontSize: 13, color: "#8f9ab3", lineHeight: 1.65, fontFamily: "'Outfit', sans-serif", flex: 1 }}>
              {cost.text}
            </div>
            <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1, paddingTop: 8, borderTop: "1px solid #3a1f2a" }}>
              {cost.stat}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const ThesisSilentTaxPersonal = () => {
  const years = PP_BY_YEAR.map((r) => r.year);
  const latest = PP_BY_YEAR[PP_BY_YEAR.length - 1];
  const [birthYear, setBirthYear] = useState(1990);
  const birthRow = PP_BY_YEAR.find((r) => r.year === birthYear) || PP_BY_YEAR[0];
  const ratio = latest.pp / birthRow.pp;
  const cents = Math.round(ratio * 100);
  const displayValue = cents >= 100 ? "a full dollar" : `about ${cents}¢`;

  return (
    <section className="thesis-personal-section">
      <Reveal>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
            Make it personal
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.22 }}>
            What has your own dollar lost?
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="thesis-birthyear">
          <label htmlFor="thesis-birthyear-select" className="thesis-birthyear-label">
            A dollar saved the year you were born
          </label>
          <select
            id="thesis-birthyear-select"
            className="thesis-birthyear-select"
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <div className="thesis-birthyear-result">
            is worth <strong>{displayValue}</strong> today.
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="thesis-tax-caveat-line">{SILENT_TAX_CAVEAT}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
            {SILENT_TAX_INTL.eyebrow}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.25 }}>
            {SILENT_TAX_INTL.headline}
          </div>
        </div>
      </Reveal>
      <div className="thesis-intl-grid">
        {SILENT_TAX_INTL.cases.map((c, i) => (
          <Reveal key={c.country} delay={0.12 + i * 0.06}>
            <div className="thesis-intl-card">
              <div className="thesis-intl-country">{c.country}</div>
              <div className="thesis-intl-stat">{c.stat}</div>
              <div className="thesis-intl-body">{c.body}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.18}>
        <p className="thesis-intl-bridge">{SILENT_TAX_INTL.bridge}</p>
      </Reveal>
    </section>
  );
};

const ThesisHistory = () => (
  <section className="thesis-history-section">
    <Reveal>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
          5,000 years of monetary history
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 8 }}>
          Every money in history was replaced by something harder. Until now.
        </div>
        <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 780 }}>
          Saifedean Ammous's central historical argument in <em style={{ color: "#d3d8e8", fontStyle: "italic" }}>The Bitcoin Standard</em>: across cultures and millennia, every monetary good was eventually displaced by one harder to produce. For the first time, a money exists that nothing softer can compete with — and nothing harder can be made.
        </div>
      </div>
    </Reveal>
    <div className="thesis-history-rail">
      <div className="thesis-history-line" aria-hidden="true" />
      {MONEY_HISTORY.map((era, i) => (
        <Reveal key={era.name} delay={0.04 + i * 0.05}>
          <div className={`thesis-history-card${era.isBitcoin ? " is-bitcoin" : ""}`}>
            <div className="thesis-history-dot" aria-hidden="true" />
            <div className="thesis-history-era">{era.era}</div>
            <div className="thesis-history-name">{era.name}</div>
            <div className="thesis-history-note">{era.note}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const ThesisDigitalScarcity = () => (
  <section className="thesis-digital-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
          {DIGITAL_SCARCITY.eyebrow}
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 8 }}>
          {DIGITAL_SCARCITY.headline}
        </div>
      </div>
    </Reveal>
    <div className="thesis-digital-steps">
      {DIGITAL_SCARCITY.steps.map((step, i) => (
        <Reveal key={step.title} delay={0.05 + i * 0.07}>
          <div className="thesis-digital-step">
            <div className="thesis-digital-step-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="thesis-digital-step-body">
              <div className="thesis-digital-step-title">{step.title}</div>
              <div className="thesis-digital-step-text">{step.body}</div>
              {step.breaks && <div className="thesis-digital-step-breaks">{step.breaks}</div>}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={0.3}>
      <div className="thesis-supply-guess">
        <GuessReveal quiz={SUPPLY_CAP_GUESS} groupLabel="Guess what share of Americans know Bitcoin's supply is capped" />
      </div>
    </Reveal>
  </section>
);

const ThesisHardness = () => {
  const max = Math.max(...HARDNESS_DATA.map((d) => d.rate));
  const baseColor = { fiat: "#ef4444", gold: "#fbbf24" };
  // 4 BTC eras: palest green (highest rate/worst) → richest green (lowest rate/best)
  const btcGreens = ["#86efac", "#4ade80", "#22c55e", "#16a34a"];
  let btcIdx = 0;
  const rows = HARDNESS_DATA.map((d) => ({
    ...d,
    color: d.name.startsWith("BTC") ? btcGreens[btcIdx++] : baseColor[d.tone] || "var(--text-dim)",
  }));

  return (
    <section className="thesis-hardness-section">
      <Reveal>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
            Hardness
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 8 }}>
            Hardness is measured in supply growth. Bitcoin's approaches zero.
          </div>
          <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 780 }}>
            Stock-to-flow is the ratio of existing supply to annual new supply. The higher the ratio, the harder the money. Gold dominated for millennia at roughly 60x. After the 2024 halving, Bitcoin's ratio passed gold's — and by design it doubles every four years until issuance ends in 2140.
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="thesis-hardness-chart">
          {rows.map((d, i) => {
            const widthPct = (d.rate / max) * 100;
            return (
              <div key={d.name} className="thesis-hardness-row">
                <div className="thesis-hardness-name">
                  <span className="thesis-hardness-label">{d.name === "USD M2" ? <><Term k="m2">M2</Term></> : d.name}</span>
                  <span className="thesis-hardness-note">{d.note}</span>
                </div>
                <div className="thesis-hardness-bar-wrap">
                  <div className="thesis-hardness-bar" style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${d.color}33, ${d.color})`,
                    boxShadow: `0 0 18px ${d.color}22`,
                    animationDelay: `${0.15 + i * 0.08}s`,
                  }} />
                  <div className="thesis-hardness-value" style={{ color: "var(--text-muted)" }}>
                    {d.rate.toFixed(2)}% / yr
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="thesis-hardness-footnote">
          For context: 6.5% annual M2 expansion doubles in roughly 11 years. 0.83% issuance takes 84 years to double. After 2032, it takes centuries.
        </div>
        <div className="thesis-hardness-caption">
          This is the "Scarce" panel from the money scorecard above, measured.
        </div>
      </Reveal>
    </section>
  );
};

const ThesisScene = ({ move, sceneRef, idAnchor }) => (
  <article
    ref={sceneRef}
    id={idAnchor}
    className="thesis-scene"
    data-move={move.step}
    style={{
      background: "linear-gradient(135deg, #171b30 0%, #101528 100%)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 16,
      padding: "26px",
      minHeight: 360,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      scrollMarginTop: 110,
    }}
  >
    <Reveal>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
            {move.eyebrow}
          </div>
          <div style={{ fontSize: 13, color: "#f7931a88", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
            {move.step}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#ffffff", fontWeight: 900, lineHeight: 1.08, fontFamily: "'Outfit', sans-serif", maxWidth: 680, marginBottom: 22 }}>
          {move.title}
        </div>
        <div className="thesis-active-grid" style={{ display: "grid", gridTemplateColumns: "var(--thesis-active-columns, repeat(2, minmax(0, 1fr)))", gap: 22 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              What it is
            </div>
            <div style={{ fontSize: 15, color: "#aeb8cf", lineHeight: 1.75, fontFamily: "'Outfit', sans-serif" }}>
              {move.property}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              Why it matters
            </div>
            <div style={{ fontSize: 15, color: "#d3d8e8", lineHeight: 1.75, fontFamily: "'Outfit', sans-serif" }}>
              {move.implication}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 14,
      alignItems: "center",
      borderTop: "1px solid var(--border-subtle)",
      paddingTop: 18,
      marginTop: 24,
      flexWrap: "wrap",
    }}>
      <div style={{ fontSize: 12, color: "#f7931a", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
        {move.stat}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
        {move.watch}
      </div>
    </div>
  </article>
);

const ThesisScrolly = () => {
  const wrapRef = useRef(null);
  const sceneRefs = useRef(THESIS_FLOW.map(() => ({ current: null })));
  const refsArray = sceneRefs.current;
  const activeIndex = useScrollSpy(refsArray);
  const blockProgress = useScrollProgress(wrapRef);
  return (
    <div className="thesis-scrolly" ref={wrapRef}>
      <div className="thesis-pillbar" role="tablist" aria-label="Four-move case">
        {THESIS_FLOW.map((item, i) => (
          <a
            key={item.step}
            href={`#thesis-move-${i}`}
            className={`thesis-pill${i === activeIndex ? " active" : ""}`}
            role="tab"
            aria-selected={i === activeIndex}
          >
            <span className="thesis-pill-step">{item.step}</span>
            <span className="thesis-pill-label">{item.eyebrow}</span>
          </a>
        ))}
        <span className="thesis-pillbar-underline" style={{
          width: `${100 / THESIS_FLOW.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }} />
      </div>

      <aside className="thesis-rail" aria-label="Four-move navigation">
        <div className="thesis-rail-header">
          <div className="thesis-rail-eyebrow">Four-move case</div>
          <div className="thesis-rail-sub">Scroll through. Each move builds on the last.</div>
        </div>
        <div className="thesis-rail-items">
          <span className="thesis-rail-track" aria-hidden="true" />
          <span
            className="thesis-rail-fill"
            aria-hidden="true"
            style={{ transform: `scaleY(${blockProgress})` }}
          />
          {THESIS_FLOW.map((item, i) => (
            <a
              key={item.step}
              href={`#thesis-move-${i}`}
              className={`thesis-rail-item${i === activeIndex ? " active" : ""}`}
              aria-current={i === activeIndex ? "true" : undefined}
            >
              <span className="thesis-rail-step">{item.step}</span>
              <span className="thesis-rail-text">
                <span className="thesis-rail-eyebrow-sm">{item.eyebrow}</span>
                <span className="thesis-rail-title">{item.title.split(".")[0]}.</span>
              </span>
            </a>
          ))}
        </div>
      </aside>

      <div className="thesis-scenes">
        {THESIS_FLOW.map((move, i) => (
          <ThesisScene
            key={move.step}
            move={move}
            sceneRef={refsArray[i]}
            idAnchor={`thesis-move-${i}`}
          />
        ))}
      </div>
    </div>
  );
};

const ThesisProperties = () => {
  const ratingColor = {
    bad:  "#ef4444",
    okay: "#fbbf24",
    good: "#86efac",
    best: "#22c55e",
  };
  const ratingLabel = {
    bad:  "Weak",
    okay: "Limited",
    good: "Strong",
    best: "Best",
  };
  return (
    <section className="thesis-matrix-section">
      <Reveal>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
            Why this design wins
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 8 }}>
            Gold solved scarcity. Bitcoin solves everything else.
          </div>
          <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 780 }}>
            Back to the four-part scorecard from earlier — scarce, portable, divisible, verifiable. Every property gold pioneered, Bitcoin matches or beats. Every weakness gold has, Bitcoin fixes — and it does so without requiring trust in a vault, central bank, or government to honor your claim.
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="thesis-matrix-table" role="table" aria-label="Comparison of monetary properties: Gold, USD, Bitcoin">
          <div className="thesis-matrix-row thesis-matrix-header" role="row">
            <div className="thesis-matrix-prop" role="columnheader">Property</div>
            <div className="thesis-matrix-col" role="columnheader">Gold</div>
            <div className="thesis-matrix-col" role="columnheader">USD</div>
            <div className="thesis-matrix-col btc" role="columnheader">Bitcoin</div>
          </div>
          {PROPERTIES_MATRIX.map((row) => (
            <div key={row.property} className="thesis-matrix-row" role="row">
              <div className="thesis-matrix-prop" role="rowheader">
                <div className="thesis-matrix-prop-name">{row.property}</div>
                <div className="thesis-matrix-prop-desc">{row.desc}</div>
              </div>
              {[
                { ...row.gold, key: "gold", assetLabel: "Gold" },
                { ...row.usd, key: "usd", assetLabel: "USD" },
                { ...row.bitcoin, key: "btc", assetLabel: "Bitcoin" },
              ].map((cell) => (
                <div key={cell.key} className={`thesis-matrix-col${cell.key === "btc" ? " btc" : ""}`} role="cell">
                  <span className="thesis-matrix-asset" aria-hidden="true">{cell.assetLabel}</span>
                  <span className="thesis-matrix-pill" style={{
                    background: `${ratingColor[cell.rating]}1a`,
                    color: ratingColor[cell.rating],
                    border: `1px solid ${ratingColor[cell.rating]}44`,
                    ...(cell.rating === "best" ? { boxShadow: `0 0 8px ${ratingColor[cell.rating]}99, 0 0 2px ${ratingColor[cell.rating]}66` } : {}),
                  }}>
                    {ratingLabel[cell.rating]}
                  </span>
                  <div className="thesis-matrix-note">{cell.note}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

const ThesisMyths = () => (
  <section className="thesis-myths-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
          Common objections
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 8 }}>
          What skeptics get right, and what's out of date.
        </div>
        <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 780 }}>
          A thesis that can't survive its own objections isn't calibrated — it's a sales pitch. Here are the six most common ones, stated plainly, including the one where the skeptics have a real point.
        </div>
      </div>
    </Reveal>
    <div className="thesis-myth-grid">
      {MYTHS.map((m, i) => (
        <Reveal key={m.myth} delay={0.04 + i * 0.05}>
          <div className={`thesis-myth-card${m.isConcession ? " is-concession" : ""}`}>
            <div className="thesis-myth-label">{m.isConcession ? "Fair point" : "Myth"}</div>
            <div className="thesis-myth-claim">{m.myth}</div>
            <div className="thesis-myth-refutation">{m.refutation}</div>
            <div className="thesis-myth-mechanism">{m.mechanism}</div>
            {m.concession && <div className="thesis-myth-concession">{m.concession}</div>}
            {m.source && <div className="thesis-myth-source">{m.source}</div>}
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const ThesisTimePreference = ({ setActiveTab }) => (
  <section className="thesis-tp-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
          Time preference
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontFamily: "'Outfit', sans-serif", lineHeight: 1.18, marginBottom: 10 }}>
          {TIME_PREFERENCE_STORY.headline}
        </div>
        {TIME_PREFERENCE_STORY.paragraphs.map((p, i) => (
          <div key={i} style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 780, marginTop: i === 0 ? 0 : 10 }}>
            {p}
          </div>
        ))}
        <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", maxWidth: 780, marginTop: 14 }}>
          The most provocative claim in <em style={{ color: "#d3d8e8", fontStyle: "italic" }}>The Bitcoin Standard</em>: monetary debasement raises a society's time preference. Cathedrals, classical music, and capital-intensive industry came from low-time-preference cultures with hard money. The inverse is also true — and it's measurable in what a culture optimizes for.
        </div>
      </div>
    </Reveal>
    <div className="thesis-tp-grid">
      {[TIME_PREFERENCE.soft, TIME_PREFERENCE.hard].map((col, ci) => (
        <Reveal key={col.label} delay={0.1 + ci * 0.1}>
          <div className={`thesis-tp-col${ci === 1 ? " hard" : " soft"}`} style={{
            border: `1px solid ${col.accent}33`,
            background: `linear-gradient(160deg, ${col.accent}0e 0%, #0f1426 100%)`,
          }}>
            <div className="thesis-tp-col-label" style={{ color: col.accent }}>{col.label}</div>
            <ul className="thesis-tp-list">
              {col.items.map((it) => (
                <li key={it.head} className="thesis-tp-item">
                  <span className="thesis-tp-bullet" style={{ background: col.accent }} aria-hidden="true" />
                  <span className="thesis-tp-item-text">
                    <span className="thesis-tp-item-head">{it.head}.</span>{" "}
                    <span className="thesis-tp-item-tail">{it.tail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={0.15}>
      <div className="thesis-tp-closing">
        <p className="thesis-tp-closing-text">{TIME_PREFERENCE_STORY.closing}</p>
        <TabNavChip label="Design the system → Strategy" tab={2} setActiveTab={setActiveTab} />
      </div>
    </Reveal>
  </section>
);

const ThesisLenses = () => (
  <section className="thesis-lenses-section">
    <Reveal>
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 22px" }}>
        <div style={{ fontSize: 11, color: "#f7931a", fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>
          Positioning
        </div>
        <div style={{ fontSize: 24, color: "#ffffff", fontWeight: 900, lineHeight: 1.22, fontFamily: "'Outfit', sans-serif", marginBottom: 10 }}>
          BTC is not a company. It is a monetary asset attached to a network.
        </div>
        <div style={{ fontSize: 14, color: "var(--text-tertiary)", lineHeight: 1.65, fontFamily: "'Outfit', sans-serif" }}>
          There are no earnings, no CEO, and no product roadmap to underwrite. The thesis is whether a scarce, neutral, internet-native money becomes more valuable as the world gets more digital, indebted, and fragmented.
        </div>
      </div>
    </Reveal>
    <div className="thesis-lenses-grid">
      {POSITIONING_LENSES.map((lens, i) => (
        <Reveal key={lens.label} delay={0.05 + i * 0.08}>
          <div className="card-hover thesis-lens-card" style={{
            background: "linear-gradient(160deg, #131a30 0%, #0f1426 100%)",
            border: "1px solid #232944",
            borderRadius: 14,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minHeight: 178,
          }}>
            <div style={{ fontSize: 10, color: "#f7931a", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1.2, textTransform: "uppercase" }}>
              {lens.label}
            </div>
            <div style={{ fontSize: 16, color: "#ffffff", fontWeight: 800, fontFamily: "'Outfit', sans-serif", lineHeight: 1.25 }}>
              {lens.title}
            </div>
            <div style={{ fontSize: 13, color: "#8f9ab3", lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
              {lens.text}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// ─── STRATEGY TAB ───────────────────────────────────────────────
const StrategyHeader = () => (
  <section className="strategy-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div className="strategy-eyebrow">Strategy</div>
        <div className="strategy-title">Most people lose money buying Bitcoin. Here's the documented inversion.</div>
        <div className="strategy-sub">
          Retail crypto buyers, on average, buy excitement and sell fear — the data below is specific about it. Everything on this page is the same idea from a different angle: decisions made in advance beat decisions made under pressure. Educational only.
        </div>
      </div>
    </Reveal>
    <Reveal delay={0.05}>
      <div className="strategy-disclaimer-ribbon" role="note" aria-label="Disclaimer">
        <svg className="strategy-disclaimer-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div className="strategy-disclaimer-head">Educational content only · Not financial advice</div>
          <div className="strategy-disclaimer-body">
            Nothing on this page is financial, tax, or legal advice. Bitcoin is volatile and can lose substantial value, including drawdowns of 50–80% or more. Consult a licensed advisor before investing.
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

const StrategyPrincipleCard = ({ eyebrow, title, accent, bullets }) => (
  <div className="strategy-principle-card" style={{
    border: `1px solid ${accent}44`,
    background: `linear-gradient(160deg, ${accent}0e 0%, #0f1426 100%)`,
  }}>
    <div className="strategy-principle-eyebrow" style={{ color: accent }}>{eyebrow}</div>
    <div className="strategy-principle-title">{title}</div>
    <ul className="strategy-principle-list">
      {bullets.map((b, i) => (
        <li key={i} className="strategy-principle-item">
          <span className="strategy-principle-bullet" style={{ background: accent }} aria-hidden="true" />
          <span dangerouslySetInnerHTML={{ __html: b }} />
        </li>
      ))}
    </ul>
  </div>
);

const StrategyWorkedExample = () => (
  <section className="strategy-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div className="strategy-eyebrow">{WORKED_EXAMPLE.eyebrow}</div>
        <div className="strategy-section-title">
          {WORKED_EXAMPLE.name} put ${WORKED_EXAMPLE.weekly} a week into the worst two years to start.
        </div>
        <div className="strategy-sub">{WORKED_EXAMPLE.span} — before any generic rule, here is one worked example, start to finish.</div>
      </div>
    </Reveal>
    <div className="strategy-worked-steps">
      {WORKED_EXAMPLE.steps.map((step, i) => (
        <Reveal key={step.date} delay={0.05 + i * 0.06}>
          <div className="strategy-worked-step">
            <div className="strategy-worked-step-date">{step.date}</div>
            <div className="strategy-worked-step-body">
              <div className="strategy-worked-step-event">{step.event}</div>
              <div className="strategy-worked-step-figures">
                <span>Invested: <strong>${step.invested.toLocaleString()}</strong></span>
                <span>Value: <strong>${step.value.toLocaleString()}</strong></span>
              </div>
              <div className="strategy-worked-step-note">{step.note}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={0.3}>
      <div className="strategy-worked-outcome">
        <div className="strategy-worked-outcome-note">{WORKED_EXAMPLE.outcome.note}</div>
        <div className="strategy-worked-outcome-moral">{WORKED_EXAMPLE.moral}</div>
      </div>
    </Reveal>
  </section>
);

const StrategyRetailReality = () => (
  <section className="strategy-section">
    <Reveal>
      <div className="strategy-reality-card">
        <div className="strategy-reality-stat">{RETAIL_REALITY.stat}</div>
        <div className="strategy-reality-label">{RETAIL_REALITY.statLabel}</div>
        <div className="strategy-reality-body">{RETAIL_REALITY.body}</div>
        <div className="strategy-reality-source">{RETAIL_REALITY.source}</div>
      </div>
    </Reveal>
    <div className="strategy-reality-grid">
      {RETAIL_REALITY.inversion.map((inv, i) => (
        <Reveal key={inv.kills} delay={0.1 + i * 0.06}>
          <div className="strategy-reality-inv-card">
            <div className="strategy-reality-inv-kills">Kills: {inv.kills}</div>
            <div className="strategy-reality-inv-tool">{inv.tool}</div>
            <div className="strategy-reality-inv-body">{inv.body}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const StrategyRules = () => (
  <section className="strategy-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div className="strategy-eyebrow">Four rules</div>
        <div className="strategy-section-title">Decide once, on a calm Tuesday.</div>
        <div className="strategy-sub">
          Every one of these is a decision made in advance, not a habit you have to maintain under pressure. Set them now, while nothing is happening — that's what makes them hold during the next crash.
        </div>
      </div>
    </Reveal>
    <div className="strategy-principle-grid">
      {STRATEGY_RULES.map((rule, i) => (
        <Reveal key={rule.num} delay={0.06 + i * 0.06}>
          <StrategyPrincipleCard
            eyebrow={`Rule ${rule.num}`}
            title={rule.title}
            accent={rule.accent}
            bullets={rule.bullets}
          />
        </Reveal>
      ))}
    </div>
  </section>
);

const StrategyDcaBlock = ({ longTermChart, currentPrice }) => {
  const [weekly, setWeekly] = useState(50);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const outcome = computeDcaOutcome(longTermChart, weekly, currentPrice);
  const animatedSats     = useCountUp(Math.round(outcome.btcAccumulated * 1e8), { trigger: inView, duration: 1500 });
  const animatedInvested = useCountUp(outcome.totalInvested, { trigger: inView, duration: 1400 });
  const animatedValue    = useCountUp(outcome.currentValue,  { trigger: inView, duration: 1700 });
  const animatedRoi      = useCountUp(outcome.roi * 100,     { trigger: inView, duration: 1500 });
  const hasData = outcome.series.length > 0;

  const crashStart = Date.parse("2021-11-01");
  const crashEnd = Date.parse("2022-11-01");
  const crashStartPoint = hasData ? outcome.series.find((p) => p.t >= crashStart) : null;
  const crashEndPoint = hasData ? [...outcome.series].reverse().find((p) => p.t <= crashEnd) : null;
  const showCrashShading = !!(crashStartPoint && crashEndPoint && crashStartPoint.date !== crashEndPoint.date);

  return (
    <section ref={sectionRef} className="strategy-section">
      <Reveal>
        <div style={{ marginBottom: 18 }}>
          <div className="strategy-eyebrow">The default you set once (<Term k="dca">DCA</Term>)</div>
          <div className="strategy-section-title">
            What ${weekly}/week would have bought over the last 5 years.
          </div>
          <div className="strategy-sub">
            Decide the amount and the schedule now, while nothing is happening — then let it run. Simulated using actual Bitcoin price history; every point below is a real recurring buy at that period's price.
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="strategy-dca-toggles" role="radiogroup" aria-label="Weekly DCA amount">
          {DCA_WEEKLY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={weekly === opt}
              className={`strategy-dca-toggle${weekly === opt ? " active" : ""}`}
              onClick={() => setWeekly(opt)}
            >
              ${opt}/wk
            </button>
          ))}
        </div>
      </Reveal>

      <div className="strategy-dca-stats">
        <Reveal delay={0.08}>
          <div className="strategy-dca-stat strategy-dca-stat-grow">
            <div className="strategy-dca-stat-label"><Term k="sats">Sats</Term> accumulated</div>
            <div className="strategy-dca-stat-value">
              {hasData ? fmt(animatedSats, 0) : <Skeleton width={140} height={28} />}
            </div>
            <div className="strategy-dca-stat-sub">100,000,000 sats = 1 BTC</div>
          </div>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="strategy-dca-stat">
            <div className="strategy-dca-stat-label">Total invested</div>
            <div className="strategy-dca-stat-value">
              {hasData ? "$" + fmt(animatedInvested, 0) : <Skeleton width={120} height={28} />}
            </div>
            <div className="strategy-dca-stat-sub">5 years of weekly buys</div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="strategy-dca-stat">
            <div className="strategy-dca-stat-label">Value today</div>
            <div className="strategy-dca-stat-value">
              {hasData ? "$" + fmt(animatedValue, 0) : <Skeleton width={140} height={28} />}
            </div>
            <div className="strategy-dca-stat-sub">At current spot price</div>
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="strategy-dca-stat">
            <div className="strategy-dca-stat-label">Return</div>
            <div className="strategy-dca-stat-value" style={{ color: outcome.roi >= 0 ? "#22c55e" : "#ef4444" }}>
              {hasData ? `${animatedRoi >= 0 ? "+" : ""}${animatedRoi.toFixed(0)}%` : <Skeleton width={80} height={28} />}
            </div>
            <div className="strategy-dca-stat-sub">Vs. cost basis</div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.28}>
        <div className="strategy-dca-chart-card">
          <div className="strategy-dca-chart-legend">
            <span className="strategy-dca-legend-item">
              <span className="strategy-dca-legend-swatch" style={{ background: "var(--text-dim)" }} />
              Cost basis (total invested)
            </span>
            <span className="strategy-dca-legend-item">
              <span className="strategy-dca-legend-swatch" style={{ background: "#f7931a" }} />
              Portfolio value
            </span>
          </div>
          <div className="strategy-dca-chart">
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
              <AreaChart data={outcome.series} margin={{ top: 14, right: isMobile ? 8 : 20, left: isMobile ? -8 : 0, bottom: 6 }}>
                <defs>
                  <linearGradient id="strategyDcaValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f7931a" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#f7931a" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="strategyDcaCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="var(--text-dim)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--text-dim)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 10, fontFamily: "'JetBrains Mono', monospace" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={isMobile ? 36 : 42}
                />
                <YAxis
                  tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 10, fontFamily: "'JetBrains Mono', monospace" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)}
                  width={isMobile ? 44 : 52}
                />
                <Tooltip
                  contentStyle={{ background: "#11142a", border: "1px solid #f7931a44", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "8px 12px", maxWidth: "calc(100vw - 32px)" }}
                  labelStyle={{ color: "#ffffff", fontWeight: 700, marginBottom: 4 }}
                  formatter={(value, name) => ["$" + Number(value).toLocaleString(), name]}
                />
                {showCrashShading && (
                  <ReferenceArea
                    x1={crashStartPoint.date}
                    x2={crashEndPoint.date}
                    fill="#ef4444"
                    fillOpacity={0.07}
                    stroke="#ef444433"
                    strokeDasharray="3 3"
                    label={{ value: "2021–22 crash", position: "insideTop", fill: "#ef4444", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="invested"
                  name="Cost basis"
                  stroke="var(--text-dim)"
                  strokeWidth={2}
                  fill="url(#strategyDcaCost)"
                  isAnimationActive={shouldAnimate()}
                  animationDuration={1200}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Portfolio value"
                  stroke="#f7931a"
                  strokeWidth={2.5}
                  fill="url(#strategyDcaValue)"
                  isAnimationActive={shouldAnimate()}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="strategy-dca-caption">
            Past performance is not indicative of future returns. Bitcoin's prior cycles do not guarantee similar future cycles. Simulation assumes recurring buys at each plotted price; real-world buys would include fees, taxes, and spread.
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const StrategyVolatility = ({ longTermChart }) => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const live = computeMaxDrawdown(longTermChart);
  const liveDdPct = Math.round(live.drawdownPct);
  const fourYearCount = useCountUp(0, { trigger: inView, duration: 1400 });
  const animatedLive = useCountUp(liveDdPct, { trigger: inView, duration: 1500 });

  const maxBarPct = Math.max(...HISTORICAL_DRAWDOWNS.map((d) => d.drawdownPct), liveDdPct, 1);

  return (
    <section ref={sectionRef} className="strategy-section">
      <Reveal>
        <div style={{ marginBottom: 18 }}>
          <div className="strategy-eyebrow" style={{ color: "#ef4444" }}>The downside is real</div>
          <div className="strategy-section-title">Every prior cycle included a 50–80% drawdown.</div>
          <div className="strategy-sub">
            The historical record is unambiguous: Bitcoin's path up has always included multi-quarter drawdowns deep enough to break most positions. Sizing the position assuming this will happen again is the standard defensive posture.
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="strategy-drawdown-card">
          <div className="strategy-drawdown-head">
            <div className="strategy-drawdown-eyebrow">Largest peak-to-trough drawdowns by cycle</div>
          </div>
          <div className="strategy-drawdown-bars">
            {HISTORICAL_DRAWDOWNS.map((d) => (
              <div key={d.year} className="strategy-drawdown-row">
                <div className="strategy-drawdown-year">{d.year}</div>
                <div className="strategy-drawdown-track">
                  <div
                    className="strategy-drawdown-fill"
                    style={{ width: `${(d.drawdownPct / maxBarPct) * 100}%` }}
                  />
                  <div className="strategy-drawdown-pct">−{d.drawdownPct}%</div>
                </div>
                <div className="strategy-drawdown-label">{d.label} · {d.duration}</div>
                {d.recovery && (
                  <div className="strategy-drawdown-recovery">
                    <span className="strategy-drawdown-recovery-tag">Recovered</span> {d.journey} — took {d.recovery}
                  </div>
                )}
              </div>
            ))}
            {liveDdPct > 0 && (
              <div className="strategy-drawdown-row strategy-drawdown-row-live">
                <div className="strategy-drawdown-year">5y window</div>
                <div className="strategy-drawdown-track">
                  <div
                    className="strategy-drawdown-fill live"
                    style={{ width: `${(liveDdPct / maxBarPct) * 100}%` }}
                  />
                  <div className="strategy-drawdown-pct">−{animatedLive.toFixed(0)}%</div>
                </div>
                <div className="strategy-drawdown-label">
                  Live: peak {live.peakDate} → trough {live.troughDate}
                </div>
              </div>
            )}
          </div>
          <div className="strategy-drawdown-caveat">{DRAWDOWN_CAVEAT}</div>
        </div>
      </Reveal>

      <Reveal delay={0.18}>
        <div className="strategy-fouryear-card">
          <div className="strategy-fouryear-num">{fourYearCount.toFixed(0)}</div>
          <div className="strategy-fouryear-body">
            <div className="strategy-fouryear-label">Unprofitable 4-year holding periods in Bitcoin's history.</div>
            <div className="strategy-fouryear-sub">
              As of {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}, every rolling 4-year holding period since 2013 has ended profitably. Past performance does not guarantee future results, and prior cycles do not guarantee future cycles.
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const CHECK_CADENCE_OPTIONS = [
  { key: "daily", label: "Daily", days: 1 },
  { key: "monthly", label: "Monthly", days: 30 },
  { key: "yearly", label: "Yearly", days: 365 },
];

const computeCheckCadence = (longTermChart, days) => {
  if (!Array.isArray(longTermChart) || longTermChart.length === 0) return { series: [], redPct: 0 };
  const fiveYearsAgo = Date.now() - 5 * 365.25 * 24 * 60 * 60 * 1000;
  const data = longTermChart.filter((p) => p.t >= fiveYearsAgo && typeof p.price === "number" && p.price > 0);
  if (data.length === 0) return { series: [], redPct: 0 };
  const intervalMs = days * 24 * 60 * 60 * 1000;
  const sampled = [];
  let nextT = data[0].t;
  for (const p of data) {
    if (p.t >= nextT) {
      sampled.push(p);
      nextT = p.t + intervalMs;
    }
  }
  if (sampled[sampled.length - 1] !== data[data.length - 1]) sampled.push(data[data.length - 1]);
  let redCount = 0;
  for (let i = 1; i < sampled.length; i++) {
    if (sampled[i].price < sampled[i - 1].price) redCount++;
  }
  const redPct = sampled.length > 1 ? (redCount / (sampled.length - 1)) * 100 : 0;
  return { series: sampled.map((p) => ({ date: p.date, t: p.t, price: p.price })), redPct };
};

const StrategyCheckCadence = ({ longTermChart }) => {
  const [cadence, setCadence] = useState("daily");
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const opt = CHECK_CADENCE_OPTIONS.find((o) => o.key === cadence);
  const { series, redPct } = useMemo(() => computeCheckCadence(longTermChart, opt.days), [longTermChart, opt.days]);
  const animatedRedPct = useCountUp(redPct, { trigger: inView, duration: 1200 });
  const hasData = series.length > 1;

  return (
    <section ref={sectionRef} className="strategy-section">
      <Reveal>
        <div style={{ marginBottom: 18 }}>
          <div className="strategy-eyebrow">How often you look determines what you feel</div>
          <div className="strategy-section-title">Same 5 years of price. Three ways to experience it.</div>
          <div className="strategy-sub">
            Checking often shows you every red day. Checking rarely shows you a line that mostly goes up. It's the same data either way — only the feeling changes.
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="strategy-dca-toggles" role="radiogroup" aria-label="Checking cadence">
          {CHECK_CADENCE_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={cadence === o.key}
              className={`strategy-dca-toggle${cadence === o.key ? " active" : ""}`}
              onClick={() => setCadence(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="strategy-cadence-stat">
          <span className="strategy-cadence-stat-value">{hasData ? animatedRedPct.toFixed(0) : "0"}%</span>
          <span className="strategy-cadence-stat-label">of {opt.label.toLowerCase()} checks would have shown a price drop from the last one</span>
        </div>
      </Reveal>
      <Reveal delay={0.16}>
        <div className="strategy-cadence-chart">
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <AreaChart data={series} margin={{ top: 10, right: isMobile ? 8 : 20, left: isMobile ? -8 : 0, bottom: 6 }}>
              <defs>
                <linearGradient id="strategyCadencePrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f7931a" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f7931a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 10, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={isMobile ? 36 : 42}
              />
              <YAxis
                tick={{ fill: "var(--text-dim)", fontSize: isMobile ? 11 : 10, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)}
                width={isMobile ? 44 : 52}
              />
              <Tooltip
                contentStyle={{ background: "#11142a", border: "1px solid #f7931a44", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "8px 12px", maxWidth: "calc(100vw - 32px)" }}
                labelStyle={{ color: "#ffffff", fontWeight: 700, marginBottom: 4 }}
                formatter={(value) => ["$" + Number(value).toLocaleString(), "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#f7931a"
                strokeWidth={2}
                fill="url(#strategyCadencePrice)"
                isAnimationActive={shouldAnimate()}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Reveal>
    </section>
  );
};

const StrategyCustodyLadder = () => (
  <section className="strategy-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div className="strategy-eyebrow">Custody</div>
        <div className="strategy-section-title">A ladder, not a leap.</div>
        <div className="strategy-sub">
          You don't need to self-custody on day one. Climb the ladder as the balance grows past what you'd be comfortable losing to someone else's mistake.
        </div>
      </div>
    </Reveal>
    <div className="strategy-custody-ladder">
      {CUSTODY_LADDER.map((rung, i) => (
        <Reveal key={rung.rung} delay={0.06 + i * 0.08}>
          <div className="strategy-custody-rung">
            <div className="strategy-custody-rung-num">{rung.rung}</div>
            <div className="strategy-custody-rung-body">
              <div className="strategy-custody-rung-label">
                {rung.rung === "03" ? <>Hardware wallet (<Term k="coldstorage">cold storage</Term>)</> : rung.label}
              </div>
              <div className="strategy-custody-rung-keys">Who holds the keys: <strong>{rung.holdsKeys}</strong></div>
              <div className="strategy-custody-rung-good">{rung.good}</div>
              <div className="strategy-custody-rung-tradeoff">{rung.tradeoff}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={0.3}>
      <p className="strategy-custody-closing">
        The inconvenience of <Term k="selfcustody">self-custody</Term> is the point — it's what makes the money yours instead of a claim on someone else's balance sheet. Losing a <Term k="seedphrase">seed phrase</Term> is different from losing a password: there's no reset button, and no one to call.
      </p>
    </Reveal>
  </section>
);

const StrategyAllocationBands = () => (
  <section className="strategy-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div className="strategy-eyebrow">For when you start thinking in portfolios</div>
        <div className="strategy-section-title">How much is the right amount? Depends who you ask.</div>
        <div className="strategy-sub">
          Once the four rules and the schedule are in place, this is the next question — not the first one. A snapshot of widely cited Bitcoin allocations across investor profiles, from conservative institutional sleeves to full-conviction maximalist positions.
        </div>
      </div>
    </Reveal>

    <Reveal delay={0.06}>
      <div className="strategy-investable-callout">
        <div className="strategy-investable-eyebrow">Read this first</div>
        <div className="strategy-investable-body">
          Allocation percentages refer to <strong>investable assets</strong> — money designated for long-term investing — not total savings or net worth. A 10% Bitcoin allocation means 10% of an investing portfolio, not 10% of an emergency fund, retirement accounts, home equity, or living expenses. Conflating these leads to forced selling at the worst time.
        </div>
      </div>
    </Reveal>

    <div className="strategy-band-stack">
      {ALLOCATION_BANDS.map((b, i) => (
        <Reveal key={b.band} delay={0.08 + i * 0.05}>
          <div className="strategy-band-row card-hover" style={{ borderLeftColor: b.stripe }}>
            <div className="strategy-band-stripe" style={{ background: b.stripe }} aria-hidden="true" />
            <div className="strategy-band-num" style={{ color: b.stripe }}>{b.band}</div>
            <div className="strategy-band-body">
              <div className="strategy-band-persona">{b.persona}</div>
              <div className="strategy-band-rationale">{b.rationale}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    <Reveal delay={0.5}>
      <div className="strategy-band-footnote">
        Where any individual sits depends on time horizon, income stability, total net worth, and personal risk tolerance.
      </div>
    </Reveal>
  </section>
);

const StrategyMistakes = () => (
  <section className="strategy-section">
    <Reveal>
      <div style={{ marginBottom: 18 }}>
        <div className="strategy-eyebrow" style={{ color: "#ef4444" }}>Common mistakes</div>
        <div className="strategy-section-title">What destroys positions, in order of frequency.</div>
        <div className="strategy-sub">
          Most lost wealth in Bitcoin has come from a handful of repeated patterns. Avoiding them is more important than picking entries.
        </div>
      </div>
    </Reveal>
    <div className="strategy-mistakes-grid">
      {COMMON_MISTAKES.map((m, i) => (
        <Reveal key={m.title} delay={0.05 + i * 0.06}>
          <div className="strategy-mistake-card card-hover">
            <div className="strategy-mistake-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="strategy-mistake-title">{m.title}</div>
            <div className="strategy-mistake-body">{m.body}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const StrategySources = () => (
  <section className="strategy-section">
    <Reveal>
      <div className="strategy-sources-card">
        <div className="strategy-sources-head">Sources cited on this page</div>
        <ul className="strategy-sources-list">
          {STRATEGY_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="strategy-final-disclaimer">
          Educational content only. Nothing on this page is financial, tax, or legal advice. Allocation ranges shown reflect commonly cited industry observations, not recommendations. Bitcoin is volatile and can lose substantial value, including in extended drawdowns of 50–80% or more. Historical performance does not guarantee future results. Consult a licensed financial advisor and consider your own circumstances before investing.
        </div>
      </div>
    </Reveal>
  </section>
);

const StrategyTab = ({ btc, setActiveTab }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <StrategyHeader />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyWorkedExample />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyRetailReality />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyRules />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyDcaBlock longTermChart={btc.longTermChart} currentPrice={btc.price} />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyCheckCadence longTermChart={btc.longTermChart} />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyVolatility longTermChart={btc.longTermChart} />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyMistakes />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyCustodyLadder />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategyAllocationBands />
      <Reveal scale><div className="section-divider" /></Reveal>
      <StrategySources />
    </div>
  );
};

const THESIS_PHASES = [
  { num: "01", label: "Basics",       anchor: "thesis-phase-basics",       accent: "#ef4444" },
  { num: "02", label: "Intermediate", anchor: "thesis-phase-intermediate", accent: "#f7931a" },
  { num: "03", label: "Advanced",     anchor: "thesis-phase-advanced",     accent: "#22c55e" },
];

const BitcoinThesisTab = ({ setActiveTab }) => {
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phaseRefs = useMemo(() => [phase1Ref, phase2Ref, phase3Ref], []);
  const activePhase = useActiveSection(phaseRefs, { triggerRatio: 0.3 });
  const activeAccent = THESIS_PHASES[activePhase].accent;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <ThesisHero />

      <a
        href={`#${THESIS_PHASES[activePhase].anchor}`}
        className="thesis-mobile-chip thesis-phase-chip"
        aria-label={`Currently reading: phase ${THESIS_PHASES[activePhase].num}, ${THESIS_PHASES[activePhase].label}`}
        style={{ borderColor: `${activeAccent}55` }}
      >
        <span className="thesis-mobile-chip-step" style={{ color: activeAccent }}>
          {THESIS_PHASES[activePhase].num}
        </span>
        <span className="thesis-mobile-chip-label">
          {THESIS_PHASES[activePhase].label}
        </span>
        <span className="thesis-mobile-chip-dots">
          {THESIS_PHASES.map((p, i) => (
            <span
              key={p.num}
              className={`thesis-chip-dot${i === activePhase ? " active" : ""}`}
              style={i === activePhase ? { background: p.accent } : undefined}
            />
          ))}
        </span>
      </a>

      <Reveal>
        <div className="thesis-fork">
          <a href={`#${THESIS_PHASES[0].anchor}`} className="thesis-fork-link">New to money? Start at Phase 1.</a>
          <a href={`#${THESIS_PHASES[2].anchor}`} className="thesis-fork-link muted">Been here before? Skip to Phase 3.</a>
        </div>
      </Reveal>

      {/* ──────── PHASE 1 — BASICS ──────── */}
      <PhaseHeader
        phaseRef={phase1Ref}
        idAnchor={THESIS_PHASES[0].anchor}
        phase="01"
        label="Basics"
        title="Why this matters."
        sub="Start with the pain. Money printing is a tax most people pay without ever seeing the bill — and Bitcoin is the first money in history immune to it."
        accent="#ef4444"
      />

      <ThesisWhatIsMoney />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisSilentTaxPinned />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisSilentTaxPersonal />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisProblem />

      {/* ──────── PHASE 2 — INTERMEDIATE ──────── */}
      <PhaseHeader
        phaseRef={phase2Ref}
        idAnchor={THESIS_PHASES[1].anchor}
        phase="02"
        label="Intermediate"
        title="How money has actually worked."
        sub="The pattern across 5,000 years: harder money replaces softer money — every single time. Here is the measurement system, and where Bitcoin sits in it."
        accent="#f7931a"
      />

      <ThesisHistory />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisDigitalScarcity />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisHardness />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisProperties />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisMyths />

      {/* ──────── PHASE 3 — ADVANCED ──────── */}
      <PhaseHeader
        phaseRef={phase3Ref}
        idAnchor={THESIS_PHASES[2].anchor}
        phase="03"
        label="Advanced"
        title="What this means for you."
        sub="The strategic layer: how the four foundational properties build on each other, what hard money does to human behavior, and the three lenses any serious holder should use to position."
        accent="#22c55e"
      />

      <Reveal>
        <div className="thesis-scrolly-intro">
          <div className="thesis-scrolly-eyebrow">The four-move case</div>
          <div className="thesis-scrolly-sub">Scarcity → ownership → network → time horizon. Each move builds on the last.</div>
        </div>
      </Reveal>

      <ThesisScrolly />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisTimePreference setActiveTab={setActiveTab} />

      <Reveal scale><div className="section-divider" /></Reveal>

      <ThesisLenses />

      <Reveal>
        <div className="thesis-footnote" style={{
          fontSize: 11, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.65,
          paddingTop: 14, borderTop: "1px solid #1a1a2e",
        }}>
          Educational framework grounded in <em>The Bitcoin Standard</em> by Saifedean Ammous. Not financial advice. Bitcoin is volatile and can lose significant value. Position size, custody method, and time horizon matter as much as the thesis itself.
        </div>
      </Reveal>
    </div>
  );
};

const TAB_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M18 10h-8"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>,
];

const BottomNav = ({ activeTab, setActiveTab }) => (
  <nav className="bottom-nav" aria-label="Tab navigation">
    {TABS.map((tab, i) => (
      <button
        key={tab}
        className={`bottom-nav-item${activeTab === i ? " active" : ""}`}
        onClick={() => {
          setActiveTab(i);
          if (navigator.vibrate) navigator.vibrate(10);
          window.scrollTo({ top: 0, behavior: "auto" });
        }}
        aria-label={tab}
      >
        <span className="bottom-nav-icon">{TAB_ICONS[i]}</span>
        <span className="bottom-nav-label">{tab}</span>
      </button>
    ))}
  </nav>
);

const OfflineBanner = ({ online, lastUpdate }) => {
  if (online) return null;
  const ageMin = lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / 60000) : null;
  return (
    <div className="offline-banner" style={{
      background: "var(--status-warn-soft)", border: "1px solid var(--status-warn)",
      borderRadius: "var(--radius-md)", padding: "10px 16px", margin: "0 0 12px",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", color: "var(--status-warn)",
      fontWeight: 600, letterSpacing: 0.5,
    }}>
      <span style={{ fontSize: 16 }}>⚡</span>
      Offline{ageMin != null ? ` — showing data from ${ageMin}m ago` : ""}
    </div>
  );
};

export default function BitcoinDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const btc = useBitcoinData();
  const news = useBitcoinNews();
  const scrolled = useScrolled(24);
  const showBackToTop = useScrolled(400);
  const isMobileNav = useIsMobile(760);
  const online = useOnlineStatus();
  const { pullDistance, refreshing } = usePullToRefresh(btc.refresh, isMobileNav);
  useSwipeNavigation(activeTab, setActiveTab, TABS.length, isMobileNav);
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([0]));

  useEffect(() => {
    setVisitedTabs(prev => { if (prev.has(activeTab)) return prev; const next = new Set(prev); next.add(activeTab); return next; });
  }, [activeTab]);

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    // Clear any pre-existing persisted choice from older builds so a returning
    // user who had "light" or "auto" stored doesn't see it resurrect anywhere.
    try { localStorage.removeItem("btc-dashboard.theme"); } catch (e) {}
    try { sessionStorage.removeItem("btc-dashboard.theme"); } catch (e) {}
  }, [theme]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-shell" style={{
      background: "var(--bg-base)",
      color: "var(--text-secondary)",
      fontFamily: "var(--font-sans)",
      transition: "background 0.3s ease, color 0.3s ease",
    }}>
      <style>{`
        :root {
          /* surfaces */
          --bg-base: #0d0d1a;
          --bg-card: #1a1a2e;
          --bg-card-elevated: #16213e;
          --bg-card-soft: #131a30;
          --bg-overlay: rgba(13, 13, 26, 0.92);

          /* borders */
          --border-subtle: #2a2a4a;
          --border-strong: #3a3a5a;
          --border-accent: #f7931a55;

          /* text */
          --text-primary: #ffffff;
          --text-secondary: #e6e6e6;
          --text-tertiary: #aab4cb;
          --text-muted: #8892b0;
          --text-dim: #6a7490;

          /* brand — reserved for LIVE / primary data (price, status pill, active tab, primary CTA) */
          --accent-bitcoin: #f7931a;
          --accent-bitcoin-bright: #ffb347;
          --accent-bitcoin-soft: rgba(247, 147, 26, 0.12);
          --accent-bitcoin-glow: rgba(247, 147, 26, 0.18);
          --accent-bitcoin-faint: rgba(247, 147, 26, 0.08);

          /* analytical accent — for historical / retrospective / editorial sections */
          --accent-analytical: #6b8cc4;
          --accent-analytical-bright: #8fa9d4;
          --accent-analytical-soft: rgba(107, 140, 196, 0.14);
          --accent-analytical-glow: rgba(107, 140, 196, 0.20);
          --accent-analytical-faint: rgba(107, 140, 196, 0.06);

          /* status */
          --status-up: #22c55e;
          --status-up-soft: rgba(34, 197, 94, 0.15);
          --status-down: #ef4444;
          --status-down-soft: rgba(239, 68, 68, 0.15);
          --status-warn: #f59e0b;
          --status-warn-soft: rgba(245, 158, 11, 0.15);
          --status-info: #0ea5e9;
          --status-info-soft: rgba(14, 165, 233, 0.15);

          /* tracking scales for editorial typography */
          --tracking-tight: -0.01em;
          --tracking-caps-tight: 0.08em;
          --tracking-caps: 0.12em;
          --tracking-caps-wide: 0.18em;

          /* fluid typography (clamp scales) */
          --fs-xs: clamp(11px, 0.5vw + 9.5px, 12px);
          --fs-sm: clamp(12px, 0.6vw + 10.5px, 13px);
          --fs-md: clamp(14px, 0.7vw + 12px, 15px);
          --fs-lg: clamp(16px, 0.9vw + 13px, 19px);
          --fs-xl: clamp(19px, 1.1vw + 15px, 22px);
          --fs-2xl: clamp(24px, 1.7vw + 17px, 30px);
          --fs-hero: clamp(36px, 4.5vw + 14px, 52px);

          /* fonts */
          --font-sans: 'Outfit', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          /* spacing */
          --space-1: 4px;
          --space-2: 8px;
          --space-3: 12px;
          --space-4: 16px;
          --space-5: 20px;
          --space-6: 24px;
          --space-8: 32px;

          /* radius */
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 16px;
          --radius-xl: 20px;

          /* motion */
          --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
          --dur-fast: 0.2s;
          --dur-base: 0.3s;
          --dur-slow: 0.6s;
        }

        /* Light theme overrides — only applied via the explicit data-theme="light"
           toggle. OS prefers-color-scheme is intentionally ignored: dark stays the
           canonical default on every page load.

           This is a TRUE light theme: a soft cool-grey page with white cards that
           lift above it on a quiet shadow, and graded dark-slate text. (It used to
           be a navy page with light cards floating on it, which read as "dark mode
           with white patches"; the navy is gone.) The chrome/label rules further
           down repoint the few elements that used to need light text on the navy
           page back to the dark text tokens. */
        :root[data-theme="light"] {
          /* surfaces — page sits a touch below pure white so white cards read as raised */
          --bg-base: #e9edf4;
          --bg-card: #ffffff;
          --bg-card-elevated: #f2f5fc;
          --bg-card-soft: #eef1f8;
          --bg-overlay: rgba(248, 250, 253, 0.82);
          /* borders — gentle hairlines that define cards without hard edges */
          --border-subtle: #e3e7ef;
          --border-strong: #ccd3e0;
          --border-accent: rgba(247, 147, 26, 0.42);
          /* text — dark-slate hierarchy graded for white surfaces */
          --text-primary: #161b26;
          --text-secondary: #333b4d;
          --text-tertiary: #4f5870;
          --text-muted: #687286;
          --text-dim: #8b94a7;
          /* brand */
          --accent-bitcoin-soft: rgba(247, 147, 26, 0.13);
          --accent-bitcoin-glow: rgba(247, 147, 26, 0.20);
          --accent-bitcoin-faint: rgba(247, 147, 26, 0.07);
          --accent-analytical: #35567f;
          --accent-analytical-bright: #4f72a0;
          --accent-analytical-soft: rgba(53, 86, 127, 0.12);
          --accent-analytical-glow: rgba(53, 86, 127, 0.18);
          --accent-analytical-faint: rgba(53, 86, 127, 0.05);
          /* status — deepened so green/red/amber clear AA on white */
          --status-up: #15a34a;
          --status-up-soft: rgba(21, 163, 74, 0.13);
          --status-down: #dc2626;
          --status-down-soft: rgba(220, 38, 38, 0.11);
          --status-warn: #b45309;
          --status-warn-soft: rgba(180, 83, 9, 0.12);
          --status-info: #0277bd;
          --status-info-soft: rgba(2, 119, 189, 0.12);
        }

        :root[data-theme="light"] .app-shell {
          background: linear-gradient(180deg, #eef1f7 0%, #e7ebf3 100%) !important;
        }
        /* Page chrome — the header bar and section labels sit directly on the
           light page, so they take the dark text tokens just like the cards do.
           (These rules previously forced light text for the old navy page.) */
        :root[data-theme="light"] .header-title {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .group-title {
          color: var(--text-secondary) !important;
        }
        :root[data-theme="light"] .header-tabs [role="tab"][aria-selected="false"] {
          color: var(--text-muted) !important;
        }
        :root[data-theme="light"] .header-tabs [role="tab"][aria-selected="false"]:hover {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .market-pulse-card {
          background: linear-gradient(160deg, var(--bg-card) 0%, var(--bg-card-soft) 100%) !important;
        }
        /* Naked stat strips sit directly on the light page (no card) — dark text
           tokens read fine now; just give the divider a subtle dark hairline. */
        :root[data-theme="light"] .tier3-strip {
          border-top-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .tier3-strip .tier3-label {
          color: var(--text-muted) !important;
        }
        :root[data-theme="light"] .tier3-strip .tier3-value {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .tier3-strip .tier3-sub {
          color: var(--text-dim) !important;
        }
        /* Collapsed "Market Updates" list is also naked on the light page. */
        :root[data-theme="light"] .market-updates-section span {
          color: var(--text-secondary) !important;
        }
        :root[data-theme="light"] .market-updates-section span[style*="accent-bitcoin"] {
          color: var(--accent-bitcoin) !important;
        }
        /* Holdings tables (Adoption) are naked on the page — give them the white
           card surface so they read as a contained table. */
        :root[data-theme="light"] .holdings-table-wrap {
          background: var(--bg-card) !important;
        }
        /* Page-level structural labels that sit on the light page → dark text. */
        :root[data-theme="light"] .page-title {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .section-heading-title {
          color: var(--text-secondary) !important;
        }
        :root[data-theme="light"] .section-heading-sub {
          color: var(--text-dim) !important;
        }
        :root[data-theme="light"] .strategy-title,
        :root[data-theme="light"] .strategy-section-title {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .strategy-sub {
          color: var(--text-tertiary) !important;
        }
        /* Thesis editorial intros sit on the light page (outside cards): their
           inline-white headings and token body text all take dark slate now.
           Text INSIDE thesis cards is handled by the rule that follows. */
        :root[data-theme="light"] :is(.thesis-problem-section,.thesis-history-section,.thesis-hardness-section,.thesis-matrix-section,.thesis-tp-section,.thesis-lenses-section) :is([style*="rgb(255, 255, 255)"],[style*="text-tertiary"],[style*="text-secondary"]) {
          color: var(--text-secondary) !important;
        }
        :root[data-theme="light"] :is(.thesis-problem-card,.thesis-history-card,.thesis-hardness-chart,.thesis-matrix-table,.thesis-tp-col,.thesis-trait-card,.thesis-lens-card,.thesis-metric-card,.thesis-basic-card) :is([style*="rgb(255, 255, 255)"],[style*="text-tertiary"],[style*="text-secondary"],[style*="text-primary"]) {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .thesis-footnote,
        :root[data-theme="light"] .thesis-footnote em {
          color: var(--text-muted) !important;
        }
        /* Strategy band footnote sits on the light page. */
        :root[data-theme="light"] .strategy-band-footnote {
          color: var(--text-muted) !important;
        }
        /* Analysis-tab header block (label, plain lead, secondary headline) is
           naked on the light page — dark text (the accent badge is a span, so it
           keeps its colour). */
        :root[data-theme="light"] .analysis-header div {
          color: var(--text-secondary) !important;
        }
        /* Thesis phase-header title hardcodes class-based white (the inline
           white-flip can't reach it) — dark on its light card. */
        :root[data-theme="light"] .thesis-phase-title {
          color: var(--text-primary) !important;
        }
        /* Pre-existing: dark-mode muted slate (#aab4cb / #b4bed4) on light
           editorial cards reads too faint — darken the two most prominent
           (phase subtitle + hero intro paragraph) to a readable muted tone. */
        :root[data-theme="light"] .thesis-phase-sub {
          color: var(--text-muted) !important;
        }
        :root[data-theme="light"] .thesis-hero-card [style*="rgb(180, 190, 212)"] {
          color: var(--text-tertiary) !important;
        }

        /* Light-mode overrides for cards/gradients that hardcode dark values.
           Most JSX uses inline-style gradients with literal dark hex values that
           don't theme. These rules patch the worst offenders so light mode looks
           intentional instead of dark mode with text inverted. Uses !important
           because inline styles otherwise win. Dark mode is unchanged.
           Light mode only activates via the explicit data-theme="light" toggle —
           OS prefers-color-scheme is intentionally not honored. */
        :root[data-theme="light"] .thesis-hero-card {
          background: linear-gradient(135deg, #ffffff 0%, #f4f6fb 58%, #fff2dd 100%) !important;
          border-color: rgba(247, 147, 26, 0.30) !important;
        }
        :root[data-theme="light"] .thesis-scene,
        :root[data-theme="light"] .thesis-problem-card,
        :root[data-theme="light"] .strategy-principle-card,
        :root[data-theme="light"] .thesis-trait-card,
        :root[data-theme="light"] .thesis-lens-card,
        :root[data-theme="light"] .thesis-metric-card,
        :root[data-theme="light"] .thesis-basic-card,
        :root[data-theme="light"] .thesis-history-card,
        :root[data-theme="light"] .thesis-pinned-fallback-chapter,
        :root[data-theme="light"] .strategy-mistake-card,
        :root[data-theme="light"] .strategy-volatility-card,
        :root[data-theme="light"] .strategy-allocation-card,
        :root[data-theme="light"] .strategy-sources-card,
        :root[data-theme="light"] .strategy-dca-card,
        :root[data-theme="light"] .strategy-dca-stat-card,
        :root[data-theme="light"] .curated-card,
        :root[data-theme="light"] .tier2-card,
        :root[data-theme="light"] .holdings-card,
        :root[data-theme="light"] .lede-card,
        :root[data-theme="light"] .strategy-worked-step,
        :root[data-theme="light"] .strategy-reality-inv-card,
        :root[data-theme="light"] .strategy-cadence-chart,
        :root[data-theme="light"] .strategy-custody-rung,
        :root[data-theme="light"] .thesis-money-panel,
        :root[data-theme="light"] .thesis-birthyear,
        :root[data-theme="light"] .thesis-intl-card,
        :root[data-theme="light"] .thesis-digital-step,
        :root[data-theme="light"] .thesis-myth-card,
        :root[data-theme="light"] .thesis-rail,
        :root[data-theme="light"] .thesis-mobile-chip,
        :root[data-theme="light"] .thesis-phase-header {
          background: linear-gradient(160deg, var(--bg-card) 0%, var(--bg-card-soft) 100%) !important;
          color: var(--text-secondary) !important;
        }
        /* White text from inline styles is invisible on light cards: re-color to primary. */
        :root[data-theme="light"] [style*="color: rgb(255, 255, 255)"],
        :root[data-theme="light"] [style*="color:#ffffff"],
        :root[data-theme="light"] [style*="color: #ffffff"],
        :root[data-theme="light"] [style*="color:#fff)"],
        :root[data-theme="light"] [style*="color: #fff)"] {
          color: var(--text-primary) !important;
        }
        /* Headlines filter chips: inactive state hardcodes a dark bg. */
        :root[data-theme="light"] .headlines-filter-row button[style*="background: rgb(26, 26, 46)"],
        :root[data-theme="light"] .headlines-filter-row button[style*="background:#1a1a2e"] {
          background: var(--bg-card) !important;
          color: var(--text-muted) !important;
          border: 1px solid var(--border-subtle) !important;
        }
        /* Price display orange glow: too saturated against light bg. */
        :root[data-theme="light"] .price-display > [aria-hidden="true"] {
          opacity: 0.45 !important;
        }

        /* ── Strategy: accent-tinted cards — swap hardcoded dark base-stop for token,
              preserve colour identity (green/orange tint stays). ── */
        :root[data-theme="light"] .strategy-dca-stat-grow {
          background: linear-gradient(160deg, rgba(247, 147, 26, 0.07) 0%, var(--bg-card) 100%) !important;
        }
        :root[data-theme="light"] .strategy-fouryear-card {
          background: linear-gradient(160deg, rgba(34, 197, 94, 0.07) 0%, var(--bg-card) 100%) !important;
          border-color: rgba(34, 197, 94, 0.30) !important;
        }
        :root[data-theme="light"] .strategy-worked-outcome {
          background: linear-gradient(160deg, rgba(34, 197, 94, 0.07) 0%, var(--bg-card) 100%) !important;
          border-color: rgba(34, 197, 94, 0.30) !important;
        }
        :root[data-theme="light"] .strategy-reality-card {
          background: linear-gradient(160deg, rgba(239, 68, 68, 0.06) 0%, var(--bg-card) 100%) !important;
          border-color: rgba(239, 68, 68, 0.30) !important;
        }
        :root[data-theme="light"] .strategy-investable-callout {
          background: linear-gradient(160deg, rgba(247, 147, 26, 0.07) 0%, var(--bg-card) 100%) !important;
        }
        /* Strategy: drawdown bar track */
        :root[data-theme="light"] .strategy-drawdown-track {
          background: var(--bg-card-soft) !important;
        }

        /* ── Thesis: hardness (stock-to-flow) chart ── */
        :root[data-theme="light"] .thesis-hardness-chart {
          background: linear-gradient(160deg, var(--bg-card) 0%, var(--bg-card-soft) 100%) !important;
          border-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .thesis-hardness-label {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .thesis-hardness-bar-wrap {
          background: var(--bg-card-elevated) !important;
        }
        :root[data-theme="light"] .thesis-hardness-footnote {
          background: var(--bg-card-soft) !important;
          color: var(--text-muted) !important;
          border-left-color: var(--border-accent) !important;
        }

        /* ── Thesis: comparison matrix ── */
        :root[data-theme="light"] .thesis-matrix-table {
          background: linear-gradient(160deg, var(--bg-card) 0%, var(--bg-card-soft) 100%) !important;
          border-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .thesis-matrix-header {
          background: var(--bg-card-soft) !important;
        }
        :root[data-theme="light"] .thesis-matrix-header .thesis-matrix-prop,
        :root[data-theme="light"] .thesis-matrix-header .thesis-matrix-col {
          color: var(--text-muted) !important;
        }
        :root[data-theme="light"] .thesis-matrix-header .thesis-matrix-col.btc {
          color: var(--accent-bitcoin) !important;
        }
        :root[data-theme="light"] .thesis-matrix-row {
          border-bottom-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .thesis-matrix-prop,
        :root[data-theme="light"] .thesis-matrix-col {
          border-right-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .thesis-matrix-prop-name {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .thesis-matrix-prop-desc {
          color: var(--text-dim) !important;
        }
        :root[data-theme="light"] .thesis-matrix-note {
          color: var(--text-muted) !important;
        }

        /* ── Thesis: time-preference columns (bg set via inline style → needs !important) ── */
        :root[data-theme="light"] .thesis-tp-col {
          background: var(--bg-card-soft) !important;
        }
        :root[data-theme="light"] .thesis-tp-item {
          border-bottom-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .thesis-tp-item-head {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .thesis-tp-item-tail {
          color: var(--text-muted) !important;
        }

        /* ── Thesis: pinned scrolly stage (History chapter) ── */
        :root[data-theme="light"] .thesis-pinned-stage-left,
        :root[data-theme="light"] .thesis-pinned-stage-right {
          background: linear-gradient(160deg, var(--bg-card) 0%, var(--bg-card-soft) 100%) !important;
        }
        :root[data-theme="light"] .thesis-pinned-counter-row {
          border-top-color: var(--border-subtle) !important;
        }

        /* ── Thesis: scrolly rail — active item highlight & progress track ── */
        :root[data-theme="light"] .thesis-rail-item.active {
          background: linear-gradient(135deg, rgba(247, 147, 26, 0.10) 0%, var(--bg-card-soft) 100%) !important;
        }
        :root[data-theme="light"] .thesis-rail-track {
          background: var(--border-subtle) !important;
        }

        /* ── DCA chart: Recharts tooltip ── */
        :root[data-theme="light"] .recharts-default-tooltip {
          background: var(--bg-card) !important;
          border: 1px solid var(--border-subtle) !important;
          color: var(--text-primary) !important;
        }

        /* ── Thesis: pinned stage (History / Silent Tax) — class-based text colors ── */
        :root[data-theme="light"] .thesis-pinned-year {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .thesis-pinned-chapter-headline {
          color: var(--text-primary) !important;
        }
        :root[data-theme="light"] .thesis-pinned-chapter-body {
          color: var(--text-secondary) !important;
        }
        :root[data-theme="light"] .thesis-pinned-chapter-stat {
          background: var(--bg-card-elevated) !important;
          color: var(--text-muted) !important;
        }

        /* ── Thesis: comparison matrix rating pills — darken for light-bg readability ──
              Pills use inline ratingColor (#86efac, #fbbf24, #22c55e) which fail WCAG AA
              on white. filter:brightness darkens both text and tint together. ── */
        :root[data-theme="light"] .thesis-matrix-pill {
          filter: brightness(0.6) !important;
        }

        /* ── Thesis: pinned stage — yellow era accent (#fbbf24) fails on white bg ──
              ch.color inline styles can't be reached by class rules; target by
              the inline value directly. Shifted to amber-800 which passes AA. ── */
        :root[data-theme="light"] [class*="thesis-pinned-chapter"][style*="color: rgb(251, 191, 36)"],
        :root[data-theme="light"] [class*="thesis-pinned-chapter"][style*="color:#fbbf24"],
        :root[data-theme="light"] [class*="thesis-pinned-chapter"][style*="color: #fbbf24"] {
          color: #92400e !important;
        }

        /* ── Thesis: scrolly pill navigation bar ── */
        :root[data-theme="light"] .thesis-pillbar {
          background: rgba(238, 241, 247, 0.95) !important;
          border-color: var(--border-subtle) !important;
        }
        :root[data-theme="light"] .thesis-pill {
          color: var(--text-muted) !important;
        }
        :root[data-theme="light"] .thesis-pill.active {
          color: var(--accent-bitcoin) !important;
        }
        :root[data-theme="light"] .thesis-pillbar-underline {
          background: linear-gradient(135deg, rgba(247, 147, 26, 0.12) 0%, rgba(247, 147, 26, 0.04) 100%) !important;
          border-color: rgba(247, 147, 26, 0.35) !important;
        }

        /* ── Light-mode elevation — white cards lift off the grey page on a soft,
              cool shadow rather than the dark-mode's near-black drop. ── */
        :root[data-theme="light"] :is(.tier1-card,.tier2-card,.chart-card,.price-display,.market-pulse-card,.curated-card,.holdings-card,.lede-card,.power-law-card) {
          box-shadow: 0 1px 2px rgba(20, 30, 55, 0.04), 0 6px 20px rgba(20, 30, 55, 0.06) !important;
        }
        :root[data-theme="light"] .header-logo {
          box-shadow: 0 2px 8px rgba(247, 147, 26, 0.28) !important;
        }
        @media (hover: hover) {
          :root[data-theme="light"] .card-hover:hover {
            box-shadow: 0 2px 6px rgba(20, 30, 55, 0.07), 0 10px 28px rgba(20, 30, 55, 0.10) !important;
          }
        }
        /* Subtle dark-tinted zebra/hover for tables (the dark-mode rules tint with
           translucent white, which vanishes on a white card). */
        :root[data-theme="light"] .holdings-table tbody tr:nth-child(even) td {
          background: rgba(20, 30, 55, 0.022) !important;
        }
        @media (hover: hover) {
          :root[data-theme="light"] .holdings-table tbody tr:hover td {
            background: rgba(247, 147, 26, 0.06) !important;
          }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 14px rgba(247, 147, 26, 0.08), 0 0 32px rgba(247, 147, 26, 0.04); }
          50% { box-shadow: 0 0 18px rgba(247, 147, 26, 0.14), 0 0 44px rgba(247, 147, 26, 0.08); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes liveBlink {
          0%, 60% { opacity: 1; }
          80% { opacity: 0.55; }
          100% { opacity: 1; }
        }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-scale { opacity: 0; transform: scale(0.96); transition: opacity 0.5s ease, transform 0.5s var(--ease-out); }
        .reveal-scale.visible { opacity: 1; transform: scale(1); }
        @keyframes meterTickIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 0.5; transform: translateY(0); }
        }
        .meter-tick {
          position: absolute;
          top: 4px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-analytical);
          opacity: 0.5;
          transition: background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .meter-tick[data-live="true"] { background: var(--accent-bitcoin-bright); opacity: 0.9; }
        .meter-tick[data-selected="true"] {
          background: var(--accent-bitcoin-bright);
          opacity: 1;
          box-shadow: 0 0 0 3px var(--accent-bitcoin-soft);
        }
        .card-hover { transition: border-color var(--dur-base) ease, box-shadow var(--dur-base) ease; -webkit-tap-highlight-color: transparent; }
        @media (hover: hover) {
          .card-hover:hover { border-color: var(--border-strong) !important; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18); }
        }
        .card-hover:active { border-color: var(--border-accent) !important; }
        .glow-border { animation: glowPulse 6s ease-in-out infinite; }
        .section-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--accent-bitcoin-faint), var(--border-subtle), var(--accent-bitcoin-faint), transparent); margin: 0; }
        .section-divider-analytical { height: 1px; background: linear-gradient(90deg, transparent, var(--accent-analytical-faint), var(--border-subtle), var(--accent-analytical-faint), transparent); margin: 8px 0; }

        /* ─── Card tier system ─── */
        /* Tier 1 — Hero: dominant focal element. Used for price, market pulse, DCA simulator, lede headline. */
        .tier1-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
        }
        /* Tier 2 — Standard: supporting cards. Flatter than the original gradient. */
        .tier2-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 18px 16px;
          position: relative;
          overflow: hidden;
        }
        /* Tier 3 — Stat strip: borderless, just a top hairline rule. Quiet, scannable. */
        .tier3-strip {
          background: transparent;
          border: 0;
          border-top: 1px solid var(--border-subtle);
          border-radius: 0;
          padding: 14px 4px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .tier3-strip .tier3-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: var(--tracking-caps);
          text-transform: uppercase;
          font-weight: 500;
          font-family: var(--font-mono);
        }
        .tier3-strip .tier3-value {
          font-size: clamp(19px, 1.1vw + 13px, 24px);
          color: var(--text-primary);
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .tier3-strip .tier3-sub {
          font-size: 10.5px;
          color: var(--text-dim);
          font-family: var(--font-mono);
          line-height: 1.45;
          margin-top: 2px;
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .tier3-strip-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 760px) {
          .tier3-strip-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }
          .tier3-strip { padding: 12px 4px 10px; }
        }
        @media (max-width: 360px) {
          .tier3-strip-row { grid-template-columns: 1fr; gap: 0; }
        }

        /* Section group titles (Network / Mining / Market) — Outfit ExtraBold caps with analytical accent rule */
        .group-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0 -4px;
        }
        .group-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 11px;
          letter-spacing: var(--tracking-caps-wide);
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .group-title-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--accent-analytical-soft), var(--border-subtle) 40%, transparent);
        }

        /* Editorial body — long-form prose register (Thesis essay, etc.) */
        .editorial-body {
          font-family: var(--font-sans);
          font-weight: 300;
          font-size: 17px;
          line-height: 1.65;
          letter-spacing: 0.01em;
          color: var(--text-secondary);
          max-width: 62ch;
        }

        /* Segmented pill — chart range toggle, etc. */
        .segmented-pill {
          display: inline-flex;
          position: relative;
          padding: 3px;
          background: var(--bg-base);
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          gap: 0;
        }
        .segmented-pill > button {
          position: relative;
          z-index: 1;
          padding: 5px 12px;
          font-size: 10.5px;
          font-weight: 600;
          font-family: var(--font-mono);
          letter-spacing: var(--tracking-caps-tight);
          text-transform: uppercase;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 999px;
          transition: color 0.2s ease;
          min-width: 38px;
        }
        .segmented-pill > button[aria-checked="true"],
        .segmented-pill > button.is-active {
          color: var(--accent-bitcoin);
          font-weight: 700;
        }
        .segmented-pill > button[aria-checked="true"]::before,
        .segmented-pill > button.is-active::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--accent-bitcoin-soft);
          border-radius: 999px;
          z-index: -1;
          transition: background 0.2s ease;
        }
        .segmented-pill.segmented-pill-analytical > button[aria-checked="true"],
        .segmented-pill.segmented-pill-analytical > button.is-active {
          color: var(--accent-analytical-bright);
        }
        .segmented-pill.segmented-pill-analytical > button[aria-checked="true"]::before,
        .segmented-pill.segmented-pill-analytical > button.is-active::before {
          background: var(--accent-analytical-soft);
        }
        .adoption-view-bar.segmented-pill > button[aria-checked="true"],
        .adoption-view-bar.segmented-pill > button.is-active {
          color: var(--accent-bitcoin);
        }
        .adoption-view-bar.segmented-pill > button[aria-checked="true"]::before,
        .adoption-view-bar.segmented-pill > button.is-active::before {
          background: var(--accent-bitcoin-soft);
        }

        /* Lede card — Tier 1 starred Headline */
        .lede-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-left: 4px solid var(--accent-bitcoin);
          border-radius: var(--radius-lg);
          padding: 22px 24px;
          display: block;
          text-decoration: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        @media (hover: hover) {
          .lede-card:hover {
            border-color: var(--border-strong);
            border-left-color: var(--accent-bitcoin-bright);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.16), 0 0 16px var(--accent-bitcoin-faint);
          }
        }
        .lede-card .lede-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: var(--tracking-caps);
          text-transform: uppercase;
          color: var(--accent-bitcoin);
          font-family: var(--font-mono);
          background: var(--accent-bitcoin-soft);
          padding: 4px 9px;
          border-radius: var(--radius-sm);
          display: inline-block;
        }
        .lede-card .lede-title {
          font-family: var(--font-sans);
          font-size: clamp(20px, 2vw + 12px, 26px);
          font-weight: 800;
          line-height: 1.18;
          color: var(--text-primary);
          letter-spacing: var(--tracking-tight);
          margin: 14px 0 10px;
        }
        .lede-card .lede-meta {
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }
        @media (max-width: 540px) {
          .lede-card { padding: 18px 18px; }
        }

        /* Adoption stat-strip rows */
        .adoption-row {
          display: grid;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-top: 1px solid var(--border-subtle);
          transition: background 0.18s ease;
        }
        @media (hover: hover) {
          .adoption-row:hover { background: var(--bg-card-soft); }
        }
        @media (max-width: 540px) {
          .adoption-row.adoption-ownership-row {
            grid-template-columns: 28px 24px minmax(0, 1fr) 56px !important;
            gap: 8px;
            padding: 10px 8px;
          }
          .adoption-row.adoption-index-row {
            grid-template-columns: 28px 24px minmax(0, 1fr) 48px !important;
            gap: 8px;
            padding: 10px 8px;
          }
          .adoption-bar {
            display: none;
          }
        }
        .adoption-flag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 4px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          font-size: 16px;
          line-height: 1;
          overflow: hidden;
        }
        .adoption-rank {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 14px;
          color: var(--text-dim);
          letter-spacing: 0.02em;
          font-variant-numeric: tabular-nums;
          width: 32px;
          text-align: right;
        }
        .adoption-rank.is-top {
          color: var(--accent-bitcoin);
        }
        .adoption-name {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 14px;
          color: var(--text-secondary);
          letter-spacing: 0;
        }
        .adoption-value {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: var(--fs-lg);
          color: var(--accent-analytical-bright);
          font-variant-numeric: tabular-nums;
          text-align: right;
        }
        .adoption-value.is-live {
          color: var(--accent-bitcoin);
        }
        .adoption-meta {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }

        /* Analytical pill — for historical chart series labels, etc. */
        .pill-analytical {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--accent-analytical-soft);
          color: var(--accent-analytical-bright);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: var(--tracking-caps-tight);
          text-transform: uppercase;
        }
        button:focus-visible { outline: 2px solid var(--accent-bitcoin); outline-offset: 2px; }
        a:focus-visible { outline: 2px solid var(--accent-bitcoin); outline-offset: 2px; }
        [role="tab"]:focus-visible,
        [role="radio"]:focus-visible { outline: 2px solid var(--accent-bitcoin); outline-offset: 2px; }
        button, a, [role="button"], [role="tab"], [role="radio"] { -webkit-tap-highlight-color: transparent; }
        .holdings-card { transition: border-color var(--dur-base) ease; -webkit-tap-highlight-color: transparent; }
        @media (hover: hover) {
          .holdings-card:hover { border-color: #f7931a33 !important; }
        }
        .app-shell { min-height: 100vh; min-height: 100dvh; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-base); }
        ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 3px; }
        .tab-scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        .tab-scroll-container::-webkit-scrollbar { display: none; }
        /* ─── Thesis page: scroll-driven layout ─── */
        .thesis-progress-fill {
          display: block;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #f7931a, #ffb347);
          transform-origin: left center;
          transition: transform 0.12s linear;
        }
        .thesis-scrolly-intro { padding: 4px 0 0; }
        .thesis-scrolly-eyebrow {
          font-size: 11px; color: #f7931a; font-weight: 900; letter-spacing: 1.4px;
          text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px;
        }
        .thesis-scrolly-sub {
          font-size: 15px; color: #aab4cb; line-height: 1.6; font-family: 'Outfit', sans-serif;
          max-width: 640px;
        }
        .thesis-scrolly {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 28px;
          align-items: start;
          position: relative;
        }
        .thesis-mobile-chip { display: none; }
        .thesis-pillbar { display: none; }
        .thesis-rail {
          position: sticky;
          top: 92px;
          align-self: start;
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 16px;
          padding: 18px 16px 18px 18px;
        }
        .thesis-rail-header { margin-bottom: 14px; }
        .thesis-rail-eyebrow {
          font-size: 10px; color: #f7931a; font-weight: 900; letter-spacing: 1.4px;
          text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 6px;
        }
        .thesis-rail-sub {
          font-size: 12px; color: #8b96b3; line-height: 1.55; font-family: 'Outfit', sans-serif;
        }
        .thesis-rail-items {
          position: relative;
          display: grid;
          gap: 4px;
          padding-left: 14px;
        }
        .thesis-rail-track {
          position: absolute;
          left: 4px;
          top: 4px;
          bottom: 4px;
          width: 2px;
          background: #232944;
          border-radius: 2px;
        }
        .thesis-rail-fill {
          position: absolute;
          left: 4px;
          top: 4px;
          width: 2px;
          height: calc(100% - 8px);
          background: linear-gradient(180deg, #f7931a, #ffb347);
          border-radius: 2px;
          transform-origin: top center;
          transform: scaleY(0);
          transition: transform 0.15s linear;
        }
        .thesis-rail-item {
          display: grid;
          grid-template-columns: 32px minmax(0, 1fr);
          gap: 10px;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          border: 1px solid transparent;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        @media (hover: hover) {
          .thesis-rail-item:hover { background: #f7931a08; }
        }
        .thesis-rail-item.active {
          background: linear-gradient(135deg, #201400 0%, #151a2d 100%);
          border-color: #f7931a55;
        }
        .thesis-rail-step {
          font-size: 12px;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
          color: #6a7490;
          align-self: start;
          padding-top: 2px;
          transition: color 0.25s ease;
        }
        .thesis-rail-item.active .thesis-rail-step { color: #f7931a; }
        .thesis-rail-text { display: flex; flex-direction: column; gap: 3px; }
        .thesis-rail-eyebrow-sm {
          font-size: 9px; color: #f7931a; font-weight: 900; letter-spacing: 1.1px;
          text-transform: uppercase; font-family: 'JetBrains Mono', monospace;
        }
        .thesis-rail-title {
          font-size: 13px; font-weight: 800; line-height: 1.25;
          font-family: 'Outfit', sans-serif;
          color: #aab4cb;
          transition: color 0.25s ease;
        }
        .thesis-rail-item.active .thesis-rail-title { color: #ffffff; }
        .thesis-scenes {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 18px;
          scroll-snap-type: y proximity;
          min-width: 0;
        }
        .thesis-scene { scroll-snap-align: start; min-width: 0; }
        .thesis-traits-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .thesis-lenses-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .thesis-basics-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        @media (hover: hover) {
          .thesis-trait-card.card-hover:hover, .thesis-lens-card.card-hover:hover, .thesis-metric-card.card-hover:hover, .thesis-basic-card.card-hover:hover {
            border-color: #f7931a44 !important;
          }
        }
        .thesis-metric-card.reveal.visible, .thesis-metric-card.reveal-scale.visible {
          box-shadow: 0 0 0 1px #f7931a08, 0 8px 24px #00000030;
        }

        /* ─── Thesis: Phase header (journey markers) ─── */
        .thesis-phase-header {
          position: relative;
          padding: 22px 26px 24px;
          background: linear-gradient(135deg, rgba(13, 13, 26, 0.4) 0%, rgba(20, 20, 38, 0.55) 100%);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
        }
        .thesis-phase-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(60% 70% at 0% 0%, currentColor 0%, transparent 60%);
          opacity: 0.04;
          pointer-events: none;
        }
        .thesis-phase-badge {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 11px 5px 9px;
          border-radius: 999px;
          border: 1px solid;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.2px;
        }
        .thesis-phase-num {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0;
        }
        .thesis-phase-divider {
          width: 1px;
          height: 12px;
          opacity: 0.7;
        }
        .thesis-phase-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }
        .thesis-phase-title {
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          line-height: 1.12;
          max-width: 720px;
        }
        .thesis-phase-sub {
          font-size: 14px;
          color: #aab4cb;
          font-family: 'Outfit', sans-serif;
          line-height: 1.7;
          max-width: 780px;
        }
        .thesis-phase-dots {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .thesis-phase-dot {
          width: 28px;
          height: 4px;
          border-radius: 999px;
          background: var(--border-subtle);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .thesis-phase-dot.active {
          transform: scaleX(1.25);
          transform-origin: left;
        }
        .thesis-phase-dots-label {
          font-size: 10px;
          color: #6a7490;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-left: 4px;
        }

        /* ─── Thesis: Silent Tax — PINNED SCROLLYTELLING ─── */
        /* Outer wrap is 700vh tall to drive 7 chapters worth of scroll. */
        /* Inner stage uses position: sticky to pin the visual to the viewport. */
        .thesis-pinned-wrap {
          position: relative;
          height: 700vh;
          margin: 0;
        }
        /* Wide-monitor breakout: on screens larger than the page-content cap (1180px),
           let this cinematic section extend beyond the column up to ~1440px so the
           chart gets headroom without disturbing other thesis sections. */
        @media (min-width: 1280px) {
          .thesis-pinned-wrap {
            width: min(calc(100vw - 32px), 1440px);
            margin-left: calc((100% - min(calc(100vw - 32px), 1440px)) / 2);
            margin-right: calc((100% - min(calc(100vw - 32px), 1440px)) / 2);
          }
        }
        .thesis-pinned-stage {
          position: sticky;
          /* Pin below the page header so the top of the stage isn't covered by it.
             Height adjusts so the stage fits exactly inside the visible viewport
             on shorter screens — no chart clipping. */
          top: 79px;
          height: calc(100vh - 79px);
          display: grid;
          /* Left fills the rest; right caps at 460px on huge monitors so the chart gets the headroom. */
          grid-template-columns: minmax(0, 1fr) clamp(320px, 32%, 460px);
          /* Constrain the row to the stage height so children that exceed
             their intrinsic content (the chart's 1fr row) don't push the stage
             past the viewport on short screens. */
          grid-template-rows: minmax(0, 1fr);
          gap: 24px;
          padding: 14px 0 18px;
          align-items: stretch;
          box-sizing: border-box;
          z-index: 1;
        }
        .thesis-pinned-stage-left,
        .thesis-pinned-stage-right {
          background: linear-gradient(160deg, #11142a 0%, #0f1426 100%);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }
        .thesis-pinned-stage-left {
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          gap: 10px;
          padding: 18px 22px 16px;
        }
        .thesis-pinned-eyebrow {
          font-size: 11px;
          color: #ef4444;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }
        .thesis-pinned-year {
          font-size: clamp(40px, 4.4vw, 60px);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          color: #ffffff;
          line-height: 0.95;
          letter-spacing: -2px;
          font-variant-numeric: tabular-nums;
        }
        .thesis-pinned-chart {
          position: relative;
          width: 100%;
          min-height: 0;
          --playhead-pct: 0;
          --playhead-color: #ef4444;
        }
        .thesis-pinned-chart.coda::before {
          content: "BTC issuance, halving curve";
          position: absolute;
          top: 0;
          left: 12px;
          font-size: 10px;
          color: #f7931a;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          z-index: 2;
        }
        .thesis-pinned-playhead {
          position: absolute;
          top: 14px;
          bottom: 28px;
          left: calc(48px + var(--playhead-pct) * (100% - 62px));
          width: 2px;
          background: var(--playhead-color);
          pointer-events: none;
          z-index: 2;
          box-shadow: 0 0 14px var(--playhead-color);
          opacity: 0.85;
          border-radius: 1px;
          transition: background 240ms ease, box-shadow 240ms ease;
        }
        .thesis-pinned-playhead::after {
          content: "";
          position: absolute;
          left: -3px;
          top: -4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--playhead-color);
          box-shadow: 0 0 10px var(--playhead-color);
        }
        .thesis-pinned-counter-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding-top: 6px;
          border-top: 1px solid #1c2238;
        }
        .thesis-pinned-counter {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -2.4px;
          font-variant-numeric: tabular-nums;
          transition: color 320ms ease, text-shadow 320ms ease;
        }
        .thesis-pinned-counter-label {
          font-size: 11px;
          color: #6a7490;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .thesis-pinned-stage-right {
          display: grid;
          grid-template-areas: "stack";
          align-content: center;
          padding: 22px 26px 18px;
        }
        .thesis-pinned-progress {
          grid-area: stack;
          align-self: start;
          display: inline-flex;
          gap: 8px;
          margin-bottom: 6px;
        }
        .thesis-pinned-progress-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: transparent;
          border: 1.5px solid var(--border-subtle);
          transition: background 240ms ease, border-color 240ms ease, transform 240ms ease;
        }
        .thesis-pinned-progress-dot.past   { opacity: 0.55; }
        .thesis-pinned-progress-dot.active { transform: scale(1.3); }
        .thesis-pinned-chapter {
          grid-area: stack;
          opacity: 0;
          transform: translateY(18px);
          pointer-events: none;
          transition: opacity 300ms ease-out, transform 300ms ease-out;
          display: flex;
          flex-direction: column;
          gap: 14px;
          will-change: opacity, transform;
          padding-top: 28px;
        }
        .thesis-pinned-chapter.active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .thesis-pinned-chapter-eyebrow {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .thesis-pinned-chapter-headline {
          font-size: clamp(22px, 2.4vw, 32px);
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.18;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .thesis-pinned-chapter-body {
          font-size: 14px;
          color: #aab4cb;
          font-family: 'Outfit', sans-serif;
          line-height: 1.72;
          margin: 0;
          max-width: 56ch;
        }
        .thesis-pinned-chapter-stat {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          align-self: flex-start;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #8b96b3;
          letter-spacing: 0.4px;
        }
        .thesis-pinned-chapter-stat-label {
          font-weight: 700;
        }
        .thesis-pinned-chapter-stat-value {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.4px;
          font-variant-numeric: tabular-nums;
        }
        .thesis-pinned-chapter-stat-coda {
          background: rgba(247, 147, 26, 0.06);
          border-color: #f7931a44;
        }

        .thesis-pinned-hint {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(13, 13, 26, 0.94);
          border: 1px solid #f7931a55;
          border-radius: 999px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #f7931a;
          font-weight: 700;
          letter-spacing: 0.6px;
          pointer-events: none;
          animation: thesisPinnedHintIn 420ms ease-out;
          box-shadow: 0 10px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(247, 147, 26, 0.12);
          z-index: 4;
        }
        .thesis-pinned-hint-arrow {
          font-size: 14px;
          animation: thesisPinnedHintArrow 1.5s ease-in-out infinite;
        }
        @keyframes thesisPinnedHintIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes thesisPinnedHintArrow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }

        .thesis-pinned-sentinel {
          position: absolute;
          left: 0;
          right: 0;
          height: 100vh;
          width: 100%;
          visibility: hidden;
          pointer-events: none;
        }

        /* Mobile + reduced-motion fallback: stacked cards, no pin, full content */
        .thesis-pinned-fallback {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .thesis-pinned-fallback-head {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 4px;
        }
        .thesis-pinned-fallback-eyebrow {
          font-size: 11px;
          color: #ef4444;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .thesis-pinned-fallback-title {
          font-size: clamp(22px, 4.4vw, 30px);
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          line-height: 1.18;
          letter-spacing: -0.4px;
          margin: 0;
        }
        .thesis-pinned-fallback-sub {
          font-size: 14px;
          color: #aab4cb;
          font-family: 'Outfit', sans-serif;
          line-height: 1.7;
          max-width: 760px;
          margin: 0;
        }
        .thesis-pinned-fallback-stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .thesis-pinned-fallback-chapter {
          background: linear-gradient(160deg, #11142a 0%, #0f1426 100%);
          border: 1px solid var(--border-subtle);
          border-left: 3px solid #ef4444;
          border-radius: 14px;
          padding: 16px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .thesis-pinned-fallback-chapter-eyebrow {
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .thesis-pinned-fallback-chapter-headline {
          font-size: clamp(17px, 3.6vw, 21px);
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.3px;
        }
        .thesis-pinned-fallback-chapter-body {
          font-size: 13px;
          color: #aab4cb;
          font-family: 'Outfit', sans-serif;
          line-height: 1.65;
          margin: 0;
        }
        .thesis-pinned-fallback-chapter-stat {
          align-self: flex-start;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #8b96b3;
          margin-top: 4px;
        }

        /* ─── Thesis: Silent Tax stepped (mobile rebuild) ─── */
        .thesis-tax-stepped { display: flex; flex-direction: column; gap: 16px; }
        .thesis-tax-head { display: flex; flex-direction: column; gap: 10px; }
        .thesis-tax-eyebrow {
          font-size: 11px; color: #ef4444; font-family: 'JetBrains Mono', monospace;
          font-weight: 900; letter-spacing: 1.4px; text-transform: uppercase;
        }
        .thesis-tax-anchor {
          font-size: clamp(23px, 6vw, 30px); color: #ffffff; font-family: 'Outfit', sans-serif;
          font-weight: 900; line-height: 1.16; letter-spacing: -0.5px; margin: 0;
        }
        .thesis-tax-setup {
          font-size: 15px; color: #aab4cb; font-family: 'Outfit', sans-serif;
          line-height: 1.68; margin: 0;
        }
        .thesis-tax-guess {
          background: linear-gradient(160deg, #14192e 0%, #0f1426 100%);
          border: 1px solid var(--border-subtle); border-radius: 16px;
          padding: 18px; display: flex; flex-direction: column; gap: 14px;
        }
        .thesis-tax-guess-prompt {
          font-size: 14.5px; color: #e6ebf5; font-family: 'Outfit', sans-serif;
          font-weight: 700; line-height: 1.5;
        }
        .thesis-tax-guess-options { display: flex; gap: 8px; }
        .thesis-tax-guess-opt {
          flex: 1 1 0; min-width: 0; padding: 14px 6px; border-radius: 12px;
          border: 1px solid #2a3150; background: #171d34; color: #d3d8e8;
          font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
        }
        .thesis-tax-guess-opt:active { transform: scale(0.97); }
        .thesis-tax-guess-opt.correct { border-color: #22c55e; background: rgba(34,197,94,0.12); color: #4ade80; }
        .thesis-tax-guess-opt.wrong { border-color: #ef4444; background: rgba(239,68,68,0.12); color: #f87171; }
        .thesis-tax-guess-opt.dim { opacity: 0.4; }
        .thesis-tax-guess-opt:disabled { cursor: default; }
        .thesis-tax-guess-reveal {
          display: flex; flex-direction: column; gap: 8px;
          border-top: 1px solid var(--border-subtle); padding-top: 14px;
        }
        .thesis-tax-guess-answer { font-size: 20px; color: #ffffff; font-family: 'Outfit', sans-serif; font-weight: 900; }
        .thesis-tax-guess-answer strong { color: #ef4444; }
        .thesis-tax-guess-feedback, .thesis-tax-guess-lead {
          font-size: 13.5px; color: #aab4cb; font-family: 'Outfit', sans-serif; line-height: 1.62; margin: 0;
        }
        .thesis-tax-guess-lead { color: #d3d8e8; font-weight: 600; }
        .thesis-tax-walk { display: flex; flex-direction: column; gap: 12px; }
        .thesis-tax-step {
          background: linear-gradient(160deg, #11142a 0%, #0f1426 100%);
          border: 1px solid var(--border-subtle); border-left: 3px solid #ef4444;
          border-radius: 14px; padding: 18px 18px 16px;
          display: flex; flex-direction: column; gap: 9px;
        }
        .thesis-tax-step-eyebrow {
          font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 900;
          letter-spacing: 1.4px; text-transform: uppercase;
        }
        .thesis-tax-step-headline {
          font-size: clamp(18px, 4.6vw, 22px); color: #ffffff; font-family: 'Outfit', sans-serif;
          font-weight: 900; margin: 0; line-height: 1.24; letter-spacing: -0.3px;
        }
        .thesis-tax-step-body {
          font-size: 13.5px; color: #aab4cb; font-family: 'Outfit', sans-serif; line-height: 1.64; margin: 0;
        }
        .thesis-tax-step-meter { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
        .thesis-tax-step-num {
          font-size: 30px; font-family: 'JetBrains Mono', monospace; font-weight: 900;
          line-height: 1; letter-spacing: -1px;
        }
        .thesis-tax-step-num-label { font-size: 11px; color: #7e89a6; font-family: 'JetBrains Mono', monospace; }
        .thesis-tax-coda {
          background: linear-gradient(160deg, #1c1305 0%, #0f1426 68%);
          border: 1px solid #f7931a55; border-radius: 16px; padding: 20px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .thesis-tax-coda-eyebrow {
          font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: 900;
          letter-spacing: 1.4px; text-transform: uppercase;
        }
        .thesis-tax-coda-headline {
          font-size: clamp(20px, 5.2vw, 26px); color: #ffffff; font-family: 'Outfit', sans-serif;
          font-weight: 900; margin: 0; line-height: 1.2; letter-spacing: -0.3px;
        }
        .thesis-tax-coda-body {
          font-size: 14px; color: #c3cbdd; font-family: 'Outfit', sans-serif; line-height: 1.68; margin: 0;
        }
        .thesis-tax-coda-stat {
          align-self: flex-start; display: inline-flex; align-items: baseline; gap: 8px;
          padding: 7px 13px; border: 1px solid #f7931a55; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #b98a4e; margin-top: 2px;
        }
        .thesis-tax-coda-bridge {
          font-size: 14px; color: #f7c98a; font-family: 'Outfit', sans-serif; line-height: 1.58;
          font-weight: 600; margin: 6px 0 0; border-top: 1px solid rgba(247,147,26,0.18); padding-top: 12px;
        }
        :root[data-theme="light"] .thesis-tax-step,
        :root[data-theme="light"] .thesis-tax-guess {
          background: linear-gradient(160deg, var(--bg-card) 0%, var(--bg-card-soft) 100%);
        }
        :root[data-theme="light"] .thesis-tax-anchor,
        :root[data-theme="light"] .thesis-tax-step-headline,
        :root[data-theme="light"] .thesis-tax-coda-headline,
        :root[data-theme="light"] .thesis-tax-guess-answer { color: #0f1426; }
        :root[data-theme="light"] .thesis-tax-guess-prompt,
        :root[data-theme="light"] .thesis-tax-guess-lead { color: #1f2740; }
        :root[data-theme="light"] .thesis-tax-setup,
        :root[data-theme="light"] .thesis-tax-step-body,
        :root[data-theme="light"] .thesis-tax-guess-feedback { color: #48526b; }
        :root[data-theme="light"] .thesis-tax-guess-opt { background: #eef1f7; border-color: #d5dbe8; color: #2a3350; }

        /* ─── Thesis: Problem grid ─── */
        .thesis-problem-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        @media (hover: hover) {
          .thesis-problem-card.card-hover:hover {
            border-color: #ef444455 !important;
            box-shadow: 0 8px 32px #00000040, 0 0 22px #ef444412;
          }
        }

        /* ─── Thesis: History timeline ─── */
        .thesis-history-rail {
          position: relative;
          display: grid;
          gap: 12px;
          padding-left: 30px;
        }
        .thesis-history-rail::before {
          content: "";
          position: absolute;
          left: 9px;
          top: 14px;
          bottom: 14px;
          width: 2px;
          background: linear-gradient(180deg, #ef444466 0%, #fbbf2466 22%, #6a749055 55%, #f7931a 100%);
          border-radius: 2px;
        }
        .thesis-history-card {
          position: relative;
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 12px;
          padding: 14px 18px;
          display: grid;
          grid-template-columns: 110px minmax(0, 1fr);
          grid-template-areas:
            "era name"
            "era note";
          column-gap: 18px;
          row-gap: 4px;
          align-items: start;
          transition: transform 0.25s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        @media (hover: hover) {
          .thesis-history-card:hover {
            transform: translateY(-1px);
            border-color: #f7931a33;
          }
        }
        .thesis-history-card.is-bitcoin {
          background: linear-gradient(135deg, #221500 0%, #151a2d 100%);
          border-color: #f7931a55;
          box-shadow: 0 0 28px #f7931a14;
        }
        .thesis-history-dot {
          position: absolute;
          left: -28px;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #2a2f4a;
          border: 2px solid #0d0d1a;
          box-shadow: 0 0 0 3px #0d0d1a;
          transform: translateY(-50%);
        }
        .thesis-history-card.is-bitcoin .thesis-history-dot {
          background: #f7931a;
          box-shadow: 0 0 0 3px #0d0d1a, 0 0 14px #f7931a66;
        }
        .thesis-history-era {
          grid-area: era;
          align-self: center;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          color: #f7931a;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }
        .thesis-history-card:not(.is-bitcoin) .thesis-history-era {
          color: #aab4cb;
        }
        .thesis-history-name {
          grid-area: name;
          font-size: 16px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          line-height: 1.2;
        }
        .thesis-history-note {
          grid-area: note;
          font-size: 13px;
          color: #8f9ab3;
          line-height: 1.55;
          font-family: 'Outfit', sans-serif;
        }

        /* ─── Thesis: Hardness (stock-to-flow) chart ─── */
        .thesis-hardness-chart {
          display: grid;
          gap: 14px;
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 22px 22px;
        }
        .thesis-hardness-row {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
        }
        .thesis-hardness-name {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .thesis-hardness-label {
          font-size: 13px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          line-height: 1.3;
        }
        .thesis-hardness-note {
          font-size: 11px;
          color: #6a7490;
          font-family: 'Outfit', sans-serif;
          line-height: 1.45;
        }
        .thesis-hardness-bar-wrap {
          position: relative;
          height: 32px;
          background: #1a1f33;
          border-radius: 6px;
          overflow: hidden;
        }
        .thesis-hardness-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          border-radius: 6px;
          animation: hardnessBarGrow 1.1s cubic-bezier(0.16,1,0.3,1) both;
          transform-origin: left center;
        }
        @keyframes hardnessBarGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .thesis-hardness-value {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          z-index: 2;
          text-shadow: 0 1px 2px #00000099;
          white-space: nowrap;
        }
        .thesis-hardness-footnote {
          font-size: 12px;
          color: #8f9ab3;
          font-family: 'Outfit', sans-serif;
          line-height: 1.65;
          margin-top: 14px;
          padding: 12px 16px;
          background: #0f1426;
          border-left: 2px solid #f7931a55;
          border-radius: 0 6px 6px 0;
        }

        /* ─── Thesis: Properties matrix ─── */
        .thesis-matrix-section { position: relative; }
        .thesis-matrix-table {
          display: grid;
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .thesis-matrix-row {
          display: grid;
          grid-template-columns: minmax(220px, 1.2fr) repeat(3, minmax(150px, 1fr));
          border-bottom: 1px solid #1c2238;
        }
        .thesis-matrix-row:last-child { border-bottom: none; }
        .thesis-matrix-header {
          background: #161c33;
        }
        .thesis-matrix-header .thesis-matrix-prop,
        .thesis-matrix-header .thesis-matrix-col {
          padding: 12px 18px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #aab4cb;
        }
        .thesis-matrix-header .thesis-matrix-col.btc {
          color: #f7931a;
        }
        .thesis-matrix-prop, .thesis-matrix-col {
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          justify-content: center;
          border-right: 1px solid #1c2238;
        }
        .thesis-matrix-col:last-child { border-right: none; }
        .thesis-matrix-col.btc {
          background: linear-gradient(180deg, #f7931a0a 0%, #f7931a00 100%);
        }
        .thesis-matrix-prop-name {
          font-size: 14px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          line-height: 1.25;
        }
        .thesis-matrix-prop-desc {
          font-size: 11px;
          color: #6a7490;
          font-family: 'Outfit', sans-serif;
          line-height: 1.45;
        }
        .thesis-matrix-pill {
          align-self: flex-start;
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .thesis-matrix-note {
          font-size: 12px;
          color: #aab4cb;
          font-family: 'Outfit', sans-serif;
          line-height: 1.5;
        }
        /* Asset label only shows on mobile — desktop has column headers instead */
        .thesis-matrix-asset { display: none; }

        /* ─── Thesis: Time preference ─── */
        .thesis-tp-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .thesis-tp-col {
          border-radius: var(--radius-lg);
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .thesis-tp-col-label {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .thesis-tp-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          padding: 0;
        }
        .thesis-tp-item {
          display: grid;
          grid-template-columns: 14px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          padding: 10px 0;
          border-bottom: 1px solid #1f253a;
        }
        .thesis-tp-item:last-child { border-bottom: none; }
        .thesis-tp-bullet {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          margin-top: 8px;
          justify-self: center;
        }
        .thesis-tp-item-text {
          line-height: 1.55;
        }
        .thesis-tp-item-head {
          font-size: 14px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
        }
        .thesis-tp-item-tail {
          font-size: 13px;
          color: #8f9ab3;
          font-family: 'Outfit', sans-serif;
        }
        .thesis-tp-closing {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
        }
        .thesis-tp-closing-text {
          margin: 0;
          font-size: 14px;
          color: #d3d8e8;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          line-height: 1.6;
          flex: 1 1 320px;
        }

        /* ─── Thesis: phase fork ─── */
        .thesis-fork {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .thesis-fork-link {
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          color: #f7931a;
          background: #f7931a12;
          border: 1px solid #f7931a33;
          border-radius: 999px;
          padding: 8px 14px;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.15s ease;
        }
        .thesis-fork-link.muted {
          color: var(--text-secondary);
          background: var(--bg-card);
          border-color: var(--border-subtle);
        }
        .thesis-fork-link:active { transform: scale(0.98); }

        /* ─── Thesis: What is money (advance organizer) ─── */
        .thesis-money-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .thesis-money-panel {
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: 100%;
        }
        .thesis-money-panel-title {
          font-size: 15px;
          color: #f7931a;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }
        .thesis-money-panel-question {
          font-size: 15px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          line-height: 1.3;
        }
        .thesis-money-panel-body {
          font-size: 13px;
          color: #8f9ab3;
          font-family: 'Outfit', sans-serif;
          line-height: 1.65;
        }

        /* ─── Thesis: Silent Tax personal (birth-year + intl) ─── */
        .thesis-birthyear {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 14px;
          padding: 16px 18px;
        }
        .thesis-birthyear-label {
          font-size: 13px;
          color: #d3d8e8;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }
        .thesis-birthyear-select {
          font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          color: #ffffff;
          background: #0d1122;
          border: 1px solid #f7931a55;
          border-radius: 8px;
          padding: 6px 10px;
        }
        .thesis-birthyear-result {
          font-size: 14px;
          color: #f7931a;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }
        .thesis-birthyear-result strong {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
        }
        .thesis-tax-caveat-line {
          margin: 10px 0 0;
          font-size: 12px;
          color: #6c7690;
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
          font-style: italic;
        }
        .thesis-intl-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .thesis-intl-card {
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .thesis-intl-country {
          font-size: 11px;
          color: #f7931a;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .thesis-intl-stat {
          font-size: 15px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
        }
        .thesis-intl-body {
          font-size: 13px;
          color: #8f9ab3;
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
        }
        .thesis-intl-bridge {
          margin: 12px 0 0;
          font-size: 13px;
          color: #d3d8e8;
          font-family: 'Outfit', sans-serif;
          font-style: italic;
          line-height: 1.65;
        }

        /* ─── Thesis: Digital scarcity ("why can't it be copied?") ─── */
        .thesis-digital-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .thesis-digital-step {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 16px;
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 14px;
          padding: 16px 18px;
        }
        .thesis-digital-step-num {
          font-size: 15px;
          color: #f7931a88;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
        }
        .thesis-digital-step-title {
          font-size: 16px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 6px;
        }
        .thesis-digital-step-text {
          font-size: 13px;
          color: #8f9ab3;
          font-family: 'Outfit', sans-serif;
          line-height: 1.65;
        }
        .thesis-digital-step-breaks {
          margin-top: 8px;
          font-size: 12px;
          color: #fbbf24;
          font-family: 'Outfit', sans-serif;
          font-style: italic;
          line-height: 1.55;
        }
        .thesis-supply-guess {
          margin-top: 6px;
        }

        /* ─── Thesis: Hardness caption ─── */
        .thesis-hardness-caption {
          margin-top: 8px;
          font-size: 11px;
          color: #6c7690;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.3px;
        }

        /* ─── Thesis: Myths (refutation cards) ─── */
        .thesis-myth-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .thesis-myth-card {
          background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
          border: 1px solid #232944;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .thesis-myth-card.is-concession {
          border-color: #fbbf2444;
          background: linear-gradient(160deg, rgba(251, 191, 36, 0.07) 0%, #0f1426 100%);
        }
        .thesis-myth-label {
          font-size: 10px;
          color: #ef4444;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }
        .thesis-myth-card.is-concession .thesis-myth-label { color: #fbbf24; }
        .thesis-myth-claim {
          font-size: 15px;
          color: #ffffff;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          line-height: 1.3;
        }
        .thesis-myth-refutation {
          font-size: 13px;
          color: #d3d8e8;
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
        }
        .thesis-myth-mechanism {
          font-size: 13px;
          color: #8f9ab3;
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
        }
        .thesis-myth-concession {
          font-size: 12px;
          color: #fbbf24;
          font-family: 'Outfit', sans-serif;
          font-style: italic;
          line-height: 1.55;
          padding-top: 6px;
          border-top: 1px solid #232944;
        }
        .thesis-myth-source {
          font-size: 10px;
          color: #6c7690;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.3px;
        }

        /* ─── Strategy tab ─── */
        .strategy-section { display: flex; flex-direction: column; gap: 14px; }
        .strategy-eyebrow {
          font-size: 11px;
          color: #f7931a;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 8px;
        }
        .strategy-title {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          line-height: 1.18;
          margin-bottom: 8px;
        }
        .strategy-section-title {
          font-size: 24px;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          line-height: 1.22;
          margin-bottom: 8px;
        }
        .strategy-sub {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
          font-family: 'Outfit', sans-serif;
          max-width: 780px;
        }
        .strategy-disclaimer-ribbon {
          display: grid;
          grid-template-columns: 26px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
          padding: 16px 18px;
          border: 1px solid #fbbf2455;
          border-left: 4px solid #fbbf24;
          border-radius: var(--radius-lg, 14px);
          background: linear-gradient(160deg, #fbbf2410 0%, #ef444408 100%);
        }
        .strategy-disclaimer-icon { display: block; margin-top: 2px; }
        .strategy-disclaimer-head {
          font-size: 13px;
          font-weight: 900;
          color: #fbbf24;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .strategy-disclaimer-body {
          font-size: 13px;
          color: var(--text-secondary, #c8d0e0);
          line-height: 1.55;
          font-family: 'Outfit', sans-serif;
        }

        .strategy-principle-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .strategy-principle-card {
          border-radius: 14px;
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }
        .strategy-principle-eyebrow {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .strategy-principle-title {
          font-size: 18px;
          color: var(--text-primary);
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
          line-height: 1.3;
        }
        .strategy-principle-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin: 0;
          padding: 0;
        }
        .strategy-principle-item {
          display: grid;
          grid-template-columns: 14px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          padding: 10px 0;
          border-bottom: 1px solid #1f253a;
          font-size: 13.5px;
          color: var(--text-secondary, #c8d0e0);
          line-height: 1.55;
          font-family: 'Outfit', sans-serif;
        }
        .strategy-principle-item:last-child { border-bottom: none; }
        .strategy-principle-item strong { color: var(--text-primary); font-weight: 800; }
        .strategy-principle-item em { color: #ffd9b1; font-style: italic; }
        .strategy-principle-bullet {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          margin-top: 8px;
          justify-self: center;
        }

        .strategy-dca-toggles {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }
        .strategy-dca-toggle {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          color: var(--text-secondary, #c8d0e0);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 180ms ease;
        }
        @media (hover: hover) {
          .strategy-dca-toggle:hover {
            border-color: #f7931a55;
            color: var(--text-primary);
          }
        }
        .strategy-dca-toggle.active {
          background: #f7931a;
          border-color: #f7931a;
          color: #0d0d1a;
        }
        .strategy-dca-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .strategy-dca-stat {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: var(--radius-lg);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .strategy-dca-stat-grow {
          border-color: #f7931a44;
          background: linear-gradient(160deg, #f7931a0e 0%, #0f1426 100%);
        }
        .strategy-dca-stat-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }
        .strategy-dca-stat-value {
          font-size: 26px;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.1;
        }
        .strategy-dca-stat-sub {
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
        }
        .strategy-dca-chart-card {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: var(--radius-lg);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .strategy-dca-chart-legend {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
        }
        .strategy-dca-legend-item { display: inline-flex; gap: 8px; align-items: center; }
        .strategy-dca-legend-swatch { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
        .strategy-dca-caption {
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.6;
          padding-top: 4px;
          border-top: 1px solid var(--border-subtle, #242b49);
        }

        .strategy-drawdown-card {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .strategy-drawdown-eyebrow {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }
        .strategy-drawdown-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .strategy-drawdown-row {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          row-gap: 6px;
        }
        .strategy-drawdown-year {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .strategy-drawdown-track {
          position: relative;
          height: 28px;
          background: #181d33;
          border-radius: 6px;
          overflow: hidden;
        }
        .strategy-drawdown-fill {
          height: 100%;
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
          border-radius: 6px;
          transition: width 600ms ease;
        }
        .strategy-drawdown-fill.live {
          background: linear-gradient(90deg, #f7931a 0%, #fb923c 100%);
        }
        .strategy-drawdown-pct {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0,0,0,0.45);
        }
        .strategy-drawdown-label {
          grid-column: 2;
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.5;
        }

        .strategy-fouryear-card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          background: linear-gradient(160deg, #22c55e12 0%, #0f1426 100%);
          border: 1px solid #22c55e44;
          border-radius: 16px;
          padding: 24px 28px;
        }
        .strategy-fouryear-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 96px;
          font-weight: 900;
          color: #22c55e;
          line-height: 1;
        }
        .strategy-fouryear-label {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .strategy-fouryear-sub {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
          font-family: 'Outfit', sans-serif;
        }

        .strategy-investable-callout {
          background: linear-gradient(160deg, #f7931a14 0%, #0f1426 100%);
          border: 1px solid #f7931a44;
          border-left: 4px solid #f7931a;
          border-radius: var(--radius-lg);
          padding: 18px 20px;
        }
        .strategy-investable-eyebrow {
          font-size: 11px;
          color: #f7931a;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 8px;
        }
        .strategy-investable-body {
          font-size: 14px;
          color: var(--text-secondary, #c8d0e0);
          line-height: 1.65;
          font-family: 'Outfit', sans-serif;
        }
        .strategy-investable-body strong { color: var(--text-primary); font-weight: 800; }

        .strategy-band-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .strategy-band-row {
          position: relative;
          display: grid;
          grid-template-columns: 110px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-left-width: 4px;
          border-radius: 12px;
          padding: 18px 20px 18px 22px;
          overflow: hidden;
        }
        .strategy-band-stripe { display: none; }
        .strategy-band-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
        }
        .strategy-band-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .strategy-band-persona {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
        }
        .strategy-band-rationale {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
          font-family: 'Outfit', sans-serif;
        }
        .strategy-band-footnote {
          font-size: 12px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.6;
          margin-top: 4px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle, #242b49);
        }

        .strategy-mistakes-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .strategy-mistake-card {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-top: 3px solid #ef4444;
          border-radius: 12px;
          padding: 18px 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 158px;
        }
        .strategy-mistake-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 900;
          color: #ef4444;
          letter-spacing: 1.4px;
        }
        .strategy-mistake-title {
          font-size: 15px;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          line-height: 1.25;
        }
        .strategy-mistake-body {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
          font-family: 'Outfit', sans-serif;
        }

        .strategy-sources-card {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: 14px;
          padding: 20px 22px;
        }
        .strategy-sources-head {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 12px;
        }
        .strategy-sources-list {
          list-style: none;
          margin: 0 0 14px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .strategy-sources-list a {
          color: var(--text-primary);
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          border-bottom: 1px solid transparent;
          transition: border-color 150ms ease, color 150ms ease;
        }
        @media (hover: hover) {
          .strategy-sources-list a:hover {
            color: #f7931a;
            border-bottom-color: #f7931a55;
          }
        }
        .strategy-sources-list a span { color: var(--text-muted); margin-left: 4px; font-size: 11px; }
        .strategy-final-disclaimer {
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.65;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle, #242b49);
        }

        /* ─── Strategy: drawdown recovery + caveat ─── */
        .strategy-drawdown-recovery {
          grid-column: 2;
          font-size: 11px;
          color: #22c55e;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.5;
        }
        .strategy-drawdown-recovery-tag {
          color: #22c55e;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .strategy-drawdown-caveat {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle, #242b49);
          font-size: 12px;
          color: var(--text-muted);
          font-family: 'Outfit', sans-serif;
          font-style: italic;
          line-height: 1.6;
        }

        /* ─── Strategy: worked example ─── */
        .strategy-worked-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .strategy-worked-step {
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr);
          gap: 16px;
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: 12px;
          padding: 14px 18px;
        }
        .strategy-worked-step-date {
          font-size: 13px;
          color: #f7931a;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
        }
        .strategy-worked-step-event {
          font-size: 15px;
          color: var(--text-primary);
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 6px;
        }
        .strategy-worked-step-figures {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: var(--text-secondary);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 4px;
        }
        .strategy-worked-step-note {
          font-size: 12px;
          color: var(--text-muted);
          font-family: 'Outfit', sans-serif;
          font-style: italic;
        }
        .strategy-worked-outcome {
          margin-top: 14px;
          padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(160deg, rgba(34, 197, 94, 0.08) 0%, var(--bg-card, #111629) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .strategy-worked-outcome-note {
          font-size: 14px;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .strategy-worked-outcome-moral {
          font-size: 13px;
          color: #22c55e;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }

        /* ─── Strategy: retail reality (BIS stat + inversion) ─── */
        .strategy-reality-card {
          text-align: center;
          padding: 26px 20px;
          border-radius: 14px;
          background: linear-gradient(160deg, rgba(239, 68, 68, 0.08) 0%, var(--bg-card, #111629) 100%);
          border: 1px solid rgba(239, 68, 68, 0.3);
          margin-bottom: 16px;
        }
        .strategy-reality-stat {
          font-size: 42px;
          font-weight: 900;
          color: #ef4444;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1;
        }
        .strategy-reality-label {
          font-size: 14px;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          margin-top: 8px;
        }
        .strategy-reality-body {
          font-size: 13px;
          color: var(--text-secondary);
          font-family: 'Outfit', sans-serif;
          line-height: 1.65;
          max-width: 620px;
          margin: 10px auto 0;
        }
        .strategy-reality-source {
          font-size: 10px;
          color: var(--text-dim);
          font-family: 'JetBrains Mono', monospace;
          margin-top: 10px;
        }
        .strategy-reality-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .strategy-reality-inv-card {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: 12px;
          padding: 16px;
        }
        .strategy-reality-inv-kills {
          font-size: 10px;
          color: #ef4444;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .strategy-reality-inv-tool {
          font-size: 15px;
          color: var(--text-primary);
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          margin: 6px 0;
        }
        .strategy-reality-inv-body {
          font-size: 12px;
          color: var(--text-muted);
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
        }

        /* ─── Strategy: checking cadence widget ─── */
        .strategy-cadence-stat {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .strategy-cadence-stat-value {
          font-size: 28px;
          font-weight: 900;
          color: #f7931a;
          font-family: 'JetBrains Mono', monospace;
        }
        .strategy-cadence-stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-family: 'Outfit', sans-serif;
        }
        .strategy-cadence-chart {
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: 14px;
          padding: 12px;
        }

        /* ─── Strategy: custody ladder ─── */
        .strategy-custody-ladder {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .strategy-custody-rung {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 16px;
          background: var(--bg-card, #111629);
          border: 1px solid var(--border-subtle, #242b49);
          border-radius: 14px;
          padding: 16px 18px;
        }
        .strategy-custody-rung-num {
          font-size: 15px;
          color: #f7931a88;
          font-weight: 900;
          font-family: 'JetBrains Mono', monospace;
        }
        .strategy-custody-rung-label {
          font-size: 16px;
          color: var(--text-primary);
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 6px;
        }
        .strategy-custody-rung-keys {
          font-size: 12px;
          color: #f7931a;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 8px;
        }
        .strategy-custody-rung-good {
          font-size: 13px;
          color: #22c55e;
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .strategy-custody-rung-tradeoff {
          font-size: 13px;
          color: var(--text-muted);
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
        }
        .strategy-custody-closing {
          margin: 14px 0 0;
          font-size: 13px;
          color: var(--text-secondary);
          font-family: 'Outfit', sans-serif;
          font-style: italic;
          line-height: 1.65;
        }

        /* Tablet: 761-1099px */
        @media (min-width: 761px) and (max-width: 1099px) {
          .strategy-mistakes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .strategy-dca-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .strategy-reality-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .thesis-scrolly {
            grid-template-columns: minmax(0, 1fr);
            gap: 14px;
          }
          .thesis-rail { display: none; }
          .thesis-pillbar {
            display: flex;
            position: sticky;
            top: 88px;
            z-index: 4;
            gap: 4px;
            background: rgba(13, 13, 26, 0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid #232944;
            border-radius: 999px;
            padding: 6px;
            overflow: hidden;
          }
          .thesis-pill {
            flex: 1 1 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 10px;
            border-radius: 999px;
            text-decoration: none;
            color: #8b96b3;
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 12px;
            white-space: nowrap;
            transition: color 0.25s ease, background 0.25s ease;
            position: relative;
            z-index: 1;
          }
          .thesis-pill.active { color: #f7931a; }
          .thesis-pill-step {
            font-size: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 900;
            opacity: 0.7;
          }
          .thesis-pillbar-underline {
            position: absolute;
            bottom: 4px;
            left: 6px;
            height: calc(100% - 8px);
            background: linear-gradient(135deg, #201400 0%, #151a2d 100%);
            border: 1px solid #f7931a55;
            border-radius: 999px;
            transition: transform 0.32s cubic-bezier(0.5, 0, 0.2, 1), width 0.32s ease;
            z-index: 0;
            pointer-events: none;
          }
          .thesis-traits-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .thesis-lenses-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .thesis-basics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .thesis-problem-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .thesis-matrix-row { grid-template-columns: minmax(170px, 1fr) repeat(3, minmax(120px, 1fr)); }
          .thesis-hardness-row { grid-template-columns: 200px minmax(0, 1fr); }
          .thesis-history-card { grid-template-columns: 90px minmax(0, 1fr); }
          .thesis-pinned-fallback-stack { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .thesis-phase-title { font-size: 24px; }
        }

        /* Mobile: ≤760px */
        @media (max-width: 760px) {
          .thesis-hero-grid { --thesis-hero-columns: minmax(0, 1fr); }
          .thesis-explorer-grid { --thesis-explorer-columns: minmax(0, 1fr); }
          .thesis-active-grid { --thesis-active-columns: minmax(0, 1fr); }
          .thesis-bottom-grid { --thesis-bottom-columns: minmax(0, 1fr); }
          .thesis-scrolly { grid-template-columns: minmax(0, 1fr); gap: 12px; }
          .thesis-rail { display: none; }
          .thesis-mobile-chip {
            display: flex;
            position: sticky;
            top: 52px;
            z-index: 4;
            align-items: center;
            gap: 10px;
            background: var(--bg-overlay);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--border-subtle);
            border-radius: 999px;
            padding: 8px 14px;
            text-decoration: none;
            color: inherit;
            -webkit-tap-highlight-color: transparent;
            transition: border-color 0.25s ease, transform 0.15s ease;
          }
          .thesis-mobile-chip:active { transform: scale(0.98); }
          .thesis-mobile-chip-step {
            font-size: 11px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 900;
            color: #f7931a;
            letter-spacing: 0.5px;
          }
          .thesis-mobile-chip-label {
            font-size: 12px;
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            color: #ffffff;
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .thesis-mobile-chip-dots {
            display: flex;
            gap: 5px;
            align-items: center;
          }
          .thesis-chip-dot {
            width: 6px; height: 6px;
            border-radius: 999px;
            background: #2a2f4a;
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .thesis-chip-dot.active { background: #f7931a; transform: scale(1.25); }
          .thesis-traits-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-lenses-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-basics-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-scene { padding: 20px !important; }
          .thesis-problem-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-tp-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-money-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-intl-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-myth-grid { grid-template-columns: minmax(0, 1fr); }
          .thesis-digital-step { grid-template-columns: minmax(0, 1fr); gap: 8px; }
          .strategy-title { font-size: 22px; }
          .strategy-section-title { font-size: 19px; }
          .strategy-principle-grid { grid-template-columns: minmax(0, 1fr); }
          .strategy-dca-stats { grid-template-columns: minmax(0, 1fr); }
          .strategy-mistakes-grid { grid-template-columns: minmax(0, 1fr); }
          .strategy-reality-grid { grid-template-columns: minmax(0, 1fr); }
          .strategy-worked-step { grid-template-columns: minmax(0, 1fr); gap: 6px; }
          .strategy-custody-rung { grid-template-columns: minmax(0, 1fr); gap: 6px; }
          .strategy-band-row {
            grid-template-columns: minmax(0, 1fr);
            row-gap: 8px;
            padding: 14px 16px 14px 18px;
          }
          .strategy-band-num { font-size: 22px; }
          .strategy-fouryear-card {
            grid-template-columns: minmax(0, 1fr);
            gap: 10px;
            padding: 20px 18px;
          }
          .strategy-fouryear-num { font-size: 64px; }
          .strategy-drawdown-row { grid-template-columns: 64px minmax(0, 1fr); }
          .strategy-drawdown-label { font-size: 10.5px; }
          .thesis-history-card {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas: "era" "name" "note";
            row-gap: 6px;
            padding: 14px 16px;
          }
          .thesis-history-card .thesis-history-era { align-self: start; }
          .thesis-history-rail { padding-left: 24px; }
          .thesis-history-rail::before { left: 7px; }
          .thesis-history-dot { left: -22px; }
          .thesis-hardness-chart { padding: 18px 16px; }
          .thesis-hardness-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 8px;
          }
          .thesis-hardness-bar-wrap { height: 28px; }
          /* Mobile: stack each property as a card; each cell shows its asset name */
          .thesis-matrix-section { overflow-x: visible; }
          .thesis-matrix-table {
            min-width: 0;
            background: transparent;
            border: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
            border-radius: 0;
            overflow: visible;
          }
          .thesis-matrix-header { display: none; }
          .thesis-matrix-row {
            grid-template-columns: minmax(0, 1fr);
            background: linear-gradient(160deg, #131a30 0%, #0f1426 100%);
            border: 1px solid #232944;
            border-radius: 14px;
            overflow: hidden;
          }
          .thesis-matrix-prop {
            padding: 14px 16px 10px;
            border-right: none;
            border-bottom: 1px solid #1c2238;
            background: #161c33;
          }
          .thesis-matrix-prop-name { font-size: 16px; line-height: 1.25; }
          .thesis-matrix-prop-desc { font-size: 12.5px; line-height: 1.5; }
          .thesis-matrix-col {
            padding: 12px 16px;
            border-right: none;
            border-bottom: 1px solid #1c2238;
            display: grid;
            grid-template-columns: 70px auto minmax(0, 1fr);
            align-items: center;
            gap: 12px;
          }
          .thesis-matrix-col:last-child { border-bottom: none; }
          .thesis-matrix-col.btc {
            background: linear-gradient(90deg, #f7931a14 0%, #f7931a04 100%);
          }
          .thesis-matrix-asset {
            display: inline-block;
            font-size: 10px;
            color: #aab4cb;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 900;
            letter-spacing: 1.1px;
            text-transform: uppercase;
          }
          .thesis-matrix-col.btc .thesis-matrix-asset { color: #f7931a; }
          .thesis-matrix-pill {
            align-self: center;
            justify-self: start;
            font-size: 10px;
            padding: 3px 8px;
            white-space: nowrap;
          }
          .thesis-matrix-note {
            font-size: 13px;
            line-height: 1.55;
            color: #aab4cb;
          }
          .thesis-phase-header { padding: 18px 18px 20px; border-radius: 14px; }
          .thesis-phase-title { font-size: 22px; }
          .thesis-phase-sub { font-size: 13px; }
          .thesis-pinned-fallback-stack {
            grid-template-columns: minmax(0, 1fr);
            gap: 10px;
          }
          .thesis-pinned-fallback-chapter { padding: 14px 16px 12px; }
        }

        .back-to-top-btn { bottom: max(24px, calc(10px + env(safe-area-inset-bottom))); }
        @media (max-width: 760px) {
          .back-to-top-btn { display: none !important; }
          .headlines-filter-row {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-right: 40px;
            -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 28px), transparent);
            mask-image: linear-gradient(90deg, #000 calc(100% - 28px), transparent);
          }
          .headlines-filter-row::-webkit-scrollbar { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal-scale { transition: none !important; transform: none !important; opacity: 1 !important; }
          .thesis-progress-fill, .thesis-rail-fill { transition: none !important; }
          .thesis-scenes { scroll-snap-type: none; }
        }
        @media (max-width: 1023px) {
          .header-row {
            flex-wrap: wrap;
            column-gap: 10px !important;
            row-gap: 4px !important;
          }
          .header-row > .header-tabs {
            flex: 1 1 100% !important;
            min-width: 100% !important;
            order: 4;
          }
          .header-row > .header-actions {
            margin-left: auto;
          }
        }
        @media (max-width: 480px) {
          .header-row { column-gap: 8px !important; row-gap: 4px !important; }
          .header-title { font-size: 15px !important; letter-spacing: -0.3px; }
          .header-subtitle { display: none !important; }
          .header-actions { gap: 6px !important; }
        }
        @media (max-width: 760px) {
          .header-price-delta { display: none !important; }
        }
        @media (max-width: 360px) {
          .header-title-block { display: none !important; }
        }

        /* ─── Sticky dashboard header ─── */
        .dashboard-header {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 10px 24px 17px;
          background: var(--bg-overlay);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          mask-image: linear-gradient(to bottom, black 0, black calc(100% - 12px), transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0, black calc(100% - 12px), transparent 100%);
          transform: translateZ(0);
          will-change: transform;
          transition: padding 0.22s ease, background 0.22s ease;
        }

        /* ─── Mobile/tablet scroll smoothness ─── */
        @media (max-width: 1099px) {
          html { scroll-behavior: auto; }
          body { -webkit-overflow-scrolling: touch; overscroll-behavior-y: none; }
          /* Backdrop-filter blur is expensive while scrolling on mobile GPUs;
             swap to a denser solid background with a much lighter blur. */
          .dashboard-header {
            background: var(--bg-base);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            mask-image: none;
            -webkit-mask-image: none;
            border-bottom: 1px solid var(--border-subtle);
          }
          /* Scroll-snap on the thesis scenes makes touch scrolling lurch. */
          .thesis-scenes { scroll-snap-type: none !important; }
          .thesis-scene { scroll-snap-align: none !important; }
        }

        /* ─── Mobile compact header when scrolled ─── */
        @media (max-width: 720px) {
          .dashboard-header.scrolled {
            padding-top: 6px !important;
            padding-bottom: 8px !important;
          }
          .dashboard-header.scrolled .header-row {
            column-gap: 8px !important;
            row-gap: 2px !important;
          }
          .dashboard-header.scrolled .header-logo {
            width: 26px !important;
            height: 26px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
          }
          .dashboard-header.scrolled .header-title {
            font-size: 13px !important;
            letter-spacing: -0.3px !important;
          }
          .dashboard-header.scrolled .header-subtitle {
            display: none !important;
          }
          .dashboard-header.scrolled .header-actions {
            gap: 6px !important;
          }
          .dashboard-header.scrolled .header-price span {
            font-size: 14px !important;
          }
          .dashboard-header.scrolled .theme-toggle {
            width: 34px !important;
            height: 34px !important;
            font-size: 14px !important;
            border-radius: 9px !important;
          }
          .header-price span { font-size: 15px !important; }
          .header-price-delta { font-size: 11px !important; }
          .theme-toggle { width: 34px !important; height: 34px !important; font-size: 15px !important; border-radius: 9px !important; }
          .dashboard-header.scrolled .header-tabs [role="tab"] {
            min-height: 36px !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
        }

        /* ─── Page content responsive padding ─── */
        @media (max-width: 1099px) {
          .dashboard-header { padding-left: 18px !important; padding-right: 18px !important; }
          .page-content { padding-left: 18px !important; padding-right: 18px !important; }
        }
        @media (max-width: 760px) {
          .dashboard-header {
            padding-left: max(14px, env(safe-area-inset-left)) !important;
            padding-right: max(14px, env(safe-area-inset-right)) !important;
            padding-top: 8px !important;
            padding-bottom: 6px !important;
          }
          .scroll-progress-wrap { bottom: 0 !important; }
          .page-content { padding: 18px 16px 36px !important; }
        }
        @media (max-width: 480px) {
          .dashboard-header {
            padding-left: max(12px, env(safe-area-inset-left)) !important;
            padding-right: max(12px, env(safe-area-inset-right)) !important;
          }
          .page-content {
            padding: 16px max(14px, env(safe-area-inset-left)) calc(36px + env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-right)) !important;
          }
        }

        /* ─── Dashboard tab: Price display ─── */
        @media (max-width: 760px) {
          .price-display {
            padding: 24px 18px !important;
            border-radius: 16px !important;
          }
          .price-display-value {
            font-size: 36px !important;
          }
        }
        @media (max-width: 540px) {
          .price-display { display: flex; flex-direction: column; }
          .price-display-value { order: -1; margin-bottom: 10px; }
          .price-display-head { order: 0; margin-bottom: 0 !important; }
          .price-display .fg-pill { order: 2; align-self: flex-start; margin-top: 6px; }
        }
        @media (max-width: 480px) {
          .price-display {
            padding: 20px 16px !important;
          }
          .price-display-value {
            font-size: 34px !important;
          }
        }
        @media (max-width: 400px) {
          .fg-pill-class { display: none; }
        }

        /* ─── Dashboard tab: Market updates grid ─── */
        @media (max-width: 760px) {
          .market-updates-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 10px !important;
          }
        }

        /* ─── Dashboard tab: Stat card grids ─── */
        @media (max-width: 760px) {
          .stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .stat-grid.analysis-card-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 380px) {
          .stat-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }

        /* ─── Dashboard tab: Chart card padding ─── */
        @media (max-width: 760px) {
          .chart-card {
            padding: 16px 8px !important;
          }
        }
        @media (max-width: 480px) {
          .chart-card { padding: 14px 4px !important; }
          .holdings-chart-card { padding: 12px 2px !important; }
        }

        /* ─── Mobile tap targets (≤760px) ─── */
        @media (max-width: 760px) {
          .segmented-pill > button { padding: 9px 14px !important; font-size: 11.5px !important; min-height: 36px; min-width: 44px; }
          .headlines-filter-row button { padding: 10px 14px !important; font-size: 12px !important; min-height: 36px; }
          .adoption-view-bar > button { padding: 11px 10px !important; min-height: 40px; }
          .strategy-dca-toggle { padding: 11px 18px !important; font-size: 13px !important; min-height: 40px; }
          .dashboard-header:not(.scrolled) [role="tab"] { min-height: 44px; }
          .theme-toggle { width: 40px !important; height: 40px !important; font-size: 17px !important; border-radius: 10px !important; }

          [role="tab"]:active,
          .segmented-pill > button:active,
          .adoption-view-bar > button:active,
          .strategy-dca-toggle:active,
          .headlines-filter-row button:active,
          .theme-toggle:active { transform: scale(0.94); transition: transform 0.08s ease; }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="tab"]:active,
          .segmented-pill > button:active,
          .adoption-view-bar > button:active,
          .strategy-dca-toggle:active,
          .headlines-filter-row button:active,
          .theme-toggle:active { transform: none !important; }
        }

        /* ─── Mobile tier 2 cards + tab nav polish ─── */
        @media (max-width: 720px) {
          .tab-scroll-container { scroll-snap-type: x proximity; scroll-padding: 16px; }
          .tab-scroll-container [role="tab"] { scroll-snap-align: center; }
        }
        @media (max-width: 480px) {
          .tier2-card { padding: 16px 14px !important; border-radius: 14px; }
          .tab-fade-right { width: 40px !important; }
          .tab-fade-left { width: 12px !important; }
        }

        /* ─── Thesis: defer off-screen scene paint on mobile ─── */
        @media (max-width: 760px) {
          .thesis-scene { content-visibility: auto; contain-intrinsic-size: auto 800px; }
        }

        /* ─── Dashboard tab: Market pulse interpretation card ─── */
        @media (max-width: 480px) {
          .market-pulse-card {
            padding: 14px 16px !important;
          }
        }


        /* ─── Page titles ─── */
        @media (max-width: 480px) {
          .page-title { font-size: 20px !important; line-height: 1.2; }
          .page-subtitle { font-size: 12.5px !important; line-height: 1.55; }
        }

        /* ─── Mobile typography overrides (≤480px) ─── */
        @media (max-width: 480px) {
          .tier3-strip .tier3-label,
          .tier3-strip .tier3-sub,
          .pill-analytical,
          .lede-card .lede-eyebrow,
          .group-title { font-size: 11px !important; letter-spacing: 0.10em; }

          .tier3-strip .tier3-value { font-size: 18px !important; line-height: 1.15; }
          .editorial-body { font-size: 16px !important; line-height: 1.7; max-width: none; }
        }

        /* ─── Adoption: view button bar ─── */
        @media (max-width: 440px) {
          .adoption-view-bar {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
            width: 100% !important;
          }
          .adoption-view-bar > button {
            padding: 9px 10px !important;
            font-size: 12px !important;
            flex: 1 1 calc(50% - 6px) !important;
            min-width: 0 !important;
            min-height: 40px !important;
            text-align: center !important;
            white-space: normal !important;
            line-height: 1.2 !important;
          }
        }
        @media (max-width: 380px) {
          .adoption-view-bar > button { font-size: 11px !important; padding: 9px 6px !important; }
        }

        /* ─── Adoption: ownership rows ─── */
        @media (max-width: 480px) {
          .adoption-ownership-row {
            grid-template-columns: 22px 22px 1fr 46px !important;
            padding: 8px 10px !important;
            gap: 5px !important;
          }
        }

        /* ─── Adoption: index rows ─── */
        @media (max-width: 760px) {
          .adoption-index-row {
            grid-template-columns: 30px 24px 1fr 90px !important;
            padding: 10px 12px !important;
            gap: 6px !important;
          }
        }
        @media (max-width: 480px) {
          .adoption-index-row {
            grid-template-columns: 26px 22px 1fr 64px !important;
            gap: 5px !important;
          }
        }

        /* ─── Holdings summary banner & cards ─── */
        @media (max-width: 480px) {
          .holdings-summary {
            font-size: 11px !important;
            padding: 10px 12px !important;
            line-height: 1.55;
          }
          .holdings-card {
            padding: 14px 14px !important;
            border-radius: 12px !important;
          }
          .holdings-card-head > div:last-child {
            text-align: left !important;
          }
        }

        /* ─── Holdings chart: shrink padding on small screens ─── */
        @media (max-width: 760px) {
          .holdings-chart-card {
            padding: 12px 4px !important;
          }
        }

        /* ─── Headlines: filter row and date column ─── */
        @media (max-width: 480px) {
          .headline-card {
            padding: 12px 14px !important;
            gap: 10px !important;
          }
          .headline-date {
            min-width: 42px !important;
            font-size: 11.5px !important;
          }
          .headline-title {
            font-size: 14.5px !important;
            line-height: 1.32;
          }
          .headlines-filter-row button {
            padding: 5px 10px !important;
            font-size: 10px !important;
          }
        }

        /* ─── Thesis: hero typography on small screens ─── */
        @media (max-width: 760px) {
          .thesis-hero-card { padding: 22px 18px !important; min-height: 0 !important; }
          .thesis-hero-card > div:first-of-type + div > div:nth-child(2) { font-size: 26px !important; line-height: 1.08 !important; }
          .thesis-hero-card > div:first-of-type + div > div:nth-child(3) { font-size: 14px !important; line-height: 1.65 !important; }
          .thesis-metrics-grid { gap: 8px !important; }
          .thesis-phase-header { padding: 18px 18px 20px !important; }
        }
        @media (max-width: 480px) {
          .thesis-metrics-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }

        /* ─── Tablet refinements (761-1099px) ─── */
        @media (min-width: 761px) and (max-width: 1099px) {
          .stat-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }

        /* ─── Bottom navigation bar ─── */
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: space-around;
          background: var(--bg-base); border-top: 1px solid var(--border-subtle);
          padding: 4px 0 max(4px, env(safe-area-inset-bottom));
        }
        .bottom-nav-item {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          gap: 2px; padding: 6px 0; border: none; background: none; cursor: pointer;
          color: var(--text-dim); min-height: 44px; justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .bottom-nav-item.active { color: var(--accent-bitcoin); }
        .bottom-nav-icon { width: 20px; height: 20px; display: flex; }
        .bottom-nav-icon svg { width: 100%; height: 100%; }
        .bottom-nav-label {
          font-size: 10px; font-family: var(--font-sans); font-weight: 600;
          letter-spacing: 0.3px;
        }
        .bottom-nav-item:active { transform: scale(0.92); }
        @media (min-width: 761px) { .bottom-nav { display: none; } }
        @media (prefers-reduced-motion: reduce) { .bottom-nav-item:active { transform: none; } }

        /* ─── Hide horizontal tabs when bottom nav active on mobile ─── */
        @media (max-width: 760px) {
          .header-tabs-hidden { display: none !important; }
          .page-content-with-bottom-nav { padding-bottom: calc(72px + env(safe-area-inset-bottom)) !important; }
          .back-to-top-with-bottom-nav { bottom: max(80px, calc(66px + env(safe-area-inset-bottom))) !important; }
        }

        /* ─── Pull-to-refresh indicator ─── */
        .ptr-indicator {
          position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 51;
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--bg-card-elevated); border: 1px solid var(--border-subtle);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: opacity 0.2s ease;
        }
        .ptr-spinner {
          width: 18px; height: 18px; border: 2px solid var(--border-subtle);
          border-top-color: var(--accent-bitcoin); border-radius: 50%;
        }
        .ptr-spinner.spinning { animation: ptrSpin 0.8s linear infinite; }
        @keyframes ptrSpin { to { transform: rotate(360deg); } }

        /* ─── Tab content transition ─── */
        .tab-panel-enter { animation: tabFadeIn 0.2s ease-out; }
        @keyframes tabFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ─── Analysis confidence badge ─── */
        .confidence-panel {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
        }
        @media (max-width: 540px) {
          .confidence-panel { grid-template-columns: 1fr; gap: 14px; }
        }
        .confidence-grade-badge {
          width: 64px; height: 64px;
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 900; font-family: var(--font-mono);
          border: 2px solid currentColor;
          flex-shrink: 0;
        }
        .confidence-meta { display: flex; flex-direction: column; gap: 8px; }
        .confidence-label-row {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .confidence-label {
          font-size: 10px; font-family: var(--font-mono); font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted);
        }
        .confidence-tooltip-trigger {
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; border-radius: 50%;
          border: 1px solid var(--border-strong); color: var(--text-dim);
          font-size: 9px; font-family: var(--font-mono); font-weight: 700;
          cursor: help; flex-shrink: 0;
        }
        .confidence-summary {
          font-size: 12px; color: var(--text-secondary); font-family: var(--font-sans);
          line-height: 1.55;
        }
        .confidence-prob-row { display: flex; align-items: center; gap: 10px; }
        .confidence-prob-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 999px;
          font-family: var(--font-mono); font-size: 11px; font-weight: 800;
          border: 1px solid currentColor; white-space: nowrap;
        }
        .confidence-prob-bar-wrap {
          flex: 1; height: 4px; background: var(--border-subtle);
          border-radius: 2px; overflow: hidden; min-width: 60px;
        }
        .confidence-prob-bar {
          height: 100%; border-radius: 2px;
          transition: width 0.8s var(--ease-out);
        }

        /* ─── Holdings sortable table ─── */
        .holdings-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
        }
        .holdings-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .holdings-table th {
          position: sticky; top: 0;
          padding: 10px 14px;
          background: var(--bg-card-elevated);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border-strong);
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-muted);
          cursor: pointer; user-select: none;
          text-align: left; white-space: nowrap;
          transition: color 0.15s ease;
        }
        .holdings-table th:hover { color: var(--text-secondary); }
        .holdings-table th.num { text-align: right; }
        .holdings-table th .sort-icon { display: inline-block; margin-left: 4px; opacity: 0.35; }
        .holdings-table th.sort-active { color: var(--text-secondary); }
        .holdings-table th.sort-active .sort-icon { opacity: 1; color: var(--accent-bitcoin); }
        .holdings-table td {
          padding: 11px 14px;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          vertical-align: middle;
        }
        .holdings-table td.num {
          text-align: right; font-variant-numeric: tabular-nums; font-weight: 700;
        }
        .holdings-table tr:last-child td { border-bottom: none; }
        .holdings-table tbody tr:nth-child(even) td { background: rgba(255,255,255,0.015); }
        @media (hover: hover) {
          .holdings-table tbody tr:hover td { background: var(--bg-card-elevated); }
        }

      `}</style>

      <div className={`dashboard-header${scrolled ? " scrolled" : ""}`}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="header-row" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="header-logo" style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #f7931a, #ffb347)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: "#000",
              flexShrink: 0,
            }} aria-hidden="true">₿</div>
            <div className="header-title-block" style={{ flexShrink: 0 }}>
              <div className="header-title" style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: "var(--text-primary)" }}>{isMobileNav ? "Bitcoin Intel" : "Bitcoin Intelligence"}</div>
              <div className="header-subtitle" style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                <DataStatus lastUpdate={btc.lastUpdate} error={btc.error} loading={btc.loading} />
              </div>
            </div>

            <div className={`header-tabs${isMobileNav ? " header-tabs-hidden" : ""}`} style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div className="tab-fade tab-fade-right" style={{
                position: "absolute", top: 0, right: 0, bottom: 0, width: 64, zIndex: 2,
                background: "linear-gradient(to right, transparent 0%, var(--bg-base) 70%)",
                pointerEvents: "none",
              }} />
              <div className="tab-fade tab-fade-left" style={{
                position: "absolute", top: 0, left: 0, bottom: 0, width: 20, zIndex: 2,
                background: "linear-gradient(to left, transparent, var(--bg-base))",
                pointerEvents: "none",
              }} />
              <div
                className="tab-scroll-container"
                style={{
                  overflowX: "auto",
                  paddingRight: 40,
                  paddingLeft: 4,
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div role="tablist" style={{
                  display: "flex",
                  gap: 0,
                  margin: "0 auto",
                  width: "max-content",
                }}>
                  {TABS.map((tab, i) => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={activeTab === i}
                      onClick={(e) => {
                        setActiveTab(i);
                        if (navigator.vibrate) navigator.vibrate(10);
                        e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                        window.scrollTo({ top: 0, behavior: "auto" });
                      }}
                      style={{
                        padding: "10px 16px", border: "none", cursor: "pointer",
                        fontSize: 13, fontWeight: activeTab === i ? 700 : 500,
                        fontFamily: "var(--font-sans)",
                        background: "transparent",
                        color: activeTab === i ? "var(--accent-bitcoin)" : "var(--text-dim)",
                        borderBottom: activeTab === i ? "2px solid var(--accent-bitcoin)" : "2px solid transparent",
                        transition: "color 0.2s, border-color 0.2s, background 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >{tab}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div className="header-price" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Pulse color={btc.error ? "var(--status-down)" : "var(--accent-bitcoin)"} />
                {btc.price != null ? (
                  <span style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-bitcoin)", fontFamily: "var(--font-mono)" }}>{fmtUSD(btc.price)}</span>
                ) : (
                  <Skeleton width={90} height={20} />
                )}
                {btc.change24h != null && (
                  <span className="header-price-delta" style={{
                    fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)",
                    color: btc.change24h >= 0 ? "var(--status-up)" : "var(--status-down)",
                    opacity: 0.9,
                  }}>
                    {btc.change24h >= 0 ? "▲" : "▼"}{Math.abs(btc.change24h).toFixed(1)}%
                  </span>
                )}
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="scroll-progress-wrap" style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 14,
          height: 3,
          background: "var(--border-subtle)",
          overflow: "hidden",
        }}>
          <PageScrollProgressBar />
        </div>
      </div>

      {pullDistance > 10 && (
        <div className="ptr-indicator" style={{ top: pullDistance - 36, opacity: Math.min(pullDistance / 60, 1) }}>
          <div className={`ptr-spinner${refreshing ? " spinning" : ""}`} style={!refreshing ? { transform: `rotate(${pullDistance * 3}deg)` } : undefined} />
        </div>
      )}

      <div className={`page-content${isMobileNav ? " page-content-with-bottom-nav" : ""}`} style={{ padding: "20px 24px 40px", maxWidth: 1180, margin: "0 auto" }}>
        <OfflineBanner online={online} lastUpdate={btc.lastUpdate} />
        <div style={{ display: activeTab === 0 ? "block" : "none" }} className={activeTab === 0 ? "tab-panel-enter" : ""}><DashboardTab btc={btc} setActiveTab={setActiveTab} /></div>
        {visitedTabs.has(1) && <div style={{ display: activeTab === 1 ? "block" : "none" }} className={activeTab === 1 ? "tab-panel-enter" : ""}><BitcoinThesisTab setActiveTab={setActiveTab} /></div>}
        {visitedTabs.has(2) && <div style={{ display: activeTab === 2 ? "block" : "none" }} className={activeTab === 2 ? "tab-panel-enter" : ""}><StrategyTab btc={btc} setActiveTab={setActiveTab} /></div>}
        {visitedTabs.has(3) && <div style={{ display: activeTab === 3 ? "block" : "none" }} className={activeTab === 3 ? "tab-panel-enter" : ""}><HeadlinesTab news={news} /></div>}
        {visitedTabs.has(4) && <div style={{ display: activeTab === 4 ? "block" : "none" }} className={activeTab === 4 ? "tab-panel-enter" : ""}><AdoptionTab price={btc.price} /></div>}
        {visitedTabs.has(5) && <div style={{ display: activeTab === 5 ? "block" : "none" }} className={activeTab === 5 ? "tab-panel-enter" : ""}><DeepAnalysisTab /></div>}
      </div>

      {showBackToTop && (
        <button
          className={`back-to-top-btn${isMobileNav ? " back-to-top-with-bottom-nav" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          style={{
            position: "fixed", right: 20, zIndex: 100,
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--bg-card-elevated)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            fontSize: 16, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.color = "var(--accent-bitcoin)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card-elevated)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >↑</button>
      )}

      {isMobileNav && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}
