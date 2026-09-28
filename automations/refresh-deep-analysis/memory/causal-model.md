# Causal Model

**Explicit "X drives Y" graph.** Each edge has direction, strength estimate, supporting evidence, and `last refreshed` date. Refined every run; weakened by contradicting evidence; archived when dormant. **Condensed SEP 13, 2026** — evidence arcs are summarized; full per-run text lives in git.

Strength scale: `weak` (often coincident, not causal) / `medium` (causal in most cases, exceptions exist) / `strong` (near-deterministic in the observed regime).

This is what lets the analysis go from "list of events" to "model of the system."

## Active edges

### Regulation & legal classification

- **federal-commodity-classification → institutional-allocation-unlock**
  - Strength: `strong` (mechanism; still untested — no statute yet)
  - Mechanism: pensions/endowments/insurance balance sheets are gated by legal-opinion ambiguity; commodity classification removes the gate.
  - Evidence: industry counsel commentary; the absence of major allocators despite ETF availability; the May 14 markup preserved classification. The Sep 15 cloture vote (0.15) is the 2026 test; failure defers the statute to the 120th Congress and leaves the mechanism to Japan's FIEA (2027 rails) and U.S. agency rules.
  - Last refreshed: SEP 13, 2026
- **federal-commodity-classification → sovereign-reserve-durability**
  - Strength: `medium` · Mechanism: without classification the next administration can re-characterize and unwind via custodian enforcement. Evidence: the Trump EO depends on classification stability. Last refreshed: MAY 18, 2026
- **stablecoin-amendments-attached → clarity-passage-slip**
  - Strength: `medium` · Mechanism: scope expansion fractures the coalition. Evidence: GENIUS 2025 passed narrow; the May 14 markup kept stablecoin/DeFi amendments off; **SEP 13:** the Sep 10 GOP substitute added DeFi provisions (Agriculture section) but left stablecoin REWARDS unchanged — one of the three Democratic demands stays unresolved into the vote. Last refreshed: SEP 13, 2026
- **ethics-amendments-attached → clarity-floor-friction**
  - Strength: `medium` → `strong` (UPGRADED SEP 13 — the ethics demand is THE blocking issue at the floor)
  - Mechanism: officials-can't-profit provisions hit at the floor where members face press scrutiny; the president's family crypto businesses make it a partisan identity vote.
  - Evidence: Van Hollen amendment failed 11–13 in committee (May 14); the merged draft omitted Section 604 → Murphy/Van Hollen/Merkley defected (Jul 17); Tillis–Gallego compromise sent to the White House (late Jul), unanswered; **SEP 8: Tillis — "If there's no interest in the White House in trying to bridge the gap on the ethics language, it is going to fail."** The vote-math variable is a White House answer, not a Senate one. **SEP 15–16 — the edge decided the vote: cloture failed 49–50, every Democrat present no; the GOP's "last, best, and final" text (an issuance ban; divest-or-blind-trust) did not reach the president's EXISTING crypto income, which no text short of divestment could clear (Warner: "impossible for me to support moving forward"). (Condensed SEP 26; full text in git.)** [Senate Daily Press](https://www.dailypress.senate.gov/tuesday-september-15-2026/) · [Gallego](https://www.gallego.senate.gov/news/press-releases/gallego-statement-on-failed-clarity-act-cloture-vote/)
  - Last refreshed: SEP 16, 2026
- **must-pass-bill-standoff / floor-time-scarcity → pending-crypto-legislation-slips**
  - Strength: `strong`
  - Mechanism: floor time, not votes, binds second-tier legislation when leadership must prioritize appropriations/nominations; a must-pass standoff consumes the window and the bill slips on timing alone. Corollary (vote-banking, AUG 7): leadership defers a doomed cloture vote when a better window exists — and SPENDS it when none does.
  - Evidence (condensed SEP 26 consolidation; git): five congestion instances stepped the CLARITY watch 0.40→0.20 with no vote-math change (JUN 24–AUG 7); the absence condition then confirmed (CR signed ~Sep 3, the vote proceeded on schedule) and vote-banking's second half confirmed (spent Sep 15, lost 49–50; banked asset = the motion to reconsider). **SEP 26 — the bottleneck made literal:** House out until Nov 9, Senate out until Nov 9, CR expires Dec 11 — three crypto bills (CLARITY's reconsider motion; H.R. 8957, 28–21; H.R. 10357, 38–5) share ~4–5 session weeks with appropriations and the NDAA. The H.R. 8957 House-passage row (0.20) is priced on THIS edge, not on merits.
  - Last refreshed: SEP 26, 2026
