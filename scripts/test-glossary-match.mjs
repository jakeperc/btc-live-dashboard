#!/usr/bin/env node
// Regression tests for src/lib/glossary-match.js — run with `npm run test:glossary`.
//
// Two of these guard bugs that are INVISIBLE in the dev server and only appear in
// the production single-file bundle or after a re-render:
//   • no lookbehind  — `(?<!…)` throws at module load on Safari < 16.4, which for a
//                      one-file bundle means a blank page, not a degraded feature.
//   • text integrity — segmentation must be lossless; a dropped character silently
//                      corrupts published prose.

import { readFileSync } from "node:fs";
import nodePath from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = nodePath.resolve(nodePath.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = nodePath.join(ROOT, "src", "lib", "glossary-match.js");
const { buildMatcher, segmentText, linkCard } = await import(pathToFileURL(SRC).href);

let pass = 0;
let fail = 0;
function t(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) {
    pass++;
  } else {
    fail++;
    console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
  }
}
function group(name) {
  console.log(name);
}

const EN_DASH = "–";
const NBSP = " ";

const G = [
  { key: "etf", label: "ETF", aliases: ["ETFs", "spot ETF", "spot ETFs"], caseSensitive: true, plain: "x" },
  { key: "cloture", label: "cloture", plain: "x" },
  { key: "atm", label: "at-the-market issuance", aliases: ["ATM issuance"], plain: "x" },
  { key: "openinterest", label: "open interest", plain: "x" },
  { key: "shortsqueeze", label: "short squeeze", plain: "x" },
  { key: "treasuryreserve", label: "treasury reserve", autolink: false, plain: "x" },
];
const m = buildMatcher(G);
const linked = (s) => segmentText(s, m, () => true).filter((x) => x.key).map((x) => `${x.text}->${x.key}`);
const roundtrip = (s) => segmentText(s, m, () => true).map((x) => x.text).join("");

t("matcher builds", !!m, true);

group("overlap — longest alias wins");
t("spot ETF beats ETF", linked("money into spot ETF products"), ["spot ETF->etf"]);
t("bare ETF still matches", linked("the ETF complex"), ["ETF->etf"]);
t("plural phrase", linked("two spot ETFs launched"), ["spot ETFs->etf"]);

group("case sensitivity");
t("lowercase acronym rejected", linked("he etf thing"), []);
t("non-case-sensitive term matches capitalised", linked("a Cloture vote"), ["Cloture->cloture"]);

group("joiner variants (the data mixes all of these)");
t("hyphens", linked("an at-the-market issuance"), ["at-the-market issuance->atm"]);
t("spaces", linked("an at the market issuance"), ["at the market issuance->atm"]);
t("en dash", linked(`an at${EN_DASH}the${EN_DASH}market issuance`), [`at${EN_DASH}the${EN_DASH}market issuance->atm`]);
t("non-breaking space", linked(`the open${NBSP}interest fell`), [`open${NBSP}interest->openinterest`]);

group("word boundaries");
t("possessive keeps the match", linked("the ETF's flows"), ["ETF->etf"]);
t("no match inside a word", linked("clotureless nonsense"), []);
t("no match on a glued token", linked("BIPcloture"), []);
t("match at start of string", linked("cloture is the vote"), ["cloture->cloture"]);

group("autolink:false is honoured");
t("ambiguous phrase not linked", linked("a treasury reserve strategy"), []);

group("text integrity — segmentation is lossless");
for (const s of [
  "Spot ETF flows and open interest both fell; the short squeeze cleared the book.",
  "cloture at the market issuance ETF",
  "Nothing to link here at all.",
  `Curly quotes don${"’"}t break it${EN_DASH}nor do dashes.`,
  "",
]) {
  t(`roundtrip ${JSON.stringify(s.slice(0, 26))}`, roundtrip(s), s);
}

group("linkCard — first occurrence per card, and the cap");
const card = linkCard(["ETF flows rose. ETF flows fell again.", "More ETF talk plus open interest and a short squeeze."], m, 6);
t("term linked once across the whole card", card.segments.flat().filter((x) => x.key === "etf").length, 1);
t("keys collected for the terms panel", card.keys.sort(), ["etf", "openinterest", "shortsqueeze"]);
t("cap respected", linkCard(["ETF open interest short squeeze cloture"], m, 2).segments.flat().filter((x) => x.key).length, 2);
t("pure — same input twice gives the same output",
  JSON.stringify(linkCard(["ETF and ETF"], m, 6).segments),
  JSON.stringify(linkCard(["ETF and ETF"], m, 6).segments));

group("resilience — a malformed weekly append must not blank the site");
t("null glossary", buildMatcher(null), null);
t("empty glossary", buildMatcher([]), null);
t("aliases not an array", !!buildMatcher([{ key: "a", label: "alpha", aliases: "oops", plain: "x" }]), true);
t("entry missing key is skipped", !!buildMatcher([{ label: "no key" }, { key: "b", label: "beta" }]), true);
t("null matcher degrades to plain text", segmentText("hello", null, () => true), [{ text: "hello" }]);
t("regex-special characters in an alias", (() => {
  const mm = buildMatcher([{ key: "k401", label: "401(k)", plain: "x" }]);
  return segmentText("a 401(k) plan", mm, () => true).filter((x) => x.key).map((x) => x.text);
})(), ["401(k)"]);

group("browser compatibility");
const codeOnly = readFileSync(SRC, "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .split("\n")
  .map((l) => l.replace(/\/\/.*$/, ""))
  .join("\n");
t("no regex lookbehind in executable code (Safari < 16.4 throws at module load)", /\(\?<[!=]/.test(codeOnly), false);

// The real risk lives in the SHIPPED bundle, not in source: esbuild happily emits
// lookbehind at Vite's default safari14 target, and the app is one inlined file, so
// a throw at module evaluation is a blank page rather than a degraded feature. The
// dev server never down-targets, so nothing else in the workflow can catch this.
const DIST = nodePath.join(ROOT, "dist", "index.html");
try {
  const bundle = readFileSync(DIST, "utf8");
  const hits = bundle.match(/\(\?<[!=]/g);
  t("no regex lookbehind in dist/index.html", hits ? hits.length : 0, 0);
} catch {
  console.log("  (skipped dist check — no dist/index.html; run `npm run build` first)");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
