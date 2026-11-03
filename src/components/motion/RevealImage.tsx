"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** Amplitude de parallaxe interne en % (0 pour désactiver). */
  parallax?: number;
  from?: "bottom" | "top" | "left" | "right";
};

const CLIP: Record<NonNullable<Props["from"]>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Photo révélée par masque, avec zoom subtil et parallaxe interne au défilement. */
export function RevealImage({ children, className, parallax = 8, from = "bottom" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.querySelector<HTMLElement>("[data-reveal-inner]");
      if (!el || !inner) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          el,
          { clipPath: CLIP[from] },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
        gsap.fromTo(
          inner,
          { scale: 1.22 },
          { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } },
        );
        if (parallax > 0) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div data-reveal-inner className="absolute inset-[-10%_0] will-change-transform">
        {children}
      </div>
    </div>
  );
}
