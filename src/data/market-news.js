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
  asOf: "JUL 24, 2026",
  refreshedAt: "2026-07-27T00:38:00Z",
  title: "Money Returned to Bitcoin Funds for Seven Days — Until $100 Oil Revived Inflation Fears",
  status: "Streak Ended — Fed Decides This Week",
  statusTone: "active",
  narrative: "The recovery that followed June's cool inflation report ran seven straight trading days — July 14 through 22 — pulling just under $1 billion back into the U.S. spot Bitcoin funds (funds that hold real Bitcoin and trade on the stock market), their longest inflow run since late April, and lifting Bitcoin to $66,910 on July 21, its best price since mid-June. Then the macro weather turned. On July 23 the funds gave back $225.2 million, and on July 24 another $240.1 million — about $465 million out in two sessions — as oil pushed past $100 a barrel, new U.S. tariffs of 10%–12.5% on 60 trade partners took effect, and the 10-year Treasury yield (the interest rate the U.S. government pays to borrow for ten years, which sets the tone for borrowing costs everywhere) climbed to 4.69%, its highest since January 2025. Bitcoin faded to the $63,700–$64,500 area by the weekend. Perspective matters in both directions: even after the two bad days, the week still closed a hair net-positive (about $34 million) — but the entire seven-day run recovered only about 15% of what June's record outflows drained. The rebuild is real, and it is early.",
  whyItMatters: "Two weeks ago the question was whether the big institutional funds would return after the cool June inflation report — they did, for seven straight days, which is solid evidence the demand exists whenever the macro backdrop allows it. What ended the streak was not Bitcoin news but a fresh inflation scare: $100 oil, new tariffs and rising bond yields have markets pricing a bit more than a one-in-three chance the Fed raises interest rates at its July 28–29 meeting (roughly 35% on July 24, 39% by July 25, per CME's FedWatch tracker), up from about 12% two weeks earlier. That makes this Fed meeting the swing factor — a hold with calm language likely restarts the inflows, while a hike or a hawkish surprise would test whether the July recovery was a durable floor or a one-month bounce.",
  milestoneLabel: "Next checkpoint",
  milestone: "The Fed's rate-setting committee (the FOMC) meets July 28–29 under new Chair Kevin Warsh — markets lean toward rates staying at the current 3.50%–3.75%, with a bit more than a one-in-three chance of an increase. Watch whether fund flows flip positive in the first two sessions after Wednesday's statement, whether Bitcoin holds the $63,800–$64,200 support zone, and whether it can reclaim the July 21 high near $66,900. Two more dates on the calendar: roughly $5 billion of Bitcoin options bets expire July 31, clustered at $70,000–$72,000 — positions built when traders expected the crypto bill to pass this month — and Coinbase reports earnings July 30.",
  sources: [
    { label: "Yahoo Finance — Seven straight Bitcoin ETF inflow days recover just 15% of June's losses", url: "https://finance.yahoo.com/markets/crypto/articles/seven-straight-bitcoin-etf-inflow-072502968.html" },
    { label: "Crypto Briefing — Bitcoin ETFs post a second straight outflow day, $240.1M on July 24", url: "https://cryptobriefing.com/bitcoin-ethereum-etf-outflows-july-24/" },
    { label: "CoinDesk — A $5 billion cluster has formed in Bitcoin options at $70K–$72K (July 24)", url: "https://www.coindesk.com/markets/2026/07/24/a-usd5-billion-cluster-has-formed-in-bitcoin-options-it-tells-a-bullish-story" },
    { label: "Forbes — Markets price in rising odds of a July Fed rate hike (July 23)", url: "https://www.forbes.com/sites/simonmoore/2026/07/23/markets-see-chance-fed-hikes-next-week-at-july-meeting/" },
  ],
};

