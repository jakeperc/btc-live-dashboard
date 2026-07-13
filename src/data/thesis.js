// Thesis tab data — static content, never AI-refreshed.
// Saifedean Ammous "Bitcoin Standard" framing: hard-money thesis, 5,000 years of
// monetary history, properties matrix, time-preference scrolly, four-move thesis flow.
//
// NOTE: silentTaxDataAtProgress() (in BitcoinDashboard.jsx) imports SILENT_TAX_M2_DATA
// from this module — keep the array shape (year/m2/pp) intact if editing.

// Hero stat cards — the problem at a glance.
export const THESIS_METRICS = [
  { value: "21M", label: "Hard cap", sub: "Consensus-enforced. Never changed in 17 years." },
  { value: "−88%", label: "USD purchasing power", sub: "Lost since 1971 — the year the dollar's gold anchor was cut." },
  { value: "0.83%", label: "BTC annual issuance", sub: "Halving every 4 years. Approaching zero." },
  { value: "0", label: "Fiat currencies in history", sub: "That have indefinitely held purchasing power." },
];

// Hero epigraph — Satoshi's own framing, not an adjective in sight.
// Quote: P2P Foundation forum post, Feb 2009. Genesis block: the headline permanently
// embedded in Bitcoin's first block (Jan 3, 2009), both widely documented primary sources.
export const THESIS_EPIGRAPH = {
  quote: "The root problem with conventional currency is all the trust that's required to make it work.",
  attribution: "Satoshi Nakamoto, P2P Foundation, February 2009",
  genesis: "“The Times 03/Jan/2009 Chancellor on brink of second bailout for banks” — the newspaper headline permanently embedded in Bitcoin's first block.",
};

// "What is money?" — the advance organizer. Everything below (Silent Tax, the
// properties matrix, the myths) slots into this four-part scorecard.
export const MONEY_INTRO = {
  eyebrow: "First, a 60-second detour",
  headline: "Money is a battery for your work.",
  body: [
    "You do an hour of work today. You don't want what it's worth right now — you want to spend it next year, or in thirty years. Money is the thing that carries that value across time, and across distance, so someone in another city or another decade can still honor it.",
    "A good battery doesn't leak. A battery that quietly loses 2–7% of its charge every year — while looking exactly the same — is a bad battery. That's the whole case on this page, before a single Bitcoin fact enters it.",
  ],
};

export const MONEY_SCORECARD = [
  { key: "scarce",     title: "Scarce",     question: "Can someone quietly make more of it?", body: "If the supply can be expanded by whoever holds the printing press, everyone else's saved work is worth a little less the moment they do it." },
  { key: "portable",   title: "Portable",   question: "Can it move when you do?",              body: "Money that can't cross a border, or can't move at the speed of the internet, fails the people who need it most — migrants, refugees, anyone outside the system that issued it." },
  { key: "divisible",  title: "Divisible",  question: "Does it work at any size?",              body: "Good money works for a cup of coffee and a house. If you can't split it small enough, people default to something else for everyday spending — and the money stops being used." },
  { key: "verifiable", title: "Verifiable", question: "Can you check it's real yourself?",       body: "If confirming a payment is real requires trusting a bank, a government, or an expert with a loupe, you don't actually hold the money — you hold their promise about it." },
];

// "The Problem" — the cost of soft money. The pain Bitcoin actually solves.
export const SOFT_MONEY_COSTS = [
  {
    label: "The Silent Tax",
    title: "Holding cash guarantees a loss.",
    text: "Every dollar you've held since 1971 has lost roughly 88% of its purchasing power. You did nothing wrong — the rules of the money changed beneath you.",
    stat: "−2% to −7% / year",
  },
  {
    label: "First In Line",
    title: "New money isn't evenly distributed.",
    text: "When new money is created, it reaches asset owners and banks first — wage earners last, once prices have already risen. Economists call this the Cantillon Effect. Saifedean Ammous argues it isn't a side effect of easy money; it's the mathematical structure of how easy money has to work.",
    stat: "Proximity = wealth",
  },
  {
    label: "The Savings Problem",
    title: "Soft money forces everyone into the casino.",
    text: "When holding cash guarantees you a loss, the only rational response is to take on risk you didn't want. Easy money quietly converts a society of savers into a society of speculators.",
    stat: "Risk becomes mandatory",
  },
];

