import { photos, type ArtPhoto } from "./photos";

/**
 * La carte MIYABI MATCHA.
 *
 * Source : carte Uber Eats fournie (catégories, noms et noms japonais repris à l'identique).
 * `description` reprend le texte visible sur la carte source. `short` en est un raccourci d'une ligne,
 * composé uniquement de mots déjà présents dans cette description : rien n'est ajouté.
 *
 * ⚠️ Volontairement AUCUN prix : les tarifs peuvent différer entre la livraison et la vente sur place.
 *
 * Pour mettre à jour la carte : modifier ou ajouter des entrées ci-dessous.
 * Aucune modification de composant n'est nécessaire.
 */

export type MenuCategory = {
  id: string;
  /** Intitulé complet (titre et référencement). */
  label: string;
  /** Intitulé court (navigation par catégories). */
  short: string;
  /** Intitulé le plus court, pour les petits écrans. */
  tab?: string;
  /** Intitulé japonais tel qu'il figure sur la carte officielle. */
  labelJa?: string;
  order: number;
  /** Photographie d'ambiance de la catégorie (matière ou geste, jamais un autre produit de la carte). */
  scene: ArtPhoto;
  /** Teinte du papier pour les références sans photographie. */
  paper: string;
};

export type MenuProduct = {
  id: string;
  name: string;
  /** Nom japonais tel qu'il figure sur la carte officielle. */
  nameJa?: string;
  category: string;
  description?: string;
  /** Une seule ligne, issue de `description`. */
  short?: string;
  /** Photo réelle du produit. Sans photo, le nom japonais tient lieu de visuel : aucune image n'est inventée. */
  photo?: ArtPhoto;
  available?: boolean;
  order?: number;
};

export const menuCategories: MenuCategory[] = [
  { id: "matcha", label: "Matcha", short: "Matcha", labelJa: "宇治・福岡産の高級抹茶", order: 1, scene: photos.whisked, paper: "#E4E8D9" },
  { id: "crepes", label: "Crêpes japonaises au matcha", short: "Crêpes japonaises", tab: "Crêpes", labelJa: "抹茶の和風クレープ", order: 2, scene: photos.crepeLift, paper: "#E9E9D6" },
  { id: "cafe", label: "Café", short: "Café", labelJa: "コーヒー", order: 3, scene: photos.camelot, paper: "#EADFD0" },
  { id: "boba", label: "Boba", short: "Boba", order: 4, scene: photos.brownSugar, paper: "#EDE3D3" },
  { id: "fruity-tea", label: "Fruity Tea", short: "Fruity Tea", labelJa: "フルーティーティー", order: 5, scene: photos.leaves, paper: "#EFE6DB" },
];

