// Market news data — owner: /refresh-market-news (weekly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// MARKET_THEME drives the dominant-narrative card. statusTone accent:
//   advancing → green, active → blue, stalled → amber, passed → strong green.
// CURATED_MARKET_UPDATES — the 4-card cross-current rail.
// NEWS_FEEDS — RSS sources the dashboard polls live (rarely changed).
// FALLBACK_NEWS — used only when live RSS fetch fails (~last 48h).

export const MARKET_THEME = {
  category: "ETFs",
  asOf: "JUL 17, 2026",
  refreshedAt: "2026-07-19T05:40:00Z",
  title: "Cool June CPI Ignites Four Straight Days of ETF Inflows, Ending the Eight-Week $8B Outflow Streak; BTC Reclaims $65K Before Settling Near $64.7K",
  status: "Inflow Streak Confirmed",
  statusTone: "advancing",
  narrative: "The catalyst the market was waiting for arrived on July 14: June CPI fell 0.4% for the month — the largest monthly drop since April 2020 — pulling annual inflation down to 3.5% versus the 3.8% economists expected, with core inflation flat on the month at 2.6% annually. Bitcoin ETFs responded immediately. Combined spot Bitcoin and Ethereum funds took in $239.4 million on July 14, formally ending an eight-week outflow streak that had drained more than $8 billion from Bitcoin funds since May. The inflows then sustained: $108 million into Bitcoin ETFs on July 15 (BlackRock's IBIT +$80.8M), $79.2 million on July 16 (IBIT +$33.4M, Fidelity's FBTC +$30.7M, Bitwise's BITB +$15M), and $132.3 million on July 17 (IBIT +$136.5M, with FBTC the only fund in outflow at -$4.2M). Price confirmed the shift: Bitcoin hit a three-week high above $65,100 on July 15 before easing to the $64,700 area, as traders digested that a cool CPI reduces but does not eliminate hike risk — September rate-hike odds fell from over 75% to about 63% — and as a global selloff in chip stocks plus renewed Middle East tension capped risk appetite. In the options market, the most crowded call strike has moved down from $80,000 to $70,000 (about $1.63 billion in open interest), a sign traders are positioning for a nearer, more modest upside target.",
  whyItMatters: "For the first time since early May, the big institutional funds have bought Bitcoin four days in a row — and they did it in direct response to inflation cooling, which is the cleanest evidence yet that the June selling was about Fed policy fear rather than Bitcoin itself. The reversal is still fragile: the Fed is more likely than not to raise rates in September, and oil above $85 from the Iran conflict could push inflation back up. If daily inflows keep running through the July 28–29 Fed meeting and Bitcoin holds above $60K, the June capitulation increasingly looks like the bottom of this drawdown. If flows flip negative again after the Fed speaks, the July recovery was a one-off reaction to a single good inflation report.",
  milestoneLabel: "Next checkpoint",
  milestone: "FOMC meeting July 28–29 — with September hike odds near 63% after the cool CPI, the Fed's statement and press conference decide whether the inflow streak survives into August. Technically, watch for BTC to hold $60K support and close above the $65K level that capped the July 15 rally.",
  sources: [
    { label: "U.S. Bureau of Labor Statistics — Consumer Price Index Summary, June 2026", url: "https://www.bls.gov/news.release/cpi.nr0.htm" },
    { label: "CNBC — June CPI falls 0.4%, annual rate drops to 3.5% (July 14, 2026)", url: "https://www.cnbc.com/2026/07/14/consumer-price-index-inflation-report-june-2026.html" },
    { label: "Crypto Briefing — BlackRock's IBIT leads Bitcoin ETFs with $79M inflows on July 16", url: "https://cryptobriefing.com/blackrock-ibit-leads-bitcoin-etfs-79m-inflows-july-16/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "REGULATION • JUL 17",
    title: "CLARITY Act Showdown: Merged Senate Draft Drops Ethics Provision, Three Democrats Defect; Floor Vote Targeted Before August 7 Recess",
    detail: "The Senate's merged Banking–Agriculture draft of the CLARITY Act, released July 14, omits the Section 604 conflict-of-interest language that Democrats have named as the price of their votes — language barring senior officials and their families from profiting on crypto while in office. Senators Murphy, Van Hollen and Merkley formally came out against the bill in response, leaving it short of the roughly seven Democratic votes needed to reach 60. Majority Leader Thune has pledged a floor vote before the August recess, with the week of July 20 under active discussion now that the defense bill has cleared the calendar, and the House held a July 17 field hearing at Federal Hall to signal it will move fast if the Senate acts. Betting markets swung passage odds from 24% to 45% in four days — a genuine coin flip with roughly three Senate weeks left before the August 7 cutoff.",
    statusTone: "active",
    asOf: "JUL 17, 2026",
    sources: [
      { label: "Axios — CLARITY Act held up as Democrats seek ethics provision (July 17)", url: "https://www.axios.com/2026/07/17/clarity-act-delay-provision" },
      { label: "TechTimes — CLARITY Act heads to Federal Hall with Senate vote in doubt after ethics impasse", url: "https://www.techtimes.com/articles/320563/20260715/clarity-act-heads-federal-hall-senate-vote-doubt-after-ethics-impasse.htm" },
    ],
  },
  {
    label: "MACRO • JUL 17",
    title: "Iran Ceasefire Collapses at the 60-Day Halfway Mark While June CPI Cools Sharply; Fed Caught Between Soft Core Inflation and $85 Oil",
    detail: "The June 17 U.S.–Iran memorandum has broken down in practice: at the negotiating window's July 17 halfway point, the U.S. has struck more than 300 Iranian targets, Iran has attacked commercial shipping in the Strait of Hormuz, and Trump has declared the ceasefire 'over' — though neither side has formally abandoned the talks and mediators are working to revive them. The same week delivered the opposite macro signal: June CPI fell 0.4%, the largest monthly drop since April 2020, cutting annual inflation to 3.5% and lowering September rate-hike odds from over 75% to about 63%. The Fed now faces forces pulling in opposite directions — cooling core inflation argues against further hikes, while Brent crude holding above $85 a barrel on renewed Hormuz risk keeps the inflation threat alive. For Bitcoin, the cool CPI is a tailwind, but the oil-shock risk caps how aggressively markets can price Fed easing.",
    sources: [
      { label: "Fox News — Trump's 60-day Iran deal reaches halfway mark as ceasefire collapses", url: "https://www.foxnews.com/politics/trumps-60-day-iran-deal-reaches-halfway-mark-ceasefire-collapses-escalating-war" },
      { label: "CoinDesk — U.S. June CPI fell 0.4%, likely cooling move toward Fed rate hikes", url: "https://www.coindesk.com/markets/2026/07/14/u-s-june-cpi-fell-0-4-likely-cooling-move-toward-fed-rate-hikes" },
    ],
  },
  {
    label: "CORPORATE TREASURY • JUL 13",
    title: "Strategy Raises $467M in Stock Sales but Buys Zero Bitcoin; Cash Reserve Hits $3B as the Accumulation Halt Extends",
    detail: "Strategy's July 13 SEC filing shows the company sold 4.82 million MSTR shares between July 6 and 12 for about $466.7 million in net proceeds — and bought no Bitcoin at all with the money, instead building a U.S.-dollar reserve that now stands at $3.0 billion. Holdings held steady at 843,775 BTC, acquired at an average cost of $75,476 — leaving the position roughly $13 billion underwater at current prices. The pivot from 'every spare dollar into Bitcoin' to stockpiling cash for its 12% preferred-stock dividend obligations is now an established pattern, following June's first BTC sales since 2022 and the July 6 sale of 3,588 BTC. Saylor has signaled purchases could resume, but for now the market's most famous corporate buyer is raising money and sitting on it — a neutral force rather than the reliable structural bid it provided for five years.",
    sources: [
      { label: "Bloomberg — Saylor's Strategy raises reserve to $3 billion with stock sale (July 13)", url: "https://www.bloomberg.com/news/articles/2026-07-13/saylor-s-strategy-raises-reserve-to-3-billion-with-stock-sale" },
      { label: "The Block — Saylor signals another bitcoin buy as Strategy sits about $13 billion underwater", url: "https://www.theblock.co/post/406460/michael-saylor-signals-another-bitcoin-buy-as-strategy-sits-about-13-billion-underwater" },
    ],
  },
  {
    label: "INTERNATIONAL • JUL 15",
    title: "Japan Passes Landmark Crypto Law: Bitcoin Reclassified as a Financial Instrument, 20% Flat Tax Planned, Tokyo Spot-ETF Path Opens",
    detail: "Japan's parliament gave final approval on July 15 to amendments to the Financial Instruments and Exchange Act that move Bitcoin and roughly 104 other crypto assets out of payments law and into the same regulatory category as stocks and bonds. The law bans crypto insider trading, requires issuer disclosures, and clears the runway for spot Bitcoin ETFs on the Tokyo Stock Exchange (listings targeted for 2027), while a companion tax reform would cut the top rate on crypto gains from 55% to a flat 20% starting January 2028 — matching how stock gains are taxed. The world's fourth-largest economy formally treating Bitcoin as a mainstream financial asset, with ETF rails and equity-style taxation, is one of the year's biggest international adoption signals and a template other Asian regulators are expected to study.",
    sources: [
      { label: "CoinDesk — Japan reclassifies crypto as a financial asset, paves way for tax cuts (July 15)", url: "https://www.coindesk.com/policy/2026/07/15/japan-reclassifies-crypto-as-a-financial-asset-paves-way-for-tax-cuts" },
      { label: "TechTimes — Japan passes crypto law: ETFs could arrive before tax rate drops to 20 percent", url: "https://www.techtimes.com/articles/320705/20260716/japan-passes-crypto-law-etfs-could-arrive-before-tax-rate-drops-20-percent.htm" },
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
  { date: "Jul 17", title: "Spot Bitcoin ETFs post fourth consecutive inflow day with $132.3M net, led by BlackRock's IBIT (+$136.5M); post-CPI four-day total tops $550M as the eight-week $8B outflow streak decisively ends", source: "Bloomingbit", tag: "ETFs", important: true },
  { date: "Jul 17", title: "CLARITY Act showdown: merged Senate draft omits ethics provision, Sens. Murphy, Van Hollen and Merkley formally defect; floor vote targeted for week of July 20 as passage odds swing from 24% to 45%", source: "Axios", tag: "REGULATION", important: true },
  { date: "Jul 17", title: "Iran ceasefire collapses at halfway mark of 60-day negotiating window — 300+ U.S. strikes, Iranian attacks on Hormuz shipping, Trump declares ceasefire 'over' though talks not formally dead; Brent holds above $85", source: "Fox News", tag: "MACRO", important: true },
  { date: "Jul 16", title: "Dormant Bitcoin address awakens after eight years, moving 5,908 BTC (~$383M) as BTC consolidates near $64.7K following its three-week high above $65K", source: "CoinDesk", tag: "ONCHAIN" },
];
