import { useState } from "react";
import { FALLBACK_NEWS } from "../data/market-news.js";
import { HISTORICAL_HIGHLIGHTS, SIX_MONTH_HIGHLIGHTS } from "../data/headlines.js";
import { TAG_COLORS, TAG_FALLBACK } from "../lib/format.js";
import { Reveal } from "../hooks/ui.jsx";
import { Skeleton, ErrorBanner } from "../components/shared.jsx";

// Live RSS items carry a direct article URL. Curated entries don't, so fall
// back to a Google News search on the title — surfaces relevant coverage even
// when no specific article link is tracked.
export const headlineHref = (item) =>
  item.url || `https://news.google.com/search?q=${encodeURIComponent(item.title || "")}&hl=en-US`;

export const StarBadge = () => (
  <span title="Key story" aria-label="Key story" style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 18, height: 18, borderRadius: 4,
    background: "rgba(247, 147, 26, 0.15)", color: "#f7931a",
    fontSize: 12, lineHeight: 1, fontWeight: 700, flexShrink: 0, marginTop: 1,
  }}>★</span>
);

export const HeadlineCard = ({ item, i, forceStar = false, variant = "standard" }) => {
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
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: tc.bg, color: tc.text, fontWeight: 700, fontFamily: "var(--font-mono)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.04)" }}>{item.tag}</span>
          <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{item.source}</span>
        </div>
      </div>
    </>
  );
  // Starred stories are raised (lighter surface + gradient border + shadow) via
  // .elev-raised instead of stripe-flagged: importance reads as elevation, and
  // the tag pill keeps carrying the category color.
  const cardStyle = starred ? {
    borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12,
  } : {
    background: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12,
  };
  return (
    <Reveal delay={Math.min(i * 0.04, 0.4)}>
      <a href={headlineHref(item)} target="_blank" rel="noopener noreferrer" className={`card-hover headline-card${starred ? " elev-raised" : ""}`} style={{ textDecoration: "none", ...cardStyle }}>
        {Body}
      </a>
    </Reveal>
  );
};

export const SectionHeading = ({ title, subtitle }) => (
  <div className="section-heading" style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "20px 0 10px", flexWrap: "wrap" }}>
    <div className="section-heading-title" style={{ fontSize: 15, fontWeight: 700, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3 }}>{title}</div>
    {subtitle && <div className="section-heading-sub" style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</div>}
  </div>
);

export const HeadlinesTab = ({ news }) => {
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
