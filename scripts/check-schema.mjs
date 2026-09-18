#!/usr/bin/env node
// Schema gate for src/data/*.js — `npm run check:schema`, and the first half of `npm test`.
//
// scripts/check-plain.mjs measures the PROSE in these modules; this file measures their
// SHAPE: required exports, key sets, enums, date formats, sort order, the 0.05 probability
// grid, the forecast ledger's arithmetic, and the anchor ids that cross-tab links depend
// on. A violation here is a build-time TypeError, a literal "undefined" in the shipped
// HTML, or a link that scrolls nowhere — so every finding is a failure; there is no
// "soft" channel.
//
// Usage:
//   npm run check:schema
//   node scripts/check-schema.mjs
//   node scripts/check-schema.mjs --data-dir <dir>   # check fixture copies instead of src/data/
//
// Output: one line per violation — `file · path · message` — then a summary line.
// Exit codes: 0 clean · 1 any violation (including a module that fails to import).
//
// The two switches below gate modules that other work streams deliver. Ship with both
// true; flip one to false only while that stream is still in flight.

import { existsSync } from "node:fs";
import nodePath from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REQUIRE_THESIS_QUICK = true; // src/data/thesis.js must export THESIS_QUICK (the five-minute version)
const REQUIRE_FORECAST_LEDGER = true; // src/data/forecast-ledger.js must exist and export FORECAST_LEDGER

const ROOT = nodePath.resolve(nodePath.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const dataDirArg = argv[argv.indexOf("--data-dir") + 1];
const DATA_DIR = argv.includes("--data-dir") && dataDirArg ? nodePath.resolve(dataDirArg) : nodePath.join(ROOT, "src", "data");
const ROUTES_PATH = nodePath.join(ROOT, "src", "lib", "routes.js");

// ─────────────────────────────────────────────────────────────────────────────
// Collection + predicates
// ─────────────────────────────────────────────────────────────────────────────

const violations = [];
let modulesChecked = 0;
const fail = (file, path, message) => violations.push({ file, path, message });

const isStr = (v) => typeof v === "string";
const isText = (v) => typeof v === "string" && v.trim().length > 0;
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isInt = (v) => Number.isInteger(v);
const isBool = (v) => typeof v === "boolean";
const isArr = Array.isArray;
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isHttps = (v) => typeof v === "string" && /^https:\/\/\S+$/.test(v);
const show = (v) => (v === undefined ? "undefined" : JSON.stringify(v));

const MONTH_INDEX = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
const MONTHS = Object.keys(MONTH_INDEX).join("|");
const UPPER_ASOF_RE = new RegExp(`^(${MONTHS}) \\d{1,2}, \\d{4}$`); // "SEP 16, 2026" — uppercase, exactly
const MMMD_RE = new RegExp(`^(${MONTHS}) \\d{1,2}$`, "i"); // "Sep 16" / "SEP 16"
const LABEL_RE = new RegExp(`^\\S.* • (${MONTHS}) \\d{1,2}$`, "i"); // "REGULATION • SEP 15"
const ISO_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
const isISO = (v) => isStr(v) && ISO_RE.test(v) && !Number.isNaN(Date.parse(v));

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}''’\-‑.$%,]*/gu;
const wordCount = (s) => (String(s).match(WORD_RE) ?? []).length;

// "SEP 16, 2026" / "Sep 16, 2026" → UTC ms, or null.
function parseMDY(s) {
  const m = /^([A-Za-z]{3})[a-z]*\.? (\d{1,2}), (\d{4})$/.exec(String(s ?? "").trim());
  if (!m) return null;
  const mi = MONTH_INDEX[m[1].toUpperCase()];
  return mi == null ? null : Date.UTC(Number(m[3]), mi, Number(m[2]));
}

// "Sep 16" → UTC ms with the year inferred: this year, unless that lands more than a
// week in the future, in which case it is last year's (a "Dec 30" row read in January).
function parseMMMD(s, now) {
  const m = /^([A-Za-z]{3}) (\d{1,2})$/.exec(String(s ?? "").trim());
  if (!m) return null;
  const mi = MONTH_INDEX[m[1].toUpperCase()];
  if (mi == null) return null;
  const y = now.getUTCFullYear();
  const t = Date.UTC(y, mi, Number(m[2]));
  return t > now.getTime() + 7 * 864e5 ? Date.UTC(y - 1, mi, Number(m[2])) : t;
}

const isProbability = (p) => isNum(p) && p >= 0 && p <= 1;
const onGrid = (p) => Math.abs(Math.round(p * 100) % 5) < 1e-9; // multiple of 0.05
const isHalf = (p) => Math.abs(p - 0.5) < 1e-9;

const CATEGORY_ENUM = new Set(["regulation", "macro", "protocol", "corporate", "sovereign", "etf", "market-structure"]);
const STATUS_TONE_ENUM = new Set(["advancing", "active", "stalled", "passed"]);
const REGIME_ENUM = new Set(["reinforcing", "contagion"]);
const OUTCOME_VALUE = { hit: 1, miss: 0, partial: 0.5 };

// ─────────────────────────────────────────────────────────────────────────────
// Shared checks
// ─────────────────────────────────────────────────────────────────────────────

function requireText(file, base, obj, keys) {
  for (const k of keys) {
    if (!isText(obj?.[k])) fail(file, `${base}.${k}`, `missing or empty string (got ${show(obj?.[k])})`);
  }
}

function requireTypes(file, mod, spec) {
  // spec: [[exportName, "array" | "object" | "string" | "number"], …]
  for (const [name, type] of spec) {
    const v = mod[name];
    const ok =
      type === "array" ? isArr(v) : type === "object" ? isObj(v) : type === "string" ? isText(v) : type === "number" ? isNum(v) : false;
    if (!ok) fail(file, name, v === undefined ? `export missing (expected ${type})` : `expected ${type}, got ${isArr(v) ? "array" : typeof v}`);
  }
}

function checkSources(file, base, sources, { min = 1 } = {}) {
  if (!isArr(sources)) return fail(file, base, `sources must be an array (got ${show(sources)})`);
  if (sources.length < min) fail(file, base, `${sources.length} sources (min ${min})`);
  sources.forEach((s, i) => {
    if (!isText(s?.label)) fail(file, `${base}[${i}].label`, "missing label");
    if (!isHttps(s?.url)) fail(file, `${base}[${i}].url`, `url must start with https:// (got ${show(s?.url)})`);
  });
}

function checkWouldChange(file, base, value) {
  if (value === undefined || value === null) return; // optional
  if (!isText(value)) return fail(file, base, `wouldChange must be a non-empty string when present (got ${show(value)})`);
  const n = wordCount(value);
  if (n > 30) fail(file, base, `wouldChange is ${n} words (max 30 — one sentence, the observable falsifier)`);
}

