"use client";

import { useEffect, useRef } from "react";

/** A purple outline circle that trails the pointer and swells over links and buttons. */
export default function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let scale = 1;
    let target = 1;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        el.style.opacity = "1";
      }
      const t = e.target as HTMLElement | null;
      target = t?.closest?.("a, button, [role=button], [role=tab], input, textarea, label") ? 1.9 : 1;
    };
    const onDown = () => (target *= 0.7);
    const onUp = () => (target = 1);
    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (x - rx) * 0.1;
      ry += (y - ry) * 0.1;
      scale += (target - scale) * 0.2;
      el.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0) scale(${scale})`;
    };
    loop();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      style={{ opacity: 0 }}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-10 w-10 rounded-full border-2 border-accent transition-opacity duration-300 will-change-transform"
    />
  );
}
