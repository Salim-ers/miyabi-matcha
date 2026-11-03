import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/footer/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/loader/Preloader";
import { SiteChrome } from "@/components/navigation/SiteChrome";
import { seo, site } from "@/data/site";
import { introBootScript } from "@/lib/intro";

const display = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--ff-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: [
    { path: "../fonts/manrope-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/manrope-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/manrope-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/manrope-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--ff-sans",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

/** Police japonaise réduite aux caractères utilisés (voir scripts/subset-jp-font.py). */
const japanese = localFont({
  src: "../fonts/shippori-mincho-500-subset.woff2",
  weight: "500",
  variable: "--ff-jp",
  display: "swap",
  preload: false,
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: seo.keywords,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: seo.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#101510",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Données structurées — uniquement des informations confirmées (pas d'horaires, de note ni d'avis). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "@id": `${site.url}/#cafe`,
  name: site.name,
  url: site.url,
  image: `${site.url}/opengraph-image.jpg`,
  logo: `${site.url}/logos/miyabi-full.svg`,
  description: site.description,
  servesCuisine: ["Matcha", "Café japonais", "Crêpes japonaises", "Boba"],
  hasMenu: `${site.url}/carte`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressCountry: site.address.country,
  },
  sameAs: [site.instagram.url],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${japanese.variable}`} data-surface="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <SmoothScroll>
          <Preloader />
          <SiteChrome />
          <main id="contenu" className="lg:pl-[var(--rail)]">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
