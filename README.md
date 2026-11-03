# MIYABI MATCHA, The Art of Matcha

Site de MIYABI MATCHA, 2 rue Joseph Sansboeuf, 75008 Paris.
Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 4 · GSAP 3.13 + ScrollTrigger + SplitText · Lenis.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 20.9 ou plus récent.

## Déployer sur Vercel

1. Pousser le dossier sur GitHub, puis l'importer dans Vercel (le framework est détecté automatiquement).
2. Définir `NEXT_PUBLIC_SITE_URL` avec l'URL finale (par exemple `https://miyabimatcha.fr`). Elle sert aux balises canoniques, à Open Graph, au sitemap et aux données structurées.

## Les pages

| Route | Rôle | Mise en scène |
| --- | --- | --- |
| `/` | Accueil, court et spectaculaire | Couverture de magazine dans une alcôve noire, paravent 3D, rouleau photographique, deux portes typographiques |
| `/carte` | Consultation rapide | Onglets, grands formats avec le titre japonais à droite de la photo, fiches de papier, 25 produits alignés |
| `/creations` | Émerveiller | Galerie sur le noir du studio, une mise en scène par création |
| `/maison` | Univers et gestes | Trois séquences photographiques, presque sans texte |
| `/contact` | Venir | Adresse, horaires, itinéraire, Google Maps, Instagram |

## Modifier le contenu (sans toucher aux composants)

| Quoi | Fichier |
| --- | --- |
| Adresse, Instagram, liens Google Maps, **horaires**, navigation, SEO | `src/data/site.ts` |
| **La carte** (catégories, produits, descriptions, photos) | `src/data/menu.ts` |
| Créations signature | `src/data/products.ts` |
| Textes éditoriaux | `src/data/content.ts` |
| Photographies : fichier, description, point focal | `src/data/photos.ts` |

- **Horaires** : `hours` dans `src/data/site.ts`, source : fiche Google et bio Instagram. Ils alimentent aussi la page Contact, le pied de page et les données structurées.
- **Prix** : champ `price` de chaque produit dans `src/data/menu.ts` (en euros, ex. `price: 6.5`). Il s'affiche seul dès qu'il est renseigné, et la mention « Tarifs en boutique » disparaît. À reprendre de la carte de la boutique, pas d'Uber Eats, dont les tarifs diffèrent.
- **Masquer un produit** : `available: false`.
- **Description d'une ligne** : `short`, à composer uniquement avec les mots de `description`.

## Ajouter ou remplacer une photo

1. Déposer le fichier dans `public/images/<dossier>/`.
2. Lancer `npm run images:manifest`. Le script régénère `src/data/images.ts` avec les dimensions réelles et le flou de chargement.
3. Déclarer la photo dans `src/data/photos.ts` avec son point focal, puis l'utiliser dans `menu.ts` ou `products.ts`.

**Règle du site : chaque photo n'apparaît qu'une seule fois.** La répartition est dans [docs/AUDIT-PHOTOS.md](docs/AUDIT-PHOTOS.md).

Les images passent par `next/image`, qui sert de l'AVIF ou du WebP à la taille de l'écran. Next n'agrandit jamais une image au-delà de sa taille d'origine.

**Si la photo du Hero change**, relancer `npm run images:depth` : le script recrée la couche où la crème passe devant le titre. Il repose sur un fond sombre derrière le produit. Vérifier ensuite le bord de la découpe. Si le cadrage change, ajuster le ratio et les variables `--ph-max` et `--mast-y` de `.hero` dans `globals.css`.

## Police japonaise

`src/fonts/shippori-mincho-500-subset.woff2` ne contient que les caractères utilisés, plus tous les kana. Si vous ajoutez des noms en kanji, relancez :

```bash
pip install fonttools brotli
python scripts/subset-jp-font.py ShipporiMincho-Medium.ttf
```

Les caractères absents s'affichent dans la police mincho du système.

## Points à valider

- **Résolution des photos** : les photos de produits font de 774 à 864 px de large. Elles restent belles jusqu'au 1440p, mais sont un peu douces sur un écran 4K. Pour un rendu natif, remplacer les fichiers par des exports haute définition de même cadrage, puis relancer `npm run images:manifest`.
- **Prix** : à renseigner depuis une photo nette de la carte de la boutique.
- **Associations photo / produit** à confirmer par la boutique : `matcha-cup-hand` illustre le Matcha Latte, `strawberry-splash` le Strawberry Matcha, et la photo « Thai Milk Tea Iced Smoothie » l'article Thai Milk Tea.
- **Produits photographiés mais absents de la carte source** : Matcha Tornado (accueil) et Brown Sugar Coffee Iced Smoothie (paravent de l'accueil).
- **Photo de la boutique** : aucune photo de la façade ou de l'intérieur n'est disponible. La page Contact montre le plateau devant la vitrine.
- **Descriptions de la carte** : elles reprennent le texte visible sur Uber Eats, coupé avant les passages tronqués. Les intitulés japonais sont ceux de la carte, y compris 宇治・福岡産の高級抹茶 pour la catégorie Matcha.
- **Mentions légales** : les champs surlignés « à compléter » (raison sociale, SIRET, contact…) sont dans `src/app/mentions-legales/page.tsx` et `src/app/confidentialite/page.tsx`.
- **Google Maps** : l'iframe ne se charge qu'après un clic sur « Afficher la carte » (cookies tiers). Le choix est mémorisé sur l'appareil. Les liens « Itinéraire » fonctionnent sans consentement.

## Architecture

```
src/
  app/            layout (polices, SEO, JSON-LD), une route par page, sitemap, robots, icônes, image de partage
  components/
    shell/        En-tête, menu mobile, barre basse, pied de page, intro, transitions, défilement
    home/         Couverture (HomeHero), paravent (HomeByobu), rouleau (HomeEmaki), portes (HomeDoors)
    carte/        Onglets, grands formats avec titre japonais, fiches de papier
    creations/    Galerie et mises en scène
    maison/       Les trois séquences
    contact/      Carte Google Maps avec consentement
    motion/       RevealImage, RevealText
    logo/         Tracés vectoriels du logo officiel et BrushSymbol
    ui/           Photo, Cta, icônes
  data/           Tout le contenu modifiable
  lib/            GSAP, « scène » (coordination intro / transitions / entrées), utilitaires
```

**La scène** (`src/lib/stage.ts`) coordonne les animations : tant qu'un écran couvre la page (intro, transition), les animations d'entrée attendent via `onStage()`. Lors d'un chargement direct, ce qui est déjà à l'écran reste en place et n'est pas caché puis révélé.

## Accessibilité et mouvement

- `prefers-reduced-motion` : ni intro, ni transition, ni épinglage, ni parallaxe. Les compositions restent complètes, et la phrase d'identité retrouve sa propre section.
- Écrans tactiles : défilement natif, pas de scène épinglée, séquences en CSS (`position: sticky`) et glissements natifs. Deux boutons La Carte + Itinéraire restent en bas de l'écran, sur mobile et tablette.
- Appareils très modestes (classe `lite`) : ni parallaxe, ni paravent 3D, ni scène épinglée.
- Sans JavaScript : toutes les pages restent lisibles, et les 25 produits de la carte s'affichent.
- L'intro est jouée une seule fois par session, et se passe par un clic ou la touche Échap.
- Clavier : lien d'évitement, focus piégé et Échap dans le menu, focus replacé sur le contenu après une transition.
