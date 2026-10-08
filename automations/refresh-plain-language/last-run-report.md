# Editor — last run report, 2026-10-07

Verify: `npm run check:plain -- --verify` → **exit 1** (structural 0 · hard/editable 0 · hard/locked 0 · soft 40; the 15:35 baseline was soft 46). Invariants verified for 60 cards against `.invariants-2026-10-07T15-35-14-237Z.json`; **no rule-20 numeric drift**. Two runs: the first (soft 41) showed one finding I had introduced — the checker tokenised `watchList[3].signal` at 101 words against its 100 cap after my swap of "miss this letter" for "not count as a yes"; a one-word trim ("would count as a no", which maps to the field's own "If no" branch) fixed it, and the single permitted re-run is the result above. The six soft findings the orchestrator flagged (`body[2]`, `body[3]`, `body[4]`, `contrarianTake.body`, `watchList[0].signal`, `watchList[4].signal`, average sentence 23–25) have all cleared.

**Memory-directory audit:** `automations/refresh-deep-analysis/memory/` and `automations/refresh-market-news/last-run-artifacts.md` were NOT read — not listed, not grepped, not opened. Nothing under `src/` outside `src/data/` was read. Files opened, in full: `automations/refresh-plain-language/README.md`, `SCOPE.md` lines 45–150 (the `## ` heading grep touched nothing else), `reader-feedback.md`, `house-dialect.txt`, `src/data/glossary.js`, `last-check.md`, the previous `drafter-notes.md` and `last-run-report.md`, `src/data/market-news.js`, `src/data/deep-analysis.js`, `src/data/forecast-ledger.js`, `src/data/adoption.js`, `src/data/headlines.js` (context), `src/data/fallbacks.js` (context). No script source was read this week. No `$ARGUMENTS`: no force, no strict, no reader feedback. `adoption.js` untouched (no hint); `headlines.js`, `fallbacks.js`, `forecast-ledger.js` byte-identical.

## Fields touched: 12 (1 in market-news.js, 11 in deep-analysis.js, 0 in forecast-ledger.js)

| field | words before → after | longest sentence before → after |
|---|---|---|
| CURATED[0].detail | 149 → 149 | 37 → 37 |
| primaryAnalysis.body[2] | 120 → 120 (cap 120) | 34 → 28 |
| primaryAnalysis.body[3] | 117 → 119 | 35 → 27 |
| primaryAnalysis.body[4] | 118 → 118 | 31 → 24 |
| primaryAnalysis.body total | 565 → 567 (cap 650) | — |
| crossCurrents[0].body | 148 → 149 | 34 → 34 |
| crossCurrents[1].body | 150 → 150 (cap 150) | 40 → 40 |
| watchList[0].signal | 96 → 96 | 36 → 36 |
| watchList[3].signal | 100 → 100 (cap 100) | 26 → 26 |
| watchList[4].signal | 100 → 100 (cap 100) | 45 → 29 |
| contrarianTake.plain | 37 → 38 | 23 → 24 |
| contrarianTake.body | 150 → 149 | 35 → 31 |
| calibration.briefSummary | 58 → 59 | 32 → 32 |

Untouched, byte-identical (words / longest sentence): MARKET_THEME narrative 90/34, whyItMatters 58/25, wouldChange 22, milestone 58/20 · CURATED[0] plain 25, wouldChange 28 · CURATED[1] plain 25, detail 149/36, wouldChange 24 · CURATED[2] plain 24, detail 144/32, wouldChange 27 · CURATED[3] plain 28/22, detail 148/36, wouldChange 30 · headline 19 · plainSummary 45/23 · marketContext 100/29 · primaryAnalysis.plain 40/19 · body[0] 104/34, body[1] 106/27 · crossCurrents titles and plains (30, 28, 29) · crossCurrents[2].body 150/25 · watchList plains 32, 28, 27, 26, 32, 30 · signals [1] 85/40, [2] 97/34, [5] 94/29 · FORECAST_LEDGER summary.plain 40, byCategory plains 27, 28, 25, 22, 23, every lesson.

**Edit volume: 12 fields; about 60 tokens removed and 62 added (net +4 words), of which 26 are punctuation- or capitalisation-only tokens from six sentence splits at semicolons and one colon.** Substantive words changed: roughly 35 out, 38 in. Prior runs: 2026-08-24 about 120 words / 9 fields; 2026-09-13 88 / 8; 2026-09-26 272 / 17. The number fell sharply from last week. Cause: the writers glossed Strategy, the ETFs, the Federal Reserve and the 30-year yield at first use in almost every card, so only one Tier 1 term ("tightening") reached this pass undefined. Two patterns remain and belong in the writer prompts: semicolon-joined 28–45-word sentences (six fields averaged 23–25 words per sentence; every one split with no word change), and ledger idiom inside `signal` fields ("miss this letter", "held", "capped").

## Probability bands

| field | p | band phrase used |
|---|---|---|
| plainSummary | 0.55 | "slightly more likely than not" (unchanged) |
| primaryAnalysis.plain | 0.55 | "slightly more likely than not" (unchanged) |
| primaryAnalysis.body[3], first sentence (Tier 1) | 0.55 | "slightly more likely than not" — rewritten from "We still lean toward …, but only just", which had no band phrase; "still" kept, "only just" carried by "slightly" |
| CURATED[0].plain (one-in-five October rise) | ~0.20 | "possible but less likely than not" (unchanged) |
| CURATED[0].detail "A rise by December remains likely" | 0.843 market-implied | "likely" (the writer's; one band below the number, never above — left) |
| watchList[0].plain | 0.70 | "likely" (unchanged) |
| watchList[1].plain | 0.55 | "slightly more likely than not" (unchanged) |
| watchList[2].plain | 0.75 | "likely" (unchanged) |
| watchList[3].plain | 0.65 | "likely" (unchanged) |
| watchList[4].plain | 0.55 | "slightly more likely than not" (unchanged) |
| watchList[5].plain | 0.20 | "possible but less likely than not" (unchanged) |
| contrarianTake.plain | 0.25 | "possible but less likely than not" (unchanged; sentence 1 reworded, sentence 2 byte-identical) |

Every hedge in the source survived: "still", "only just" (now "slightly"), "could", "reportedly", "partly", "remains the live middle path", "possible but less likely than not". One hedge was added, never removed: "is paused" became "looks paused" in `crossCurrents[1].body`, which had stated the 0.55 thesis flat.

## Three worst offenders

**1. `contrarianTake.body` — an undefined noun, a noun stack, a house-dialect variant and a 35-word sentence, all at the 150 cap.**
> Before: "A 30-year Treasury paying 5.7%, its most since 2002, with $40 trillion of debt to refinance and oil above $100, is a global reset of what safe money earns. On October 7 stocks, gold and Bitcoin fell together on one yield spike; gold has lost 5% in two weeks, so … the central bank's own path eased, and Strategy keeps buying."
> After: "A 30-year U.S. government bond paying 5.7%, its most since 2002, with $40 trillion of debt to refinance and oil above $100, resets what safe money earns worldwide. On October 7 stocks, gold and Bitcoin fell together as yields spiked. Gold has lost 5% in two weeks, so … the central bank's own rate-rise threat eased, and Strategy keeps buying."

**2. `crossCurrents[1].body` — a flat claim against a 0.55 thesis, and a number that read as the amount spent rather than the amount held.**
> Before: "…the two buyers, the stock-market funds and Strategy (…), bought together. Both are still buying, so the rally is paused, not over. … at or below it, the company uses cash, $833 million. … index funds would then have to sell its shares, pressing the gap."
> After: "…the stock-market funds and Strategy (…) bought together. Both are still buying, so the rally looks paused, not over. … at or below it, the company spends from its $833 million of cash. … index funds would then have to sell its shares, narrowing the gap." ("the two buyers," paid for the three-word gloss; "Both" and "bought together" carry it.)

**3. `contrarianTake.plain` and `CURATED[0].detail` — "tightening" / "tightened" as the load-bearing word of a Tier 1 line and a Tier 2 pivot.**
> Before: "the bond market is now doing the tightening the central bank stopped" / "Yet the bond market tightened anyway."
> After: "the bond market is now raising borrowing costs where the central bank stopped" / "Yet long-term borrowing costs rose anyway."

Other rewrites: `body[3]` opening sentence to the band phrase (above) and "all passed: the week" → "all passed. The week"; `body[2]` and `body[4]` semicolons → full stops (no word changed); `crossCurrents[0].body` "with the 30-year yield at 5.7%" → "with the 30-year government bond paying 5.7%" (the card's own title says "the 30-year bond"); `watchList[0].signal` the 27-word "Last time" clause split at its semicolon; `watchList[3].signal` "could also skip to a full proposal, which would miss this letter" → "could skip to a full proposal, which would count as a no"; `watchList[4].signal` the 45-word sentence split at "; but"; `calibration.briefSummary` "Our one miss was costly" → "Our one wrong call was costly" (the ledger row it describes renders as a "hit", so the two senses collided on one page).

## Substantive cuts

None. No sentence was removed and no number was deleted. Two connective fragments went: "the two buyers," in `crossCurrents[1].body` (meaning carried by "bought together" and "Both") and "also" in `watchList[3].signal`.

## Glossary proposals (unsourced by me; the drafter appends with a URL)

Treasury yield · share premium / "the gap" (the value of the Bitcoin behind the shares — now written out in six fields) · the Fed (alias) · Strategic Bitcoin Reserve. House-dialect proposals: tighten/tightening, path (bare), letter (ledger idiom), floor (bare). Details and locations in `drafter-notes.md`.

## Residuals

- Soft findings left as found in editable fields: `FORECAST_LEDGER.resolved[7].lesson` 22.5 average (two sentences at the 45 cap, mine from Sep 26); `resolved[22]`, `[26]`, `[30]` nominalisation findings on old lessons (not reopened — nothing in them fails a reader).
- Rule 18 duplication (`29,000` ×4, `84,000` ×3, `1,665` ×4) and every finding in `headlines.js`, `thesis.js`, `strategy.js` and `adoption.js` are not mine.
- "Treasury yield" still bare in `contrarianTake.body` ("the 30-year yield still above 5.6%"), `CURATED[0].wouldChange` and `watchList[1].signal` — the tab defines it in `marketContext`; the durable fix is the glossary entry. "the Fed" remains the shorthand after `marketContext` and `body[0]` name the Federal Reserve.
- Routed to `drafter-notes.md`: "ethics deal" with no stated dispute in `CURATED[1]`; "ejecting" with no object in `MARKET_THEME.milestone` and `CURATED[2].detail`; "Strategy" unglossed at Tier 1 in `crossCurrents[1].plain` (28/30, no room); `marketContext` "gold fell 5%" with no period; `watchList[0].signal` "written before the September minutes" going stale at 2 p.m.; locked-field dialect (`watchList[1].event` "net flows", `falsificationConditions[3]`).

## Cold-read: intended answers (Tier 1/2 cards)

**MARKET_THEME.** (1) Bitcoin's September rally stalled: the Bitcoin funds' weekly buying fell to a tenth of the week before, and on October 7 the price slipped under $84,000 as long-term U.S. government borrowing costs hit a 24-year high. (2) Big investors are still buying, just far less, and the drag is bond yields rather than Bitcoin news — higher safe interest pulls money away from an asset that pays none. (3) A week ending below $82,500, the low of the past two weeks, would say the rally has reversed rather than paused.

**CURATED[0] (macro).** (1) Weaker inflation and hiring cut the odds of an October Fed rate rise to about one in five, yet the 30-year Treasury yield reached 5.7%, its highest since 2002. (2) Bitcoin pays no interest, so a safe 5.7% a year competes with it even as the central bank backs off; a rise by December is still likely. (3) The 30-year yield back below 5.5%, where it sat on September 25, or September inflation on October 14 below August's 3.4%.

**CURATED[1] (regulation).** (1) The crypto rules bill is stuck until Congress returns November 9; meanwhile the SEC proposed custody rules and FinCEN withdrew two plans to track private Bitcoin transfers. (2) Rules are arriving by agency instead of by law — faster, but reversible — and two surveillance plans for personal wallets and coin mixers are gone. (3) An ethics deal between Senate Democrats and the White House, or a second Senate vote set for November.

**CURATED[2] (corporate).** (1) Strategy, the biggest corporate Bitcoin holder, reopened share sales to buy about 2,000 coins — 0.2% of its 848,000 — and estimates a $20.9 billion third-quarter paper gain. (2) The largest single buyer is still buying, funded by share sales whenever its shares trade above the value of its Bitcoin, and MSCI's October 16 ruling could shut that funding route. (3) A weekly filing with no new shares sold and coins still bought from cash, or any coins sold.

**CURATED[3] (sovereign).** (1) A House committee approved, 28 to 21, a bill writing the U.S. Strategic Bitcoin Reserve into law with a 20-year ban on selling the government's roughly 328,000 coins, but no new buying. (2) It would stop the government selling for 20 years yet adds no demand; a full House vote waits until November and is possible but less likely than not. (3) A full House vote scheduled for the November session, or the Senate Banking Committee taking up a matching bill.

**DEEP_ANALYSIS primaryAnalysis.** (1) Rate-rise fears eased after weak jobs and softer inflation, but Bitcoin stalled anyway: fund buying fell to a tenth and the 30-year government bond yield hit a 24-year high. (2) The ceiling on Bitcoin is now set by long-term bond yields, which no Fed meeting controls — gold, stocks and Bitcoin all fell together — and keeping September's gains through October is slightly more likely than not. (3) Two straight Fridays below $80,000 before October 31, net selling by the Bitcoin funds in at least three of the five weeks to October 30, Strategy selling any coins, or a $1 billion one-day liquidation or a 15% fall inside seven days.

## Cold-read fix pass (same day)

Coordinator result: a context-free reader answered every card; A, B, C and F matched the intended answers. Card D (`CURATED[2]`) merged the 1,665-coin $142.7 million purchase with the 334, missed the 0.2% scale, the share-premium route and the MSCI risk, and got no consequence from "eject it"; the reader named "spot" and "paper gain" as undefined; Card E (`CURATED[3]`) read the 20-year lock as price support. Six fields changed, no read-only field, no new fact or number, no rebuild.

| field | before → after | words | longest |
|---|---|---|---|
| MARKET_THEME.narrative | "The U.S. spot Bitcoin ETFs, funds that hold Bitcoin and trade on the stock market" → "The U.S. Bitcoin ETFs, funds that hold Bitcoin itself and trade on the stock market" (the gloss already was the meaning of "spot"; "itself" keeps it and drops the term, holding the 90 cap) | 90 → 90 (cap 90) | 23 → 23 |
| CURATED[2].plain | "…to buy 2,000 coins, 0.2% of its pile, and reports a $21 billion paper gain." → "…to buy 2,000 coins, only 0.2% of its pile. It reports a $21 billion paper gain, not yet cashed in." (scale emphasised; "paper gain" defined at first editable use — the title is read-only; split so the opening sentence is 18) | 24 → 29 (cap 30) | 24 → 18 |
| CURATED[2].detail | "That did not last. Its September 28 filing shows 1,665 Bitcoin bought for $142.7 million, paid entirely by selling new shares; its October 5 filing shows 334 more, mostly from share sales." → "Two filings since show 1,665 coins bought for $142.7 million on September 28, all from new share sales, then 334 more on October 5, mostly from share sales." (cost tied to the right purchase in one sentence); "switching its dividends to daily payment" → "paying its dividends daily"; "decides October 16 whether to eject it." → "decides October 16 whether to drop it; those funds would then have to sell its shares." (consequence follows from the card's own "whose lists many funds copy" and is stated verbatim in `watchList[4].plain`) | 144 → 147 (cap 150) | 32 → 29 |
| CURATED[3].plain | "into law, with a 20-year sales ban but no new buying." → "into law: a 20-year sales ban, no new buying, so no new demand." | 28 → 30 (cap 30) | 22 → 24 |
| primaryAnalysis.body[0] | same "spot" → "itself" swap as the narrative | 104 → 104 | 34 → 34 |
| primaryAnalysis.body[4] | "It booked a $20.9 billion paper gain for the quarter after losing $22.8 billion in the first half." → "Its $20.9 billion paper gain for the quarter, not yet cashed in, follows a $22.8 billion first-half loss." ("paper gain" defined at its first use on the Analysis tab) | 118 → 118 (cap 120) | 24 → 24 |

Verify: `npm run check:plain -- --verify` → **exit 1** (structural 0 · hard/editable 0 · hard/locked 0 · soft 40 — unchanged; no finding on any field above). Invariants verified for 60 cards, **no rule-20 numeric drift**. Cuts: "That did not last." (connective, no fact) and the word "spot" twice (meaning carried by "itself"); no number deleted. Edit volume this pass: 6 fields, about 50 tokens out and 58 in, net +10 words; combined day: 17 distinct fields, net +14 words.

Still failing, routed to `drafter-notes.md`: the share-premium funding route is absent from `CURATED[2]` (it lives in `body[4]`; borrowing it needs a cut at 147/150); "spot" in the read-only `watchList[1].event`, `falsificationConditions[1]` and source labels; "paper gain" in the read-only `CURATED[2].title` and `HISTORICAL_HIGHLIGHTS[1]`; `CURATED[3].detail` (148/150) states "buys no more coins" without the "no demand" consequence.