// "The Silent Tax" — money printing + purchasing power decay since Nixon ended gold convertibility (1971).
// M2 figures (Federal Reserve H.6 release, year-end, $T — FRED M2SL).
// Purchasing power indexed to $1 in 1971 (BLS CPI-U, annual avg).
// Sticky offset for the pinned scrolly stage — matches the dashboard page header height.
export const SILENT_TAX_PIN_TOP = 79;
export const SILENT_TAX_M2_DATA = [
  { year: 1971, m2: 0.69, pp: 1.00 },
  { year: 1975, m2: 1.02, pp: 0.72 },
  { year: 1980, m2: 1.60, pp: 0.47 },
  { year: 1985, m2: 2.50, pp: 0.36 },
  { year: 1990, m2: 3.30, pp: 0.29 },
  { year: 1995, m2: 3.71, pp: 0.25 },
  { year: 2000, m2: 4.95, pp: 0.22 },
  { year: 2005, m2: 6.50, pp: 0.20 },
  { year: 2008, m2: 8.20, pp: 0.18 },
  { year: 2010, m2: 8.80, pp: 0.17 },
  { year: 2015, m2: 12.30, pp: 0.16 },
  { year: 2019, m2: 15.30, pp: 0.16 },
  { year: 2020, m2: 19.10, pp: 0.16 },
  { year: 2021, m2: 21.50, pp: 0.14 },
  { year: 2023, m2: 20.80, pp: 0.13 },
  { year: 2025, m2: 21.90, pp: 0.13 },
];

// Seven chapters for the pinned scrollytelling walk through 54 years of dollar decay.
// Color escalates from neutral white → amber → orange → red as purchasing power collapses.
export const SILENT_TAX_CHAPTERS = [
  { era: "1971",  ppTarget: 1.00, eyebrow: "Aug 1971",       headline: "Nixon closes the gold window.",                    body: "$1 bought a McDonald's hamburger, fries, and Coke. Then the U.S. unilaterally ends dollar-to-gold convertibility — and the experiment begins.", color: "#ffffff" },
  { era: "1970s", ppTarget: 0.47, eyebrow: "1971 – 1980",     headline: "Stagflation. Oil shocks. −52% in a decade.",       body: "Two oil shocks. Wage-price spirals. Money supply rises faster than output. Anyone holding cash savings pays the bill — silently, paycheck by paycheck.", color: "#fbbf24" },
  { era: "1980s", ppTarget: 0.29, eyebrow: "1980 – 1990",     headline: "The 1980s: bailouts become routine. −38%.",        body: "Hundreds of savings-and-loan institutions collapse. Cleaning up the wreckage costs money nobody budgeted for, so new money gets created to cover it. This becomes the template: emergencies get paid for by quietly diluting everyone who's holding cash.", color: "#fbbf24" },
  { era: "2008",  ppTarget: 0.18, eyebrow: "Oct 2008",        headline: "GFC. QE1 begins. $1.3T in 18 months.",             body: "The Fed crosses a line that hadn't been crossed before. Quantitative easing becomes a permanent tool, not an emergency one — and it shows in every paycheck since.", color: "#fb7d3c" },
  { era: "2020",  ppTarget: 0.14, eyebrow: "Mar 2020 – 2022", headline: "Covid. 40% of every USD ever — in 24 months.",     body: "The fastest M2 expansion in U.S. history. By the time the chart updated, the dollar you held had already lost ground you cannot recover.", color: "#fb7d3c" },
  { era: "Today", ppTarget: 0.13, eyebrow: "2025",            headline: "Your dollar is now worth 13 cents.",               body: "Same currency. Same paychecks. Denominated in a unit that has quietly shed 87% of its purchasing power. Nobody took it in one moment — it leaked out a little every year, exactly the way a currency without a hard cap is designed to.", color: "#ef4444" },
  { era: "Coda",  ppTarget: null, eyebrow: "Meanwhile…",       headline: "The supply you can't print.",                       body: "Bitcoin's issuance halves every four years toward zero: 1.7% → 0.83% → 0.41% → 0.20%. Nobody, ever, on any timeline, can decide to print more. That is the difference.", color: "#f7931a", isCoda: true },
];

