import { useState, useEffect, useRef, useCallback } from "react";
import { COINBASE_TICKER_URL, COINGECKO_MARKET_URL, MEMPOOL_BLOCK_URL, MEMPOOL_HASHRATE_URL, MEMPOOL_FEES_URL, MEMPOOL_MEMPOOL_URL, MEMPOOL_BLOCKS_URL, MEMPOOL_DIFFICULTY_URL, MEMPOOL_LIGHTNING_URL, COINGECKO_GLOBAL_URL, LONG_TERM_CHART_URL, MEDIUM_TERM_CHART_URL, FEAR_GREED_URL, LIVE_PRICE_POLL_MS, MARKET_DATA_POLL_MS, SLOW_DATA_POLL_MS, LAST_BLOCK_POLL_MS, LONG_TERM_POLL_MS, MEDIUM_TERM_POLL_MS } from "../lib/constants.js";
import { toFiniteNumber, BTC_CACHE_KEY, readPriceCache } from "../lib/format.js";
import { useElapsed } from "./ui.jsx";

export const useBitcoinData = () => {
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
