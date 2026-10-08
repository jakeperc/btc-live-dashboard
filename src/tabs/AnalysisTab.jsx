import { useState } from "react";
import { DEEP_ANALYSIS } from "../data/deep-analysis.js";
import { FORECAST_LEDGER } from "../data/forecast-ledger.js";
import { GLOSSARY, GLOSSARY_BY_KEY } from "../data/glossary.js";
import { buildMatcher, linkNamed, linkCard } from "../lib/glossary-match.js";
import { ANCHORS, tabHref, navigateTo } from "../lib/routes.js";
import { useIsMobile } from "../hooks/ui.jsx";
import { Term, Prose, SectionGroup, DipExplainerCard, StaleNotice, isPlainClick } from "../components/shared.jsx";
import { pBadge } from "./DashboardTab.jsx";

// ─── Glossary segmentation, computed ONCE at module scope ────────────────────
// DEEP_ANALYSIS and GLOSSARY are build-time constants, so which words get linked
// can never change at runtime. Doing this during render — with a Set tracking
// "first occurrence" — would drop every link on the next re-render (this tab stays
// mounted and re-renders on each price poll) and would break under StrictMode.
//
// One scope per collapsible card: the main read, each watch row, the contrarian
// take. Within a scope only the first occurrence of a term is linked, capped, so a
// paragraph never turns into a field of buttons for a screen-reader user.
const MATCHER = buildMatcher(GLOSSARY);
const _A = DEEP_ANALYSIS ?? {};
const _PRIMARY = _A.primaryAnalysis ?? {};
const _CC = _A.crossCurrents ?? [];

const MAIN_READ = linkNamed(
  [
    ...(_PRIMARY.body ?? []).map((p, i) => [`body${i}`, p]),
    ["marketContext", _A.marketContext ?? ""],
    ..._CC.flatMap((c, i) => [[`cc${i}`, c?.body ?? ""]]),
    ...(_PRIMARY.falsificationConditions ?? []).map((c, i) => [`fals${i}`, c]),
  ],
  MATCHER,
  8
);

const WATCH_SIGNALS = (_A.watchList ?? []).map(
  (w) => linkCard([w?.signal ?? ""], MATCHER, 4).segments[0]
);

const CONTRARIAN_BODY = linkCard(
  [typeof _A.contrarianTake === "string" ? _A.contrarianTake : (_A.contrarianTake?.body ?? "")],
  MATCHER,
  4
).segments[0];

// Every term the page actually links, for the "Terms on this page" panel — the only
// glossary affordance that works on a phone, where a dotted underline is easy to miss.
const PAGE_TERMS = [...new Set([
  ...MAIN_READ.keys,
  ...WATCH_SIGNALS.flat().filter((s) => s.key).map((s) => s.key),
  ...CONTRARIAN_BODY.filter((s) => s.key).map((s) => s.key),
])].map((k) => GLOSSARY_BY_KEY[k]).filter(Boolean);

