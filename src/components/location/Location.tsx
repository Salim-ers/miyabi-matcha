import { RevealText } from "@/components/motion/RevealText";
import { ArrowUpRight, InstagramIcon, RouteIcon } from "@/components/ui/Icons";
import { location } from "@/data/content";
import { site } from "@/data/site";
import { MapEmbed } from "./MapEmbed";

/** Nous trouver — adresse, itinéraire, Instagram et carte Google Maps interactive. */
export function Location() {
  return (
    <section
      id="visite"
      data-surface="green"
      data-nav="visite"
      aria-labelledby="visite-title"
      className="relative overflow-hidden bg-matcha-deep text-ivory"
    >
      <div aria-hidden className="pointer-events-none absolute -left-[20vw] top-0 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(156,191,90,0.12),transparent_65%)]" />
      <div className="container-x relative mx-auto grid max-w-[120rem] gap-12 py-24 lg:grid-cols-12 lg:gap-6 lg:py-36">
        <div className="flex flex-col lg:col-span-5">
          <p className="label flex items-center gap-4 text-[0.62rem] text-gold">
            <span aria-hidden className="h-px w-10 bg-gold/60" />
            {location.label}
          </p>
          <h2 id="visite-title" className="sr-only">
            {location.title}
          </h2>
          <address className="mt-8 not-italic">
            <RevealText
              as="p"
              className="font-display text-[clamp(2.8rem,12vw,4.6rem)] font-light leading-[0.95] tracking-[-0.025em] lg:text-[clamp(3.4rem,5.4vw,7rem)]"
            >
              2 rue Joseph
              <br />
              Sansboeuf
            </RevealText>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="font-display text-[1.9rem] font-light italic text-gold">
                {site.address.postalCode} {site.address.city}
              </span>
              <span className="label text-[0.58rem] text-ivory/55">{site.address.neighbourhood}</span>
            </p>
          </address>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="label flex min-h-14 items-center justify-center gap-3 rounded-full bg-ivory px-7 text-[0.64rem] text-ink transition-colors duration-500 hover:bg-gold"
            >
              <RouteIcon className="size-4" /> Itinéraire
              <span className="sr-only">(Google Maps, nouvel onglet)</span>
            </a>
            <a
              href={site.maps.place}
              target="_blank"
              rel="noopener noreferrer"
              className="label flex min-h-14 items-center justify-center gap-2 rounded-full border border-ivory/25 px-7 text-[0.64rem] transition-colors duration-500 hover:border-ivory"
            >
              Ouvrir dans Google Maps <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <dl className="mt-14 grid gap-8 border-t border-ivory/15 pt-8 sm:grid-cols-2 lg:mt-auto">
            <div>
              <dt className="label text-[0.58rem] text-ivory/70">Horaires</dt>
              {site.hours ? (
                <dd className="mt-3 space-y-1 text-[0.95rem]">
                  {site.hours.map((h) => (
                    <span key={h.days} className="flex justify-between gap-4">
                      <span className="text-ivory/70">{h.days}</span>
                      <span>{h.hours}</span>
                    </span>
                  ))}
                </dd>
              ) : (
                <dd className="mt-3 text-[0.92rem] leading-relaxed text-ivory/70">{location.hoursPending}</dd>
              )}
            </div>
            <div>
              <dt className="label text-[0.58rem] text-ivory/70">Instagram</dt>
              <dd className="mt-3">
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line inline-flex min-h-11 items-center gap-2 font-display text-[1.5rem] font-light"
                >
                  <InstagramIcon className="size-5 text-gold" />
                  {site.instagram.handle}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="aspect-square w-full sm:aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[38rem]">
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}
