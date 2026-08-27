// Market news data — owner: /refresh-market-news (weekly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// MARKET_THEME drives the dominant-narrative card. statusTone accent:
//   advancing → green, active → blue, stalled → amber, passed → strong green.
// CURATED_MARKET_UPDATES — the 4-card cross-current rail.
// NEWS_FEEDS — RSS sources the dashboard polls live (rarely changed).
// FALLBACK_NEWS — used only when live RSS fetch fails (~last 48h).

export const MARKET_THEME = {
  category: "POLICY",
  asOf: "AUG 19, 2026",
  refreshedAt: "2026-08-20T03:18:00Z",
  title: "The Breakout Came From Washington: an SEC Rulebook and a White House Summit Send Bitcoin to $69,500",
  status: "Breakout",
  statusTone: "advancing",
  narrative: "After two weeks stuck near $63,000, Bitcoin's jolt came from Washington. The SEC proposed its first full rulebook for how crypto projects raise money — written rules instead of case-by-case lawsuits. A day later President Trump hosted crypto and finance executives at the White House, urging Congress to pass the stalled CLARITY Act, the crypto-rules bill. Bitcoin jumped almost 8% to about $69,500, its highest since early June, as over $1 billion of bets against it were forcibly closed within about an hour — the largest such wave on record.",
  whyItMatters: "For years the industry complained that U.S. regulators policed crypto through lawsuits, not written rules. The SEC's rulebook, even as a draft, is the clearest sign yet that era is ending. But part of the jump was bets against Bitcoin being forcibly closed, not new buying. The test of whether it sticks is money returning to the Bitcoin stock-market funds.",
  milestoneLabel: "Next checkpoint",
  milestone: "Two dense weeks: the CFTC's first Innovation Advisory Committee meeting (Aug 20), the eCash fork (around Aug 21), and Fed Chair Warsh's first Jackson Hole keynote (Aug 28). The Senate returns September 14, with the CLARITY Act queued for a September 15–16 vote. Watch whether Bitcoin holds above the July ceiling near $66,900, and whether fund inflows stay positive.",
  sources: [
    { label: "SEC — Chair Atkins statement on proposed Regulation Crypto Assets (Aug 18)", url: "https://www.sec.gov/newsroom/speeches-statements/atkins-statement-regulation-crypto-assets-081826" },
    { label: "SEC — Proposed rule: Regulation Crypto Assets (33-11434)", url: "https://www.sec.gov/files/rules/proposed/2026/33-11434.pdf" },
    { label: "Bloomberg — Bitcoin surges most since March ahead of White House meeting (Aug 19)", url: "https://www.bloomberg.com/news/articles/2026-08-19/bitcoin-surges-most-since-march-ahead-of-white-house-meeting" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "REGULATION • AUG 19",
    title: "The CLARITY Act, Halfway Home and Stalled: What the Crypto Rules Bill Would Do — and Its September 15 Test",
    plain: "The crypto-rules bill is stuck in the Senate, so rules are still set lawsuit by lawsuit. A vote is expected mid-September; betting markets say passage this year is unlikely.",
    detail: "The CLARITY Act passed the House in July 2025 by a wide bipartisan margin, then stalled in the Senate; Democrats blocked an August vote, partly over ethics rules aimed at the president's family crypto businesses. A first procedural vote is expected September 15–16. The bill would write into law which referee governs crypto, ending a decade-long fight. 'Digital commodities' like Bitcoin — assets whose value comes from a blockchain itself — would move under the CFTC, the lighter-touch regulator that oversees gold and oil markets. Assets that work like investment contracts would stay with the SEC. For a Bitcoin holder, the rules would stop being set lawsuit by lawsuit. This week President Trump demanded a 'fair version' of the bill, and the SEC's proposed rulebook moves on ground it would settle permanently — which either eases the urgency to legislate or builds momentum. Prediction markets price 2026 passage around one-in-eight.",
    statusTone: "stalled",
    asOf: "AUG 19, 2026",
    sources: [
      { label: "Congress.gov — H.R. 3633, Digital Asset Market Clarity Act: actions and status", url: "https://www.congress.gov/bill/119th-congress/house-bill/3633" },
      { label: "CoinDesk — Senate won't vote on crypto Clarity Act before its summer break (Aug 6)", url: "https://www.coindesk.com/policy/2026/08/06/senate-won-t-vote-on-crypto-clarity-act-before-its-summer-break" },
      { label: "AP — Trump hosts crypto executives at the White House, urges a 'fair version' of CLARITY (Aug 19)", url: "https://currently.att.yahoo.com/att/trump-hosts-crypto-executives-white-231056652.html" },
    ],
  },
  {
    label: "MACRO • AUG 12",
    title: "Inflation Lands Exactly On Script: 3.4% Buys the Fed Time, and the Spotlight Moves to Jackson Hole",
    plain: "Inflation landed exactly as expected, giving the Federal Reserve no new reason to raise rates. For Bitcoin, a quiet Fed is one less thing to fight.",
    detail: "The August 12 inflation report was the rare data release that changed nothing — which, after a summer of shocks, was itself the news. Prices rose 3.4% over the year, down from 3.5% — exactly as forecast. That keeps intact the 'no need to raise rates' story that followed July's weak jobs report: traders put roughly 60% odds on the Fed holding steady in September, though they have not fully ruled out a rise. The next tests come at month's end: Fed Chair Kevin Warsh gives his first keynote at the Jackson Hole symposium on August 28. This year's theme is 'Financial Innovation: Implications for Payments and Policy.' Warsh has signaled 'big picture' remarks rather than near-term guidance. The August jobs report lands September 4, before the Fed's September 15–16 meeting. For Bitcoin, which spent early August moving with each data release, a quiet Fed is one less thing to fight.",
    sources: [
      { label: "CNBC — CPI report July 2026: prices rose 0.1% in the month, annual rate 3.4% (Aug 12)", url: "https://www.cnbc.com/2026/08/12/cpi-inflation-report-july-2026.html" },
      { label: "CoinDesk — U.S. CPI inflation edges lower to 3.4% as expected; bitcoin holds near $64,000 (Aug 12)", url: "https://www.coindesk.com/markets/2026/08/12/u-s-cpi-inflation-edges-lower-to-3-4-as-expected" },
    ],
  },
  {
    label: "CORPORATE TREASURY • AUG 17",
    title: "Strategy's Retreat Deepens: a Third Sale in Six Weeks, No Buys Since June — and Now the Index Police Are Circling",
    plain: "Strategy, the company holding 840,447 Bitcoin, keeps selling coins instead of buying. It may also be kicked out of major stock indexes, which would force funds to sell its shares.",
    detail: "The turn that began in July is now a pattern. Strategy's August 10 filing disclosed another Bitcoin sale — 1,690 coins for $108.6 million at an average $64,262, well below its $75,385 cost. It is the third sale in six weeks, cutting holdings to 840,447 coins, with no purchase in eight weeks. The company keeps selling its own stock instead, building a cash reserve past $4.6 billion — a buffer against the roughly $1.76 billion it owes each year in dividends and interest. A new pressure arrived August 14: MSCI, the index giant, opened a formal consultation on ejecting 'non-operating companies' from its global stock indexes. On current data that screen would delete Strategy and Japan's Metaplanet at the November review, forcing the index funds that automatically hold their shares to sell. Strategy's retort: index providers should measure markets, 'not dictate corporate assets.' MSCI's decision is due October 16.",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K, August 10, 2026 (1,690 BTC sold; holdings 840,447)", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000119312526341297/mstr-20260810.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K, August 17, 2026 (no purchases or sales Aug 10–16)", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000119312526353240/mstr-20260817.htm" },
      { label: "CoinDesk — Strategy and Metaplanet face stock-index exclusion under MSCI's new proposal (Aug 14)", url: "https://www.coindesk.com/markets/2026/08/14/bitcoin-holders-strategy-and-metaplanet-face-stock-index-exclusion-under-msci-s-new-proposal" },
    ],
  },
  {
    label: "PROTOCOL • AUG 9",
    title: "The August Fork Showdown Fizzles: BIP-110 Dies at 2.5% Support — Next Up, the eCash Split This Week",
    plain: "One attempt to change Bitcoin's rules just failed; another, stranger split — eCash — is expected this week. Your coins are unaffected, and anyone asking for your keys is a scammer.",
    detail: "The soft fork that spent the summer threatening to split Bitcoin ended as a rounding error: only 2.53% of mining power signaled support, nowhere near the 55% required. A handful of supporters briefly split off; the main network carried on untouched, and no exchange or wallet adopted it. Now comes the stranger of August's two forks: developer Paul Sztorc's 'eCash' hard fork, expected around August 21. It copies Bitcoin's ledger — every holder automatically receives eCash coins while their Bitcoin is unaffected. Most controversially, it reassigns roughly 500,000 of Satoshi Nakamoto's dormant coins on the new chain to fund development. Round one's lesson is the one that matters: changing Bitcoin's rules without overwhelming agreement is close to impossible — and that resistance is precisely what long-term holders are counting on. There is nothing you need to do, and any message asking for your wallet keys to 'claim' fork coins is a scam.",
    sources: [
      { label: "Crypto Briefing — BIP-110 struggles with 2–3% miner support ahead of August activation deadline", url: "https://cryptobriefing.com/bip-110-miner-support-struggles-august/" },
      { label: "CoinDesk — A longtime developer wants to fork Bitcoin and reassign Satoshi's coins (Apr 27)", url: "https://www.coindesk.com/tech/2026/04/27/a-long-time-developer-wants-to-fork-bitcoin-and-reassign-satoshi-coins-the-community-is-calling-it-a-theft" },
      { label: "AMINA Bank Research — Bitcoin fork August 2026: BIP-110, eCash, covenants and the quantum clock", url: "https://aminagroup.com/research/bitcoin-fork-august-2026-bip-110-ecash-covenants-and-the-quantum-clock/" },
    ],
  },
];

