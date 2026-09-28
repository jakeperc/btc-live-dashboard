# Editor — last run report, 2026-09-26

Verify: `npm run check:plain -- --verify` → **exit 1** (structural 0 · hard/editable 0 · hard/locked 0 · soft 43, the same soft count as the 18:25 baseline). Invariants verified for 53 cards against `.invariants-2026-09-26T18-25-46-488Z.json`; no rule-20 numeric drift. Two runs: the first showed three fields I had pushed one word over their soft cap (`body[3]`, `body[4]`, `contrarianTake.body`); one-word trims fixed them and the single permitted re-run is the result above.

**Memory-directory audit:** `automations/refresh-deep-analysis/memory/` and `automations/refresh-market-news/last-run-artifacts.md` were NOT read. Nothing under `src/` outside `src/data/` was read. Files opened: the README, `SCOPE.md` lines 45–150, `reader-feedback.md`, `house-dialect.txt`, `src/data/glossary.js`, `last-check.md`, the previous `drafter-notes.md` and `last-run-report.md` (first 40 lines), the six changed data files, `scripts/check-plain.mjs` lines 703–754, 838–899 and 1314–1403 (rules 4, 8, 9, 20 — to know what the verifier measures), and the invariants snapshot (its pre-edit file copies, for the edit-volume diff).

No `$ARGUMENTS`: no force, no strict, no reader feedback. `adoption.js` untouched (no hint). `headlines.js`, `fallbacks.js` context only; both byte-identical.

## Fields touched: 17 (3 in market-news.js, 12 in deep-analysis.js, 2 in forecast-ledger.js)

| field | words before → after | longest sentence before → after |
|---|---|---|
| CURATED[0].plain | 26 → 26 | 26 → 16 (opening sentence now 16, was 26) |
| CURATED[0].detail | 146 → 145 | 37 → 37 |
| CURATED[3].wouldChange | 27 → 30 (cap 30) | 27 → 30 |
| headline | 20 → 20 (cap 20) | — |
| marketContext | 99 → 100 (cap 100) | 33 → 33 |
| primaryAnalysis.plain | 33 → 40 | 17 → 23 |
| primaryAnalysis.body[0] | 118 → 119 | 35 → 36 |
| primaryAnalysis.body[1] | 118 → 119 | 31 → 31 |
| primaryAnalysis.body[3] | 120 → 120 (cap 120) | 26 → 27 |
| primaryAnalysis.body[4] | 120 → 120 (cap 120) | 36 → 33 |
| primaryAnalysis.body total | 587 → 589 (cap 650) | — |
| crossCurrents[0].body | 148 → 147 | 43 → 30 |
| crossCurrents[1].title | 9 → 12 | — |
| crossCurrents[1].body | 147 → 148 | 28 → 31 |
| crossCurrents[2].body | 148 → 150 (cap 150) | 38 → 36 |
| contrarianTake.body | 150 → 150 (cap 150) | 33 → 34 |
| FORECAST_LEDGER.summary.plain | 41 → 42 | 28 → 29 |
| FORECAST_LEDGER.resolved[0].lesson | 41 → 45 (cap 45) | 25 → 30 |

Untouched, byte-identical (words / longest sentence): MARKET_THEME narrative 87/27, whyItMatters 58/24, wouldChange 29, milestone 56/27 · CURATED[0].wouldChange 25 · CURATED[1] plain 23, detail 149/34, wouldChange 27 · CURATED[2] plain 25, detail 147/35, wouldChange 27 · CURATED[3] plain 25/16, detail 148/36 · plainSummary 43/20 · body[2] 111/25 · crossCurrents[0].title 11, [0].plain 30/17, [1].plain 28/18, [2].title 11, [2].plain 28/18 · watchList plains 28/15, 31/17, 26/16, 33/24, 34/17, 33/20 · signals 99/36, 99/41, 98/24, 93/32, 94/36, 99/40 · contrarianTake.plain 32/19 · calibration.briefSummary 57/43 · byCategory plains 28, 28, 27, 22, 23 · resolved[1].lesson 39/21.

**Edit volume: 17 fields, 272 words changed (125 removed, 147 added, net +22)**, measured by word-diff against the snapshot's pre-edit copies. Prior runs: 2026-08-24 about 120 words / 9 fields; 2026-09-13 88 words / 8 fields. The number rose this week. Cause: `DEEP_ANALYSIS` was replaced in full and all five market cards were rewritten, so far more new prose reached this pass than on Sep 13. Four writer-side patterns account for most of it and belong in the writer prompts rather than in harder editing each Monday: "premium" used without a gloss (3 fields), "Treasury yield" without a gloss (3 fields), "breakout" in Tier 1 (2 fields), and "the Fed" as the first-use form.

