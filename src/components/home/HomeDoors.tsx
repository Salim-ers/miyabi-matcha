import { MiyabiSymbol } from "@/components/logo/Logo";
import { TLink } from "@/components/shell/TLink";
import { ArrowRight } from "@/components/ui/Icons";
import { home } from "@/data/content";
import { cn } from "@/lib/utils/cn";

const TONES = [
  { panel: "bg-night text-ivory", hint: "text-ivory/70", dot: "border-ivory/60 group-hover:bg-ivory group-hover:text-ink", mark: "text-ivory/[0.05]" },
  { panel: "bg-sage text-ink", hint: "text-ink/70", dot: "border-ink/60 group-hover:bg-ink group-hover:text-ivory", mark: "text-ink/[0.06]" },
];

/** Deux portes pour finir : la carte, la boutique. Au survol, l'une s'ouvre et l'autre se retire. */
export function HomeDoors() {
  return (
    <section data-surface="dark" aria-label="Continuer la visite" className="flex flex-col lg:min-h-[64svh] lg:flex-row">
      {home.doors.map((door, i) => {
        const tone = TONES[i % TONES.length];
        return (
          <TLink
            key={door.href}
            href={door.href}
            className={cn(
              "group relative flex min-h-[38svh] flex-col justify-end overflow-hidden transition-[flex-grow] duration-[1100ms] ease-[var(--ease-expo)] lg:flex-[1_1_0%] lg:hover:flex-[1.34_1_0%]",
              tone?.panel,
            )}
          >
            <MiyabiSymbol
              className={cn(
                "pointer-events-none absolute -right-[6%] -top-[12%] h-auto w-[88%] max-w-[46rem] transition-transform duration-[1800ms] ease-[var(--ease-expo)] group-hover:scale-105 lg:w-[74%]",
                tone?.mark,
              )}
            />
            <span className="relative flex items-end justify-between gap-6 px-[var(--gutter)] pb-[clamp(1.5rem,4.5svh,3.5rem)]">
              <span>
                <span className={cn("label block text-[0.62rem]", tone?.hint)}>{door.hint}</span>
                <span className="display mt-3 block whitespace-nowrap text-[clamp(2.9rem,6.3vw,9rem)]">{door.label}</span>
              </span>
              <span className={cn("cta-dot mb-2 size-12 shrink-0 border transition-colors duration-500 lg:size-16", tone?.dot)}>
                <ArrowRight className="size-5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1" />
              </span>
            </span>
          </TLink>
        );
      })}
    </section>
  );
}
