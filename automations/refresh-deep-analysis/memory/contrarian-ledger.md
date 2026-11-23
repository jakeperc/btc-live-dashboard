# Contrarian Ledger

Past `contrarianTake` entries with **probability of vindication** at time of writing + later assessment of how they aged. Prevents drift into cheerleading. Forces honest probability-weighting of counter-narratives.

**Outcomes:** `vindicated` (1.0) / `partial` (0.5) / `wrong` (0.0) / `still-open` (no Brier yet). **Brier:** `(p − outcome)²` on the probability AT TIME OF WRITING (entries are scored as made, like watch rows; later steps are aging notes, not restatements).

**Workflow:** append the new `contrarianTake` each run with `asOf`, `probability`, a working `resolution-window` and a dated **resolution shape**; revisit entries whose window OR whose resolution shape's own date has elapsed; score and add a 1-line "what we learned". Decay: prune entries older than 52 weeks.

## Active (still-open)

### NOV 23, 2026 — "This is Bitcoin's own bear market, not a stock-market wobble: the leveraged-treasury model is unwinding" (structural-unwind BEAR)

- **Probability of vindication (at time of writing):** 0.20 — NEW entry; the FIRST BEAR since AUG 19 and the first entry written under ledger rule 9 (after four bulls stepped to the floor in four runs). The base case (THESIS-008, 0.85) says Bitcoin is a non-yielding macro-beta asset whose weekly sign is set by whichever macro channel is hostile — so a stock-market recovery lifts it. This entry says the driver is INTERNAL: the companies that borrowed and issued paper to buy coins are becoming forced sellers, so Bitcoin falls even if stocks recover. Strategy: ≈$1.76B/yr of preferred dividends + interest against a stake 19% under water (27% at the low), MSCI deletion at the Nov 30 close, the ATM's coin share down to 14%, MSTR −9.7% on Nov 20; Trump Media: the $976.8M put Nov 30 vs $182.3M cash; the preferred-funded cohort (Strive; SATS 15%) with its October stack ~25% under water; miners −18% on Nov 20 (production sales); H100 (Sweden) already trading coins at a loss. Resolution shape: a Friday close (CoinGecko 00:00 UTC next day) BELOW $50,000 by Jan 29, 2027 WITH a filed coin SALE (8-K / 10-Q / 10-K) by a top-ten corporate holder in the same window — the structural leg must be OBSERVED, not inferred from price.
- **Resolution window:** by May 23, 2027.
- **Vindication signals:** a Strategy 8-K disclosing a coin sale (the SALE row 0.35); Trump Media selling to meet the put (row 0.30); the MSTR ATM at zero with the STRC buyback continuing (the valve shut); a week in which BTC falls while the Nasdaq RISES on the week (the Nov 13 pattern without the rates excuse — the 10Y flat or down). **Invalidation:** a Strategy buy of at least 1,000 BTC in the Nov 23 or Nov 30 8-K (the share machine still feeds coins at a loss — the Nov 16 filing's 485 is the warning); a Friday close above $70,000; the funds net-positive two weeks running; Trump Media funding the put without a coin sale AND Strategy's USD Reserve still above $4.5B at year end.
- **Where the analogy breaks (declared):** Strategy's $4.75B reserve covers ~2.7 years of payouts, and it BOUGHT below basis this month rather than sold; Trump Media's sellable supply is capped at ~4,264 BTC by the pledges and it plans to borrow; even a 10,000 BTC/month forced-sale pace (~$600M) is one bad ETF day; and the 2022 analog's sellers (Celsius, 3AC, FTX) were LENDERS with customer liabilities, which these companies are not.
- **Distinct from prior:** every entry since OCT 16 was a BULL and all four stepped to the floor on the price row; this is a BEAR on the base case's own terms with an OBSERVABLE structural leg. Priced 0.20: the mechanism is live and dated (Nov 30 twice; daily coupons), but the conjunction (−18% AND a filed sale) is strict and the reserve argues against the Strategy leg.
- **Outcome:** still-open · **Brier:** n/a

### NOV 16, 2026 — "The sellers are machinery, and the machinery stops on November 30" (mechanical-supply-exhaustion BULL)

- **How it aged (NOV 23, 7 days in): its own INVALIDATION fired — stepped 0.20 → 0.10 (floor), "mechanism gone" (rule 6).** Letter: "a Friday close below $62,000 (the row — the flush low gone)" — Nov 20 closed $58,818 and Nov 21 printed $55,130. One vindication signal fired the same week (Strategy BOUGHT in the Nov 16 8-K — the ATM open below basis) and the mechanical calendar (Nov 30) has not yet passed; mixed, but a fired invalidation governs (rule 6, NOV 9 precedent). Note the irony the entry itself declared: the biggest seller was DISCRETIONARY — $1.79B out of the funds, on the equity tape this time. The FOURTH bull to the floor in four runs → ledger rule 9 applied this run. Kept open on its shape (a Friday close >$75,000 by Dec 31 with two of the three weeks ending Dec 4–18 positive).
- **Original (0.20, condensed; git):** November's sellers were mechanical and calendar-gated (>$3B of liquidations; MSCI's ~13M-share passive flow by Nov 30; Trump Media's put Nov 30); after Nov 30 only tired sellers remain; F&G 10 has bounced before. Declared breaks: MSCI's flow is in shares; Trump Media borrows; the leverage cohort rebuilds weekly; the discretionary seller tracked rates, which have no Nov 30.
- **Resolution window:** by May 16, 2027 · **Outcome:** still-open · **Brier:** n/a

### NOV 9, 2026 — "April 2025, not June 2026: the tech-rout low is the Bitcoin low" (capitulation-analog BULL)

- **How it aged (NOV 16, 7 days in): its own INVALIDATION fired — stepped 0.25 → 0.10 (floor), "mechanism gone" (rule 6).** Letter: "a Friday close below $70,000 (the 200-week EMA ~$69,500 — the 2025 analog's floor gone)" — Nov 13 closed $68,314 (CoinGecko 00:00 UTC Nov 14) and the Nov 15 low was ~$62,000. Half of the second clause fired too (the Nov 13 week −$1,065.5M). No vindication signal fired: the CPI was HOT (Dec odds 77 → 97%), the week was negative with the Nasdaq UP, and Strategy's 1,036 was at size but above basis. Kept open on its shape (a Friday close >$87,570 by Dec 31 with two of the three weeks ending Nov 27 – Dec 11 positive).
- **Original (0.25, condensed; git):** the April 7, 2025 analog (~$74,400 → $126,080 in six months) on the Nasdaq's worst day since then; >$2B of liquidations; CryptoQuant 89% of STH inflows at a loss; F&G 25; the 200-day average; Strategy buying. Declared break: the 2025 catalyst (a tariff pause) had no 2026 counterpart and the Fed was set to raise — which is exactly what decided it.
- **Resolution window:** by May 9, 2027 · **Outcome:** still-open · **Brier:** n/a

### NOV 2, 2026 — "The theft was the bottom, not the warning" (custodial-wrapper BULL)

- **How it aged (NOV 9, 7 days in): its own INVALIDATION fired — stepped 0.25 → 0.10 (floor), "mechanism gone" (rule 6).** Letter: "a second ≥$1B liquidation day" — Nov 5 (CoinGlass via crypto.news $1.08B / Coinotag $1.24B / PANews $1.66B; longs ~$0.9–1.27B): the Oct 30 flush was not the flush. The Nov 6 week was also negative (−$1,281.7M — half of the "Nov 6 AND Nov 13 both negative" clause). One VINDICATION signal fired too (a Strategy buy, Nov 2), and the Friday close ($75,775) stayed above the $75,000 invalidation line; the PoR report landed on time. Mixed — but a stated invalidation fired, so the floor governs. Kept open on its shape (a Friday close >$87,570 by Dec 31 with the Nov 13 AND Nov 20 weeks positive).
- **Original (0.25, condensed; git):** Oct 30 as the clear-out — the base layer and ETF custody untouched; ~$1.5B flushed; $3.64B of Binance exits to land somewhere (the adjacent-layer wrapper edge's first flow datapoint); the FOMC and midterms clearing; daily STRC dividends read as setting up buying; Brent falling.
- **Resolution window:** by May 2, 2027 · **Outcome:** still-open · **Brier:** n/a

### OCT 24, 2026 — "Bitcoin is being sold as a technology stock, but it is walking into an inflation-hedge regime" (hedge-regime BULL)

- **How it aged (NOV 2): its own INVALIDATION fired — stepped 0.20 → 0.10 (floor), "mechanism gone".** Oct 30: the Nasdaq −2.9%, BTC −3.3% (a.m. series); gold fell 3.6% WITH Bitcoin under Brent $117.6. NOV 9: gold ROSE to $4,087.60 while BTC fell — divergence, not tandem-up; the hedge form still unobserved. Kept open on its window.
- **Original (0.20, condensed; git):** the stagflation setup; resolution shape: a Friday close >$87,570 by Dec 31 WITH Brent >$100 AND the Nasdaq below its Oct 21 close (~26,703). NOV 9: Brent ~$94.50 — the Brent leg is now failing too.
- **Resolution window:** by Apr 24, 2027 · **Outcome:** still-open · **Brier:** n/a

### OCT 16, 2026 — "This is the flush before a priced pause, not the end of the rally" (pre-FOMC-flush BULL)

- **How it aged (NOV 2): its own INVALIDATION fired — stepped 0.25 → 0.10 (floor), "mechanism gone".** A Friday close <$80,000 (Oct 30: $77,275); the priced hold passed and the money did not come back. NOV 9: the Nov 6 week printed −$1.28B — the shape (a Friday close >$87,570 by Nov 27 WITH the Nov 6 week positive) is impossible on its own date; **NOV 16: the Nov 13 close $68,314 — score WRONG at the shape's date (Nov 27) on the Nov 30 run — pre-logged.**
- **Original (0.30, condensed; git).** · **Resolution window:** by Apr 16, 2027 · **Outcome:** still-open (shape fails Nov 27) · **Brier:** n/a

### SEP 16, 2026 — "The Fed just raised rates against oil, and this rise is the top of the cycle, not the start of a series" (peak-hawkishness BULL)

- **How it aged (NOV 16, 61 days in): HELD 0.35 — but on its letter it is nearly decided.** Dec 9 is now priced 97–100% (the Oct CPI +0.4%; Waller's 50bp remark; the HIKE row 0.95); the "top of the cycle" claim needs the Dec 9 SEP to show NO further rise — Logan wants "at least two more". Energy is the entry's last argument (WTI ~$88; October CPI energy +0.7%). Decided at Dec 9: a hike = WRONG; a hold with December's language softening = VINDICATED; a hold with the series still priced = PARTIAL. Score on the Dec 14 run.
- **Original (0.30, condensed; git).** · **Resolution window:** by Mar 16, 2027 · **Outcome:** still-open · **Brier:** n/a

### AUG 19 and earlier — series (STUBS; full text in git)

- **AUG 19 hollow-breakout BEAR** p=0.30 → 0.10 (SEP 13). NOV 9: MSTR $129 (−28% YTD) vs BTC −41% from ATH; the MSCI leg decides Nov 11 / Nov 30. HELD 0.10; resolution Feb 19, 2027.
- **AUG 7 growth-scare BEAR** p=0.25 → 0.10; resolution Feb 7, 2027. **AUG 3 slow-top BEAR** p=0.30; resolution Feb 3, 2027. **JUL 19 / 26 macro-re-hardening + informed-seller BEAR pair** p=0.25 → 0.30; resolutions Jan 19/26, 2027. **JUL 8 / 12 structural-break BEAR pair** p=0.30; resolutions Jan 8/12, 2027. **JUL 2 capitulation BULL (0.40) → JUL 6 bear-flip (0.35)**; resolutions Jan 2/6, 2027. **JUN 24 / 28 capitulation-bottom BULL series** p=0.35; substantially vindicated; resolutions Dec 24/28, 2026. **JUN 5 / 13 / 20 structural-break BEAR series** p=0.30 → 0.25 → 0.30; resolutions Dec 5/13/20, 2026. **JUN 1 / MAY 29 AI-opportunity-cost + digital-gold BEARS** p=0.35; the beta leg has SEVEN day-instances (Nov 5 the cleanest) and ONE weekly counter-instance (NOV 16: the Nasdaq +2.3% w/w while BTC fell 12.6% — on RATES, not stocks); the digital-gold form has fired once in ten (NOV 16: tandem-DOWN under a real-yield driver — gold −5.5%, BTC −12.6%) — leaning VINDICATED at their Nov 30 windows (the "not gold" half is clean; the "AI beta" half needs the asterisk that rates, not AI, drove the November low); **score on the Nov 30 run — lesson draft: "BTC traded as a non-yielding macro-beta asset, not as gold, in 9 of 10 dated tests; the equity-beta form held on days, the rates form on the week that mattered."** **MAY 18–20 early structural BEARS** (0.30 / 0.25 / 0.30); windows May 2027 / 12–18mo post-CLARITY.

## Resolved (rolling 52 weeks)

| asOf | one-line | category | window / shape date | p | outcome | brier | lesson |
|---|---|---|---|---|---|---|---|
| SEP 13, 2026 | "'Priced in' is the most expensive phrase in markets" — rates-regime BEAR: a weekly close <$70,000 by Oct 31 | macro / market structure | Oct 31, 2026 | 0.30 | wrong (0.0) | 0.09 | The lowest Friday close before Oct 31 was $77,275 — 10% above the line. Half right on INFLATION, wrong on PRICE: the August buyers left on the equity tape six weeks later, not on the hike. Scored NOV 2. [CoinGecko](https://api.coingecko.com/api/v3/coins/bitcoin/history?date=31-10-2026&localization=false) |
| SEP 26, 2026 | "Bitcoin's buyers have stopped watching the Fed" — structural-decoupling BULL: a Friday close >$90,000 by Oct 30 WHILE October hike odds >50% | macro / ETF | Oct 30, 2026 | 0.30 | wrong (0.0) | 0.09 | Neither leg: price peaked $87,300 (Sep 21); odds fell to ~10%. "Ignoring the Fed" was pricedness, not decoupling. Scored NOV 2. |
| OCT 7, 2026 | "The bond market is the central bank now, and it is tightening" — long-end BEAR: two consecutive Friday closes <$80,000 by Oct 30 WITH the 30Y par ≥5.60% | macro | Oct 30, 2026 | 0.25 | wrong (0.0) | 0.0625 | The 30Y par fell 5.67 → 5.31; the conjunction never printed. A one-session co-fall promoted to a fortnight's frame (causal-model rule 7). Scored NOV 2. |

_Resolved Σ Brier 0.2425 / 3 = 0.08 — three bears/bulls priced 0.25–0.30 that did not print; the ledger's contrarian line is honest so far but has only tested the "wrong" side. Next scheduled (the Nov 30 run): the OCT 16 bull's shape (Nov 27 — WRONG, pre-logged) and the MAY 29 / JUN 1 bears (Nov 30 — leaning VINDICATED). Floor-stepped and open: OCT 24 hedge bull, NOV 2 wrapper bull, NOV 9 April-analog bull (all 0.10)._

## Pruned (>52 weeks)

_(none yet)_

## Hygiene rules

1. **Probability is mandatory.**
2. **A contrarian take with p ≤ 0.10 is not a real contrarian take** — it's a strawman.
3. **A contrarian take with p ≥ 0.50 is no longer the contrarian take** — it's the base case in disguise.
4. **Distinct from prior weeks.** If `contrarianTake` recycles the same skepticism for 3+ runs without new evidence, that's drift.
5. **Vindication / invalidation signals are concrete.**
6. **When an entry's own invalidation fires, step it to the floor and say "mechanism gone", not "wrong" (OCT 16).** NOV 9: the floor governs even when a vindication signal fired the same week — mixed evidence does not rescue a fired invalidation.
7. **Score on the resolution shape's own date, not only the six-month window (NOV 2).**
8. **An analog entry declares where the analogy breaks (NOV 9).** The 2025 bottom had a policy catalyst; name the missing ingredient in the entry itself. NOV 16: the missing ingredient (a Fed set to raise) is exactly what invalidated it within a week — the declared break was the forecast.
9. **Three bulls to the floor in three runs is information, not noise (NOV 16).** Supply-gated, analog-gated and (pending) calendar-gated bull cases have each been invalidated by the RATES channel; the next contrarian should probably be rates-gated (the SEP 16 entry's form) or a BEAR on the base case's own terms (a sub-$55K close), not another bottom call. **NOV 23: the calendar-gated bull fell too (four in four — the fourth by the EQUITY channel), and the rule was applied: a structural-unwind BEAR with an observable leg (a filing).**
10. **A contrarian's structural claim needs an observable other than price (NOV 23).** A bear that resolves on price alone is indistinguishable from the base case's own downside; require the mechanism to show up in a document (a filing, a listing notice, a vote) as a conjunction in the shape.