## Probability bands

| field | p | band phrase used |
|---|---|---|
| primaryAnalysis.plain | 0.45 | "close to a coin flip, leaning no" (kept; sentence rebuilt around it) |
| primaryAnalysis.body[3], first sentence | 0.45 | "close to a coin flip, leaning no" (unchanged) |
| watchList[0].plain | 0.35 | "possible but less likely than not" (unchanged) |
| watchList[1].plain | 0.55 | "slightly more likely than not" (unchanged) |
| watchList[2].plain | 0.65 | "likely" (unchanged) |
| watchList[3].plain | 0.60 | "slightly more likely than not" (unchanged) |
| watchList[4].plain | 0.55 | "slightly more likely than not" (unchanged) |
| watchList[5].plain | 0.20 | "possible but less likely than not" (unchanged) |
| contrarianTake.plain | 0.30 | "possible but less likely than not" (unchanged) |
| marketContext and CURATED[0].detail (market-implied October rise, about 0.62) | — | "slightly more likely than not" (unchanged); the pre-decision 0.44 stays "close to a coin flip, leaning no" |

Every hedge in the source survived: "not just", "for the rest of October", "looks like", "may be", "possible but less likely than not", "a story, not yet a fact".

## Three worst offenders

**1. `crossCurrents[1].body` — "premium" three times, never defined, plus a condition only the ledger could read.**
> Before: "...and its shares fetching enough of a premium to sell. The price condition was met, the share condition was not, and it bought anyway, so its cash is a second valve. ... reopened the premium, to 17%, now 7%. Whether the September 28 filing shows new shares sold is the thing to watch. MSCI's October 16 decision ... caps how far that premium can go."
> After: "...and its shares worth more than the Bitcoin behind them, so selling new ones pays. The price condition was met, the share condition was not, and it bought anyway: cash is a second valve. ... reopened that gap, to 17%, now 7%. The next test is the September 28 filing: did it sell new shares? MSCI's October 16 decision ... caps how far that gap can go."

**2. `primaryAnalysis.body[4]` — a 36-word sentence carrying "a share premium to sell into".**
> Before: "We had given another purchase by mid-October 35% odds because we thought it needed both a price above its $75,416 average cost and a share premium to sell into; the price alone, plus cash, was enough."
> After: "We gave another purchase by mid-October 35% odds, thinking it needed two things: Bitcoin above its $75,416 average cost, and shares worth more than the Bitcoin behind them, so selling new ones pays. The price alone, plus cash, was enough."

**3. `headline` and `primaryAnalysis.plain` — "breakout" as the load-bearing word of the Tier 1 line.**
> Before: "Fund money bought the breakout as another rate rise grew likelier; ..." / "Keeping Bitcoin above the breakout price through October is close to a coin flip, leaning no."
> After: "Funds bought Bitcoin's jump even as another rate rise grew likelier; ..." / "Whether Bitcoin stays above the level it just broke through for the rest of October is close to a coin flip, leaning no."

Other rewrites: `CURATED[0].detail` "are the reasons bond buyers give" → "Bond buyers blame ...", "October was close to a coin flip" → "an October rise was close to a coin flip"; `CURATED[3].wouldChange` "House floor vote ... committee marker" → "full House vote ... a committee vote that goes nowhere"; `crossCurrents[0].body` split a 43-word sentence, "the marginal buyer" → "buyers", "the rise everyone feared" → "the rate rise everyone feared" (same fix in `body[1]`'s opening line); `crossCurrents[1].title` "before its share machine" → "into profit; its share sales stayed shut"; `crossCurrents[2].body` glossed the CLARITY Act at first use and split a 39-word sentence; `contrarianTake.body` "long-bond stress" → "when long-term government bonds fell this year", "because a quarter-point rise went from 44% to 62%" → "because the odds of a quarter-point rise went from 44% to 62%", "a 30-year Treasury at 5.5%" → "a 30-year government bond paying 5.5%"; `body[3]` "Every hot report" → "Every stronger-than-expected report", "Our kill test is" → "Our read fails on"; `body[0]` "the Fed's" → "the Federal Reserve's" at first use; `marketContext` "The 10-year Treasury yield ended" → "U.S. government bond yields: the 10-year ended" (the "ended ... at 5.10%" close-of-day verb kept, as instructed; market-news's "hit 5.21%" peak untouched); ledger `summary.plain` "trusting a softer Fed than we got" → "expecting a gentler central bank than we got"; `resolved[0].lesson` "needed a share premium too" → "also needed its shares worth more than the Bitcoin behind them".

