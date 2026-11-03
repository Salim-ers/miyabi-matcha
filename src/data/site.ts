/**
 * Configuration centrale du site MIYABI MATCHA.
 * Coordonnées, liens et navigation. Aucune information non vérifiée ici.
 */

const ADDRESS_QUERY = "2 Rue Joseph Sansboeuf, 75008 Paris";

export const site = {
  name: "MIYABI MATCHA",
  shortName: "MIYABI",
  /** URL de production, à définir via NEXT_PUBLIC_SITE_URL sur Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://miyabi-matcha.vercel.app",
  locale: "fr_FR",
  tagline: "The Art of Matcha",
  description:
    "MIYABI MATCHA, maison du matcha à Paris 8e : boissons au matcha, café japonais, boba et crêpes japonaises au matcha, à deux pas de Saint-Lazare.",

  address: {
    street: "2 rue Joseph Sansboeuf",
    postalCode: "75008",
    city: "Paris",
    country: "FR",
    neighbourhood: "Paris 8e · Saint-Lazare",
  },

  instagram: {
    handle: "@miyabi_matcha_paris",
    url: "https://www.instagram.com/miyabi_matcha_paris/",
  },

  maps: {
    /** Itinéraire Google Maps (ouvre l'application sur mobile). */
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`,
    /** Fiche / recherche Google Maps. */
    place: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`,
    /** Carte intégrée (iframe, sans clé API). Chargée uniquement après consentement. */
    embed: `https://www.google.com/maps?q=${encodeURIComponent(`MIYABI MATCHA, ${ADDRESS_QUERY}`)}&z=17&output=embed`,
  },

  /**
   * Horaires d'ouverture : fiche Google et bio Instagram concordantes (novembre 2026).
   * `schema` alimente les données structurées.
   */
  hours: [
    { days: "Lundi – Vendredi", hours: "12:00 – 20:00", schema: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "12:00", closes: "20:00" } },
    { days: "Samedi – Dimanche", hours: "13:00 – 20:00", schema: { days: ["Saturday", "Sunday"], opens: "13:00", closes: "20:00" } },
  ],
} as const;

export type NavItem = { id: string; label: string; short: string; href: string };

/** Navigation principale : chaque entrée est une véritable page. */
export const navigation: NavItem[] = [
  { id: "carte", label: "La Carte", short: "Carte", href: "/carte" },
  { id: "creations", label: "Nos Créations", short: "Créations", href: "/creations" },
  { id: "maison", label: "Notre Maison", short: "Maison", href: "/maison" },
  { id: "contact", label: "Nous Trouver", short: "Nous trouver", href: "/contact" },
];

/** Image de partage, à répéter dans chaque page qui définit son propre `openGraph`. */
export const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "MIYABI MATCHA : logo 雅 et Matcha Tornado sur fond noir",
};

export const seo = {
  title: "MIYABI MATCHA, Matcha, café japonais & crêpes au matcha · Paris 8e",
  keywords: [
    "Miyabi Matcha Paris",
    "Matcha Paris 8",
    "Café matcha Saint-Lazare",
    "Crêpes matcha Paris",
    "Café japonais Paris",
    "Matcha et desserts japonais Paris",
  ],
};
