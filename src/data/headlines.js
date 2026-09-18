// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Sep 16", title: "The Federal Reserve raises its key rate a quarter point to 3.75%–4.00%, the first rise since July 2023, unanimously; officials' forecasts pencil in one more this year, and Bitcoin barely moves near $75,500", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Sep 16", title: "SEC Chair Paul Atkins and CFTC Chair Mike Selig say they will write crypto rules under existing authority; a betting market puts the CLARITY Act's 2026 odds at 7%, from 23%", source: "The Block", tag: "REGULATION", important: true },
  { date: "Sep 15", title: "The Senate votes 49–50 on the CLARITY Act, short of the 60 needed; every Democrat present votes no over ethics language, Bitcoin falls below $76,000 and $450 million leaves the Bitcoin ETFs", source: "U.S. Senate", tag: "REGULATION", important: true },
  { date: "Sep 11", title: "August inflation lands on forecast at 3.4%, a day after wholesale prices jumped 5.4% on the year; traders put about 85% odds on a Fed rate rise September 16, and Bitcoin settles near $77,000", source: "BLS", tag: "FED", important: true },
  { date: "Sep 9", title: "Brent oil tops $100 a barrel, its highest since July, after U.S. strikes on Iranian tankers and Iranian missile attacks on U.S. forces; government bond yields climb to multi-year highs", source: "Al Jazeera", tag: "MACRO", important: true },
  { date: "Sep 6", title: "A software bug lets attackers pull about 4,000 Bitcoin, worth $320 million, out of Blockstream's Liquid sidechain; they return 3,400 the next day and keep 598.5 as a self-awarded reward. Bitcoin itself is unaffected", source: "Blockstream", tag: "SECURITY", important: true },
  { date: "Sep 4", title: "August payrolls rise 162,000, three times the forecast, and unemployment holds at 4.1%; a solid jobs market gives the Fed room to raise rates", source: "BLS", tag: "FED", important: true },
  { date: "Sep 3", title: "U.S. Bitcoin ETFs take in $731 million, their best day since January, capping a $3.5 billion August that was their best month of 2026; Bitcoin tops $81,000 and fund assets pass $100 billion", source: "The Block", tag: "ETFs", important: true },
  { date: "Sep 1", title: "Strategy tells index company MSCI its plan to eject Bitcoin-holding companies from its stock indexes is 'discriminatory, arbitrary, and misguided' and should be withdrawn; MSCI's decision is due October 16", source: "Strategy", tag: "CORPORATE", important: true },
  { date: "Aug 31", title: "Strategy buys 4,603 Bitcoin for $369.7 million, its first purchase in over two months, lifting holdings to 845,050; a week later it buys nothing but doubles its share-repurchase budget to $2 billion", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Aug 28", title: "Fed Chair Warsh, in his first Jackson Hole speech, says inflation 'remained too high' and the Fed may 'have work to do'; bets on a September rate rise jump from about 30% to about 66%", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Aug 25", title: "Bitcoin briefly tops $81,000, its highest since May, after a three-day surge of more than 20% that forced the closure of over $4 billion of bets against crypto; it ends the day near $78,800", source: "Bloomberg", tag: "MARKETS", important: true },
  { date: "Aug 23", title: "The eCash hard fork starts its first phase with practice tokens only and no exchange support; the permanent split is scheduled for October 31, and Bitcoin holders need do nothing", source: "Crowdfund Insider", tag: "PROTOCOL", important: true },
  { date: "Aug 19", title: "Bitcoin jumps almost 8% to $69,500 as Trump hosts crypto executives at the White House and the Treasury doubles its purchases of its own long-term bonds; over $1 billion of bets against Bitcoin are liquidated", source: "Bloomberg", tag: "MARKETS", important: true },
];

export const SIX_MONTH_HIGHLIGHTS = [
  { date: "May 21", title: "Congress introduces the ARMA bill to write the U.S. Strategic Bitcoin Reserve into law; it targets buying 1M BTC over five years with a 20-year holding mandate", source: "Bitcoin Foundation", tag: "REGULATION", important: true },
  { date: "May 14", title: "Senate Banking Committee passes CLARITY Act 15-9 on bipartisan basis; commodities route to CFTC, securities to SEC under the Digital Asset Market Clarity Act", source: "Senate Banking Committee", tag: "REGULATION", important: true },
  { date: "May 13", title: "Senate confirms Kevin Warsh as Federal Reserve chair by 54–45 — the closest Fed-chair vote of the modern era; he succeeds Jerome Powell on May 22 and now sets the interest-rate backdrop Bitcoin trades against", source: "U.S. Senate", tag: "FED", important: true },
  { date: "Apr 27", title: "SEC Chair Paul Atkins attends Bitcoin 2026 conference in Las Vegas; first sitting SEC chair at major Bitcoin event signals regulatory pivot", source: "Bitcoin Magazine", tag: "REGULATION", important: true },
  { date: "Apr 20", title: "Strategy (formerly MicroStrategy) purchases 34,164 BTC ($2.54B) in the largest institutional buy of 2026, lifting holdings to a peak near 850K BTC — later trimmed by summer sales", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Apr 10", title: "Metaplanet holdings reach 40,177 BTC; overtakes Tesla as #3 corporate Bitcoin holder after Strategy and Twenty One Capital", source: "CoinDesk", tag: "CORPORATE", important: true },
  { date: "Mar 12", title: "Marathon Digital sells 15,133 BTC (~$1.1B) to buy back ~$1.0B of its convertible bonds — debt that can turn into stock — cutting that debt load ~30%", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Mar 4",  title: "Kraken Financial becomes the first digital-asset bank with its own account at the Federal Reserve (a 'master account'), giving it direct access to the central bank's payment rails", source: "Federal Reserve", tag: "CORPORATE", important: true },
  { date: "Mar 3",  title: "Pakistan National Assembly passes Virtual Assets Act 2026; sovereign Bitcoin allocation framework with 2,000 MW energy commitment", source: "Dawn", tag: "RESERVES", important: true },
  { date: "Feb 4",  title: "Treasury Secretary Bessent confirms U.S. Strategic Bitcoin Reserve valued at $15–20B from seized assets; government halts all Bitcoin sales", source: "U.S. Treasury", tag: "RESERVES", important: true },
];
