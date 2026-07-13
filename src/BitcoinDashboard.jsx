import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Line, ReferenceLine, ReferenceArea } from "recharts";
import "./styles.css";
import { Skeleton, SourceLink, Term, TabNavChip, StatCard, StatStrip, SectionGroup, SupplyMeter, DipExplainerCard, PriceDisplay, ErrorBanner, buildMarketPulse, MarketPulseCard, DataStatus, ThemeToggle } from "./components/shared.jsx";
import { TABS, TOTAL_SUPPLY, HALVING_BLOCK } from "./lib/constants.js";
import { fmt, fmtUSD, formatRemainingTime, formatElapsed, marketCapComparison, TAG_COLORS, TAG_FALLBACK, isImportantHeadline } from "./lib/format.js";
import { computeDcaOutcome, computeMaxDrawdown } from "./lib/market-math.js";
import { useBitcoinData } from "./hooks/useBitcoinData.js";
import { useBitcoinNews } from "./hooks/useBitcoinNews.js";
import { useElapsed, useOnlineStatus, usePullToRefresh, useSwipeNavigation, Pulse, prefersReducedMotion, useIsMobile, shouldAnimate, Reveal, useActiveSection, useScrollSpy, useScrollProgress, useScrolled, PageScrollProgressBar, useCountUp, parseNumericMetric, usePersistedState } from "./hooks/ui.jsx";

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

const PriceChart = memo(({ sevenDay, mediumTerm, longTerm }) => {
  const [range, setRange] = usePersistedState("btc-dashboard.chartRange", "7D");
  const cfg = PRICE_CHART_RANGES.find((r) => r.id === range) || PRICE_CHART_RANGES[0];
  const isMobile = useIsMobile();

  // Source selection: seven=7D sparkline, medium=CoinGecko 90d hourly, long=blockchain.info all-time daily.
  const sourceData = cfg.source === "seven" ? sevenDay : cfg.source === "medium" ? mediumTerm : longTerm;
  // The window/downsample/min-max pass walks the full history (~5,800 daily
  // points on ALL), so it only re-runs when the source array or range changes —
  // not on the 12 s price polls that re-render the Dashboard around this chart.
  const { data, min, max, pct, first } = useMemo(() => {
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
    return { data, min, max, pct, first };
  }, [sourceData, cfg]);
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
});

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
            <Bar dataKey="btc" radius={[0, 8, 8, 0]} isAnimationActive={false}>
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

  // Full-history walk; memoized so the useCountUp animation frames below
  // (~60 fps for ~1.5 s) don't redo the whole DCA simulation every frame.
  const outcome = useMemo(
    () => computeDcaOutcome(longTermChart, weekly, currentPrice),
    [longTermChart, weekly, currentPrice],
  );
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

  // Full-history scan; memoized for the same reason as the DCA block above.
  const live = useMemo(() => computeMaxDrawdown(longTermChart), [longTermChart]);
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
