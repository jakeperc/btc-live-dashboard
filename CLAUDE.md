# BTC Live Dashboard

A weekly Monday-morning Bitcoin briefing for three audiences: friends/family learning Bitcoin from scratch, intermediate observers staying current, and recruiters evaluating the author for a Bitcoin/blockchain role. The editorial voice is calm, primary-source-driven, and explicitly forecasted (probabilities + Brier calibration on the Analysis tab) — built to teach time-preference, not produce news-ticker churn.

## Refresh cadence

The orchestrator `/refresh-all` polls per-agent on this cadence. Each agent also has a significance gate that may close on a polled run with nothing material to say:

| Agent | Cadence | What it covers |
|---|---|---|
| `fallbacks` | Monthly (30d) | Last-resort price/ATH/block/mined constants if live APIs fail |
| `adoption` | **Weekly (6d)** — Monday anchor | Public-co treasuries, sovereign reserves, adoption indices |
| `market-news` | **Weekly (6d)** — Monday anchor | Top-5 themes (Market Pulse + 4 cards), historical highlights, RSS fallback |
| `headlines-archive` | Monthly (25d) | Six-month archive of important headlines |
| `deep-analysis` | **Weekly (6d)** — Monday anchor, chains after market-news | Analysis tab synthesis with probabilities + Brier-scored calibration |
| `forecast-ledger` | With `deep-analysis` (whenever a watch row resolves) | `FORECAST_LEDGER` in `src/data/forecast-ledger.js` — every scored forecast with its Brier score; rendered as the Analysis tab's Track record (`#/analysis/track-record`) |

## Mid-week force-runs

For genuinely major news between Mondays, force-run with `/refresh-all <hint>` (e.g. `/refresh-all SEC approved BTC options ETF`). The concrete trigger list — regulatory, markets/corporate, protocol, macro — lives in `automations/refresh-all/README.md` § "Mid-week force-run triggers". Force-runs do not bump the manifest, so the Monday baseline always survives.

## Hard rules

- **Headlines tab is live RSS.** Refresh automations never touch the live API or the Headlines tab UI — they only curate the fallback constants used when RSS is down (`FALLBACK_NEWS`) and the archives (`HISTORICAL_HIGHLIGHTS`, `SIX_MONTH_HIGHLIGHTS`).
- **Scope rules** for every refresh skill live in `SCOPE.md`. Out-of-scope: Thesis tab, Strategy tab, live-API code, URL constants, and all of `src/` outside `src/data/` (the app is split across the `src/BitcoinDashboard.jsx` shell plus `src/tabs/`, `src/components/`, `src/hooks/`, `src/lib/` — refresh skills edit per-domain files in `src/data/` only).
- **Plain language is a hard rule, not a preference.** The standard — audience, three registers, word budget, probability bands — lives in `SCOPE.md` § "Audience & plain-language standard" and is measured by `npm run check:plain`. Audience #1 (friends and family learning from scratch) is the binding constraint: a sentence they cannot parse costs trust in the whole page. Every prose-writing skill runs the checker on its own file before finishing; `/refresh-plain-language` is the backstop that reads the result with fresh eyes.
- **Build:** after any `src/data/*.js` edit, rebuild with `npm run build`. It runs the schema gate (`scripts/check-schema.mjs`) first, then `scripts/check-plain.mjs` — a STRUCTURAL finding (exit 3) aborts the build too; style/hard findings (exit 1/2) do not — then a split Vite build: `dist/index.html` plus hashed chunks in `dist/assets/` (tabs load lazily; the vendor chunks cache for a year while `index.html` stays `no-cache`). **Deploy uploads the whole `dist/` folder** — see `deploy/README.md`. `npm run build:single` still produces one self-contained file if that is all a host can take. The orchestrator runs the build exactly once at the end.
- **Routing.** Every tab and in-page target is addressable as `#/<tab>/<anchor>` (scheme and `ANCHORS` in `src/lib/routes.js`); the browser back button works between tabs. Refresh skills never touch it — if a data field needs a link target, it uses an existing anchor id.
- **Short path first.** The Thesis tab opens on a five-minute version (`THESIS_QUICK` in `src/data/thesis.js`) with the full thesis behind a labelled door that opens on deep links and for returning readers. `npm run check:plain` measures both; no automation edits `thesis.js` or `strategy.js`.
- **Test before you ship:** `npm test` runs the schema gate and the glossary matcher; `npm run check:plain` measures the prose. A structural finding in either blocks the build.
