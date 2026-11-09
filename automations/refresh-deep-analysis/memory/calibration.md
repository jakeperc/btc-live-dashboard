# Calibration

**Honest probabilities + Brier scoring = the only way the analyst gets better at predicting.**

Aggregate Brier <0.20 = decent. <0.10 = strong. <0.05 = elite (forecasting research benchmark for top performers on tractable questions).

## Aggregate scores

| Window | N resolved | Aggregate Brier | Status |
|---|---|---|---|
| Last 20 items | 20 | **0.14** | **NOV 9: 0.1398** (2.795/20). Three rows entered (Σ 0.4475: ETF restart MISS 0.55 → 0.3025; Strategy purchase HIT 0.65 → 0.1225; Binance PoR HIT 0.85 → 0.0225) and three rotated out (Σ 0.1725: the SEP 13 Coldcard / sub-$55K tails 0.0125 + the SEP 16 one-and-done 0.16) — the window WORSENED by 0.014 as pre-announced NOV 2. Window now: SEP 26 0.425 (2) + OCT 7 0.825 (7) + OCT 16 0.51 (4) + OCT 24 0.0625 (1) + NOV 2 0.525 (3) + NOV 9 0.4475 (3) = 2.795. Next out: SEP 26's two (0.425 — incl. the 0.4225 cash-valve miss), so the window will IMPROVE when they rotate. Prior: 0.126 (NOV 2), 0.1375 (OCT 24), 0.1524 (OCT 16), 0.1941 (OCT 7), 0.2116 (OCT 3), 0.172 (SEP 16), 0.192 (SEP 13). |
| All-time | 50 | 0.19 | **NOV 9 run: 0.1925 = 9.6225/50 on the rendered ledger's sum** (9.175 + 0.4475); the memory components below sum to 9.645/50 = 0.1929 — both round to 0.19. (The 0.0225 component gap predates OCT 24 and is for consolidation; the ledger file is the rendered truth.) |

_Components (condensed; per-row text in `watch-list-outcomes.md` + git): pre-JUL-6 set Σ 2.3825 (N=11); JUL 6 Σ 0.685 (2); JUL 19 Σ 0.6225 (3); JUL 26 0.04 (1); AUG 3 Σ 0.5725 (2); AUG 7 Σ 0.10 (2); AUG 19 Σ 1.1425 (3); SEP 13 Σ 1.33 (7); SEP 16 0.16 (1); SEP 26 Σ 0.425 (2); OCT 7 Σ 0.825 (7); OCT 16 Σ 0.51 (4); OCT 24 0.0625 (1); NOV 2 Σ 0.525 (3); **NOV 9 Σ 0.4475 (3)**. Less the two seed rows re-marked no-resolution (0.185). **All-time (memory) 9.645 / 50 = 0.1929 → 0.19; rendered ledger 9.6225 / 50 = 0.1925 → 0.19; rolling-20 2.795 / 20 = 0.1398 → 0.14.**_

_**OCT 3, 2026 — scoring-rule correction.** A binary forecast resolves `hit` (1) or `miss` (0) only; the old `partial` (0.5) flattered the aggregate. Three rows were re-resolved MISS. A row whose letter genuinely cannot decide it is `no-resolution` and EXCLUDED from every figure here. No row is currently `no-resolution` except the two May 18 seeds._

_Brier formula: per-item `(p − outcome)²` where outcome ∈ {0, 1}. Aggregate = mean across items scored hit or miss._

_**Contrarian ledger (separate, not in the figures above):** three resolutions NOV 2 (SEP 13 bear 0.30, SEP 26 bull 0.30, OCT 7 bear 0.25 — all WRONG) → Σ 0.2425 / 3 = 0.08. NOV 9: the NOV 2 custodial-wrapper bull stepped to the 0.10 floor (its own invalidation — a second ≥$1B liquidation day — fired); the MAY 29 / JUN 1 bears (0.35) score Nov 30._

## Per-category bias

