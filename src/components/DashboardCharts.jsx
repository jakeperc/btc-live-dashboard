// The Dashboard's two recharts charts, kept in their own module so the chart
// engine (vendor-charts, ~108 kB gzipped) is NOT part of the first-paint
// bundle. DashboardTab.jsx starts downloading this chunk the moment it is
// evaluated and renders a card-shaped placeholder until it lands, so the
// price, the Market Pulse card and the stat tiles paint without waiting for it.
import { useMemo, memo } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Line, ReferenceLine } from "recharts";
import { fmt, fmtUSD } from "../lib/format.js";
import { useIsMobile, usePersistedState } from "../hooks/ui.jsx";
import { SourceLink, radioGroupKeyDown } from "./shared.jsx";

// ─── PRICE CHART (unified, time-range selector) ─────────────────
// target = number of visual data points to render for each range (uniform density)
export const PRICE_CHART_RANGES = [
  { id: "7D",  label: "7D",  days: 7,        source: "seven",  target: 168 },  // all ~168 hourly pts from sparkline
  { id: "1M",  label: "1M",  days: 30,       source: "medium", target: 180 },  // ~720 hourly pts → 180 visual
  { id: "3M",  label: "3M",  days: 90,       source: "medium", target: 180 },  // ~2160 hourly pts → 180 visual
  { id: "1Y",  label: "1Y",  days: 365,      source: "long",   target: 250 },  // ~90 pts (one close every 4 days), all drawn
  { id: "5Y",  label: "5Y",  days: 1825,     source: "long",   target: 200 },  // ~455 pts → ~200 visual
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
        fontSize: 11, fontWeight: 500,
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

export const PriceChart = memo(({ sevenDay, mediumTerm, longTerm, sevenDaySettled = false }) => {
  const [range, setRange] = usePersistedState("btc-dashboard.chartRange", "7D");
  const cfg = PRICE_CHART_RANGES.find((r) => r.id === range) || PRICE_CHART_RANGES[0];
  const isMobile = useIsMobile();

  // Source selection: seven=7D sparkline, medium=CoinGecko 90d hourly, long=blockchain.info all-time (one close every 4 days).
  // 7D normally comes from CoinGecko's sparkline. If that request has FAILED
  // (not merely "not answered yet" — hence sevenDaySettled, so a healthy load
  // never draws the chart twice) and the 90-day hourly series is here, its
  // last seven days are the same data — better than "Loading chart…" forever.
  // Only when that series is itself current: a cached copy that ends hours
  // ago would pass for a live 7-day chart, so it is not used.
  const sevenFromMedium = useMemo(() => {
    if (cfg.source !== "seven" || !sevenDaySettled) return null;
    if (Array.isArray(sevenDay) && sevenDay.length > 0) return null;
    if (!Array.isArray(mediumTerm) || mediumTerm.length === 0) return null;
    const now = Date.now();
    if (now - mediumTerm[mediumTerm.length - 1].t > 3 * 3600 * 1000) return null;
    const recent = mediumTerm.filter((p) => p.t >= now - 7 * 24 * 3600 * 1000);
    return recent.length > 1 ? recent : null;
  }, [cfg.source, sevenDay, mediumTerm, sevenDaySettled]);
  const sourceData = cfg.source === "seven" ? (sevenFromMedium || sevenDay) : cfg.source === "medium" ? mediumTerm : longTerm;
  // The window/downsample/min-max pass walks the full history (~1,600
  // points on ALL), so it only re-runs when the source array or range changes —
  // not on the 30 s price polls that re-render the Dashboard around this chart.
  const { data, min, max, pct, first } = useMemo(() => {
    const data = (() => {
      if (!Array.isArray(sourceData) || sourceData.length === 0) return [];
      if (cfg.source === "seven") return sourceData;

      // Long-term data is one close every 4 days. Filter to the requested window by timestamp (not
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
        <div role="radiogroup" aria-label="Chart time range" className="segmented-pill" onKeyDown={radioGroupKeyDown}>
          {PRICE_CHART_RANGES.map((r) => {
            // cfg, not the stored value: an unknown stored range falls back to
            // the first option, and that option must be the checked, tabbable one.
            const active = cfg.id === r.id;
            return (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setRange(r.id)}
              >{r.label}</button>
            );
          })}
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ height: isMobile ? 180 : 380, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 16px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)" }}>
          {/* Once the 7-day request has failed and there is no current
              fallback, say so — "Loading…" would never come true. */}
          {cfg.source === "seven" && sevenDaySettled ? "7-day chart unavailable right now — try 1Y or ALL" : "Loading chart…"}
        </div>
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
              tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false}
              tickLine={false}
              interval={data.length > 12 ? Math.max(0, Math.floor(data.length / 6)) : "preserveStartEnd"}
              minTickGap={20}
              tickFormatter={(v) => String(v ?? "").toUpperCase()}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
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

const POWER_LAW_DRAW_POINTS = 2000;

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
      <div style={{ color: "var(--text-muted)", marginBottom: 6, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", fontSize: 11, fontWeight: 500 }}>{dateStr}</div>
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

// memo: the Dashboard around it re-renders on every 30 s price poll, and this
// chart only depends on the long-term series, which refreshes hourly.
export const PowerLawChart = memo(({ longTerm }) => {
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

    // Draw at most ~POWER_LAW_DRAW_POINTS points. Every statistic above (fit,
    // calibration, σ-deviation, the Y domain) is computed on the full series;
    // only the SVG paths are thinned. Today the source sends one close every
    // four days (~1,600 points), which is drawn whole; the cap is there so a
    // switch to daily data (~6,000 points across four series) cannot quietly
    // make every hover and resize sluggish. The latest close is always kept
    // so the line ends where the stats say.
    const stride = Math.ceil(series.length / POWER_LAW_DRAW_POINTS);
    const drawn = stride <= 1 ? series : series.filter((_, i) => i % stride === 0 || i === series.length - 1);

    return { model, series: drawn, oos, cal1: oos ? (w1 / oos) * 100 : null, cal2: oos ? (w2 / oos) * 100 : null, z, domain: [loDec, hiDec], decades, halvings, currentPrice: lastPt.price, currentTrend: lastPt.trend };
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
            {calc ? <>Halvings marked · fit frozen at {FIT_FREEZE_LABEL}</> : "All-time price history"}
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
        <div style={{ height: isMobile ? 220 : 400, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)" }}>Loading chart…</div>
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
              tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false} tickLine={false} tickFormatter={yearFmt} minTickGap={40}
            />
            <YAxis
              scale="log" domain={calc.domain} ticks={calc.decades} allowDataOverflow
              tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}
              axisLine={false} tickLine={false} tickFormatter={fmtDecade} width={isMobile ? 48 : 46}
            />
            <Tooltip content={<PowerLawTooltip model={calc.model} />} cursor={{ stroke: "var(--border-strong)", strokeDasharray: "2 4", strokeWidth: 1 }} />
            {calc.halvings.map((h) => (
              <ReferenceLine key={h.t} x={h.t} stroke="var(--text-muted)" strokeDasharray="3 4" strokeOpacity={0.5}
                label={{ value: `⌛${h.label}`, position: "insideTopLeft", fill: "var(--text-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
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
            Model: <span style={{ color: "var(--text-muted)" }}>ln(price) = {calc.model.a.toFixed(2)} + {calc.model.b.toFixed(2)}·ln(days since genesis)</span>, fit on {fmt(calc.model.n)} closing prices (one every four days) through {FIT_FREEZE_LABEL}.
            {calc.cal1 != null && <> Out-of-sample, price closed within ±1σ on <span style={{ color: "var(--text-muted)" }}>{calc.cal1.toFixed(0)}%</span> and ±2σ on <span style={{ color: "var(--text-muted)" }}>{calc.cal2.toFixed(0)}%</span> of the {fmt(calc.oos)} readings since.</>}
            {" "}A power law assumes a non-stationary process keeps behaving — it can break. Descriptive, not a forecast or buy/sell signal. <SourceLink href="https://www.blockchain.com/explorer/charts/market-price" label="blockchain.com" />
          </div>
        </>
      )}
    </div>
  );
});

export const PowerLawStat = ({ label, value, accent }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-mono)", marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: "var(--fs-md)", fontWeight: 800, fontFamily: "var(--font-mono)", color: accent || "var(--text-primary)" }}>{value}</div>
  </div>
);
