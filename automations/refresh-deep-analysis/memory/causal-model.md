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
  - Evidence: Van Hollen amendment failed 11–13 in committee (May 14); the merged draft omitted Section 604 → Murphy/Van Hollen/Merkley defected (Jul 17); Tillis–Gallego compromise sent to the White House (late Jul), unanswered; **SEP 8: Tillis — "If there's no interest in the White House in trying to bridge the gap on the ethics language, it is going to fail."** The vote-math variable is a White House answer, not a Senate one. **SEP 15–16 — the edge decided the vote: cloture failed 49–50 with EVERY Democrat present voting no. The GOP's Sep 14 "last, best, and final" substitute barred officials from issuing new digital assets and required divestment of "significant financial interest" or blind trusts; Democrats' overnight counter (immediate SALE of very large existing crypto interests; broader family coverage) was rejected before the roll call. Warner: the conflict "made it impossible for me to support moving forward"; Gallego: "I won't support any piece of legislation that enables him." The gap was the president's EXISTING income, not future issuance — an ethics floor no text short of divestment could clear.** [Senate Daily Press](https://www.dailypress.senate.gov/tuesday-september-15-2026/) · [Gallego](https://www.gallego.senate.gov/news/press-releases/gallego-statement-on-failed-clarity-act-cloture-vote/)
  - Last refreshed: SEP 16, 2026
- **must-pass-bill-standoff / floor-time-scarcity → pending-crypto-legislation-slips**
  - Strength: `strong`
  - Mechanism: floor time, not votes, binds second-tier legislation when leadership must prioritize appropriations/nominations; a must-pass standoff consumes the window and the bill slips on timing alone. Corollary (vote-banking, AUG 7): leadership defers a doomed cloture vote when a better window exists — and SPENDS it when none does.
  - Evidence (condensed): five congestion instances stepped the CLARITY watch 0.40→0.20 with no vote-math change (JUN 24 SAVE-Act standoff → AUG 7 no-petition/no-vote); both timing legs observed (JUL 19 window reopens promptly; JUL 26 CR + sanctions consume it → Thune concedes). **SEP 13 — the absence condition confirmed: the CR (through Dec 11) was signed ~Sep 3 (House 370–48; Senate 90–6 in August), Monday's floor is a judge nomination, and the cloture vote is proceeding on schedule (Tue Sep 15 2:15 p.m.) even though its sponsors expect to lose — no better window exists in the ~15 session days before campaign season.** [NPR Sep 1](https://www.npr.org/2026/09/01/nx-s1-5951536/house-government-funding-vote-midterms) **SEP 16 — vote-banking's second half CONFIRMED: the vote was spent on schedule (Sep 15, 2:18 p.m.) and lost 49–50; Tillis switched to no to preserve a motion to reconsider (filed 3:01 p.m.) and Thune entered one — the banked asset is now the RE-VOTE, deferred to a lame-duck window (Kennedy) that Lummis does not expect ("It's over"). Exogenous calendar risk ahead: the Dec 11 CR expiry sits inside any lame-duck window.**
  - Last refreshed: SEP 16, 2026
