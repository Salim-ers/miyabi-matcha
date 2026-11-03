import { MiyabiSymbol, MiyabiWordmark } from "@/components/logo/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { navigation, site } from "@/data/site";
import { TLink } from "./TLink";

/** Pied de page compact : l'essentiel, sans redire la page. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-surface="green" className="relative bg-matcha text-ivory">
      <div className="container-x grid gap-10 pb-[calc(var(--bar-h)+2.5rem+env(safe-area-inset-bottom))] pt-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-6 lg:pb-12 lg:pt-20">
        <div className="flex items-center gap-4">
          <MiyabiSymbol className="h-auto w-16" />
          <MiyabiWordmark className="h-auto w-24" title="MIYABI MATCHA" />
        </div>

        <div>
          <address className="text-[0.9rem] not-italic leading-relaxed text-ivory/85">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.9rem]">
            Itinéraire <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <nav aria-label="Plan du site">
          <ul>
            {navigation.map((n) => (
              <li key={n.id}>
                <TLink href={n.href} className="inline-flex min-h-9 items-center text-[0.9rem] text-ivory/85 transition-colors duration-300 hover:text-ivory">
                  {n.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-[0.9rem]">
            {site.instagram.handle} <ArrowUpRight className="size-3.5" />
          </a>
          <ul className="mt-2">
            <li>
              <TLink href="/mentions-legales" className="inline-flex min-h-9 items-center text-[0.8125rem] text-ivory/70 transition-colors duration-300 hover:text-ivory">
                Mentions légales
              </TLink>
            </li>
            <li>
              <TLink href="/confidentialite" className="inline-flex min-h-9 items-center text-[0.8125rem] text-ivory/70 transition-colors duration-300 hover:text-ivory">
                Confidentialité
              </TLink>
            </li>
          </ul>
          <p className="mt-3 text-[0.75rem] text-ivory/60">
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
