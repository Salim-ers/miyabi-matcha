import { TLink } from "@/components/shell/TLink";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { home } from "@/data/content";
import { photos } from "@/data/photos";

const SCENES = [photos.whisked, photos.tray];

/** Deux portes pour finir : la carte, la boutique. Au survol, l'une s'ouvre et l'autre se retire. */
export function HomeDoors() {
  return (
    <section data-surface="dark" aria-label="Continuer la visite" className="flex flex-col bg-night lg:h-[92svh] lg:flex-row">
      {home.doors.map((door, i) => {
        const scene = SCENES[i];
        return (
          <TLink
            key={door.href}
            href={door.href}
            className="group relative block h-[52svh] overflow-hidden text-ivory transition-[flex-grow] duration-[1100ms] ease-[var(--ease-expo)] lg:h-auto lg:flex-[1_1_0%] lg:hover:flex-[1.34_1_0%]"
          >
            {scene && (
              <Photo
                src={scene.src}
                alt=""
                focus={scene.focus}
                fill
                sizes="(min-width: 64rem) 66vw, 100vw"
                className="transition-transform duration-[1800ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]"
              />
            )}
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />
            <span className="absolute inset-x-[var(--gutter)] bottom-[clamp(1.5rem,4.5svh,3.5rem)] flex items-end justify-between gap-6">
              <span>
                <span className="label block text-[0.62rem] text-ivory/80">{door.hint}</span>
                <span className="display mt-3 block whitespace-nowrap text-[clamp(2.9rem,6.3vw,9rem)]">{door.label}</span>
              </span>
              <span className="cta-dot mb-2 size-12 shrink-0 border border-ivory/60 transition-colors duration-500 group-hover:bg-ivory group-hover:text-ink lg:size-16">
                <ArrowRight className="size-5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1" />
              </span>
            </span>
          </TLink>
        );
      })}
    </section>
  );
}
