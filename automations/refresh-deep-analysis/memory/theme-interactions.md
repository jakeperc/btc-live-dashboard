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

If a theme pair is not in the matrix (novel theme, no prior), use delta 0.00 and note it in `next-run-briefing.md` for the next run to assess.

### Correlated-risk cluster

Themes whose probabilities co-move with the broad risk-asset / liquidity / cost-of-capital regime on the run's timescale, so their reinforcing couplings run BOTH ways (up in risk-on, down in a cascade):

`etfs`, `corporate-treasuries`, `fed-monetary-policy`.

This is exactly the Jun 2–5 cascade chain: ETF outflows → leveraged-liquidation cascade → corporate forced-selling, all under a hawkish-Fed cost-of-capital. Contagion transmission is fast and mechanistically real across these three.

**Excluded from the cluster** (keep the `reinforcing` rule even in a cascade):
- `clarity-act`, `sovereign-reserves`, `japan-fiea` (added JUL 26, 2026) — their thesis probabilities are process/horizon-driven. A Senate floor-vote's odds, a multi-year sovereign-reserve commitment, or a Japanese statute's implementation timeline do not mechanically fall because spot price cascaded over 72h. (Residual: under the default rule a bearish low-p source still contributes a *small* positive nudge to these — bounded by `delta × p(S)` with low p(S) — which is acceptable and flagged below for future Brier calibration.)
- `protocol-security` — engineering/idiosyncratic-driven; its matrix couplings are already ~0 or negative, so a macro cascade does not transmit through it. Contagion never flips a `protocol-security` pair.

### Why deficit-weighting, not a parallel negative matrix

The structural coupling *magnitude* between two themes is identical in both regimes — only the direction of transmission flips with the regime. Re-using the existing positive deltas (instead of maintaining a second negative matrix) keeps one source of truth, so a future Brier re-calibration of any delta corrects both regimes at once. Deficit-below-neutral weighting makes contagion **self-activating in the correct direction**: in a cascade the bearish-drafted themes (low p) are exactly the ones that transmit the down-push, while a theme that is NOT under stress (p ≥ 0.50) contributes nothing — so the mode cannot manufacture a rally out of a drawdown.

### Worked example — the Jun 2–5 2026 cascade (why this mode exists)

On the Jun 5 force-run the all-reinforcing matrix mechanically LIFTED `etfs` 0.35→0.50 and `corporate-treasuries` 0.45→0.60 in the middle of a downside cascade — exactly backward, since the real spillover ran DOWN (ETF outflows → leveraged-liquidation cascade → corporate forced-selling). That was the 3rd consecutive matrix flag (saturation May 20, double-clamp Jun 1, contagion-blindness Jun 5).

Under `contagion` regime the same inputs behave correctly. With `etfs` drafted 0.35, `corporate-treasuries` 0.45, and a hawkish `fed-monetary-policy` ~0.30 (all bearish, all in the cluster):
- `etfs` ← corp(`+0.10 × deficit 0.05`) = −0.005; fed(`+0.10 × deficit 0.20`) = −0.020 → net ≈ **−0.025** → 0.35 holds ~0.35 (not lifted to 0.50).
- `corporate-treasuries` ← etfs(`+0.10 × deficit 0.15`) = −0.015; fed(`+0.07 × deficit 0.20`) = −0.014 → net ≈ **−0.03** → 0.45 → ~0.40 (not lifted to 0.60).

The matrix now nudges DOWN-or-flat in a cascade instead of reinforcing UP. It remains a **secondary** adjustment layer — a directly-judged thesis probability (e.g. THESIS-003) still governs; the fix's purpose is that the matrix no longer pushes *backward*.

## Interaction matrix

| From \ To | clarity-act | etfs | sovereign-reserves | corporate-treasuries | protocol-security | fed-monetary-policy | japan-fiea | us-crypto-policy |
|---|---|---|---|---|---|---|---|---|
| **clarity-act** | -- | +0.08 | +0.05 | +0.10 | +0.03 | +0.04 | +0.04 | +0.05 |
| **etfs** | +0.08 | -- | +0.06 | +0.10 | -0.02 | +0.10 | +0.05 | +0.05 |
| **sovereign-reserves** | +0.05 | +0.06 | -- | +0.07 | +0.03 | +0.03 | +0.02 | +0.03 |
| **corporate-treasuries** | +0.10 | +0.10 | +0.07 | -- | +0.04 | +0.07 | +0.03 | +0.03 |
| **protocol-security** | +0.03 | -0.02 | +0.03 | +0.04 | -- | 0.00 | 0.00 | 0.00 |
| **fed-monetary-policy** | +0.04 | +0.10 | +0.03 | +0.07 | 0.00 | -- | 0.00 | 0.00 |
| **japan-fiea** | +0.04 | +0.05 | +0.02 | +0.03 | 0.00 | 0.00 | -- | +0.02 |
| **us-crypto-policy** | **-0.03** | +0.05 | +0.03 | +0.03 | 0.00 | 0.00 | +0.02 | -- |

