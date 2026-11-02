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
  asOf: "NOV 2, 2026",
  refreshedAt: "2026-11-02T11:50:00Z",
  title: "Record $6.3 Billion Binance Theft Knocks Bitcoin to a Six-Week Low as October Ends Lower",
  status: "Six-week low Oct 30; about $78,000 on Nov 2",
  statusTone: "active",
  narrative: "On October 29 thieves took about $6.3 billion from Binance, the world's largest crypto exchange (a marketplace for buying and selling coins). It is the biggest crypto theft on record, four times the previous one. The FBI blames North Korea. Bitcoin fell from about $80,000 to $76,100 on October 30, its lowest since mid-September. U.S. Bitcoin funds traded on the stock market saw $643 million leave that day, the most since June. Binance says it has covered the loss itself and reopened withdrawals (customers taking coins out) on November 1.",
  whyItMatters: "Bitcoin is about 3% lower than a week ago and ended October down about 7%, its first losing month since June. The coins were stolen from accounts Binance itself controlled, not from the Bitcoin network, which kept working as normal. Coins held in a personal wallet you control, or in a U.S. fund, were not part of the theft.",
  wouldChange: "A week ending above $80,000 and two straight weeks of money into U.S. Bitcoin funds would mean the scare has passed; a week ending under $75,000, that it has not.",
  milestoneLabel: "Next checkpoint",
  milestone: "November 3: Binance promised a full report on what it holds. November 3: U.S. midterm elections. November 9: Congress returns. November 11: MSCI, the company whose stock lists many funds copy, names the companies it will drop, with Strategy at risk. December 9: the Federal Reserve, the U.S. central bank, decides on rates again.",
  sources: [
    { label: "CoinGecko API — Nov 2, 2026, 11:08 UTC: Bitcoin $77,879; 24-hour range $77,599–$78,728; down 3.0% on the week and 8.0% over 30 days; 38% below the all-time high of $126,080 (Oct 6, 2025)", url: "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false" },
    { label: "CNBC — Oct 31 (updated Nov 1): Binance says about $6.3 billion in tokens was taken from its hot wallets on Oct 29, the largest crypto theft on record; it will 'absorb the financial impact'; BTC, ETH, USDT and seven other assets 'fully backed 100%'; withdrawals resumed Sunday Nov 1 starting with the Bitcoin network; the FBI said late Saturday that North Korea was responsible", url: "https://www.cnbc.com/2026/10/31/binance-hack-asset-coverage-withdrawals.html" },
    { label: "The Block — Oct 30: how the attackers breached Binance; TRM Labs: about $6.36 billion moved across ten blockchains, most of it in about 20 minutes; Chainalysis, Elliptic and TRM attribute it to North Korea's TraderTraitor, the group behind the $1.5 billion Bybit theft of February 2025; Binance says $5 billion of affected assets on hand plus $1.3 billion being bought to cover the rest", url: "https://www.theblock.co/news/business/2026-10-30-binance-hack-largest-crypto-hack-north-korea-432225" },
    { label: "The Block (SoSoValue data) — Nov 1: U.S. spot Bitcoin ETFs −$643.3M on Oct 30, the largest single-day outflow since June 25; week of Oct 26–30 −$202.6M; total net assets $98.14B; Laevitas: 'a de-risking day, and not capitulation'", url: "https://www.theblock.co/news/markets/2026-11-01-spot-bitcoin-etfs-largest-four-months-following-binance-hack-432270" },
    { label: "The Block — Nov 1: Binance reports about $3.64B of net outflows in the first 9.5 hours after reopening withdrawals, 2.1% of the $171B it held at its Oct 28 proof-of-reserves; CoinGlass: Binance's Bitcoin balance down about 19,289 BTC in 24 hours; updated reserves report promised for Monday", url: "https://www.theblock.co/news/business/2026-11-01-binance-sees-3-64-billion-in-net-outflows-after-reopening-withdrawals-following-record-hack-432259" },
    { label: "Fortune — Oct 30, 8:15 a.m. ET: Bitcoin $77,381, down 3.3% from $80,037 a day earlier and 7.2% from $83,420 a month earlier; Forbes the same day: low of about $76,140, the lowest since mid-September; Reuters via crypto.news: Nasdaq −2.9% on Oct 30, spot gold −3.6%, Brent $117.63", url: "https://fortune.com/article/price-of-bitcoin-10-30-2026/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • OCT 28",
    title: "Fed Holds, Two Officials Vote to Raise; December Rise Now Likely",
    plain: "The U.S. central bank held rates steady, but two officials voted to raise them and a December rise is likely, a weight on Bitcoin's price.",
    detail: "Bitcoin pays no interest, so higher rates work against it. The Federal Reserve, the U.S. central bank, held its rate at 3.75–4.00% on October 28 by a vote of ten to two. The two who disagreed, Lisa Cook and Beth Hammack, wanted a quarter-point rise. Kevin Warsh, the Fed's chair, said the bank is not 'tolerating' inflation 'somewhere in the twos'. The next day's figures backed him: the economy grew at a 3.4% yearly pace in the third quarter, and September prices were 3.6% higher than a year earlier, nearly double the 2% goal. Traders make a December rise likely, about three chances in four. Stocks fell anyway. Nasdaq, the technology-heavy U.S. stock index, lost 2.9% on October 30 after weak results from Amazon and Alphabet, and had its worst month since March 2025. Bitcoin fell with it, as it often does on bad days for stocks.",
    wouldChange: "December-rise odds falling under one in two before the December 9 meeting would weaken this read; the government's 10-year borrowing rate back above 5.2% would strengthen it.",
    statusTone: "active",
    asOf: "OCT 28, 2026",
    sources: [
      { label: "Federal Reserve — FOMC statement, October 28, 2026: target range held at 3-3/4 to 4 percent; vote 10–2, with Lisa D. Cook and Beth M. Hammack preferring a 1/4-point increase; 'Economic activity is expanding at a strong pace'; inflation 'elevated'; 'The Committee will deliver price stability'", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm" },
      { label: "CNBC — Oct 29 analysis of Warsh's press conference: 'If you think that we're tolerating some inflation target somewhere in the twos, let us disabuse you of it'; 'While overall financial conditions are tighter, I'm unwilling and unable to call them tight'; the Fed will skip a rate vote at one meeting in 2027 and two in 2028", url: "https://www.cnbc.com/2026/10/29/kevin-warsh-fed-october-rate-decision-december-hike.html" },
      { label: "BEA — GDP (Advance Estimate), 3rd Quarter 2026, October 29: real GDP +3.4% annualized (Q2 +2.2%); PCE prices +2.1% annualized, core +2.5%", url: "https://www.bea.gov/news/2026/gdp-advance-estimate-3rd-quarter-2026" },
      { label: "BEA — Personal Income and Outlays, September 2026, October 29: PCE price index +0.5% on the month and +3.6% on the year; core +0.3% and +3.1%", url: "https://www.bea.gov/news/2026/personal-income-and-outlays-september-2026" },
      { label: "U.S. Treasury — daily par yield curve, October 2026 (2y / 10y / 30y): Oct 23 4.69/5.00/5.33 · Oct 26 4.68/5.00/5.31 · Oct 27 4.70/4.99/5.30 · Oct 28 4.67/5.05/5.37 · Oct 29 4.61/4.98/5.32 · Oct 30 4.56/4.94/5.31", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202610" },
      { label: "CentralBank.watch — fed funds futures, Oct 30: 72.9% odds of a rise on Dec 9 (hold 27.1%); 81.3% cumulative odds the rate is higher by Jan 27, 2027; Yahoo Finance reported CME FedWatch at 82.6% for December right after the Oct 28 decision", url: "https://centralbank.watch/federal-reserve/" },
      { label: "Yahoo Finance — Oct 30 close: Nasdaq −2.8% to −2.9%, worst day since June 5; S&P 500 about −2%; Dow −1.2%; October: Nasdaq −5.2% to −5.3%, worst month since March 2025, S&P 500 −1.2%, Dow +1.5%; Amazon and Alphabet earnings misses, Intel outlook; Brent about $112–115", url: "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-30-dow-sp-500-nasdaq-amazon-intel-ai-sell-off-191429143.html" },
    ],
  },
  {
    label: "CORPORATE TREASURY • OCT 29",
    title: "Strategy Sold 5,552 Coins Last Quarter to Pay Dividends; Strive Reaches 43,000",
    plain: "Strategy, the biggest corporate Bitcoin holder, sold coins last quarter to pay dividends and bought none last week; its steady buying has stopped for now.",
    detail: "Strategy, formerly MicroStrategy and the biggest corporate Bitcoin holder, reported third-quarter results on October 29. Its $19.5 billion profit came almost all from the rising price of coins it still holds. It sold 5,552 coins in the quarter, about twelve days of worldwide new supply, to pay dividends on its preferred shares (shares that pay a fixed yearly rate) and to buy some back. It bought 7,218. In its latest weekly filing, it bought no coins and spent $205 million more buying back those shares. Holdings stay at 848,517 coins, with Bitcoin about 3% above their average cost of $75,446. Strive, a smaller rival, bought 6,182 coins in a week and holds 43,000, the fourth most of any listed company. On November 11 MSCI, the company whose stock lists many funds copy, says whether it drops Strategy; if so, funds that copy its lists must sell the shares.",
    wouldChange: "A Monday filing showing coins bought again, or Strategy missing from MSCI's November 11 removal list, would lift this read; another quarter of coin sales would lower it.",
    asOf: "OCT 29, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K, October 29, 2026 (Q3 2026 results, Exhibit 99.1): 848,517 BTC as of Oct 25 at $75,446 average, $64.02B cost; Q3 purchases 7,218 BTC for $588.1M, Q3 sales 5,552 BTC for about $348.6M ($239.9M to preferred dividends, $108.6M to STRC repurchases); YTD $431.8M of bitcoin sold for dividends and buybacks; Q3 net income $19.53B on a $20.91B digital-asset gain; YTD net loss $1.23B; BTC Yield YTD −3.7%; USD Reserve $4.83B plus cash $242.4M, about 3.4 years of dividend and interest coverage; STRC buybacks YTD $2.04B with $956.7M left", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000105044626000047/mstr-20261029x8kxex9912.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K filed October 26, 2026 (period Oct 19–25): no bitcoin bought or sold; no ATM share sales; 2,068,459 STRC shares repurchased for $204.9M; holdings 848,517 BTC as of Oct 25", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526431146/0001193125-26-431146-index.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K filed October 29, 2026: special meeting Oct 28 approved daily dividend record dates for STRF, STRC, STRK and STRD (381,373,199 for, 2,236,551 against); STRC daily dividends from November 1, the other three from January 1, 2027; dividend rates unchanged", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526437776/mstr-20261028.htm" },
      { label: "SEC EDGAR — Strive, Inc. Form 8-K filed October 26, 2026: 6,182 BTC bought Oct 17–23 at about $82,732 average; holdings 43,000 BTC as of Oct 23 (36,818 on Oct 16); cash $504.4M; 7,000,000 SATS preferred shares outstanding", url: "https://www.sec.gov/Archives/edgar/data/1920406/000162828026067141/asst-20261026.htm" },
      { label: "MSCI — results of the consultation on non-operating companies, October 15, 2026: adopted; effective with the November 2026 Index Review as of the close of November 30; final list of affected securities November 11", url: "https://app2.msci.com/webapp/index_ann/DocGet?pub_key=aq0wbkjxPgo=&lang=en&format=html" },
      { label: "The Block — Oct 30: MSTR down nearly 10% after Q3 results, about 27% lower for the year; StoneX and TD Cowen keep buy ratings and say the daily-dividend change sets up renewed bitcoin buying; Bitcoin Treasuries ranking: Strategy 848,517, Metaplanet 44,000, Twenty One 43,514, Strive 43,000, MARA 35,577", url: "https://www.theblock.co/news/business/2026-10-30-strategy-mstr-preferred-stock-bitcoin-buying-analysts-432214" },
    ],
  },
  {
    label: "REGULATION • OCT 30",
    title: "November 3 Elections Decide Who Writes Crypto Rules; Binance Theft Hardens Both Sides",
    plain: "The November 3 elections decide who runs Congress, and whether the stalled crypto rules bill revives or U.S. Bitcoin rules stay changeable by each administration.",
    detail: "The CLARITY Act, the crypto rules bill, would write into law which referee governs crypto, with Bitcoin under the CFTC, which oversees gold and oil markets. The Senate fell eleven votes short of debating it on September 15 and returns November 9. Bettors call passage this year unlikely, a 3% chance. Crypto companies have put more than $200 million into the November 3 elections, a record for a single industry's campaign groups, including $55 million against Sherrod Brown, a crypto critic, in Ohio. The Binance theft pushed both sides harder. Senator Cynthia Lummis, the bill's lead Republican, said it would have let firms freeze stolen funds faster. Representative Maxine Waters, the senior House Democrat on finance, called it a 'wake-up call' for tighter rules. The CFTC's chair said the lesson is that Binance sits outside U.S. rules. If no bill passes by December, next year's Congress starts over.",
    wouldChange: "A Senate vote scheduled before the year-end break would weaken our view that the bill is stalled; sponsors conceding it waits for the next Congress would confirm it.",
    statusTone: "stalled",
    asOf: "OCT 30, 2026",
    sources: [
      { label: "House Financial Services Committee Democrats — Ranking Member Maxine Waters statement, October 30, 2026: the $6.3 billion Binance hack, reportedly by North Korean state-sponsored hackers, is a 'wake-up call'; she will push for 'tougher financial crime and cybersecurity standards, and real accountability in the crypto industry'", url: "https://democrats-financialservices.house.gov/news/documentsingle.aspx?DocumentID=415414" },
      { label: "The Block — Oct 30: Trump: 'But it's a hack. That's the problem… I've always felt it was a little bit dangerous'; CFTC Chair Michael Selig on CNBC: the hack 'proves our exact point', 'these are unregulated offshore exchanges'; Sen. Lummis: the CLARITY Act 'would have given crypto firms legal cover to freeze suspicious transactions'; Digital Chamber letter urges Congress to 'act before this Congress adjourns'", url: "https://www.theblock.co/news/regulation/2026-10-30-trump-looking-into-binance-hack-calls-grow-for-crypto-rules-432236" },
      { label: "CNBC — Oct 31: crypto-tied groups have given more than $200 million this cycle (Public Citizen), the largest group of single-issue super PACs in U.S. history; Fairshake backs 33 House candidates and has spent $55 million against Sherrod Brown in Ohio; Coinbase and Ripple gave $25 million each; if the bill does not advance by year end, Congress starts a new market-structure bill from scratch", url: "https://cnbc.com/2026/10/31/crypto-industry-spends-more-than-200-million-to-sway-the-midterms.html" },
      { label: "CFTC — release 9307-26, October 5, 2026: advance notice of proposed rulemaking on retail crypto asset transactions (Regulation CTX) and a 'crypto asset market' venue category; comments due December 14, 2026 (91 FR 64811)", url: "https://www.cftc.gov/PressRoom/PressReleases/9307-26" },
      { label: "U.S. Senate Daily Press (as of Oct 16; site unreachable Nov 2) — pro forma sessions through Oct 29; the Senate returns Monday, November 9 at 3:00 p.m., first vote 5:30 p.m. on the permitting-reform vehicle (H.R. 2347); no action scheduled on H.R. 3633", url: "https://www.dailypress.senate.gov/" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 3% on $24.8 million traded (Nov 2)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "ETFs • OCT 31",
    title: "New Doors Into Bitcoin: Moscow Exchange Joins Swiss Fund and BlackRock's Protected Fund",
    plain: "Russia's main stock exchange plans to let ordinary investors buy Bitcoin from December 1. It is the latest new door, after Switzerland's fund for savers and BlackRock's loss-limited fund.",
    detail: "New ways to buy move the price only if money comes in. On October 31 the Moscow Exchange, Russia's main stock exchange, said trading in Bitcoin, Ether (the second-largest coin) and USDT (a token fixed at one dollar) starts December 1. Ordinary Russians who pass a knowledge test may trade. A custodian, a firm that keeps coins for clients, holds them. In Switzerland, the first Bitcoin fund for ordinary savers, approved October 20, expects to list in Zurich in November. In the U.S., BlackRock has filed for a fund that uses option contracts (a form of price insurance) to cap losses at about 10%. The filing takes effect in early January unless the SEC, the stock-market regulator, objects. None of these routes has yet shown up as buying: the Swiss fund is not trading, and BlackRock's is not yet approved.",
    wouldChange: "The Moscow launch slipping past December 1, or the Swiss fund failing to list in November, would weaken this read; either starting on time, with money arriving, would strengthen it.",
    statusTone: "advancing",
    asOf: "OCT 31, 2026",
    sources: [
      { label: "Izvestia — Oct 31, 2026: Boris Blokhin, the Moscow Exchange's senior managing director for sales, at the Smartlab conference: trading in Bitcoin, Ethereum and USDT planned from December 1; sessions 07:00–00:00 Moscow time; custody by partner digital depositories; initially only assets meeting the regulator's requirements for unqualified investors; participants already testing", url: "https://iz.ru/en/node/2194300" },
      { label: "FINMA — press release, October 20, 2026 (PDF): approval of Switzerland's first Bitcoin ETF for retail investors as an 'other fund for alternative investments' with a specific risk; exemption from risk-diversification rules given Bitcoin's longer trading history and higher trading volumes", url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/8news/medienmitteilungen/2026/10/20261020-mm-finma-bitcoin-etf.pdf" },
      { label: "The Block — Oct 20 (updated Oct 23): BIT Asset Management confirms its Bitcoin Fund ETF (BBIT), SIX listing expected November 2026; Swiss Bitcoin ETPs since 2018 are debt securities", url: "https://theblock.co/news/regulation/2026-10-20-swiss-regulator-finma-approves-countrys-first-spot-bitcoin-etf-for-retail-investors-421127" },
      { label: "SEC EDGAR — iShares Trust Form 485APOS filed October 19, 2026: iShares Bitcoin Managed Protection ETF (PBIT); no direct bitcoin; call-option spreads on IBIT-type reference assets; initial maximum loss about 10% before fees; upside capped; effective 75 days after filing", url: "https://www.sec.gov/Archives/edgar/data/1100663/000119312526425335/d144515d485apos.htm" },
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
  { date: "Nov 1", title: "Binance reopens withdrawals, starting with Bitcoin, three days after the $6.3 billion theft; $3.6 billion leaves in the first ten hours, about 2% of what it holds, and the FBI says North Korea did it", source: "CNBC", tag: "MARKETS", important: true },
  { date: "Oct 31", title: "Bitcoin ends October near $77,600, down about 7%, its first losing month since June and second losing October in a row; Nasdaq, the technology-heavy U.S. stock index, has its worst month since March 2025", source: "CoinGecko", tag: "MARKETS", important: true },
  { date: "Oct 31", title: "The Moscow Exchange, Russia's main stock market, says Bitcoin, Ether and the dollar token USDT will trade there from December 1, open to ordinary investors who pass a knowledge test", source: "Izvestia", tag: "MARKETS" },
  { date: "Oct 30", title: "U.S. Bitcoin funds lose $643 million in a day, the most since June and under 1% of the $98 billion they hold, turning the week negative; October ends with $515 million more leaving than arriving", source: "Farside Investors", tag: "ETFs", important: true },
];
