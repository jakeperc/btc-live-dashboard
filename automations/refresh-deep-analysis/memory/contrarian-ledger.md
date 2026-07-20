# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet).

**Brier:** `(p − outcome)²`.

**Workflow:**
- At end of each run: append the new `contrarianTake` with `asOf`, `probability`, and a working `resolution-window` (the realistic time horizon to assess it).
- At start of next run: revisit entries whose `resolution-window` has elapsed. Score and add a 1-line "what we learned." Update `calibration.md`.
- Decay: prune entries older than 52 weeks (contrarian calls take longer to resolve than watchList items).

## Active (still-open)

### JUL 19, 2026 — "One soft print doesn't end a downtrend: the Fed is still hike-leaning, an oil re-shock is brewing, and the most informed money is stockpiling cash, not buying"

- **Probability of vindication (at time of writing):** 0.25 — stepped DOWN from 0.30 (structural-break BEAR), with the case honestly RELOCATED: the old flow leg was REFUTED this week (four straight IBIT-led post-CPI inflow days; the positive-week watch scored HIT), so "the passive base isn't really back" no longer carries. The surviving case: (1) the macro edifice is one print thick — the market entered the CPI pricing a Sept hike >75% and exited still at ~65% with ~30% on a JULY hike; the print's −0.4% leaned on a 5.7% energy slump recorded before the Iran ceasefire collapsed, so July's CPI can hand the relief back (Brent >$85, Hormuz attacked); (2) behavioral — Strategy raised $467M and bought zero BTC ($3B cash bunker), and an 8-year-dormant whale moved 5,908 BTC (~$383M) into the bounce: the strongest hands are building optionality/exiting, not conviction-buying; (3) positioning — the crowded call strike moved DOWN $80K→$70K (a lower expected top). Still ≥0.10 (freshly re-evidenced) and <0.50 (base case 0.65).
- **Resolution window:** 6 months — by Jan 19, 2027: washed-out bottom that re-rated (WRONG) vs relief high before a structural leg toward the $40Ks (VINDICATED).
- **Vindication signals:** a July FOMC hike or Sept-hike odds >75% post-FOMC with flows relapsing; Brent >$100 sustained; a weekly close <$55K/<$50K; a Strategy sale THROUGH the $3B buffer; a 2nd sovereign/top-10 strategic seller. **Invalidation:** FOMC holds + Sept odds fade <50%; flows net-positive ≥3 of 4 weeks through Aug 14; durable >$66K weekly reclaim; CLARITY clears cloture.
- **Distinct from prior:** JUL 12's bear leaned on the choppy tape + corporate cracks; the tape refuted the flow leg, so this entry EXPLICITLY retires it and re-grounds the bear in the macro-re-hardening + informed-seller legs — repriced down 0.30→0.25 for the refutation rather than recycled.
- **Outcome:** still-open · **Brier:** n/a

### JUL 12, 2026 — "A relief rally inside a downtrend: a bumpy flow week doesn't undo a Fed that projected a hike, and the corporate side keeps producing bad news (record sale + a scrapped treasury merger)"

- **Probability of vindication (at time of writing):** 0.30 — HELD from Jul 8 (structural-break BEAR). The base case held 0.60, so the complement is unchanged mechanically; evidentially the week was a wash for the bear — the choppy tape (streak broke Jul 8–9 on the hawkish minutes) is mild support, offset by IBIT dip-buying the recovery (passive base re-engaging again). One fresh bear datapoint: the BSTR/Cantor merger collapse (Jul 8) is a 2nd corporate crack on top of Strategy's unreversed record sale — the corporate architecture leaking while price drifts up. Still ≥0.10 (freshly evidenced) and <0.50 (base case mildly cyclical).
- **Resolution window:** 6 months — by Jan 12, 2027 we know whether the June low was a washed-out bottom that re-rated (base case, contrarian WRONG) or a relief high before a structural leg toward the $40Ks (VINDICATED).
- **Body (full text in `DEEP_ANALYSIS.contrarianTake.body`, JUL 12):** strongest evidence unchanged (Strategy's record sale unreversed, issuance window not visibly reopened) + a fresh crack (BSTR's Cantor merger scrapped — the treasury-vehicle on-ramp stalling in the same higher-for-longer regime). The dovish edifice rests on one labor print + market breakevens against a Fed that projected a hike; June CPI (Jul 14) can pull the floor out. The concession the bear still owes: IBIT keeps buying the dip on rate cues → the exodus looks substantially rate-driven/reversible → held at 0.30, not raised to 0.35.
- **Distinct from prior:** Same stance as Jul 6/Jul 8 (structural-break bear) but re-evidenced, not recycled — the operative NEW claim is the corporate-architecture crack (BSTR) added to the choppy-tape read. The bear did not drift up despite the fragile tape because the IBIT dip-buy cuts the other way.
- **Vindication signals:** a weekly close <$55K/<$50K; a hot Jul 14 CPI unwinding the repricing; flows relapse with no positive July week; Strategy repeats the sale OR a 2nd top-10/sovereign strategic sale OR a 2nd treasury-vehicle collapse. **Invalidation:** a confirmed positive ETF WEEK repairing YTD; a durable >$66K weekly reclaim; soft CPI + a July FOMC ratifying dovish; CLARITY revives + clears cloture.
- **Outcome:** still-open · **Brier:** n/a