## Pair reasoning

**clarity-act <-> etfs** (+0.08): Regulatory clarity removes compliance uncertainty for allocators. Clear rules -> institutional mandates unlock -> ETF inflows accelerate. Reverse: strong ETF demand creates lobbying pressure for faster regulatory clarity.

**clarity-act <-> sovereign-reserves** (+0.05): A legible legal framework makes BTC classifiable as a reserve asset. Sovereign treasuries require regulatory standing before allocation. Moderate coupling — sovereign decisions are multi-factor.

**clarity-act <-> corporate-treasuries** (+0.10): Strongest regulatory linkage. Corporate boards need legal clarity to justify BTC treasury positions to shareholders and auditors. Clarity removes personal liability risk for CFOs. Reverse: corporate adoption pressure accelerates legislative priority.

**clarity-act <-> protocol-security** (+0.03): Regulation drives audit/compliance scrutiny which indirectly improves protocol hygiene. Weak direct coupling — protocol security is primarily engineering-driven.

**etfs <-> sovereign-reserves** (+0.06): ETF legitimacy provides a familiar wrapper that sovereign wealth funds can reference. Sovereign comfort increases when a regulated product exists. Moderate coupling.

**etfs <-> corporate-treasuries** (+0.10): ETFs provide the allocation vehicle corporates prefer (regulated, custodied, auditable). Strong flows signal market depth that reduces corporate execution risk. Reverse: large corporate buyers create ETF demand.

**etfs <-> protocol-security** (-0.02): Slight negative — ETF flows are price-and-regulation driven, not protocol-driven. A protocol incident could trigger ETF outflows, but the base interaction is near-zero. Kept slightly negative as a reminder that protocol risk is an overlooked ETF tail risk.

**sovereign-reserves <-> corporate-treasuries** (+0.07): Sovereign legitimacy signals that BTC is durable infrastructure, giving corporate boards political cover. Reverse: corporate adoption normalizes the asset class for sovereign consideration.

**sovereign-reserves <-> protocol-security** (+0.03): Sovereign interest drives protocol scrutiny (nations audit what they hold). Weak but positive — security is a prerequisite, not a driver.

**corporate-treasuries <-> protocol-security** (+0.04): Corporate custody requires confidence in protocol security. A major exploit affecting a corporate holder would chill adoption. Positive because security confidence enables treasury moves.

