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

function introSection() {
  return `  <header>
    <h1>Bitcoin Intelligence — Live Dashboard by Nati-Crypto</h1>
    <p>A free, real-time Bitcoin dashboard built by <strong>Nati-Crypto</strong> in <strong>Cincinnati, Ohio</strong>. It pairs live price and on-chain metrics with a weekly, probability-scored deep analysis, a hard-money thesis, an allocation-and-risk strategy framework, curated headlines, and global adoption data — sovereign reserves, public-company treasuries, and ETF flows — on a single page.</p>
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
        `    <article>\n      <h4>${esc(c.title)}</h4>\n      <p>${esc(
          c.body
        )}</p>\n      <p><em>Themes: ${c.themesConnected.map(esc).join(", ")}</em></p>\n    </article>`
    )
    .join("\n");
  const watch = d.watchList
    .map(
      (w) =>
        `      <li><strong>${esc(w.event)}</strong> — probability ${pct(
          w.probability
        )} (${esc(w.window)}). ${esc(w.signal)}</li>`
    )
    .join("\n");
  return `  <section aria-labelledby="seo-analysis">
    <h2 id="seo-analysis">Weekly Deep Analysis — ${esc(d.asOf)}</h2>
    <p><strong>${esc(d.headline)}</strong></p>
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

function marketSection() {
  const t = MARKET_THEME;
  const cards = CURATED_MARKET_UPDATES.map(
    (u) =>
      `    <article>\n      <h4>${esc(u.title)}</h4>\n      <p><em>${esc(
        u.label
      )}</em></p>\n      <p>${esc(u.detail)}</p>\n    </article>`
  ).join("\n");
  return `  <section aria-labelledby="seo-market">
    <h2 id="seo-market">Market Pulse — ${esc(t.asOf)}</h2>
    <h3>${esc(t.title)} — ${esc(t.status)}</h3>
    <p>${esc(t.narrative)}</p>
    <p><strong>Why it matters:</strong> ${esc(t.whyItMatters)}</p>
    <p><strong>${esc(t.milestoneLabel)}:</strong> ${esc(t.milestone)}</p>
    <h3>This Week's Themes</h3>
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
  return `  <section aria-labelledby="seo-thesis">
    <h2 id="seo-thesis">The Bitcoin Thesis — Hard Money</h2>
    <ul>
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
    <h2 id="seo-about">About Nati-Crypto</h2>
    <p>Nati-Crypto is a Cincinnati, Ohio Bitcoin resource providing live market intelligence, education, and analysis. "Nati" is short for Cincinnati — the Queen City's Bitcoin community hub.</p>
    <p><a href="https://nati-crypto.com">Visit Nati-Crypto</a></p>
  </section>`;
}

// --- public API ------------------------------------------------------------

export function renderSeoHtml() {
  return `<main class="seo-static" aria-label="Bitcoin Intelligence — text summary for readers without JavaScript">
${introSection()}
${analysisSection()}
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
    author: { "@type": "Organization", name: "Nati-Crypto", url: "https://nati-crypto.com" },
    publisher: { "@type": "Organization", name: "Nati-Crypto", url: "https://nati-crypto.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": origin },
    about: { "@type": "Thing", name: "Bitcoin" },
    isAccessibleForFree: true,
  };
  // Neutralize any "</script" inside the JSON so it can't break out of the tag.
  const safe = JSON.stringify(node, null, 2).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${safe}\n</script>`;
}
