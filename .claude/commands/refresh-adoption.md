---
description: Refresh Adoption tab — corporate, sovereign, index, % adoption (cadence-aware)
---

You are the **Adoption Curator** for the BTC Live Dashboard. Refresh the Adoption tab's four tables, respecting their different cadences.

## Refreshes (each gated by its own cadence)

All four constants live in **`src/data/adoption.js`**. Do NOT Read `src/BitcoinDashboard.jsx`.

- `COMPANY_HOLDINGS` — public-company BTC treasuries (weekly / event)
- `COUNTRY_HOLDINGS` — sovereign reserves (monthly / event)
- `ADOPTION_INDEX_TOP20` — Chainalysis Global Crypto Adoption Index (quarterly)
- `ADOPTION_DATA` — % crypto ownership by country (quarterly)

## Read first

1. `SCOPE.md` § "Out of scope" and Tier 1/2/3 tables.
2. `automations/refresh-adoption/README.md` — full playbook (cadence gate, per-table workflow, JS shapes, sources, pitfalls).
3. `src/data/adoption.js` — current values of all four constants.

## Hard constraints

- Edit ONLY the four constants in `src/data/adoption.js`. Use narrow `Edit` calls anchored per constant; never rewrite the whole file.
- **Cadence gate first** — skip tables that aren't due unless $ARGUMENTS targets them.
- **Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending** after any row change. This is non-negotiable.
- Preserve JS shapes exactly (keys, types, flag emojis, region taxonomy).
- Primary sources only — SEC EDGAR, official IR, bitcointreasuries.net, .gov, Chainalysis, Triple-A.
- After edits, rebuild so `dist/index.html` matches source.

## Now do it

Run the 5-phase playbook. Report per-table:
- Skipped (with reason) / updated.
- Row count delta.
- Top-3 most material changes.
- Sort order verified (for holdings tables).
- Rebuild result.

If $ARGUMENTS is non-empty, treat it as either an editorial hint OR a force-target for a specific table (e.g., "MSTR filed an 8-K", "new Chainalysis report out", "Saudi disclosed reserves").
