// llms.txt for dist/ - a short plain-text guide to this page for AI readers.
//
// Most AI fetchers do not run JavaScript. This page draws its live figures in
// the browser and bundles its curated content into the JS, so a reader that
// runs no script gets only the text rendition render-seo.mjs puts in the HTML.
// llms.txt tells that reader what the page is, how to read its probabilities
// and its Brier-scored track record, what not to conclude from them, where the
// live data comes from, and how to link to a tab or section.
//
// The prose is hand-written in scripts/llms.txt.tpl. Anything that moves is
// filled in from the modules the page itself uses: tab names and routes
// (src/lib), endpoints and polling intervals (src/lib/constants.js), the
// probability wording bands (SCOPE.md), the page's own staleness rule
// (src/components/shared.jsx), and the weekly analysis and track record
// (src/data). The "Current state" block is stamped with the data's own date,
// never the build date.
//
// Two rules shape the code:
//   1. The weekly refresh runs the build unattended, so nothing here may throw
//      or fail it. Odd data drops the stamped block; every other problem is a
//      warning prefixed "llms:". Quote and route drift are warnings too.
//   2. Output is ASCII only: the host sends .txt with no charset header.
//      Characters with no plain equivalent are dropped with a warning.
//
// Run directly:
//   node scripts/render-llms.mjs            print llms.txt from the current source
//   node scripts/render-llms.mjs --verify   check dist/llms.txt (npm run check:llms)
//
// The opening blockquote of llms.txt must equal this dashboard's row in
// JakePercy.com/content/llms/sites.json (summary + " " + caveat); that repo's
// scripts/check-llms.mjs compares them.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE = "https://jakepercy.com/bitcoin/";
const HUB = "https://jakepercy.com/llms.txt";
const MAX_BYTES = 10 * 1024; // the cap scripts/check-llms.mjs enforces in JakePercy.com
const QUOTE_MIN = 12; // a quoted string at least this long must still be on the page
const FALLBACK_STALE_DAYS = 10; // only if shared.jsx no longer states its own rule

// --- ASCII folding ---------------------------------------------------------

// Code points are written as numbers, never as literal symbols or unicode
// escapes: an editor or tool may decode an escape into the raw character, and an
// invisible one (a zero-width space inside a character class) would quietly
// change what the class matches.
const cp = (...codes) => String.fromCodePoint(...codes);
const oneOf = (...codes) => new RegExp("[" + cp(...codes) + "]", "g");
const around = (...codes) => new RegExp("\\s*[" + cp(...codes) + "]\\s*", "g");

const FOLD = [
  [oneOf(0x2018, 0x2019, 0x201A, 0x2032), "'"],
  [oneOf(0x201C, 0x201D, 0x201E, 0x2033), '"'],
  [around(0x2014, 0x2015), " - "],
  [oneOf(0x2010, 0x2011, 0x2012, 0x2013, 0x2212), "-"],
  [oneOf(0x2026), "..."],
  [around(0x00B7), ", "],
  [oneOf(0x2022, 0x25CF, 0x25AA), "-"],
  [oneOf(0x2192), "->"],
  [oneOf(0x2190), "<-"],
  [oneOf(0x00D7), "x"],
  [oneOf(0x2265), ">="],
  [oneOf(0x2264), "<="],
  [oneOf(0x2248), "~"],
  [oneOf(0x00B1), "+/-"],
  [oneOf(0x20AC), "EUR "],
  [oneOf(0x00A3), "GBP "],
  [oneOf(0x00A9), "(c)"],
  [oneOf(0x2122, 0x00AE), ""],
  [oneOf(0x20BF), "BTC "],
  [oneOf(0x00A0, 0x2002, 0x2003, 0x2007, 0x2009, 0x200A, 0x202F), " "],
  [oneOf(0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF, 0xFE0F), ""],
];
const COMBINING_MARKS = new RegExp("[" + cp(0x0300) + "-" + cp(0x036F) + "]", "g");
const FRACTION_SLASH = oneOf(0x2044);
// One row of the SCOPE.md band table: "| 0.05" + en dash, em dash or hyphen + "0.15 | "unlikely" |".
const BAND_ROW = new RegExp('^\\|\\s*(0\\.\\d+)\\s*[' + cp(0x2013, 0x2014) + '-]\\s*(0\\.\\d+)\\s*\\|\\s*"([^"]+)"\\s*\\|', "gm");

