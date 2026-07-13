import { useState, useEffect, useRef, useMemo } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceArea } from "recharts";
import { WORKED_EXAMPLE, RETAIL_REALITY, STRATEGY_RULES, CUSTODY_LADDER, ALLOCATION_BANDS, COMMON_MISTAKES, HISTORICAL_DRAWDOWNS, DRAWDOWN_CAVEAT, STRATEGY_SOURCES, DCA_WEEKLY_OPTIONS } from "../data/strategy.js";
import { fmt } from "../lib/format.js";
import { computeDcaOutcome, computeMaxDrawdown } from "../lib/market-math.js";
import { useIsMobile, shouldAnimate, Reveal, useCountUp } from "../hooks/ui.jsx";
import { Skeleton, Term } from "../components/shared.jsx";

// ─── STRATEGY TAB ───────────────────────────────────────────────
export const StrategyHeader = () => (
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

export const StrategyPrincipleCard = ({ eyebrow, title, accent, bullets }) => (
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

export const StrategyWorkedExample = () => (
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

export const StrategyRetailReality = () => (
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

export const StrategyRules = () => (
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

export const StrategyDcaBlock = ({ longTermChart, currentPrice }) => {
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

export const StrategyVolatility = ({ longTermChart }) => {
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

export const CHECK_CADENCE_OPTIONS = [
  { key: "daily", label: "Daily", days: 1 },
  { key: "monthly", label: "Monthly", days: 30 },
  { key: "yearly", label: "Yearly", days: 365 },
];

export const computeCheckCadence = (longTermChart, days) => {
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

export const StrategyCheckCadence = ({ longTermChart }) => {
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

export const StrategyCustodyLadder = () => (
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

export const StrategyAllocationBands = () => (
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

export const StrategyMistakes = () => (
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

export const StrategySources = () => (
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

export const StrategyTab = ({ btc, setActiveTab }) => {
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
