# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet).

**Brier:** `(p − outcome)²`.

**Workflow:**
- At end of each run: append the new `contrarianTake` with `asOf`, `probability`, and a working `resolution-window` (the realistic time horizon to assess it).
- At start of next run: revisit entries whose `resolution-window` has elapsed. Score and add a 1-line "what we learned." Update `calibration.md`.
- Decay: prune entries older than 52 weeks (contrarian calls take longer to resolve than watchList items).

## Active (still-open)
### OCT 7, 2026 — "The bond market is the central bank now, and it is tightening" (long-end real-yield BEAR)

- **Probability of vindication (at time of writing):** 0.25 — NEW entry. The base case (THESIS-007 at 0.55) says the breakout holds through October with the long end as the named risk; this entry says the long end wins. Mechanism: (1) the 30Y at 5.715% (press) / 5.66 par (Oct 5), the highest since 2002, with $40T of debt, Brent >$101, a $39B 10y + $22B 30y auction week, gilts >6% and OAT–Bund >141bp — a global repricing of the riskless return that no Fed decision controls; (2) on Oct 7 stocks (−0.5–0.9%), gold (−2% to $4,070; −5% over the fortnight) and BTC (−2.9%, under $84K, ~$550M liquidations) fell TOGETHER on one yield spike — the real-yield form of the co-movement edge (3rd instance) and direct evidence against the SEP 26 bull's "bond stress → scarce-asset bid" story; (3) the buyer has thinned: flows a tenth of the prior week; the Sep 21 surge ran partly on ~$844M of short liquidations; no new high in two weeks; (4) the Fed easing its talk does not help if the long end is the price-setter. Resolution shape: two consecutive Friday closes <$80,000 by Oct 30 WITH the 30Y (Treasury par) still ≥5.60% — THESIS-007 #1 firing through the bond channel.
- **Resolution window:** 6 months — by Apr 7, 2027.
- **Vindication signals:** the 30Y par ≥5.80% on any close by Oct 30 (memory row 0.40); gold and BTC falling together on auction / yield-up days (Oct 8 30y auction; Oct 14 CPI); an outflow week >$500M; a ≥$1B long-liquidation day on a yield spike; MSTR's premium compressing below 1.0 with the ATM shut. **Invalidation:** a Friday close >$87,570 (the yearly open) with the 30Y still above 5.6%; ETF flows positive in three of the next four weeks; the 30Y par back below 5.50% (the bear loses its mechanism rather than being wrong — log it as such); a Strategy buy sized UP (ATM >$200M) into the stall.
- **Distinct from prior:** the SEP 13 bear needed the FED's hike series (the Fed has since softened — that bear sits at 0.15); the AUG 19 bear said the breakout was hollow (refuted); the SEP 26 bull said buyers stopped watching the Fed — this entry agrees the Fed is not the price-setter and says the long bond is, in the opposite direction. Priced 0.25, not higher, because the mechanism has ONE clean co-fall datapoint (Oct 7), stocks closed at records the day before, three flow weeks are still positive and Strategy keeps buying; not lower because rule 6 (a live mechanism is never priced below 0.25) binds and the long end is at 24-year highs with nothing containing it.
- **Outcome:** still-open · **Brier:** n/a

### SEP 26, 2026 — "Bitcoin's buyers have stopped watching the Fed" (structural-decoupling BULL)

