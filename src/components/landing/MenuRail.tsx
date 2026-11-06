"use client";

import Morph from "./Morph";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStickyProgress } from "./hooks";

const items = [
  { name: "Chicken Meals", ko: "치킨", img: "chicken-meals.svg", bg: "bg-kae-gold" },
  { name: "Waffles", ko: "와플", img: "waffles.svg", bg: "bg-kae-pink" },
  { name: "Bibimbap", ko: "비빔밥", img: "bibimbap.svg", bg: "bg-kae-scallion" },
  { name: "Korean Street Foods", ko: "길거리 음식", img: "korean-streetfoods.svg", bg: "bg-kae-gochujang" },
  { name: "Tofu", ko: "두부", img: "tofu.svg", bg: "bg-kae-pink" },
  { name: "Rice Meals", ko: "밥", img: "rice-meals.svg", bg: "bg-kae-gold" },
  { name: "Corndogs", ko: "핫도그", img: "corndogs.svg", bg: "bg-kae-gochujang" },
  { name: "Spicy Noodles and Ramen", ko: "라면", img: "spicy-noodles-and-ramen.svg", bg: "bg-kae-pink" },
  { name: "Burgers and Sandwiches", ko: "버거", img: "burgers-and-sandwiches.svg", bg: "bg-kae-gold" },
  { name: "Fries and Nachos", ko: "감자튀김", img: "fries-and-nachos.svg", bg: "bg-kae-scallion" },
  { name: "Various Beverages", ko: "음료", img: "various-beverages.svg", bg: "bg-kae-pink" },
];

/** Vertical scroll drives a horizontal rail of menu categories. */
export default function MenuRail() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [dims, setDims] = useState({ h: 0 });
  const travel = useRef(0);

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    travel.current = Math.max(0, t.scrollWidth - window.innerWidth);
    setDims({ h: travel.current + window.innerHeight });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useStickyProgress(wrap, (p) => {
    if (track.current) track.current.style.transform = `translate3d(${-p * travel.current}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });

  return (
    <section id="menu" ref={wrap} className="relative bg-paper text-ink" style={{ height: dims.h || "300vh" }}>
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <div ref={track} className="flex w-max items-center gap-6 px-4 will-change-transform md:gap-8 md:px-10 2xl:px-30">
          <div className="w-[82vw] shrink-0 md:w-[34rem]">
            <p className="mb-4 font-label text-xs tracking-[0.2em] uppercase">Menu · {items.length} categories</p>
            <h2 className="ed-display text-5xl leading-[1.02] md:text-7xl"><Morph>
              Pick your <span className="ed-italic text-accent">craving,</span> <span className="ed-caps">then</span> keep{" "}
              <span className="ed-hangul text-kae-gochujang dark:text-kae-gold">스크롤</span>.
            </Morph></h2>
            <p className="mt-6 max-w-sm text-ink-soft">Snacks, sweets and street food, plus rice meals and chicken. Everything is cooked when you order.</p>
          </div>

          {items.map((it) => (
            <Link
              href="/order"
              key={it.name}
              className="group flex h-[min(62vh,30rem)] w-[72vw] shrink-0 flex-col justify-between rounded-3xl border-2 border-rule bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--accent)] sm:w-[22rem]"
            >
              <div className="flex items-start justify-between">
                <span className="ed-hangul text-2xl">{it.ko}</span>
                <span className="font-label text-xs tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">Order →</span>
              </div>
              <div className={`mx-auto flex aspect-square w-[78%] items-center justify-center rounded-full ${it.bg}`}>
                <img className="h-[85%] w-[85%] object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" src={`/${it.img}`} alt={it.name} />
              </div>
              <h3 className="ed-display text-2xl leading-tight">{it.name}</h3>
            </Link>
          ))}

          <div className="w-[70vw] shrink-0 pr-6 md:w-[26rem]">
            <p className="ed-display text-4xl leading-tight md:text-5xl">
              Hungry <span className="ed-italic text-accent">already?</span>
            </p>
            <Link
              href="/order"
              className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 font-body text-sm font-bold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--accent)] active:translate-y-0 active:shadow-none"
            >
              Order online
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-8 h-1 rounded-full bg-ink/15 md:inset-x-10 2xl:inset-x-30">
          <span ref={bar} className="block h-full origin-left scale-x-0 rounded-full bg-ink" />
        </div>
      </div>
    </section>
  );
}
