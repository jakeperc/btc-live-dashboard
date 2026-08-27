# refresh-market-news

Slash command: `/refresh-market-news`

Weekly refresh of the dashboard's current-news surface. Covers:

| Constant | File | UI location | Treatment |
|---|---|---|---|
| `MARKET_THEME` | `src/data/market-news.js` | Dashboard → Market Pulse (slot 1) | Top theme — slot 1 of the ranked top 5 |
| `CURATED_MARKET_UPDATES` | `src/data/market-news.js` | Dashboard → 4 cards under live price (slots 2–5) | Ranked top 5 themes — slots 2–5 |
| `HISTORICAL_HIGHLIGHTS` | `src/data/headlines.js` | Headlines tab → past 4 weeks | Rolling 4-week window of important stories |
| `FALLBACK_NEWS` | `src/data/market-news.js` | Headlines tab → "Latest" if RSS fails | Backup for the live RSS feed |

Plus `index.html:13` `<meta name="description">` — re-check after content edits and rewrite only if the primary narrative materially shifted.

The **editorial rules** for the top-5 themes live in `SCOPE.md` § "Editorial rules for the top-5 themes". This file is the **operational playbook**.

## Hard scope (do not violate)

- Edit ONLY the four constants above (plus optionally `index.html:13` meta description when the dashboard's *primary identity* shifts — not routine theme updates).
- **Do NOT Read `src/BitcoinDashboard.jsx`** — your data lives in `src/data/market-news.js` (MARKET_THEME, CURATED_MARKET_UPDATES, FALLBACK_NEWS) and `src/data/headlines.js` (HISTORICAL_HIGHLIGHTS).
- Use narrow `Edit` calls anchored per constant. Never rewrite a data file wholesale.
- Never touch Thesis, Strategy, live-API code (`useEffect`, `fetch`, `setInterval`), URL constants, or anything in `SCOPE.md` § "Out of scope".
- Preserve JS shapes exactly (see "JS shape spec" below).
- Primary sources only. No aggregators.

## Workflow

### Phase 1 — Market Pulse + 4 cards (the ranked top 5)

> **Significance gate.** The cadence trigger in `/refresh-all` is now frequent (every 2 days). Most polls will produce **zero slot writes**. The replacement threshold below is a hard gate, not a suggestion: if no slot has a candidate that is *materially more important* than the slot it would replace, skip Phase 1's `Edit` entirely and report `polled, no material change`. A within-slot refinement (narrative/detail tightening on the same underlying theme) is only justified when a dated primary-source development has occurred since the slot's current `asOf` — not on every poll. **This gate applies to `MARKET_THEME` and `CURATED_MARKET_UPDATES` only.** `HISTORICAL_HIGHLIGHTS` and `FALLBACK_NEWS` (Phases 2–3) feed the Headlines tab, which is live-API-driven, and follow their own existing rules unchanged.

1. **Load context.** Read `SCOPE.md` § "Editorial rules for the top-5 themes" (use `Read offset/limit` to load only that section) and the current values of `MARKET_THEME` + `CURATED_MARKET_UPDATES` from `src/data/market-news.js`. Also read `automations/refresh-market-news/last-run-artifacts.md` if present — if the most recent run was within the last ~2 days and surfaced the same set of themes you'd surface today, the significance gate will likely close.
2. **Survey ~last 2 weeks.** Use `WebSearch` for recent Bitcoin developments. Cast wide: regulation, ETFs, corporate treasuries, sovereign reserves, protocol/security, macro, mining, market structure.
2a. **Adjacency sweep — second-order / shared-resource risk (do not skip for legislative themes).** A tracked theme is moved as much by what it *competes with* as by its own coverage — and that competition often shares **none of its keywords**, so a BTC-scoped search will never surface it. For any active **legislative/regulatory** theme (CLARITY-class), run a separate, non-crypto search on the **congressional calendar environment**: appropriations / shutdown / debt-ceiling deadlines, must-pass bills, leadership floor priorities, and presidential signing standoffs that could eat the floor time the bill needs. A bill on the calendar can stall purely on *timing* (floor-time scarcity) with no change to its merits or vote count. Generalize the question per theme — *what shared scarce resource does this depend on?* legislation → congressional floor time; macro → Fed attention / balance-sheet capacity; protocol → block space + dev consensus; market-structure → liquidity / collateral — then search for contention on that resource, not just the theme's own name.
3. **Cluster into themes — not headlines.** Multiple MSTR buys = ONE theme. Multiple CLARITY Act developments = ONE theme.
4. **Validate with primary sources.** For each candidate, `WebFetch` at least one primary source. If you can't reach one, the theme is not ready.
5. **Rank by importance to a sophisticated reader.** "Would a serious Bitcoin observer feel something major is missing if we ignored this?"
6. **Apply replacement threshold (HARD GATE).** A current slot is replaced ONLY if a new candidate is *materially more important* than the slot it would displace. "More recent" alone never qualifies. Most refreshes keep the same themes and refine `narrative` / `detail` inside them. **And refinement itself requires a dated primary-source development since the slot's current `asOf`.** If neither replacement nor refinement is justified for any slot, skip Phase 1 `Edit` entirely.
7. **De-dup pass.** List the 5 chosen themes side-by-side. Confirm no two share an underlying driver.
8. **Compose** the slots using the shapes in "JS shape spec".
9. **Edit** `src/data/market-news.js` — replace `MARKET_THEME` and `CURATED_MARKET_UPDATES` only via narrow anchored `Edit` calls.

7b. **Plain pass.** Before writing, do the pass the Editor cannot do for you — it may not add facts, and you have the sources open.
   - Write `plain` for all four cards and `whyItMatters` for the theme. These are Tier 1: a newcomer reads them alone, with no context.
   - Define every term and every person at first use, in the field where it first appears — "cloture — the Senate vote that ends debate", "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other)".
   - Give every number a yardstick, from the story or from `YARDSTICKS` in `src/data/fallbacks.js`.
   - Keep the longest sentence under 45 words. `CURATED[0].detail` in the Aug 19 build had a 67-word sentence.
   - Read each card aloud. If a relative would squint, rewrite it.
7c. **Run `npm run check:plain -- --file src/data/market-news.js`.** Fix hard findings, re-run **once**, then proceed regardless and note anything left in your report. Never loop — the Editor is the backstop and the publish is never blocked on style.

### Phase 2 — `HISTORICAL_HIGHLIGHTS` (rolling 4-week window)

10. **Re-read** the current `HISTORICAL_HIGHLIGHTS` array from `src/data/headlines.js`.
11. **Age out items >4 weeks old.** Compute the 4-week cutoff from the asOf date you used for `MARKET_THEME`. Drop items whose `date` is older than the cutoff.
12. **Promote demoted Market Pulse themes.** Any slot 1–5 theme you displaced in Phase 1 that is still significant should be added to `HISTORICAL_HIGHLIGHTS` as its representative headline (one entry per theme).
13. **Add other major weekly stories** that weren't important enough for a Market Pulse slot but are starred-headline-worthy. Cap the total at 10–14 items.
14. **Sort by `date` descending** (most recent first).
15. **Preserve shape:** `{ date, title, source, tag, important: true }`. Headlines here are all starred (`important: true`).

### Phase 3 — `FALLBACK_NEWS` (RSS backup)

16. **Refresh `FALLBACK_NEWS`** with the 4 most important stories from the past ~48 hours. Same shape as `HISTORICAL_HIGHLIGHTS`. Mix of starred and unstarred is fine — match the cadence of what an RSS feed would surface.
17. Cap at 4 items.

### Phase 4 — `index.html` meta description (only if narrative shifted)

18. **Compare** the new slot-1 category against the prior slot-1 category. If they differ AND the new narrative represents a material shift in the dashboard's *primary* identity (e.g., regulation → reserves → ETF flows), reassess `index.html:13` `<meta name="description">`. Routine within-theme refreshes do not require a meta update.
19. If updating, keep the description tight (one sentence, ~160 chars) and reflective of the broader dashboard surface — not just slot 1.

### Phase 5 — Rebuild + handoff + report

> **Note:** When `/refresh-deep-analysis` runs immediately after this command (the weekly chain), the research artifacts gathered here (primary-source WebFetch results, slot-1 narrative framing) are reusable input for the synthesis pass — keep them in context if invoking the deep-analysis playbook next.

19a. **Handoff (if running inside `/refresh-all` or before a chained `/refresh-deep-analysis`):** write `automations/refresh-market-news/last-run-artifacts.md` containing the primary-source URLs you validated this run and 5–10 key facts (dated). `/refresh-deep-analysis` reads this file to avoid re-fetching the same sources.

20. **Rebuild.** `npm run build`. If npm isn't on PATH, use the codex `node` + `vite` + `make-single-file` fallback (see auto-memory). `dist/index.html` must match source.
21. **Report.** Summarize:
    - Which slots changed (and which were intentionally kept).
    - Materiality argument for each Market Pulse replacement.
    - How many `HISTORICAL_HIGHLIGHTS` items aged out, how many added.
    - Whether `FALLBACK_NEWS` changed.
    - Whether `index.html` meta was touched and why.
    - Whether the rebuild succeeded.

## JS shape spec

### `MARKET_THEME`

```js
const MARKET_THEME = {
  category: "REGULATION",            // ALL CAPS short label
  asOf: "MAY 12, 2026",              // format: "MMM D, YYYY" uppercase
  title: "...",                      // names the theme (not a single headline)
  status: "Senate Markup",           // short status string
  statusTone: "active",              // one of: advancing | active | stalled | passed
  narrative: "...",                  // what is happening. <=90 words, every term defined at first use
  whyItMatters: "...",               // the stakes for a non-expert. <=60 words. TIER 1 — this is what the card shows while COLLAPSED, so it must stand alone with zero jargon
  milestoneLabel: "Next checkpoint", // usually keep as "Next checkpoint"
  milestone: "...",                  // next concrete dated event to watch. <=60 words. Lives behind the expand
  sources: [
    { label: "Source name", url: "https://..." },
    // 1–3 entries, primary sources only
  ],
};
```

### `CURATED_MARKET_UPDATES[i]` — 4 items, ranked

```js
{
  label: "CATEGORY • MMM D",  // category in caps, date in "MMM D" format
  title: "...",                // names the theme. <=15 words
  plain: "...",                // NEW, REQUIRED — ONE sentence, <=30 words: what happened + why it matters to someone who owns Bitcoin. TIER 1: this is the collapsed card view, and the only line most readers see
  detail: "...",               // <=150 words. Define every term and every person at first use; give every number a yardstick
  sources: [
    { label: "Source name", url: "https://..." },
  ],
}
```

### `HISTORICAL_HIGHLIGHTS[i]` — rolling 4-week window

```js
{
  date: "May 11",                                                   // "MMM D" format
  title: "...",                                                      // single headline
  source: "CoinDesk",                                                // outlet name (no URL)
  tag: "ETFs",                                                       // ALL CAPS category tag
  important: true,                                                   // always true here
}
```

### `FALLBACK_NEWS[i]` — RSS backup, 4 items max

Same shape as `HISTORICAL_HIGHLIGHTS`. `important` can be `true` or omitted (false).

### `statusTone` → color mapping (informational; do not edit CSS)

| Tone | Card accent |
|---|---|
| `advancing` | green |
| `active` | blue |
| `stalled` | amber |
| `passed` | strong green |

## Source priority

1. `.gov` — whitehouse.gov, sec.gov, banking.senate.gov, treasury.gov, congress.gov, federalreserve.gov
2. **SEC EDGAR** — sec.gov/edgar (8-Ks, 10-Qs)
3. **Official issuer / IR** — strategy.com/press, ir.coinbase.com, etc.
4. **bitcointreasuries.net** — corporate + sovereign holdings
5. **Farside Investors** — farside.co.uk/btc (ETF flows)
6. **Major BTC press** — CoinDesk, Bitcoin Magazine, Cointelegraph (supporting context only, never the sole source for a Market Pulse slot)

Never cite aggregators, re-blogs, or social media as the primary source.

## Voice

Short-form analysis for a smart newbie. Translate jargon ("spot ETF inflows" → "money flowing into Bitcoin funds traded on the stock market"). Plain English. No `BREAKING:`, no clickbait, no emojis.

**The binding standard is `SCOPE.md` § "Audience & plain-language standard"** — tier map, word budget, probability bands and worked rewrites. Read it before drafting. This file duplicates only the shape.

The model to copy is already in this data: the Aug 19 protocol card defines its terms inline, ends with what a beginner should do (nothing) and warns about the matching scam. That is the register.

## Common pitfalls

- **Replacing a slot with a fresher headline of the same theme.** Don't. Refine `narrative` / `detail` instead.
- **Two slots driven by the same story.** "Strategy buys 535 BTC" and "Saylor crosses 818K BTC" are the same theme.
- **Aggregator URLs in `sources[]`.** Replace with the underlying primary source.
- **`MARKET_THEME.asOf` drift.** Set to the most recent material development in the theme — not today's date by reflex.
- **`HISTORICAL_HIGHLIGHTS` overlap with `SIX_MONTH_HIGHLIGHTS`.** Items older than 4 weeks belong in `SIX_MONTH_HIGHLIGHTS` (managed by `/refresh-headlines-archive`).
- **Updating `index.html:13` on every run.** Only update on a *material* shift in primary narrative.
- **Skipping `plain`.** Without it the collapsed card shows a bare title, and the collapsed view is what most readers see.
- **A wall of mono.** `detail` renders as body prose now, not monospace — write it as prose, not as a wire report.
- **Forgetting to rebuild.** `dist/index.html` must match source.
- **Touching anything outside the four constants.** Scope creep is a violation.
