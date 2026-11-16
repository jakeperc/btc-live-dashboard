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
  asOf: "NOV 15, 2026",
  refreshedAt: "2026-11-16T11:40:00Z",
  title: "Bitcoin at a Four-Month Low: Hot Inflation, a Strong Dollar and Fund Withdrawals",
  status: "Low of about $62,000 on Nov 15; about $64,600 on Nov 16",
  statusTone: "active",
  narrative: "Bitcoin fell about 13% in the week to November 15 and touched about $62,000, its lowest since July 14. October prices rose 0.4%, more than expected, so a December rate rise is very likely and could be a half point. The dollar reached its strongest since April 2025, and the government's 10-year borrowing rate passed 5%. $1.07 billion left U.S. Bitcoin funds traded on the stock market, a second week above $1 billion, and more than $2 billion of bets with borrowed money were force-closed in a day.",
  whyItMatters: "Bitcoin is about 13% lower than a week ago and 49% below its October 2025 record. It fell alongside gold as traders bet on higher U.S. interest rates. Strategy, the biggest corporate holder, now holds coins worth about 14% less than it paid, and money keeps leaving the funds that hold Bitcoin for stock-market investors.",
  wouldChange: "A week ending above $70,000 with money returning to U.S. Bitcoin funds would say the selling is done; a week ending under $62,000 would say it is not.",
  milestoneLabel: "Next checkpoint",
  milestone: "November 17: Nvidia, the chipmaker, reports results; ordinary Russians may start buying Bitcoin through licensed firms. November 25: October inflation by the measure the Federal Reserve, the U.S. central bank, watches most. November 30: funds that copy MSCI's stock lists must finish selling Strategy shares; Trump Media's lenders may demand cash. December 9: the Federal Reserve decides on rates.",
  sources: [
    { label: "CoinGecko API — Nov 16, 2026, 11:08 UTC: Bitcoin $64,578; 24-hour range $64,126–$65,708; down 12.8% on the week and 20.8% over 30 days; 48.8% below the all-time high of $126,080 (Oct 6, 2025); market value $1.30 trillion", url: "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false" },
    { label: "CoinGecko API — daily prices at 00:00 UTC: Nov 9 $74,740 · Nov 10 $75,267 · Nov 11 $73,721 · Nov 12 $73,974 · Nov 13 $71,372 · Nov 14 $68,314 · Nov 15 $64,120 · Nov 16 $65,305 (weekly close, −12.6% from the Nov 9 open)", url: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=9&interval=daily" },
    { label: "CryptoTicker — Nov 15: week opened Monday at $74,757; overnight low $61,946 on Coinbase between 2 and 3 a.m. CET Sunday (CoinGecko 24h low $62,081); steepest weekly loss since the week of June 1 (−14.0%); over $2 billion liquidated in 24 hours across 320,000 traders (TokenPost), about $645M of Bitcoin longs; ETFs −$1.07B on the week, seven straight outflow days through Nov 13 (about $1.91B); Fear & Greed 10 on Sunday", url: "https://cryptoticker.io/en/bitcoin-price-overnight-low-weekly-close-november-15-2026/" },
    { label: "CoinDesk — Nov 16 live blog: Bitcoin below $62,000 on Saturday, back above $64,000; sixth consecutive weekly loss; down 17% in November; premarket Nov 16: gold $3,862, silver $47.50, Nasdaq 100 futures −0.8%, dollar index above 103, 10-year yield above 5.1%; Strategy −8% and Strive −9% premarket; 'lowest since July 14'", url: "https://www.coindesk.com/tech/2026/11/16/live-news-bitcoin-posts-sixth-weekly-loss-as-tech-stocks-and-metals-slide" },
    { label: "TFTC Bitcoin ETF flow tracker (Farside-matched) — November 2026: Nov 9 −$201.1M · Nov 10 −$95.0M · Nov 11 −$299.9M · Nov 12 −$284.0M · Nov 13 −$185.5M; week −$1,065.5M (IBIT −$908.4M, about 85%); no inflow day; month to date about −$2.35B; updated Nov 13, revisions checked Nov 16", url: "https://www.tftc.io/bitcoin-etf-flows/november-2026" },
    { label: "U.S. Treasury — daily par yield curve, November 2026 (2y / 10y / 30y): Nov 6 4.51/4.86/5.26 · Nov 9 4.56/4.88/5.26 · Nov 10 4.73/4.98/5.35 · Nov 12 4.86/5.10/5.43 · Nov 13 4.88/5.15/5.47", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202611" },
    { label: "Alternative.me Crypto Fear & Greed Index — Nov 9 29 · Nov 10 32 · Nov 11 29 · Nov 12 28 · Nov 13 20 · Nov 14 13 · Nov 15 10 · Nov 16 10 ('Extreme Fear')", url: "https://api.alternative.me/fng/?limit=10" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • NOV 10",
    title: "Hot October Inflation Makes a December Rate Rise Very Likely, Maybe a Half Point",
    plain: "U.S. prices rose more than expected in October, so a December rate rise is very likely, maybe a half point, which weighs on Bitcoin.",
    detail: "Bitcoin pays no interest, so higher rates work against it. On November 10 the Labor Department said consumer prices rose 0.4% in October, against 0.3% expected; prices other than food and energy rose 0.3% for a third month. The department cannot say how much prices rose over the whole year, because last October's survey was skipped during the 2025 government shutdown; KPMG, an accounting firm, estimates about 4.2%, up from 3.7%. The same day Christopher Waller, a governor of the Federal Reserve, the U.S. central bank, said he leans toward a quarter-point rise on December 9. He added that a half point 'should be considered' if that food-and-energy-free figure came in around 0.3%. It did. Traders now treat a December rise as very likely, about 97 chances in 100. The government's 10-year borrowing rate rose to 5.15% on November 13 from 4.86% a week earlier.",
    wouldChange: "Fed officials ruling out a half-point rise before December 9, or November inflation on December 10 coming in at 0.2% or less, would soften this read.",
    statusTone: "active",
    asOf: "NOV 10, 2026",
    sources: [
      { label: "BLS — Consumer Price Index, October 2026 (released Nov 10, 8:30 a.m. ET): all items +0.4% seasonally adjusted (September +0.6%); all items less food and energy +0.3% (third month at +0.3%); shelter +0.3%, energy +0.7%, food +0.5%; most 12-month changes not published because October 2025 data were not collected during the lapse in appropriations", url: "https://www.bls.gov/news.release/archives/cpi_11102026.htm" },
      { label: "Federal Reserve — Governor Christopher J. Waller, 'The Economic Outlook and Some Thoughts on Labor Market Dynamism', London, Nov 10, 2026: 'I am leaning toward supporting an increase in our policy rate of 25 basis points at the FOMC's December meeting'; a 50 basis point increase 'should be considered' if October core CPI is around 0.3 percent or higher, because 'hiking only 25 basis points would put our credibility at risk'; labor market 'stable'", url: "https://www.federalreserve.gov/newsevents/speech/waller20261110a.htm" },
      { label: "KPMG — Nov 10: October CPI 'cinch[es] a December rate hike'; 'the only question is whether it will be one quarter or one-half percent'; headline inflation about 4.2% year over year after 3.7% in September, interpolated because last year's October report was lost to the shutdown", url: "https://kpmg.com/us/en/articles/2026/october-2026-cpi.html" },
      { label: "CentralBank.watch — fed funds futures as of Nov 13: 97–100% odds of a rise on Dec 9 (current rate 3.88%); 100% cumulative odds the rate is higher by Jan 27, 2027, with a further move 79% priced for that meeting", url: "https://centralbank.watch/federal-reserve/" },
      { label: "U.S. Treasury — daily par yield curve, November 2026 (2y / 10y / 30y): Nov 6 4.51/4.86/5.26 · Nov 10 4.73/4.98/5.35 · Nov 12 4.86/5.10/5.43 · Nov 13 4.88/5.15/5.47", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202611" },
      { label: "Federal Reserve — FOMC calendar: December 8–9, 2026 meeting (with projections); minutes released three weeks after each decision (October 28 minutes about Nov 18); first 2027 meeting January 26–27. BEA: Personal Income and Outlays for October (PCE prices) Nov 25, 8:30 a.m. BLS: November CPI Dec 10", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
    ],
  },
  {
    label: "CORPORATE TREASURY • NOV 11",
    title: "MSCI Drops Strategy From Its Stock Lists; Its Bitcoin Now Sits 14% Below Cost",
    plain: "Strategy, the biggest Bitcoin-holding company, buys coins by selling shares. Funds copying MSCI's lists must sell its shares, and its coins sit 14% below cost, putting that buying in doubt.",
    detail: "Strategy, the biggest corporate Bitcoin holder, bought 1,036 coins for $81.9 million in the week to November 8, about two days of worldwide new supply. It raised $284 million selling shares, mostly spent buying back preferred shares, which pay a fixed yearly rate. It holds 850,364 coins at an average cost of $75,456, so at $64,600 they are worth about 14% less than it paid. On November 11 MSCI, whose stock lists many funds copy, confirmed it drops Strategy after November 30. Funds copying those lists hold about 3% of Strategy's shares and must sell them, the same stock Strategy sells to buy coins. Trump Media, a smaller holder, reported 15,649 coins on November 9, three quarters pledged in option deals and unsellable for now. Its lenders may demand $977 million in cash from November 30, against $182 million of cash; it plans to borrow, not sell coins.",
    wouldChange: "A Strategy filing showing a coin sale, or Trump Media selling coins to meet the November 30 demand, would lower this read; another purchase above 1,000 coins would lift it.",
    statusTone: "stalled",
    asOf: "NOV 11, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K filed November 9, 2026 (period Nov 2–8): 1,036 BTC bought for $81.9M at $79,012 average; holdings 850,364 BTC at $75,456 average, $64.16B aggregate cost; 2,051,348 MSTR shares sold for $283.8M net ($81.9M to bitcoin, $188.3M to STRC repurchases, $13.6M to USD Cash); 1,887,464 STRC shares repurchased for $188.3M; no preferred ATM sales; USD Reserve $4.77B, USD Cash $146.2M; $18.34B MSTR ATM capacity left; no MSCI disclosure", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526452693/mstr-20261109.htm" },
      { label: "MSCI — 'MSCI announces final impact list of the non-operating companies methodology', November 11, 2026, 10:23 p.m. GMT: changes implemented as part of the November 2026 Index Review (effective as of the close of November 30); the list of impacted constituents is published on the consultation page", url: "https://app2.msci.com/webapp/index_ann/DocGet?pub_key=mRYGl6UqEfM%3D&lang=en&format=html" },
      { label: "MSCI — Final List of MSCI GIMI Securities Impacted by the Non-Operating Screening Methodology (xlsx, linked from msci.com/index-consultations)", url: "https://www.msci.com/downloads/documents/indexes/consultations/equity/Final%20List%20of%20MSCI%20GIMI%20Securities%20Impacted%20by%20the%20Non-Operating%20Screening%20Methodology.xlsx" },
      { label: "Bitcoin Magazine — Nov 11: MSCI's November 2026 Index Review, posted after 5 p.m. ET, removes Strategy from the MSCI USA Index (and so from MSCI World and ACWI) effective at the close of Nov 30; also deleted under the non-operating screen: Metaplanet (MSCI Japan Small Cap), Yellow Cake (UK Small Cap), Skel (Iceland Frontier Small Cap), Upexi (USA Micro Cap); Strategy's own estimate: funds tracking MSCI's global indexes hold 3.1% of its basic shares; MSTR $122.35 at the close, $120.50 after hours (−1.5%); Strategy's August letter: a deletion 'would have no meaningful impact on Strategy's business'", url: "https://bitcoinmagazine.com/markets/msci-removes-strategy-mstr-usa-index" },
      { label: "SEC EDGAR — Trump Media & Technology Group Form 10-Q for the quarter ended September 30, 2026 (filed Nov 9): digital assets $406.7M unpledged and $951.4M pledged (restricted to cover unexpired call and put options); cash $182.3M, short-term investments $211.1M; convertible notes $976.8M classified as a current liability; nine-month net loss $234.2M", url: "https://www.sec.gov/Archives/edgar/data/1849635/000143774926035884/djt20260930_10q.htm" },
      { label: "Forex Crunch — Nov 13 (from the 10-Q): 15,649 BTC held at Sept 30; 11,385.20 BTC (about 73%) pledged to the options program; 4,260.73 BTC ($356.1M) collateral for the 2028 notes; cash $182M plus $211M short-term investments; holders of the $1B 0% notes may require cash repurchase at full principal on Nov 30; repayment expected to be 'a mix of cash and credit'; pledged coins 'cannot be sold or used while the arrangements run'", url: "https://www.forexcrunch.com/blog/2026/11/13/trump-media-pledges-73-of-its-bitcoin-to-options-program-weeks-before-1b-note-deadline/" },
      { label: "International Business Times — Nov 10 (citing the 10-Q and the FT): pledged digital assets about $951M, unpledged about $407M; about $395M available for immediate use; nine-month net loss about $234.2M; shares $4.64 against a $34.72 conversion price, so holders are expected to demand cash; interim CEO Kevin McGurn: a mix of cash and borrowing, keeping as much bitcoin as possible", url: "https://www.ibtimes.co.uk/trump-media-bitcoin-sale-debt-repayment-demands-1832279" },
    ],
  },
  {
    label: "REGULATION • NOV 9",
    title: "The Senate Spends Its First Week Back on Permitting; the Crypto Rules Bill Waits",
    plain: "The Senate's first week back went to an energy bill, not the crypto rules bill, which has until January 3 and is unlikely to pass.",
    detail: "The CLARITY Act, the crypto rules bill, would write into law which referee governs crypto, with Bitcoin under the CFTC, the agency that oversees gold and oil markets. It failed a Senate vote 49–50 in September and dies when the new, Democratic-led Congress opens on January 3, unless both chambers pass it first. The Senate returned November 9 and voted 73–25 to take up a bill speeding permits for power plants and mines. A final vote on that is expected in the coming weeks. Government funding runs out December 11, and a defense bill and farm bill also compete for the Senate's time. No vote on the crypto bill has been scheduled, and bettors give passage this year a 2% chance. Elizabeth Warren, the bill's leading opponent, is in line to chair the Senate committee that handles it in January. She has said she wants a different bill.",
    wouldChange: "A Senate vote on the bill scheduled before December 11 would weaken our view that it waits for the next Congress; sponsors conceding the delay would confirm it.",
    statusTone: "stalled",
    asOf: "NOV 9, 2026",
    sources: [
      { label: "Inside Climate News — Nov 10: the Senate voted 73–25 on Monday Nov 9 to end debate on the motion to take up the Bipartisan American Affordability and Jobs Act of 2026, the first of several procedural hurdles; final passage still needed, then the House, where Minority Leader Hakeem Jeffries has voiced opposition; Sens. Cortez Masto and Schatz want tribal-consultation changes", url: "https://insideclimatenews.org/?p=116018" },
      { label: "Axios — Nov 9: Senate advances the 494-page bipartisan permitting bill 73–25 in a key test vote; House Democratic leaders say the Senate bill falls short and Republican support for taking the Senate product is uncertain", url: "https://www.axios.com/2026/11/09/senate-advances-bipartisan-permitting-bill-key-test-vote" },
      { label: "Polymarket — 'Clarity Act (H.R.3633) signed into law in 2026?' priced at 2% on $25.2 million traded (Nov 16; 3% on Nov 9)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
      { label: "FinanceFeeds — Nov 4: the Sept 15 cloture vote failed 49–50 with Collins, Hawley, Moran and Tillis opposed; Tillis's motion to reconsider keeps one more cloture vote possible without restarting; the 120th Congress convenes Jan 3, 2027 and unpassed bills expire; House Financial Services Chair French Hill: 'I still have hopes that we can get it passed in the lame duck session'", url: "https://financefeeds.com/cryptos-clarity-act-faces-its-last-shot/" },
      { label: "The Block — Sept 15: Sen. Elizabeth Warren says she wants a crypto bill but 'the Clarity Act just isn't it'; asked whether she would lead on crypto legislation if she chairs the Banking Committee, she said she would", url: "https://www.theblock.co/news/regulation/2026-09-15-sen-elizabeth-warren-says-she-wants-a-crypto-bill-but-the-clarity-act-just-isn-t-it-414869" },
      { label: "Holland & Knight — Oct 9, 2026: the continuing resolution funding the government expires December 11, 2026, the main forcing deadline of the lame-duck session; the FY2027 NDAA, the Farm Bill and health-program extenders (Dec 31) compete for the same floor time", url: "https://www.hklaw.com/en/insights/publications/2026/10/beyond-the-midterms-congress-faces-converging-year-end-deadlines" },
      { label: "CNBC — midterm live updates, Nov 3–4: Democrats projected to win the House with at least 245 seats and the Senate; the new Congress convenes January 3, 2027", url: "https://www.cnbc.com/2026/11/03/midterm-elections-2026-live-updates.html" },
    ],
  },
  {
    label: "ETFs • NOV 13",
    title: "New Doors Into Bitcoin: Russia Opens Retail Buying November 17; Swiss Fund Still Waiting",
    plain: "From November 17 ordinary Russians may buy Bitcoin through licensed firms, the latest new door in; so far money is leaving through the existing doors.",
    detail: "New ways to buy move the price only if money comes in. The Bank of Russia, the country's central bank, confirmed on November 6 that from November 17 ordinary investors may buy Bitcoin and two other coins through licensed brokers and exchanges. Purchases are capped at 300,000 rubles, about $3,700, a year per firm, after a knowledge test. The Moscow Exchange, Russia's main stock market, plans to start trading them December 1. In Switzerland, the first Bitcoin fund for ordinary savers has not listed yet; its manager promised November. BlackRock, the biggest fund manager, has a U.S. fund that uses option contracts (a form of price insurance) to cap losses at about 10%; it takes effect in early January unless the SEC, the stock-market regulator, objects. So far these are doors, not demand: $1.07 billion left the existing U.S. funds in the week to November 13.",
    wouldChange: "Russian trading slipping past November 17 or December 1, or the Swiss fund missing November, would weaken this read; either starting on time with money arriving would strengthen it.",
    statusTone: "advancing",
    asOf: "NOV 13, 2026",
    sources: [
      { label: "Bank of Russia — press release, November 6, 2026, 'Crypto for non-qualified investors: Bank of Russia directive': from November 17 non-qualified investors may buy Bitcoin, Ether and USD Tether through a broker, manager or crypto exchanger, on or off exchange; limit 300,000 rubles a year through one intermediary; mandatory testing and risk acknowledgement for all investors; exchanges may admit the three assets to public circulation from that date; assets chosen for liquidity (market value, daily volume, at least five years of price history)", url: "https://www.cbr.ru/press/event/?id=32964" },
      { label: "Izvestia — Oct 31, 2026: Boris Blokhin, the Moscow Exchange's senior managing director for sales: trading in Bitcoin, Ethereum and USDT planned from December 1; sessions 07:00–00:00 Moscow time; custody by partner digital depositories; initially only assets meeting the regulator's requirements for unqualified investors", url: "https://iz.ru/en/node/2194300" },
      { label: "FINMA — press release, October 20, 2026 (PDF): approval of Switzerland's first Bitcoin ETF for retail investors as an 'other fund for alternative investments' with a specific risk", url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/8news/medienmitteilungen/2026/10/20261020-mm-finma-bitcoin-etf.pdf" },
      { label: "The Block — Oct 20 (updated Oct 23): BIT Asset Management confirms its Bitcoin Fund ETF (BBIT), SIX listing expected November 2026; no listing found as of Nov 16", url: "https://theblock.co/news/regulation/2026-10-20-swiss-regulator-finma-approves-countrys-first-spot-bitcoin-etf-for-retail-investors-421127" },
      { label: "SEC EDGAR — iShares Trust Form 485APOS filed October 19, 2026: iShares Bitcoin Managed Protection ETF (PBIT); call-option spreads on IBIT-type reference assets; initial maximum loss about 10% before fees; effective 75 days after filing", url: "https://www.sec.gov/Archives/edgar/data/1100663/000119312526425335/d144515d485apos.htm" },
      { label: "TFTC Bitcoin ETF flow tracker (Farside-matched) — week Nov 9–13: −$1,065.5M, no inflow day; prior week −$1,281.7M; month to date about −$2.35B", url: "https://www.tftc.io/bitcoin-etf-flows/november-2026" },
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
  { date: "Nov 15", title: "Bitcoin falls to about $62,000, its lowest since July 14, and ends a sixth losing week in a row about 13% lower; it is about 49% below its October 2025 record of $126,080", source: "CoinGecko", tag: "MARKETS", important: true },
  { date: "Nov 13", title: "U.S. Bitcoin funds lose $1.07 billion in a week, a second straight week above $1 billion; money left on all five days, most of it from BlackRock's fund", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Nov 16", title: "Bitcoin steadies near $64,600 after the weekend fall, down 17% in November; Strategy's shares drop 8% before the open; the chipmaker Nvidia reports Tuesday and Federal Reserve minutes land Wednesday", source: "CoinDesk", tag: "MARKETS" },
  { date: "Nov 13", title: "The U.S. government's 10-year borrowing rate reaches 5.15%, up from 4.86% a week earlier, and the dollar hits its strongest since April 2025 after a hotter-than-expected inflation reading", source: "U.S. Treasury", tag: "FED" },
];