- **How it aged (OCT 7, 11 days in): AGAINST on texture — stepped 0.30 → 0.25.** No invalidation fired (no hot print, so no re-coupling test; THESIS-007 #1/#2 untripped). But the entry's conjunction (a close >$90K WHILE Oct hike odds stay >50%) is now untestable in its own terms — hike odds collapsed to 19.5% on soft data, so a rally from here would say nothing about decoupling — and its long-end leg ("a bond problem ends in a bid for scarce assets") went the other way: the 30Y hit 5.715% and gold, stocks and BTC all FELL (gold −5% over the fortnight). Bitcoin is watching the bond market, not the Fed — a decoupling from the Fed, but not the bullish kind. Kept open; the OCT 7 long-end bear carries the mirror claim.

- **Probability of vindication (at time of writing):** 0.30 — NEW entry. The base case (THESIS-007 at 0.45) says the breakout is real demand but October's rate calendar still governs whether it holds; this entry says the calendar no longer governs. Mechanism: (1) the `fed→flows` rule failed its cleanest test — Sep 17–25 inflows ~$2.98B (best week of 2026) while October hike odds ROSE 43.5%→61.6% and the 10Y/30Y hit 19-/22-year highs — and a rule failing on its cleanest test is evidence of a new buyer, not noise; (2) breadth: IBIT ~49% of the week (vs ~62% in August), ARKB and FBTC large — allocation-style demand (scheduled rebalancing into a scarce asset) rather than rate-tactical money; (3) the 2026 ETF total is positive again and both structural buyer classes (funds; Strategy + Strive) are buying at once — last spring's peak setup without the leverage; (4) the long end (30Y 5.49%, $40T debt, Treasury buybacks failing to contain it) is a bond problem that has repeatedly ended in a bid for scarce assets (gold Aug 19; Bitcoin now). Resolution shape: a Friday close ABOVE $90,000 by Oct 30 WHILE October hike odds stay above 50% (the conjunction is the decoupling claim).
- **Resolution window:** 6 months — by Mar 26, 2027.
- **Vindication signals:** a Friday close >$90,000 by Oct 30 with hike odds >50%; ETF flows positive in at least four of the five October weeks; a second hike delivered Oct 28 with the following week's flows positive; MSCI adoption absorbed without a Strategy premium collapse. **Invalidation:** THESIS-007 #1 or #2 firing (two closes <$80K; ≥3-of-5 negative weeks); an outflow day >$400M within 48h of a hot Sep 30 PCE / Oct 2 jobs / Oct 14 CPI print (the old rule re-coupling); gold and the dollar continuing to move against Bitcoin while it rallies is NOT invalidation (it is the entry's own texture).
- **Distinct from prior:** the SEP 16 bull said the Fed would PAUSE (peak hawkishness) — its price leg fired but its mechanism is failing (odds moved the other way); this entry needs no Fed pause and claims the opposite: the Fed can hike and the bid persists. The SEP 13 rates bear is aging AGAINST. Priced 0.30, not higher, because gold fell 2% and the dollar rose in the same week (so the "bond-market bid for scarce assets" is a story, not yet a fact), the daily inflows decayed 999→135 in five sessions, and the rule has failed exactly once; not lower because the 0.10–0.30 band is the ledger's under-confident band and the mechanism has one clean observation.
- **Outcome:** still-open · **Brier:** n/a

### SEP 16, 2026 — "The Fed just raised rates against oil, and this rise is the top of the cycle, not the start of a series" (policy-error / peak-hawkishness BULL)

- **How it aged (SEP 26, 10 days in): FOR on price, AGAINST on mechanism — stepped 0.30 → 0.40.** Vindication legs fired: a weekly close >$82,300 (Sep 25 ~$84,000, after $87,300 on Sep 21) ✓; a Strategy buy ✓ (950 BTC, Sep 21 8-K — cash-funded; the premium did reopen to ~1.17× on Sep 21–22); the first post-decision flow week net-positive ✓ (+$2.39B; week 2 pending). Legs failing: a HOLD Oct 28 with December odds <50% — odds moved the WRONG way (Oct hike 43.5%→61.6%; Dec cumulative 91.7%); the 10Y back below 4.7% — it went to 5.10%. No invalidation fired. Read: the entry got the PRICE right for the wrong reason — the rally did not need the Fed to pause; it needed the priced hike to pass. Its resolution shape (close >$82,300 with both flow weeks positive) is one leg from complete; if week 2 prints positive it is substantially vindicated on its letter, and the ledger should score it "vindicated on letter, mechanism unsupported" — the same shape as THESIS-005's retirement, mirrored. Not stepped to 0.45+: the mechanism leg is failing and a contrarian at ≥0.50 is the base case.

- **Probability of vindication (at time of writing):** 0.30 — NEW entry, the first BULL since JUN 24/28 (condensed OCT 7; git): the hike answers energy-driven headline inflation with core CPI at 2.4%; the no-2027-cuts median is a forecast the front end reprices within hours of one weak print — the Oct 2 jobs report the named trigger; Bitcoin has done its selling; the flow mechanism is symmetric. Resolution shape: a weekly close ABOVE $82,300 by Oct 31 with the two post-decision flow weeks net-positive.
- **How it aged (OCT 7, 21 days in): FOR on mechanism this time — stepped 0.40 → 0.45.** Its named trigger fired: the Oct 2 jobs report (+29K; Jul −10K) repriced October to a HOLD within hours (CME ~15% Oct 2; 19.5% Oct 6) — "this hike is the top, not the start of a series" is now the market's base case for October. The second post-decision flow week was positive (+$241M), so the resolution shape (a close >$82,300 with both weeks positive) is COMPLETE on its letter. Still failing: December cumulative odds 84% (a series beyond October is still priced); the 10Y at 5.2% par, not <4.7%. Not stepped to 0.50: a contrarian at or above 0.50 is the base case, and the December leg is the claim's second half. Candidate for an early "vindicated on letter, series leg open" scoring at the Oct 28 meeting.
- **Resolution window:** 6 months — by Mar 16, 2027.
- **Vindication / invalidation (condensed OCT 7):** FOR — a close >$82,300 by Oct 31 ✓; both post-decision weeks positive ✓; the Oct 2 jobs report repricing October to a hold within 48h ✓; a Strategy buy ✓; a HOLD Oct 27–28 with December odds <50% (pending; Dec cumulative 84%); the 10Y <4.7% (no). AGAINST — a close <$70K; a second hike Oct 28; a Strategy SALE; Brent >$110 sustained. **Distinct from prior:** the position the base case rejected (the hike as the peak, not a series), with the Oct 2 payrolls as the named datum; 0.30 for the 0-for-5 set-piece record, not lower because the weak-DATA override is the one dovish lever the market respects.
- **Outcome:** still-open · **Brier:** n/a

