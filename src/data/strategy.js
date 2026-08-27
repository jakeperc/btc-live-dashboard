// Strategy tab data — static content, never AI-refreshed.
// Allocation bands, common mistakes, historical drawdowns, DCA UI options.

// One worked example, not a general framework. Numbers are a real weekly-$50 DCA
// simulation over actual BTC daily closes (blockchain.info market-price series),
// Jan 2021 – Dec 2022. Per cognitive-load research: novices learn from one fully
// worked case before generic rules, not the reverse.
export const WORKED_EXAMPLE = {
  eyebrow: "One saver, two brutal years",
  name: "Maya",
  weekly: 50,
  span: "Jan 2021 – Dec 2022",
  steps: [
    { date: "Jan 2021", event: "Starts $50/week", invested: 50, value: 50, note: "BTC ≈ $33,000" },
    { date: "Nov 2021", event: "Bitcoin nears its cycle top", invested: 2250, value: 3211, note: "BTC ≈ $63,000 — feels easy" },
    { date: "Jun 2022", event: "Down more than half from the highs", invested: 3800, value: 2526, note: "BTC ≈ $28,000 — every headline says it's over" },
    { date: "Dec 2022", event: "Cycle bottom", invested: 5200, value: 2706, note: "BTC ≈ $17,000 — she keeps buying" },
  ],
  outcome: {
    invested: 5200,
    satsAccumulated: 16073473,
    note: "By March 2024, Bitcoin reclaimed its old high — every dollar Maya put in during 2021 and 2022, even at the very top, was worth more again.",
  },
  moral: "She never tried to call the bottom. Buying on a schedule meant she didn't have to.",
};

// BIS Working Paper 1049 (2022): app-download data across 95 countries, 2015–2022.
// Retail entry skews toward price strength; most buyers bought high.
export const RETAIL_REALITY = {
  stat: "73–81%",
  statLabel: "of retail crypto buyers are estimated to have lost money on their purchases",
  source: "BIS Working Paper 1049",
  body: "Most exchange-app downloads happened while Bitcoin traded above $20,000 — people arrived because the price was already moving, not because they'd done the homework. They bought excitement and sold fear.",
  inversion: [
    { kills: "FOMO entry", tool: "A schedule", body: "Buying the same amount on the same day removes the question of whether today is the right day to buy." },
    { kills: "Panic exit", tool: "The 4-year jar", body: "Money you've already decided not to touch for years can't be sold in a moment of fear." },
    { kills: "Daily fear", tool: "Rare checking", body: "You can't panic about a price you haven't looked at." },
  ],
};

// Four rules, framed as decisions made once rather than ongoing willpower — a
// commitment-device pattern (Thaler & Benartzi, "Save More Tomorrow").
export const STRATEGY_RULES = [
  {
    num: "01",
    accent: "#22c55e",
    title: "Only money you won't touch for 4 years.",
    bullets: ["Put it in a separate mental — or literal — account before you buy. That jar doesn't open during a crash, because it can't."],
  },
  {
    num: "02",
    accent: "#f7931a",
    title: "Expect −50%. Decide now what you'll do.",
    bullets: ["Bitcoin has fallen more than 50% multiple times in its history. Write down your plan for that day before it arrives, not during it."],
  },
  {
    num: "03",
    accent: "#ef4444",
    title: "No leverage. Ever.",
    bullets: ["Borrowed-money bets get forcibly closed at the worst possible moment. A spot position can wait out a crash; a leveraged one often can't."],
  },
  {
    num: "04",
    accent: "#3b82f6",
    title: "Start smaller than feels exciting.",
    bullets: ["You can always add more once you've held through a real drawdown. You can't un-panic-sell."],
  },
];

