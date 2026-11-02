# Calibration

**Honest probabilities + Brier scoring = the only way the analyst gets better at predicting.**

Aggregate Brier <0.20 = decent. <0.10 = strong. <0.05 = elite (forecasting research benchmark for top performers on tractable questions).

## Aggregate scores

| Window | N resolved | Aggregate Brier | Status |
|---|---|---|---|
| Last 20 items | 20 | **0.13** | **NOV 2: 0.126** (2.52/20). Three rows entered (Σ 0.525: Fed HOLD HIT 0.75 → 0.0625; ETF 3-of-5 MISS 0.55 → 0.3025; 30Y ≥5.80% MISS 0.40 → 0.16) and three rotated out of the SEP 13 block (Σ 0.755: the resumed-buy 0.7225 — the ledger's worst, so the window FLATTERED by ~0.035 as pre-announced on OCT 24 — eCash 0.01, Iran 0.0225). Window now: SEP 13 two (Coldcard 0.01, sub-$55K 0.0025 = 0.0125) + SEP 16 0.16 + SEP 26 0.425 + OCT 7 0.825 + OCT 16 0.51 + OCT 24 0.0625 + NOV 2 0.525 = 2.52. Next out: the SEP 13 Coldcard / sub-$55K tails (0.0125) — the window will WORSEN slightly when they rotate. Prior: 0.1375 (OCT 24), 0.1524 (OCT 16), 0.1941 (OCT 7), 0.2116 (OCT 3), 0.172 (SEP 16), 0.192 (SEP 13). |
| All-time | 47 | 0.20 | **NOV 2 run: 0.1952 = 9.175/47 on the rendered ledger's sum** (8.65 + 0.525); the memory components below sum to 9.1975/47 = 0.1957 — both round to 0.20. (The 0.0225 component gap predates OCT 24 and is for consolidation; the ledger file is the rendered truth.) |

_Components (condensed; per-row text in `watch-list-outcomes.md` + git): pre-JUL-6 set Σ 2.3825 (N=11); JUL 6 Σ 0.685 (2); JUL 19 Σ 0.6225 (3); JUL 26 0.04 (1); AUG 3 Σ 0.5725 (2); AUG 7 Σ 0.10 (2); AUG 19 Σ 1.1425 (3); SEP 13 Σ 1.33 (7); SEP 16 0.16 (1); SEP 26 Σ 0.425 (2); OCT 7 Σ 0.825 (7); OCT 16 Σ 0.51 (4); OCT 24 0.0625 (1); **NOV 2 Σ 0.525 (3)**. Less the two seed rows re-marked no-resolution (0.185). **All-time (memory) 9.1975 / 47 = 0.1957 → 0.20; rendered ledger 9.175 / 47 = 0.1952 → 0.20; rolling-20 2.52 / 20 = 0.126 → 0.13.**_

_**OCT 3, 2026 — scoring-rule correction.** A binary forecast resolves `hit` (1) or `miss` (0) only; the old `partial` (0.5) flattered the aggregate. Three rows were re-resolved MISS. A row whose letter genuinely cannot decide it is `no-resolution` and EXCLUDED from every figure here. No row is currently `no-resolution` except the two May 18 seeds._

_Brier formula: per-item `(p − outcome)²` where outcome ∈ {0, 1}. Aggregate = mean across items scored hit or miss._

_**Contrarian ledger (separate, not in the figures above):** first three resolutions NOV 2 — SEP 13 bear 0.30, SEP 26 bull 0.30, OCT 7 bear 0.25, all WRONG on their dated resolution shapes → Σ 0.2425 / 3 = 0.08. Only the "wrong" side has been tested; the MAY 29 / JUN 1 bears (0.35) score Nov 30._

## Per-category bias

Surfaces signed residual `mean(p − outcome)` once N ≥ 8 per category. Positive = over-confident, negative = under-confident.

| Category | N resolved | Mean residual | Read |
|---|---|---|---|
| Regulation | **4** | **+0.05** | No resolution this run. Standing: leadership COMMITMENTS are weak evidence against floor REALITY; vote-banking; **name the instrument AND its review clock** (EO 12866 §6(b)(2)). The CLARITY lame-duck row (0.10, Dec 18) and the NPRM row (0.10, Dec 31) are the next tests; the Binance theft hardened rhetoric on both sides without touching either clock — rhetoric is not a calendar entry. |
| Macro | **16** | **+0.30** | **NOV 2: two resolutions — the Oct 28 HOLD HIT at 0.75 (residual −0.25; the band's first non-Strategy test, right) and the 30Y ≥5.80% MISS at 0.40 (+0.40; a hawkish-outcome "possible" narrative that ran hot) → Σ +4.75 / 16 = +0.297.** Read: the bias is specifically Fed-INTENT dovish rows (set-pieces 0-for-5 soft) PLUS one-session bond frames; a DECISION row priced near-but-below futures scored well. **New texture:** the first as-expected hold came with two hawkish dissents and December ~73% — the "tougher than the market" record is intact in spirit; the Dec 9 HIKE row (0.70) is a hawkish-outcome row matched to futures, not shaded. |
| Protocol | **5** | **+0.14** | No resolution. eCash (0.05, Nov 15) next. |
| Corporate / treasury | **10** | **−0.32** | No resolution. **NOV 2 texture (not a scored row): the Oct 26 8-K was the SEVENTH above-basis filing and the FIRST with no buy** (BTC ~$80K, 6% above basis; zero ATM; cash to STRC buybacks). The WHETHER rule is now 6-for-7. The live row was restated 0.75 → 0.65 on exogenous information (the Q3 capital priority; the premium gone). If Nov 2 is idle too, heuristics #3's retire condition fires and the rule needs a third variable (the premium gating the CASH valve, not only the ATM). Residuals stand: +0.65, −0.25, +0.35, −0.75, −0.60, −0.85, −0.65, −0.45, −0.35, −0.25 (Σ −3.15 / 10). |
| Sovereign | 0 | n/a | seeding — H.R. 8957 (0.20) is the first row. |
| ETF flows | **9** | **+0.09** | **NOV 2: the 3-of-5 row MISS at 0.55 (residual +0.55) → Σ +0.80 / 9 = +0.089.** Residuals: +0.65, −0.40, +0.40, +0.65, −0.45, +0.05, +0.05, −0.70, **+0.55**. The two populations are now sharp: SUSTAIN rows (multi-week positive flows) have residuals +0.65, +0.65, +0.55, +0.40 — FOUR over-confident misses; EVENT-RESTART rows −0.45, −0.70 — two under-confident hits. The 2-of-3 row (+0.05) is the only sustain row that landed, and it was a shorter window. Correction tightened below. |
| Market structure | **3** | **−0.12** | No resolution. Next: MSCI Nov 11 (0.80); mNAV <1.0× (0.35); Binance's PoR report by Nov 9 (0.85 — a scheduled publication with a stated clock, the ≥0.65 rule applied); the <$75K Friday row (0.45, memory-only). |

## Calibration curve (decile reliability)

N = 47 (bins by predicted p, upper bound inclusive; every row is a hit or a miss). Deviation > 0.10 = bias to correct. (NOV 2: the 0.70–0.90 band gains its first non-Strategy row — the HOLD HIT — now 3 of 3; the 0.50–0.70 band gains a sustain MISS; the 0.30–0.50 band a hawkish-outcome MISS.)

| Predicted range | N | Empirical hit rate | Δ (rate − midpoint) | Read |
|---|---|---|---|---|
| 0.00–0.10 | 10 | 0% (0 of 10) | −0.05 | tail non-events priced honestly |
| 0.10–0.30 | 9 | 44% (4 of 9) | **+0.24** | UNDER-confident: the four HITs were "the thing we said was unlikely happened" on live mechanisms (rule 6) |
| 0.30–0.50 | 10 | 20% (2 of 10) | **−0.20** | OVER-confident on "possible" narratives and completion rows (dot-plot rows, Strategy-10K, FBTC/IBIT, one-and-done, Liquid, **the 30Y spike**); both hits were Strategy actions |
| 0.50–0.70 | 15 | 40% (6 of 15) | **−0.20** | two populations: scheduled corporate/regulatory/index rows run COLD here (the six hits); Fed-INTENT and multi-week-SUSTAIN rows run HOT (the nine misses — **the 3-of-5 row joins them**) |
| 0.70–0.90 | 3 | 100% (3 of 3) | +0.20 | two Strategy rows + the Oct 28 HOLD — under-used and so far under-confident; the Dec 9 HIKE (0.70) and the Binance report (0.85) are its next tests |
| 0.90–1.00 | 0 | n/a | n/a | never used |

**Shape:** a compressed S — we under-use the tails. Correction until the next consolidation: when a named mechanism is live, do not price its firing below 0.25 (and for Strategy, not below 0.55 when price is above basis); when a row depends on a Fed-INTENT or multi-week-sustain read, do not price it above 0.45 without a specific reason; **a scheduled decision with a published list or a known clock is a ≥0.65 row.** Bin-level reads must be split by category before use.

## Active bias corrections

Apply these as priors during Phase 3 drafting. Updated by `/consolidate-deep-analysis` (quarterly; last SEP 26, next ~late Dec 2026) or sooner if a clear pattern emerges within a category at N ≥ 8.

- **MACRO — over-confident on Fed-DECISION/INTENT dovish outcomes (N=16, +0.30).** (1) ANY "this Fed signals softer than the market" row ≤0.35 until one resolves soft (set-pieces 0-for-5; the Oct 28 hold was as-expected, not soft — two dissents for a rise). (2) The weak-DATA carve-out stands for ONE print and is spent. (3) Price the DECISION, not the intraday odds path. (4) **NEW (NOV 2): a DECISION row priced within ~0.15 of futures on the hawkish side has scored well (HOLD 0.75 vs ~90% → 0.0625); hawkish-OUTCOME rows are matched to futures, not shaded (the Dec 9 HIKE at 0.70 vs 73%).** (5) **Bond-market frames built on one session are "possible" narratives — ≤0.25 (the 30Y row at 0.40 cost 0.16; causal-model rule 7).**
- **CORPORATE — price-vs-basis is the operative condition (N=10, −0.32; eight of ten under-priced) — ON NOTICE.** (a) BTC above the ~$75,446 average cost → a purchase in the next three filings ≥0.75 regardless of the ATM — **now 6-for-7; the Oct 26 idle filing is the first counter-instance; the live row sits at 0.65 on exogenous information and a second idle filing (Nov 2) retires heuristics #3 as written**; (b) BTC below cost or the premium thin on a dividend date → dividend-driven sales ≥0.55 (the Q3 8-K confirms the mechanism: 5,552 BTC sold in-quarter for dividends/buybacks); (c) the idle case is NOT a regime. WHETHER vs HOW MUCH (≥1,000 across the filings, 0.25). Teases are anti-signals; only filings count.
- **ETF — TWO priors, now sharper (N=9, +0.09).** (a) SUSTAIN rows (positive flows in several weeks, or in most of a multi-week window): over-confident FOUR times (residuals +0.65, +0.65, +0.55, +0.40) — **a sustain row made in a breakout week is ≤0.45; made in a drawdown week ≤0.40; never above 0.55**; (b) EVENT-RESTART rows (flows after a priced decision): under-confident twice — ≥0.55, BUT name the marginal narrative first (OCT 24 rule): if the equity tape or a shock is marginal, the restart precondition is unmet (the Nov 6 row is pre-registered that way); (c) composition bets stay humble; (d) the DAILY rule follows the Fed's next move ONLY when the Fed is the marginal narrative (broke Oct 22 on the Nasdaq; Oct 30 the theft + the Nasdaq).
- **REGULATION (N=4, +0.05):** leadership commitments are weak evidence vs floor reality; agency rows price off the instrument AND the clock; **rhetoric after a shock is not a calendar entry (NOV 2).**
- **PROTOCOL (N=5, +0.14):** heavily-evidenced non-events at 0.05; audit-gated completion rows ≤0.20.
- **MARKET STRUCTURE (N=3, −0.12):** tail price rows at 0.05 behave; scheduled decisions/publications with a stated clock ≥0.65 (Binance's PoR report at 0.85 — one slip already, so not 0.90).
- **MATRIX (ADOPTED SEP 26):** finals respect category floors/caps; the excluded-theme sympathy nudge is zeroed unless a mechanism is named. **NOV 2: the regime check flipped to CONTAGION for the first time since Jun 5; with no cluster theme drafted below 0.50 the cluster pairs transmitted nothing, which suppressed +0.10–0.11 of reinforcing lift on etfs/corporate/fed — the mode did its job without needing deficit weight.** Open for consolidation: exempt Fed-DECISION rows and agency-timing rows from the matrix (flagged 5 and 2 runs); contagion condition 1 should read the drafted THESIS probability; assign `exchange-security` deltas (0.00 this run).

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
| OCT 24, 2026 (audit + run) | −2 (seed exclusion) +1 | 0.20 (0.14) | Two May 18 seeds → no-resolution (rule 10). Strategy purchase HIT 0.75 (the Oct 19 8-K). Fed HOLD 0.70→0.75; mNAV 0.45→0.35 (data revision). THESIS-007 HELD 0.35. (condensed; git) |
| NOV 2, 2026 | **+3 resolved**, +2 rendered net-new (Dec 9 HIKE 0.70; Binance PoR report by Nov 9 0.85), +1 memory-only (a Friday close <$75K by Nov 27, 0.45); the Strategy purchase row RESTATED 0.75 → 0.65 | **0.20** (ledger 0.1952; memory 0.1957; rolling-20 **0.13**) | MONDAY cadence run (chained after market-news). **THREE resolutions:** Fed HOLD HIT 0.75 (0.0625 — Macro's first well-scored DECISION row); ETF 3-of-5 MISS 0.55 (0.3025 — the SUSTAIN prior's fourth miss; week 5 −$202.6M on the Oct 30 −$643.3M theft/rout day); 30Y ≥5.80% MISS 0.40 (0.16 — rule 7). Macro N=16 +0.30; ETF N=9 +0.09. The 0.70–0.90 band 3 of 3; the 0.50–0.70 band 6 of 15; the 0.30–0.50 band 2 of 10. **THESIS-007 RETIRED on #2 (and #4 crossed on secondary data); THESIS-006 RETIRED at its horizon (#5 crossed on the last day; price letter intact by 10%); THESIS-008 registered 0.55.** REGIME CONTAGION (first since Jun 5): finals exchange-security 0.85 (novel, 0.00 deltas), etfs 0.55, fed 0.70, corporate 0.65, clarity 0.10, policy 0.15 (flag, 2nd run). Contrarian: OCT 24 and OCT 16 bulls to the 0.10 floor (mechanisms gone); SEP 16 bull 0.40 → 0.35 (scores Dec 9); NEW custodial-wrapper BULL 0.25; first three contrarian RESOLUTIONS (all wrong; Σ 0.08). Heuristics #3 on notice (the Oct 26 idle above-basis filing). Macro texture (Treasury par Oct 30): 2Y 4.56 / 10Y 4.94 / 30Y 5.31; gold $3,907 (Nov 2); Brent $108.35; MSTR $131; mnav.com 1.12× (restated again); BTC $77,784 (Nov 2 11:33 UTC); Friday close Oct 30 $77,275. |

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
11. **A multi-week sustain row is capped where the ledger says, not where the week feels (NOV 2).** Four sustain misses at +0.40 to +0.65: the breakout week is the worst moment to price persistence.
