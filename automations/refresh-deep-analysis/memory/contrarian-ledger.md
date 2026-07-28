# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet).

**Brier:** `(p − outcome)²`.

**Workflow:**
- At end of each run: append the new `contrarianTake` with `asOf`, `probability`, and a working `resolution-window` (the realistic time horizon to assess it).
- At start of next run: revisit entries whose `resolution-window` has elapsed. Score and add a 1-line "what we learned." Update `calibration.md`.
- Decay: prune entries older than 52 weeks (contrarian calls take longer to resolve than watchList items).

## Active (still-open)

### JUL 26, 2026 — "The bounce was thin and it just cracked: two open inflation channels, a Fed with a live hike, and the strongest hands hoarding cash or exiting outright"

- **Probability of vindication (at time of writing):** 0.30 — stepped UP from 0.25 (structural-break BEAR): the JUL 19 entry's named signals began firing EARLY. (1) Macro leg: the entire post-CPI dovish repricing was repossessed BEFORE July's CPI even prints — Sept-hike ~82% (ABOVE the pre-CPI peak), July-hike 34.7%→38.7% (FedWatch settles), Brent through $100, and tariffs a second inflation channel with NO de-escalation path. (2) Flow leg: the 7-day run (just under $1B) recovered only ~15% of June's outflows, and two sessions (−$225.2M / −$240.1M) erased nearly half of it. (3) Behavioral leg BROADENED beyond Strategy: MSTR ROSE on a zero-buy 8-K (shareholders paying the most committed buyer to abstain) while the junior DAT cohort exits outright — Satsuma's 90.63% liquidation-and-delist vote, Sequans ~80% sold, Nakamoto's stack pledged against December debt. Still <0.50 (base case 0.60: no falsification fired, the week still closed ~+$33.8M, $63.8–64.2K support held, no cascade).
- **Resolution window:** 6 months — by Jan 26, 2027: washed-out bottom that re-rated (WRONG) vs relief high before a structural leg lower (VINDICATED).
- **Vindication signals:** a July hike, or a hawkish hold with Sept >75% post-FOMC and flows negative 3+ weeks; Brent >$100 sustained 2+ weeks; a weekly close <$55K/<$50K; a Strategy sale THROUGH the $3.225B buffer or a top-10/sovereign strategic seller. **Invalidation:** calm hold + Sept odds fading <50%; flows restarting within 2 sessions and ≥3 of 4 positive weeks; a durable >$66.9K reclaim.
- **Distinct from prior:** JUL 19's bear predicted the relief would be handed back BY THE DATA (July's CPI); this week it was handed back by PRICING alone — the bear is running ahead of its own schedule, which is why it steps UP while the base case steps down. Not recycled: the sector-DAT-unwind leg is new, verified evidence.
- **Outcome:** still-open · **Brier:** n/a

### JUL 19, 2026 — "One soft print doesn't end a downtrend: the Fed is still hike-leaning, an oil re-shock is brewing, and the most informed money is stockpiling cash, not buying"

- **Probability of vindication (at time of writing):** 0.25 — stepped DOWN from 0.30 (structural-break BEAR), with the case honestly RELOCATED: the old flow leg was REFUTED this week (four straight IBIT-led post-CPI inflow days; the positive-week watch scored HIT), so "the passive base isn't really back" no longer carries. The surviving case: (1) the macro edifice is one print thick — the market entered the CPI pricing a Sept hike >75% and exited still at ~65% with ~30% on a JULY hike; the print's −0.4% leaned on a 5.7% energy slump recorded before the Iran ceasefire collapsed, so July's CPI can hand the relief back (Brent >$85, Hormuz attacked); (2) behavioral — Strategy raised $467M and bought zero BTC ($3B cash bunker), and an 8-year-dormant whale moved 5,908 BTC (~$383M) into the bounce: the strongest hands are building optionality/exiting, not conviction-buying; (3) positioning — the crowded call strike moved DOWN $80K→$70K (a lower expected top). Still ≥0.10 (freshly re-evidenced) and <0.50 (base case 0.65).
- **Resolution window:** 6 months — by Jan 19, 2027: washed-out bottom that re-rated (WRONG) vs relief high before a structural leg toward the $40Ks (VINDICATED).
- **Vindication signals:** a July FOMC hike or Sept-hike odds >75% post-FOMC with flows relapsing; Brent >$100 sustained; a weekly close <$55K/<$50K; a Strategy sale THROUGH the $3B buffer; a 2nd sovereign/top-10 strategic seller. **Invalidation:** FOMC holds + Sept odds fade <50%; flows net-positive ≥3 of 4 weeks through Aug 14; durable >$66K weekly reclaim; CLARITY clears cloture.
- **Distinct from prior:** JUL 12's bear leaned on the choppy tape + corporate cracks; the tape refuted the flow leg, so this entry EXPLICITLY retires it and re-grounds the bear in the macro-re-hardening + informed-seller legs — repriced down 0.30→0.25 for the refutation rather than recycled.
- **Outcome:** still-open · **Brier:** n/a

### JUL 12, 2026 — structural-break BEAR, HELD 0.30 (condensed JUL 26; full text in git)

- **p=0.30, still-open (resolution Jan 12, 2027).** Choppy-tape bear + the BSTR/Cantor crack; the concession owed was IBIT dip-buying on rate cues. **How it aged (JUL 19–26): the flow leg was refuted (positive-week HIT), then partially re-vindicated (streak died on the Jul 23–24 repricing); the corporate-crack leg strengthened into the verified sector DAT unwind.** Superseded by the fuller JUL 19 + JUL 26 entries above; shared vindication/invalidation signals.

