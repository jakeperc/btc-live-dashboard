import { readFile, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSeoHtml, renderJsonLd } from "./render-seo.mjs";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(repoRoot, "dist");
const indexPath = join(distDir, "index.html");
const assetsDir = join(distDir, "assets");

// The same single file is deployed to two live domains. A shared cross-domain
// canonical would suppress whichever domain it doesn't point at, so we emit one
// self-canonical file per domain instead — each one tells Google "I am the
// canonical for my own URL," and both index independently.
// Primary (dist/index.html) = jakepercy.com/bitcoin.
const TARGETS = [
  { origin: "https://jakepercy.com/bitcoin", out: "index.html" },
  { origin: "https://nati-crypto.com/bitcoin", out: "index.nati-crypto.html" },
];

const html = await readFile(indexPath, "utf8");
const scriptPattern =
  /<script\s+type="module"(?<attrs>[^>]*)\s+src="(?<src>\.\/assets\/[^"]+\.js)"(?<tail>[^>]*)><\/script>/;
const match = html.match(scriptPattern);

if (!match?.groups?.src) {
  throw new Error("Could not find the built Vite module script in dist/index.html.");
}

const scriptPath = join(distDir, match.groups.src.replace(/^\.\//, ""));
const script = await readFile(scriptPath, "utf8");
const safeScript = script.replace(/<\/script/gi, "<\\/script");
const inlineScript = `<script type="module">\n${safeScript}\n</script>`;

// 1) Remove the external module script from where Vite placed it (the <head>).
//    We re-add it inlined at the end of <body> below, so the crawler-readable
//    content comes first in source order instead of trailing an 840 kB JS blob.
let base = html.replace(match[0], "");

// 1b) Inline the built CSS asset (src/styles.css → dist/assets/*.css) into
//     <head>, replacing Vite's <link> tag. Injecting before </head> keeps the
//     app CSS after the boot <style>, preserving today's cascade order, and
//     means styles apply before React mounts (they also style the crawler/
//     no-JS static content).
const cssPattern =
  /<link[^>]*\brel="stylesheet"[^>]*\bhref="(?<href>\.\/assets\/[^"]+\.css)"[^>]*>/;
const cssMatch = base.match(cssPattern);
if (!cssMatch?.groups?.href) {
  throw new Error("Could not find the built CSS asset link in dist/index.html.");
}
const css = await readFile(join(distDir, cssMatch.groups.href.replace(/^\.\//, "")), "utf8");
const safeCss = css.replace(/<\/style/gi, "<\\/style");
base = base.replace(cssMatch[0], "");
base = base.replace(/<\/head>/i, () => `    <style>\n${safeCss}\n    </style>\n  </head>`);

// 2) Inject the crawler-visible static content into #root (replaces the marker).
const marker = "<!-- SEO_STATIC_CONTENT -->";
if (!base.includes(marker)) {
  throw new Error(`SEO marker ${marker} not found in dist/index.html.`);
}
const seoHtml = renderSeoHtml();
base = base.replace(marker, () => seoHtml);

// 3) Build stamp.
const buildStamp = new Date().toISOString();
base = base.replace(/<head>/i, `<head>\n    <!-- build: ${buildStamp} -->`);

// 4) Emit one self-canonical file per live domain. The lookahead avoids touching
//    the og-image path (…/bitcoin/og-image.png) and the bare brand root
//    (https://nati-crypto.com), rewriting only the page URL itself. The inlined
//    bundle is appended before </body> (module scripts are deferred, so order
//    relative to <head> doesn't change execution timing).
const pageUrl = /https:\/\/nati-crypto\.com\/bitcoin(?![/\w-])/g;
for (const { origin, out } of TARGETS) {
  let variant = base.replace(pageUrl, origin);
  const articleLd = renderJsonLd({ origin });
  variant = variant.replace(/<\/head>/i, () => `    ${articleLd}\n  </head>`);
  variant = variant.replace(/<\/body>/i, () => `    ${inlineScript}\n  </body>`);
  await writeFile(join(distDir, out), variant, "utf8");
  console.log(`Wrote dist/${out} — canonical ${origin} (build: ${buildStamp})`);
}

await rm(assetsDir, { recursive: true, force: true });
