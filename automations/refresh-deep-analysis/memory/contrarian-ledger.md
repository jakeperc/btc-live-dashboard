# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet). **Brier:** `(p − outcome)²` on the probability AT TIME OF WRITING (entries are scored as made, like watch rows; later steps are aging notes, not restatements).

**Workflow:** append the new `contrarianTake` each run with `asOf`, `probability`, a working `resolution-window` and a dated **resolution shape**; revisit entries whose window OR whose resolution shape's own date has elapsed; score and add a 1-line "what we learned". Decay: prune entries older than 52 weeks.

## Active (still-open)

### NOV 2, 2026 — "The theft was the bottom, not the warning" (custodial-wrapper BULL)

- **Probability of vindication (at time of writing):** 0.25 — NEW entry. The base case (THESIS-008, 0.55) says both buyer classes are withdrawn and Bitcoin trades as Nasdaq beta with a custody discount into year end. This entry says Oct 30 was the clear-out: the theft hit one company's hot wallets (the base layer and U.S. ETF custody untouched), ~$1.5B of leveraged positions were flushed in a day (the ingredient that preceded the summer's +40%), $3.64B left Binance in ten hours and has to land somewhere (self-custody; now also the regulated wrappers — the adjacent-layer `custodial-wrapper advantage` edge, which has never had a flow datapoint), the FOMC and the midterms clear the calendar, Strategy's daily STRC dividends are read by its analysts as setting up buying, and Brent fell $117.6 → $108.4 on diplomacy. Resolution shape: a Friday close (CoinGecko 00:00 UTC next day) ABOVE $87,570 by Dec 31, 2026 WITH the weeks ending Nov 13 AND Nov 20 both net-positive for the U.S. spot ETFs.
- **Resolution window:** by May 2, 2027.
- **Vindication signals:** the Nov 6 week positive with the Nasdaq flat or down (the wrapper edge's first flow datapoint); Binance's PoR report landing Nov 3 with the exit slowing; a Nov 2 / Nov 9 Strategy buy; a reclaim of $80,000 on a Friday close by Nov 13. **Invalidation:** the Nov 6 AND Nov 13 weeks both negative (the money did not come back after the flush); a Friday close <$75,000 (Strategy's basis — the corporate bid flips to sales); Binance's report delayed past Nov 9 or showing a shortfall; a second ≥$1B liquidation day (the flush was not the flush).
- **Distinct from prior:** the OCT 16 bull was EVENT-gated (a priced hold releases the bid — the hold passed and the money left); the OCT 24 bull was DRIVER-gated (inflation hedge — gold fell with BTC); this one is SUPPLY-gated: forced sellers exhausted plus a custody shock that moves coins toward wrappers. Priced 0.25: not lower because the mechanism is live (rule 6) and the 0.10–0.30 bin runs UNDER-confident (44% hit rate); not higher because the funds SOLD $643M on the day of the theft rather than buying, the beta leg has fired on every bad equity day since September, and the +12.6% reclaim needs both buyer classes back.
- **Outcome:** still-open · **Brier:** n/a

### OCT 24, 2026 — "Bitcoin is being sold as a technology stock, but it is walking into an inflation-hedge regime" (hedge-regime BULL)

- **How it aged (NOV 2, 9 days in): its own INVALIDATION fired — stepped 0.20 → 0.10 (floor), "mechanism gone" (rule 6).** Letter: "BTC falls ≥3% on any day the Nasdaq falls ≥2%" — Oct 30: the Nasdaq −2.9%, BTC −3.3% on Fortune's a.m.-to-a.m. series ($80,037 → $77,381) and −5% to the intraday low (on CoinGecko's 00:00 UTC series the UTC-day move was −0.7%, the drop having landed in the Oct 29 UTC day — logged; the beta leg fired on the session either way). Worse for the mechanism: gold fell 3.6% to $3,875 WITH Bitcoin (tandem-down a 5th time) while Brent was $117.6 — the exact setup the entry needed produced the opposite sign. Confound: the Binance theft was a crypto-specific driver that day. Kept open on its window for scoring integrity.
- **Original (0.20, condensed; git):** oil at $116.72, UMich 4.7%, a Fed that cannot cut, bonds rallying on fear = the stagflation setup in which gold ran to $5,600; the week's selling was a liquidity sale that exhausts. Resolution shape: a Friday close >$87,570 by Dec 31 WITH Brent >$100 AND the Nasdaq below its Oct 21 close (~26,703).
- **Resolution window:** by Apr 24, 2027 · **Outcome:** still-open · **Brier:** n/a

### OCT 16, 2026 — "This is the flush before a priced pause, not the end of the rally" (pre-FOMC-flush BULL)

- **How it aged (NOV 2, 17 days in): its own INVALIDATION fired — stepped 0.25 → 0.10 (floor), "mechanism gone".** Letter: "a Friday close <$80,000 by Oct 30" — Oct 30 closed $77,275. The priced hold PASSED (Oct 28, 10–2) and the money did not come back in the decision week (Oct 29 +$17.1M; Oct 30 −$643.3M) — though the theft and the Nasdaq rout confound the post-decision read, which is why the Nov 6 row (0.55) is still the pattern's scoring moment, not this entry's. The ATM did not size UP (it went to zero). Prior aging: OCT 24 0.30 → 0.25.
- **Original (0.30, condensed; git):** October's selling is the pre-decision exit that precedes every priced FOMC and reverses after it (the SEP 26 precedent). Resolution shape: a Friday close >$87,570 by Nov 27 WITH the Nov 6 week net-positive.
- **Resolution window:** by Apr 16, 2027 · **Outcome:** still-open · **Brier:** n/a

### SEP 16, 2026 — "The Fed just raised rates against oil, and this rise is the top of the cycle, not the start of a series" (peak-hawkishness BULL)

- **How it aged (NOV 2, 47 days in): the Oct 28 check — HELD-ish, stepped 0.40 → 0.35.** The Fed HELD (letter: vindicated on the price leg long ago, and no second rise yet) but with TWO dissents for a rise and December priced ~73% (82.6% right after the decision); Warsh: "let us disabuse you". The "top, not a series" claim is decided at Dec 9: a hike = WRONG; a hold with December's language softening = VINDICATED; a hold with the series still priced = PARTIAL. Score then, not now.
- **Original (0.30, condensed; git):** the hike answers energy-driven headline inflation with core at 2.4%; the front end reprices on one weak print. Resolution shape: a close >$82,300 by Oct 31 with both post-decision weeks positive — complete in September.
- **Resolution window:** by Mar 16, 2027 · **Outcome:** still-open · **Brier:** n/a

### AUG 19 and earlier — series (STUBS; full text in git)

- **AUG 19 hollow-breakout BEAR** p=0.30 → 0.10 (SEP 13). OCT 16: the MSCI leg half-fired. NOV 2: MSTR −27% YTD vs BTC −38% from ATH; still not >15% underperformance since Sep 21 on a clean basis. HELD 0.10; resolution Feb 19, 2027.
- **AUG 7 growth-scare BEAR** p=0.25 → 0.10; resolution Feb 7, 2027. **AUG 3 slow-top BEAR** p=0.30; resolution Feb 3, 2027. **JUL 19 / 26 macro-re-hardening + informed-seller BEAR pair** p=0.25 → 0.30; resolutions Jan 19/26, 2027. **JUL 8 / 12 structural-break BEAR pair** p=0.30; resolutions Jan 8/12, 2027. **JUL 2 capitulation BULL (0.40) → JUL 6 bear-flip (0.35)**; resolutions Jan 2/6, 2027. **JUN 24 / 28 capitulation-bottom BULL series** p=0.35; substantially vindicated; resolutions Dec 24/28, 2026. **JUN 5 / 13 / 20 structural-break BEAR series** p=0.30 → 0.25 → 0.30; resolutions Dec 5/13/20, 2026. **JUN 1 / MAY 29 AI-opportunity-cost + digital-gold BEARS** p=0.35; the beta leg now has five down-instances and the digital-gold form has fired once in seven (NOV 2: tandem-down 5) — leaning VINDICATED at their Nov 30 windows; score next run. **MAY 18–20 early structural BEARS** (0.30 / 0.25 / 0.30); windows May 2027 / 12–18mo post-CLARITY.

## Resolved (rolling 52 weeks)

| asOf | one-line | category | window / shape date | p | outcome | brier | lesson |
|---|---|---|---|---|---|---|---|
| SEP 13, 2026 | "'Priced in' is the most expensive phrase in markets" — rates-regime BEAR: a weekly close <$70,000 by Oct 31 | macro / market structure | Oct 31, 2026 | 0.30 | wrong (0.0) | 0.09 | The lowest Friday close before Oct 31 was $77,275 — 10% above the line. The stagflation-lite frame was half right on INFLATION (CPI 3.7%, Dec ~73%) and wrong on PRICE: the August buyers did not capitulate on the hike; they left on the equity tape six weeks later. Scored NOV 2 on the shape's own date. [CoinGecko Oct 31 00:00 UTC](https://api.coingecko.com/api/v3/coins/bitcoin/history?date=31-10-2026&localization=false) |
| SEP 26, 2026 | "Bitcoin's buyers have stopped watching the Fed" — structural-decoupling BULL: a Friday close >$90,000 by Oct 30 WHILE October hike odds >50% | macro / ETF | Oct 30, 2026 | 0.30 | wrong (0.0) | 0.09 | Neither leg: price peaked $87,300 (Sep 21) and odds fell to ~10%. Fund money re-coupled to the Fed within a fortnight (−$487M on the minutes), then switched to the Nasdaq (Oct 22) — "ignoring the Fed" was pricedness, not decoupling. Scored NOV 2. [CentralBank.watch](https://centralbank.watch/federal-reserve/) |
| OCT 7, 2026 | "The bond market is the central bank now, and it is tightening" — long-end BEAR: two consecutive Friday closes <$80,000 by Oct 30 WITH the 30Y par ≥5.60% | macro | Oct 30, 2026 | 0.25 | wrong (0.0) | 0.0625 | The 30Y par fell 5.67 → 5.31 and the Oct 23 close was $81,102, so the conjunction never printed; Oct 30 DID close <$80K ($77,275) — through the theft and the equity tape, not the bond. A one-session co-fall promoted to a fortnight's frame (causal-model rule 7). Scored NOV 2. [Treasury par](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202610) |

_Resolved Σ Brier 0.2425 / 3 = 0.08 — three bears/bulls priced 0.25–0.30 that did not print; the ledger's contrarian line is honest so far but has only tested the "wrong" side._

## Pruned (>52 weeks)

_(none yet)_

## Hygiene rules

1. **Probability is mandatory.**
2. **A contrarian take with p ≤ 0.10 is not a real contrarian take** — it's a strawman.
3. **A contrarian take with p ≥ 0.50 is no longer the contrarian take** — it's the base case in disguise.
4. **Distinct from prior weeks.** If `contrarianTake` recycles the same skepticism for 3+ runs without new evidence, that's drift.
5. **Vindication / invalidation signals are concrete.**
6. **When an entry's own invalidation fires, step it to the floor and say "mechanism gone", not "wrong" (OCT 16).**
7. **Score on the resolution shape's own date, not only the six-month window (NOV 2).** An entry whose shape names a date (e.g. "by Oct 30") resolves when that date passes; the window is the backstop for shapes without one.
