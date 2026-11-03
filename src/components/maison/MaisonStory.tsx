"use client";

import { useRef } from "react";
import { BrushSymbol } from "@/components/logo/BrushSymbol";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { maison } from "@/data/content";
import { photos } from "@/data/photos";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { isLite, onStage } from "@/lib/stage";

const FRAMES = [photos.powder, photos.water, photos.whisk, photos.whisked];

/** Numéro de séquence, en toutes lettres japonaises : discret, jamais décoratif. */
function SeqTitle({ index, title, tone = "ink" }: { index: string; title: string; tone?: "ink" | "ivory" }) {
  return (
    <p className={tone === "ink" ? "flex items-center gap-3 text-smoke" : "flex items-center gap-3 text-ivory/80"}>
      <span className="font-jp text-[0.95rem]" aria-hidden>
        {index}
      </span>
      <span className="label text-[0.62rem]">{title}</span>
    </p>
  );
}

/**
 * Notre maison : trois séquences photographiques, presque sans mots.
 * Grand écran : la séquence du geste est épinglée, les images se succèdent par ouverture de shōji.
 * Mobile : les images s'empilent au défilement natif, sans JavaScript.
 */
export function MaisonStory() {
  const root = useRef<HTMLDivElement>(null);
  const stroke = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // Le 雅 se trace à l'arrivée.
      mm.add(MQ.motion, () => {
        const path = stroke.current;
        if (!path) return;
        let tween: gsap.core.Tween | null = null;
        const stop = onStage(() => {
          tween = gsap.to(path, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", delay: 0.15 });
        });
        return () => {
          stop();
          tween?.kill();
        };
      });
      mm.add(MQ.reduce, () => {
        if (stroke.current) stroke.current.style.strokeDashoffset = "0";
      });

      // La séquence du geste, épinglée.
      mm.add(MQ.stage, () => {
        if (isLite()) return;
        const gesture = q("[data-gesture]")[0];
        const frames = q<HTMLElement>("[data-frame]");
        const captions = q<HTMLElement>("[data-caption]");
        if (!gesture || frames.length === 0) return;
        gesture.classList.add("is-pinned");
        gsap.set(frames.slice(1), { clipPath: "inset(0% 50% 0% 50%)" });
        gsap.set(captions.slice(1), { autoAlpha: 0, y: 30 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q("[data-stack]")[0], start: "top top", end: `+=${(frames.length - 1) * 90}%`, pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        frames.slice(1).forEach((frame, i) => {
          const at = i * 1;
          const prevCaption = captions[i];
          const caption = captions[i + 1];
          tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, at);
          tl.fromTo(frame.querySelector("[data-frame-img]"), { scale: 1.18 }, { scale: 1, duration: 1.1, ease: "none" }, at);
          if (prevCaption) tl.to(prevCaption, { autoAlpha: 0, y: -30, duration: 0.3, ease: "power2.in" }, at + 0.1);
          if (caption) tl.to(caption, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.5);
        });
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gesture.classList.remove("is-pinned");
          gsap.set([...frames, ...captions], { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="bg-ivory text-ink">
      {/* ─── Ouverture ─── */}
      <header data-surface="light" className="container-x relative flex min-h-[86svh] flex-col justify-end overflow-hidden pb-10 pt-[calc(var(--header-h)+1rem)] lg:min-h-[100svh] lg:pb-14">
        <div aria-hidden className="pointer-events-none absolute right-[-8vw] top-[10svh] w-[92vw] text-sage/60 lg:right-[4vw] lg:top-[9svh] lg:w-[min(58vw,104svh)]">
          <BrushSymbol strokeRef={stroke} ghostOpacity={0} className="h-auto w-full" />
        </div>
        <h1 className="display relative text-[clamp(4rem,15vw,20rem)] leading-[0.86]">
          <span className="block">{maison.title[0]}</span>
          <span className="block italic">{maison.title[1]}</span>
        </h1>
        <p className="relative mt-6 max-w-[34ch] text-[1rem] leading-relaxed text-smoke lg:mt-8">{maison.name}</p>
      </header>

      {/* ─── 一 La feuille : l'inspiration japonaise ─── */}
      <section data-surface="light" aria-label={maison.leaf.title} className="relative lg:flex lg:items-start">
        <div className="relative h-[112vw] sm:h-[90vw] lg:sticky lg:top-0 lg:h-[100svh] lg:w-[62vw]">
          <RevealImage variant="rise" className="absolute inset-0" parallax={6} zoom={1.1}>
            <Photo src={photos.leaves.src} alt={photos.leaves.alt} focus={photos.leaves.focus} fill sizes="(min-width: 64rem) 62vw, 100vw" quality={85} />
          </RevealImage>
        </div>
        <div className="container-x flex flex-col justify-between gap-10 py-10 lg:min-h-[170svh] lg:w-[38vw] lg:px-[4vw] lg:py-[14svh]">
          <div>
            <SeqTitle index={maison.leaf.index} title={maison.leaf.title} />
            <RevealText as="h2" className="display mt-6 text-[clamp(2.6rem,5.2vw,7rem)] italic leading-[1.02]">
              {maison.leaf.line}
            </RevealText>
          </div>
          <RevealImage variant="shoji" className="aspect-[941/1500] w-[70%] self-end lg:w-[86%]" zoom={1.12}>
            <Photo src={photos.field.src} alt={photos.field.alt} focus={photos.field.focus} fill sizes="(min-width: 64rem) 30vw, 66vw" />
          </RevealImage>
        </div>
      </section>

      {/* ─── 二 Le geste : quatre images, une seule préparation ─── */}
      <section data-surface="dark" data-gesture aria-label={maison.gesture.title} className="gesture relative bg-night text-ivory">
        <div className="container-x absolute left-0 top-[calc(var(--header-h)+0.25rem)] z-20">
          <SeqTitle index={maison.gesture.index} title={maison.gesture.title} tone="ivory" />
        </div>
        <div data-stack className="gesture-stack">
          {FRAMES.map((photo, i) => {
            const frame = maison.gesture.frames[i];
            return (
              <div key={photo.src} data-frame className="gesture-frame h-[100svh] overflow-hidden bg-night" style={{ zIndex: i + 1 }}>
                <div data-frame-img className="absolute inset-y-0 right-0 w-full lg:w-[min(62vw,106svh)]">
                  <Photo src={photo.src} alt={photo.alt} focus={photo.focus} fill sizes="(min-width: 64rem) 62vw, 100vw" quality={85} />
                </div>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent lg:hidden" />
                {/* Grand écran : une légende fixe remplace celle-ci pendant l'épinglage */}
                <div className="container-x absolute inset-x-0 bottom-[calc(var(--bar-h)+2rem)] lg:bottom-[12svh] lg:w-[38vw]">
                  <div data-caption>
                    <h3 className="display text-[clamp(3rem,7vw,9.5rem)] leading-[0.95]">{frame?.title}</h3>
                    <p className="mt-3 text-[1rem] text-ivory/80 lg:mt-5">{frame?.line}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 三 L'instant : la boutique ─── */}
      <section data-surface="light" aria-label={maison.moment.title} className="relative bg-paper pb-20 pt-14 lg:pb-[16svh] lg:pt-[14svh]">
        <div className="container-x">
          <SeqTitle index={maison.moment.index} title={maison.moment.title} />
          <RevealText as="h2" className="display mt-6 max-w-[17ch] text-[clamp(2.6rem,6vw,8.5rem)] leading-[1.02]">
            {maison.moment.line}
          </RevealText>
        </div>
        <div className="container-x mt-10 grid grid-cols-12 items-end gap-3 lg:mt-[10svh] lg:gap-6">
          <RevealImage variant="rise" className="col-span-7 aspect-[1086/1166] lg:col-span-5" zoom={1.1}>
            <Photo src={photos.tray.src} alt={photos.tray.alt} focus={photos.tray.focus} fill sizes="(min-width: 64rem) 42vw, 58vw" />
          </RevealImage>
          <RevealImage variant="fall" className="col-span-5 aspect-[2/3] lg:col-span-3" delay={0.1} zoom={1.1}>
            <Photo src={photos.cupHand.src} alt={photos.cupHand.alt} focus={photos.cupHand.focus} fill sizes="(min-width: 64rem) 25vw, 42vw" />
          </RevealImage>
          <RevealImage variant="shoji" className="col-span-8 col-start-5 mt-3 aspect-[4/5] lg:col-span-4 lg:col-start-auto lg:mt-0" delay={0.15} zoom={1.1}>
            <Photo src={photos.takeaway.src} alt={photos.takeaway.alt} focus={photos.takeaway.focus} fill sizes="(min-width: 64rem) 33vw, 66vw" />
          </RevealImage>
        </div>
        <div className="container-x mt-10 lg:mt-14">
          <Cta href="/contact">Nous trouver</Cta>
        </div>
      </section>
    </div>
  );
}
