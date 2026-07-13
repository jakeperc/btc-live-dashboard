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

## Mid-week force-runs

For genuinely major news between Mondays, force-run with `/refresh-all <hint>` (e.g. `/refresh-all SEC approved BTC options ETF`). The concrete trigger list — regulatory, markets/corporate, protocol, macro — lives in `automations/refresh-all/README.md` § "Mid-week force-run triggers". Force-runs do not bump the manifest, so the Monday baseline always survives.

## Hard rules

- **Headlines tab is live RSS.** Refresh automations never touch the live API or the Headlines tab UI — they only curate the fallback constants used when RSS is down (`FALLBACK_NEWS`) and the archives (`HISTORICAL_HIGHLIGHTS`, `SIX_MONTH_HIGHLIGHTS`).
- **Scope rules** for every refresh skill live in `SCOPE.md`. Out-of-scope: Thesis tab, Strategy tab, live-API code, URL constants, and all of `src/` outside `src/data/` (the app is split across the `src/BitcoinDashboard.jsx` shell plus `src/tabs/`, `src/components/`, `src/hooks/`, `src/lib/` — refresh skills edit per-domain files in `src/data/` only).
- **Build:** after any `src/data/*.js` edit, rebuild with `npm run build`. The orchestrator runs the build exactly once at the end.
