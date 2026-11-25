import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { COINBASE_TICKER_URL, COINGECKO_MARKET_URL, MEMPOOL_BLOCK_URL, MEMPOOL_HASHRATE_URL, MEMPOOL_FEES_URL, MEMPOOL_MEMPOOL_URL, MEMPOOL_BLOCKS_URL, MEMPOOL_DIFFICULTY_URL, MEMPOOL_LIGHTNING_URL, COINGECKO_GLOBAL_URL, LONG_TERM_CHART_URL, MEDIUM_TERM_CHART_URL, FEAR_GREED_URL, LIVE_PRICE_POLL_MS, MARKET_DATA_POLL_MS, SLOW_DATA_POLL_MS, LAST_BLOCK_POLL_MS, LONG_TERM_POLL_MS, MEDIUM_TERM_POLL_MS, LIVE_PRICE_BACKOFF_CAP_MS, POLL_BACKOFF_CAP_MS } from "../lib/constants.js";
import { toFiniteNumber, BTC_CACHE_KEY, readPriceCache } from "../lib/format.js";
import { createPoller } from "./ui.jsx";

// One formatter per label shape, built once. Formatting a date with an options
// bag otherwise builds a fresh Intl.DateTimeFormat on every call; the long-term
// series labels ~1,600 points and the 90-day series ~2,200, on every refresh,
// so sharing the formatter takes that pass from tens of milliseconds of main
// thread down to a couple. Output is identical.
const DAY_LABEL = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

// ─── CHART HISTORY CACHE ────────────────────────────────────────
// The two history series (all-time closes, 90 days hourly) are large, change
// slowly, and feed three charts on the first screen. A copy is kept in
// localStorage so a returning visitor's charts draw immediately instead of
// after two more API round trips, and a reload inside the freshness window
// does not spend the requests at all (CoinGecko's free tier rate-limits by IP).
//   · younger than its poll interval → used as-is, the first fetch is skipped
//   · older, up to CHART_CACHE_MAX_AGE_MS → shown at once, refreshed behind it
//   · older still, unreadable, or storage unavailable → ignored
// Stored compactly as [[t, price], …]; labels are rebuilt on read.
const CHART_CACHE_LONG = "btc-dashboard.chart.long.v1";
const CHART_CACHE_MEDIUM = "btc-dashboard.chart.medium.v1";
const CHART_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const readChartCache = (key, labelFmt) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const c = JSON.parse(raw);
    const age = Date.now() - c.ts;
    if (!Number.isFinite(age) || age < -60000 || age > CHART_CACHE_MAX_AGE_MS || !Array.isArray(c.p)) return null;
    const points = [];
    for (const row of c.p) {
      if (!Array.isArray(row)) continue;
      const [t, price] = row;
      if (!Number.isFinite(t) || !Number.isFinite(price)) continue;
      points.push({ t, date: labelFmt.format(t), price });
    }
    return points.length ? { ts: c.ts, points } : null;
  } catch { return null; }
};

const writeChartCache = (key, points) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      ts: Date.now(),
      p: points.map((d) => [d.t, Math.round(d.price * 100) / 100]),
    }));
  } catch { /* quota or private mode: the cache is only an optimisation */ }
};

