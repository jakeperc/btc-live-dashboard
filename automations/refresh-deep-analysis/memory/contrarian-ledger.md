# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet).

**Brier:** `(p − outcome)²`.

**Workflow:**
- At end of each run: append the new `contrarianTake` with `asOf`, `probability`, and a working `resolution-window`.
- At start of next run: revisit entries whose `resolution-window` has elapsed. Score and add a 1-line "what we learned." Update `calibration.md`.
- Decay: prune entries older than 52 weeks.

## Active (still-open)

### OCT 16, 2026 — "This is the flush before a priced pause, not the end of the rally" (pre-FOMC-flush BULL)

- **Probability of vindication (at time of writing):** 0.30 — NEW entry. The base case (THESIS-007 at 0.35) says the September rally is being undone by its own buyers and the flow falsifier is one week from firing; this entry says October's selling is the pre-decision exit that precedes every priced FOMC and reverses after it. Mechanism: (1) the inflation jump is ENERGY (gasoline +9.1% m/m; energy +20.4% y/y; core 2.6%) and the chair will not hike into +29K payrolls — Warsh "I don't prejudge" (Oct 16) took October odds to ~15%; (2) the OCT 7 drag has reversed — the 30Y par 5.67→5.43, the 10Y 5.28→5.10, gold +2.4%; (3) the selling is small relative to the buying it unwinds (−$827M over nine sessions vs +$2.6B in September; U.S. ETF holdings $105.7B); Strategy still buys; the MSCI passive sellers hold ~3.1% (< one day's volume); (4) the SEP 26 precedent: a ~90%-priced decision passed and ~$3B arrived within a fortnight (the post-event-relief pattern, 1st instance). Resolution shape: a Friday close ABOVE $87,570 (the yearly open) by Nov 27 WITH the week ending Nov 6 (first full week after Oct 28) net-positive.
- **Resolution window:** 6 months — by Apr 16, 2027.
- **Vindication signals:** the Nov 6 week positive (memory row 0.55); a HOLD Oct 28 with flows positive the following three sessions; a Friday close >$84,000 by Oct 30 (THESIS-007 #1 cannot fire); Strategy's ATM sized UP (>$100M) in the Oct 19 / 26 8-Ks; mNAV holding ≥1.05× through the Nov 11 list. **Invalidation:** THESIS-007 #2 firing AND the Nov 6 week negative (the pause passed and the money did not come back — pricedness alone is not enough); a hike Oct 28; a Friday close <$80,000 by Oct 30; a Strategy sale; Dec hike odds >95% with the 10Y par back above 5.25%.
- **Distinct from prior:** the SEP 16 bull said the Sep hike was the TOP of the cycle (its series leg is failing — Dec ~90%); this entry needs no series call: a priced hold is enough because the restart is event-gated, not guidance-gated (the lesson the OCT 7 two-week row paid 0.49 to learn). The OCT 7 bear said the long end was the price-setter — that mechanism has now run the other way. Priced 0.30, not higher, because September's buyers are still selling into a tape with no new high, the December hike is ~90% priced, the Fed's set-piece record is 0-for-5 on softer-than-market, and the yearly-open reclaim needs +6% in six weeks; not lower because the event-restart prior (ETF rows −0.45 / −0.70 residuals) says we under-price exactly this shape, and rule 6 binds (a live mechanism never below 0.25).
- **Outcome:** still-open · **Brier:** n/a

### OCT 7, 2026 — "The bond market is the central bank now, and it is tightening" (long-end real-yield BEAR)

- **How it aged (OCT 16, 9 days in): its own INVALIDATION fired — stepped 0.25 → 0.10 (floor).** The entry's letter: "the 30Y par back below 5.50% (the bear loses its mechanism rather than being wrong — log it as such)." Par: 5.67 (Oct 7) → 5.43 (Oct 15). Gold ROSE (~$4,070 → ~$4,169) while BTC fell — the opposite of the real-yield co-fall it predicted; stocks fell on CPI, not on yields. The PRICE leg half-printed (a low of $79,806 on Oct 15; no Friday close <$80K) but through inflation and fund outflows, not the long end — so the mechanism was wrong even where the direction was right. Kept open on its window; the 30Y ≥5.80% row (0.40) will score Oct 30 (heading to MISS). Lesson: one clean multi-asset co-fall (Oct 7) was not enough to name the long end "the central bank" — the OCT 7 run promoted a one-day pattern to a fortnight's frame.
- **Original (0.25, condensed; git):** the 30Y at 5.715% (press) / 5.66 par with $40T of debt, Brent >$101, heavy auctions and global sovereign stress resets the riskless return; on Oct 7 stocks, gold and BTC fell together; the buyer thinned; a friendlier Fed does not help if the long end sets the price. Resolution shape: two consecutive Friday closes <$80,000 by Oct 30 WITH the 30Y par ≥5.60%.
- **Resolution window:** by Apr 7, 2027 · **Outcome:** still-open · **Brier:** n/a

### SEP 26, 2026 — "Bitcoin's buyers have stopped watching the Fed" (structural-decoupling BULL)

- **How it aged (OCT 16, 20 days in): AGAINST — its invalidation "an outflow day >$400M within 48h of a hot print (the old rule re-coupling)" fired on Oct 7 (−$487.1M on the hawkish minutes) and nearly again on Oct 14 (−$261.5M on CPI 3.7%); stepped 0.25 → 0.15.** The conjunction it needed (a close >$90K WHILE Oct hike odds >50%) is unreachable (odds ~15–28%; price ~$82K). Fund money is watching the Fed again, both ways. Kept open for scoring integrity; the surviving bullish leg lives in the OCT 16 entry (event-gated restart), which does not claim decoupling.
- **Prior aging (OCT 7): 0.30 → 0.25** — the long-end leg went the other way (gold, stocks, BTC fell together Oct 7).
- **Original (0.30, condensed; git):** the `fed→flows` rule failed its cleanest test (Sep 17–25 ~$2.98B while hike odds rose 43.5%→61.6%); breadth (IBIT ~49%); YTD positive; both buyer classes active; a bond problem ends in a bid for scarce assets. Resolution shape: a Friday close ABOVE $90,000 by Oct 30 WHILE October hike odds stay above 50%.
- **Resolution window:** by Mar 26, 2027 · **Outcome:** still-open · **Brier:** n/a

### SEP 16, 2026 — "The Fed just raised rates against oil, and this rise is the top of the cycle, not the start of a series" (peak-hawkishness BULL)

- **How it aged (OCT 16, 30 days in): MIXED — stepped 0.45 → 0.40.** FOR: October is still a priced hold (~72–85%) and the chair declined to guide to a hike. AGAINST: the SERIES leg strengthened — the minutes ("most participants" see another increase by year end), CPI 3.7%, Williams "one more", Dec cumulative ~90% — and the price leg gave back half its gain (~$82K from $87.3K). Its resolution shape (a close >$82,300 by Oct 31 with both post-decision weeks positive) is complete on its letter; the "top, not a series" claim is the half that is failing. Candidate for scoring at Oct 28: "vindicated on letter, series leg wrong" if the Fed holds with December still ~90%.
- **Prior aging:** SEP 26 0.30 → 0.40 (price right, mechanism failing); OCT 7 0.40 → 0.45 (the Oct 2 jobs trigger fired; the letter completed).
- **Original (0.30, condensed; git):** the hike answers energy-driven headline inflation with core at 2.4%; the no-2027-cuts median is a forecast the front end reprices within hours of one weak print (the Oct 2 jobs report named); Bitcoin has done its selling.
- **Resolution window:** by Mar 16, 2027 · **Outcome:** still-open · **Brier:** n/a

### SEP 13, 2026 — "'Priced in' is the most expensive phrase in markets" (rates-regime BEAR)

- **How it aged (OCT 16): HELD at 0.10 (floor).** Only the <$70K-by-Oct-31 leg survives (needs −15% from ~$82.6K in two weeks). Its long-end story was carried by the OCT 7 bear and has now failed; its inflation story (energy → the Fed's path) is half-alive (CPI 3.7%; Dec ~90%) but the price is nowhere near its line. Prior: 0.30 → 0.35 (SEP 16) → 0.15 (SEP 26, two invalidations fired) → 0.15 (OCT 7).
- **Original (0.30, condensed; git):** the first hike since 2023 into $100+ oil with the long end uncontained is stagflation-lite; gold fell with BTC; the August squeeze fuel cannot repeat. Resolution shape: a weekly close below $70,000 by Oct 31.
- **Resolution window:** by Mar 13, 2027 · **Outcome:** still-open · **Brier:** n/a

### AUG 19, 2026 — "You just watched a short squeeze dressed up as a regime change" (hollow-breakout BEAR — STUB)

- **p=0.30 → 0.10 (SEP 13, three invalidations fired).** OCT 16: its surviving MSCI leg half-fired — adoption (Oct 15) ✓ but "MSTR underperforming BTC by >15%" ✗ (MSTR −10% vs BTC −5% since Sep 21). HELD 0.10; resolution Feb 19, 2027.

### AUG 7 / AUG 3 / JUL 19–26 / JUL 8–12 / JUL 2–6 / JUN 24–28 / JUN 5–20 / JUN 1 – MAY 29 / MAY 18–20, 2026 — earlier series (STUBS; full text in git)

- **AUG 7 growth-scare BEAR** p=0.25 → 0.10 (SEP 13); the labour-rollover premise contradicted (Aug payrolls +162K); resolution Feb 7, 2027.
- **AUG 3 slow-top BEAR** p=0.30; corporate leg vindicated then reversed (Aug 31 buy); resolution Feb 3, 2027.
- **JUL 19 / 26 macro-re-hardening + informed-seller BEAR pair** p=0.25 → 0.30; the macro leg flickers (right JUL 26, wrong AUG, right SEP); flow leg refuted three times; resolutions Jan 19/26, 2027.
- **JUL 8 / 12 structural-break BEAR pair** p=0.30; flow leg refuted; corporate-crack leg strengthened then reversed; resolutions Jan 8/12, 2027.
- **JUL 2 capitulation BULL (0.40) → JUL 6 bear-flip (0.35)**; the bull's re-rate substantially PRINTED (+42% off the $57.7K low); resolutions Jan 2/6, 2027.
- **JUN 24 / 28 capitulation-bottom BULL series** p=0.35; substantially VINDICATED (the low held; the violent re-rate arrived in stages); not yet scoreable; resolutions Dec 24/28, 2026.
- **JUN 5 / 13 / 20 structural-break BEAR series** p=0.30 → 0.25 → 0.30; the lower-high claim contradicted ($87,300 > $73K); resolutions Dec 5/13/20, 2026.
- **JUN 1 / MAY 29 AI-opportunity-cost + digital-gold BEARS** p=0.35; the rate channel real; the beta leg survives; the digital-gold-was-marketing claim gained datapoints (SEP 13; OCT 7) and lost one (OCT 16: gold up, BTC down — divergence, not tandem); resolutions Nov 30, 2026.
- **MAY 18–20 early structural BEARS** (regulation = denatured reserve asset 0.30, un-triggered; synchronized enthusiasm = setup peak 0.25; corporate buyers = cycle peak 0.30, mechanism substantially vindicated then complicated); windows May 2027 / 12–18mo post-CLARITY.

## Resolved (rolling 52 weeks)

| asOf | one-line | category | window | p | outcome | brier | lesson |
|---|---|---|---|---|---|---|---|

_(empty — first resolutions expected from Nov 30, 2026 (the MAY 29 / JUN 1 windows))_

## Pruned (>52 weeks)

_(none yet)_

## Hygiene rules

1. **Probability is mandatory.**
2. **A contrarian take with p ≤ 0.10 is not a real contrarian take** — it's a strawman.
3. **A contrarian take with p ≥ 0.50 is no longer the contrarian take** — it's the base case in disguise.
4. **Distinct from prior weeks.** If `contrarianTake` recycles the same skepticism for 3+ runs without new evidence, that's drift.
5. **Vindication / invalidation signals are concrete.**
6. **When an entry's own invalidation fires, step it to the floor and say "mechanism gone", not "wrong" (OCT 16).** A bear whose price leg half-prints through a different mechanism is still a wrong model.
