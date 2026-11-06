"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from "react";

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;

function split(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((tok, i) => {
      if (tok === "" || /^\s+$/.test(tok)) return tok;
      return (
        <span key={i}>
          {Array.from(tok).map((ch, j) => (
            <span key={j} data-l="">
              {ch}
            </span>
          ))}
        </span>
      );
    });
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, undefined, ...Children.toArray(el.props.children).map(split));
  }
  return node;
}

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (isValidElement(node)) return Children.toArray((node as ReactElement<{ children?: ReactNode }>).props.children).map(textOf).join("");
  return "";
}

/**
 * Letters swell from thin to heavy as the cursor gets close, then ease back.
 * Wrap a heading's contents in <Morph>.
 */
export default function Morph({ children }: { children: ReactNode }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-l]")).filter((l) => !HANGUL.test(l.textContent ?? ""));
    let rest: number[] | null = null;
    const cur: number[] = [];
    const ptr = { x: -1e4, y: -1e4 };
    let active = false;
    let raf = 0;

    const tick = () => {
      raf = 0;
      const fs = parseFloat(getComputedStyle(el).fontSize) || 48;
      const sigma = fs * 1.1;
      let moving = false;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const dx = ptr.x - (r.left + r.width / 2);
        const dy = ptr.y - (r.top + r.height / 2);
        const f = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
        const target = active ? 400 + 500 * f : rest![i];
        cur[i] += (target - cur[i]) * 0.18;
        if (Math.abs(target - cur[i]) > 0.6) moving = true;
        l.style.fontWeight = String(Math.round(cur[i]));
      });
      if (moving || active) raf = requestAnimationFrame(tick);
      else letters.forEach((l) => (l.style.fontWeight = ""));
    };

    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      const b = el.getBoundingClientRect();
      const pad = 60;
      const inside = ptr.x > b.left - pad && ptr.x < b.right + pad && ptr.y > b.top - pad && ptr.y < b.bottom + pad;
      if (inside && !rest) {
        rest = letters.map((l) => parseFloat(getComputedStyle(l).fontWeight) || 600);
        rest.forEach((w, i) => (cur[i] = w));
      }
      active = inside;
      if (rest && !raf && (inside || cur.some((w, i) => Math.abs(w - rest![i]) > 0.6))) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span ref={root} aria-label={textOf(children)}>
      {Children.toArray(children).map(split)}
    </span>
  );
}
