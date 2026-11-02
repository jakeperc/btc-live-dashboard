# Theme Interaction Matrix

Cross-theme reinforcement/contradiction model for the Phase 3b interaction pass. Each pair has a base delta (+reinforces, -contradicts) and a reasoning chain. Deltas are applied weighted by the source theme's probability, capped at +/-0.15 net adjustment per theme. **The pass is regime-aware (see Step 0):** in `reinforcing` mode (default) couplings transmit UP; in `contagion` mode (a deleveraging cascade) the correlated-risk cluster transmits DOWN. Same magnitudes, regime-dependent sign.

## Application rules

### Step 0 — Determine the interaction regime (NEW — JUN 5, 2026)

The same structural coupling between two themes transmits **upward** in an accumulation regime and **downward** in a deleveraging cascade — the matrix *magnitudes* are regime-neutral; the *sign of transmission* is not. Before applying any deltas, classify this run into exactly one regime:

- **`reinforcing` (default — risk-on / neutral).** Strength in one theme reinforces its correlated neighbors UP. This is the original behavior and the default whenever the contagion trigger below is not met.
- **`contagion` (risk-off / broad deleveraging cascade).** Weakness in one correlated theme propagates DOWN to its neighbors. Activate **only** when **≥2 of these three observable conditions hold concurrently this run**:
  1. A multi-week spot-ETF net-outflow streak is active **and** the `etfs` theme is being drafted bearish (p(etfs) < 0.40, on distribution rather than accumulation).
  2. A forced-liquidation cascade occurred in the run window — ≥$1B leveraged-position liquidations **or** ≥15% drawdown over ≤7 days (i.e., the cross-current **"Leverage-cascade × ETF-outflow feedback loop"** is active).
  3. Cross-theme spillover is observably running downward — a corporate forced/mechanical sale, NAV-premium compression closing issuance windows, or a sovereign forced drawdown (the cross-current **"Forced-dividend sale: the corporate floor's pro-cyclical leak"** is active).

  These conditions are the observable surface of causal-model edges `etf-passive-outflow + leverage → reflexive-liquidation-cascade` and `nav-premium-compression → corporate-accumulation-slowdown → forced-marginal-selling`. Record the chosen regime in `themeInteractions.regime` and note it in one line in `next-run-briefing.md`.

### Step 1 — Apply deltas (regime-dependent)

For each theme T in the current top-5, start with draft probability p(T) from Phase 3. Then for each other theme S in the top-5, compute a weighted delta:

**`reinforcing` regime (default):**
- `weighted_delta = delta(S->T) * p(S)`  — pushes in the delta's own sign, scaled by how strong S is.

**`contagion` regime:**
- Apply the contagion rule **only** to ordered pairs where **both S and T are in the correlated-risk cluster** (below) **and** `delta(S->T) > 0` (a reinforcing pair). Every other pair — any pair touching `protocol-security`, any already-`contradicting` pair, and any pair touching a non-cluster theme — keeps the default `reinforcing` rule above.
- Contagion weight = source theme's **deficit below neutral**: `contagion_weight = max(0, 0.50 - p(S))`. A theme drafted bearish (low p) transmits that weakness; a theme at/above neutral transmits nothing (weight 0 — **contagion never lifts**).
- `weighted_delta = -delta(S->T) * contagion_weight`  — same magnitude scale as the reinforcing matrix, sign forced DOWN.

**Both regimes — finish:**
1. Sum all weighted deltas for T. Clamp the sum to [-0.15, +0.15].
2. Adjusted probability: `clamp(p(T) + net_adjustment, 0.05, 0.95)`. Round to 0.05.
3. **Category floor/cap check (ADOPTED at the Q3 2026 consolidation).** If `calibration.md`'s active bias corrections name a hard cap or floor for T's category (e.g. the MACRO Fed-INTENT rule: "any 'softer than the market' row ≤0.35 until one resolves soft"), the matrix final may NOT cross that cap/floor. If the summed adjustment would, clamp the final AT the cap/floor instead and log it as a capped adjustment (not a silent drop) in the run's `adjustments[]` reasoning. Rationale: the SEP 16 run let ETF strength lift a Fed-HOLD row from a calibration-capped 0.35 to a matrix final of 0.45 with no named mechanism — the matrix is a secondary layer and must not override a floor/cap the ledger paid Brier points to learn.
4. **Zero the excluded-theme sympathy nudge unless a mechanism is named (ADOPTED at the Q3 2026 consolidation).** For any pair where T is an excluded theme (`clarity-act`, `sovereign-reserves`, `japan-fiea`) and S is IN the correlated-risk cluster, the default `reinforcing` rule (Step 1) still computes a weighted delta — but before summing it into T's net adjustment, check whether this run's draft names a live mechanism connecting S's strength to T specifically (e.g., "ETF strength supports sovereign legitimacy because X"). If no mechanism is named, set that pair's weighted delta to 0.00 for this run. Rationale: the excluded-theme sympathy lift fired three times with no named mechanism (`clarity-act` +0.10 twice, `sovereign-reserves` +0.10 once, all from cluster strength alone) — a bounded nudge with no mechanism is noise wearing a number, and the whole point of excluding these themes from the cluster was that their probabilities are process/horizon-driven, not tape-driven.

