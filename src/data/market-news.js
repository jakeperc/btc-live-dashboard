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
  asOf: "AUG 7, 2026",
  refreshedAt: "2026-08-07T19:50:00Z",
  title: "The Weak Jobs Report Broke the Standoff: September Hike Bets Collapse and the ETF Money Comes Back",
  status: "Inflows Restarted",
  statusTone: "advancing",
  narrative: "July ended with the smallest positive inflow month on record; August answered in four days. Money returned to the big Bitcoin funds (funds that hold real Bitcoin and trade on the stock market) every trading day this week — roughly $750 million from Monday through Thursday, more than triple July's entire net intake, with BlackRock's fund absorbing about $604 million of it — and then Friday morning's jobs report broke the rate standoff: the U.S. lost 23,000 jobs in July against an expected 83,000 gain, the first monthly decline in months, with May and June revised down by a combined 103,000 and wage growth at its coolest since May 2021. Traders who had priced a roughly two-in-three chance of a September rate increase now expect the Fed to hold, and Bitcoin jumped to $65,340 — its high for August — up from about $63,150 at Monday's open.",
  whyItMatters: "July's unanswered question — does institutional money come back? — got its clearest yes since spring, though the reason cuts both ways: it took a weakening job market, not just cooling inflation, to push the September hike off the table, and demand is still concentrated in a single BlackRock fund. If next week's inflation report cooperates, the combination Bitcoin lacked all summer — steady rates plus returning inflows — is finally in place, in what is historically its weakest month of the year (a median 7.9% August decline over 15 years).",
  milestoneLabel: "Next checkpoint",
  milestone: "The August 12 inflation report (July CPI) is the last major data release before the Fed's September 15–16 meeting: a cool print locks in the hold markets now expect and gives inflows room to run; a hot one reopens the hike debate. Watch whether Bitcoin can clear the July 21 high near $66,900 — its first real test after reclaiming $65,000 — and whether daily fund inflows stay positive through the quiet weeks of recess-season August.",
  sources: [
    { label: "BLS — Employment Situation, July 2026: payrolls fall 23,000, unemployment 4.1% (Aug 7)", url: "https://www.bls.gov/news.release/archives/empsit_08072026.htm" },
    { label: "Cointelegraph — Bitcoin tags $65,340 August high as weak jobs numbers cool Fed rate bets (Aug 7)", url: "https://cointelegraph.com/markets/bitcoin-price-tags-653k-august-high-as-low-us-jobs-numbers-cool-fed-rate-bets" },
    { label: "Crypto Briefing — BlackRock's Bitcoin ETF pulls in $604M across four straight days of inflows (Aug 6)", url: "https://cryptobriefing.com/blackrock-ibit-bitcoin-etf-604m-inflows/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "REGULATION • AUG 6",
    title: "No Vote After All: the CLARITY Act Misses Its Window as Democrats Hold Out — Next Stop, September 15",
    detail: "The deadline passed without a vote. Senate Majority Leader John Thune confirmed on August 6 that the CLARITY Act — the bill that would finally set clear rules for how U.S. crypto markets work — will not get its procedural vote before the Senate scattered for a five-week recess: Democrats refused to supply the needed votes, holding out for stricter ethics language (aimed at the president's family crypto businesses, which disclosed over $1 billion of 2025 earnings), tighter illicit-finance rules, and limits on stablecoin yield, while a Gallego–Tillis compromise sent to the White House in late July still has no public answer. Thune says the bill is 'queued up first thing' when the Senate returns September 14, which puts the first vote at September 15–16 — and one obstacle just cleared: senators struck a bipartisan funding deal (89–4) that keeps the government open through December 11, so a shutdown fight won't eat the September floor time the bill needs. Prediction markets, which gave the bill a one-in-three chance of becoming 2026 law a week ago, now price roughly one-in-eight.",
    statusTone: "stalled",
    asOf: "AUG 6, 2026",
    sources: [
      { label: "CoinDesk — Senate won't vote on crypto Clarity Act before its summer break (Aug 6)", url: "https://www.coindesk.com/policy/2026/08/06/senate-won-t-vote-on-crypto-clarity-act-before-its-summer-break" },
      { label: "NBC News — Senate leaders reach a deal to avert a shutdown before the midterm elections", url: "https://www.nbcnews.com/politics/congress/senate-leaders-reach-deal-avert-shutdown-2026-elections-rcna590564" },
      { label: "CCN — CLARITY Act supporters and opponents as Polymarket odds fall to 13%", url: "https://www.ccn.com/news/crypto/clarity-act-supporters-opponents-senate-vote/" },
    ],
  },
  {
    label: "MACRO • AUG 7",
    title: "The Economy Blinked First: July Payrolls Fall, and the September Hike Is Suddenly Off the Table",
    detail: "One week after three Fed officials voted to raise rates immediately, the data moved against them. Friday's jobs report showed the U.S. lost 23,000 jobs in July — the first monthly decline in months, against an expected 83,000 gain — with May and June revised down by a combined 103,000 and wage growth at its coolest since May 2021. The details soften the headline (a largely seasonal 53,000 drop in government jobs drove the decline; private employers added 30,000, and unemployment actually ticked down to 4.1% as people left the workforce), but markets read the direction instantly: bets on a September rate increase, near two-in-three after July's hawkish 9–3 Fed hold, collapsed to an expected pause within hours of the release. The inflation side is cooperating too: with U.S.–Iran negotiations now running daily — Iran and Oman have agreed the coordinates of a protected shipping lane through the Strait of Hormuz — Brent crude has slid from $101 in late July to about $79, unwinding most of the energy shock the Fed blamed for keeping inflation elevated. For Bitcoin — which spent two weeks trading under the threat of tighter money — both turns point the same way: rate rises are coming off the table. The next tests are the August 12 inflation report and the Fed's Jackson Hole gathering later this month, where Chair Kevin Warsh ('no soft inflation target') gives his first keynote.",
    sources: [
      { label: "BLS — Employment Situation, July 2026 (Aug 7)", url: "https://www.bls.gov/news.release/archives/empsit_08072026.htm" },
      { label: "Cointelegraph — CME FedWatch flips from September hike to hold after payrolls miss (Aug 7)", url: "https://cointelegraph.com/markets/bitcoin-price-tags-653k-august-high-as-low-us-jobs-numbers-cool-fed-rate-bets" },
      { label: "The National — Oil slumps on potential US–Iran deal to open Strait of Hormuz (Aug 3)", url: "https://www.thenationalnews.com/business/energy/2026/08/03/oil-prices-slump-on-potential-us-iran-deal-to-open-strait-of-hormuz/" },
    ],
  },
  {
    label: "CORPORATE TREASURY • AUG 3",
    title: "Strategy Sells Bitcoin for a Second Time — Six Weeks Without a Buy, and the Sales Are Now Below Cost",
    detail: "Monday morning's weekly SEC filing confirmed the turn is real. Strategy sold another 1,638 Bitcoin for $104.7 million — about $63,957 per coin, well below its $75,419 average cost — during the week of July 27, its second-ever sale after early July's 3,588-coin disposal, cutting holdings to 842,138 BTC. The company hasn't bought Bitcoin since June 22, six straight weekly filings without a purchase, and is instead routing stock-sale proceeds (another $290.6 million this week) into a cash reserve that just reached $4 billion — enough to cover roughly two years of the $1.76 billion it owes annually in preferred dividends and interest without being forced into more coin sales. The tease-then-sell pattern stung: Michael Saylor posted 'Bitcoin Drive engaged' on Sunday, hinting a purchase was coming, and the filing showed a sale instead. The wider picture stands — smaller treasury companies like Satsuma, Sequans, Nakamoto, Empery and Smarter Web are liquidating or shrinking — which means the corporate buyers who helped support Bitcoin's price for five years are, for now, net sellers.",
    sources: [
      { label: "The Block — Strategy sells another 1,638 BTC for $105M, holdings fall to 842,138 (Aug 3)", url: "https://www.theblock.co/post/410414/michael-saylors-strategy-sells-another-1638-btc-for-105-million-reducing-total-holdings-to-842138-btc" },
      { label: "Cointelegraph — Strategy sells 1,638 Bitcoin to fund dividends and buybacks (Aug 3)", url: "https://cointelegraph.com/news/strategy-sells-bitcoin-dividend-strc" },
      { label: "SEC EDGAR — Strategy Form 8-K, July 6, 2026 (the first sale: 3,588 BTC for ~$216M)", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526295586/mstr-20260706.htm" },
    ],
  },
  {
    label: "SECURITY • AUG 4",
    title: "Bitcoin's Biggest Hardware-Wallet Breach: an Old Coldcard Flaw Lets Thieves Recreate Wallet Keys — $116 Million Gone",
    detail: "Hardware wallets — the small offline devices beginners are told keep Bitcoin safest — just had their worst week ever. Starting July 30, thieves drained roughly 1,816 Bitcoin (about $116 million) from more than 5,200 addresses across four waves, exploiting a flaw in Coldcard Mk3 devices made by Canada's Coinkite: a firmware bug dating to March 2021 routed wallet creation through a weak software random-number generator, cutting the effective strength of some wallets' secret keys from 128 bits to as little as 40 — weak enough for attackers to recreate those keys on their own computers, no physical access to anyone's device needed. The first sweep alone took 594 BTC in about 25 minutes, and blockchain analysts now rank the theft the third-largest crypto hack of 2026. Coinkite published a security advisory and patched firmware by August 1, and its guidance is blunt: if your wallet's seed (the master recovery phrase) was generated on an affected Mk3 — firmware versions 4.0.1 through 5.0.3 — move your coins to a freshly created wallet now, because updating firmware alone does not fix an already-weak seed. Users who added their own randomness (dice rolls) or a strong extra passphrase are protected. The takeaway isn't that self-custody failed — coins on unaffected devices and newer models were untouched — it's that a wallet is only as safe as the randomness that created it, and old devices need the same attention as old software.",
    sources: [
      { label: "Coinkite — Coldcard Mk3 seed-generation security advisory (Aug 1)", url: "https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/" },
      { label: "TRM Labs — Inside the $116M Coldcard hack, the largest hardware-wallet exploit of 2026 (Aug 4)", url: "https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack" },
      { label: "CoinDesk — Major bitcoin wallet flaw drains 594 BTC in 25-minute sweep (July 31)", url: "https://www.coindesk.com/tech/2026/07/31/major-bitcoin-wallet-flaw-drains-594-btc-in-25-minute-sweep" },
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
  { date: "Aug 7", title: "U.S. payrolls fall 23,000 in July — the first monthly decline in months, against an expected 83,000 gain — and traders abandon September rate-hike bets within hours; Bitcoin jumps to $65,340, its high for August, as the Fed is now expected to hold", source: "Cointelegraph", tag: "MACRO", important: true },
  { date: "Aug 6", title: "No CLARITY Act vote before recess: Thune confirms Democrats won't supply the votes for the crypto market-structure bill, teeing it up for a September 15–16 procedural vote when the Senate returns; prediction-market odds of 2026 passage fall to about 13%", source: "CoinDesk", tag: "REGULATION", important: true },
  { date: "Aug 6", title: "Spot Bitcoin ETFs log a fourth straight day of inflows (+$137.6M) for a roughly $750M week so far — more than triple July's entire net intake — led by BlackRock's IBIT with about $604M across the four days", source: "Farside Investors", tag: "ETFs", important: true },
  { date: "Aug 7", title: "BIP-110's mandatory signaling window opens at block 961,632 with under 1% of hashpower signaling — enforcing nodes (a low-single-digit minority) begin rejecting non-signaling blocks, so any split chain would start with almost no mining power behind it", source: "Bitcoin.com News", tag: "PROTOCOL" },
];
