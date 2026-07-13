# refresh-headlines-archive

Slash command: `/refresh-headlines-archive`

Monthly refresh of the **deep archive** on the Headlines tab. Covers `SIX_MONTH_HIGHLIGHTS` only.

| Constant | File | UI location | Treatment |
|---|---|---|---|
| `SIX_MONTH_HIGHLIGHTS` | `src/data/headlines.js` | Headlines tab → past 6 months | Top 10 highest-impact stories from ~6 months back to the 4-week cutoff |

`HISTORICAL_HIGHLIGHTS` (rolling 4 weeks, same file) and the live-RSS "Latest" section are NOT in scope here — those are owned by `/refresh-market-news`.

## Hard scope (do not violate)

- Edit ONLY `SIX_MONTH_HIGHLIGHTS` in `src/data/headlines.js`. Use a narrow anchored `Edit`. Do NOT Read `src/BitcoinDashboard.jsx`.
- Never touch Thesis, Strategy, live-API code, URL constants, or anything in `SCOPE.md` § "Out of scope".
- Preserve JS shape exactly.
- Window: items older than 4 weeks but younger than ~6 months. No overlap with `HISTORICAL_HIGHLIGHTS`.
- Cap at 10 items. All starred (`important: true`).

## Workflow

1. **Load context.** Read `src/data/headlines.js` for both `HISTORICAL_HIGHLIGHTS` and `SIX_MONTH_HIGHLIGHTS`. Note the cutoff dates implied by `MARKET_THEME.asOf` (in `src/data/market-news.js`).
2. **Define the window.** Compute the 4-week cutoff (older boundary of `HISTORICAL_HIGHLIGHTS`) and the 6-month cutoff. Your window is **older than the 4-week cutoff and younger than the 6-month cutoff**.
3. **Promote aged-out items.** Items that have aged out of `HISTORICAL_HIGHLIGHTS` since the last run are candidates here — but ONLY if they are high-impact enough to belong in a 10-item curated set.
4. **Survey** the broader 6-month window. Use `WebSearch` to identify the **highest-impact** Bitcoin stories in the window. Categories to consider: cycle-defining price events, major ETF milestones (cumulative AUM thresholds, single-day records), corporate treasury milestones (Strategy crosses N BTC, Tesla / Apple / DJT moves), sovereign reserve announcements, major regulatory passage (GENIUS Act, CLARITY Act), Fed policy turns, halvings, ATHs, market crashes.
5. **Rank by lasting impact.** Test: "If a reader returns to the dashboard 6 months from now, which 10 stories would they remember as defining this period?"
6. **Validate with primary sources.** `WebFetch` at least one primary source per item. SEC EDGAR for filings, .gov for policy, official IR for corporate treasury, Farside Investors for ETF flows.
7. **De-dup against** the current `HISTORICAL_HIGHLIGHTS`. No overlap.
8. **De-dup internal themes.** No two items driven by the same underlying event. Pick the most representative headline.
9. **Sort by `date` descending** (most recent first within the window).
10. **Cap at 10 items.** Trim the lowest-impact entries if you have more.
11. **Edit** `src/data/headlines.js` — replace `SIX_MONTH_HIGHLIGHTS` only via a narrow anchored `Edit`.
12. **Rebuild.** `npm run build`, or the codex fallback. `dist/index.html` must match.
13. **Report.** Summarize: which items were promoted from `HISTORICAL_HIGHLIGHTS`, which dropped off the 6-month boundary, what was added fresh, what the highest-impact story in the new window is.

## JS shape spec

### `SIX_MONTH_HIGHLIGHTS[i]`

```js
{
  date: "Apr 2",                                                     // "MMM D" format
  title: "...",                                                       // single representative headline
  source: "CoinDesk",                                                 // outlet name (no URL)
  tag: "CORPORATE",                                                   // ALL CAPS category tag
  important: true,                                                    // always true here
}
```

Common tags in use: `PRICE`, `ETFs`, `REGULATION`, `RESERVES`, `CORPORATE`, `FED`, `MINING`, `EXCHANGE`. Stay within this vocabulary unless a new category is materially distinct.

## Source priority

Same as `/refresh-market-news`:

1. `.gov`
2. SEC EDGAR
3. Official issuer / IR
4. bitcointreasuries.net
5. Farside Investors
6. Major BTC press (supporting context only)

## Voice

Headlines are tight — under ~150 chars, action verb, specific number when relevant. Match the style of existing entries (`"Bitcoin breaks $200K for first time; total market cap surpasses $4T"`, not `"Bitcoin hits new high"`).

## Common pitfalls

- **Overlap with `HISTORICAL_HIGHLIGHTS`.** If a story is younger than the 4-week cutoff, it belongs in `HISTORICAL_HIGHLIGHTS`, not here.
- **Recency bias.** A genuinely impactful story from 5 months ago beats a forgettable story from 2 months ago. Rank by lasting impact, not freshness.
- **Multiple headlines of the same theme.** If Strategy crossed 700K and then 750K in the window, that's one entry (whichever was more significant), not two.
- **Forgetting to rebuild.** `dist/index.html` must match.
