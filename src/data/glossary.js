// GLOSSARY — the dashboard's shared vocabulary.
//
// owner: structural / evergreen. `/refresh-plain-language` (the Editor) may PROPOSE
// additions in automations/refresh-plain-language/drafter-notes.md; only a drafter
// with source access (/refresh-market-news, /refresh-deep-analysis) appends them,
// and only with a `source` URL. Nothing here is dated — no prices, no vote counts,
// no "this week". If a definition would go stale, it does not belong in this file.
//
// A glossary entry is the LAST resort. The first resort is not needing the word:
// rule 11 in `npm run check:plain` flags house dialect precisely so the drafters
// rewrite rather than define. Cap: 80 entries (check:plain rule 16).
//
// Shape:
//   key           stable slug — <Term k="…"> call sites depend on it; never rename
//   label         display form, and the first autolink alias
//   aliases       other surface forms that appear in prose (include plurals)
//   caseSensitive true for acronyms, so "etf" in ordinary text is not linked
//   autolink      false when the surface form is an ordinary English word that
//                 would false-match ("short", "treasury", "print"). The term stays
//                 available to an explicit <Term k="…"> call site either way.
//   plain         ≤40 words, newcomer-level: what it is, then why it appears here
//   source        authoritative URL. Required for every entry except the legacy
//                 nineteen, which predate this file and are the dashboard's own
//                 explanatory voice rather than a citation of an outside body.
//   category      markets | macro | regulation | protocol | corporate | bitcoin

