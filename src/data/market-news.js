// Market news data — owner: /refresh-market-news (weekly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// MARKET_THEME drives the dominant-narrative card. statusTone accent:
//   advancing → green, active → blue, stalled → amber, passed → strong green.
// CURATED_MARKET_UPDATES — the 4-card cross-current rail.
// NEWS_FEEDS — RSS sources the dashboard polls live (rarely changed).
// FALLBACK_NEWS — used only when live RSS fetch fails (~last 48h).

export const MARKET_THEME = {
  category: "MARKETS",
  asOf: "OCT 7, 2026",
  refreshedAt: "2026-10-07T13:00:00Z",
  title: "Bitcoin's Rally Stalls as Fund Buying Slows and Bond Yields Hit a 24-Year High",
  status: "Sideways since Sept 25; below $84,000 on Oct 7",
  statusTone: "active",
  narrative: "Bitcoin closed September near $83,500, up about 43% on the quarter, its best third quarter since 2017. Since then it has traded between $83,000 and $87,000, below $87,570, its price on January 1. The U.S. Bitcoin ETFs, funds that hold Bitcoin itself and trade on the stock market, ended a nine-day buying streak on September 30. They took in $241 million in the week to October 2, a tenth of the week before. On October 7 Bitcoin fell below $84,000 as long-term U.S. government borrowing rates hit a 24-year high.",
  whyItMatters: "The surge that began in September has paused, not reversed. Big investors are still buying Bitcoin, just far less than two weeks ago. The drag is borrowing costs, not Bitcoin news: the U.S. government now pays more to borrow for thirty years than at any time since 2002, and that pulls money toward safer assets that pay interest.",
  wouldChange: "A week ending below $82,500, the low of the past two weeks, would say the September rally has reversed rather than paused.",
  milestoneLabel: "Next checkpoint",
  milestone: "October 7, 2 p.m. Eastern: minutes of the September meeting of the Federal Reserve, the U.S. central bank, showing how many officials want more rises. October 14: September inflation figures. October 16: MSCI, the index company, rules on ejecting Bitcoin-holding companies. October 27–28: the Fed's next rate decision. Watch whether the funds' weekly buying recovers or turns negative.",
  sources: [
    { label: "The Block — U.S. spot Bitcoin ETF daily flows: the nine-day inflow streak ends Sep 30 (−$149 million); week of Sep 28–Oct 2 +$241 million against +$2.39 billion the week before; Oct 5 −$90 million, Oct 6 +$119 million", url: "https://www.theblock.co/data/etfs/bitcoin-etf/spot-bitcoin-etf-flows" },
    { label: "CoinDesk — Oct 7 live: Bitcoin slides under $84,000 with about $550 million of leveraged bets liquidated as the 30-year Treasury yield hits 5.715%, its highest since 2002, and Brent oil tops $101", url: "https://www.coindesk.com/business/2026/10/07/live-updates-bitcoin-slides-under-usd84-000-as-usd550-million-in-bets-get-liquidated" },
    { label: "Crypto Briefing — Oct 2: Bitcoin up about 43% in the third quarter, its best since 2017 and the first with July, August and September all higher; gold +8.7%, S&P 500 and Nasdaq about +2%", url: "https://cryptobriefing.com/bitcoin-jumps-q3-2026-outperforms-gold-stocks/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • OCT 7",
    title: "Soft Inflation Cools October Rate-Rise Bets, but Long-Term Yields Hit a 24-Year High",
    plain: "Weaker inflation and hiring made an October rate rise possible but less likely than not, yet long-term government borrowing costs hit their highest since 2002.",
    detail: "On September 30 the inflation gauge the Federal Reserve, the U.S. central bank, watches most closely showed prices up 3.4% in a year against 3.7% expected; without food and energy, 3.0%. On October 2 the jobs report showed 29,000 jobs added in September, against 84,000 expected, and July revised to a loss. Traders' bets on another quarter-point rise on October 28 fell from about two in three on September 25 to about one in five, after Philip Jefferson, the Fed's vice chair, said future moves should follow the data. Yet long-term borrowing costs rose anyway. The 30-year Treasury yield, the rate the U.S. government pays to borrow for thirty years, reached 5.7% on October 7, its highest since 2002, on oil above $100 a barrel and $40 trillion of federal debt. Bitcoin pays no interest, so higher safe returns elsewhere compete with it. A rise by December remains likely.",
    wouldChange: "A 30-year yield back below 5.5%, where it sat on September 25, or September inflation on October 14 below August's 3.4%, would say the rate pressure is easing.",
    statusTone: "active",
    asOf: "OCT 7, 2026",
    sources: [
      { label: "BEA — Personal Income and Outlays, August 2026 (Sep 30): PCE price index +3.4% from a year earlier (+0.3% on the month); excluding food and energy +3.0% (+0.2%)", url: "https://www.bea.gov/news/2026/personal-income-and-outlays-august-2026" },
      { label: "BLS — Employment Situation, September 2026 (Oct 2): payrolls +29,000; unemployment 4.2%; July revised to −10,000 and August to +133,000", url: "https://www.bls.gov/news.release/empsit.nr0.htm" },
      { label: "Federal Reserve — Vice Chair Jefferson, 'The U.S. Economy and Monetary Policy', Oct 1: future adjustments 'determined by carefully examining trends in the data'; 'upside risks to inflation'", url: "https://www.federalreserve.gov/newsevents/speech/jefferson20261001a.htm" },
      { label: "CentralBank.watch — fed funds futures, Oct 6: 19.5% odds of a rise on Oct 28 (hold 80.5%); 84.3% odds of a rise by Dec 9", url: "https://centralbank.watch/federal-reserve/" },
    ],
  },
  {
    label: "REGULATION • OCT 6",
    title: "Congress Leaves Until November; the SEC and Treasury Keep Writing Crypto Rules Without It",
    plain: "With the crypto rules bill stuck and Congress away until November 9, regulators proposed custody rules and dropped two plans to track private Bitcoin transfers.",
    detail: "The CLARITY Act would write into law which referee governs crypto: Bitcoin under the CFTC, which oversees gold and oil markets, with the SEC, the stock-market regulator, keeping assets that work like investment contracts. The Senate fell eleven votes short of debating it on September 15 and left September 30 without a second vote. Both chambers return November 9 for a short post-election session; a betting market puts passage this year at about 5%. The agencies moved instead. On October 1 the SEC proposed rules letting investment advisers and funds hold crypto, even in their own custody, with 60 days for comment. On October 6 FinCEN, the Treasury's anti-money-laundering office, withdrew a 2020 plan to report transfers above $10,000 to personal wallets and a 2023 plan to flag mixers, tools that blend coins to hide who paid whom. It said lawful users may 'privately transact on a public blockchain.'",
    wouldChange: "An ethics deal between Senate Democrats and the White House, or a second Senate vote set for November, would put Congress back in charge.",
    statusTone: "stalled",
    asOf: "OCT 6, 2026",
    sources: [
      { label: "SEC — press release 2026-100, October 1, 2026: proposed custody framework for investment advisers and regulated funds; self-custody permitted in certain circumstances; state trust companies as custodians; 60-day comment period", url: "https://www.sec.gov/newsroom/press-releases/2026-100-sec-proposal-would-address-how-investment-advisers-funds-can-custody-crypto-assets-under-federal" },
      { label: "Federal Register — FinCEN, 'Requirements for Certain Transactions Involving Convertible Virtual Currency or Digital Assets; Withdrawal' (FR Doc. 2026-20430, published Oct 6, 2026): the 2020 unhosted-wallet proposal is withdrawn; 'FinCEN will take no further action'", url: "https://www.federalregister.gov/d/2026-20430" },
      { label: "Federal Register — FinCEN, withdrawal of the 2023 finding and proposed special measure on convertible virtual currency mixing (FR Doc. 2026-20429, published Oct 6, 2026)", url: "https://www.federalregister.gov/d/2026-20429" },
      { label: "U.S. Senate Daily Press — Wednesday, September 30, 2026: the Senate adjourns for the state work period; next vote Monday, November 9 at 5:30 p.m.; no action on H.R. 3633", url: "https://www.dailypress.senate.gov/wednesday-september-30-2026/" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 5% (Oct 7)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "CORPORATE TREASURY • OCT 5",
    title: "Strategy Reopens Share Sales to Buy 2,000 Bitcoin and Books a $21 Billion Paper Gain",
    plain: "Strategy, the biggest corporate Bitcoin holder, sold new shares to buy 2,000 coins, only 0.2% of its pile. It reports a $21 billion paper gain, not yet cashed in.",
    detail: "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other) paid for its mid-September purchase from cash and sold no new shares for three weeks. Two filings since show 1,665 coins bought for $142.7 million on September 28, all from new share sales, then 334 more on October 5, mostly from share sales. Holdings are 848,000 coins, about 4% of all that will ever exist. Its average cost is $75,441, so at $84,000 it shows a paper gain of about 11%. It estimates a $20.9 billion gain on its Bitcoin for the third quarter, after losing $22.8 billion in the first two, so it is still behind for the year. Shareholders vote October 28 on paying its dividends daily. MSCI, the index company whose lists many funds copy, decides October 16 whether to drop it; those funds would then have to sell its shares.",
    wouldChange: "A weekly filing with no new shares sold and coins still bought from cash, or any coins sold, would say the share sales were a two-week exception.",
    asOf: "OCT 5, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K, September 28, 2026 (1,665 BTC bought Sep 21–27 at $85,681, funded by MSTR stock sales; 1,469,165 shares sold for $246.2M net; STRC repurchase $151.7M; holdings 847,666)", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000119312526403417/mstr-20260914.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K, October 5, 2026 (334 BTC bought Oct 1–4 at $85,839: $15.7M from MSTR stock sales, $13.0M cash; holdings 848,000 at $75,441 average; Q3 estimated gain on digital assets $20.91B; STRC repurchase $73.7M; USD Cash $833.4M)", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000119312526413164/mstr-20261005.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K, October 1, 2026 (STRC dividend rate held at 12.00%; special meeting October 28, 10 a.m. ET, on daily dividend record dates)", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526409863/mstr-20260930.htm" },
      { label: "Strategy — response to MSCI's consultation on non-operating companies (Sep 1); MSCI's results are due October 16", url: "https://www.strategy.com/msci" },
    ],
  },
  {
    label: "SOVEREIGN • SEP 16",
    title: "A House Committee Votes to Lock the Government's Bitcoin Away for 20 Years",
    plain: "A House committee approved a bill writing the U.S. Bitcoin reserve into law: a 20-year sales ban, no new buying, so no new demand. A House vote waits until November.",
    detail: "In March 2025 the president created a Strategic Bitcoin Reserve by executive order, which a future president could undo. This bill would write it into law. On September 16 the House Financial Services Committee approved it 28 to 21. The Treasury Department would take custody of the government's Bitcoin, about 328,000 coins, mostly seized in criminal cases and worth about $28 billion, and could not sell, swap or pledge any of them for 20 years. An outside auditor would check the holdings every year, and states could store their own Bitcoin alongside. It buys no more coins, only ordering a study of how to do so without borrowing or new taxes. The same morning, the House tax committee approved, 38 to 5, a bill taxing crypto more like stocks. The House left for the elections the next day, so neither bill can reach the floor before November 9.",
    wouldChange: "A full House vote scheduled for the November session, or the Senate Banking Committee taking up a matching bill, would make this more than a committee vote that goes nowhere.",
    statusTone: "advancing",
    asOf: "SEP 16, 2026",
    sources: [
      { label: "House Financial Services Committee — Markup of Various Measures, September 16, 2026: H.R. 8957 ordered reported 28–21; Steil substitute adopted by voice vote", url: "https://financialservices.house.gov/calendar/eventsingle.aspx?EventID=411219" },
      { label: "docs.house.gov — Steil amendment in the nature of a substitute to H.R. 8957: 20-year minimum holding period, annual audited proof of reserve, no purchase authority", url: "https://docs.house.gov/meetings/BA/BA00/20260916/119565/BILLS-119-HR8957-S001213-Amdt-6.pdf" },
      { label: "Congress.gov — H.R. 8957, American Reserve Modernization Act of 2026: 'Ordered to be Reported (Amended) by the Yeas and Nays: 28 - 21'", url: "https://www.congress.gov/bill/119th-congress/house-bill/8957/all-actions" },
      { label: "House Ways and Means Committee — September 16, 2026: Digital Asset Tax Certainty Act (H.R. 10357) approved 38–5", url: "https://waysandmeans.house.gov/2026/09/16/historic-digital-asset-tax-legislation-advances-to-keep-america-the-crypto-capital-of-the-world/" },
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
  { date: "Oct 7", title: "Bitcoin falls below $84,000 and about $550 million of leveraged bets are closed out as the 30-year Treasury yield hits 5.7%, its highest since 2002, and oil tops $100 again", source: "CoinDesk", tag: "MARKETS", important: true },
  { date: "Oct 6", title: "Treasury's anti-money-laundering office withdraws a 2020 plan to report transfers above $10,000 to personal Bitcoin wallets and a 2023 plan to flag coin-mixing services, saying lawful users may 'privately transact on a public blockchain'", source: "FinCEN", tag: "REGULATION", important: true },
  { date: "Oct 6", title: "U.S. Bitcoin ETFs take in $119 million, all of it into BlackRock's fund, a day after $90 million left; the week of September 28 brought $241 million, a tenth of the week before", source: "The Block", tag: "ETFs" },
  { date: "Oct 5", title: "Strategy buys 334 Bitcoin, mostly with new share sales, and estimates a $20.9 billion third-quarter paper gain; Strive buys 2,000 for $169 million, lifting its holdings to 29,462", source: "SEC EDGAR", tag: "CORPORATE" },
];
