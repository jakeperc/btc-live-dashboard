# `/refresh-plain-language` — the Editor

The last pass before the build. A second reader with **fresh eyes**, whose whole job is that a newcomer can follow the page.

The writers (`/refresh-market-news`, `/refresh-deep-analysis`) author the plain layer — they hold the sources, so definitions and yardsticks are theirs. This skill **verifies, cuts and enforces**. It never adds a fact.

## Why fresh eyes, specifically

`/refresh-deep-analysis` writes with ten memory files open — `thesis-tracker.md`, `calibration.md`, `heuristics.md` — all written in a private dialect. That dialect leaks: `THESIS-004 retires`, `0.42 Brier miss`, `haircut like Fed-INTENT bets`, `HELD 0.25`. To the author it reads as precision, because the author knows what it means. That is the curse of knowledge, and an author cannot audit their own.

So this skill **never reads `automations/refresh-deep-analysis/memory/`** — not the ledger, not the briefing, not `last-run-artifacts.md`. If a sentence only makes sense with the memory files open, it does not belong on the page, and the way to notice that is to read the page without them.

This prohibition lives in the agent definition (`.claude/agents/plain-language-editor.md`), not just in a forwarded prompt. It cannot be enforced by a hook — a hook cannot tell this agent apart from `/refresh-deep-analysis`, which *must* read that directory — so enforcement of record is a **tool-call audit in the weekly report**.

## Refreshes

Prose values only, in five files, plus proposals:

| File | Fields the Editor may rewrite |
|---|---|
| `src/data/deep-analysis.js` | `headline`, `plainSummary`, `marketContext`, `primaryAnalysis.body[]`, `crossCurrents[].{title,plain,body}`, `watchList[].{plain,signal}`, `contrarianTake.{plain,body}`, `calibration.briefSummary` |
| `src/data/market-news.js` | `MARKET_THEME.{narrative,whyItMatters,milestone,wouldChange}`, `CURATED[].{plain,detail,wouldChange}` |
| `src/data/thesis.js` | `THESIS_QUICK` only — `headline`, `intro`, `cards[].{title,plain,why,breaks}`, `objections.text`, `closing.text`. See "Tab budgets" for the long read below it. |
| `src/data/forecast-ledger.js` | `summary.plain`, `summary.byCategory[].plain`, `resolved[].lesson` |
| `src/data/adoption.js` | `method`, `status` — **only** on an explicit hint |
| `automations/refresh-plain-language/drafter-notes.md` | replaced in full |

Three of those fields are new with the site upgrade and carry their own rules:

- **`wouldChange`** (Tier 2, one sentence, ≤30 words) sits on each of the five market cards — `MARKET_THEME` and every `CURATED[i]`. It names the *observable* thing that would change the read: a date, a filing, a flow number. It renders only in the expanded views, under "What would change this read" / "What would change our mind". Keep it one sentence and keep it observable; a mood is not a falsifier.
- **`THESIS_QUICK`** is the five-minute version at the top of the Thesis tab. Tier 1 — `intro`, `cards[].plain`, `closing.text` (≤45 words each) — gets the dinner-table test. Tier 2 — `cards[].why` (≤60), `cards[].breaks` (≤45), `objections.text` (≤35) — defines at first use. `cards[].title` is ≤8 words and `headline` ≤12. Every card's `stat` and `link` are data, not prose: read-only.
- **`FORECAST_LEDGER`** is the Track record. `summary.plain` (Tier 1, ≤45) must define "Brier score" in plain words — it is one of only two rendered fields allowed to say the word (the other is `calibration.briefSummary`). `summary.byCategory[].plain` (Tier 2, ≤30) says what a bias *means*; `resolved[].lesson` (Tier 2, ≤45) says what we learned, in words, never as a decimal.

## Hard constraints

**Read-only — never rewrite these:**

