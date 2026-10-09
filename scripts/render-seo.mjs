// Crawler-visible static rendition of the curated dashboard content.
//
// The app mounts with ReactDOM.createRoot(...).render(...), which clears #root,
// so this markup is invisible to interactive users but lives in the raw served
// HTML — which is all most AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot,
// Bytespider, …) and Googlebot's first pass ever read. It is regenerated from
// src/data/*.js on every `npm run build`, so it refreshes with the weekly Monday
// refresh. Injected into dist/index.html by scripts/make-single-file.mjs.
//
// Reads (never edits) the per-domain data modules — no React, plain `export const`.

import { DEEP_ANALYSIS } from "../src/data/deep-analysis.js";
import { FORECAST_LEDGER } from "../src/data/forecast-ledger.js";
import { MARKET_THEME, CURATED_MARKET_UPDATES } from "../src/data/market-news.js";
import { HISTORICAL_HIGHLIGHTS, SIX_MONTH_HIGHLIGHTS } from "../src/data/headlines.js";
import {
  ADOPTION_DATA,
  ADOPTION_INDEX_TOP20,
  COUNTRY_HOLDINGS,
  COMPANY_HOLDINGS,
} from "../src/data/adoption.js";
import {
  THESIS_METRICS,
  SOFT_MONEY_COSTS,
  MONEY_HISTORY,
  HARDNESS_DATA,
  PROPERTIES_MATRIX,
  TIME_PREFERENCE,
  THESIS_FLOW,
} from "../src/data/thesis.js";
// Namespace import so optional, later-landing exports (THESIS_QUICK) can be
// feature-detected without breaking the build before they exist.
import * as thesis from "../src/data/thesis.js";
import {
  ALLOCATION_BANDS,
  COMMON_MISTAKES,
  HISTORICAL_DRAWDOWNS,
  STRATEGY_SOURCES,
} from "../src/data/strategy.js";

// --- helpers ---------------------------------------------------------------

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const pct = (p) => `${Math.round(p * 100)}%`;
const num = (n) => Number(n).toLocaleString("en-US");

function sourcesList(sources) {
  if (!sources || !sources.length) return "";
  const items = sources
    .map((s) => `      <li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`)
    .join("\n");
  return `    <h4>Sources</h4>\n    <ul>\n${items}\n    </ul>`;
}

function asOfToISO(asOf) {
  const t = Date.parse(asOf);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
}

// --- sections --------------------------------------------------------------

// First line of the static text: points a reader that runs no script (and the AI
// fetchers this block exists for) at the plain-text guide that
// scripts/render-llms.mjs writes beside index.html.
function llmsPointer() {
  return `  <p class="seo-llms">A short plain-text guide to this page for AI readers (what it shows, how to read its probabilities and track record, where its live data comes from): <a href="llms.txt">llms.txt</a></p>`;
}

function introSection() {
  return `  <header>
    <h1>Bitcoin Intelligence — Live Bitcoin Dashboard</h1>
    <p>A free, real-time Bitcoin dashboard built by <strong>Jake Percy</strong> in <strong>Cincinnati, Ohio</strong>. It pairs live price and on-chain metrics with a weekly, probability-scored deep analysis, a hard-money thesis, an allocation-and-risk strategy framework, curated headlines, and global adoption data — sovereign reserves, public-company treasuries, and ETF flows — on a single page.</p>
    <p>The sections below are a text rendition of the dashboard's curated content, regenerated every week. Live figures (current price, block height, hash rate, ETF flows) load in the interactive app.</p>
  </header>`;
}

