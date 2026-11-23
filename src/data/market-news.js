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
  asOf: "NOV 21, 2026",
  refreshedAt: "2026-11-23T11:30:00Z",
  title: "Bitcoin at a Two-Year Low as Technology Stocks Slump and Fund Withdrawals Grow",
  status: "Low of about $55,100 on Nov 21; about $61,300 on Nov 23",
  statusTone: "active",
  narrative: "Bitcoin fell to about $55,100 early on November 21, its lowest since September 2024, then recovered above $60,000. It ended the week about 6% lower, a seventh weekly loss in a row. The fall came in the worst week for U.S. technology shares since March 2020: the Nasdaq, the main index of those shares, lost about 10%. $1.79 billion left U.S. Bitcoin funds traded on the stock market, the third-largest weekly withdrawal on record. About $1.8 billion of bets made with borrowed money were force-closed in a day.",
  whyItMatters: "Bitcoin is about 6% lower than a week ago and about 51% below its October 2025 record. It fell with technology shares and gold as investors moved to cash. Strategy, the biggest corporate holder, now holds coins worth about 19% less than it paid, and money is leaving Bitcoin funds faster than a week ago.",
  wouldChange: "A week ending above $65,000 with money returning to U.S. Bitcoin funds would say the selling is done; a week ending under $58,000 would say it is not.",
  milestoneLabel: "Next checkpoint",
  milestone: "November 25: October's consumer-spending price index, the inflation measure the Federal Reserve, the U.S. central bank, watches most. November 26: U.S. stock markets close for Thanksgiving, so Bitcoin funds do not trade. November 30: funds that copy MSCI's stock lists must finish selling Strategy shares; Trump Media's lenders may demand cash. December 9: the Federal Reserve decides on rates.",
  sources: [
    { label: "CoinGecko API — Nov 23, 2026, 11:06 UTC: Bitcoin $61,322; 24-hour range $60,358–$61,796; down 5.0% over 7 days, 17.2% over 14 days and 23.9% over 30 days; 51.4% below the all-time high of $126,080 (Oct 6, 2025); market value $1.23 trillion", url: "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false" },
    { label: "CoinGecko API — daily prices at 00:00 UTC: Nov 16 $65,305 · Nov 17 $64,841 · Nov 18 $64,889 · Nov 19 $62,997 · Nov 20 $61,921 · Nov 21 $58,818 · Nov 22 $60,121 · Nov 23 $61,172 (weekly close, −6.3% from the Nov 16 open); hourly low $55,711 at 06:00 UTC Nov 21", url: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=9&interval=daily" },
    { label: "CoinDesk — Nov 21: Bitcoin rebounds more than 9% from an early low of $55,130, its weakest level since September 2024, to about $60,300; about $1.8 billion of leveraged positions liquidated in 24 hours (CoinGlass), $1.3 billion of them bets on rising prices; Nasdaq down more than 4% on Friday", url: "https://www.coindesk.com/markets/2026/11/21/bitcoin-bounces-9-from-two-year-low-to-retake-usd60-000-as-traders-eye-monday-s-stock-open" },
    { label: "CoinDesk — Nov 20 live blog: Bitcoin below $60,000 for the first time since early July; record $541.1M one-day outflow from BlackRock's fund on Thursday (Farside); Anthropic priced its IPO at $83, closed its first day at $97 and fell about 11% on Friday; Nvidia down about 12% on a reported SEC accounting inquiry; Strategy −9.7%, miners −18%; gold as low as $3,515", url: "https://www.coindesk.com/tech/2026/11/20/live-news-bitcoin-hovers-just-above-usd61-000-as-anthropic-slides-13-after-nasdaq-debut" },
    { label: "CoinDesk — Nov 23: the Nasdaq fell 10.4% last week, its largest drop since the March 2020 crash; the VIX rose 86%; Bitcoin fell more than 6% and briefly dipped below $55,500, its lowest in two years", url: "https://www.coindesk.com/markets/2026/11/23/market-rout-kills-50-basis-points-december-fed-rate-hike-bets" },
    { label: "TFTC Bitcoin ETF flow tracker (Farside-matched) — November 2026: Nov 16 +$8.0M · Nov 17 −$239.9M · Nov 18 −$306.4M · Nov 19 −$582.2M · Nov 20 −$669.2M; week −$1,789.7M (IBIT −$1,367.5M, about 76%); prior week −$1,065.5M; month to date about −$4.14B; updated Nov 20, revisions checked Nov 23", url: "https://www.tftc.io/bitcoin-etf-flows/november-2026" },
    { label: "Cointelegraph — Nov 23 (SoSoValue data): $1.79B left U.S. spot Bitcoin ETFs in the week ended Nov 20, the third-largest weekly outflow since launch (record $2.61B, week ended Feb 28, 2025); four straight weeks of outflows total $4.34B; BlackRock's fund set single-day outflow records of $541.1M on Thursday and $544.7M on Friday", url: "https://cointelegraph.com/markets/bitcoin-etfs-third-largest-weekly-outflows-1-8-billion" },
    { label: "Alternative.me Crypto Fear & Greed Index — Nov 16 10 · Nov 17 12 · Nov 18 11 · Nov 19 10 · Nov 20 12 · Nov 21 12 · Nov 22 11 · Nov 23 11 ('Extreme Fear')", url: "https://api.alternative.me/fng/?limit=10" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • NOV 20",
    title: "A Quarter-Point December Rate Rise Stays Very Likely; the Half Point Fades",
    plain: "A December rise in U.S. interest rates is still very likely, which weighs on Bitcoin, but traders no longer expect the bigger half-point move.",
    detail: "Bitcoin pays no interest, so higher rates work against it. On November 18 the Federal Reserve, the U.S. central bank, published the record of its October meeting. Almost all officials thought further rate rises would likely be appropriate. A couple said a rise of more than a quarter point could be considered in December if inflation data were unfavorable. The same day Christopher Waller, a Federal Reserve governor, argued on CNBC, a business news channel, for a half point, saying officials 'might need to, like, shock people'. Then stock markets slumped, and traders dropped the half-point bet. They still treat a quarter-point rise on December 9 as very likely, about 90 chances in 100. The government's 10-year borrowing rate fell to 4.92% on November 20 from 5.15% a week earlier. October's reading of the inflation measure the central bank watches most arrives November 25; forecasters expect 0.3%.",
    wouldChange: "October inflation on November 25 at 0.4% or more would bring the half-point rise back; 0.2% or less, or officials signalling a pause, would soften this read.",
    statusTone: "active",
    asOf: "NOV 20, 2026",
    sources: [
      { label: "Federal Reserve — Minutes of the Federal Open Market Committee, October 27–28, 2026 (released Nov 18): 'most participants expressed support for maintaining the target range'; 'some participants favored an increase of 25 basis points'; 'a couple of participants noted that an increase of more than 25 basis points could warrant consideration at the next meeting' if inflation data were unfavorable; almost all judged further increases would likely be appropriate; vote 10–2, Cook and Hammack dissenting in favor of a quarter-point rise", url: "https://www.federalreserve.gov/monetarypolicy/fomcminutes20261028.htm" },
      { label: "Cointelegraph — Nov 18: Governor Christopher Waller on CNBC argues for a 50 basis point rise in December, saying officials 'might need to, like, shock people' on inflation expectations; CME FedWatch odds of a 25 basis point rise above 95%; Bitcoin below $63,000", url: "https://cointelegraph.com/markets/bitcoin-stocks-wobble-waller-talks-shock-50-point-rate-hike" },
      { label: "CoinDesk — Nov 23: after last week's selloff fed funds futures show no expectation of a 50 basis point rise in December (CME FedWatch; about 10% ten days earlier); a 25 basis point rise to 4.00%–4.25% is expected; October core PCE due this week, RBC expects +0.3%", url: "https://www.coindesk.com/markets/2026/11/23/market-rout-kills-50-basis-points-december-fed-rate-hike-bets" },
      { label: "CentralBank.watch — fed funds futures as of Nov 20: 90.2% odds of a 25 basis point rise on Dec 9 (current rate 3.88%); a further move 67.8% priced for the Jan 27, 2027 meeting", url: "https://centralbank.watch/federal-reserve/" },
      { label: "U.S. Treasury — daily par yield curve, November 2026 (2y / 10y / 30y): Nov 13 4.88/5.15/5.47 · Nov 16 4.83/5.12/5.46 · Nov 17 4.80/5.10/5.46 · Nov 18 4.80/5.07/5.41 · Nov 19 4.76/5.04/5.40 · Nov 20 4.63/4.92/5.31", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202611" },
      { label: "Federal Reserve — FOMC calendar: December 8–9, 2026 meeting (with projections); minutes released three weeks after each decision (October 28 minutes about Nov 18); first 2027 meeting January 26–27. BEA: Personal Income and Outlays for October (PCE prices) Nov 25, 8:30 a.m. BLS: November CPI Dec 10", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
    ],
  },
  {
    label: "CORPORATE TREASURY • NOV 16",
    title: "Strategy Buys Fewer Coins as Its Bitcoin Sits 19% Below Cost; MSCI Exit Nears",
    plain: "Strategy, the biggest Bitcoin-holding company, bought just 485 coins last week, so a steady buyer is buying less while its coins sit 19% below cost.",
    detail: "Strategy, the biggest corporate Bitcoin holder, buys coins by selling its own shares. In the week to November 15 it bought 485 coins for $33.4 million, about one day of worldwide new supply and less than half the week before. It raised $245 million selling shares and spent most of it, $206 million, buying back preferred shares, which pay a fixed yearly rate. It holds 850,849 coins at an average cost of $75,452, so at $61,300 they are worth about 19% less than it paid. The filing reports no coin sales. Its shares fell about 10% on November 20 alone. MSCI, whose stock lists many funds copy, drops Strategy after November 30. Funds copying those lists hold about 3% of its shares and must sell them. The same day, lenders to Trump Media, a smaller holder, may demand $977 million in cash. It plans to borrow, not sell coins.",
    wouldChange: "A Strategy filing showing a coin sale, or Trump Media selling coins to meet the November 30 demand, would lower this read; a purchase above 1,000 coins would lift it.",
    statusTone: "stalled",
    asOf: "NOV 16, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K filed November 16, 2026 (period Nov 9–15): 485 BTC bought for $33.4M at $68,887 average; holdings 850,849 BTC at $75,452 average, $64.20B aggregate cost; 2,087,040 MSTR shares sold for $244.7M net ($33.4M to bitcoin, $206.3M to STRC repurchases, $5.0M to USD Cash); 2,282,510 STRC shares repurchased for $228.1M; no preferred ATM sales; USD Reserve $4.75B, USD Cash $151.2M; $18.09B MSTR ATM capacity left; STRC dividend rate held at 12.00% for December; no mention of MSCI or bitcoin sales. No later 8-K on EDGAR at 11:13 UTC Nov 23", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526462151/mstr-20261116.htm" },
      { label: "CoinDesk — Nov 20 live blog, closing prices: Strategy −9.7%, Coinbase −6.3%, bitcoin miners MARA −18.6%, IREN −18%, Hut 8 −17.7%", url: "https://www.coindesk.com/tech/2026/11/20/live-news-bitcoin-hovers-just-above-usd61-000-as-anthropic-slides-13-after-nasdaq-debut" },
      { label: "MSCI — 'MSCI announces final impact list of the non-operating companies methodology', November 11, 2026, 10:23 p.m. GMT: changes implemented as part of the November 2026 Index Review (effective as of the close of November 30); the list of impacted constituents is published on the consultation page", url: "https://app2.msci.com/webapp/index_ann/DocGet?pub_key=mRYGl6UqEfM%3D&lang=en&format=html" },
      { label: "MSCI — Final List of MSCI GIMI Securities Impacted by the Non-Operating Screening Methodology (xlsx, linked from msci.com/index-consultations)", url: "https://www.msci.com/downloads/documents/indexes/consultations/equity/Final%20List%20of%20MSCI%20GIMI%20Securities%20Impacted%20by%20the%20Non-Operating%20Screening%20Methodology.xlsx" },
      { label: "Bitcoin Magazine — Nov 11: MSCI's November 2026 Index Review, posted after 5 p.m. ET, removes Strategy from the MSCI USA Index (and so from MSCI World and ACWI) effective at the close of Nov 30; also deleted under the non-operating screen: Metaplanet (MSCI Japan Small Cap), Yellow Cake (UK Small Cap), Skel (Iceland Frontier Small Cap), Upexi (USA Micro Cap); Strategy's own estimate: funds tracking MSCI's global indexes hold 3.1% of its basic shares; MSTR $122.35 at the close, $120.50 after hours (−1.5%); Strategy's August letter: a deletion 'would have no meaningful impact on Strategy's business'", url: "https://bitcoinmagazine.com/markets/msci-removes-strategy-mstr-usa-index" },
      { label: "SEC EDGAR — Trump Media & Technology Group Form 10-Q for the quarter ended September 30, 2026 (filed Nov 9): digital assets $406.7M unpledged and $951.4M pledged (restricted to cover unexpired call and put options); cash $182.3M, short-term investments $211.1M; convertible notes $976.8M classified as a current liability; nine-month net loss $234.2M", url: "https://www.sec.gov/Archives/edgar/data/1849635/000143774926035884/djt20260930_10q.htm" },
      { label: "Forex Crunch — Nov 13 (from the 10-Q): 15,649 BTC held at Sept 30; 11,385.20 BTC (about 73%) pledged to the options program; 4,260.73 BTC ($356.1M) collateral for the 2028 notes; cash $182M plus $211M short-term investments; holders of the $1B 0% notes may require cash repurchase at full principal on Nov 30; repayment expected to be 'a mix of cash and credit'; pledged coins 'cannot be sold or used while the arrangements run'", url: "https://www.forexcrunch.com/blog/2026/11/13/trump-media-pledges-73-of-its-bitcoin-to-options-program-weeks-before-1b-note-deadline/" },
      { label: "International Business Times — Nov 10 (citing the 10-Q and the FT): pledged digital assets about $951M, unpledged about $407M; about $395M available for immediate use; nine-month net loss about $234.2M; shares $4.64 against a $34.72 conversion price, so holders are expected to demand cash; interim CEO Kevin McGurn: a mix of cash and borrowing, keeping as much bitcoin as possible", url: "https://www.ibtimes.co.uk/trump-media-bitcoin-sale-debt-repayment-demands-1832279" },
    ],
  },
  {
    label: "REGULATION • NOV 19",
    title: "The Senate Finishes Its Energy Bill; the Crypto Rules Bill Still Has No Vote",
    plain: "The Senate spent two weeks on an energy bill and has scheduled no vote on the crypto rules bill, which is unlikely to pass.",
    detail: "The CLARITY Act, the crypto rules bill, would write into law which referee governs crypto, with Bitcoin under the CFTC, the agency that oversees gold and oil markets. It failed a Senate vote 49–50 in September and dies when the new, Democratic-led Congress opens on January 3, unless both chambers pass it first. The Senate spent its first two weeks back on a bill speeding permits for power plants and mines, passed 62–33 on November 19. Government funding runs out December 11, and a defense bill and farm bill also compete for the Senate's time. No vote on the crypto bill has been scheduled. Bettors now give passage this year less than 1 chance in 100, down from 2. Elizabeth Warren, the bill's leading opponent, is in line to chair the Senate committee that handles it in January. She has said she wants a different bill.",
    wouldChange: "A Senate vote on the bill scheduled before December 11 would weaken our view that it waits for the next Congress; sponsors conceding the delay would confirm it.",
    statusTone: "stalled",
    asOf: "NOV 19, 2026",
    sources: [
      { label: "U.S. Senate — roll call votes, 119th Congress, 2nd session: No. 257 (Nov 9) cloture on the motion to proceed to H.R. 2347, the vehicle for the permitting bill, 73–25; No. 267 (Nov 18) Capito substitute amendment 69–27; No. 268 (Nov 18) cloture on H.R. 2347, 65–31; No. 270 (Nov 19) H.R. 2347 as amended passed 62–33; Nov 12–20 otherwise spent on judicial nominations; no vote on H.R. 3633", url: "https://www.senate.gov/legislative/LIS/roll_call_lists/vote_menu_119_2.htm" },
      { label: "Bloomberg Government — Nov 18: the Senate votes 65–31 to end debate on the bipartisan permitting bill after approving a manager's amendment 69–27; final passage expected by the end of the week", url: "https://news.bgov.com/bloomberg-government-news/senate-permitting-legislation-advances-setting-up-final-push" },
      { label: "Polymarket — 'Clarity Act (H.R.3633) signed into law in 2026?' priced below 1% on $25.8 million traded (Nov 23; 2% on Nov 16)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
      { label: "FinanceFeeds — Nov 4: the Sept 15 cloture vote failed 49–50 with Collins, Hawley, Moran and Tillis opposed; Tillis's motion to reconsider keeps one more cloture vote possible without restarting; the 120th Congress convenes Jan 3, 2027 and unpassed bills expire; House Financial Services Chair French Hill: 'I still have hopes that we can get it passed in the lame duck session'", url: "https://financefeeds.com/cryptos-clarity-act-faces-its-last-shot/" },
      { label: "The Block — Sept 15: Sen. Elizabeth Warren says she wants a crypto bill but 'the Clarity Act just isn't it'; asked whether she would lead on crypto legislation if she chairs the Banking Committee, she said she would", url: "https://www.theblock.co/news/regulation/2026-09-15-sen-elizabeth-warren-says-she-wants-a-crypto-bill-but-the-clarity-act-just-isn-t-it-414869" },
      { label: "Holland & Knight — Oct 9, 2026: the continuing resolution funding the government expires December 11, 2026, the main forcing deadline of the lame-duck session; the FY2027 NDAA, the Farm Bill and health-program extenders (Dec 31) compete for the same floor time", url: "https://www.hklaw.com/en/insights/publications/2026/10/beyond-the-midterms-congress-faces-converging-year-end-deadlines" },
      { label: "CNBC — midterm live updates, Nov 3–4: Democrats projected to win the House with at least 245 seats and the Senate; the new Congress convenes January 3, 2027", url: "https://www.cnbc.com/2026/11/03/midterm-elections-2026-live-updates.html" },
    ],
  },
  {
    label: "ETFs • NOV 20",
    title: "New Doors Into Bitcoin: Russia's Retail Rule Takes Effect; Swiss Fund Still Waiting",
    plain: "Since November 17 ordinary Russians may buy Bitcoin through licensed firms, but big banks are not ready and money keeps leaving existing funds.",
    detail: "New ways to buy move the price only if money comes in. On November 17 a rule from the Bank of Russia, the country's central bank, took effect. Ordinary investors may now buy Bitcoin and two other coins through licensed firms. Purchases are capped at 300,000 rubles, about $3,700, a year per firm, after a knowledge test. Thirty firms had registered by November 18, but two big banks, VTB and T-Bank, were still preparing, and the register gives no start dates. The Moscow Exchange, Russia's main stock market, plans pilot trades from December 1. Switzerland's first Bitcoin fund for ordinary savers has not listed yet; its manager promised November. BlackRock, the biggest fund manager, has filed for a U.S. fund that uses option contracts (a form of price insurance) to cap losses at about 10%. Meanwhile $1.79 billion left the existing U.S. funds in the week to November 20.",
    wouldChange: "Russian banks opening retail buying, or the Swiss fund listing in November, with money arriving would strengthen this read; the Moscow Exchange slipping past December 1 would weaken it.",
    statusTone: "advancing",
    asOf: "NOV 20, 2026",
    sources: [
      { label: "crypto.news — Nov 18: Russia's retail crypto rules took effect Nov 17 for Bitcoin, Ether and USDT; 30 authorized operators on the Bank of Russia register by Nov 18 (Kriptozakon tally); VTB and T-Bank still preparing; the listings 'give no date for when a firm starts taking customer orders'; exchanges may start from Nov 22 once their trading rules are approved; Moscow Exchange expects pilot deals from Dec 1", url: "https://crypto.news/russia-crypto-operators-retail-trading/" },
      { label: "Bank of Russia — press release, November 6, 2026, 'Crypto for non-qualified investors: Bank of Russia directive': from November 17 non-qualified investors may buy Bitcoin, Ether and USD Tether through a broker, manager or crypto exchanger, on or off exchange; limit 300,000 rubles a year through one intermediary; mandatory testing and risk acknowledgement for all investors; exchanges may admit the three assets to public circulation from that date; assets chosen for liquidity (market value, daily volume, at least five years of price history)", url: "https://www.cbr.ru/press/event/?id=32964" },
      { label: "Izvestia — Oct 31, 2026: Boris Blokhin, the Moscow Exchange's senior managing director for sales: trading in Bitcoin, Ethereum and USDT planned from December 1; sessions 07:00–00:00 Moscow time; custody by partner digital depositories; initially only assets meeting the regulator's requirements for unqualified investors", url: "https://iz.ru/en/node/2194300" },
      { label: "FINMA — press release, October 20, 2026 (PDF): approval of Switzerland's first Bitcoin ETF for retail investors as an 'other fund for alternative investments' with a specific risk", url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/8news/medienmitteilungen/2026/10/20261020-mm-finma-bitcoin-etf.pdf" },
      { label: "The Block — Oct 20 (updated Oct 23): BIT Asset Management confirms its Bitcoin Fund ETF (BBIT), SIX listing expected November 2026; no listing found as of Nov 23", url: "https://theblock.co/news/regulation/2026-10-20-swiss-regulator-finma-approves-countrys-first-spot-bitcoin-etf-for-retail-investors-421127" },
      { label: "SEC EDGAR — iShares Trust Form 485APOS filed October 19, 2026: iShares Bitcoin Managed Protection ETF (PBIT); call-option spreads on IBIT-type reference assets; initial maximum loss about 10% before fees; effective 75 days after filing", url: "https://www.sec.gov/Archives/edgar/data/1100663/000119312526425335/d144515d485apos.htm" },
      { label: "TFTC Bitcoin ETF flow tracker (Farside-matched) — week Nov 16–20: −$1,789.7M, one small inflow day (Nov 16, +$8.0M); prior week −$1,065.5M; month to date about −$4.14B", url: "https://www.tftc.io/bitcoin-etf-flows/november-2026" },
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
  { date: "Nov 21", title: "Bitcoin falls to about $55,100, its lowest since September 2024, then rebounds above $60,000; about $1.8 billion of borrowed-money bets are force-closed in a day", source: "CoinDesk", tag: "MARKETS", important: true },
  { date: "Nov 20", title: "U.S. Bitcoin funds lose $1.79 billion in a week, the third-largest weekly withdrawal on record; BlackRock's fund sets one-day withdrawal records on Thursday and again on Friday", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Nov 23", title: "Bitcoin steadies near $61,300, about 51% below its October 2025 record; traders drop bets on a half-point December rate rise; a key U.S. inflation reading is due Wednesday", source: "CoinDesk", tag: "MARKETS" },
  { date: "Nov 21", title: "Bitcoin briefly trades near $17,000 on the Canadian-dollar market of Kraken, an exchange, about 70% below the price elsewhere; Kraken says the trades stand", source: "CoinDesk", tag: "MARKETS" },
];
