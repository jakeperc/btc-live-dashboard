import { Suspense, useState, useEffect, useMemo } from "react";
import { FALLBACK_MINED, FALLBACK_BLOCK, FALLBACK_ATH, FALLBACK_ATH_DATE, ETF_COMPLEX_FALLBACK, GLOBAL_CRYPTO_HOLDERS_FALLBACK } from "../data/fallbacks.js";
import { MARKET_THEME, CURATED_MARKET_UPDATES } from "../data/market-news.js";
import { COUNTRY_HOLDINGS, COMPANY_HOLDINGS } from "../data/adoption.js";
import { SUPPLY_HISTORY } from "../data/supply-history.js";
import { TOTAL_SUPPLY, HALVING_BLOCK } from "../lib/constants.js";
import { ANCHORS, parseHash } from "../lib/routes.js";
import { fmt, fmtUSD, formatRemainingTime, formatElapsed, marketCapComparison } from "../lib/format.js";
import { useElapsed, useIsMobile, Reveal } from "../hooks/ui.jsx";
import { SourceLink, Term, Prose, StatCard, StatStrip, SectionGroup, SupplyMeter, DipExplainerCard, PriceDisplay, ErrorBanner, ErrorBoundary, buildMarketPulse, MarketPulseCard, StaleNotice } from "../components/shared.jsx";
import { lazyNamed, once } from "../lib/lazy-named.js";
import { dailyStreak } from "../lib/market-math.js";
// Note: nothing from ./AnalysisTab.jsx is imported here on purpose — the
// Analysis tab is a lazy chunk (src/tabs/index.js) and a static import from
// the eager Dashboard would pull it into the first-paint bundle.
import { GLOSSARY } from "../data/glossary.js";
import { buildMatcher, linkCard } from "../lib/glossary-match.js";

// Glossary segmentation happens ONCE, here, not during render: CURATED_MARKET_UPDATES
// and GLOSSARY are build-time constants, and this component re-renders on every
// price poll — a render-time first-occurrence Set would drop every link on the
// first re-render after mount.
const GLOSSARY_MATCHER = buildMatcher(GLOSSARY);
const CURATED_SEGMENTS = CURATED_MARKET_UPDATES.map(
  (u) => linkCard([u.detail ?? ""], GLOSSARY_MATCHER, 5).segments[0]
);

// ─── CHARTS (their own chunk) ───────────────────────────────────
// The two recharts charts live in src/components/DashboardCharts.jsx so the
// chart engine is not on the first-paint path. The download starts right here,
// while this module is still being evaluated, so it runs in parallel with
// React's first render instead of waiting for it.
const loadCharts = once(() => import("../components/DashboardCharts.jsx"));
loadCharts().catch(() => {}); // warm-up only; a failed warm-up is tried again on first render
const PriceChart = lazyNamed(loadCharts, "PriceChart");
const PowerLawChart = lazyNamed(loadCharts, "PowerLawChart");

// Same outer box as the real cards (padding, title line, chart height), so the
// page does not jump when the chunk lands.
const ChartPlaceholder = ({ title, mobileHeight, desktopHeight }) => {
  const isMobile = useIsMobile();
  return (
    <div className="chart-card" aria-busy="true" style={{
      background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)", padding: "18px 16px 14px",
    }}>
      <div style={{
        fontSize: "var(--fs-xs)", color: "var(--text-muted)", letterSpacing: 1.2,
        textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)",
        marginBottom: 16, textAlign: isMobile ? "center" : "left",
      }}>{title}</div>
      <div style={{
        height: isMobile ? mobileHeight : desktopHeight,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)",
      }}>Loading chart…</div>
    </div>
  );
};