function analysisSection() {
  const d = DEEP_ANALYSIS;
  const pa = d.primaryAnalysis;
  const body = pa.body.map((p) => `    <p>${esc(p)}</p>`).join("\n");
  const falsify = pa.falsificationConditions
    .map((c) => `      <li>${esc(c)}</li>`)
    .join("\n");
  const cross = d.crossCurrents
    .map(
      (c) =>
        `    <article>\n      <h4>${esc(c.title)}</h4>\n${c.plain ? `      <p><strong>${esc(c.plain)}</strong></p>\n` : ""}      <p>${esc(
          c.body
        )}</p>\n      <p><em>Themes: ${c.themesConnected.map(esc).join(", ")}</em></p>\n    </article>`
    )
    .join("\n");
  const watch = d.watchList
    .map(
      (w) =>
        `      <li><strong>${esc(w.event)}</strong> — probability ${pct(
          w.probability
        )} (${esc(w.window)}).${w.plain ? ` ${esc(w.plain)}` : ""} ${esc(w.signal)}</li>`
    )
    .join("\n");
  return `  <section aria-labelledby="seo-analysis">
    <h2 id="seo-analysis">Weekly Deep Analysis — ${esc(d.asOf)}</h2>
${d.plainSummary ? `    <p><strong>${esc(d.plainSummary)}</strong></p>\n` : ""}    <p>${esc(d.headline)}</p>
    <h3>Market Context</h3>
    <p>${esc(d.marketContext)}</p>
    <h3>${esc(pa.themeTitle)} — thesis probability ${pct(pa.thesisProbability)}</h3>
${body}
    <h3>Falsification Conditions</h3>
    <ul>
${falsify}
    </ul>
    <h3>Cross-Currents</h3>
${cross}
    <h3>Watch List</h3>
    <ul>
${watch}
    </ul>
    <h3>Contrarian Take — probability ${pct(d.contrarianTake.probability)}</h3>
    <p>${esc(d.contrarianTake.body)}</p>
    <h3>Forecast Calibration</h3>
    <p>Aggregate Brier score ${esc(d.calibration.aggregateBrier)} across ${esc(
    d.calibration.nResolved
  )} resolved forecasts. ${esc(d.calibration.briefSummary)}</p>
${sourcesList(d.sources)}
  </section>`;
}

const CATEGORY_LABELS = {
  macro: "Macro", corporate: "Corporate", etf: "ETF flows", regulation: "Regulation",
  protocol: "Protocol", sovereign: "Sovereign", "market-structure": "Market structure",
};
const OUTCOME_WORDS = { hit: "Happened", miss: "Did not happen", "no-resolution": "No resolution" };

// The forecast ledger — every scored call, the odds we gave it, and the lesson.
function trackRecordSection() {
  const L = FORECAST_LEDGER;
  if (!L || !L.summary) return "";
  const s = L.summary;
  const odds = (r) =>
    r.count > 1 && Array.isArray(r.probabilities)
      ? `${r.count} forecasts: ${r.probabilities.map(pct).join(", ")}`
      : pct(r.probability);
  const rows = (L.resolved || [])
    .map(
      (r) =>
        `        <tr><td>${esc(r.made)}</td><td><strong>${esc(r.event)}</strong>${
          r.lesson ? ` ${esc(r.lesson)}` : ""
        }${
          r.source?.url
            ? ` <a href="${esc(r.source.url)}">${esc(r.source.label || "Source")}</a>`
            : ""
        }</td><td>${esc(odds(r))}</td><td>${esc(
          OUTCOME_WORDS[r.outcome] || r.outcome
        )}</td><td>${r.brier == null ? "—" : Number(r.brier).toFixed(2)}</td></tr>`
    )
    .join("\n");
  const cats = (s.byCategory || [])
    .map(
      (c) =>
        `      <li><strong>${esc(CATEGORY_LABELS[c.category] || c.category)}</strong> — ${esc(
          c.n
        )} scored: ${esc(c.plain)}</li>`
    )
    .join("\n");
  const bands = (s.bands || [])
    .map(
      (b) =>
        `      <li>Called ${esc(b.range)}: ${Math.round(b.hitRate * 100)}% happened (${esc(
          b.n
        )} forecasts)</li>`
    )
    .join("\n");
  return `  <section aria-labelledby="seo-track-record">
    <h2 id="seo-track-record">Forecast track record — ${esc(L.asOf)}</h2>
    <p>${esc(s.plain)}</p>
    <p>${esc(s.nResolved)} forecasts scored; all-time Brier score ${Number(
    s.aggregateBrier
  ).toFixed(2)}, last twenty ${Number(s.rolling20Brier).toFixed(2)}; ${esc(
    L.openCount
  )} forecasts still open.</p>
    <h3>Every scored forecast</h3>
    <table>
      <thead><tr><th>Made</th><th>Forecast</th><th>Odds</th><th>Outcome</th><th>Score</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>
    <p>Score is the Brier score: (our odds − outcome)², lower is better; 0.25 is what coin-flipping scores. A forecast is scored as happened or did not happen against the wording of the forecast itself; one whose wording cannot decide it is marked No resolution and left out of every score.</p>
    <h3>Where the forecasts lean, by category</h3>
    <ul>
${cats}
    </ul>
    <h3>Calibration by band</h3>
    <ul>
${bands}
    </ul>
  </section>`;
}

