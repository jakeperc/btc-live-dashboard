// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Nov 8", title: "Bitcoin falls to $73,477, its lowest since August 21 and a fifth losing week in a row, about 41% below its October 2025 record; the election rally of November 4 lasted one day", source: "CoinGecko", tag: "MARKETS", important: true },
  { date: "Nov 6", title: "U.S. Bitcoin funds lose $1.28 billion in a week, the most since June and about 1% of what they hold; only one of five days saw money come in", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Nov 6", title: "U.S. employers added 165,000 jobs in October, nearly three times the forecast, with unemployment at 4.1%; traders now make a December rate rise likely, about three chances in four", source: "BLS", tag: "FED", important: true },
  { date: "Nov 6", title: "The Treasury cuts the exchange MEXC off from U.S. banks, saying it handled at least $16 billion in suspect funds tied to Russia, Iran and North Korea", source: "U.S. Treasury", tag: "REGULATION", important: true },
  { date: "Nov 6", title: "Russia's central bank rule takes effect November 17: ordinary Russians may buy Bitcoin, Ether and the dollar token USDT through licensed firms, up to 300,000 rubles a year after a knowledge test", source: "PPT.ru", tag: "MARKETS", important: true },
  { date: "Nov 5", title: "Technology stocks have their worst day since April 2025 on doubts about spending on artificial intelligence; Nasdaq falls 5.5% and Bitcoin drops 5.6%, from about $80,900 to $75,600", source: "CNBC", tag: "MARKETS", important: true },
  { date: "Nov 5", title: "Trump Media moves 4,259 Bitcoin pledged against a $1 billion loan to an exchange; lenders can demand cash from November 30 and the company says it may sell coins to pay", source: "Arkham", tag: "CORPORATE", important: true },
  { date: "Nov 4", title: "Democrats win both houses of Congress, with at least 54 Senate seats; Sherrod Brown, a crypto critic, wins Ohio despite $55 million spent against him; Bitcoin briefly tops $81,000", source: "NBC News", tag: "REGULATION", important: true },
  { date: "Nov 4", title: "Binance says it has replaced 98% of the $6.3 billion stolen on October 29 with its own money; its ten largest coins, Bitcoin included, are shown fully backed, and withdrawals reopen in stages", source: "Binance", tag: "MARKETS", important: true },
  { date: "Nov 2", title: "Strategy buys 811 Bitcoin for $65.5 million, paid for by selling shares, lifting holdings to 849,327 at an average cost of $75,451, now above the market price", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 31", title: "The Moscow Exchange, Russia's main stock market, says Bitcoin, Ether and the dollar token USDT will trade there from December 1, open to ordinary investors who pass a knowledge test", source: "Izvestia", tag: "MARKETS", important: true },
  { date: "Oct 30", title: "Bitcoin falls to about $76,100, its lowest since mid-September, a day after thieves take $6.3 billion from Binance, the biggest crypto theft on record; $643 million leaves U.S. Bitcoin funds", source: "The Block", tag: "MARKETS", important: true },
  { date: "Oct 29", title: "Strategy reports a $19.5 billion profit, almost all the rising value of coins it holds, and says it sold 5,552 Bitcoin in the quarter to pay dividends; its stock falls 10%", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 28", title: "The Federal Reserve holds rates at 3.75–4.00%, with two of twelve officials voting to raise; a day later: the economy grew at a 3.4% pace and September prices were 3.6% above a year earlier", source: "Federal Reserve", tag: "FED", important: true },
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
