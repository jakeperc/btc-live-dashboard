// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Jul 17", title: "Spot Bitcoin ETFs log fourth consecutive inflow day: $132.3M net led by BlackRock IBIT (+$136.5M); post-CPI four-day total tops $550M, decisively ending the eight-week $8B outflow streak", source: "Bloomingbit", tag: "ETFs", important: true },
  { date: "Jul 17", title: "CLARITY Act merged Senate draft omits ethics provision; Sens. Murphy, Van Hollen and Merkley formally oppose as floor vote is targeted for week of July 20 — passage odds swing from 24% to 45% in four days", source: "Axios", tag: "REGULATION", important: true },
  { date: "Jul 17", title: "Iran ceasefire collapses at halfway mark of 60-day window: 300+ U.S. strikes on Iranian targets, Iranian attacks on Hormuz shipping, Trump declares ceasefire 'over' though talks not formally abandoned", source: "Fox News", tag: "MACRO", important: true },
  { date: "Jul 15", title: "Japan's parliament passes FIEA amendment reclassifying Bitcoin and ~104 crypto assets as financial instruments; insider-trading ban, 20% flat tax planned for 2028, Tokyo spot-ETF listings targeted for 2027", source: "CoinDesk", tag: "REGULATION", important: true },
  { date: "Jul 14", title: "June CPI falls 0.4% — largest monthly drop since April 2020 — pulling annual inflation to 3.5% vs 3.8% forecast; September rate-hike odds fall from 75% to 63% as Treasury yields drop sharply", source: "CNBC", tag: "FED", important: true },
  { date: "Jul 13", title: "Strategy 8-K: sold 4.82M MSTR shares Jul 6–12 for $466.7M net proceeds, bought zero Bitcoin; USD reserve reaches $3.0B while holdings hold at 843,775 BTC (~$13B underwater at $75,476 avg cost)", source: "Bloomberg", tag: "CORPORATE", important: true },
  { date: "Jul 11", title: "Bitcoin ETF inflows surge for second consecutive day: $197.4M net inflow on July 11 following $90.4M on July 10 (led by IBIT $86.8M); 7-day flows turn positive at $124.9M after 8-week outflow streak", source: "CoinStats AI", tag: "ETFs", important: true },
  { date: "Jul 10", title: "Bitcoin ETF inflows recover with $90.4M net inflow led by BlackRock IBIT ($86.8M) and VanEck HODL ($3.6M); BTC pushes above $64K as institutional rotation signals tactical reentry after Jul 8-9 wobble", source: "CoinBriefing", tag: "ETFs", important: true },
  { date: "Jul 8", title: "FOMC minutes released confirming hawkish stance: 9 of 18 officials now project at least one 25bp hike by end-2026; Fed held rates at 3.50-3.75% with forward guidance removed; inflation concerns persist despite June jobs beat", source: "CNBC", tag: "FED", important: true },
  { date: "Jul 2", title: "June closes as the worst-ever month for U.S. spot Bitcoin ETFs (~$4.5B net outflows); BTC prints a fresh year-to-date low near $57,700 before rebounding to $61K as implied volatility compresses to YTD lows (~33%)", source: "Crypto Times", tag: "ETFs", important: true },
  { date: "Jun 24", title: "Bitcoin crashes to 20-month low of $59,175; second sub-$60K breach this month triggers $850M in leveraged liquidations within 4 hours; recovery toward $62K begins", source: "CoinStats AI", tag: "PRICE", important: true },
  { date: "Jun 24", title: "Two record ETF outflow streaks (May + June) drain $7.2B from Bitcoin ETF products, flipping 2026 YTD cumulative flows negative for first time — structural shift in institutional demand", source: "TFTC", tag: "ETFs", important: true },
  { date: "Jun 24", title: "House GOP blockade of all legislation (triggered by Trump's refusal to sign housing bill until SAVE Act passes) freezes congressional calendar, raising odds CLARITY Act slips past August recess deadline", source: "The Hill", tag: "REGULATION", important: true },
  { date: "Jun 22", title: "Strategy Inc strategic pivot: sells 2.71M shares (~$335.5M), buys only 520 BTC, parks 90% in cash for preferred obligations; first BTC sales since 2022 signal end of 'never sell' doctrine", source: "Bitbo.io", tag: "CORPORATE", important: true },
];

export const SIX_MONTH_HIGHLIGHTS = [
  { date: "May 6",  title: "Bitcoin recovers to $82K, highest level since January; spot ETF inflows resume amid macro stabilization", source: "CoinDesk", tag: "PRICE", important: true },
  { date: "Apr 27", title: "SEC Chair Paul Atkins attends Bitcoin 2026 conference in Las Vegas; first sitting SEC chair at major Bitcoin event signals regulatory pivot", source: "Bitcoin Magazine", tag: "REGULATION", important: true },
  { date: "Apr 20", title: "MicroStrategy purchases 34,164 BTC ($2.54B) in largest institutional buy of 2026; total holdings near 850K BTC", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Apr 10", title: "Metaplanet holdings reach 40,177 BTC; overtakes Tesla as #3 corporate Bitcoin holder after MicroStrategy and Twenty One Capital", source: "CoinDesk", tag: "CORPORATE", important: true },
  { date: "Mar 12", title: "Marathon Digital sells 15,133 BTC (~$1.1B) to repurchase ~$1.0B of convertible notes, cutting convertible debt ~30%", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Mar 3",  title: "Pakistan National Assembly passes Virtual Assets Act 2026; sovereign Bitcoin allocation framework with 2,000 MW energy commitment", source: "Dawn", tag: "RESERVES", important: true },
  { date: "Jan 29", title: "SEC and CFTC announce 'Project Crypto' joint initiative; first inter-agency Bitcoin regulatory coordination framework", source: "SEC", tag: "REGULATION", important: true },
  { date: "Jan 15", title: "Bitcoin reaches $97,150 intraday high; peak of Q1 2026 rally before January correction to $72K range", source: "CoinMarketCap", tag: "PRICE", important: true },
  { date: "Jan 5",  title: "Bank of America authorizes 1-4% crypto allocation for 15,000 wealth advisors; marks Tier-1 institutional legitimacy", source: "The Block", tag: "CORPORATE", important: true },
  { date: "Dec 8",  title: "CFTC approves Bitcoin and Ether as futures margin collateral via no-action letter; operationalizes institutional derivatives adoption", source: "Morgan Lewis", tag: "REGULATION", important: true },
];
