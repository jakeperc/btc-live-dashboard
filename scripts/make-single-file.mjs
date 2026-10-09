// Finalize dist/index.html after `vite build`. Called by scripts/build.mjs and
// runnable on its own (`node scripts/make-single-file.mjs [--single]`).
//
// Both modes: inline the built CSS into <head>, inject the crawler-visible
// static content at <!-- SEO_STATIC_CONTENT -->, add the build stamp and the
// Article JSON-LD, and write dist/llms.txt (scripts/render-llms.mjs).
//
//   split  (default)  keep Vite's <script type="module" src="./assets/…">
//                     and <link rel="modulepreload"> tags; leave dist/assets/.
//   single (--single) inline the one JS chunk at the end of <body> and delete
//                     dist/assets/, leaving a single self-contained file.

import { readFile, writeFile, rm, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderSeoHtml, renderJsonLd } from "./render-seo.mjs";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(repoRoot, "dist");
const indexPath = join(distDir, "index.html");
const assetsDir = join(distDir, "assets");

// One live domain, one self-canonical file: dist/index.html = jakepercy.com/bitcoin.
// (This used to emit a second per-domain variant when the page was also served
// from a separate brand domain; that domain is gone, so index.html is the whole
// deploy and index.html's canonical is already correct as authored.)
const TARGETS = [
  { origin: "https://jakepercy.com/bitcoin", out: "index.html" },
];

const scriptPattern =
  /<script\s+type="module"(?<attrs>[^>]*)\s+src="(?<src>\.\/assets\/[^"]+\.js)"(?<tail>[^>]*)><\/script>/;
const cssPattern =
  /<link[^>]*\brel="stylesheet"[^>]*\bhref="(?<href>\.\/assets\/[^"]+\.css)"[^>]*>/;

export const finalizeDist = async ({ single = false } = {}) => {
  const html = await readFile(indexPath, "utf8");
  const match = html.match(scriptPattern);
  if (!match?.groups?.src) {
    throw new Error("Could not find the built Vite module script in dist/index.html.");
  }

  let inlineScript = null;
  if (single) {
    // Guard against inlining only the entry of a split build: that would leave
    // dangling chunk imports and then delete them.
    const jsFiles = (await readdir(assetsDir)).filter((f) => f.endsWith(".js"));
    if (jsFiles.length > 1) {
      throw new Error(
        `dist/assets/ holds ${jsFiles.length} JS chunks — this is a split build. ` +
        "Run `node scripts/build.mjs --single` so Vite inlines the chunks first."
      );
    }
    const scriptPath = join(distDir, match.groups.src.replace(/^\.\//, ""));
    const script = await readFile(scriptPath, "utf8");
    const safeScript = script.replace(/<\/script/gi, "<\\/script");
    inlineScript = `<script type="module">\n${safeScript}\n</script>`;
  }

  // 1) Single mode: remove the external module script from where Vite placed
  //    it (the <head>). It is re-added inlined at the end of <body> below, so
  //    the crawler-readable content comes first in source order instead of
  //    trailing an 840 kB JS blob. Split mode keeps the tag: it is a short
  //    reference, and leaving it in <head> lets the browser start fetching
  //    the entry chunk (and its modulepreloads) as early as possible.
  let base = single ? html.replace(match[0], "") : html;

  // 1b) Inline the built CSS asset (src/styles.css → dist/assets/*.css) into
  //     <head>, replacing Vite's <link> tag. Injecting before </head> keeps the
  //     app CSS after the boot <style>, preserving today's cascade order, and
  //     means styles apply before React mounts (they also style the crawler/
  //     no-JS static content).
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

  // 4) Emit the self-canonical file. The lookahead avoids touching the og-image
  //    path (…/bitcoin/og-image.png), rewriting only the page URL itself — a no-op
  //    while index.html already carries the primary origin, but it keeps the loop
  //    correct if another target is ever added back. In single mode the inlined
  //    bundle is appended before </body> (module scripts are deferred, so order
  //    relative to <head> doesn't change execution timing).
  const pageUrl = /https:\/\/jakepercy\.com\/bitcoin(?![/\w-])/g;
  for (const { origin, out } of TARGETS) {
    let variant = base.replace(pageUrl, origin);
    const articleLd = renderJsonLd({ origin });
    variant = variant.replace(/<\/head>/i, () => `    ${articleLd}\n  </head>`);
    if (inlineScript) variant = variant.replace(/<\/body>/i, () => `    ${inlineScript}\n  </body>`);
    await writeFile(join(distDir, out), variant, "utf8");
    console.log(`Wrote dist/${out} — canonical ${origin} (build: ${buildStamp}, ${single ? "single-file" : "split"})`);
  }

  // 5) llms.txt: a plain-text guide to the page for AI readers, written beside
  //    index.html. The weekly refresh builds unattended and llms.txt must never
  //    be the reason it fails: writeLlms catches its own errors (odd data drops
  //    its "Current state" block, everything else is a warning prefixed
  //    "llms:"), and the module is imported here, not at the top, so even a
  //    broken render-llms.mjs cannot stop the build.
  try {
    const { writeLlms } = await import("./render-llms.mjs");
    await writeLlms(distDir);
  } catch (e) {
    console.warn(`llms: skipped - ${e.message}`);
  }

  if (single) {
    await rm(assetsDir, { recursive: true, force: true });
  } else {
    const files = await readdir(assetsDir);
    console.log(`Kept dist/assets/ (${files.length} files; upload the whole dist/ folder).`);
  }
};

// Direct run: `node scripts/make-single-file.mjs [--single]`. Mode comes from
// the flag or SINGLE_FILE=1; anything else finalizes a split build.
const isDirectRun = (() => {
  if (!process.argv[1]) return false;
  const self = resolve(fileURLToPath(import.meta.url));
  const entry = resolve(process.argv[1]);
  return process.platform === "win32"
    ? self.toLowerCase() === entry.toLowerCase()
    : self === entry || pathToFileURL(entry).href === import.meta.url;
})();

if (isDirectRun) {
  const single = process.argv.includes("--single") || process.env.SINGLE_FILE === "1";
  await finalizeDist({ single });
}