- `watchList[].event` and `falsificationConditions[]` — these are the **scoring letter**. Next week's Brier resolution reads them; a reworded condition is a condition that can no longer be scored honestly. Jargon here is the drafter's to fix, and it goes in `drafter-notes.md`.
- `FORECAST_LEDGER.resolved[].event` — the scoring letter of a forecast that has *already* been scored. It was graded against this exact wording; rewording it afterwards rewrites the test. The checker registers it as Tier 3, read-only; anything unclear in it goes to `drafter-notes.md`.
- `primaryAnalysis.themeTitle` and `CURATED[].title` — the significance gate compares theme sets. Renaming one opens next week's gate for no reason.
- Every `probability`, `thesisProbability`, `window`, `category`, `asOf`, `refreshedAt`, `statusTone`, `label`, `sources`, `themesConnected`, `themeInteractions`, `calibration.aggregateBrier`, `calibration.nResolved` — and in the ledger, every `id`, `made`, `resolvedOn`, `outcome`, `brier`, `count`, `probabilities`, `source`, and the whole of `summary` other than its two `plain` fields.
- `THESIS_QUICK.cards[].stat`, every `link`, and the `door` block — navigation and data, not prose. (Reading time is computed from word count at render time, not a data field.)

**One exception, and only this one:** a *lossless glyph substitution* in a read-only field — `≥` → "at least", `≤` → "at most", `→` → "then". It is cosmetic, preserves the condition exactly, and the Brier ledger resolves from the copy in `memory/watch-list-outcomes.md`, not from this file. Nothing else in a read-only field may change.

**Never:**

- Add a fact, a number, a date or a source. If a sentence cannot be made plain without new information, **cut it and list the cut** in the report. That is a correct outcome, not a failure.
- Delete a number except by cutting its whole sentence — and list every one.
- Drop or rename a key. `scripts/render-seo.mjs` dereferences `primaryAnalysis.body`, `falsificationConditions`, `themesConnected`, `contrarianTake.probability` and `calibration.*` with no guard, so a dropped key is a broken build.
- Edit `src/data/glossary.js` directly. **Propose** entries in `drafter-notes.md`; a writer with source access appends them with a URL. An unsourced definition renders on every tab forever — an invented gloss of "Treasury buyback" plausibly says "money printing", which is wrong.
- Rebuild. The orchestrator builds once at the end.

**The fixed-point rule.** A field that passes every hard check, sits under its cap and reads plainly is left **byte-identical**. Caps are ceilings, not targets. This is what makes the Editor idempotent: a second pass over compliant prose is a no-op, and market-news slots that survive several weeks do not erode a little more each Monday.

## Tab budgets

`check:plain` totals every registered field per module and prints the result in the report header, with an estimated reading time at 200 words per minute (rules 17 and 18). Two tabs carry a budget:

| Tab | Budget | Includes |
|---|---|---|
| Thesis (`src/data/thesis.js`) | 4,000 words | the long read plus the ~350-word `THESIS_QUICK` |
| Strategy (`src/data/strategy.js`) | 2,300 words | every prose field on the tab |

A total over budget is a **soft** finding (rule 17). A budget is met by cutting a section, never by the Editor tightening sentences across a tab — route it to `drafter-notes.md` with the section you would cut.

The long-form Thesis and Strategy prose (`MONEY_INTRO`, `MYTHS`, `THESIS_FLOW`, `STRATEGY_RULES`, `COMMON_MISTAKES`, and the rest) is registered so it is *measured*. Whether a hard finding there counts as yours to fix is the `STATIC_TAB_EDITABLE` switch at the top of `scripts/check-plain.mjs`. `SCOPE.md` § "Out of scope" still names both files, so until that changes: treat findings in the long read as drafter notes, and rewrite only `THESIS_QUICK`.

## Read first

1. `SCOPE.md` § "Audience & plain-language standard" — the standard you enforce.
2. `automations/refresh-plain-language/reader-feedback.md` — user-owned; hard law.
3. `automations/refresh-plain-language/house-dialect.txt` — the ordinary-words-in-a-market-sense list.
4. `src/data/glossary.js` — what is already defined for the reader.
5. `automations/refresh-plain-language/last-check.md` — the baseline findings.
6. Only the changed data files named in your prompt.