If a theme pair is not in the matrix (novel theme, no prior), use delta 0.00 and note it in `next-run-briefing.md` for the next run to assess.

### Correlated-risk cluster

Themes whose probabilities co-move with the broad risk-asset / liquidity / cost-of-capital regime on the run's timescale, so their reinforcing couplings run BOTH ways (up in risk-on, down in a cascade):

`etfs`, `corporate-treasuries`, `fed-monetary-policy`.

This is exactly the Jun 2–5 cascade chain: ETF outflows → leveraged-liquidation cascade → corporate forced-selling, all under a hawkish-Fed cost-of-capital. Contagion transmission is fast and mechanistically real across these three.

**Excluded from the cluster** (keep the `reinforcing` rule even in a cascade):
- `clarity-act`, `sovereign-reserves`, `japan-fiea` (added JUL 26, 2026) — their thesis probabilities are process/horizon-driven. A Senate floor-vote's odds, a multi-year sovereign-reserve commitment, or a Japanese statute's implementation timeline do not mechanically fall because spot price cascaded over 72h. (Residual: under the default rule a bearish low-p source still contributes a *small* positive nudge to these — bounded by `delta × p(S)` with low p(S) — which is acceptable and flagged below for future Brier calibration.)
- `protocol-security` — engineering/idiosyncratic-driven; its matrix couplings are already ~0 or negative, so a macro cascade does not transmit through it. Contagion never flips a `protocol-security` pair.

### Why deficit-weighting, not a parallel negative matrix

One set of magnitudes, regime-dependent sign: a future Brier re-calibration corrects both regimes at once, and deficit-below-neutral weighting makes contagion self-activating in the right direction (only bearish-drafted themes transmit; p ≥ 0.50 contributes nothing — the mode cannot manufacture a rally out of a drawdown).

### Worked example — the Jun 2–5 2026 cascade (why this mode exists; condensed OCT 7, full arithmetic in git)

On the Jun 5 force-run the all-reinforcing matrix LIFTED `etfs` 0.35→0.50 and `corporate-treasuries` 0.45→0.60 in the middle of a downside cascade — backward. Under `contagion` the same inputs (etfs 0.35, corporate 0.45, fed ~0.30) net to ≈ −0.025 / −0.03 — flat-to-down, as the cascade ran. The matrix remains a **secondary** layer; a directly-judged thesis probability governs.

## Interaction matrix

| From \ To | clarity-act | etfs | sovereign-reserves | corporate-treasuries | protocol-security | fed-monetary-policy | japan-fiea | us-crypto-policy | exchange-security |
|---|---|---|---|---|---|---|---|---|---|
| **clarity-act** | -- | +0.08 | +0.05 | +0.10 | +0.03 | +0.04 | +0.04 | +0.05 | 0.00 |
| **etfs** | +0.08 | -- | +0.06 | +0.10 | -0.02 | +0.07 | +0.05 | +0.05 | 0.00 |
| **sovereign-reserves** | +0.05 | +0.06 | -- | +0.07 | +0.03 | +0.03 | +0.02 | +0.03 | 0.00 |
| **corporate-treasuries** | +0.10 | +0.10 | +0.07 | -- | +0.04 | +0.07 | +0.03 | +0.03 | 0.00 |
| **protocol-security** | +0.03 | -0.02 | +0.03 | +0.04 | -- | 0.00 | 0.00 | 0.00 | 0.00 |
| **fed-monetary-policy** | +0.04 | +0.07 | +0.03 | +0.07 | 0.00 | -- | 0.00 | 0.00 | 0.00 |
| **japan-fiea** | +0.04 | +0.05 | +0.02 | +0.03 | 0.00 | 0.00 | -- | +0.02 | 0.00 |
| **us-crypto-policy** | **-0.03** | +0.05 | +0.03 | +0.03 | 0.00 | 0.00 | +0.02 | -- | 0.00 |
| **exchange-security** (NEW NOV 2 — novel; assess next run) | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | -- |