// Key crisis-response money-printing events the chart annotates.
// Short labels keep the annotation in-chart even when the line sits at an edge.
export const SILENT_TAX_EVENTS = [
  { year: 1971, label: "Nixon ends gold",  anchor: "start" },
  { year: 2008, label: "GFC · QE1 begins", anchor: "end"   },
  { year: 2020, label: "COVID · $5T QE",   anchor: "end"   },
];

// Coda chart: Bitcoin's halving issuance curve, asymptotic to zero.
export const BTC_ISSUANCE_DATA = [
  { halving: "Pre-2024", rate: 1.7 },
  { halving: "2024",     rate: 0.83 },
  { halving: "2028",     rate: 0.41 },
  { halving: "2032",     rate: 0.20 },
  { halving: "2036",     rate: 0.10 },
  { halving: "2040",     rate: 0.05 },
  { halving: "2044",     rate: 0.025 },
];

// ─── MOBILE-ONLY Silent Tax copy (the "stepped" rebuild) ───────────────────
// Desktop keeps SILENT_TAX_CHAPTERS above; mobile uses a concrete-first,
// plain-language walk with one predict-then-reveal interaction. Original
// wording snapshot: src/data/copy-originals/silent-tax.original.md.

// The single generative moment: guess-before-reveal anchors the end state ($0.13).
export const SILENT_TAX_GUESS = {
  eyebrow: "The Silent Tax",
  anchor: "You save a $1 bill in 1971 and forget about it.",
  setup: "Back then, that dollar buys a burger, fries, and a Coke. You leave it in a drawer for 54 years. It's still a $1 bill — but is it still worth a dollar?",
  prompt: "Before you scroll: what does that same $1 buy today?",
  options: [
    { label: "About 90¢", value: 0.9 },
    { label: "About 50¢", value: 0.5 },
    { label: "About 13¢", value: 0.13, correct: true },
  ],
  revealValue: "13¢",
  revealCorrect: "Right — and almost no one guesses that low. The loss is invisible while it happens, which is exactly why it works.",
  revealWrong: "Not even close — and that's the point. Almost everyone guesses too high, because you never feel it happen.",
  revealLead: "Your dollar never changed. The rules of the money did. Here's where the other 87¢ went.",
};

// The walk: each step shows the 1971 dollar's purchasing power dropping.
// `pp` is what $1 from 1971 buys at that point; the number counts down from the
// previous step's value when the card scrolls into view.
export const SILENT_TAX_STEPS = [
  {
    eyebrow: "1971 – 1980",
    color: "#fbbf24",
    pp: 0.47,
    headline: "First, the 1970s eat half of it.",
    body: "Oil shocks and rising prices. The government makes new dollars faster than the country makes new things to buy — so each dollar buys less. In one decade, your dollar is cut in half.",
  },
  {
    eyebrow: "Oct 2008",
    color: "#fb7d3c",
    pp: 0.18,
    headline: "2008: the money printer becomes permanent.",
    body: "To rescue the banks, the Fed prints on a scale it never had before — and never really stops. What started as an emergency tool quietly becomes the normal one.",
  },
  {
    eyebrow: "2020 – 2022",
    color: "#fb7d3c",
    pp: 0.14,
    headline: "2020: 40% of all the dollars that ever existed — in two years.",
    body: "The fastest burst of money-printing in U.S. history. By the time it shows up at the grocery store, the dollar in your drawer has already lost ground it can't get back.",
  },
  {
    eyebrow: "Today",
    color: "#ef4444",
    pp: 0.13,
    headline: "Today, your 1971 dollar is worth 13 cents.",
    body: "Same bill. Same drawer. It now buys what 13 cents bought in 1971. Nobody reached into your pocket — the measuring stick just quietly shrank underneath you.",
  },
];

