"use client";

import Image from "next/image";
import { useRef } from "react";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { home } from "@/data/content";
import { photos } from "@/data/photos";
import { site } from "@/data/site";
import { gsap, isLightDevice, MQ, SplitText, useGSAP } from "@/lib/animation/gsap";
import { isDirectLoad, isLite, onStage } from "@/lib/stage";

const DEPTH_LAYER = "/images/hero/matcha-tornado-depth.webp";
const SIZES = "(min-width: 64rem) 62vw, 170vw";

/** Le titre, crené à la main : le découpage en lettres de l'animation ne gère pas le crénage de la police. */
function Masthead() {
  return (
    <>
      MIY<span className="ml-[-0.115em]">A</span>BI.
    </>
  );
}

/**
 * La couverture. Un mur ivoire, une alcôve noire (tokonoma) qui s'ouvre comme un shōji,
 * et un seul objet exposé : le Matcha Tornado, dont la crème passe DEVANT le titre,
 * comme sur une couverture de magazine. Composition complète sans la moindre animation.
 *
 * Empilement : mot encre sur l'ivoire · alcôve (photo, mot ivoire, crème découpée).
 * Le mot change de couleur au franchissement de l'alcôve, car les deux versions sont parfaitement superposées.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // — Entrée —
      mm.add(MQ.motion, () => {
        // Rechargement dans la même session, sans écran : la couverture est déjà là, on ne la cache pas.
        if (isDirectLoad()) return;
        if (isLightDevice()) {
          // Écran tactile : fondu et léger déplacement, sans ouverture de masque ni découpage en lettres.
          const words = q("[data-mast-move]");
          gsap.set(q("[data-enter-photo]"), { opacity: 0, scale: 1.05, transformOrigin: "50% 78%" });
          gsap.set(words, { opacity: 0, y: 14 });
          gsap.set(q("[data-tag-line]"), { yPercent: 110 });
          gsap.set(q("[data-enter]"), { opacity: 0, y: 12 });
          let tl: gsap.core.Timeline | null = null;
          const stop = onStage(() => {
            tl = gsap
              .timeline({ defaults: { ease: "power3.out" } })
              .to(q("[data-enter-photo]"), { opacity: 1, scale: 1, duration: 1 }, 0)
              .to(words, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
              .to(q("[data-tag-line]"), { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.35)
              .to(q("[data-enter]"), { opacity: 1, y: 0, duration: 0.8 }, 0.5);
          });
          return () => {
            stop();
            tl?.kill();
          };
        }
        const windowEl = el.querySelector<HTMLElement>("[data-window]");
        if (!windowEl) return;
        const splits = q("[data-mast]").map((m) => SplitText.create(m, { type: "chars", aria: "none" }));
        const chars = splits.flatMap((s) => s.chars);
        gsap.set(windowEl, { "--clip-x": "50vw" });
        gsap.set(q("[data-enter-photo]"), { scale: 1.2, transformOrigin: "50% 78%" });
        gsap.set(chars, { yPercent: 22, autoAlpha: 0 });
        gsap.set(q("[data-tag-line]"), { yPercent: 110 });
        gsap.set(q("[data-enter]"), { autoAlpha: 0, y: 16 });
        let tl: gsap.core.Timeline | null = null;
        const stop = onStage(() => {
          const finalX = getComputedStyle(el).getPropertyValue("--win-x").trim() || "29vw";
          tl = gsap
            .timeline({
              onComplete: () => {
                windowEl.style.removeProperty("--clip-x");
              },
            })
            .to(windowEl, { "--clip-x": finalX, duration: 1.7, ease: "expo.inOut" }, 0)
            .to(q("[data-enter-photo]"), { scale: 1, duration: 2.4, ease: "expo.out" }, 0.15)
            .fromTo(q("[data-light]"), { xPercent: -130 }, { xPercent: 130, duration: 2.2, ease: "power2.inOut" }, 0.35)
            .to(chars, { yPercent: 0, autoAlpha: 1, duration: 1.35, ease: "expo.out", stagger: { each: 0.045, from: "center" } }, 0.5)
            .to(q("[data-tag-line]"), { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.1 }, 0.95)
            .to(q("[data-enter]"), { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 1.15);
        });
        return () => {
          stop();
          tl?.kill();
          splits.forEach((s) => s.revert());
          windowEl.style.removeProperty("--clip-x");
        };
      });

      // — Au défilement (grand écran) : l'alcôve s'ouvre jusqu'à devenir tout l'écran —
      mm.add(MQ.stage, () => {
        if (isLite()) return;
        const header = document.querySelector<HTMLElement>("[data-header]");
        const windowEl = el.querySelector<HTMLElement>("[data-window]");
        if (!windowEl) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=85%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              const tone = self.progress > 0.32 ? "dark" : "light";
              if (header && header.dataset.tone !== tone) header.dataset.tone = tone;
            },
          },
        });
        tl.to(windowEl, { "--open": 1, ease: "power1.inOut", duration: 0.6 }, 0)
          .to(q("[data-leave]"), { autoAlpha: 0, y: -22, ease: "power1.in", duration: 0.2 }, 0)
          .to(q("[data-scroll-photo]"), { scale: 1.05, ease: "none", duration: 1 }, 0)
          .fromTo(q("[data-phrase]"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.24, stagger: 0.07 }, 0.52);
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          windowEl.style.removeProperty("--open");
        };
      });

      // — Au pointeur : profondeur réelle entre la photo et le titre —
      mm.add(`${MQ.desktop} and ${MQ.finePointer} and ${MQ.motion}`, () => {
        if (isLite()) return;
        const layers = q("[data-ptr]");
        const words = q("[data-mast-move]");
        gsap.set(layers, { transformPerspective: 1500, transformOrigin: "50% 75%" });
        const state = { nx: 0, ny: 0 };
        const apply = () => {
          gsap.set(layers, { x: state.nx * -14, y: state.ny * -8, rotationY: state.nx * 2.4, rotationX: state.ny * -1.5 });
          gsap.set(words, { x: state.nx * 12, y: state.ny * 6 });
        };
        const move = (e: PointerEvent) => {
          gsap.to(state, {
            nx: e.clientX / window.innerWidth - 0.5,
            ny: e.clientY / window.innerHeight - 0.5,
            duration: 1.3,
            ease: "power3.out",
            overwrite: true,
            onUpdate: apply,
          });
        };
        el.addEventListener("pointermove", move);
        return () => {
          el.removeEventListener("pointermove", move);
          gsap.killTweensOf(state);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-surface="light" className="hero" aria-label="MIYABI MATCHA, The Art of Matcha">
      {/* Mot encre, sur l'ivoire */}
      <h1 data-mast-move className="hero-mast text-ink" aria-label={`${site.name}, ${site.tagline}`}>
        <span data-mast aria-hidden className="block">
          <Masthead />
        </span>
      </h1>

      {/* Alcôve */}
      <div data-window className="hero-window">
        <div data-scroll-photo className="hero-layer">
          <div data-ptr className="absolute inset-0">
            <div data-enter-photo data-hero-photo className="hero-photo-mask absolute inset-0">
              <Photo src={photos.tornado.src} alt={photos.tornado.alt} fill priority quality={88} sizes={SIZES} />
            </div>
          </div>
        </div>

        <div data-mast-move aria-hidden className="hero-mast text-ivory">
          <span data-mast className="block">
            <Masthead />
          </span>
        </div>

        {/* La crème, au-dessus du mot : mêmes pixels, même cadre que la photo */}
        <div data-scroll-photo className="hero-layer" aria-hidden>
          <div data-ptr className="absolute inset-0">
            <div data-enter-photo className="absolute inset-0">
              <Image src={DEPTH_LAYER} alt="" fill priority quality={88} sizes={SIZES} className="object-cover" />
            </div>
          </div>
        </div>

        <div aria-hidden className="hero-sweep pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
          <span data-light className="absolute inset-y-0 -left-1/4 block w-[150%] -translate-x-[130%] bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.55)_50%,transparent_62%)]" />
        </div>
      </div>

      {/* Phrase d'identité : apparaît de part et d'autre du produit quand l'alcôve est grande ouverte */}
      <p className="hero-phrase pointer-events-none absolute inset-x-0 bottom-[11svh] text-ivory">
        <span data-phrase className="display absolute bottom-0 left-[var(--gutter)] whitespace-nowrap text-[clamp(1.8rem,2.9vw,4.4rem)] italic leading-[1.08] opacity-0">
          {home.statement[0]}
        </span>{" "}
        <span data-phrase className="display absolute bottom-0 right-[var(--gutter)] whitespace-nowrap text-right text-[clamp(1.8rem,2.9vw,4.4rem)] italic leading-[1.08] opacity-0">
          {home.statement[1]}
        </span>
      </p>

      {/* Signature + bouton */}
      <div
        data-leave
        className="absolute inset-x-[var(--gutter)] bottom-[calc(var(--bar-h)+1.5rem+env(safe-area-inset-bottom))] flex flex-col items-start gap-y-2 lg:bottom-[4.6svh] lg:right-auto lg:w-[calc(var(--win-x)-var(--gutter)-2vw)] lg:gap-y-6"
      >
        <p className="display flex flex-wrap gap-x-[0.28em] text-[clamp(1.85rem,8.8vw,3.2rem)] italic leading-[1.04] lg:block lg:text-[clamp(2.1rem,3.5vw,5.2rem)]">
          {home.tagline.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span data-tag-line className="block">
                {line}
              </span>
            </span>
          ))}
        </p>
        <div data-enter className="flex w-full items-center justify-between gap-4 lg:block">
          <Cta href={home.cta.href}>{home.cta.label}</Cta>
        </div>
      </div>

      <div
        data-leave
        className="absolute bottom-[4.6svh] right-[var(--gutter)] hidden w-[calc(var(--win-x)-var(--gutter)-2vw)] text-right lg:block"
      >
        <p data-enter className="label text-[0.62rem] text-smoke">
          {home.cover.label}
        </p>
        <p data-enter className="display mt-2 text-[clamp(1.2rem,1.7vw,2.4rem)] italic leading-tight">
          {home.cover.name}
        </p>
        <p data-enter className="mt-5 text-[0.8125rem] leading-relaxed text-smoke">
          {site.address.street}
          <br />
          {site.address.neighbourhood}
        </p>
      </div>
    </section>
  );
}
