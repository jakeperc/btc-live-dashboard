# Editor — last run report, 2026-10-24

Verify: `npm run check:plain -- --verify` gave **exit 1** (structural 0 · hard/editable 0 · hard/locked 0 · soft 36; the 21:04 baseline was soft 47). Invariants were verified for 65 cards against `.invariants-2026-10-24T21-04-42-398Z.json`, with **no rule-20 numeric drift**. There was one fix-and-re-run cycle. The first run (soft 37) showed one regression of mine: `CURATED[0].detail` came to 152/150 on the checker's tokeniser (en-dash ranges count differently from a whitespace split) after I split two sentences. I trimmed three tokens ("it", the joining "and" once Meta and the chip stocks became two sentences, and the second "its"), and the single permitted re-run is the result above. (The first run was invoked twice, once more with output discarded, only to capture its exit code; the files were identical both times.) Every soft finding the orchestrator flagged in editable fields has cleared: `contrarianTake.body`, `crossCurrents[1]` and `[2].body`, `body[2]`, `body[4]`, `watchList[0].signal`, `resolved[0].lesson`, the `CURATED[0..2].detail` averages and the `MARKET_THEME.narrative` average.

**Memory-directory audit:** `automations/refresh-deep-analysis/memory/` and `automations/refresh-market-news/last-run-artifacts.md` were **not read**: not listed, not grepped, not opened. Nothing under `src/` outside `src/data/` was read, and no script source was read. Files opened: `automations/refresh-plain-language/README.md`; `SCOPE.md` lines 45–150 (a `## ` heading grep touched nothing else); `reader-feedback.md`; `house-dialect.txt`; `last-check.md` (the baseline, then each verify's output); the previous `last-run-report.md` and `drafter-notes.md`; a directory listing of `automations/refresh-plain-language/`; `src/data/glossary.js`; `src/data/deep-analysis.js` (in full); `src/data/market-news.js` (in full); `src/data/forecast-ledger.js` (lines 1–120, a grep of every `lesson:` line, line 113, and `git diff`); `src/data/adoption.js` (lines 1–40, a grep of the `method`/`status` lines, and `git diff`); `src/data/headlines.js` and `src/data/fallbacks.js` (context only); and `git diff --stat` over `src/data/`. A final repo-wide `git status --short` printed modified file *names*, including paths under the memory directory and the artifacts file. No contents were shown or opened. From the invariants snapshot JSON I read only the key structure, and I extracted its copies of the three edited files to the session scratchpad to measure before and after. (`deep-analysis.js` itself carries `themeInteractions.adjustments[].reasoning`, written in ledger dialect. It is in the data file, not the memory directory. The checker does not register it and it is not on my editable list, so I left it alone.) No `$ARGUMENTS`: no force, no strict, no reader feedback. `adoption.js`, `headlines.js` and `fallbacks.js` are byte-identical: nothing in adoption's `method`/`status` failed a reader (the "851 BTC in October" total matches 334 + 250 + 267).

## Fields touched: 18 (13 in deep-analysis.js, 4 in market-news.js, 1 in forecast-ledger.js)

| field | words before → after | longest sentence before → after |
|---|---|---|
| plainSummary | 43 → 43 | 29 → 29 |
| marketContext | 98 → 99 (cap 100) | 31 → 32 |
| primaryAnalysis.body[1] | 111 → 113 | 24 → 26 |
| primaryAnalysis.body[2] | 121 → 120 (cap 120) | 29 → 26 |
| primaryAnalysis.body[3] | 112 → 116 | 24 → 24 |
| primaryAnalysis.body[4] | 121 → 119 | 23 → 23 |
| primaryAnalysis.body total | 582 → 585 (cap 650) | — |
| crossCurrents[0].body | 149 → 150 (cap 150) | 28 → 28 |
| crossCurrents[1].body | 158 → 149 | 33 → 28 |
| crossCurrents[2].body | 170 → 150 (cap 150) | 26 → 25 |
| watchList[0].plain | 32 → 33 | 21 → 21 |
| watchList[0].signal | 101 → 99 | 33 → 33 |
| contrarianTake.plain | 43 → 44 | 26 → 27 (opening sentence 10 → 11) |
| contrarianTake.body | 165 → 150 (cap 150) | 32 → 30 |
| MARKET_THEME.narrative | 90 → 88 | 26 → 25 (average 18.0 → 14.7) |
| CURATED[0].detail | 147 → 147 (checker: 149) | 33 → 29 (average 24.5 → 18.4) |
| CURATED[1].detail | 150 → 150 | 35 → 35 (average 25.0 → 18.8) |
| CURATED[2].detail | 148 → 149 | 31 → 30 (average 24.7 → 18.6) |
| FORECAST_LEDGER.resolved[0].lesson | 45 → 45 | 27 → 27 (average 22.5 → 15.0) |

(Counts are a whitespace split; the checker differs by a token or two on en-dash ranges.)

Untouched, byte-identical (words / longest sentence): headline 19 · primaryAnalysis.plain 41/21 · body[0] 117/42 · every crossCurrents title and plain (29, 30, 30) · watchList plains [1]–[5] (35, 29, 31, 32, 35) and signals [1]–[5] (92, 99, 100, 93, 96) · calibration.briefSummary 44/25 · MARKET_THEME whyItMatters 58/21, milestone 57/19, wouldChange 30 · CURATED plains (27, 29, 30, 29) and wouldChange (28, 28, 27, 28) · CURATED[3].detail 150/41 · FORECAST_LEDGER summary.plain 41, all six byCategory plains, every other lesson. Read-only fields (`falsificationConditions[]`, `watchList[].event`, `resolved[].event`, `themeTitle`, `CURATED[].title`, every number) are untouched; no glyph substitution was needed.

**Edit volume: 18 fields; about 195 tokens removed and 155 added (net −40).** About 25 tokens on each side are punctuation or capital-letter changes from eleven semicolon-to-full-stop splits. Prior runs: 2026-08-24 ~120 words / 9 fields; 09-13 88 / 8; 09-26 272 / 17; 10-07 ~60 / 12; 10-16 ~315 / 27 (two passes, cold-read driven). The number rose from Oct 7's low. Cause: the writers handed over five fields above cap (120–170 against caps of 120 and 150) and four at 22.5–25 words per sentence. Most of the volume is trimming to cap, which belongs in the writer prompts ("write to the cap"), not in a harder Editor.

## Probability bands

| field | p | band phrase used |
|---|---|---|
| plainSummary | 0.35 | "possible but less likely than not" (unchanged; "surviving our test" became "holding through October") |
| primaryAnalysis.plain | 0.35 | "possible but less likely than not" (unchanged) |
| body[2] | 0.35 | "possible but less likely than not" (unchanged) |
| body[3] "A pause is likely" | 0.75 | "likely" (unchanged) |
| marketContext: October rise / December rise | ~0.10 / ~0.73–0.75 market-implied | "unlikely" / "likely" (reworded from "while December stays likely", same bands) |
| CURATED[0].plain | ~0.10 / ~0.75 | "unlikely" / "likely" (unchanged) |
| watchList[0].plain | 0.75 | "likely" (unchanged; "the live meeting" became "the meeting to watch") |
| watchList[1].plain | 0.55 | "slightly more likely than not" (unchanged) |
| watchList[2].plain | 0.55 | "slightly more likely than not" (unchanged) |
| watchList[3].plain | 0.75 | "likely" (unchanged) |
| watchList[4].plain | 0.80 | "likely" (unchanged) |
| watchList[5].plain | 0.10 | "unlikely" (unchanged) |
| contrarianTake.plain | 0.20 | "possible but less likely than not" (unchanged; "it trades as protection" became "it could trade as protection") |

Hedges: none removed. Five were added where the prose was flatter than its probability: "could trade" (contrarianTake.plain, and .body in place of "Bitcoin trades with gold" under a 20% call), "may pass unnoticed" (crossCurrents[0], whose own plain line says "may not rescue it"), "could be sold" in place of "become supply" (crossCurrents[1]), and "currently pays" in place of "pays a fixed" (body[4], matching CURATED[2]'s own "currently pay").

## Three worst offenders

**1. `contrarianTake.body`: 165/150, an opaque opener, and a 20% call stated as fact.**
> Before: "The optimist's read is about the driver, not the Fed. Bitcoin is walking into oil at $117, household inflation expectations at 4.7%, a central bank that cannot cut and a bond market where the 10-year yield fell below 5% on fear. That is the setup in which gold ran to $5,600 in January. … Once they do, … Bitcoin trades with gold rather than with the Nasdaq."
> After: "The optimist points to the backdrop: oil at $117, households expecting 4.7% inflation, a central bank that cannot cut rates, and the government's 10-year borrowing rate below 5% on fear. Gold ran to $5,600 in January in a similar setup. … Once they do, … Bitcoin could trade with gold rather than with the Nasdaq." (Also "were closed out by force on Saturday" became "on Saturday … were force-closed". The test sentence and the "We put it at 20% because…" sentence are byte-identical.)

**2. `crossCurrents[1].body`: 158/150, with a private-dialect mechanism sentence.**
> Before: "…the funds netted $301 million, and Strategy, the company that holds more Bitcoin than any other, bought 267 coins. The buying that remains is funded by preferred shares (shares that promise a fixed yearly payout ahead of ordinary shareholders). Strategy spent $193 million buying back its 12% shares, nine times its coin spending: retiring 12% paper beats buying a non-yielding asset when its share price barely exceeds the value of its Bitcoin. … Those payouts are due in cash every month; … those coins become supply."
> After: "…the funds netted $301 million, and Strategy, the biggest corporate holder, bought 267 coins. The buying that remains is funded by shares that promise investors a yearly payout. Strategy spent $193 million buying back its 12% shares, nine times its coin spending. While its stock is worth barely more than its Bitcoin, buying back 12% shares beats buying a coin that pays nothing. … Those payouts are due monthly in cash. … those coins could be sold." (The condition "while its stock is worth barely more than its Bitcoin" is kept.)

**3. `crossCurrents[2].body`: 170/150, with an undefined "stablecoin" and an untranslatable "unstable correlation".**
> Before: "…finished the first stablecoin rulebook on October 21, … JPMorgan's fund arm put a range on Bitcoin's returns for the first time but calls its unstable correlation the obstacle. This week showed why: rules and products arrive faster than laws, and none of them stops Bitcoin trading like a technology stock on a bad day."
> After: "…finished the first rulebook for stablecoins, tokens fixed at one dollar, on October 21, … Rules and products arrive faster than laws, but none stops Bitcoin trading like a technology stock on a bad day."

Other rewrites:
- `plainSummary`: "surviving our test" became "holding through October" (an undefined in-house term in a Tier 1 line; the word count is unchanged).
- `marketContext`: "the 10-year Treasury yield" became "the government's 10-year borrowing rate" (the term was undefined on this card), and "a rate rise is unlikely while December stays likely" became "a rise is unlikely then but likely by December".
- `body[1]`: "under-water holders tend to sell bounces" became "such holders tend to sell when prices recover".
- `body[2]`: the semicolon became a full stop. The restating clause "The price risk is gone, the flow risk is a coin toss" was cut, and "came close to our $1 billion danger line" became "…, as borrowed bets were closed out, came close to $1 billion, a one-day level that would also fail the test" (a ledger leak and an undefined "forced selling").
- `body[3]`: "would revive December rate-rise talk, now at about three in four" became "would push the odds of a December rate rise, now about three in four, higher". "Revive" contradicted odds that already stood at 75%.
- `body[4]`: "nearly nine times as much" (no referent on the card) became "nearly nine times its coin spending", "a fixed 12%" became "currently pays 12%", and "keeping faith in 12% to 15% payouts; … tests that faith" became "trusting 12% to 15% payouts. … tests that trust".
- `crossCurrents[0].body`: "while bonds rally, investors are raising cash, not re-pricing interest rates" became "while investors buy government bonds, they are raising cash, not reacting to interest rates". The signpost "That changes what October 28 can do." was folded into "So a Federal Reserve pause on October 28 helps…", and the semicolon was split.
- `watchList[0].signal`: "We move up one notch" became "We raise it".
- `MARKET_THEME.narrative`: "Then" was removed (the card's own source dates the diplomat order October 21, before the October 22 rout), and the 28-word sentence was split.
- `CURATED[0..2].detail` and `resolved[0].lesson`: sentence splits at semicolons and joining "and"s, with no other word change except "they gave" in CURATED[0].

## Substantive cuts

1. `crossCurrents[2].body`: "JPMorgan's fund arm put a range on Bitcoin's returns for the first time but calls its unstable correlation the obstacle." plus the bridge "This week showed why:". "Unstable correlation" cannot be made plain inside the 150 cap. JPMorgan's forecast stays on the page in `CURATED[3]` (plain and detail). The sentence had no digits.
2. `primaryAnalysis.body[2]`: "The price risk is gone, the flow risk is a coin toss," which restates "The price part is settled" and "The flow part is on a knife edge". No number.
3. `crossCurrents[1].body`: the gloss "(shares that promise a fixed yearly payout ahead of ordinary shareholders)" and the term "preferred". The rewrite no longer needs the word, and "fixed" conflicted with STRC's "currently pay 12%".
4. `contrarianTake.body`: the opener "The optimist's read is about the driver, not the Fed." and "Bitcoin is walking into", replaced by "The optimist points to the backdrop:". The "not the Fed" contrast is gone.

**No number was deleted.** Rule 20 confirms it.

## Glossary proposals (unsourced by me; the drafter appends with a URL)

stablecoin · Treasury yield (carried over) · SEC · OCC · share premium (carried over). Details are in `drafter-notes.md`.

## Residuals

- In editable fields, only rule 18 duplication remains (`848517` ×3, `4045` ×5, anchored at body[4]). Removing either would mean cutting a sentence that carries a yardstick, so I left them.
- Not mine: twelve `HISTORICAL_HIGHLIGHTS` titles over 35, `DRAWDOWN_CAVEAT`, the thesis/strategy long-read findings, `falsificationConditions[2]` (Fog 15, locked) and `resolved[25].event` (locked).
- Routed to `drafter-notes.md`: the $828M versus $699M figure against the $1B line; Strategy's coins funded by ordinary rather than preferred shares; STRC's fixed versus current rate; the unsourced midterms-and-Iran line in `MARKET_THEME.milestone`; the diplomat-order date; "permitting bill" and "Nasdaq" undefined; CURATED[0..2].plain lacking an owner consequence with no room left; "The next three days" in body[3]; ledger idiom in watchList[1]–[3] signals.

## Cold-read: intended answers (Tier 1/2 cards)

**MARKET_THEME.** (1) Bitcoin rose to about $84,500 on October 21, then fell under $80,000 on October 24, as technology stocks had their worst day since June and oil passed $116 after attacks on Saudi oil sites and a U.S. diplomatic pull-out. (2) The selling came from war and stock-market fear, not Bitcoin news. Bitcoin is about 8% below its September high, October is on course to be its first losing month after three gains, and fund money came in early in the week and left late. (3) A week ending above $84,000 or two straight weeks of net fund buying would say the dip is over; a week ending under $79,000 would say it is not.

**CURATED[0] (macro).** (1) After a technology sell-off sent money into government bonds and the 10-year rate under 5%, traders cut the odds of a Fed rate rise on October 28 to one in ten. Oil near $117 keeps a December rise likely, at three in four. (2) The card's own text does not say. The intended answer: the immediate rate threat to an asset that pays no interest has eased, but oil-driven inflation keeps a December rise on the table. (Routed: the plain line has no room left for this.) (3) A surprise rise on October 28, or the 10-year rate back above 5.2% before December.

**CURATED[1] (regulation).** (1) The crypto rules bill is stuck until the Senate returns November 9, with a 4% betting-market chance of passing this year. Meanwhile the OCC finished stablecoin rules on October 21 and comments closed on the SEC's token-sale plan. (2) Rules for the businesses around Bitcoin are arriving faster through agencies, but agency rules are easier for the next administration to undo than a law. (3) A named White House crypto adviser plus a Senate vote scheduled for November, or the bill's sponsors conceding it waits for 2027.

**CURATED[2] (corporate).** (1) Strategy bought only 267 coins and spent nine times as much, $193 million, buying back its 12% shares. Rival Strive bought 4,045 coins with $630 million raised at a 15% payout. (2) The biggest corporate buyer is slowing, the buying that continues depends on high payouts investors must keep trusting, and MSCI may drop Strategy from its indexes on November 11. (3) Strategy missing from MSCI's final list on November 11, or a weekly filing showing coins sold to pay dividends.

**CURATED[3] (ETFs).** (1) Switzerland approved its first Bitcoin fund for ordinary savers, BlackRock filed a fund that limits losses to about 10% in exchange for capped gains, and JPMorgan's fund arm assumed a 10% yearly return for Bitcoin for the first time. (2) There are more regulated, more cautious ways into Bitcoin, and a major asset manager now gives it a return forecast, while still calling it speculative. (3) BBIT trading in Zurich in November or a second Swiss approval would strengthen this read; BlackRock withdrawing PBIT or the Swiss fund drawing little money would weaken it.

**DEEP_ANALYSIS primaryAnalysis.** (1) Bitcoin fell under $80,000 with technology stocks and war-driven oil, even though borrowing costs and rate-rise odds fell. (2) On bad days it trades like a risky stock, so a Fed pause alone may not help. September's rally holding through October is possible but less likely than not, and it hinges on whether fund money comes in during the week ending October 30. (3) A third week of net fund selling (the week ending October 30), any Strategy coin sale, or $1 billion of forced closings in a day or a 15% fall within seven days.

**crossCurrents[0].** (1) On October 22, rate-rise odds and the 10-year rate both fell, yet $636 million left the Bitcoin funds as the Nasdaq fell 2.6%, and gold fell too. (2) Investors were raising cash, not reacting to rates, so a Fed pause helps Bitcoin only if stocks steady. (3) Money returning to the funds in the week of November 2, after the meeting.

**crossCurrents[1].** (1) Both big buyers were weak in the same week: the funds netted $301 million, and Strategy bought 267 coins while spending nine times as much on buybacks. Strive bought 4,045 coins with 15% shares. (2) Corporate demand now rests on high payouts due in cash, and if investors lose faith, the 136,000 coins bought this way could be sold. (3) MSCI's November 11 decision.

**crossCurrents[2].** (1) With the CLARITY Act stuck until at least November 9, agencies (the OCC's stablecoin rules, the SEC, the CFTC) and Switzerland are building the rules and products instead. (2) Rules and products arrive faster than laws, but none of them stops Bitcoin falling like a technology stock on a bad day. (3) A second Senate vote before December 18, which is unlikely.

**contrarianTake.** (1) Today Bitcoin is being sold like a technology stock. (2) With oil at $117, households expecting 4.7% inflation and a central bank that cannot cut, Bitcoin could trade as protection, as gold did in January, once forced sellers run out. That is possible but less likely than not. (3) A week ending above $87,570 by December 31, with oil above $100 and technology stocks below their October 21 level.

## Second pass (cold-read revision, Step 4.5.4)

The coordinator's cold reader failed question 2 ("why does it matter to someone who owns Bitcoin") on CURATED[0]–[3] and plainSummary/marketContext, and question 3 ("what would change the author's mind") on crossCurrents[1] and [2]. It also flagged undefined terms and two apparent figure conflicts. Every fix below draws on material already on the card or the page. No fact, number or source was added, and read-only fields are byte-identical.

| field | words: pass 1 → pass 2 | what changed |
|---|---|---|
| plainSummary | 43 → 44 | "rally" became "rise". The two-clause sentence was split. Fund money is tied to the outcome: "It depends on Bitcoin funds, big buyers this year, drawing money the week the U.S. central bank meets." ("big buyers this year" is from crossCurrents[1]) |
| marketContext | 99 → 100 (cap 100) | "36% below its peak" became "36% below its all-time high", against MARKET_THEME's "8% below its September high" |
| body[1] | 113 → 114 | "the first in three" became "after two weeks of selling". This agrees with watchList[1] and body[2]: two of four weeks positive so far |
| body[2] | 120 → 119 | "$828 million of forced selling, as borrowed bets were closed out" became "$828 million of forced closings, on borrowed bets in both directions". contrarianTake's "$699 million … on a rising Bitcoin price" was already labelled and is unchanged |
| crossCurrents[1].body | 149 → 149 | Q3 added: "A reprieve would ease the strain; a coin sale would confirm it." (from CURATED[2].wouldChange). To fit: "behind this year's gains" became "This year's two big buyers", the payout sentence was tightened, and the Fidelity sentence was cut |
| crossCurrents[2].body | 150 → 150 | Q3 added: "A Senate vote set for November would change this read; the bill's sponsors conceding 2027 would confirm it." (from CURATED[1].wouldChange). To fit, the SEC/CFTC comment-window sentence was cut |
| watchList[0].plain | 33 → 30 | "After September's rate rise, a stock sell-off cut the odds of another next week to one in ten. So holding rates steady is likely; December is the meeting to watch." This explains the event's "second rise" and replaces the bare "pause". "pushed borrowing costs down" went (it is still in crossCurrents[0] and marketContext). The band "likely" for 0.75 is unchanged |
| CURATED[0].detail | 147 → 146 | Opens with the consequence: "Bitcoin pays no interest, so rate rises work against it. October's risk has faded; December's has not." The Meta/chip-stock sentences became "That day a stock sell-off sent money to the safety of government bonds." |
| CURATED[0].wouldChange | 28 → 27 | "would put rate pressure back at the center of this read" became "would make rates the main weight on Bitcoin's price again" |
| CURATED[1].detail | 150 → 147 | "investment contracts" became "shares"; "A betting market puts…" became "Bettors give passage this year a 4% chance"; "crypto council" became "The White House office that advises on crypto". GENIUS Act is glossed as "last year's stablecoin law". "comments closed" became "the window for public comments closed". It closes on the consequence: "…easier to undo, so until Congress acts, U.S. rules around Bitcoin can change with each administration." The NY attorney general / 140 comments sentence and "reserves, redemption and audits" were cut |
| CURATED[2].detail | 149 → 150 (cap 150) | The Strategy gloss was shortened. "filing" became "filing with regulators"; "7% ahead" became "it is about 7% in profit"; buybacks are "instead of buying coins"; "index company" became "the company whose stock lists many funds copy"; "provisional" became "draft". Q2 added: "If it is dropped, those funds must sell its shares, and selling new shares to buy Bitcoin gets harder." The $3 billion budget and cash sentences were cut |
| CURATED[2].wouldChange | 27 → 28 | "to pay dividends" became "to pay its shareholders" |
| CURATED[3].detail | 150 → 149 | Opens with: "Two new funds open Bitcoin to ordinary and cautious savers, but they move the price only if money comes in." "debt notes" became "IOUs from their issuers"; "The issuer, BIT Asset Management, expects its BBIT fund to list in Zurich" became "Its maker expects it to start trading in Zurich"; PBIT and IBIT were removed ("its existing Bitcoin fund"). The 41-word JPMorgan sentence was split. The FINMA waiver sentence (the "spread-your-bets rule" and its quote) was cut |
| CURATED[3].wouldChange | 28 → 29 | "BBIT" became "The Swiss fund"; "PBIT" became "its protected fund"; "the Swiss fund drawing little money" became "little money arriving" |

**Second-pass cuts:**
- CURATED[0]: Meta's 7% fall and the chip stocks' worst day since June.
- CURATED[1]: "About 140 came in, and New York's attorney general said the SEC is exceeding its powers.", plus "reserves, redemption and audits".
- CURATED[2]: "It also raised the budget for such repurchases to $3 billion.", plus "Its cash fell to $447 million from $641 million a week earlier."
- CURATED[3]: the FINMA waiver sentence with its quote, plus the names BIT Asset Management, BBIT, PBIT and IBIT.
- crossCurrents[1]: "Fidelity counts 136,000 coins bought this way since 2025." (still in body[4]).
- crossCurrents[2]: "Comments closed on the SEC's token-sale rules, and the CFTC takes comments on Bitcoin trading venues until mid-December."

Each went because a consequence, falsifier or definition needed the room under a 150 cap. Whole sentences carrying a number were cut whole; no number was altered. All are listed for the drafters in `drafter-notes.md`.

**Not fixed:**
- "Nasdaq": no room in body[0]'s 42-word sentence, crossCurrents[0] (150/150) or contrarianTake (150/150).
- "pause": still bare in body[3], crossCurrents[0] and watchList[2].
- "net" in MARKET_THEME.wouldChange: 30/30, no room.
- CURATED[0..2].plain: no owner consequence, at 27–30/30.
- watchList[1]–[5].plain: Q2 shortfalls, routed as a writer-prompt item.
- The $828M-versus-the-$1B-line comparison: the label is now honest, but the line counts rising-price bets only, so the drafter must decide which figure belongs there.

**Verify (second pass):** `npm run check:plain -- --verify` gave **exit 1**: structural 0 · hard/editable 0 · hard/locked 0 · soft 36. It verified 65 cards and found **no rule-20 numeric drift**, with no finding on any field touched. I trimmed crossCurrents[1].body and CURATED[3].detail to cap on my own count before running, so the single run needed no fix.

**Edit volume, second pass:** 14 fields (4 new: CURATED[0], [2] and [3].wouldChange and CURATED[3].detail), about 218 tokens out and 214 in. **Day total:** 22 distinct fields, about 413 tokens out and 369 in (net −44). Oct 16 was 27 fields and ~315 words over two passes; Oct 7 was 12 fields and ~60 words.

**Memory audit (second pass):** still not read: no file under `automations/refresh-deep-analysis/memory/` and not `automations/refresh-market-news/last-run-artifacts.md`. This pass opened only `src/data/deep-analysis.js` and `src/data/market-news.js` (by `sed`/`grep` of the edited lines), `last-check.md`, and the scratchpad measuring scripts.
