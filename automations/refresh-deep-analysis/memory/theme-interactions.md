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
- Apply the contagion rule **only** to ordered pairs where **both S and T are in the correlated-risk cluster** (below) **and** `delta(S->T) > 0` (a reinforcing pair). Every other pair — any pair touching `protocol-security` or `exchange-security`, any already-`contradicting` pair, and any pair touching a non-cluster theme — keeps the default `reinforcing` rule above.
- Contagion weight = source theme's **deficit below neutral**: `contagion_weight = max(0, 0.50 - p(S))`. A theme drafted bearish (low p) transmits that weakness; a theme at/above neutral transmits nothing (weight 0 — **contagion never lifts**).
- `weighted_delta = -delta(S->T) * contagion_weight`  — same magnitude scale as the reinforcing matrix, sign forced DOWN.

**Both regimes — finish:**
1. Sum all weighted deltas for T. Clamp the sum to [-0.15, +0.15].
2. Adjusted probability: `clamp(p(T) + net_adjustment, 0.05, 0.95)`. Round to 0.05.
3. **Category floor/cap check (ADOPTED at the Q3 2026 consolidation).** If `calibration.md`'s active bias corrections name a hard cap or floor for T's category, the matrix final may NOT cross it. Clamp AT the cap/floor and log it as a capped adjustment in the run's `adjustments[]` reasoning. Rationale: the SEP 16 run let ETF strength lift a Fed-HOLD row from a calibration-capped 0.35 to 0.45 with no named mechanism — the matrix is a secondary layer.
4. **Zero the excluded-theme sympathy nudge unless a mechanism is named (ADOPTED at the Q3 2026 consolidation).** For any pair where T is an excluded theme (`clarity-act`, `sovereign-reserves`, `japan-fiea`) and S is IN the correlated-risk cluster, set that pair's weighted delta to 0.00 unless this run's draft names a live mechanism connecting S's strength to T specifically. Rationale: the sympathy lift fired three times with no named mechanism — noise wearing a number.

If a theme pair is not in the matrix (novel theme, no prior), use delta 0.00 and note it in `next-run-briefing.md` for the next run to assess.

### Correlated-risk cluster

Themes whose probabilities co-move with the broad risk-asset / liquidity / cost-of-capital regime on the run's timescale, so their reinforcing couplings run BOTH ways (up in risk-on, down in a cascade):

`etfs`, `corporate-treasuries`, `fed-monetary-policy`.

This is exactly the Jun 2–5 cascade chain: ETF outflows → leveraged-liquidation cascade → corporate forced-selling, all under a hawkish-Fed cost-of-capital.

**Excluded from the cluster** (keep the `reinforcing` rule even in a cascade):
- `clarity-act`, `sovereign-reserves`, `japan-fiea` (added JUL 26, 2026) — process/horizon-driven probabilities.
- `protocol-security` — engineering/idiosyncratic-driven; its couplings are ~0 or negative.
- `exchange-security` (added NOV 2, 2026) — idiosyncratic custodial driver; contagion never flips its pairs.

### Why deficit-weighting, not a parallel negative matrix

One set of magnitudes, regime-dependent sign: a future Brier re-calibration corrects both regimes at once, and deficit-below-neutral weighting makes contagion self-activating in the right direction (only bearish-drafted themes transmit; p ≥ 0.50 contributes nothing — the mode cannot manufacture a rally out of a drawdown).

### Worked example — the Jun 2–5 2026 cascade (why this mode exists; condensed OCT 7, full arithmetic in git)

On the Jun 5 force-run the all-reinforcing matrix LIFTED `etfs` 0.35→0.50 and `corporate-treasuries` 0.45→0.60 in the middle of a downside cascade — backward. Under `contagion` the same inputs net to ≈ −0.025 / −0.03 — flat-to-down, as the cascade ran. The matrix remains a **secondary** layer; a directly-judged thesis probability governs.

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
| **exchange-security** (deltas ASSIGNED NOV 9) | **+0.02** | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | **+0.03** | -- |

## Pair reasoning

**clarity-act <-> etfs** (+0.08): Regulatory clarity removes compliance uncertainty for allocators. (condensed OCT 24; git)

**clarity-act <-> sovereign-reserves** (+0.05): A legible legal framework makes BTC classifiable as a reserve asset.

**clarity-act <-> corporate-treasuries** (+0.10): Strongest regulatory linkage.

**clarity-act <-> protocol-security** (+0.03): Regulation drives audit/compliance scrutiny.

**etfs <-> sovereign-reserves** (+0.06): ETF legitimacy provides a familiar wrapper sovereign funds can reference.

**etfs <-> corporate-treasuries** (+0.10): ETFs provide the allocation vehicle corporates prefer.

**etfs <-> protocol-security** (-0.02): ETF flows are price-and-regulation driven, not protocol-driven.

**sovereign-reserves <-> corporate-treasuries** (+0.07): Sovereign legitimacy gives corporate boards political cover.

**sovereign-reserves <-> protocol-security** (+0.03): Nations audit what they hold.

**corporate-treasuries <-> protocol-security** (+0.04): Corporate custody requires confidence in protocol security.

**fed-monetary-policy <-> clarity-act** (+0.04): A loose backdrop makes regulatory unlock more politically palatable; a tight one steals bandwidth.

**fed-monetary-policy <-> etfs** (+0.07, downgraded from +0.10 at the Q3 2026 consolidation): the mechanism is EVENT-gated and Fed-marginal-only — see `causal-model.md`'s `fed-rate-cut-signaling` edge (observation 17, NOV 9).

