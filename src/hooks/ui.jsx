import { useState, useEffect, useRef } from "react";

// Animates from previous value to target over `duration`. Uses setInterval (not rAF) so
// it ticks reliably even when the tab is throttled (puppeteer/background tab).
export const useAnimatedValue = (target, duration = 1500) => {
  const [value, setValue] = useState(target ?? 0);
  const fromRef = useRef(target ?? 0);
  useEffect(() => {
    if (target == null || !Number.isFinite(target)) return;
    const from = fromRef.current;
    if (Math.abs(target - from) < 1) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const v = from + (target - from) * eased;
      fromRef.current = v;
      setValue(v);
      if (progress >= 1) clearInterval(timer);
    };
    const timer = setInterval(tick, 33);
    tick();
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

// Re-renders every second with the elapsed seconds since a given Unix-seconds timestamp.
// Used by Time-Since-Last-Block so the display ticks live without re-fetching the API.
export const useElapsed = (unixSeconds) => {
  const [elapsed, setElapsed] = useState(() => unixSeconds ? Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds) : null);
  useEffect(() => {
    if (!Number.isFinite(unixSeconds)) {
      setElapsed(null);
      return;
    }
    const tick = () => setElapsed(Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [unixSeconds]);
  return elapsed;
};

// ─── PRESENTATION COMPONENTS ────────────────────────────────────

export const useOnlineStatus = () => {
  const [online, setOnline] = useState(() => typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
};

export const usePullToRefresh = (onRefresh, enabled = true) => {
  const startY = useRef(null);
  const pulling = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const threshold = 80;

    const onTouchStart = (e) => {
      if (window.scrollY > 5) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };
    const onTouchMove = (e) => {
      if (!pulling.current || startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy < 0) { pulling.current = false; setPullDistance(0); return; }
      const deltaX = Math.abs(e.touches[0].clientX - (e.touches[0].clientX));
      if (window.scrollY > 5) { pulling.current = false; setPullDistance(0); return; }
      setPullDistance(Math.min(dy * 0.5, 120));
    };
    const onTouchEnd = () => {
      if (pulling.current && pullDistance >= threshold && !refreshing) {
        setRefreshing(true);
        onRefresh();
        setTimeout(() => setRefreshing(false), 1200);
      }
      pulling.current = false;
      startY.current = null;
      setPullDistance(0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, onRefresh, pullDistance, refreshing]);

  return { pullDistance, refreshing };
};

export const useSwipeNavigation = (activeTab, setActiveTab, tabCount, enabled = true) => {
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const isScrollable = (el) => {
      while (el && el !== document.body) {
        const s = window.getComputedStyle(el);
        if ((s.overflowX === "auto" || s.overflowX === "scroll") && el.scrollWidth > el.clientWidth) return true;
        el = el.parentElement;
      }
      return false;
    };

    const onStart = (e) => {
      if (isScrollable(e.target)) { startRef.current = null; return; }
      startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e) => {
      if (!startRef.current) return;
      const dx = e.changedTouches[0].clientX - startRef.current.x;
      const dy = e.changedTouches[0].clientY - startRef.current.y;
      startRef.current = null;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < 60) return;
      if (dx < 0 && activeTab < tabCount - 1) {
        setActiveTab(activeTab + 1);
        if (navigator.vibrate) navigator.vibrate(10);
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (dx > 0 && activeTab > 0) {
        setActiveTab(activeTab - 1);
        if (navigator.vibrate) navigator.vibrate(10);
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [enabled, activeTab, setActiveTab, tabCount]);
};

export const Pulse = ({ color = "#f7931a" }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
    <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", backgroundColor: color, opacity: 0.75, animation: "scaleIn 1.5s ease-in-out infinite" }} />
    <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", backgroundColor: color }} />
  </span>
);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useIsMobile = (breakpoint = 540) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
};

export const shouldAnimate = () =>
  !prefersReducedMotion() &&
  typeof window !== "undefined" &&
  (!window.matchMedia || !window.matchMedia("(max-width: 760px)").matches);

export const Reveal = ({ children, delay = 0, scale = false, className = "", as: Tag = "div", style }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());
  useEffect(() => {
    if (prefersReducedMotion()) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${scale ? "reveal-scale" : "reveal"} ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: delay + "s", ...style }}>
      {children}
    </Tag>
  );
};

// Latest-passed-section tracker. Active = highest-index ref whose top has
// crossed above `triggerRatio * viewportHeight`. Uses IntersectionObserver
// (cheaper and more reliable than scroll-event polling) with a top rootMargin
// that defines the trigger line. Better than useScrollSpy for long-form pages
// where sections vary in height: the chip says "you're reading section N"
// until section N+1 actually starts.
export const useActiveSection = (refs, { triggerRatio = 0.3 } = {}) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const recompute = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const threshold = vh * triggerRatio;
      let best = 0;
      for (let i = 0; i < refs.length; i++) {
        const el = refs[i] && refs[i].current;
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) best = i;
        else break;
      }
      setActive(best);
    };
    // rAF-throttled like useScrollSpy below: the getBoundingClientRect loop
    // runs at most once per frame instead of on every raw scroll event.
    let rafId = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        ticking = false;
        recompute();
      });
    };
    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [refs, triggerRatio]);
  return active;
};