// The payoff / open loop into the rest of the thesis.
export const SILENT_TAX_CODA = {
  eyebrow: "Meanwhile",
  color: "#f7931a",
  headline: "Now — the money nobody can print.",
  body: "Bitcoin's new supply is fixed in code and cut in half every four years: about 0.83% a year today, heading toward zero. No government, bank, or emergency can ever make more.",
  statLabel: "Bitcoin's annual new supply",
  statValue: "0.83%",
  bridge: "So the dollar melts, and Bitcoin can't. The rest of this page is about why that one difference changes everything.",
};

// Real BLS CPI-U annual averages (U.S. city average, all items), indexed to $1 in 1971.
// Computed from FRED series CPIAUCNS (Oct 2025 has a one-month data gap in the source
// series; interpolated from Sep/Nov 2025). NOT interpolated from the 16-point
// SILENT_TAX_M2_DATA above — a separate, independently-sourced table for the
// birth-year widget. The two intentionally land close: 1971→2025 here is 0.1257,
// vs. SILENT_TAX_M2_DATA's 0.13 endpoint (different methodology, same conclusion).
export const PP_BY_YEAR = [
  { year: 1971, pp: 1.0000 }, { year: 1972, pp: 0.9683 }, { year: 1973, pp: 0.9120 },
  { year: 1974, pp: 0.8212 }, { year: 1975, pp: 0.7524 }, { year: 1976, pp: 0.7115 },
  { year: 1977, pp: 0.6681 }, { year: 1978, pp: 0.6207 }, { year: 1979, pp: 0.5579 },
  { year: 1980, pp: 0.4914 }, { year: 1981, pp: 0.4453 }, { year: 1982, pp: 0.4196 },
  { year: 1983, pp: 0.4065 }, { year: 1984, pp: 0.3898 }, { year: 1985, pp: 0.3764 },
  { year: 1986, pp: 0.3694 }, { year: 1987, pp: 0.3564 }, { year: 1988, pp: 0.3424 },
  { year: 1989, pp: 0.3266 }, { year: 1990, pp: 0.3099 }, { year: 1991, pp: 0.2973 },
  { year: 1992, pp: 0.2886 }, { year: 1993, pp: 0.2803 }, { year: 1994, pp: 0.2732 },
  { year: 1995, pp: 0.2657 }, { year: 1996, pp: 0.2582 }, { year: 1997, pp: 0.2523 },
  { year: 1998, pp: 0.2484 }, { year: 1999, pp: 0.2431 }, { year: 2000, pp: 0.2351 },
  { year: 2001, pp: 0.2287 }, { year: 2002, pp: 0.2251 }, { year: 2003, pp: 0.2201 },
  { year: 2004, pp: 0.2144 }, { year: 2005, pp: 0.2073 }, { year: 2006, pp: 0.2009 },
  { year: 2007, pp: 0.1953 }, { year: 2008, pp: 0.1881 }, { year: 2009, pp: 0.1887 },
  { year: 2010, pp: 0.1857 }, { year: 2011, pp: 0.1800 }, { year: 2012, pp: 0.1764 },
  { year: 2013, pp: 0.1738 }, { year: 2014, pp: 0.1710 }, { year: 2015, pp: 0.1708 },
  { year: 2016, pp: 0.1687 }, { year: 2017, pp: 0.1652 }, { year: 2018, pp: 0.1613 },
  { year: 2019, pp: 0.1584 }, { year: 2020, pp: 0.1565 }, { year: 2021, pp: 0.1494 },
  { year: 2022, pp: 0.1384 }, { year: 2023, pp: 0.1329 }, { year: 2024, pp: 0.1291 },
  { year: 2025, pp: 0.1257 },
];

// Honesty caveat placed near the M2 chart — M2 growth and consumer prices diverge
// over any window shorter than "decades." Preempts the most common informed-reader
// critique of the debasement argument.
export const SILENT_TAX_CAVEAT =
  "Honest caveat: money-supply growth is not next month's grocery bill. M2 and consumer prices can diverge for months or even years at a time — the claim on this page is about decades, not quarters.";