### JUL 8, 2026 — structural-break BEAR, stepped 0.35→0.30 (condensed JUL 19; full text in git)

- **p=0.30, still-open (resolution Jan 8, 2027).** Same bear stance, re-priced DOWN on the IBIT-led 3-day streak (the passive bellwether re-engaging weakened the "passive base permanently left" claim). Core evidence: Strategy's record sale unreversed; the macro relief one labor print thick against a hike-projecting Fed. **How it aged (JUL 19): the flow leg was REFUTED** (4 straight post-CPI inflow days; positive-week watch HIT) — superseded by the fuller JUL 19 entry above, which relocates the bear to the macro-re-hardening + corporate-abstention legs. Shared vindication/invalidation signals as JUL 19.

### JUL 2 / JUL 6, 2026 — capitulation-bull → bear-flip transition (condensed JUL 12; full text in git + `DEEP_ANALYSIS` history)

- **JUL 2 (p=0.40, still-open) capitulation-bottom BULL:** raised from Jun 28 on the strongest on-chain evidence of the year — LTH SOPR ~0.8 (first below-cost LTH selling since 2023) + whale accumulation sub-$60K + a bounce off ~$57.7K with no third cascade + IV at YTD lows. The texture of a capitulation bottom; base case still structural-deterioration (THESIS-003 0.45). Resolution Jan 2, 2027.
- **JUL 6 (p=0.35, still-open) STANCE FLIPPED to structural-break BEAR:** THESIS-003 crossed back above even odds to 0.55, so the serious contrarian became the bear again. Load-bearing fresh evidence: Strategy's 3,588-BTC record sale — the strongest hand selling INTO the recovery to meet fixed obligations; the "permanent float" is liability-conditional. Capped 0.35 (macro headwind genuinely eased). Resolution Jan 6, 2027. Superseded by the fuller Jul 8 / Jul 12 bear entries above.
- **Shared vindication:** weekly close <$55K/<$50K; hot June CPI; flows relapse; a Strategy/sovereign strategic sale. **Invalidation:** confirmed positive ETF week + >$66K weekly reclaim + soft CPI/dovish FOMC + CLARITY cloture.

### JUN 24 / JUN 28, 2026 — capitulation-bottom BULL series (condensed JUL 12 for the 300 KB cap; full text in git)

- **Both entries p=0.35, still-open.** The FIRST bull contrarian since the system began — triggered because the base case itself flipped bearish (THESIS-003 0.65→0.45 Jun 24 on the YTD-flows-negative print + Strategy cash-parking), so the serious contrarian became the capitulation-bottom bull. **Common thesis:** the June break is a washed-out capitulation low, not a regime — the marginal allocator already left (backward-looking flows), forced sellers sell once, whales accumulated sub-$60K, and a cooler jobs print / CLARITY revival / one positive ETF week could force a violent re-rate off a washed-out base. JUN 28 sharpened it: the Jun 25–26 billion-dollar liquidation days landed on a $10B quarter-end Deribit expiry (mechanical flush). **How they aged (to JUL 12):** partially VINDICATING — the July jobs relief + flow reversal + IBIT dip-buying are the re-rate the bull named; but the stance has since FLIPPED back to bear (Jul 6, base case crossed above even odds). Resolution windows Dec 24/28, 2026. **Vindication:** positive ETF week + >$66K weekly reclaim + cooler macro. **Invalidation:** weekly close <$55K/<$50K; outflows persist; Strategy/sovereign strategic sale.

### JUN 5 / JUN 13 / JUN 20, 2026 — structural-break BEAR series (condensed JUL 6 for the 300 KB cap; full text in git)

