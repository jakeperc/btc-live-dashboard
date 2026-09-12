import { useState, useEffect, useRef, useMemo } from "react";
import { XAxis, YAxis, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from "recharts";
import { THESIS_METRICS, THESIS_EPIGRAPH, SOFT_MONEY_COSTS, MONEY_INTRO, MONEY_SCORECARD, SILENT_TAX_PIN_TOP, SILENT_TAX_M2_DATA, SILENT_TAX_CHAPTERS, SILENT_TAX_EVENTS, SILENT_TAX_GUESS, SILENT_TAX_STEPS, SILENT_TAX_CODA, PP_BY_YEAR, SILENT_TAX_CAVEAT, SILENT_TAX_INTL, BTC_ISSUANCE_DATA, MONEY_HISTORY, DIGITAL_SCARCITY, SUPPLY_CAP_GUESS, HARDNESS_DATA, PROPERTIES_MATRIX, MYTHS, TIME_PREFERENCE, TIME_PREFERENCE_STORY, THESIS_FLOW, POSITIONING_LENSES } from "../data/thesis.js";
import { prefersReducedMotion, useIsMobile, Reveal, useActiveSection, useScrollSpy, useScrollProgress, useCountUp, parseNumericMetric } from "../hooks/ui.jsx";
import { Term, TabNavChip } from "../components/shared.jsx";

// Linear interpolation through SILENT_TAX_M2_DATA. Scroll progress 0..1 → real historical state.
// Used by the pinned scrolly's counter, year ticker, and playhead — drives the *actual* decay curve.
export const silentTaxDataAtProgress = (p) => {
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
export const PhaseHeader = ({ phase, label, title, sub, accent = "#f7931a", phaseRef, idAnchor }) => {
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
export const SilentTaxPlayheadDriver = ({ wrapRef, counterRef, yearRef, chartRef, setPlayheadIdx, codaActive }) => {
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

export const SilentTaxScrollHint = ({ wrapRef }) => {
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

export const ThesisSilentTaxPinnedDesktop = () => {
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

export const ThesisSilentTaxFallback = () => {
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
            <article className="thesis-pinned-fallback-chapter">
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
export const SilentTaxStepCard = ({ step, from }) => {
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
    <article ref={ref} className="thesis-tax-step">
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

export const GuessReveal = ({ quiz: g, groupLabel }) => {
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

export const ThesisSilentTaxStepped = () => {
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

export const SilentTaxIntro = () => {
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

export const ThesisSilentTaxPinned = () => {
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

export const ThesisMetricCard = ({ metric, index }) => {
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

export const ThesisHero = () => {
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

export const ThesisWhatIsMoney = () => (
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

export const ThesisProblem = () => (
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

export const ThesisSilentTaxPersonal = () => {
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

export const ThesisHistory = () => (
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

export const ThesisDigitalScarcity = () => (
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

export const ThesisHardness = () => {
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

export const ThesisScene = ({ move, sceneRef, idAnchor }) => (
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

export const ThesisScrolly = () => {
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

export const ThesisProperties = () => {
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

export const ThesisMyths = () => (
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

export const ThesisTimePreference = ({ setActiveTab }) => (
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

export const ThesisLenses = () => (
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

export const THESIS_PHASES = [
  { num: "01", label: "Basics",       anchor: "thesis-phase-basics",       accent: "#ef4444" },
  { num: "02", label: "Intermediate", anchor: "thesis-phase-intermediate", accent: "#f7931a" },
  { num: "03", label: "Advanced",     anchor: "thesis-phase-advanced",     accent: "#22c55e" },
];

export const BitcoinThesisTab = ({ setActiveTab }) => {
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
