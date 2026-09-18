# refresh-adoption

Slash command: `/refresh-adoption`

Refresh the Adoption tab. **Four tables with different cadences** — the command checks each independently and only updates what's due (or what an editorial hint targets).

All four constants live in **`src/data/adoption.js`**. Do NOT Read `src/BitcoinDashboard.jsx`.

| Constant | UI sub-section | Cadence | Source of truth |
|---|---|---|---|
| `COMPANY_HOLDINGS` | Adoption → public-co treasuries | weekly / event-driven | SEC EDGAR + bitcointreasuries.net + official IR |
| `COUNTRY_HOLDINGS` | Adoption → sovereign reserves | monthly / event-driven | bitcointreasuries.net + .gov announcements |
| `ADOPTION_INDEX_TOP20` | Adoption → top-20 index | quarterly | Chainalysis Global Crypto Adoption Index |
| `ADOPTION_DATA` | Adoption → % adoption by country | quarterly | Triple-A + Statista |

## Hard scope (do not violate)

- Edit ONLY the four constants above in `src/data/adoption.js`. Use anchored `Edit` calls per constant; never rewrite the whole file.
- Never touch Thesis, Strategy, live-API code, URL constants, or anything in `SCOPE.md` § "Out of scope".
- Preserve JS shapes exactly.
- Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending after any row change.
- Primary sources only.

## Workflow

### Phase 0 — Cadence gate

For each of the four constants, decide whether to refresh on this run:

- **`COMPANY_HOLDINGS`** — refresh if >= 1 week since the last public-co update (or if $ARGUMENTS names a company / event).
- **`COUNTRY_HOLDINGS`** — refresh if >= 1 month since last update, OR if a sovereign event occurred (new country reserve, major sale, executive order).
- **`ADOPTION_INDEX_TOP20`** — refresh only if a new Chainalysis Global Crypto Adoption Index has been released since the last update. Chainalysis publishes roughly annually with a notable mid-year update — most runs will skip this.
- **`ADOPTION_DATA`** — refresh only if a new Triple-A or Statista crypto-ownership report is out. Most runs will skip this.

If a table is not due and $ARGUMENTS doesn't target it, skip it. Report which tables were checked, which were updated, which were skipped.

### Phase 0b — Significance gate (per-row)

Cadence decides whether a table is **polled**. The significance gate decides whether any individual row actually gets an `Edit`. The motivation: a once-every-2-days poll should still produce zero edits when nothing material changed.

For each table, apply these per-row tests **after** surveying primary sources:

**`COMPANY_HOLDINGS` / `COUNTRY_HOLDINGS`** — edit a row only if at least one is true:
- `btc` delta ≥ 1% of the stored value (`abs(new - stored) / stored >= 0.01`), OR
- the row's rank in the sorted table changes, OR
- a new holder crosses the inclusion threshold (corporates: ≥ 500 BTC publicly disclosed; sovereigns: any publicly disclosed strategic / reserve holding), OR
- a holder is delisted / liquidated and must be removed, OR
- `method` or `status` materially shifts (e.g. seizures → strategic reserve, halted accumulation → resumed). Cosmetic rewording is **not** material.

Sub-1% drift with unchanged rank is noise — leave the row alone.

**`ADOPTION_INDEX_TOP20`** — edit only if Chainalysis has published a new index since the last update. No partial-row edits.

**`ADOPTION_DATA`** — edit only if Triple-A or Statista has published a fresh ownership-rate report. No partial-row edits.

If a table is polled but every candidate change fails the gate, skip the `Edit` and report `polled, no material change`.

### Phase 1 — `COMPANY_HOLDINGS` (weekly)

1. **Read** current rows.
2. **Survey** the past week using `WebSearch` + `WebFetch` against:
   - SEC EDGAR 8-K filings (companies that hold BTC are required to disclose material changes)
   - `bitcointreasuries.net/entities/corporations`
   - Official IR press releases (e.g. `strategy.com/press`)
3. **For each company in the table**: check if BTC holdings changed. Apply the Phase 0b significance gate before editing — sub-1% drift with unchanged rank is left alone.
4. **For new companies** crossing material thresholds (e.g., >500 BTC and publicly disclosed): add a row.
5. **For delisted / liquidated companies**: remove rows.
6. **Re-sort by `btc` descending**.
7. **Update `method` / `status`** only when the underlying strategy materially changed (acquired, merged, pivoted, halted accumulation, etc.). Otherwise leave as-is.

### Phase 2 — `COUNTRY_HOLDINGS` (monthly / event)

8. **Read** current rows.
9. **Survey** past month: bitcointreasuries.net sovereign list, .gov executive orders, central-bank disclosures.
10. **Update `btc`** for countries with verified changes that pass the Phase 0b significance gate.
11. **Add new countries** that have publicly disclosed sovereign BTC (held by central bank or treasury, not just law-enforcement seizures unless held strategically).
12. **Re-sort by `btc` descending**.
13. **Update `status`** only on material narrative shifts (e.g., a country moves from "seizures" to "strategic reserve").

