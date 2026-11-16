// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Nov 15", title: "Bitcoin falls to about $62,000, its lowest since July 14, closing a sixth losing week about 13% lower and 49% below its record; over $2 billion of borrowed-money bets are force-closed in a day", source: "CoinGecko", tag: "MARKETS", important: true },
  { date: "Nov 13", title: "U.S. Bitcoin funds lose $1.07 billion in a week, a second straight week above $1 billion, with money leaving seven days in a row; BlackRock's fund accounts for most of it", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Nov 13", title: "The U.S. 10-year borrowing rate climbs to 5.15% from 4.86% a week earlier and the dollar hits its strongest since April 2025; Bitcoin, gold and technology stocks all fall", source: "U.S. Treasury", tag: "MARKETS", important: true },
  { date: "Nov 11", title: "MSCI, whose stock lists many funds copy, drops Strategy and Japan's Metaplanet after November 30 under its new rule for companies that mainly hold assets; funds copying the lists hold about 3% of Strategy's shares", source: "MSCI", tag: "CORPORATE", important: true },
  { date: "Nov 10", title: "U.S. consumer prices rose 0.4% in October, more than expected; Federal Reserve governor Christopher Waller says a half-point December rate rise 'should be considered'; traders now treat a rise as very likely", source: "BLS", tag: "FED", important: true },
  { date: "Nov 9", title: "Strategy buys 1,036 Bitcoin for $81.9 million in the week to November 8, paid for by selling shares, lifting holdings to 850,364 at an average cost of $75,456, now well above the market price", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Nov 9", title: "Trump Media reports 15,649 Bitcoin, three quarters of them pledged in option deals and unsellable for now; lenders may demand $977 million in cash from November 30 against $182 million of cash on hand", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Nov 9", title: "The Senate returns and votes 73–25 to take up an energy permitting bill; no vote on the crypto rules bill is scheduled, and bettors give it a 2% chance this year", source: "Inside Climate News", tag: "REGULATION", important: true },
  { date: "Nov 6", title: "U.S. employers added 165,000 jobs in October, nearly three times the forecast, with unemployment at 4.1%; a week later a hot inflation reading made a December rate rise very likely", source: "BLS", tag: "FED", important: true },
  { date: "Nov 6", title: "The Treasury cuts the exchange MEXC off from U.S. banks, saying it handled at least $16 billion in suspect funds tied to Russia, Iran and North Korea", source: "U.S. Treasury", tag: "REGULATION", important: true },
  { date: "Nov 6", title: "Russia's central bank confirms that from November 17 ordinary Russians may buy Bitcoin through licensed firms, up to 300,000 rubles a year after a knowledge test; the Moscow Exchange plans trading from December 1", source: "Bank of Russia", tag: "MARKETS", important: true },
  { date: "Nov 5", title: "Technology stocks have their worst day since April 2025 on doubts about spending on artificial intelligence; Nasdaq falls 5.5% and Bitcoin drops 5.6%, from about $80,900 to $75,600", source: "CNBC", tag: "MARKETS", important: true },
  { date: "Nov 4", title: "Democrats win both houses of Congress, with at least 54 Senate seats; Sherrod Brown, a crypto critic, wins Ohio despite $55 million spent against him; Bitcoin briefly tops $81,000", source: "NBC News", tag: "REGULATION", important: true },
  { date: "Oct 30", title: "Bitcoin falls to about $76,100, its lowest since mid-September, a day after thieves take $6.3 billion from Binance, the biggest crypto theft on record; $643 million leaves U.S. Bitcoin funds", source: "The Block", tag: "MARKETS", important: true },
];

export const SIX_MONTH_HIGHLIGHTS = [
  { date: "Sep 21", title: "Bitcoin tops $87,000 as U.S. Bitcoin ETFs take in $999 million in one day, the most since October 2025", source: "SoSoValue", tag: "ETFs", important: true },
  { date: "Sep 16", title: "The Fed raises its key rate a quarter point to 3.75%–4%, the first rise since 2023, in a unanimous 12–0 vote", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Sep 15", title: "The Senate blocks the CLARITY Act, the crypto market rulebook, 49–50 on a vote that needed 60; no Democrat votes yes", source: "U.S. Senate", tag: "REGULATION", important: true },
  { date: "Aug 19", title: "The Treasury at least doubles its largest purchases of its own bonds to $4 billion; Bitcoin jumps toward $70,000 as over $1 billion of bets against it close", source: "U.S. Treasury", tag: "MARKETS", important: true },
  { date: "Aug 18", title: "The SEC proposes new rules for selling crypto tokens to the public, letting projects raise up to $75 million a year exempt from full registration", source: "SEC", tag: "REGULATION", important: true },
  { date: "Jun 17", title: "The Fed holds its key rate at 3.50%–3.75%, but officials' typical forecast for year end rises to 3.8% from 3.4% in March, pointing to a rise, not a cut", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Jun 12", title: "SpaceX raises about $75 billion in the largest stock-market debut ever; its SEC filings show it holds 18,712 Bitcoin, bought for $661 million", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Jun 5", title: "Bitcoin falls below $60,000, touching about $59,200, after a record 13 straight days of Bitcoin ETF withdrawals totaling $4.3 billion", source: "The Herald Business", tag: "PRICE", important: true },
  { date: "Jun 1", title: "Strategy sells 32 Bitcoin to pay dividends it owes investors, its first sale since 2022; by July 5 it has sold 3,588 coins for $216 million", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "May 13", title: "The Senate confirms Kevin Warsh as Federal Reserve chair 54–45, with John Fetterman the only Democrat in favor; he succeeds Jerome Powell", source: "U.S. Senate", tag: "FED", important: true },
];
