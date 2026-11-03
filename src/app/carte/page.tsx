import type { Metadata } from "next";
import { CarteClient } from "@/components/carte/CarteClient";
import { getMenu } from "@/data/menu";
import { shareImage, site } from "@/data/site";

const description =
  "La carte MIYABI MATCHA à Paris 8e : matcha latte, boissons au matcha, crêpes japonaises au matcha, café japonais, boba et thés fruités.";

export const metadata: Metadata = {
  title: "La Carte : matcha, crêpes japonaises, café & boba",
  description,
  alternates: { canonical: "/carte" },
  openGraph: { url: "/carte", title: `La Carte · ${site.name}`, description, images: [shareImage] },
};

export default function CartePage() {
  const menu = getMenu();
  /** Données structurées de la carte : noms et descriptions réels ; le prix seulement s'il est renseigné. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `La Carte ${site.name}`,
    url: `${site.url}/carte`,
    inLanguage: "fr",
    hasMenuSection: menu.map((c) => ({
      "@type": "MenuSection",
      name: c.label,
      hasMenuItem: c.products.map((p) => ({
        "@type": "MenuItem",
        name: p.name,
        ...(p.description ? { description: p.description } : {}),
        ...(p.photo ? { image: `${site.url}${p.photo.src}` } : {}),
        ...(p.price != null ? { offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: "EUR" } } : {}),
      })),
    })),
  };
  return (
    <section data-surface="light">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CarteClient menu={menu} />
    </section>
  );
}
