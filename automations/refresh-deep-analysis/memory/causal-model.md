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
  - Evidence (condensed JUL 19): three distinct congestion instances stepped the CLARITY watch 0.40→0.30→0.25→0.20 with no change to its vote math — JUN 24 SAVE-Act signing standoff freezing the House floor; JUN 28 the blockade broadening to FISA + reconciliation while the Senate left a two-week recess with CLARITY unscheduled; JUL 12 the NDAA consuming the first usable Senate week against a dated Aug 7 recess deadline. [The Hill](https://thehill.com/homenews/house/5940772-save-america-act-gridlock-house/) · [CryptoSlate](https://cryptoslate.com/clarity-act-misses-july-target-and-runs-into-an-august-7-senate-clock/) **JUL 19 — the RELEASE observation (condensed AUG 3; full text in git):** the NDAA cleared and leadership immediately targeted the week of Jul 20 — decongestion reopens the window promptly without improving the votes; both legs of the TIMING edge observed. **JUL 26 — TERMINAL CONFIRMATION (condensed):** Thune conceded Jul 23 as the CR + sanctions consumed the reopened window exactly as modeled; the cloture watch scored MISS at p=0.20 (Brier 0.04 vs betting markets' ~45%) and THESIS-001 retired on condition #2. Forward wrinkle: the SAME CR, by deferring the fall funding fight, FREES ~3 September Senate weeks — the edge's congestion leg now cuts constructively for the September watch (0.25). [CoinDesk Jul 23](https://www.coindesk.com/policy/2026/07/23/clarity-act-expected-to-miss-its-window-before-congress-summer-break-leadership-says) · [Washington Times Jul 24](https://www.washingtontimes.com/news/2026/jul/24/senate-seeks-return-bipartisanship-government-funding-stopgap/) **AUG 3 — 4th instance, in miniature: Thune re-committed publicly to a pre-recess vote (BGov), yet Monday Aug 3's floor schedule contains NO CLARITY action — the day's only roll-call is cloture on the H.R. 6500 funding vehicle (~5:30 pm). Leadership signaling and floor reality diverged again, with the shared resource (floor time) going to the must-pass item. The endgame watch (petition by ~Aug 5 / vote ~Aug 7) is priced 0.30 largely on this edge.** [crypto.news — Wednesday deadline](https://crypto.news/clarity-act-faces-wednesday-deadline-for-friday-vote/) **AUG 7 — 5th confirming instance and the summer's TERMINAL datapoint: no petition, no vote (endgame row MISS at 0.30, Brier 0.09).** New mechanism wrinkle logged: VOTE-BANKING — leadership treats a cloture vote as an asset to spend at its best window, not a messaging opportunity; Thune deferred the doomed vote to "first thing" post-recess (Sep 15–16) rather than burn it. Forward: the Collins–Murray CR (89–4, funded through Dec 11) FREES the September floor — the edge's congestion leg now cuts constructively for the September row (0.25), leaving votes as the sole constraint for the first time since May. [CoinDesk Aug 6](https://www.coindesk.com/policy/2026/08/06/senate-won-t-vote-on-crypto-clarity-act-before-its-summer-break)
  - Last refreshed: AUG 7, 2026

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
  - Strength: `medium` (new edge, JUN 28 2026 — first observation)
  - Mechanism: A large scheduled derivatives expiry (here a ~$10B quarter-end Deribit options expiry, Jun 26) mechanically flushes leveraged positioning around the settlement: dealers re-hedge gamma, max-pain pinning unwinds, and stop-outs cluster into a thinning quarter-end order book — producing a forced-liquidation wave that is at least PARTLY calendar-driven rather than fresh conviction selling. This is the key confound on reading a second cascade as structural: the cascade's timing is not independent of the calendar, so a ≥$1B liquidation day coinciding with a scheduled quarter-end expiry is weaker structural evidence than the same day printing on an ordinary session.
  - Evidence: JUN 28 2026 — back-to-back billion-dollar liquidation days (Jun 25 ~$1.08B; Jun 26 ~$1.26B/209K traders) and a fresh ~$58K low, with the Jun 26 wave landing on a $10B quarter-end Deribit options expiry. This is precisely why THESIS-003 stepped only to 0.40 (not retired) on falsification #5 "effectively firing" — the expiry caveat holds the cascade short of an unambiguous structural break. Needs a second instance (a billion-dollar cascade on a NON-expiry session, which would read cleanly structural) for a both-cases read. [CCN](https://www.ccn.com/news/crypto/bitcoin-price-crash-58k-1-26b-liquidations-55k/)
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
  - Evidence (re-condensed JUL 26; full arc in git): MAY 26 partial vindication (zero-BTC 8-K) → JUN 1 strong (first net sale in ~4 years, 32 BTC for STRC dividends) → JUN 13 bidirectionality (1,550-BTC re-buy: a reversible valve) → **JUL 6 at scale: the 3,588-BTC record sale (~$216M, EDGAR acc. 0001193125-26-295586, tranches @ $59,256/$60,773) on the DIVIDEND CALENDAR — both legs witnessed, edge `strong`.** JUL 19 counter-mechanism: liability pre-funding ($3.0B reserve — bounds the terminal state IF it holds; a sale THROUGH it = the leak is deeper than the calendar). **JUL 26 (condensed AUG 3) — buffer grew ($3.225B) + MSTR ROSE on the zero-buy filing (the market rewards pre-funding — incentive lock-in); terminal state printing down-cohort (DAT unwind) — the edge generalizes beyond Strategy.** [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/1050446/000119312526295586/mstr-20260706.htm) **AUG 3 — the edge's TERMINAL datapoint, and a mechanism refinement: the sale no longer needs a CLOSED issuance window.** The Aug 3 8-K shows a 2nd successive dividend-cycle sale (1,638 BTC @ $63,957, below cost) executed WHILE the ATM window was open ($290.6M of stock sold the same week) and while the buffer GREW to $4.0B — i.e., Strategy now treats BTC as one liquidity source among several in a capital program (dividends + STRC buybacks + reserve build), not a last resort behind the buffer. Fired THESIS-003 falsification #3 → thesis retired. The forced-seller framing softens to a REVEALED-PREFERENCE seller under a high cost of capital; the discriminating test is a third-cycle sale despite the full $4B buffer (watch 0.40). [The Block Aug 3](https://www.theblock.co/post/410414/michael-saylors-strategy-sells-another-1638-btc-for-105-million-reducing-total-holdings-to-842138-btc)
  - Last refreshed: AUG 3, 2026

- **convert-debt-repurchase → btc-gain-without-accumulation**
  - Strength: `medium` (new edge, MAY 29 2026 — first observation)
  - Mechanism: A bitcoin-treasury company can generate accounting/economic "BTC gain" without buying new bitcoin by retiring its own convertible debt at a discount, with the gain measured against the implicit BTC backing of the redeemed paper. Provides an alternative growth lever when accumulation conditions are unfavorable.
  - Evidence: Strategy's May 26 8-K filed exactly this — $1.5B convert repurchase generated 4,391 BTC "BTC gain" ($333M) at unchanged 843,738 stack. Convert outstanding dropped $8.2B → $6.7B. New mechanism for Strategy's KPI continuity when NAV/STRC conditions don't support accumulation. [MSTR 8-K (SEC EDGAR)](https://www.sec.gov/Archives/edgar/data/0001050446/000119312526237907/mstr-ex99_1.htm)
  - Last refreshed: MAY 29, 2026

### Macro

- **fed-rate-cut-signaling → btc-correlated-equities-bid**
  - Strength: `medium`→`strong` (UPGRADED JUL 19 — the coupling has now been observed across THREE regimes inside a fortnight, with hard data as the pivot)
  - Mechanism: Risk-on rotation; weaker dollar; lower real rates favor non-yielding hard assets. The BTC/flow bid tracks rate-path DATA (jobs, breakevens, CPI), not the Fed's reputation and not energy relief — the DATA-vs-reputation distinction operationalized from the calibration record.
  - Evidence (re-condensed AUG 7; full arcs in git): Dec 2025 cut cycle → Jan 2026 ATH. **Regimes 1–5 (JUL 6 – AUG 3):** (1) weak-jobs relief snapped the 10-day streak; (2) both-directions stress test in one window (hawkish minutes out / IBIT dip-buys in); (3) soft CPI → 4 inflow days that HELD through a hawkish drift (edge → `strong`); (4) fastest transmission — the ~$1B run died within 24h of the Jul 23 bond flip (threshold: flows look through stale-hawkish reminders but not a genuine next-DECISION repricing); (5) a hawkish HOLD = a STALL, not a direction (−$61.5M week; smallest positive month ~$200M). Synthesis: **flows respond to the NEXT decision's probability distribution, not the current decision's outcome** — with September open, the marginal allocator commits in neither direction, per THESIS-004 falsification #3 (a dovish surprise that fails to restart flows within two weekly prints would be the edge's first anomaly). **AUG 7 — SIXTH regime observation, with an ANTICIPATION wrinkle: the restart PRECEDED the print.** Four straight inflow days (~$750M Aug 3–6, IBIT ~$604M) printed WHILE September was still ~2/3 hike-priced; then the jobs miss (−23K vs +83K; −103K revisions) flipped FedWatch to a hold within hours and BTC tagged $65,340. Refinement, not anomaly: flows track the gate's EXPECTED path (the oil collapse made a cool CPI/September hold progressively more likely all week), not its posted setting — or the deleveraged post-expiry book had no sellers left. Discriminating test at the Aug 12 CPI: flows stalling INTO it then restarting after = posted-odds model; running through it = pipeline-anticipation channel confirmed. #3's clock is running with early defusal likely.
  - Last refreshed: AUG 7, 2026

- **fed-chair-transition → near-term-rate-path-volatility**
  - Strength: `medium` (new edge, MAY 18 2026)
  - Mechanism: A new chair with publicly distinct policy preferences shifts expectations even before any rate action — communications style alone repositions the front end of the curve.
  - Evidence: Warsh confirmed 54–45 (closest in modern Senate history) on May 13; widely read as marginally dovish vs Powell; first FOMC June 16–17. Pre-meeting front-end pricing already moving. **JUN 20, 2026 — RESOLVED hawkish, contradicting the "marginally dovish" prior:** Warsh's first dot plot (Jun 17) projected a 2026 HIKE (9/18 officials), 17/18 tilting inflation risk to the upside — the opposite of the consensus pre-confirmation read. The edge (transition → volatility) HOLDS — the chair change did reposition the curve — but the *directional* "Warsh = dovish" reputational prior is decisively falsified. **Calibration tie-in: this is the root cause of the macro category's +0.42 over-confidence (7/7 dovish forecasts missed). Lesson: do not forecast a chair's policy from pre-confirmation reputation.**
  - Last refreshed: JUN 20, 2026

- **cpi-print-upside-surprise → fed-cut-odds-collapse**
  - Strength: `strong` (MAY 20 2026). Mechanism: inflation >1pp above target reprices forward cut odds fast via futures → real-rates path → risk-asset bid. Evidence (condensed AUG 3; full text in git): April CPI 3.8% → June-cut odds <10% (near-total upside repricing). **Asymmetry (JUN 1, CONFIRMED JUL 19): faster DOWN than UP** — the coolest print since 2020 (June CPI, Jul 14) restored only ~half the dovish pricing while a competing channel (oil) stayed open. **JUL 26 — terminal datapoint: the relief was FULLY repossessed within 10 days with no new DATA (Sept ~65%→~80%, above the pre-CPI peak) on the oil re-shock + tariff effectiveness. A cool print's half-life, when its dominant input reverses and a second channel opens, is under two weeks.** Upside `strong` / downside `medium`. Last refreshed: JUL 26, 2026.

- **geopolitical-energy-shock → cpi-ppi-reacceleration**
  - Strength: `strong` (MAY 29 2026). Mechanism: oil shocks transmit to headline inflation within one CPI cycle (PPI leads ~6wk). Evidence (condensed): Hormuz airstrikes Feb 2026 → Brent $73→$115–120, April PPI 6.0% YoY; US-Iran deal signed Jun 17 (Hormuz reopens) → June's 5.7% energy-slump CPI relief (Jul 14 print). **Asymmetry (Jun 17–20): energy relief does NOT buy a dovish Fed when core binds — `energy-relief → fed-pivot` weak-to-absent. RE-ACTIVATED JUL 19:** the ceasefire collapsed at the 60-day halfway mark; Brent >$85 and rising. **JUL 26 — the forward implication began printing: Brent CROSSED $100 (first time in two months, then eased below) on Hormuz's effective closure + Houthi tanker attacks + Tehran rejecting a temporary truce; the rate market re-hardened (Sept ~80%) BEFORE the July CPI even prints. NOTE — a second, non-energy channel joined the mechanism this week: the 10–12.5% tariffs on 60 partners (effective Jul 24) are a policy-chosen headline-inflation force with no de-escalation path (folded here as a companion channel rather than a new edge — same downstream transmission through CPI → rate pricing).** The July CPI (mid-Aug release) now carries BOTH the reversed energy input and the first tariff pass-through; Brent sustained >$100 for 2+ weeks is the THESIS-003 falsification-#5 oil leg. **AUG 3 — the energy channel began CLOSING while the tariff channel stayed open: the U.S. paused strikes from ~Jul 26 (13 nights, then a second) to let talks develop (reported deal shape = reopen Hormuz + end the nuclear program; Iranian–Omani meeting in Tehran; Iran denies direct U.S. talks) and Brent fell $101 → $92 (Sept delivery), sub-$100 since ~Jul 25. The FOMC statement itself named "energy supply shocks" as the elevated-inflation driver — so the Aug 12 CPI is now a clean two-channel decomposition test: reversed-energy input (disinflationary) vs first tariff pass-through (inflationary). The Iran AND-watch stepped 0.15→0.25 on the de-escalation.** **AUG 7 — the energy channel kept closing: Brent $92 → $83.51 (Aug 3, on the talks announcement) → ~$79.45 settle (Aug 5); talks now DAILY from Aug 4 (Hormuz first, then nuclear); Iran–Oman agreed the geographic COORDINATES of a protected shipping corridor (joint statement being finalized); Trump "Hormuz reopening soon" — against a Houthi tanker-attack claim (Aug 5) and a still-constrained strait. AND-watch 0.25→0.35. The Aug 12 CPI decomposition test now tilts disinflationary on the energy side; the tariff channel remains the open counter-input. Note the jobs wrinkle: the September repricing was ultimately delivered by LABOR data, not energy — consistent with the qualifier (energy relief alone doesn't buy the pivot; a labor crack does).** Last refreshed: AUG 7, 2026.

- **geopolitical-risk-off-shock → btc-flow-reversal**
  - Strength: `weak`→`medium` (confidence DOWNGRADED MAY 31 — the flow reversal outlived the shock). Mechanism: geopolitical risk-off + tightening → ETF rotation OUT; but Jun 1 the shock reversed (Brent −19%, PCE cooled) yet outflows hit a RECORD 9-day streak, re-attributed to AI-equity rotation — real on the way IN, not sufficient on the way out; confounded by `risk-asset-relative-performance → btc-etf-rotation`. Iran deal signed Jun 17 → dormant-leaning. Needs a clean both-directions read. Last refreshed: JUN 1, 2026.

- **higher-for-longer-rates → corporate-treasury-financing-window-compression**
  - Strength: `medium`→`strong` (UPGRADED JUN 24 2026 — a second, sharper observation extends the mechanism from "can't issue cheaply" to "won't deploy")
  - Mechanism: A hawkish/higher-for-longer rate regime keeps the cost of capital high, which (a) compresses leveraged-treasury NAV premiums and (b) raises the coupon/conversion economics of the convert + preferred structures that fund cohort accumulation — narrowing the issuance window even when the spot price holds. **Extension (Jun 24): the squeeze does not only close the issuance window from the supply side; it also changes the DEPLOYMENT decision once capital is raised. When fixed preferred-dividend obligations carry a high coupon (Strategy's 11.5% STRC), the rational move under a higher-for-longer regime is to pre-fund those liabilities with cash rather than buy more of a non-yielding asset — so even an OPEN issuance window produces minimal BTC accumulation.** A hawkish dot plot is a SLOW squeeze on the corporate bid that operates through financing AND capital-allocation choice, distinct from the fast spot-price channel. This is the "hawkish Fed bites the corporate floor through the financing window, not the spot tape" cross-current.
  - Evidence (re-condensed JUL 26; full arc in git): JUN 20 hawkish dots into compressed-premium re-accumulation → JUN 24 deployment-side trigger (~$335M raised, 520 BTC deployed, ~90% cash-parked) → JUN 28 dip-pass at $58K → JUL 6 forced-selling at scale (3,588 BTC on the dividend calendar even as rates eased) → JUL 12–19 pipeline leg (BSTR/Cantor terminated, PIPE dropped) + incumbent leg ($466.7M raised, zero deployed through a 15% recovery — downshift is regime-policy). **JUL 26 (condensed AUG 3) — enforcement layer + cohort floor-test: MSTR ROSE on the zero-buy 8-K (squeeze now market-enforced) while the junior DAT cohort exits outright (no-buffer terminal state).** Discriminating test unchanged: a July hold + fading odds reopening deployment AND reviving the BSTR listing = cyclical; both shut through a dovish turn = structural. [CoinDesk — BSTR](https://www.coindesk.com/markets/2026/07/08/adam-back-s-bstr-scraps-original-spac-terms-seeks-new-deal) **AUG 3 — the compression's terminal state ESCALATED from "won't deploy" to "net-sells below cost": under the held-hawkish regime (9–3 hold, September ~2/3), Strategy's sixth consecutive no-buy filing was also its second consecutive sale filing — selling BTC at $63,957 (below the $75,419 basis, realizing losses) to help fund a $4.0B liability fortress covering ~2 years of the $1.76B/yr preferred bill. The edge's discriminating test sharpens: if September's hike gets priced OUT (Aug data dovish) and deployment STILL doesn't resume with $20B+ of ATM capacity idle, the retreat is doctrine, not cost-of-capital — that would decouple this edge from the corporate pause and downgrade it.** Last refreshed: AUG 3, 2026

- **risk-asset-relative-performance → btc-etf-rotation**
  - Strength: `medium` (held — first observed JUN 1 2026; NOT upgraded this run despite the post-FOMC outflow being consistent with the rotation, because there is still no clean both-directions read (BTC/Nasdaq + BTC/SOXX vs flows). JUN 20 note: the hawkish higher-for-longer regime WORSENS the opportunity cost the edge describes — non-yielding BTC must clear a higher real yield AND out-compete AI on relative performance — so the structural-tail weight rose, but the edge strength stays `medium` pending the both-directions confirmation.)
  - Note: competes with the geopolitical edge above.
  - Mechanism: Spot-BTC-ETF allocators treat BTC as one risk-asset sleeve among several. When a competing high-beta sector (AI / semiconductors) materially outperforms, marginal capital rotates toward it on an opportunity-cost basis — independent of BTC's own catalysts or the macro/geopolitical tape. This is a "high-beta tech-adjacent asset" framing rather than a "macro hedge" framing, and it is NOT addressable by a rate decision.
  - Evidence (condensed AUG 3; full text in git): May 2026 — the record 9-day/$2.8B streak persisted through oil collapse + cool PCE, attributed to AI/semis underperformance (CoinDesk). **JUN 5 — 2nd observation (weak→medium):** 13-day/$4.4B extension; Presto independently named the same mechanism. Still owed: the systematic BTC/Nasdaq + BTC/SOXX vs weekly-flows read before any upgrade.
  - Last refreshed: JUN 5, 2026
- **dollar-weakness → btc-gold-tandem-bid**
  - Strength: `medium`
  - Mechanism: Both function as non-sovereign monetary alternatives when DXY weakens.
  - Evidence: 2024–2026 BTC/gold correlation during dollar drawdowns.
  - Last refreshed: MAY 18, 2026

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
  - Strength: `weak` (new edge, AUG 3 2026 — first observation; mechanism named, flow-level confirmation not yet observed)
  - Mechanism: A high-profile SELF-CUSTODY security failure (hardware-wallet compromise, seed-generation flaw) damages confidence in the "hold your own keys" model among marginal/newer holders while leaving institutional custodial infrastructure (ETF custodians, corporate treasury custody) architecturally untouched — marginally shifting the custody-choice calculus toward regulated wrappers. This is the SIGN-REVERSED cousin of the matrix's protocol→etfs −0.02 delta (which models protocol incidents as ETF-negative): a PROTOCOL failure hurts the asset inside every wrapper, but a SELF-CUSTODY failure redistributes preference BETWEEN wrappers, favoring custodial ones.
  - Evidence: AUG 3 2026 — the Coldcard Mk3 breach (~1,367 BTC / ~$89M reconstructed offline from a Mar 2021 seed-RNG firmware flaw; largest hardware-wallet compromise in Bitcoin history) landed in the same week the custodial ETF wrapper printed its quietest month on record — a natural experiment in relative trust. No flow-level confirmation yet (August flow prints are rate-dominated; disentangling would need a custody-mix datapoint like exchange/custodian inflow attribution). Watch: does self-custody tooling telemetry (hardware sales, node counts) or custodial inflow attribution shift over Q3? A second instance (another vendor-class failure) plus any attributable wrapper-preference shift would upgrade toward `medium`. [Coinkite advisory](https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/) · [Crypto Briefing](https://cryptobriefing.com/coldcard-firmware-flaw-bitcoin-hack-89-million/)
  - Last refreshed: AUG 3, 2026

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
