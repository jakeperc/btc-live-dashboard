# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet).

**Brier:** `(p − outcome)²`.

**Workflow:**
- At end of each run: append the new `contrarianTake` with `asOf`, `probability`, and a working `resolution-window` (the realistic time horizon to assess it).
- At start of next run: revisit entries whose `resolution-window` has elapsed. Score and add a 1-line "what we learned." Update `calibration.md`.
- Decay: prune entries older than 52 weeks (contrarian calls take longer to resolve than watchList items).

## Active (still-open)

### AUG 7, 2026 — "The jobs report that saved Bitcoin is a recession tell: rate relief born of economic weakness is a trap for a high-beta asset"

- **Probability of vindication (at time of writing):** 0.25 — the bear RE-GROUNDS (growth-scare rotation, successor to the structural-break line): the old bear lost two named legs in one morning (September hike off the table; flows restarted ~$750M — both on its own invalidation list), so recycling it would violate ledger rule 4. The surviving mechanism is sharper: (1) **the relief IS the weakness** — payrolls' first outright decline, −103K revisions, falling participation, five-year-low wage growth = a labor market rolling over; easing-trades born of growth deterioration historically work until the scare overtakes them; (2) **BTC sits on the wrong side of the rotation** — all year it has fallen WITH equities/AI on risk-off days (opportunity-cost pattern), and this very week gold surged to a seven-week high while BTC merely reclaimed its August range: in a genuine slowdown the hedge bid chooses gold and BTC trades as high-beta risk; (3) the corporate leg stands WON (serial below-cost seller + DAT unwind — carried over); (4) August seasonality + the tariff-CPI wildcard. Resolution shape: the range breaks DOWN on growth fear even as hike odds stay low — falsifier #3 fires as a growth-driven flow relapse the rate-gate model can't explain.
- **Resolution window:** 6 months — by Feb 7, 2027.
- **Vindication signals:** a soft-data print that markets SELL (jobs/CPI miss + BTC and equities down together ≥2%); two negative flow weeks with September odds still <40%; ISM/claims deterioration accelerating; a weekly close <$55K on risk-off (not CPI-hot) tape. **Invalidation:** soft data keeps getting BOUGHT through Jackson Hole; flows positive 3 of 4 weeks; a durable >$66.9K reclaim; payroll revisions turn positive.
- **Distinct from prior:** AUG 3's bear ran on distribution + seasonality + a hike threat; the hike threat is dead, so this entry RETIRES that leg and re-grounds the bear in regime rotation (inflation-gated → growth-gated) — a mechanism the base case explicitly flags as its live risk but prices low. Stepped DOWN 0.30→0.25 for the two fired invalidation legs; floor 0.10 is far.
- **Outcome:** still-open · **Brier:** n/a

### AUG 3, 2026 — "The 'range' is a slow top: the biggest holder is a serial seller, demand is one fund wide, and August is Bitcoin's worst month"

- **How it aged (AUG 7, four days in):** BADLY on two of three legs — the calendar leg's hike scenario died (September → expected hold) and the demand leg's "one fund wide" claim met a ~$750M restart week (still IBIT-concentrated, so partially intact); the corporate leg stands. Two of its named INVALIDATION signals partially fired (odds <40% pending CPI; first August flow week positive). Superseded by the re-grounded AUG 7 growth-scare entry above; shared corporate leg carried forward.

- **Probability of vindication (at time of writing):** 0.30 — HELD (structural-break BEAR), with its strongest evidence week of the summer. (1) **Corporate leg formally CONCEDED by the base case:** THESIS-003 retired on Strategy's second successive below-cost dividend-cycle sale (1,638 BTC @ $63,957 vs $75,419 cost basis) while the junior DAT cohort liquidates — the bear called "the strongest hands exiting" when the base case still said "pause," and the ledger now agrees. (2) **Demand leg thinner than the headlines:** July's "first positive month since April" was ~$200M against $7B of May–June outflows, one-fund-concentrated (IBIT 79% of Jul 30), and the post-hold week still closed −$61.5M. (3) **Calendar leg:** August is BTC's worst month (median −7.87%/15y) with a September hike ~2/3 priced and a tariff-inflated CPI due Aug 12. Resolution shape: $63K fails → $57.7K goes → the $55K weekly close the base case prices at 0.20 prints before the September FOMC. HELD at 0.30 rather than raised: price keeps refusing to confirm (the June low intact through two months of retirement-grade news), and one soft print reopens flows within days on the proven pattern.
- **Resolution window:** 6 months — by Feb 3, 2027: a range that resolved sideways/up (WRONG) vs a relief structure before a leg through $55K toward the $40Ks (VINDICATED).
- **Vindication signals:** weekly close <$55K/<$50K; a third Strategy sale or a >$200M sale month; 4+ negative flow weeks including two after a dovish data surprise; a hot Aug 12 tariff-CPI locking the September hike ≥75%. **Invalidation:** September-hike odds <40% post-CPI with flows restarting; both August weekly flow prints positive; a durable >$66.9K reclaim; a resumed Strategy buy.
- **Distinct from prior:** JUL 26's bear ran on pricing repossession + early signal-firing; the NEW evidence here is the base case's own formal concession of the corporate leg (thesis retired on it) plus the seasonality/data-calendar timing leg. The named crux is now "demand WAITING vs demand ABSENT" — THESIS-004 falsification #3 operationalizes exactly that split.
- **Outcome:** still-open · **Brier:** n/a

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

### JUL 8 / JUL 12, 2026 — structural-break BEAR pair (STUB, re-condensed AUG 7; full text in git)

- **Both p=0.30, still-open (resolutions Jan 8/12, 2027).** Same bear stance across a choppy-tape fortnight: relief one-print-thick + Strategy's record sale unreversed + the BSTR/Cantor crack. Aged: the flow leg was REFUTED (JUL 19 positive-week HIT), partially re-vindicated (JUL 23–24 repricing), then refuted again (AUG restart); the corporate-crack leg strengthened into the verified DAT unwind. Superseded by JUL 19 → AUG 7 entries; shared signals.

### JUL 2 / JUL 6, 2026 — capitulation-bull → bear-flip transition (STUB, re-condensed AUG 7; full text in git)

- **JUL 2 capitulation-bottom BULL p=0.40; JUL 6 FLIPPED to structural-break BEAR p=0.35 (both still-open; resolutions Jan 2/6, 2027).** The bull ran on the year's best on-chain capitulation evidence (LTH SOPR ~0.8, whale accumulation sub-$60K, no third cascade); the flip came when THESIS-003 crossed back above even odds, making the bear the contrarian again on Strategy's record sale. Aged: the bull's re-rate substantially PRINTED (Jul flows + Aug restart off the $57.7K floor); the bear leg superseded by JUL 8→AUG 7 entries. Shared signals as later entries.

### JUN 24 / JUN 28, 2026 — capitulation-bottom BULL series (STUB, re-condensed AUG 7; full text in git)

- **Both p=0.35, still-open (resolutions Dec 24/28, 2026).** First bull contrarians on the ledger (base case had flipped bearish): the June break as a washed-out capitulation low — forced sellers sell once, whales accumulated, one catalyst forces a violent re-rate. **Aged: substantially VINDICATING** — the $57.7K low has held through everything since, and the named re-rate arrived in stages (Jul flows; the Aug 3–7 ~$750M restart + $65.3K August high). Not yet scoreable (windows Dec 2026). **Vindication:** positive weeks + >$66K reclaim + cooler macro. **Invalidation:** <$55K/<$50K closes; outflows persist; strategic sale.

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
