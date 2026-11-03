/**
 * La carte MIYABI MATCHA.
 *
 * Source : carte Uber Eats fournie (catégories, noms et noms japonais repris à l'identique).
 * Les descriptions reprennent uniquement le texte visible sur la carte source,
 * coupé avant les passages tronqués — rien n'a été ajouté.
 *
 * ⚠️ Volontairement AUCUN prix : les tarifs peuvent différer entre la livraison et la vente sur place.
 *
 * Pour mettre à jour la carte : modifier / ajouter des entrées ci-dessous.
 * Aucune modification de composant n'est nécessaire.
 */

export type MenuCategory = {
  id: string;
  label: string;
  /** Intitulé japonais tel qu'il figure sur la carte officielle. */
  labelJa?: string;
  order: number;
};

export type MenuProduct = {
  id: string;
  name: string;
  /** Nom japonais tel qu'il figure sur la carte officielle. */
  nameJa?: string;
  category: string;
  description?: string;
  /** Chemin d'une photo réelle du produit (voir src/data/images.ts). */
  image?: string;
  featured?: boolean;
  available?: boolean;
  order?: number;
};

export const menuCategories: MenuCategory[] = [
  { id: "matcha", label: "Matcha", labelJa: "宇治・福岡産の高級抹茶", order: 1 },
  { id: "crepes", label: "Crêpes japonaises au matcha", labelJa: "抹茶の和風クレープ", order: 2 },
  { id: "cafe", label: "Café", labelJa: "コーヒー", order: 3 },
  { id: "boba", label: "Boba", order: 4 },
  { id: "fruity-tea", label: "Fruity Tea", labelJa: "フルーティーティー", order: 5 },
];

