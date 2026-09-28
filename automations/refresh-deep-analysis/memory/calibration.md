# Calibration

**Honest probabilities + Brier scoring = the only way the analyst gets better at predicting.**

Aggregate Brier <0.20 = decent. <0.10 = strong. <0.05 = elite (forecasting research benchmark for top performers on tractable questions).

## Aggregate scores

| Window | N resolved | Aggregate Brier | Status |
|---|---|---|---|
| Last 20 items | 20 | 0.18 | **SEP 26: 0.179** — the Strategy further-buy HIT at p=0.35 (0.4225) and the sub-$50K MISS at 0.05 (0.0025) entered; the JUL 6 Strategy-10K MISS (0.1225) and the JUL 19 ETF-week HIT (0.16) rotated out. Prior: 0.172 (SEP 16), 0.192 (SEP 13). The window now runs JUL 19 FBTC/IBIT → SEP 26. |
| All-time | 34 | 0.19 | (0.1885) |

_Components (condensed; full per-row text in `watch-list-outcomes.md` + git): pre-JUL-6 set Σ 1.9825 (N=11); JUL 6 Σ 0.685; JUL 19 Σ 0.3225; JUL 26 0.04; AUG 3 Σ 0.5725; AUG 7 Σ 0.10; AUG 19 Σ 0.7925; SEP 13 Σ 1.33 (N=7); SEP 16 0.16; **SEP 26 Σ 0.425 (further-buy HIT p=0.35 → 0.4225; sub-$50K MISS p=0.05 → 0.0025).** All-time 6.41 / 34 = 0.1885 → **0.19**; rolling-20 3.5825 / 20 = 0.179 → **0.18**._

_Brier formula: per-item `(p − outcome)²` where outcome ∈ {0, 1} (partial = 0.5). Aggregate = mean across items._

## Per-category bias

Surfaces signed residual `mean(p − outcome)` once N ≥ 8 per category. Positive = over-confident, negative = under-confident.

| Category | N resolved | Mean residual | Read |
|---|---|---|---|
| Regulation | 3 | +0.05 | No new resolution (the cloture row scores Sep 30; the CFTC NPRM row was restated 0.55→0.10 on the instrument, not scored). Standing notes: leadership COMMITMENTS are weak evidence against floor REALITY; vote-banking (deferred Jul 23 / Aug 6, spent Sep 15). **New rule (SEP 26): name the instrument in a rulemaking row** — the CFTC filed a PRE-RULE, and a row that said "proposed rule" nearly scored a substantive yes as a MISS. |
| Macro | **14** | **+0.26** | No new resolution. Standing (SEP 16): Warsh set-pieces 0-for-5; ANY "softer than the market" row ≤0.35 until one resolves soft; hawkish-outcome rows are not shaded down. **Applied SEP 26:** the October HOLD row stepped 0.40→0.35 once futures made the hold the softer-than-market outcome (61.6% hike). Next: Oct 28 (0.35). |
| Protocol | **3** | **+0.10** | No new resolution. Rule: heavily-evidenced non-events at 0.05 (eCash Nov 15 at 0.05). Liquid restated 0.65→0.35 on vendor silence + a dateless post-mortem (not a non-event row — a completion row). |
| Corporate / treasury | **7** | **−0.30** | **Updated SEP 26 — under-confidence DEEPENED.** Further-buy HIT at p=0.35 (residual −0.65). Residuals: +0.65, −0.25, +0.35, −0.75, −0.60, −0.85, −0.65 (Σ −2.10). Five of seven times the company did MORE than we priced. The SEP 13 diagnosis (we price the LAST regime as sticky) held again — this time the idle regime (two zero-ATM weeks → 0.35). The refined mechanism's ATM condition was FALSIFIED by its own stated test (a cash-funded buy with the ATM shut). **Replacement (below): price-vs-basis is the operative condition; the ATM and designated cash are two valves that size the buy; a purchase in the next three filings with BTC above basis is ≥0.55 regardless of the ATM.** |
| Sovereign | 0 | n/a | seeding — first row this run (H.R. 8957 House passage by Dec 31, 0.20). |
| ETF flows | **5** | **+0.07** | No new resolution, but the post-decision two-week row (0.30) is heading to a HIT on a +$2.39B first week — scores Oct 2 AS MADE. **Diagnosis banked now (SEP 26): the row was priced off the GUIDANCE branch (series → 0.30–0.35), i.e. off the `fed→flows` edge, and the edge failed its cleanest test — flows rose ~$3B while October hike odds rose 43.5%→61.6%. The edge is scope-corrected (medium): Fed guidance sets the DAILY oscillation when the Fed is the marginal narrative; a fully-priced event's delivery is a non-event for flows; the year's big runs (Aug 17–27 policy shock; Sep 17–25 breakout) came from NON-Fed impulses. Rule: never price a post-event flow row off the guidance branch alone — weight the event's pricedness and the price impulse.** Sustain haircut (one notch) stands and is applied to the new ≥3-of-5 row (0.55). |
| Market structure | **2** | **+0.05** | Sub-$50K MISS at 0.05 (SEP 26) after sub-$55K MISS at 0.05 (SEP 13). Tail rows at 0.05 behave. |