- **administrative-rulemaking-substitution ↔ legislative-urgency**
  - Strength: `weak/medium` (two-signed; the momentum leg observed SEP 16, the substitution leg not)
  - Mechanism: a regulator building BY RULE what a stalled bill would build BY STATUTE both saps urgency (substitution) and makes 'no' look like obstruction (momentum); a rule can be litigated/rescinded, a statute cannot — so substitution is partial by construction.
  - Evidence (condensed SEP 26; git): SEC Regulation Crypto Assets (Aug 18; comments to Oct 20). **SEP 13–16: Selig made the substitution leg explicit (Aug 20: "I will direct CFTC staff to move swiftly to propose these new rules"); at the vote the substitution leg did NOT show (Democrats cited ethics) but the momentum leg fired within 24h (Atkins "with or without legislation"; Selig "locked in and ready to ship") — deltas set asymmetric (policy→clarity −0.03 / clarity→policy +0.05); JPMorgan: agency rules "less durable than legislative statutes".** [CFTC](https://www.cftc.gov/PressRoom/SpeechesTestimony/opaselig10) **SEP 26 — the momentum leg's SECOND and THIRD observations: the SEC's Innovation Exemption (Sep 17, release 2026-90 — tokenized NMS stocks on-chain for five years) and the CFTC's PRE-RULE (RIN 3038-AF80) filed with OIRA on Sep 17. Instrument note: the CFTC chose the ANPRM route → NPRM 2027 → final late 2027 — substitution is SLOWER than the pledges implied; the NPRM row restated 0.55→0.10 and an ANPRM-publication row seeded at 0.60. Strength stays weak/medium: the substitution leg (a legislator citing the agency track as a reason to wait) remains unobserved.**
  - Last refreshed: SEP 26, 2026
- **index-inclusion-screen → treasury-model-financing-pressure**
  - Strength: `weak` (mechanism named; transmission not yet observed)
  - Mechanism: an index provider's non-operating-company screen converts passive ownership into a conditional forced-selling channel against leveraged-treasury EQUITIES; transmission to BTC via the financing loop (equity demand → ATM economics → the dividend/reserve program → disposals); perverse lever: shrinking the BTC stack raises the operating share.
  - Evidence: MSCI consultation Aug 14 (operating assets <50%; feedback Sep 30; results Oct 16; November review); Jan 2026 precedent (declined 'at this time'). **SEP 13: Strategy's Sep 1 letter (Saylor + Le) demands withdrawal — "discriminatory, arbitrary, and misguided"; Bitcoin is reported as an operating segment under SEC guidance; REITs/timber exempted; prospective-only fallback. Strategy BOUGHT BTC Aug 24–30 (lowering the operating share) — it is not managing to the screen.** Watch 0.55.
  - Last refreshed: SEP 13, 2026

### Float scarcity & flow asymmetry

- **etf-net-inflows → spot-price-pressure**
  - Strength: `strong` · Mechanism: ETFs settle T+1 in BTC; sustained inflows pull from exchange books. Evidence: 2024–26 AUM growth vs cycle highs; **SEP 13: August +$3.52B (16 of 21 days positive) ↔ BTC +25% on the month — the cleanest 2026 confirmation; the Sep 8–11 −$463M ↔ −7% pullback the mirror; SEP 16: Sep 15 −$450.3M ↔ −4% on the day (CLARITY-confounded). SEP 26: Sep 17–25 +$2.98B ↔ +11% ($75.5K→$84K; peak $87.3K) — the largest 2026 confirmation; the $999M day coincided with the $82K breakout and ~$844M of short liquidations (flows and squeeze reinforcing each other).** Last refreshed: SEP 26, 2026
- **corporate-treasury-accumulation → float-compression**
  - Strength: `strong` (mechanism), now explicitly TWO-WAY · Mechanism: treasury policy removes supply — but the same balance sheets return it when the capital program requires (Jun–Aug 2026: ~6,948 BTC sold). Evidence: Strategy 845,050 BTC after the Aug 24–30 buy (4,603); public companies ~1.18M. Last refreshed: SEP 13, 2026
- **float-compression → flow-asymmetry**
  - Strength: `weak` (scope-corrected JUN 5: holds for PASSIVE selling only; a leveraged cascade overwhelms the buffer). Last refreshed: JUN 5, 2026
- **etf-passive-outflow + leverage → reflexive-liquidation-cascade**
  - Strength: `strong` (self-limiting) · Mechanism: passive redemptions pressure spot → forced long liquidations sell more spot into a thin book → next redemption; burns out once the leveraged cohort is flushed. Evidence: Jun 2–5 (13-day/$4.4B streak + $1.8B liquidations → ~17%); burnout confirmed JUN 13. **Mirror image now witnessed TWICE in up-moves (Aug 19 >$1B shorts in ~1h; Aug 22–25 $2.7–4B shorts, +29% in a week, CME OI collapsed) — direction-agnostic mechanism; the DOWNSIDE loop has not re-activated (Sep 10–11 ~$363M long liquidations, −7%).** Last refreshed: SEP 13, 2026
- **quarter-end-options-expiry → mechanical-liquidation-cascade**
  - Strength: `medium` · Mechanism: a large scheduled expiry mechanically flushes leverage, so a ≥$1B day COINCIDING with expiry is weaker structural evidence. Evidence: Jun 25–26 on the $10B Deribit expiry. Next: Sep 30. Last refreshed: JUN 28, 2026
- **cumulative-ytd-flow-inversion → structural-regime-confirmation**
  - Strength: `weak` (the inversion REVERSED — the edge's read flips) · Mechanism: a YTD-cumulative inversion shifts the burden of proof to the bulls; its reversal shifts it back. Evidence: JUN 24 ~$7.2B of May+June streaks flipped 2026 negative; SEP 13: repaired to ~−$1.25B; **SEP 26 — REVERSED: 2026 YTD turned positive on Sep 22 (+$886.8M; ≈+$1.56B by Sep 25), the first time since May 26, from −$5.69B on Jul 13 — a ~$6.5B swing in ten weeks. A re-inversion needs ~−$1.6B.** Last refreshed: SEP 26, 2026
- **spot-lth-whale-accumulation → price-floor-decoupled-from-etf-flow**
  - Strength: `medium` (the floor became a BOTTOM) · Mechanism: at a capitulation low the marginal price-setter rotates to patient spot buyers (LTH SOPR <1 + whale accumulation). Evidence: JUL 2 ($57.7K held on the worst-ever ETF month); **SEP 13: the low held through everything and the passive bid returned at scale in August — $82,300 Sep 3–4, +42% off the low. Scope limit stands: a floor without the passive bid is not a bottom; here the bid came.** Last refreshed: SEP 13, 2026
- **nav-premium-compression → corporate-accumulation-slowdown → forced-marginal-selling (the reflexivity valve)**
  - Strength: `strong` for the two-sided VALVE (two retracted refinements: AUG 19 "standing doctrine"; SEP 13 "ATM as a gate")
  - Mechanism (current, SEP 26): price-vs-basis is the operative condition. BTC above cost basis → buy, sized by whichever of two VALVES is open — the ATM (accretive at a premium >1.0) or designated USD Cash (flexible; $1.05B). BTC below basis + a thin premium + a dividend date due → sell coins to fund the fixed obligation. Neither buying nor idling is a "regime" — both are price-conditional every week.
  - Evidence (condensed SEP 26 consolidation; full arc in git): MAY 26 zero-BTC → JUN 1 first sale (32 BTC) → JUN 13 re-buy → JUL 6 record 3,588-BTC dividend sale → AUG 3/10 below-cost sales, ATM open → AUG 31 buy above cost ($602.8M ATM, 4,603 BTC) → SEP 8/14 zero ATM, zero BTC, STRC buybacks from cash (the idle case, priced 0.35 — then falsified). **SEP 26 — the ATM condition falsified by its own test:** the Sep 21 8-K bought 950 BTC at $79,670 using USD Cash, zero ATM a third week (further-buy row HIT, 0.4225) — proving cash is a genuine second valve, not just the ATM. mNAV ran 1.17× (Sep 21–22) → 1.07× (Sep 26); the Sep 28 8-K tests the ATM valve at a premium. [EDGAR Sep 21](https://www.sec.gov/Archives/edgar/data/1050446/000119312526396093/mstr-20260914.htm)
  - Last refreshed: SEP 26, 2026
- **convert-debt-repurchase → btc-gain-without-accumulation**
  - Strength: `medium` · Mechanism: retiring converts at a discount books "BTC gain" without buying. Evidence: May 26 $1.5B repurchase → 4,391 BTC gain. **SEP 13 cousin: the STRC repurchase program (raised to $2.0B Sep 8; $1.19B remaining) — buying back 12% preferred at a discount is an alternative capital use competing with BTC buys.** Last refreshed: SEP 13, 2026

### Macro

- **fed-rate-cut-signaling → btc-correlated-equities-bid (regime-repricing → flow impulse)**
  - Strength: `medium` (DOWNGRADED SEP 26 from `strong` — observation 12 is a clean failure; SCOPE-CORRECTED: the rule governs the DAILY oscillation when the Fed is the marginal narrative, and fails when a priced event's passing or a price impulse is the marginal narrative)
  - Mechanism: the flow bid tracks the probability distribution of the NEXT decision, not the current decision's outcome; flows are EVENT-gated, and the same transmission fires on non-Fed regime repricings (the Aug 17–19 policy shock).
  - Evidence (condensed SEP 26 consolidation; full per-run text in git): Dec 2025 cuts → Jan ATH; regimes 1–11 (JUL–SEP 16: weak-jobs relief, stress tests, hawkish-HOLD stall, event-gating, both-directions-within-a-day on Warsh/Waller/PPI-CPI). **Observation 12 (SEP 26) — clean failure:** seven inflow days ~$2.98B (Sep 17–25; best week of 2026) while October hike odds rose 43.5%→61.6% and the 10Y/30Y hit 5.10%/5.49%; the decision week itself netted ≈$0. Read: PRICEDNESS, not direction, is the discriminator — a ~90%-priced event's delivery is a flow non-event; non-Fed impulses (the Aug policy shock, the Sep breakout) drove the year's two biggest runs. Counter-check: Jul 29 (partly-priced hawkish HOLD) → stalled; Jun 17 (unpriced hawkish dots) → outflows continued. Next tests: an outflow >$400M within 48h of a hot Sep 30/Oct 2/Oct 14 print (daily rule intact); Oct 28 (a ~90%-priced hike delivered with flows continuing = scope correction confirmed).
  - Last refreshed: SEP 26, 2026
- **fed-chair-transition → near-term-rate-path-volatility**
  - Strength: `medium` · Mechanism: a new chair's communications alone reposition the front end. Evidence: Warsh 0-for-5 on "softer than expected" set-pieces (Jun 17 dots, Jul 29 hold, Aug 28 Jackson Hole, Sep 16 series SEP, plus the pre-confirmation reputation itself) — full record in `actors/fed.md`. Rule: ≤0.35 on ANY "this Fed signals softer than the market" row; hawkish-outcome rows are not shaded down. Last refreshed: SEP 16, 2026
- **cpi-print-upside-surprise → fed-cut-odds-collapse**
  - Strength: `strong` upside / `medium` downside · Mechanism: inflation above target reprices the forward path fast via futures; the asymmetry is faster DOWN (cuts removed) than UP. Evidence (condensed): April CPI 3.8% → June-cut odds <10%; June CPI relief half-restored then fully repossessed in 10 days (JUL 26). **SEP 13: PPI +0.4%/5.4% y/y (Sep 10) + CPI +0.4%/3.4%, core 2.4% (Sep 11) + $100 oil → hike odds 69% → 85–87% — the upside leg again, now for a HIKE rather than a cut removal.** Last refreshed: SEP 13, 2026
- **geopolitical-energy-shock → cpi-ppi-reacceleration**
  - Strength: `strong` · Mechanism: oil shocks transmit to headline inflation within one CPI cycle (PPI leads); relief does NOT buy a dovish pivot when core binds, but re-shock hardens the path every time — 5 cycles of evidence now promoted to `heuristics.md` #4 (full citations there). EIA: Middle East output not back to pre-conflict levels until early 2027. SEP 26: Brent ~$106, Hormuz still shut; US–Iran phased-reopening talks reported Sep 24. Last refreshed: SEP 16, 2026
- **geopolitical-risk-off-shock → btc-flow-reversal**
  - Strength: `weak/medium` · Note: confounded by the rate channel — the Sep 8–11 outflows coincided with the escalation but ran through PPI/CPI pricing; still no clean both-directions read. Last refreshed: SEP 13, 2026
- **higher-for-longer-rates → corporate-treasury-financing-window-compression**
  - Strength: `strong` for the cohort; `medium` for Strategy (price/premium-gated — the AUG 19 "decoupled" downgrade partly REVERSED)
  - Mechanism: a hawkish regime keeps the cost of capital high → compresses leveraged-treasury premiums and raises convert/preferred economics → narrows issuance AND changes the deployment decision (pre-fund 11.5–12% obligations rather than buy a non-yielding asset).
  - Evidence: condensed into `heuristics.md` #3 (price-vs-basis gating) — the SEP 26 refinement stands: this edge gates the EQUITY channel (issuance size), not the buy decision itself, since cash is a second valve. Full arc in git. Last refreshed: SEP 26, 2026
- **risk-asset-relative-performance → btc-etf-rotation**
  - Strength: `medium` · Mechanism: allocators treat BTC as one high-beta sleeve; competing AI/semis outperformance pulls capital independent of BTC catalysts. Evidence: May–June streaks re-attributed to AI-lag (CoinDesk, Presto). **SEP 13: Sep 8–11 BTC fell WITH equities on the rates shock (S&P −0.8% wk, Dow −1.6%, four-day slide) — the beta leg, not the rotation leg.** Still owed: the systematic BTC/Nasdaq + BTC/SOXX vs weekly-flows read. Last refreshed: SEP 13, 2026
- **non-sovereign-asset co-movement (gold ↔ BTC): sign set by the DRIVER** (renamed SEP 13 from `dollar-weakness → btc-gold-tandem-bid`)
  - Strength: `medium` (conditional)
  - Mechanism: both are non-sovereign monetary assets. Under DOLLAR or FISCAL/long-end stress they are bid TOGETHER (the hedge bid); under a REAL-YIELD repricing they fall TOGETHER (the opportunity-cost bid) — the original one-directional "tandem bid" was half the edge.
  - Evidence (condensed SEP 26 consolidation; full arc in git): AUG 19 fiscal-stress tandem UP (gold + BTC both bid on Treasury-buyback stress) · SEP 13/16 the real-yield form TWICE (gold fell WITH BTC as yields rose — no hedge bid) · **SEP 26 a THIRD form, divergence: BTC +11% while gold fell ~2% and DXY hit a 2-month high — neither tandem form fits; the driver was BTC-idiosyncratic (ETF demand + a squeeze), not a macro-hedge bid.** Rule: identify the driver before assigning the sign; a "bond-market bid for scarce assets" story is unsupported when gold itself has no bid.
  - Last refreshed: SEP 26, 2026
- **foreign-statutory-reclassification → domestic-legislative-pressure**
  - Strength: `weak` · Evidence: Japan's FIEA (Jul 15) as competitiveness precedent; the pressure leg never fired; the migration leg quiet (Metaplanet reaffirmed 43,000 BTC at Bitcoin Asia, Aug 29–Sep 4; no U.S. issuer Tokyo plans). Last refreshed: SEP 13, 2026

### Sovereign action

- **sovereign-reserve-announcement → institutional-product-launches** — `weak` (candidate heuristic; 1 partial cycle). Last refreshed: MAY 18, 2026
- **sbr-codification-bill → sovereign-reserve-durability** — `medium` (mechanism; NEW SEP 26). Mechanism: a statutory 20-year no-sale rule converts an executive-order reserve (reversible by the next president) into a lock that policy alone cannot unwind; NO purchase authority, so the effect is supply-side (≈328K coins removed from potential sale), not demand-side. Evidence: HFSC ordered H.R. 8957 reported 28–21 (Sep 16; Steil substitute — 20-year hold, annual audited proof of reserve, budget-neutral acquisition study only). Test: the House-passage row (0.20 by Dec 31) — governed by the floor-time edge, not merits. Pairs with `federal-commodity-classification → sovereign-reserve-durability` (a different statute reaching the same durability). Last refreshed: SEP 26, 2026
- **sovereign-fiscal-stress → reserve-drawdown** — `weak` (Bhutan ~75% drawdown; DHI disputes the read). No 2026 sovereign event since; Witt's "imminent" SBR announcement (May) has not materialized. Last refreshed: SEP 13, 2026

### Protocol & adjacent-layer security

- **quantum-migration-bip-progress → sovereign-holder-engagement** — `weak` (forward-looking; no sovereign comment on BIP-360/361; the BIP-361 watch steps to 0.05). Last refreshed: SEP 13, 2026
- **core-non-endorsement + low-miner-signaling → contested-soft-fork-activation-unlikely / chain-split-risk**
  - Strength: `medium` → `strong` (BOTH legs validated quiet)
  - Mechanism: a UASF needs ≥55% miner signaling or economic-node enforcement; with Core non-endorsing and pools silent, activation closes and the residual is a brief minority split.
  - Evidence: BIP-110 lock-in failed at 2.53% (Aug 7–9; minority chain stalled 26 behind); **SEP 13: the eCash spinoff's alpha (Aug 23, block 963,648) ran as an airdrop-style practice-token phase with no exchange support, no price and no mainnet disruption — the split-tail watch scored MISS at 0.10.** Remaining: beta ~Sep 20 (block ~967,680), mainnet ~Oct 31 (block ~973,728) — re-seeded 0.05.
  - Last refreshed: SEP 13, 2026
- **adjacent-layer-security-failure → base-layer / custodial-wrapper relative advantage** (GENERALIZED SEP 13 from `self-custody-security-failure → custodial-wrapper-relative-advantage`)
  - Strength: `weak` → `weak/medium` (2nd instance; no flow-level confirmation)
  - Mechanism: a failure in a layer beside Bitcoin (a hardware wallet's RNG; a federated sidechain's verification code) redistributes preference toward the wrappers that had no incident — the base layer held in ordinary wallets, and the regulated funds with a licensed custodian — without touching Bitcoin's consensus.
  - Evidence: Coldcard Mk3 (Jul 30 – Aug 4; ~1,816 BTC / ~$116M; contained); **Liquid (Sep 6; ~3,996 BTC / ~$320M pegged out via an Elements range-proof verification-cache bug; 3,400 returned; 598.5 retained; peg-outs suspended; mainnet untouched).** The tape in both windows was rate/policy-dominated, so no custody-mix datapoint yet; the matrix's protocol→etfs −0.02 sign question stays flagged. **SEP 26: Liquid post-mortem (Sep 23) — two Elements rangeproof-cache bugs; ~602 BTC outstanding; reserve 197 BTC; peg-outs still paused with no date; the theme demoted from the top-5. Still no custody-mix datapoint (the Sep 17–25 tape was breakout-dominated).**
  - Last refreshed: SEP 26, 2026

## Dormant

_(edges with `last refreshed` >52 weeks weaken to dormant; >78 weeks archive)_

## Archive

_(none yet)_

## Hygiene rules

1. **Edges are directional.** "A → B" doesn't imply "B → A." Be explicit.
2. **Strength downgrades with contradicting evidence.** A `strong` edge that fails once becomes `medium`; two failures retire it.
3. **Mechanism > correlation.** If you can't name the mechanism, don't add the edge.
4. **Bias toward fewer, sharper edges.** A graph of 100 weak edges is noise. 15–25 well-validated edges is a model.
5. **Cite evidence with run dates or external citations.** "I think this is true" is not evidence.
6. **Condense, don't delete (SEP 13).** When an edge's evidence block exceeds ~1 KB, summarize the arc and leave the per-run text to git.
