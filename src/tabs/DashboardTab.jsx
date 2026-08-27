import { useState, useMemo, memo } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Line, ReferenceLine } from "recharts";
import { FALLBACK_MINED, FALLBACK_BLOCK, FALLBACK_ATH, FALLBACK_ATH_DATE } from "../data/fallbacks.js";
import { MARKET_THEME, CURATED_MARKET_UPDATES } from "../data/market-news.js";
import { COUNTRY_HOLDINGS, COMPANY_HOLDINGS } from "../data/adoption.js";
import { SUPPLY_HISTORY } from "../data/supply-history.js";
import { TOTAL_SUPPLY, HALVING_BLOCK } from "../lib/constants.js";
import { fmt, fmtUSD, formatRemainingTime, formatElapsed, marketCapComparison, isImportantHeadline } from "../lib/format.js";
import { useElapsed, Pulse, useIsMobile, Reveal, usePersistedState } from "../hooks/ui.jsx";
import { SourceLink, Term, Prose, StatCard, StatStrip, SectionGroup, SupplyMeter, DipExplainerCard, PriceDisplay, ErrorBanner, buildMarketPulse, MarketPulseCard } from "../components/shared.jsx";
import { AnalysisCard, WatchRow, DeepAnalysisTab } from "./AnalysisTab.jsx";
import { GLOSSARY } from "../data/glossary.js";
import { buildMatcher, linkCard } from "../lib/glossary-match.js";

// Glossary segmentation happens ONCE, here, not during render: CURATED_MARKET_UPDATES
// and GLOSSARY are build-time constants, and this component re-renders every second
// via useElapsed on the block timer — a render-time first-occurrence Set would drop
// every link one tick after mount.
const GLOSSARY_MATCHER = buildMatcher(GLOSSARY);
const CURATED_SEGMENTS = CURATED_MARKET_UPDATES.map(
  (u) => linkCard([u.detail ?? ""], GLOSSARY_MATCHER, 5).segments[0]
);

// ─── PRICE CHART (unified, time-range selector) ─────────────────
// target = number of visual data points to render for each range (uniform density)
export const PRICE_CHART_RANGES = [
  { id: "7D",  label: "7D",  days: 7,        source: "seven",  target: 168 },  // all ~168 hourly pts from sparkline
  { id: "1M",  label: "1M",  days: 30,       source: "medium", target: 180 },  // ~720 hourly pts → 180 visual
  { id: "3M",  label: "3M",  days: 90,       source: "medium", target: 180 },  // ~2160 hourly pts → 180 visual
  { id: "1Y",  label: "1Y",  days: 365,      source: "long",   target: 250 },  // ~365 daily pts → 250 (all daily)
  { id: "5Y",  label: "5Y",  days: 1825,     source: "long",   target: 200 },  // ~1825 daily pts → 200 visual
  { id: "ALL", label: "ALL", days: Infinity,  source: "long",   target: 300 },  // all-time → 300 visual
];

export const ChartTooltipBody = ({ active, payload, prevPrice }) => {
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

export const PriceChart = memo(({ sevenDay, mediumTerm, longTerm }) => {
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
export const BTC_GENESIS_MS = Date.UTC(2009, 0, 3);   // genesis block, 2009-01-03
export const FIT_FREEZE_MS = Date.UTC(2021, 0, 1);    // fit uses data through 2020-12-31; later = out-of-sample
export const FIT_FREEZE_LABEL = "Jan 2021";
export const HALVINGS = [
  { label: "1st", t: Date.UTC(2012, 10, 28) },  // 2012-11-28
  { label: "2nd", t: Date.UTC(2016, 6, 9) },    // 2016-07-09
  { label: "3rd", t: Date.UTC(2020, 4, 11) },   // 2020-05-11
  { label: "4th", t: Date.UTC(2024, 3, 20) },   // 2024-04-20 (block 840,000)
];

// Ordinary least-squares fit of ln(price) on ln(days since genesis).
export const fitPowerLaw = (points) => {
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

export const trendAt = (model, t) => {
  const days = (t - BTC_GENESIS_MS) / 86400000;
  return days > 0 ? Math.exp(model.a + model.b * Math.log(days)) : null;
};

export const PowerLawTooltip = ({ active, payload, model }) => {
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

export const PowerLawChart = ({ longTerm }) => {
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

export const PowerLawStat = ({ label, value, accent }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-mono)", marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: "var(--fs-md)", fontWeight: 800, fontFamily: "var(--font-mono)", color: accent || "var(--text-primary)" }}>{value}</div>
  </div>
);

// ─── DASHBOARD TAB ──────────────────────────────────────────────
// Probability badge — green (≥0.65), amber (0.45–0.65), warn (<0.45). Module-scope so
// AnalysisCard, WatchRow, and DeepAnalysisTab all share one renderer.
export const pBadge = (p, label = "p") => {
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

export const DashboardTab = ({ btc, setActiveTab }) => {
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
                  {/* Plain text only — a <Term> here would swallow the expand click. */}
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", fontWeight: 600, lineHeight: 1.35 }}>{update.title}</span>
                    {update.plain && (
                      <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontWeight: 400, lineHeight: 1.4 }}>{update.plain}</span>
                    )}
                  </span>
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
                    {update.plain && (
                      <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", fontWeight: 600, lineHeight: 1.45, marginBottom: 8 }}>
                        {update.plain}
                      </div>
                    )}
                    {/* Body copy is sans, not mono: this is 150+ words of prose for a
                        newcomer, and a monospace wall at --text-tertiary was the least
                        readable block on the dashboard. */}
                    <Prose
                      as="div"
                      segments={CURATED_SEGMENTS[index]}
                      style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
                    />
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
            value="3,704 BTC"
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
            value="843,775 BTC"
            sub={<>Largest single corporate holder · ~4.2% of supply · <SourceLink href="https://www.strategy.com/" label="strategy.com" /></>}
          />
          <StatStrip
            label="US Spot Bitcoin ETFs"
            value="~1.30M BTC"
            sub={<>~$84B AUM · 6.5% of supply · <SourceLink href="https://farside.co.uk/btc/" label="farside.co.uk" /></>}
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