## Calibration curve (decile reliability)

N = 34 (bins by predicted p, upper bound inclusive; partial = 0.5 hit). Deviation > 0.10 = bias to correct.

| Predicted range | N | Empirical hit rate | Δ (rate − midpoint) | Read |
|---|---|---|---|---|
| 0.00–0.10 | 6 | 0% (0 of 6) | −0.05 | tail non-events priced honestly (BIP-110, FOMC-ratification, eCash, Coldcard, sub-$55K, sub-$50K) |
| 0.10–0.30 | 8 | 38% (3 of 8) | **+0.18** | UNDER-confident: the three HITs at 0.15–0.25 were "the thing we said was unlikely happened" — when a mechanism is live, rows at 0.15–0.25 are too low |
| 0.30–0.50 | 8 | 25% (2 of 8) | **−0.15** | OVER-confident on "possible" narratives (dot-plot rows, Strategy-10K, FBTC/IBIT, one-and-done) — but BOTH hits in the bin were Strategy actions we under-priced (third sale 0.40; further buy 0.35): the bin mixes two opposite errors by category |
| 0.50–0.70 | 11 | 41% (3 hits + 3 partials of 11) | **−0.19** | OVER-confident: sustain / dovish-Fed rows; excluding the four Fed-INTENT rows the residual is ~−0.10 |
| 0.70–0.90 | 1 | 100% (1 of 1) | +0.20 | one row (May cadence) — no read |
| 0.90–1.00 | 0 | n/a | n/a | never used the band |

**Shape:** a compressed S — we under-use the tails. Correction until the next consolidation: when a named mechanism is live, do not price its firing below 0.25 (and for Strategy, not below 0.55 when price is above basis); when a row depends on a Fed-INTENT or multi-week-sustain read, do not price it above 0.45 without a specific reason. **The bin-level reads must be split by category before use — the 0.30–0.50 bin is over-confident on macro narratives and under-confident on corporate mechanisms at the same time.**

## Active bias corrections

Apply these as priors during Phase 3 drafting. Updated by `/consolidate-deep-analysis` (quarterly — **OVERDUE since ~AUG 17**) or sooner if a clear pattern emerges within a category at N ≥ 8.

- **MACRO — over-confident on Fed-DECISION/INTENT dovish outcomes (N=14, +0.26).** (1) ANY "this Fed signals softer than the market" row ≤0.35 until one resolves soft (set-pieces 0-for-5); hawkish-outcome rows are not shaded down. (2) The weak-DATA carve-out stands for ONE print (the Oct 2 jobs report is the next candidate). (3) In-line prints RATIFY but do not EXTEND. Next macro resolution: Oct 27–28 (HOLD row 0.35).
- **CORPORATE — REWRITTEN AGAIN SEP 26 (N=7, −0.30): price-vs-basis is the operative condition.** (a) BTC above the ~$75,416 average cost → a purchase in the next three filings ≥0.55 regardless of the ATM; the ATM (premium >1.0) and designated USD Cash ($1.05B on Sep 20) are two valves that size the buy, not gates; (b) BTC below cost or the premium thin on a dividend date → dividend-driven sales ≥0.55; (c) the idle case (two zero-ATM weeks) is NOT a regime — it was priced as one at 0.35 and cost 0.4225. Teases are anti-signals; only filings count. The $2.0B STRC repurchase authority ($875M left) competes for the same cash.
- **ETF — near-calibrated (N=5, +0.07), with the fed→flows edge SCOPE-CORRECTED (SEP 26).** Keep the sustain haircut at ONE notch. Do NOT price a post-event flow row off the guidance branch alone: a fully-priced decision's delivery is a flow non-event, and non-Fed impulses (policy shocks, breakouts) drive the big runs. Composition (which-fund) bets stay humble.
- **REGULATION (N=3, +0.05):** leadership commitments are weak evidence vs floor reality; name the instrument in rulemaking rows.
- **PROTOCOL (N=3, +0.10):** heavily-evidenced non-events at 0.05, not 0.10.
- **MATRIX (proposed for consolidation, SEP 26):** matrix finals must respect category floors/caps (a Fed-INTENT row lifted 0.35→0.45 by ETF strength has no mechanism); excluded themes (`sovereign-reserves`, `clarity-act`) have now been lifted on sympathy three times (SEP 13 clarity +0.10; SEP 16 clarity +0.10; SEP 26 sovereign +0.10) — zero the bounded nudge for excluded themes unless a mechanism is named.