**fed-monetary-policy <-> sovereign-reserves** (+0.03): Loose policy = dollar weakness = sovereign hedge demand.

**fed-monetary-policy <-> corporate-treasuries** (+0.07): Cost of capital affects Strategy ATM / STRC issuance economics and convert-debt funding.

**fed-monetary-policy <-> protocol-security** (0.00): No mechanism.

**exchange-security pairs** (ASSIGNED NOV 9 from the NOV 2 → NOV 9 fortnight): → clarity-act **+0.02** and → us-crypto-policy **+0.03** — the theft produced same-day urgency on both tracks (Lummis, Waters, Selig) and FinCEN's MEXC order followed within eight days (pre-planned, but the enforcement track moved while the statute waited); urgency is not a clock, so small. → etfs **0.00** — the week after the theft the funds lost $1.28B on the Nasdaq and the jobs print, so no sign is attributable to the exchange (the adjacent-layer wrapper edge is 0-for-2, both confounded); → corporate-treasuries and → fed 0.00 (none observed). Not in the correlated-risk cluster; contagion never flips its pairs. Row/column stays even when the theme is out of the top-5 (NOV 9) so the next exchange failure inherits them.

**us-crypto-policy pairs** (REAL deltas set SEP 13 — the matrix's first ASYMMETRIC pair): **policy → clarity-act −0.03** (substitution) but **clarity-act → policy +0.05** (legislative failure raises the administrative track's weight).

**japan-fiea pairs** (condensed AUG 19): ↔etfs +0.05; ↔clarity-act +0.04 (competitiveness channel).

## Tuning notes

- **Regime is part of the model (JUN 5, 2026).** The *magnitudes* are shared by both regimes; only the transmission sign flips.
- Matrix is symmetric for now except the policy/clarity pair; future runs may introduce asymmetry when evidence supports it.
- Deltas were initialized from structural reasoning, not empirical data. Calibrate against Brier outcomes. **Open calibration item:** the bounded positive nudge a bearish cluster source still gives the *excluded* themes under the default rule — zeroed by rule 4 since SEP 26; confirm via Brier.
- When a new theme enters the top-5 that isn't in this matrix, add its row/column with 0.00 deltas and a note in `next-run-briefing.md`; decide at that time whether it belongs in the correlated-risk cluster.
- Review and re-calibrate this matrix during quarterly `/consolidate-deep-analysis` runs.

**Q3 2026 CONSOLIDATION (SEP 26, 2026):** (1) matrix finals respect category calibration floors/caps; (2) the excluded-theme sympathy nudge zeroed unless a mechanism is named; (3) fed↔etfs recalibrated to +0.07. Open for the next consolidation: exempt Fed-DECISION rows (flag on its 6th run NOV 9) and agency-timing rows (3rd run) from the matrix; let the thesis probability stand in for p(etfs) when the etfs row is an event row (NOV 2 observation — moot NOV 9, where the etfs row was a state-like restart row at 0.35); check whether rules (3)–(4) reduced matrix-attributable Brier error.

Last updated: 2026-11-09 (Monday cadence run; **regime CONTAGION — 2nd consecutive run:** condition 1 MET for the FIRST time on the letter (a two-week outflow streak — Oct 30 −$202.6M, Nov 6 −$1,281.7M — AND p(etfs) drafted 0.35 < 0.40); condition 2 MET (Nov 5 ≥$1B of liquidations — CoinGlass via crypto.news $1.08B / Coinotag $1.24B / PANews $1.66B; rule 11 cleared); condition 3 NOT met (Strategy's ATM REOPENED at $164.0M; no forced sale confirmed — Trump Media's collateral move is not a sale until filed). Five matrix themes: `etfs` (slot 1's flow leg + slot 5's access routes — the Nov 13 restart row 0.35), `fed-monetary-policy` (Dec HIKE 0.75), `corporate-treasuries` (the Nov 9/16 purchase 0.65), `clarity-act` + `us-crypto-policy` (slot 4's two tracks); `exchange-security` OUT (no card; deltas assigned above). **Deficit weighting ENGAGED for the first time:** etfs weight max(0, 0.50 − 0.35) = 0.15 → fed −0.07×0.15 = −0.0105, corporate −0.10×0.15 = −0.015 — both rounded away, so the finals equal the standalones, but the mode transmitted for the first time in its history. Finals: etfs 0.35 (0.35; +0.013), fed 0.75 (0.75; −0.0065 — the Fed-DECISION flag, 6th run), corporate 0.65 (0.65; −0.002), clarity 0.10 (0.10; rule 4 zeroed +0.123; policy→clarity −0.003), policy 0.15 (0.10; +0.042 — the agency-timing flag, 3rd run).) **Prior: 2026-11-02** (condensed NOV 9; git — regime CONTAGION, the first activation since Jun 5, on conditions 2 + 3; six themes incl. the NOVEL `exchange-security` at 0.00; no cluster theme below 0.50, so the cluster pairs transmitted nothing while the reinforcing lifts they would have given etfs/corporate/fed were suppressed; finals exchange-security 0.85, etfs 0.55, fed 0.70, corporate 0.65, clarity 0.10, policy 0.15.) **Prior: 2026-10-24** (condensed; git — regime reinforcing; etfs capped 0.70 → 0.60 under rule 3; fed 0.85 with the no-mechanism flag; us-crypto-policy re-entered.)