## Substantive cuts

None. No sentence was removed and no number was deleted. Two connective fragments went: "The cash is finite:" (its meaning is carried by "under half a week of the funds' recent buying") and "the very next week" → "the next week".

## Glossary proposals (unsourced by me; the drafter appends with a URL)

Treasury yield · share premium / mNAV · breakout · the Fed (alias) · Strategic Bitcoin Reserve. Details and locations in `drafter-notes.md`.

## Residuals

- Soft findings I introduced: `FORECAST_LEDGER.resolved[0].lesson` average sentence 22.5 (two sentences, 15 + 30, at the 45-word cap). `body[0]` and `body[1]` averages moved 23.6 → 23.8 (one word each). `CURATED[0].detail` average 24.3 → 24.2.
- Soft findings left as found in editable fields: `CURATED[1].detail` 24.8 avg and `CURATED[2].detail` 24.5 avg (both at 147–149 of 150 with no cut available that is not a fact); `body[3]` 24.0 avg (at cap); `contrarianTake.body` 25.0 avg (at cap); `watchList[3].signal` 23.3 and `[5].signal` 24.8 (Tier 3, shape-compliant).
- "Treasury yield" remains unglossed in `crossCurrents[0].body` (no room at 147/150) and `contrarianTake.body`; "the Fed" remains the shorthand in fields after `marketContext` and `body[0]` name the Federal Reserve. Both go to the glossary proposals.
- Rule 18 duplication (`846,000` three times) and every finding in `headlines.js`, `thesis.js`, `strategy.js` and `adoption.js` are not mine.
- Routed to `drafter-notes.md`: locked-field jargon (`falsificationConditions[0]`, `[3]`, `watchList[4].event`), the $840M/$844M, 5.49%/5.5% and Halloween/October 30 inconsistencies, the unsourced "back in profit" claim in `whyItMatters`, and the house-dialect additions.

## Cold-read fix pass (same day)

Cold-read results from the coordinator: 15 of 17 cards passed; A1 and A6 failed "what would change the author's mind"; one phrase in A2 lost the reader. Three fields changed, all in `src/data/deep-analysis.js`, material from the same card only, no read-only field touched, no rebuild.

| field | before → after | words | longest |
|---|---|---|---|
| contrarianTake.body | "The test: a Friday close above $90,000 …" → "What would change our mind: a Friday close above $90,000 …"; to stay at cap, ", not noise" dropped from sentence 1 and "when long-term government bonds fell" → "when those bonds fell" (the 30-year bond is named in the same sentence) | 150 → 150 (cap 150) | 34 → 33 |
| plainSummary | "The open question is whether that buying lasts into October, when rates may rise again." → "The demand looks real; buying that stops in October, when rates may rise again, would prove us wrong." ("looks real" is the headline's own hedge; the observable is the funds' buying, already in the field). "biggest week of buying this year" → "biggest buying week this year" to hold the 45 ceiling | 43 → 45 (cap 45) | 20 → 19 |
| primaryAnalysis.body[2] | "some buying may be traders pairing fund shares against futures bets, which adds no lasting demand, and borrowed bets rebuilt within days" → "some buying may be traders who bought fund shares while betting against Bitcoin elsewhere, which cancels out and adds no lasting demand; and borrowed bets rebuilt within days" | 111 → 117 (cap 120; body total 589 → 595 of 650) | 25 → 31 |

Verify: first run **exit 2** — one hard finding I had introduced (`plainSummary` 46 words vs the 45 absolute ceiling); one-word trim; second run **exit 1** (structural 0 · hard/editable 0 · hard/locked 0 · soft 43). Invariants verified for 53 cards, **no rule-20 numeric drift**. Added to `drafter-notes.md` (now 14 lines): the locked `watchList[4].event` "non-operating-company screen" failed the cold read; readers inferred "supports the price" for M4 and M5 because `CURATED[2].plain` never says the buy was about 0.1% of holdings and `CURATED[3].plain` never says the bill buys no coins; A1's what-would-change line is the Editor's minimum from the summary's own sentence and the drafter should write the real one.
