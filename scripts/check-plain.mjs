#!/usr/bin/env node
// Plain-language checker — owner: /refresh-plain-language (see automations/refresh-plain-language/README.md).
//
// Measures the rendered prose in src/data/*.js against the standard in
// SCOPE.md § "Audience & plain-language standard". Existing word caps were
// ignored 100% of the time because nothing measured them; this is the thing
// that measures them.
//
// Usage (always through npm so the sandbox permission for `npm run *` covers it):
//   npm run check:plain
//   npm run check:plain -- --file src/data/deep-analysis.js
//   npm run check:plain -- --snapshot
//   npm run check:plain -- --verify [path-to-snapshot]
//   npm run check:plain -- --preview-links
//   npm run check:plain -- --json
//
// Exit codes:
//   0  clean
//   1  soft findings only (style), or hard findings the Editor may not fix
//   2  hard findings in Editor-editable prose  → orchestrator re-runs the Editor once, then builds
//   3  STRUCTURAL  → do NOT build (import failure, missing render-critical key, bad enum,
//                    glossary integrity, numeric-invariant violation)
//
// Shape (key sets, enums, sort order, the forecast ledger's arithmetic) is the job of
// scripts/check-schema.mjs; this file keeps only the shape checks that guard its own
// field map. Every run also prints per-tab word totals against the tab budgets (rule
// 17) and an estimated reading time (rule 18) in the report header.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import nodePath from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = nodePath.resolve(nodePath.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = nodePath.join(ROOT, "src", "data");
const OUT_DIR = nodePath.join(ROOT, "automations", "refresh-plain-language");
const REPORT_PATH = nodePath.join(OUT_DIR, "last-check.md");

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const flagValue = (name) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return null;
  const next = argv[i + 1];
  return next && !next.startsWith("--") ? next : null;
};

const OPTS = {
  file: flagValue("file"),
  snapshot: flag("snapshot"),
  verify: flag("verify"),
  verifyPath: flagValue("verify"),
  previewLinks: flag("preview-links"),
  json: flag("json"),
  strict: flag("strict"), // readability:strict — caps 20% tighter
  quiet: flag("quiet"),
};

const CAP_SCALE = OPTS.strict ? 0.8 : 1;

// ─────────────────────────────────────────────────────────────────────────────
// Severity + finding collection
// ─────────────────────────────────────────────────────────────────────────────

const STRUCTURAL = "structural";
const HARD = "hard";
const SOFT = "soft";
const REPORT = "report";

const findings = [];
const notes = [];

function report({ rule, severity, file, field, tier, editable, message, excerpt }) {
  findings.push({
    rule,
    severity,
    file: file || "-",
    field: field || "-",
    tier: tier ?? null,
    editable: editable ?? null,
    message,
    excerpt: excerpt ? clip(excerpt) : null,
  });
}

function clip(s, n = 80) {
  const flat = String(s).replace(/\s+/g, " ").trim();
  return flat.length <= n ? flat : `${flat.slice(0, n - 1)}…`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Text utilities
// ─────────────────────────────────────────────────────────────────────────────

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}''’\-‑.$%,]*/gu;

function words(text) {
  return String(text).match(WORD_RE) ?? [];
}

function wordCount(text) {
  return words(text).length;
}

// Abbreviations that must not end a sentence. Guards "U.S. Senate", "Sep. 2",
// "$4.6B." and decimals from the naive /[.!?]\s/ split.
const ABBREV = [
  "u.s", "u.k", "e.g", "i.e", "vs", "etc", "approx", "no", "inc", "corp", "co", "ltd",
  "mr", "mrs", "ms", "dr", "prof", "sen", "rep", "gov", "st", "jr", "sr",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
];