// A chart that cannot load (offline, blocked chunk) must not take the price,
// the briefing and the stat tiles down with it, so each chart gets its own
// boundary instead of bubbling to the tab-level one.
const ChartSlot = ({ title, mobileHeight, desktopHeight, children }) => (
  <ErrorBoundary>
    <Suspense fallback={<ChartPlaceholder title={title} mobileHeight={mobileHeight} desktopHeight={desktopHeight} />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// "Last Block" ticks once a second. It owns that timer so the tick re-renders
// this one strip, not the whole Dashboard (two charts and ~30 tiles).
const LastBlockStrip = ({ lastBlock, settled }) => {
  const elapsed = useElapsed(lastBlock?.timestamp);
  return (
    <StatStrip
      label="Last Block"
      value={elapsed != null ? formatElapsed(elapsed) : "—"}
      sub={lastBlock ? (lastBlock.poolName ? `Mined by ${lastBlock.poolName}` : `Block ${fmt(lastBlock.height)}`) : "Network heartbeat"}
      valueColor="var(--accent-bitcoin)"
      loading={lastBlock == null && !settled}
    />
  );
};

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
  // A deep link naming this section (#/dashboard/market-updates) opens it
  // expanded, so a shared link doesn't leave the reader looking at a
  // collapsed summary. The Dashboard panel stays mounted once visited, so a
  // hashchange while already here needs its own listener, not just a mount check.
  useEffect(() => {
    const checkHash = () => { if (parseHash().anchor === ANCHORS.marketUpdates) setUpdatesExpanded(true); };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);
  const {
    price, change24h, change7d, lastUpdate,
    marketCap, circulatingSupply, ath, athDate,
    chartData, longTermChart, mediumTermChart, blockHeight, hashrate, fastFee, hourFee, mempoolCount,
    dominance, fearGreed, difficultyAdjust, lastBlock, lightning,
    slowSettled, lastBlockSettled, marketSettled,
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

  // Green/red day streak from the 7-day series (recomputed only when it changes).
  const streakDays = useMemo(() => dailyStreak(chartData), [chartData]);

  // Adoption rollups — derived once from the curated tables in this file so the
  // dashboard always reflects the same canonical holdings as the Adoption tab.
  const corpHoldingsTotal = COMPANY_HOLDINGS.reduce((s, c) => s + (c.btc || 0), 0);
  const corpCount = COMPANY_HOLDINGS.length;
  const corpPctOfSupply = (corpHoldingsTotal / liveMined) * 100;
  const sovereignNations = COUNTRY_HOLDINGS.filter(c => (c.btc || 0) > 0).length;
  const sovereignTotal = COUNTRY_HOLDINGS.reduce((s, c) => s + (c.btc || 0), 0);

  // Named holders come from the same tables the Adoption tab renders, so the
  // two never disagree after a /refresh-adoption run. The two tiles with no
  // free live API (ETF complex, global holders) read /refresh-fallbacks
  // constants instead — see src/data/fallbacks.js.
  const mstr = COMPANY_HOLDINGS.find(c => c.ticker === "MSTR");
  const usReserve = COUNTRY_HOLDINGS.find(c => c.country === "United States");
  const bhutan = COUNTRY_HOLDINGS.find(c => c.country === "Bhutan");
  const pctOfMined = (btcAmount) => `${((btcAmount / liveMined) * 100).toFixed(1)}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <StaleNotice asOf={MARKET_THEME.asOf} refreshedAt={MARKET_THEME.refreshedAt} label="market briefing" />
          <MarketPulseCard pulse={marketPulse} streakDays={streakDays} setActiveTab={setActiveTab} />
        </div>
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
          <ChartSlot title="Price History" mobileHeight={236} desktopHeight={438}>
            <PriceChart sevenDay={chartData} mediumTerm={mediumTermChart} longTerm={longTermChart} sevenDaySettled={marketSettled} />
          </ChartSlot>
          <ChartSlot title="Power-Law Trend · Log Scale" mobileHeight={236} desktopHeight={416}>
            <PowerLawChart longTerm={longTermChart} />
          </ChartSlot>
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
              loading={fgValue == null && !slowSettled}
            /></div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <DipExplainerCard fromATH={fromATH} theme={MARKET_THEME} setActiveTab={setActiveTab} />
      </Reveal>

      {/* ── CURATED MARKET UPDATES ── (anchor target: #/dashboard/market-updates) */}
      <Reveal delay={0.05}>
        <div
          id={ANCHORS.marketUpdates}
          className="market-updates-section"
          onClick={() => { if (!updatesExpanded) setUpdatesExpanded(true); }}
          style={{ cursor: updatesExpanded ? "default" : "pointer", scrollMarginTop: 110 }}
        >
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
              <span style={{ display: "inline-block", fontSize: 11, transform: updatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▼</span>
            </span>
          </button>
          {!updatesExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CURATED_MARKET_UPDATES.map((update, i) => (
                <div key={update.title} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-bitcoin)", fontWeight: 800, minWidth: 18, flexShrink: 0 }}>0{i + 1}</span>
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
                    {/* The falsifier — expanded card only, never the collapsed list. */}
                    {update.wouldChange && (
                      <div style={{ marginTop: 12 }}>
                        <div className="kicker-dash" style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
                          What would change our mind
                        </div>
                        <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.55 }}>
                          {update.wouldChange}
                        </div>
                      </div>
                    )}
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
          <LastBlockStrip lastBlock={lastBlock} settled={lastBlockSettled} />
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
            valueColor={diffPct == null ? undefined : diffHarder ? "var(--status-up)" : "var(--status-warn)"}
            loading={diffPct == null && !slowSettled}
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
            loading={lightning == null && !slowSettled}
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
            value={usReserve ? `${fmt(usReserve.btc)} BTC` : "—"}
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
            value={bhutan ? `${fmt(bhutan.btc)} BTC` : "—"}
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
            value={mstr ? `${fmt(mstr.btc)} BTC` : "—"}
            sub={<>Largest single corporate holder{mstr ? ` · ~${pctOfMined(mstr.btc)} of supply` : ""} · <SourceLink href="https://www.strategy.com/" label="strategy.com" /></>}
          />
          <StatStrip
            label="US Spot Bitcoin ETFs"
            value={`~${(ETF_COMPLEX_FALLBACK.btc / 1e6).toFixed(2)}M BTC`}
            sub={<>~${Math.round(ETF_COMPLEX_FALLBACK.aumUsd / 1e9)}B in assets · {pctOfMined(ETF_COMPLEX_FALLBACK.btc)} of supply · <SourceLink href={ETF_COMPLEX_FALLBACK.source} label="farside.co.uk" /></>}
            valueColor="var(--status-up)"
          />
          <StatStrip
            label="Global Crypto Holders"
            value={`~${Math.round(GLOBAL_CRYPTO_HOLDERS_FALLBACK.holders / 1e6)}M`}
            sub={<>About {GLOBAL_CRYPTO_HOLDERS_FALLBACK.pctOfWorld}% of the world's population owns crypto · <SourceLink href={GLOBAL_CRYPTO_HOLDERS_FALLBACK.source} label="triple-a.io" /></>}
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
