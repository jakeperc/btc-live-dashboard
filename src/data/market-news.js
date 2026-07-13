// Market news data — owner: /refresh-market-news (weekly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.
//
// MARKET_THEME drives the dominant-narrative card. statusTone accent:
//   advancing → green, active → blue, stalled → amber, passed → strong green.
// CURATED_MARKET_UPDATES — the 4-card cross-current rail.
// NEWS_FEEDS — RSS sources the dashboard polls live (rarely changed).
// FALLBACK_NEWS — used only when live RSS fetch fails (~last 48h).

export const MARKET_THEME = {
  category: "ETFs",
  asOf: "JUL 12, 2026",
  refreshedAt: "2026-07-12T18:00:00Z",
  title: "June Closes as Worst-Ever Month for Bitcoin ETFs (~$4.5B Outflows), but July Inflows Reverse the Trend; BTC Recovers to $62K–$64K Zone as Institutional Demand Returns",
  status: "Capitulation + Reversal",
  statusTone: "active",
  narrative: "June 2026 finished as the worst month on record for U.S. spot Bitcoin ETFs, with roughly $4.5 billion in net redemptions — including an early-June single-week exit of about $3.4 billion, the largest since the funds launched in January 2024. The selling pushed Bitcoin to a fresh year-to-date low near $57,700 by late June. But the narrative has sharply reversed in the first week of July. On July 2, after an exhausting 10-day outflow streak totaling $2.7 billion, U.S. spot Bitcoin ETFs recorded $221.72 million in net inflows — led by Fidelity's FBTC ($165.96M) and Ark's ARKB ($91.84M) — marking the first significant net inflow since mid-June. The reversal extended into a three-day inflow streak — roughly $509 million across July 2, 6 and 7 — the first sustained inflows since early May. However, the tape turned choppy on July 8–9, with $84.9M and $95.3M in respective outflows as IBIT and GBTC reversed inflows. Crucially, flows recovered on July 10 with a $90.4M net inflow led once again by IBIT ($86.8M), signaling that the largest institutional vehicle is not exiting but rotating tactically. The inflection coincided with weaker-than-expected June jobs data (released early July), which eased market fears of imminent Fed rate hikes. Price action has confirmed the shift: Bitcoin has recovered from $57.7K to trade near $64.3K by July 10, reclaiming the $60K psychological support level. Implied volatility remains compressed (~33%), and the tone on trading desks has shifted from 'capitulation' to 'potential bottom-formation.' The weekly net for July 8–12 so far is modestly positive despite the interim wobbles.",
  whyItMatters: "The June outflows signaled a breakdown in institutional demand; the July inflow reversal (now net-positive week-to-date) signals a potential inflection despite the choppiness. The choppier tape suggests tactical rotation rather than panic capitulation or conviction buying — a more realistic institutional reentry. If the modest inflow recovery sustains into late July above the $60K support, it would indicate that the worst of the unwind has passed and fund flows are stabilizing. Conversely, if flows slip back into outflow mode before the June CPI print on July 14, it would suggest the reversal was merely exhaustion and demand destruction continues. The macro catalyst is now very clear: the June CPI data (July 14) will determine whether the Fed can afford to cut rates or must hike, which in turn determines whether institutional capital sustains or reverses again.",
  milestoneLabel: "Next checkpoint",
  milestone: "June Consumer Price Index (CPI) data release on July 14 at 8:30 a.m. ET (a cool print could support ETF inflows and rate-cut hopes; a hot print revives hike fears); followed by the July 28–29 FOMC meeting. BTC needs to hold $60K as technical support and see fresh inflows sustain above $100M daily average for the remainder of July.",
  sources: [
    { label: "Farside Investors on X — Bitcoin ETF daily flows Jul 10, 2026: $90.4M net inflow (IBIT $86.8M)", url: "https://x.com/FarsideUK/status/2075789082232242676" },
    { label: "CoinBriefing — US spot Bitcoin ETFs see $90M inflows, July 10", url: "https://cryptobriefing.com/bitcoin-ethereum-etf-inflows-july-10/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "REGULATION • JUL 9",
    title: "CLARITY Act Stalled on Senate Calendar; August 7 Deadline Now Critical as NDAA Consumes July Floor Time",
    detail: "The CLARITY Act retains bipartisan Senate support but now faces a severe timeline crunch with a hard deadline: August 7, 2026, has emerged as the effective cutoff for Senate passage before the summer break. If the bill misses this window, 2026 passage becomes much harder as lawmakers return to a fall calendar dominated by election-year politics. The National Defense Authorization Act is set to consume the week of July 13+ floor time, further compressing the narrow window. Earlier ethics-talk stalls (collapsed June 9) combined with House GOP calendar gridlock (June 24) have already delayed the bill's floor vote. CLARITY sits on the Senate Legislative Calendar as No. 423 with no vote scheduled yet. Passage still requires 60 votes, meaning roughly seven Democratic votes are essential. If the bill slips past August 7, 2026 passage odds drop sharply.",
    statusTone: "stalled",
    asOf: "JUL 9, 2026",
    sources: [
      { label: "CryptoSlate — CLARITY Act misses July target, August 7 becomes critical deadline", url: "https://cryptoslate.com/clarity-act-misses-july-target-and-runs-into-an-august-7-senate-clock/" },
      { label: "TechTimes — Senate Crypto Bill Misses July 4: Three Unresolved Fights, Three Weeks Left", url: "https://www.techtimes.com/articles/319679/20260704/senate-crypto-bill-misses-july-4-three-unresolved-fights-three-weeks-left.htm" },
    ],
  },
  {
    label: "MACRO • JUN 17",
    title: "Iran Deal Formalized & Signed; Hormuz Reopens But Warsh Delivers Hawkish Dot Plot",
    detail: "The framework agreement reached June 12 was formalized and signed on June 17, with Trump signing at the Palace of Versailles on June 17 and official signatures scheduled for June 21 in Switzerland. The 14-point memorandum reopens the Strait of Hormuz, eases financial restrictions, and kicks off a 60-day technical window for nuclear talks — geopolitical tail risk has materially eased. Paradoxically, on the same day (June 17), Warsh's FOMC released a hawkish dot plot: nine voting members now project at least one 25bp hike by end-2026, reversing market expectations for cuts this year. The deal removes oil-shock inflation, but the Fed signaled it will not pivot to easing anytime soon despite falling energy risk.",
    sources: [
      { label: "CNN — Trump signs US-Iran agreement, June 17", url: "https://www.cnn.com/2026/06/17/world/live-news/iran-war-g7-summit" },
      { label: "NPR — Framework deal announced to end war, June 15", url: "https://www.npr.org/2026/06/15/nx-s1-5858590/us-iran-deal-updates" },
    ],
  },
  {
    label: "CORPORATE TREASURY • JUL 6",
    title: "Strategy Shifts From Aggressive Accumulation to Balanced Treasury; Sustained BTC Sales to Fund Preferred Dividends",
    detail: "Strategy Inc (formerly MicroStrategy) announced a Digital Credit Capital Framework on June 29 equipping the company to treat Bitcoin as a flexible capital resource. On June 15–22, the company sold 2.71M shares for $335.5M in gross proceeds and purchased only 520 BTC, a stark departure from the historical 'never sell, aggressive accumulate' doctrine. However, on July 6, Strategy filed an additional sale of 3,588 BTC (~$216M) to fund preferred dividends, marking a second major BTC liquidation in rapid succession. Holdings now stand at 843,775 BTC (down from 847,363 after June). The company parked most proceeds in cash to backstop its 12% perpetual preferred-stock dividend obligations, signaling a strategic pivot toward treasury prudence and capital flexibility over Bitcoin-maximalist positioning. This follows the June 1 sale of 32 BTC to fund preferred obligations — marking the first BTC sales since 2022. The shift reflects sustained liquidity demands from preferred securities rather than a bearish macro pivot.",
    sources: [
      { label: "CoinDesk — Strategy selling hundreds of millions worth of Bitcoin raises questions about capital allocation", url: "https://www.coindesk.com/markets/2026/07/06/one-month-that-shook-the-market-saylor-s-struggles-over-bitcoin-strategy-yields-big-loss" },
      { label: "BeInCrypto — MicroStrategy Sold 7x More Bitcoin Than Reports Suggested", url: "https://beincrypto.com/microstrategy-sold-far-more-bitcoin/" },
    ],
  },
  {
    label: "SOVEREIGN RESERVES • JUN 6",
    title: "Bhutan Sells Another 738 BTC at $60K Lows; Drawdown Now Exceeds 70% of Peak",
    detail: "Bhutan's sovereign investment arm Druk Holding & Investments moved 738 BTC (~$44.9M) on June 6, continuing to sell into Bitcoin's recent weakness to fund the Gelephu Mindfulness City project. Holdings have now fallen from a peak of ~13,000 BTC (2024) to an estimated 2,400–3,200 BTC — a drawdown of roughly 70–80%. The U.S. Strategic Bitcoin Reserve (~328K BTC) and Pakistan's newly announced reserve remain on the accumulation side, but Bhutan's persistent structured selling illustrates the range of sovereign strategies: some are building, some are spending.",
    sources: [
      { label: "Bitcoin.com — Bhutan 738 BTC sovereign drawdown", url: "https://news.bitcoin.com/bhutan-moves-738-btc-sovereign-drawdown/" },
      { label: "bitcointreasuries.net", url: "https://bitcointreasuries.net/" },
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
  { date: "Jul 11", title: "Bitcoin ETFs post sustained inflows for second consecutive day, capturing $197.4M on July 11 after $90.4M on July 10 (led by IBIT); 7-day flows turn positive at $124.9M as BTC tests $65K resistance zone", source: "CoinStats AI", tag: "ETFs", important: true },
  { date: "Jul 10", title: "Bitcoin ETF inflows surge $90.4M on July 10, led by BlackRock's IBIT ($86.8M), signaling institutional reentry after two-day outflow wobble (Jul 8-9); BTC pushes toward $64.3K", source: "CoinBriefing", tag: "ETFs", important: true },
  { date: "Jul 8", title: "Federal Reserve FOMC minutes released; hawkish tone confirmed with 9 of 18 officials projecting at least one 25bp rate hike by end-2026; rates held at 3.50-3.75%", source: "CNBC", tag: "FED", important: true },
  { date: "Jul 8", title: "Bitcoin ETF outflows resume temporarily on July 8-9 ($84.9M and $95.3M respectively) as market digests hawkish FOMC tone, but institutional rotation signals suggest tactical profit-taking rather than panic capitulation", source: "Finance Feeds", tag: "ETFs" },
];
