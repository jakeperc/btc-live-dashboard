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
  - Evidence: JUN 24 2026 — Trump canceled the ROAD to Housing Act signing and refused to sign until the SAVE America Act passes; a House GOP bloc (Luna) vowed to block ALL House legislation until SAVE clears, canceling Wednesday House rule votes; SAVE needs 60 votes and stalls without Democrats. CLARITY watch-row stepped 0.40→0.30 specifically on this congestion (not on any change to CLARITY's own vote count). **JUN 28 2026 — the upgrade trigger: the standoff BROADENED and the slip leg began confirming.** The SAVE-Act blockade widened to also stall FISA surveillance reauthorization + a budget reconciliation package (a multi-front floor jam), and the Senate left for a TWO-WEEK RECESS with CLARITY still unscheduled — so the pre-July-4 path is now dead and the floor window measurably narrowed without any change to CLARITY's vote math. CLARITY watch-row + standalone stepped 0.30→0.25 on exactly this exogenous congestion. The slip is now observed in motion (a hard window closed), not just hypothesized; the Aug-recess outcome still finalizes whether CLARITY slips to the fall. [The Hill — SAVE gridlock](https://thehill.com/homenews/house/5940772-save-america-act-gridlock-house/) · [PYMNTS — CLARITY vs recess deadline](https://www.pymnts.com/cryptocurrency/2026/clarity-act-nears-senate-floor-ahead-of-recess-deadline/) **JUL 12 2026 — a FRESH, concrete floor-time competitor named:** the deadline is now dated Aug 7 (recess) and the NDAA (defense authorization) is set to consume the week of Jul 13+ floor time — the first usable Senate week back — so CLARITY has ~2 weeks against a must-pass bill for the scarce floor budget, with its own vote math unchanged. CLARITY watch + standalone stepped 0.25→0.20 on exactly this congestion. The edge's mechanism (a must-pass bill crowds out second-tier legislation on timing alone) gains a 3rd distinct instance (SAVE housing standoff → SAVE/FISA/reconciliation → NDAA), strengthening the `strong` rating. [CryptoSlate — Aug 7 Senate clock](https://cryptoslate.com/clarity-act-misses-july-target-and-runs-into-an-august-7-senate-clock/)
  - Last refreshed: JUL 12, 2026

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
  - Strength: `medium`→`weak` (DOWNGRADED JUN 5, 2026 — the asymmetry held under passive selling but BROKE under a leveraged cascade)
  - Mechanism: With LTH cohort >90% of supply, marginal flows hit a thin order book; equivalent outflows don't pressure price symmetrically. **Scope correction (Jun 5): this holds for PASSIVE selling into a calm book, but NOT once leverage enters the loop — reflexive forced selling overwhelms the thin-book buffer.**
  - Evidence: **MAY 20, 2026:** ~$1B ETF weekly outflow + $657M liquidations → only ~5% drawdown (supportive but ambiguous). **JUN 1, 2026 (looked like strongest data point):** record nine-day $2.8B ETF outflow → only ~9% drawdown ($80K→$73K), no cascade. **JUN 5, 2026 — CONTRADICTING:** the buffer FAILED. The streak extended to 13 days / $4.4B, and once $1.8B of leveraged longs were force-liquidated in 72h the price cascaded ~17% further to sub-$60K ($73K→$60.7K) with a disorderly move. The ~9% Jun 1 drawdown was not the floor holding — it was the calm before leverage broke it. Float scarcity is a real buffer against passive outflows but is NOT sufficient against a reflexive leveraged cascade. This is the kill-condition data point for the float-scarcity heuristic's strong form.
  - Last refreshed: JUN 5, 2026

- **etf-passive-outflow + leverage → reflexive-liquidation-cascade**
  - Strength: `strong` (new edge JUN 5 2026; SELF-LIMITING property confirmed JUN 13)
  - Mechanism: Sustained passive ETF redemptions pressure spot; a thinning book trips leveraged long liquidations; forced selling dumps more spot into the same thin book; lower prices trigger the next redemption + the next liquidation tranche. A self-reinforcing downward loop that the float-scarcity buffer cannot arrest because the marginal seller is non-discretionary. **Self-limiting:** a given long can be liquidated once, so once the leveraged cohort is flushed the loop loses its fuel — the decisive recovery tell is the ABSENCE of a second cascade.
  - Evidence: Jun 2–5 2026 — 13-day/$4.4B ETF outflow streak + $1.8B leveraged-long liquidations in 72h → BTC $73K→$60.7K (~17% over 3 days), first sub-$60K since Nov 2024. Longs disproportionately hit (signature of a flush, not a rotation). [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-05/bitcoin-falls-below-60-000-for-first-time-since-2024-trump-win) · [CoinDesk Jun 4](https://www.coindesk.com/markets/2026/06/04/bitcoin-drops-below-usd62-000-as-usd1-5-billion-in-crypto-longs-get-wiped-out). **JUN 13 2026 — self-limiting property CONFIRMED:** the eight days after the Jun 5 trough produced no second liquidation wave; BTC recovered ~6.9% to ~$63,900 and the ETF streak broke (Jun 11 +$30M, Jun 12 +$86M). The cascade exhausted itself exactly as the edge predicts. This is the clean recovery-shape observation that pairs with the Jun 5 cascade observation — the full loop (ignition AND burnout) is now witnessed once end-to-end.
  - Last refreshed: JUN 13, 2026

- **quarter-end-options-expiry → mechanical-liquidation-cascade**
  - Strength: `medium` (new edge, JUN 28 2026 — first observation)
  - Mechanism: A large scheduled derivatives expiry (here a ~$10B quarter-end Deribit options expiry, Jun 26) mechanically flushes leveraged positioning around the settlement: dealers re-hedge gamma, max-pain pinning unwinds, and stop-outs cluster into a thinning quarter-end order book — producing a forced-liquidation wave that is at least PARTLY calendar-driven rather than fresh conviction selling. This is the key confound on reading a second cascade as structural: the cascade's timing is not independent of the calendar, so a ≥$1B liquidation day coinciding with a scheduled quarter-end expiry is weaker structural evidence than the same day printing on an ordinary session.
  - Evidence: JUN 28 2026 — back-to-back billion-dollar liquidation days (Jun 25 ~$1.08B; Jun 26 ~$1.26B/209K traders) and a fresh ~$58K low, with the Jun 26 wave landing on a $10B quarter-end Deribit options expiry. This is precisely why THESIS-003 stepped only to 0.40 (not retired) on falsification #5 "effectively firing" — the expiry caveat holds the cascade short of an unambiguous structural break. Needs a second instance (a billion-dollar cascade on a NON-expiry session, which would read cleanly structural) for a both-cases read. [CCN](https://www.ccn.com/news/crypto/bitcoin-price-crash-58k-1-26b-liquidations-55k/)
  - Last refreshed: JUN 28, 2026

- **cumulative-ytd-flow-inversion → structural-regime-confirmation**
  - Strength: `medium` (new edge, JUN 24 2026 — first observation; distinct from streak-level outflow edges)
  - Mechanism: Streak-level (daily/weekly) ETF outflows are ambiguous — they can be tactical rotation that a positive week reverses. But when the YEAR-TO-DATE CUMULATIVE flow turns negative after months of building, it means the marginal allocator has not merely paused but net-exited the position established over the prior period. The cumulative inversion is a slower, higher-confidence signal than any single streak: it cannot be explained as a within-period rebalance because it erases the period's entire net build. This is the signal that shifts the burden of proof from bears to bulls — "the year is still net-positive" is the bull case's load-bearing sentence, and the inversion deletes it.
  - Evidence: JUN 24 2026 — two record streaks (~$7.2B May+June) flipped 2026 YTD cumulative spot-BTC-ETF flows negative for the first time, against a backdrop where every prior 2026 outflow streak (May 28 record single-day, the record nine-day $2.8B, the 13-day $4.4B) had still left the year net-positive. THESIS-003 dropped 0.65→0.45 specifically on this print — the first time the cyclical read fell below even odds. [TFTC](https://www.tftc.io/bitcoin-etf-outflows-2026-record-streaks/). Watch whether a positive July week begins to repair the cumulative line (would weaken this edge toward `weak`/cyclical) or the inversion persists/deepens (would upgrade toward `strong`/structural). Needs a second instance (a future cumulative inversion or repair) for a clean both-directions read.
  - Last refreshed: JUN 24, 2026

- **spot-lth-whale-accumulation → price-floor-decoupled-from-etf-flow**
  - Strength: `weak`→`medium` (new edge, JUL 2 2026 — first clean observation)
  - Mechanism: When ETF/institutional flows are net-negative but price stabilizes anyway, the marginal price-setter has rotated from fast institutional flows to patient spot buyers (long-term holders + whales) accumulating into capitulation. A composite on-chain capitulation signature — LTH SOPR <1 (holders selling below cost) alongside whale-tagged accumulation spikes — marks the handoff and decouples price from the ETF-flow tape. This is the observable surface of the float-scarcity buffer at a cycle low. **Critical scope limit:** it can produce a FLOOR without a BOTTOM — a spot bid can arrest a decline without reversing the trend, and absent a return of the passive/ETF bid the next redemption wave can overwhelm it. So a price/flow decoupling is bullish evidence but not sufficient on its own.
  - Evidence: JUL 2 2026 — June closed as the worst-ever ETF month (~$4.5B out) yet BTC held a fresh 2026 low ~$57,700 and bounced to $61K with no third cascade; on-chain flashed LTH SOPR ~0.8 (first below-cost LTH selling since 2023) + whale wallets' 2nd-largest 2-month accumulation spike sub-$60K. First week since May the price action leaned AGAINST the flow tape. Needs a second instance for a both-cases read — does the floor hold and re-rate (bottom, upgrade toward `strong`) or does the next redemption wave break it (floor-not-bottom, downgrade toward `weak`). [BGeometrics — 2026 whale accumulation on-chain cohorts](https://bgeometrics.com/blog/2026-06-bitcoin-2026-whale-accumulation-onchain-cohorts/)
  - Last refreshed: JUL 2, 2026
  - Note: pairs inversely with `cumulative-ytd-flow-inversion → structural-regime-confirmation` — the YTD inversion is the bear signal (marginal ALLOCATOR left), this edge is the bull counter (patient SPOT buyer stepped in). Both were simultaneously true this run.

- **nav-premium-compression → corporate-accumulation-slowdown → forced-marginal-selling**
  - Strength: `medium`→`strong` (UPGRADED JUN 5, 2026 — extended from "slowdown" to "forced selling" with a clean observation)
  - Mechanism: Strategy's ATM + STRC issuance is accretive when MSTR trades at premium to BTC NAV. Premium compresses during BTC drawdowns; sustained compression makes issuance dilutive; cadence slows. **Extension (Jun 5): the reflexivity does not stop at a buying pause. The STRC perpetual-preferred carries a fixed dividend obligation that does NOT flex with the BTC price. When the issuance window closes, Strategy cannot costlessly roll the obligation, so it sells the asset at the margin to service it. The pause becomes a forced sale.** Capital-markets reflexivity trap, now with a confirmed forced-seller terminal state.
  - Evidence (condensed): MAY 26 first partial vindication (zero-BTC 8-K + $1.5B convert repurchase). **JUN 1 STRONG vindication:** Strategy's first net BTC sale in ~4 years (32 BTC) explicitly to fund STRC dividends — trivial size, decisive mechanism. **JUN 13 bidirectionality:** the Jun 8 8-K's 1,550-BTC re-buy showed the valve REOPENS when price steadies — a reversible valve, not a ratchet (but re-accumulation into a still-compressed premium = thin buffer). **JUL 6 at scale:** the 3,588-BTC record sale (~$216M) to fund preferred dividends is the forced-sale terminal state ~100× the June trim, on the DIVIDEND CALENDAR (printed as the macro headwind eased). Edge `strong`; both legs (forced sale + reopening valve) witnessed. [CoinDesk Jun 1](https://www.coindesk.com/markets/2026/06/01/strategy-sold-32-btc-for-usd2-5-million-in-late-may-filing-shows) · [Bitcoin Magazine Jul 6](https://bitcoinmagazine.com/news/strategy-mstr-sells-3588-bitcoin)
  - Last refreshed: JUL 6, 2026

- **convert-debt-repurchase → btc-gain-without-accumulation**
  - Strength: `medium` (new edge, MAY 29 2026 — first observation)
  - Mechanism: A bitcoin-treasury company can generate accounting/economic "BTC gain" without buying new bitcoin by retiring its own convertible debt at a discount, with the gain measured against the implicit BTC backing of the redeemed paper. Provides an alternative growth lever when accumulation conditions are unfavorable.
  - Evidence: Strategy's May 26 8-K filed exactly this — $1.5B convert repurchase generated 4,391 BTC "BTC gain" ($333M) at unchanged 843,738 stack. Convert outstanding dropped $8.2B → $6.7B. New mechanism for Strategy's KPI continuity when NAV/STRC conditions don't support accumulation. [MSTR 8-K (SEC EDGAR)](https://www.sec.gov/Archives/edgar/data/0001050446/000119312526237907/mstr-ex99_1.htm)
  - Last refreshed: MAY 29, 2026

### Macro

- **fed-rate-cut-signaling → btc-correlated-equities-bid**
  - Strength: `medium`
  - Mechanism: Risk-on rotation; weaker dollar; lower real rates favor non-yielding hard assets.
  - Evidence: Dec 2025 cut cycle → Jan 2026 ATH. **JUL 6 2026 — fresh confirming datapoint (the DATA-driven leg):** the June jobs miss (+57K vs ~115K) moved September-hike odds ~62%→~30% and the same window saw the 10-day/$2.7B ETF outflow streak snap (+$221.7M) with BTC recovering to ~$63K. Distinct from the failed `energy-relief → fed-pivot` leg (weak/absent): a weak LABOR/GROWTH print DOES move the rate path (and the BTC bid) where energy/geopolitical relief did not — because it speaks to the Fed's dual-mandate employment side, not just headline inflation. This is the calibration lesson operationalized as an edge distinction: data breaks the path, reputation/oil does not. **JUL 8 2026 — the flow leg extended + a 2nd DATA input:** the ETF bid became a 3-day inflow streak (~$509M) with IBIT leading Jul 7, and the 2yr breakeven inflation rate fell <2% for the first time since 2024 — a second market-DATA dovish input (inflation expectations, not the Fed's reputation) landing the same week the passive-flow bid returned. Reinforces the edge and its DATA-vs-reputation distinction: the BTC/flow bid tracks the data (jobs, breakevens), and it tracked them up this fortnight. Still owed a clean both-directions read (a hot CPI on Jul 14 re-hardening flows would be the counter-observation). **JUL 8→12 2026 — an intra-week BOTH-DIRECTIONS stress test (still market-DATA, not a Fed decision):** the hawkish June FOMC MINUTES (Jul 8, backward-looking) pushed the ETF complex to 2 outflow days (−$84.9M/−$95.3M), then the forward-dovish setup (sub-2% breakevens, soft-CPI hope) pulled IBIT straight back to LEAD the recovery (+$90.4M Jul 10; complex +$197.4M Jul 11, week net-positive ~+$124.9M). The coupling ran hawkish-DOWN then dovish-UP inside 4 sessions — the cleanest single-window confirmation that the flow bid tracks rate cues (i.e. the June exodus was substantially rate-driven/reversible). NB the down-leg here is a market read of stale minutes, not a fresh Fed decision; the Jul 14 CPI (hard data) + Jul 28–29 FOMC (a Fed decision → still haircut per calibration) are the next tests.
  - Last refreshed: JUL 12, 2026

- **fed-chair-transition → near-term-rate-path-volatility**
  - Strength: `medium` (new edge, MAY 18 2026)
  - Mechanism: A new chair with publicly distinct policy preferences shifts expectations even before any rate action — communications style alone repositions the front end of the curve.
  - Evidence: Warsh confirmed 54–45 (closest in modern Senate history) on May 13; widely read as marginally dovish vs Powell; first FOMC June 16–17. Pre-meeting front-end pricing already moving. **JUN 20, 2026 — RESOLVED hawkish, contradicting the "marginally dovish" prior:** Warsh's first dot plot (Jun 17) projected a 2026 HIKE (9/18 officials), 17/18 tilting inflation risk to the upside — the opposite of the consensus pre-confirmation read. The edge (transition → volatility) HOLDS — the chair change did reposition the curve — but the *directional* "Warsh = dovish" reputational prior is decisively falsified. **Calibration tie-in: this is the root cause of the macro category's +0.42 over-confidence (7/7 dovish forecasts missed). Lesson: do not forecast a chair's policy from pre-confirmation reputation.**
  - Last refreshed: JUN 20, 2026

- **cpi-print-upside-surprise → fed-cut-odds-collapse**
  - Strength: `strong` (MAY 20 2026). Mechanism: inflation >1pp above target reprices forward cut odds fast via futures → real-rates path → risk-asset bid. Evidence: April CPI 3.8%/PPI 6.0% → June-cut odds <10%, BTC $77K→$73K. **Asymmetry (JUN 1):** faster DOWN than UP — `strong` on upside, `medium` on downside relief. **JUL 8 downside-leg corroboration:** 2-year breakeven fell <2% for the first time since 2024 (market inflation expectation easing ahead of Jul 14 CPI) — the cool-side repricing IS moving when a growth scare accompanies it. June CPI (Jul 14) is the next test of the upside leg. Last refreshed: JUL 8, 2026.

- **geopolitical-energy-shock → cpi-ppi-reacceleration**
  - Strength: `strong` (MAY 29 2026). Mechanism: oil shocks transmit to headline inflation within one CPI cycle (PPI leads ~6wk). Evidence (condensed): Hormuz airstrikes Feb 2026 → Brent $73→$115–120, April PPI 6.0% YoY; US-Iran deal SIGNED Jun 17 (Hormuz reopens) → energy relief. **Critical asymmetry (Jun 17–20): the Fed leaned HAWKISH the same day despite the oil relief** — the edge is sound but does NOT control the Fed's reaction function when CORE inflation binds; downstream `energy-relief → fed-pivot` is WEAK-to-absent. The Jul 2 dovish shift came from WEAK LABOR data, not energy — the valid override. Now dormant-leaning (no active energy shock). Last refreshed: JUN 20, 2026.

- **geopolitical-risk-off-shock → btc-flow-reversal**
  - Strength: `weak`→`medium` (confidence DOWNGRADED MAY 31 — the flow reversal outlived the shock). Mechanism: geopolitical risk-off + tightening → ETF rotation OUT; but Jun 1 the shock reversed (Brent −19%, PCE cooled) yet outflows hit a RECORD 9-day streak, re-attributed to AI-equity rotation — real on the way IN, not sufficient on the way out; confounded by `risk-asset-relative-performance → btc-etf-rotation`. Iran deal signed Jun 17 → dormant-leaning. Needs a clean both-directions read. Last refreshed: JUN 1, 2026.

- **higher-for-longer-rates → corporate-treasury-financing-window-compression**
  - Strength: `medium`→`strong` (UPGRADED JUN 24 2026 — a second, sharper observation extends the mechanism from "can't issue cheaply" to "won't deploy")
  - Mechanism: A hawkish/higher-for-longer rate regime keeps the cost of capital high, which (a) compresses leveraged-treasury NAV premiums and (b) raises the coupon/conversion economics of the convert + preferred structures that fund cohort accumulation — narrowing the issuance window even when the spot price holds. **Extension (Jun 24): the squeeze does not only close the issuance window from the supply side; it also changes the DEPLOYMENT decision once capital is raised. When fixed preferred-dividend obligations carry a high coupon (Strategy's 11.5% STRC), the rational move under a higher-for-longer regime is to pre-fund those liabilities with cash rather than buy more of a non-yielding asset — so even an OPEN issuance window produces minimal BTC accumulation.** A hawkish dot plot is a SLOW squeeze on the corporate bid that operates through financing AND capital-allocation choice, distinct from the fast spot-price channel. This is the "hawkish Fed bites the corporate floor through the financing window, not the spot tape" cross-current.
  - Evidence (condensed): JUN 20 hawkish dot plot lands into Strategy's re-accumulation at a compressed premium. **JUN 24 deployment-side (upgrade trigger):** Strategy raised ~$335M (window OPEN) yet deployed only 520 BTC (~10%) and parked ~90% cash for 11.5% preferred obligations — the constraint became the deliberate choice NOT to deploy, not issuance capacity. JUN 28: let a fresh $58K low pass with no dip-buy (cash-parking-as-policy). **JUL 6 forced-SELLING leg at scale (strongest):** even as the rate path EASED, Strategy sold 3,588 BTC (~$216M) to fund preferred dividends — the fixed-obligation terminal state, ~100× the June trim, on the DIVIDEND CALENDAR (independent of the spot tape; sold as the headwind eased). Both legs (deployment-downshift + forced sale) witnessed at scale. Edge `strong`. **JUL 8:** unreversed — no new 8-K; the record sale stands un-offset through the best week since March (the issuance window has not visibly reopened). [Bitbo](https://bitbo.io/treasuries/microstrategy/) · [Bitcoin Magazine](https://bitcoinmagazine.com/news/strategy-mstr-sells-3588-bitcoin) **JUL 12 — mechanism EXTENDS to new-vehicle formation, not just incumbent issuance:** Bitcoin Standard Treasury's merger with a Cantor-linked SPAC was scrapped Jul 8 (30,021 BTC held, terms renegotiating) — a treasury *vehicle* failing to list in the compressed-premium / high-cost-of-capital regime, the same squeeze that gates Strategy's issuance now visibly hitting the pipeline that would create NEW corporate buyers. Strategy still unreversed (no new 8-K). See cross-current "Treasury-vehicle pipeline crack."
  - Last refreshed: JUL 12, 2026

- **risk-asset-relative-performance → btc-etf-rotation**
  - Strength: `medium` (held — first observed JUN 1 2026; NOT upgraded this run despite the post-FOMC outflow being consistent with the rotation, because there is still no clean both-directions read (BTC/Nasdaq + BTC/SOXX vs flows). JUN 20 note: the hawkish higher-for-longer regime WORSENS the opportunity cost the edge describes — non-yielding BTC must clear a higher real yield AND out-compete AI on relative performance — so the structural-tail weight rose, but the edge strength stays `medium` pending the both-directions confirmation.)
  - Note: competes with the geopolitical edge above.
  - Mechanism: Spot-BTC-ETF allocators treat BTC as one risk-asset sleeve among several. When a competing high-beta sector (AI / semiconductors) materially outperforms, marginal capital rotates toward it on an opportunity-cost basis — independent of BTC's own catalysts or the macro/geopolitical tape. This is a "high-beta tech-adjacent asset" framing rather than a "macro hedge" framing, and it is NOT addressable by a rate decision.
  - Evidence: May 2026 — record nine-day, $2.8B spot-BTC-ETF outflow streak persisted as oil collapsed and PCE cooled; CoinDesk attributed it to BTC underperforming AI-related equities, semiconductor and memory-chip stocks, capital "reallocating toward sectors that have recently generated stronger returns" [CoinDesk](https://www.coindesk.com/markets/2026/05/29/bitcoin-etf-outflows-reach-record-nine-day-streak-as-investors-pull-usd2-8-billion). **JUN 5, 2026 — SECOND observation (upgraded weak→medium):** the streak extended to 13 days / $4.4B straight through the dip, and Presto Research independently attributed the slump to "competition from gold and AI stocks as investors reassess Fed rate-cut prospects" — a second, independent source naming the same opportunity-cost mechanism. The driver survived the oil collapse, the cooler PCE, AND the cascade. Still watch BTC/Nasdaq + BTC/SOXX relative strength for a clean both-directions read before upgrading to strong.
  - Last refreshed: JUN 5, 2026
- **dollar-weakness → btc-gold-tandem-bid**
  - Strength: `medium`
  - Mechanism: Both function as non-sovereign monetary alternatives when DXY weakens.
  - Evidence: 2024–2026 BTC/gold correlation during dollar drawdowns.
  - Last refreshed: MAY 18, 2026

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
  - Evidence: JUN 24 2026 — BIP-110 (data-limit soft fork) sits at ~0.31% version-bit-4 signaling as of Jun 22 with no major mining pool signaling and no Bitcoin Core endorsement (backing concentrated in Bitcoin Knots); UASF flag day ~Aug 7 2026 (block 961,632). Watch-row p set to 0.10 for lock-in by the flag day. A separate Sztorc hard-fork thread in the same window raises the split-tail rather than the activation odds. Needs the Aug-7 outcome (lapses as non-event vs. produces a transient split) to validate the edge's split-risk leg. Source: bip110.org · github.com/bitcoin/bips/bip-0110.mediawiki · BGeometrics signaling tracker.
  - Last refreshed: JUN 24, 2026

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
