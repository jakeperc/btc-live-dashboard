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
  { date: "Oct 29", title: "Strategy, the leading Bitcoin-holding company, reports it sold 5,552 Bitcoin in the quarter and 6,947 this year to pay dividends; its first sale, of 32 coins, came June 1", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 21", title: "The OCC, which supervises national banks, finishes its rules for stablecoins, digital tokens pegged to the dollar; they take effect January 18, 2027", source: "OCC", tag: "REGULATION", important: true },
  { date: "Oct 12", title: "London's High Court rules Chinese law decides whether fraud victims have rights to about 61,000 Bitcoin seized by police, worth about £3.8 billion; the victims' lawyers are pursuing an appeal", source: "The Block", tag: "RESERVES", important: true },
  { date: "Sep 21", title: "Bitcoin tops $87,000, its highest since January, as U.S. Bitcoin funds take in $999 million in one day, the most since October 2025", source: "SoSoValue", tag: "ETFs", important: true },
  { date: "Sep 16", title: "The Federal Reserve, the U.S. central bank, raises its key rate a quarter point to 3.75%–4% under chair Kevin Warsh, the first rise since 2023, in a unanimous 12–0 vote", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Sep 15", title: "The Senate blocks the CLARITY Act, the crypto market rulebook, 49–50 on a vote that needed 60; every yes vote came from a Republican", source: "U.S. Senate", tag: "REGULATION", important: true },
  { date: "Aug 19", title: "The U.S. Treasury says it will at least double its largest purchases of its own bonds to $4 billion; Bitcoin jumps back to $70,000 as over $1 billion of borrowed-money bets against it are force-closed", source: "U.S. Treasury; Bitcoin.com News", tag: "PRICE", important: true },
  { date: "Aug 18", title: "The SEC, the U.S. market regulator, proposes new rules for selling crypto tokens to the public, letting projects raise up to $75 million a year without full registration", source: "SEC", tag: "REGULATION", important: true },
  { date: "Jun 25", title: "Bitcoin falls to about $58,100, its lowest in 21 months, after the Fed's favorite inflation gauge hits a three-year high; over $1 billion of borrowed-money bets are force-closed in a day", source: "Crypto Briefing", tag: "PRICE", important: true },
  { date: "Jun 12", title: "SpaceX raises about $75 billion in the largest stock-market debut ever; its SEC filing shows it holds 18,712 Bitcoin, bought for $661 million", source: "SEC EDGAR", tag: "CORPORATE", important: true },
];
