# automations/

Per-command playbooks for slash commands defined in `.claude/commands/`. Refresh the dashboard's static data while respecting the editorial rules in `SCOPE.md`.

## Architecture

Each automation is split in two:

- `.claude/commands/<name>.md` — the **slash command shim**. Short. Restates hard constraints, defers to the playbook.
- `automations/<name>/README.md` — the **playbook**. Workflow, JS shape spec, source priority, pitfalls.

Editorial rules that span automations live in `SCOPE.md` (single source of truth). Playbooks reference it rather than duplicating it.

## Current roster

| Command | Refreshes | Cadence |
|---|---|---|
| `/refresh-market-news` | `MARKET_THEME`, `CURATED_MARKET_UPDATES`, `HISTORICAL_HIGHLIGHTS`, `FALLBACK_NEWS` | weekly |
| `/refresh-deep-analysis` | `DEEP_ANALYSIS` (v2: probabilities + Brier calibration) + analyst memory at `automations/refresh-deep-analysis/memory/` | weekly (chains after `/refresh-market-news`) |
| `/refresh-plain-language` | Event-gated (Step 4.5) | Prose values in `deep-analysis.js`, `market-news.js`, `adoption.js` + `drafter-notes.md` | The Editor: fresh-eyes plain-language pass. Never reads the analyst memory. |
| `/consolidate-deep-analysis` | Distills `memory/heuristics.md`, re-bins `memory/calibration.md`, consolidates `memory/causal-model.md`, archives stale theme/actor files, writes `memory/briefings/YYYY-Q#.md` | quarterly (~every 13 weeks) |
| `/refresh-headlines-archive` | `SIX_MONTH_HIGHLIGHTS` | monthly |
| `/refresh-adoption` | `COMPANY_HOLDINGS` (weekly), `COUNTRY_HOLDINGS` (monthly), `ADOPTION_INDEX_TOP20` + `ADOPTION_DATA` (quarterly) | mixed |
| `/refresh-fallbacks` | `FALLBACK_PRICE`, `FALLBACK_ATH`, `FALLBACK_ATH_DATE`, `FALLBACK_MINED`, `FALLBACK_BLOCK` | quarterly |
| `/refresh-all` | Orchestrator — runs fallbacks (Haiku 4.5), adoption and headlines-archive (Sonnet 5.5) and market-news (Fable 5.1) as parallel sub-agents (Phase 1), then deep-analysis on Fable 5.1 (Phase 2), the Editor on Opus 5.5 and a Haiku cold-read test, single rebuild at end | on demand |

Out of scope for every command: Thesis tab, Strategy tab, live-API code, URL constants, `PRICE_CHART_RANGES`, `TABS` (see `SCOPE.md` § "Out of scope").

## Adding a new automation

1. Add scope rules to `SCOPE.md` if it touches new data (tier table + editorial rules).
2. Write `automations/<name>/README.md` — full playbook (workflow, JS shape, sources, pitfalls).
3. Write `.claude/commands/<name>.md` — short shim that points at the playbook and restates hard constraints.
4. Add a row to the roster table above.
5. If the orchestrator should call it, add it to `automations/refresh-all/README.md`.

## Universal rules

- **Plain language is measured, not assumed.** `SCOPE.md` § "Audience & plain-language standard" is the standard; `npm run check:plain` enforces it. Every prose-writing skill runs `npm run check:plain -- --file src/data/<its own file>` before finishing, fixes hard findings once, re-runs once, then proceeds — never loops. `/refresh-plain-language` is the backstop and the only skill that edits across owners.
- Per-domain data lives in `src/data/`: `fallbacks.js`, `market-news.js`, `headlines.js`, `deep-analysis.js`, `adoption.js`, `glossary.js`, `thesis.js`, `strategy.js`. Each refresh skill edits ONLY its owned file — the single exception is `/refresh-plain-language`, which rewrites prose values across three of them by design.
- **Do NOT Read `src/BitcoinDashboard.jsx` or any other app code under `src/` outside `src/data/`** (`src/tabs/`, `src/components/`, `src/hooks/`, `src/lib/`, `src/styles.css`) to mutate refresh-owned data — reading app code just to find a constant burns tokens. Read your `src/data/<owner>.js` file directly.
- Use narrow `Edit` calls anchored on the constant name. Do not rewrite data files wholesale.
- `index.html` is edited only when the dashboard's *scope, title, meta description, or theme colors* change — NOT for routine data refreshes. **Never edit `dist/index.html` directly** — it is regenerated.
- After any source edit, rebuild so `dist/index.html` matches: `npm run build`, or the codex `node scripts/build.mjs` fallback if npm isn't on PATH (see auto-memory).
- Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending after any row change.
- Headline `date` format: `MMM D` (e.g. `May 14`).
- `MARKET_THEME.asOf` format: `MMM D, YYYY` uppercase.
- Primary sources only — `.gov`, SEC EDGAR, official IR, bitcointreasuries.net, Farside Investors, Chainalysis, Triple-A. Major BTC press only as supporting context.
- Never violate `SCOPE.md` § "Out of scope".