export const menuProducts: MenuProduct[] = [
  // — MATCHA —
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    nameJa: "抹茶ラテ",
    category: "matcha",
    description: "Préparé avec un matcha Cérémonie d'exception, soigneusement fouetté.",
    featured: true,
    order: 1,
  },
  {
    id: "strawberry-matcha-cream",
    name: "Strawberry Matcha Cream",
    nameJa: "いちご抹茶クリーム",
    category: "matcha",
    description:
      "Un mélange délicat de matcha japonais et de purée de fraise, surmonté d'une crème légère et veloutée.",
    featured: true,
    order: 2,
  },
  {
    id: "matcha-yuzu-sparkling",
    name: "Matcha Yuzu Sparkling",
    nameJa: "抹茶ゆずスパークリング",
    category: "matcha",
    description: "Un mélange pétillant de matcha japonais d'exception et de yuzu frais.",
    order: 3,
  },
  {
    id: "hojicha-soy-cream",
    name: "Hojicha Soy Cream",
    nameJa: "ほうじ茶ソイクリーム",
    category: "matcha",
    description:
      "Un mélange délicat de hojicha japonais, infusé et mélangé à du lait de soja velouté, surmonté d'une crème légère.",
    order: 4,
  },
  {
    id: "matcha-coconut-cloud",
    name: "Matcha Coconut Cloud",
    nameJa: "抹茶ココナッツクラウド",
    category: "matcha",
    description:
      "Un latte aérien : matcha japonais d'exception et lait de coco onctueux, surmonté d'une mousse légère.",
    order: 5,
  },
  {
    id: "matcha-latte-mangue",
    name: "Matcha Latte Mangue",
    nameJa: "抹茶マンゴーラテ",
    category: "matcha",
    description:
      "Un latte raffiné combinant matcha japonais d'exception et purée de mangue juteuse, surmonté d'une crème veloutée.",
    order: 6,
  },
  {
    id: "jasmine-matcha-mochi",
    name: "Jasmine Matcha Mochi",
    nameJa: "ジャスミン抹茶もち",
    category: "matcha",
    description:
      "Un latte unique combinant le matcha japonais d'exception et la délicatesse du thé jasmin, accompagné de mochi moelleux.",
    order: 7,
  },
  {
    id: "pistache-latte-matcha",
    name: "Pistache Latte Matcha",
    nameJa: "ピスタチオ抹茶ラテ",
    category: "matcha",
    description: "Un mariage raffiné entre le matcha japonais et la douceur de la pistache.",
    order: 8,
  },

  // — CRÊPES JAPONAISES AU MATCHA —
  {
    id: "crepe-classic",
    name: "Crêpe Matcha Japonais Classic",
    nameJa: "クラシック抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère.",
    order: 1,
  },
  {
    id: "crepe-forest-fruit",
    name: "Crêpe Matcha Japonais Forest Fruit",
    nameJa: "森のフルーツ抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de fruits rouges.",
    image: "/images/products/crepe-forest-fruit.jpg",
    featured: true,
    order: 2,
  },
  {
    id: "crepe-strawberry",
    name: "Crêpe Matcha Japonais Strawberry",
    nameJa: "いちご抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de fraises fraîches.",
    order: 3,
  },
  {
    id: "crepe-creme-brulee",
    name: "Crêpe Crème Brûlée",
    nameJa: "クレームブリュレクレープ",
    category: "crepes",
    description: "Une crème riche et veloutée, surmontée d'une fine couche de caramel croquant.",
    order: 4,
  },
  {
    id: "crepe-lotus-speculoos",
    name: "Crêpe Matcha Japonais Lotus Speculoos",
    nameJa: "ロータススペキュロスクレープ抹茶和風",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de biscuits Lotus.",
    order: 5,
  },

  // — CAFÉ —
  {
    id: "white-vienna",
    name: "White Vienna",
    nameJa: "ホワイトウィーン",
    category: "cafe",
    description:
      "Inspiré des cafés de Kyoto : un espresso doux issu de grains japonais, marié à une crème blanche.",
    order: 1,
  },
  {
    id: "black-sesame-vienna",
    name: "Black Sesame Vienna",
    nameJa: "黒ごまウィンナーコーヒー",
    category: "cafe",
    description:
      "Une création signée Miyabi Matcha : espresso japonais onctueux, relevé par la richesse du sésame noir.",
    order: 2,
  },
  {
    id: "camelot-caramel-latte",
    name: "Camelot Caramel Latte",
    nameJa: "キャメロットキャラメルラテ",
    category: "cafe",
    description: "Entre la noblesse du caramel doré et la profondeur du café japonais.",
    image: "/images/products/camelot-caramel-latte.jpg",
    featured: true,
    order: 3,
  },
  {
    id: "latte",
    name: "Latte",
    nameJa: "ラテ",
    category: "cafe",
    description: "Une boisson à base d'espresso, douce et crémeuse.",
    image: "/images/products/latte.jpg",
    order: 4,
  },
  {
    id: "americano",
    name: "Americano",
    nameJa: "アメリカーノ",
    category: "cafe",
    description: "Un Americano classique : espresso allongé d'eau chaude.",
    image: "/images/products/americano.jpg",
    order: 5,
  },

  // — BOBA —
  {
    id: "thai-milk-tea",
    name: "Thai Milk Tea",
    nameJa: "タイミルクティー",
    category: "boba",
    description: "Un classique thaï, doux et crémeux : thé noir corsé et lait.",
    image: "/images/products/thai-milk-tea-iced-smoothie.jpg",
    order: 1,
  },
  {
    id: "brown-sugar-boba-milk",
    name: "Brown Sugar Boba Milk",
    nameJa: "黒糖タピオカミルクティー",
    category: "boba",
    description: "Sirop de sucre brun, perles de tapioca moelleuses et lait frais.",
    order: 2,
  },
  {
    id: "brown-sugar-milk-tea",
    name: "Brown Sugar Milk Tea",
    nameJa: "黒糖ミルクティー",
    category: "boba",
    description: "Thé au lait doux et crémeux, au sucre brun caramélisé.",
    order: 3,
  },
  {
    id: "black-sesame-mochi-cream",
    name: "Black Sesame Mochi Cream",
    nameJa: "黒ごまもちクリーム",
    category: "boba",
    description: "Mochi moelleux et crème riche au sésame noir.",
    order: 4,
  },
  {
    id: "jasmine-milk-tea",
    name: "Jasmine Milk Tea",
    nameJa: "ジャスミンミルクティー",
    category: "boba",
    description:
      "Thé au jasmin délicatement infusé, mélangé à du lait crémeux. À savourer chaud ou glacé.",
    order: 5,
  },

  // — FRUITY TEA —
  {
    id: "various-berry-black-tea",
    name: "Various Berry Black Tea",
    nameJa: "ベリーミックス紅茶",
    category: "fruity-tea",
    description: "Un thé noir délicat, infusé avec un mélange de baies rouges fraîches et acidulées.",
    order: 1,
  },
  {
    id: "passionfruit-sparkling",
    name: "Passionfruit Sparkling",
    nameJa: "パッションフルーツスパークリング",
    category: "fruity-tea",
    description: "Un mélange pétillant de jus de fruit de la passion frais et d'eau gazeuse.",
    order: 2,
  },
];

/** Catégories triées, avec leurs produits disponibles triés. Les catégories vides sont masquées. */
export function getMenu() {
  return [...menuCategories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      ...category,
      products: menuProducts
        .filter((p) => p.category === category.id && p.available !== false)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    }))
    .filter((c) => c.products.length > 0);
}
