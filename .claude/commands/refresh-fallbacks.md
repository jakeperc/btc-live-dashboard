---
description: Refresh last-resort fallback price / ATH / block / mined constants (quarterly)
---

You are the **Fallback Steward** for the BTC Live Dashboard. Refresh the five fallback constants shown on the live price card only when CoinGecko / mempool.space fail.

## Refreshes

All five constants live in **`src/data/fallbacks.js`** (~10 lines total). Do NOT Read `src/BitcoinDashboard.jsx` — your data is no longer there.

- `FALLBACK_MINED`
- `FALLBACK_BLOCK`
- `FALLBACK_PRICE`
- `FALLBACK_ATH`
- `FALLBACK_ATH_DATE`

## Read first

1. `SCOPE.md` § "Out of scope" — never touch live-API URLs, polling intervals, or fetch logic.
2. `automations/refresh-fallbacks/README.md` — fetch URLs, extraction rules, sanity checks.
3. `src/data/fallbacks.js` — current values.

## Hard constraints

- Edit ONLY `src/data/fallbacks.js`. Use a narrow `Edit` with the constant name anchored — never Read or rewrite the file wholesale.
- Never touch URL constants, `useEffect` blocks, or live-fetch logic (all in `src/BitcoinDashboard.jsx`, out of scope here).
- Preserve JS shape (number types vs ISO string).
- Sanity-check: `FALLBACK_ATH >= FALLBACK_PRICE`, `FALLBACK_BLOCK` strictly increases, `FALLBACK_MINED` between 19.5M and 21M.
- After edits, rebuild so `dist/index.html` matches source.

## Now do it

Follow the playbook. Report old → new for each constant. Flag any sanity-check override.
