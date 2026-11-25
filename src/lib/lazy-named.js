// Code-split a named export. Used for the five lazy tabs (src/tabs/index.js)
// and for the Dashboard's chart module (src/tabs/DashboardTab.jsx).
//
// Split build (the default): a plain React.lazy() chunk, fetched on first
// render — or earlier, if the caller warms it up by calling load() itself.
//
// Single-file build (VITE_SINGLE_FILE="1"): vite.config.js inlines every
// dynamic import into the one bundle, so load() settles from memory in a
// microtask. In that mode it is started here, at module load — before React's
// first render — so nothing ever suspends and no Suspense fallback ever shows,
// which is exactly how the old fully-eager shell behaved. SINGLE is a
// build-time literal (see `define` in vite.config.js), so the arm that is not
// in use is dropped by tree-shaking.
import { lazy, createElement } from "react";

const SINGLE = import.meta.env.VITE_SINGLE_FILE === "1";

export const lazyNamed = (load, name) => {
  if (SINGLE) {
    let Comp = null;
    let error = null;
    const ready = load().then(
      (m) => { Comp = m[name]; },
      (e) => { error = e; }
    );
    const Eager = (props) => {
      if (error) throw error;      // surfaces in the nearest ErrorBoundary
      if (!Comp) throw ready;      // only reachable if render beats the microtask
      return createElement(Comp, props);
    };
    Eager.displayName = name;
    return Eager;
  }
  return lazy(() => load().then((m) => ({ default: m[name] })));
};

// Wrap a dynamic import so repeated calls share one request, and a failed
// request (offline, flaky network) is forgotten so the next call tries again
// instead of replaying the cached rejection. Lets a chunk be warmed up early —
// on hover, on idle — without changing what happens when it is finally needed.
export const once = (importer) => {
  let pending = null;
  return () => {
    if (!pending) {
      pending = importer();
      pending.catch(() => { pending = null; });
    }
    return pending;
  };
};
