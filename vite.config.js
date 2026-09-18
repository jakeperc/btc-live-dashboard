import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Two build shapes, chosen by scripts/build.mjs through process.env.SINGLE_FILE:
//
//   split (default)  index.html + assets/ with hashed, long-cacheable chunks:
//                    vendor-react, vendor-charts, the eager shell + Dashboard,
//                    and one lazy chunk per remaining tab (src/tabs/index.js).
//   single           one JS chunk with every dynamic import inlined, which
//                    scripts/make-single-file.mjs then folds into index.html
//                    for hosts that can only take a single file.
//
// manualChunks and inlineDynamicImports are mutually exclusive in Rollup, so
// exactly one of them is set below.
const single = process.env.SINGLE_FILE === "1";

// Package name from a Rollup module id ("…/node_modules/@scope/name/x.js").
const pkgName = (id) => {
  const norm = id.replace(/\\/g, "/");
  const i = norm.lastIndexOf("node_modules/");
  if (i === -1) return null;
  const parts = norm.slice(i + "node_modules/".length).split("/");
  return parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
};

const VENDOR_REACT = new Set(["react", "react-dom", "scheduler"]);
// recharts and everything it drags in (victory-vendor's d3-* set, lodash,
// react-smooth's transition helpers). Kept together so a weekly content
// refresh never invalidates the ~200 kB chart engine in a visitor's cache.
const VENDOR_CHARTS = new Set([
  "recharts", "recharts-scale", "victory-vendor", "lodash", "react-smooth",
  "react-transition-group", "react-is", "prop-types", "internmap",
  "decimal.js-light", "eventemitter3", "fast-equals", "tiny-invariant", "clsx",
  "@babel/runtime", "dom-helpers", "object-assign",
]);

const manualChunks = (id) => {
  const pkg = pkgName(id);
  if (!pkg) return undefined;
  if (VENDOR_REACT.has(pkg)) return "vendor-react";
  if (VENDOR_CHARTS.has(pkg) || pkg.startsWith("d3-")) return "vendor-charts";
  return undefined; // let Rollup place anything else where it is used
};

export default defineConfig({
  base: "./",
  plugins: [react()],
  define: {
    // Read by src/tabs/index.js to choose eager vs lazy tabs. A literal, so
    // the unused branch is dead code and tree-shaken.
    "import.meta.env.VITE_SINGLE_FILE": JSON.stringify(single ? "1" : "0"),
  },
  build: {
    rollupOptions: {
      output: single
        ? { inlineDynamicImports: true }
        : { manualChunks },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
