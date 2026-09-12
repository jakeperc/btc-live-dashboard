import { useState, useEffect, useLayoutEffect, useRef, useMemo, useId } from "react";
import { createPortal } from "react-dom";
import { DIP_EXPLAINER } from "../data/explainer.js";
import { GLOSSARY } from "../data/glossary.js";
import { fmt, fmtUSD } from "../lib/format.js";
import { Pulse, prefersReducedMotion, useIsMobile, Reveal } from "../hooks/ui.jsx";

export const Skeleton = ({ width = "100%", height = 16, radius = 6, style }) => (
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
export const DataSource = ({ source, updatedAt }) => {
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
export const SourceLink = ({ href, label }) => (
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

// Definitions live in src/data/glossary.js so the refresh automations and
// scripts/check-plain.mjs can read them without importing React. This map keeps
// every existing <Term k="…"> call site working unchanged.
export const TERM_DEFINITIONS = Object.fromEntries(GLOSSARY.map((g) => [g.key, g.plain]));

const BOTTOM_NAV_SAFE_AREA = 88; // mobile tab bar; a popover under this is unreadable

export const Term = ({ k, children }) => {
  const def = TERM_DEFINITIONS[k];
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const popId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    // Deliberately NOT closing on scroll: a term on the last visible line opens
    // below the fold, and the scroll needed to read it used to dismiss it.
    // Resize genuinely invalidates the anchor rect, so that one still closes.
    const onResize = () => setOpen(false);
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Flip above the anchor when opening downward would run off the bottom.
  useLayoutEffect(() => {
    if (!open || !popRef.current || !btnRef.current) return;
    const anchor = btnRef.current.getBoundingClientRect();
    const popHeight = popRef.current.offsetHeight;
    const below = anchor.bottom + 8;
    const fitsBelow = below + popHeight <= window.innerHeight - BOTTOM_NAV_SAFE_AREA;
    const top = fitsBelow ? below : Math.max(12, anchor.top - popHeight - 8);
    setPos((prev) => (Math.abs(prev.top - top) < 1 ? prev : { ...prev, top }));
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

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      onTap(e);
    }
  };

  return (
    <>
      {/* A <span role="button">, not a real <button>: browsers blockify form
          controls, so a <button> is stuck at inline-block and a multi-word term
          ("at-the-market issuance") cannot wrap across a line break. A span with
          button semantics + key handling is inline, wraps naturally, and cannot
          nest illegally inside another interactive element. */}
      <span
        ref={btnRef}
        role="button"
        tabIndex={0}
        className="term"
        aria-expanded={open}
        // No aria-label: it would REPLACE the visible word in the accessible name,
        // so a linked paragraph would read as "…the spot Define ETF button flows…".
        // The definition is exposed as a description instead.
        aria-describedby={open ? popId : undefined}
        onClick={onTap}
        onKeyDown={onKeyDown}
        style={{
          display: "inline",
          color: "inherit",
          font: "inherit",
          letterSpacing: "inherit",
          cursor: "help",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
      </span>
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          id={popId}
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

// Renders pre-segmented text produced by linkCard() in src/lib/glossary-match.js.
//
// Stateless by design. Segmentation is a BUILD-TIME concern — the glossary and the
// data modules are frozen constants — so it happens once at module scope in the tab
// files. Tracking "first occurrence" with a Set mutated during render would break
// on the very next render, and DashboardTab re-renders every second.
export const Prose = ({ segments, as: Tag = "span", style, className }) => {
  if (!Array.isArray(segments)) return null;
  return (
    <Tag style={style} className={className}>
      {segments.map((seg, i) =>
        seg?.key
          ? <Term key={i} k={seg.key}>{seg.text}</Term>
          : <span key={i}>{seg?.text ?? ""}</span>
      )}
    </Tag>
  );
};

export const TabNavChip = ({ label, tab, setActiveTab }) => (
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

export const StatCard = ({ label, value, sub, accent, large, loading, source, updatedAt }) => (
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
export const StatStrip = ({ label, value, sub, valueColor, loading }) => (
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
export const SectionGroup = ({ title, children, collapsible = false, defaultExpanded = true }) => {
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
export const SUPPLY_CAP_PAD = 8; // px of screen-space padding inside the meter; x stays LINEAR in pct
export const supplyPctToLeft = (pct) => {
  const p = Math.max(0, Math.min(100, pct));
  return `calc(${SUPPLY_CAP_PAD}px + (100% - ${2 * SUPPLY_CAP_PAD}px) * ${p / 100})`;
};
export const fmtBtcCompact = (n) => {
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return Math.round(n / 1e3) + "K";
  return String(Math.round(n));
};

export const SupplyMeter = ({ mined, total, history }) => {
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
export const DipExplainerCard = ({ fromATH, theme, setActiveTab }) => {
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
        padding: "10px 14px",
        background: "var(--elev-recessed-bg)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md, 10px)",
        boxShadow: "var(--elev-recessed-shadow)",
      }}>
        <span aria-hidden="true" style={{
          width: 7, height: 7, borderRadius: "50%", alignSelf: "center", flexShrink: 0,
          background: down ? "var(--status-down)" : "var(--status-up)",
        }} />
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
          <div className="elev-raised" style={{
            padding: "16px 18px",
            borderRadius: "var(--radius-md, 10px)",
          }}>
            <div className="kicker-dash" style={{ fontSize: 10, color: "var(--accent-bitcoin)", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
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

export const PriceDisplay = ({ price, change24h, lastUpdate, loading, fearGreedValue, fearGreedClass }) => {
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

export const ErrorBanner = ({ message, lastUpdate }) => {
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


// Bundles the dominant market theme with sentiment values.
// Theme is the editorial lede; F&G is surfaced separately by the price card.
export const buildMarketPulse = ({ change24h, fearGreed, theme }) => {
  const pct = typeof change24h === "number" ? change24h : null;
  return {
    theme,
    change24h: pct,
    fearGreedValue: fearGreed?.value,
    fearGreedClass: fearGreed?.classification,
  };
};

export const MarketPulseCard = ({ pulse, streakDays, setActiveTab }) => {
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
    <div className="market-pulse-card elev-raised" style={{
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
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.04)",
              }}>
                {theme.status}
              </span>
            )}
          </div>

          {/* Why it matters is the plain-English stakes, so it is what stays visible
              when the card is collapsed. The milestone — a dense, dated, jargon-heavy
              checkpoint — moved into the expanded body. Consequence first. */}
          {theme.whyItMatters && (
            <div style={{
              fontSize: "var(--fs-sm)", color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.5,
              padding: "8px 12px", background: toneSoft,
              borderRadius: "var(--radius-sm)",
            }}>
              <span style={{
                fontWeight: 700, color: toneColor,
                fontSize: "var(--fs-xs)", textTransform: "uppercase",
                letterSpacing: 1.1, fontFamily: "var(--font-mono)", marginRight: 8,
              }}>
                Why it matters
              </span>
              {theme.whyItMatters}
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

              {theme.milestone && (
                <div style={{
                  fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)", lineHeight: 1.55,
                }}>
                  <span style={{
                    fontWeight: 700, color: "var(--text-primary)",
                    fontSize: "var(--fs-xs)", textTransform: "uppercase",
                    letterSpacing: 1.1, fontFamily: "var(--font-mono)", marginRight: 8,
                  }}>
                    {theme.milestoneLabel || "Next Checkpoint"}
                  </span>
                  {theme.milestone}
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

export const DataStatus = ({ lastUpdate, error, loading }) => {
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

export const ThemeToggle = ({ theme, onChange }) => {
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
