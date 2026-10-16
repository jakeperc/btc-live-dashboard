# Heuristics

**Distilled rules learned across multiple observation cycles.** Promoted from patterns by `/consolidate-deep-analysis` (quarterly), not by individual runs.

Each entry: rule statement, supporting evidence (cite run dates), counter-evidence, current confidence (`low` / `medium` / `high`), and what would retire it.

## Active heuristics

### Candidate

_(none currently — the two seed candidates were resolved at the Q3 2026 consolidation: one retired below, one promoted below. Cross-current patterns below their 3-cycle floor stay in `cross-current-patterns.md` as candidates, not here.)_

## Promoted heuristics

_(promoted at the Q3 2026 consolidation — the first-ever consolidation pass, run SEP 26, 2026 covering MAY 18 – SEP 26, 2026 / 17 weekly cycles. Each cites its supporting run dates; re-test at the next consolidation.)_

#### 1. Buyer-class convergence dominates when ETFs and corporate treasuries accumulate together

- **Rule:** When U.S. spot ETF flows AND at least one major corporate treasury are both net-accumulating in the same cycle, float scarcity is the dominant pricing dynamic and the move tends to be the year's largest. The two classes converging is a stronger signal than either alone.
- **Evidence (3 cycles):** MAY 18 seed · SEP 13 (ETFs +$3.52B + Strategy +4,603 above cost → +25% on the month) · SEP 26 (ETFs +$2.98B/7d + Strategy 950 + Strive 1,355 + a statutory reserve-lock bill → +11% to an 8-month high).
- **Counter-evidence:** none — the inverse (both classes paused together) has approached twice but never fully fired; see #2.
- **Confidence:** medium. See `cross-current-patterns.md` "Buyer-class convergence on scarce float".
- **Retire if:** a cycle where both classes accumulate together produces a flat or negative week with no offsetting macro shock.

#### 2. ETF flows and corporate treasury buying run on independent clocks