### JUL 8, 2026 — structural-break BEAR, stepped 0.35→0.30 (condensed JUL 19; full text in git)

- **p=0.30, still-open (resolution Jan 8, 2027).** Same bear stance, re-priced DOWN on the IBIT-led 3-day streak (the passive bellwether re-engaging weakened the "passive base permanently left" claim). Core evidence: Strategy's record sale unreversed; the macro relief one labor print thick against a hike-projecting Fed. **How it aged (JUL 19): the flow leg was REFUTED** (4 straight post-CPI inflow days; positive-week watch HIT) — superseded by the fuller JUL 19 entry above, which relocates the bear to the macro-re-hardening + corporate-abstention legs. Shared vindication/invalidation signals as JUL 19.

### JUL 2 / JUL 6, 2026 — capitulation-bull → bear-flip transition (condensed JUL 12; full text in git + `DEEP_ANALYSIS` history)

- **JUL 2 (p=0.40, still-open) capitulation-bottom BULL:** raised from Jun 28 on the strongest on-chain evidence of the year — LTH SOPR ~0.8 (first below-cost LTH selling since 2023) + whale accumulation sub-$60K + a bounce off ~$57.7K with no third cascade + IV at YTD lows. The texture of a capitulation bottom; base case still structural-deterioration (THESIS-003 0.45). Resolution Jan 2, 2027.
- **JUL 6 (p=0.35, still-open) STANCE FLIPPED to structural-break BEAR:** THESIS-003 crossed back above even odds to 0.55, so the serious contrarian became the bear again. Load-bearing fresh evidence: Strategy's 3,588-BTC record sale — the strongest hand selling INTO the recovery to meet fixed obligations; the "permanent float" is liability-conditional. Capped 0.35 (macro headwind genuinely eased). Resolution Jan 6, 2027. Superseded by the fuller Jul 8 / Jul 12 bear entries above.
- **Shared vindication:** weekly close <$55K/<$50K; hot June CPI; flows relapse; a Strategy/sovereign strategic sale. **Invalidation:** confirmed positive ETF week + >$66K weekly reclaim + soft CPI/dovish FOMC + CLARITY cloture.

### JUN 24 / JUN 28, 2026 — capitulation-bottom BULL series (condensed JUL 12 for the 300 KB cap; full text in git)

- **Both entries p=0.35, still-open.** The FIRST bull contrarian since the system began — triggered because the base case itself flipped bearish (THESIS-003 0.65→0.45 Jun 24 on the YTD-flows-negative print + Strategy cash-parking), so the serious contrarian became the capitulation-bottom bull. **Common thesis:** the June break is a washed-out capitulation low, not a regime — the marginal allocator already left (backward-looking flows), forced sellers sell once, whales accumulated sub-$60K, and a cooler jobs print / CLARITY revival / one positive ETF week could force a violent re-rate off a washed-out base. JUN 28 sharpened it: the Jun 25–26 billion-dollar liquidation days landed on a $10B quarter-end Deribit expiry (mechanical flush). **How they aged (to JUL 12):** partially VINDICATING — the July jobs relief + flow reversal + IBIT dip-buying are the re-rate the bull named; but the stance has since FLIPPED back to bear (Jul 6, base case crossed above even odds). Resolution windows Dec 24/28, 2026. **Vindication:** positive ETF week + >$66K weekly reclaim + cooler macro. **Invalidation:** weekly close <$55K/<$50K; outflows persist; Strategy/sovereign strategic sale.

### JUN 5 / JUN 13 / JUN 20, 2026 — structural-break BEAR series (STUB, re-condensed JUL 26; full text in git)

- **p = 0.30 → 0.25 → 0.30, all still-open (resolutions Dec 5/13/20, 2026).** Thesis: the June flush is THE break — the ETF base reallocating to AI/semis; ~$60–64K a lower high toward the $40Ks. Aged: the stance moved INTO the base case Jun 24 (ceased contrarian); the "un-addressable by rates" leg was TEMPERED Jul 6 (rate relief snapped the flows). Shared signals as the JUL 26 entry.

### JUN 1 / MAY 29, 2026 — AI-opportunity-cost + digital-gold bears (STUB, re-condensed JUL 26; full text in git)

- **Both p=0.35, still-open (resolutions Nov 30).** JUN 1: "outflows stickier than their trigger — AI rotation, not an Iran dip." MAY 29: "digital-gold was marketing over a risk-asset reality" (BTC/gold snap May 27; gold funds +$2.34B while BTC bled). Aged: the rate channel proved real (Jul 6–19 relief moved flows) but price still fell WITH chips (beta leg survives) — and JUL 26's gold-fell-too tape supports the risk-asset read. The reflexivity sub-claim was fully vindicated (June–July forced sales). Still owed: the systematic BTC/Nasdaq + BTC/SOXX read.

### MAY 18–20, 2026 — early structural-bear series (STUB, re-condensed JUL 26; full text in git)

- **(a)** MAY 18 "Regulation = denatured reserve asset" p=0.30 (watch FinCEN custodial-reporting NPRM; un-triggered — CLARITY stalled rather than passed-then-weaponized). **(b)** MAY 18 "Synchronized enthusiasm = setup peak" p=0.25 (open). **(c)** MAY 20 "Corporate buyers are the cycle peak" p=0.30 — **substantially VINDICATED in mechanism** (the NAV-premium/fixed-dividend leak became the load-bearing corporate constraint; June–July forced sales + the JUL 26 DAT unwind). All still-open; windows May 2027 / 12–18mo post-CLARITY.

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
