"use client";

import Link from "next/link";
import { useRef } from "react";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { ArrowRight } from "@/components/ui/Icons";
import { hero } from "@/data/content";
import { site } from "@/data/site";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/animation/gsap";
import { onIntroDone } from "@/lib/intro";

/**
 * Hero — composition en profondeur sur fond d'encre :
 * symbole 雅 monumental (arrière-plan) · photographie qui émerge de l'obscurité · titre éditorial au premier plan.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        let split: SplitText | null = null;
        let entrance: gsap.core.Timeline | null = null;
        let cancelled = false;

        const play = async () => {
          await (document.fonts?.ready ?? Promise.resolve());
          if (cancelled) return;
          const title = q("[data-hero-title]")[0];
          if (title) split = SplitText.create(title, { type: "lines,chars", mask: "lines", aria: "none" });
          gsap.set(q("[data-hero-item]"), { opacity: 1 });
          entrance = gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(q("[data-hero-symbol]"), { opacity: 0, scale: 1.14, yPercent: 5, duration: 2.6 }, 0)
            .fromTo(
              q("[data-hero-photo]"),
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.inOut" },
              0.05,
            )
            .from(q("[data-hero-photo] img"), { scale: 1.35, duration: 2.4 }, 0.05)
            .from(q("[data-hero-glow]"), { opacity: 0, scale: 0.6, duration: 2.4 }, 0.3)
            .from(split?.chars ?? [], { yPercent: 120, rotate: 6, duration: 1.5, stagger: 0.032 }, 0.45)
            .from(q("[data-hero-fade]"), { y: 28, opacity: 0, duration: 1.3, stagger: 0.09 }, 0.9);
        };

        const stopIntro = onIntroDone(() => void play());

        // Profondeur au défilement
        const scroll = gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(q("[data-par-symbol]"), { yPercent: 24, ease: "none" }, 0)
          .to(q("[data-par-photo]"), { yPercent: -9, scale: 1.04, ease: "none" }, 0)
          .to(q("[data-par-content]"), { y: -90, opacity: 0, ease: "none" }, 0);

        return () => {
          cancelled = true;
          stopIntro();
          entrance?.kill();
          scroll.kill();
          split?.revert();
        };
      });

      // Légère profondeur au pointeur (desktop)
      mm.add(`${MQ.desktop} and ${MQ.finePointer} and ${MQ.motion}`, () => {
        const photoX = gsap.quickTo(q("[data-mouse-photo]"), "x", { duration: 1.4, ease: "power3.out" });
        const photoY = gsap.quickTo(q("[data-mouse-photo]"), "y", { duration: 1.4, ease: "power3.out" });
        const symX = gsap.quickTo(q("[data-mouse-symbol]"), "x", { duration: 1.8, ease: "power3.out" });
        const symY = gsap.quickTo(q("[data-mouse-symbol]"), "y", { duration: 1.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          photoX(nx * 18);
          photoY(ny * 12);
          symX(nx * -34);
          symY(ny * -20);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="accueil"
      data-surface="dark"
      data-nav="accueil"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink lg:min-h-[100svh]"
    >
      {/* — Arrière-plan : symbole monumental — */}
      <div data-par-symbol className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div data-mouse-symbol className="absolute left-1/2 top-[calc(var(--header-h)+2svh)] w-[128vw] -translate-x-1/2 sm:w-[96vw] lg:left-[36%] lg:top-[-4svh] lg:w-[min(70vw,150svh)] lg:translate-x-0">
          <div data-hero-item data-hero-symbol>
            <MiyabiSymbol className="h-auto w-full text-matcha-deep/80" />
          </div>
        </div>
      </div>

      {/* — Plan intermédiaire : photographie — */}
      <div data-par-photo className="relative -z-[5] lg:absolute lg:inset-0">
        <div data-mouse-photo className="relative lg:absolute lg:bottom-[-2svh] lg:right-[3vw] lg:w-[min(52vw,112svh)]">
          <div
            data-hero-glow
            aria-hidden
            className="absolute left-1/2 top-1/2 aspect-square w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(101,127,69,0.32)_0%,rgba(38,61,36,0.18)_38%,transparent_68%)] blur-2xl"
          />
          <div
            data-hero-item
            data-hero-photo
            className="feather-soft relative mx-auto mt-[calc(var(--header-h)+env(safe-area-inset-top))] aspect-[1122/949] w-[108vw] max-w-none -translate-x-[4vw] sm:w-[88vw] sm:translate-x-0 lg:mt-0 lg:w-full"
          >
            <Photo
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              quality={90}
              sizes="(min-width: 1024px) 52vw, 108vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* — Premier plan : contenu éditorial — */}
      <div
        data-par-content
        className="container-x relative z-10 -mt-[18vw] flex flex-col pb-14 sm:-mt-[12vw] lg:mt-0 lg:min-h-[100svh] lg:justify-end lg:pb-[9svh] lg:pt-40"
      >
        <p data-hero-item data-hero-fade className="label flex items-center gap-3 text-[0.56rem] tracking-[0.24em] text-gold sm:gap-4 sm:text-[0.62rem] sm:tracking-[0.32em]">
          <span aria-hidden className="h-px w-6 bg-gold/60 sm:w-10" />
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          aria-label={`The Art of Matcha — ${site.name}, maison de matcha à Paris 8e`}
          className="mt-5 font-display text-[clamp(3.5rem,17vw,6.5rem)] font-light leading-[0.88] tracking-[-0.035em] text-ivory sm:text-[clamp(4.5rem,13vw,8rem)] lg:mt-7 lg:text-[clamp(5rem,10.4vw,14rem)]"
        >
          <span data-hero-item data-hero-title className="block" aria-hidden>
            <span className="block">{hero.titleLines[0]}</span>
            <span className="block pl-[0.9em]">
              <em className="font-normal text-gold">of</em> Matcha.
            </span>
          </span>
        </h1>

        <p
          data-hero-item
          data-hero-fade
          className="mt-6 max-w-[26rem] font-display text-[1.45rem] italic leading-snug text-ivory/80 lg:mt-8 lg:text-[1.75rem]"
        >
          {site.subtitle}
        </p>

        <div data-hero-item data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 lg:mt-10">
          <Magnetic className="inline-block">
            <Link
              href={hero.ctaPrimary.href}
              className="group label flex h-14 items-center justify-between gap-6 rounded-full bg-ivory pl-7 pr-2 text-[0.68rem] text-ink transition-colors duration-500 hover:bg-gold sm:justify-start"
            >
              {hero.ctaPrimary.label}
              <span className="flex size-10 items-center justify-center rounded-full bg-ink text-ivory transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-[-45deg]">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </Magnetic>
          <Link
            href={hero.ctaSecondary.href}
            className="label link-line flex min-h-12 items-center justify-center self-center text-[0.68rem] text-ivory/85 sm:self-auto"
          >
            {hero.ctaSecondary.label}
          </Link>
        </div>
      </div>

      {/* Adresse verticale + repère de défilement (desktop) */}
      <p
        data-hero-item
        data-hero-fade
        className="label absolute bottom-[9svh] right-[clamp(1.25rem,2.4vw,2.75rem)] z-10 hidden text-[0.58rem] text-ivory/55 [writing-mode:vertical-rl] lg:block"
      >
        {site.address.street} — {site.address.postalCode} {site.address.city}
      </p>
      <div
        data-hero-item
        data-hero-fade
        aria-hidden
        className="absolute bottom-0 left-1/2 z-10 hidden h-[7svh] w-px overflow-hidden bg-ivory/10 lg:block"
      >
        <span className="absolute inset-x-0 top-0 h-1/2 animate-[drip_2.6s_var(--ease-silk)_3] bg-gold" />
      </div>
    </section>
  );
}
