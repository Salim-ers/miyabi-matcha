import { photos, type ArtPhoto } from "./photos";

/**
 * Créations mises en scène sur /creations. Aucun prix.
 * Règle du site : une photographie n'apparaît qu'une seule fois (répartition et exceptions dans docs/AUDIT-PHOTOS.md).
 * Les descriptions reprennent le texte de la carte source.
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