function marketSection() {
  const t = MARKET_THEME;
  const wouldChange = (text) =>
    text ? `      <p><strong>What would change our mind:</strong> ${esc(text)}</p>\n` : "";
  const cards = CURATED_MARKET_UPDATES.map(
    (u) =>
      `    <article>\n      <h4>${esc(u.title)}</h4>\n      <p><em>${esc(
        u.label
      )}</em></p>\n      <p>${esc(u.detail)}</p>\n${wouldChange(u.wouldChange)}    </article>`
  ).join("\n");
  return `  <section aria-labelledby="seo-market">
    <h2 id="seo-market">Market Pulse — ${esc(t.asOf)}</h2>
    <h3>${esc(t.title)} — ${esc(t.status)}</h3>
    <p>${esc(t.narrative)}</p>
    <p><strong>Why it matters:</strong> ${esc(t.whyItMatters)}</p>
    <p><strong>${esc(t.milestoneLabel)}:</strong> ${esc(t.milestone)}</p>
${wouldChange(t.wouldChange).replace(/^      /, "    ")}    <h3>This Week's Themes</h3>
${cards}
  </section>`;
}

function headlinesSection() {
  const row = (h) =>
    `      <li>${esc(h.date)} — ${esc(h.title)} (${esc(h.source)}${
      h.tag ? `, ${esc(h.tag)}` : ""
    })</li>`;
  return `  <section aria-labelledby="seo-headlines">
    <h2 id="seo-headlines">Bitcoin Headlines</h2>
    <h3>Important Headlines — Past 4 Weeks</h3>
    <ul>
${HISTORICAL_HIGHLIGHTS.map(row).join("\n")}
    </ul>
    <h3>Six-Month Highlights</h3>
    <ul>
${SIX_MONTH_HIGHLIGHTS.map(row).join("\n")}
    </ul>
  </section>`;
}

function adoptionSection() {
  const sovereign = COUNTRY_HOLDINGS.map(
    (c) =>
      `        <tr><td>${esc(c.country)}</td><td>${num(c.btc)}</td><td>${esc(
        c.method
      )}</td><td>${esc(c.status)}</td></tr>`
  ).join("\n");
  const corporate = COMPANY_HOLDINGS.map(
    (c) =>
      `        <tr><td>${esc(c.company)}</td><td>${esc(c.ticker)}</td><td>${num(
        c.btc
      )}</td><td>${esc(c.status)}</td></tr>`
  ).join("\n");
  const rates = ADOPTION_DATA.map(
    (a) =>
      `        <tr><td>${esc(a.country)}</td><td>${esc(a.region)}</td><td>${esc(
        a.rate
      )}%</td></tr>`
  ).join("\n");
  const index = ADOPTION_INDEX_TOP20.map(
    (c) => `      <li>${esc(c.country)} (score ${esc(c.score)})</li>`
  ).join("\n");
  return `  <section aria-labelledby="seo-adoption">
    <h2 id="seo-adoption">Global Bitcoin Adoption</h2>
    <h3>Sovereign Bitcoin Holdings</h3>
    <table>
      <thead><tr><th>Country</th><th>BTC</th><th>Method</th><th>Status</th></tr></thead>
      <tbody>
${sovereign}
      </tbody>
    </table>
    <h3>Public-Company Bitcoin Treasuries</h3>
    <table>
      <thead><tr><th>Company</th><th>Ticker</th><th>BTC</th><th>Status</th></tr></thead>
      <tbody>
${corporate}
      </tbody>
    </table>
    <h3>Estimated Ownership Rate by Country</h3>
    <table>
      <thead><tr><th>Country</th><th>Region</th><th>Adoption %</th></tr></thead>
      <tbody>
${rates}
      </tbody>
    </table>
    <h3>Crypto Adoption Index — Top 20</h3>
    <ol>
${index}
    </ol>
  </section>`;
}