Surfaces signed residual `mean(p − outcome)` once N ≥ 8 per category. Positive = over-confident, negative = under-confident.

| Category | N resolved | Mean residual | Read |
|---|---|---|---|
| Regulation | **4** | **+0.05** | No resolution. Standing: leadership COMMITMENTS are weak evidence against floor REALITY; vote-banking; **name the instrument AND its review clock**. NOV 9: the midterms changed the AUTHORS of the next bill, not the calendar — the CLARITY lame-duck row (0.10, Dec 18) and the NPRM row (0.10, Dec 31) are the next tests. |
| Macro | **16** | **+0.30** | No resolution. The Dec 9 HIKE row restated 0.70 → 0.75 on the Oct jobs report (futures 77.1%) — a hawkish-OUTCOME row matched to futures (rule 4). Read unchanged: the bias is Fed-INTENT dovish rows (set-pieces 0-for-5 soft) plus one-session bond frames; DECISION rows near futures have scored well. |
| Protocol | **5** | **+0.14** | No resolution. eCash (0.05, Nov 15) next. |
| Corporate / treasury | **11** | **−0.32** | **NOV 9: the purchase row HIT at 0.65 (residual −0.35) → Σ −3.50 / 11 = −0.318.** Nine of eleven under-priced. **Texture: the NOV 2 restatement (0.75 → 0.65 on 'the premium gone') was the error — the Nov 2 8-K showed the ATM REOPENED ($164.0M) at mnav.com 1.16× by the company's method while a plain share count read a discount (~0.86×); the valve is the issuer's own premium definition. The WHETHER rule is 7-for-8 above basis; heuristics #3 stands (the Oct 26 idle week was the counter-instance, not a regime).** Live: a purchase in the Nov 9 / Nov 16 8-K at 0.65 with spot 2% BELOW basis (rule (a) does not strictly apply; rule (b) partially — the SALE row is 0.25 memory-only). Residuals: +0.65, −0.25, +0.35, −0.75, −0.60, −0.85, −0.65, −0.45, −0.35, −0.25, **−0.35** (Σ −3.50 / 11). |
| Sovereign | 0 | n/a | seeding — H.R. 8957 (0.20) is the first row. |
| ETF flows | **10** | **+0.14** | **NOV 9: the Nov 6 event-restart row MISS at 0.55 (residual +0.55) → Σ +1.35 / 10 = +0.135.** Residuals: +0.65, −0.40, +0.40, +0.65, −0.45, +0.05, +0.05, −0.70, +0.55, **+0.55**. Three populations now: SUSTAIN rows (+0.65, +0.65, +0.55, +0.40 — four over-confident misses); EVENT-RESTART rows WITH the Fed marginal (−0.45, −0.70 — two under-confident hits); EVENT-RESTART rows with the EQUITY TAPE marginal (+0.55 — the first, over-confident). Correction (b) amended below. |
| Market structure | **4** | **−0.13** | **NOV 9: the Binance PoR row HIT at 0.85 (residual −0.15) → Σ −0.51 / 4 = −0.1275.** Scheduled publications with a stated clock keep scoring well at ≥0.85. Next: MSCI Nov 11 (0.80); mNAV <1.0× (0.35); the <$75K Friday row (0.45, rendered). |

## Calibration curve (decile reliability)

N = 50 (bins by predicted p, upper bound inclusive; every row is a hit or a miss). Deviation > 0.10 = bias to correct. (NOV 9: the 0.50–0.70 band gains one HIT (Strategy 0.65) and one MISS (the ETF restart 0.55) → 7 of 17; the 0.70–0.90 band gains the Binance PoR HIT → 4 of 4.)

