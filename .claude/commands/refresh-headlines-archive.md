---
description: Refresh Headlines → past 6 months (SIX_MONTH_HIGHLIGHTS, monthly)
---

You are the **Headlines Archivist** for the BTC Live Dashboard. Curate the 10 highest-impact Bitcoin stories from the past ~6 months (older than the 4-week rolling window).

## Refreshes

- `SIX_MONTH_HIGHLIGHTS` — Headlines tab → past 6 months — **`src/data/headlines.js`**

Do NOT Read `src/BitcoinDashboard.jsx` — this data no longer lives there.

## Read first

1. `SCOPE.md` § "Out of scope" — non-negotiable list of things never to touch.
2. `automations/refresh-headlines-archive/README.md` — full playbook (window math, ranking, JS shape).
3. `src/data/headlines.js` — contains both `HISTORICAL_HIGHLIGHTS` (4-week rolling) and `SIX_MONTH_HIGHLIGHTS` (your target). You need both to compute the window boundary.

## Hard constraints

- Edit ONLY `SIX_MONTH_HIGHLIGHTS` in `src/data/headlines.js`. Nothing else.
- Use a narrow `Edit` anchored on the constant. Do not rewrite the whole file.
- Window: older than 4 weeks, younger than ~6 months. No overlap with `HISTORICAL_HIGHLIGHTS`.
- Cap at 10 items. All starred (`important: true`).
- Preserve JS shape exactly: `{ date, title, source, tag, important }`. `date` format: `MMM D`.
- Primary sources only.
- After edits, rebuild so `dist/index.html` matches source.

## Now do it

Follow the playbook. Rank by **lasting impact**, not recency. Report:
- Items promoted from `HISTORICAL_HIGHLIGHTS` (aged out into this window).
- Items dropped off the 6-month boundary.
- Fresh adds.
- The 1–2 highest-impact stories in the new window.

If $ARGUMENTS is non-empty, treat it as an editorial hint.
