import { photos, type ArtPhoto } from "./photos";

/**
 * Créations signature : uniquement des produits réellement photographiés. Aucun prix.
 * Les descriptions reprennent le texte de la carte source ; sans description fiable, aucune n'est affichée.
 */

export type Signature = {
  id: string;
  name: string;
  /** Découpage du nom pour la typographie monumentale. */
  lines: string[];
  nameJa?: string;
  kind: string;
  description?: string;
  photo: ArtPhoto;
  /** Teinte d'ambiance de la scène : très sombre, pour se fondre dans le noir du studio. */
  tint: string;
};

export const signatures: Signature[] = [
  {
    id: "matcha-tornado",
    name: "Matcha Tornado",
    lines: ["Matcha", "Tornado"],
    kind: "Matcha",
    photo: photos.tornado,
    tint: "#070903",
  },
  {
    id: "crepe-forest-fruit",
    name: "Crêpe Forest Fruit",
    lines: ["Crêpe", "Forest Fruit"],
    nameJa: "森のフルーツ抹茶和風クレープ",
    kind: "Crêpe japonaise au matcha",
    description: "Crêpe fine et moelleuse au matcha japonais, crème légère et fruits rouges.",
    photo: photos.crepeForest,
    tint: "#0d0709",
  },
  {
    id: "strawberry-matcha",
    name: "Strawberry Matcha",
    lines: ["Strawberry", "Matcha"],
    nameJa: "いちご抹茶",
    kind: "Matcha",
    description: "Matcha japonais et purée de fraise.",
    photo: photos.splash,
    tint: "#0e0706",
  },
  {
    id: "camelot-caramel-latte",
    name: "Camelot Caramel Latte",
    lines: ["Camelot", "Caramel", "Latte"],
    nameJa: "キャメロットキャラメルラテ",
    kind: "Café japonais",
    description: "Entre la noblesse du caramel doré et la profondeur du café japonais.",
    photo: photos.camelot,
    tint: "#0d0905",
  },
  {
    id: "thai-milk-tea-iced-smoothie",
    name: "Thai Milk Tea Iced Smoothie",
    lines: ["Thai Milk Tea", "Iced Smoothie"],
    kind: "Boba",
    photo: photos.thai,
    tint: "#0c0805",
  },
  {
    id: "brown-sugar-coffee-iced-smoothie",
    name: "Brown Sugar Coffee Iced Smoothie",
    lines: ["Brown Sugar Coffee", "Iced Smoothie"],
    kind: "Café",
    photo: photos.brownSugar,
    tint: "#0c0805",
  },
  {
    id: "latte",
    name: "Latte",
    lines: ["Latte"],
    nameJa: "ラテ",
    kind: "Café japonais",
    description: "Une boisson à base d'espresso, douce et crémeuse.",
    photo: photos.latte,
    tint: "#090806",
  },
  {
    id: "americano",
    name: "Americano",
    lines: ["Americano"],
    nameJa: "アメリカーノ",
    kind: "Café japonais",
    description: "Un Americano classique : espresso allongé d'eau chaude.",
    photo: photos.americano,
    tint: "#090806",
  },
];

export const signature = (id: string): Signature => {
  const found = signatures.find((s) => s.id === id);
  if (!found) throw new Error(`Création inconnue : ${id}`);
  return found;
};