| Predicted range | N | Empirical hit rate | Δ (rate − midpoint) | Read |
|---|---|---|---|---|
| 0.00–0.10 | 10 | 0% (0 of 10) | −0.05 | tail non-events priced honestly |
| 0.10–0.30 | 9 | 44% (4 of 9) | **+0.24** | UNDER-confident: the four HITs were "the thing we said was unlikely happened" on live mechanisms (rule 6) |
| 0.30–0.50 | 10 | 20% (2 of 10) | **−0.20** | OVER-confident on "possible" narratives and completion rows; both hits were Strategy actions |
| 0.50–0.70 | 17 | 41% (7 of 17) | **−0.19** | two populations: scheduled corporate/regulatory/index rows run COLD here (the seven hits — **the Nov 2 Strategy buy joins them**); Fed-INTENT, multi-week-SUSTAIN and now equity-tape RESTART rows run HOT (the ten misses — **the Nov 6 restart row joins them**) |
| 0.70–0.90 | 4 | 100% (4 of 4) | +0.20 | two Strategy rows + the Oct 28 HOLD + the Binance PoR — still under-used and under-confident; the Dec 9 HIKE (0.75) and MSCI (0.80) are its next tests |
| 0.90–1.00 | 0 | n/a | n/a | never used |

**Shape:** a compressed S — we under-use the tails. Correction until the next consolidation: when a named mechanism is live, do not price its firing below 0.25 (and for Strategy, not below 0.55 when price is above basis); when a row depends on a Fed-INTENT, multi-week-sustain or equity-tape-restart read, do not price it above 0.45 without a specific reason; **a scheduled decision with a published list or a known clock is a ≥0.65 row, and a self-interested scheduled publication ≥0.85.** Bin-level reads must be split by category before use.

## Active bias corrections

Apply these as priors during Phase 3 drafting. Updated by `/consolidate-deep-analysis` (quarterly; last SEP 26, next ~late Dec 2026) or sooner if a clear pattern emerges within a category at N ≥ 8.

- **MACRO — over-confident on Fed-DECISION/INTENT dovish outcomes (N=16, +0.30).** (1) ANY "this Fed signals softer than the market" row ≤0.35 until one resolves soft (set-pieces 0-for-5; the Oct 28 hold was as-expected, not soft). (2) The weak-DATA carve-out stands for ONE print and is spent. (3) Price the DECISION, not the intraday odds path. (4) A DECISION row priced within ~0.15 of futures on the hawkish side has scored well; hawkish-OUTCOME rows are matched to futures, not shaded (the Dec 9 HIKE 0.70 → 0.75 as futures moved 73% → 77%). (5) Bond-market frames built on one session are "possible" narratives — ≤0.25.
- **CORPORATE — price-vs-basis is the operative condition (N=11, −0.32; nine of eleven under-priced).** (a) BTC above the ~$75,451 average cost → a purchase in the next three filings ≥0.75 regardless of the ATM — **now 7-for-8; the Oct 26 idle filing is a counter-instance, not a regime; heuristics #3 stands**; (b) BTC below cost or the premium thin on a dividend date → dividend-driven sales ≥0.55 — **NOV 9 refinement: apply (b) at full weight only when the equity premium is ALSO gone by the issuer's own measure; with the ATM open and the reserve >$4B, a sale within two filings is 0.25**; (c) the idle case is NOT a regime; (d) **NEW (NOV 9): never restate a Strategy row DOWN on an external premium reading — the company trades its own mNAV definition (mnav.com 1.16× vs a share-count 0.86×) and the restatement 0.75 → 0.65 cost 0.06 of Brier.** WHETHER vs HOW MUCH. Teases are anti-signals; only filings count.
- **ETF — THREE populations (N=10, +0.14).** (a) SUSTAIN rows: over-confident FOUR times — a sustain row made in a breakout week is ≤0.45; in a drawdown week ≤0.40; never above 0.55; (b) EVENT-RESTART rows: ≥0.55 ONLY when the Fed is the marginal narrative (two under-confident hits); **NEW (NOV 9): when the equity tape or a shock is marginal, the restart precondition is unmet and the row is capped at the drawdown-week sustain level (≤0.40) — the Nov 6 row at 0.55 cost 0.30**; (c) composition bets stay humble; (d) the DAILY rule follows the Fed's next move ONLY when the Fed is the marginal narrative (Nov 6: hot jobs → −$412M with the Nasdaq UP — the Fed WAS marginal that day, sign-consistent).
- **REGULATION (N=4, +0.05):** leadership commitments are weak evidence vs floor reality; agency rows price off the instrument AND the clock; rhetoric after a shock is not a calendar entry; **an election changes authors, not the lame-duck calendar (NOV 9).**
- **PROTOCOL (N=5, +0.14):** heavily-evidenced non-events at 0.05; audit-gated completion rows ≤0.20.
- **MARKET STRUCTURE (N=4, −0.13):** tail price rows at 0.05 behave; scheduled decisions/publications with a stated clock ≥0.65; a self-interested publisher with one slip behind it ≥0.85 (the Binance PoR row — right). Price rows name their series (CoinGecko 00:00 UTC).
- **MATRIX (ADOPTED SEP 26):** finals respect category floors/caps; the excluded-theme sympathy nudge is zeroed unless a mechanism is named. **NOV 9: contagion for a 2nd run, and deficit weighting ENGAGED for the first time (etfs drafted 0.35 → weight 0.15 → fed −0.0105, corporate −0.015; both rounded away) — the mode now transmits, modestly.** Open for consolidation: exempt Fed-DECISION rows (6th run) and agency-timing rows (3rd run) from the matrix; contagion condition 1 met on the letter this run (a two-week streak + p(etfs) 0.35); `exchange-security` deltas assigned (→ clarity +0.02, → policy +0.03, others 0.00).