function thesisSection() {
  const metrics = THESIS_METRICS.map(
    (m) => `      <li><strong>${esc(m.value)}</strong> — ${esc(m.label)}: ${esc(m.sub)}</li>`
  ).join("\n");
  const costs = SOFT_MONEY_COSTS.map(
    (c) =>
      `    <article>\n      <h4>${esc(c.label)}: ${esc(c.title)}</h4>\n      <p>${esc(
        c.text
      )}</p>\n      <p><em>${esc(c.stat)}</em></p>\n    </article>`
  ).join("\n");
  const history = MONEY_HISTORY.map(
    (m) => `      <li><strong>${esc(m.era)} — ${esc(m.name)}:</strong> ${esc(m.note)}</li>`
  ).join("\n");
  const hardness = HARDNESS_DATA.map(
    (h) => `      <li><strong>${esc(h.name)} — ${esc(h.rate)}%:</strong> ${esc(h.note)}</li>`
  ).join("\n");
  const matrix = PROPERTIES_MATRIX.map(
    (p) =>
      `        <tr><td>${esc(p.property)} — ${esc(p.desc)}</td><td>${esc(
        p.gold.note
      )}</td><td>${esc(p.usd.note)}</td><td>${esc(p.bitcoin.note)}</td></tr>`
  ).join("\n");
  const flow = THESIS_FLOW.map(
    (f) =>
      `    <article>\n      <h4>${esc(f.step)} · ${esc(f.eyebrow)} — ${esc(
        f.title
      )}</h4>\n      <p>${esc(f.property)}</p>\n      <p>${esc(f.implication)}</p>\n    </article>`
  ).join("\n");
  const soft = TIME_PREFERENCE.soft.items
    .map((i) => `${esc(i.head)} (${esc(i.tail)})`)
    .join("; ");
  const hard = TIME_PREFERENCE.hard.items
    .map((i) => `${esc(i.head)} (${esc(i.tail)})`)
    .join("; ");
  // "The short version" — rendered only once THESIS_QUICK lands in thesis.js.
  const q = thesis.THESIS_QUICK;
  const quickCards = q
    ? (q.cards || [])
        .map(
          (c) =>
            `    <article>\n      <h4>${esc(c.title)}</h4>\n      <p>${esc(c.plain)}</p>\n${
              c.why ? `      <p>${esc(c.why)}</p>\n` : ""
            }${
              c.stat
                ? `      <p><em>${esc(c.stat.value)} — ${esc(c.stat.label)}${
                    c.stat.source?.url
                      ? ` (<a href="${esc(c.stat.source.url)}">${esc(
                          c.stat.source.label || "source"
                        )}</a>)`
                      : ""
                  }</em></p>\n`
                : ""
            }    </article>`
        )
        .join("\n")
    : "";
  const quick = q
    ? `    <h3>The short version</h3>\n${q.intro ? `    <p>${esc(q.intro)}</p>\n` : ""}${
        quickCards ? `${quickCards}\n` : ""
      }`
    : "";
  return `  <section aria-labelledby="seo-thesis">
    <h2 id="seo-thesis">The Bitcoin Thesis — Hard Money</h2>
${quick}    <ul>
${metrics}
    </ul>
    <h3>The Problem: The Cost of Soft Money</h3>
${costs}
    <h3>Five Thousand Years of Monetary History</h3>
    <ul>
${history}
    </ul>
    <h3>Monetary Hardness (Stock-to-Flow)</h3>
    <ul>
${hardness}
    </ul>
    <h3>Bitcoin vs. Gold vs. USD</h3>
    <table>
      <thead><tr><th>Property</th><th>Gold</th><th>USD</th><th>Bitcoin</th></tr></thead>
      <tbody>
${matrix}
      </tbody>
    </table>
    <h3>The Thesis in Four Moves</h3>
${flow}
    <h3>Time Preference</h3>
    <p><strong>${esc(TIME_PREFERENCE.soft.label)}:</strong> ${soft}.</p>
    <p><strong>${esc(TIME_PREFERENCE.hard.label)}:</strong> ${hard}.</p>
  </section>`;
}

