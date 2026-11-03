"use client";

import { useEffect, useState } from "react";

/**
 * Suit la section visible :
 * - `active` : section au centre de l'écran (navigation)
 * - surface (dark / light / green) appliquée sur <html data-surface> pour adapter l'interface.
 */
export function useSectionObserver(pathname: string) {
  const [active, setActive] = useState<string>("accueil");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    const html = document.documentElement;
    if (!sections.length) {
      html.dataset.surface = "dark";
      return;
    }

    const surfaceObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) html.dataset.surface = (e.target as HTMLElement).dataset.surface ?? "dark";
        }
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    const activeObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.nav;
          if (e.isIntersecting && id) setActive(id);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((s) => {
      surfaceObs.observe(s);
      if (s.dataset.nav) activeObs.observe(s);
    });
    return () => {
      surfaceObs.disconnect();
      activeObs.disconnect();
    };
  }, [pathname]);

  return active;
}