// Whatever is left above 0x7F after the map and NFKD is dropped, and recorded in
// `dropped` so the caller can warn: a silent drop is how garbled text gets out.
// NFKD turns a vulgar fraction into digits around U+2044 (the fraction slash),
// which must become "/" first or "1/2" would read as "12".
function ascii(s, dropped) {
  let out = String(s == null ? "" : s);
  for (const [re, to] of FOLD) out = out.replace(re, to);
  out = out.normalize("NFKD").replace(FRACTION_SLASH, "/").replace(COMBINING_MARKS, "");
  return out.replace(/[^\x00-\x7F]/gu, (c) => {
    if (dropped) dropped.add(`U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`);
    return "";
  });
}

const collapse = (s) => String(s).replace(/\s+/g, " ").trim();

// --- small helpers ---------------------------------------------------------

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const word = (n) => WORDS[n] ?? String(n);

const joinList = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`);
const pct = (p) => `${Math.round(p * 100)}%`;
const isProb = (p) => typeof p === "number" && Number.isFinite(p) && p > 0 && p < 1;
const text = (v) => (typeof v === "string" && v.trim() ? collapse(v) : "");
const endStop = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

// "SEP 26, 2026" -> "2026-09-26" without going through Date, so the result does
// not depend on the time zone of the machine that runs the build.
const MONTHS = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
function toIso(s) {
  const m = /^([A-Za-z]{3})[a-z]*\.? (\d{1,2}), (\d{4})$/.exec(String(s ?? "").trim());
  const mo = m && MONTHS[m[1].toUpperCase()];
  const d = m && Number(m[2]);
  if (!mo || !(d >= 1 && d <= 31)) return null;
  return `${m[3]}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// 30000 -> "every 30 seconds". The intervals are read from constants.js, so a
// retuned poll cannot leave a stale number in the file.
function every(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "on a timer";
  const s = Math.round(ms / 1000);
  if (s % 3600 === 0) return s === 3600 ? "every hour" : `every ${s / 3600} hours`;
  if (s % 60 === 0) return s === 60 ? "every minute" : `every ${s / 60} minutes`;
  return `every ${s} seconds`;
}

// --- sources outside src/data ----------------------------------------------

