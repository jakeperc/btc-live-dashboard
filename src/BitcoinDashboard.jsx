// App shell: header, tab navigation, and lazy-mounted tab panels.
// All tab content lives in src/tabs/, shared atoms in src/components/,
// hooks in src/hooks/, and plain utilities in src/lib/.
// Refresh-skill-owned data lives in src/data/, imported by whichever tab
// renders it — never by this shell.
//
// Routing: the URL hash is the source of truth for the open tab
// (src/lib/routes.js). useHashRoute() reads it, listens for changes, and
// hands back a setActiveTab that writes the hash — so the back button, a
// shared "#/analysis/track-record" link, and every existing setActiveTab(n)
// call all go through the same door.
import { Suspense, useState, useEffect } from "react";
import "./styles.css";
import { DashboardTab, BitcoinThesisTab, StrategyTab, HeadlinesTab, AdoptionTab, DeepAnalysisTab } from "./tabs/index.js";
import { Skeleton, DataStatus, ThemeToggle, ErrorBoundary, isPlainClick } from "./components/shared.jsx";
import { TABS } from "./lib/constants.js";
import { tabHref, parseHash } from "./lib/routes.js";
import { fmtUSD } from "./lib/format.js";
import { useBitcoinData } from "./hooks/useBitcoinData.js";
import { useBitcoinNews } from "./hooks/useBitcoinNews.js";
import { useHashRoute, useScrolled, useIsMobile, useOnlineStatus, usePullToRefresh, useSwipeNavigation, Pulse, PageScrollProgressBar } from "./hooks/ui.jsx";

const TAB_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M18 10h-8"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>,
];

// Mobile tab bar. Each item is a real link to the tab's route; the click
// handler only adds haptics and the scroll-to-top, then lets the hash change.
const BottomNav = ({ activeTab }) => (
  <nav className="bottom-nav" aria-label="Tab navigation">
    {TABS.map((tab, i) => (
      <a
        key={tab}
        href={tabHref(i)}
        className={`bottom-nav-item${activeTab === i ? " active" : ""}`}
        aria-label={tab}
        aria-current={activeTab === i ? "page" : undefined}
        style={{ textDecoration: "none" }}
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate(10);
          window.scrollTo({ top: 0, behavior: "auto" });
        }}
      >
        <span className="bottom-nav-icon">{TAB_ICONS[i]}</span>
        <span className="bottom-nav-label" style={{ fontSize: 11 }}>{tab}</span>
      </a>
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

// Suspense fallback while a tab's chunk downloads: a card-shaped shimmer plus
// a few lines, so the page keeps its shape instead of collapsing to nothing.
const TabSkeleton = () => (
  <div aria-busy="true" aria-label="Loading section" style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 4 }}>
    <Skeleton height={120} radius={14} />
    <Skeleton height={18} width="55%" />
    <Skeleton height={14} width="80%" />
    <Skeleton height={14} width="70%" />
    <Skeleton height={220} radius={14} />
  </div>
);

export default function BitcoinDashboard() {
  const [activeTab, setActiveTab] = useHashRoute();
  const btc = useBitcoinData();
  const news = useBitcoinNews();
  const scrolled = useScrolled(24);
  const showBackToTop = useScrolled(400);
  const isMobileNav = useIsMobile(760);
  const online = useOnlineStatus();
  const { pullDistance, refreshing } = usePullToRefresh(btc.refresh, isMobileNav);
  useSwipeNavigation(activeTab, setActiveTab, TABS.length, isMobileNav);
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([0, activeTab]));

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
    // A deep link with an anchor (#/analysis/track-record) is scrolled to by
    // the router once the target mounts; only a plain load starts at the top.
    if (!parseHash().anchor) window.scrollTo(0, 0);
  }, []);

  // Panels stay mounted once visited (display:none when inactive) so chart
  // ranges, open cards and scroll positions inside a tab survive a switch.
  const panels = [
    <DashboardTab btc={btc} setActiveTab={setActiveTab} />,
    <BitcoinThesisTab setActiveTab={setActiveTab} />,
    <StrategyTab btc={btc} setActiveTab={setActiveTab} />,
    <HeadlinesTab news={news} />,
    <AdoptionTab price={btc.price} />,
    <DeepAnalysisTab />,
  ];

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
                  {/* Real links styled as before. A plain click lets the anchor
                      change the hash and the router switch the tab; the handler
                      only keeps the haptic + centring + scroll-to-top extras.
                      Space activates like the old <button> did. */}
                  {TABS.map((tab, i) => (
                    <a
                      key={tab}
                      role="tab"
                      href={tabHref(i)}
                      aria-selected={activeTab === i}
                      onClick={(e) => {
                        if (!isPlainClick(e)) return;
                        if (navigator.vibrate) navigator.vibrate(10);
                        e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                        window.scrollTo({ top: 0, behavior: "auto" });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); setActiveTab(i); }
                      }}
                      style={{
                        display: "inline-flex", alignItems: "center", textDecoration: "none", lineHeight: "normal",
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
                    >{tab}</a>
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
        {panels.map((panel, i) => (i === 0 || visitedTabs.has(i)) && (
          <div key={TABS[i]} style={{ display: activeTab === i ? "block" : "none" }} className={activeTab === i ? "tab-panel-enter" : ""}>
            {/* ErrorBoundary outside Suspense: a chunk that fails to download
                rejects inside lazy(), which Suspense re-throws as an error. */}
            <ErrorBoundary>
              <Suspense fallback={<TabSkeleton />}>{panel}</Suspense>
            </ErrorBoundary>
          </div>
        ))}
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

      {isMobileNav && <BottomNav activeTab={activeTab} />}
    </div>
  );
}
