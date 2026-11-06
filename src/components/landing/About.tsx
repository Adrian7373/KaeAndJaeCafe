"use client";

import { useRef } from "react";
import { clamp, useStickyProgress } from "./hooks";

/* Each word is [text, style]. Style picks a family from the design system. */
const words: [string, string?][] = [
  ["What", ""], ["started", ""], ["as", ""], ["a", ""], ["love", "i"], ["for", ""], ["good", ""], ["food", ""],
  ["turned", ""], ["into", ""], ["Camp", ""], ["Tinio's", ""], ["favorite", "i"], ["mobile", ""], ["hangout.", ""],
  ["The", ""], ["best", ""], ["memories", "i"], ["are", ""], ["not", ""], ["made", ""], ["inside", ""], ["four", ""], ["walls,", ""],
  ["they", ""], ["happen", ""], ["wherever", ""], ["the", ""], ["food", ""], ["is", ""], ["hot", "c"], ["and", ""],
  ["the", ""], ["drinks", ""], ["are", ""], ["sweet.", "i"],
];

export default function About() {
  const wrap = useRef<HTMLElement>(null);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const photo = useRef<HTMLDivElement>(null);

  useStickyProgress(wrap, (p) => {
    const n = words.length;
    const lit = clamp((p - 0.05) / 0.75) * n;
    refs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = String(0.18 + clamp(lit - i) * 0.82);
    });
    if (photo.current) {
      photo.current.style.transform = `rotate(${-6 + p * 12}deg) scale(${0.85 + p * 0.2})`;
    }
  });

  return (
    <section id="about" ref={wrap} className="relative h-[240vh] bg-paper-alt text-ink">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1920px] items-center gap-8 px-4 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16 md:px-10 2xl:px-30">
          <div>
            <p className="mb-5 font-label text-xs tracking-[0.2em] uppercase">About · Zone 3, Camp Tinio</p>
            <p className="ed-display text-[1.7rem] leading-[1.2] sm:text-4xl md:text-5xl xl:text-6xl">
              {words.map(([w, s], i) => (
                <span
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  style={{ opacity: 0.18 }}
                  className={`inline-block pr-[0.28em] ${s === "i" ? "ed-italic text-accent" : s === "c" ? "ed-caps text-kae-gochujang dark:text-kae-gold" : ""}`}
                >
                  {w}
                </span>
              ))}
            </p>
          </div>
          <div ref={photo} className="order-first mx-auto w-44 will-change-transform md:order-none md:w-full" style={{ transform: "rotate(-6deg) scale(.85)" }}>
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border-2 border-rule bg-card shadow-[8px_8px_0_0_var(--accent)]">
              <img className="h-full w-full object-cover" src="/about-photo.jpg" alt="Kae and Jae customers" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