// SCOPE.md holds the wording bands the weekly writers must use ("close to a
// coin flip, leaning no" ...). Read the real table so a retuned band cannot
// falsify this file.
function loadBands(warn) {
  try {
    const src = readFileSync(join(ROOT, "SCOPE.md"), "utf8").replace(/\r\n/g, "\n");
    const start = src.indexOf("Verbal probability bands");
    if (start < 0) throw new Error("no 'Verbal probability bands' heading");
    const block = src.slice(start).split(/\n#{2,3} /)[0];
    const rows = [...block.matchAll(BAND_ROW)];
    const bands = rows
      .map((m) => ({ lo: Number(m[1]), hi: Number(m[2]), phrase: m[3] }))
      .filter((b) => b.lo <= b.hi);
    if (bands.length < 3) throw new Error("fewer than three band rows");
    return bands;
  } catch (e) {
    warn(`probability bands not read from SCOPE.md (${e.message}); the band sentence is left out`);
    return [];
  }
}

const bandFor = (bands, p) => bands.find((b) => p >= b.lo - 1e-9 && p <= b.hi + 1e-9);

// The page shows its own "this analysis is N days old" notice at a threshold
// (StaleNotice in shared.jsx). That is the rule this file's stamp follows.
function loadStaleDays(warn) {
  try {
    const src = readFileSync(join(ROOT, "src", "components", "shared.jsx"), "utf8");
    const m = /thresholdDays\s*=\s*(\d+)/.exec(src);
    if (!m || Number(m[1]) < 1) throw new Error("no thresholdDays default");
    return Number(m[1]);
  } catch (e) {
    warn(`stale-after days not read from shared.jsx (${e.message}); using ${FALLBACK_STALE_DAYS}`);
    return FALLBACK_STALE_DAYS;
  }
}

// --- the stamped block -------------------------------------------------------

// "Current state": the weekly analysis and the track record, stamped with the
// data's own date. Each part stands alone and is skipped, with a warning, if its
// data is not as expected; if nothing is usable the whole block is dropped.
function currentState({ da, led, bands, staleDays, warn }) {
  const stamp = text(da?.asOf);
  const iso = toIso(stamp);
  if (!iso) {
    warn(`DEEP_ANALYSIS.asOf is ${stamp ? `"${stamp}", not a "MMM D, YYYY" date` : "missing"}; the Current state block is dropped`);
    return "";
  }
  const parts = [];

  try {
    const headline = text(da.headline);
    if (headline) parts.push(`Headline of the weekly analysis, in the page's words: "${endStop(headline)}"`);
    else warn("DEEP_ANALYSIS.headline is missing; the headline is left out");
  } catch (e) {
    warn(`headline skipped (${e.message})`);
  }

  try {
    const pa = da.primaryAnalysis;
    const p = pa?.thesisProbability;
    if (!isProb(p)) throw new Error("primaryAnalysis.thesisProbability is not a probability");
    const band = bandFor(bands, p);
    const plain = text(pa.plain);
    let s = `The page puts a probability of ${pct(p)} on its main read playing out (shown as "Thesis ${pct(p)}"` +
      `${band ? `; in the page's wording bands, "${band.phrase}"` : ""})`;
    s += plain ? `, and restates that read as: "${endStop(plain)}"` : ".";
    const n = Array.isArray(pa.falsificationConditions) ? pa.falsificationConditions.filter(text).length : 0;
    if (n) s += ` It lists ${n} condition${n === 1 ? "" : "s"} under "How we'd be wrong".`;
    parts.push(s);
  } catch (e) {
    warn(`main-read probability skipped (${e.message})`);
  }

  try {
    const s = led?.summary;
    const cal = da.calibration;
    const okL = Number.isInteger(s?.nResolved) && s.nResolved > 0 && Number.isFinite(s?.aggregateBrier);
    const okC = Number.isInteger(cal?.nResolved) && cal.nResolved > 0 && Number.isFinite(cal?.aggregateBrier);
    if (okL && okC && (cal.nResolved !== s.nResolved || Math.abs(cal.aggregateBrier - s.aggregateBrier) > 0.005)) {
      warn("DEEP_ANALYSIS.calibration and FORECAST_LEDGER.summary disagree; using the ledger, which is what the page shows");
    }
    const src = okL ? s : okC ? cal : null;
    if (src) {
      const n = src.nResolved;
      let first = `${n} forecast${n === 1 ? "" : "s"} scored`;
      const oldest = okL ? (led.resolved ?? []).map((r) => toIso(r?.made)).filter(Boolean).sort()[0] : null;
      if (oldest) first += ` (the oldest made ${oldest})`;
      const bits = [first];
      if (okL && Number.isInteger(led.openCount)) bits.push(`${led.openCount} more still open and not yet scored`);
      const ledgerDate = okL ? toIso(led.asOf) : null;
      const lead = ledgerDate && ledgerDate !== iso ? `Track record (ledger as of ${ledgerDate})` : "Track record";
      parts.push(
        `${lead}: ${bits.join(", ")}; the all-time Brier score, over the scored forecasts only, is ${src.aggregateBrier.toFixed(2)} ` +
        "(0 is perfect, 1 is worst, 0.25 is what coin-flipping scores; lower is better).",
      );
    }
  } catch (e) {
    warn(`track record skipped (${e.message})`);
  }

  if (!parts.length) return "";
  return `**Current state (data as of ${iso}; treat as stale after ${staleDays} days).** ${parts.join(" ")}`;
}

// --- drift guards (warnings only) -------------------------------------------

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "copy-originals") walk(p, out);
    } else if (/\.(jsx?|mjs)$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

// What the page says, as plain ASCII with whitespace collapsed: index.html (the
// loading message), the static text in render-seo.mjs, and every module under
// src/. Docs are left out on purpose: a quote must be on the page itself. Two
// variants, because JSX splits a sentence across inline tags: one with tags left
// in, one with them stripped.
function pageCorpus(fold) {
  const files = [
    join(ROOT, "index.html"),
    join(ROOT, "scripts", "render-seo.mjs"),
    ...walk(join(ROOT, "src")),
  ];
  let raw = "";
  for (const f of files) {
    try {
      raw += `\n${readFileSync(f, "utf8")}`;
    } catch {
      /* a missing file only makes the check stricter */
    }
  }
  const decoded = raw
    .replace(/&mdash;/g, cp(0x2014))
    .replace(/&ndash;/g, cp(0x2013))
    .replace(/&rsquo;|&lsquo;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&hellip;/g, cp(0x2026))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  return [collapse(fold(decoded)), collapse(fold(decoded.replace(/<[^>]+>/g, "")))];
}

// Every double-quoted string in the template is a quotation from the page. If a
// weekly edit or a redesign rewords one, say so (never fail: this runs unattended).
// Folds here do not record dropped characters: the page is full of emoji and
// symbols that the output never contains.
function checkQuotes(tpl, warn) {
  const fold = (s) => ascii(s);
  const corpus = pageCorpus(fold);
  for (const [, q] of fold(tpl).matchAll(/"([^"\n]+)"/g)) {
    const quote = collapse(q);
    if (quote.length >= QUOTE_MIN && !corpus.some((c) => c.includes(quote))) {
      warn(`scripts/llms.txt.tpl quotes text that is no longer on the page: "${quote.slice(0, 100)}"`);
    }
  }
}