- **administrative-rulemaking-substitution ↔ legislative-urgency**
  - Strength: `weak/medium` (two-signed; the momentum leg observed SEP 16, the substitution leg not)
  - Mechanism: a regulator building BY RULE what a stalled bill would build BY STATUTE both saps urgency (substitution) and makes 'no' look like obstruction (momentum); a rule can be litigated/rescinded, a statute cannot — so substitution is partial by construction.
  - Evidence: SEC Regulation Crypto Assets (Aug 18; Federal Register Aug 21; comments to Oct 20). **SEP 13 — the regulator made the substitution leg EXPLICIT: CFTC Chair Selig (Aug 20): "If the Democrats cannot support a bipartisan work product... rest assured, I will direct CFTC staff to move swiftly to propose these new rules" (a 'crypto asset market' DCM designation with leveraged trading).** Matrix deltas set ASYMMETRIC: policy→clarity −0.03 (substitution saps urgency); clarity→policy +0.05 (legislative failure raises the administrative track's weight). Watch at the vote: any Democrat citing the agency track as a reason to wait. [CFTC](https://www.cftc.gov/PressRoom/SpeechesTestimony/opaselig10) **SEP 16 — first test resolved ASYMMETRICALLY: the substitution leg did NOT show (no Democrat cited the agency track; the stated reason was ethics), but the momentum leg fired within 24 hours — Atkins: "with or without legislation, we will act decisively within the SEC's statutory authority"; Selig: "locked in and ready to ship its rules for the new frontier of finance"; Coinbase's Armstrong: "Go time." The clarity→policy +0.05 sign is supported; policy→clarity −0.03 is unobserved. Concrete test: a CFTC proposed rule by Dec 31 (row 0.55). Durability caveat (JPMorgan): agency rules are "less durable than legislative statutes".** [The Block](https://www.theblock.co/news/regulation/2026-09-16-go-time-sec-cftc-prepare-push-crypto-rules-clarity-act-stalls-senate-415281)
  - Last refreshed: SEP 16, 2026
- **index-inclusion-screen → treasury-model-financing-pressure**
  - Strength: `weak` (mechanism named; transmission not yet observed)
  - Mechanism: an index provider's non-operating-company screen converts passive ownership into a conditional forced-selling channel against leveraged-treasury EQUITIES; transmission to BTC via the financing loop (equity demand → ATM economics → the dividend/reserve program → disposals); perverse lever: shrinking the BTC stack raises the operating share.
  - Evidence: MSCI consultation Aug 14 (operating assets <50%; feedback Sep 30; results Oct 16; November review); Jan 2026 precedent (declined 'at this time'). **SEP 13: Strategy's Sep 1 letter (Saylor + Le) demands withdrawal — "discriminatory, arbitrary, and misguided"; Bitcoin is reported as an operating segment under SEC guidance; REITs/timber exempted; prospective-only fallback. Strategy BOUGHT BTC Aug 24–30 (lowering the operating share) — it is not managing to the screen.** Watch 0.55.
  - Last refreshed: SEP 13, 2026

### Float scarcity & flow asymmetry

- **etf-net-inflows → spot-price-pressure**
  - Strength: `strong` · Mechanism: ETFs settle T+1 in BTC; sustained inflows pull from exchange books. Evidence: 2024–26 AUM growth vs cycle highs; **SEP 13: August +$3.52B (16 of 21 days positive) ↔ BTC +25% on the month — the cleanest 2026 confirmation; the Sep 8–11 −$463M ↔ −7% pullback the mirror; SEP 16: Sep 15 −$450.3M ↔ −4% on the day (CLARITY-confounded).** Last refreshed: SEP 16, 2026
- **corporate-treasury-accumulation → float-compression**
  - Strength: `strong` (mechanism), now explicitly TWO-WAY · Mechanism: treasury policy removes supply — but the same balance sheets return it when the capital program requires (Jun–Aug 2026: ~6,948 BTC sold). Evidence: Strategy 845,050 BTC after the Aug 24–30 buy (4,603); public companies ~1.18M. Last refreshed: SEP 13, 2026
- **float-compression → flow-asymmetry**
  - Strength: `weak` (scope-corrected JUN 5: holds for PASSIVE selling only; a leveraged cascade overwhelms the buffer). Last refreshed: JUN 5, 2026
- **etf-passive-outflow + leverage → reflexive-liquidation-cascade**
  - Strength: `strong` (self-limiting) · Mechanism: passive redemptions pressure spot → forced long liquidations sell more spot into a thin book → next redemption; burns out once the leveraged cohort is flushed. Evidence: Jun 2–5 (13-day/$4.4B streak + $1.8B liquidations → ~17%); burnout confirmed JUN 13. **Mirror image now witnessed TWICE in up-moves (Aug 19 >$1B shorts in ~1h; Aug 22–25 $2.7–4B shorts, +29% in a week, CME OI collapsed) — direction-agnostic mechanism; the DOWNSIDE loop has not re-activated (Sep 10–11 ~$363M long liquidations, −7%).** Last refreshed: SEP 13, 2026
- **quarter-end-options-expiry → mechanical-liquidation-cascade**
  - Strength: `medium` · Mechanism: a large scheduled expiry mechanically flushes leverage, so a ≥$1B day COINCIDING with expiry is weaker structural evidence. Evidence: Jun 25–26 on the $10B Deribit expiry. Next: Sep 30. Last refreshed: JUN 28, 2026
- **cumulative-ytd-flow-inversion → structural-regime-confirmation**
  - Strength: `medium` → `weak/medium` (the inversion is REPAIRING) · Mechanism: a YTD-cumulative inversion shifts the burden of proof to the bulls. Evidence: JUN 24 ~$7.2B of May+June streaks flipped 2026 negative; **SEP 13: −$5.29B (pre-August) → −$1.77B (Aug 31) → ~−$1.25B (Sep 11) — ~75% repaired in six weeks; a flip to YTD-positive would reverse the edge's read (watch informally: needs ~+$1.3B net).** Last refreshed: SEP 13, 2026
- **spot-lth-whale-accumulation → price-floor-decoupled-from-etf-flow**
  - Strength: `medium` (the floor became a BOTTOM) · Mechanism: at a capitulation low the marginal price-setter rotates to patient spot buyers (LTH SOPR <1 + whale accumulation). Evidence: JUL 2 ($57.7K held on the worst-ever ETF month); **SEP 13: the low held through everything and the passive bid returned at scale in August — $82,300 Sep 3–4, +42% off the low. Scope limit stands: a floor without the passive bid is not a bottom; here the bid came.** Last refreshed: SEP 13, 2026
- **nav-premium-compression → corporate-accumulation-slowdown → forced-marginal-selling (the reflexivity valve)**
  - Strength: `strong` for the two-sided VALVE; the AUG 19 "standing doctrine" extension is RETRACTED (SEP 13)
  - Mechanism: ATM/STRC issuance is accretive when MSTR trades at a premium to BTC NAV; drawdowns compress the premium and close the window; fixed preferred dividends do not flex, so BTC is sold at the margin to service them. **SEP 13 refinement: the valve is PRICE/PREMIUM-CONDITIONAL in both directions — with BTC above the $75,412 cost basis and the premium reopened on the August rally, Strategy sold $602.8M of stock and bought 4,603 BTC (Aug 24–30); the next week, as the tape turned, zero ATM, zero BTC and $176.3M of STRC repurchases from USD Cash. Selling is what the program does when BTC is below basis and the premium is thin on a dividend date; buying is what it does when the ATM is accretive. Neither is a regime.**
  - Evidence (condensed; full arc in git): MAY 26 zero-BTC 8-K → JUN 1 first sale in ~4 years (32 BTC) → JUN 13 re-buy (reversible valve) → JUL 6 record 3,588-BTC dividend sale → JUL 19 $3.0B reserve → AUG 3 second sale with the ATM OPEN ($290.6M stock sold) → AUG 10 third sale (reserve $4.65B) → **AUG 31 BUY above cost with $602.8M ATM → SEP 8 zero ATM / zero BTC / $176.3M STRC buybacks / $2.0B repurchase authority.** Watch: further buy by Oct 12 (0.35 after the Sep 14 8-K — a SECOND zero-ATM / no-BTC week, $139.3M STRC repurchase from USD Cash, BTC AT the basis: the idle case persisting through the hike); any sale fires THESIS-006 #3. [EDGAR Aug 31](https://www.sec.gov/Archives/edgar/data/0001050446/000119312526375463/mstr-20260831.htm) · [EDGAR Sep 8](https://www.sec.gov/Archives/edgar/data/1050446/000119312526384402/mstr-20260831.htm) · [EDGAR Sep 14](https://www.sec.gov/Archives/edgar/data/1050446/000119312526389858/mstr-20260914.htm)
  - Last refreshed: SEP 16, 2026
- **convert-debt-repurchase → btc-gain-without-accumulation**
  - Strength: `medium` · Mechanism: retiring converts at a discount books "BTC gain" without buying. Evidence: May 26 $1.5B repurchase → 4,391 BTC gain. **SEP 13 cousin: the STRC repurchase program (raised to $2.0B Sep 8; $1.19B remaining) — buying back 12% preferred at a discount is an alternative capital use competing with BTC buys.** Last refreshed: SEP 13, 2026

### Macro

- **fed-rate-cut-signaling → btc-correlated-equities-bid (regime-repricing → flow impulse)**
  - Strength: `strong` (observations 1–10; hard data and Fed communication as the pivot)
  - Mechanism: the flow bid tracks the probability distribution of the NEXT decision, not the current decision's outcome and not the chair's reputation; flows are EVENT-gated (they buy repricings), and the same transmission fires on non-Fed regime repricings (the Aug 17–19 policy shock).
  - Evidence (condensed): Dec 2025 cuts → Jan ATH; regimes 1–7 (JUL 6 – AUG 19: weak-jobs relief; both-directions stress test; soft CPI → inflows; fastest transmission ~24h; hawkish HOLD = STALL; anticipation (Aug 3–6 restart preceded the print); event-gating (−$389.7M under a friendly gate, restart on the policy shock)). **SEP 13 — observations 8–10, BOTH DIRECTIONS WITHIN A DAY, three times in twelve days: Aug 28 Warsh → −$201.8M (nine-day streak ends); Sep 3 Waller → +$730.9M (largest since Jan 14); Sep 8–11 PPI/CPI → −$462.7M over four days. Operating rule confirmed. Implication for Sep 16: the decision is priced; the SEP/presser sets the flow direction for the following fortnight (watch 0.45).** **SEP 16 — observation 11 (pre-event, confounded): Sep 14 +$160.0M / Sep 15 −$450.3M (the largest outflow since Jun 25; FBTC −$214.8M, IBIT −$161.7M) — the exit came the day BEFORE the decision, on the CLARITY failure and pre-positioning; the decision itself moved nothing (BTC flat at 2 p.m.). The SERIES guidance resolves the branch: the post-decision row steps 0.45→0.30. The Thu–Fri (Sep 17–18) prints are the clean read — a positive print would say the tougher message was priced too.**
  - Last refreshed: SEP 16, 2026
- **fed-chair-transition → near-term-rate-path-volatility**
  - Strength: `medium` · Mechanism: a new chair's communications alone reposition the front end. Evidence: Warsh read "marginally dovish" pre-confirmation → hawkish dots (Jun 17) → 9–3 hold with 'no soft inflation target' (Jul 29) → **Jackson Hole "we have work to do" (Aug 28: hike odds ~30% → 55–66%; the hold-intact watch MISS at 0.60)** — four set-pieces, four hawkish-of-expectations; **SEP 16 — five: the first hike (25bp to 3.75%–4.00%, 12–0) came with a SERIES SEP (end-2026 median 4.1% from 3.8%; 16 of 18 see at least one more; end-2027 4.1%, no cuts) against a one-and-done row at 0.40 (MISS, 0.16); Warsh: "we removed a dose of accommodation".** Rule: ≤0.35 on ANY "this Fed signals softer than the market" row; hawkish-outcome rows are not shaded down. Last refreshed: SEP 16, 2026
- **cpi-print-upside-surprise → fed-cut-odds-collapse**
  - Strength: `strong` upside / `medium` downside · Mechanism: inflation above target reprices the forward path fast via futures; the asymmetry is faster DOWN (cuts removed) than UP. Evidence (condensed): April CPI 3.8% → June-cut odds <10%; June CPI relief half-restored then fully repossessed in 10 days (JUL 26). **SEP 13: PPI +0.4%/5.4% y/y (Sep 10) + CPI +0.4%/3.4%, core 2.4% (Sep 11) + $100 oil → hike odds 69% → 85–87% — the upside leg again, now for a HIKE rather than a cut removal.** Last refreshed: SEP 13, 2026
- **geopolitical-energy-shock → cpi-ppi-reacceleration**
  - Strength: `strong` · Mechanism: oil shocks transmit to headline inflation within one CPI cycle (PPI leads); energy RELIEF does not buy a dovish Fed when core binds (JUN 17), but energy RE-SHOCK does harden the rate path. Evidence (condensed): Feb–Apr Hormuz shock → April PPI 6.0%; Jun 17 deal → June CPI relief; ceasefire collapse (JUL 19) → Brent >$100 (Jul 24) → rate market re-hardened; Aug talks → Brent $79; Aug 12–17 corridor breakdown → ~$90. **SEP 13 — fifth instance: U.S. strikes on five Iranian tankers + Iranian missile strikes on U.S. forces in Jordan (Sep 8–9) → Brent $100.19 (Sep 9), $107.63 settle (Sep 10; +18% in September; Goldman flags $120) → PPI goods +1.1% on diesel; gasoline over a third of the CPI rise → the September hike.** EIA: Middle East output not back to pre-conflict levels until early 2027. **SEP 16 — the shock delivered the hike: the Sep 11 drone strike on Saudi Arabia's East-West pipeline pumping station took Brent to $108–109 (Sep 15) before a $105.83 settle (Sep 16, −2.7% on "days, not weeks" repair talk); Brent +16% in September; the FOMC statement: "Inflation remains elevated"; Warsh: the Fed "cannot affect any individual price, whether it be oil prices" — and hiked anyway.** Last refreshed: SEP 16, 2026
- **geopolitical-risk-off-shock → btc-flow-reversal**
  - Strength: `weak/medium` · Note: confounded by the rate channel — the Sep 8–11 outflows coincided with the escalation but ran through PPI/CPI pricing; still no clean both-directions read. Last refreshed: SEP 13, 2026
- **higher-for-longer-rates → corporate-treasury-financing-window-compression**
  - Strength: `strong` for the cohort; `medium` for Strategy (price/premium-gated — the AUG 19 "decoupled" downgrade partly REVERSED)
  - Mechanism: a hawkish regime keeps the cost of capital high → compresses leveraged-treasury premiums and raises convert/preferred economics → narrows issuance AND changes the deployment decision (pre-fund 11.5–12% obligations rather than buy a non-yielding asset).
  - Evidence (condensed): JUN 20–24 hawkish dots + cash-parking; JUL 6 forced selling; JUL 12–19 BSTR/Cantor pipeline crack; AUG 3 below-cost sales with the ATM open; AUG 19 the third sale despite a friendly gate (→ "doctrine"). **SEP 13 — the incumbent re-coupled: the buy came with the ATM OPEN on a rally ($2.6B raised Aug 17–30), and the zero-ATM week (Sep 8) came exactly as the hike repriced and MSTR sagged on the MSCI fight. Financing conditions DO gate Strategy's deployment, through the premium. **SEP 16: a SECOND consecutive zero-ATM week (Sep 8–13) with BTC AT the $75,412 basis and the first hike delivered — the window stayed shut through the decision; $139.3M of STRC buybacks from USD Cash instead.** Last refreshed: SEP 16, 2026
- **risk-asset-relative-performance → btc-etf-rotation**
  - Strength: `medium` · Mechanism: allocators treat BTC as one high-beta sleeve; competing AI/semis outperformance pulls capital independent of BTC catalysts. Evidence: May–June streaks re-attributed to AI-lag (CoinDesk, Presto). **SEP 13: Sep 8–11 BTC fell WITH equities on the rates shock (S&P −0.8% wk, Dow −1.6%, four-day slide) — the beta leg, not the rotation leg.** Still owed: the systematic BTC/Nasdaq + BTC/SOXX vs weekly-flows read. Last refreshed: SEP 13, 2026
- **non-sovereign-asset co-movement (gold ↔ BTC): sign set by the DRIVER** (renamed SEP 13 from `dollar-weakness → btc-gold-tandem-bid`)
  - Strength: `medium` (conditional)
  - Mechanism: both are non-sovereign monetary assets. Under DOLLAR or FISCAL/long-end stress they are bid TOGETHER (the hedge bid); under a REAL-YIELD repricing they fall TOGETHER (the opportunity-cost bid) — the original one-directional "tandem bid" was half the edge.
  - Evidence: 2024–26 BTC/gold correlation in dollar drawdowns; AUG 19 fiscal-stress tandem UP (30Y at 2007 highs → Treasury buybacks doubled; gold $4,480 with BTC $69.5K; DXY flat). **SEP 13 — the counter-datapoint: gold ~$4,490 (Sep 3) → ~$4,350 (Sep 12) WITH BTC $82.3K → $77K, DXY flat ~99.1, 10Y 4.87%/30Y 5.35% — no hedge bid at all; a pure real-yield trade.** Predictive use: identify the driver before calling the sign. **SEP 16 — third datapoint for the real-yield form: gold −0.7% to $4,301 on decision day with BTC flat, the 10Y at 4.94% on the Treasury table (press: touched 5%), DXY +0.3% to 99.7 — a real-yield day again; neither asset drew a hedge bid on the first hike in three years.**
  - Last refreshed: SEP 16, 2026
- **foreign-statutory-reclassification → domestic-legislative-pressure**
  - Strength: `weak` · Evidence: Japan's FIEA (Jul 15) as competitiveness precedent; the pressure leg never fired; the migration leg quiet (Metaplanet reaffirmed 43,000 BTC at Bitcoin Asia, Aug 29–Sep 4; no U.S. issuer Tokyo plans). Last refreshed: SEP 13, 2026

### Sovereign action

- **sovereign-reserve-announcement → institutional-product-launches** — `weak` (candidate heuristic; 1 partial cycle). Last refreshed: MAY 18, 2026
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
  - Evidence: Coldcard Mk3 (Jul 30 – Aug 4; ~1,816 BTC / ~$116M; contained); **Liquid (Sep 6; ~3,996 BTC / ~$320M pegged out via an Elements range-proof verification-cache bug; 3,400 returned; 598.5 retained; peg-outs suspended; mainnet untouched).** The tape in both windows was rate/policy-dominated, so no custody-mix datapoint yet; the matrix's protocol→etfs −0.02 sign question stays flagged.
  - Last refreshed: SEP 13, 2026

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