## Run history (append-only summary)

| asOf | Δ N | Aggregate Brier (rolling 20) | Note |
|---|---|---|---|
| MAY 18 – JUN 5, 2026 | +2 resolved (seed era) | n/a → 0.0925 | **(merged; full text in git.)** Seed run → two early HITs (CLARITY markup 0.65; Strategy cadence 0.75) → THESIS-002 → JUN 5 force-run at the cascade: THESIS-002 FALSIFIED; THESIS-003 initiated 0.60. |
| JUN 13 – JUL 8, 2026 | **+9 resolved** | 0.1575 → 0.18 → 0.21 | **(merged; git.)** JUN 13 ETF-week PARTIAL + Strategy-10K MISS; JUN 20 the SEVEN dot-plot MISSES (the dovish-haircut correction born); JUN 24 contagion regime; JUL 2 bounce off $57.7K; JUL 8 IBIT-led streak. |
| JUL 6 – JUL 26, 2026 | **+6 resolved** | 0.21 → 0.19 → 0.18 | **(merged; git.)** JUL 6 rate-path HIT at over-corrected 0.25 (the weak-DATA carve-out born) + Strategy-10K MISS; JUL 19 ETF-week HIT 0.60, FBTC/IBIT MISS 0.40, CPI PARTIAL 0.55; JUL 26 CLARITY cloture MISS 0.20 (best regulatory call) — THESIS-001 RETIRED; fxleaders BANNED. |
| AUG 3 – AUG 7, 2026 | **+4 resolved** | 0.19 → 0.18 | **(merged; git.)** FOMC-ratification MISS 0.10 (cleanest Fed-DECISION confirmation) + Strategy repeat-sale HIT 0.25 (THESIS-003 → 004); CLARITY endgame MISS 0.30 (vote-banking) + BIP-110 MISS 0.10; THESIS-004 0.55→0.60 on the jobs-driven hold repricing. |
| AUG 19, 2026 | **+3 resolved** | 0.19 | **(condensed; git.)** ETF-sustain MISS 0.65 (flows EVENT-gated, not level-gated); Strategy third-cycle HIT 0.40 (THESIS-004 RETIRED → THESIS-005 0.55); CPI pair PARTIAL 0.60. Slot 1 ETFs→POLICY (SEC Regulation Crypto Assets + White House summit; BTC +8% on >$1B short liquidations). |
| SEP 13, 2026 | **+7 resolved** | 0.19 (rolling 0.192) | **(condensed; git.)** Flow-ratification HIT 0.55; Jackson Hole MISS 0.60 (set-pieces 0-for-4); resumed-buy HIT 0.15 (0.7225, the ledger's worst — the corporate mechanism rewritten to price-vs-basis + premium); eCash / Iran / Coldcard / sub-$55K MISSES. THESIS-005 RETIRED on #5's letter (a two-sided cascade falsifier fired on a move that CONFIRMED the read — cascade conditions now downside-only) → THESIS-006 0.55. Decile curve seeded (N=31). Gold FELL with BTC (the tandem-bid edge's counter-datapoint). |
| SEP 16, 2026 | **+1 resolved** | 0.19 (rolling 0.17) | FORCE-RUN on the FOMC. FOMC one-and-done MISS 0.40 (0.16; the fifth Warsh set-piece hawkish of expectations; Macro N=14, +0.26). THESIS-006 0.55→0.45; #4 ARMED on the Fri Sep 18 close. Contrarian flipped to a peak-hawkishness BULL 0.30. Matrix finals fed 0.45 / etfs 0.35 / corporate 0.45 / clarity 0.15 (tripled on sympathy — flagged) / protocol 0.65. |
| SEP 26, 2026 | **+2 resolved**, +5 rendered net-new (Fed HOLD 0.35 restated; ETF ≥3-of-5 0.55; Strategy next purchase 0.65; CFTC ANPRM publication 0.60; H.R. 8957 House passage 0.20) + memory-only (Strategy ATM 0.55; CFTC NPRM 0.55→0.10; Liquid 0.65→0.35) | **0.19** (all-time 0.1885; rolling-20 **0.18**) | SATURDAY cadence run (the Mon Sep 21 run was missed; chained after market-news). **TWO resolutions: Strategy further-buy HIT p=0.35 → 0.4225** (Sep 21 8-K: 950 BTC at $79,670 from USD Cash, zero ATM a third week — the refined mechanism's own falsifier fired; Corporate N=7, −0.30) **and sub-$50K MISS p=0.05 → 0.0025** (determined after the last Friday in its window; Market structure N=2). NOT restated: the two-week flow row (0.30) despite +$2.39B in week 1 — new hygiene rule (never restate on own partial realisation); it scores Oct 2 as made. **The `fed→flows` edge failed its cleanest test** (flows +~$3B while Oct hike odds rose 43.5%→61.6%; 10Y 5.10% / 30Y 5.49% on the Treasury table) — scope-corrected to medium. THESIS-006 cleared #2 and #4 (0.45→0.70, active in memory); **THESIS-007 registered 0.45** (demand-led breakout: two closes <$80K / ≥3-of-5 negative weeks / a sale / a downside cascade retire it). Slot 1 MACRO→MARKETS; slot 5 SECURITY→SOVEREIGN (H.R. 8957 28–21). CFTC pre-rule to OIRA Sep 17 (RIN 3038-AF80) — the NPRM row restated 0.55→0.10, a correctly-lettered successor seeded 0.60. Contrarian: decoupling BULL NEW 0.30; SEP 16 bull 0.30→0.40 (right on price, wrong on mechanism); SEP 13 bear 0.35→0.15. Regime reinforcing (contagion 0 of 3). Matrix finals: etfs 0.70 (0.55), fed 0.45 (0.35 — floor violation flagged), policy 0.65 (0.60), corporate 0.75 (0.65), sovereign 0.30 (0.20 — sympathy lift, 3rd instance). Macro texture: DXY 101.03 (2-mo high); gold ~$4,275 (−2% w/w) vs BTC +11% since the hike — a DIVERGENCE datapoint for the co-movement edge; S&P +1.2% wk / Nasdaq +2%; Brent ~$106. Restored `themes/sovereign-reserves.md` + `actors/cftc.md`. |

## Forecasting hygiene rules

1. **Round to 0.05.** False precision (`p=0.673`) is noise. `0.65` or `0.70` is honest.
2. **0.50 is a refusal.** If you're at exactly 0.50, you haven't picked a side — either commit or split into sharper sub-questions.
3. **Extremes carry the most info.** A 0.05 or 0.95 prediction that resolves correctly is high-value calibration data. A 0.50 that resolves anywhere is uninformative.
4. **Anchor on base rates first, adjust for specifics.** "Senate markup of a major financial bill clears with ≤3 amendments" has a base rate. Estimate it before reasoning about CLARITY specifically.
5. **Forecast falsification conditions, not just outcomes.** "p_passage = 0.65" is weaker than "p_passage = 0.65 conditional on no stablecoin amendments attaching."
6. **A live mechanism is never priced below 0.25 (SEP 13).** Three of the ledger's four worst scores were "unlikely" rows on mechanisms we had already documented (the dividend calendar, the ATM valve, the data override).
7. **Never restate a row on the partial realisation of its own letter (SEP 26).** Exogenous information only. A half-realised multi-week row scores at the probability it carried before the first print.
8. **Name the instrument (SEP 26).** Rulemaking rows say ANPRM / NPRM / final rule; flow rows say week or day; price rows say Friday close.
