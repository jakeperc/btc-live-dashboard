# Thesis Tracker

**Active primary theses + their falsification conditions.** Auto-flags theses for retirement when conditions are met or when stalled without new evidence for 4+ weeks.

Anti-confirmation-bias scaffolding: the analyst can't quietly drop a thesis when it stops working — it has to be explicitly retired with a reason.

## Active

### THESIS-008 — Buyers Withdrawn, Beta Exposed (the rendered primary)

- **Initiated:** NOV 2, 2026 (registered the run THESIS-007 and THESIS-006 both closed at their Oct 31 horizon)
- **Theme slug:** `etfs` (slot 1 MARKETS since NOV 9 — the price break on flows + the macro tape); anchors `fed-monetary-policy` + `corporate-treasuries`. _(NOV 16 texts — the first amendment, the 0.80 decomposition, the Nov 9–15 evidence — condensed NOV 23; git.)_
- **One-line (AMENDED NOV 16 and NOV 23 — rule 8; earlier texts in git):** Bitcoin spends the rest of 2026 below its yearly open ($87,570) because the two 2026 buyer classes are withdrawn or small — the U.S. spot ETFs are net sellers (four straight negative weeks: Oct 30 −$202.6M, Nov 6 −$1,281.7M, Nov 13 −$1,065.5M, **Nov 20 −$1,789.7M**; the cohort ~25% under water) and Strategy's share-funded buying is **small and shrinking, routed mostly to preferred buybacks** (811 → 1,036 → **485** BTC; coins' share of ATM proceeds 40% → 29% → 14%; the stake 19% below its $75,452 cost) — while the price trades as a NON-YIELDING MACRO-BETA asset whose weekly sign is set by whichever macro channel is hostile: rates in the week of Nov 9–15 (Nasdaq +2.3%, BTC −12.6%), **equities in the week of Nov 16–20 (Nasdaq −10%, BTC −6.3%, the 10Y 5.15 → 4.92 — rates EASED and BTC fell anyway)**. NOV 23 amendment: "small and premium-gated" → "small and shrinking" (the Nov 16 buy was BELOW basis, so the premium/basis gate is no longer the claim; heuristics #3 retired). The equity-beta claim stays DAY-scale (#3 its falsifier). Horizon Dec 31, 2026.
- **Initial probability:** `p = 0.55` (NOV 2 — decomposition: P(#1 from ~$77,800, +12.6%) ~0.30; P(#2) ~0.20 mostly inside #1; P(#3) ~0.15 → P(any) ~0.45.)
- **Arc:** 0.55 (NOV 2) → 0.65 (NOV 9 — the price leg) → 0.80 (NOV 16 — the pre-named DOWN path fired and overshot; tiered paths adopted) → **0.85 (NOV 23)**.
- **Current probability:** **0.85** (NOV 23 — **the pre-named DOWN path FIRED exactly as written:** a Friday close <$62,000 on Nov 20 — $58,818 (CoinGecko Nov 21 00:00 UTC) → 0.85. The second DOWN path (the Nov 20 week negative AND a Strategy SALE or idle filing) did NOT fire: the week was negative but Strategy BOUGHT (485), so no step to 0.90. No UP path fired. Decomposition: P(#1) ~0.04 (a +43% Friday close by Dec 31); P(#2) ~0.05 (three positive weeks from a four-week outflow streak — weeks ending Nov 27 / Dec 4 / Dec 11 at the earliest); P(#3) ~0.06 (no Nasdaq −2% / BTC +2% day Nov 16–20 — Nov 20 was −5.3% / −5.0%); P(#4) ~0.02 (a HOLD against 90% futures AND a Dec 11 close >$75,000) → P(any) ≈ 0.16 → 0.85. Against 0.90: the 0.70–0.90 bin is 5 of 5 (under-confident), but a −10% Nasdaq week is the kind of extreme that mean-reverts, and the HIKE row itself eased 0.95 → 0.90. The lookup worked this time (rule 9): the move was a lookup, not a negotiation.)
- **Falsification conditions** (any one retires the thesis):
  1. Bitcoin's Friday close (CoinGecko 00:00 UTC the next day) is above $87,570 on or before Dec 31, 2026. **NOV 23 check: Nov 20 close $58,818 — clear (49% below; the reclaim 43% from the weekly close).**
  2. U.S. spot ETF net flows are positive in three consecutive weeks ending between Nov 6 and Dec 25, 2026 (the corporate half — 1,000 ATM-funded BTC across two consecutive 8-Ks — was MET NOV 16 and is no longer rendered). **NOV 23 check: the week ending Nov 20 negative (−$1,789.7M) — the count restarts from the week ending Nov 27; the latest possible completion is the week ending Dec 11 if Nov 27, Dec 4 and Dec 11 are all positive.**
  3. On any U.S. trading day before Dec 31, 2026, the Nasdaq Composite falls at least 2% while Bitcoin rises at least 2% over the same calendar day (00:00–24:00 UTC). **NOV 23 check: Nov 20 Nasdaq −5.3% / BTC −5.0% (UTC day $61,921 → $58,818); Nov 19 BTC −2.9%; no BTC +2% UTC day Nov 16–20 — not fired; the day-scale beta edge took its 8th supporting instance.**
  4. The FOMC leaves the target range unchanged on Dec 9, 2026, AND Bitcoin's Friday close on Dec 11 (CoinGecko 00:00 UTC Dec 12) is above $75,000. **NOV 23 check: a Dec 9 test; futures 90.2% for a rise (CentralBank.watch Nov 20).**
- **Supporting evidence (NOV 23):** the week Nov 16–20 −$1,789.7M (the third-largest ever; IBIT records $541.1M Nov 19 and $544.7M Nov 20; four weeks ≈ −$4.34B); the Nasdaq Composite −10% w/w (22,617.73; AP) with BTC −6.3% and the 10Y 5.15 → 4.92 (the equity channel hostile while rates eased); gold to $3,515; DXY 103.6; $2.40B liquidated in 24h to late Nov 20 and ~$1.8B to Nov 21 (CoinGlass via CoinDesk); the $55,130 low (lowest since Sept 2024; −19% from the Nov 13 close in seven days); F&G 10–12 all week; the seventh weekly loss; Strategy 485 BTC on a $244.7M ATM with $206.3M to STRC (the coin bid a rounding error); MSTR −9.7% Nov 20; MSCI effective Nov 30; Trump Media's put Nov 30.
- **Counter-evidence:** rates EASED (the 10Y −23bp; the half point priced out; a quarter point 90% not 97–100%) — the rates leg is now a tailwind at the margin; the Nov 21 flush (>$2B; F&G 10) and the 9% intraday rebound have a washout's shape; a −10% Nasdaq week is historically followed by a bounce more often than not; Strategy still bought BELOW basis (the share machine works at a loss); Nov 16 printed the first inflow day (+$8.0M) in 12 sessions; the mechanical sellers' calendar still ends Nov 30 (though the NOV 16 contrarian built on it was invalidated).
- **Catalysts to watch:** the Nov 23 8-K (not on EDGAR at ~11:30 UTC; the purchase row 0.70 for Nov 23/30; the SALE row 0.35); Nov 25 PCE + Q3 GDP; the Nov 27 flow print (row 0.20; #2's count); the Fridays Nov 27 → Dec 18 (the <$55K row 0.40; #1); Nov 30 (MSCI effective; the Trump Media put; the mNAV and BBIT rows); Dec 8–9 FOMC (rows 0.90 / 0.15; #4); Dec 10 CPI; the Dec 11 CR.
- **Stalled-run counter:** 0 (new material evidence both ways this run).
- **Pre-named paths (for the next run — TIERED, rule 9):** UP — the Nov 27 week positive AND a Friday close >$65,000 on Nov 27 → 0.75; a Friday close >$70,000 on Nov 27 or Dec 4 → 0.70 (both → 0.65). DOWN — a Friday close <$55,000 on Nov 27 or Dec 4 → 0.90; a Strategy or Trump Media coin SALE filed by Dec 7 → 0.90 (both → 0.95 — the ceiling). Neither → hold 0.85.

## Retired

_(stubs; full text in git — kept ≤26 weeks after retirement)_

- **THESIS-007 — Demand-Led Breakout, October-Gated.** SEP 26 → NOV 2 (horizon Oct 31). Arc 0.45 → 0.55 → 0.35 → 0.35. RETIRED on #2's letter (ETF flows negative in three of five October weeks); #4 also crossed on secondary data (Oct 30 liquidations). Lessons: the "demand-led" claim was about September's buyers, who became October's sellers; three mechanism amendments were wrong (the long end; the Fed's next move; demand persisting) — the only gate that mattered was the flow print; a sustain thesis at 0.35 for two runs was well placed. (condensed NOV 9; git)
- **THESIS-006 — Priced-In Hike, Guidance-Gated Flows.** SEP 13 → NOV 2 (horizon Oct 31). Arc 0.55 → 0.45 → 0.70 (held three runs). Price letter intact by 10%; #5 (≥$1B of longs liquidated) crossed on the horizon's last day on secondary data — logged RETIRED on #5 rather than "expired intact". The flow mechanism ("the marginal allocator answers the next-move guidance") was wrong twice over. Rule 7 note: a cascade falsifier on the final day tests noise — THESIS-008 carries none. (condensed NOV 9; git)
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
8. **Mechanism amendments are logged, not hidden (OCT 7 / OCT 16 / NOV 9).**
9. **Pre-name the paths (NOV 2) — including a PRICE path (NOV 9) — in TIERS (NOV 16).** Write the UP and DOWN conditions and the number each implies at initiation, so the next run's move is a lookup, not a negotiation; for a range thesis, name the price level that moves the number too — and name a second tier, because a −13% week overshoots a single level (NOV 16: the "<$75K → 0.75" path fired at $68K and had to be renegotiated to 0.80).