**fed-monetary-policy <-> clarity-act** (+0.04): Loose monetary backdrop makes regulatory unlock more politically palatable (cheaper to legislate when markets aren't stressed); tight backdrop steals legislative bandwidth and risks pricing structural changes hostile to risk assets. Weak coupling — regulatory passage is mostly political not monetary.

**fed-monetary-policy <-> etfs** (+0.10): Strongest macro→theme linkage. Rate cuts directly boost ETF inflows via real-rates path and risk-asset bid; rate hikes / hawkish framing drive outflows. Reverse: large ETF flows occasionally enter Fed reaction function (financial-conditions index inputs).

**fed-monetary-policy <-> sovereign-reserves** (+0.03): Loose policy = dollar weakness = sovereign hedge demand. Weak coupling — sovereign decisions are multi-factor and operate on longer horizons than rate cycles.

**fed-monetary-policy <-> corporate-treasuries** (+0.07): Cost of capital materially affects Strategy ATM / STRC issuance economics and the broader corporate ability to issue convert debt for BTC purchases. Tight conditions compress NAV premiums and gate the cadence; loose conditions reopen the window.

**fed-monetary-policy <-> protocol-security** (0.00): No mechanism. Protocol is engineering-driven; rate cycles don't touch BIP signaling.

**us-crypto-policy pairs** (REAL deltas set SEP 13 — the matrix's first ASYMMETRIC pair): **policy → clarity-act −0.03** (substitution: a working administrative regime — the SEC's Regulation Crypto Assets in its comment window plus the CFTC's Aug 20 pledge to write rules under existing authority — lowers the cost of legislative failure and saps urgency from marginal supporters) but **clarity-act → policy +0.05** (legislative failure raises the administrative track's weight — Selig's pledge is explicitly conditional on Congress failing). ↔etfs +0.05 (the Aug 17–19 policy-shock restart is the one datapoint; the Sep 3 restart was Fed-driven). ↔corporate-treasuries +0.03 (a rulebook is a mild tailwind to treasury-company legitimacy; MSCI is the bigger corporate input). ↔sovereign-reserves +0.03 (SBR/stockpile rhetoric at the summit). ↔japan-fiea +0.02 (competitiveness precedent runs both ways). ↔fed / ↔protocol 0.00 (no mechanism). **NOT in the correlated-risk cluster** (process/agenda-driven; the Aug 19 8% day ran through positioning, not through the theme's probability). Symmetry note: the matrix stays symmetric everywhere except this pair; the reinforcing rule reads delta(S→T) row-wise, so the asymmetry applies naturally.

**japan-fiea pairs** (condensed AUG 19): ↔etfs +0.05 (second major-market ETF venue, TSE 2027 — slow-burn); ↔clarity-act +0.04 (competitiveness channel; carries the unlock alone when the U.S. slips — fired JUL 26); ↔corporate +0.03 (Metaplanet's home regime); ↔sovereign +0.02 (G7 classification precedent); ↔fed/protocol 0.00 (no mechanism). Theme file archived AUG 19 (5th quiet run) — row retained.

## Tuning notes

- **Regime is part of the model (JUN 5, 2026).** The matrix is no longer all-reinforcing: it applies `reinforcing` (default) or `contagion` (cascade) per Step 0. The *magnitudes* below are shared by both regimes; only the transmission sign flips. Calibrate magnitudes once; both regimes inherit the fix.
- Matrix is symmetric for now (delta A->B = delta B->A). Future runs may introduce asymmetry when evidence supports it.
- Deltas were initialized from structural reasoning, not empirical data. Calibrate against Brier outcomes: if cross-theme adjustments consistently improve or worsen forecast accuracy, update deltas accordingly. **Open calibration item:** the bounded positive nudge a bearish cluster source still gives the *excluded* themes (`clarity-act`, `sovereign-reserves`) under the default rule during a cascade — confirm via Brier whether it should be zeroed.
- When a new theme enters the top-5 that isn't in this matrix, add its row/column with 0.00 deltas and a note in `next-run-briefing.md` to assess interactions in the next run. Decide at that time whether it belongs in the correlated-risk cluster.
- Review and re-calibrate this matrix during quarterly `/consolidate-deep-analysis` runs.

Last updated: 2026-09-26 (Saturday cadence run; no delta changes. **Run notes:** regime reinforcing — contagion 0 of 3 (flows +$2.98B; the Sep 21 liquidations were ~$844M of SHORTS, upside and below $1B; Strategy bought). Top-5 slugs this run: `etfs` (slot 1 MARKETS), `fed-monetary-policy`, `us-crypto-policy` (slot 3’s rendered row is the CFTC ANPRM; `clarity-act` OUT — its cloture row is memory-only), `corporate-treasuries`, `sovereign-reserves` (RESTORED; slot 5 replaced `protocol-security`/Liquid). Finals: etfs 0.70 (standalone 0.55), fed 0.45 (0.35), policy 0.65 (0.60), corporate 0.75 (0.65), sovereign 0.30 (0.20). **Three flags for consolidation:** (1) the matrix lifted a Fed-INTENT row ABOVE its calibration cap (0.35→0.45) on ETF strength — no mechanism at this horizon; propose that finals respect category floors/caps; (2) the excluded-theme sympathy lift printed a THIRD time (sovereign +0.10 after clarity +0.10 on SEP 13 and SEP 16) — propose zeroing the bounded nudge for excluded themes unless a mechanism is named; the SEP 16 clarity test scores Sep 30 (standalone 0.05 vs final 0.15); (3) the fed↔etfs +0.10 delta’s own premise (“hawkish framing drives outflows”) failed this fortnight (flows +~$3B while Oct hike odds rose 44%→62%) — recalibrate the magnitude, or make it conditional on the event’s pricedness. The protocol→etfs −0.02 sign stays open (no custody-mix datapoint). The rounding rule (round half toward the standalone) is still un-adopted — no coin-flip rounding this run.) **Prior run notes (condensed SEP 26; full text in git):** 2026-09-16 (FOMC force-run: finals fed 0.45 / etfs 0.35 / corporate 0.45 / clarity 0.15 — TRIPLED on sympathy, the bounded-nudge test / protocol 0.65; the us-crypto-policy asymmetric pair’s first observation — clarity→policy +0.05 SUPPORTED, policy→clarity −0.03 UNOBSERVED). 2026-09-13 (REAL deltas for `us-crypto-policy` — asymmetric ↔clarity-act −0.03 / +0.05; NOT in the cluster; two finals rounded into 0.50 → the rounding rule proposed). 2026-08-19 (`us-crypto-policy` row added at 0.00; cluster call: process-driven, excluded). 2026-07-26 (`japan-fiea` row added; excluded). 2026-06-05 (contagion regime added; magnitudes unchanged from 2026-05-29).
