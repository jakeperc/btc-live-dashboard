// Build entry point.
//
//   node scripts/build.mjs            split build (default) → dist/index.html + dist/assets/
//   node scripts/build.mjs --single   one self-contained dist/index.html (old behaviour)
//
// What happens, in order:
//   1. process.env.SINGLE_FILE (and VITE_SINGLE_FILE, for import.meta.env) is
//      set from the flag BEFORE Vite reads vite.config.js, which branches on it.
//   2. scripts/check-schema.mjs runs first if it exists (a data-shape gate
//      owned by another stream). A non-zero exit aborts the build.
//   2b. scripts/check-plain.mjs runs next if it exists. Its exit codes are
//      0 clean, 1 style, 2 hard findings in Editor-editable prose, 3 STRUCTURAL.
//      Only 3 aborts the build — 1 and 2 are the weekly Editor's job, not a
//      reason to block a build someone is running by hand.
//   3. Vite's build() API bundles the app.
//        split:  the shell + Dashboard are the entry chunk; Thesis, Strategy,
//                Headlines, Adoption and Analysis are React.lazy chunks
//                (src/tabs/index.js); react/react-dom/scheduler go to
//                vendor-react and recharts + its d3/lodash deps to
//                vendor-charts (vite.config.js manualChunks). Every asset is
//                content-hashed, so deploy/.htaccess can cache them for a year
//                while index.html stays no-cache.
//        single: inlineDynamicImports folds every tab into one chunk and the
//                tabs module resolves them eagerly, so nothing ever suspends.
//   4. scripts/make-single-file.mjs finalizes dist/index.html in both modes:
//      inlines the CSS, injects the crawler-visible SEO content and JSON-LD,
//      adds the build stamp. In single mode it also inlines the JS and deletes
//      dist/assets/; in split mode it leaves Vite's module script and
//      modulepreload tags alone.
//
// Routing note for anyone reading this from the build side: the app is a
// single index.html with hash routes (#/thesis, #/analysis/track-record —
// src/lib/routes.js). No server rewrites are needed; every route is the same
// file, which is why the split build is still a plain static upload.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import { finalizeDist } from "./make-single-file.mjs";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const single = process.argv.includes("--single");

process.env.SINGLE_FILE = single ? "1" : "0";
process.env.VITE_SINGLE_FILE = process.env.SINGLE_FILE;

const schemaCheck = join(repoRoot, "scripts", "check-schema.mjs");
if (existsSync(schemaCheck)) {
  console.log("build: running scripts/check-schema.mjs");
  const result = spawnSync(process.execPath, [schemaCheck], { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`build: schema check failed (exit ${result.status ?? "signal"}); aborting before Vite.`);
    process.exit(result.status ?? 1);
  }
}

const plainCheck = join(repoRoot, "scripts", "check-plain.mjs");
if (existsSync(plainCheck)) {
  console.log("build: running scripts/check-plain.mjs");
  const result = spawnSync(process.execPath, [plainCheck], { cwd: repoRoot, stdio: "inherit" });
  const code = result.status ?? 1;
  if (code === 3) {
    console.error("build: check-plain reported a STRUCTURAL finding (exit 3); aborting before Vite. Fix it, or restore the pre-edit snapshot, then rebuild.");
    process.exit(3);
  }
  if (code !== 0) {
    console.log(`build: check-plain exit ${code} (style / hard findings) — not blocking the build; see the report above.`);
  }
}

console.log(`build: vite (${single ? "single-file" : "split"} mode)`);
await build({
  root: repoRoot,
  configFile: join(repoRoot, "vite.config.js"),
  logLevel: "info",
});

await finalizeDist({ single });
