"use client";

import { useRef } from "react";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { universe } from "@/data/content";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { pad2 } from "@/lib/utils/cn";

/** Notre univers — bandeau typographique piloté au défilement + composition éditoriale asymétrique. */
export function Universe() {
  const root = useRef<HTMLElement>(null);
  const { images } = universe;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const band = el.querySelector("[data-band]");
        gsap.fromTo(
          el.querySelector("[data-band-a]"),
          { xPercent: 0 },
          { xPercent: -28, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: 0.4 } },
        );
        gsap.fromTo(
          el.querySelector("[data-band-b]"),
          { xPercent: -30 },
          { xPercent: -2, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: 0.4 } },
        );
        gsap.from(el.querySelectorAll("[data-pillar]"), {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el.querySelector("[data-pillars]"), start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const bandA = `${universe.band[0]} ${universe.band[1]} ${universe.band[0]} `;
  const bandB = `${universe.band[1]} ${universe.band[0]} ${universe.band[1]} `;

  return (
    <section ref={root} id="univers" data-surface="dark" data-nav="univers" aria-labelledby="univers-title" className="relative overflow-hidden bg-ink pb-[clamp(6rem,12vw,12rem)]">
      {/* Bandeau typographique */}
      <div data-band aria-hidden className="py-[clamp(4rem,9vw,9rem)]">
        <p data-band-a className="whitespace-nowrap font-display text-[clamp(3.6rem,13vw,17rem)] font-light italic leading-[1] tracking-[-0.03em] text-ivory">
          {bandA}
        </p>
        <p data-band-b className="text-outline whitespace-nowrap font-display text-[clamp(3.6rem,13vw,17rem)] font-light leading-[1] tracking-[-0.03em] text-gold/70">
          {bandB}
        </p>
      </div>
      <p className="sr-only">{universe.band.join(" ")}</p>

      <div className="container-x mx-auto grid max-w-[120rem] grid-cols-12 gap-x-4 gap-y-14 lg:gap-x-6">
        {/* Titre */}
        <div className="col-span-12 lg:col-span-5 lg:pt-16">
          <p className="label flex items-center gap-4 text-[0.62rem] text-gold">
            <span aria-hidden className="h-px w-10 bg-gold/60" />
            {universe.label}
          </p>
          <RevealText
            as="h2"
            id="univers-title"
            className="mt-6 font-display text-[clamp(2.6rem,9vw,4rem)] font-light leading-[1] tracking-[-0.02em] lg:text-[clamp(3.2rem,4.4vw,6rem)]"
          >
            {universe.title}
          </RevealText>
          <p className="mt-8 max-w-md text-[1rem] leading-relaxed text-ivory/65">{universe.intro}</p>
        </div>

        {/* Photographie monumentale */}
        <RevealImage className="col-span-12 aspect-[3/4] sm:col-span-10 sm:col-start-3 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:aspect-[4/5]" parallax={7}>
          <Photo src={images.main.src} alt={images.main.alt} fill quality={85} sizes="(min-width: 1024px) 46vw, (min-width: 640px) 80vw, 100vw" className="object-cover" />
        </RevealImage>

        {/* Détails */}
        <div className="col-span-12 grid grid-cols-12 gap-4 lg:col-span-6 lg:gap-6">
          <RevealImage className="col-span-7 aspect-[4/5] lg:col-span-7" from="left" parallax={10}>
            <Photo src={images.splash.src} alt={images.splash.alt} fill quality={80} sizes="(min-width: 1024px) 24vw, 58vw" className="object-cover" />
          </RevealImage>
          <RevealImage className="col-span-5 mt-[40%] aspect-square lg:col-span-5" from="right" parallax={12}>
            <Photo src={images.crepe.src} alt={images.crepe.alt} fill quality={80} sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
          </RevealImage>
        </div>

        {/* Piliers */}
        <ul data-pillars className="col-span-12 mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {universe.pillars.map((p, i) => (
            <li key={p.title} data-pillar className="border-t border-ivory/12 py-7">
              <span className="label text-[0.58rem] text-gold/80">{pad2(i + 1)}</span>
              <h3 className="mt-4 font-display text-[1.9rem] font-light leading-none">{p.title}</h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ivory/60">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
