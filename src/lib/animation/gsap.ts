"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Requêtes média partagées par toutes les animations. */
export const MQ = {
  desktop: "(min-width: 64rem)",
  mobile: "(max-width: 63.999rem)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
  /** Mobile, tablette, petite fenêtre : uniquement des animations gérées par le processeur graphique. */
  light: "(hover: none), (pointer: coarse), (max-width: 63.999rem)",
  /** Scènes épinglées : grand écran, pointeur précis, mouvement autorisé. */
  stage: "(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;
}

export function isLightDevice() {
  return typeof window !== "undefined" && window.matchMedia(MQ.light).matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
