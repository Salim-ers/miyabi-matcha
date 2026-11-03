/**
 * Créations signature — section « Nos créations ».
 * Uniquement des produits réellement photographiés. Aucun prix affiché.
 * Pour ajouter une création : ajouter une entrée avec une photo réelle (fond sombre de préférence).
 */

export type Signature = {
  id: string;
  name: string;
  /** Découpage du nom pour la typographie monumentale (1 à 3 lignes). */
  lines: string[];
  nameJa?: string;
  kind: string;
  description?: string;
  image: string;
  /** Ajustement du cadrage sur mobile (object-position). */
  focus?: string;
  /** Teinte d'ambiance (fond) et accent, dérivés de la photo. */
  tint: string;
  accent: string;
};

export const signatures: Signature[] = [
  {
    id: "matcha-tornado",
    name: "Matcha Tornado",
    lines: ["Matcha", "Tornado"],
    kind: "Matcha · Iced",
    image: "/images/products/matcha-tornado.jpg",
    tint: "#17301a",
    accent: "#9cbf5a",
  },
  {
    id: "crepe-forest-fruit",
    name: "Crêpe Forest Fruit",
    lines: ["Crêpe", "Forest Fruit"],
    nameJa: "森のフルーツ抹茶和風クレープ",
    kind: "Crêpe japonaise au matcha",
    description: "Crêpe fine et moelleuse au matcha japonais, crème légère et fruits rouges.",
    image: "/images/products/crepe-forest-fruit.jpg",
    tint: "#2e1419",
    accent: "#d0435a",
  },
  {
    id: "camelot-caramel-latte",
    name: "Camelot Caramel Latte",
    lines: ["Camelot", "Caramel Latte"],
    nameJa: "キャメロットキャラメルラテ",
    kind: "Café japonais",
    description: "Entre la noblesse du caramel doré et la profondeur du café japonais.",
    image: "/images/products/camelot-caramel-latte.jpg",
    tint: "#2f2010",
    accent: "#d29a5a",
  },
  {
    id: "thai-milk-tea-iced-smoothie",
    name: "Thai Milk Tea Iced Smoothie",
    lines: ["Thai Milk Tea", "Iced Smoothie"],
    kind: "Boba · Iced",
    image: "/images/products/thai-milk-tea-iced-smoothie.jpg",
    tint: "#33190a",
    accent: "#e58c3f",
  },
  {
    id: "brown-sugar-coffee-iced-smoothie",
    name: "Brown Sugar Coffee Iced Smoothie",
    lines: ["Brown Sugar", "Coffee", "Iced Smoothie"],
    kind: "Café · Iced",
    image: "/images/products/brown-sugar-coffee-iced-smoothie.jpg",
    tint: "#2b1d13",
    accent: "#c4915e",
  },
  {
    id: "latte",
    name: "Latte",
    lines: ["Latte"],
    nameJa: "ラテ",
    kind: "Café japonais",
    description: "Une boisson à base d'espresso, douce et crémeuse.",
    image: "/images/products/latte.jpg",
    tint: "#251c15",
    accent: "#dcbb92",
  },
  {
    id: "americano",
    name: "Americano",
    lines: ["Americano"],
    nameJa: "アメリカーノ",
    kind: "Café japonais",
    description: "Un Americano classique : espresso allongé d'eau chaude.",
    image: "/images/products/americano.jpg",
    tint: "#27150a",
    accent: "#c26a2e",
  },
];
