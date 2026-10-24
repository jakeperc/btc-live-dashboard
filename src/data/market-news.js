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
  asOf: "OCT 24, 2026",
  refreshedAt: "2026-10-24T20:30:00Z",
  title: "Bitcoin Falls Back Under $80,000 as War Fears Lift Oil and Technology Stocks Slide",
  status: "Lower since Oct 16; about $80,000 on Oct 24",
  statusTone: "active",
  narrative: "Bitcoin rose to about $84,500 on October 21, then fell to $79,200 on October 24, its lowest since October 15. On October 22 technology stocks had their worst day since June on worries about spending on artificial intelligence. The United States ordered non-essential diplomats out of Saudi Arabia after attacks on Saudi oil sites. Brent crude, the world oil benchmark, passed $116. U.S. Bitcoin ETFs, funds that hold Bitcoin and trade on the stock market, bought $1.1 billion Monday to Wednesday, then sold $770 million Thursday and Friday.",
  whyItMatters: "Bitcoin is back where it was nine days ago, about 8% below its September high. October is on course to be its first losing month after three straight gains. The sellers were not reacting to Bitcoin news. War risk pushed oil up and stocks down, and Bitcoin fell with the stocks, as it often does on bad days.",
  wouldChange: "A week ending back above $84,000, or two straight weeks of net fund buying, would say this dip is over; a week ending under $79,000 would say it is not.",
  milestoneLabel: "Next checkpoint",
  milestone: "October 27–28: the Federal Reserve, the U.S. central bank, meets; its chair speaks on the 28th at 2:30 p.m. October 29: third-quarter growth and September inflation figures, then results from Strategy, the biggest corporate Bitcoin holder. November 3: U.S. midterm elections; the president has said strikes on Iran would wait until after them. November 9: Congress returns.",
  sources: [
    { label: "CoinGecko API — Oct 24, 2026, 20:06 UTC: Bitcoin $80,493; 24-hour low $79,263, high $81,410; down 0.9% on the day, 1.3% on the week, 4.6% over 30 days; all-time high $126,080 (Oct 6, 2025)", url: "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false" },
    { label: "FinanceFeeds (Farside Investors data) — U.S. spot Bitcoin ETF daily flows, week of Oct 19–23, 2026: Mon +$526.7M, Tue +$23.2M, Wed +$524.8M, Thu −$635.6M (IBIT −$254.1M, FBTC −$217.5M, ARKB −$109.4M; largest since June 25), Fri −$137.9M provisional; week +$301.2M after two weeks of outflows", url: "https://financefeeds.com/crypto-etf-flows-this-week-bitcoin-funds-net-301-million-despite-636-million-thursday-exit-where-ether-xrp-and-solana-landed/" },
    { label: "CoinDesk — Oct 23 live updates: Bitcoin just above $81,000 after Thursday's slide of about 3%; below the ETFs' average purchase price of $82,313; Brent above $116 for the first time since late April; Nasdaq 100's worst day since June on Oct 22; 10-year yield −19 bp, largest drop since March 2023", url: "https://www.coindesk.com/markets/2026/10/23/live-updates-bitcoin-holds-above-usd81-000-as-the-ai-rout-fades-and-oil-climbs" },
    { label: "NBC News — Oct 24: DNI memo to Secretary Rubio says Iranian 'lethal plotting efforts … have reached advanced stages'; State Department put the U.S. Embassy in Saudi Arabia on 'ordered departure' Oct 21 and cut staff in Lebanon, the UAE, Qatar and Jordan; Trump at a Florida rally: 'We may do another little Epic Fury'", url: "https://www.nbcnews.com/world/middle-east/iranian-plots-kill-us-officials-middle-east-reached-advanced-stages-in-rcna605360" },
    { label: "AP (Honolulu Star-Advertiser) — Oct 22: Nasdaq −2.60% to 26,008.86, worst day since early June; S&P 500 −1.21%; semiconductor index −6.7%; Meta −7.0% after its first quarterly cash outflow in over a decade on AI spending; Tesla −3.1%; crude at a five-month high after Houthi strikes on Saudi targets", url: "https://www.staradvertiser.com/2026/10/22/breaking-news/nasdaq-plunges-2-6-as-ai-spending-fears-spark-tech-selloff/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • OCT 22",
    title: "Fed Meets Next Week: October Rate Rise Now Unlikely, December Still Likely, Oil Near $117",
    plain: "Traders now call a rate rise on October 28 unlikely, after a stock sell-off pushed government borrowing rates down. Oil near $117 keeps a December rise likely.",
    detail: "Bitcoin pays no interest, so rate rises work against it. October's risk has faded; December's has not. The Federal Reserve, the U.S. central bank, meets October 27–28 with its rate at 3.75–4.00%. On October 14 traders gave a rise at this meeting even odds. After Kevin Warsh, the Fed's chair, gave no signal on October 16, they gave one in six; after October 22, one in ten. That day a stock sell-off sent money to the safety of government bonds. The 10-year Treasury yield, the government's long-term borrowing rate, fell to 4.96% from 5.13%, its biggest one-day drop since March 2023 and first close under 5% since September 22. Oil pulls the other way: Brent crude passed $116 on October 23 after attacks on Saudi oil sites. Traders make a rise by December likely, three chances in four, down from nine in ten a week earlier.",
    wouldChange: "A surprise rise on October 28, or the government's 10-year borrowing rate back above 5.2% before December, would make rates the main weight on Bitcoin's price again.",
    statusTone: "active",
    asOf: "OCT 22, 2026",
    sources: [
      { label: "Federal Reserve — October 2026 calendar: FOMC meeting October 27–28; statement 2:00 p.m. and press conference 2:30 p.m. on October 28; no speeches scheduled October 16–31 (pre-meeting quiet period)", url: "https://www.federalreserve.gov/newsevents/2026-october.htm" },
      { label: "U.S. Treasury — daily par yield curve, October 2026 (2y / 10y / 30y): Oct 16 4.74/5.09/5.43 · Oct 19 4.77/5.15/5.48 · Oct 20 4.79/5.12/5.42 · Oct 21 4.81/5.13/5.42 · Oct 22 4.65/4.96/5.29 · Oct 23 4.69/5.00/5.33", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202610" },
      { label: "CentralBank.watch — fed funds futures, Oct 23: 10.0% odds of a rise on Oct 28 (hold 90.0%); 72.5% odds of a fresh rise on Dec 9, 75.3% cumulative odds the rate is higher by then; about 67 bp of tightening priced over nine meetings", url: "https://centralbank.watch/federal-reserve/" },
      { label: "24/7 Wall St — Oct 23: 10-year yield 4.953% on Oct 22, −19.3 bp, first close below 5% since September 22, largest daily drop since March 10, 2023; CME FedWatch odds of an October hike 7.2% (from 27.7% a week earlier, 55.4% a month earlier); December hike odds about 78%", url: "https://247wallst.com/investing/2026/10/23/the-10-year-yield-just-fell-below-5-as-investors-fled-ai-stocks/" },
      { label: "BEA — release schedule: October 29, 8:30 a.m., GDP (Advance Estimate) 3rd Quarter 2026 and Personal Income and Outlays (PCE inflation), September 2026", url: "https://www.bea.gov/news/schedule" },
      { label: "TradingEconomics — Brent crude $116.72 on Oct 23 (+3.1% on the day; +9.5% on the month); Houthi attacks on Saudi Arabia continue; State Department orders non-essential personnel out of Saudi Arabia; traders expect U.S. strikes on Iran could resume within weeks", url: "https://tradingeconomics.com/commodity/brent-crude-oil" },
    ],
  },
  {
    label: "REGULATION • OCT 21",
    title: "Congress Away, Agencies Fill the Rulebook: Stablecoin Rules Final, Token-Sale Comments Close",
    plain: "The crypto rules bill is stuck until November 9, so regulators are finishing rules themselves. The first, for stablecoins (digital tokens fixed at one dollar), was completed October 21.",
    detail: "The CLARITY Act would write into law which referee governs crypto: Bitcoin under the CFTC, which oversees gold and oil markets, with the SEC, the stock-market regulator, keeping assets that work like shares. The Senate fell eleven votes short of debating it on September 15 and returns November 9. Bettors give passage this year a 4% chance. The White House office that advises on crypto has had no staff since October 14. On October 21 the OCC, which supervises national banks, finished the rules for stablecoins, digital tokens fixed at one dollar, under the GENIUS Act, last year's stablecoin law. They apply from January 18, 2027. On October 20 the window for public comments closed on the SEC's plan for legal token sales. Agency rules are faster than a law but easier to undo, so until Congress acts, U.S. rules around Bitcoin can change with each administration.",
    wouldChange: "A named White House crypto adviser with a Senate vote scheduled for November, or the bill's sponsors conceding it waits for 2027, would change this read either way.",
    statusTone: "stalled",
    asOf: "OCT 21, 2026",
    sources: [
      { label: "OCC — Bulletin 2026-50, October 21, 2026: final rule implementing the GENIUS Act for payment stablecoin issuers (new 12 CFR 15: activities, reserve assets, redemption, risk management, audits, custody, applications, foreign issuers, revocation, capital backstop); effective January 18, 2027; BSA/AML and sanctions rules to follow in a separate rulemaking with Treasury", url: "https://occ.gov/news-issuances/bulletins/2026/bulletin-2026-50.html" },
      { label: "The Block — Oct 20: comment period on the SEC's proposed Regulation Crypto Assets (File S7-2026-27, Federal Register Aug 21) closes with about 140 submissions from Hyperliquid, SIFMA, AIMA and others; the New York Attorney General argues the proposal exceeds the SEC's exemptive authority", url: "https://theblock.co/news/regulation/2026-10-20-sec-regulation-crypto-assets-comment-period-hyperliquid-sifma-aima-421444" },
      { label: "CFTC — release 9307-26, October 5, 2026: advance notice of proposed rulemaking on retail crypto asset transactions (Regulation CTX) and a 'crypto asset market' venue category (Regulation CAM); comments due 60 days after Federal Register publication (91 FR 64811, Oct 13)", url: "https://www.cftc.gov/PressRoom/PressReleases/9307-26" },
      { label: "U.S. Senate Daily Press (as of Oct 16) — pro forma sessions Oct 19, 22, 26 and 29; the Senate returns Monday, November 9 at 3:00 p.m., first vote 5:30 p.m. on the permitting-reform vehicle (H.R. 2347); no action scheduled on H.R. 3633", url: "https://www.dailypress.senate.gov/" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 4% on $24.5 million traded (Oct 24)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "CORPORATE TREASURY • OCT 19",
    title: "Strategy Buys Back More Than It Buys; Strive Out-Buys It; MSCI Rules November 11",
    plain: "Strategy, the biggest corporate Bitcoin holder, bought 267 coins and spent nine times more buying back its shares. Rival Strive bought 4,045 with money raised at a 15% yearly payout.",
    detail: "Strategy, formerly MicroStrategy and the biggest corporate Bitcoin holder, sells new shares and buys coins with the money. Its October 19 filing with regulators shows 267 coins bought for $22.1 million, for 848,517 in total, at an average cost of $75,446, so it is about 7% in profit at $80,500. It spent $193 million, nearly nine times as much, buying back STRC, its preferred shares, which currently pay 12% a year, instead of buying coins. Strive, a smaller rival, raised $630 million by selling preferred shares that pay 15% a year and bought 4,045 coins in the week to October 16, for 36,818 in total. On November 11 MSCI, the company whose stock lists many funds copy, names the companies it drops on November 30. Strategy is on its draft list. If it is dropped, those funds must sell its shares, and selling new shares to buy Bitcoin gets harder.",
    wouldChange: "Strategy missing from MSCI's final removal list on November 11, or a weekly filing showing coins sold to pay its shareholders, would change this read in opposite directions.",
    asOf: "OCT 19, 2026",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K filed October 19, 2026 (period Oct 12–18): 267 BTC bought for $22.1M at $82,900 average, $22.0M from MSTR stock sales and $0.1M USD Cash; holdings 848,517 BTC as of Oct 18 at $75,446 average, $64.02B cost; 140,872 MSTR shares sold; STRC repurchase 1,938,780 shares for $193.1M; repurchase program raised from $2.0B to $3.0B ($1.16B left); USD Reserve $4.83B; USD Cash $447.3M", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526424688/mstr-20261019.htm" },
      { label: "SEC EDGAR — Strive, Inc. Form 8-K filed October 19, 2026: 4,045 BTC bought Oct 12–16 at about $82,803 average (2,822 on Oct 12–13; 1,223 on Oct 14–16 at about $81,734); holdings 36,818 BTC as of Oct 16, from 32,773 on Oct 9; warrant exercises raised about $369.2M; 7,000,000 shares of 15.00% Series A Perpetual SATS Preferred priced Oct 15 at $90.00, about $630M gross, settling Oct 20", url: "https://www.sec.gov/Archives/edgar/data/1920406/000162828026066222/asst-20261019.htm" },
      { label: "SEC EDGAR — Strive, Inc. Form 8-K filed October 21, 2026: first SATS dividend $0.8710 per share payable November 9 (record date November 6); daily dividends of $0.0658 per share each business day November 10–30; distributions expected to be treated as return of capital", url: "https://www.sec.gov/Archives/edgar/data/1920406/000162828026066608/asst-20261021.htm" },
      { label: "MSCI — 'Results of the Consultation on the Eligibility of Non-Operating Companies in the MSCI Global Investable Market Indexes', October 15, 2026: proposal adopted; effective with the November 2026 Index Review as of the close of November 30; final list of affected securities November 11", url: "https://app2.msci.com/webapp/index_ann/DocGet?pub_key=aq0wbkjxPgo=&lang=en&format=html" },
      { label: "Strategy — press release, October 8, 2026: third-quarter 2026 results after U.S. markets close on Thursday, October 29, with a live video webinar at 5:00 p.m. Eastern", url: "https://www.strategy.com/press/strategy-announces-earnings-release-date-and-live-video-webinar-for-third-quarter-2026-financial-results_10-08-2026" },
      { label: "CoinDesk — Oct 24: Fidelity counts 135,979 BTC bought with preferred-stock money since 2025, 'more than 0.5%' of the maximum supply; the Bitcoin-focused preferred market is about $12 billion; CoinShares' Butterfill: 'Buybacks can reduce future dividend costs, but they compete with bitcoin purchases for capital today'", url: "https://www.coindesk.com/business/2026/10/24/strategy-strive-face-balancing-act-between-bitcoin-buying-and-preferred-stock-dividends" },
    ],
  },
  {
    label: "ETFs • OCT 20",
    title: "New Doors Into Bitcoin: Swiss Fund for Savers, BlackRock's Protected Fund, JPMorgan's First Forecast",
    plain: "Switzerland approved its first Bitcoin fund for savers, and BlackRock filed one built to limit losses to about 10%. JPMorgan's fund arm now assumes Bitcoin returns 10% a year.",
    detail: "Two new funds open Bitcoin to ordinary and cautious savers, but they move the price only if money comes in. On October 20 FINMA, Switzerland's financial regulator, approved the country's first Bitcoin fund open to ordinary investors. Earlier Swiss products were IOUs from their issuers, not funds. Its maker expects it to start trading in Zurich in November. On October 19 BlackRock, the biggest fund manager, filed for a third Bitcoin fund. It holds no Bitcoin itself. It uses option contracts, a form of price insurance, on its existing Bitcoin fund to limit losses to about 10% before fees, in exchange for a cap on gains. On October 20 JPMorgan Asset Management included Bitcoin in its ten-year return assumptions for the first time. It assumes 10% a year, enough to double in seven years, against 7.5% for U.S. stocks and 5.5% for gold, while calling it 'a speculative asset'.",
    wouldChange: "The Swiss fund trading in Zurich in November, or a second Swiss approval, would strengthen this read; BlackRock withdrawing its protected fund, or little money arriving, would weaken it.",
    statusTone: "advancing",
    asOf: "OCT 20, 2026",
    sources: [
      { label: "FINMA — press release, October 20, 2026 (PDF): approval of Switzerland's first Bitcoin ETF for retail investors as an 'other fund for alternative investments' with a specific risk; exemption from risk-diversification rules given Bitcoin's longer trading history and higher trading volumes; issuer not named", url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/8news/medienmitteilungen/2026/10/20261020-mm-finma-bitcoin-etf.pdf" },
      { label: "The Block — Oct 20 (updated Oct 23): FINMA quote 'Bitcoin (BTC) has a longer trading history and much higher trading volumes than most other cryptocurrencies'; 'approving the ETF does not change the risks of investing in bitcoin'; BIT Asset Management confirms its Bitcoin Fund ETF (BBIT), SIX listing expected November 2026; Swiss Bitcoin ETPs since 2018 are debt securities", url: "https://theblock.co/news/regulation/2026-10-20-swiss-regulator-finma-approves-countrys-first-spot-bitcoin-etf-for-retail-investors-421127" },
      { label: "SEC EDGAR — iShares Trust Form 485APOS filed October 19, 2026: iShares Bitcoin Managed Protection ETF (PBIT); no direct bitcoin; three overlapping tranches of call-option spreads on IBIT-type reference assets; purchased-option strike about 90% of reference value (initial maximum loss about 10% before fees); upside capped per tranche; fee blank; effective 75 days after filing", url: "https://www.sec.gov/Archives/edgar/data/1100663/000119312526425335/d144515d485apos.htm" },
      { label: "CoinDesk — Oct 20: JPMorgan Asset Management's 2027 Long-Term Capital Market Assumptions give bitcoin a 10% base-case annual return over ten years (bull 17%, bear −9.7%), against 7.5% for U.S. large caps, 7.7% small caps, 5.6–6.6% U.S. bonds and 5.5% gold; 'speculative asset and a hedge against monetary easing'; not in model portfolios", url: "https://www.coindesk.com/markets/2026/10/20/jpmorgan-sees-10-annual-bitcoin-returns-topping-stocks-bonds-and-gold-over-next-decade" },
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
  { date: "Oct 24", title: "Bitcoin falls under $80,000 for the first time since October 15 as the U.S. orders non-essential diplomats out of Saudi Arabia; about $830 million of leveraged crypto bets are forced closed", source: "CoinDesk", tag: "MARKETS", important: true },
  { date: "Oct 23", title: "Brent crude passes $116 a barrel, its highest since April, after attacks on Saudi oil sites; traders cut the odds of a Fed rate rise on October 28 to about one in ten", source: "CoinDesk", tag: "FED", important: true },
  { date: "Oct 22", title: "Technology stocks have their worst day since June on fears about spending on artificial intelligence; $636 million leaves U.S. Bitcoin ETFs, the most in one day since June, and Bitcoin slides about 3% to $81,000", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Oct 21", title: "The OCC, which supervises national banks, finishes the first U.S. rulebook for stablecoins, digital tokens fixed at one dollar, under last year's GENIUS Act; it takes effect January 18, 2027", source: "OCC", tag: "REGULATION" },
];