export const CURATED_MARKET_UPDATES = [
  {
    label: "REGULATION • JUL 23",
    title: "Washington's Crypto Timetable Slips: the CLARITY Act Misses Its Summer Window, and Stablecoin Rules Are Late Too",
    detail: "The showdown fizzled. Senate Majority Leader John Thune conceded on July 23 that the CLARITY Act — the bill that would finally set clear rules for how crypto markets work in the U.S. — is expected to miss its window before Congress leaves for its August 7 recess, saying he would like to at least start the floor process and 'see where the votes are.' It was genuinely close: Treasury Secretary Bessent called the bill 'at the 1-yard line' on July 21 (briefly lifting Bitcoin to about $67,000), and a compromise draft circulated July 22 that would keep the disputed ethics rule — which restricts officials from profiting on crypto — but only through 2029. Democrats stayed opposed, Republicans argued internally over stablecoin yield language, and the Senate's final two pre-recess weeks went to a government-funding stopgap instead. Separately, federal agencies missed the GENIUS Act's July 18 legal deadline to finish rules for payment stablecoins (dollar-pegged digital tokens), letting that law's start date slip to its January 2027 backstop. For Bitcoin, the two biggest pending U.S. regulatory catalysts just moved from 'this summer' to the Senate's roughly three-week September session — after which midterm politics take over.",
    statusTone: "stalled",
    asOf: "JUL 23, 2026",
    sources: [
      { label: "CoinDesk — Clarity Act expected to miss its window before Congress' summer break, leadership says (July 23)", url: "https://www.coindesk.com/policy/2026/07/23/clarity-act-expected-to-miss-its-window-before-congress-summer-break-leadership-says" },
      { label: "CoinDesk — New Clarity Act draft makes the ethics rule temporary (July 22)", url: "https://www.coindesk.com/policy/2026/07/22/new-clarity-act-emerges-that-s-a-start-on-the-final-draft-makes-ethics-rule-temporary" },
      { label: "Crypto Briefing — U.S. regulators miss the GENIUS Act stablecoin-rule deadline (July 18)", url: "https://cryptobriefing.com/us-regulators-miss-genius-act-stablecoin-deadline/" },
    ],
  },
  {
    label: "MACRO • JUL 25",
    title: "Oil Tops $100 as the Iran War Escalates and New Tariffs Take Effect — Then a Weekend Pause in the Strikes",
    detail: "The inflation scare is back. Brent crude crossed $100 a barrel this week for the first time in two months as the U.S.–Iran escalation neared its two-week mark — the Strait of Hormuz effectively closed to normal traffic, Iran-backed Houthi rebels hitting Saudi tankers in the Red Sea, and Tehran reportedly uninterested in a temporary truce that leaves control of the strait unresolved. The same week, new U.S. tariffs of 10%–12.5% on 60 trade partners took effect, adding a second inflation force. Bond markets repriced fast: the 10-year Treasury yield hit 4.69%, its highest since January 2025; the 30-year rate (the government's longest borrowing cost) held above 5%; and the odds of a rate increase at the July 28–29 Fed meeting climbed from roughly 12% two weeks ago to about 35% on July 24 and 39% by July 25 (CME FedWatch). Then, over the weekend, the U.S. and Iran paused strikes after 13 straight nights of bombing — the blockade remains, but it nudged Bitcoin up 0.7% to about $64,500 on Sunday, and it is the single likeliest thing to move markets again before Wednesday's Fed statement. Bitcoin, which trades like a risk asset in these windows, had given back a chunk of its July rally alongside the worst stock-market day in a month.",
    sources: [
      { label: "CNN — Escalation in Iran war nears two-week mark (July 24 live coverage)", url: "https://edition.cnn.com/2026/07/24/world/live-news/iran-war-trump" },
      { label: "CNBC — Brent back at $100 as new tariffs take effect (July 24)", url: "https://www.cnbc.com/2026/07/24/cnbc-daily-open-brent-100-trump-renews-tariffs.html" },
      { label: "BeInCrypto — U.S. and Iran pause strikes; crypto markets tick up (July 26)", url: "https://beincrypto.com/us-iran-pause-strikes-crypto-markets/" },
    ],
  },
  {
    label: "CORPORATE TREASURY • JUL 24",
    title: "Bitcoin's Biggest Corporate Buyer Made Its Biggest-Ever Sale — and Smaller Treasury Companies Are Heading for the Exits",
    detail: "Strategy's holdings read as unchanged at 843,775 BTC, but that flat number hides a turn. In early July the company made the largest Bitcoin sale in its history — 3,588 BTC for about $216 million, disclosed in its July 6 SEC filing — to pay the dividends it owes holders of its preferred shares. Since then it has raised $466.7 million and $263.5 million in back-to-back weeks by selling stock, bought no Bitcoin for two straight weeks (its longest pause in two years), and built a $3.225 billion cash reserve so it won't have to sell coins again; holdings sit at an average cost of $75,476, still well underwater with Bitcoin in the mid-$60Ks. The smaller players are in worse shape: shareholders of London-listed Satsuma voted more than 90% on July 20 to sell all 668 of its Bitcoin and delist entirely, while Sequans, Nakamoto, Empery Digital and Smarter Web have all been selling coins to repay debt or fund share buybacks as their stock prices collapse. Notably, MSTR shares rose on the no-buying news — investors now reward the cash discipline they once punished — but for Bitcoin's price, the steady corporate buying that helped support it for five years has, for now, gone quiet or reversed.",
    sources: [
      { label: "SEC EDGAR — Strategy Form 8-K, July 6, 2026 (3,588 BTC sold for ~$216M)", url: "https://www.sec.gov/Archives/edgar/data/1050446/000119312526295586/mstr-20260706.htm" },
      { label: "The Block — Satsuma shareholders approve Bitcoin treasury liquidation and London delisting (July 20)", url: "https://www.theblock.co/post/409155/satsuma-shareholders-approve-bitcoin-treasury-liquidation-london-delisting" },
      { label: "CoinDesk — Bitcoin treasury companies sell up, repay debt, pivot to AI as share prices collapse (July 24)", url: "https://www.coindesk.com/markets/2026/07/24/bitcoin-treasury-companies-sell-up-repay-debt-pivot-to-ai-as-share-prices-collapse" },
    ],
  },
  {
    label: "PROTOCOL • JUL 18",
    title: "Two Bitcoin 'Forks' Are Coming in August — and Why Your Bitcoin Isn't Going Anywhere",
    detail: "In August, two separate groups will try to change or copy Bitcoin — events known as forks. First, around August 7, supporters of a proposed rule change called BIP-110 begin a pressure campaign: their software will reject blocks from miners who don't signal support for the change. The catch is that miners representing less than 1% of the network's computing power are signaling, the biggest mining pools have refused, and Bitcoin's main software has not adopted the change — so the campaigners, not the network, would end up on a minority side-track. Second, around August 21, developer Paul Sztorc plans to launch 'eCash,' a separate copycat chain that hands every Bitcoin holder a free matching coin — and, controversially, plans to reassign Satoshi Nakamoto's untouched early coins, which critics call theft. Michael Saylor published a 110-point essay on July 18 arguing the first change threatens Bitcoin's neutral rules. What it means if you hold Bitcoin: your coins don't move or change in either event. BlackRock's ETF paperwork says it simply walks away from forked coins, and no major exchange has pledged support for either effort. The realistic risk is headlines and some choppy trading in August — not Bitcoin's rules actually changing.",
    sources: [
      { label: "TFTC — BIP-110 enters its mandatory signaling window with under 1% of hashrate support", url: "https://www.tftc.io/bip-110-mandatory-signaling-window-miner-support-bitcoin-consensus" },
      { label: "Bitcoin.com News — Saylor rejects BIP-110, warns the soft fork threatens Bitcoin's neutral rules (July 18)", url: "https://news.bitcoin.com/saylor-rejects-bip-110-warns-softfork-threatens-bitcoins-neutral-rules/" },
      { label: "Unchained — Paul Sztorc plans August hard fork 'eCash' with a plan to reassign Satoshi's coins", url: "https://unchainedcrypto.com/bitcoin-developer-paul-sztorc-plans-august-hard-fork-dubbed-ecash-with-a-plan-to-reassign-satoshi-nakamotos-coins/" },
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
  { date: "Jul 26", title: "Bitcoin ticks up to about $64,500 as the U.S. and Iran pause strikes after 13 nights of bombing; markets lean toward the Fed holding rates at 3.50%–3.75% on Wednesday, with hike odds near 39% after the week's oil and tariff shocks", source: "BeInCrypto", tag: "PRICE" },
  { date: "Jul 24", title: "Brent crude tops $100 for the first time in two months as new 10%–12.5% U.S. tariffs on 60 trade partners take effect; 10-year Treasury yield hits 4.69% — highest since January 2025 — and July Fed-hike odds jump from ~12% to ~35%", source: "CNBC", tag: "MACRO", important: true },
  { date: "Jul 24", title: "Spot Bitcoin ETFs post a second straight outflow day — $240.1M on July 24 after $225.2M on July 23 — ending the seven-day, just-under-$1B recovery streak; the week still closes barely positive at +$33.8M", source: "Crypto Briefing", tag: "ETFs", important: true },
  { date: "Jul 23", title: "Thune concedes the CLARITY Act is expected to miss its pre-recess window — he'd like to at least start the floor process and 'see where the votes are' — leaving the Senate's three-week September session as the next realistic shot", source: "CoinDesk", tag: "REGULATION", important: true },
];