// rss2json proxies RSS to JSON. CoinDesk + Cointelegraph BTC tag + Bitcoin Magazine.
export const NEWS_FEEDS = [
  { url: "https://cointelegraph.com/rss/tag/bitcoin", source: "Cointelegraph", btcOnly: true },
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", source: "CoinDesk", btcOnly: false },
  { url: "https://bitcoinmagazine.com/.rss/full/", source: "Bitcoin Magazine", btcOnly: true },
];

// Fallback news — used only if live RSS fetch fails. Curated for the "Latest" section (~last 48h).
// `important: true` stars the headline.
export const FALLBACK_NEWS = [
  { date: "Aug 19", title: "Bitcoin jumps almost 8% to about $69,500 — its highest since the start of June and biggest one-day rise since March — as Trump hosts crypto and finance executives at the White House, urges a 'fair version' of the CLARITY Act, and over $1 billion of short bets are liquidated in about an hour", source: "Bloomberg", tag: "MARKETS", important: true },
  { date: "Aug 18", title: "The SEC proposes 'Regulation Crypto Assets,' its first comprehensive crypto fundraising rulebook: a $5M startup exemption, a $75M-a-year fundraising exemption, a safe harbor that can move mature tokens outside securities law, and preemption of state registration — open for 60 days of public comment", source: "SEC", tag: "REGULATION", important: true },
  { date: "Aug 18", title: "Spot Bitcoin ETF inflows return with the rally — +$297.5M Monday and +$21.8M Tuesday after last week's roughly $390M outflow, the worst week since June — leaving August demand positive but uneven and still concentrated in BlackRock's IBIT", source: "Farside Investors", tag: "ETFs" },
  { date: "Aug 19", title: "Paul Sztorc's 'eCash' hard fork is expected around August 21 at block 964,000: every Bitcoin holder automatically receives matching coins on the new chain and Bitcoin itself is unaffected — nothing to do, and any message asking for your keys to 'claim' fork coins is a scam", source: "Bitcoin.com News", tag: "PROTOCOL" },
];
