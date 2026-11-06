"use client";

import Morph from "./Morph";

import { useRef } from "react";
import { useRafScroll } from "./hooks";
import Reveal from "./Reveal";

const shots = [
  { src: "gallery-1.jpg", alt: "Kae and Jae chicken sandwich", span: "md:col-span-2 md:row-span-2", speed: 0.08 },
  { src: "gallery-2.jpg", alt: "Spicy noodles with egg and spam", span: "md:col-span-2", speed: 0.14 },
  { src: "gallery-3.jpg", alt: "Fish cake", span: "", speed: 0.05 },
  { src: "gallery-4.jpg", alt: "Chicken poppers with rice", span: "", speed: 0.12 },
  { src: "gallery-5.jpg", alt: "Various beverages", span: "", speed: 0.06 },
  { src: "gallery-6.jpg", alt: "Waffles with chocolate and almonds", span: "md:col-span-2", speed: 0.1 },
  { src: "gallery-7.jpg", alt: "Corndogs", span: "", speed: 0.07 },
];

/** Photos drift inside their frames at different speeds as you scroll. */
export default function Gallery() {
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useRafScroll((_, vh) => {
    imgs.current.forEach((img, i) => {
      if (!img) return;
      const r = img.parentElement!.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) * shots[i].speed;
      img.style.transform = `translate3d(0, ${-offset}px, 0) scale(1.18)`;
    });
  });

  return (
    <section id="gallery" className="bg-paper px-4 py-24 text-ink md:px-10 md:py-32 2xl:px-30">
      <div className="mx-auto max-w-[1920px]">
        <Reveal>
          <p className="mb-4 font-label text-xs tracking-[0.2em] uppercase">Gallery</p>
          <h2 className="ed-display max-w-4xl text-5xl leading-[1.02] md:text-7xl"><Morph>
            Straight from the <span className="ed-italic text-accent">cart,</span> <span className="ed-caps">still</span> steaming{" "}
            <span className="ed-hangul text-kae-gochujang dark:text-kae-gold">따끈</span>.
          </Morph></h2>
        </Reveal>
        <div className="mt-14 grid auto-rows-[15rem] grid-cols-1 gap-4 md:auto-rows-[14rem] md:grid-cols-4 xl:auto-rows-[17rem]">
          {shots.map((s, i) => (
            <Reveal key={s.src} delay={(i % 3) * 80} className={`group relative overflow-hidden rounded-3xl border-2 border-rule ${s.span}`}>
              <img
                ref={(el) => {
                  imgs.current[i] = el;
                }}
                className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 will-change-transform group-hover:brightness-110"
                src={`/${s.src}`}
                alt={s.alt}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
