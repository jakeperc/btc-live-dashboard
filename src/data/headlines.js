// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Oct 31", title: "The Moscow Exchange, Russia's main stock market, says Bitcoin, Ether and the dollar token USDT will trade there from December 1, open to ordinary investors who pass a knowledge test", source: "Izvestia", tag: "MARKETS", important: true },
  { date: "Oct 30", title: "Bitcoin falls to about $76,100, its lowest since mid-September, a day after thieves take $6.3 billion from Binance, the biggest crypto theft on record; $643 million leaves U.S. Bitcoin funds, the most since June", source: "The Block", tag: "MARKETS", important: true },
  { date: "Oct 30", title: "The Binance theft becomes a campaign issue: the CFTC's chair says exchanges outside U.S. rules need them, Senator Lummis says the CLARITY Act would have helped, and Representative Waters calls it a 'wake-up call'", source: "The Block", tag: "REGULATION", important: true },
  { date: "Oct 29", title: "Strategy reports a $19.5 billion profit, almost all the rising value of coins it holds, and says it sold 5,552 Bitcoin in the quarter to pay dividends; holdings stay at 848,517, its stock falls 10%", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 28", title: "The Federal Reserve holds rates at 3.75–4.00%, with two of twelve officials voting to raise; a day later: the economy grew at a 3.4% pace and September prices were 3.6% above a year earlier", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Oct 26", title: "Strive buys 6,182 Bitcoin in a week, about two weeks of worldwide new supply, lifting its holdings to 43,000, the fourth most of any listed company; Strategy's own weekly filing shows no coins bought", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 22", title: "Technology stocks have their worst day since June on fears about spending on artificial intelligence; $636 million leaves U.S. Bitcoin funds, the most since June, and Bitcoin slides to $81,000", source: "Farside Investors", tag: "MARKETS", important: true },
  { date: "Oct 21", title: "The OCC, which supervises national banks, finishes the first U.S. rulebook for stablecoins, digital tokens fixed at one dollar, in force from January 18, 2027", source: "OCC", tag: "REGULATION", important: true },
  { date: "Oct 20", title: "Elon Musk says SpaceX and Tesla are exploring a merger that would put their 30,221 Bitcoin, worth about $2.4 billion, in one company; no coins change hands and no terms are agreed", source: "CoinDesk", tag: "CORPORATE", important: true },
  { date: "Oct 20", title: "Switzerland's regulator approves the country's first Bitcoin fund for ordinary investors; BlackRock files a third Bitcoin fund built to limit losses to about 10%, and JPMorgan's fund arm forecasts 10% a year for Bitcoin", source: "FINMA", tag: "ETFs", important: true },
  { date: "Oct 15", title: "MSCI, the index company whose lists many funds copy, adopts a rule dropping companies without a real operating business from its indexes; Strategy is on its list of likely removals, final list November 11", source: "MSCI", tag: "CORPORATE", important: true },
  { date: "Oct 14", title: "U.S. inflation jumps to 3.7% in September from 3.4%; traders' odds of an October rate rise leap to one in two, then fall back as Fed chair Kevin Warsh says 'I don't prejudge meetings'", source: "BLS", tag: "FED", important: true },
  { date: "Oct 14", title: "The White House confirms Patrick Witt, its lead adviser on the CLARITY Act and the last staffer on its crypto council, has left as his temporary posting ended; no successor is named", source: "White House", tag: "REGULATION", important: true },
  { date: "Oct 12", title: "London's High Court rules Chinese law governs fraud victims' claims to 61,000 Bitcoin seized by the Metropolitan Police, improving the British government's chance of keeping coins worth about £3.6 billion; the victims plan to appeal", source: "The Block", tag: "SOVEREIGN", important: true },
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
