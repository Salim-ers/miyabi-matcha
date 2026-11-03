import type { Metadata } from "next";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Cta } from "@/components/ui/Cta";
import { InstagramIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { contact } from "@/data/content";
import { photos } from "@/data/photos";
import { shareImage, site } from "@/data/site";

const description =
  "MIYABI MATCHA, 2 rue Joseph Sansboeuf, 75008 Paris, à deux pas de Saint-Lazare. Horaires, itinéraire, carte interactive et Instagram.";

export const metadata: Metadata = {
  title: "Nous Trouver : 2 rue Joseph Sansboeuf, Paris 8e",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: `Nous Trouver · ${site.name}`, description, images: [shareImage] },
};

export default function ContactPage() {
  return (
    <div data-surface="light" className="bg-ivory text-ink">
      <section className="container-x relative grid gap-8 pb-10 pt-[calc(var(--header-h)+1.25rem)] lg:min-h-[100svh] lg:grid-cols-12 lg:gap-6 lg:pb-14 lg:pt-[calc(var(--header-h)+1.5rem)]">
        <div className="flex flex-col lg:col-span-7">
          <h1 className="label text-smoke">{contact.title}</h1>
          <address className="mt-6 not-italic lg:mt-[7svh]">
            <RevealText as="p" className="display text-[clamp(3.2rem,8.6vw,11.5rem)] leading-[0.92]">
              <span className="block">2 rue Joseph</span>
              <span className="block italic">Sansboeuf</span>
            </RevealText>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="text-[1.0625rem] font-medium">
                {site.address.postalCode} {site.address.city}
              </span>
              <span className="text-[0.9375rem] text-smoke">{site.address.neighbourhood}</span>
            </p>
          </address>

          <div className="mt-8 flex flex-col items-start gap-3 lg:mt-12 lg:flex-row lg:items-center lg:gap-10">
            <Cta href={site.maps.directions} external>
              Itinéraire
            </Cta>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-2.5 text-[0.9375rem] font-medium">
              <InstagramIcon className="size-5" />
              <span className="hairline">{site.instagram.handle}</span>
            </a>
          </div>

          <dl className="mt-8 max-w-sm text-[0.9375rem] lg:mt-auto lg:pt-10">
            <dt className="label mb-3 text-[0.62rem] text-smoke">Horaires</dt>
            {site.hours.map((h) => (
              <dd key={h.days} className="flex justify-between gap-6 py-0.5">
                <span className="text-smoke">{h.days}</span>
                <span className="tabular-nums">{h.hours}</span>
              </dd>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <RevealImage variant="shoji" className="aspect-[1086/1166] w-full" zoom={1.12}>
            <Photo src={photos.tray.src} alt={photos.tray.alt} focus={photos.tray.focus} fill sizes="(min-width: 64rem) 42vw, 100vw" priority />
          </RevealImage>
        </div>
      </section>

      <section aria-label="Carte interactive" className="h-[72svh] min-h-[26rem] lg:h-[86svh]">
        <MapEmbed />
      </section>
    </div>
  );
}