// Every fetcher below resolves to true (success), false (failure) or
// undefined (did nothing: already in flight, or aborted on unmount). The
// pollers use that to pause while the tab is hidden and to back off after
// failures — see createPoller in ./ui.jsx. State shapes are unchanged.
export const useBitcoinData = () => {
  // Read once, on mount (see CHART HISTORY CACHE above).
  const chartCacheRef = useRef(undefined);
  if (chartCacheRef.current === undefined) {
    chartCacheRef.current = {
      long: readChartCache(CHART_CACHE_LONG, MONTH_LABEL),
      medium: readChartCache(CHART_CACHE_MEDIUM, DAY_LABEL),
    };
  }

  // Lazy initializer: the cached price is read from localStorage once, on
  // mount, not on every render of the shell.
  const [data, setData] = useState(() => {
    const cached = readPriceCache();
    const charts = chartCacheRef.current;
    return {
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
    longTermChart: charts.long?.points ?? [],
    mediumTermChart: charts.medium?.points ?? [],
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
    // True once the first attempt at each of these has finished, whether or
    // not it succeeded. Their tiles have no other "loading" signal, so without
    // it a source that is down left them shimmering forever instead of "—".
    slowSettled: false,
    lastBlockSettled: false,
    lastUpdate: cached ? new Date(cached.ts) : null,
    loading: !cached,
    error: null,
    };
  });
  const fetchersRef = useRef(null);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;
    let liveInFlight = false;
    let marketInFlight = false;
    let slowInFlight = false;
    let lastBlockInFlight = false;
    let longTermInFlight = false;
    let mediumTermInFlight = false;
    // A cached series still inside its poll interval stands in for the first
    // fetch. Cleared after one use so every later tick really fetches.
    const cachedCharts = chartCacheRef.current || {};
    let longFreshUntil = cachedCharts.long ? cachedCharts.long.ts + LONG_TERM_POLL_MS : 0;
    let mediumFreshUntil = cachedCharts.medium ? cachedCharts.medium.ts + MEDIUM_TERM_POLL_MS : 0;

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
          date: DAY_LABEL.format(t),
          price: prices[i],
        });
      }
      out.push({
        t: now,
        date: DAY_LABEL.format(Date.now()),
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
          date: MONTH_LABEL.format(entry.x * 1000),
          price: entry.y,
        });
      }
      return out;
    };

    // CoinGecko market_chart returns [[timestamp_ms, price], ...] — already in ms, no conversion.
    // Covers the last 90 days at hourly granularity (~2160 pts) on the free tier.
    const downsampleMediumTerm = (prices) => {
      if (!Array.isArray(prices) || prices.length === 0) return [];
      const out = [];
      for (const row of prices) {
        if (!Array.isArray(row)) continue;
        const [t, price] = row;
        // A malformed row is skipped, not allowed to blank the whole series.
        if (!Number.isFinite(t) || !Number.isFinite(price)) continue;
        out.push({ t, date: DAY_LABEL.format(t), price });
      }
      return out;
    };

    const refreshChartPrice = (chartData, price) => {
      if (!Array.isArray(chartData) || chartData.length === 0 || price == null) {
        return chartData || [];
      }

      const next = [...chartData];
      next[next.length - 1] = {
        ...next[next.length - 1],
        date: DAY_LABEL.format(Date.now()),
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
        return true;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: e.message || "Live price update failed",
        }));
        return false;
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
        return true;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: prev.price == null ? e.message || "Network error" : prev.error,
        }));
        return false;
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
          return true;
        }
        return false;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        // swallow — non-essential data, page still works without it
        return false;
      } finally {
        slowInFlight = false;
        if (!cancelled) setData((prev) => (prev.slowSettled ? prev : { ...prev, slowSettled: true }));
      }
    };

    // Last block — fetches the most recent block's timestamp + miner pool.
    // Display ticks every 1s client-side via useElapsed; we only re-fetch every 60s.
    const fetchLastBlock = async () => {
      if (lastBlockInFlight) return;
      lastBlockInFlight = true;

      try {
        const res = await fetch(MEMPOOL_BLOCKS_URL, { signal: ac.signal });
        if (!res.ok) return false;
        const blocks = await res.json().catch(() => null);
        const b = Array.isArray(blocks) && blocks.length > 0 ? blocks[0] : null;
        if (!b) return false;

        const timestamp = toFiniteNumber(b.timestamp);
        const height = toFiniteNumber(b.height);
        const poolName = b.extras?.pool?.name || null;

        if (cancelled) return;
        if (timestamp == null) return false;
        setData((prev) => ({
          ...prev,
          lastBlock: { timestamp, height, poolName },
        }));
        return true;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        return false;
      } finally {
        lastBlockInFlight = false;
        if (!cancelled) setData((prev) => (prev.lastBlockSettled ? prev : { ...prev, lastBlockSettled: true }));
      }
    };

    const fetchLongTermChart = async () => {
      if (longTermInFlight) return;
      if (Date.now() < longFreshUntil) return true;
      longFreshUntil = 0;
      longTermInFlight = true;
      try {
        const res = await fetch(LONG_TERM_CHART_URL, { signal: ac.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`blockchain.info market-price HTTP ${res.status}`);
        const json = await res.json();
        const downsampled = downsampleLongTerm(json?.values);
        if (cancelled) return;
        if (downsampled.length === 0) return false;
        setData((prev) => ({ ...prev, longTermChart: downsampled }));
        writeChartCache(CHART_CACHE_LONG, downsampled);
        return true;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        // Silent failure — the 7-day chart owns the top-level error UI
        return false;
      } finally {
        longTermInFlight = false;
      }
    };

    const fetchMediumTermChart = async () => {
      if (mediumTermInFlight) return;
      if (Date.now() < mediumFreshUntil) return true;
      mediumFreshUntil = 0;
      mediumTermInFlight = true;
      try {
        const res = await fetch(MEDIUM_TERM_CHART_URL, { signal: ac.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`CoinGecko market_chart HTTP ${res.status}`);
        const json = await res.json();
        const processed = downsampleMediumTerm(json?.prices);
        if (cancelled) return;
        if (processed.length === 0) return false;
        setData((prev) => ({ ...prev, mediumTermChart: processed }));
        writeChartCache(CHART_CACHE_MEDIUM, processed);
        return true;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        return false;
      } finally {
        mediumTermInFlight = false;
      }
    };

    // One poller per fetcher. start() fires the initial burst (same order as
    // before), then ticks only while the tab is visible, backing off on failure.
    const pollers = {
      market: createPoller({ run: fetchMarketData, intervalMs: MARKET_DATA_POLL_MS, backoffCapMs: POLL_BACKOFF_CAP_MS }),
      live: createPoller({ run: fetchLivePrice, intervalMs: LIVE_PRICE_POLL_MS, backoffCapMs: LIVE_PRICE_BACKOFF_CAP_MS }),
      slow: createPoller({ run: fetchSlowData, intervalMs: SLOW_DATA_POLL_MS, backoffCapMs: POLL_BACKOFF_CAP_MS }),
      lastBlock: createPoller({ run: fetchLastBlock, intervalMs: LAST_BLOCK_POLL_MS, backoffCapMs: POLL_BACKOFF_CAP_MS }),
      longTerm: createPoller({ run: fetchLongTermChart, intervalMs: LONG_TERM_POLL_MS, backoffCapMs: POLL_BACKOFF_CAP_MS }),
      mediumTerm: createPoller({ run: fetchMediumTermChart, intervalMs: MEDIUM_TERM_POLL_MS, backoffCapMs: POLL_BACKOFF_CAP_MS }),
    };
    fetchersRef.current = pollers;
    Object.values(pollers).forEach((p) => p.start());

    return () => {
      cancelled = true;
      ac.abort();
      Object.values(pollers).forEach((p) => p.stop());
    };
  }, []);

  // Pull-to-refresh: the user asked, so run now regardless of any backoff.
  const refresh = useCallback(() => {
    const p = fetchersRef.current;
    if (!p) return;
    p.live.now();
    p.market.now();
    p.slow.now();
    p.lastBlock.now();
  }, []);

  // Same object until the data actually changes, so memo()'d tabs skip the
  // shell's unrelated re-renders (scroll flags, pull-to-refresh distance).
  return useMemo(() => ({ ...data, refresh }), [data, refresh]);
};
