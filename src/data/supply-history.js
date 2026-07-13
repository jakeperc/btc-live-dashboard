// Historical Bitcoin mined-supply anchors — % of the 21,000,000 cap mined at 00:00 UTC on Jan 1.
//
// DETERMINISTIC: minedBTC is a pure function of block height via the issuance schedule
// (50 → 25 → 12.5 → 6.25 → 3.125 BTC, halving every 210,000 blocks). Block heights were verified
// in exact agreement across mempool.space / blockchain.info / blockchain.com timestamp indexes;
// minedBTC and pctMined were then recomputed from the schedule (cumulative-at-epoch:
// 210k→10.5M, 420k→15.75M, 630k→18.375M, 840k→19.6875M; cap 21M), not eyeballed.
//
// These are static historical facts — not a refresh-skill domain, safe to leave as-is. The
// CURRENT/live point is NOT in this array; it is appended at render from the live mined supply,
// so the rightmost frontier and the hero number always equal the live (mined / 21,000,000).
export const SUPPLY_HISTORY = [
  { label: "Jan 1, 2013", year: 2013, blockHeight: 214562, minedBTC: 10614050, pctMined: 50.54 },
  { label: "Jan 1, 2016", year: 2016, blockHeight: 391181, minedBTC: 15029525, pctMined: 71.57 },
  { label: "Jan 1, 2018", year: 2018, blockHeight: 501960, minedBTC: 16774500, pctMined: 79.88 },
  { label: "Jan 1, 2020", year: 2020, blockHeight: 610690, minedBTC: 18133625, pctMined: 86.35 },
  { label: "Jan 1, 2021", year: 2021, blockHeight: 663912, minedBTC: 18586950, pctMined: 88.51 },
  { label: "Jan 1, 2022", year: 2022, blockHeight: 716598, minedBTC: 18916238, pctMined: 90.08 },
  { label: "Jan 1, 2023", year: 2023, blockHeight: 769786, minedBTC: 19248663, pctMined: 91.66 },
  { label: "Jan 1, 2024", year: 2024, blockHeight: 823785, minedBTC: 19586156, pctMined: 93.27 },
  { label: "Jan 1, 2025", year: 2025, blockHeight: 877258, minedBTC: 19803931, pctMined: 94.30 },
  { label: "Jan 1, 2026", year: 2026, blockHeight: 930340, minedBTC: 19969813, pctMined: 95.09 },
];
