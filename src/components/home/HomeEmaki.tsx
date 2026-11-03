"use client";

import { useRef } from "react";
import { RevealImage } from "@/components/motion/RevealImage";
import { TLink } from "@/components/shell/TLink";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { home } from "@/data/content";
import { photos, type ArtPhoto } from "@/data/photos";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { isLite } from "@/lib/stage";

type Item = { photo: ArtPhoto; w: string; ratio: string; top: string; variant: "shoji" | "rise" | "fall" };

/** Formats, décalages et dévoilements volontairement inégaux : un rouleau, pas une grille. */
const ITEMS: Item[] = [
  { photo: photos.field, w: "clamp(14rem,24vw,38rem)", ratio: "9/14", top: "0", variant: "rise" },
  { photo: photos.whisked, w: "clamp(18rem,39vw,62rem)", ratio: "5/6", top: "clamp(1.5rem,7svh,6rem)", variant: "fall" },
  { photo: photos.crepeBatter, w: "clamp(14rem,27vw,42rem)", ratio: "3/4", top: "0", variant: "shoji" },
];

/**
 * L'univers Miyabi, en emaki : un rouleau de photographies que le défilement déroule à l'horizontale.
 * Sur mobile et sans animation : glissement tactile natif.
 */
export function HomeEmaki() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.stage, () => {
        if (isLite()) return;
        track.classList.add("is-driven");
        const tween = gsap.fromTo(
          track,
          { x: () => window.innerWidth * 0.06 },
          {
            x: () => -(track.scrollWidth - window.innerWidth) - window.innerWidth * 0.02,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "transform" });
          track.classList.remove("is-driven");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-surface="light" className="relative overflow-hidden bg-paper pb-16 pt-16 lg:pb-[clamp(6rem,14svh,11rem)] lg:pt-[clamp(6rem,14svh,11rem)]">
      <div className="container-x mb-8 flex items-center justify-between gap-6 lg:mb-12">
        <h2 className="label text-smoke">{home.universeLabel}</h2>
        <TLink href={home.universeLink.href} className="group inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-medium">
          <span className="hairline">{home.universeLink.label}</span>
          <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1" />
        </TLink>
      </div>
      <div data-track className="emaki-track">
        {ITEMS.map((item) => (
          <div key={item.photo.src} style={{ width: item.w, marginTop: item.top }}>
            <RevealImage variant={item.variant} style={{ aspectRatio: item.ratio }} start="top 96%">
              <Photo src={item.photo.src} alt={item.photo.alt} focus={item.photo.focus} fill sizes="(min-width: 64rem) 40vw, 76vw" />
            </RevealImage>
          </div>
        ))}
      </div>
    </section>
  );
}