// Collapse-by-default card for the Analysis tab: an easy-to-read summary stays in the
// header; the technical depth lives in the expanded body. Mirrors DipExplainerCard's
// toggle so it collapses on every viewport (SectionGroup is desktop-always-open).
export const AnalysisCard = ({ eyebrow, eyebrowColor, summary, badge, accent, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="elev-raised" style={{
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
            <span className="kicker-dash" style={{
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
          <span aria-hidden="true" style={{ display: "inline-block", fontSize: 11, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
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
export const WatchRow = ({ item, signalSegments = null }) => {
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
                fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
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
          <span aria-hidden="true" style={{ display: "inline-block", fontSize: 11, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
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
          <Prose
            as="div"
            segments={signalSegments ?? [{ text: item.signal }]}
            style={{
              fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.65,
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Track record — the forecast ledger, rendered ────────────────────────────
// Letter grade for a Brier score. The one place the thresholds live; the summary
// strip and anything else that labels a score call this.
export const gradeFor = (b) => b == null ? null
  : b < 0.06 ? { grade: "A+", color: "var(--status-up)",      label: "Exceptional" }
  : b < 0.10 ? { grade: "A",  color: "var(--status-up)",      label: "Strong" }
  : b < 0.14 ? { grade: "B+", color: "#4ade80",               label: "Good" }
  : b < 0.18 ? { grade: "B",  color: "var(--accent-bitcoin)", label: "Adequate" }
  : b < 0.22 ? { grade: "C+", color: "var(--status-warn)",    label: "Fair" }
  :            { grade: "C",  color: "var(--status-down)",    label: "Recalibrating" };

const CATEGORY_LABELS = {
  macro: "Macro", corporate: "Corporate", etf: "ETF flows", regulation: "Regulation",
  protocol: "Protocol", sovereign: "Sovereign", "market-structure": "Market structure",
};
const categoryLabel = (c) => CATEGORY_LABELS[c] ?? c;

// hit / miss / no-resolution → the words a newcomer reads, plus the status colour of the dot.
// There is no partial credit: a forecast either met the wording of its own letter or it did not.
// "No resolution" is a forecast whose wording cannot decide it — shown, but scored nowhere.
const OUTCOME_META = {
  hit:             { label: "Happened",       color: "var(--status-up)" },
  miss:            { label: "Did not happen", color: "var(--status-down)" },
  "no-resolution": { label: "No resolution",  color: "var(--text-muted)" },
};
const scoreText = (r) => r.brier == null ? "—" : Number(r.brier).toFixed(2);

const pctText = (p) => `${Math.round(p * 100)}%`;
const oddsText = (r) => r.count > 1 && Array.isArray(r.probabilities)
  ? `${r.count} forecasts · ${r.probabilities.map(pctText).join(", ")}`
  : pctText(r.probability);
// Every scored forecast is a hit or a miss, so a band reads as a whole count: "3 of 11".
const bandHits = (b) => String(Math.round(b.hitRate * b.n));

const MONO_LABEL = {
  fontSize: "var(--fs-xs)", color: "var(--text-muted)", textTransform: "uppercase",
  letterSpacing: 1.1, fontWeight: 700, fontFamily: "var(--font-mono)",
};

const OutcomeDot = ({ outcome }) => {
  const m = OUTCOME_META[outcome] ?? { label: outcome, color: "var(--text-muted)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
      {m.label}
    </span>
  );
};

const LedgerSource = ({ source }) => source?.url ? (
  <a href={source.url} target="_blank" rel="noopener noreferrer" title={source.label} style={{
    color: "var(--text-muted)", textDecoration: "underline",
    textDecorationColor: "var(--border-subtle)", textUnderlineOffset: 2,
    fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap",
  }}>
    Source
  </a>
) : null;

// The recruiter surface. The summary strip (grade, score, count, bands, where we
// lean) is always visible; the full table of every scored forecast sits in a
// collapsed AnalysisCard beneath it. On phones the table becomes stacked rows so
// nothing scrolls sideways.
export const TrackRecord = ({ ledger = FORECAST_LEDGER }) => {
  const isMobile = useIsMobile(760);
  if (!ledger || !ledger.summary) return null;
  const s = ledger.summary;
  const rows = ledger.resolved ?? [];
  const grade = gradeFor(s.aggregateBrier);
  const mono = { fontFamily: "var(--font-mono)", fontWeight: 700 };
  const cell = {
    padding: "10px 8px", verticalAlign: "top", borderBottom: "1px solid var(--border-subtle)",
    fontSize: "var(--fs-xs)", fontFamily: "var(--font-sans)", lineHeight: 1.5,
    color: "var(--text-primary)", overflowWrap: "anywhere",
  };
  const th = { ...cell, ...MONO_LABEL, textAlign: "left", borderBottom: "1px solid var(--border-strong)", whiteSpace: "nowrap" };

  const table = (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: 96 }} />
        <col />
        <col style={{ width: 96 }} />
        <col style={{ width: 118 }} />
        <col style={{ width: 58 }} />
        <col style={{ width: 62 }} />
      </colgroup>
      <thead>
        <tr>
          <th style={th} scope="col">Made</th>
          <th style={th} scope="col">Forecast</th>
          <th style={th} scope="col">Our odds</th>
          <th style={th} scope="col">What happened</th>
          <th style={th} scope="col">Score</th>
          <th style={th} scope="col">Source</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td style={{ ...cell, ...mono, color: "var(--text-muted)" }}>
              <div style={{ whiteSpace: "nowrap" }}>{r.made}</div>
              <div style={{ fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>{categoryLabel(r.category)}</div>
            </td>
            <td style={cell}>
              <div style={{ fontWeight: 600 }}>{r.event}</div>
              {r.lesson && <div style={{ color: "var(--text-secondary)", marginTop: 4 }}>{r.lesson}</div>}
            </td>
            <td style={{ ...cell, ...mono }}>{oddsText(r)}</td>
            <td style={cell}><OutcomeDot outcome={r.outcome} /></td>
            <td style={{ ...cell, ...mono }}>{scoreText(r)}</td>
            <td style={cell}><LedgerSource source={r.source} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const stacked = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((r) => (
        <div key={r.id} style={{
          background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "12px 14px",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ ...MONO_LABEL, letterSpacing: 0.6 }}>{r.made} · {categoryLabel(r.category)}</div>
          <div style={{
            fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-primary)",
            fontFamily: "var(--font-sans)", lineHeight: 1.45,
          }}>
            {r.event}
          </div>
          <dl style={{
            margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 12, rowGap: 4,
            fontSize: "var(--fs-xs)", fontFamily: "var(--font-sans)", color: "var(--text-primary)", alignItems: "baseline",
          }}>
            <dt style={MONO_LABEL}>Our odds</dt><dd style={{ margin: 0, ...mono }}>{oddsText(r)}</dd>
            <dt style={MONO_LABEL}>What happened</dt><dd style={{ margin: 0 }}><OutcomeDot outcome={r.outcome} /></dd>
            <dt style={MONO_LABEL}>Score</dt><dd style={{ margin: 0, ...mono }}>{scoreText(r)}</dd>
            <dt style={MONO_LABEL}>Source</dt><dd style={{ margin: 0 }}><LedgerSource source={r.source} /></dd>
          </dl>
          {r.lesson && (
            <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
              {r.lesson}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section
      id={ANCHORS.trackRecord}
      aria-labelledby="track-record-heading"
      style={{ scrollMarginTop: 110, display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* Summary strip — always visible, never collapsed */}
      <div className="elev-raised" style={{
        borderRadius: "var(--radius-lg)", padding: "16px 20px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 id="track-record-heading" className="kicker-dash" style={{ ...MONO_LABEL, color: "var(--accent-bitcoin)", letterSpacing: 1.2, margin: 0 }}>
            Track record · every forecast, scored
          </h2>
          {ledger.asOf && <span style={{ ...MONO_LABEL, letterSpacing: 0.6 }}>Updated {ledger.asOf}</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {grade && (
            <div
              className="confidence-grade-badge"
              style={{ color: grade.color, background: `color-mix(in srgb, ${grade.color} 10%, transparent)` }}
              aria-label={`Grade ${grade.grade}, ${grade.label}`}
            >
              {grade.grade}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--fs-xl, 22px)", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-primary)", lineHeight: 1 }}>
                {s.aggregateBrier != null ? Number(s.aggregateBrier).toFixed(2) : "—"}
              </span>
              <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                <Term k="brier">Brier score</Term>{grade ? ` · ${grade.label}` : ""}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", ...MONO_LABEL, letterSpacing: 0.6 }}>
              <span>{s.nResolved} forecasts scored</span>
              {s.rolling20Brier != null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>last 20: {Number(s.rolling20Brier).toFixed(2)}</span>
                </>
              )}
              {ledger.openCount != null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{ledger.openCount} still open</span>
                </>
              )}
            </div>
          </div>
        </div>

        {s.plain && (
          <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", lineHeight: 1.55, maxWidth: 920 }}>
            {s.plain}
          </div>
        )}

        {s.bands?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {s.bands.map((b) => (
              <span key={b.range} style={{
                fontSize: "var(--fs-xs)", fontFamily: "var(--font-mono)", color: "var(--text-secondary)",
                background: "var(--bg-card-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)", padding: "4px 9px", whiteSpace: "nowrap",
              }}>
                Called {b.range}: {bandHits(b)} of {b.n} happened
              </span>
            ))}
          </div>
        )}

        {s.byCategory?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={MONO_LABEL}>Where we lean</div>
            {s.byCategory.map((c) => (
              <div key={c.category} style={{ fontSize: "var(--fs-xs)", fontFamily: "var(--font-sans)", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{categoryLabel(c.category)}</span>
                <span style={{ color: "var(--text-muted)" }}> · {c.n} scored · </span>
                {c.plain}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Every scored forecast — collapsed by default; table on desktop, stacked rows on phones */}
      {rows.length > 0 && (
        <AnalysisCard
          eyebrow={`Every scored forecast · ${s.nResolved}`}
          summary="Each call we made, the odds we gave it, what happened, and what we learned. Nothing is removed once scored."
        >
          {isMobile ? stacked : table}
          <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
            Score is the <Term k="brier">Brier score</Term>: (our odds − outcome)², lower is better; 0.25 is what coin-flipping scores. A forecast is scored as happened or did not happen against the wording of the forecast itself; one whose wording cannot decide it is marked No resolution and left out of every score.
          </p>
        </AnalysisCard>
      )}
    </section>
  );
};

// Compact pointer to the score, shown near the header so a recruiter sees it
// immediately without the full ledger (every scored forecast, the calibration
// bands, the per-category lean) pushing the week's read down the page. The
// full Track record section sits at the bottom of the tab — see TrackRecord.
export const TrackRecordBadge = ({ ledger = FORECAST_LEDGER }) => {
  if (!ledger?.summary) return null;
  const s = ledger.summary;
  const grade = gradeFor(s.aggregateBrier);
  return (
    <a
      href={tabHref(5, ANCHORS.trackRecord)}
      onClick={(e) => { if (!isPlainClick(e)) return; e.preventDefault(); navigateTo(5, ANCHORS.trackRecord); }}
      className="card-hover"
      style={{
        display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start",
        textDecoration: "none", padding: "8px 14px", borderRadius: "var(--radius-md)",
        background: "var(--bg-card-elevated)", border: "1px solid var(--border-subtle)",
      }}
    >
      {grade && (
        <span style={{
          fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "var(--fs-sm)",
          color: grade.color, background: `color-mix(in srgb, ${grade.color} 12%, transparent)`,
          borderRadius: "var(--radius-sm)", padding: "2px 8px", lineHeight: 1.3,
        }}>
          {grade.grade}
        </span>
      )}
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
        Track record{s.aggregateBrier != null ? ` · ${Number(s.aggregateBrier).toFixed(2)} Brier` : ""} · {s.nResolved} scored
      </span>
      <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>→</span>
    </a>
  );
};

export const DeepAnalysisTab = () => {
  const a = DEEP_ANALYSIS;
  if (!a) return null;

  // Defensive: contrarianTake migrated from string → object in v2.
  const contrarian = typeof a.contrarianTake === "string"
    ? { body: a.contrarianTake, probability: null }
    : (a.contrarianTake || null);

  const primary = a.primaryAnalysis || {};

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

      {/* Quiet freshness line — renders nothing while the briefing is under ten days old */}
      <StaleNotice asOf={a.asOf} label="analysis" />

      {/* Compact pointer to the score — the full ledger sits at the bottom of this tab */}
      <TrackRecordBadge />

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
            <Prose
              key={i}
              as="p"
              segments={MAIN_READ.fields[`body${i}`] ?? [{ text: p }]}
              style={{
                fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)", lineHeight: 1.7, margin: 0,
              }}
            />
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
              <Prose
                as="div"
                segments={MAIN_READ.fields.marketContext ?? [{ text: a.marketContext }]}
                style={{
                  fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)", lineHeight: 1.65,
                }}
              />
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
                    {/* Plain lead line when the drafter wrote one. No firstSentence()
                        fallback: it splits on "U.S." and would print a lead of "U.S." */}
                    {c.plain && (
                      <div style={{
                        fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--text-primary)",
                        fontFamily: "var(--font-sans)", lineHeight: 1.45, marginBottom: 4,
                      }}>
                        {c.plain}
                      </div>
                    )}
                    <Prose
                      as="div"
                      segments={MAIN_READ.fields[`cc${i}`] ?? [{ text: c.body }]}
                      style={{
                        fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)", lineHeight: 1.6,
                      }}
                    />
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
                  <li key={i} style={{ marginBottom: 4 }}>
                    <Prose segments={MAIN_READ.fields[`fals${i}`] ?? [{ text: c }]} />
                  </li>
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
              <WatchRow key={i} item={w} signalSegments={WATCH_SIGNALS[i]} />
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
          <Prose
            as="div"
            segments={CONTRARIAN_BODY ?? [{ text: contrarian.body }]}
            style={{
              fontSize: "var(--fs-sm)", color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", lineHeight: 1.65,
            }}
          />
        </AnalysisCard>
      )}

      {/* Terms on this page — the glossary affordance that works on a phone, where a
          dotted underline mid-paragraph is easy to miss entirely. */}
      {PAGE_TERMS.length > 0 && (
        <AnalysisCard
          eyebrow={`Terms on this page · ${PAGE_TERMS.length}`}
          summary="Plain-English definitions for the terms used above."
        >
          <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {PAGE_TERMS.map((t) => (
              <div key={t.key}>
                <dt style={{
                  fontSize: "var(--fs-sm)", fontWeight: 700, color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)", lineHeight: 1.35,
                }}>
                  {t.label}
                </dt>
                <dd style={{
                  margin: 0, fontSize: "var(--fs-sm)", color: "var(--text-secondary)",
                  fontFamily: "var(--font-sans)", lineHeight: 1.55,
                }}>
                  {t.plain}
                  {t.source && (
                    <>
                      {" "}
                      <a href={t.source} target="_blank" rel="noreferrer" style={{ color: "var(--text-dim)", fontSize: "var(--fs-xs)" }}>
                        source
                      </a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
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

      {/* Track record — the forecast ledger: every scored call, the calibration
          bands, and where we lean by category. Anchor target for
          #/analysis/track-record and for the compact badge above. */}
      <TrackRecord />
    </div>
  );
};
