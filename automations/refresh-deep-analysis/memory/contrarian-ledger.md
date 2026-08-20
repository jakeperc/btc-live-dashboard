# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet).

**Brier:** `(p − outcome)²`.

**Workflow:**
- At end of each run: append the new `contrarianTake` with `asOf`, `probability`, and a working `resolution-window` (the realistic time horizon to assess it).
- At start of next run: revisit entries whose `resolution-window` has elapsed. Score and add a 1-line "what we learned." Update `calibration.md`.
- Decay: prune entries older than 52 weeks (contrarian calls take longer to resolve than watchList items).

## Active (still-open)

### AUG 19, 2026 — "You just watched a short squeeze dressed up as a regime change: one-shot fuel, a proposal that isn't law, and a bid that was weakening into the breakout"

- **Probability of vindication (at time of writing):** 0.30 — NEW entry (squeeze-artifact / hollow-breakout bear), absorbing the growth-scare bear's surviving leg with fresh composition evidence. The mechanism: (1) **the fuel was one-shot** — >$1B of forced short-covering in ~1h (largest on record) cannot repeat, and it fired into a tape whose actual investors had just voted the other way (the week ending Aug 14 was the worst flow week since June, −$389.7M, FBTC-led); (2) **the catalysts deserve haircuts** — the SEC rulebook is a PROPOSAL (60-day comment, litigation risk) that mostly de-risks token fundraising, not BTC's institutional bid (BTC was never a security), and the summit produced an adjective, not a vote count (~7 Dems still short, markets ~13%); (3) **the macro clock ticks** — July payrolls FELL (Sep 4 jobs = the arming wire), 30Y at 2007 highs forced a Treasury buyback intervention, Brent ~$90 re-arms the Sep 10 CPI, and on breakout day the stress hedge the market chose was GOLD at $4,480 while BTC sat 45% below its peak; (4) the corporate leg stands WON (three sales in six weeks, doctrine confirmed) with MSCI forced-selling possibly queued (Oct 16). Resolution shape: the pop fades below $66,900 within weeks, flows stay choppy, the range reasserts with the top grinding lower.
- **Resolution window:** 6 months — by Feb 19, 2027.
- **Vindication signals:** a weekly close back below $66,900 within 2 weeks with flows net-negative; falsifier #2 of THESIS-005 firing (2 of 3 pre-FOMC weeks negative); a Sep 4 payroll decline that markets SELL (BTC + equities down together — the growth-scare leg); MSCI adoption Oct 16 with MSTR underperforming BTC by >15% into it. **Invalidation:** 2 of 3 pre-FOMC flow weeks positive; a weekly close above $70K with positive flows; a cleared CLARITY cloture; a resumed Strategy buy.
- **Distinct from prior:** AUG 7's bear was a growth-scare rotation read; this entry inherits its Sep-4 leg but re-grounds the bear in the BREAKOUT'S OWN COMPOSITION (squeeze mechanics + the pre-breakout outflow week + catalyst-quality analysis) — evidence that did not exist last run. Priced 0.30 (up from the predecessor's 0.25): the composition evidence is verifiable now, but price, the deleveraged book, and the policy tailwind argue against until the fade actually starts.
- **Outcome:** still-open · **Brier:** n/a

### AUG 7, 2026 — "The jobs report that saved Bitcoin is a recession tell: rate relief born of economic weakness is a trap for a high-beta asset"

- **How it aged (AUG 19, twelve days in):** AGAINST, on its own scoreboard — soft/neutral data kept getting BOUGHT (the in-line Aug 12 CPI produced no risk-off; the Aug 19 session was a +8% breakout), no "markets SELL soft data" print has appeared, and BTC reclaimed $66.9K+ (a named invalidation level) — though the durability leg is untested and the Sep 4 jobs report remains its true wire. Stepped DOWN 0.25→**0.20** per its own pre-script (soft data getting bought through late August); Jackson Hole (Aug 28) is the remaining stage before the 0.15 step. Its growth-scare leg is carried forward inside the AUG 19 entry above; this entry stays open on its own window for scoring integrity.
- **Probability of vindication (at time of writing):** 0.25 — the bear RE-GROUNDS (growth-scare rotation, successor to the structural-break line): the old bear lost two named legs in one morning (September hike off the table; flows restarted ~$750M — both on its own invalidation list), so recycling it would violate ledger rule 4. The surviving mechanism is sharper: (1) **the relief IS the weakness** — payrolls' first outright decline, −103K revisions, falling participation, five-year-low wage growth = a labor market rolling over; easing-trades born of growth deterioration historically work until the scare overtakes them; (2) **BTC sits on the wrong side of the rotation** — all year it has fallen WITH equities/AI on risk-off days (opportunity-cost pattern), and this very week gold surged to a seven-week high while BTC merely reclaimed its August range: in a genuine slowdown the hedge bid chooses gold and BTC trades as high-beta risk; (3) the corporate leg stands WON (serial below-cost seller + DAT unwind — carried over); (4) August seasonality + the tariff-CPI wildcard. Resolution shape: the range breaks DOWN on growth fear even as hike odds stay low — falsifier #3 fires as a growth-driven flow relapse the rate-gate model can't explain.
- **Resolution window:** 6 months — by Feb 7, 2027.
- **Vindication signals:** a soft-data print that markets SELL (jobs/CPI miss + BTC and equities down together ≥2%); two negative flow weeks with September odds still <40%; ISM/claims deterioration accelerating; a weekly close <$55K on risk-off (not CPI-hot) tape. **Invalidation:** soft data keeps getting BOUGHT through Jackson Hole; flows positive 3 of 4 weeks; a durable >$66.9K reclaim; payroll revisions turn positive.
- **Distinct from prior:** AUG 3's bear ran on distribution + seasonality + a hike threat; the hike threat is dead, so this entry RETIRES that leg and re-grounds the bear in regime rotation (inflation-gated → growth-gated) — a mechanism the base case explicitly flags as its live risk but prices low. Stepped DOWN 0.30→0.25 for the two fired invalidation legs; floor 0.10 is far.
- **Outcome:** still-open · **Brier:** n/a

### AUG 3, 2026 — "The 'range' is a slow top" structural-break BEAR (STUB, re-condensed AUG 19; full text in git)

- **p=0.30, still-open (resolution Feb 3, 2027).** Three legs: corporate (conceded by the base case — THESIS-003 retired on the 2nd below-cost sale), demand-thinness (July ~$200M, IBIT-concentrated), calendar (worst month + hike ~2/3 priced + tariff-CPI). Aged MIXED: the corporate leg fully vindicated (a THIRD sale, Aug 10); the calendar leg died (hold repriced; in-line CPI); the demand leg half-lived (the −$390M Aug 14 week, then the policy restart); the $66.9K-reclaim invalidation FIRED on the Aug 19 breakout — pending durability. Superseded by AUG 7 → AUG 19 entries; corporate + flow signals carry forward.

### JUL 19 / JUL 26, 2026 — structural-break BEAR pair (STUB, re-condensed AUG 19; full text in git)

- **p = 0.25 (JUL 19) → 0.30 (JUL 26), both still-open (resolutions Jan 19/26, 2027).** The macro-re-hardening + informed-seller bear across the pre-FOMC fortnight: relief one print thick (Sept ~65→82% with no new data, Brent >$100, tariffs a second channel), Strategy's $3B cash bunker + the dormant-whale exit, then the verified DAT unwind (Satsuma/Sequans/Nakamoto) as the 7-day ~$1B flow run died. Aged: the macro leg was right EARLY (the JUL 26 repossession) then wrong in August (jobs miss → hold; in-line CPI held); the flow leg refuted twice (post-CPI restart; Aug 3–7 ~$865M week) though its choppiness half-vindicated (the −$390M Aug 14 week); the corporate leg fully VINDICATED (three sales in six weeks — the base case conceded it). Superseded by the AUG 7 growth-scare re-grounding → the AUG 19 squeeze-artifact entry; shared signals (weekly closes <$55K/<$50K, sustained Brent >$100, flow relapse) carry forward.

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
