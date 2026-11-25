// The six tab components, resolved in one place so the shell never decides
// between lazy and eager itself.
//
// Split build (the default, `node scripts/build.mjs`): every tab except the
// Dashboard is a React.lazy() chunk fetched on first visit. The Dashboard
// stays a plain static import because it is the first paint.
//
// Single-file build (`node scripts/build.mjs --single`): every tab is resolved
// at module load so nothing suspends — see src/lib/lazy-named.js.
//
// Each tab is wrapped in memo(): the shell re-renders on things no tab cares
// about (the scrolled-header flag, the pull-to-refresh distance on every
// touchmove, the back-to-top button), and without the memo every mounted tab
// re-rendered with it.
import { memo } from "react";
import { DashboardTab as DashboardTabImpl } from "./DashboardTab.jsx";
import { lazyNamed, once } from "../lib/lazy-named.js";

const loaders = [
  null, // Dashboard: static import, always there
  once(() => import("./ThesisTab.jsx")),
  once(() => import("./StrategyTab.jsx")),
  once(() => import("./HeadlinesTab.jsx")),
  once(() => import("./AdoptionTab.jsx")),
  once(() => import("./AnalysisTab.jsx")),
];

// Start downloading a tab's chunk before it is opened (the shell calls this on
// hover / focus / touchstart of a tab link), so the click that follows usually
// finds it in memory. Safe to call any number of times; a failure is swallowed
// here and retried on the real navigation.
export const prefetchTab = (tabIndex) => {
  const load = loaders[tabIndex];
  if (load) load().catch(() => {});
};

export const DashboardTab = memo(DashboardTabImpl);
export const BitcoinThesisTab = memo(lazyNamed(loaders[1], "BitcoinThesisTab"));
export const StrategyTab = memo(lazyNamed(loaders[2], "StrategyTab"));
export const HeadlinesTab = memo(lazyNamed(loaders[3], "HeadlinesTab"));
export const AdoptionTab = memo(lazyNamed(loaders[4], "AdoptionTab"));
export const DeepAnalysisTab = memo(lazyNamed(loaders[5], "DeepAnalysisTab"));
