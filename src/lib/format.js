// ─── UTILITIES ──────────────────────────────────────────────────
export const fmt = (n, decimals = 0) => (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
export const fmtUSD = (n) => "$" + fmt(n, 2);

export const toFiniteNumber = (value) => {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

export const formatRelativeDate = (unixSeconds) => {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Human-readable "time remaining" — used for difficulty-retarget countdown.
export const formatRemainingTime = (ms) => {
  if (!Number.isFinite(ms) || ms <= 0) return "soon";
  const days = ms / 86400000;
  if (days >= 2) return `${Math.round(days)} days`;
  const hours = ms / 3600000;
  if (hours >= 2) return `${Math.round(hours)} hours`;
  const minutes = Math.max(1, Math.round(ms / 60000));
  return `${minutes} min`;
};

// "X min Y sec ago" style — used for time-since-last-block ticker.
export const formatElapsed = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "just now";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s ago`;
  return `${m}m ${s.toString().padStart(2, "0")}s ago`;
};

// Friendly market-cap size comparison for newbies — pick the closest familiar
// reference point so $1.6T reads as "≈ size of Google".
export const marketCapComparison = (usd) => {
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

export const TAG_COLORS = {
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

export const TAG_FALLBACK = { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };

export const decodeEntities = (str) => {
  if (!str) return "";
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
};

export const stripHtml = (str) => decodeEntities((str || "").replace(/<[^>]*>/g, "")).trim();

// rss2json returns categories as an array of strings. Pick the first matching tag.
export const pickTagFromArray = (cats) => {
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

export const isBitcoinRelevant = (title, categories) => {
  const haystack = (title + " " + (categories || []).join(" ")).toLowerCase();
  return /bitcoin|btc|satoshi|halving|lightning|mining|hash\s?rate|bitcoin\s?mag/.test(haystack);
};

// Heuristic — flags high-impact stories so the UI can star them.
// Triggers on macro/regulatory events, ATHs, billion-dollar flows, and major
// state/corporate moves. Tuned to be conservative; better to miss than over-star.
export const isImportantHeadline = (title) => {
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
export const BTC_CACHE_KEY = "btc-dashboard.priceCache";
export const readPriceCache = () => {
  try {
    const raw = localStorage.getItem(BTC_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (Date.now() - c.ts > 86400000) return null;
    return c;
  } catch { return null; }
};
