// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Oct 15", title: "MSCI, the index company whose lists many funds copy, adopts a rule dropping companies without a real operating business from its indexes; Strategy is on its list of likely removals, final list November 11, effective November 30", source: "MSCI", tag: "CORPORATE", important: true },
  { date: "Oct 14", title: "U.S. inflation jumps to 3.7% in September from 3.4%; traders' odds of an October rate rise leap to one in two, then fall back by October 16 as Fed chair Kevin Warsh says 'I don't prejudge meetings'; Bitcoin dips just under $80,000", source: "BLS", tag: "FED", important: true },
  { date: "Oct 14", title: "The White House confirms Patrick Witt, its lead adviser on the CLARITY Act and the last staffer on its crypto council, has left as his temporary posting ended; no successor is named", source: "White House", tag: "REGULATION", important: true },
  { date: "Oct 12", title: "London's High Court rules that Chinese law governs fraud victims' claims to about 61,000 Bitcoin seized by the Metropolitan Police, improving the British government's chance of keeping coins worth about £3.8 billion; the victims' lawyers say they will appeal", source: "The Block", tag: "SOVEREIGN", important: true },
  { date: "Oct 8", title: "Wallets labelled as U.S. government holdings of coins seized from the 2016 Bitfinex hack move about 17,800 Bitcoin, worth $1.5 billion, over three days, some to Coinbase and most to new addresses; no sale is announced", source: "Arkham Intelligence", tag: "SOVEREIGN", important: true },
  { date: "Oct 7", title: "Investors pull $487 million from U.S. Bitcoin ETFs, the most in one day since June, as Bitcoin falls below $84,000; minutes of the Fed's September meeting show 'most participants' expect another rate rise by year end", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Oct 6", title: "The Treasury's anti-money-laundering office, FinCEN, withdraws two unfinished plans, a 2020 rule to report transfers above $10,000 to personal Bitcoin wallets and a 2023 rule to flag coin-mixing services, saying lawful users may 'privately transact on a public blockchain'", source: "FinCEN", tag: "REGULATION", important: true },
  { date: "Oct 5", title: "Strategy estimates a $20.9 billion paper gain on its Bitcoin for the third quarter, after $22.8 billion of losses in the first half, and buys 334 more coins; a week earlier it reopened share sales to fund 1,665, and rival Strive buys 2,000", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 2", title: "U.S. employers add just 29,000 jobs in September against 84,000 expected, and July is revised to a loss; traders cut the odds of an October Fed rate rise to under one in five, and Bitcoin jumps to $86,400", source: "BLS", tag: "FED", important: true },
  { date: "Oct 1", title: "The SEC proposes rules letting investment advisers and funds hold crypto, even in their own custody, its latest rule-writing step since the CLARITY Act stalled; Commissioner Hester Peirce, crypto's longtime advocate on the commission, leaves at week's end, leaving two of five seats filled", source: "SEC", tag: "REGULATION", important: true },
  { date: "Sep 30", title: "August inflation lands below forecast at 3.4%, with the core measure at 3.0%; traders cut the odds of an October Fed rate rise from about two in three to one in three, yet the 10-year Treasury yield passes its 2007 peak to the highest since 2002", source: "BEA", tag: "FED", important: true },
  { date: "Sep 30", title: "Bitcoin closes September near $83,500, up about 43% for the quarter, its best third quarter since 2017 and the first with all three months higher; the Bitcoin ETFs' nine-day buying streak ends with $149 million leaving, and Citigroup lifts its one-year target to $113,000", source: "Crypto Briefing", tag: "MARKETS", important: true },
  { date: "Sep 25", title: "U.S. Bitcoin ETFs take in $2.39 billion in the week, their best of 2026, on a seventh straight day of inflows; the year's net flows turn positive for the first time since May, and Bitcoin ends the week near $84,000", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Sep 21", title: "Bitcoin tops $87,000, its highest since January, as U.S. Bitcoin ETFs take in $999 million in one day, the most since the record-high day last October; about $840 million of bets against Bitcoin are forced closed", source: "The Block", tag: "MARKETS", important: true },
];

export const SIX_MONTH_HIGHLIGHTS = [
  { date: "Aug 28", title: "Fed Chair Warsh, at Jackson Hole, says inflation 'remained too high' and the Fed may 'have work to do'; September rate-rise bets jump from 30% to 47%", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Aug 19", title: "The Treasury doubles its purchases of its own long-term bonds; Bitcoin jumps 6% to $69,000 as a record $1.37 billion of bets against it are liquidated", source: "U.S. Treasury", tag: "MARKETS", important: true },
  { date: "Aug 18", title: "The SEC proposes new rules for selling crypto tokens to the public, letting projects raise up to $75 million a year exempt from full registration", source: "SEC", tag: "REGULATION", important: true },
  { date: "Jun 17", title: "The Fed holds its key rate at 3.50%–3.75% in Kevin Warsh's first meeting as chair, but officials' forecasts flip from one cut this year to a rise", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Jun 12", title: "SpaceX raises about $75 billion in the largest stock-market debut ever; its SEC filings show it holds 18,712 Bitcoin, bought for $661 million", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Jun 5", title: "Bitcoin falls below $60,000 for the first time since October 2024, after a record 13-day, $4.4 billion run of withdrawals from the Bitcoin ETFs", source: "CoinDesk", tag: "PRICE", important: true },
  { date: "Jun 1", title: "Strategy sells Bitcoin for the first time since 2022: 32 coins for $2.5 million to pay preferred-share dividends; bigger sales follow in June and July", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "May 14", title: "The Senate Banking Committee advances the CLARITY Act, the crypto market rulebook, 15–9, with two Democrats joining every Republican", source: "Senate Banking Committee", tag: "REGULATION", important: true },
  { date: "May 13", title: "The Senate confirms Kevin Warsh as Federal Reserve chair 54–45, with John Fetterman the only Democrat in favor; he succeeds Jerome Powell", source: "U.S. Senate", tag: "FED", important: true },
  { date: "Apr 20", title: "Strategy buys 34,164 Bitcoin for $2.54 billion in a single week, at an average of $74,395 a coin, lifting its holdings to 815,061", source: "SEC EDGAR", tag: "CORPORATE", important: true },
];
