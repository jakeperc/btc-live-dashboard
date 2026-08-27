// Fallback constants — used only if APIs fail. Live values come from CoinGecko / mempool.space.
// Owner: /refresh-fallbacks (quarterly).
// Do not Read src/BitcoinDashboard.jsx to edit these — edit this file instead.

export const FALLBACK_MINED = 20061706;
export const FALLBACK_BLOCK = 959762;
export const FALLBACK_PRICE = 63948;
export const FALLBACK_ATH = 126080.00;
export const FALLBACK_ATH_DATE = "2025-10-06T18:57:42.558Z";

// YARDSTICKS — the standing comparators that let prose turn a bare figure into a
// scale a newcomer can feel. "$100M per sale" means nothing; "$100M per sale —
// about a tenth of one normal week of ETF buying" means something.
//
// Owner: /refresh-fallbacks (monthly, alongside the constants above). Writers and
// /refresh-plain-language may compare any figure to a value here WITHOUT fresh
// research, and scripts/check-plain.mjs allows these values through the
// numeric-invariant check (rule 20) so a yardstick is never mistaken for drift.
//
// Rules for this table:
//   • Every entry carries `asOf` and `source`. No entry without a primary source.
//   • Round hard. These are for orders of magnitude, not accounting.
//   • `plain` is how the comparator reads inside a sentence, so write it to slot in.
//   • Stale is worse than missing: if you cannot re-source an entry, delete it.
export const YARDSTICKS = [
  {
    key: "btc-annual-issuance",
    label: "new bitcoin mined per year",
    value: 164250,
    unit: "BTC",
    plain: "about 164,000 new coins a year at the current block reward",
    asOf: "2026-08-21",
    source: "https://github.com/bitcoin/bitcoin", // protocol arithmetic: 3.125 BTC x 144 blocks x 365
  },
  {
    key: "btc-total-supply",
    label: "bitcoin that will ever exist",
    value: 21000000,
    unit: "BTC",
    plain: "21 million coins, ever",
    asOf: "2026-08-21",
    source: "https://github.com/bitcoin/bitcoin",
  },
  {
    key: "strategy-holdings",
    label: "Strategy's bitcoin holdings",
    value: 843775,
    unit: "BTC",
    plain: "Strategy alone holds about 844,000 coins",
    asOf: "2026-08-21",
    source: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001050446&type=8-K",
  },
  // TODO(/refresh-fallbacks): add on the next monthly run, each with a primary source —
  //   avg-weekly-etf-flow   (trailing 12-week mean net flow, Farside Investors)
  //   total-etf-aum         (combined US spot ETF assets)
  //   btc-daily-spot-volume (typical daily spot volume)
  //   us-m2                 (federalreserve.gov H.6)
  // Until they exist, prose must draw its yardstick from the story itself.
];
