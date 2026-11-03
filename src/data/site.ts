/**
 * Configuration centrale du site MIYABI MATCHA.
 * Tous les textes, liens et informations pratiques modifiables sont ici.
 */

const ADDRESS_QUERY = "2 Rue Joseph Sansboeuf, 75008 Paris";

export const site = {
  name: "MIYABI MATCHA",
  shortName: "MIYABI",
  /** URL de production — à définir via NEXT_PUBLIC_SITE_URL sur Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://miyabi-matcha.vercel.app",
  locale: "fr_FR",
  tagline: "The Art of Matcha",
  subtitle: "L'élégance japonaise, à savourer à Paris.",
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
   * Horaires d'ouverture — à renseigner une fois validés.
   * Laisser `null` tant que les horaires ne sont pas confirmés :
   * le site affiche alors un message neutre (jamais « ouvert actuellement »).
   * Exemple : [{ days: "Lundi – Dimanche", hours: "12:00 – 20:00" }]
   */
  hours: null as null | { days: string; hours: string }[],
} as const;

export type NavItem = { id: string; label: string; href: string };

/** Navigation principale — l'ordre suit celui de la page. */
export const navigation: NavItem[] = [
  { id: "accueil", label: "Accueil", href: "/#accueil" },
  { id: "art", label: "L'art du matcha", href: "/#art" },
  { id: "creations", label: "Nos créations", href: "/#creations" },
  { id: "univers", label: "Notre univers", href: "/#univers" },
  { id: "carte", label: "La carte", href: "/#carte" },
  { id: "visite", label: "Nous trouver", href: "/#visite" },
];

export const seo = {
  title: "MIYABI MATCHA — Matcha, café japonais & crêpes au matcha · Paris 8e",
  keywords: [
    "Miyabi Matcha Paris",
    "Matcha Paris 8",
    "Café matcha Saint-Lazare",
    "Crêpes matcha Paris",
    "Café japonais Paris",
    "Matcha et desserts japonais Paris",
  ],
};
