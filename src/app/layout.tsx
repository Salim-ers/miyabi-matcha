import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/shell/Footer";
import { Header } from "@/components/shell/Header";
import { PageTransition } from "@/components/shell/PageTransition";
import { Preloader } from "@/components/shell/Preloader";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { seo, site } from "@/data/site";
import { stageBootScript } from "@/lib/stage";

/** Police éditoriale : Bodoni Moda, à axe optique (les déliés s'affinent quand le corps grandit). */
const display = localFont({
  src: [
    { path: "../fonts/bodoni-moda-latin-standard-normal.woff2", weight: "400 900", style: "normal" },
    { path: "../fonts/bodoni-moda-latin-standard-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--ff-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Times New Roman", "serif"],
});

const sans = localFont({
  src: [
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
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: seo.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Données structurées : uniquement des informations confirmées (pas d'horaires, de note ni d'avis). */
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
    <html lang="fr" className={`${display.variable} ${sans.variable} ${japanese.variable}`} data-surface="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: stageBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <SmoothScroll>
          <PageTransition>
            <Preloader />
            <Header />
            <main id="contenu" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
