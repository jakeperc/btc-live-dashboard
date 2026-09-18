// The six tab components, resolved in one place so the shell never decides
// between lazy and eager itself.
//
// Split build (the default, `node scripts/build.mjs`): every tab except the
// Dashboard is a React.lazy() chunk fetched on first visit. The Dashboard
// stays a plain static import because it is the first paint.
//
// Single-file build (`node scripts/build.mjs --single`, VITE_SINGLE_FILE="1"):
// vite.config.js inlines every dynamic import into the one bundle, so the
// import() calls below settle from memory in a microtask. In that mode we
// start them at module load — before React's first render — so no tab ever
// suspends and no Suspense fallback ever shows, which is exactly how the old
// fully-eager shell behaved. SINGLE is a build-time literal (see `define` in
// vite.config.js), so the arm that is not in use is dropped by tree-shaking.
import { lazy, createElement } from "react";
import { DashboardTab } from "./DashboardTab.jsx";

const SINGLE = import.meta.env.VITE_SINGLE_FILE === "1";

const tab = (load, name) => {
  if (SINGLE) {
    let Comp = null;
    let error = null;
    const ready = load().then(
      (m) => { Comp = m[name]; },
      (e) => { error = e; }
    );
    const Eager = (props) => {
      if (error) throw error;      // surfaces in the tab's ErrorBoundary
      if (!Comp) throw ready;      // only reachable if render beats the microtask
      return createElement(Comp, props);
    };
    Eager.displayName = name;
    return Eager;
  }
  return lazy(() => load().then((m) => ({ default: m[name] })));
};

export { DashboardTab };
export const BitcoinThesisTab = tab(() => import("./ThesisTab.jsx"), "BitcoinThesisTab");
export const StrategyTab = tab(() => import("./StrategyTab.jsx"), "StrategyTab");
export const HeadlinesTab = tab(() => import("./HeadlinesTab.jsx"), "HeadlinesTab");
export const AdoptionTab = tab(() => import("./AdoptionTab.jsx"), "AdoptionTab");
export const DeepAnalysisTab = tab(() => import("./AnalysisTab.jsx"), "DeepAnalysisTab");