### SEP 13, 2026 — "'Priced in' is the most expensive phrase in markets: the first hike in three years is a regime change, and the August rally was never tested against it"

- **Probability of vindication (at time of writing):** 0.30 — NEW entry (rates-regime bear; condensed OCT 7; git): the first hike since 2023 into $100+ oil with the long end uncontained is stagflation-lite; gold fell with BTC (no hedge bid); the August squeeze fuel cannot repeat. Resolution shape: a weekly close below $70,000 by Oct 31.
- **How it aged (OCT 7, 24 days in): HELD at 0.15.** Only the <$70K-by-Oct-31 leg survives (needs −16% from ~$83.5K). The Fed leg it was built on has reversed (October is now a priced hold), but its long-end story (30Y 5.715%; gold falling with BTC) is exactly the OCT 7 bear's mechanism — carried there, not here.
- **Resolution window:** 6 months — by Mar 13, 2027.
- **Vindication / invalidation (condensed OCT 7):** FOR — a close <$70K by Oct 31 (open); both post-FOMC weeks negative (now impossible); a Strategy sale (no); a ≥$1B downside day (no). AGAINST — a close >$82,300 with positive flows ✓ (Sep 25); both post-FOMC weeks positive ✓; a further Strategy buy ✓. **Distinct from prior:** re-grounded the bear in the macro regime flip rather than AUG 19's hollow-breakout claim; 0.30 because the hike was 85–87% priced and the book clean.
- **How it aged (SEP 16, 3 days in): FOR, on one leg** — the SEP showed a SECOND 2026 hike = one of five vindication signals fired; stepped 0.30 → 0.35; the macro leg carried inside THESIS-006.
- **How it aged (SEP 26, 13 days in): AGAINST, decisively — two invalidation signals fired: a weekly close >$82,300 with positive flows (Sep 25 ~$84,000; +$2.39B week) and a further Strategy buy (Sep 21 8-K).** The <$72K FOMC-week close never came (Sep 18 traded $76–78K; Monday broke $82K); "both post-FOMC weeks negative" is now impossible; no sale; no ≥$1B downside day. Only the <$70K-by-Oct-31 leg survives (needs −17%). Stepped 0.35 → **0.15** (kept open on its window for scoring integrity). Lesson: the entry shared the base case's own mechanism (flows follow the rate path) and lost on the same test — "priced in" was priced in, and the tape then rallied INTO rising hike odds. The regime-change claim survives only as the long-end story (30Y 5.49%), which the SEP 26 decoupling bull now carries in the opposite direction.
- **Outcome:** still-open · **Brier:** n/a

### AUG 19, 2026 — "You just watched a short squeeze dressed up as a regime change" (squeeze-artifact / hollow-breakout bear)

- **How it aged (SEP 13, 25 days in): AGAINST, decisively — three of four invalidation signals fired inside three weeks:** 2 of 3 pre-FOMC flow weeks positive (Aug 28 +$924M, Sep 4 +$987M — August the best ETF month of 2026), weekly closes above $70K with positive flows (peak $82,300 Sep 3–4), and a resumed Strategy buy (Aug 31 8-K, 4,603 BTC). The named fade below $66,900 never came (low since: ~$76,400, Sep 10). Only the MSCI leg (Oct 16) survives. Stepped 0.30 → **0.10** (floor); kept open on its own window for scoring integrity; its surviving macro leg is re-grounded in the SEP 13 entry.
- **Original (0.30, condensed; git):** a squeeze-artifact bear — one-shot fuel into a tape that had just voted the other way; resolution shape: a fade below $66,900 within weeks. Surviving leg: MSCI adoption with MSTR underperforming BTC >15% (Oct 16).
- **Resolution window:** by Feb 19, 2027 · **Outcome:** still-open · **Brier:** n/a

### AUG 7, 2026 — "The jobs report that saved Bitcoin is a recession tell" (growth-scare rotation bear — STUB, condensed SEP 13; full text in git)

