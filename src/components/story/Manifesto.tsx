"use client";

import { useRef } from "react";
import { manifesto } from "@/data/content";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/animation/gsap";

/** Manifeste : les mots s'éclairent au rythme du défilement, comme une encre qui sèche. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      const text = el?.querySelector<HTMLElement>("[data-manifesto]");
      if (!el || !text) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(text, {
          type: "words",
          aria: "none",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.2 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.08,
                scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 45%", scrub: 0.5 },
              },
            );
          },
        });
        gsap.from(el.querySelector("[data-manifesto-line]"), {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: true },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-surface="dark" aria-label={manifesto.label} className="relative bg-ink py-[clamp(6rem,16vw,14rem)]">
      <div className="container-x mx-auto grid max-w-[120rem] gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="flex items-start gap-5 lg:col-span-3">
          <span data-manifesto-line aria-hidden className="mt-1 hidden h-40 w-px bg-gradient-to-b from-gold to-transparent lg:block" />
          <p className="label text-[0.62rem] text-gold">{manifesto.label}</p>
        </div>
        <div className="lg:col-span-9">
          <p
            data-manifesto
            className="font-display text-[clamp(2rem,6.4vw,3rem)] font-light leading-[1.12] tracking-[-0.015em] text-ivory sm:text-[clamp(2.4rem,5vw,4rem)] lg:text-[clamp(2.8rem,4.2vw,5.6rem)]"
          >
            {manifesto.text}
          </p>
          <p className="mt-10 max-w-md text-[0.95rem] leading-relaxed text-ivory/60 lg:ml-[40%] lg:mt-16">{manifesto.aside}</p>
        </div>
      </div>
    </section>
  );
}