## Pair reasoning

**clarity-act <-> etfs** (+0.08): Regulatory clarity removes compliance uncertainty for allocators. (condensed OCT 24; git)

**clarity-act <-> sovereign-reserves** (+0.05): A legible legal framework makes BTC classifiable as a reserve asset. (condensed OCT 24; git)

**clarity-act <-> corporate-treasuries** (+0.10): Strongest regulatory linkage. (condensed OCT 24; git)

**clarity-act <-> protocol-security** (+0.03): Regulation drives audit/compliance scrutiny which indirectly improves protocol hygiene. (condensed OCT 24; git)

**etfs <-> sovereign-reserves** (+0.06): ETF legitimacy provides a familiar wrapper that sovereign wealth funds can reference. (condensed OCT 24; git)

**etfs <-> corporate-treasuries** (+0.10): ETFs provide the allocation vehicle corporates prefer (regulated, custodied, auditable). (condensed OCT 24; git)

**etfs <-> protocol-security** (-0.02): Slight negative — ETF flows are price-and-regulation driven, not protocol-driven. (condensed OCT 24; git)

**sovereign-reserves <-> corporate-treasuries** (+0.07): Sovereign legitimacy signals that BTC is durable infrastructure, giving corporate boards political cover. (condensed OCT 24; git)

**sovereign-reserves <-> protocol-security** (+0.03): Sovereign interest drives protocol scrutiny (nations audit what they hold). (condensed OCT 24; git)

**corporate-treasuries <-> protocol-security** (+0.04): Corporate custody requires confidence in protocol security. (condensed OCT 24; git)

