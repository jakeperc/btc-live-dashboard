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
  asOf: "NOV 8, 2026",
  refreshedAt: "2026-11-09T11:10:00Z",
  title: "Bitcoin Hits Its Lowest Since August as the Midterm Rally Fades and Tech Stocks Slide",
  status: "Low of $73,477 on Nov 8; about $74,000 on Nov 9",
  statusTone: "active",
  narrative: "Democrats won both houses of Congress on November 3. Bitcoin rose to $81,000 on November 4, then fell 5.6% on November 5 as technology stocks had their worst day since April 2025 on doubts about spending on artificial intelligence. A strong jobs report on November 6 made a December rate rise more likely. Bitcoin slid to $73,477 on Sunday, its lowest since August 21 and a fifth losing week in a row. $1.28 billion left U.S. Bitcoin funds traded on the stock market in the week, the most since June.",
  whyItMatters: "Bitcoin is about 5% lower than a week ago and 41% below its October 2025 record. It moved with technology stocks and interest-rate bets this week, not with crypto news: the election rally lasted one day. At $74,000 the big buyers of the past year, including Strategy, the biggest corporate holder, now hold coins worth less than they paid.",
  wouldChange: "A week ending above $78,000 with money returning to U.S. Bitcoin funds would say the selling is done; a week ending under $73,000 would say it is not.",
  milestoneLabel: "Next checkpoint",
  milestone: "November 10: U.S. inflation figures for October. November 11: MSCI, the company whose stock lists many funds copy, names the companies it will drop, with Strategy at risk. November 17: ordinary Russians may start buying Bitcoin through licensed firms. December 9: the Federal Reserve, the U.S. central bank, decides on rates. December 11: U.S. government funding runs out.",
  sources: [
    { label: "CoinGecko API — Nov 9, 2026, 11:08 UTC: Bitcoin $74,055; 24-hour range $73,709–$76,106; down 4.9% on the week and 10.6% over 30 days; 41% below the all-time high of $126,080 (Oct 6, 2025); market value $1.49 trillion", url: "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false" },
    { label: "NBC News — Senate results (updated Nov 4, 9:03 p.m. ET): Democrats 54, Republicans 44, Mississippi and Alaska uncalled; seven flips (Iowa, Kansas, Maine, North Carolina, Ohio, South Carolina, Texas); Ohio: Sherrod Brown 50.0%, Jon Husted 45.2% with 97.8% counted", url: "https://www.nbcnews.com/politics/2026-elections/senate-results" },
    { label: "CNBC — midterm live updates, Nov 3–4: CNBC Election Desk projects Democrats win the House with at least 245 seats (218 needed) and, with AP, the Senate; Democrats flip governorships in Ohio and Texas", url: "https://www.cnbc.com/2026/11/03/midterm-elections-2026-live-updates.html" },
    { label: "TFTC Bitcoin ETF flow tracker (Farside-matched) — November 2026: Nov 2 −$398.6M · Nov 3 −$115.6M · Nov 4 +$74.6M · Nov 5 −$430.2M · Nov 6 −$411.9M (IBIT −$403.0M); week −$1,281.7M, one inflow day in five; updated Nov 6, revisions checked Nov 9", url: "https://www.tftc.io/bitcoin-etf-flows/november-2026" },
    { label: "BLS — Employment Situation, October 2026 (released Nov 6, 8:30 a.m. ET): payrolls +165,000 against a 48,000 monthly average over the prior 12 months; unemployment 4.1%; average hourly earnings +0.4% on the month, +3.1% on the year; August and September revised up a combined 84,000", url: "https://www.bls.gov/news.release/empsit.nr0.htm" },
    { label: "International Business Times (citing CNBC) — Nov 6: Nasdaq fell 5.5% on Nov 5, its worst session since April 2025, into correction territory; Nvidia −9%, about $450 billion of value lost; iShares Semiconductor ETF −12%, worst day since March 2020", url: "https://www.ibtimes.co.uk/nvidia-qualcomm-shares-nasdaq-ai-selloff-1830635" },
    { label: "Blockhead — Nov 9: Bitcoin opened the week near $78,230 and closed near $74,750, −4.5%; high about $81,000 Nov 4; −5.6% on Nov 5; low $73,477 on Sunday Nov 8, lowest since Aug 21; fifth straight weekly loss since the $86,507 close of Oct 4; U.S. spot funds −$1.28B on the week, worst since late June; CME FedWatch December hike 76.8%; October CPI due Nov 10", url: "https://www.blockhead.co/2026/11/09/bitcoin-enters-cpi-week-bruised-with-rates-ai-stocks-and-washington-all-pulling-the-same-way/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • NOV 6",
    title: "Strong Jobs Report Makes a December Rate Rise Likely; Inflation Figures Tuesday",
    plain: "U.S. employers added nearly three times the jobs expected in October, so a December rate rise is now likely, a weight on Bitcoin's price.",
    detail: "Bitcoin pays no interest, so higher rates work against it. The Federal Reserve, the U.S. central bank, held its rate at 3.75–4.00% on October 28, with two officials voting to raise. On November 6 the Labor Department said employers added 165,000 jobs in October, against 59,000 expected and a 48,000 monthly average over the past year. Unemployment was 4.1%. Traders now make a rise of a quarter of a percentage point on December 9 likely, about three chances in four. Oddly, the government's 10-year borrowing rate fell to 4.86% from 5.05% in late October, as investors sought safety during the stock sell-off. The next test is Tuesday, November 10, when October inflation figures arrive; September's reading was 3.7%, nearly double the 2% goal. A hot number would make the December rise close to certain; a cool one would reopen the debate.",
    wouldChange: "December-rise odds falling under one in two before the December 9 meeting would weaken this read; an October inflation reading of 3.8% or more would strengthen it.",
    statusTone: "active",
    asOf: "NOV 6, 2026",
    sources: [
      { label: "BLS — Employment Situation, October 2026 (Nov 6): payrolls +165,000 (prior 12-month average 48,000); unemployment 4.1%; hourly earnings +0.4% m/m, +3.1% y/y; August revised to +186,000, September to +60,000", url: "https://www.bls.gov/news.release/empsit.nr0.htm" },
      { label: "Federal Reserve — FOMC statement, October 28, 2026: target range held at 3-3/4 to 4 percent; vote 10–2, with Lisa D. Cook and Beth M. Hammack preferring a 1/4-point increase; inflation 'elevated'; next meeting December 8–9", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm" },
      { label: "CentralBank.watch — fed funds futures as of Nov 6: 77.1% odds of a rise on Dec 9 (hold 22.9%); 82.6% cumulative odds the rate is higher by Jan 27, 2027; Blockhead reports CME FedWatch at 76.8% for December, up from 66.9% a week earlier", url: "https://centralbank.watch/federal-reserve/" },
      { label: "U.S. Treasury — daily par yield curve, November 2026 (2y / 10y / 30y): Nov 2 4.59/4.91/5.28 · Nov 3 4.61/4.95/5.32 · Nov 4 4.58/4.90/5.28 · Nov 5 4.46/4.84/5.25 · Nov 6 4.51/4.86/5.26; the 10-year was 5.05% on Oct 28", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202611" },
      { label: "BLS — CPI release schedule: October 2026 CPI on Tuesday, November 10, 2026, 8:30 a.m. ET; November CPI on December 10", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
    ],
  },
  {
    label: "CORPORATE TREASURY • NOV 2",
    title: "Strategy Buys Again, 811 Coins, but Its Stake Now Sits Below Cost",
    plain: "Strategy, the biggest corporate Bitcoin holder, bought 811 coins in the week to November 1 by selling shares. At $74,000 its coins are worth less than it paid.",
    detail: "Strategy, formerly MicroStrategy and the biggest corporate Bitcoin holder, bought 811 coins for $65.5 million in the week to November 1, under two days of worldwide new supply. It paid by selling $164 million of its shares, not coins. It also spent $208 million buying back its preferred shares (shares that pay a fixed yearly rate). It holds 849,327 coins at an average cost of $75,451. At $74,000 the stake is worth about 2% less than it paid. On November 11 MSCI, whose stock lists many funds copy, says whether it drops Strategy. If so, those funds must sell the shares by November 30, which could slow the share sales that buy its coins. Trump Media, a smaller holder, moved 4,259 coins pledged against a $1 billion loan to an exchange on November 5. Lenders can demand cash from November 30; it says it may sell coins to pay.",
    wouldChange: "Strategy missing from MSCI's November 11 removal list, or a weekly filing showing a purchase above 1,000 coins, would lift this read; Trump Media selling its coins would lower it.",
    asOf: "NOV 2, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K filed November 2, 2026 (period Oct 26–Nov 1): 811 BTC bought for $65.5M at $80,846 average, funded by MSTR stock sales; 1,178,552 MSTR shares sold for $164.0M net ($65.5M to bitcoin, $98.5M to USD Cash); 2,092,035 STRC shares repurchased for $208.2M; holdings 849,327 BTC at $75,451 average, $64.08B total; USD Reserve $4.79B, USD Cash $132.7M as of Nov 1", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526442707/mstr-20261102.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K, October 29, 2026 (Q3 2026 results, Exhibit 99.1): Q3 purchases 7,218 BTC for $588.1M, Q3 sales 5,552 BTC for about $348.6M ($239.9M to preferred dividends, $108.6M to STRC repurchases); Q3 net income $19.53B on a $20.91B digital-asset gain; USD Reserve $4.83B, about 3.4 years of dividend and interest coverage", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000105044626000047/mstr-20261029x8kxex9912.htm" },
      { label: "MSCI — results of the consultation on non-operating companies, October 15, 2026: adopted; effective with the November 2026 Index Review as of the close of November 30; final list of affected securities November 11", url: "https://app2.msci.com/webapp/index_ann/DocGet?pub_key=aq0wbkjxPgo=&lang=en&format=html" },
      { label: "International Business Times (Arkham data) — Nov 5: wallets labelled 'Trump Media 2028 Convertible Notes Collateral' sent 4,259.34 BTC (about $344M) to a Crypto.com address at 02:17 UTC in two transactions; 4,260.73 BTC had been pledged as of June 30; the Nov 2 SEC filing says holders of the $1B notes may demand cash repurchase from Nov 30 and the company may 'sell our bitcoin or other digital asset holdings' if other funding falls short; 14,139 BTC held as of July 31", url: "https://www.ibtimes.co.uk/trump-media-bitcoin-transfer-crypto-com-convertible-notes-1830477" },
      { label: "The Block — Oct 30: MSTR down nearly 10% after Q3 results, about 27% lower for the year; StoneX and TD Cowen keep buy ratings; Bitcoin Treasuries ranking: Strategy 848,517, Metaplanet 44,000, Twenty One 43,514, Strive 43,000, MARA 35,577", url: "https://www.theblock.co/news/business/2026-10-30-strategy-mstr-preferred-stock-bitcoin-buying-analysts-432214" },
    ],
  },
  {
    label: "REGULATION • NOV 4",
    title: "Democrats Win Congress; the Crypto Rules Bill Has Until January 3 or Starts Over",
    plain: "Democrats won Congress, so the stalled crypto rules bill, which would pick Bitcoin's regulator, has until January 3 to pass. Its critics are likely to write the next version.",
    detail: "The CLARITY Act, the crypto rules bill, would write into law which referee governs crypto, with Bitcoin under the CFTC, which oversees gold and oil markets. On November 3 Democrats won the Senate, with at least 54 of 100 seats, and the House. Sherrod Brown, a crypto critic, won Ohio despite $55 million spent against him by crypto groups. Elizabeth Warren, the bill's leading opponent, is in line to chair the Senate committee that handles it when the new Congress starts January 3. Until then the bill lives only through a procedural motion that allows one more Senate vote. The Senate returns today with a permitting bill first, and government funding runs out December 11, leaving little room in the schedule. Bettors give passage this year a 3% chance. Enforcement continues: on November 6 the Treasury cut the exchange MEXC off from U.S. banks over $16 billion in suspect funds.",
    wouldChange: "A new Senate vote on the bill scheduled before December 11 would weaken our view that it is finished; sponsors conceding it waits for the next Congress would confirm it.",
    statusTone: "stalled",
    asOf: "NOV 4, 2026",
    sources: [
      { label: "NBC News — Senate results (Nov 4): Democrats 54, Republicans 44, two seats uncalled; Ohio: Sherrod Brown 50.0%, Jon Husted 45.2% with 97.8% counted; seven seats flipped to Democrats", url: "https://www.nbcnews.com/politics/2026-elections/senate-results" },
      { label: "CNBC — midterm live updates, Nov 3–4: Democrats projected to win the House with at least 245 seats and the Senate; the new Congress convenes January 3, 2027", url: "https://www.cnbc.com/2026/11/03/midterm-elections-2026-live-updates.html" },
      { label: "CNBC Make It — Nov 4: the CLARITY Act passed the House 294–134 in July 2025 and failed a Senate procedural vote 49–50 in September 2026; Lee Reiners (Duke): 'CLARITY is dead', a lame-duck passage unlikely; Martin Mulyadi (Shenandoah): 'The election does not end crypto market-structure legislation; it changes the authors of the next draft'; Bitcoin rose nearly 3% above $80,000 on Nov 4", url: "https://www.cnbc.com/make-it/2026/11/04/democrats-congress-crypto-regulation-clarity-act.html" },
      { label: "FinanceFeeds — Nov 4: the Sept 15 cloture vote failed 49–50 with Collins, Hawley, Moran and Tillis opposed; Tillis's motion to reconsider keeps one more cloture vote possible without restarting; the 120th Congress convenes Jan 3, 2027 and unpassed bills expire; House Financial Services Chair French Hill: 'I still have hopes that we can get it passed in the lame duck session'", url: "https://financefeeds.com/cryptos-clarity-act-faces-its-last-shot/" },
      { label: "The Block — Sept 15: Sen. Elizabeth Warren says she wants a crypto bill but 'the Clarity Act just isn't it'; asked whether she would lead on crypto legislation if she chairs the Banking Committee, she said she would", url: "https://www.theblock.co/news/regulation/2026-09-15-sen-elizabeth-warren-says-she-wants-a-crypto-bill-but-the-clarity-act-just-isn-t-it-414869" },
      { label: "Roll Call — Oct 22: a procedural vote on the permitting bill is scheduled for Nov 9, the Senate's first day back; 60 votes needed for cloture on the motion to proceed", url: "https://rollcall.com/2026/10/22/permitting-bill-writers-seek-industry-aid-ahead-of-senate-vote/" },
      { label: "U.S. Treasury — press release, November 6, 2026: FinCEN order under section 9714(a) of the Combating Russian Money Laundering Act bars U.S. financial institutions from any transmittal of funds to or from MEXC Global, effective 30 days after Federal Register publication; at least $16 billion in illicit-linked funds May 2021–May 2026, nearly $1.5 billion tied to Russian sanctions evasion", url: "https://home.treasury.gov/news/press-releases/sb0685" },
      { label: "Holland & Knight — Oct 9, 2026: the continuing resolution funding the government expires December 11, 2026, the main forcing deadline of the lame-duck session; the FY2027 NDAA, the Farm Bill and health-program extenders (Dec 31) compete for the same floor time", url: "https://www.hklaw.com/en/insights/publications/2026/10/beyond-the-midterms-congress-faces-converging-year-end-deadlines" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 3% on $25.0 million traded (Nov 9)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "ETFs • NOV 6",
    title: "New Doors Into Bitcoin: Russia Opens Retail Buying November 17; Swiss Fund Still Waiting",
    plain: "From November 17 ordinary Russians may buy Bitcoin through licensed firms, the latest new door into Bitcoin; so far none has brought in money.",
    detail: "New ways to buy move the price only if money comes in. On November 6 Russian press reported the central bank's rule letting ordinary investors buy Bitcoin, Ether (the second-largest coin) and USDT (a token fixed at one dollar) through licensed brokers and exchanges from November 17. Purchases are capped at 300,000 rubles, about $3,700, a year, after a knowledge test. The Moscow Exchange, Russia's main stock market, plans to start trading them December 1. In Switzerland, the first Bitcoin fund for ordinary savers, approved October 20, has still not listed; its manager said November. In the U.S., BlackRock's fund that uses option contracts (a form of price insurance) to cap losses at about 10% takes effect in early January unless the SEC, the stock-market regulator, objects. So far these are doors, not demand: this week $1.28 billion left U.S. funds through the existing ones.",
    wouldChange: "Russian trading slipping past November 17 or December 1, or the Swiss fund missing November, would weaken this read; either starting on time with money arriving would strengthen it.",
    statusTone: "advancing",
    asOf: "NOV 6, 2026",
    sources: [
      { label: "PPT.ru — Nov 6, 2026: Bank of Russia Directive No. 7441-U of September 11, 2026 takes effect November 17; non-qualified investors may buy Bitcoin, Ether and USDT through a broker, trust manager or crypto exchanger, on or off exchange, up to 300,000 rubles a year per intermediary, after a mandatory test; exchanges may admit the three assets to trading from that date (Bank of Russia press page unreachable Nov 9)", url: "https://ppt.ru/news/kriptovalyuta/bitkoin-efir-i-usdt-stanut-dostupny-nekvalifitsirovannym-investoram" },
      { label: "Izvestia — Oct 31, 2026: Boris Blokhin, the Moscow Exchange's senior managing director for sales: trading in Bitcoin, Ethereum and USDT planned from December 1; sessions 07:00–00:00 Moscow time; custody by partner digital depositories; initially only assets meeting the regulator's requirements for unqualified investors", url: "https://iz.ru/en/node/2194300" },
      { label: "FINMA — press release, October 20, 2026 (PDF): approval of Switzerland's first Bitcoin ETF for retail investors as an 'other fund for alternative investments' with a specific risk", url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/8news/medienmitteilungen/2026/10/20261020-mm-finma-bitcoin-etf.pdf" },
      { label: "The Block — Oct 20 (updated Oct 23): BIT Asset Management confirms its Bitcoin Fund ETF (BBIT), SIX listing expected November 2026; no listing reported as of Nov 9", url: "https://theblock.co/news/regulation/2026-10-20-swiss-regulator-finma-approves-countrys-first-spot-bitcoin-etf-for-retail-investors-421127" },
      { label: "SEC EDGAR — iShares Trust Form 485APOS filed October 19, 2026: iShares Bitcoin Managed Protection ETF (PBIT); call-option spreads on IBIT-type reference assets; initial maximum loss about 10% before fees; effective 75 days after filing", url: "https://www.sec.gov/Archives/edgar/data/1100663/000119312526425335/d144515d485apos.htm" },
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
  { date: "Nov 8", title: "Bitcoin falls to $73,477, its lowest since August 21 and a fifth losing week in a row; it is about 41% below its October 2025 record of $126,080", source: "CoinGecko", tag: "MARKETS", important: true },
  { date: "Nov 6", title: "U.S. Bitcoin funds lose $1.28 billion in a week, the most since June and about 1% of what they hold; $412 million left on Friday alone, most of it from BlackRock's fund", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Nov 6", title: "U.S. employers added 165,000 jobs in October, nearly three times the forecast; traders now make a December rate rise likely, about three chances in four", source: "BLS", tag: "FED" },
  { date: "Nov 6", title: "The Treasury cuts the exchange MEXC off from U.S. banks, saying it handled at least $16 billion in suspect funds tied to Russia, Iran and North Korea", source: "U.S. Treasury", tag: "REGULATION" },
];