// Non-US cases — routes the argument through identity-neutral ground instead of
// domestic politics. Argentina: INDEC, 2023 annual CPI. Turkey: FRED series
// CCUSMA02TRA618N, annual average USD/TRY, 2019 (5.68) vs 2024 (32.83).
export const SILENT_TAX_INTL = {
  eyebrow: "Not just a U.S. story",
  headline: "Elsewhere, the leak is a firehose.",
  cases: [
    {
      country: "Argentina",
      stat: "211% inflation in 2023",
      body: "A saver who kept pesos under a mattress lost more than two-thirds of their purchasing power in a single year — officially, not in a crisis year everyone agrees was unusual.",
    },
    {
      country: "Turkey",
      stat: "Lira lost ~83% of its dollar value, 2019–2024",
      body: "Same currency, same paychecks, same story as 1971–2025 America — just compressed into five years instead of fifty.",
    },
  ],
  bridge: "For most of the world, 'just hold cash' was never safe advice. The U.S. dollar has simply leaked slowly enough that most people never noticed the mechanism.",
};

// "5,000 years of monetary history" — Saifedean's central historical argument.
export const MONEY_HISTORY = [
  {
    era: "5000 BC",
    name: "Shells & beads",
    note: "Worked locally — until easier production destroyed their scarcity.",
  },
  {
    era: "1500 BC",
    name: "Cattle & salt",
    note: "Durable and divisible enough — but couldn't travel or store wealth long.",
  },
  {
    era: "700 BC",
    name: "Silver coins",
    note: "Practical for trade. But silver supply expanded faster than gold's.",
  },
  {
    era: "0–1900",
    name: "Gold",
    note: "Best stock-to-flow ratio for 5,000 years. Won every monetary competition.",
  },
  {
    era: "1900s",
    name: "Paper claims on gold",
    note: "Efficient. Until governments seized the gold and printed the paper.",
  },
  {
    era: "1971",
    name: "Pure fiat",
    note: "Nixon ended gold convertibility. The 'easy money experiment' began.",
  },
  {
    era: "2009",
    name: "Bitcoin",
    note: "Digital scarcity. Verifiable. No custodian. No issuer. No expiration.",
    isBitcoin: true,
  },
];

// The missing rung: "why can't someone just copy it?" — the question every
// beginner has and no macro chart answers. Each step states where its own
// analogy breaks, per structure-mapping research on how novices misread analogies.
export const DIGITAL_SCARCITY = {
  eyebrow: "The missing rung",
  headline: "Why can't someone just copy it?",
  steps: [
    {
      title: "Start with a village notebook.",
      body: "Imagine a notebook that records who owes whom what. One person keeps it. That's convenient — until the keeper decides to add a page in their own favor.",
      breaks: "Breaks when: the one keeper can cheat, and everyone else has to trust them not to.",
    },
    {
      title: "Now everyone keeps a copy.",
      body: "Thousands of strangers around the world each hold an identical copy of Bitcoin's notebook. Every ten minutes, they compare notes — any page that doesn't match what everyone else has gets thrown out.",
      breaks: "Breaks when: two copies disagree. Bitcoin's answer is simple — whichever version the most computing power is built on top of wins, and everyone converges on it within about an hour.",
    },
    {
      title: "Adding a page is a lottery, not a puzzle.",
      body: "Miners aren't 'solving complex math problems' — that's a common misconception. They're making trillions of random guesses per second, competing for the right to add the next page. It's a lottery where buying more tickets (electricity + hardware) improves your odds but never guarantees a win.",
      breaks: null,
    },
    {
      title: "Your keys sign. They don't unlock.",
      body: "A password proves you know a secret, and can be reset if you forget it. A private key does something different: it produces a signature proving an instruction came from you, without ever revealing the key itself. Nothing is 'stored' behind it — which is also why there's no customer service line to call if you lose it.",
      breaks: null,
    },
  ],
};

