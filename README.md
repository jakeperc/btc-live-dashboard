# BTC Live Dashboard

A weekly, Monday-morning Bitcoin briefing at [jakepercy.com/bitcoin](https://jakepercy.com/bitcoin): live price and on-chain metrics, a probability-scored weekly analysis, a hard-money thesis, a strategy tab, curated headlines and global adoption tables, on one page.

It is written for three readers at once:

1. **Friends and family learning Bitcoin from scratch** — the binding constraint. A sentence they cannot parse costs trust in the whole page.
2. **Intermediate observers** staying current without news-ticker churn.
3. **Recruiters** evaluating the author for a Bitcoin / blockchain role.

The editorial voice is calm and primary-source-driven. Every forecast carries an explicit probability and every forecast is scored: the Analysis tab shows the Brier calibration, and its Track record lists every resolved call, hit or miss. The site teaches time preference. It does not manufacture urgency, and it never gives financial advice.

## Architecture

Vite + React 18 + recharts. No TypeScript, no state library, no backend. The page is static; live figures come from free public APIs in the browser.

```
index.html                 head, meta, and the #root marker the crawler rendition is injected into
src/
  main.jsx                 mount
  BitcoinDashboard.jsx     the shell: header, tab bar, hash router, shared state
  tabs/                    one component per tab: Dashboard, Thesis, Strategy, Headlines, Adoption, Analysis
  components/shared.jsx    cards, Term (glossary popover), StaleNotice, …
  hooks/                   useBitcoinData (prices, mempool), useBitcoinNews (RSS via rss2json), ui
  lib/                     constants (API URLs, TABS), routes (hash scheme), format, market-math, glossary-match
  data/                    the content — the only directory the refresh automations edit
  styles.css               tokens (--elev-*, --fs-*) and the elevation material system
scripts/                   build and check scripts (Node ESM, no dependencies)
automations/               one playbook per refresh skill, plus the analyst memory
deploy/                    .htaccess and deploy notes
```

### `src/data/` — content modules and their owners

| Module | Exports | Owner |
|---|---|---|
| `market-news.js` | `MARKET_THEME`, `CURATED_MARKET_UPDATES`, `FALLBACK_NEWS`, `NEWS_FEEDS` | `/refresh-market-news` (weekly) |
| `headlines.js` | `HISTORICAL_HIGHLIGHTS`, `SIX_MONTH_HIGHLIGHTS` | `/refresh-market-news`, `/refresh-headlines-archive` |
| `deep-analysis.js` | `DEEP_ANALYSIS` — v2: probabilities, falsification conditions, calibration | `/refresh-deep-analysis` (weekly) |
| `forecast-ledger.js` | `FORECAST_LEDGER` — the Track record | `/refresh-deep-analysis` (weekly) |
| `adoption.js` | `COMPANY_HOLDINGS`, `COUNTRY_HOLDINGS`, `ADOPTION_INDEX_TOP20`, `ADOPTION_DATA` | `/refresh-adoption` |
| `fallbacks.js` | `FALLBACK_*` constants, `YARDSTICKS` | `/refresh-fallbacks` (monthly) |
| `glossary.js` | `GLOSSARY` | writers append with a source; the Editor proposes |
| `thesis.js`, `strategy.js` | the static Thesis and Strategy tabs | hand-written; out of scope for the automations |

The app is split so the refresh skills never read or edit anything outside `src/data/`. `SCOPE.md` is the source of truth for what each skill may touch.

## Routing

Tabs and in-page sections are addressable as `#/<tab>/<anchor>`, defined in one place: `src/lib/routes.js`.

- `#/thesis` opens a tab; `#/analysis/track-record` opens a tab and scrolls to a section.
- Tab slugs: `dashboard`, `thesis`, `strategy`, `headlines`, `adoption`, `analysis`.
- Anchor ids live in `ANCHORS` in the same file. `npm run check:schema` verifies they are unique and that every anchor a data module links to is defined there.
- A hash that does not start with `#/` is left to the browser, so plain in-page anchors keep working.

## The weekly pipeline

`/refresh-all` is the orchestrator. It runs each refresh skill on its own cadence, each behind a significance gate that may close on a polled run with nothing material to say, then builds once at the end.

| Agent | Cadence | What it covers |
|---|---|---|
| `fallbacks` | Monthly (30d) | Last-resort price / ATH / block / mined constants, `YARDSTICKS` |
| `adoption` | Weekly (6d), Monday anchor | Public-company treasuries, sovereign reserves, adoption indices |
| `market-news` | Weekly (6d), Monday anchor | Top-5 themes (Market Pulse + 4 cards), four-week highlights, RSS fallback |
| `headlines-archive` | Monthly (25d) | Six-month archive of important headlines |
| `deep-analysis` | Weekly (6d), Monday anchor, chains after market-news | Analysis tab synthesis, probabilities, Brier scoring, the forecast ledger |

Between Mondays, `/refresh-all <hint>` force-runs for genuinely major news; the trigger list is in `automations/refresh-all/README.md`. Force-runs never bump the cadence manifest, so the Monday baseline survives.

**The Editor.** After the writers and before the build, `/refresh-plain-language` reads every rendered field with fresh eyes and rewrites for a newcomer: consequence first, every term defined at first use, probability band phrases instead of numbers, no sentence over 45 words. It never adds a fact, never reads the analyst memory, and never touches a scoring field. `npm run check:plain` measures the result, and its exit code decides whether the Editor runs again, the build proceeds, or the file is restored from the pre-edit snapshot.

**Memory and calibration.** `/refresh-deep-analysis` keeps a project-scoped analyst memory in `automations/refresh-deep-analysis/memory/`: theme and actor files, a causal model, the watch-list ledger and calibration bins. Every watch-list row carries a probability on a 0.05 grid; when its window closes it is scored hit or miss against the threshold in its own wording (never partial; a forecast its wording cannot decide is marked no-resolution and left out of every score) and the Brier score updates. `/consolidate-deep-analysis` distills the journals each quarter.

## The forecast ledger

`src/data/forecast-ledger.js` is the public, plain-English face of that memory: every resolved forecast with the date it was made, the odds given, what happened, its Brier score and one lesson, newest first — plus the aggregate score, the per-category bias and a calibration curve. It renders as **Track record** on the Analysis tab (`#/analysis/track-record`). The file is regenerated from the memory ledger, never hand-edited, and `npm run check:schema` enforces that the counts, the sort order and every row's arithmetic agree.

## Build, checks and deploy

```
npm install
npm run dev            # Vite dev server on :5173
npm run build          # split build: dist/index.html + dist/assets/, crawler rendition injected
npm run build:single   # one self-contained dist/index.html (CSS, JS and SEO content inlined)
npm run check:schema   # shape gate for every src/data module — exit 1 on any violation
npm run check:plain    # plain-language checker — 0 clean · 1 style · 2 Editor must fix · 3 structural, do not build
npm run check:llms     # dist/llms.txt is present, valid, linked from the page and current — exit 1 on any problem; skipped without a build
npm test               # check:schema, the glossary-matcher regression tests, then check:llms
```

`scripts/render-seo.mjs` regenerates a text rendition of the curated content on every build, so crawlers that never run JavaScript still read this week's analysis. After any `src/data/*.js` edit, rebuild.

Deployment is a file upload. See `deploy/README.md` for the target directory, the optional `.htaccess`, and how to verify it.

## llms.txt

The build also writes `dist/llms.txt`: a short plain-text guide to the page for AI readers, most of which run no JavaScript. It says what the page shows, how to read its stated probabilities and Brier-scored track record, what not to conclude from them, where the live data comes from, and the `#/<tab>/<anchor>` addresses. The page points at it from the `<head>` (`index.html`) and from the first line of the static text (`render-seo.mjs`).

- **Where the prose lives.** `scripts/llms.txt.tpl`, hand-written. `scripts/render-llms.mjs` fills in everything that moves: tab names and routes (`src/lib`), endpoints and polling intervals (`constants.js`), the probability wording bands (`SCOPE.md`), the page's own stale-after rule (`shared.jsx`), and the weekly analysis and track record (`src/data`). The "Current state" block carries the analysis's own `asOf` date, never the build date.
- **Quote check.** Every double-quoted string in the template must still be on the page (`index.html`, `src/` or the static text in `render-seo.mjs`). Reword a label, a probability band, the Brier sentence or a disclaimer and the template needs the same change. The build only warns (lines prefixed `llms:`): the weekly refresh runs it unattended, and llms.txt is never allowed to be the reason it fails. `npm run check:llms` (and `npm test`) turns the same findings into failures.
- **Contract.** ASCII only, under 10 KB, and the opening blockquote must equal this dashboard's row in `JakePercy.com/content/llms/sites.json` (summary plus caveat). `node scripts/check-llms.mjs` in that repo validates every dashboard's file together; edit the sheet there, not here.
- **See it without building.** `node scripts/render-llms.mjs` prints the file from the current source.

## Contributing

- Read `CLAUDE.md`, then `SCOPE.md`. `SCOPE.md` lists what each refresh skill may change, what is out of scope for all of them (the Thesis and Strategy tabs, live-API code, URL constants, everything under `src/` outside `src/data/`), and the plain-language standard every sentence is held to.
- Plain language is a hard rule, not a preference. Run `npm run check:plain -- --file src/data/<file>` on anything you write; fix hard findings once, re-run once, and list what is left.
- Edit data with narrow, anchored edits to the constant; never rewrite a data file wholesale. Re-sort the holdings tables by `btc` descending after any row change.
- Primary sources only: `.gov`, SEC EDGAR, official investor relations, bitcointreasuries.net, Farside Investors, BIPs. Major Bitcoin press as supporting context, never as the sole source.
- Design: no colored alert stripes or tinted callouts. Hierarchy comes from the `--elev-*` elevation tokens in `styles.css`, and nothing renders below 11px.
- `dist/` is build output. Do not edit it.

## Licence

The code is free to read and learn from. Content © Jake Percy; not financial advice.