function strategySection() {
  const bands = ALLOCATION_BANDS.map(
    (b) =>
      `        <tr><td>${esc(b.band)}</td><td>${esc(b.persona)}</td><td>${esc(
        b.rationale
      )}</td></tr>`
  ).join("\n");
  const mistakes = COMMON_MISTAKES.map(
    (m) => `    <article>\n      <h4>${esc(m.title)}</h4>\n      <p>${esc(m.body)}</p>\n    </article>`
  ).join("\n");
  const drawdowns = HISTORICAL_DRAWDOWNS.map(
    (d) =>
      `      <li><strong>${esc(d.year)}: −${esc(d.drawdownPct)}%</strong> — ${esc(
        d.label
      )} (${esc(d.duration)})</li>`
  ).join("\n");
  return `  <section aria-labelledby="seo-strategy">
    <h2 id="seo-strategy">Bitcoin Strategy — Allocation &amp; Risk</h2>
    <h3>Allocation Bands</h3>
    <table>
      <thead><tr><th>Allocation</th><th>Persona</th><th>Rationale</th></tr></thead>
      <tbody>
${bands}
      </tbody>
    </table>
    <h3>Common Mistakes</h3>
${mistakes}
    <h3>Historical Drawdowns</h3>
    <ul>
${drawdowns}
    </ul>
${sourcesList(STRATEGY_SOURCES)}
  </section>`;
}

function aboutSection() {
  return `  <section aria-labelledby="seo-about">
    <h2 id="seo-about">About this dashboard</h2>
    <p>Bitcoin Intelligence is a Cincinnati, Ohio Bitcoin resource providing live market intelligence, education, and analysis. It is written and maintained by Jake Percy.</p>
    <p><a href="https://jakepercy.com">jakepercy.com</a></p>
  </section>`;
}

// --- public API ------------------------------------------------------------

export function renderSeoHtml() {
  return `<main class="seo-static" aria-label="Bitcoin Intelligence — text summary for readers without JavaScript">
${llmsPointer()}
${introSection()}
${analysisSection()}
${trackRecordSection()}
${marketSection()}
${headlinesSection()}
${adoptionSection()}
${thesisSection()}
${strategySection()}
${aboutSection()}
</main>`;
}

export function renderJsonLd({ origin }) {
  const d = DEEP_ANALYSIS;
  const datePublished = asOfToISO(d.asOf);
  const node = {
    "@context": "https://schema.org",
    "@type": ["Article", "AnalysisNewsArticle"],
    headline: `Bitcoin Weekly Deep Analysis — ${d.asOf}`,
    description: d.headline,
    articleBody: d.primaryAnalysis.body.join("\n\n"),
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    author: { "@type": "Person", name: "Jake Percy", url: "https://jakepercy.com" },
    publisher: { "@type": "Person", name: "Jake Percy", url: "https://jakepercy.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": origin },
    about: { "@type": "Thing", name: "Bitcoin" },
    isAccessibleForFree: true,
  };
  // Neutralize any "</script" inside the JSON so it can't break out of the tag.
  const safe = JSON.stringify(node, null, 2).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${safe}\n</script>`;
}