// Custody ladder — who holds the keys at each rung, and the tradeoff of moving up.
// Keys-as-signatures framing ties back to the Thesis tab's "digital scarcity" section.
export const CUSTODY_LADDER = [
  {
    rung: "01",
    label: "ETF in a brokerage",
    holdsKeys: "A custodian",
    good: "Zero operational risk. Fits naturally into a retirement account.",
    tradeoff: "You own exposure to the price, not the bearer asset itself.",
  },
  {
    rung: "02",
    label: "Exchange account",
    holdsKeys: "The exchange",
    good: "Easiest way to run a recurring weekly buy.",
    tradeoff: "It's an IOU until you withdraw it — the exchange could freeze, fail, or get hacked.",
  },
  {
    rung: "03",
    label: "Hardware wallet (self-custody)",
    holdsKeys: "You",
    good: "True bearer ownership. Keys sign transactions — they're not a password anyone can reset for you.",
    tradeoff: "Unforgiving. A lost seed phrase is a permanently lost balance, with no customer support line to call.",
  },
];

export const ALLOCATION_BANDS = [
  {
    band: "1–2%",
    persona: "Institutional / conservative",
    rationale: "Cited by BlackRock as a reasonable Bitcoin sleeve in a 60/40-style portfolio. Higher weights quickly raise overall portfolio volatility.",
    stripe: "#3b82f6",
  },
  {
    band: "3–5%",
    persona: "Mainstream believer, managing volatility",
    rationale: "Bitwise's 2025 institutional allocation assumptions cite 1–5%. Fidelity research notes even a 5% Bitcoin replacement meaningfully raises portfolio volatility.",
    stripe: "#22c55e",
  },
  {
    band: "10%",
    persona: "High-conviction allocation",
    rationale: "Where Bitcoin becomes a meaningful wealth driver in the portfolio rather than a hedge or diversifier.",
    stripe: "#f7931a",
  },
  {
    band: "15–25%",
    persona: "Serious believer",
    rationale: "Common among holders with deep familiarity, long time horizons, and tolerance for 50–80% drawdowns without panic-selling.",
    stripe: "#fb923c",
  },
  {
    band: "30–50%+",
    persona: "Aggressive / quasi-maximalist",
    rationale: "Some prominent crypto advocates argue for crypto allocations of 10–40%. Far more aggressive than mainstream wealth-planning guidance.",
    stripe: "#ef4444",
  },
  {
    band: "50–100%",
    persona: "Full conviction / maximalist",
    rationale: "Common in Bitcoin circles, uncommon in professional wealth planning. High upside, high life-concentration risk.",
    stripe: "#dc2626",
  },
];

export const COMMON_MISTAKES = [
  {
    title: "Leverage / margin",
    body: "Liquidations during volatility wipe out more positions than any other single cause. Spot-only is the default for long-term holders.",
  },
  {
    title: "Panic-selling drawdowns",
    body: "Selling at −50% to −80% has destroyed more crypto wealth than every hack and exchange failure combined. Unrealized losses become permanent only when sold.",
  },
  {
    title: "Trading instead of holding",
    body: "The most active retail stock traders have been measured earning roughly 6 points a year less than the market, largely from the costs of trading itself (Barber & Odean, 2000). Holding isn't the beginner's fallback — the data says it's the expert move.",
  },
  {
    title: "Short-term money",
    body: "Money needed within ~4 years is not a Bitcoin candidate. The drawdown clock and the spending clock rarely align.",
  },
  {
    title: "\"Guaranteed return\" scams",
    body: "Yield products promising fixed returns on Bitcoin have collapsed repeatedly (Celsius, BlockFi, FTX). The heuristic that survives all of them: Bitcoin itself never pays yield. Anyone offering you interest on it is lending your coins to someone else — and you're the one holding the risk.",
  },
  {
    title: "Custody mistakes",
    body: "Lost seed phrases, bad backups, and exchange failures have permanently lost millions of BTC. Self-custody is powerful and unforgiving.",
  },
  {
    title: "The re-entry trap",
    body: "Selling the bottom isn't the expensive mistake — it's what happens after. Investors who panic-sell often stay out for years, missing the recovery entirely. The costly decision is rarely the sale itself; it's the years spent not buying back.",
  },
];

