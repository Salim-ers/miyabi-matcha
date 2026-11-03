"use client";

import { useRef } from "react";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { story, type StoryChapter } from "@/data/content";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils/cn";

const chapters: StoryChapter[] = story.chapters;
const N = chapters.length;

/** Formes de masque (départ → arrivée) pour chaque transition de scène. */
const REVEALS: Record<StoryChapter["reveal"], [string, string]> = {
  rise: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  circle: ["circle(0% at 50% 62%)", "circle(95% at 50% 62%)"],
  diagonal: ["polygon(0% 0%, 0% 0%, 0% 0%)", "polygon(0% 0%, 200% 0%, 0% 200%)"],
  iris: ["inset(50% 50% 50% 50% round 50%)", "inset(0% 0% 0% 0% round 0%)"],
  split: ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"],
  wipe: ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"],
};

/**
 * L'art du matcha — La feuille → La poudre → Le geste → La préparation → La création → La dégustation.
 * Desktop : séquence épinglée pilotée par le défilement. Mobile : chapitres verticaux légers.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const pin = el.querySelector<HTMLElement>("[data-story-pin]");
        if (!pin) return;
        const q = gsap.utils.selector(pin);
        const images = q("[data-story-img]");
        const inners = q("[data-story-img] img");
        const details = q("[data-story-detail]");
        const texts = q("[data-story-text]");
        const steps = q("[data-story-step]");

        chapters.forEach((c, i) => {
          if (i > 0) gsap.set(images[i] ?? null, { clipPath: REVEALS[c.reveal][0] });
        });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });
        gsap.set(details, { autoAlpha: 0, yPercent: 18 });
        if (chapters[0]?.detail) gsap.set(details[0] ?? null, { autoAlpha: 1, yPercent: 0 });

        const setStep = (idx: number) => {
          steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
          steps.forEach((s, i) => s.classList.toggle("is-past", i < idx));
        };
        setStep(0);

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${(N - 1) * window.innerHeight * 0.95}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setStep(Math.min(N - 1, Math.round(self.progress * (N - 1 + 0.3) - 0.15))),
          },
        });

        for (let i = 1; i < N; i++) {
          const at = i - 1;
          const c = chapters[i];
          if (!c) continue;
          tl.to(q("[data-story-num-inner]"), { yPercent: (-100 * i) / N, duration: 0.7 }, at + 0.15)
            .to(q("[data-story-title-inner]"), { yPercent: (-100 * i) / N, duration: 0.7 }, at + 0.18)
            .to(texts[i - 1] ?? null, { autoAlpha: 0, y: -40, duration: 0.4 }, at + 0.1)
            .to(texts[i] ?? null, { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.45)
            .to(images[i] ?? null, { clipPath: REVEALS[c.reveal][1], duration: 0.85, ease: "power2.inOut" }, at + 0.1)
            .fromTo(inners[i] ?? null, { scale: 1.3 }, { scale: 1, duration: 1, ease: "power2.out" }, at + 0.1)
            .to(inners[i - 1] ?? null, { scale: 1.12, duration: 0.9, ease: "none" }, at + 0.05)
            .fromTo(
              q("[data-story-bloom]"),
              { opacity: 0, scale: 0.6 },
              { opacity: 0.55, scale: 1.1, duration: 0.45, ease: "power2.out", immediateRender: false },
              at + 0.1,
            )
            .to(q("[data-story-bloom]"), { opacity: 0, scale: 1.4, duration: 0.45, ease: "power2.in" }, at + 0.55)
            .to(q("[data-story-progress]"), { scaleX: i / (N - 1), duration: 0.9, ease: "none" }, at + 0.1);
          if (chapters[i - 1]?.detail) tl.to(details[i - 1] ?? null, { autoAlpha: 0, yPercent: -18, duration: 0.45 }, at + 0.1);
          if (c.detail) tl.to(details[i] ?? null, { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: "expo.out" }, at + 0.5);
        }
        tl.to({}, { duration: 0.3 });

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="art" data-surface="dark" data-nav="art" aria-labelledby="art-title" className="relative bg-ink">
      {/* Introduction */}
      <div className="container-x mx-auto max-w-[120rem] pb-14 pt-10 lg:pb-20">
        <p className="label flex items-center gap-4 text-[0.62rem] text-gold">
          <span aria-hidden className="h-px w-10 bg-gold/60" />
          {story.label}
        </p>
        <RevealText
          as="h2"
          id="art-title"
          className="mt-6 max-w-[14ch] font-display text-[clamp(2.8rem,11vw,4.5rem)] font-light leading-[0.95] tracking-[-0.025em] lg:text-[clamp(4rem,7vw,9rem)]"
        >
          {story.title}
        </RevealText>
        <ol className="label mt-8 flex flex-wrap gap-x-3 gap-y-2 text-[0.58rem] text-ivory/55" aria-label="Les six étapes">
          {chapters.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3">
              {c.title}
              {i < N - 1 && <span aria-hidden className="text-gold/70">→</span>}
            </li>
          ))}
        </ol>
      </div>

      {/* ——— Desktop : séquence épinglée ——— */}
      <div className="story-desktop">
        <div data-story-pin className="relative h-[100svh] overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-12 gap-6 px-[var(--gutter)] py-[8svh]">
            {/* Colonne texte */}
            <div className="relative col-span-5 flex flex-col justify-between pt-[6svh]">
              <div>
                <div className="flex items-start gap-6">
                  <div className="h-[clamp(5rem,8.6vw,10rem)] overflow-hidden font-display text-[clamp(4rem,7vw,8rem)] font-light leading-none text-gold/90">
                    <div data-story-num-inner>
                      {chapters.map((c) => (
                        <div key={c.id} className="flex h-[clamp(5rem,8.6vw,10rem)] items-center">
                          {c.index}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="label mt-4 text-[0.58rem] text-ivory/55">/ 0{N}</span>
                </div>
                <div className="mt-4 h-[clamp(4.4rem,7vw,8.6rem)] overflow-hidden">
                  <div data-story-title-inner>
                    {chapters.map((c) => (
                      <h3
                        key={c.id}
                        className="flex h-[clamp(4.4rem,7vw,8.6rem)] items-center font-display text-[clamp(2.9rem,4.8vw,6rem)] font-light leading-none tracking-[-0.02em]"
                      >
                        {c.title}
                      </h3>
                    ))}
                  </div>
                </div>
                <div className="relative mt-10 min-h-[12rem] max-w-[30rem]">
                  {chapters.map((c) => (
                    <div key={c.id} data-story-text className="absolute inset-x-0 top-0">
                      <p className="font-display text-[clamp(1.6rem,2.1vw,2.6rem)] italic leading-tight text-gold">« {c.quote} »</p>
                      <p className="mt-5 text-[0.98rem] leading-relaxed text-ivory/65">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progression */}
              <div>
                <div className="relative h-px w-full bg-ivory/12">
                  <span data-story-progress className="absolute inset-0 origin-left scale-x-0 bg-gold" />
                </div>
                <ol className="mt-4 grid grid-cols-6 gap-3">
                  {chapters.map((c) => (
                    <li
                      key={c.id}
                      data-story-step
                      className="label text-[0.5rem] leading-snug tracking-[0.14em] text-ivory/45 transition-colors duration-500 [&.is-active]:text-ivory [&.is-past]:text-ivory/55"
                    >
                      {c.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Scène photographique */}
            <div className="relative col-span-7">
              <div className="absolute inset-y-0 left-[6%] right-0 overflow-hidden bg-ink-soft">
                {chapters.map((c, i) => (
                  <div key={c.id} data-story-img className="absolute inset-0 overflow-hidden" style={{ zIndex: i + 1 }}>
                    <Photo
                      src={c.image}
                      alt={c.alt}
                      fill
                      quality={85}
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      className="object-cover will-change-transform"
                    />
                  </div>
                ))}
                <div
                  data-story-bloom
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen [background:radial-gradient(circle_at_50%_60%,rgba(156,191,90,0.55),rgba(101,127,69,0.2)_35%,transparent_65%)]"
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              </div>
              {/* Détail flottant */}
              <div className="absolute -bottom-[2svh] left-0 z-30 aspect-[4/5] w-[30%]">
                {chapters.map((c) =>
                  c.detail ? (
                    <div key={c.id} data-story-detail className="absolute inset-0 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                      <Photo src={c.detail.image} alt={c.detail.alt} fill quality={80} sizes="18vw" className="object-cover" />
                    </div>
                  ) : (
                    <div key={c.id} data-story-detail className="hidden" />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Mobile / tablette / mouvement réduit : chapitres verticaux ——— */}
      <div className="story-mobile container-x mx-auto max-w-3xl space-y-24 pb-24">
        {chapters.map((c, i) => (
          <article key={c.id} className="relative">
            <header className="mb-6 flex items-end justify-between gap-4">
              <h3 className="font-display text-[clamp(2.4rem,10vw,3.6rem)] font-light leading-none tracking-[-0.02em]">{c.title}</h3>
              <span className="font-display text-[2.6rem] font-light leading-none text-gold/80">{c.index}</span>
            </header>
            <RevealImage className="aspect-[4/5] w-full" from={i % 2 ? "right" : "bottom"} parallax={6}>
              <Photo src={c.image} alt={c.alt} fill quality={80} sizes="(min-width: 768px) 46rem, 100vw" className="object-cover" />
            </RevealImage>
            {c.detail && (
              <RevealImage
                className={cn("relative z-10 -mt-24 aspect-square w-[44%] shadow-2xl", i % 2 ? "mr-auto -ml-2" : "ml-auto -mr-2")}
                from="bottom"
                parallax={0}
              >
                <Photo src={c.detail.image} alt={c.detail.alt} fill quality={75} sizes="44vw" className="object-cover" />
              </RevealImage>
            )}
            <div className={cn("mt-8", c.detail && "mt-6")}>
              <p className="font-display text-[1.7rem] italic leading-tight text-gold">« {c.quote} »</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/65">{c.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