function sentences(text) {
  let s = String(text);
  const PLACEHOLDER = "";

  // Protect decimals: 3.4 → 3<PH>4
  s = s.replace(/(\d)\.(\d)/g, `$1${PLACEHOLDER}$2`);
  // Protect known abbreviations (with optional internal periods).
  for (const abbr of ABBREV) {
    const pattern = abbr.replace(/\./g, "\\.");
    s = s.replace(new RegExp(`\\b${pattern}\\.`, "gi"), (m) => m.replace(/\./g, PLACEHOLDER));
  }
  // Protect single-letter initials: "J. Percy"
  s = s.replace(/\b([A-Z])\.(?=\s+[A-Z])/g, `$1${PLACEHOLDER}`);
  // Protect scale suffixes stuck to a period: "$4.6B." is handled by the decimal rule,
  // but "$390M." style needs the trailing period kept when followed by lowercase.
  s = s.replace(/\b([A-Z])\.(?=\s+[a-z])/g, `$1${PLACEHOLDER}`);

  const parts = s
    .split(/(?<=[.!?])["')\]]*\s+/)
    .map((p) => p.replace(new RegExp(PLACEHOLDER, "g"), ".").trim())
    .filter(Boolean);

  return parts.length ? parts : [String(text).trim()].filter(Boolean);
}

function syllables(word) {
  const w = String(word).toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w
    .replace(/(?:es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

function isProperNounToken(token, index) {
  // Capitalised and not the first word of the sentence.
  return index > 0 && /^[A-Z]/.test(token);
}

// ─────────────────────────────────────────────────────────────────────────────
// Load data modules
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

// Every module that carries rendered prose. All are required: a missing file is a
// structural finding (rule 1), because the tab that imports it would not build.
const DATA_FILES = [
  "deep-analysis.js", "market-news.js", "adoption.js", "headlines.js",
  "thesis.js", "strategy.js", "forecast-ledger.js",
];

// Loaded for reference only (YARDSTICKS feeds the rule-20 allow-list). Optional, and
// never a rule-1 failure — nothing in them is prose.
const REFERENCE_FILES = ["fallbacks.js"];

async function loadModules() {
  const mods = {};
  for (const name of DATA_FILES) {
    const abs = nodePath.join(DATA_DIR, name);
    if (!existsSync(abs)) {
      report({
        rule: "1-import",
        severity: STRUCTURAL,
        file: `src/data/${name}`,
        message: "data module not found",
      });
      continue;
    }
    try {
      mods[name] = await importWithRetry(abs);
    } catch (err) {
      report({
        rule: "1-import",
        severity: STRUCTURAL,
        file: `src/data/${name}`,
        message: `module failed to import: ${err.message}`,
      });
    }
  }
  for (const name of REFERENCE_FILES) {
    const abs = nodePath.join(DATA_DIR, name);
    if (!existsSync(abs)) continue;
    try {
      mods[name] = await importWithRetry(abs);
    } catch (err) {
      notes.push(`${name}: failed to import (${err.message}) — yardstick allow-list unavailable this run.`);
    }
  }
  // Optional — does not exist until WP2 lands.
  const glossaryPath = nodePath.join(DATA_DIR, "glossary.js");
  if (existsSync(glossaryPath)) {
    try {
      mods["glossary.js"] = await importWithRetry(glossaryPath);
    } catch (err) {
      report({
        rule: "16-glossary",
        severity: STRUCTURAL,
        file: "src/data/glossary.js",
        message: `glossary failed to import: ${err.message}`,
      });
    }
  }
  return mods;
}

// ─────────────────────────────────────────────────────────────────────────────
// Field map — the single source of truth for what is RENDERED, at which tier,
// and whether the Editor may touch it.
//
// Deliberately excluded:
//   • DEEP_ANALYSIS.themeInteractions.*  — internal bookkeeping, never rendered
//     (AnalysisTab.jsx and render-seo.mjs both ignore it), legitimately dialect.
//   • adoption `flag` / `country`        — flag emoji are by design.
//   • fallbacks.js                       — numeric constants; YARDSTICKS.plain is a
//                                          sentence fragment, never rendered alone.
//   • thesis/strategy chart labels, stats, eyebrows, attributed quotations and the
//     THESIS_QUICK "door" copy — fragments, not prose to be edited.
//
// Registered since the site upgrade: the long-form Thesis and Strategy prose (static,
// measured against a per-tab word budget — rule 17), THESIS_QUICK (the five-minute
// version), the forecast ledger's rendered lines, and `wouldChange` on the five
// market cards.
// ─────────────────────────────────────────────────────────────────────────────

const CAPS = {
  headline: 20,
  plainSummary: 45,
  marketContext: 100,
  themeTitle: 15,
  primaryPlain: 45,
  bodyPara: 120,
  bodyTotal: 650,
  falsification: 35,
  ccTitle: 15,
  ccPlain: 30,
  ccBody: 150,
  wlEvent: 25,
  wlPlain: 35,
  wlSignal: 100,
  contrarianPlain: 45,
  contrarianBody: 150,
  briefSummary: 60,
  mtTitle: 15,
  mtNarrative: 90,
  mtWhyItMatters: 60,
  mtMilestone: 60,
  cuTitle: 15,
  cuPlain: 30,
  cuDetail: 150,
  adoptionStatus: 12,
  archiveTitle: 35,
  // market cards — the falsifier hint, one sentence
  wouldChange: 30,
  // thesis.js — the long read
  thHeadline: 12,
  thIntroBody: 90,
  thScorecard: 60,
  thSoftCost: 70,
  thChapter: 60,
  thStep: 60,
  thCoda: 60,
  thIntlCase: 50,
  thScarcityStep: 90,
  thMyth: 70,
  thStoryPara: 80,
  thFlow: 80,
  thLens: 90,
  // thesis.js — THESIS_QUICK, the five-minute version
  tqHeadline: 12,
  tqIntro: 45,
  tqCardTitle: 8,
  tqCardPlain: 45,
  tqCardWhy: 60,
  tqCardBreaks: 45,
  tqObjections: 35,
  tqClosing: 45,
  // strategy.js
  stNote: 45,
  stRetailBody: 70,
  stInversion: 40,
  stRuleBullet: 45,
  stMistake: 80,
  stCaveat: 60,
  stCustody: 60,
  stBandRationale: 50,
  // forecast-ledger.js
  flSummaryPlain: 45,
  flCategoryPlain: 30,
  flLesson: 45,
  flEvent: 35,
};

// Rule 17 — per-tab word budget over every registered field in the module. The Thesis
// figure includes THESIS_QUICK (~350 words). Ceilings, not targets.
const TAB_BUDGETS = {
  "src/data/thesis.js": 4000,
  "src/data/strategy.js": 2300,
};

// Which tab each module renders on — for the reading-time line (rule 18).
const TAB_OF_FILE = {
  "src/data/market-news.js": "Dashboard",
  "src/data/thesis.js": "Thesis",
  "src/data/strategy.js": "Strategy",
  "src/data/headlines.js": "Headlines",
  "src/data/adoption.js": "Adoption",
  "src/data/deep-analysis.js": "Analysis",
  "src/data/forecast-ledger.js": "Analysis · Track record",
};

// The long-form Thesis and Strategy prose is static content. It is registered so it
// is measured; whether the Editor may rewrite it is this one switch. SCOPE.md's
// out-of-scope list still names both files, so the coordinator decides.
const STATIC_TAB_EDITABLE = false;

const cap = (k) => Math.round(CAPS[k] * CAP_SCALE);

function field(rec) {
  return { ctxProbability: null, kind: "prose", ...rec };
}

function collectFields(mods) {
  const out = [];

  // ── deep-analysis.js ──────────────────────────────────────────────────────
  const da = mods["deep-analysis.js"]?.DEEP_ANALYSIS;
  if (da) {
    const F = "src/data/deep-analysis.js";
    out.push(field({ file: F, path: "headline", card: "da:top", tier: 2, editable: true, cap: cap("headline"), text: da.headline, kind: "title" }));
    out.push(field({ file: F, path: "plainSummary", card: "da:top", tier: 1, editable: true, cap: cap("plainSummary"), text: da.plainSummary, kind: "plain" }));
    out.push(field({ file: F, path: "marketContext", card: "da:top", tier: 2, editable: true, cap: cap("marketContext"), text: da.marketContext }));

    const pa = da.primaryAnalysis ?? {};
    out.push(field({ file: F, path: "primaryAnalysis.themeTitle", card: "da:primary", tier: 2, editable: false, cap: cap("themeTitle"), text: pa.themeTitle, kind: "title" }));
    out.push(field({ file: F, path: "primaryAnalysis.plain", card: "da:primary", tier: 1, editable: true, cap: cap("primaryPlain"), text: pa.plain, kind: "plain" }));
    (pa.body ?? []).forEach((p, i) =>
      out.push(field({ file: F, path: `primaryAnalysis.body[${i}]`, card: "da:primary", tier: 2, editable: true, cap: cap("bodyPara"), text: p, kind: "body" }))
    );
    (pa.falsificationConditions ?? []).forEach((c, i) =>
      out.push(field({ file: F, path: `primaryAnalysis.falsificationConditions[${i}]`, card: "da:primary", tier: 3, editable: false, cap: cap("falsification"), text: c }))
    );

    (da.crossCurrents ?? []).forEach((c, i) => {
      const card = `da:cc[${i}]`;
      out.push(field({ file: F, path: `crossCurrents[${i}].title`, card, tier: 2, editable: true, cap: cap("ccTitle"), text: c.title, kind: "title" }));
      if (c.plain != null) out.push(field({ file: F, path: `crossCurrents[${i}].plain`, card, tier: 1, editable: true, cap: cap("ccPlain"), text: c.plain, kind: "plain" }));
      out.push(field({ file: F, path: `crossCurrents[${i}].body`, card, tier: 2, editable: true, cap: cap("ccBody"), text: c.body }));
    });

    (da.watchList ?? []).forEach((w, i) => {
      const card = `da:wl[${i}]`;
      const p = typeof w.probability === "number" ? w.probability : null;
      out.push(field({ file: F, path: `watchList[${i}].event`, card, tier: 3, editable: false, cap: cap("wlEvent"), text: w.event, ctxProbability: p }));
      if (w.plain != null) out.push(field({ file: F, path: `watchList[${i}].plain`, card, tier: 1, editable: true, cap: cap("wlPlain"), text: w.plain, kind: "plain", ctxProbability: p }));
      out.push(field({ file: F, path: `watchList[${i}].signal`, card, tier: 3, editable: true, cap: cap("wlSignal"), text: w.signal, ctxProbability: p }));
    });

    const ct = da.contrarianTake ?? {};
    const ctP = typeof ct.probability === "number" ? ct.probability : null;
    if (ct.plain != null) out.push(field({ file: F, path: "contrarianTake.plain", card: "da:contrarian", tier: 1, editable: true, cap: cap("contrarianPlain"), text: ct.plain, kind: "plain", ctxProbability: ctP }));
    out.push(field({ file: F, path: "contrarianTake.body", card: "da:contrarian", tier: 2, editable: true, cap: cap("contrarianBody"), text: ct.body, ctxProbability: ctP }));

    if (da.calibration?.briefSummary != null) {
      out.push(field({ file: F, path: "calibration.briefSummary", card: "da:calibration", tier: 3, editable: true, cap: cap("briefSummary"), text: da.calibration.briefSummary }));
    }
  }

  // ── market-news.js ────────────────────────────────────────────────────────
  const mt = mods["market-news.js"]?.MARKET_THEME;
  if (mt) {
    const F = "src/data/market-news.js";
    out.push(field({ file: F, path: "MARKET_THEME.title", card: "mt", tier: 2, editable: false, cap: cap("mtTitle"), text: mt.title, kind: "title" }));
    out.push(field({ file: F, path: "MARKET_THEME.narrative", card: "mt", tier: 2, editable: true, cap: cap("mtNarrative"), text: mt.narrative }));
    out.push(field({ file: F, path: "MARKET_THEME.whyItMatters", card: "mt", tier: 1, editable: true, cap: cap("mtWhyItMatters"), text: mt.whyItMatters }));
    out.push(field({ file: F, path: "MARKET_THEME.milestone", card: "mt", tier: 2, editable: true, cap: cap("mtMilestone"), text: mt.milestone }));
    if (mt.wouldChange != null) out.push(field({ file: F, path: "MARKET_THEME.wouldChange", card: "mt", tier: 2, editable: true, cap: cap("wouldChange"), text: mt.wouldChange }));
  }
  (mods["market-news.js"]?.CURATED_MARKET_UPDATES ?? []).forEach((u, i) => {
    const F = "src/data/market-news.js";
    const card = `cu[${i}]`;
    out.push(field({ file: F, path: `CURATED[${i}].title`, card, tier: 2, editable: false, cap: cap("cuTitle"), text: u.title, kind: "title" }));
    if (u.plain != null) out.push(field({ file: F, path: `CURATED[${i}].plain`, card, tier: 1, editable: true, cap: cap("cuPlain"), text: u.plain, kind: "plain" }));
    out.push(field({ file: F, path: `CURATED[${i}].detail`, card, tier: 2, editable: true, cap: cap("cuDetail"), text: u.detail }));
    if (u.wouldChange != null) out.push(field({ file: F, path: `CURATED[${i}].wouldChange`, card, tier: 2, editable: true, cap: cap("wouldChange"), text: u.wouldChange }));
  });
  (mods["market-news.js"]?.FALLBACK_NEWS ?? []).forEach((n, i) =>
    out.push(field({ file: "src/data/market-news.js", path: `FALLBACK_NEWS[${i}].title`, card: `fn[${i}]`, tier: 2, editable: false, cap: cap("archiveTitle"), text: n.title, kind: "title" }))
  );

  // ── adoption.js (short status/method strings only) ─────────────────────────
  const adoption = mods["adoption.js"] ?? {};
  for (const constName of ["COUNTRY_HOLDINGS", "COMPANY_HOLDINGS"]) {
    (adoption[constName] ?? []).forEach((row, i) => {
      for (const key of ["method", "status"]) {
        if (typeof row?.[key] !== "string" || !row[key].trim()) continue;
        out.push(field({
          file: "src/data/adoption.js",
          path: `${constName}[${i}].${key}`,
          card: `adoption:${constName}[${i}]`,
          tier: 2,
          editable: false, // Editor touches adoption only on an explicit hint.
          cap: cap("adoptionStatus"),
          text: row[key],
          kind: "fragment",
        }));
      }
    });
  }

  // ── headlines.js (archive titles — soft length only) ──────────────────────
  const headlines = mods["headlines.js"] ?? {};
  for (const constName of ["HISTORICAL_HIGHLIGHTS", "SIX_MONTH_HIGHLIGHTS"]) {
    (headlines[constName] ?? []).forEach((h, i) => {
      if (typeof h?.title !== "string") return;
      out.push(field({
        file: "src/data/headlines.js",
        path: `${constName}[${i}].title`,
        card: `headlines:${constName}[${i}]`,
        tier: 2,
        editable: false,
        cap: cap("archiveTitle"),
        text: h.title,
        kind: "title",
      }));
    });
  }

  // ── thesis.js (the static long read, plus THESIS_QUICK) ───────────────────
  const th = mods["thesis.js"];
  if (th) {
    const F = "src/data/thesis.js";
    const E = STATIC_TAB_EDITABLE;
    const mi = th.MONEY_INTRO;
    if (mi) {
      out.push(field({ file: F, path: "MONEY_INTRO.headline", card: "th:intro", tier: 2, editable: E, cap: cap("thHeadline"), text: mi.headline, kind: "title" }));
      (mi.body ?? []).forEach((p, i) => out.push(field({ file: F, path: `MONEY_INTRO.body[${i}]`, card: "th:intro", tier: 2, editable: E, cap: cap("thIntroBody"), text: p })));
    }
    (th.MONEY_SCORECARD ?? []).forEach((s, i) => out.push(field({ file: F, path: `MONEY_SCORECARD[${i}].body`, card: `th:scorecard[${i}]`, tier: 2, editable: E, cap: cap("thScorecard"), text: s?.body })));
    (th.SOFT_MONEY_COSTS ?? []).forEach((c, i) => out.push(field({ file: F, path: `SOFT_MONEY_COSTS[${i}].text`, card: `th:cost[${i}]`, tier: 2, editable: E, cap: cap("thSoftCost"), text: c?.text })));
    (th.SILENT_TAX_CHAPTERS ?? []).forEach((c, i) => out.push(field({ file: F, path: `SILENT_TAX_CHAPTERS[${i}].body`, card: `th:chapter[${i}]`, tier: 2, editable: E, cap: cap("thChapter"), text: c?.body })));
    (th.SILENT_TAX_STEPS ?? []).forEach((s, i) => out.push(field({ file: F, path: `SILENT_TAX_STEPS[${i}].body`, card: `th:step[${i}]`, tier: 1, editable: E, cap: cap("thStep"), text: s?.body })));
    if (th.SILENT_TAX_CODA?.body != null) out.push(field({ file: F, path: "SILENT_TAX_CODA.body", card: "th:coda", tier: 1, editable: E, cap: cap("thCoda"), text: th.SILENT_TAX_CODA.body }));
    (th.SILENT_TAX_INTL?.cases ?? []).forEach((c, i) => out.push(field({ file: F, path: `SILENT_TAX_INTL.cases[${i}].body`, card: `th:intl[${i}]`, tier: 2, editable: E, cap: cap("thIntlCase"), text: c?.body })));
    (th.DIGITAL_SCARCITY?.steps ?? []).forEach((s, i) => out.push(field({ file: F, path: `DIGITAL_SCARCITY.steps[${i}].body`, card: `th:scarcity[${i}]`, tier: 2, editable: E, cap: cap("thScarcityStep"), text: s?.body })));
    (th.MYTHS ?? []).forEach((m, i) => {
      const card = `th:myth[${i}]`;
      out.push(field({ file: F, path: `MYTHS[${i}].refutation`, card, tier: 2, editable: E, cap: cap("thMyth"), text: m?.refutation }));
      out.push(field({ file: F, path: `MYTHS[${i}].mechanism`, card, tier: 2, editable: E, cap: cap("thMyth"), text: m?.mechanism }));
    });
    (th.TIME_PREFERENCE_STORY?.paragraphs ?? []).forEach((p, i) => out.push(field({ file: F, path: `TIME_PREFERENCE_STORY.paragraphs[${i}]`, card: "th:story", tier: 1, editable: E, cap: cap("thStoryPara"), text: p })));
    (th.THESIS_FLOW ?? []).forEach((f, i) => {
      const card = `th:flow[${i}]`;
      out.push(field({ file: F, path: `THESIS_FLOW[${i}].property`, card, tier: 2, editable: E, cap: cap("thFlow"), text: f?.property }));
      out.push(field({ file: F, path: `THESIS_FLOW[${i}].implication`, card, tier: 2, editable: E, cap: cap("thFlow"), text: f?.implication }));
    });
    (th.POSITIONING_LENSES ?? []).forEach((l, i) => out.push(field({ file: F, path: `POSITIONING_LENSES[${i}].text`, card: `th:lens[${i}]`, tier: 2, editable: E, cap: cap("thLens"), text: l?.text })));

    // THESIS_QUICK — the five-minute version at the top of the tab. Guarded: absent
    // until the coordinator writes it (scripts/check-schema.mjs owns the shape).
    const tq = th.THESIS_QUICK;
    if (tq) {
      out.push(field({ file: F, path: "THESIS_QUICK.headline", card: "tq:top", tier: 2, editable: true, cap: cap("tqHeadline"), text: tq.headline, kind: "title" }));
      out.push(field({ file: F, path: "THESIS_QUICK.intro", card: "tq:top", tier: 1, editable: true, cap: cap("tqIntro"), text: tq.intro, kind: "plain" }));
      (tq.cards ?? []).forEach((c, i) => {
        const card = `tq:card[${i}]`;
        out.push(field({ file: F, path: `THESIS_QUICK.cards[${i}].title`, card, tier: 2, editable: true, cap: cap("tqCardTitle"), text: c?.title, kind: "title" }));
        out.push(field({ file: F, path: `THESIS_QUICK.cards[${i}].plain`, card, tier: 1, editable: true, cap: cap("tqCardPlain"), text: c?.plain, kind: "plain" }));
        out.push(field({ file: F, path: `THESIS_QUICK.cards[${i}].why`, card, tier: 2, editable: true, cap: cap("tqCardWhy"), text: c?.why }));
        if (c?.breaks != null) out.push(field({ file: F, path: `THESIS_QUICK.cards[${i}].breaks`, card, tier: 2, editable: true, cap: cap("tqCardBreaks"), text: c.breaks }));
      });
      if (tq.objections?.text != null) out.push(field({ file: F, path: "THESIS_QUICK.objections.text", card: "tq:objections", tier: 2, editable: true, cap: cap("tqObjections"), text: tq.objections.text }));
      if (tq.closing?.text != null) out.push(field({ file: F, path: "THESIS_QUICK.closing.text", card: "tq:closing", tier: 1, editable: true, cap: cap("tqClosing"), text: tq.closing.text, kind: "plain" }));
    }
  }

  // ── strategy.js (static) ──────────────────────────────────────────────────
  const st = mods["strategy.js"];
  if (st) {
    const F = "src/data/strategy.js";
    const E = STATIC_TAB_EDITABLE;
    const we = st.WORKED_EXAMPLE;
    if (we) {
      if (we.outcome?.note != null) out.push(field({ file: F, path: "WORKED_EXAMPLE.outcome.note", card: "st:example", tier: 1, editable: E, cap: cap("stNote"), text: we.outcome.note }));
      if (we.moral != null) out.push(field({ file: F, path: "WORKED_EXAMPLE.moral", card: "st:example", tier: 1, editable: E, cap: cap("stNote"), text: we.moral }));
    }
    const rr = st.RETAIL_REALITY;
    if (rr) {
      out.push(field({ file: F, path: "RETAIL_REALITY.body", card: "st:retail", tier: 2, editable: E, cap: cap("stRetailBody"), text: rr.body }));
      (rr.inversion ?? []).forEach((r, i) => out.push(field({ file: F, path: `RETAIL_REALITY.inversion[${i}].body`, card: "st:retail", tier: 1, editable: E, cap: cap("stInversion"), text: r?.body })));
    }
    (st.STRATEGY_RULES ?? []).forEach((r, i) =>
      (r?.bullets ?? []).forEach((b, j) => out.push(field({ file: F, path: `STRATEGY_RULES[${i}].bullets[${j}]`, card: `st:rule[${i}]`, tier: 1, editable: E, cap: cap("stRuleBullet"), text: b })))
    );
    (st.COMMON_MISTAKES ?? []).forEach((m, i) => out.push(field({ file: F, path: `COMMON_MISTAKES[${i}].body`, card: `st:mistake[${i}]`, tier: 2, editable: E, cap: cap("stMistake"), text: m?.body })));
    if (st.DRAWDOWN_CAVEAT != null) out.push(field({ file: F, path: "DRAWDOWN_CAVEAT", card: "st:drawdowns", tier: 2, editable: E, cap: cap("stCaveat"), text: st.DRAWDOWN_CAVEAT }));
    (st.CUSTODY_LADDER ?? []).forEach((r, i) => {
      const card = `st:custody[${i}]`;
      out.push(field({ file: F, path: `CUSTODY_LADDER[${i}].good`, card, tier: 2, editable: E, cap: cap("stCustody"), text: r?.good }));
      out.push(field({ file: F, path: `CUSTODY_LADDER[${i}].tradeoff`, card, tier: 2, editable: E, cap: cap("stCustody"), text: r?.tradeoff }));
    });
    (st.ALLOCATION_BANDS ?? []).forEach((b, i) => out.push(field({ file: F, path: `ALLOCATION_BANDS[${i}].rationale`, card: `st:band[${i}]`, tier: 2, editable: E, cap: cap("stBandRationale"), text: b?.rationale })));
  }

  // ── forecast-ledger.js (Track record on the Analysis tab) ─────────────────
  const fl = mods["forecast-ledger.js"]?.FORECAST_LEDGER;
  if (fl) {
    const F = "src/data/forecast-ledger.js";
    if (fl.summary?.plain != null) out.push(field({ file: F, path: "FORECAST_LEDGER.summary.plain", card: "fl:summary", tier: 1, editable: true, cap: cap("flSummaryPlain"), text: fl.summary.plain, kind: "plain" }));
    (fl.summary?.byCategory ?? []).forEach((c, i) => out.push(field({ file: F, path: `FORECAST_LEDGER.summary.byCategory[${i}].plain`, card: "fl:summary", tier: 2, editable: true, cap: cap("flCategoryPlain"), text: c?.plain, kind: "plain" })));
    (fl.resolved ?? []).forEach((r, i) => {
      const card = `fl:resolved[${i}]`;
      // The scoring letter — read-only, like watchList[].event: the forecast was
      // scored against this exact wording, so rewording it rewrites the test.
      out.push(field({ file: F, path: `FORECAST_LEDGER.resolved[${i}].event`, card, tier: 3, editable: false, cap: cap("flEvent"), text: r?.event }));
      out.push(field({ file: F, path: `FORECAST_LEDGER.resolved[${i}].lesson`, card, tier: 2, editable: true, cap: cap("flLesson"), text: r?.lesson }));
    });
  }

  return out.filter((f) => typeof f.text === "string" && f.text.trim());
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 2 / 3 — structure and shape
// ─────────────────────────────────────────────────────────────────────────────

// Keys scripts/render-seo.mjs dereferences at build time. A missing one is a
// build-time TypeError or a literal "undefined" in the shipped HTML, so these
// are STRUCTURAL, not prose findings.
function checkRequiredKeys(mods) {
  const F = "src/data/deep-analysis.js";
  const da = mods["deep-analysis.js"]?.DEEP_ANALYSIS;
  if (!da) {
    if (mods["deep-analysis.js"]) {
      report({ rule: "2-keys", severity: STRUCTURAL, file: F, message: "DEEP_ANALYSIS export missing" });
    }
    return;
  }

  const structural = [
    ["asOf", da.asOf],
    ["headline", da.headline],
    ["marketContext", da.marketContext],
    ["primaryAnalysis.themeTitle", da.primaryAnalysis?.themeTitle],
    ["primaryAnalysis.thesisProbability", da.primaryAnalysis?.thesisProbability],
    ["contrarianTake.probability", da.contrarianTake?.probability],
    ["contrarianTake.body", da.contrarianTake?.body],
    ["calibration.aggregateBrier", da.calibration?.aggregateBrier],
    ["calibration.nResolved", da.calibration?.nResolved],
  ];
  for (const [name, value] of structural) {
    if (value === undefined || value === null) {
      report({ rule: "2-keys", severity: STRUCTURAL, file: F, field: name, message: "required key missing (render-seo.mjs dereferences it)" });
    }
  }

  // Arrays that scripts/render-seo.mjs calls .map() on with no guard: a missing one
  // is a build-time TypeError, so the checker is also the pre-build shape gate.
  const requiredArrays = [
    [F, "primaryAnalysis.body", da.primaryAnalysis?.body],
    [F, "primaryAnalysis.falsificationConditions", da.primaryAnalysis?.falsificationConditions],
    [F, "crossCurrents", da.crossCurrents],
    [F, "watchList", da.watchList],
    [F, "sources", da.sources],
    ["src/data/market-news.js", "CURATED_MARKET_UPDATES", mods["market-news.js"]?.CURATED_MARKET_UPDATES],
    ["src/data/headlines.js", "HISTORICAL_HIGHLIGHTS", mods["headlines.js"]?.HISTORICAL_HIGHLIGHTS],
    ["src/data/headlines.js", "SIX_MONTH_HIGHLIGHTS", mods["headlines.js"]?.SIX_MONTH_HIGHLIGHTS],
    ["src/data/adoption.js", "COUNTRY_HOLDINGS", mods["adoption.js"]?.COUNTRY_HOLDINGS],
    ["src/data/adoption.js", "COMPANY_HOLDINGS", mods["adoption.js"]?.COMPANY_HOLDINGS],
    ["src/data/adoption.js", "ADOPTION_DATA", mods["adoption.js"]?.ADOPTION_DATA],
    ["src/data/adoption.js", "ADOPTION_INDEX_TOP20", mods["adoption.js"]?.ADOPTION_INDEX_TOP20],
    ["src/data/thesis.js", "THESIS_METRICS", mods["thesis.js"]?.THESIS_METRICS],
    ["src/data/thesis.js", "SOFT_MONEY_COSTS", mods["thesis.js"]?.SOFT_MONEY_COSTS],
    ["src/data/thesis.js", "MONEY_HISTORY", mods["thesis.js"]?.MONEY_HISTORY],
    ["src/data/thesis.js", "HARDNESS_DATA", mods["thesis.js"]?.HARDNESS_DATA],
    ["src/data/thesis.js", "PROPERTIES_MATRIX", mods["thesis.js"]?.PROPERTIES_MATRIX],
    ["src/data/thesis.js", "THESIS_FLOW", mods["thesis.js"]?.THESIS_FLOW],
    ["src/data/thesis.js", "TIME_PREFERENCE.soft.items", mods["thesis.js"]?.TIME_PREFERENCE?.soft?.items],
    ["src/data/thesis.js", "TIME_PREFERENCE.hard.items", mods["thesis.js"]?.TIME_PREFERENCE?.hard?.items],
    ["src/data/strategy.js", "ALLOCATION_BANDS", mods["strategy.js"]?.ALLOCATION_BANDS],
    ["src/data/strategy.js", "COMMON_MISTAKES", mods["strategy.js"]?.COMMON_MISTAKES],
    ["src/data/strategy.js", "HISTORICAL_DRAWDOWNS", mods["strategy.js"]?.HISTORICAL_DRAWDOWNS],
    ["src/data/strategy.js", "STRATEGY_SOURCES", mods["strategy.js"]?.STRATEGY_SOURCES],
  ];
  for (const [file, name, value] of requiredArrays) {
    if (!Array.isArray(value)) {
      report({ rule: "2-keys", severity: STRUCTURAL, file, field: name, message: "required array missing or renamed — render-seo.mjs maps it, so the build would fail" });
    }
  }
  if (!mods["market-news.js"]?.MARKET_THEME) {
    report({ rule: "2-keys", severity: STRUCTURAL, file: "src/data/market-news.js", field: "MARKET_THEME", message: "required export missing" });
  }
  if (mods["forecast-ledger.js"] && !mods["forecast-ledger.js"].FORECAST_LEDGER) {
    report({ rule: "2-keys", severity: STRUCTURAL, file: "src/data/forecast-ledger.js", field: "FORECAST_LEDGER", message: "required export missing — the Track record section renders it" });
  }
  (da.crossCurrents ?? []).forEach((c, i) => {
    if (!Array.isArray(c.themesConnected)) {
      report({ rule: "2-keys", severity: STRUCTURAL, file: F, field: `crossCurrents[${i}].themesConnected`, message: "required array missing (render-seo.mjs maps it)" });
    }
    if (!c.body) {
      report({ rule: "2-keys", severity: STRUCTURAL, file: F, field: `crossCurrents[${i}].body`, message: "required key missing" });
    }
  });

  // The plain layer. Missing = hard (Editor/drafter can author it), never structural:
  // nothing in the build dereferences these, and they do not exist before WP4.
  const plainMissing = [];
  if (da.plainSummary == null) plainMissing.push("plainSummary");
  if (da.primaryAnalysis?.plain == null) plainMissing.push("primaryAnalysis.plain");
  if (da.contrarianTake?.plain == null) plainMissing.push("contrarianTake.plain");
  (da.crossCurrents ?? []).forEach((c, i) => { if (c.plain == null) plainMissing.push(`crossCurrents[${i}].plain`); });
  (da.watchList ?? []).forEach((w, i) => { if (w.plain == null) plainMissing.push(`watchList[${i}].plain`); });
  for (const name of plainMissing) {
    report({ rule: "2b-plain-missing", severity: HARD, file: F, field: name, tier: 1, editable: true, message: "plain-language field missing — this is the collapsed/default view" });
  }

  (mods["market-news.js"]?.CURATED_MARKET_UPDATES ?? []).forEach((u, i) => {
    if (u.plain == null) {
      report({ rule: "2b-plain-missing", severity: HARD, file: "src/data/market-news.js", field: `CURATED[${i}].plain`, tier: 1, editable: true, message: "plain-language field missing — collapsed card view has no plain line" });
    }
  });
}

const CATEGORY_ENUM = new Set(["regulation", "macro", "protocol", "corporate", "sovereign", "etf", "market-structure"]);
const STATUS_TONE_ENUM = new Set(["advancing", "active", "stalled", "passed"]);

function isMultipleOfFive(p) {
  return Math.abs(Math.round(p * 100) % 5) < 1e-9;
}

function checkShape(mods) {
  const F = "src/data/deep-analysis.js";
  const da = mods["deep-analysis.js"]?.DEEP_ANALYSIS;
  if (da) {
    // NOTE: only these keys are probability-shaped. themeInteractions.netDelta is
    // legitimately 0.02 / 0.04 / 0.06 and must NOT be checked here.
    const probs = [["primaryAnalysis.thesisProbability", da.primaryAnalysis?.thesisProbability]];
    (da.watchList ?? []).forEach((w, i) => probs.push([`watchList[${i}].probability`, w.probability]));
    probs.push(["contrarianTake.probability", da.contrarianTake?.probability]);

    for (const [name, p] of probs) {
      if (typeof p !== "number") {
        report({ rule: "3-shape", severity: STRUCTURAL, file: F, field: name, message: "probability missing or not a number" });
        continue;
      }
      if (!isMultipleOfFive(p)) {
        report({ rule: "3-shape", severity: STRUCTURAL, file: F, field: name, message: `probability ${p} is not a multiple of 0.05` });
      }
      if (Math.abs(p - 0.5) < 1e-9) {
        report({ rule: "3-shape", severity: STRUCTURAL, file: F, field: name, message: "probability 0.50 is a refusal, not a forecast" });
      }
    }
    const ctP = da.contrarianTake?.probability;
    if (typeof ctP === "number" && (ctP < 0.1 || ctP > 0.45)) {
      report({ rule: "3-shape", severity: STRUCTURAL, file: F, field: "contrarianTake.probability", message: `must be within [0.10, 0.45]; got ${ctP}` });
    }
    (da.watchList ?? []).forEach((w, i) => {
      if (!CATEGORY_ENUM.has(w.category)) {
        report({ rule: "3-shape", severity: STRUCTURAL, file: F, field: `watchList[${i}].category`, message: `"${w.category}" is not in the category enum` });
      }
    });
  }

  const mt = mods["market-news.js"]?.MARKET_THEME;
  if (mt && !STATUS_TONE_ENUM.has(mt.statusTone)) {
    report({ rule: "3-shape", severity: STRUCTURAL, file: "src/data/market-news.js", field: "MARKET_THEME.statusTone", message: `"${mt.statusTone}" is not in the statusTone enum` });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 4 — analyst bookkeeping leaking into rendered prose
//
// NOT banned, deliberately:
//   • "regime"                 — SCOPE requires marketContext to name the rates/dollar regime.
//   • "reinforcing"/"contagion"— only ever appear inside the excluded themeInteractions
//                                block; banning them only false-fires on "self-reinforcing".
// ─────────────────────────────────────────────────────────────────────────────

// The rendered windows into the forecast ledger. Their Brier values are the point of
// the field, not a leak: calibration.briefSummary on the Analysis tab, and the Track
// record's summary line, which defines the score for a newcomer.
const LEDGER_WINDOWS = ["calibration.briefSummary", "FORECAST_LEDGER.summary.plain"];

const BOOKKEEPING = [
  { re: /THESIS-\d+/g, label: "thesis ID" },
  { re: /\bBrier\b/g, label: "raw Brier reference", exceptFields: LEDGER_WINDOWS },
  { re: /\bFed-INTENT\b/gi, label: "calibration category name" },
  { re: /\b(HIT|MISS|PARTIAL)\b/g, label: "scoring verdict in caps" },
  { re: /\bon its letter\b/gi, label: "ledger idiom" },
  { re: /\bhaircut(s|ted|ting)?\b/gi, label: "calibration jargon" },
  { re: /\bfalsifier\s*#?\d+/gi, label: "falsifier index" },
  // "0.83%" is a percentage and "$0.13" is a price — neither is a probability leak.
  { re: /(?<![\d.$])0\.\d{2}(?![\d%])/g, label: "raw probability decimal (say “65% odds”)", exceptFields: LEDGER_WINDOWS },
];

function checkBookkeeping(f) {
  for (const { re, label, exceptFields } of BOOKKEEPING) {
    if (exceptFields?.some((x) => f.path.endsWith(x))) continue;
    const hits = String(f.text).match(re);
    if (hits?.length) {
      report({
        rule: "4-bookkeeping",
        severity: HARD,
        file: f.file,
        field: f.path,
        tier: f.tier,
        editable: f.editable,
        message: `${label}: ${[...new Set(hits)].slice(0, 4).join(", ")}`,
        excerpt: contextAround(f.text, hits[0]),
      });
    }
  }
}

function contextAround(text, needle, radius = 34) {
  const idx = String(text).indexOf(needle);
  if (idx === -1) return text;
  return String(text).slice(Math.max(0, idx - radius), idx + needle.length + radius);
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 5 — glyphs, BREAKING, emoji
// Allowed and common in this repo: — (em dash), ₿, ≈, – (en dash).
// ─────────────────────────────────────────────────────────────────────────────

function checkGlyphs(f) {
  const glyphs = String(f.text).match(/[≥≤→←±×÷]/g);
  if (glyphs?.length) {
    report({
      rule: "5-glyphs",
      severity: HARD,
      file: f.file,
      field: f.path,
      tier: f.tier,
      editable: f.editable,
      message: `glyph math: ${[...new Set(glyphs)].join(" ")} — spell it ("at least", "at most", "then")`,
      excerpt: contextAround(f.text, glyphs[0]),
    });
  }
  if (/\bBREAKING\b/.test(f.text)) {
    report({ rule: "5-glyphs", severity: HARD, file: f.file, field: f.path, tier: f.tier, editable: f.editable, message: "“BREAKING” is news-ticker voice", excerpt: f.text });
  }
  const emoji = String(f.text).match(/\p{Extended_Pictographic}/gu);
  if (emoji?.length) {
    report({ rule: "5-glyphs", severity: HARD, file: f.file, field: f.path, tier: f.tier, editable: f.editable, message: `emoji in prose: ${[...new Set(emoji)].join(" ")}`, excerpt: f.text });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 6 — word caps  (> cap = soft, > cap × 1.25 = hard)
// ─────────────────────────────────────────────────────────────────────────────

function checkCap(f) {
  if (!f.cap) return;
  const n = wordCount(f.text);
  if (n <= f.cap) return;
  // Archive headlines are a legacy surface: report the trend, never gate on it.
  const softOnly = f.file.endsWith("headlines.js") || f.path.startsWith("FALLBACK_NEWS");
  const hard = !softOnly && n > Math.ceil(f.cap * 1.25);
  report({
    rule: "6-length",
    severity: hard ? HARD : SOFT,
    file: f.file,
    field: f.path,
    tier: f.tier,
    editable: f.editable,
    message: `${n} words vs cap ${f.cap}`,
    excerpt: f.text,
  });
}

function checkBodyTotal(fields) {
  const bodies = fields.filter((f) => f.kind === "body");
  if (!bodies.length) return;
  const total = bodies.reduce((sum, f) => sum + wordCount(f.text), 0);
  const limit = cap("bodyTotal");
  if (total > limit) {
    report({
      rule: "6-length",
      severity: total > Math.ceil(limit * 1.25) ? HARD : SOFT,
      file: bodies[0].file,
      field: "primaryAnalysis.body (total)",
      tier: 2,
      editable: true,
      message: `${total} words across ${bodies.length} paragraphs vs total cap ${limit}`,
    });
  }
  if (bodies.length > 6) {
    report({ rule: "6-length", severity: SOFT, file: bodies[0].file, field: "primaryAnalysis.body", tier: 2, editable: true, message: `${bodies.length} paragraphs vs max 6` });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 7 — hard ceiling on any plain field
// ─────────────────────────────────────────────────────────────────────────────

function checkPlainCeiling(f) {
  if (f.kind !== "plain") return;
  const n = wordCount(f.text);
  if (n > 45) {
    report({ rule: "7-plain-ceiling", severity: HARD, file: f.file, field: f.path, tier: 1, editable: f.editable, message: `plain field is ${n} words; absolute ceiling is 45`, excerpt: f.text });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 8 — probability restated in Tier 1
// Bare percentages elsewhere are legitimate ("45% below its October peak").
// ─────────────────────────────────────────────────────────────────────────────

const ODDS_WORDS = /^(odds|chance|chances|probability|probabilities|likely|likelihood|confidence)$/i;

function checkProbabilityRestated(f) {
  if (f.tier !== 1) return;
  const toks = words(f.text);
  toks.forEach((tok, i) => {
    if (!/\d+(\.\d+)?%$/.test(tok)) return;
    const window = toks.slice(Math.max(0, i - 4), i + 5);
    if (window.some((w) => ODDS_WORDS.test(w.replace(/[^\p{L}]/gu, "")))) {
      report({
        rule: "8-probability",
        severity: HARD,
        file: f.file,
        field: f.path,
        tier: 1,
        editable: f.editable,
        message: `restates a probability (${tok}) — the UI already shows it; use the band phrase`,
        excerpt: contextAround(f.text, tok),
      });
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 9 — sentence length (the dominant comprehension lever)
// ─────────────────────────────────────────────────────────────────────────────

function checkSentences(f) {
  // A title or headline is legitimately one long line; its length cap already owns it.
  if (f.kind === "title" || f.kind === "fragment") return;
  const sents = sentences(f.text);
  if (!sents.length) return;
  const lengths = sents.map(wordCount);
  const longest = Math.max(...lengths);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  if (longest > 45) {
    const worst = sents[lengths.indexOf(longest)];
    report({ rule: "9-sentence", severity: HARD, file: f.file, field: f.path, tier: f.tier, editable: f.editable, message: `longest sentence is ${longest} words (max 45)`, excerpt: worst });
  }
  // An average needs at least two sentences: a lone 28-word sentence is a question
  // for its own cap, not an "average" finding (one-sentence fields such as
  // wouldChange and the ledger's scoring letters would otherwise fire every week).
  if (sents.length >= 2 && avg > 22) {
    report({ rule: "9-sentence", severity: SOFT, file: f.file, field: f.path, tier: f.tier, editable: f.editable, message: `average sentence ${avg.toFixed(1)} words (target 22)` });
  }

  // Tier-1 rule applied to the opening line of every body paragraph.
  if (f.kind === "body" || f.tier === 1) {
    const firstLen = lengths[0];
    if (firstLen > 25) {
      report({ rule: "9b-first-sentence", severity: SOFT, file: f.file, field: f.path, tier: 1, editable: f.editable, message: `opening sentence is ${firstLen} words (Tier 1 max 25) — it is what a newcomer reads`, excerpt: sents[0] });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 10 — readability index (Gunning Fog)
//
// Deviation from the plan, deliberate: the plan proposed a Dale–Chall familiar-word
// list. A hand-authored 3,000-word list is exactly where false positives and warning
// fatigue live, and it would miss short jargon anyway ("tranche" is one syllable).
// Fog is standard, list-free, and catches the long-word half; the curated
// house-dialect list (rule 11) catches the short-jargon half.
// ─────────────────────────────────────────────────────────────────────────────

function checkReadability(f) {
  if (f.kind === "fragment" || f.kind === "title") return;
  const sents = sentences(f.text);
  const toks = words(f.text).filter((w) => /[\p{L}]/u.test(w));
  if (toks.length < 30) return;

  const complex = [];
  toks.forEach((tok, i) => {
    const bare = tok.replace(/[^\p{L}\-']/gu, "");
    if (!bare || isProperNounToken(bare, i)) return;
    if (syllables(bare) >= 3) complex.push(bare.toLowerCase());
  });

  const avgSentence = toks.length / Math.max(1, sents.length);
  const fog = 0.4 * (avgSentence + 100 * (complex.length / toks.length));
  if (fog > 14) {
    const top = [...new Set(complex)].slice(0, 8).join(", ");
    report({
      rule: "10-readability",
      severity: SOFT,
      file: f.file,
      field: f.path,
      tier: f.tier,
      editable: f.editable,
      message: `Fog index ${fog.toFixed(1)} (target 14 — roughly a high-school reader); long words: ${top}`,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 11 — house dialect (ordinary words used in a market sense)
// ─────────────────────────────────────────────────────────────────────────────

function loadDialect() {
  const p = nodePath.join(OUT_DIR, "house-dialect.txt");
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8")
    .split(/\r?\n/)
    .map((l) => l.replace(/#.*$/, "").trim())
    .filter(Boolean)
    .map((l) => l.toLowerCase());
}

function checkDialect(f, dialect) {
  if (!dialect.length) return;
  if (f.tier === 3) return; // Tier 3 may speak to a technical reader.
  const lower = String(f.text).toLowerCase();
  const hits = [];
  for (const term of dialect) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(term)}(s|es|ed|ing)?($|[^\\p{L}\\p{N}])`, "u");
    const m = re.exec(lower);
    if (!m) continue;
    // Glossed inline? Look for a parenthesis or dash within ~60 chars after the hit.
    const after = lower.slice(m.index, m.index + term.length + 62);
    if (/[(—–]|\bwhich\b|\bthat is\b|\bmeans\b/.test(after.slice(term.length))) continue;
    hits.push(term);
  }
  if (hits.length) {
    report({
      rule: "11-dialect",
      severity: SOFT,
      file: f.file,
      field: f.path,
      tier: f.tier,
      editable: f.editable,
      message: `house dialect without an inline gloss: ${hits.slice(0, 6).join(", ")}`,
    });
  }
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 12 — nominalization rate ("the repricing" → "investors re-priced")
// ─────────────────────────────────────────────────────────────────────────────

const NOMINALIZATION_OK = new Set([
  "government", "moment", "comment", "element", "instrument", "environment", "document",
  "security", "securities", "commodity", "commodities", "liquidity", "majority", "minority",
  "authority", "priority", "community", "opportunity", "university", "identity", "capacity",
  "quality", "quantity", "equity", "entity", "activity", "ability", "utility", "facility",
  "city", "county", "country", "maturity", "volatility", "integrity", "parity", "clarity",
]);

function checkNominalizations(f) {
  if (f.kind === "fragment" || f.kind === "title") return;
  const toks = words(f.text).map((w) => w.replace(/[^\p{L}]/gu, "").toLowerCase()).filter(Boolean);
  if (toks.length < 40) return;
  const hits = toks.filter((w) => w.length >= 7 && /(tion|ment|ance|ence|ity)$/.test(w) && !NOMINALIZATION_OK.has(w));
  const rate = (hits.length / toks.length) * 100;
  if (rate > 4) {
    report({
      rule: "12-nominalization",
      severity: SOFT,
      file: f.file,
      field: f.path,
      tier: f.tier,
      editable: f.editable,
      message: `${rate.toFixed(1)} nominalizations per 100 words (target 4): ${[...new Set(hits)].slice(0, 6).join(", ")}`,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 13 — no personalised financial advice
// ─────────────────────────────────────────────────────────────────────────────

const ADVICE = [
  /\byou (should|shouldn't|might want|may want|could consider|ought|need) (to )?(buy|sell|add|trim|hold|wait|allocate|invest)/i,
  /\b(a good|the right|a bad) (time|moment|opportunity) to (buy|sell|add|trim|invest)/i,
  /\bwe recommend\b/i,
  /\byour best (bet|move|option)\b/i,
  /\bconsider (buying|selling|adding|trimming|allocating)\b/i,
];

function checkAdvice(f) {
  for (const re of ADVICE) {
    const m = re.exec(f.text);
    if (m) {
      report({
        rule: "13-no-advice",
        severity: HARD,
        file: f.file,
        field: f.path,
        tier: f.tier,
        editable: f.editable,
        message: "reads as personalised financial advice — say what changes in the world, not what the reader should do",
        excerpt: contextAround(f.text, m[0]),
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 14 — the plain layer may never be more certain than the analysis
// ─────────────────────────────────────────────────────────────────────────────

const HEDGES = /\b(likely|unlikely|probably|could|may|might|expect|expects|expected|our best|odds|chance|if|unless|should|tends|roughly|about|mostly|usually|so far|leaning)\b/i;
const ABSOLUTES = /\b(either way|no matter what|guaranteed|certainly|definitely|always|never|nothing (can|will)|cannot fail|risk-free)\b/i;

function checkOverconfidence(f) {
  if (f.tier !== 1) return;

  const abs = ABSOLUTES.exec(f.text);
  if (abs) {
    report({
      rule: "14-confidence",
      severity: SOFT,
      file: f.file,
      field: f.path,
      tier: 1,
      editable: f.editable,
      message: `absolute language (“${abs[0]}”) on a probabilistic claim${f.ctxProbability != null ? ` priced at ${Math.round(f.ctxProbability * 100)}%` : ""}`,
      excerpt: contextAround(f.text, abs[0]),
    });
  }

  const future = /\b(will|won't|is going to|are going to|is set to)\b/i.exec(f.text);
  if (future) {
    const before = f.text.slice(0, future.index);
    const tail = words(before).slice(-6).join(" ");
    if (!HEDGES.test(tail)) {
      report({
        rule: "14-confidence",
        severity: SOFT,
        file: f.file,
        field: f.path,
        tier: 1,
        editable: f.editable,
        message: `unhedged forecast (“${future[0]}”) — use the band phrase for the probability`,
        excerpt: contextAround(f.text, future[0]),
      });
    }
  }

  if (f.ctxProbability != null && f.ctxProbability <= 0.35 && !HEDGES.test(f.text)) {
    report({
      rule: "14-confidence",
      severity: SOFT,
      file: f.file,
      field: f.path,
      tier: 1,
      editable: f.editable,
      message: `states a ${Math.round(f.ctxProbability * 100)}%-probability outcome with no hedge at all`,
      excerpt: f.text,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 15 — acronym frequency table (report-only, by design)
// Per-instance warnings would produce dozens weekly and kill the soft channel.
// ─────────────────────────────────────────────────────────────────────────────

const ACRONYM_ALLOW = new Set([
  "BTC", "USD", "US", "U.S.", "UK", "EU", "ETF", "ETFS", "CEO", "CFO", "IPO", "GDP", "AI",
  "SEC", "CFTC", "FOMC", "CPI", "PCE", "ATH", "AUM", "DCA", "NYSE", "API", "RSS", "PDF",
]);

function collectAcronyms(fields, glossaryAliases) {
  const counts = new Map();
  const lowerCorpus = new Set();
  // Only tokens ACTUALLY written in lower case count. Building this set by
  // lowercasing every token made "appears in lower case elsewhere" trivially true
  // for all-caps words, so rule 17 fired on every acronym and rule 15 skipped them.
  for (const f of fields) {
    for (const w of words(f.text)) {
      if (!/\p{Ll}/u.test(w)) continue;
      lowerCorpus.add(w.replace(/[^\p{L}]/gu, "").toLowerCase());
    }
  }

  for (const f of fields) {
    for (const raw of words(f.text)) {
      const tok = raw.replace(/[^\p{L}\p{N}.]/gu, "");
      const bare = tok.replace(/\./g, "");
      if (!/^[A-Z0-9]{2,6}$/.test(bare)) continue;
      if (!/[A-Z]/.test(bare)) continue;
      // "$390M", "1B", "500K", "BIP-110" → money and identifiers, not acronyms.
      if (/^\d/.test(bare)) continue;
      if (ACRONYM_ALLOW.has(bare) || ACRONYM_ALLOW.has(tok)) continue;
      if (glossaryAliases.has(bare.toLowerCase())) continue;
      // If the same word appears in lower case elsewhere, it is SHOUT-CAPS emphasis,
      // not an acronym — rule 17 owns that.
      if (lowerCorpus.has(bare.toLowerCase())) continue;
      counts.set(bare, (counts.get(bare) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 17 — SHOUT-CAPS emphasis
// Heuristic: an all-caps token that also appears in lower case somewhere in the
// corpus is emphasis, not an acronym.
// ─────────────────────────────────────────────────────────────────────────────

function checkEmphasisCaps(f, lowerCorpus) {
  const toks = words(f.text);
  const hits = [];
  for (const raw of toks) {
    const bare = raw.replace(/[^\p{L}]/gu, "");
    if (bare.length < 3 || !/^[A-Z]+$/.test(bare)) continue;
    if (lowerCorpus.has(bare.toLowerCase())) hits.push(bare);
  }
  if (hits.length >= 2) {
    report({
      rule: "17-emphasis-caps",
      severity: SOFT,
      file: f.file,
      field: f.path,
      tier: f.tier,
      editable: f.editable,
      message: `SHOUT-CAPS emphasis: ${[...new Set(hits)].slice(0, 6).join(", ")} — use sentence structure instead`,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 18 — the same fact restated across files
// ─────────────────────────────────────────────────────────────────────────────

function checkDuplication(fields) {
  const seen = new Map(); // token → Set(field paths)
  for (const f of fields) {
    const toks = new Set();
    // ≥4 significant digits, not part of an identifier ("BIP-110"), not a bare year.
    for (const m of String(f.text).matchAll(/(?<![\w$–-])\d[\d,]{3,}(?:\.\d+)?\b/g)) {
      const bare = m[0].replace(/,/g, "");
      if (/^(19|20)\d{2}$/.test(bare)) continue;
      toks.add(bare);
    }
    for (const m of String(f.text).matchAll(/(?<![\w–-])\d{2,}[–-]\d{2,}\b/g)) toks.add(m[0].replace(/–/g, "-"));
    for (const t of toks) {
      if (!seen.has(t)) seen.set(t, new Set());
      seen.get(t).add(`${f.file}:${f.path}`);
    }
  }
  for (const [tok, where] of seen) {
    if (where.size >= 3) {
      report({
        rule: "18-duplication",
        severity: SOFT,
        file: "-",
        field: [...where][0],
        message: `"${tok}" is restated in ${where.size} rendered fields — reference the card, don't repeat the fact`,
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 17 — per-tab word budget (soft) · Rule 18 — reading time (report only)
//
// A module's registered fields are, near enough, everything a reader scrolls through
// on that tab. Rule 17 stops the static tabs growing a paragraph a month; rule 18
// prints what the length means at 200 words per minute so the budget is a number
// somebody can feel. Both print in the report header on every run.
// ─────────────────────────────────────────────────────────────────────────────

const READING_WPM = 200;

function tabTotals(fields) {
  const byFile = new Map();
  for (const f of fields) byFile.set(f.file, (byFile.get(f.file) ?? 0) + wordCount(f.text));
  return [...byFile.entries()].map(([file, total]) => ({
    file,
    tab: TAB_OF_FILE[file] ?? file,
    words: total,
    minutes: Math.max(1, Math.round(total / READING_WPM)),
    budget: TAB_BUDGETS[file] != null ? Math.round(TAB_BUDGETS[file] * CAP_SCALE) : null,
  }));
}

function checkTabBudgets(totals) {
  for (const t of totals) {
    if (t.budget != null && t.words > t.budget) {
      report({
        rule: "17-tab-budget",
        severity: SOFT,
        file: t.file,
        field: "(all registered prose)",
        editable: false, // a budget is met by cutting a section, not by the Editor tightening sentences
        message: `${t.words.toLocaleString("en-US")} words vs tab budget ${t.budget.toLocaleString("en-US")} — about ${t.minutes} minutes of reading; cut a section before tightening sentences`,
      });
    }
    report({ rule: "18-reading-time", severity: REPORT, file: t.file, field: t.tab, message: `${t.words.toLocaleString("en-US")} words · about ${t.minutes} min at ${READING_WPM} words per minute` });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 16 — glossary integrity (skipped until src/data/glossary.js exists)
// ─────────────────────────────────────────────────────────────────────────────

const LEGACY_TERM_KEYS = [
  "hashrate", "halving", "difficulty", "dominance", "lightning", "etf", "probability",
  "brier", "distribution", "liquidation", "leverage", "deleveraging", "drawdown", "sats",
  "selfcustody", "coldstorage", "m2", "dca", "seedphrase",
]; // 19 keys — every one is referenced by an explicit <Term k=…> site or by DIP_EXPLAINER.

function checkGlossary(mods) {
  const glossary = mods["glossary.js"]?.GLOSSARY;
  if (!glossary) {
    notes.push("glossary: src/data/glossary.js not present yet — rule 16 skipped (WP2).");
    return new Set();
  }
  const F = "src/data/glossary.js";
  if (!Array.isArray(glossary)) {
    report({ rule: "16-glossary", severity: STRUCTURAL, file: F, message: "GLOSSARY is not an array" });
    return new Set();
  }
  if (glossary.length > 80) {
    report({ rule: "16-glossary", severity: STRUCTURAL, file: F, message: `${glossary.length} entries exceeds the 80-entry cap — propose swaps instead of appending` });
  }

  const keys = new Set();
  const aliases = new Set();
  for (const entry of glossary) {
    if (!entry || typeof entry.key !== "string" || !entry.key.trim()) {
      report({ rule: "16-glossary", severity: STRUCTURAL, file: F, message: "entry with no key" });
      continue;
    }
    if (keys.has(entry.key)) {
      report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: entry.key, message: "duplicate key" });
    }
    keys.add(entry.key);

    if (typeof entry.plain !== "string" || !entry.plain.trim()) {
      report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: entry.key, message: "missing plain definition" });
    } else if (wordCount(entry.plain) > 40) {
      report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: entry.key, message: `definition is ${wordCount(entry.plain)} words (max 40)` });
    }

    const isLegacy = LEGACY_TERM_KEYS.includes(entry.key);
    if (!isLegacy && !entry.source) {
      report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: entry.key, message: "no source URL — an unsourced definition renders on every tab forever" });
    }

    for (const alias of [entry.label, ...(entry.aliases ?? [])].filter(Boolean)) {
      const lower = String(alias).toLowerCase();
      if (aliases.has(lower)) {
        report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: entry.key, message: `duplicate alias "${alias}"` });
      }
      aliases.add(lower);
      if (entry.autolink !== false && /^[a-z]+$/.test(lower) && lower.length <= 6 && COMMON_WORDS.has(lower)) {
        report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: entry.key, message: `"${alias}" is an ordinary English word — set autolink:false or use a longer alias` });
      }
    }
  }

  for (const key of LEGACY_TERM_KEYS) {
    if (!keys.has(key)) {
      report({ rule: "16-glossary", severity: STRUCTURAL, file: F, field: key, message: "legacy term key dropped — an existing <Term> call site depends on it" });
    }
  }
  return aliases;
}

const COMMON_WORDS = new Set([
  "fiat", "short", "long", "book", "tape", "bid", "gate", "floor", "print", "leg", "cash",
  "bond", "stock", "share", "rate", "yield", "fund", "flow", "risk", "value", "price",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Rule 20 — numeric invariant (--snapshot / --verify)
//
// Semantics: per CARD (not per field — the Editor may split a paragraph, which
// misaligns field-level multisets). Canonicalised, deletes-only:
//     AFTER ⊆ BEFORE ∪ YARDSTICKS
// The Editor may drop a number; it may never introduce or alter one.
// ─────────────────────────────────────────────────────────────────────────────

const SCALE = { k: 1e3, thousand: 1e3, m: 1e6, mm: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9, t: 1e12, trillion: 1e12 };
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };

function numericTokens(text) {
  let s = String(text).replace(/[–—]/g, "-");
  const out = [];
  const blank = (match) => " ".repeat(match.length);

  // Dates: "Sep 15", "September 15"
  s = s.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})\b/gi, (m, mon, day) => {
    out.push(`date:${MONTHS[mon.toLowerCase()]}-${Number(day)}`);
    return blank(m);
  });

  // Money: "$4.6 billion", "$390M", "$63,000"
  s = s.replace(/\$\s?([\d,]+(?:\.\d+)?)\s*(trillion|billion|million|thousand|bn|mm|[kmbt])?\b/gi, (m, num, scale) => {
    const base = Number(String(num).replace(/,/g, ""));
    const mult = scale ? SCALE[String(scale).toLowerCase()] ?? 1 : 1;
    if (Number.isFinite(base)) out.push(`usd:${base * mult}`);
    return blank(m);
  });

  // Percentages
  s = s.replace(/([\d,]+(?:\.\d+)?)\s?%/g, (m, num) => {
    const v = Number(String(num).replace(/,/g, ""));
    if (Number.isFinite(v)) out.push(`pct:${(v / 100).toFixed(4)}`);
    return blank(m);
  });

  // Scale suffixes, glued or spelled out: "110M" and "110 million" must produce
  // the same token, or converting one to the other reads as a new number.
  s = s.replace(/(\d[\d,]*(?:\.\d+)?)\s*(trillion|billion|million|thousand|bn|mm|[kmbt])\b/gi, (m, num, scale) => {
    const base = Number(String(num).replace(/,/g, ""));
    const mult = SCALE[String(scale).toLowerCase()] ?? 1;
    if (Number.isFinite(base)) out.push(`num:${base * mult}`);
    return blank(m);
  });

  // Everything else numeric. A bare decimal between 0 and 1 is a probability in this
  // corpus, and the standard REQUIRES rewriting "0.55" as "55% odds" — so both forms
  // canonicalise to the same token.
  for (const m of s.matchAll(/\b\d[\d,]*(?:\.\d+)?\b/g)) {
    const v = Number(m[0].replace(/,/g, ""));
    if (!Number.isFinite(v)) continue;
    out.push(v > 0 && v < 1 ? `pct:${v.toFixed(4)}` : `num:${v}`);
  }
  return out;
}

function cardTokens(fields, editableOnly = true) {
  const byCard = new Map();
  for (const f of fields) {
    if (editableOnly && !f.editable) continue;
    if (!byCard.has(f.card)) byCard.set(f.card, []);
    byCard.get(f.card).push(...numericTokens(f.text));
  }
  // Presence, not count: the Editor must write `plain` fields from card material,
  // which necessarily repeats a figure the card already contained. The rule is that
  // no NEW value appears — repetition and deletion are both fine.
  const out = {};
  for (const [card, toks] of byCard) out[card] = [...new Set(toks)];
  return out;
}

function cardProbabilityTokens(mods) {
  const byCard = {};
  const add = (card, p) => {
    if (typeof p !== "number") return;
    (byCard[card] ??= new Set()).add(`pct:${p.toFixed(4)}`);
    (byCard[card] ??= new Set()).add(`num:${Math.round(p * 100)}`);
  };
  const da = mods["deep-analysis.js"]?.DEEP_ANALYSIS;
  if (da) {
    add("da:primary", da.primaryAnalysis?.thesisProbability);
    add("da:top", da.primaryAnalysis?.thesisProbability);
    add("da:contrarian", da.contrarianTake?.probability);
    (da.watchList ?? []).forEach((w, i) => add(`da:wl[${i}]`, w?.probability));
    (da.crossCurrents ?? []).forEach((_, i) => {
      // A cross-current may restate any watch-row probability it connects.
      (da.watchList ?? []).forEach((w) => add(`da:cc[${i}]`, w?.probability));
    });
  }
  return byCard;
}

function yardstickTokens(mods) {
  const ys = mods["fallbacks.js"]?.YARDSTICKS;
  const allowed = new Set();
  if (Array.isArray(ys)) {
    for (const y of ys) {
      if (typeof y?.value === "number") {
        allowed.add(`usd:${y.value}`);
        allowed.add(`num:${y.value}`);
        allowed.add(`pct:${y.value.toFixed(4)}`);
      }
    }
  }
  return allowed;
}

function sha(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function runIdStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeSnapshot(fields, mods) {
  mkdirSync(OUT_DIR, { recursive: true });
  const files = {};
  for (const name of DATA_FILES) {
    const abs = nodePath.join(DATA_DIR, name);
    if (existsSync(abs)) {
      const content = readFileSync(abs, "utf8");
      files[`src/data/${name}`] = { sha: sha(content), content };
    }
  }
  const snapshot = {
    createdAt: new Date().toISOString(),
    cards: cardTokens(fields),
    changedFields: changedFieldsVsHead(fields),
    files,
  };
  const out = nodePath.join(OUT_DIR, `.invariants-${runIdStamp()}.json`);
  writeFileSync(out, JSON.stringify(snapshot, null, 2), "utf8");
  return out;
}

function newestSnapshot() {
  if (!existsSync(OUT_DIR)) return null;
  const candidates = readdirSync(OUT_DIR)
    .filter((n) => n.startsWith(".invariants-") && n.endsWith(".json"))
    .map((n) => nodePath.join(OUT_DIR, n))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return candidates[0] ?? null;
}

async function cardsFromSnapshotFiles(snap) {
  const files = snap.files ?? {};
  if (!Object.keys(files).length) return null;
  const mods = {};
  for (const [rel, rec] of Object.entries(files)) {
    if (typeof rec?.content !== "string") return null;
    const name = rel.split("/").pop();
    // The data modules are pure `export const` with no imports, so a data: URL
    // import is safe and needs no temp file.
    const url = "data:text/javascript;base64," + Buffer.from(rec.content, "utf8").toString("base64");
    try {
      mods[name] = await import(url);
    } catch {
      return null; // fall back to the recorded tokens
    }
  }
  return cardTokens(collectFields(mods));
}

async function verifyInvariants(fields, mods) {
  const path = OPTS.verifyPath ?? newestSnapshot();
  if (!path || !existsSync(path)) {
    report({ rule: "20-invariant", severity: STRUCTURAL, file: "-", message: "no pre-edit snapshot found — cannot verify; do NOT restore, re-run --snapshot before the Editor" });
    return;
  }
  let snap;
  try {
    snap = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    report({ rule: "20-invariant", severity: STRUCTURAL, file: "-", message: `snapshot unreadable: ${err.message}` });
    return;
  }
  const ageHours = (Date.now() - new Date(snap.createdAt).getTime()) / 36e5;
  if (!Number.isFinite(ageHours) || ageHours > 12) {
    report({ rule: "20-invariant", severity: STRUCTURAL, file: "-", message: `snapshot is ${Number.isFinite(ageHours) ? ageHours.toFixed(1) : "?"}h old (max 12) — a stale snapshot would revert this week's content to last week's; do NOT restore` });
    return;
  }

  const allowed = yardstickTokens(mods);
  const after = cardTokens(fields);
  const cardProbs = cardProbabilityTokens(mods);
  const recomputed = await cardsFromSnapshotFiles(snap);
  if (recomputed) notes.push("invariants: before-side recomputed from the snapshot's file copies (tokeniser-independent).");
  for (const [card, toks] of Object.entries(after)) {
    const raw = recomputed ? recomputed[card] : snap.cards?.[card];
    // Snapshots written before set semantics stored {token: count}; accept both.
    const before = new Set(Array.isArray(raw) ? raw : Object.keys(raw ?? {}));
    const ownProbs = cardProbs[card] ?? new Set();
    for (const tok of toks) {
      if (allowed.has(tok) || before.has(tok) || ownProbs.has(tok)) continue;
      // The standard mandates unpacking bare odds into percentages ("60/40" →
      // "roughly 60% odds"), so an integer and its percentage are interchangeable.
      const asPct = /^pct:0\.(\d{2})00$/.exec(tok);
      if (asPct && before.has(`num:${Number(asPct[1])}`)) continue;
      const asNum = /^num:(\d{1,2})$/.exec(tok);
      if (asNum && before.has(`pct:${(Number(asNum[1]) / 100).toFixed(4)}`)) continue;
      report({
        rule: "20-invariant",
        severity: STRUCTURAL,
        file: "-",
        field: card,
        message: `numeric drift: "${tok}" is not present anywhere in this card before the edit — the Editor may delete or restate a number, never introduce one`,
      });
    }
  }
  notes.push(`invariants: verified ${Object.keys(after).length} cards against ${nodePath.basename(path)} (${ageHours.toFixed(1)}h old).`);
}

function changedFieldsVsHead(fields) {
  // Best-effort: which rendered fields differ from the last commit. Used by the
  // Editor to prioritise this week's work. Never fatal.
  const changed = [];
  try {
    for (const name of DATA_FILES) {
      const rel = `src/data/${name}`;
      let headSrc;
      try {
        headSrc = execFileSync("git", ["show", `HEAD:${rel}`], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      } catch {
        continue;
      }
      const current = readFileSync(nodePath.join(ROOT, rel), "utf8");
      if (headSrc === current) continue;
      for (const f of fields.filter((x) => x.file === rel)) {
        if (!headSrc.includes(String(f.text).slice(0, 60))) changed.push(`${rel}:${f.path}`);
      }
    }
  } catch {
    /* non-fatal */
  }
  return changed;
}

// ─────────────────────────────────────────────────────────────────────────────
// --preview-links
// ─────────────────────────────────────────────────────────────────────────────

async function previewLinks(fields, mods) {
  const glossary = mods["glossary.js"]?.GLOSSARY;
  if (!glossary) {
    notes.push("preview-links: src/data/glossary.js not present yet (WP2).");
    return;
  }
  const matcherMod = await import(pathToFileURL(nodePath.join(ROOT, "src", "lib", "glossary-match.js")).href).catch(() => null);
  if (!matcherMod?.buildMatcher) {
    notes.push("preview-links: src/lib/glossary-match.js not present yet (WP2).");
    return;
  }
  const matcher = matcherMod.buildMatcher(glossary);
  if (!matcher) {
    notes.push("preview-links: matcher failed to build (glossary malformed).");
    return;
  }
  const lines = [];
  for (const f of fields) {
    const segs = matcherMod.segmentText(f.text, matcher, new Set());
    const linked = segs.filter((s) => s.key);
    if (linked.length) lines.push(`${f.file} › ${f.path}: ${linked.map((s) => `${s.text} → ${s.key}`).join(" | ")}`);
  }
  notes.push(`preview-links: ${lines.length} fields would link.\n` + lines.join("\n"));
}

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

const RULE_ORDER = [
  "1-import", "2-keys", "3-shape", "16-glossary", "20-invariant",
  "2b-plain-missing", "4-bookkeeping", "5-glyphs", "6-length", "7-plain-ceiling",
  "8-probability", "9-sentence", "13-no-advice",
  "9b-first-sentence", "10-readability", "11-dialect", "12-nominalization",
  "14-confidence", "17-emphasis-caps", "18-duplication", "17-tab-budget", "18-reading-time",
];

function severityRank(s) {
  return { structural: 0, hard: 1, soft: 2, report: 3 }[s] ?? 9;
}

function buildReport(acronyms, probabilityTable, totals = []) {
  const lines = [];
  const structural = findings.filter((f) => f.severity === STRUCTURAL);
  const hardEditable = findings.filter((f) => f.severity === HARD && f.editable === true);
  const hardLocked = findings.filter((f) => f.severity === HARD && f.editable !== true);
  const soft = findings.filter((f) => f.severity === SOFT);

  const exitCode = structural.length ? 3 : hardEditable.length ? 2 : (hardLocked.length || soft.length) ? 1 : 0;

  lines.push("# check:plain");
  lines.push("");
  lines.push(`Run: ${new Date().toISOString()}${OPTS.file ? ` · scoped to ${OPTS.file}` : ""}${OPTS.strict ? " · strict caps" : ""}`);
  lines.push("");
  lines.push(`**Exit ${exitCode}** — structural ${structural.length} · hard/editable ${hardEditable.length} · hard/locked ${hardLocked.length} · soft ${soft.length}`);
  lines.push("");

  if (totals.length) {
    // Rules 17 + 18: words per tab, the budget where one exists, and reading time.
    lines.push(`**Tab budgets & reading time** (rules 17–18; ${READING_WPM} words per minute)`);
    lines.push("");
    lines.push("| tab | words | budget | reading time |");
    lines.push("|---|---|---|---|");
    for (const t of totals) {
      const budget = t.budget == null ? "—" : `${t.budget.toLocaleString("en-US")}${t.words > t.budget ? " — OVER" : ""}`;
      lines.push(`| ${t.tab} | ${t.words.toLocaleString("en-US")} | ${budget} | ~${t.minutes} min |`);
    }
    lines.push("");
  }

  const section = (title, list, blurb) => {
    if (!list.length) return;
    lines.push(`## ${title}`);
    if (blurb) lines.push(`_${blurb}_`);
    lines.push("");
    const sorted = [...list].sort(
      (a, b) => RULE_ORDER.indexOf(a.rule) - RULE_ORDER.indexOf(b.rule) || a.field.localeCompare(b.field)
    );
    for (const f of sorted) {
      lines.push(`- \`${f.field}\` · ${f.rule}${f.tier ? ` · tier ${f.tier}` : ""} — ${f.message}`);
      if (f.excerpt) lines.push(`  > ${f.excerpt}`);
    }
    lines.push("");
  };

  section("Structural — do NOT build", structural, "Import, render-critical keys, enums, glossary integrity, numeric drift. These break the page or the build.");
  section("Hard — the Editor must fix", hardEditable, "Editor-editable prose fields.");
  section("Hard — for the drafter", hardLocked, "Findings in fields the Editor may not rewrite (scoring letter, titles that feed the significance gate). These do not affect the exit code — they belong in drafter-notes.md.");
  section("Soft — style", soft, "Advisory. Never blocks the weekly publish.");

  if (probabilityTable.length) {
    lines.push("## Probability bands (eyeball check)");
    lines.push("");
    lines.push("| field | p | band phrase required | plain text |");
    lines.push("|---|---|---|---|");
    for (const row of probabilityTable) {
      lines.push(`| ${row.field} | ${row.p} | ${row.band} | ${clip(row.text, 60)} |`);
    }
    lines.push("");
  }

  if (acronyms.length) {
    lines.push("## Acronyms not in the glossary (report only)");
    lines.push("");
    lines.push(acronyms.map(([a, n]) => `${a} ×${n}`).join(" · "));
    lines.push("");
    lines.push("_Repeat offenders should graduate into the glossary rather than be warned about weekly._");
    lines.push("");
  }

  if (notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of notes) lines.push(`- ${n}`);
    lines.push("");
  }

  return { text: lines.join("\n"), exitCode, counts: { structural: structural.length, hardEditable: hardEditable.length, hardLocked: hardLocked.length, soft: soft.length } };
}

function bandFor(p) {
  if (p <= 0.15) return "unlikely";
  if (p <= 0.35) return "possible but less likely than not";
  if (p <= 0.45) return "close to a coin flip, leaning no";
  if (p <= 0.6) return "slightly more likely than not";
  if (p <= 0.8) return "likely";
  return "very likely";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const mods = await loadModules();

  // A scoped run is a hard scope from the start: a writer checking its own file must
  // not be stopped by a module another stream has not delivered yet.
  const want = OPTS.file ? OPTS.file.replace(/\\/g, "/").replace(/^\.\//, "") : null;
  const inScope = (file) => !want || file.endsWith(want) || want.endsWith(file);
  if (want) {
    for (let i = findings.length - 1; i >= 0; i--) {
      if (findings[i].rule === "1-import" && !inScope(findings[i].file)) findings.splice(i, 1);
    }
  }

  // Rule 1 failures are terminal — nothing downstream can be trusted.
  if (findings.some((f) => f.rule === "1-import")) {
    const { text, exitCode } = buildReport([], []);
    emit(text, exitCode);
    return;
  }

  checkRequiredKeys(mods);
  checkShape(mods);
  const glossaryAliases = checkGlossary(mods);

  let fields = collectFields(mods);
  if (want) {
    fields = fields.filter((f) => inScope(f.file));
    // A scoped run is a hard scope: a writer agent must never be shown findings in
    // another agent's file — it would either loop on them or violate its own scope.
    for (let i = findings.length - 1; i >= 0; i--) {
      if (!inScope(findings[i].file)) findings.splice(i, 1);
    }
  }

  const lowerCorpus = new Set();
  // Only tokens ACTUALLY written in lower case count. Building this set by
  // lowercasing every token made "appears in lower case elsewhere" trivially true
  // for all-caps words, so rule 17 fired on every acronym and rule 15 skipped them.
  for (const f of fields) {
    for (const w of words(f.text)) {
      if (!/\p{Ll}/u.test(w)) continue;
      lowerCorpus.add(w.replace(/[^\p{L}]/gu, "").toLowerCase());
    }
  }

  const dialect = loadDialect();

  for (const f of fields) {
    checkBookkeeping(f);
    checkGlyphs(f);
    checkCap(f);
    checkPlainCeiling(f);
    checkProbabilityRestated(f);
    checkSentences(f);
    checkReadability(f);
    checkDialect(f, dialect);
    checkNominalizations(f);
    checkAdvice(f);
    checkOverconfidence(f);
    checkEmphasisCaps(f, lowerCorpus);
  }
  checkBodyTotal(fields);
  const totals = tabTotals(fields);
  checkTabBudgets(totals);
  // Cross-file by nature — only meaningful on a full run.
  if (!OPTS.file) checkDuplication(fields);

  const acronyms = collectAcronyms(fields, glossaryAliases);

  const probabilityTable = fields
    .filter((f) => f.kind === "plain" && f.ctxProbability != null)
    .map((f) => ({ field: f.path, p: f.ctxProbability, band: bandFor(f.ctxProbability), text: f.text }));

  if (OPTS.previewLinks) await previewLinks(fields, mods);
  if (OPTS.snapshot) {
    const out = writeSnapshot(fields, mods);
    notes.push(`snapshot written: ${nodePath.relative(ROOT, out)}`);
  }
  if (OPTS.verify) await verifyInvariants(fields, mods);

  const { text, exitCode, counts } = buildReport(acronyms, probabilityTable, totals);

  // Only a full (unscoped) run owns the shared report file; per-writer --file runs
  // must not clobber it while other agents are running.
  if (!OPTS.file) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(REPORT_PATH, text, "utf8");
  }

  if (OPTS.json) {
    process.stdout.write(JSON.stringify({ exitCode, counts, findings, acronyms, tabTotals: totals, notes }, null, 2) + "\n");
  } else {
    emit(text, exitCode);
    return;
  }
  process.exit(exitCode);
}

function emit(text, exitCode) {
  if (!OPTS.quiet) process.stdout.write(text + "\n");
  process.exit(exitCode);
}

main().catch((err) => {
  process.stderr.write(`check-plain failed: ${err?.stack ?? err}\n`);
  process.exit(3);
});
