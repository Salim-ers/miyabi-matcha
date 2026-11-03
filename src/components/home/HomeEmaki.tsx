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
  { photo: photos.leaves, w: "clamp(15rem,27vw,44rem)", ratio: "4/5", top: "0", variant: "rise" },
  { photo: photos.whisk, w: "clamp(13rem,20vw,32rem)", ratio: "3/4", top: "clamp(2rem,11svh,9rem)", variant: "fall" },
  { photo: photos.pour, w: "clamp(14rem,24vw,38rem)", ratio: "2/3", top: "clamp(0rem,3svh,3rem)", variant: "shoji" },
  { photo: photos.crepeLift, w: "clamp(12rem,17vw,27rem)", ratio: "9/14", top: "clamp(3rem,15svh,12rem)", variant: "rise" },
  { photo: photos.takeaway, w: "clamp(14rem,23vw,36rem)", ratio: "4/5", top: "0", variant: "fall" },
  { photo: photos.water, w: "clamp(13rem,19vw,30rem)", ratio: "3/4", top: "clamp(2rem,9svh,8rem)", variant: "shoji" },
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
              <Photo src={item.photo.src} alt={item.photo.alt} focus={item.photo.focus} fill sizes="(min-width: 64rem) 28vw, 70vw" />
            </RevealImage>
          </div>
        ))}
      </div>
    </section>
  );
}