- **Rule:** Spot ETF flows answer the market's NEXT-move repricing (rate or policy) within a day. Corporate treasury buying (Strategy) answers its own price-vs-cost-basis and share-premium calendar, on a weekly filing cadence. The two pillars converging (both buying, or both pausing) is a stronger tell than either one's direction alone — but convergence is not automatic, because the clocks differ.
- **Evidence (15 cycles):** MAY (divergence) → JUN–JUL (convergence in retreat) → AUG 3–19 (corporate distributes below cost while flows whipsaw) → AUG 31 (valve reopens above cost) → SEP 13–16 (a near dual-pause: −$753M/6 sessions + two covering 8-Ks) → SEP 26 (reverses on one Friday print — both buy together, feeding #1) → **OCT 16 (a clean divergence: the funds sold on the Fed's next move — −$487M on the minutes, −$262M on CPI — while Strategy bought in a fourth straight above-basis filing, sized to its premium; two clocks, same fortnight).**
- **Confidence:** high — the best-evidenced pattern in memory. Default frame before reaching for a single-pillar explanation.
- **Retire if:** the two pillars move in lockstep on the SAME clock for 3+ consecutive cycles (would mean the independent-clocks premise has broken down).

#### 3. Corporate treasury capital allocation is price-vs-basis gated, not doctrine

- **Rule:** A leveraged-treasury company's BTC buy/sell/idle decision in any given week is governed by (a) spot price vs. its average cost basis and (b) whether its share premium (or cash reserve) makes issuance/deployment accretive — never by a stated "doctrine" (e.g., "never sell") and never durable enough to be called a settled "regime." Price above basis + an open valve (ATM premium >1.0 OR designated cash) → buy. Price below basis + a thin premium + a dividend date due → sell the underlying to fund it. Public statements/teases are anti-signals; only the filing counts.
- **Evidence (6 cycles; the mechanism was re-derived 3 times):** JUN–AUG sold ~6,948 BTC across 3 dividend-cycle sales below basis (JUN 1, JUL 6, AUG 3/10) → AUG 31 bought 4,603 above basis, ATM-funded → SEP 8/14 idled → SEP 21 bought 950 with cash alone, ATM shut, proving cash is a real second valve.
- **Cost of not having this sooner:** the ledger's worst score (Brier 0.7225) called the summer selling a "regime" days before it reversed; the next-worst (0.4225) called the idle case "sticky" days before the cash valve fired.
- **Confidence:** high, but rewritten 3× already (May 20 → Sep 13 → Sep 26) — expect a 4th refinement. Corporate bias (N=7, −0.30) tracks in `calibration.md`.
- **Retire if:** a below-basis purchase, an above-basis sale with no dividend due, or two consecutive above-basis filings with an open valve and no purchase.

#### 4. Energy re-shock hardens the Fed's rate path every time; de-escalation does not buy a pivot when core inflation binds

- **Rule:** An oil/energy geopolitical RE-SHOCK (supply disruption, tanker/pipeline strikes) reliably feeds through to PPI/CPI within one data cycle and hardens the Fed's hawkish path. The mirror does NOT hold with the same strength: energy RELIEF (a ceasefire, a de-escalation) does not buy a dovish pivot once core inflation is already binding — the asymmetry is the pattern, not either direction alone.
- **Evidence (5 cycles incl. the mirror):** JUN 17 (US–Iran deal, same day as a hawkish FOMC — relief bought no pivot) · JUL 24 (ceasefire collapse → Brent >$100 → re-hardened) · SEP 9–10 (Iran tanker/missile strikes → Brent $100→$107.63 → PPI/CPI reaccelerate → the Sep hike) · SEP 11 (Saudi pipeline strike fed the same hike) · SEP 16 (Warsh: the Fed "cannot affect any individual price… whether it be oil" — hiked anyway).
- **Confidence:** high. Named mechanism, 5 consistent cycles, zero counter-instances. **OCT 16 — 6th cycle at the data level:** Brent $101–107 since Sep 9 → September CPI energy +5.2% m/m / +20.4% y/y, gasoline +9.1% m/m, PPI energy +10.8% m/m → the minutes name energy the risk and the December path hardened to ~90% — even as the chair's "I don't prejudge" softened OCTOBER. Texture: the re-shock hardens the SERIES; a chair's remark can move the next meeting without touching the path.
- **Retire if:** a confirmed energy re-shock (Brent sustained >$10 above its pre-shock level for 2+ weeks) fails to move CPI/PPI expectations or the Fed's priced path within one data cycle.

#### 5. Regulatory clarity and monetary ease are reinforcing complements, not substitutes — but each can now act alone

- **Rule:** A structural regulatory unlock (legislative or administrative) landing within ~2 weeks of a Fed policy pivot compounds; the inverse (a regulatory setback landing with a hawkish Fed action) compounds the other way. Across most of 2026 this held as the dominant framing. **Scope-narrowed at the Q3 2026 consolidation:** the rule describes how allocators behave AT THE MARGIN when neither leg is independently strong — it stops predicting the outcome once one leg (here, ETF/corporate demand) is strong enough to act without the other's support.
- **Evidence (14 cycles):** MAY 18 seed → JUN 24/28 (hawkish Fed + ethics collapse, mirrored) → JUL 26 (regulatory leg dead, monetary leg live-hike) → AUG 7 (convergence literalized into Sep 15–16) → AUG 19 (the administrative 3rd leg) → SEP 13 (the priced inverse) → SEP 16 (fired literally: a hike a day after cloture failed) → **SEP 26, first clean counter-instance: no clarity, a MORE hostile rate path, AND the funds' best week of 2026** — the marginal buyer wasn't allocating on policy or rates; it was buying a breakout.
- **Confidence:** medium-high on the original form (13 cycles); the Sep 26 case is a scope limit, not a falsification — log further counter-instances before re-widening.
- **Retire if:** 2 more clean counter-instances fire within the next 2 quarters (would mean the "reinforcing complements" frame has stopped being the default case).

## Retired heuristics

_(kept for audit so a future run doesn't re-propose the same rule. Retired at the Q3 2026 consolidation unless noted.)_

#### Float scarcity buffers ETF outflows unconditionally (RETIRED — decisive contradiction JUN 5, 2026; formally closed at Q3 consolidation)

- **Original rule:** When ≥18M of 19.7M mined BTC sits in long-term-holder cohorts, marginal ETF inflows/corporate buys move price more than equivalent outflows pressure it — asymmetry is the dominant dynamic regardless of leverage.
- **Retirement trigger:** JUN 5, 2026 — a 13-day/$4.4B outflow streak plus $1.8B of leveraged forced liquidations cascaded price ~17% further to sub-$60K. The buffer holds for passive/discretionary selling; it fails once leverage is in the loop, because the marginal seller stops being discretionary.
- **Why closed now, not carried as a scope-corrected candidate:** the file carried a "passive-only" form for 16 subsequent runs with zero fresh supporting cycles (no clean passive-only outflow week has recurred). Re-propose fresh rather than resurrecting an untested carry-over.
- **Lesson:** never cite a contained drawdown under passive outflows as evidence a floor holds under a leveraged cascade. Preserved in `cross-current-patterns.md`'s "Leverage-cascade × ETF-outflow feedback loop" and the `etf-passive-outflow + leverage → reflexive-liquidation-cascade` edge (`strong`).

#### Sovereign reserves lead institutional product launches (RETIRED — stale, thin, contradicted-in-miniature)

- **Original rule:** Sovereign Bitcoin reserve announcements precede institutional product launches by ~8–12 weeks.
- **Retirement reason:** seeded MAY 18 on one weak instance (the Trump EO → first pension allocation, ~12 weeks) plus one instance that undermined its own claimed lag (Texas reserve → SEC 401(k) guidance in ~12 days, far too fast). Seventeen subsequent runs — including active sovereign-reserve tracking (Bhutan's drawdown, the Sep 26 reserve-lock bill) — produced zero fresh engagement with this claim. A pattern that never recurs in 4+ months of active coverage of its own subject is dead, not dormant.
- **Lesson:** don't seed a heuristic from a single ambiguous instance where the counter-evidence arrived in the SAME observation. Wait for the pattern to repeat before naming it.

## Promotion protocol

- **Candidate** — proposed by a single run from observed evidence. No analytical weight.
- **Promoted** — `/consolidate-deep-analysis` confirms ≥3 cycles of supporting evidence and <50% counter-evidence ratio. Now usable as a prior in Phase 3 drafting.
- **Retired** — counter-evidence accumulates or a single decisive contradiction. Stays in retired section.

## Hygiene rules

1. **Heuristics are not theses.** Theses are the current week's bet; heuristics are durable patterns.
2. **Cite run dates as evidence.** Anyone reading should be able to find the supporting run in `theme-history.jsonl`.
3. **Two cycles is not three.** Don't promote on flimsy evidence — the cost of a bad heuristic is biased priors for months.
4. **One decisive contradiction retires a heuristic.** Don't keep limping along. Better to retire and re-propose later than to apply a known-broken rule.
