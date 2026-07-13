import { useState, useEffect } from "react";
import { NEWS_FEEDS, FALLBACK_NEWS } from "../data/market-news.js";
import { RSS2JSON_URL } from "../lib/constants.js";
import { stripHtml, pickTagFromArray, isBitcoinRelevant, isImportantHeadline } from "../lib/format.js";

// Live Bitcoin news — multiple RSS feeds via rss2json proxy. Refreshed every 5 minutes.
export const useBitcoinNews = () => {
  const [state, setState] = useState({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ac = new AbortController();
    let timer;
    let cancelled = false;

    const fetchNews = async () => {
      try {
        const results = await Promise.all(
          NEWS_FEEDS.map((feed) =>
            fetch(RSS2JSON_URL + encodeURIComponent(feed.url), { signal: ac.signal })
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
      } catch (e) {
        if (e.name === "AbortError" || cancelled) return;
        setState((prev) => ({
          items: prev.items.length ? prev.items : FALLBACK_NEWS,
          loading: false,
          error: e.message || "Network error",
        }));
      }
    };

    fetchNews();
    timer = setInterval(fetchNews, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      ac.abort();
      clearInterval(timer);
    };
  }, []);

  return state;
};
