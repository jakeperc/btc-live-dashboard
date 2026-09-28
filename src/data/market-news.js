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
  asOf: "SEP 25, 2026",
  refreshedAt: "2026-09-26T09:00:00Z",
  title: "Bitcoin Breaks Out to an Eight-Month High on the Year's Strongest Fund Buying",
  status: "High of $87,300 Sept 21; fund inflows seven days running",
  statusTone: "advancing",
  narrative: "Bitcoin climbed from about $75,500 after the September 16 interest-rate rise to $87,300 on September 21, its highest since late January, and ended the week near $84,000. The push came from the U.S. spot Bitcoin ETFs, funds that hold Bitcoin and trade on the stock market. They took in money on seven straight days, about $3 billion, including $999 million on September 21, their biggest day since Bitcoin's record high last October. Traders betting on a fall were forced to buy back about $840 million that day.",
  whyItMatters: "Big investors are buying Bitcoin again, and buying more of it than at any point this year, even though interest rates just went up. For the first time since January, the average person who bought Bitcoin through a stock-market fund is back in profit. That does not make the rise permanent: two days of selling already trimmed it.",
  wouldChange: "Two straight days of withdrawals from the funds, or a close back below $82,000, the level the rally broke through, would say this was forced buying, not new demand.",
  milestoneLabel: "Next checkpoint",
  milestone: "September 30: August inflation figures, on the measure the Federal Reserve, the U.S. central bank, prefers. October 2: the September jobs report. Both feed its October 28 rate decision. Watch whether the funds keep taking in money once the forced buying fades, and whether Bitcoin holds above $82,000, the ceiling it broke through on September 21.",
  sources: [
    { label: "Farside Investors — U.S. spot Bitcoin ETF daily flows: inflows on seven straight days, Sep 17–25, about $3 billion in total; $2.39 billion in the week of Sep 21–25, the best of 2026", url: "https://farside.co.uk/btc/" },
    { label: "The Block — Sep 22: $999 million entered the U.S. spot Bitcoin ETFs on Sep 21, the largest day since Oct 6, 2025; Bitcoin peaked at $87,300", url: "https://www.theblock.co/news/markets/2026-09-22-spot-bitcoin-etfs-1-billion-daily-inflow-416005" },
    { label: "CoinDesk — Sep 23: July +4.8%, August +25.2%, September +10.9%, Bitcoin's first three-month winning run since 2012", url: "https://www.coindesk.com/markets/2026/09/23/bitcoin-s-on-a-streak-it-hasn-t-hit-since-2012" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • SEP 25",
    title: "The Fed Raised Rates on September 16; Bond Yields Then Hit a 19-Year High",
    plain: "The U.S. central bank raised rates on September 16 and bond yields hit a 19-year high. Bitcoin, which pays no interest, now competes harder for money.",
    detail: "On September 16 the Federal Reserve, the U.S. central bank, raised its key rate a quarter point, to a range of 3.75% to 4.00%, its first rise since July 2023, and penciled in one more this year. On September 24 the yield on the 10-year Treasury bond, the interest rate the U.S. government pays to borrow for ten years, hit 5.21%, its highest since 2007; it was 4.96% on decision day. Bond buyers blame oil near $106 a barrel, with the Strait of Hormuz still closed by the Iran war, and $40 trillion of federal debt. Traders' bets now make another quarter-point rise on October 28 slightly more likely than not, and one by December very likely. Bitcoin rallied anyway, which is the puzzle of the week. On the eve of the September decision, an October rise was close to a coin flip, leaning no.",
    wouldChange: "An August inflation reading on September 30 that comes in below July's 3.7% would cool the October rate-rise bets and ease the pressure on Bitcoin.",
    statusTone: "active",
    asOf: "SEP 25, 2026",
    sources: [
      { label: "Federal Reserve — FOMC statement, September 16, 2026: target range raised a quarter point to 3.75%–4.00%, vote 12–0", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm" },
      { label: "Federal Reserve — Summary of Economic Projections, September 16, 2026: median end-2026 rate 4.1%, up from 3.8% in June", url: "https://www.federalreserve.gov/monetarypolicy/fomcprojtabl20260916.htm" },
      { label: "CentralBank.watch — fed funds futures, Sep 25: 61.6% odds of another rise on Oct 28 (43.5% on Sep 15), 91.7% by Dec 9", url: "https://centralbank.watch/federal-reserve/" },
    ],
  },
  {
    label: "REGULATION • SEP 17",
    title: "The Senate Blocks the CLARITY Act; the SEC Starts Writing Rules Without It",
    plain: "The Senate fell eleven votes short of debating the crypto rules bill, so regulators, not Congress, write the rules until at least November.",
    detail: "The bill would write into law which referee governs crypto: Bitcoin under the CFTC, which oversees gold and oil markets, with the SEC, the stock-market regulator, keeping assets that work like investment contracts. On September 15 the Senate voted 49 to 50 on cloture (the 60-vote hurdle a bill must clear before the Senate will debate it). Every Democrat present voted no, saying the ethics section does not effectively apply to the president and his family. No second vote is scheduled; the Senate leaves October 2 and returns November 9, so the bill's only 2026 window is the post-election session. A betting market puts passage this year at about 7%, from 23% before the vote. The regulators moved first: on September 17 the SEC used its own authority to let U.S. stocks trade as blockchain tokens for five years, and the CFTC says its crypto market rules are ready.",
    wouldChange: "A dated announcement of a second Senate vote, or a Democratic negotiator confirming an ethics deal with the White House, would put passage back on the table.",
    statusTone: "stalled",
    asOf: "SEP 17, 2026",
    sources: [
      { label: "U.S. Senate Daily Press — Tuesday, September 15, 2026: cloture on the motion to proceed to H.R. 3633 fails 49–50; Tillis files a motion to reconsider", url: "https://www.dailypress.senate.gov/tuesday-september-15-2026/" },
      { label: "SEC — press release 2026-90, September 17, 2026: five-year 'innovation exemption' for on-chain trading of tokenized U.S.-listed stocks", url: "https://www.sec.gov/newsroom/press-releases/2026-90-sec-issues-innovation-exemption-facilitate-trading-tokenized-nms-stock-request-comment" },
      { label: "The Block — 'Go time': SEC and CFTC chairs say they will write crypto rules under existing authority (Sep 16)", url: "https://www.theblock.co/news/regulation/2026-09-16-go-time-sec-cftc-prepare-push-crypto-rules-clarity-act-stalls-senate-415281" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 7% (Sep 26)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "CORPORATE TREASURY • SEP 25",
    title: "Strategy Buys 950 Bitcoin With Cash While Its Share Sales Stay Shut",
    plain: "Strategy, the biggest corporate Bitcoin holder, bought 950 Bitcoin with its own cash rather than by selling new shares, a change in how it pays.",
    detail: "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other) sold coins three times this summer and then paused. Its September 21 filing covers September 14 to 20: it bought 950 Bitcoin for $75.7 million, about $79,670 each, paid from cash, not from selling new shares, which it has not done for three weeks. Holdings are 846,000 coins, about 4% of all the Bitcoin that will ever exist, bought at an average of $75,416, so at $84,000 it shows a paper gain. It also spent $174 million buying back its preferred shares (shares paid dividends ahead of ordinary stock), leaving $1.05 billion of cash. A September 25 filing asks shareholders to approve, on October 28, paying those dividends daily instead of monthly or quarterly. MSCI, the index company whose lists many funds copy, decides October 16 whether to eject the company from its indexes.",
    wouldChange: "A weekly filing showing coins sold, or new shares sold to fund a purchase, would say the cash-funded buy was a one-off rather than a new pattern.",
    asOf: "SEP 25, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K, September 21, 2026 (950 BTC bought Sep 14–20 at $79,670 with USD Cash; holdings 846,000; no ATM sales; $174.0M STRC repurchase)", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526396093/mstr-20260914.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K, September 25, 2026 (board proposes daily dividend record dates for STRF, STRC, STRK and STRD; special meeting Oct 28)", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526401636/mstr-20260924.htm" },
      { label: "Strategy — response to MSCI's consultation on non-operating companies (Sep 1)", url: "https://www.strategy.com/msci" },
    ],
  },
  {
    label: "SOVEREIGN • SEP 16",
    title: "A House Committee Votes to Lock the Government's Bitcoin Away for 20 Years",
    plain: "A House committee approved a bill writing the U.S. Bitcoin reserve into law with a 20-year sales ban; a House vote must wait until November.",
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
  { date: "Sep 25", title: "U.S. spot Bitcoin ETFs take in $134 million for a seventh straight day, capping a $2.39 billion week, their best of 2026; Bitcoin holds near $84,000 after a two-day pullback from Monday's $87,300 high", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Sep 24", title: "The 10-year Treasury yield touches 5.21%, its highest since 2007, as oil near $106 and a $40 trillion federal debt drive a bond selloff; odds of an October Fed rate rise climb to about 60%", source: "Bloomberg", tag: "MACRO", important: true },
  { date: "Sep 25", title: "Strategy asks shareholders to approve, on October 28, paying dividends on four of its share classes daily instead of monthly or quarterly; its September 21 filing showed 950 Bitcoin bought with cash", source: "SEC EDGAR", tag: "CORPORATE" },
  { date: "Sep 23", title: "Blockstream publishes its post-mortem on the Liquid sidechain exploit: two software bugs, about 602 Bitcoin still outstanding, and withdrawals still frozen with no date set; Bitcoin itself was never affected", source: "Blockstream", tag: "SECURITY" },
];