### Phase 3 — `ADOPTION_INDEX_TOP20` (quarterly)

14. **Check Chainalysis** for a fresh Global Crypto Adoption Index. If none newer than the data implied by current values, skip.
15. **If fresh data exists**: replace the array. Preserve shape — `score` normalized 0.00–1.00 with rank 1 = 1.00.
16. **Flags must match country names** (validate against existing emoji conventions in the file).

### Phase 4 — `ADOPTION_DATA` (quarterly)

17. **Check Triple-A** and **Statista** for fresh crypto-ownership rates by country. Sort by `rate` descending.
18. **If fresh data exists**: replace the array. Aim for ~24 countries (current array size). Preserve `region` taxonomy.
19. **Match flags to country names**.

### Phase 5 — Rebuild + report

20. **Rebuild.** `npm run build`, or the codex `node scripts/build.mjs` fallback. `dist/index.html` must match.
21. **Report.** Per table: skipped / updated, row count delta, top-3 most material changes, sort-order verification.

## JS shape spec

### `COMPANY_HOLDINGS[i]`

```js
{
  company: "Strategy",                                              // legal / brand name
  ticker: "MSTR",                                                    // exchange ticker (use "NA" if private)
  country: "🇺🇸",                                                    // flag emoji
  btc: 819404,                                                       // integer BTC holdings
  method: "Treasury reserve asset (debt + equity raises)",           // 1 phrase — how they hold BTC
  status: "Largest corporate holder — active accumulation",          // 1 phrase — current posture
}
```

### `COUNTRY_HOLDINGS[i]`

```js
{
  country: "United States",                                          // full country name
  flag: "🇺🇸",                                                        // flag emoji
  btc: 328000,                                                       // integer BTC holdings
  method: "Strategic Reserve + Seizures",                            // how the country acquired BTC
  status: "Strategic Reserve (Exec Order Mar 2025)",                 // current policy posture
}
```

### `ADOPTION_INDEX_TOP20[i]`

```js
{
  rank: 1,                  // 1–20, ascending
  country: "India",         // full country name
  flag: "🇮🇳",                // flag emoji
  score: 1.00,              // 0.00–1.00, rank 1 = 1.00, monotonically decreasing
}
```

### `ADOPTION_DATA[i]`

```js
{
  country: "El Salvador",   // full country name
  rate: 35.0,               // % of population — one decimal place
  region: "LatAm",          // taxonomy: LatAm | Europe | MENA | N. America | Africa | APAC | Oceania
  flag: "🇸🇻",                // flag emoji
}
```

## Source priority

1. **SEC EDGAR** — `sec.gov/edgar` for 8-Ks, 10-Qs (corporate filings are legally authoritative)
2. **Official IR** — `strategy.com/press`, `ir.coinbase.com`, etc.
3. **bitcointreasuries.net** — corporate + sovereign aggregator (cross-check against primary)
4. **`.gov`** — executive orders, treasury announcements, central-bank press
5. **Chainalysis** — `chainalysis.com/reports` for the Adoption Index
6. **Triple-A** — `triple-a.io/crypto-ownership` for ownership rates
7. **Statista** — for ownership rates (secondary; cross-check)

Press articles (CoinDesk, Bitcoin Magazine) as **context only**, never as the BTC-count source.

## Voice

`method` and `status` are the only prose in this file, and they are the most-read strings on the Adoption tab — one line per row, scanned dozens at a time.

**Explain by consequence, not by category.** The house model is already in this data: "Keeps all the BTC it mines", "Sold coins in July to raise cash", "Selling — most coins pledged against a loan due December", "Treasury — earns income selling options against its BTC". Each says what the company DOES. Compare with "Trading inventory" or "Exchange treasury (post-IPO)", which name a category and tell a newcomer nothing.

- **≤12 words.** These are labels, not sentences.
- **Spell out the shorthand a newcomer will not know:** DCA ("buys a fixed amount on a schedule"), self-mined ("keeps the coins it mines"), fiat ("government money"), treasury reserve ("holds BTC as company savings").
- Never SHOUT-CAPS, never an emoji in `method`/`status` (the `flag` field is the only place emoji belong).
- The full standard is `SCOPE.md` § "Audience & plain-language standard".

## Common pitfalls

- **Forgetting to re-sort.** Both holdings tables MUST be sorted by `btc` descending after any change.
- **Mixing seizures into strategic reserves.** UK/China hold BTC from seizures, not strategic policy. Reflect that in `method` / `status`.
- **Flag emoji mismatches.** Country name and flag must match — `🇸🇻` for El Salvador, not `🇸🇽`.
- **Adding rumor / unverified holdings.** Only publicly disclosed, primary-source-verifiable holdings.
- **Updating quarterly tables on a weekly run.** If Chainalysis / Triple-A haven't published fresh data, do not touch those tables.
- **Method / status thrash.** Don't rewrite phrasing unless the underlying strategy materially changed.
- **Forgetting to rebuild.** `dist/index.html` must match source.