export const menuProducts: MenuProduct[] = [
  // MATCHA
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    nameJa: "抹茶ラテ",
    category: "matcha",
    description: "Préparé avec un matcha Cérémonie d'exception, soigneusement fouetté.",
    short: "Matcha Cérémonie d'exception, soigneusement fouetté.",
    photo: photos.cupHand,
    order: 1,
  },
  {
    id: "strawberry-matcha-cream",
    name: "Strawberry Matcha Cream",
    nameJa: "いちご抹茶クリーム",
    category: "matcha",
    description:
      "Un mélange délicat de matcha japonais et de purée de fraise, surmonté d'une crème légère et veloutée.",
    short: "Matcha japonais, purée de fraise, crème légère.",
    photo: photos.splash,
    order: 2,
  },
  {
    id: "matcha-yuzu-sparkling",
    name: "Matcha Yuzu Sparkling",
    nameJa: "抹茶ゆずスパークリング",
    category: "matcha",
    description: "Un mélange pétillant de matcha japonais d'exception et de yuzu frais.",
    short: "Matcha japonais et yuzu frais, pétillant.",
    order: 3,
  },
  {
    id: "hojicha-soy-cream",
    name: "Hojicha Soy Cream",
    nameJa: "ほうじ茶ソイクリーム",
    category: "matcha",
    description:
      "Un mélange délicat de hojicha japonais, infusé et mélangé à du lait de soja velouté, surmonté d'une crème légère.",
    short: "Hojicha japonais, lait de soja, crème légère.",
    order: 4,
  },
  {
    id: "matcha-coconut-cloud",
    name: "Matcha Coconut Cloud",
    nameJa: "抹茶ココナッツクラウド",
    category: "matcha",
    description:
      "Un latte aérien : matcha japonais d'exception et lait de coco onctueux, surmonté d'une mousse légère.",
    short: "Matcha japonais, lait de coco, mousse légère.",
    order: 5,
  },
  {
    id: "matcha-latte-mangue",
    name: "Matcha Latte Mangue",
    nameJa: "抹茶マンゴーラテ",
    category: "matcha",
    description:
      "Un latte raffiné combinant matcha japonais d'exception et purée de mangue juteuse, surmonté d'une crème veloutée.",
    short: "Matcha japonais, purée de mangue, crème veloutée.",
    order: 6,
  },
  {
    id: "jasmine-matcha-mochi",
    name: "Jasmine Matcha Mochi",
    nameJa: "ジャスミン抹茶もち",
    category: "matcha",
    description:
      "Un latte unique combinant le matcha japonais d'exception et la délicatesse du thé jasmin, accompagné de mochi moelleux.",
    short: "Matcha japonais, thé jasmin, mochi moelleux.",
    order: 7,
  },
  {
    id: "pistache-latte-matcha",
    name: "Pistache Latte Matcha",
    nameJa: "ピスタチオ抹茶ラテ",
    category: "matcha",
    description: "Un mariage raffiné entre le matcha japonais et la douceur de la pistache.",
    short: "Matcha japonais et douceur de la pistache.",
    order: 8,
  },

  // CRÊPES JAPONAISES AU MATCHA
  {
    id: "crepe-classic",
    name: "Crêpe Matcha Japonais Classic",
    nameJa: "クラシック抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère.",
    short: "Crêpe fine au matcha japonais, crème légère.",
    order: 1,
  },
  {
    id: "crepe-forest-fruit",
    name: "Crêpe Matcha Japonais Forest Fruit",
    nameJa: "森のフルーツ抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de fruits rouges.",
    short: "Crêpe fine au matcha, crème légère, fruits rouges.",
    photo: photos.crepeForest,
    order: 2,
  },
  {
    id: "crepe-strawberry",
    name: "Crêpe Matcha Japonais Strawberry",
    nameJa: "いちご抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de fraises fraîches.",
    short: "Crêpe fine au matcha, crème légère, fraises fraîches.",
    order: 3,
  },
  {
    id: "crepe-creme-brulee",
    name: "Crêpe Crème Brûlée",
    nameJa: "クレームブリュレクレープ",
    category: "crepes",
    description: "Une crème riche et veloutée, surmontée d'une fine couche de caramel croquant.",
    short: "Crème veloutée, fine couche de caramel croquant.",
    order: 4,
  },
  {
    id: "crepe-lotus-speculoos",
    name: "Crêpe Matcha Japonais Lotus Speculoos",
    nameJa: "ロータススペキュロスクレープ抹茶和風",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de biscuits Lotus.",
    short: "Crêpe fine au matcha, crème légère, biscuits Lotus.",
    order: 5,
  },

  // CAFÉ
  {
    id: "white-vienna",
    name: "White Vienna",
    nameJa: "ホワイトウィーン",
    category: "cafe",
    description:
      "Inspiré des cafés de Kyoto : un espresso doux issu de grains japonais, marié à une crème blanche.",
    short: "Espresso doux de grains japonais, crème blanche.",
    order: 1,
  },
  {
    id: "black-sesame-vienna",
    name: "Black Sesame Vienna",
    nameJa: "黒ごまウィンナーコーヒー",
    category: "cafe",
    description:
      "Une création signée Miyabi Matcha : espresso japonais onctueux, relevé par la richesse du sésame noir.",
    short: "Espresso japonais, richesse du sésame noir.",
    order: 2,
  },
  {
    id: "camelot-caramel-latte",
    name: "Camelot Caramel Latte",
    nameJa: "キャメロットキャラメルラテ",
    category: "cafe",
    description: "Entre la noblesse du caramel doré et la profondeur du café japonais.",
    short: "Caramel doré et profondeur du café japonais.",
    photo: photos.camelot,
    order: 3,
  },
  {
    id: "latte",
    name: "Latte",
    nameJa: "ラテ",
    category: "cafe",
    description: "Une boisson à base d'espresso, douce et crémeuse.",
    short: "À base d'espresso, douce et crémeuse.",
    photo: photos.latte,
    order: 4,
  },
  {
    id: "americano",
    name: "Americano",
    nameJa: "アメリカーノ",
    category: "cafe",
    description: "Un Americano classique : espresso allongé d'eau chaude.",
    short: "Espresso allongé d'eau chaude.",
    photo: photos.americano,
    order: 5,
  },

  // BOBA
  {
    id: "thai-milk-tea",
    name: "Thai Milk Tea",
    nameJa: "タイミルクティー",
    category: "boba",
    description: "Un classique thaï, doux et crémeux : thé noir corsé et lait.",
    short: "Thé noir corsé et lait, doux et crémeux.",
    photo: photos.thai,
    order: 1,
  },
  {
    id: "brown-sugar-boba-milk",
    name: "Brown Sugar Boba Milk",
    nameJa: "黒糖タピオカミルクティー",
    category: "boba",
    description: "Sirop de sucre brun, perles de tapioca moelleuses et lait frais.",
    short: "Sucre brun, perles de tapioca, lait frais.",
    order: 2,
  },
  {
    id: "brown-sugar-milk-tea",
    name: "Brown Sugar Milk Tea",
    nameJa: "黒糖ミルクティー",
    category: "boba",
    description: "Thé au lait doux et crémeux, au sucre brun caramélisé.",
    short: "Thé au lait, sucre brun caramélisé.",
    order: 3,
  },
  {
    id: "black-sesame-mochi-cream",
    name: "Black Sesame Mochi Cream",
    nameJa: "黒ごまもちクリーム",
    category: "boba",
    description: "Mochi moelleux et crème riche au sésame noir.",
    short: "Mochi moelleux, crème au sésame noir.",
    order: 4,
  },
  {
    id: "jasmine-milk-tea",
    name: "Jasmine Milk Tea",
    nameJa: "ジャスミンミルクティー",
    category: "boba",
    description:
      "Thé au jasmin délicatement infusé, mélangé à du lait crémeux. À savourer chaud ou glacé.",
    short: "Thé au jasmin et lait crémeux, chaud ou glacé.",
    order: 5,
  },

  // FRUITY TEA
  {
    id: "various-berry-black-tea",
    name: "Various Berry Black Tea",
    nameJa: "ベリーミックス紅茶",
    category: "fruity-tea",
    description: "Un thé noir délicat, infusé avec un mélange de baies rouges fraîches et acidulées.",
    short: "Thé noir délicat, baies rouges fraîches.",
    order: 1,
  },
  {
    id: "passionfruit-sparkling",
    name: "Passionfruit Sparkling",
    nameJa: "パッションフルーツスパークリング",
    category: "fruity-tea",
    description: "Un mélange pétillant de jus de fruit de la passion frais et d'eau gazeuse.",
    short: "Jus de fruit de la passion frais, eau gazeuse.",
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

export type MenuSection = ReturnType<typeof getMenu>[number];
