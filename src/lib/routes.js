// Hash routing helpers — the one place the URL scheme is defined.
//
// Scheme:  #/<tab-slug>                → open a tab
//          #/<tab-slug>/<anchor-id>    → open a tab, then scroll to an element id
//
// Only hashes that start with "#/" are routes. Anything else (an old-style
// "#some-id" link, an empty hash) is left to the browser and ignored by the
// router, so nothing here can hijack a plain in-page anchor.
//
// The shell (src/BitcoinDashboard.jsx) owns the hook that listens for
// hashchange/popstate and switches tabs. Components never set the tab
// directly — they change the hash (via an <a href={tabHref(...)}> or
// navigateTo()) and the router does the rest, which is what makes the
// browser's back button and shared links work.

import { TABS } from "./constants.js";

export const TAB_SLUGS = ["dashboard", "thesis", "strategy", "headlines", "adoption", "analysis"];

// Element ids that other tabs link to. Keep in sync with the components that
// render them; the schema check (scripts/check-schema.mjs) does not see the DOM,
// so a typo here shows up as "the link scrolls nowhere", not as a build error.
export const ANCHORS = {
  trackRecord: "track-record",          // Analysis tab — the forecast ledger
  marketUpdates: "market-updates",      // Dashboard — the four curated cards
  thesisQuick: "thesis-quick",          // Thesis — the five-minute version
  thesisFull: "thesis-full",            // Thesis — the start of the long read
  thesisBasics: "thesis-phase-basics",
  thesisIntermediate: "thesis-phase-intermediate",
  thesisAdvanced: "thesis-phase-advanced",
  thesisObjections: "thesis-objections",
  thesisMove: (i) => `thesis-move-${i}`,
};

const SAFE_ANCHOR = /^[A-Za-z][\w-]*$/;

export const tabIndexFromSlug = (slug) => {
  const i = TAB_SLUGS.indexOf(String(slug || "").toLowerCase());
  return i === -1 ? null : i;
};

export const tabHref = (tabIndex, anchorId) => {
  const slug = TAB_SLUGS[tabIndex] ?? TAB_SLUGS[0];
  return anchorId && SAFE_ANCHOR.test(anchorId) ? `#/${slug}/${anchorId}` : `#/${slug}`;
};

// { tab: number | null, anchor: string | null }. `tab` is null when the hash is
// not a route (so callers can leave the current tab alone).
export const parseHash = (hash) => {
  const raw = hash == null && typeof window !== "undefined" ? window.location.hash : (hash || "");
  if (!raw.startsWith("#/")) return { tab: null, anchor: null };
  const [slug, anchor] = raw.slice(2).split("/");
  const tab = tabIndexFromSlug(slug);
  if (tab == null) return { tab: null, anchor: null };
  return { tab, anchor: anchor && SAFE_ANCHOR.test(anchor) ? anchor : null };
};

// Change the route. Re-dispatches hashchange when the hash is already the
// target so a second click on the same anchor still scrolls to it.
export const navigateTo = (tabIndex, anchorId) => {
  if (typeof window === "undefined") return;
  const next = tabHref(tabIndex, anchorId);
  if (window.location.hash === next) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = next;
  }
};

export const tabTitle = (tabIndex) =>
  tabIndex > 0 && TABS[tabIndex] ? `${TABS[tabIndex]} · Bitcoin Intelligence` : "Bitcoin Intelligence | Live Bitcoin Dashboard, Education & Analysis";
