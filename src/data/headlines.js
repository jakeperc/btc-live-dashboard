// Headlines archive — owner: /refresh-headlines-archive (monthly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// HISTORICAL_HIGHLIGHTS — important stories from ~2 days to 4 weeks ago.
//   Populates "Important Headlines • Past 4 Weeks" section.
// SIX_MONTH_HIGHLIGHTS — top 10 highest-impact stories from ~past 6 months.
//   Older than the 4-week cutoff so they don't overlap HISTORICAL_HIGHLIGHTS.

export const HISTORICAL_HIGHLIGHTS = [
  { date: "Oct 6", title: "The Treasury's anti-money-laundering office, FinCEN, withdraws two unfinished plans, a 2020 rule to report transfers above $10,000 to personal Bitcoin wallets and a 2023 rule to flag coin-mixing services, saying lawful users may 'privately transact on a public blockchain'", source: "FinCEN", tag: "REGULATION", important: true },
  { date: "Oct 5", title: "Strategy estimates a $20.9 billion paper gain on its Bitcoin for the third quarter, after $22.8 billion of losses in the first half, and buys 334 more coins; a week earlier it reopened share sales to fund 1,665, and rival Strive buys 2,000", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Oct 2", title: "U.S. employers add just 29,000 jobs in September against 84,000 expected, and July is revised to a loss; traders cut the odds of an October Fed rate rise to under one in five, and Bitcoin jumps to $86,400", source: "BLS", tag: "FED", important: true },
  { date: "Oct 1", title: "The SEC proposes rules letting investment advisers and funds hold crypto, even in their own custody, its latest rule-writing step since the CLARITY Act stalled; Commissioner Hester Peirce, crypto's longtime advocate on the commission, leaves at week's end, leaving two of five seats filled", source: "SEC", tag: "REGULATION", important: true },
  { date: "Sep 30", title: "August inflation lands below forecast at 3.4%, with the core measure at 3.0%; traders cut the odds of an October Fed rate rise from about two in three to one in three, yet the 10-year Treasury yield passes its 2007 peak to the highest since 2002", source: "BEA", tag: "FED", important: true },
  { date: "Sep 30", title: "Bitcoin closes September near $83,500, up about 43% for the quarter, its best third quarter since 2017 and the first with all three months higher; the Bitcoin ETFs' nine-day buying streak ends with $149 million leaving, and Citigroup lifts its one-year target to $113,000", source: "Crypto Briefing", tag: "MARKETS", important: true },
  { date: "Sep 25", title: "U.S. Bitcoin ETFs take in $2.39 billion in the week, their best of 2026, on a seventh straight day of inflows; the year's net flows turn positive for the first time since May, and Bitcoin ends the week near $84,000", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Sep 24", title: "The 10-year Treasury yield hits 5.21%, its highest since 2007, as oil near $106 and a $40 trillion federal debt drive a global bond selloff; traders lift the odds of an October Fed rate rise to about 60%", source: "Bloomberg", tag: "MACRO", important: true },
  { date: "Sep 21", title: "Bitcoin tops $87,000, its highest since January, as U.S. Bitcoin ETFs take in $999 million in one day, the most since the record-high day last October; about $840 million of bets against Bitcoin are forced closed", source: "The Block", tag: "MARKETS", important: true },
  { date: "Sep 21", title: "Strategy buys 950 Bitcoin for $75.7 million with cash rather than new share sales, lifting holdings to 846,000, and spends $174 million buying back its own dividend-paying shares; rival treasury company Strive buys 1,355", source: "SEC EDGAR", tag: "CORPORATE", important: true },
  { date: "Sep 17", title: "Two days after the Senate vote, the SEC uses its own authority to let U.S. stocks trade as blockchain tokens for five years, its first step 'with or without legislation'; a betting market puts the CLARITY Act's 2026 odds at 7%", source: "SEC", tag: "REGULATION", important: true },
  { date: "Sep 16", title: "The Federal Reserve raises its key rate a quarter point to 3.75%–4.00%, the first rise since July 2023, unanimously; officials' forecasts pencil in one more this year, and Bitcoin barely moves near $75,500", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Sep 16", title: "The House Financial Services Committee approves the Strategic Bitcoin Reserve bill 28–21, with a 20-year ban on selling the government's coins; the House tax committee approves a crypto tax bill 38–5 the same day, and the House then leaves until November 9", source: "House Financial Services Committee", tag: "SOVEREIGN", important: true },
  { date: "Sep 15", title: "The Senate votes 49–50 on the CLARITY Act, short of the 60 needed; every Democrat present votes no over ethics language, Bitcoin falls below $76,000 and $450 million leaves the Bitcoin ETFs", source: "U.S. Senate", tag: "REGULATION", important: true },
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