// The Views lines and the Addresses sentence are hand-written; routes.js decides
// what is real. Warn when the two stop agreeing.
function checkRoutes(tpl, routes, moves, warn) {
  const slugs = routes.TAB_SLUGS ?? [];
  const ids = Object.values(routes.ANCHORS ?? {}).filter((v) => typeof v === "string");
  for (const m of tpl.matchAll(/#\/([a-z]+)(?:\/([\w-]+))?/g)) {
    const [, slug, anchor] = m;
    if (!slugs.includes(slug)) {
      warn(`scripts/llms.txt.tpl links #/${slug}, which is not a tab in src/lib/routes.js`);
    } else if (anchor && !ids.includes(anchor) && !(/^thesis-move-\d+$/.test(anchor) && Number(anchor.split("-")[2]) < moves)) {
      warn(`scripts/llms.txt.tpl links #/${slug}/${anchor}, which is not an anchor in src/lib/routes.js`);
    }
  }
  for (const s of slugs) {
    if (!tpl.includes(`#/${s})`)) warn(`src/lib/routes.js has the tab "${s}" but scripts/llms.txt.tpl has no Views line for it`);
  }
  for (const id of ids) {
    if (!tpl.includes(id)) warn(`src/lib/routes.js has the anchor "${id}", which scripts/llms.txt.tpl does not mention`);
  }
  if (typeof routes.ANCHORS?.thesisMove === "function" && !tpl.includes("{{moveRange}}")) {
    warn("src/lib/routes.js can build thesis-move-N anchors but scripts/llms.txt.tpl has no {{moveRange}}");
  }
}

// The contract JakePercy.com/scripts/check-llms.mjs enforces, minus the sheet
// comparison and the target-exists check (verifyDist does that one).
export function lintLlms(body) {
  const problems = [];
  const bytes = Buffer.byteLength(body);
  if (bytes > MAX_BYTES) problems.push(`${bytes} bytes; the cap is ${MAX_BYTES}`);
  const bad = body.match(/[^\x00-\x7F]/u);
  if (bad) problems.push(`non-ASCII character ${JSON.stringify(bad[0])}`);
  if (/\{\{[^}]*\}\}/.test(body)) problems.push("unresolved {{placeholder}}");
  if (body.includes("_next/")) problems.push('contains "_next/"');
  const lines = body.split("\n");
  if (!/^# \S/.test(lines[0])) problems.push("first line is not an H1");
  if (lines.filter((l) => /^# /.test(l)).length !== 1) problems.push("more than one H1");
  if (!lines.some((l) => l.startsWith("> "))) problems.push("no blockquote summary");
  if (lines.some((l) => /^#{3,} /.test(l))) problems.push("headings deeper than H2");
  let section = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      section = line.slice(3);
    } else if (section && line.trim() && !/^- \[[^\]]+\]\([^)]+\)(: .+)?$/.test(line)) {
      problems.push(`"## ${section}" has a line that is not "- [title](url): note": ${line.slice(0, 70)}`);
    }
  }
  const links = [...body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  for (const u of links) if (!/^(https:\/\/|mailto:)/.test(u)) problems.push(`link is not absolute https: ${u}`);
  for (const u of [SITE, HUB]) if (!links.includes(u)) problems.push(`missing required link: ${u}`);
  return problems;
}

// --- render ----------------------------------------------------------------

// Never throws. Returns { text, warnings, asOf }; text is null only when the
// file cannot be built at all (no template, or no tab list to describe).
export async function renderLlms() {
  const warnings = [];
  const warn = (m) => warnings.push(m);
  const dropped = new Set();
  const fold = (s) => ascii(s, dropped);

  try {
    let tpl;
    try {
      tpl = readFileSync(join(ROOT, "scripts", "llms.txt.tpl"), "utf8").replace(/\r\n/g, "\n");
    } catch (e) {
      warn(`scripts/llms.txt.tpl not read (${e.message})`);
      return { text: null, warnings, asOf: null };
    }

    const load = async (rel) => {
      try {
        return await import(new URL(rel, import.meta.url).href);
      } catch (e) {
        warn(`${rel.replace("../", "")} not loaded (${e.message})`);
        return null;
      }
    };
    const [daMod, ledMod, newsMod, thesisMod, routes, consts] = await Promise.all([
      load("../src/data/deep-analysis.js"),
      load("../src/data/forecast-ledger.js"),
      load("../src/data/market-news.js"),
      load("../src/data/thesis.js"),
      load("../src/lib/routes.js"),
      load("../src/lib/constants.js"),
    ]);

    const C = consts ?? {};
    const tabs = Array.isArray(C.TABS) ? C.TABS : [];
    const slugs = Array.isArray(routes?.TAB_SLUGS) ? routes.TAB_SLUGS : [];
    if (!tabs.length || !slugs.length) {
      warn("no tab list in src/lib/constants.js and routes.js; llms.txt not built");
      return { text: null, warnings, asOf: null };
    }
    const feeds = (Array.isArray(newsMod?.NEWS_FEEDS) ? newsMod.NEWS_FEEDS : []).map((f) => f?.source).filter(Boolean);
    const moves = Array.isArray(thesisMod?.THESIS_FLOW) ? thesisMod.THESIS_FLOW.length : 0;

    const fill = {
      site: SITE,
      tabCount: word(tabs.length),
      tabNames: joinList(tabs),
      tabSlugs: joinList(slugs),
      moveRange: moves > 1 ? `thesis-move-0 to thesis-move-${moves - 1}` : moves === 1 ? "thesis-move-0" : "thesis-move-<n>",
      feedNames: feeds.length ? joinList(feeds) : "its news feeds",
      everyLive: every(C.LIVE_PRICE_POLL_MS),
      everyMarket: every(C.MARKET_DATA_POLL_MS),
      everyBlock: every(C.LAST_BLOCK_POLL_MS),
      everySlow: every(C.SLOW_DATA_POLL_MS),
      everyNews: every(C.NEWS_POLL_MS),
      everyLong: every(C.LONG_TERM_POLL_MS),
      everyMedium: every(C.MEDIUM_TERM_POLL_MS),
    };
    if (!feeds.length) warn('no NEWS_FEEDS in src/data/market-news.js; the feeds are called "its news feeds"');

    // Endpoint URLs come from constants.js. Leave a key out when its constant is
    // missing (the placeholder then shows up as unresolved) and warn if a host no
    // longer matches the name the template gives it.
    const endpoints = {
      coinbaseUrl: [C.COINBASE_TICKER_URL, "coinbase.com"],
      coingeckoUrl: [C.COINGECKO_MARKET_URL, "coingecko.com"],
      mempoolTipUrl: [C.MEMPOOL_BLOCK_URL, "mempool.space"],
      fearGreedUrl: [C.FEAR_GREED_URL, "alternative.me"],
      rss2jsonUrl: [typeof C.RSS2JSON_URL === "string" ? C.RSS2JSON_URL.split("?")[0] : "", "rss2json.com"],
      longTermUrl: [C.LONG_TERM_CHART_URL, "blockchain.info"],
      mediumUrl: [C.MEDIUM_TERM_CHART_URL, "coingecko.com"],
    };
    for (const [key, [url, host]] of Object.entries(endpoints)) {
      if (typeof url !== "string" || !url) continue;
      fill[key] = url;
      if (!url.includes(host)) warn(`${key} in constants.js is no longer on ${host}; update the wording in scripts/llms.txt.tpl`);
    }

    const bands = loadBands(warn);
    fill.bandSentence = bands.length
      ? "The collapsed summaries on the Analysis tab word each probability with a fixed phrase: " +
        `${bands.map((b) => `${Math.round(b.lo * 100)}-${Math.round(b.hi * 100)}% "${b.phrase}"`).join("; ")}. `
      : "";

    const staleDays = loadStaleDays(warn);
    const da = daMod?.DEEP_ANALYSIS;
    let asOf = null;
    if (da) {
      fill.current = currentState({ da, led: ledMod?.FORECAST_LEDGER, bands, staleDays, warn });
      asOf = fill.current ? toIso(text(da.asOf)) : null;
    } else {
      warn("DEEP_ANALYSIS not available; the Current state block is dropped");
      fill.current = "";
    }

    let out = tpl.replace(/\{\{(\w+)\}\}/g, (all, k) => (k in fill ? String(fill[k]) : all));
    out = fold(out)
      .replace(/[ \t]+$/gm, "")
      .replace(/ {2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\n+/, "")
      .replace(/\n*$/, "\n");

    for (const p of lintLlms(out)) warn(p);
    try {
      checkQuotes(tpl, warn);
    } catch (e) {
      warn(`quote check skipped (${e.message})`);
    }
    try {
      checkRoutes(tpl, routes, moves, warn);
    } catch (e) {
      warn(`route check skipped (${e.message})`);
    }
    if (dropped.size) warn(`characters with no ASCII equivalent were dropped: ${[...dropped].join(" ")}; add them to FOLD in scripts/render-llms.mjs`);

    return { text: out, warnings, asOf };
  } catch (e) {
    warn(`render failed (${e.message})`);
    return { text: null, warnings, asOf: null };
  }
}

// Called by finalizeDist (scripts/make-single-file.mjs) after index.html is
// written. Never throws, never fails the build.
export async function writeLlms(distDir) {
  try {
    const { text: body, warnings, asOf } = await renderLlms();
    for (const w of warnings) console.warn(`llms: ${w}`);
    if (body == null) {
      console.warn("llms: dist/llms.txt was not written");
      return null;
    }
    writeFileSync(join(distDir, "llms.txt"), body);
    console.log(`Wrote dist/llms.txt (${Buffer.byteLength(body)} bytes${asOf ? `, data as of ${asOf}` : ", no Current state block"})`);
    return { file: "llms.txt", bytes: Buffer.byteLength(body) };
  } catch (e) {
    console.warn(`llms: skipped - ${e.message}`);
    return null;
  }
}

// --- verify (npm run check:llms, and the last step of npm test) -------------

// Skipped when there is no build to check. Otherwise: the file exists, meets the
// contract, its links resolve inside dist/, the page points at it, and it is what
// the current source would generate (a stale file fails here, not on the host).
export async function verifyDist(distDir = join(ROOT, "dist")) {
  const problems = [];
  const index = join(distDir, "index.html");
  if (!existsSync(index)) return { skipped: true, problems };

  const file = join(distDir, "llms.txt");
  if (!existsSync(file)) {
    problems.push("dist/llms.txt is missing; run `npm run build`");
    return { skipped: false, problems };
  }
  const onDisk = readFileSync(file, "utf8");
  for (const p of lintLlms(onDisk)) problems.push(`dist/llms.txt: ${p}`);

  for (const m of onDisk.matchAll(/\]\(([^)\s]+)\)/g)) {
    const url = m[1];
    if (!url.startsWith(SITE)) continue;
    const rel = decodeURIComponent(url.slice(SITE.length).split(/[?#]/)[0]) || "index.html";
    if (!existsSync(join(distDir, rel))) problems.push(`dist/llms.txt links ${url}, which is not in dist/`);
  }

  const html = readFileSync(index, "utf8");
  if (!/<link[^>]+rel="alternate"[^>]+href="llms\.txt"/.test(html)) problems.push("dist/index.html has no head link to llms.txt");
  if (!/class="seo-llms"[^>]*>[^<]*<a href="llms\.txt"/.test(html)) problems.push("the static text in dist/index.html has no pointer to llms.txt");
  if (/<base\b/i.test(html)) problems.push("dist/index.html has a <base> tag, which would change how the relative llms.txt links resolve");

  const { text: fresh, warnings } = await renderLlms();
  problems.push(...warnings);
  if (fresh != null && fresh !== onDisk) problems.push("dist/llms.txt differs from what the current source generates; run `npm run build`");
  return { skipped: false, problems };
}

// --- command line ----------------------------------------------------------

const isDirectRun = (() => {
  if (!process.argv[1]) return false;
  const self = resolve(fileURLToPath(import.meta.url));
  const entry = resolve(process.argv[1]);
  return process.platform === "win32"
    ? self.toLowerCase() === entry.toLowerCase()
    : self === entry || pathToFileURL(entry).href === import.meta.url;
})();

if (isDirectRun) {
  if (process.argv.includes("--verify")) {
    const { skipped, problems } = await verifyDist();
    if (skipped) {
      console.log("check:llms - skipped (no dist/index.html; run `npm run build` first)");
    } else if (problems.length) {
      for (const p of problems) console.error(`  FAIL  ${p}`);
      console.error(`check:llms - ${problems.length} problem${problems.length === 1 ? "" : "s"}`);
      process.exit(1);
    } else {
      console.log("check:llms - clean (dist/llms.txt is present, valid and current)");
    }
  } else {
    const { text: body, warnings } = await renderLlms();
    for (const w of warnings) console.warn(`llms: ${w}`);
    if (body != null) process.stdout.write(body);
  }
}
