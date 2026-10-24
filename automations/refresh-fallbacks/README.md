# refresh-fallbacks

Slash command: `/refresh-fallbacks`

Quarterly refresh of the **last-resort fallback constants** shown on the live price card only when the APIs fail. Keeps the fallbacks reasonable so the dashboard never looks wildly stale if CoinGecko or mempool.space go down.

All five constants live in **`src/data/fallbacks.js`** (~10 lines). Do NOT Read `src/BitcoinDashboard.jsx`.

| Constant | Source |
|---|---|
| `FALLBACK_MINED` | CoinGecko `market_data.circulating_supply` (integer) |
| `FALLBACK_BLOCK` | mempool.space `/api/blocks/tip/height` (integer) |
| `FALLBACK_PRICE` | CoinGecko `market_data.current_price.usd` (integer USD) |
| `FALLBACK_ATH` | CoinGecko `market_data.ath.usd` (float, 2 decimals) |
| `FALLBACK_ATH_DATE` | CoinGecko `market_data.ath_date.usd` (ISO 8601 with `.000Z`) |

## Hard scope (do not violate)

- Edit ONLY the five constants in `src/data/fallbacks.js`. Use anchored `Edit` calls per constant.
- Never touch live-API URLs, polling intervals, `useEffect` blocks, or anything in `SCOPE.md` § "Out of scope".
- Preserve JS shape (number types, ISO string format).

## Workflow

### Significance gate (Phase 0)

These constants are **last-resort fallbacks** — they only render when the live APIs fail. Tiny drift between the stored value and the current snapshot does not improve the failure-mode UX. Before any edit, compare new vs. stored:

| Constant | Edit only if |
|---|---|
| `FALLBACK_PRICE` | new differs from stored by ≥ 5% (`abs(new - stored) / stored >= 0.05`) |
| `FALLBACK_ATH` | new strictly > stored (new ATH set) **or** stored > 1.05× new (stored was wildly above today's high) |
| `FALLBACK_ATH_DATE` | only when `FALLBACK_ATH` is being edited (always update both together) |
| `FALLBACK_BLOCK` | new exceeds stored by ≥ 5,000 blocks (~35 days of chain progress) |
| `FALLBACK_MINED` | new exceeds stored by ≥ 5,000 BTC |

If a constant fails its threshold, skip its `Edit` and report it as `unchanged (within threshold)`. If all five fail, write nothing and exit Phase 0 — the orchestrator will treat this as a polled-but-no-edits run.

The intent: a daily/weekly poll is fine; the writes only happen when the fallback would meaningfully misrepresent reality during an API outage.

1. **Fetch** in parallel:
   - `WebFetch` https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false
   - `WebFetch` https://mempool.space/api/blocks/tip/height
2. **Extract** from CoinGecko response:
   - `market_data.circulating_supply` → `FALLBACK_MINED` (round to nearest integer)
   - `market_data.current_price.usd` → `FALLBACK_PRICE` (round to nearest integer)
   - `market_data.ath.usd` → `FALLBACK_ATH` (2 decimal places)
   - `market_data.ath_date.usd` → `FALLBACK_ATH_DATE` (use the full ISO string as-is, e.g. `"2025-10-06T00:00:00.000Z"`)
3. **Extract** from mempool.space response:
   - The response body is the raw integer block height → `FALLBACK_BLOCK`
4. **Sanity-check** before writing:
   - `FALLBACK_MINED` between 19,500,000 and 21,000,000.
   - `FALLBACK_BLOCK` greater than the current value (the chain only moves forward).
   - `FALLBACK_PRICE` and `FALLBACK_ATH` positive integers. `FALLBACK_ATH` >= `FALLBACK_PRICE` (ATH is the all-time high — if today's price exceeds it, the API was momentarily ahead; in that case set `FALLBACK_ATH` = `FALLBACK_PRICE` and `FALLBACK_ATH_DATE` to today at `T00:00:00.000Z`).
   - `FALLBACK_ATH_DATE` is a valid ISO 8601 string.
5. **Edit** `src/data/fallbacks.js` — replace ONLY the constants that passed the Phase 0 significance gate, via anchored `Edit` calls. Constants within their threshold are left alone.
6. **Rebuild.** `npm run build`, or the codex `node scripts/build.mjs` fallback. Skip if no constants were edited.
7. **Report.** For each of the five constants: `unchanged (within threshold)` OR `old → new` (with the delta that triggered the edit). Flag any sanity-check overrides.

## JS shape spec

```js
const FALLBACK_MINED    = 20001400;                          // integer
const FALLBACK_BLOCK    = 941100;                            // integer
const FALLBACK_PRICE    = 77664;                             // integer USD
const FALLBACK_ATH      = 126198.07;                         // float, 2 decimals
const FALLBACK_ATH_DATE = "2025-10-06T00:00:00.000Z";        // ISO 8601 string
```

## `YARDSTICKS` — the comparator table

This skill also owns `YARDSTICKS` in `src/data/fallbacks.js`. It is not a fallback; it is the table that lets every other skill turn a bare figure into a scale a reader can feel ("$100M per sale — about a tenth of one normal week of ETF buying"). `SCOPE.md` § "Audience & plain-language standard" principle 5 depends on it existing and being current.

- Refresh it on the **same monthly cadence** as the constants above.
- Every entry needs `value`, `unit`, `plain`, `asOf` and a **primary `source`**. No source, no entry.
- Round hard — these are orders of magnitude, not accounting.
- `plain` is the phrase as it will read inside someone else's sentence, so write it to slot in.
- **Stale is worse than missing.** If you cannot re-source an entry this run, delete it rather than let a writer compare against a number that has moved.
- The file currently carries `TODO` markers for four entries that need a primary source on your next run (average weekly ETF flow, total ETF assets, daily spot volume, US M2). Fill them or remove the markers.

## Common pitfalls

- **Editing `FALLBACK_ATH` to be less than `FALLBACK_PRICE`.** ATH means *all-time high* — by definition >= current price.
- **Stripping the `.000Z`** from the date string. Keep the millisecond precision and `Z` suffix.
- **Updating live-API URLs or polling intervals.** Out of scope here — those belong to a separate command (none exists yet).
- **Forgetting to rebuild.** `dist/index.html` must match.
- **Treating this as a frequent refresh.** Fallbacks only matter when APIs fail. Quarterly is enough.