- **p=0.25 → 0.20 (AUG 19) → 0.10 (SEP 13), still-open (resolution Feb 7, 2027).** Aged AGAINST on both clocks: soft data was bought through Jackson Hole, and the labor-rollover premise was then contradicted outright by the August payrolls (+162K vs ~53K; July revised UP to +21K from −23K; unemployment 4.1%). Its beta leg (BTC falls WITH equities on risk-off days) printed Sep 8–11 — but on a RATES shock, not a growth scare. Floor reached; kept open for scoring integrity.

### AUG 3, 2026 — "The 'range' is a slow top" structural-break BEAR (STUB; full text in git)

- **p=0.30, still-open (resolution Feb 3, 2027).** Legs: corporate (vindicated — a THIRD sale Aug 10, then REVERSED by the Aug 31 buy), demand-thinness (refuted by August's $3.52B), calendar (the hike threat died in August and RETURNED in September — half a life). The $66.9K-reclaim invalidation fired Aug 19 and held. Superseded by AUG 7 → AUG 19 → SEP 13 entries.

### JUL 19 / JUL 26, 2026 — structural-break BEAR pair (STUB; full text in git)

- **p = 0.25 → 0.30, both still-open (resolutions Jan 19/26, 2027).** Macro-re-hardening + informed-seller bear. Aged: the macro leg was right EARLY (the JUL 26 repossession), wrong in August (jobs miss → hold), and right AGAIN in September (the hike repricing) — a leg that keeps flickering is a leg the base case should carry, and THESIS-006 does; the flow leg refuted three times (Jul, Aug 3–7, August's record month); the corporate leg vindicated then reversed (Aug 31 buy). Superseded.

### JUL 8 / JUL 12, 2026 — structural-break BEAR pair (STUB; full text in git)

- **Both p=0.30, still-open (resolutions Jan 8/12, 2027).** Relief one-print-thick + Strategy's record sale unreversed + the BSTR/Cantor crack. The flow leg was refuted repeatedly; the corporate-crack leg strengthened into the DAT unwind, then Strategy itself reversed to buying. Superseded.

### JUL 2 / JUL 6, 2026 — capitulation-bull → bear-flip transition (STUB; full text in git)

- **JUL 2 capitulation-bottom BULL p=0.40; JUL 6 FLIPPED to structural-break BEAR p=0.35 (both still-open; resolutions Jan 2/6, 2027).** The bull's re-rate substantially PRINTED (Jul flows → Aug restart → $82,300 Sep 3–4, +42% off the $57.7K low); the bear leg superseded.

### JUN 24 / JUN 28, 2026 — capitulation-bottom BULL series (STUB; full text in git)

- **Both p=0.35, still-open (resolutions Dec 24/28, 2026).** First bull contrarians on the ledger. **Aged (SEP 13): substantially VINDICATED** — the $57.7K low has held through everything; the named violent re-rate arrived in stages (Jul flows; the Aug 3–7 restart; the Aug 19–25 breakout to $81K; $82,300 Sep 3–4). Not yet scoreable. Vindication: positive weeks + >$66K reclaim + cooler macro (two of three printed; macro re-hardened). Invalidation: <$55K/<$50K closes; outflows persist; strategic sale.

### JUN 5 / JUN 13 / JUN 20, 2026 — structural-break BEAR series (STUB; full text in git)

- **p = 0.30 → 0.25 → 0.30, all still-open (resolutions Dec 5/13/20, 2026).** "The June flush is THE break — lower high toward the $40Ks." Aged: the stance moved INTO the base case Jun 24 and back OUT; the lower-high claim is now contradicted ($82,300 > the $73K pre-cascade level). Shared signals as later entries.

### JUN 1 / MAY 29, 2026 — AI-opportunity-cost + digital-gold bears (STUB; full text in git)

- **Both p=0.35, still-open (resolutions Nov 30).** The rate channel proved real; the beta leg survives (BTC fell WITH chips on risk-off days, and Sep 8–11 fell WITH equities on the rates shock); the digital-gold-was-marketing claim gained a datapoint SEP 13 (gold fell WITH BTC — no safe-haven bid, a pure rates trade). The reflexivity sub-claim fully vindicated (June–August forced sales), then complicated by the Aug 31 buy. Still owed: the systematic BTC/Nasdaq + BTC/SOXX read.

### MAY 18–20, 2026 — early structural-bear series (STUB; full text in git)

- **(a)** MAY 18 "Regulation = denatured reserve asset" p=0.30 (un-triggered — CLARITY stalled rather than passed-then-weaponized). **(b)** MAY 18 "Synchronized enthusiasm = setup peak" p=0.25 (open). **(c)** MAY 20 "Corporate buyers are the cycle peak" p=0.30 — substantially VINDICATED in mechanism (the NAV-premium/fixed-dividend leak), then complicated (the valve re-opened above cost, Aug 31). All still-open; windows May 2027 / 12–18mo post-CLARITY.

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