## Run history (append-only summary)

| asOf | Δ N | Aggregate Brier (rolling 20) | Note |
|---|---|---|---|
| MAY 18 – AUG 7, 2026 | +21 resolved | n/a → 0.0925 → 0.21 → 0.18 | **(merged; full text in git.)** Seed era → JUN 5 cascade (THESIS-002 falsified) → the SEVEN dot-plot MISSES → JUL 6 rate-path HIT at 0.25 → JUL 26 CLARITY cloture MISS 0.20 → AUG 3 FOMC-ratification MISS 0.10 + Strategy repeat-sale HIT 0.25 → AUG 7 CLARITY endgame MISS 0.30 + BIP-110 MISS 0.10. |
| AUG 19, 2026 | +3 | 0.19 | ETF-sustain MISS 0.65; Strategy third-cycle HIT 0.40; CPI pair (later MISS). |
| SEP 13, 2026 | +7 | 0.19 (0.192) | Flow-ratification HIT 0.55; Jackson Hole MISS 0.60; resumed-buy HIT 0.15 (0.7225, the worst); four tail MISSES. THESIS-006 registered. |
| SEP 16, 2026 | +1 | 0.19 (0.17) | FORCE-RUN. One-and-done MISS 0.40. |
| SEP 26, 2026 | +2 | 0.19 (0.18) | Strategy further-buy HIT 0.35; sub-$50K MISS 0.05. THESIS-007 registered 0.45. First consolidation. |
| OCT 3, 2026 | 0 net; 3 re-resolved | 0.22 (0.21) | Scoring-rule correction (`partial` removed). |
| OCT 7, 2026 | +7 | 0.20 (0.19) | Two-week post-decision flows HIT 0.30 (0.49); Strategy purchase + ATM HIT; four tails MISS. Fed HOLD 0.35→0.70. |
| OCT 16, 2026 | +4 | 0.20 (0.15) | Strategy purchase HIT 0.75; MSCI adoption HIT 0.55; CFTC ANPRM HIT 0.65; Liquid MISS 0.35. THESIS-007 0.55→0.35. (condensed; git) |
| OCT 24, 2026 (audit + run) | −2 (seed exclusion) +1 | 0.20 (0.14) | Two May 18 seeds → no-resolution. Strategy purchase HIT 0.75. Fed HOLD 0.70→0.75; mNAV 0.45→0.35. THESIS-007 HELD 0.35. (condensed; git) |
| NOV 2, 2026 | +3 resolved; +2 rendered net-new; +1 memory-only | 0.20 (0.13) | Fed HOLD HIT 0.75 (0.0625); ETF 3-of-5 MISS 0.55 (0.3025); 30Y ≥5.80% MISS 0.40 (0.16). THESIS-007 / 006 RETIRED; THESIS-008 registered 0.55. REGIME CONTAGION (first since Jun 5); `exchange-security` novel (0.00 deltas). Contrarian: two bulls to the floor; NEW custodial-wrapper BULL 0.25; first three contrarian resolutions (all wrong). Heuristics #3 on notice. (condensed; git) |
| NOV 9, 2026 | **+3 resolved**; +2 rendered net-new (ETF week to Nov 13 0.35; Strategy Nov 9/16 purchase 0.65); the <$75K Friday row RENDERED (0.45, held); +2 memory-only (Strategy SALE by Dec 7 0.25; Trump Media sale filing by Dec 15 0.30); the Dec 9 HIKE restated 0.70 → 0.75 | **0.19** (ledger 0.1925; memory 0.1929; rolling-20 **0.14**) | MONDAY cadence run (chained after market-news; no hint). **THREE resolutions:** ETF restart MISS 0.55 (0.3025 — the first equity-tape restart row; prior (b) amended); Strategy purchase HIT 0.65 (0.1225 — the NOV 2 downward restatement was the error; rule (d) added); Binance PoR HIT 0.85 (0.0225). ETF N=10 +0.14; Corporate N=11 −0.32; Market structure N=4 −0.13. The 0.70–0.90 band 4 of 4; the 0.50–0.70 band 7 of 17. **THESIS-008 0.55 → 0.65** (the reclaim 12.6% → 18.3%; the beta leg confirmed on the named series — Nov 5 Nasdaq −5.5% / BTC −5.5% UTC-day; the flow leg −$1.28B; against: the ATM reopened — the corporate leg amended from 'shut' to 'small and premium-gated'). Falsifiers: #1 Nov 6 close $75,775 (clear); #2 flows negative (clear); #3 not fired. REGIME CONTAGION 2nd run (conditions 1 + 2; 3 not met — the ATM open); deficit weighting engaged (etfs 0.35). Finals: etfs 0.35, fed 0.75, corporate 0.65, clarity 0.10, policy 0.15 (flag, 3rd run); `exchange-security` OUT of the top-5 (deltas assigned). Contrarian: NOV 2 wrapper bull → 0.10 floor (Nov 5 ≥$1B); NEW April-2025-analog BULL 0.25. Heuristics #3 NOT retired (7-for-8). Macro texture (Treasury par Nov 6): 2Y 4.51 / 10Y 4.86 / 30Y 5.26; gold $4,087.60 (COMEX Nov 6); Brent ~$94.50 (Nov 5); DXY 101.48; Nasdaq 24,579.42 (−3.37% w/w); MSTR $129; mnav.com 1.16× (restated a 3rd time); BTC $74,055 (Nov 9 11:08 UTC); Friday close Nov 6 $75,775. |

## Forecasting hygiene rules

1. **Round to 0.05.**
2. **0.50 is a refusal.**
3. **Extremes carry the most info.**
4. **Anchor on base rates first, adjust for specifics.**
5. **Forecast falsification conditions, not just outcomes.**
6. **A live mechanism is never priced below 0.25 (SEP 13).**
7. **Never restate a row on the partial realisation of its own letter (SEP 26).** Exogenous information only.
8. **Name the instrument — and the clock (SEP 26 / OCT 7).**
9. **A binary forecast resolves hit or miss — never partial (OCT 3).**
10. **Split WHETHER from HOW MUCH (OCT 16).**
11. **A multi-week sustain row is capped where the ledger says, not where the week feels (NOV 2).**
12. **Name the marginal narrative before pricing a restart row (NOV 9).** The event-restart prior is a Fed-marginal prior; an equity-tape week is a sustain row in disguise.
13. **Do not restate an issuer's row on an outside reading of its own valve (NOV 9).** Strategy trades its own mNAV definition; only its filing shows whether the valve is open.