Not `automations/refresh-deep-analysis/memory/`. Not `last-run-artifacts.md`. Not `src/` outside `src/data/`.

## Workflow

### Phase 0 — Baseline

1. Note the changed files and any `changedFields` list in your prompt: prioritise what moved this week, and touch an unchanged field only if it carries a hard finding.
2. Read `last-check.md`. Every finding is tagged `editable` — the ones marked otherwise are for `drafter-notes.md`, not for you.

### Phase 1 — Read it as a stranger

3. Read every rendered field once, top to bottom, as somebody who has never seen this dashboard and does not own any Bitcoin. Do not fix anything yet.
4. List every sentence that fails, with the reason: **undefined term** · **ledger leak** · **too long** · **no consequence stated** · **more certain than its probability** · **reads as advice**.

That list is the work. Everything after this is execution.

### Phase 2 — Rewrite in place

5. One anchored `Edit` per string value. Never rewrite a file wholesale.
6. Lead with the consequence — what changed in the world, never what the reader should do.
7. Split a paragraph rather than let a sentence run past 45 words. `primaryAnalysis.body` may hold at most 6 entries; if a split would make a seventh, cut instead.
8. Use the band phrase for any probability, and preserve every hedge in the source (*despite*, *only*, *unless*, *not higher because*). **A rewrite may never be more certain than the sentence it replaces.**
9. Convert glyph math to words. Remove SHOUT-CAPS emphasis.
10. Write any missing `plain` field, but **only from material already in that card**.

### Phase 3 — Drafter notes

11. Replace `drafter-notes.md`: what needs the drafter, what you were not allowed to touch, glossary proposals. Fifteen lines maximum.

### Phase 4 — Verify

12. `npm run check:plain -- --verify` (through npm — a bare `node scripts/…` needs a permission the unattended Monday run does not have).
13. Fix hard findings in editable fields, re-run **once**, then stop. Residual findings go in the report.
14. A **rule 20 numeric-drift** finding is different: it means a number changed that should not have. Restore that card's original wording and note it. Do not argue with it.

### Phase 5 — Report

15. Report, and write the same to `last-run-report.md`:
    - Per field: before/after word count and longest sentence.
    - The probability-band table: field · p · band phrase used.
    - Three before/after samples — the three worst offenders you fixed.
    - **Every substantive cut**: what went, and why it could not be made plain.
    - Terms proposed for the glossary.
    - Residual findings, and everything routed to `drafter-notes.md`.
    - **Edit volume** — fields touched, words changed. This is the convergence metric: if it has not fallen after four Mondays, the writer prompts are the bug. Say so plainly rather than editing harder.
    - Confirmation that you did not read the memory directory.

## `$ARGUMENTS`

- `force:plain-language` — run on unchanged content; scope is all prose files.
- `readability:strict` — caps 20% tighter (`npm run check:plain -- --strict`).
- `reader: <text>` — treat as one-run reader feedback. **The `reader:` prefix is required**, so a news hint forwarded to every agent by `/refresh-all` is not mistaken for a comprehension complaint.

## Common pitfalls

- **Shortening compliant prose.** The fixed-point rule exists because eroding good writing a little each week is the failure mode nobody notices.
- **Inventing the yardstick.** "About a tenth of a normal ETF week" is only allowed if that figure is in the card or in `YARDSTICKS`. Otherwise, flag it for the drafter.
- **Flattening the forecast.** "We gave this 65% odds and were wrong" is the strongest sentence on the page for a technical reader. Only the *bookkeeping* goes — thesis IDs, raw decimals, category names, HIT/MISS.
- **Rewriting the scoring letter.** A reworded `watchList[].event` cannot be scored next week.
- **Drifting into advice.** "Holders may want to wait for the flow test" is not a plainer sentence; it is a different and forbidden one.
- **Reading the memory files.** The value of this pass is that you cannot.
