// Glossary auto-linking — pure, no React, no side effects.
//
// Every input is frozen at build time (GLOSSARY and the data modules are plain
// constants), so segmentation is a BUILD-TIME problem: call linkCard() once at
// module scope and render dumb segments. Never track "first occurrence" with a
// Set mutated during render — DashboardTab re-renders every second on the block
// ticker, so the links would vanish one tick after mount.
//
// Two browser-compat rules this file exists to enforce:
//   1. NO LOOKBEHIND. `(?<!…)` survives esbuild at Vite's default safari14 target
//      and then throws at module evaluation on Safari < 16.4. The app ships as one
//      inlined bundle, so that is a blank page for older iPhones. A prefix capture
//      group is equivalent and universally supported.
//   2. Matcher construction is wrapped in try/catch and returns null on any
//      malformation. A bad weekly glossary append must degrade to plain text,
//      never take down the site.

const JOINER = "[\\s\\u00A0\\-\\u2010\\u2011\\u2013]+"; // space, NBSP, hyphen, non-breaking hyphen, en dash
const BOUNDARY_CLASS = "\\p{L}\\p{N}";

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Both sides of the alias lookup must be normalised identically, or a phrase
// stored as "at-the-market issuance" will never match the text "at the market
// issuance" that the regex happily found.
function normKey(s) {
  return String(s).trim().toLowerCase().replace(/[\s ‐‑–-]+/g, " ");
}

// "at-the-market issuance" must match "at the market issuance" and
// "at–the–market issuance" too — the data mixes all three joiners.
function aliasPattern(alias) {
  return String(alias)
    .trim()
    .split(/[\s \-‐‑–]+/)
    .filter(Boolean)
    .map(escapeRegExp)
    .join(JOINER);
}

/**
 * Build a single case-insensitive matcher over every autolinkable alias.
 *
 * One combined regex, not two merged by index: a case-sensitive pass for acronyms
 * plus a case-insensitive pass for phrases has no defined overlap semantics
 * ("spot ETF" vs "ETF" corrupts the segmentation). Case is validated per match
 * instead, after the fact.
 *
 * @returns {{re: RegExp, byAlias: Map}|null} null if the glossary is unusable.
 */
export function buildMatcher(glossary) {
  try {
    if (!Array.isArray(glossary)) return null;

    const byAlias = new Map();
    const patterns = [];

    for (const entry of glossary) {
      if (!entry || typeof entry.key !== "string" || !entry.key.trim()) continue;
      if (entry.autolink === false) continue;

      const aliases = [entry.label, ...(Array.isArray(entry.aliases) ? entry.aliases : [])]
        .filter((a) => typeof a === "string" && a.trim());

      for (const alias of aliases) {
        const lookup = normKey(alias);
        if (byAlias.has(lookup)) continue;
        byAlias.set(lookup, { key: entry.key, canonical: alias.trim(), caseSensitive: entry.caseSensitive === true });
        patterns.push({ alias: alias.trim(), source: aliasPattern(alias) });
      }
    }

    if (!patterns.length) return null;

    // Longest first so "spot ETF" wins over "ETF" at the same position.
    patterns.sort((a, b) => b.alias.length - a.alias.length);

    const re = new RegExp(
      `(^|[^${BOUNDARY_CLASS}])(${patterns.map((p) => p.source).join("|")})(?![${BOUNDARY_CLASS}])`,
      "giu"
    );

    // Prove it executes here rather than at first render.
    re.lastIndex = 0;
    re.test("warmup");
    re.lastIndex = 0;

    return { re, byAlias };
  } catch {
    return null; // Degrade to plain text; never break the page.
  }
}

/**
 * Split one string into [{text} | {text, key}] segments.
 *
 * `accept(key)` decides whether this occurrence becomes a link — that is where
 * first-occurrence and per-card caps live, so this function stays pure.
 */
export function segmentText(text, matcher, accept) {
  const src = typeof text === "string" ? text : "";
  if (!matcher || !src) return [{ text: src }];

  const out = [];
  let cursor = 0;
  matcher.re.lastIndex = 0;

  let m;
  while ((m = matcher.re.exec(src)) !== null) {
    const prefix = m[1] ?? "";
    const matched = m[2] ?? "";
    const start = m.index + prefix.length;
    const end = start + matched.length;

    if (!matched) {
      matcher.re.lastIndex = m.index + 1;
      continue;
    }

    const entry = matcher.byAlias.get(normKey(matched));

    // Case-sensitive aliases (acronyms) must match exactly; resume just past the
    // start so a longer alias later in the string still gets its chance.
    if (!entry || (entry.caseSensitive && matched !== entry.canonical)) {
      matcher.re.lastIndex = start + 1;
      continue;
    }

    if (typeof accept === "function" && !accept(entry.key)) {
      matcher.re.lastIndex = end;
      continue;
    }

    if (start > cursor) out.push({ text: src.slice(cursor, start) });
    out.push({ text: matched, key: entry.key });
    cursor = end;
    matcher.re.lastIndex = end;
  }

  if (cursor < src.length) out.push({ text: src.slice(cursor) });
  return out.length ? out : [{ text: src }];
}

/**
 * Segment every string of one card in reading order, linking only the first
 * occurrence of each term and capping how many links a card may carry.
 *
 * Pure: same inputs → same output. Safe to call at module scope, and safe under
 * StrictMode's double-invoke.
 *
 * @returns {{segments: Array<Array>, keys: string[]}}
 */
export function linkCard(texts, matcher, max = 6) {
  const seen = new Set();
  const list = Array.isArray(texts) ? texts : [texts];
  const accept = (key) => {
    if (seen.has(key) || seen.size >= max) return false;
    seen.add(key);
    return true;
  };
  const segments = list.map((t) => segmentText(t, matcher, accept));
  return { segments, keys: [...seen] };
}

/**
 * linkCard over named fields, so call sites index by field name instead of by a
 * fragile positional offset.
 *
 * @param {Array<[string, string]>} pairs [fieldName, text] in READING ORDER —
 *        order decides which occurrence of a term is the one that gets linked.
 * @returns {{fields: Record<string, Array>, keys: string[]}}
 */
export function linkNamed(pairs, matcher, max = 6) {
  const list = Array.isArray(pairs) ? pairs : [];
  const { segments, keys } = linkCard(list.map(([, text]) => text ?? ""), matcher, max);
  const fields = {};
  list.forEach(([name], i) => { fields[name] = segments[i]; });
  return { fields, keys };
}
