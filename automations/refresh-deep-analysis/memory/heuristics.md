# Heuristics

**Distilled rules learned across multiple observation cycles.** Promoted from patterns by `/consolidate-deep-analysis` (quarterly), not by individual runs.

Each entry: rule statement, supporting evidence (cite run dates), counter-evidence, current confidence (`low` / `medium` / `high`), and what would retire it.

## Active heuristics

### Candidate (proposed by seed run — needs ≥3 cycles to promote)

#### Float scarcity buffers PASSIVE outflows but NOT leveraged cascades (scope-corrected JUN 5, 2026)

- **Rule (original):** When ≥18M of 19.7M mined BTC sits in long-term-holder cohorts, marginal ETF inflows and corporate treasury buys move price more than equivalent outflows pressure it. Asymmetry is the dominant pricing dynamic, not net flows.
- **Rule (corrected JUN 5):** The asymmetry holds for PASSIVE ETF/discretionary selling into a calm order book, but it is NOT a sufficient buffer once leverage enters the loop. Reflexive forced-liquidation selling overwhelms the thin-book buffer because the marginal seller is non-discretionary. Do NOT cite a contained drawdown under passive outflows as evidence the floor will hold under a leveraged cascade.
- **Status:** candidate, SCOPE-CORRECTED (the strong/unconditional form is contradicted; the passive-only form survives). The Jun 5 cascade is the decisive contradiction of the unconditional version.
- **Evidence supporting (passive-only form):**
  - MAY 18, 2026 — seed: $130B+ ETF AUM + corporate accumulation; no significant downside on net-flat weeks.
  - MAY 20, 2026 — ~$1B outflow + 3.8% CPI + $657M liquidations → only ~5% drawdown.
  - JUN 1, 2026 — record $2.8B/9-day outflow → only ~9% drawdown, no cascade (looked like the strongest data point).
- **Counter-evidence (decisive, unconditional form):**
  - **JUN 5, 2026 — the buffer FAILED under leverage.** The streak extended to 13 days/$4.4B and once $1.8B of leveraged longs were force-liquidated in 72h, price cascaded ~17% further to sub-$60K — a disorderly move. The Jun 1 ~9% "floor" was the calm before leverage broke it. See causal-model edge `etf-passive-outflow + leverage → reflexive-liquidation-cascade` (strong).
- **Confidence:** low. The unconditional form is retired in practice; the scope-corrected (passive-only) form needs re-validation under the leverage lens.
- **Retire if (corrected):** a PASSIVE ETF outflow week ≥$1B with low aggregate leverage/funding delivers a >15% drawdown with no leveraged cascade and no macro shock. (The leverage-present case is already excluded by the scope correction.)

#### Sovereign reserves lead institutional product launches

- **Rule:** Sovereign Bitcoin reserve announcements precede institutional product launches (ETFs, allocation greenlights, custodian onboarding) by ~8–12 weeks. Sovereign action is a leading indicator, not a lagging confirmation.
- **Status:** candidate (1 cycle observed). Needs additional cycles.
- **Evidence supporting:**
  - MAY 18, 2026 — Trump executive order (Feb 4 codification) → first major pension allocation (Apr 28) ≈ 12 weeks. Texas reserve (Apr 20) → 401(k) eligibility SEC guidance (May 2) ≈ 12 days (too short — counter-evidence?).
- **Counter-evidence:** Texas/SEC sequence above looks too fast to fit the pattern; may indicate coincidence rather than causation.
- **Confidence:** low.
- **Retire if:** in 3+ subsequent cycles, sovereign announcements don't precede institutional moves by a clear 6+ week median.

## Promoted heuristics

_(none yet — promoted by `/consolidate-deep-analysis` after ≥3 cycles of supporting evidence)_

## Retired heuristics

_(none yet — heuristics move here when contradicted. Kept for audit so we don't re-propose the same wrong rule.)_

## Promotion protocol

- **Candidate** — proposed by a single run from observed evidence. No analytical weight.
- **Promoted** — `/consolidate-deep-analysis` confirms ≥3 cycles of supporting evidence and <50% counter-evidence ratio. Now usable as a prior in Phase 3 drafting.
- **Retired** — counter-evidence accumulates or a single decisive contradiction. Stays in retired section.

## Hygiene rules

1. **Heuristics are not theses.** Theses are the current week's bet; heuristics are durable patterns.
2. **Cite run dates as evidence.** Anyone reading should be able to find the supporting run in `theme-history.jsonl`.
3. **Two cycles is not three.** Don't promote on flimsy evidence — the cost of a bad heuristic is biased priors for months.
4. **One decisive contradiction retires a heuristic.** Don't keep limping along. Better to retire and re-propose later than to apply a known-broken rule.