**fed-monetary-policy <-> clarity-act** (+0.04): Loose monetary backdrop makes regulatory unlock more politically palatable (cheaper to legislate when markets aren't stressed); tight backdrop steals legislative bandwidth and risks pricing structural changes hostile to risk assets. (condensed OCT 24; git)

**fed-monetary-policy <-> etfs** (+0.07, downgraded from +0.10 at the Q3 2026 consolidation): rate cuts/dovish framing still boost inflows most weeks via the real-rates path, but the mechanism is EVENT-gated, not outcome-gated — see the consolidation stamp below and `causal-model.md`'s `fed-rate-cut-signaling` edge for the SEP 26 test that triggered the downgrade.

**fed-monetary-policy <-> sovereign-reserves** (+0.03): Loose policy = dollar weakness = sovereign hedge demand. (condensed OCT 24; git)

**fed-monetary-policy <-> corporate-treasuries** (+0.07): Cost of capital materially affects Strategy ATM / STRC issuance economics and the broader corporate ability to issue convert debt for BTC purchases. (condensed OCT 24; git)

**fed-monetary-policy <-> protocol-security** (0.00): No mechanism. (condensed OCT 24; git)

**exchange-security pairs** (NEW NOV 2 — all 0.00 on the first run, playbook 18d): a custodial-exchange failure (the Binance theft) is not a protocol event, so the `protocol-security` row's hygiene deltas do not apply. Candidates for the next run: → etfs NEGATIVE on the day (−$643.3M; the adjacent-layer 'wrapper advantage' edge took a counter-instance) but possibly positive over weeks if exits land in wrappers — sign OPEN; → clarity-act and → us-crypto-policy POSITIVE (both tracks cited the theft within 24h — urgency, not a clock, so small: +0.02/+0.03); → corporate-treasuries 0.00; → fed 0.00. Not in the correlated-risk cluster (idiosyncratic driver); contagion never flips its pairs.

**us-crypto-policy pairs** (REAL deltas set SEP 13 — the matrix's first ASYMMETRIC pair): **policy → clarity-act −0.03** (substitution: a working administrative regime saps legislative urgency) but **clarity-act → policy +0.05** (legislative failure raises the administrative track's weight). (condensed OCT 24; git)

**japan-fiea pairs** (condensed AUG 19): ↔etfs +0.05 (second major-market ETF venue, TSE 2027 — slow-burn); ↔clarity-act +0.04 (competitiveness channel; carries the unlock alone when the U.S. (condensed OCT 24; git)

## Tuning notes

- **Regime is part of the model (JUN 5, 2026).** The matrix is no longer all-reinforcing: it applies `reinforcing` (default) or `contagion` (cascade) per Step 0. The *magnitudes* below are shared by both regimes; only the transmission sign flips. Calibrate magnitudes once; both regimes inherit the fix.
- Matrix is symmetric for now (delta A->B = delta B->A). Future runs may introduce asymmetry when evidence supports it.
- Deltas were initialized from structural reasoning, not empirical data. Calibrate against Brier outcomes: if cross-theme adjustments consistently improve or worsen forecast accuracy, update deltas accordingly. **Open calibration item:** the bounded positive nudge a bearish cluster source still gives the *excluded* themes (`clarity-act`, `sovereign-reserves`) under the default rule during a cascade — confirm via Brier whether it should be zeroed.
- When a new theme enters the top-5 that isn't in this matrix, add its row/column with 0.00 deltas and a note in `next-run-briefing.md` to assess interactions in the next run. Decide at that time whether it belongs in the correlated-risk cluster.
- Review and re-calibrate this matrix during quarterly `/consolidate-deep-analysis` runs.

**Q3 2026 CONSOLIDATION (SEP 26, 2026) — three flags resolved, rule changes above (Step 1, items 3–4) and the fed↔etfs delta (0.10→0.07):** (1) matrix finals now respect category calibration floors/caps; (2) the excluded-theme sympathy nudge (fired 3×: clarity-act +0.10 twice, sovereign-reserves +0.10 once, all mechanism-less) is zeroed by default, on unless a mechanism is named that run; (3) fed↔etfs recalibrated to +0.07, matching the causal-model edge's medium-strength downgrade. The protocol→etfs −0.02 sign stays open (no custody-mix datapoint yet). The rounding rule (round-half-toward-standalone) stays un-adopted — no case has yet required it. Next consolidation: check whether rules (3)–(4) reduced matrix-attributable Brier error; Oct 28 is the fed↔etfs delta's next clean test.

Last updated: 2026-11-02 (Monday cadence run; **regime CONTAGION — the first activation since Jun 5:** condition 1 NOT met on the letter (week 4 Oct 19–23 +$301.2M broke the streak; the thesis is 0.55), condition 2 MET (Oct 30 ~$1.5–1.6B of crypto liquidations, ~80% longs — CoinGlass via three outlets), condition 3 MET (Strategy's Oct 26 8-K: zero ATM, no purchase, cash $242.4M; the Q3 8-K: 5,552 BTC sold in-quarter for dividends/buybacks; MSTR −10%; mnav.com 1.12× restated / equity-only ≈ 0.8× — the issuance window shut). Six matrix themes: `exchange-security` slot 1 (NOVEL, 0.00 deltas), `fed-monetary-policy` (Dec HIKE 0.70), `corporate-treasuries` (0.65), `clarity-act` + `us-crypto-policy` (slot 4's two tracks), `etfs` (slot 5 / the flow leg, 0.55). Under contagion no cluster theme sat below 0.50, so every cluster pair transmitted 0 — the reinforcing rule would have lifted etfs +0.114 (to the 0.60 cap), corporate +0.104 (→ 0.75), fed +0.084 (→ 0.80); the regime suppressed all three. Finals: exchange-security 0.85 (0.85), etfs 0.55 (0.55; +0.013), fed 0.70 (0.70; +0.004), corporate 0.65 (0.65; +0.013), clarity 0.10 (0.10; rule 4 zeroed +0.137; policy→clarity −0.003), policy 0.15 (0.10; +0.052 — the agency-timing flag, 2nd run). Observation for consolidation: deficit weighting never engaged because the cluster standalones were all EVENT rows (a hike, a buy, a restart) rather than state rows — contagion condition 1's 'read the drafted thesis' amendment would not have changed that; consider letting the thesis probability stand in as p(etfs) when the etfs row is an event row.) **Prior: 2026-10-24** (condensed NOV 2; git — Saturday cadence run; regime reinforcing — contagion 0 of 3: condition 1 NOT met (the outflow streak broke — week 4 +$301.2M — so the "read the thesis, not the held row" flag did not bite: the thesis is 0.35 but the streak test fails first), condition 2 a NEAR-MISS (Oct 24 ~$828M / $699M longs; −6.3%/7d), condition 3 not met (the ATM open at $22.0M; no forced sale; mnav.com restated — 1.18×). Top-5 → FIVE matrix themes: `etfs` slot 1 (slot 5's new-wrappers card shares the slug — counted once), `fed-monetary-policy`, `clarity-act` (the rendered lame-duck row) AND `us-crypto-policy` (RE-ENTERS — slot 3's card is the agency track; its memory NPRM row 0.10 is the standalone), `corporate-treasuries`; `sovereign-reserves` EXITS (card demoted; row memory-only). Finals: etfs 0.60 (0.55; raw +0.1405 → 0.70 → CAPPED — rule 3's third application), fed 0.85 (0.75; +0.095 — the no-mechanism flag, 4th run), clarity 0.10 (0.10; rule 4 zeroed +0.149 of c … (condensed NOV 2; git)
