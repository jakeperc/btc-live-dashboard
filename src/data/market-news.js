// Market news data — owner: /refresh-market-news (weekly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// MARKET_THEME drives the dominant-narrative card. statusTone accent:
//   advancing → green, active → blue, stalled → amber, passed → strong green.
// CURATED_MARKET_UPDATES — the 4-card cross-current rail.
// NEWS_FEEDS — RSS sources the dashboard polls live (rarely changed).
// FALLBACK_NEWS — used only when live RSS fetch fails (~last 48h).

export const MARKET_THEME = {
  category: "MACRO",
  asOf: "SEP 16, 2026",
  refreshedAt: "2026-09-16T20:30:00Z",
  title: "The Fed's First Rate Rise Since 2023, With One More Penciled In",
  status: "Raised Sept 16; next decision Oct 28",
  statusTone: "active",
  narrative: "On September 16 the Federal Reserve, the U.S. central bank, raised its key interest rate a quarter point to a 3.75% to 4.00% range, its first rise since July 2023, on a unanimous vote. Chair Kevin Warsh said 'inflation is too high and has been for too long,' and officials' new forecasts pencil in one more rise this year. Bitcoin barely moved, trading near $75,500. It had fallen about 4% the day before, when the Senate blocked the crypto rules bill, and sits about 8% below its early-September high.",
  whyItMatters: "Higher interest rates make cash and bonds pay more, so Bitcoin, which pays nothing, has to compete harder for money. Traders expected this rise, so the shock was small. The bigger question is the next one: another rise by December is very likely, and a Fed that keeps going would keep the pressure on Bitcoin.",
  wouldChange: "A quiet October pause, or money flowing back into the Bitcoin funds for a full week, would say the rate pressure has already peaked.",
  milestoneLabel: "Next checkpoint",
  milestone: "October 28: the Fed's next decision. On the eve of this one, traders' bets made another rise in October close to a coin flip, leaning no, and very likely by December 9. Before then come September's jobs and inflation reports. Also watch whether Bitcoin holds the $75,000 area and whether money keeps leaving the Bitcoin funds.",
  sources: [
    { label: "Federal Reserve — FOMC statement, September 16, 2026: target range raised a quarter point to 3.75%–4.00%, vote 12–0", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm" },
    { label: "Federal Reserve — Summary of Economic Projections, September 16, 2026: median end-2026 rate 4.1%, up from 3.8% in June", url: "https://www.federalreserve.gov/monetarypolicy/fomcprojtabl20260916.htm" },
    { label: "CentralBank.watch — fed funds futures on the eve of the decision: 44% odds of another rise on Oct 28, 88% by Dec 9 (Sep 15)", url: "https://centralbank.watch/federal-reserve/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "REGULATION • SEP 15",
    title: "The Senate Blocks the CLARITY Act; Crypto's Rules Now Fall to the Agencies",
    plain: "The Senate fell eleven votes short of debating the crypto rules bill, so Bitcoin's market rules very likely come from regulators this year, not Congress.",
    detail: "The bill would write into law which referee governs crypto: Bitcoin under the CFTC, which oversees gold and oil markets, with the SEC, the stock-market regulator, keeping assets that work like investment contracts. On September 15 the Senate voted 49 to 50 on cloture (the 60-vote hurdle a bill must clear before the Senate will debate it). Every Democrat present voted no; the negotiators among them said the ethics section does not effectively apply to the president and his family. Republican Thom Tillis, a supporter, switched to no only to keep the option of a second vote. The Senate leaves around October 1 to campaign, and a betting market gives passage this year about 7% odds, down from 23%. Regulators moved the next day: the SEC chair promised to act 'with or without legislation,' and the CFTC chair said his agency is 'ready to ship its rules.'",
    wouldChange: "A second Senate vote called before October 1, with the seven negotiating Democrats switching to yes, would put the bill back on the table.",
    statusTone: "stalled",
    asOf: "SEP 15, 2026",
    sources: [
      { label: "U.S. Senate Daily Press — Tuesday, September 15, 2026: cloture on the motion to proceed to H.R. 3633 fails 49–50; Tillis files a motion to reconsider", url: "https://www.dailypress.senate.gov/tuesday-september-15-2026/" },
      { label: "Congress.gov — H.R. 3633, Digital Asset Market Clarity Act: actions and status", url: "https://www.congress.gov/bill/119th-congress/house-bill/3633" },
      { label: "The Block — 'Go time': SEC and CFTC chairs say they will write crypto rules under existing authority (Sep 16)", url: "https://www.theblock.co/news/regulation/2026-09-16-go-time-sec-cftc-prepare-push-crypto-rules-clarity-act-stalls-senate-415281" },
      { label: "Polymarket — 'Clarity Act signed into law in 2026?' priced at 7% (Sep 16)", url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026" },
    ],
  },
  {
    label: "ETFs • SEP 15",
    title: "Bitcoin Funds: A Record August, Then the Largest Withdrawal Day Since June",
    plain: "Investors pulled $450 million from the Bitcoin stock-market funds on September 15, the most in a day since June, as the crypto bill failed.",
    detail: "The U.S. spot Bitcoin ETFs, funds that hold Bitcoin and trade on the stock market, took in $3.5 billion in August, their best month of 2026, and $731 million on September 3, their best day since January. Investors withdrew money on four straight days, about $463 million in total. Monday brought $160 million back in, mostly to IBIT, the biggest of the funds, run by BlackRock. Then on Tuesday, the day the Senate blocked the crypto bill, $450 million left, the biggest one-day withdrawal since June 25 and almost as much as the prior week. Since September 8 the funds have lost about $750 million, roughly what they took in on September 3, and under 1% of their $100 billion in assets. A week where buying outweighs selling after this week's rate rise would say the shock has passed; more days like Tuesday would say it has not.",
    wouldChange: "Two straight weeks of more buying than selling would mean big investors have made peace with higher rates.",
    sources: [
      { label: "Farside Investors — U.S. spot Bitcoin ETF daily flows", url: "https://farside.co.uk/btc/" },
      { label: "CoinDesk — live updates, Sep 16: $450.4 million left the U.S. Bitcoin ETFs on Sep 15, the largest outflow since June 25", url: "https://www.coindesk.com/business/2026/09/16/live-updates-zcash-climbs-6-as-majors-slide-ahead-of-fed-rate-decision" },
      { label: "The Block — U.S. Bitcoin ETFs post their largest inflow day since January, $731 million (Sep 4)", url: "https://www.theblock.co/news/markets/2026-09-04-us-bitcoin-etfs-largest-inflow-day-since-january-413515" },
    ],
  },
  {
    label: "CORPORATE TREASURY • SEP 14",
    title: "Strategy Sits Out a Second Week: No Bitcoin Bought, No Shares Sold",
    plain: "Strategy, the biggest corporate Bitcoin holder, bought no Bitcoin and sold no new shares for a second straight week, buying back its dividend shares instead.",
    detail: "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other) sold coins three times this summer, then bought 4,603 in late August at $80,318 each, above its average cost of $75,412. Its September 14 filing covers September 8 to 13: no Bitcoin bought or sold, no new shares sold, and $139 million spent repurchasing STRC — its dividend-paying preferred shares — from a flexible cash pool that now holds $1.3 billion. Holdings stay at 845,050 coins, about 4% of all the Bitcoin that will ever exist, and it keeps a separate $5.1 billion reserve earmarked for dividends and interest. Two quiet weeks say little; a filing showing sales with the price below that average cost would reopen the question of whether the summer selling was deliberate. MSCI, the index company whose lists many funds copy, decides October 16 whether to eject the company from its indexes.",
    wouldChange: "A purchase paid from cash while its share sales stay shut would show the company buying on conviction, not on cheap financing.",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K, September 14, 2026 (no trades Sep 8–13; holdings 845,050; $139.3M STRC repurchase)", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526389858/mstr-20260914.htm" },
      { label: "SEC EDGAR — Strategy Form 8-K, August 31, 2026 (4,603 BTC bought Aug 24–30 at $80,318)", url: "https://www.sec.gov/Archives/edgar/data/0001050446/000119312526375463/mstr-20260831.htm" },
      { label: "Strategy — response to MSCI's consultation on non-operating companies (Sep 1)", url: "https://www.strategy.com/msci" },
    ],
  },
  {
    label: "SECURITY • SEP 10",
    title: "A Software Bug Drained 4,000 Bitcoin From the Liquid Sidechain; Most Came Back",
    plain: "Attackers used a bug to pull 4,000 Bitcoin from Liquid, a side network built on Bitcoin; most came back, and Bitcoin's own network was untouched.",
    detail: "Liquid is a sidechain: a separate network, run by the company Blockstream and partner exchanges, where users lock real Bitcoin and receive matching 'L-BTC' tokens that move faster and more privately. On September 6 someone exploited a flaw in its software to create 4,000 L-BTC out of thin air and cash them in for real Bitcoin, about $320 million and 95% of the network's Bitcoin reserve, in one afternoon. No keys were stolen; the fake tokens simply looked valid. Calling themselves friendly hackers, the attackers returned 3,400 Bitcoin the next day and kept 598.5, about $47 million, as a self-awarded reward. The network restarted on September 10, but withdrawals are still frozen, and Blockstream says every L-BTC will be backed one for one. Bitcoin's own network was untouched, and coins held in ordinary wallets were never at risk. The lesson is old: every extra layer asks for extra trust.",
    wouldChange: "Withdrawals reopening with every token backed one for one would close the incident; a second bug found in review would reopen it.",
    sources: [
      { label: "Blockstream — Liquid Network incident status page (updated Sep 10)", url: "https://status.blockstream.com/incidents/b8b719f3-db70-4487-9cff-946e69509228" },
      { label: "The Hacker News — Liquid attackers return 3,400 Bitcoin, still hold about $47M (Sep 8)", url: "https://thehackernews.com/2026/09/liquid-hackers-return-3400-bitcoin.html" },
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
  { date: "Sep 16", title: "The Fed raises its key rate a quarter point to 3.75%–4.00%, its first rise since July 2023, on a unanimous vote; officials pencil in one more this year, and Bitcoin barely moves near $75,500", source: "Federal Reserve", tag: "FED", important: true },
  { date: "Sep 15", title: "The Senate votes 49–50 on the CLARITY Act, short of the 60 needed to debate it; every Democrat present votes no over ethics language, and Bitcoin falls about 4% to below $76,000", source: "U.S. Senate", tag: "REGULATION", important: true },
  { date: "Sep 16", title: "SEC Chair Paul Atkins and CFTC Chair Mike Selig say they will write crypto market rules under existing authority after the Senate vote; a betting market cuts the bill's 2026 odds to 7% from 23%", source: "The Block", tag: "REGULATION" },
  { date: "Sep 15", title: "U.S. spot Bitcoin ETFs lose $450 million in one day, the most since June 25, erasing Monday's $160 million of inflows; net withdrawals since September 8 reach about $750 million", source: "CoinDesk", tag: "ETFs" },
];
