# Causal Model

**Explicit "X drives Y" graph.** Each edge has direction, strength estimate, supporting evidence, and `last refreshed` date. Refined every run; weakened by contradicting evidence; archived when dormant.

Strength scale: `weak` (often coincident, not causal) / `medium` (causal in most cases, exceptions exist) / `strong` (near-deterministic in the observed regime).

This is what lets the analysis go from "list of events" to "model of the system."

## Active edges

### Regulation & legal classification

- **federal-commodity-classification → institutional-allocation-unlock**
  - Strength: `strong` (post-CLARITY-markup, evidence still indirect — clearance preserves the edge, doesn't yet validate it)
  - Mechanism: Pensions/endowments/insurance balance sheets are gated by legal-opinion ambiguity. Commodity classification removes the gate.
  - Evidence: Industry counsel commentary; absence of major allocators despite ETF availability; MAY 14 markup clearance with classification preserved (precondition still alive).
  - Last refreshed: MAY 18, 2026
- **federal-commodity-classification → sovereign-reserve-durability**
  - Strength: `medium`
  - Mechanism: Without classification, next admin can re-characterize and unwind via custodian enforcement. Classification statutorily protects reserves.
  - Evidence: Trump EO depends on classification stability; alternate admin scenarios remain a real risk absent legislation.
  - Last refreshed: MAY 18, 2026
- **stablecoin-amendments-attached → clarity-passage-slip**
  - Strength: `medium`
  - Mechanism: Amendments expand the bill's scope, fracture coalition, slow markup.
  - Evidence: GENIUS Act 2025 precedent (passed when kept narrow); CLARITY draft tightening relative to 2025 House version (suggests sponsors learned this); MAY 14 markup confirmed — stablecoin/DeFi amendments did not attach; ethics amendment (Van Hollen) attempted and failed 11–13.
  - Last refreshed: MAY 18, 2026

- **ethics-amendments-attached → clarity-floor-friction**
  - Strength: `medium` (new edge, MAY 18 2026)
  - Mechanism: Officials-can't-hold-crypto amendments hit at the Senate floor where individual members face press scrutiny; harder to bury than committee.
  - Evidence: Van Hollen amendment failed 11–13 in committee but signals it returns on floor; Alsobrooks (yes vote in markup) flagged floor reservation on outstanding issues.
  - Last refreshed: MAY 18, 2026

- **must-pass-bill-standoff / floor-time-scarcity → pending-crypto-legislation-slips**
  - Strength: `medium`→`strong` (UPGRADED JUN 28 2026 — a second observation extends the standoff and the slip leg begins to confirm)
  - Mechanism: Floor time, not votes, is the binding constraint on second-tier legislation like CLARITY (Senate Calendar No. 423) when leadership (Thune) must prioritize appropriations + nominations. A high-salience must-pass-bill standoff (a signing strike + a House blockade) consumes the scarce floor time and political oxygen, pushing non-urgent bills past a hard recess deadline even when their own vote math is unchanged. The slip is a calendar-congestion effect, exogenous to the bill's merits.
  - Evidence (re-condensed AUG 19; full arc in git): FIVE confirming congestion instances stepped the CLARITY watch 0.40→0.20 with no change to its vote math (JUN 24 SAVE-Act standoff; JUN 28 blockade broadening through a recess; JUL 12 NDAA squeeze; AUG 3 Thune re-commit vs an empty floor schedule; AUG 7 no-petition/no-vote — endgame MISS at 0.30, Brier 0.09), plus BOTH legs of the timing edge observed (JUL 19: NDAA clears → window reopens promptly without vote improvement; JUL 26: CR + sanctions consume it → Thune concedes, cloture MISS at 0.20 vs markets' ~45% — the system's best-calibrated regulatory call — THESIS-001 retires on #2). Mechanism wrinkle (AUG 7): **VOTE-BANKING** — leadership treats a cloture vote as an asset to spend at its best window, not a messaging opportunity ("queued up first thing," Sep 15–16). [CoinDesk Aug 6](https://www.coindesk.com/policy/2026/08/06/senate-won-t-vote-on-crypto-clarity-act-before-its-summer-break) **AUG 19 nuance — the freed September floor is not fully free: the House CR (through Dec 4) and Senate CR (through Dec 11) must reconcile before Sep 30, a modest competing claim on the floor hosting the Sep 15–16 vote; a reconciliation standoff eating that week is the named timing tail.** [NPR — House CR](https://www.npr.org/2026/07/21/nx-s1-5902245/government-funding-house-vote-continuing-resolution)
  - Last refreshed: AUG 19, 2026

- **administrative-rulemaking-substitution ↔ legislative-urgency**
  - Strength: `weak` (new edge, AUG 19 2026 — first observation; genuinely two-signed)
  - Mechanism: When the regulator begins building BY RULE part of the structure a stalled bill would build BY STATUTE, two opposing forces act on the bill simultaneously: SUBSTITUTION (a workable administrative regime lowers the cost of legislative failure, sapping urgency from marginal supporters) and MOMENTUM (a demonstrably moving executive branch makes opposition look like obstructing an inevitability, and gives leadership a 'finish the job' frame). The key asymmetry that keeps the bill alive: a rule can be litigated and rescinded by the next administration; a statute cannot — so the substitution is partial by construction.
  - Evidence: AUG 19 2026 — the SEC's proposed Regulation Crypto Assets (Aug 18: $5M/$75M exemptions, token safe harbor, state preemption) landed 4 weeks before CLARITY's Sep 15–16 cloture vote, with Trump simultaneously demanding a 'fair version' at the White House summit. Which sign dominates is the live question — the cloture vote is the natural first test (watch whether any of the ~7 holdout Democrats cite the rulebook as reason to wait, or any soft Republican cites it as reason to finish). [SEC statement](https://www.sec.gov/newsroom/speeches-statements/atkins-statement-regulation-crypto-assets-081826)
  - Last refreshed: AUG 19, 2026

- **index-inclusion-screen → treasury-model-financing-pressure**
  - Strength: `weak` (new edge, AUG 19 2026 — first observation; mechanism named, transmission not yet observed)
  - Mechanism: A major index provider's eligibility screen against 'non-operating companies' converts passive index ownership — normally inert — into a conditional forced-selling channel against leveraged-treasury EQUITIES. Transmission to BTC is indirect, via the financing loop: ejection → passive funds must sell the stock → equity demand/liquidity falls → ATM issuance (the treasury model's funding engine for dividends/buybacks/reserves) becomes more dilutive → more BTC disposals under the revealed-preference doctrine. Second, perverse channel: the screen keys on operating-asset SHARE, so shrinking the BTC stack is itself a compliance lever — regulatory-plumbing pressure and distribution point the same direction.
  - Evidence: AUG 14 2026 — MSCI consultation (screen: operating assets <50% of total; on May 2026 data would delete Strategy/MSTR, Metaplanet 3350, Yellow Cake from GIMI at the November review; feedback closes Sep 30, results Oct 16). Precedent cuts against automatic adoption: MSCI declined to proceed 'at this time' in Jan 2026; Strategy is publicly fighting ('measure markets, not dictate corporate assets'). Watch row 0.55; MSTR's spread to BTC into Oct 16 is the live market-implied odds. Needs the Oct 16 outcome + any observed forced-flow to move off `weak`. [CoinDesk Aug 14](https://www.coindesk.com/markets/2026/08/14/bitcoin-holders-strategy-and-metaplanet-face-stock-index-exclusion-under-msci-s-new-proposal)
  - Last refreshed: AUG 19, 2026

### Float scarcity & flow asymmetry

- **etf-net-inflows → spot-price-pressure**
  - Strength: `strong`
  - Mechanism: ETFs settle T+1 in BTC; sustained inflows pull from exchange order books.
  - Evidence: 2024–2026 cumulative AUM growth correlates with cycle highs.
  - Last refreshed: MAY 18, 2026
- **corporate-treasury-accumulation → float-compression**
  - Strength: `strong`
  - Mechanism: Permanent removal from circulating supply (treasury policy = HODL).
  - Evidence: MSTR cohort cumulative holdings (~1.5–2% of supply).
  - Last refreshed: MAY 18, 2026
- **float-compression → flow-asymmetry**
  - Strength: `medium`→`weak` (DOWNGRADED JUN 5, 2026 — held under passive selling, BROKE under a leveraged cascade)
  - Mechanism: With the LTH cohort >90% of supply, marginal flows hit a thin book asymmetrically. **Scope correction (Jun 5): holds for PASSIVE selling only — reflexive forced selling overwhelms the buffer.**
  - Evidence (condensed): May 20 ~$1B outflow → ~5% drawdown; Jun 1 record 9-day/$2.8B → only ~9% (looked strongest); **Jun 5 CONTRADICTING — 13-day/$4.4B + $1.8B leveraged liquidations → ~17% cascade to sub-$60K.** The kill-condition datapoint for the heuristic's strong form.
  - Last refreshed: JUN 5, 2026

- **etf-passive-outflow + leverage → reflexive-liquidation-cascade**
  - Strength: `strong` (new edge JUN 5 2026; SELF-LIMITING property confirmed JUN 13)
  - Mechanism: Sustained passive ETF redemptions pressure spot; a thinning book trips leveraged long liquidations; forced selling dumps more spot into the same thin book; lower prices trigger the next redemption + the next liquidation tranche. A self-reinforcing downward loop that the float-scarcity buffer cannot arrest because the marginal seller is non-discretionary. **Self-limiting:** a given long can be liquidated once, so once the leveraged cohort is flushed the loop loses its fuel — the decisive recovery tell is the ABSENCE of a second cascade.
  - Evidence (condensed): Jun 2–5 2026 — 13-day/$4.4B streak + $1.8B leveraged-long liquidations in 72h → $73K→$60.7K (~17%), longs disproportionately hit (flush signature). [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-05/bitcoin-falls-below-60-000-for-first-time-since-2024-trump-win) **JUN 13 — self-limiting property CONFIRMED:** no second wave in the eight days post-trough; BTC +6.9%, streak broke Jun 11–12. Full loop (ignition AND burnout) witnessed once end-to-end.
  - Last refreshed: JUN 13, 2026

- **quarter-end-options-expiry → mechanical-liquidation-cascade**
  - Strength: `medium` (JUN 28 2026; condensed AUG 19 — full text in git)
  - Mechanism: A large scheduled expiry mechanically flushes leverage (gamma re-hedging, max-pain unwind, clustered stop-outs into a thin quarter-end book) — so a ≥$1B liquidation day COINCIDING with an expiry is weaker structural evidence than the same day on an ordinary session. Evidence: Jun 25–26 back-to-back $1B+ days on the $10B Deribit quarter-end (why THESIS-003 stepped to 0.40 rather than retiring). The ordinary-session qualifier is now written into THESIS-005 falsifier #5.
  - Last refreshed: JUN 28, 2026

- **cumulative-ytd-flow-inversion → structural-regime-confirmation**
  - Strength: `medium` (new edge, JUN 24 2026 — first observation; distinct from streak-level outflow edges)
  - Mechanism (condensed AUG 3): streak-level outflows are ambiguous (tactical rotation); a YTD-CUMULATIVE inversion erases the period's entire net build and shifts the burden of proof to the bulls — "the year is still net-positive" is the bull case's load-bearing sentence, and the inversion deletes it.
  - Evidence (condensed AUG 3; full text in git): JUN 24 2026 — ~$7.2B of May+June streaks flipped 2026 YTD negative for the first time; THESIS-003 0.65→0.45 on this print. [TFTC](https://www.tftc.io/bitcoin-etf-outflows-2026-record-streaks/). Watch: July's repair was marginal (~$200M month) — the cumulative line remains deeply negative; the inversion is persisting, which leans the edge toward `strong`/structural absent an August repair.
  - Last refreshed: JUN 24, 2026

- **spot-lth-whale-accumulation → price-floor-decoupled-from-etf-flow**
  - Strength: `weak`→`medium` (new edge, JUL 2 2026 — first clean observation)
  - Mechanism (condensed AUG 3): when institutional flows are net-negative but price stabilizes, the marginal price-setter has rotated to patient spot buyers (LTH SOPR <1 + whale accumulation = the handoff signature). **Scope limit: a FLOOR is not a BOTTOM** — absent the passive bid's return, the next redemption wave can overwhelm it.
  - Evidence (condensed AUG 3; full text in git): JUL 2 2026 — worst-ever ETF month yet BTC held ~$57.7K and bounced to $61K on LTH SOPR ~0.8 + the year's 2nd-largest whale accumulation spike. [BGeometrics](https://bgeometrics.com/blog/2026-06-bitcoin-2026-whale-accumulation-onchain-cohorts/). The $57.7K floor has since held through three months of stress — leaning "bottom" — but the passive bid never confirmed (July ~$200M), so the edge stays `medium`.
  - Last refreshed: JUL 2, 2026
  - Note: pairs inversely with `cumulative-ytd-flow-inversion → structural-regime-confirmation` — the YTD inversion is the bear signal (marginal ALLOCATOR left), this edge is the bull counter (patient SPOT buyer stepped in). Both were simultaneously true this run.

- **nav-premium-compression → corporate-accumulation-slowdown → forced-marginal-selling**
  - Strength: `medium`→`strong` (UPGRADED JUN 5, 2026 — extended from "slowdown" to "forced selling" with a clean observation)
  - Mechanism: Strategy's ATM + STRC issuance is accretive when MSTR trades at premium to BTC NAV. Premium compresses during BTC drawdowns; sustained compression makes issuance dilutive; cadence slows. **Extension (Jun 5): the reflexivity does not stop at a buying pause. The STRC perpetual-preferred carries a fixed dividend obligation that does NOT flex with the BTC price. When the issuance window closes, Strategy cannot costlessly roll the obligation, so it sells the asset at the margin to service it. The pause becomes a forced sale.** Capital-markets reflexivity trap, now with a confirmed forced-seller terminal state.
  - Evidence (re-condensed JUL 26; full arc in git): MAY 26 partial vindication (zero-BTC 8-K) → JUN 1 strong (first net sale in ~4 years, 32 BTC for STRC dividends) → JUN 13 bidirectionality (1,550-BTC re-buy: a reversible valve) → **JUL 6 at scale: the 3,588-BTC record sale (~$216M, EDGAR acc. 0001193125-26-295586, tranches @ $59,256/$60,773) on the DIVIDEND CALENDAR — both legs witnessed, edge `strong`.** JUL 19 counter-mechanism: liability pre-funding ($3.0B reserve — bounds the terminal state IF it holds; a sale THROUGH it = the leak is deeper than the calendar). **JUL 26 (condensed AUG 3) — buffer grew ($3.225B) + MSTR ROSE on the zero-buy filing (the market rewards pre-funding — incentive lock-in); terminal state printing down-cohort (DAT unwind) — the edge generalizes beyond Strategy.** [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/1050446/000119312526295586/mstr-20260706.htm) **AUG 3 — the edge's TERMINAL datapoint, and a mechanism refinement: the sale no longer needs a CLOSED issuance window.** The Aug 3 8-K shows a 2nd successive dividend-cycle sale (1,638 BTC @ $63,957, below cost) executed WHILE the ATM window was open ($290.6M of stock sold the same week) and while the buffer GREW to $4.0B — i.e., Strategy now treats BTC as one liquidity source among several in a capital program (dividends + STRC buybacks + reserve build), not a last resort behind the buffer. Fired THESIS-003 falsification #3 → thesis retired. The forced-seller framing softens to a REVEALED-PREFERENCE seller under a high cost of capital; the discriminating test is a third-cycle sale despite the full $4B buffer (watch 0.40). [The Block Aug 3](https://www.theblock.co/post/410414/michael-saylors-strategy-sells-another-1638-btc-for-105-million-reducing-total-holdings-to-842138-btc) **AUG 19 — the discriminating test RESOLVED: the Aug 10 8-K's third sale in six weeks (1,690 BTC @ $64,262, below cost) with the reserve at $4.65B and growing settles the question — DOCTRINE. The edge's terminal state is now a standing policy: Strategy treats BTC as a routine liquidity source in a capital program (sell coins below cost + sell stock → dividends, STRC buybacks, reserve), independent of need. Watch HIT at 0.40 fired THESIS-004 #2. Boundary refinement: the leak is open-ended in DURATION, bounded in RATE (~$100–110M/tranche) — escalation past $200M/filing is the supply-shock line (THESIS-005 #3). NEW INPUT queued: the MSCI screen (see `index-inclusion-screen` edge) can tighten the equity-financing side from OUTSIDE the rate regime.** [EDGAR Aug 10](https://www.sec.gov/Archives/edgar/data/0001050446/000119312526341297/mstr-20260810.htm)
  - Last refreshed: AUG 19, 2026

- **convert-debt-repurchase → btc-gain-without-accumulation**
  - Strength: `medium` (new edge, MAY 29 2026 — first observation)
  - Mechanism: A bitcoin-treasury company can generate accounting/economic "BTC gain" without buying new bitcoin by retiring its own convertible debt at a discount, with the gain measured against the implicit BTC backing of the redeemed paper. Provides an alternative growth lever when accumulation conditions are unfavorable.
  - Evidence: Strategy's May 26 8-K filed exactly this — $1.5B convert repurchase generated 4,391 BTC "BTC gain" ($333M) at unchanged 843,738 stack. Convert outstanding dropped $8.2B → $6.7B. New mechanism for Strategy's KPI continuity when NAV/STRC conditions don't support accumulation. [MSTR 8-K (SEC EDGAR)](https://www.sec.gov/Archives/edgar/data/0001050446/000119312526237907/mstr-ex99_1.htm)
  - Last refreshed: MAY 29, 2026

### Macro

- **fed-rate-cut-signaling → btc-correlated-equities-bid**
  - Strength: `medium`→`strong` (UPGRADED JUL 19 — the coupling has now been observed across THREE regimes inside a fortnight, with hard data as the pivot)
  - Mechanism: Risk-on rotation; weaker dollar; lower real rates favor non-yielding hard assets. The BTC/flow bid tracks rate-path DATA (jobs, breakevens, CPI), not the Fed's reputation and not energy relief — the DATA-vs-reputation distinction operationalized from the calibration record.
  - Evidence (re-condensed AUG 19; full arcs in git): Dec 2025 cut cycle → Jan 2026 ATH. **Regimes 1–6 (JUL 6 – AUG 7, condensed):** weak-jobs relief snapped the 10-day streak; a both-directions stress test in one window; soft CPI → 4 held inflow days (edge → `strong`); fastest transmission (~$1B run died within 24h of the Jul 23 bond flip); hawkish HOLD = STALL (−$61.5M week); then the AUG 7 anticipation wrinkle — the ~$750M restart PRECEDED the jobs print while September was still ~2/3 hike-priced. Mid-arc synthesis: flows respond to the NEXT decision's probability distribution, not the current decision's outcome. **AUG 19 — SEVENTH observation, and the discriminating test resolved AGAINST pure anticipation: flows did NOT run through the CPI — the week ending Aug 14 printed −$389.7M (worst since June, FBTC-led) despite the friendliest rate backdrop of the summer and an in-line print, then restarted (+$297.5M/+$21.8M) only when the POLICY shock hit Aug 17–19. Core refinement, now the edge's operating rule: flows are EVENT-gated, not LEVEL-gated — the marginal allocator buys REPRICINGS (of the rate path, and now of the policy regime), and an already-open gate generates no impulse. A 'sustain' forecast is therefore really a forecast that a fresh catalyst arrives inside the window (this cost the ledger 0.4225 on the sustain row). The edge's scope also WIDENS: the same transmission fired on a non-Fed repricing (the SEC rulebook + summit), suggesting the general form is 'regime-repricing → flow impulse' with the Fed as one source among two.**
  - Last refreshed: AUG 19, 2026

- **fed-chair-transition → near-term-rate-path-volatility**
  - Strength: `medium` (MAY 18 2026; condensed AUG 19 — full text in git)
  - Mechanism: A new chair's communications alone reposition the front end. Evidence: Warsh confirmed 54–45 (May 13), read "marginally dovish" — then his first dot plot (Jun 17) projected a 2026 HIKE (9/18; 17/18 upside-risk). Edge HOLDS (the curve repositioned); the directional prior decisively falsified. **Lesson (root of the Macro +0.42 era): never forecast a chair's policy from pre-confirmation reputation.** Next test: the Aug 28 Jackson Hole keynote.
  - Last refreshed: JUN 20, 2026

- **cpi-print-upside-surprise → fed-cut-odds-collapse**
  - Strength: `strong` (MAY 20 2026). Mechanism: inflation >1pp above target reprices forward cut odds fast via futures → real-rates path → risk-asset bid. Evidence (condensed AUG 3; full text in git): April CPI 3.8% → June-cut odds <10% (near-total upside repricing). **Asymmetry (JUN 1, CONFIRMED JUL 19): faster DOWN than UP** — the coolest print since 2020 (June CPI, Jul 14) restored only ~half the dovish pricing while a competing channel (oil) stayed open. **JUL 26 — terminal datapoint: the relief was FULLY repossessed within 10 days with no new DATA (Sept ~65%→~80%, above the pre-CPI peak) on the oil re-shock + tariff effectiveness. A cool print's half-life, when its dominant input reverses and a second channel opens, is under two weeks.** Upside `strong` / downside `medium`. Last refreshed: JUL 26, 2026.

- **geopolitical-energy-shock → cpi-ppi-reacceleration**
  - Strength: `strong` (MAY 29 2026). Mechanism: oil shocks transmit to headline inflation within one CPI cycle (PPI leads ~6wk). Evidence (condensed): Hormuz airstrikes Feb 2026 → Brent $73→$115–120, April PPI 6.0% YoY; US-Iran deal signed Jun 17 (Hormuz reopens) → June's 5.7% energy-slump CPI relief (Jul 14 print). **Asymmetry (Jun 17–20): energy relief does NOT buy a dovish Fed when core binds — `energy-relief → fed-pivot` weak-to-absent. RE-ACTIVATED JUL 19:** the ceasefire collapsed at the 60-day halfway mark; Brent >$85 and rising. **JUL 26 – AUG 7 arc (re-condensed AUG 19; full text in git):** Brent crossed $100 (Jul 24, Hormuz closure + Houthi attacks) and the rate market re-hardened BEFORE the July CPI — then the channel CLOSED through early August (strike pause → daily talks → agreed Iran–Oman corridor coordinates; Brent $101→$79.45 by Aug 5; AND-watch peaked 0.35). Companion channel folded in JUL 26: the 10–12.5% tariffs (effective Jul 24) — a policy-chosen headline force with NO de-escalation path, same downstream CPI→rate-pricing transmission. Jobs wrinkle (AUG 7): the September repricing was ultimately delivered by LABOR data, not energy — consistent with the qualifier (energy relief alone doesn't buy the pivot; a labor crack does). **AUG 19 — the channel RE-OPENED: the corridor process broke down (attacks dented reopening hopes Aug 12; Iran ruled out extending the interim arrangement and threatened escalation Aug 17; Hormuz traffic near standstill — ~3 vessels vs a 12-vessel 5-day average, Kpler; Trump said he won't seek an extension) and Brent ran $79 → $87.72 (Aug 10) → ~$90 (Aug 12–17). The July CPI (Aug 12, in-line) largely predated the re-rise; the AUGUST CPI (Sep 10, five days before the FOMC) carries it. EIA: Middle East production not back to pre-conflict levels until early 2027; 2026 Brent average ~$87. The Iran AND-watch stepped 0.35→0.15 (the re-establishment leg reversed).** Last refreshed: AUG 19, 2026.

- **geopolitical-risk-off-shock → btc-flow-reversal**
  - Strength: `weak`→`medium` (confidence DOWNGRADED MAY 31 — the flow reversal outlived the shock). Mechanism: geopolitical risk-off + tightening → ETF rotation OUT; but Jun 1 the shock reversed (Brent −19%, PCE cooled) yet outflows hit a RECORD 9-day streak, re-attributed to AI-equity rotation — real on the way IN, not sufficient on the way out; confounded by `risk-asset-relative-performance → btc-etf-rotation`. Iran deal signed Jun 17 → dormant-leaning. Needs a clean both-directions read. Last refreshed: JUN 1, 2026.

- **higher-for-longer-rates → corporate-treasury-financing-window-compression**
  - Strength: `medium`→`strong` (UPGRADED JUN 24 2026 — a second, sharper observation extends the mechanism from "can't issue cheaply" to "won't deploy")
  - Mechanism: A hawkish/higher-for-longer rate regime keeps the cost of capital high, which (a) compresses leveraged-treasury NAV premiums and (b) raises the coupon/conversion economics of the convert + preferred structures that fund cohort accumulation — narrowing the issuance window even when the spot price holds. **Extension (Jun 24): the squeeze does not only close the issuance window from the supply side; it also changes the DEPLOYMENT decision once capital is raised. When fixed preferred-dividend obligations carry a high coupon (Strategy's 11.5% STRC), the rational move under a higher-for-longer regime is to pre-fund those liabilities with cash rather than buy more of a non-yielding asset — so even an OPEN issuance window produces minimal BTC accumulation.** A hawkish dot plot is a SLOW squeeze on the corporate bid that operates through financing AND capital-allocation choice, distinct from the fast spot-price channel. This is the "hawkish Fed bites the corporate floor through the financing window, not the spot tape" cross-current.
  - Evidence (re-condensed AUG 19; full arc in git): JUN 20 hawkish dots into compressed-premium re-accumulation → JUN 24 deployment-side trigger (~90% of a ~$335M raise cash-parked) → JUN 28 dip-pass at $58K → JUL 6 forced-selling at scale (3,588 BTC on the dividend calendar) → JUL 12–19 pipeline leg (BSTR/Cantor terminated) + incumbent leg (zero deployed through a 15% recovery) → JUL 26 enforcement layer (MSTR ROSE on the zero-buy 8-K; DAT cohort exiting) → AUG 3 terminal-state escalation ("won't deploy" → "net-sells below cost" — 2nd successive below-cost sale funding the liability fortress). **AUG 19 — the discriminating test RESOLVED AGAINST this edge's grip on Strategy: September was priced OUT (hold ~60%) and the price broke out, yet the third sale printed (Aug 10) and the eighth no-buy week followed (Aug 17) with $20B+ ATM idle — the retreat is DOCTRINE, not cost-of-capital. Edge DOWNGRADED for the incumbent: `strong` for the COHORT (DAT unwind, BSTR pipeline — financing conditions still bind the marginal vehicle) but Strategy's own behavior has decoupled from the rate regime; its selling now runs on capital policy (see `nav-premium` edge terminal state + the new `index-inclusion-screen` edge for the non-rate pressure channel).** Last refreshed: AUG 19, 2026

- **risk-asset-relative-performance → btc-etf-rotation**
  - Strength: `medium` (held — first observed JUN 1 2026; NOT upgraded this run despite the post-FOMC outflow being consistent with the rotation, because there is still no clean both-directions read (BTC/Nasdaq + BTC/SOXX vs flows). JUN 20 note: the hawkish higher-for-longer regime WORSENS the opportunity cost the edge describes — non-yielding BTC must clear a higher real yield AND out-compete AI on relative performance — so the structural-tail weight rose, but the edge strength stays `medium` pending the both-directions confirmation.)
  - Note: competes with the geopolitical edge above.
  - Mechanism: Spot-BTC-ETF allocators treat BTC as one risk-asset sleeve among several. When a competing high-beta sector (AI / semiconductors) materially outperforms, marginal capital rotates toward it on an opportunity-cost basis — independent of BTC's own catalysts or the macro/geopolitical tape. This is a "high-beta tech-adjacent asset" framing rather than a "macro hedge" framing, and it is NOT addressable by a rate decision.
  - Evidence (condensed AUG 3; full text in git): May 2026 — the record 9-day/$2.8B streak persisted through oil collapse + cool PCE, attributed to AI/semis underperformance (CoinDesk). **JUN 5 — 2nd observation (weak→medium):** 13-day/$4.4B extension; Presto independently named the same mechanism. Still owed: the systematic BTC/Nasdaq + BTC/SOXX vs weekly-flows read before any upgrade.
  - Last refreshed: JUN 5, 2026
- **dollar-weakness → btc-gold-tandem-bid**
  - Strength: `medium` (mechanism BROADENED AUG 19, 2026)
  - Mechanism: Both function as non-sovereign monetary alternatives when confidence in sovereign paper weakens. Original form: DXY-driven. **AUG 19 broadening: the trigger can be FISCAL/long-end stress with the dollar flat** — sovereign-debt strain expressed in yields, not FX.
  - Evidence: 2024–2026 BTC/gold correlation during dollar drawdowns. **AUG 19 2026 — the cleanest 2026 tandem datapoint, via the new channel: with DXY flat (~99.6), the 30Y at its highest since 2007 forced the Treasury to double long-bond buybacks (Bessent, $2B→$4B/op, eff. Sep 9), and gold surged to $4,480 (best since early June) the SAME day BTC hit $69,500 — both non-sovereign assets at multi-month highs on a day defined by managed-market intervention in the sovereign curve. Confound noted honestly: BTC's move had its own policy catalyst (SEC/summit), so this is supportive, not clean, evidence — a second fiscal-stress tandem day without a BTC-specific catalyst would firm the broadened form.** [CNBC — Treasury buybacks](https://www.cnbc.com/2026/08/19/treasury-announces-upscaled-buyback-operation-for-longer-term-debt-sending-yields-lower.html)
  - Last refreshed: AUG 19, 2026

- **foreign-statutory-reclassification → domestic-legislative-pressure**
  - Strength: `weak` (new edge, JUL 19 2026 — first observation)
  - Mechanism: When a major foreign jurisdiction ENACTS the regulatory classification a stalled domestic bill merely proposes, it converts the domestic debate's abstract "competitiveness" argument into a concrete, citable precedent — pressuring the domestic timeline through elite/lobbying channels rather than vote math. The foreign statute also creates a real alternative venue (listings, custody, tax residence) that raises the measurable cost of domestic delay.
  - Evidence: JUL 19 2026 — Japan's Diet gave final passage (Jul 15) to FIEA amendments reclassifying Bitcoin + ~104 crypto assets as financial instruments (TSE spot-ETF rails targeted 2027; 20% flat tax from 2028) in the same week the U.S. CLARITY Act hit its ethics standoff; the House's Jul 17 Federal Hall field hearing ran explicitly on jobs/competitiveness/onshoring messaging. **JUL 26 — the venue-competition leg's PRECONDITION landed: CLARITY conceded its pre-recess window (Thune, Jul 23) and THESIS-001 retired, so Japan's statute now carries the unlock mechanism alone until at least September. The pressure leg did NOT observably fire (no accelerated U.S. timeline; the slip happened anyway), which keeps the edge `weak` — the live test is now the migration leg: watch for U.S.-listed issuers/exchanges announcing Tokyo plans into the September window.** [CoinDesk — Japan reclassifies](https://www.coindesk.com/policy/2026/07/15/japan-reclassifies-crypto-as-a-financial-asset-paves-way-for-tax-cuts)
  - Last refreshed: JUL 26, 2026

### Sovereign action

- **sovereign-reserve-announcement → institutional-product-launches**
  - Strength: `weak` (candidate heuristic)
  - Mechanism: Sovereign legitimization de-risks institutional product launches.
  - Evidence: 1 partial cycle observed. Texas → 401(k) was suspiciously fast; may not fit.
  - Last refreshed: MAY 18, 2026

- **sovereign-fiscal-stress → reserve-drawdown**
  - Strength: `weak` (newly observed, MAY 18 2026 — first concrete case)
  - Mechanism: Sovereign BTC reserves held outside a hard commitment regime are first-call liquidity for large discretionary spending or IMF program obligations.
  - Evidence: Bhutan stack drawn from ~13K BTC down to ~3.4K (~75% drawdown), per Arkham; reported funding source for Gelephu Mindfulness City. DHI disputes the read but doesn't deny scale.
  - Last refreshed: MAY 18, 2026

### Protocol

- **quantum-migration-bip-progress → sovereign-holder-engagement**
  - Strength: `weak` (forward-looking — not yet observed)
  - Mechanism: Sovereign holders have the most to lose from a lost-coin-disposition decision and the largest political voice.
  - Evidence: Speculative; no sovereign has yet commented on BIP-360/361.
  - Last refreshed: MAY 18, 2026

- **core-non-endorsement + low-miner-signaling → contested-soft-fork-activation-unlikely / chain-split-risk**
  - Strength: `medium` (new edge, JUN 24 2026 — BIP-110 is the first concrete UASF activation contest tracked)
  - Mechanism: A UASF soft fork needs either miner signaling (≥55% of a 2,016-block period for early lock-in) OR enough economic-node enforcement to make the flag day binding. When the largest implementation / node share (Bitcoin Core) declines to endorse AND mining-pool signaling is negligible, the activation path is effectively closed — the residual risk shifts from "the fork activates" to "a minority fork client enforces unilaterally and produces a brief contentious chain split." Core's node/implementation dominance is the gating variable in both directions.
  - Evidence: JUN 24 2026 — BIP-110 (data-limit soft fork) sits at ~0.31% version-bit-4 signaling as of Jun 22 with no major mining pool signaling and no Bitcoin Core endorsement (backing concentrated in Bitcoin Knots); UASF flag day ~Aug 7 2026 (block 961,632). Watch-row p set to 0.10 for lock-in by the flag day. A separate Sztorc hard-fork thread in the same window raises the split-tail rather than the activation odds. Needs the Aug-7 outcome (lapses as non-event vs. produces a transient split) to validate the edge's split-risk leg. Source: bip110.org · github.com/bitcoin/bips/bip-0110.mediawiki · BGeometrics signaling tracker. AUG 3 note: signaling still ~0–0.31% (≈5 EH/s of ~940) entering the final week; Foundry ran a hashrate-weighted miner vote timed to block 961,632. **AUG 7 — the ACTIVATION leg VALIDATED: the flag day arrived with signaling ~0–2.45% of blocks and lock-in failed (watch row scored MISS at p=0.10, Brier 0.01 — the ledger's first protocol resolution).** The split-risk leg remains open through the mandatory window (blocks 961,632–963,647, ~Aug 21) — enforcing nodes est. 2–8% of listening nodes, a would-be chain with ~zero hashpower — plus the eCash spinoff (block 964,000, ~Aug 21; airdrop-style, ETF-insulated). Successor watch row seeded at 0.10; a >24h divergent chain or major split-asset listing validates the split leg; a quiet lapse completes the edge's both-legs read.
  - Last refreshed: AUG 7, 2026

- **self-custody-security-failure → custodial-wrapper-relative-advantage**
  - Strength: `weak` (AUG 3 2026; condensed AUG 19 — full text in git)
  - Mechanism: a self-custody failure redistributes preference BETWEEN wrappers toward custodial ones (the sign-reversed cousin of the matrix's protocol→etfs −0.02, which models protocol failures as ETF-negative). Evidence: the Coldcard Mk3 breach (~$116M final tally, largest hardware-wallet compromise in history) in the custodial wrapper's quietest month — no flow-level confirmation yet (tape rate/policy-dominated; needs a custody-mix datapoint). AUG 19 note: the tally has been static since Aug 4 (containment watch 0.10) — the incident is closing without the attributable wrapper-shift observation; the edge stays `weak` awaiting a second instance.
  - Last refreshed: AUG 19, 2026

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
