import { useState, useEffect } from "react";
import { NEWS_FEEDS, FALLBACK_NEWS } from "../data/market-news.js";
import { RSS2JSON_URL, NEWS_POLL_MS, POLL_BACKOFF_CAP_MS } from "../lib/constants.js";
import { stripHtml, pickTagFromArray, isBitcoinRelevant, isImportantHeadline } from "../lib/format.js";
import { createPoller } from "./ui.jsx";

// Live Bitcoin news — multiple RSS feeds via rss2json proxy. Refreshed every
// 10 minutes while the tab is visible; backs off after failures (createPoller).
//
// `enabled` gates the whole thing: only the Headlines tab renders this data,
// so the shell turns it on when that tab is opened (or about to be — hover,
// focus, touch on its link). A reader who never opens Headlines never spends
// the feed requests, and the first paint does not compete with them.
// rss2json sometimes accepts a request and never answers. Without a deadline
// one stalled feed kept Promise.all pending: the tab stayed on its loading
// skeleton and, because the fetch counted as "in flight", no later poll ran.
const FEED_TIMEOUT_MS = 12000;
const fetchWithTimeout = (url, parentSignal) => {
  const ctl = new AbortController();
  const abort = () => ctl.abort();
  const timer = setTimeout(abort, FEED_TIMEOUT_MS);
  if (parentSignal.aborted) abort();
  else parentSignal.addEventListener("abort", abort, { once: true });
  return fetch(url, { signal: ctl.signal }).finally(() => {
    clearTimeout(timer);
    parentSignal.removeEventListener("abort", abort);
  });
};

export const useBitcoinNews = (enabled = true) => {
  const [state, setState] = useState({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;
    const ac = new AbortController();
    let cancelled = false;
    let inFlight = false;

    const fetchNews = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const results = await Promise.all(
          NEWS_FEEDS.map((feed) =>
            fetchWithTimeout(RSS2JSON_URL + encodeURIComponent(feed.url), ac.signal)
              .then((r) => (r.ok ? r.json() : null))
              .then((j) => {
                if (!j || j.status !== "ok") return [];
                return (j.items || []).map((it) => ({ ...it, _source: feed.source, _btcOnly: feed.btcOnly }));
              })
              .catch(() => [])
          )
        );

        const merged = results.flat();
        if (merged.length === 0) throw new Error("All news feeds failed");

        const filtered = merged.filter((it) => it._btcOnly || isBitcoinRelevant(it.title, it.categories));
        const items = filtered
          .map((it) => {
            const title = stripHtml(it.title);
            return {
              date: it.pubDate ? new Date(it.pubDate.replace(" ", "T") + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
              ts: it.pubDate ? new Date(it.pubDate.replace(" ", "T") + "Z").getTime() : 0,
              title,
              source: it._source,
              tag: pickTagFromArray(it.categories),
              url: it.link,
              important: isImportantHeadline(title),
            };
          })
          .sort((a, b) => b.ts - a.ts)
          .slice(0, 25);

        if (cancelled) return;
        setState({ items, loading: false, error: null });
        return true;
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setState((prev) => ({
          items: prev.items.length ? prev.items : FALLBACK_NEWS,
          loading: false,
          error: e.message || "Network error",
        }));
        return false;
      } finally {
        inFlight = false;
      }
    };

    const poller = createPoller({ run: fetchNews, intervalMs: NEWS_POLL_MS, backoffCapMs: POLL_BACKOFF_CAP_MS });
    poller.start();

    return () => {
      cancelled = true;
      ac.abort();
      poller.stop();
    };
  }, [enabled]);

  return state;
};
