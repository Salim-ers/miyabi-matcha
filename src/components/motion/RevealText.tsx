"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/animation/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "lines" : découpage en lignes masquées · "chars" : entrée lettre par lettre. */
  mode?: "lines" | "chars";
  delay?: number;
  start?: string;
};

/** Révélation typographique au défilement (lignes masquées ou lettres). */
export function RevealText({ as: Tag = "div", children, className, id, mode = "lines", delay = 0, start = "top 86%" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const isHeading = /^H[1-6]$/.test(el.tagName);
        const split = SplitText.create(el, {
          type: mode === "chars" ? "lines,chars" : "lines",
          // aria-label n'est autorisé que sur les titres ; ailleurs le texte reste lisible tel quel.
          aria: isHeading && mode === "chars" ? "auto" : "none",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            const targets = mode === "chars" ? self.chars : self.lines;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: mode === "chars" ? 4 : 0,
              duration: mode === "chars" ? 1.2 : 1.3,
              ease: "expo.out",
              stagger: mode === "chars" ? 0.022 : 0.09,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
