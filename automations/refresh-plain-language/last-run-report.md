# Editor — last run report, 2026-09-13

Verify: `npm run check:plain -- --verify` → exit 1 (structural 0 · hard/editable 0 · hard/locked 0 · soft 16, identical to the 06:35 baseline). Invariants verified for 18 cards against `.invariants-2026-09-13T06-35-53-613Z.json`; no rule-20 numeric drift. One run, no re-run needed.

**Memory-directory audit:** `automations/refresh-deep-analysis/memory/` and `automations/refresh-market-news/last-run-artifacts.md` were NOT read. Nothing under `src/` outside `src/data/` was read. Files opened: the README, `SCOPE.md` lines 54–148, `reader-feedback.md`, `house-dialect.txt`, `src/data/glossary.js`, `last-check.md`, the previous `drafter-notes.md` and `last-run-report.md`, the six changed data files, `package.json` (script name only), `scripts/check-plain.mjs` lines 95–135 and 227–262 (the word/sentence regexes and the CAPS table, because four fields sit at or within two words of cap), and the invariants snapshot (its structure and pre-edit file copies, for the byte-level diff below).

No `$ARGUMENTS`: no force, no strict, no reader feedback. `adoption.js` untouched (no hint). `fallbacks.js`, `glossary.js`, `headlines.js` context only.

## Fields touched: 8, all in `src/data/deep-analysis.js`

`src/data/market-news.js` is byte-identical to the snapshot copy (verified with `diff`). In `deep-analysis.js` exactly eight lines differ from the snapshot — lines 22, 25, 39, 43, 45, 51, 90, 108 — one per edited string value.

| field | words before → after | longest sentence before → after |
|---|---|---|
| primaryAnalysis.body[2] | 106 → 107 | 19 → 19 |
| primaryAnalysis.body[5] | 116 → 116 | 28 → 28 |
| primaryAnalysis.body total | 648 → 649 (cap 650) | — |
| crossCurrents[0].body | 150 → 150 (at cap) | 31 → 31 |
| crossCurrents[1].title | 15 → 15 (at cap) | — |
| crossCurrents[1].body | 149 → 149 | 30 → 30 |
| crossCurrents[2].body | 145 → 147 | 43 → 40 |
| watchList[4].plain | 33 → 34 | 17 → 17 |
| contrarianTake.body | 150 → 150 (at cap) | 35 → 35 |

Untouched, byte-identical (words / longest sentence, checker tokeniser): headline 17/17 · plainSummary 45/23 · marketContext 100/29 · primaryAnalysis.plain 45/24 · body[0] 105/36 · body[1] 96/22 · body[3] 109/24 · body[4] 116/30 · crossCurrents[0].title 14 · [0].plain 29/18 · [1].plain 29/15 · [2].title 13 · [2].plain 30/15 · watchList plains 32/18, 35/23, 34/23, 35/20, 32/22 · signals 91/22, 86/27, 100/39, 99/29, 100/41, 100/30 · contrarianTake.plain 45/21 · calibration.briefSummary 57/37 · MARKET_THEME narrative 86/26, whyItMatters 60/24, milestone 59/22 · CURATED plains 25, 24, 24, 25 · CURATED details 150/31, 150/29, 150/27, 149/38.

**Edit volume: 8 fields, 88 words changed (42 removed, 46 added, net +4).** Prior run 2026-08-24: 9 fields, ~120 words. Third measured run; the number is falling.

## Probability bands

| field | p | band phrase used |
|---|---|---|
| primaryAnalysis.plain | 0.55 | "slightly more likely than not" (unchanged) |
| primaryAnalysis.body[5], first sentence | 0.55 | "slightly more likely than not" — was "at slightly better than even odds" |
| watchList[0].plain | 0.40 | "close to a coin flip, leaning no" |
| watchList[1].plain | 0.45 | "close to a coin flip, leaning no" |
| watchList[2].plain | 0.15 | "unlikely" |
| watchList[3].plain | 0.40 | "close to a coin flip, leaning no" |
| watchList[4].plain | 0.55 | "slightly more likely than not" |
| watchList[5].plain | 0.65 | "likely" |
| contrarianTake.plain / .body | 0.30 | "possible but less likely than not" |
| MARKET_THEME.whyItMatters | market-implied 0.85 (not an author forecast) | "very likely" |
| plainSummary | same market-implied 0.85 | "likely" — understates, never overstates; field is at its 45-word cap, left alone |