export const SUPPLY_CAP_GUESS = {
  prompt: "Guess: what share of Americans know Bitcoin's supply is capped at 21 million?",
  options: [
    { label: "About 60%", value: 60 },
    { label: "About 25%", value: 25 },
    { label: "About 6%", value: 6, correct: true },
  ],
  revealValue: "~6%",
  revealCorrect: "Right — you're already ahead of the vast majority of people who've heard of Bitcoin but never learned this.",
  revealWrong: "Not close — and that's normal. The single most important fact about Bitcoin is also the least known one.",
  revealLead: "A hard cap that almost nobody has heard of is still a hard cap. It doesn't need consensus to be true — just code every node already runs.",
};

// Stock-to-flow comparison — Ammous's preferred measure of monetary hardness.
export const HARDNESS_DATA = [
  { name: "USD M2",                  rate: 6.5,  tone: "fiat",  note: "Average M2 expansion. Fiat without limit." },
  { name: "Gold",                    rate: 1.5,  tone: "gold",  note: "Annual mining vs. above-ground stock." },
  { name: "BTC (pre-2024 halving)",  rate: 1.7,  tone: "muted", note: "Bitcoin's prior issuance era." },
  { name: "BTC (2024–2028)",         rate: 0.83, tone: "btc",   note: "Hardest money ever. Right now." },
  { name: "BTC (2028–2032)",         rate: 0.41, tone: "btc",   note: "Next halving cuts issuance in half again." },
  { name: "BTC (2032–2036)",         rate: 0.20, tone: "btc",   note: "Asymptotically approaches zero by 2140." },
];

// Properties matrix — Bitcoin vs. Gold vs. USD across what matters in money.
export const PROPERTIES_MATRIX = [
  {
    property: "Scarcity",
    desc: "Resistant to dilution",
    gold:    { rating: "good",  note: "~1.5%/yr supply growth" },
    usd:     { rating: "bad",   note: "~6.5%/yr M2 growth" },
    bitcoin: { rating: "best",  note: "21M hard cap; <1% issuance" },
  },
  {
    property: "Portability",
    desc: "Moves across distance",
    gold:    { rating: "bad",   note: "Heavy, slow, customs-checked" },
    usd:     { rating: "okay",  note: "Permissioned digital rails" },
    bitcoin: { rating: "best",  note: "12 words. Any value. Anywhere." },
  },
  {
    property: "Divisibility",
    desc: "Works at any scale",
    gold:    { rating: "bad",   note: "Smelting is impractical" },
    usd:     { rating: "okay",  note: "Two decimal places" },
    bitcoin: { rating: "best",  note: "100M sats per coin" },
  },
  {
    property: "Verifiability",
    desc: "Anyone can confirm it's real",
    gold:    { rating: "okay",  note: "Requires assay / expert" },
    usd:     { rating: "okay",  note: "Trust in the issuer" },
    bitcoin: { rating: "best",  note: "Any node verifies the full ledger" },
  },
  {
    property: "Seizure resistance",
    desc: "Hard to confiscate or freeze",
    gold:    { rating: "bad",   note: "Confiscated by FDR (EO 6102, 1933)" },
    usd:     { rating: "bad",   note: "Accounts freezable instantly" },
    bitcoin: { rating: "best",  note: "Self-custodied keys = sovereign" },
  },
  {
    property: "Programmability",
    desc: "Can be wired into software",
    gold:    { rating: "bad",   note: "No native digital form" },
    usd:     { rating: "okay",  note: "Permissioned APIs only" },
    bitcoin: { rating: "best",  note: "Open settlement protocol" },
  },
];

