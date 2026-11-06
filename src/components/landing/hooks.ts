"use client";

import { useEffect, useRef, type RefObject } from "react";

export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

/** Calls `cb` once per animation frame while the page scrolls or resizes. */
export function useRafScroll(cb: (scrollY: number, vh: number) => void) {
  const saved = useRef(cb);
  useEffect(() => {
    saved.current = cb;
  });
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      saved.current(window.scrollY, window.innerHeight);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/** Progress 0..1 through a tall section that contains a sticky child. */
export function useStickyProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useRafScroll((_, vh) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height - vh;
    onProgress(total > 0 ? clamp(-r.top / total) : 0);
  });
}
