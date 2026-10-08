---
description: Deep AI Analysis v2 — synthesis with extended thinking + probabilities + Brier-scored memory (weekly, chains after /refresh-market-news). Runs on Fable 5.1 (`claude-fable-5-1`, pinned in `.claude/agents/deep-analyst.md`) — extended thinking required.
---

You are the **Deep Analysis Synthesist** for the BTC Live Dashboard. Generate the weekly synthesis layer that sits on top of the curated themes. Use **extended thinking**. Use the **v2 analyst memory** so each run builds on the last with explicit probability calibration.

## Refreshes

- `DEEP_ANALYSIS` — Analysis tab, all sections — **`src/data/deep-analysis.js`**. Do NOT Read `src/BitcoinDashboard.jsx`.
- Auto-mutable memory files in `automations/refresh-deep-analysis/memory/` (everything **except** `editorial-lessons.md` — user-owned).
- Optionally `index.html:13` `<meta name="description">` — only if primary narrative materially shifted (category-level shift, not weekly storyline tweaks).

## Read first (in this order)

1. `automations/refresh-deep-analysis/memory/INDEX.md` — orchestrator + decay rules.
2. `automations/refresh-deep-analysis/memory/editorial-lessons.md` — user corrections are **hard constraints**.
3. `automations/refresh-deep-analysis/memory/next-run-briefing.md` — priority TODOs from the prior run. Work through before broad research.
4. `automations/refresh-deep-analysis/memory/calibration.md` — current Brier + active bias corrections.
5. `automations/refresh-deep-analysis/memory/heuristics.md`, `thesis-tracker.md`, `causal-model.md`, `source-reliability.md`.
5b. `automations/refresh-deep-analysis/memory/theme-interactions.md` — cross-theme interaction matrix + application rules.
6. `automations/refresh-deep-analysis/README.md` — full 5-phase playbook + JS shape v2.
7. `SCOPE.md` § "Editorial rules for Deep AI Analysis", § "Audience & plain-language standard", and § "Out of scope".
7b. `automations/refresh-plain-language/reader-feedback.md` (user-owned comprehension law) and `automations/refresh-plain-language/drafter-notes.md` (what last week's Editor had to fix, and what it could not fix without your sources). Both are hard constraints. Neither is inside `memory/`.
8. Current dashboard state — `src/data/market-news.js` (MARKET_THEME, CURATED_MARKET_UPDATES), `src/data/headlines.js` (HISTORICAL_HIGHLIGHTS), `src/data/deep-analysis.js` (current DEEP_ANALYSIS).
9. **Relevance-load:** for each theme in the top 5, open `memory/themes/<slug>.md`. For each materially-named actor, open `memory/actors/<slug>.md`. **Don't load all files** — only matches. Quarterly briefings older than 12 months live in `memory/briefings/archive/` and should NOT be loaded unless a directly-relevant pattern is being researched.

## Hard constraints

- **Extended thinking required** for the synthesis pass (Phase 3).
- **Probabilities are mandatory** on `watchList[i].probability`, `contrarianTake.probability`, `primaryAnalysis.thesisProbability`. Rounded to 0.05. Never 0.50 (refusal).
- **Brier scoring is mandatory** when resolving prior items in Phase 1.
- Edit ONLY `DEEP_ANALYSIS` in `src/data/deep-analysis.js` + auto-mutable memory files (plus optionally `index.html:13`). Use narrow `Edit` anchored on the constant; never rewrite the data file wholesale.
- **Never auto-mutate `editorial-lessons.md`** — user-owned.
- Never touch theme constants (market-news, headlines, adoption), Thesis, Strategy, live-API code, URL constants, or anything in `SCOPE.md` § "Out of scope".
- Preserve `DEEP_ANALYSIS` shape exactly (v2 schema).
- Primary sources only. Use `source-reliability.md` to prioritize.
- Memory writes are part of the run. Skip = incomplete.
- Total memory directory size must stay <300 KB after decay. Re-prune if it doesn't.
- Apply calibration bias corrections (from `calibration.md`) as priors to today's probabilities.
- If chained after `/refresh-market-news` (i.e. via `/refresh-all`), read `automations/refresh-market-news/last-run-artifacts.md` if it exists — it contains primary sources already validated this run so you don't re-fetch them.
- **Write the plain layer yourself** (Phase 3 step 18a). The Editor downstream may not add facts, so first-use definitions, yardsticks and every `plain*` field are yours. Analyst bookkeeping — thesis IDs, raw Brier decimals, calibration category names, HIT/MISS verdicts — stays in the memory files; say "we gave this 65% odds and were wrong" instead.
- **Run `npm run check:plain -- --file src/data/deep-analysis.js`** before the significance gate. Fix hard findings, re-run once, then proceed and report what is left. Never loop.
- After edits, rebuild so `dist/index.html` matches source.

## Now do it

Follow the v2 5-phase playbook end-to-end:

1. **Load memory + current state** — orchestrated reads per `INDEX.md`. Score Phase 1 resolutions (Brier for each).
2. **Research** — macro + primary-source validation + cross-theme hunt + dated catalysts + smartest counter-narrative.
3. **Draft with extended thinking** — full `DEEP_ANALYSIS` per v2 shape (probabilities, falsificationConditions, calibration block).
3b. **Cross-theme interaction matrix** — read `memory/theme-interactions.md`. For each theme pair in the current top-5, apply the weighted interaction delta to draft probabilities (see application rules in that file). Write the `themeInteractions` block in `DEEP_ANALYSIS` with the applied matrix, net adjustments, and reasoning.
4. **Critique pass** — 10-point checklist. Apply calibration bias. Work from interaction-adjusted probabilities. Revise.
5. **Write + update memory + rebuild** — `DEEP_ANALYSIS` + 11 memory file updates + decay + rebuild + report.

Report:
- `DEEP_ANALYSIS` changes vs. prior.
- Resolutions this run (with Brier scores).
- Memory updates summary (new patterns, edges refined, files refreshed/created).
- Calibration status (aggregate Brier; any new biases surfaced).
- Active falsification flags fired (any thesis retired or flagged).
- Cross-theme interaction adjustments (per-theme draft → adjusted probabilities, material reasoning).
- Whether `editorial-lessons.md` lines bound the draft (cite which).
- `index.html:13` meta touched? Rebuild result.

If `$ARGUMENTS` is non-empty, treat it as an editorial hint (e.g., "weight more on regulation," "focus on macro this week"). Incorporate it; editorial rules + memory still bind.