// Myths as refutation texts — state the myth, flag it explicitly wrong, then explain
// the mechanism. This format outperforms affirmative-only teaching and does not
// backfire (the "repeating a myth reinforces it" fear has failed replication).
// Conceding what was once true is a feature, not a weakness — it signals calibration.
export const MYTHS = [
  {
    myth: "It's mostly used by criminals.",
    refutation: "Wrong today. On-chain illicit activity is well under 1% of total transaction volume, and shrinking — most of what remains is stablecoin fraud, not Bitcoin.",
    mechanism: "Every Bitcoin transaction is permanently on a public ledger anyone can audit. It's closer to the least private way to move money than the most.",
    concession: "This was truer in Bitcoin's earliest years, when it was genuinely a niche instrument on dark markets like Silk Road.",
    source: "Chainalysis Crypto Crime Reports",
  },
  {
    myth: "It's backed by nothing.",
    refutation: "It's backed the same way the dollar is: by what people are willing to trade for it, plus properties that make it hard to debase.",
    mechanism: "Nothing 'backs' the dollar either — no gold, no commodity redemption since 1971. Both currencies run on collective belief; Bitcoin's difference is that the supply schedule can't be changed by that belief.",
    concession: null,
  },
  {
    myth: "I've missed it — I can't afford a whole one.",
    refutation: "Nobody buys a whole one. You're not buying 0.0004 of anything — you're buying 40,000 sats, the same way pennies buy a fraction of a dollar.",
    mechanism: "Every bitcoin splits into 100,000,000 sats. Pricing yourself out by comparing to '1 BTC' is unit bias — the same reason people once felt richer holding 100 of a cheap coin than a sliver of an expensive one.",
    concession: null,
  },
  {
    myth: "Governments will just ban it.",
    refutation: "They can make it inconvenient. They can't turn it off — there's no server to raid and no company to subpoena.",
    mechanism: "China has restricted Bitcoin trading or mining at least three times since 2013. Each time, the network kept producing a block every ~10 minutes without interruption; miners and users simply relocated.",
    concession: "A coordinated ban across every major economy at once would still matter — see the falsifiability lens.",
  },
  {
    myth: "It wastes energy.",
    refutation: "It spends energy on purpose — that spend is what makes the ledger expensive to rewrite. The question is the energy mix, not whether energy is used.",
    mechanism: "Multiple industry surveys put Bitcoin mining's sustainable energy share (hydro, wind, solar, nuclear, and stranded/flared gas that would otherwise be wasted) at roughly half or more of total mining power — and miners are financially rewarded for seeking out the cheapest power, which is disproportionately surplus or renewable.",
    concession: "Estimates vary by methodology and it's a genuinely contested figure — this isn't settled the way the crime or ban myths are.",
  },
  {
    myth: "It hedges inflation, so it should always go up when prices do.",
    isConcession: true,
    refutation: "Not on short horizons — this is the one place skeptics have a real point. In the first half of 2022, U.S. CPI kept accelerating (7.5% in January to 9.1% by June, a four-decade high) while Bitcoin fell roughly 40% over the same months.",
    mechanism: "The thesis on this page is about decades of supply-schedule mathematics, not next quarter's price action. Treating Bitcoin as a hedge against this month's inflation print is a different, weaker claim than the one this site actually makes.",
    concession: null,
    source: "BLS CPI news releases; price history from blockchain.info",
  },
];

// Time-preference contrast — Saifedean's civilizational argument.
export const TIME_PREFERENCE = {
  soft: {
    label: "Easy money rewards",
    accent: "#ef4444",
    items: [
      { head: "Spending",              tail: "Holding cash loses value, so consuming today is rational." },
      { head: "Debt",                  tail: "Loans get repaid in cheaper dollars; leverage beats savings." },
      { head: "Speculation",           tail: "The 'safe' option becomes forced risk-taking." },
      { head: "Short horizons",        tail: "Long-term plans require monetary stability that doesn't exist." },
      { head: "Proximity to power",    tail: "The closer to the printer, the more you benefit." },
      { head: "Rent extraction",       tail: "Capital flows toward who controls money, not who produces value." },
    ],
  },
  hard: {
    label: "Hard money rewards",
    accent: "#f7931a",
    items: [
      { head: "Saving",                tail: "Wealth held in the money itself gains purchasing power." },
      { head: "Productive investment", tail: "Capital chases real returns, not yield-or-die." },
      { head: "Deferred gratification",tail: "Tomorrow's dollar buys more than today's." },
      { head: "Long horizons",         tail: "Builders can plan decades out without inflation eating returns." },
      { head: "Productivity",          tail: "You grow wealth by producing more, not getting closer to power." },
      { head: "Sovereignty",           tail: "Holders don't depend on a custodian, bank, or political regime." },
    ],
  },
};

