"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { isDirectLoad, isLite, onStage } from "@/lib/stage";
import { cn } from "@/lib/utils/cn";

type Variant = "shoji" | "rise" | "fall" | "left" | "right" | "iris";

const HIDDEN: Record<Variant, string> = {
  shoji: "inset(0% 50% 0% 50%)",
  rise: "inset(100% 0% 0% 0%)",
  fall: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  iris: "inset(46% 46% 46% 46%)",
};

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Forme du dévoilement : chaque composition choisit la sienne. */
  variant?: Variant;
  /** Amplitude de la parallaxe interne, en % de la hauteur (0 : aucune). */
  parallax?: number;
  /** Zoom de départ de la photographie. */
  zoom?: number;
  delay?: number;
  start?: string;
};

/** Photographie dévoilée par masque, avec zoom contrôlé et parallaxe interne légère. */
export function RevealImage({ children, className, style, variant = "shoji", parallax = 0, zoom = 1.16, delay = 0, start = "top 86%" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.querySelector<HTMLElement>("[data-reveal-inner]");
      const zoomer = el?.querySelector<HTMLElement>("[data-reveal-zoom]");
      if (!el || !inner || !zoomer) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        let stop = () => {};
        const inView = el.getBoundingClientRect().top < window.innerHeight * 0.92;
        // Arrivée directe : ce qui est déjà à l'écran reste en place, sans clignoter.
        if (!(inView && isDirectLoad())) {
          gsap.set(el, { clipPath: HIDDEN[variant] });
          gsap.set(zoomer, { scale: zoom });
          stop = onStage(() => {
            gsap.to(el, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              ease: "expo.inOut",
              delay,
              clearProps: "clipPath",
              scrollTrigger: { trigger: el, start, once: true },
            });
            gsap.to(zoomer, {
              scale: 1,
              duration: 2.1,
              ease: "expo.out",
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            });
          });
        }
        if (parallax > 0 && !isLite()) {
          const travel = (parallax / (100 + 2 * parallax)) * 100;
          gsap.fromTo(
            inner,
            { yPercent: -travel },
            { yPercent: travel, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
        return () => stop();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(!className?.includes("absolute") && "relative", "overflow-hidden", className)} style={style}>
      <div data-reveal-inner className="absolute inset-x-0 will-change-transform" style={{ top: `${-parallax}%`, bottom: `${-parallax}%` }}>
        <div data-reveal-zoom className="absolute inset-0">
          {children}
        </div>
      </div>
    </div>
  );
}
