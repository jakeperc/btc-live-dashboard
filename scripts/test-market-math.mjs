#!/usr/bin/env node
// Regression tests for src/lib/market-math.js — run with `npm run test:math`.
//
// Each group guards a bug that shipped once:
//   • dailyStreak        — the "N-day green/red run" badge counted hourly moves.
//   • computeMaxDrawdown — the "5y window" row was fed all of history; the
//                          function itself must report the worst peak-to-trough
//                          of exactly the points it is given.
//   • computeDcaOutcome  — the chart series must be historical closes only (its
//                          last point once tracked the live price and drifted
//                          from the "Value today" figure).

import nodePath from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = nodePath.resolve(nodePath.dirname(fileURLToPath(import.meta.url)), "..");
const { dailyStreak, computeMaxDrawdown, computeDcaOutcome } =
  await import(pathToFileURL(nodePath.join(ROOT, "src", "lib", "market-math.js")).href);

let pass = 0;
let fail = 0;
function t(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else {
    fail++;
    console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
  }
}
const hourly = (f, n = 169) => Array.from({ length: n }, (_, i) => ({ price: f(i) }));

console.log("dailyStreak — days, not hours");
t("seven days of hourly falls is a 7-day red run", dailyStreak(hourly((i) => 1000 - i)), -7);
t("an hourly zigzag inside a rising week is still a green run", dailyStreak(hourly((i) => 100 + i + (i % 2 ? 0.5 : -0.5))), 7);
t("two up days after a fall count as 2", dailyStreak(hourly((i) => (i < 120 ? 300 - i : i))), 2);
t("a flat series has no run", dailyStreak(hourly(() => 5)), null);
t("under a day of data has no run", dailyStreak(hourly((i) => i, 20)), null);
t("empty and non-array inputs", [dailyStreak([]), dailyStreak(null), dailyStreak(undefined)], [null, null, null]);
t("a hole on a sampled point stops the walk there instead of throwing", dailyStreak(hourly((i) => i).map((p, i) => (i === 120 ? { price: null } : p))), 1);

console.log("computeMaxDrawdown — worst peak-to-trough of the given points");
const pts = [100, 120, 60, 90, 150, 105].map((price, i) => ({ price, date: `d${i}` }));
t("finds the 50% drop and its dates", computeMaxDrawdown(pts), { drawdownPct: 50, peakDate: "d1", troughDate: "d2" });
t("a rising series has no drawdown", computeMaxDrawdown(pts.slice(0, 2)).drawdownPct, 0);
t("too few points", computeMaxDrawdown([]), { drawdownPct: 0, peakDate: null, troughDate: null });
t("leading zero prices do not produce NaN", Number.isFinite(computeMaxDrawdown([{ price: 0, date: "a" }, { price: 0, date: "b" }, { price: 10, date: "c" }, { price: 5, date: "d" }]).drawdownPct), true);

console.log("computeDcaOutcome — series is history, tiles follow the live price");
const now = Date.now();
const day = 86400000;
const history = [400, 300, 200, 100].map((d, i) => ({ t: now - d * day, date: `p${i}`, price: [10, 20, 40, 80][i] }));
const out = computeDcaOutcome(history, 50, 100);
t("every plotted value is coins × that point's own close", out.series.map((p) => p.value), (() => {
  const per = (50 * 260) / 4; let btc = 0;
  return [10, 20, 40, 80].map((price) => { btc += per / price; return Math.round(btc * price); });
})());
t("the last plotted point is NOT repriced at spot", out.series[out.series.length - 1].value !== Math.round(out.currentValue), true);
t("value today uses the live price", Math.round(out.currentValue), Math.round(out.btcAccumulated * 100));
t("return is measured against money in", Number(out.roi.toFixed(6)), Number(((out.currentValue - out.totalInvested) / out.totalInvested).toFixed(6)));
t("points older than five years are left out", computeDcaOutcome([{ t: now - 6 * 365.25 * day, date: "old", price: 1 }, ...history], 50, 100).series.length, 4);
t("no price or no history gives zeros, not NaN", [computeDcaOutcome(history, 50, null).series.length, computeDcaOutcome([], 50, 100).roi, computeDcaOutcome(null, 50, 100).currentValue], [0, 0, 0]);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