export const GLOSSARY = [
  // ── Legacy nineteen — moved here from the TERM_DEFINITIONS map in
  // src/components/shared.jsx. Twelve have explicit <Term k="…"> call sites and
  // three more resolve from DIP_EXPLAINER.drivers[].term, so no key here may be
  // renamed or dropped (check:plain rule 16 enforces that).
  // Text is unchanged except in `probability` and `brier`, where first-person
  // ("my estimated chance") was corrected to the "we/our" voice the rest of the
  // dashboard uses.
  {
    key: "hashrate",
    label: "hashrate",
    category: "bitcoin",
    plain: "Total computing power securing Bitcoin. More hashrate means harder to attack.",
  },
  {
    key: "halving",
    label: "halving",
    category: "bitcoin",
    plain: "Every ~4 years, new BTC issuance cuts in half. Programmed scarcity built into the protocol.",
  },
  {
    key: "difficulty",
    label: "difficulty",
    category: "bitcoin",
    autolink: false, // ordinary English word
    plain: "Mining auto-adjusts every 2,016 blocks to keep new blocks arriving ~every 10 minutes.",
  },
  {
    key: "dominance",
    label: "dominance",
    category: "markets",
    autolink: false,
    plain: "Bitcoin's share of the total crypto market value.",
  },
  {
    key: "lightning",
    label: "Lightning",
    aliases: ["Lightning Network"],
    category: "bitcoin",
    plain: "A faster, cheaper payment layer built on top of Bitcoin for small, near-instant transactions.",
  },
  {
    key: "etf",
    label: "ETF",
    aliases: ["ETFs", "spot ETF", "spot ETFs"],
    caseSensitive: true,
    category: "markets",
    plain: "Exchange-Traded Fund: a way to buy Bitcoin through your regular brokerage as a stock-like share. Lets pension funds and 401(k)s hold BTC without touching crypto directly.",
  },
  {
    key: "probability",
    label: "probability",
    category: "markets",
    autolink: false,
    plain: "Our estimated chance this happens, between 0 (impossible) and 1 (certain). 0.60 means we think it's modestly more likely than not.",
  },
  {
    key: "brier",
    label: "Brier score",
    aliases: ["Brier"],
    category: "markets",
    plain: "A score for how well-calibrated our past forecasts have been. Lower is better — 0 is perfect, 0.25 is coin-flip level, anything under 0.10 is strong.",
  },
  {
    key: "distribution",
    label: "distribution",
    category: "markets",
    autolink: false, // collides with the ordinary sense in policy prose
    plain: "When existing holders are selling down their position over time — the opposite of accumulation.",
  },
  {
    key: "liquidation",
    label: "liquidation",
    aliases: ["liquidations"],
    category: "markets",
    plain: "When a trader who borrowed money to bet on Bitcoin is automatically sold out because the price moved against them. Lots of these at once snowball into a fast drop.",
  },
  {
    key: "leverage",
    label: "leverage",
    category: "markets",
    autolink: false,
    plain: "Borrowing money to make a bigger bet than your own cash allows — it magnifies both gains and losses.",
  },
  {
    key: "deleveraging",
    label: "deleveraging",
    category: "markets",
    plain: "A wave of borrowed-money bets being unwound — traders selling to pay back loans. It pushes prices down fast, then burns itself out.",
  },
  {
    key: "drawdown",
    label: "drawdown",
    category: "markets",
    plain: "How far the price has fallen from its most recent peak, in percent. A 50% drawdown means it's half its high.",
  },
  {
    key: "sats",
    label: "sats",
    aliases: ["satoshis"],
    category: "bitcoin",
    plain: "Short for 'satoshis' — the smallest unit of Bitcoin. 100,000,000 sats = 1 BTC, the same way 100 cents = $1.",
  },
  {
    key: "selfcustody",
    label: "self-custody",
    category: "bitcoin",
    plain: "Holding your own private keys instead of leaving your Bitcoin on an exchange or with a custodian. Nobody can move it without you — but nobody can recover it for you either.",
  },
  {
    key: "coldstorage",
    label: "cold storage",
    category: "bitcoin",
    plain: "Keeping private keys on a device that's never connected to the internet (like a hardware wallet), so remote hackers can't reach them.",
  },
  {
    key: "m2",
    label: "M2",
    caseSensitive: true,
    category: "macro",
    plain: "A measure of the total money supply — cash, checking accounts, and easily-accessible savings. When M2 grows faster than the economy produces goods, each existing dollar's claim on those goods shrinks.",
  },
  {
    key: "dca",
    label: "DCA",
    aliases: ["dollar-cost averaging"],
    caseSensitive: true,
    category: "markets",
    plain: "Dollar-cost averaging: buying a fixed amount on a fixed schedule (e.g. $50 every week) instead of trying to time the market. Removes the decision of 'is now the right time?' entirely.",
  },
  {
    key: "seedphrase",
    label: "seed phrase",
    category: "bitcoin",
    plain: "A list of 12–24 words that can recreate your private keys on any wallet. Anyone who has it can spend your Bitcoin — anyone who loses it, permanently, can't.",
  },
  // ── Sourced entries. Every one below carries a `source` that was fetched and
  // confirmed to define the term (check:plain rule 16 requires it). Definitions are
  // translated to a newcomer's register but kept faithful to the cited authority.
  //
  // `autolink: false` marks a term whose surface form is ordinary English and would
  // false-match in general prose. It stays available to an explicit <Term k="…">.
  {
    key: "cloture",
    label: "cloture",
    aliases: ["cloture vote", "cloture motion", "invoke cloture", "cloture threshold"],
    category: "regulation",
    plain: "A Senate vote to cut off debate so a bill can finally get an up-or-down vote. It takes 60 senators, not just a majority. Crypto bills often stall right here.",
    source: "https://www.senate.gov/about/powers-procedures/filibusters-cloture.htm",
  },
  {
    key: "atmissuance",
    label: "at-the-market issuance",
    aliases: ["at-the-market offering", "at-the-market offerings", "at-the-market equity issuance", "ATM offering", "ATM offerings", "ATM issuance", "ATM program"],
    category: "corporate",
    // Bare "ATM" is deliberately NOT an alias — a newcomer reads it as a cash machine.
    plain: "A company selling new shares bit by bit straight into the open market at whatever the going price is. Bitcoin treasury companies use it to raise cash to buy more Bitcoin.",
    source: "https://www.govinfo.gov/content/pkg/CFR-2024-title17-vol3/xml/CFR-2024-title17-vol3-sec230-415.xml",
  },
  {
    key: "openinterest",
    label: "open interest",
    category: "markets",
    plain: "The number of futures bets still open — nobody has closed them out or delivered yet. When it climbs fast, one sharp price move can force many of them shut at once.",
    source: "https://www.cftc.gov/LearnAndProtect/EducationCenter/CFTCGlossary/index.htm",
  },
  {
    key: "perpetualfutures",
    label: "perpetual futures",
    aliases: ["perpetual future", "perpetual contract", "perpetual contracts", "perpetual swap", "perpetual swaps", "perpetuals"],
    category: "markets",
    plain: "A bet on Bitcoin's price that never expires. To keep it close to the real price, one side pays the other a small fee every few hours. U.S. exchanges may now list them.",
    source: "https://www.govinfo.gov/content/pkg/FR-2026-06-03/html/2026-11020.htm",
  },
  {
    key: "shortsqueeze",
    label: "short squeeze",
    aliases: ["short squeezes", "short-squeeze", "squeezed shorts", "short covering"],
    category: "markets",
    plain: "Traders who bet a price would fall must buy back to get out. If the price rises instead, their forced buying pushes it up even further — a fast, self-feeding rally.",
    source: "https://www.cftc.gov/LearnAndProtect/EducationCenter/CFTCGlossary/index.htm",
  },
  {
    key: "treasurybuyback",
    label: "Treasury buyback",
    aliases: ["Treasury buybacks", "long-bond buyback", "long-bond buybacks", "debt buyback", "cash management buyback"],
    category: "macro",
    // The tooltip actively corrects the wrong intuition. Verified against 31 U.S.C.
    // 3111: buybacks are funded from ordinary borrowing and cash on hand, and the
    // securities are retired — the Treasury refinancing itself, not the Fed expanding
    // its balance sheet. "buyback" also appears in this data in the corporate sense,
    // which is a separate entry.
    plain: "The U.S. government buying back some of its own older bonds early, paying with cash it already raised by selling new ones. It smooths the bond market. It is not printing money.",
    source: "https://www.treasurydirect.gov/help-center/faqs/buyback-faqs",
  },
  {
    key: "sharebuyback",
    label: "share buyback",
    aliases: ["share buybacks", "share repurchase", "share repurchases", "stock buyback", "stock buybacks", "repurchase program"],
    category: "corporate",
    plain: "A company spending its own cash to buy its own shares back off the market, leaving fewer shares for everyone else. Completely different from the government buying back its bonds.",
    source: "https://www.govinfo.gov/content/pkg/CFR-2024-title17-vol4/xml/CFR-2024-title17-vol4-sec240-10b-18.xml",
  },
  {
    key: "safeharbor",
    label: "safe harbor",
    aliases: ["safe harbour", "safe harbors", "safe-harbor", "safe harbor provision"],
    category: "regulation",
    plain: "A written rule that says: follow these exact steps and you are automatically treated as obeying the law. Crypto firms want one so they can operate without guessing what regulators will allow.",
    source: "https://www.govinfo.gov/content/pkg/CFR-2024-title17-vol3/xml/CFR-2024-title17-vol3-sec230-506.xml",
  },
  {
    key: "preemption",
    label: "federal preemption",
    aliases: ["preemption of state law", "pre-emption"],
    category: "regulation",
    autolink: false, // "preemption"/"preempt" appear in ordinary policy prose
    plain: "When a federal law overrides a state law that says something different. It matters when a new national crypto law would replace the patchwork of fifty separate state rules.",
    source: "https://www.law.cornell.edu/wex/preemption",
  },
  {
    key: "form8k",
    label: "Form 8-K",
    aliases: ["8-K", "8-Ks", "8-K filing", "8-K filings"],
    caseSensitive: true,
    category: "corporate",
    plain: "A short filing a public company must send regulators within about four business days when something big happens — a new chief executive, a bankruptcy, a huge purchase. Bitcoin buys get announced here.",
    source: "https://www.investor.gov/introduction-investing/investing-basics/glossary/form-8-k",
  },
  {
    key: "continuingresolution",
    label: "continuing resolution",
    aliases: ["continuing resolutions", "continuing appropriations", "stopgap funding bill"],
    category: "regulation",
    // Bare "CR" excluded from aliases — two letters, far too collision-prone.
    plain: "A temporary law that keeps the government running at the old funding levels when Congress has not agreed a new budget. Without one, agencies shut down and rule-writing stalls.",
    source: "https://www.govinfo.gov/content/pkg/GAOREPORTS-GAO-05-734SP/html/GAOREPORTS-GAO-05-734SP.htm",
  },
  {
    key: "cftc",
    label: "CFTC",
    aliases: ["Commodity Futures Trading Commission"],
    caseSensitive: true,
    category: "regulation",
    plain: "The U.S. agency that polices futures markets — deals to buy or sell something later at a price agreed now. It has become the main referee for Bitcoin trading products.",
    source: "https://www.cftc.gov/About/AboutTheCommission",
  },
  {
    key: "fomc",
    label: "FOMC",
    aliases: ["Federal Open Market Committee"],
    caseSensitive: true,
    category: "macro",
    plain: "The Federal Reserve committee that meets eight times a year to set U.S. interest rates; twelve of its members vote. Its decisions move the price of almost everything, Bitcoin included.",
    source: "https://www.federalreserve.gov/monetarypolicy/fomc.htm",
  },
  {
    key: "cpi",
    label: "CPI",
    // "core CPI" is deliberately NOT an alias: core CPI strips out food and energy,
    // which are the two examples this definition names. Linking it here would point a
    // reader at a definition of the opposite measure.
    aliases: ["Consumer Price Index", "CPI print", "headline CPI"],
    caseSensitive: true,
    category: "macro",
    plain: "A monthly government measure of how much prices changed for a fixed shopping list of everyday things — food, rent, fuel. Traders watch it because it shapes interest-rate decisions.",
    source: "https://www.govinfo.gov/content/pkg/CFR-2024-title31-vol2/xml/CFR-2024-title31-vol2-part356-appD.xml",
  },
  {
    key: "dotplot",
    label: "dot plot",
    aliases: ["dot-plot", "Summary of Economic Projections"],
    category: "macro",
    // 19 participants submit dots; only 12 vote; the dots are anonymous. The wording
    // avoids implying the dots are votes.
    plain: "A chart the Federal Reserve publishes four times a year. Each dot is one official's own forecast for where interest rates should go. Markets read it to guess future rate cuts.",
    source: "https://www.federalreserve.gov/econres/feds/anchored-to-the-dot-plot-central-bank-projections-and-interest-rate-expectations.htm",
  },
  {
    key: "costbasis",
    label: "cost basis",
    aliases: ["cost-basis", "tax basis", "adjusted basis"],
    category: "markets",
    autolink: false, // "basis" alone is ordinary English and a different market term
    plain: "What you originally paid for something you own. Tax on a sale is worked out from the gap between this and the sale price. It decides what selling Bitcoin costs you.",
    source: "https://www.irs.gov/taxtopics/tc703",
  },
  {
    key: "preferredstock",
    label: "preferred stock",
    aliases: ["preferred shares", "preferred equity", "preference shares"],
    category: "corporate",
    // Bare "preferred"/"preferreds" excluded — ordinary adjective.
    plain: "A share that gets its dividend before ordinary shares, and gets paid first if the company folds, but usually carries no vote. Companies sell it to raise cash without handing over votes.",
    source: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks",
  },
  {
    key: "hardfork",
    label: "hard fork",
    aliases: ["hard forks", "hardfork", "hard-fork"],
    category: "protocol",
    plain: "A rule change so big that computers running the old software reject the new blocks. Everyone has to upgrade, or the network splits permanently into two separate coins.",
    source: "https://github.com/bitcoin/bips/blob/master/bip-0123.mediawiki",
  },
  {
    key: "softfork",
    label: "soft fork",
    aliases: ["soft forks", "softfork", "soft-fork"],
    category: "protocol",
    plain: "A rule change that only tightens the rules, so computers still running the old software keep accepting the new blocks. Bitcoin upgrades this way to avoid splitting the network.",
    source: "https://github.com/bitcoin/bips/blob/master/bip-0123.mediawiki",
  },
  {
    key: "reorg",
    label: "reorg",
    aliases: ["reorgs", "chain reorg", "chain reorganisation", "chain reorganization", "deep reorg"],
    category: "protocol",
    // Bare "reorganization" excluded — corporate restructuring sense.
    plain: "When the network finds a longer chain of blocks and switches to it, throwing away some recent ones. Payments that already looked confirmed can briefly go back to unconfirmed.",
    source: "https://developer.bitcoin.org/devguide/block_chain.html",
  },
  {
    key: "replayattack",
    label: "replay attack",
    aliases: ["replay attacks", "replay protection", "anti-replay", "replay losses"],
    category: "protocol",
    plain: "After a coin splits in two, the same payment can be copied onto both chains, so you spend twice by accident. Replay protection stops a transaction working on the other chain.",
    source: "https://github.com/bitcoin/bips/blob/master/bip-0115.mediawiki",
  },
  {
    key: "indexprovider",
    label: "index provider",
    aliases: ["index providers"],
    category: "markets",
    plain: "A company that builds and runs stock-market lists, like the S&P 500. Funds that copy a list must buy whatever it adds and sell whatever it drops, so its choices move real money.",
    source: "https://www.govinfo.gov/content/pkg/FR-2022-06-22/html/2022-13307.htm",
  },
  {
    key: "indexdeletion",
    label: "index deletion",
    aliases: ["index deletions", "index removal", "index exclusion", "index review", "index reconstitution"],
    category: "markets",
    plain: "When an index company drops a stock from its list. Every fund copying that list then has to sell it, no matter what the underlying business is actually worth.",
    source: "https://www.govinfo.gov/content/pkg/FR-2022-06-22/html/2022-13307.htm",
  },
  {
    key: "jacksonhole",
    label: "Jackson Hole",
    aliases: ["Jackson Hole symposium", "Jackson Hole Economic Symposium", "Jackson Hole Economic Policy Symposium"],
    category: "macro",
    plain: "An economic policy conference held each August in Jackson Hole, Wyoming, run by the Kansas City Federal Reserve. The Fed chair's speech there often signals where interest rates are heading.",
    source: "https://www.federalreserve.gov/newsevents/speech/powell20220826a.htm",
  },
  {
    key: "msci",
    label: "MSCI",
    caseSensitive: true,
    category: "markets",
    plain: "A company that builds and sells stock-market indexes and investment data. Many funds copy its lists automatically, so when MSCI adds or drops a company, real money has to follow.",
    source: "https://www.msci.com/who-we-are/about-us",
  },
  {
    key: "sidechain",
    label: "sidechain",
    aliases: ["sidechains", "side chain", "side chains"],
    category: "protocol",
    plain: "A separate blockchain that runs alongside Bitcoin with its own rules. Users lock real Bitcoin and get matching tokens on the side network, trusting its operators to hold the coins and give them back.",
    source: "https://docs.liquid.net/docs/technical-overview",
  },
];

export const GLOSSARY_BY_KEY = Object.fromEntries(GLOSSARY.map((g) => [g.key, g]));
