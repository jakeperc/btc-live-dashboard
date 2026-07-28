import { useState } from "react";
import { Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FALLBACK_PRICE } from "../data/fallbacks.js";
import { ADOPTION_DATA, ADOPTION_INDEX_TOP20, COUNTRY_HOLDINGS, COMPANY_HOLDINGS } from "../data/adoption.js";
import { fmt } from "../lib/format.js";
import { useIsMobile } from "../hooks/ui.jsx";

// ─── ADOPTION TAB ───────────────────────────────────────────────
export const AdoptionTab = ({ price }) => {
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
export const BrokenBarShape = (props) => {
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

export const SortTh = ({ children, colKey, activeSortKey, activeSortDir, onSort, className }) => (
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

export const CompaniesTab = ({ price }) => {
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
        Top publicly traded companies by BTC on balance sheet — July 2026
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
export const HoldingsTab = ({ price }) => {
  const safePrice = price || FALLBACK_PRICE;
  const isMobile = useIsMobile();
  const [sortKey, setSortKey] = useState("btc");
  const [sortDir, setSortDir] = useState("desc");
  const handleSort = (key) => {
    setSortDir(prev => (sortKey === key && prev === "desc") ? "asc" : "desc");
    setSortKey(key);
  };
  const sortedCountries = [...COUNTRY_HOLDINGS].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  const totalGovBtc = COUNTRY_HOLDINGS.reduce((s, c) => s + c.btc, 0);
  const govEntities = COUNTRY_HOLDINGS.filter(c => c.btc > 0).length;
  return (
    <div>
      <div className="page-title" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>
        Government Bitcoin Holdings
      </div>
      <div className="page-subtitle" style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
        Nation-state BTC reserves as of July 2026
      </div>
      <div className="holdings-summary" style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20, padding: "10px 14px", background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
        Total government-held BTC: <span style={{ color: "#f7931a", fontWeight: 700 }}>{fmt(totalGovBtc)} BTC</span> across <span style={{ color: "#f7931a", fontWeight: 700 }}>{govEntities} entities</span> — worth ~<span style={{ color: "#22c55e", fontWeight: 700 }}>${(totalGovBtc * safePrice / 1e9).toFixed(1)}B</span>
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
