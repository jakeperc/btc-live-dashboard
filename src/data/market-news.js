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
  asOf: "OCT 16, 2026",
  refreshedAt: "2026-10-16T14:00:00Z",
  title: "Bitcoin Slips Toward $80,000 as Funds Turn Sellers and Hot Inflation Revives Rate-Rise Talk",
  status: "Lower since Oct 7; about $82,000 on Oct 16",
  statusTone: "active",
  narrative: "Bitcoin has slipped from about $84,000 on October 7 to about $82,000 on October 16. It dipped just under $80,000 on October 15 after a hot inflation report. The U.S. Bitcoin ETFs, funds that hold Bitcoin itself and trade on the stock market, turned sellers. Investors pulled $681 million in the week of October 5, including $487 million on October 7, and a further $146 million in the four days to October 15. For the month to October 15, withdrawals total about $535 million, against $2.6 billion bought in September.",
  whyItMatters: "The September rally has partly reversed. Big investors who bought Bitcoin funds in September are taking money out, and the price is about 6% below its September high. The cause is inflation, not Bitcoin news: U.S. prices are rising faster again, so interest rates may rise, and safe interest competes with an asset that pays none.",
  wouldChange: "Two straight weeks of net fund buying, or a week ending back above $87,570, the price on January 1, would say the pullback is over.",
  milestoneLabel: "Next checkpoint",
  milestone: "October 27–28: the rate decision of the Federal Reserve, the U.S. central bank, with its chair's press conference on the 28th. October 28: a shareholder vote at Strategy, the biggest corporate Bitcoin holder. November 3: U.S. midterm elections. November 9: Congress returns. November 11: MSCI's final list of companies it will drop from its indexes.",
  sources: [
    { label: "TFTC (Farside Investors data) — U.S. spot Bitcoin ETF daily flows, October 2026: Oct 7 −$487.1 million (IBIT −$207.7M, FBTC −$105.1M), Oct 8 −$244.1 million, week of Oct 5–9 −$681 million; Oct 12 −$65.4M, Oct 13 +$175.6M, Oct 14 −$261.5M, Oct 15 +$5.1M; month to Oct 15 −$534.8 million", url: "https://www.tftc.io/bitcoin-etf-flows/october-2026" },
    { label: "CoinDesk — Oct 15: Bitcoin back below $81,000 after falling close to $80,000 in Asian hours; September CPI 3.7% from 3.4%; CME odds of an October hike jump to 47% then retreat to 26%; ETF outflows Oct 14", url: "https://www.coindesk.com/markets/2026/10/15/bitcoin-is-back-below-usd81-000-as-fed-rate-uncertainty-weighs" },
    { label: "Yahoo Finance — Oct 15: Bitcoin opens $81,573, $80,935 at 7:25 a.m. ET, down 1.8%; 'prices took a turn for the worse yesterday following the hotter-than-expected CPI report'; opens in the $81,000–83,000 range all week", url: "https://finance.yahoo.com/personal-finance/investing/article/bitcoin-and-ethereum-prices-today-thursday-october-15-2026-crypto-prices-falling-into-a-familiar-pattern-113540042.html" },
    { label: "Fortune — Oct 16, 7:45 a.m. ET: Bitcoin $82,645, up 2.1% from $80,915 a day earlier; Oct 8 $82,622; Oct 14 $83,402", url: "https://fortune.com/article/price-of-bitcoin-10-16-2026/" },
    { label: "CryptoTicker (Farside and CoinGecko data) — Oct 16: 24-hour low $79,806 on Oct 15; October net outflow $539.8M to Oct 15; September +$2.6B, August +$3.5B; U.S. spot ETF holdings $105.7B", url: "https://cryptoticker.io/en/bitcoin-price-etf-inflows-standstill-october-16-2026/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "MACRO • OCT 16",
    title: "Hot Inflation Revives October Rate-Rise Talk; the Fed Chair Won't Say",
    plain: "U.S. prices rose 3.7% in a year; most central-bank officials want one more rate rise, date unknown. Higher rates make safe interest a stronger rival to Bitcoin, which pays none.",
    detail: "On October 7 the minutes of the September meeting of the Federal Reserve, the U.S. central bank, showed 'most participants' expect another quarter-point rise to be appropriate by year end. On October 14 the consumer price index showed prices up 3.7% in a year, from 3.4% in August; without food and energy, 2.6%. Producer prices followed, up 6.3% in a year. Traders' odds of a rise on October 28 jumped from about one in five to one in two, then fell to about one in four as Fed officials said there was no urgency. They slid toward one in six after Kevin Warsh, the Fed's chair, said on October 16: 'I don't prejudge meetings.' An October rise is possible but less likely than not; a rise by December is very likely. The 30-year Treasury yield, the government's long-term borrowing rate, eased to 5.43% from 5.67% on October 7.",
    wouldChange: "The 30-year Treasury yield, the government's long-term borrowing rate, back above 5.7%, or October-28 rise odds above one in two before the meeting, would say rate pressure is building again.",
    statusTone: "active",
    asOf: "OCT 16, 2026",
    sources: [
      { label: "Federal Reserve — Minutes of the FOMC, September 15–16, 2026 (released Oct 7): 12–0 vote to raise to 3.75–4.00%; 'most participants' judged 'another increase in the target range for the federal funds rate would likely be appropriate by year end'; inflation risks 'skewed to the upside'", url: "https://www.federalreserve.gov/monetarypolicy/fomcminutes20260916.htm" },
      { label: "BLS — Consumer Price Index, September 2026 (Oct 14): all items +0.6% on the month, +3.7% over 12 months (August 3.4%); core +0.3% / +2.6%; gasoline +9.1% on the month; energy +20.4% over the year", url: "https://www.bls.gov/news.release/cpi.nr0.htm" },
      { label: "BLS — Producer Price Index, September 2026 (Oct 15): final demand +1.3% on the month, +6.3% over 12 months; energy +10.8% on the month", url: "https://www.bls.gov/news.release/ppi.nr0.htm" },
      { label: "Yahoo Finance (AP) — Oct 16: Chair Warsh in Bangkok with the IMF's Georgieva: 'I don't prejudge meetings'; 'we made very clear that we would deliver price stability'; CME October-hike odds about 22% before CPI, about 50% at the peak, about 30% latest; NY Fed's Williams: 'it may be appropriate to have one more rate hike'", url: "https://finance.yahoo.com/economy/policy/articles/fed-warsh-sees-ai-boosting-092755684.html" },
      { label: "CentralBank.watch — fed funds futures, Oct 15: 28.0% odds of a rise on Oct 28 (hold 72.0%); 89.8% odds of a rise by Dec 9", url: "https://centralbank.watch/federal-reserve/" },
      { label: "U.S. Treasury — daily par yield curve, October 2026: 30-year 5.67% (Oct 7) → 5.60% (Oct 8–9) → 5.56% (Oct 13) → 5.52% (Oct 14) → 5.43% (Oct 15); 10-year 5.28% → 5.10%", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202610" },
    ],
  },
  {
    label: "REGULATION • OCT 14",
    title: "Congress Away, the White House Crypto Office Empties, and Agencies Keep Writing the Rules",
    plain: "The crypto rules bill is stuck until at least November 9. So regulators are writing crypto rules themselves: faster than a law, but easier to undo.",
    detail: "The CLARITY Act would write into law which referee governs crypto: Bitcoin under the CFTC, which oversees gold and oil markets, with the SEC, the stock-market regulator, keeping assets that work like investment contracts. The Senate fell eleven votes short of debating it on September 15 and does not return until November 9. A betting market puts passage this year at about 6%. On October 14 Patrick Witt, the White House's lead adviser on the bill and the last person left on its crypto council, departed as his temporary posting ended; no successor is named. The agencies filled the gap. On October 5 the CFTC asked for comment on rules for crypto trading with borrowed money by ordinary investors, and on October 9 it moved to treat bets on events such as elections as contracts it already polices. The SEC's October 1 custody proposal stays open for comment.",
    wouldChange: "A named successor at the White House with a Senate vote scheduled for November, or the bill's sponsors conceding it waits for 2027, would change this read either way.",
    statusTone: "stalled",
    asOf: "OCT 14, 2026",
    sources: [
      { label: "CFTC — release 9307-26, October 5, 2026: advance notice of proposed rulemaking on retail crypto asset transactions (Regulation CTX) and a 'crypto asset market' venue category (Regulation CAM); comments due 60 days after Federal Register publication (91 FR 64811, Oct 13)", url: "https://www.cftc.gov/PressRoom/PressReleases/9307-26" },
      { label: "CFTC — release 9309-26, October 9, 2026: interim final rule that casino-style gambling is not a 'swap', paired with a proposal (9310-26) to bring event contracts on sports, politics and weather inside the swap definition; Chairman Selig: 'Casino-style gambling products are not derivatives'", url: "https://www.cftc.gov/PressRoom/PressReleases/9309-26" },
      { label: "Yahoo News (BeInCrypto) — Oct 14: the White House confirms Patrick Witt's detail to the President's Council of Advisers on Digital Assets 'has expired'; 'The White House appreciates his service'; he was its only remaining staffer after Harry Jung (July) and David Sacks (March); no successor named", url: "https://www.yahoo.com/news/politics/articles/white-house-crypto-council-loses-210000780.html" },
      { label: "U.S. Senate Daily Press — October 2026: pro forma sessions Oct 19, 22, 26 and 29; the Senate returns Monday, November 9 at 3:00 p.m., first vote 5:30 p.m. on the permitting-reform vehicle (H.R. 2347); no action scheduled on H.R. 3633", url: "https://www.dailypress.senate.gov/" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 6% on $24.1 million traded (Oct 16)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "CORPORATE TREASURY • OCT 15",
    title: "MSCI Adopts the Rule That Could Drop Strategy From Its Indexes on November 30",
    plain: "MSCI, whose index lists many funds copy, adopted a rule that may drop Strategy, the biggest corporate Bitcoin holder, on November 30. That could slow one of Bitcoin's biggest buyers.",
    detail: "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other) sells new shares when they trade above the value of its Bitcoin and buys coins with the money. Its October 13 filing shows 250 coins bought for $21.5 million, nearly all from share sales, for 848,250 in total, about 4% of all that will ever exist. It spent nine times as much, $192 million, buying back its own dividend-paying shares. Its average cost is $75,444, so at $82,000 it shows a gain of about 9% on paper, not yet cashed in. On October 15 MSCI, the index company whose lists many funds copy, adopted a rule removing companies without a real operating business from its indexes. Strategy is on MSCI's list of likely removals; the final list comes November 11, effective November 30. Funds copying MSCI hold about 3% of Strategy's shares, less than one day's trading.",
    wouldChange: "Strategy missing from MSCI's final removal list on November 11, or a weekly filing showing coins sold, would change this read in opposite directions.",
    asOf: "OCT 15, 2026",
    sources: [
      { label: "MSCI — 'Results of the Consultation on the Eligibility of Non-Operating Companies in the MSCI Global Investable Market Indexes', October 15, 2026: proposal adopted with minor changes; core screen for 'substantial operating assets', then five financial ratios (ineligible if flagged on four or more); current constituents removed only if they fail in both of the two latest annual periods; effective with the November 2026 Index Review as of the close of November 30; final list of affected securities November 11; interim digital-asset-treasury measures of October 10, 2025 discontinued", url: "https://app2.msci.com/webapp/index_ann/DocGet?pub_key=aq0wbkjxPgo=&lang=en&format=html" },
      { label: "Unchained — Oct 15: MSCI's current list of potential deletions (data as of Sep 30, 2026) names Strategy, Metaplanet, Yellow Cake, Upexi and Skel; 17 companies including SharpLink on a watchlist; Strategy said in August that MSCI-tracking funds hold about 13 million shares, 3.1%, less than one day's volume", url: "https://unchainedcrypto.com/strategy-metaplanet-face-exit-from-msci-indexes-as-the-index-provider-adopts-new-test/" },
      { label: "SEC EDGAR — Strategy Form 8-K filed October 13, 2026, Exhibit 99.1 (press release of Oct 12): 250 BTC bought Oct 5–11 for $21.5M at $86,194, $21.0M from MSTR stock sales and $0.5M USD Cash; holdings 848,250 as of Oct 11 at $75,444 average, $64.00B cost; 125,183 MSTR shares sold; STRC repurchase 1,932,145 shares for $192.4M; USD Reserve $4.88B; USD Cash $640.5M", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526419726/mstr-ex99_1.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K filed October 16, 2026: board declares daily STRC cash dividends for November 1–30 ($1.00 per share for the month, paid the next business day from November 2), conditional on stockholder approval of the daily-dividend amendments by 5:00 p.m. ET October 31; special meeting October 28, 10:00 a.m. ET; STRC rate held at 12.00%", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526423400/mstr-20261015.htm" },
    ],
  },
  {
    label: "SOVEREIGN • OCT 12",
    title: "The Reserve Bill Waits for November While Seized Government Coins Start Moving",
    plain: "A bill barring U.S. government Bitcoin sales for 20 years would remove possible selling; no vote is set. Seized coins moved; a sale would add supply, but none was announced.",
    detail: "In March 2025 the president created a Strategic Bitcoin Reserve by executive order, which a future president could undo. This bill would write it into law: the Treasury would hold the government's 320,000 coins, worth about $26 billion, and could not sell any for 20 years. It buys no more coins, so it adds no new demand. The House Financial Services Committee approved it 28 to 21 on September 16; the House is away until November 9. Between October 6 and 8, wallets that Arkham, a blockchain-tracking firm, labels as government holdings of coins seized from the 2016 Bitfinex hack moved about 17,800 coins, some to Coinbase, the exchange, and most to new addresses. A move is not a sale, and none was announced. On October 12 London's High Court ruled that Chinese law governs fraud victims' claims to 61,000 seized coins, improving the British government's chance of keeping them.",
    wouldChange: "A House floor vote scheduled for November, or any of the moved government coins being sold on an exchange, would change this read.",
    statusTone: "advancing",
    asOf: "OCT 12, 2026",
    sources: [
      { label: "House Financial Services Committee — Markup of Various Measures, September 16, 2026: H.R. 8957 ordered reported 28–21; Steil substitute adopted by voice vote", url: "https://financialservices.house.gov/calendar/eventsingle.aspx?EventID=411219" },
      { label: "docs.house.gov — Steil amendment in the nature of a substitute to H.R. 8957: 20-year minimum holding period, annual audited proof of reserve, no purchase authority", url: "https://docs.house.gov/meetings/BA/BA00/20260916/119565/BILLS-119-HR8957-S001213-Amdt-6.pdf" },
      { label: "Congress.gov — H.R. 8957, American Reserve Modernization Act of 2026: 'Ordered to be Reported (Amended) by the Yeas and Nays: 28 - 21'", url: "https://www.congress.gov/bill/119th-congress/house-bill/8957/all-actions" },
      { label: "TFTC (Arkham Intelligence on-chain labels) — Oct 8: 12,267 BTC (~$1.01B) from the 'US Government: Bitfinex Hacker Seized Funds' wallet to new unlabeled addresses at ~9:33 a.m. ET; ~9,261 BTC (~$770M) to Coinbase Prime on Oct 7–8; about 17,795 BTC (~$1.5B) over Oct 6–8; no sale confirmed; DOJ and U.S. Marshals did not respond", url: "https://www.tftc.io/us-government-bitcoin-bitfinex-seized-funds-transfer-october-2026" },
      { label: "The Block (Financial Times) — Oct 13: London's High Court rules on Oct 12 that Chinese law governs victims' claims to about 61,000 BTC (~£3.8B) seized by the Metropolitan Police in the Zhimin Qian case; preliminary ruling, claimants' firm Fieldfisher says it will appeal", url: "https://www.theblock.co/news/regulation/2026-10-13-uk-high-court-rules-chinese-law-governs-claims-over-5-billion-in-seized-bitcoin-418409" },
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
  { date: "Oct 16", title: "Fed chair Kevin Warsh says 'I don't prejudge meetings', giving no signal on an October rate rise; traders' odds of one fall toward one in six and the 10-year Treasury yield hits a three-week low", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Oct 15", title: "MSCI adopts the rule that drops companies without a real operating business from its indexes; Strategy is on its list of likely removals, with the final list due November 11 and removals effective November 30", source: "MSCI", tag: "CORPORATE", important: true },
  { date: "Oct 15", title: "Bitcoin dips just under $80,000 after the hot inflation report, then recovers to about $82,000; U.S. Bitcoin ETFs take in $5 million after $261 million left the day before", source: "CoinDesk", tag: "MARKETS" },
  { date: "Oct 14", title: "U.S. inflation jumps to 3.7% in September from 3.4%, with petrol up 9.1% in a month; the White House confirms its last crypto adviser, Patrick Witt, has left with no successor named", source: "BLS", tag: "FED", important: true },
];