Every hedge in the source survives: "largely" (twice), "roughly", "on this pattern", "only", "why not higher / why not lower", "likely within two weeks".

## Three worst offenders, before → after

1. `crossCurrents[1].body` — three undefined terms in three consecutive sentences.
   Before: "In August we named the bear's nightmare: … It is now the base case, and it arrives largely priced — an 85% chance … Priced events still carry two unpriced pieces."
   After: "In August we named the worst case: … It is now the expected outcome, and markets have largely adjusted — an 85% chance … Even so, two pieces can still surprise."
2. `crossCurrents[2].body` — opened on a term the card defines four sentences later, then a 43-word sentence with a nested definition.
   Before: "Security and the institutional wrapper crossed for the second time this summer. … about $320 million; most were returned."
   After: "Security failures and the regulated Bitcoin funds crossed for the second time this summer. … about $320 million. Most were returned." (the gloss is the card's own, from its fifth sentence)
3. `contrarianTake.body` — "non-macro catalyst" and "bear" undefined, in a field at its 150-word cap.
   Before: "…not any flight to safety, are setting prices. … Tuesday's failed vote removes the only non-macro catalyst. The bear's test: …"
   After: "…not fear, are setting prices. … Tuesday's failed vote leaves only the economy to move the price. The skeptic's test: …" ("rates, not fear" is the equivalence body[5] already uses; the paragraph opens "The skeptic's read", so "skeptic's test" closes in the same voice)

Also: body[5] band phrase (table above); `watchList[4].plain` "Adoption is slightly more likely than not" → "Dropping them is …" (on a site with an Adoption tab); bare trader-speak "priced" → "priced in" in body[2], body[5], crossCurrents[0].body and crossCurrents[1].title (the title stays 15/15 by dropping a redundant "both"); "Governor Waller" → "Fed Governor Waller" at first use in body[2] (a newcomer reads a state governor); "sets the direction of money" → "sets where money goes".

## Substantive cuts

None. No fact, number, date or source was added or removed; every figure in the eight edited fields is unchanged and the invariant check confirms it. Phrase substitutions only: "flight to safety" → "fear"; "the bear's" → "the worst case" / "the skeptic's"; "institutional wrapper" → "regulated Bitcoin funds"; "non-macro catalyst" → "only the economy to move the price"; "base case" → "expected outcome".

## Deliberately left alone (fixed-point rule)

`plainSummary` "likely raises" (see band table); `body[4]` opens "Tuesday's Senate vote…" without naming the bill — the plainSummary directly above names it, and body total is 649/650; `body[0]` "kill switch" (explained in-paragraph); "step-up" and "the price defended $76,000" (readable, and the falsifier text uses "step-up"); "the hike is priced" in the contrarian body (its opening line establishes "priced in"; field at cap); `calibration.briefSummary` 37-word sentence (Tier 3, 57/60); all of market-news.js.

## Glossary proposals (drafter must source)

- **priced in** — headline plus six body sentences, never defined.
- **L-BTC** — flagged as an unknown acronym ×4; glossed only inside `CURATED[3].detail`.

House-dialect proposals (user-owned file, I cannot edit it): priced, priced in, unpriced, base case, bear, bear case, catalyst, macro, wrapper.

## Residual findings and what went to drafter-notes.md

Soft 16, all pre-existing: single-sentence `CURATED[0-3].plain` at 24–25 words average (one clear sentence each, under cap — left); `falsificationConditions[0-4]` 24–33 words per sentence and `watchList[0-2].event` 23–24 words (locked → drafter notes, with a suggestion that [3] become a colon-separated list); `COUNTRY_HOLDINGS[9].status` "preferred" (adoption.js, no hint) and `SIX_MONTH_HIGHLIGHTS[1].title` "basis" (headlines.js, not mine); "4,000" ×8 and "4,603" ×3 duplication (removing deletes numbers). Acronyms IBIT (BlackRock's fund, named in-sentence), APAC, USBTC, ASIC, ARMA, MW live in adoption.js/headlines.js. Drafter notes also flag a framing clash for the writers: `CURATED[0].plain` says the Senate votes "on whether to debate" the bill while `CURATED[0].detail` and `body[4]` call cloture "the step that ends debate" — a fact question, not mine to settle.

## Intended cold-read answers (from Tier 1 and Tier 2 text only)

**MARKET_THEME** — (1) Bitcoin rose about 25% in August as money poured into the Bitcoin stock-market funds; then the Fed chair said inflation is too high, wholesale prices and oil jumped, traders now put roughly 85% odds on a first rate rise since 2023 on September 16, and Bitcoin slipped to about $77,000. (2) Higher rates make cash and bonds pay more, so Bitcoin, which pays nothing, has to compete harder for money; the rise is very likely and largely prepared for, but a warning of more rises could push the price lower and leaving rates alone could lift it. (3) The theme makes no forecast of its own; its checkpoints are Wednesday's decision, the officials' new rate forecasts and press conference, whether Bitcoin holds the $76,000 area, and whether money stops leaving the funds.

**CURATED[0] CLARITY** — (1) The Senate votes September 15 on the crypto-rules bill; it needs 60 votes, Republicans have 53, Democrats want a ban on the president's family profiting from crypto, and the bill's own sponsors expect to lose. (2) The bill would fix which referee governs Bitcoin (the CFTC, which oversees gold and oil markets); if it dies, the CFTC writes its own rules, which the next administration can undo. (3) The card's own hinge is the White House answering the July ethics compromise; otherwise not stated in Tier 1/2.

**CURATED[1] ETF flows** — (1) Investors put $3.5 billion into the Bitcoin funds in August, a 2026 record, then pulled about $463 million out over four days on rate-rise fears. (2) Fund buying is the main new demand (August's inflow was roughly a quarter of a year's new coins), and last week's withdrawal is smaller than one day's buying on September 3. (3) Whether withdrawals continue past the September 16 decision or buyers return.

**CURATED[2] Strategy** — (1) The biggest corporate holder bought 4,603 Bitcoin in late August after three summer sales, paid with new share sales, then bought nothing the next week while doubling its share-repurchase budget, and is fighting MSCI's plan to drop it from stock indexes. (2) Strategy holds about 4% of all Bitcoin that will ever exist, so its buying or selling moves demand; an index eviction would force funds to sell its shares. (3) Not stated in Tier 1/2; MSCI's October 16 decision is the dated checkpoint.

**CURATED[3] Liquid** — (1) A software bug let attackers pull 4,000 Bitcoin (about $320 million) out of Liquid, a side network run by Blockstream; most was returned the next day and withdrawals stay frozen. (2) Bitcoin's own network was untouched and coins in ordinary wallets were never at risk; every extra layer asks for extra trust. (3) Not stated in Tier 1/2 (the open items are Blockstream's one-for-one backing promise and the frozen withdrawals).

**plainSummary / marketContext** — (1) The Fed likely raises rates this week for the first time since 2023 and the Senate votes on the crypto bill; Bitcoin rose about a quarter in August and has slipped since, sitting near $77,000, about 39% below its October 2025 peak, with bond yields near three-year highs, oil above $100 and gold falling. (2) Both events are expected and what the central bank signals next matters more; when rates rise faster than inflation even gold sells off, so Bitcoin is trading on rates, not Bitcoin news. (3) Not stated in Tier 1/2 here; it lives in primaryAnalysis.plain and body[5].

**primaryAnalysis.plain + body[]** — (1) The author retired a summer theory that ended right but tripped its own kill switch (August's rally included $2.7 billion of forced buying); the new theory, slightly more likely than not, is that August's step-up survives this week's rate rise because markets already expect it; Strategy is buying again, fund money follows every shift in rate expectations within a day, and Tuesday's Senate vote is expected to fail but matters less because the CFTC will write rules anyway. (2) If the theory holds, August's price level keeps its support; if the Fed signals more rises or money leaves the funds for weeks, the price could give back August's gains; Strategy's pattern (buys when its shares fetch enough, sells when they do not and dividends are due) tells a holder when the biggest buyer is present. (3) Stated in body[5]: a week ending under $70,000, two weeks of withdrawals after the decision, a Strategy sale, or a bad week on both Washington votes; plus, from plain, signals of more rises to come.

**crossCurrents[0]** — (1) Fund money now moves in or out within a day of every change in rate expectations — three reversals in twelve days. (2) The decision itself is priced in, so what the funds react to Wednesday is the officials' rate projections: a "last one" message brings money back within days, "more work to do" does the reverse. (3) Not stated in Tier 1/2.

**crossCurrents[1]** — (1) A rate rise Wednesday and a failed Senate crypto vote Tuesday, August's worst case, are now the expected outcome and markets have largely adjusted. (2) Two surprises remain — whether the Fed shows this rise as the last of 2026 or the first of more, and what a Senate failure triggers (CFTC rules a future administration can undo); for Bitcoin the Fed's message is the bigger one. (3) Not stated in Tier 1/2.

**crossCurrents[2]** — (1) Two summer security failures, a Coldcard hardware-wallet flaw (about $116 million) and the Liquid bug (4,000 coins, most returned), both in layers built beside Bitcoin. (2) Bitcoin's own network and the regulated funds (coins with a licensed custodian on the main network) were untouched both times; cautious money is nudged toward the wrapper with no incident, though that has not shown in the fund numbers yet. (3) Not stated in Tier 1/2 (the implied test is whether that preference ever shows up in fund flows).

**watchList[0].plain** — (1) The rise is expected; the question is whether officials signal it is the only one this year. (2) It decides where money goes next. (3) Close to a coin flip, leaning no; the if-yes/if-no consequences are Tier 3 only.
**watchList[1].plain** — (1) Money has left the funds four days on rate fears. (2) If it comes back after the decision, the August gains have support. (3) Close to a coin flip, leaning no; the two post-decision weeks resolve it.
**watchList[2].plain** — (1) The crypto-rules bill needs 60 senators Tuesday and its sponsors expect to fall short. (2) Failure leaves Bitcoin's rules to regulators and courts. (3) Success is unlikely; 60 votes would be the surprise.
**watchList[3].plain** — (1) Strategy bought in late August after three sales, then paused. (2) Whether the biggest corporate holder is buying again (demand — implied, not spelled out). (3) Another purchase in the next four filings, close to a coin flip leaning no.
**watchList[4].plain** — (1) MSCI decides October 16 whether to drop Bitcoin-holding companies like Strategy from its indexes. (2) Dropping them would force index funds to sell those shares. (3) Slightly more likely than not; MSCI declining would be the surprise.
**watchList[5].plain** — (1) Liquid lost 4,000 coins to a bug; most came back. (2) Bitcoin itself was untouched. (3) Full repair by mid-October is likely; a longer freeze would falsify it.
**contrarianTake.plain** — (1) The first rate rise in three years lands with oil above $100 and money already leaving the funds. (2) An August rally built partly on forced buying may not carry that; a slide back toward $70,000 is possible but less likely than not. (3) The skeptic's test, from the Tier 2 body: a week closing below $70,000 by October 31.


## Addendum — cold-read bounce-back, 2026-09-13

Fields touched: 2 — `headline` (17 → 20 words, at cap: "now" dropped to fit the gloss "priced in (already reflected in prices)" at the term's first rendered use) and `crossCurrents[2].body` (147 → 149 words, longest sentence 40: the falsifier made explicit from the card's own sentence — "…which the Fed has dominated; if it never does, we are wrong." — paid for by trimming the ornament "The summer's lesson is old:", which survives verbatim in `CURATED[3].detail`). Words changed: 23 (9 removed, 14 added): headline (−2/+5); crossCurrents[2].body (−7/+9). Run total now 9 distinct fields, 111 words changed.

Not touched, by instruction: CURATED[0–3] and watchList[3] have no falsifier in Tier 1/2 because market-news cards carry no forecast and watch-row if-yes/if-no is Tier 3; the cold-read outcome and the guessed-phrase list went to `drafter-notes.md` (13 lines).

Verify: `npm run check:plain -- --verify` → exit 1 (structural 0 · hard/editable 0 · hard/locked 0 · soft 16, unchanged); invariants verified for 18 cards against `.invariants-2026-09-13T06-35-53-613Z.json`, no numeric drift. No hard finding, so no second fix and no re-run. No rebuild.

Memory-directory audit, unchanged: `automations/refresh-deep-analysis/memory/` and `automations/refresh-market-news/last-run-artifacts.md` were still NOT read; nothing under `src/` outside `src/data/` was read.
