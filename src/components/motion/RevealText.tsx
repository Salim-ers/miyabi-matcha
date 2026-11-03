"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, isLightDevice, MQ, SplitText, useGSAP } from "@/lib/animation/gsap";
import { isDirectLoad, onStage } from "@/lib/stage";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "lines" : lignes masquées · "chars" : lettre par lettre. */
  mode?: "lines" | "chars";
  delay?: number;
  start?: string;
};

/** Apparition typographique : les lignes montent derrière leur masque. */
export function RevealText({ as: Tag = "div", children, className, id, mode = "lines", delay = 0, start = "top 90%" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92 && isDirectLoad()) return;
        if (isLightDevice()) {
          // Écran tactile : le texte n'est pas découpé en lignes, ce qui évite un recalcul de mise en page.
          gsap.set(el, { opacity: 0, y: 18 });
          return onStage(() => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay, clearProps: "opacity,transform", scrollTrigger: { trigger: el, start, once: true } });
          });
        }
        let split: SplitText | null = null;
        let cancelled = false;
        const isHeading = /^H[1-6]$/.test(el.tagName);
        gsap.set(el, { autoAlpha: 0 });
        const stop = onStage(() => {
          void (document.fonts?.ready ?? Promise.resolve()).then(() => {
            if (cancelled) return;
            gsap.set(el, { autoAlpha: 1 });
            split = SplitText.create(el, {
              type: mode === "chars" ? "lines,chars" : "lines",
              aria: isHeading && mode === "chars" ? "auto" : "none",
              mask: "lines",
            });
            gsap.from(mode === "chars" ? split.chars : split.lines, {
              yPercent: 112,
              duration: mode === "chars" ? 1.15 : 1.25,
              ease: "expo.out",
              stagger: mode === "chars" ? 0.022 : 0.085,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
              onComplete: () => {
                split?.revert();
                split = null;
              },
            });
          });
        });
        return () => {
          cancelled = true;
          stop();
          split?.revert();
        };
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