// Story lead for the time-preference section — narrative before the grid, per
// research on narrative transportation driving behavioral intention (the "so what
// do I do" moment) while the grid below carries the belief-level statistics.
export const TIME_PREFERENCE_STORY = {
  headline: "Your grandparents could save in a coffee tin. It worked.",
  paragraphs: [
    "For most of the 20th century, tucking cash away and leaving it alone was a reasonable plan. The money you didn't spend this year was still worth roughly what it was worth last year — so patience was rewarded, and saving felt like the responsible thing to do.",
    "Break that guarantee and you break the patience along with it. When holding cash is a slow, certain loss, everyone gets quietly pushed toward speculation just to keep pace — not because they became reckless, but because the safe option stopped being safe.",
  ],
  closing: "Low time preference isn't a virtue you summon through willpower. It's a system you design — and it starts with money that can't be diluted out from under you.",
};

// Four-move scrolly — same scaffold, sharper Bitcoin Standard framing.
export const THESIS_FLOW = [
  {
    step: "01",
    eyebrow: "Absolute Scarcity",
    title: "Scarcity isn't just hard. It's mathematical.",
    property: "Gold's supply grows ~1.5% per year. Fiat M2 grows ~6%. Bitcoin's growth rate halves every four years and is already lower than gold's. The total supply is 21 million, enforced by every node. No vote, war, pandemic, or political crisis can change that number.",
    implication: "For the first time, holders own a money no one can dilute them out of. Demand becomes the only variable that moves price over the long run.",
    stat: "Stock-to-flow > Gold",
    watch: "Demand durability is the swing factor.",
  },
  {
    step: "02",
    eyebrow: "Bearer Ownership",
    title: "Self-custody turns claims back into bearer money.",
    property: "Twelve memorized words can hold any amount of Bitcoin anywhere on earth. No bank, no clearinghouse, no judge can move it without the keys. It's the closest thing to physical gold in 5,000 years — but it weighs nothing and crosses borders at the speed of light.",
    implication: "Holders carry sovereign-level monetary independence in a brain. ETFs are convenient exposure; self-custody is actual ownership of the bearer asset.",
    stat: "No issuer required",
    watch: "Custody mistakes are real risk.",
  },
  {
    step: "03",
    eyebrow: "Open Network",
    title: "The neutral settlement layer for the internet age.",
    property: "Any node anywhere can verify the entire history with a laptop. ETFs, Lightning, treasuries, governments, and miners all build on the same rules — and none of them can change those rules. The network upgrades only when overwhelming consensus agrees.",
    implication: "Easier access never weakens the monetary policy. More rails route more capital to the same fixed base asset.",
    stat: "Permissionless rails",
    watch: "Adoption is uneven and cyclical.",
  },
  {
    step: "04",
    eyebrow: "Time Horizon",
    title: "Volatility is the price of asymmetry.",
    property: "Bitcoin trades 24/7 with no central stabilizer. It reprices fast when liquidity or sentiment changes. Most wealth created in its history came from holding through brutal drawdowns, not trading them.",
    implication: "The thesis is multi-year, not multi-quarter. Sound sizing lets holders survive bad years without abandoning the position — which is when most of the loss happens.",
    stat: "Think in halvings",
    watch: "Not financial advice.",
  },
];

export const POSITIONING_LENSES = [
  {
    label: "Conviction",
    title: "Know what would change your mind.",
    text: "A thesis you can't falsify isn't a thesis — it's a hope. Write down, in advance, exactly what would prove this page wrong: a cryptographic break, self-custody never going mainstream, a successor with genuinely stronger properties, or a coordinated shutdown across every major economy at once. If none of those happen, that's evidence. If one does, the honest move is to update — not to explain it away.",
  },
  {
    label: "Sizing",
    title: "Own enough to matter, not enough to panic.",
    text: "Bitcoin's volatility punishes forced selling. The right allocation is the one that lets the holder survive bad years without abandoning the thesis at the worst possible moment.",
  },
  {
    label: "Custody",
    title: "Understand the wrapper you bought.",
    text: "An ETF is convenient exposure. Self-custody is sovereign ownership of the bearer asset itself. Serious holders should know the tradeoff before treating them as identical.",
  },
];