// recovery/journey: computed from real daily closes (blockchain.info market-price
// series) — time from each trough back to reclaiming the prior all-time high.
export const HISTORICAL_DRAWDOWNS = [
  { year: "2011",      drawdownPct: 94, label: "Mt. Gox era / early-cycle crash",            duration: "~5 months", recovery: "~15 months", journey: "$100 → $6 → recovered by Mar 2013" },
  { year: "2014–2015", drawdownPct: 86, label: "Post-bubble bear, exchange failures",          duration: "~14 months", recovery: "~25 months", journey: "$100 → $14 → recovered by Feb 2017" },
  { year: "2018",      drawdownPct: 84, label: "ICO bubble unwind",                            duration: "~12 months", recovery: "~23 months", journey: "$100 → $16 → recovered by Nov 2020" },
  { year: "2022",      drawdownPct: 77, label: "Macro tightening, Terra / FTX collapses",     duration: "~12 months", recovery: "~15 months", journey: "$100 → $23 → recovered by Mar 2024" },
];

// Survivorship caveat, rendered under the drawdown table — every crash here is
// followed by a recovery because Bitcoin is the survivor being shown. That was
// true every time so far; it is not a guarantee, and it was not true of most
// individual altcoins that crashed alongside Bitcoin in the same cycles.
export const DRAWDOWN_CAVEAT =
  "Every crash above was followed by a recovery — but that's survivorship in the data: Bitcoin is the asset that kept recovering, which is why it's the one on this page. Past recovery is not a guarantee of future recovery, and most individual altcoins that crashed alongside Bitcoin in these same cycles never reclaimed their highs.";

// Closing epigraph — the last words on the page, sitting above Sources.
// Primary source: Satoshi Nakamoto, Cryptography Mailing List, 16 January 2009,
// replying on the "Bitcoin v0.1 released" thread (Nakamoto Institute email
// archive #17). Verbatim, including his unhyphenated "self fulfilling".
// Chosen because the claim in it is deliberately small — "get some, in case" —
// which is the same posture the four rules and the schedule above teach.
export const STRATEGY_EPIGRAPH = {
  eyebrow: "The last word",
  quote: "It might make sense just to get some in case it catches on. If enough people think the same way, that becomes a self fulfilling prophecy.",
  attribution: "Satoshi Nakamoto",
  context: "Cryptography Mailing List · 16 January 2009",
  url: "https://satoshi.nakamotoinstitute.org/emails/cryptography/17/",
  gloss: "Bitcoin was less than two weeks old when its creator wrote that, and a coin had no price at all. Notice how small the claim is. Not bet the house, not sell everything else — just own a little, in case it turns into something. That is this whole page in one sentence.",
};

export const STRATEGY_SOURCES = [
  {
    label: "BlackRock — Sizing Bitcoin in traditional portfolios",
    url: "https://www.blackrock.com/us/individual/insights/bitcoin-portfolio-allocation",
  },
  {
    label: "Bitwise — Institutional Crypto Allocation Research",
    url: "https://bitwiseinvestments.com/research",
  },
  {
    label: "Fidelity Digital Assets — Research & Insights",
    url: "https://www.fidelitydigitalassets.com/research-and-insights",
  },
  {
    label: "BIS Working Paper 1049 — Retail crypto trading across 95 countries",
    url: "https://www.bis.org/publ/work1049.htm",
  },
  {
    label: "Chainalysis — Crypto Crime Report",
    url: "https://www.chainalysis.com/blog/2025-crypto-crime-report-introduction/",
  },
  {
    label: "Barber & Odean (2000) — Trading Is Hazardous to Your Wealth",
    url: "https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/individual_investor_performance_final.pdf",
  },
  {
    label: "Thaler & Benartzi (2004) — Save More Tomorrow",
    url: "https://www.anderson.ucla.edu/documents/areas/fac/accounting/smartjpe226.pdf",
  },
  {
    label: "Satoshi Nakamoto — Cryptography Mailing List, 16 January 2009",
    url: "https://satoshi.nakamotoinstitute.org/emails/cryptography/17/",
  },
];

export const DCA_WEEKLY_OPTIONS = [25, 50, 100, 200];