function checkHeadlineRows(file, name, rows, { min = 0, max = Infinity, sorted = false } = {}) {
  if (!isArr(rows)) return fail(file, name, `must be an array (got ${show(rows)})`);
  if (rows.length < min || rows.length > max) {
    fail(file, name, `${rows.length} rows (expected ${max === Infinity ? `at least ${min}` : min === max ? `exactly ${min}` : `${min}–${max}`})`);
  }
  const now = new Date();
  let prev = null;
  rows.forEach((h, i) => {
    const base = `${name}[${i}]`;
    if (!isObj(h)) return fail(file, base, "row is not an object");
    if (!isStr(h.date) || !MMMD_RE.test(h.date)) fail(file, `${base}.date`, `expected "MMM D" (got ${show(h.date)})`);
    requireText(file, base, h, ["title", "source", "tag"]);
    if (h.important !== true) fail(file, `${base}.important`, `must be true (got ${show(h.important)})`);
    if (sorted) {
      const t = parseMMMD(h.date, now);
      if (t != null) {
        if (prev != null && t > prev.t) fail(file, `${base}.date`, `not sorted date-descending: "${h.date}" comes after "${prev.date}"`);
        prev = { t, date: h.date };
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Module loading
// ─────────────────────────────────────────────────────────────────────────────

async function importWithRetry(absPath, attempts = 2) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      // Cache-bust on retry; OneDrive can transiently lock a file mid-sync.
      const url = pathToFileURL(absPath).href + (i ? `?retry=${i}` : "");
      return await import(url);
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw lastErr;
}

// Returns the module, or null (after recording a violation when the module is required).
async function loadData(name, { required = true, why = "" } = {}) {
  const file = `src/data/${name}`;
  const abs = nodePath.join(DATA_DIR, name);
  if (!existsSync(abs)) {
    if (required) fail(file, "(module)", `data module not found${why ? ` — ${why}` : ""}`);
    return null;
  }
  try {
    const mod = await importWithRetry(abs);
    modulesChecked++;
    return mod;
  } catch (err) {
    fail(file, "(module)", `failed to import: ${String(err?.message ?? err).split("\n")[0]}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/market-news.js
// ─────────────────────────────────────────────────────────────────────────────

function checkMarketNews(mod) {
  const F = "src/data/market-news.js";

  const mt = mod.MARKET_THEME;
  if (!isObj(mt)) {
    fail(F, "MARKET_THEME", `export missing or not an object (got ${show(mt)})`);
  } else {
    requireText(F, "MARKET_THEME", mt, ["category", "title", "status", "narrative", "whyItMatters", "milestoneLabel", "milestone"]);
    if (!isStr(mt.asOf) || !UPPER_ASOF_RE.test(mt.asOf)) fail(F, "MARKET_THEME.asOf", `expected uppercase "MMM D, YYYY" (got ${show(mt.asOf)})`);
    if (!isISO(mt.refreshedAt)) fail(F, "MARKET_THEME.refreshedAt", `expected an ISO timestamp (got ${show(mt.refreshedAt)})`);
    if (!STATUS_TONE_ENUM.has(mt.statusTone)) fail(F, "MARKET_THEME.statusTone", `${show(mt.statusTone)} is not one of advancing | active | stalled | passed`);
    checkSources(F, "MARKET_THEME.sources", mt.sources);
    checkWouldChange(F, "MARKET_THEME.wouldChange", mt.wouldChange);
  }

  const cu = mod.CURATED_MARKET_UPDATES;
  if (!isArr(cu)) {
    fail(F, "CURATED_MARKET_UPDATES", `export missing or not an array (got ${show(cu)})`);
  } else {
    if (cu.length !== 4) fail(F, "CURATED_MARKET_UPDATES", `${cu.length} cards (the rail renders exactly 4)`);
    cu.forEach((u, i) => {
      const base = `CURATED_MARKET_UPDATES[${i}]`;
      if (!isObj(u)) return fail(F, base, "card is not an object");
      if (!isStr(u.label) || !LABEL_RE.test(u.label)) fail(F, `${base}.label`, `expected "CATEGORY • MMM D" (got ${show(u.label)})`);
      requireText(F, base, u, ["title", "plain", "detail"]);
      checkSources(F, `${base}.sources`, u.sources);
      if (u.statusTone !== undefined && !STATUS_TONE_ENUM.has(u.statusTone)) fail(F, `${base}.statusTone`, `${show(u.statusTone)} is not one of advancing | active | stalled | passed`);
      if (u.asOf !== undefined && (!isStr(u.asOf) || !UPPER_ASOF_RE.test(u.asOf))) fail(F, `${base}.asOf`, `expected uppercase "MMM D, YYYY" (got ${show(u.asOf)})`);
      checkWouldChange(F, `${base}.wouldChange`, u.wouldChange);
    });
  }

  const fn = mod.FALLBACK_NEWS;
  if (!isArr(fn)) {
    fail(F, "FALLBACK_NEWS", `export missing or not an array (got ${show(fn)})`);
  } else {
    if (fn.length > 4) fail(F, "FALLBACK_NEWS", `${fn.length} items (max 4)`);
    fn.forEach((n, i) => {
      const base = `FALLBACK_NEWS[${i}]`;
      if (!isObj(n)) return fail(F, base, "item is not an object");
      if (!isStr(n.date) || !MMMD_RE.test(n.date)) fail(F, `${base}.date`, `expected "MMM D" (got ${show(n.date)})`);
      requireText(F, base, n, ["title", "source", "tag"]);
      if (n.important !== undefined && !isBool(n.important)) fail(F, `${base}.important`, `must be boolean when present (got ${show(n.important)})`);
    });
  }

  const feeds = mod.NEWS_FEEDS;
  if (!isArr(feeds) || !feeds.length) {
    fail(F, "NEWS_FEEDS", `export missing or empty (got ${show(feeds)})`);
  } else {
    feeds.forEach((f, i) => {
      const base = `NEWS_FEEDS[${i}]`;
      if (!isObj(f)) return fail(F, base, "feed is not an object");
      if (!isHttps(f.url)) fail(F, `${base}.url`, `url must start with https:// (got ${show(f.url)})`);
      if (!isText(f.source)) fail(F, `${base}.source`, "missing source name");
      if (!isBool(f.btcOnly)) fail(F, `${base}.btcOnly`, `must be boolean (got ${show(f.btcOnly)})`);
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/headlines.js
// ─────────────────────────────────────────────────────────────────────────────

function checkHeadlines(mod) {
  const F = "src/data/headlines.js";
  checkHeadlineRows(F, "HISTORICAL_HIGHLIGHTS", mod.HISTORICAL_HIGHLIGHTS, { min: 10, max: 14, sorted: true });
  checkHeadlineRows(F, "SIX_MONTH_HIGHLIGHTS", mod.SIX_MONTH_HIGHLIGHTS);
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/deep-analysis.js  (v2 shape)
// ─────────────────────────────────────────────────────────────────────────────

function checkProbability(file, path, p, { allowHalf = false } = {}) {
  if (!isProbability(p)) return fail(file, path, `probability missing or out of [0, 1] (got ${show(p)})`);
  if (!onGrid(p)) fail(file, path, `probability ${p} is not a multiple of 0.05`);
  if (!allowHalf && isHalf(p)) fail(file, path, "probability 0.50 is a refusal, not a forecast");
}

function checkDeepAnalysis(mod) {
  const F = "src/data/deep-analysis.js";
  const d = mod.DEEP_ANALYSIS;
  if (!isObj(d)) return fail(F, "DEEP_ANALYSIS", `export missing or not an object (got ${show(d)})`);

  if (!isStr(d.asOf) || !UPPER_ASOF_RE.test(d.asOf)) fail(F, "asOf", `expected uppercase "MMM D, YYYY" (got ${show(d.asOf)})`);
  requireText(F, "DEEP_ANALYSIS", d, ["headline", "plainSummary", "marketContext"]);

  const pa = d.primaryAnalysis;
  if (!isObj(pa)) {
    fail(F, "primaryAnalysis", "missing object");
  } else {
    requireText(F, "primaryAnalysis", pa, ["themeTitle", "plain"]);
    checkProbability(F, "primaryAnalysis.thesisProbability", pa.thesisProbability);
    if (!isArr(pa.body) || !pa.body.length) fail(F, "primaryAnalysis.body", "must be a non-empty array of paragraphs (render-seo.mjs maps it)");
    else pa.body.forEach((p, i) => { if (!isText(p)) fail(F, `primaryAnalysis.body[${i}]`, "paragraph is not a non-empty string"); });
    const fc = pa.falsificationConditions;
    if (!isArr(fc)) fail(F, "primaryAnalysis.falsificationConditions", "must be an array (render-seo.mjs maps it)");
    else {
      if (fc.length < 3 || fc.length > 5) fail(F, "primaryAnalysis.falsificationConditions", `${fc.length} conditions (expected 3–5)`);
      fc.forEach((c, i) => { if (!isText(c)) fail(F, `primaryAnalysis.falsificationConditions[${i}]`, "condition is not a non-empty string"); });
    }
  }

  const cc = d.crossCurrents;
  if (!isArr(cc)) fail(F, "crossCurrents", "must be an array (render-seo.mjs maps it)");
  else {
    if (cc.length < 2 || cc.length > 3) fail(F, "crossCurrents", `${cc.length} cross-currents (expected 2–3)`);
    cc.forEach((c, i) => {
      const base = `crossCurrents[${i}]`;
      if (!isObj(c)) return fail(F, base, "entry is not an object");
      requireText(F, base, c, ["title", "plain", "body"]);
      if (!isArr(c.themesConnected)) fail(F, `${base}.themesConnected`, "must be an array (render-seo.mjs maps it)");
      else if (c.themesConnected.length < 2) fail(F, `${base}.themesConnected`, `${c.themesConnected.length} themes — a cross-current must connect at least 2`);
    });
  }

  const wl = d.watchList;
  if (!isArr(wl)) fail(F, "watchList", "must be an array (render-seo.mjs maps it)");
  else {
    if (wl.length < 4 || wl.length > 6) fail(F, "watchList", `${wl.length} rows (expected 4–6)`);
    wl.forEach((w, i) => {
      const base = `watchList[${i}]`;
      if (!isObj(w)) return fail(F, base, "row is not an object");
      requireText(F, base, w, ["event", "plain", "window", "signal"]);
      if (!CATEGORY_ENUM.has(w.category)) fail(F, `${base}.category`, `${show(w.category)} is not in the category enum (${[...CATEGORY_ENUM].join(" | ")})`);
      checkProbability(F, `${base}.probability`, w.probability);
    });
  }

  const ct = d.contrarianTake;
  if (!isObj(ct)) fail(F, "contrarianTake", "missing object");
  else {
    requireText(F, "contrarianTake", ct, ["plain", "body"]);
    checkProbability(F, "contrarianTake.probability", ct.probability);
    if (isNum(ct.probability) && (ct.probability < 0.1 || ct.probability > 0.45)) fail(F, "contrarianTake.probability", `must be within [0.10, 0.45] (got ${ct.probability})`);
  }

  const ti = d.themeInteractions;
  if (!isObj(ti)) fail(F, "themeInteractions", "missing object");
  else {
    if (!REGIME_ENUM.has(ti.regime)) fail(F, "themeInteractions.regime", `${show(ti.regime)} is not one of reinforcing | contagion`);
    if (!isArr(ti.pairs)) fail(F, "themeInteractions.pairs", "must be an array");
    if (!isArr(ti.adjustments)) fail(F, "themeInteractions.adjustments", "must be an array");
  }

  const cal = d.calibration;
  if (!isObj(cal)) fail(F, "calibration", "missing object (render-seo.mjs dereferences it)");
  else {
    if (cal.aggregateBrier !== null && !isNum(cal.aggregateBrier)) fail(F, "calibration.aggregateBrier", `must be a number, or null while seeding (got ${show(cal.aggregateBrier)})`);
    if (!isInt(cal.nResolved) || cal.nResolved < 0) fail(F, "calibration.nResolved", `must be a non-negative integer (got ${show(cal.nResolved)})`);
    if (!isText(cal.briefSummary)) fail(F, "calibration.briefSummary", "missing string");
  }

  checkSources(F, "sources", d.sources);
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/adoption.js
// ─────────────────────────────────────────────────────────────────────────────

function checkAdoption(mod) {
  const F = "src/data/adoption.js";
  const tables = [
    ["COUNTRY_HOLDINGS", ["country", "method", "status"]],
    ["COMPANY_HOLDINGS", ["company", "ticker", "status"]],
  ];
  for (const [name, textKeys] of tables) {
    const rows = mod[name];
    if (!isArr(rows)) { fail(F, name, `export missing or not an array (got ${show(rows)})`); continue; }
    let prev = null;
    rows.forEach((r, i) => {
      const base = `${name}[${i}]`;
      if (!isObj(r)) return fail(F, base, "row is not an object");
      requireText(F, base, r, textKeys);
      if (!isNum(r.btc) || r.btc < 0) { fail(F, `${base}.btc`, `btc must be a non-negative number (got ${show(r.btc)})`); return; }
      if (prev != null && r.btc > prev) fail(F, `${base}.btc`, `not sorted by btc descending (${r.btc} follows ${prev}) — re-sort after any row change`);
      prev = r.btc;
    });
  }

  const ad = mod.ADOPTION_DATA;
  if (!isArr(ad)) fail(F, "ADOPTION_DATA", `export missing or not an array (got ${show(ad)})`);
  else ad.forEach((a, i) => {
    if (!isObj(a)) return fail(F, `ADOPTION_DATA[${i}]`, "row is not an object");
    requireText(F, `ADOPTION_DATA[${i}]`, a, ["country", "region"]);
    if (!isNum(a.rate)) fail(F, `ADOPTION_DATA[${i}].rate`, `must be a number (got ${show(a.rate)})`);
  });

  const idx = mod.ADOPTION_INDEX_TOP20;
  if (!isArr(idx)) fail(F, "ADOPTION_INDEX_TOP20", `export missing or not an array (got ${show(idx)})`);
  else idx.forEach((c, i) => {
    if (!isObj(c)) return fail(F, `ADOPTION_INDEX_TOP20[${i}]`, "row is not an object");
    requireText(F, `ADOPTION_INDEX_TOP20[${i}]`, c, ["country"]);
    if (!isNum(c.score)) fail(F, `ADOPTION_INDEX_TOP20[${i}].score`, `must be a number (got ${show(c.score)})`);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/fallbacks.js
// ─────────────────────────────────────────────────────────────────────────────

function checkFallbacks(mod) {
  const F = "src/data/fallbacks.js";
  for (const name of ["FALLBACK_PRICE", "FALLBACK_ATH", "FALLBACK_MINED", "FALLBACK_BLOCK"]) {
    if (!isNum(mod[name]) || mod[name] <= 0) fail(F, name, `must be a positive number (got ${show(mod[name])})`);
  }
  if (isNum(mod.FALLBACK_PRICE) && isNum(mod.FALLBACK_ATH) && mod.FALLBACK_ATH < mod.FALLBACK_PRICE) {
    fail(F, "FALLBACK_ATH", `${mod.FALLBACK_ATH} is below FALLBACK_PRICE ${mod.FALLBACK_PRICE} — an all-time high cannot be under the current price`);
  }
  if (!isISO(mod.FALLBACK_ATH_DATE)) fail(F, "FALLBACK_ATH_DATE", `expected an ISO timestamp (got ${show(mod.FALLBACK_ATH_DATE)})`);

  const ys = mod.YARDSTICKS;
  if (!isArr(ys)) fail(F, "YARDSTICKS", `export missing or not an array (got ${show(ys)})`);
  else {
    const keys = new Set();
    ys.forEach((y, i) => {
      const base = `YARDSTICKS[${i}]`;
      if (!isObj(y)) return fail(F, base, "entry is not an object");
      requireText(F, base, y, ["key", "label", "unit", "plain"]);
      if (!isNum(y.value)) fail(F, `${base}.value`, `must be a number (got ${show(y.value)})`);
      if (!isISO(y.asOf)) fail(F, `${base}.asOf`, `expected an ISO date (got ${show(y.asOf)})`);
      if (!isHttps(y.source)) fail(F, `${base}.source`, `source must be an https URL (got ${show(y.source)})`);
      if (isStr(y.key)) {
        if (keys.has(y.key)) fail(F, `${base}.key`, `duplicate key "${y.key}"`);
        keys.add(y.key);
      }
    });
  }

  const optional = [
    ["ETF_COMPLEX_FALLBACK", { btc: isNum, aumUsd: isNum, asOf: isText, source: isText }],
    ["GLOBAL_CRYPTO_HOLDERS_FALLBACK", { holders: isNum, pctOfWorld: isNum, asOf: isText, source: isText }],
  ];
  for (const [name, shape] of optional) {
    const v = mod[name];
    if (v === undefined) continue;
    if (!isObj(v)) { fail(F, name, `must be an object when present (got ${show(v)})`); continue; }
    for (const [k, pred] of Object.entries(shape)) {
      if (!pred(v[k])) fail(F, `${name}.${k}`, `missing or wrong type (got ${show(v[k])})`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/glossary.js
// ─────────────────────────────────────────────────────────────────────────────

// The nineteen entries that predate the glossary file are the dashboard's own voice,
// not citations, and carry no source. Mirrors check-plain rule 16 exactly.
const LEGACY_TERM_KEYS = new Set([
  "hashrate", "halving", "difficulty", "dominance", "lightning", "etf", "probability",
  "brier", "distribution", "liquidation", "leverage", "deleveraging", "drawdown", "sats",
  "selfcustody", "coldstorage", "m2", "dca", "seedphrase",
]);

function checkGlossary(mod) {
  const F = "src/data/glossary.js";
  const g = mod.GLOSSARY;
  if (!isArr(g)) return fail(F, "GLOSSARY", `export missing or not an array (got ${show(g)})`);
  if (g.length > 80) fail(F, "GLOSSARY", `${g.length} entries (cap 80 — propose swaps instead of appending)`);
  const keys = new Set();
  g.forEach((e, i) => {
    const base = `GLOSSARY[${i}]`;
    if (!isObj(e)) return fail(F, base, "entry is not an object");
    const label = isStr(e.key) ? `GLOSSARY[${e.key}]` : base;
    requireText(F, label, e, ["key", "label", "plain"]);
    if (isStr(e.key)) {
      if (keys.has(e.key)) fail(F, label, `duplicate key "${e.key}"`);
      keys.add(e.key);
    }
    if (!LEGACY_TERM_KEYS.has(e.key) && !isHttps(e.source)) fail(F, `${label}.source`, `source must be an https URL (got ${show(e.source)}) — an unsourced definition renders on every tab forever`);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// src/lib/routes.js — anchor ids
// ─────────────────────────────────────────────────────────────────────────────

const SAFE_ANCHOR = /^[A-Za-z][\w-]*$/;

// Returns { ids: Set<string>, ok: boolean }. Function-valued anchors (thesisMove(i))
// are sampled for i in 0..8 so a link to "thesis-move-3" validates.
async function checkRoutes() {
  const F = "src/lib/routes.js";
  const ids = new Set();
  if (!existsSync(ROUTES_PATH)) { fail(F, "(module)", "routes module not found — cross-tab links cannot be validated"); return { ids, ok: false }; }
  let mod;
  try {
    mod = await importWithRetry(ROUTES_PATH);
  } catch (err) {
    fail(F, "(module)", `failed to import: ${String(err?.message ?? err).split("\n")[0]}`);
    return { ids, ok: false };
  }
  modulesChecked++;
  const anchors = mod.ANCHORS;
  if (!isObj(anchors)) { fail(F, "ANCHORS", `export missing or not an object (got ${show(anchors)})`); return { ids, ok: false }; }
  const seen = new Map();
  const add = (name, id) => {
    if (!isStr(id) || !SAFE_ANCHOR.test(id)) return fail(F, `ANCHORS.${name}`, `anchor id must match ${SAFE_ANCHOR} (got ${show(id)})`);
    if (seen.has(id) && seen.get(id) !== name) fail(F, `ANCHORS.${name}`, `anchor id "${id}" duplicates ANCHORS.${seen.get(id)}`);
    seen.set(id, name);
    ids.add(id);
  };
  for (const [name, v] of Object.entries(anchors)) {
    if (typeof v === "function") {
      for (let i = 0; i <= 8; i++) add(`${name}(${i})`, v(i));
    } else {
      add(name, v);
    }
  }
  const slugs = mod.TAB_SLUGS;
  if (!isArr(slugs) || slugs.length !== 6 || new Set(slugs).size !== 6 || !slugs.every(isText)) {
    fail(F, "TAB_SLUGS", `expected 6 unique non-empty slugs (got ${show(slugs)})`);
  }
  return { ids, ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/thesis.js
// ─────────────────────────────────────────────────────────────────────────────

function checkThesis(mod, routes) {
  const F = "src/data/thesis.js";
  requireTypes(F, mod, [
    ["THESIS_METRICS", "array"], ["THESIS_EPIGRAPH", "object"], ["MONEY_INTRO", "object"], ["MONEY_SCORECARD", "array"],
    ["SOFT_MONEY_COSTS", "array"], ["SILENT_TAX_M2_DATA", "array"], ["SILENT_TAX_CHAPTERS", "array"], ["SILENT_TAX_STEPS", "array"],
    ["SILENT_TAX_CODA", "object"], ["PP_BY_YEAR", "array"], ["MONEY_HISTORY", "array"], ["DIGITAL_SCARCITY", "object"],
    ["HARDNESS_DATA", "array"], ["PROPERTIES_MATRIX", "array"], ["MYTHS", "array"], ["TIME_PREFERENCE", "object"],
    ["TIME_PREFERENCE_STORY", "object"], ["THESIS_FLOW", "array"], ["POSITIONING_LENSES", "array"],
  ]);

  (isArr(mod.SILENT_TAX_M2_DATA) ? mod.SILENT_TAX_M2_DATA : []).forEach((r, i) => {
    for (const k of ["year", "m2", "pp"]) if (!isNum(r?.[k])) fail(F, `SILENT_TAX_M2_DATA[${i}].${k}`, `must be numeric (got ${show(r?.[k])}) — the scrolly chart reads this shape`);
  });
  (isArr(mod.PP_BY_YEAR) ? mod.PP_BY_YEAR : []).forEach((r, i) => {
    for (const k of ["year", "pp"]) if (!isNum(r?.[k])) fail(F, `PP_BY_YEAR[${i}].${k}`, `must be numeric (got ${show(r?.[k])})`);
  });
  if (isArr(mod.THESIS_FLOW)) {
    if (mod.THESIS_FLOW.length !== 4) fail(F, "THESIS_FLOW", `${mod.THESIS_FLOW.length} moves (the thesis is four moves)`);
    mod.THESIS_FLOW.forEach((f, i) => requireText(F, `THESIS_FLOW[${i}]`, f, ["step", "eyebrow", "title", "property", "implication"]));
  }
  // Keys scripts/render-seo.mjs dereferences with no guard.
  (isArr(mod.THESIS_METRICS) ? mod.THESIS_METRICS : []).forEach((m, i) => requireText(F, `THESIS_METRICS[${i}]`, m, ["value", "label", "sub"]));
  (isArr(mod.SOFT_MONEY_COSTS) ? mod.SOFT_MONEY_COSTS : []).forEach((c, i) => requireText(F, `SOFT_MONEY_COSTS[${i}]`, c, ["label", "title", "text", "stat"]));
  (isArr(mod.MONEY_HISTORY) ? mod.MONEY_HISTORY : []).forEach((m, i) => requireText(F, `MONEY_HISTORY[${i}]`, m, ["era", "name", "note"]));
  (isArr(mod.HARDNESS_DATA) ? mod.HARDNESS_DATA : []).forEach((h, i) => {
    requireText(F, `HARDNESS_DATA[${i}]`, h, ["name", "note"]);
    if (!isNum(h?.rate)) fail(F, `HARDNESS_DATA[${i}].rate`, `must be numeric (got ${show(h?.rate)})`);
  });
  (isArr(mod.PROPERTIES_MATRIX) ? mod.PROPERTIES_MATRIX : []).forEach((p, i) => {
    requireText(F, `PROPERTIES_MATRIX[${i}]`, p, ["property", "desc"]);
    for (const col of ["gold", "usd", "bitcoin"]) {
      if (!isObj(p?.[col]) || !isText(p[col].note)) fail(F, `PROPERTIES_MATRIX[${i}].${col}.note`, "missing (render-seo.mjs dereferences it)");
    }
  });
  if (isObj(mod.MONEY_INTRO)) {
    if (!isText(mod.MONEY_INTRO.headline)) fail(F, "MONEY_INTRO.headline", "missing string");
    if (!isArr(mod.MONEY_INTRO.body)) fail(F, "MONEY_INTRO.body", "must be an array of paragraphs");
  }
  if (isObj(mod.DIGITAL_SCARCITY) && !isArr(mod.DIGITAL_SCARCITY.steps)) fail(F, "DIGITAL_SCARCITY.steps", "must be an array");
  if (isObj(mod.TIME_PREFERENCE_STORY) && !isArr(mod.TIME_PREFERENCE_STORY.paragraphs)) fail(F, "TIME_PREFERENCE_STORY.paragraphs", "must be an array");
  if (isObj(mod.TIME_PREFERENCE)) {
    for (const side of ["soft", "hard"]) {
      const s = mod.TIME_PREFERENCE[side];
      if (!isObj(s) || !isText(s.label) || !isArr(s.items)) fail(F, `TIME_PREFERENCE.${side}`, "expected { label, items[] } (render-seo.mjs maps items)");
      else s.items.forEach((it, i) => requireText(F, `TIME_PREFERENCE.${side}.items[${i}]`, it, ["head", "tail"]));
    }
  }

  checkThesisQuick(F, mod.THESIS_QUICK, routes);
}

// THESIS_QUICK — the five-minute version. Shape is fixed by the shared contract:
//   { eyebrow, headline, intro,
//     cards: [ { key, num, title, plain, why, stat: { value, label, source: { label, url } }, link: { label, anchor } } × 3 ],
//     objections: { text, link: { label, anchor } },
//     closing: { text, next: { label, tab: 2 } } }
// Reading time is computed from word count at render time (ThesisTab.jsx's
// QUICK_READ_MINUTES) and is not a data field — a hand-written estimate would
// only ever drift from the rendered word count.
// Word caps on the prose fields are check-plain's job; this checks keys, types, the
// three-card count, and that every anchor is one routes.js actually defines.
function checkThesisQuick(F, q, routes) {
  if (q === undefined) {
    if (REQUIRE_THESIS_QUICK) {
      fail(F, "THESIS_QUICK", "export missing — the Thesis tab's five-minute version has not landed. It is written by the coordinator (see the shared contract); until it exists set REQUIRE_THESIS_QUICK = false at the top of scripts/check-schema.mjs");
    }
    return;
  }
  if (!isObj(q)) return fail(F, "THESIS_QUICK", `must be an object (got ${show(q)})`);
  requireText(F, "THESIS_QUICK", q, ["eyebrow", "headline", "intro"]);

  const checkLink = (base, link, { requireLabel = true } = {}) => {
    if (!isObj(link)) return fail(F, base, "missing { label, anchor }");
    if (requireLabel && !isText(link.label)) fail(F, `${base}.label`, "missing string");
    if (isText(link.label) && wordCount(link.label) > 8) fail(F, `${base}.label`, `${wordCount(link.label)} words (max 8)`);
    if (!isText(link.anchor)) return fail(F, `${base}.anchor`, "missing anchor id");
    if (!routes.ok) return; // routes.js already reported
    if (!routes.ids.has(link.anchor)) fail(F, `${base}.anchor`, `"${link.anchor}" is not an anchor id defined in src/lib/routes.js ANCHORS — the link would scroll nowhere`);
  };

  const cards = q.cards;
  if (!isArr(cards)) fail(F, "THESIS_QUICK.cards", `must be an array (got ${show(cards)})`);
  else {
    if (cards.length !== 3) fail(F, "THESIS_QUICK.cards", `${cards.length} cards (the five-minute version has exactly 3)`);
    const keys = new Set();
    cards.forEach((c, i) => {
      const base = `THESIS_QUICK.cards[${i}]`;
      if (!isObj(c)) return fail(F, base, "card is not an object");
      requireText(F, base, c, ["key", "num", "title", "plain", "why"]);
      if (isStr(c.key)) {
        if (keys.has(c.key)) fail(F, `${base}.key`, `duplicate key "${c.key}"`);
        keys.add(c.key);
      }
      if (!isObj(c.stat)) fail(F, `${base}.stat`, "missing { value, label, source }");
      else {
        if (c.stat.value === undefined || c.stat.value === null || c.stat.value === "") fail(F, `${base}.stat.value`, "missing");
        if (!isText(c.stat.label)) fail(F, `${base}.stat.label`, "missing string");
        else if (wordCount(c.stat.label) > 12) fail(F, `${base}.stat.label`, `${wordCount(c.stat.label)} words (max 12)`);
        if (!isObj(c.stat.source) || !isText(c.stat.source.label) || !isHttps(c.stat.source.url)) fail(F, `${base}.stat.source`, "expected { label, url: https://… }");
      }
      checkLink(`${base}.link`, c.link);
    });
  }

  if (!isObj(q.objections)) fail(F, "THESIS_QUICK.objections", "missing { text, link }");
  else {
    if (!isText(q.objections.text)) fail(F, "THESIS_QUICK.objections.text", "missing string");
    checkLink("THESIS_QUICK.objections.link", q.objections.link);
  }

  if (!isObj(q.closing)) fail(F, "THESIS_QUICK.closing", "missing { text, next }");
  else {
    if (!isText(q.closing.text)) fail(F, "THESIS_QUICK.closing.text", "missing string");
    const next = q.closing.next;
    if (!isObj(next) || !isText(next.label)) fail(F, "THESIS_QUICK.closing.next", "expected { label, tab: 2 }");
    else if (next.tab !== 2) fail(F, "THESIS_QUICK.closing.next.tab", `must be 2 (the Strategy tab); got ${show(next.tab)}`);
  }

  // Optional "door" into the long read — beyond the contract, but its phase links are
  // anchors too, and a typo there scrolls nowhere just the same.
  if (q.door !== undefined) {
    if (!isObj(q.door)) fail(F, "THESIS_QUICK.door", `must be an object when present (got ${show(q.door)})`);
    else if (q.door.phases !== undefined) {
      if (!isArr(q.door.phases)) fail(F, "THESIS_QUICK.door.phases", "must be an array");
      else q.door.phases.forEach((p, i) => {
        if (!isObj(p)) return fail(F, `THESIS_QUICK.door.phases[${i}]`, "phase is not an object");
        if (!isText(p.label)) fail(F, `THESIS_QUICK.door.phases[${i}].label`, "missing string");
        checkLink(`THESIS_QUICK.door.phases[${i}]`, p, { requireLabel: false });
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/strategy.js
// ─────────────────────────────────────────────────────────────────────────────

function checkStrategy(mod) {
  const F = "src/data/strategy.js";
  requireTypes(F, mod, [
    ["WORKED_EXAMPLE", "object"], ["RETAIL_REALITY", "object"], ["STRATEGY_RULES", "array"], ["CUSTODY_LADDER", "array"],
    ["ALLOCATION_BANDS", "array"], ["COMMON_MISTAKES", "array"], ["HISTORICAL_DRAWDOWNS", "array"], ["DRAWDOWN_CAVEAT", "string"],
    ["STRATEGY_EPIGRAPH", "object"], ["STRATEGY_SOURCES", "array"], ["DCA_WEEKLY_OPTIONS", "array"],
  ]);

  const we = mod.WORKED_EXAMPLE;
  if (isObj(we)) {
    if (!isArr(we.steps) || !we.steps.length) fail(F, "WORKED_EXAMPLE.steps", "must be a non-empty array");
    if (!isObj(we.outcome) || !isText(we.outcome.note)) fail(F, "WORKED_EXAMPLE.outcome", "expected { invested, satsAccumulated, note }");
    if (!isText(we.moral)) fail(F, "WORKED_EXAMPLE.moral", "missing string");
  }
  const rr = mod.RETAIL_REALITY;
  if (isObj(rr)) {
    requireText(F, "RETAIL_REALITY", rr, ["stat", "statLabel", "body"]);
    if (!isArr(rr.inversion)) fail(F, "RETAIL_REALITY.inversion", "must be an array");
    else rr.inversion.forEach((r, i) => requireText(F, `RETAIL_REALITY.inversion[${i}]`, r, ["kills", "tool", "body"]));
  }
  (isArr(mod.STRATEGY_RULES) ? mod.STRATEGY_RULES : []).forEach((r, i) => {
    requireText(F, `STRATEGY_RULES[${i}]`, r, ["num", "title"]);
    if (!isArr(r?.bullets) || !r.bullets.length || !r.bullets.every(isText)) fail(F, `STRATEGY_RULES[${i}].bullets`, "must be a non-empty array of strings");
  });
  (isArr(mod.CUSTODY_LADDER) ? mod.CUSTODY_LADDER : []).forEach((r, i) => requireText(F, `CUSTODY_LADDER[${i}]`, r, ["rung", "label", "holdsKeys", "good", "tradeoff"]));
  // Keys scripts/render-seo.mjs dereferences with no guard.
  (isArr(mod.ALLOCATION_BANDS) ? mod.ALLOCATION_BANDS : []).forEach((b, i) => requireText(F, `ALLOCATION_BANDS[${i}]`, b, ["band", "persona", "rationale"]));
  (isArr(mod.COMMON_MISTAKES) ? mod.COMMON_MISTAKES : []).forEach((m, i) => requireText(F, `COMMON_MISTAKES[${i}]`, m, ["title", "body"]));
  (isArr(mod.HISTORICAL_DRAWDOWNS) ? mod.HISTORICAL_DRAWDOWNS : []).forEach((d, i) => {
    requireText(F, `HISTORICAL_DRAWDOWNS[${i}]`, d, ["year", "label", "duration"]);
    if (!isNum(d?.drawdownPct)) fail(F, `HISTORICAL_DRAWDOWNS[${i}].drawdownPct`, `must be numeric (got ${show(d?.drawdownPct)})`);
  });
  if (isObj(mod.STRATEGY_EPIGRAPH)) {
    requireText(F, "STRATEGY_EPIGRAPH", mod.STRATEGY_EPIGRAPH, ["quote", "attribution"]);
    if (!isHttps(mod.STRATEGY_EPIGRAPH.url)) fail(F, "STRATEGY_EPIGRAPH.url", `must be an https URL (got ${show(mod.STRATEGY_EPIGRAPH.url)})`);
  }
  if (isArr(mod.STRATEGY_SOURCES)) checkSources(F, "STRATEGY_SOURCES", mod.STRATEGY_SOURCES);
  if (isArr(mod.DCA_WEEKLY_OPTIONS) && (!mod.DCA_WEEKLY_OPTIONS.length || !mod.DCA_WEEKLY_OPTIONS.every((n) => isNum(n) && n > 0))) {
    fail(F, "DCA_WEEKLY_OPTIONS", `must be a non-empty array of positive numbers (got ${show(mod.DCA_WEEKLY_OPTIONS)})`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// src/data/forecast-ledger.js
// ─────────────────────────────────────────────────────────────────────────────
// Contract (owner: /refresh-deep-analysis; rendered as "Track record" on the Analysis tab):
//   FORECAST_LEDGER = {
//     asOf: "SEP 16, 2026",
//     summary: { nResolved, aggregateBrier, rolling20Brier, plain,
//                byCategory: [{ category, n (≥3), meanResidual, plain }],
//                bands: [{ range, n, hitRate }] },
//     resolved: [ { id, made, window, resolvedOn, category, event, probability, outcome,
//                   brier, count, probabilities? (when count > 1), lesson, source: { label, url } } ],  // newest first
//     openCount,
//   }
//   sum(resolved[].count) === summary.nResolved

function checkForecastLedger(mod) {
  const F = "src/data/forecast-ledger.js";
  const L = mod.FORECAST_LEDGER;
  if (!isObj(L)) return fail(F, "FORECAST_LEDGER", `export missing or not an object (got ${show(L)})`);

  if (!isStr(L.asOf) || !UPPER_ASOF_RE.test(L.asOf)) fail(F, "asOf", `expected uppercase "MMM D, YYYY" (got ${show(L.asOf)})`);
  if (!isInt(L.openCount) || L.openCount < 0) fail(F, "openCount", `must be a non-negative integer (got ${show(L.openCount)})`);

  const s = L.summary;
  let nResolved = null;
  if (!isObj(s)) fail(F, "summary", "missing object");
  else {
    if (!isInt(s.nResolved) || s.nResolved < 0) fail(F, "summary.nResolved", `must be a non-negative integer (got ${show(s.nResolved)})`);
    else nResolved = s.nResolved;
    for (const k of ["aggregateBrier", "rolling20Brier"]) {
      const v = s[k];
      if (!isNum(v) || v < 0 || v > 1) fail(F, `summary.${k}`, `must be a number in [0, 1] (got ${show(v)})`);
      else if (Math.abs(Math.round(v * 100) / 100 - v) > 1e-9) fail(F, `summary.${k}`, `${v} has more than 2 decimals — the contract says 2`);
    }
    if (!isText(s.plain)) fail(F, "summary.plain", "missing string (the Tier 1 line that defines the Brier score in plain words)");

    if (!isArr(s.byCategory)) fail(F, "summary.byCategory", "must be an array");
    else {
      let catTotal = 0;
      const seen = new Set();
      s.byCategory.forEach((c, i) => {
        const base = `summary.byCategory[${i}]`;
        if (!isObj(c)) return fail(F, base, "entry is not an object");
        if (!CATEGORY_ENUM.has(c.category)) fail(F, `${base}.category`, `${show(c.category)} is not in the category enum`);
        else if (seen.has(c.category)) fail(F, `${base}.category`, `duplicate category "${c.category}"`);
        seen.add(c.category);
        if (!isInt(c.n) || c.n < 3) fail(F, `${base}.n`, `must be an integer of at least 3 (only categories with n ≥ 3 are listed); got ${show(c.n)}`);
        else catTotal += c.n;
        if (!isNum(c.meanResidual)) fail(F, `${base}.meanResidual`, `must be a number (got ${show(c.meanResidual)})`);
        if (!isText(c.plain)) fail(F, `${base}.plain`, "missing string");
      });
      if (nResolved != null && catTotal > nResolved) fail(F, "summary.byCategory", `category counts sum to ${catTotal}, more than nResolved ${nResolved}`);
    }

    if (!isArr(s.bands)) fail(F, "summary.bands", "must be an array");
    else {
      let bandTotal = 0;
      s.bands.forEach((b, i) => {
        const base = `summary.bands[${i}]`;
        if (!isObj(b)) return fail(F, base, "entry is not an object");
        if (!isText(b.range)) fail(F, `${base}.range`, "missing string");
        if (!isInt(b.n) || b.n < 0) fail(F, `${base}.n`, `must be a non-negative integer (got ${show(b.n)})`);
        else bandTotal += b.n;
        if (!isNum(b.hitRate) || b.hitRate < 0 || b.hitRate > 1) fail(F, `${base}.hitRate`, `must be a number in [0, 1] (got ${show(b.hitRate)})`);
        else if (isInt(b.n) && b.n > 0) {
          // A hitRate is really "k of n happened" with k a multiple of 0.5 (a
          // "partial" outcome counts as half) — the same round-trip the Track
          // record's own bandHits() does to print "4.5 of 11". If hitRate*n
          // doesn't land near a half-integer, the two numbers were not computed
          // from the same set of forecasts.
          const k = Math.round(b.hitRate * b.n * 2) / 2;
          const reconstructed = k / b.n;
          if (Math.abs(reconstructed - b.hitRate) > 0.01) {
            fail(F, `${base}.hitRate`, `${b.hitRate} over ${b.n} forecasts doesn't round-trip through a half-integer hit count (nearest is ${k} of ${b.n} = ${reconstructed.toFixed(3)})`);
          }
        }
      });
      if (nResolved != null && bandTotal !== nResolved) fail(F, "summary.bands", `band counts sum to ${bandTotal}, but nResolved is ${nResolved} — every resolved forecast sits in exactly one band`);
    }
  }

  const rows = L.resolved;
  if (!isArr(rows)) return fail(F, "resolved", "must be an array");
  const ids = new Set();
  let countTotal = 0;
  let brierWeighted = 0;
  let prevResolved = null;
  const categoryTotals = new Map(); // category -> sum of resolved[].count, for the byCategory cross-check below
  rows.forEach((r, i) => {
    const base = `resolved[${i}]`;
    if (!isObj(r)) return fail(F, base, "row is not an object");
    if (!isText(r.id)) fail(F, `${base}.id`, "missing id (stable slug)");
    else if (ids.has(r.id)) fail(F, `${base}.id`, `duplicate id "${r.id}"`);
    else ids.add(r.id);
    if (CATEGORY_ENUM.has(r.category) && isInt(r.count)) {
      categoryTotals.set(r.category, (categoryTotals.get(r.category) ?? 0) + r.count);
    }

    for (const k of ["made", "resolvedOn"]) {
      if (parseMDY(r[k]) == null) fail(F, `${base}.${k}`, `expected "MMM D, YYYY" (got ${show(r[k])})`);
    }
    requireText(F, base, r, ["window", "event", "lesson"]);
    if (!CATEGORY_ENUM.has(r.category)) fail(F, `${base}.category`, `${show(r.category)} is not in the category enum (${[...CATEGORY_ENUM].join(" | ")})`);
    if (!(r.outcome in OUTCOME_VALUE)) fail(F, `${base}.outcome`, `${show(r.outcome)} is not one of hit | miss | partial`);
    if (!isProbability(r.probability)) fail(F, `${base}.probability`, `probability missing or out of [0, 1] (got ${show(r.probability)})`);
    else if (!onGrid(r.probability)) fail(F, `${base}.probability`, `probability ${r.probability} is not a multiple of 0.05`);
    if (!isNum(r.brier) || r.brier < 0 || r.brier > 1) fail(F, `${base}.brier`, `must be a number in [0, 1] (got ${show(r.brier)})`);
    if (!isInt(r.count) || r.count < 1) fail(F, `${base}.count`, `must be an integer of at least 1 (got ${show(r.count)})`);
    else {
      countTotal += r.count;
      if (isNum(r.brier)) brierWeighted += r.brier * r.count;
      if (r.count === 1) {
        if (isProbability(r.probability) && r.outcome in OUTCOME_VALUE && isNum(r.brier)) {
          const expected = (r.probability - OUTCOME_VALUE[r.outcome]) ** 2;
          if (Math.abs(r.brier - expected) > 0.005 + 1e-9) {
            fail(F, `${base}.brier`, `${r.brier} but (${r.probability} − ${OUTCOME_VALUE[r.outcome]})² = ${expected.toFixed(4)} — more than 0.005 apart`);
          }
        }
      } else {
        const ps = r.probabilities;
        if (!isArr(ps) || ps.length !== r.count) fail(F, `${base}.probabilities`, `a grouped row (count ${r.count}) must list ${r.count} probabilities (got ${show(ps)})`);
        else ps.forEach((p, j) => {
          if (!isProbability(p)) fail(F, `${base}.probabilities[${j}]`, `out of [0, 1] (got ${show(p)})`);
          else if (!onGrid(p)) fail(F, `${base}.probabilities[${j}]`, `${p} is not a multiple of 0.05`);
        });
      }
    }
    if (!isObj(r.source) || !isText(r.source.label) || !isHttps(r.source.url)) fail(F, `${base}.source`, `expected { label, url: https://… } (got ${show(r.source)})`);

    const t = parseMDY(r.resolvedOn);
    if (t != null) {
      if (prevResolved != null && t > prevResolved.t) fail(F, `${base}.resolvedOn`, `rows must be newest first: "${r.resolvedOn}" comes after "${prevResolved.s}"`);
      prevResolved = { t, s: r.resolvedOn };
    }
  });

  if (nResolved != null && countTotal !== nResolved) fail(F, "summary.nResolved", `${nResolved}, but resolved[].count sums to ${countTotal} — the two must agree`);
  if (nResolved != null && countTotal === nResolved && nResolved > 0 && isNum(s?.aggregateBrier)) {
    const mean = brierWeighted / countTotal;
    if (Math.abs(mean - s.aggregateBrier) > 0.02) fail(F, "summary.aggregateBrier", `${s.aggregateBrier}, but the count-weighted mean of resolved[].brier is ${mean.toFixed(3)}`);
  }

  // Every category summary.byCategory names must equal the actual sum of
  // resolved[].count for that category — a hand-updated summary can drift
  // from the rows it's supposed to describe (e.g. after a new row lands in
  // an existing category without its n being bumped).
  if (isArr(s?.byCategory)) {
    s.byCategory.forEach((c, i) => {
      if (!isObj(c) || !CATEGORY_ENUM.has(c.category) || !isInt(c.n)) return; // already reported above
      const actual = categoryTotals.get(c.category) ?? 0;
      if (actual !== c.n) {
        fail(F, `summary.byCategory[${i}].n`, `says ${c.n} for "${c.category}", but resolved[] rows in that category sum to ${actual}`);
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEEP_ANALYSIS.calibration vs FORECAST_LEDGER.summary
// ─────────────────────────────────────────────────────────────────────────────
// Two hand-authored windows onto the same underlying score: the Analysis tab's
// calibration.briefSummary (rendered only in the crawler text — see
// render-seo.mjs) and the Track record's summary.plain. Nothing forces them to
// describe the same run; this catches the drift the redundancy invites,
// without deciding which one goes away (that's an editorial call for
// /refresh-deep-analysis, not this gate).

function checkLedgerCalibrationAgreement(deepMod, ledgerMod) {
  const cal = deepMod?.DEEP_ANALYSIS?.calibration;
  const summary = ledgerMod?.FORECAST_LEDGER?.summary;
  if (!isObj(cal) || !isObj(summary)) return; // each already reported by its own check
  const F = "src/data/deep-analysis.js";
  if (isInt(cal.nResolved) && isInt(summary.nResolved) && cal.nResolved !== summary.nResolved) {
    fail(F, "calibration.nResolved", `${cal.nResolved}, but FORECAST_LEDGER.summary.nResolved is ${summary.nResolved} — the two summaries of the same track record must agree`);
  }
  if (isNum(cal.aggregateBrier) && isNum(summary.aggregateBrier) && Math.abs(cal.aggregateBrier - summary.aggregateBrier) > 0.005) {
    fail(F, "calibration.aggregateBrier", `${cal.aggregateBrier}, but FORECAST_LEDGER.summary.aggregateBrier is ${summary.aggregateBrier} — the two summaries of the same track record must agree`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const routes = await checkRoutes();

  const marketNews = await loadData("market-news.js");
  if (marketNews) checkMarketNews(marketNews);

  const headlines = await loadData("headlines.js");
  if (headlines) checkHeadlines(headlines);

  const deep = await loadData("deep-analysis.js");
  if (deep) checkDeepAnalysis(deep);

  const adoption = await loadData("adoption.js");
  if (adoption) checkAdoption(adoption);

  const fallbacks = await loadData("fallbacks.js");
  if (fallbacks) checkFallbacks(fallbacks);

  const glossary = await loadData("glossary.js");
  if (glossary) checkGlossary(glossary);

  const thesis = await loadData("thesis.js");
  if (thesis) checkThesis(thesis, routes);

  const strategy = await loadData("strategy.js");
  if (strategy) checkStrategy(strategy);

  const ledger = await loadData("forecast-ledger.js", {
    required: REQUIRE_FORECAST_LEDGER,
    why: "the forecast ledger (Track record on the Analysis tab) is required; until it lands set REQUIRE_FORECAST_LEDGER = false at the top of scripts/check-schema.mjs",
  });
  if (ledger) checkForecastLedger(ledger);
  if (deep && ledger) checkLedgerCalibrationAgreement(deep, ledger);

  for (const v of violations) process.stdout.write(`${v.file} · ${v.path} · ${v.message}\n`);
  const files = new Set(violations.map((v) => v.file)).size;
  if (violations.length) {
    process.stdout.write(`\ncheck:schema — ${violations.length} violation${violations.length === 1 ? "" : "s"} in ${files} file${files === 1 ? "" : "s"} (${modulesChecked} modules checked)\n`);
    process.exit(1);
  }
  process.stdout.write(`check:schema — clean (${modulesChecked} modules checked)\n`);
  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(`check-schema failed: ${err?.stack ?? err}\n`);
  process.exit(1);
});