export const useScrollSpy = (refs, { centerRatio = 0.4 } = {}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const elements = refs.map((r) => r && r.current).filter(Boolean);
    if (elements.length === 0) return;
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const target = vh * centerRatio;
      let best = 0;
      let bestDist = Infinity;
      elements.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const elCenter = (r.top + r.bottom) / 2;
        const dist = Math.abs(elCenter - target);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActiveIndex(best);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [refs, centerRatio]);
  return activeIndex;
};

// `pinned` mode treats progress as the distance the wrap has been scrolled
// past its sticky pin-point: progress=0 while the wrap is entering view (so
// scrollytelling chapters stay locked on chapter 0 until the full stage is
// in view) and progress=1 when the wrap is about to release the pin.
// `pinTop` is the sticky offset in px (e.g. the page-header height).
export const useScrollProgress = (ref, { pinned = false, pinTop = 0 } = {}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      let p;
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (pinned) {
          const total = rect.height - vh + pinTop;
          p = total > 0 ? Math.max(0, Math.min(1, (pinTop - rect.top) / total)) : 0;
        } else {
          const total = rect.height + vh;
          const seen = vh - rect.top;
          p = total > 0 ? Math.max(0, Math.min(1, seen / total)) : 0;
        }
      } else {
        const doc = document.documentElement;
        const max = (doc.scrollHeight - doc.clientHeight) || 1;
        p = Math.max(0, Math.min(1, (window.scrollY || doc.scrollTop) / max));
      }
      setProgress(p);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [ref, pinned, pinTop]);
  return progress;
};

export const useScrolled = (threshold = 24) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const evaluate = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled((prev) => {
        if (prev && y < threshold - 8) return false;
        if (!prev && y > threshold) return true;
        return prev;
      });
    };
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, [threshold]);
  return scrolled;
};

export const PageScrollProgressBar = () => {
  const ref = useRef(null);
  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const p = Math.max(0, Math.min(1, (window.scrollY || doc.scrollTop) / max));
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);
  return <span ref={ref} className="thesis-progress-fill" aria-hidden="true" />;
};

export const useCountUp = (target, { trigger = true, duration = 1400, from = 0 } = {}) => {
  const [value, setValue] = useState(prefersReducedMotion() ? target : from);
  useEffect(() => {
    if (!trigger) return;
    if (prefersReducedMotion()) { setValue(target); return; }
    let rafId = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => { if (rafId) window.cancelAnimationFrame(rafId); };
  }, [target, trigger, duration]);
  return value;
};

export const parseNumericMetric = (raw) => {
  const match = String(raw).match(/^(~)?([\d.]+)([A-Za-z+/].*)?$/);
  if (!match) return null;
  const num = parseFloat(match[2]);
  if (!isFinite(num)) return null;
  return { prefix: match[1] || "", target: num, suffix: match[3] || "", decimals: (match[2].split(".")[1] || "").length };
};

// localStorage-backed state. Silent in SSR / private mode.
export const usePersistedState = (key, fallback) => {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
};
