"use client";

import { useEffect, useRef } from "react";

const items = [
  ["Chicken meals", "치킨"],
  ["Waffles", "와플"],
  ["Bibimbap", "비빔밥"],
  ["Corndogs", "핫도그"],
  ["Spicy noodles", "라면"],
  ["Fries and nachos", "감자튀김"],
  ["Milk tea", "음료"],
];

/** Ticker whose speed and direction follow how fast you scroll. */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let vel = reduce ? 0 : 0.6;
    let dir = 1;
    let lastY = window.scrollY;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      const target = (reduce ? 0 : 0.6) + Math.min(Math.abs(dy), 60) * 0.35;
      vel += (target - vel) * 0.1;
      x -= vel * dir;
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-rule bg-band py-5 text-on-band" aria-hidden>
      <div ref={track} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
        {row.concat(row).map(([en, ko], i) => (
          <span key={i} className="ed-display flex items-center gap-10 text-4xl md:text-6xl">
            <span>
              {en} <span className="ed-hangul text-kae-gold dark:text-kae-purple">{ko}</span>
            </span>
            <span className="ed-italic text-band-accent">✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}
