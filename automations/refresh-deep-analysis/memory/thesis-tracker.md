# Thesis Tracker

**Active primary theses + their falsification conditions.** Auto-flags theses for retirement when conditions are met or when stalled without new evidence for 4+ weeks.

Anti-confirmation-bias scaffolding: the analyst can't quietly drop a thesis when it stops working — it has to be explicitly retired with a reason.

## Active

### THESIS-008 — Buyers Withdrawn, Beta Exposed (the rendered primary)

- **Initiated:** NOV 2, 2026 (registered the run THESIS-007 and THESIS-006 both closed at their Oct 31 horizon)
- **Theme slug:** `exchange-security` (slot 1 MARKETS — the Binance theft); anchors `etfs` + `corporate-treasuries` + `fed-monetary-policy` (the beta leg)
- **One-line:** Bitcoin spends the rest of 2026 below its yearly open ($87,570) because the two 2026 buyer classes are both withdrawn — the U.S. spot ETFs turned net sellers (three of five October weeks negative; October −$515M; the cohort under water at ~$82,300) and Strategy's share-funded buying has shut (zero ATM and no purchase Oct 19–25; 5,552 BTC sold in Q3 to fund dividends/buybacks; MSTR −27% YTD; MSCI deletion Nov 30) — while on down days the price trades as the Nasdaq's high-beta sleeve, now with a custody-risk discount from the Oct 29 Binance theft. Horizon Dec 31, 2026. This is branch (b) of the OCT 24 long-term question; branch (a) (a priced hold releases a crowded-entry unwind) is tested by falsifier #2's flow half and the Nov 6 row; branch (c) (the inflation-hedge regime) died Oct 30 (gold −3.6% with BTC).
- **Initial probability:** `p = 0.55` (NOV 2 — decomposition: P(a Friday close >$87,570 by Dec 31 from ~$77,800, +12.6%, in a contagion regime) ~0.30; P(#2's conjunction — three positive weeks running AND Strategy ≥1,000 BTC share-funded across two consecutive filings) ~0.20, mostly inside #1; P(#3 the beta break) ~0.15, independent → P(any fires) ~0.45 → 0.55. Not higher: the 0.50–0.70 bin runs HOT on sustain claims (40% hit rate) and the event-restart and corporate priors both say we under-price buyers returning. Not lower: October printed the withdrawal of both classes on primary data, and the regime check flipped to contagion for the first time since Jun 5.)
- **Current probability:** **0.55** (NOV 2 — initiation)
- **Falsification conditions** (any one retires the thesis):
  1. Bitcoin's Friday close (CoinGecko 00:00 UTC the next day) is above $87,570 on or before Dec 31, 2026 — the yearly open reclaimed.
  2. U.S. spot ETF net flows are positive in three consecutive weeks ending between Nov 6 and Dec 25, 2026, AND Strategy discloses share-funded (ATM) Bitcoin purchases totaling at least 1,000 BTC across two consecutive weekly 8-Ks by Dec 31 — both buyer classes back (heuristics #1's convergence).
  3. On any U.S. trading day before Dec 31, 2026, the Nasdaq Composite falls at least 2% while Bitcoin rises at least 2% over the same calendar day (00:00–24:00 UTC) — the beta link broken.
- **Supporting evidence (NOV 2):** weeks ending Oct 2 +$241.1M / Oct 9 −$681.1M / Oct 16 −$228.6M / Oct 23 +$301.2M / Oct 30 −$202.6M (Oct 30 −$643.3M, the largest day since Jun 25); the Oct 26 8-K (no BTC, no ATM, STRC $204.9M, USD Cash $242.4M); the Q3 8-K (5,552 BTC sold; $431.8M YTD sold for dividends/buybacks); MSTR −10% Oct 30, mnav.com 1.12× (equity-only ≈ 0.8×); the beta leg's 5th down-instance Oct 30 (Nasdaq −2.9%); the Fed 10–2 with Dec ~73% priced; the Binance theft and $3.64B of post-reopening outflows.
- **Counter-evidence:** money returned within a week after the Oct 22 rout (Oct 26–29 +$440.7M) and dip-buying recurs on calm days; Strategy's cash valve (Sep 21: 950 BTC) and daily STRC dividends that analysts (StoneX, TD Cowen) read as setting up buying; Strive still buying at size (6,182 BTC); the Fed meeting and the midterms clear the calendar; Brent fell $117.6 → $108.4 on diplomacy; the Bybit precedent cuts both ways.
- **Catalysts to watch:** the Nov 2 / Nov 9 8-Ks (#2's corporate half; heuristics #3's retire test); the Nov 6 flow print (row 0.55; #2's first week); Binance's PoR report (Nov 3); midterms Nov 3; MSCI Nov 11 / Nov 30; CPI/PPI Nov 12–13; FOMC Dec 8–9 (hike row 0.70).
- **Stalled-run counter:** 0
- **Pre-named paths (for the next run):** UP — the Nov 6 week positive AND a Nov 2 or Nov 9 buy → 0.45; DOWN — the Nov 6 week negative with the Nasdaq steady AND no buy in either filing → 0.65 (and heuristics #3 retires). Neither → hold.

## Retired

_(stubs; full text in git — kept ≤26 weeks after retirement)_

- **THESIS-007 — Demand-Led Breakout, October-Gated.** SEP 26 → NOV 2 (horizon Oct 31). Arc 0.45 → 0.55 (OCT 7) → 0.35 (OCT 16) → 0.35 (OCT 24). **RETIRED on #2's letter:** ETF net flows negative in three of the five weeks ending Oct 2–30 (Oct 9 −$681.1M, Oct 16 −$228.6M, Oct 30 −$202.6M — TFTC/Farside basis). #4 ALSO crossed on secondary data (Oct 30 ~$1.5–1.6B of crypto liquidations, ~$1.2–1.35B longs, CoinGlass via press; the day was also the monthly options expiry — logged, not needed). #1 cleared (Oct 23 close $81,102; Oct 30 $77,275 — not consecutive); #3 never fired (the Q3 sales were the summer's, disclosed weekly then; the Oct 26 8-K bought nothing). **Lessons:** the directional read was right until the demand it named left — the "demand-led" claim was a claim about September's buyers, who became October's sellers; THREE mechanism amendments were wrong (the long end as the gate, OCT 7; the Fed's next move, OCT 24; the demand persisting, SEP 26) — the only gate that mattered was the flow print itself; a sustain thesis priced at 0.35 for two runs was well placed. [TFTC October](https://www.tftc.io/bitcoin-etf-flows/october-2026) · [The Block Nov 1](https://www.theblock.co/news/markets/2026-11-01-spot-bitcoin-etfs-largest-four-months-following-binance-hack-432270)
- **THESIS-006 — Priced-In Hike, Guidance-Gated Flows.** SEP 13 → NOV 2 (horizon Oct 31). Arc 0.55 → 0.45 → 0.70 (SEP 26) → 0.70 (held three runs; stalled counter 3). **Price letter INTACT by a wide margin** (#1 a weekly close <$70K: the lowest Friday close was $77,275, 10% above the line); #3 never fired. **#5 crossed on the horizon's last day:** Oct 30 ~$1.2–1.35B of longs liquidated (CoinGlass via three outlets, secondary) on the Binance theft — a crypto-idiosyncratic shock on the monthly options-expiry Friday. Logged as RETIRED on #5's letter rather than "expired intact", because the letter says ≥$1B of longs and the restatements agree; the directional read was right, the flow mechanism ("the marginal allocator answers the next-move guidance") was wrong (SEP 26 amendment: the decision's PASSING released the bid; OCT 24: the equity tape took over). Rule 7 note: a cascade falsifier on the final day of a horizon tests noise more than wrongness — THESIS-008 carries none.
- **THESIS-005 — Policy-Led Re-Rating.** AUG 19 → SEP 13 on #5 (the Aug 20–25 squeeze). Lesson: cascade falsifiers DOWNSIDE-only.
- **THESIS-004 — Rate-Gated Range, Bounded Corporate Leak.** AUG 3 → AUG 19 on #2 (a third sale below cost). Lesson: behaviour is conditional on price vs basis.
- **THESIS-003 — Cyclical Deleveraging vs Structural Break.** JUN 5 → AUG 3 on #3. Lesson: decompose.
- **THESIS-001 — CLARITY as the institutional unlock.** MAY 18 → JUL 26 on #2 (the calendar). **THESIS-002 — Tactical Distribution, Structural Floor.** MAY 29 → JUN 5 on #5/#1 (the cascade).

## Hygiene rules

1. **Every `DEEP_ANALYSIS.primaryAnalysis` is logged here.**
2. **Falsification conditions must be concrete and observable.**
3. **Probability is updated every run.** Even if it doesn't move, write the same number with a 1-line "no new evidence" note.
4. **Stalled-run counter increments when no new material evidence affects the thesis.** At 4 runs, auto-flag for retirement consideration.
5. **Retirement requires a stated trigger.**
6. **Theses don't compete.**
7. **A falsifier is a wrongness test, not a noise test (SEP 13).** Cascade conditions are downside-only or round-trip-conditioned — and (NOV 2) a bearish-range thesis carries no cascade falsifier at all, since a cascade is consistent with it.
8. **Mechanism amendments are logged, not hidden (OCT 7 / OCT 16).**
9. **Pre-name the paths (NOV 2).** Write the UP and DOWN conditions and the number each implies at initiation, so the next run's move is a lookup, not a negotiation.
