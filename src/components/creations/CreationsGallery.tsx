"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { useSmoothScroll } from "@/components/shell/SmoothScroll";
import { TLink } from "@/components/shell/TLink";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { signature, signatures, type Signature } from "@/data/products";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { isLite } from "@/lib/stage";
import { cn } from "@/lib/utils/cn";

const crepe = signature("crepe-forest-fruit");
const strawberry = signature("strawberry-matcha");
const camelot = signature("camelot-caramel-latte");
const americano = signature("americano");

/** Nom monumental d'une création. */
function Name({ item, className }: { item: Signature; className?: string }) {
  return (
    <RevealText as="h2" className={cn("display", className)}>
      {item.lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </RevealText>
  );
}

function Kind({ children }: { children: ReactNode }) {
  return <p className="label text-[0.62rem] text-ivory/60">{children}</p>;
}

function Vertical({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <p lang="ja" className={cn("tategaki text-[clamp(0.9rem,1.2vw,1.35rem)] text-ivory/70", className)}>
      {text}
    </p>
  );
}

/**
 * Nos créations : une galerie sur le noir du studio, qui n'est plus un fond mais le lieu.
 * Chaque création a sa propre mise en scène, et rien ici ne ressemble à la carte.
 */
export function CreationsGallery() {
  const root = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  // Arrivée sur une création précise (/creations#crepe-forest-fruit), une fois les scènes en place.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (target) scrollTo(target, { immediate: true });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [scrollTo]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // La lumière change d'une création à l'autre.
      mm.add(MQ.motion, () => {
        const scenes = q<HTMLElement>("[data-tint]");
        scenes.forEach((scene) => {
          gsap.to(el, {
            backgroundColor: scene.dataset.tint,
            duration: 1.2,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: {
              trigger: scene,
              start: "top 55%",
              end: "bottom 45%",
              toggleActions: "play none none none",
              onEnterBack: () => gsap.to(el, { backgroundColor: scene.dataset.tint, duration: 1.2, overwrite: "auto" }),
            },
          });
        });
      });

      // Dérive au défilement : chaque plan a sa vitesse.
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        if (isLite()) return;
        q<HTMLElement>("[data-speed]").forEach((node) => {
          const speed = Number(node.dataset.speed ?? 0);
          gsap.fromTo(
            node,
            { y: () => speed * -window.innerHeight * 0.1 },
            {
              y: () => speed * window.innerHeight * 0.1,
              ease: "none",
              scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
            },
          );
        });
      });

      // Strawberry Matcha : zoom arrière depuis l'éclaboussure.
      mm.add(MQ.stage, () => {
        if (isLite()) return;
        const scene = q("[data-splash]")[0];
        if (!scene) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: scene, start: "top top", end: "+=110%", pin: true, scrub: 0.7, anticipatePin: 1 } });
        tl.fromTo(q("[data-splash-img]"), { scale: 1.62, transformOrigin: "50% 26%" }, { scale: 1, ease: "power1.inOut", duration: 1 }, 0);
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} data-surface="dark" className="relative overflow-hidden bg-night text-ivory">
      {/* ─── Ouverture ─── */}
      <header className="container-x flex min-h-[64svh] flex-col justify-end pb-10 pt-[calc(var(--header-h)+2rem)] lg:min-h-[78svh] lg:pb-14">
        <p className="display text-[clamp(1.6rem,3vw,3.4rem)] italic">Nos</p>
        <RevealText as="h1" mode="chars" className="display -ml-[0.04em] text-[clamp(4rem,22.4vw,32rem)] leading-[0.86]">
          Créations
        </RevealText>
        <nav aria-label="Les créations" className="mt-8 hidden flex-wrap gap-x-7 gap-y-2 lg:flex">
          {signatures.map((s) => (
            <TLink key={s.id} href={`#${s.id}`} className="text-[0.8125rem] text-ivory/60 transition-colors duration-300 hover:text-ivory">
              {s.name}
            </TLink>
          ))}
        </nav>
      </header>

      {/* ─── I. Crêpe Forest Fruit : l'objet seul, à gauche ─── */}
      <section id={crepe.id} data-tint={crepe.tint} aria-label={crepe.name} className="relative scroll-mt-10 pt-6 lg:min-h-[100svh] lg:pt-[4svh]">
        <div className="relative w-full lg:w-[min(58vw,92svh)]">
          <RevealImage variant="left" className="studio-fade aspect-[823/915] w-full" zoom={1.1}>
            <Photo src={crepe.photo.src} alt={crepe.photo.alt} focus="50% 50%" fill sizes="(min-width: 64rem) 58vw, 100vw" quality={88} />
          </RevealImage>
        </div>
        <div data-speed="-0.35" className="container-x relative pt-8 lg:absolute lg:right-0 lg:top-[18svh] lg:w-[46vw] lg:pt-0">
          <Name item={crepe} className="text-[clamp(3.2rem,13.5vw,6.5rem)] lg:text-[clamp(3.8rem,7.2vw,10rem)]" />
          <div className="mt-6 max-w-[34ch] lg:mt-9">
            <Kind>{crepe.kind}</Kind>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/80">{crepe.description}</p>
          </div>
        </div>
        <Vertical text={crepe.nameJa} className="absolute right-[var(--gutter)] top-[18svh] hidden lg:block" />
      </section>

      {/* ─── II. Strawberry Matcha : l'éclaboussure, plein cadre ─── */}
      <section id={strawberry.id} data-tint={strawberry.tint} aria-label={strawberry.name} className="relative mt-16 scroll-mt-0 lg:mt-[12svh]">
        <div data-splash className="relative h-[120vw] max-h-[100svh] overflow-hidden sm:h-[100svh] lg:h-[100svh]">
          <div data-splash-img className="absolute inset-0">
            <Photo src={strawberry.photo.src} alt={strawberry.photo.alt} focus={strawberry.photo.focus} focusM={strawberry.photo.focusM} fill sizes="100vw" quality={88} />
          </div>
        </div>
        <div className="container-x flex flex-col gap-6 pb-6 pt-8 lg:flex-row lg:items-end lg:justify-between lg:pt-[7svh]">
          <Name item={strawberry} className="text-[clamp(3.2rem,14vw,6.5rem)] lg:text-[clamp(3.8rem,9vw,13rem)]" />
          <div className="flex items-start gap-8 lg:pb-3">
            <div>
              <Kind>{strawberry.kind}</Kind>
              <p className="mt-3 max-w-[32ch] text-[0.9375rem] leading-relaxed text-ivory/80">{strawberry.description}</p>
            </div>
            <Vertical text={strawberry.nameJa} />
          </div>
        </div>
      </section>

      {/* ─── III. Camelot Caramel Latte : le geste, à droite ─── */}
      <section id={camelot.id} data-tint={camelot.tint} aria-label={camelot.name} className="relative mt-14 scroll-mt-10 lg:mt-[12svh] lg:min-h-[100svh]">
        <div className="relative ml-auto w-full lg:absolute lg:bottom-0 lg:right-[3vw] lg:w-[min(56vw,88svh)]">
          <RevealImage variant="right" className="studio-fade aspect-[778/865] w-full" zoom={1.1}>
            <Photo src={camelot.photo.src} alt={camelot.photo.alt} focus="50% 50%" fill sizes="(min-width: 64rem) 56vw, 100vw" quality={88} />
          </RevealImage>
        </div>
        <div className="container-x relative pt-8 lg:absolute lg:bottom-[12svh] lg:left-0 lg:w-[42vw] lg:pt-0">
          <Name item={camelot} className="text-[clamp(3.2rem,14vw,6.5rem)] lg:text-[clamp(3.6rem,6.6vw,9rem)]" />
          <div className="mt-6 max-w-[34ch]">
            <Kind>{camelot.kind}</Kind>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/80">{camelot.description}</p>
          </div>
        </div>
      </section>

      {/* ─── IV. Americano : le nom en bandeau, le verre au centre ─── */}
      <section id={americano.id} data-tint={americano.tint} aria-label={americano.name} className="relative mt-16 scroll-mt-10 lg:mt-[16svh]">
        <div className="container-x">
          <Name item={americano} className="text-center text-[clamp(3.4rem,18.6vw,28rem)] leading-[0.9]" />
        </div>
        <div className="relative mx-auto mt-4 w-full lg:mt-6 lg:w-[min(62vw,96svh)]">
          <RevealImage variant="shoji" className="studio-fade aspect-[774/860] w-full" zoom={1.08}>
            <Photo src={americano.photo.src} alt={americano.photo.alt} focus={americano.photo.focus} fill sizes="(min-width: 64rem) 62vw, 100vw" quality={88} />
          </RevealImage>
        </div>
        <div className="container-x flex items-end justify-between gap-8 pt-6 lg:absolute lg:inset-x-0 lg:bottom-[8svh] lg:pt-0">
          <div className="max-w-[28ch]">
            <Kind>{americano.kind}</Kind>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/80">{americano.description}</p>
          </div>
          <Vertical text={americano.nameJa} className="shrink-0" />
        </div>
      </section>

      {/* ─── Sortie ─── */}
      <section className="container-x flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-end lg:justify-between lg:py-[16svh]">
        <RevealText as="p" className="display max-w-[14ch] text-[clamp(2.6rem,6.4vw,8rem)] italic leading-[1.02]">
          Toute la carte vous attend.
        </RevealText>
        <Cta href="/carte" tone="ivory">
          Voir la carte
        </Cta>
      </section>
    </div>
  );
}