- **Common thesis:** the June flush is THE structural break, not a cyclical washout — the ETF *base* (not just leveraged margin) is reallocating to AI/semis under higher real yields, so ~$60–64K is a lower high on the way toward the $40Ks; the corporate floor has a forced-seller leak (Strategy dividend sales) and Bhutan is a structural sovereign seller.
- **Probabilities (at time of writing):** JUN 5 **0.30** (bear vs cyclical base 0.60) → JUN 13 **0.25** (recovery = counter-evidence) → JUN 20 **0.30** (Jun 11–12 inflow turn REVERSED into $82M post-FOMC outflows; re-coupling tell printed in reverse). All ≥0.10, <0.50.
- **How they aged:** the mechanism (AI-rotation re-rating, re-coupling tell reversing, corporate financing leak) held up through Jun 24–28 — and the stance then FLIPPED: on JUN 24 the structural-break read moved INTO the base case (THESIS-003 0.65→0.45), so this bear ceased to be contrarian. NOTE JUL 6: the "un-addressable by rates / pure AI-rotation" leg was TEMPERED — the June-jobs rate relief snapped the outflow streak, showing the exodus was substantially rate-driven, not purely a structural AI re-rating.
- **Resolution windows:** Dec 5 / Dec 13 / Dec 20, 2026 (6-month). **Outcome:** still-open. **Brier:** n/a.
- **Vindication signals (shared):** BTC weekly close <$55K/<$50K; no positive ETF week through end-July + YTD fails to repair; BTC/Nasdaq + BTC/SOXX keep deteriorating; a 2nd top-10/sovereign strategic sale. **Invalidation (shared):** a confirmed positive ETF WEEK; a durable >$66K reclaim; BTC re-couples and outperforms AI on a CLARITY/FOMC catalyst.

### JUN 1 / MAY 29, 2026 — AI-opportunity-cost + digital-gold-premise bears (condensed JUL 19; full text in git)

- **JUN 1 (p=0.35, still-open, resolution Nov 30):** "The outflows are stickier than their trigger — a relative-performance rotation into AI, not a tradeable Iran dip." A rate decision can't fix an opportunity-cost problem. **How it aged:** partly vindicated in mechanism through June (outflows persisted through macro relief; Presto corroborated the AI attribution) — then TEMPERED JUL 6–19: the jobs/CPI rate relief DID snap and reverse the flows (the exodus was substantially rate-driven after all), while price still fell WITH chips on Jul 16–17 (the beta leg survives). Watch the BTC/Nasdaq + BTC/SOXX systematic read.
- **MAY 29 (p=0.35, still-open, resolution Nov 30):** "Digital-gold framing was a marketing layer over a risk-asset reality" — BTC failed its first textbook geopolitical-risk-off test (BTC/gold uptrend snapped May 27; gold funds drew $2.34B the week BTC ETFs bled). **How it aged:** the gold-rotation half is intact but superseded by the AI/rate framings; the reflexivity sub-claim (Strategy's issuance-gated bid) was fully vindicated by June–July's forced sales.
- **Shared vindication:** flows relapse despite rate relief; BTC/SOXX deterioration; gold-vs-BTC fund flows diverging 4+ weeks. **Shared invalidation:** sustained positive flow weeks on rate cues (now printing); BTC outperforming AI on its own catalysts.

### MAY 18–20, 2026 — early structural-bear series (condensed JUL 8 for the 300 KB cap; full text in git)

- **Three entries, all ≥0.10 / <0.50, all still-open:** (a) MAY 18 "Regulation = denatured reserve asset, not legitimacy" p=0.30 — CLARITY's commodity classification could lay groundwork for surveillance-grade custodial reporting rather than a clean unlock; watch FinCEN custodial-reporting NPRM. (b) MAY 18 "Synchronized enthusiasm = setup peak, not takeoff" p=0.25 — CLARITY+Warsh+ETF-parity priced into one quarter usually marks a setup peak. (c) MAY 20 "Corporate buyers are themselves the cycle peak" p=0.30 — Strategy's accumulation is gated by NAV-premium/STRC capital-markets reflexivity; a drawdown shrinks the issuance window faster than the narrative travels.
- **How they aged:** (c) has substantially VINDICATED in mechanism — the capital-markets-reflexivity / fixed-dividend leak it named became the load-bearing corporate-floor constraint (Strategy's Jun 1 + Jul 5 forced sales). (a) and (b) remain open, un-triggered (no FinCEN NPRM; CLARITY stalled rather than passed-then-weaponized). Resolution windows May 2027 / 12–18mo post-CLARITY. **Outcome:** still-open. **Brier:** n/a.

## Resolved (rolling 52 weeks)

| asOf | one-line | category | window | p | outcome | brier | lesson |
|---|---|---|---|---|---|---|---|

_(empty — first resolutions expected 12+ months out)_

## Pruned (>52 weeks)

_(none yet)_

## Hygiene rules

1. **Probability is mandatory.** No "this is the bear case" without committing to how likely you think it is.
2. **A contrarian take with p ≤ 0.10 is not a real contrarian take** — it's a strawman. Don't bother.
3. **A contrarian take with p ≥ 0.50 is no longer the contrarian take** — it's the base case in disguise. Reframe.
4. **Distinct from prior weeks.** If `contrarianTake` recycles the same skepticism for 3+ runs without new evidence, that's drift — either retire it or refine into a new angle.
5. **Vindication / invalidation signals are concrete.** "Things get worse" is not a signal. "FinCEN issues custodial reporting NPRM with transaction-level requirements" is.
