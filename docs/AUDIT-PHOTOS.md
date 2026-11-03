# Audit photographique

Inspection de chaque fichier de `public/images` : dimensions, cadrage, sujet, qualité, puis emplacement retenu.
Le registre utilisé par le code (fichier, description, point focal) est `src/data/photos.ts`.

## Constats qui ont guidé la direction artistique

- **Le studio noir est un atout.** Les sept photos de produits partagent le même décor : fond noir, néon vert, table d'acier ronde, produit centré. C'est ce qui permet l'alcôve noire du Hero, la galerie de `/creations` et la table commune Latte / Americano.
- **Les fichiers sont petits.** Aucun ne dépasse 1 672 px, et les photos de produits ne font que 774 à 864 px de large. Elles ne sont jamais utilisées en plein écran large : seule `strawberry-splash` (1 536 px) l'est.
- **Peu de produits sont photographiés.** Sur les 25 références de la carte, 7 ont une photo. Les 18 autres affichent leur nom japonais officiel sur une fiche de papier : aucun visuel n'est inventé ni emprunté à un autre produit.

## Inventaire

| Fichier | Dimensions | Sujet et cadrage | Qualité | Emplacement et traitement |
| --- | --- | --- | --- | --- |
| `hero/matcha-tornado-hero.jpg` | 1122 × 949 | Matcha Tornado, centré, table en bas, très peu d'espace au-dessus de la crème | Excellente | **Hero** : monumental, aligné en bas de l'alcôve, noir prolongé au-dessus. `/creations` : scène I |
| `hero/matcha-tornado-depth.webp` | 1122 × 949 | Dérivé : même photo, transparente sauf la crème et le haut du gobelet | Découpe contrôlée sur fond magenta | **Hero** : la crème passe devant le titre |
| `location/strawberry-splash.jpg` | 1536 × 1024 | Boisson au centre, couronne de matcha, fraises, éclaboussures | Excellente, la plus grande | `/creations` : plein cadre, zoom arrière. Accueil : paravent. Carte : Strawberry Matcha Cream |
| `location/matcha-cup-hand.jpg` | 1024 × 1536 | Gobelet tenu en main, bouteilles floues en haut à droite | Bonne, décor chargé | Carte : Matcha Latte (point focal bas). `/maison` : séquence 3 |
| `location/shop-window-tray-crop.jpg` | 1086 × 1166 | Dérivé recadré : plateau de quatre boissons devant la vitrine | Très bonne | `/contact`, accueil (porte « La Boutique »), `/maison`. Toujours affichée à son ratio ou presque : le plateau occupe toute la largeur |
| `location/shop-window-tray.jpg` | 1086 × 1448 | Original : le lettrage de la vitrine apparaît à l'envers en haut | Très bonne | Non affiché : remplacé par le recadrage ci-dessus |
| `location/takeaway-hands.jpg` | 1086 × 1448 | Plateau tenu à deux mains, pull beige | Bonne | Accueil : emaki. `/maison` : séquence 3. Transition vers `/contact` |
| `preparation/leaves-hands.jpg` | 1024 × 1536 | Mains dans de jeunes feuilles, sans zone vide | Excellente | `/maison` : séquence 1, grand panneau fixe. Emaki. Carte : ambiance Fruity Tea |
| `preparation/tea-field.jpg` | 941 × 1672 | Deux personnes de dos, champ de théiers, ciel, câbles | Correcte, documentaire | `/maison` : petit format, recadré pour réduire les câbles |
| `preparation/powder-spoon.jpg` | 1086 × 1448 | Cuillère de poudre au-dessus d'un bol, fond gris | Très bonne | `/maison` : image 1 du geste |
| `preparation/water-pour.jpg` | 1024 × 1536 | Filet d'eau sur la poudre | Excellente | `/maison` : image 2 du geste. Emaki |
| `preparation/chasen-whisk.jpg` | 1086 × 1448 | Fouet de bambou en action, mains | Très bonne | `/maison` : image 3 du geste. Emaki. Transition vers `/maison` |
| `preparation/whisked-matcha.jpg` | 1086 × 1448 | Surface de matcha dans un bol, fond bois | Excellente, texture | `/maison` : image 4 du geste. Accueil : porte « La Carte ». Carte : ambiance Matcha |
| `preparation/matcha-pour-cup.jpg` | 1024 × 1536 | Matcha versé au-dessus d'un gobelet : les deux sont dans le cadre | Très bonne | `/creations` et emaki : ratio d'origine, pour ne couper ni le bec ni le gobelet |
| `preparation/crepe-lift.jpg` | 941 × 1672 | Crêpe soulevée à la spatule, fond gris uni | Très bonne | `/creations` : la matière, à côté de la Forest Fruit. Emaki. Carte : ambiance Crêpes |
| `preparation/crepe-spread.jpg` | 1086 × 1448 | Crêpe sur plaque rouillée | Bonne | Non utilisée : redit `crepe-lift`, en moins élégant |
| `preparation/crepe-batter.jpg` | 1086 × 1448 | Pâte au rouleau, gant noir, plaque rouillée | Bonne | Non utilisée : ne sert pas la perception premium |
| `products/crepe-forest-fruit.jpg` | 823 × 915 | Cône garni, support blanc entier | Très bonne | Accueil : paravent. `/creations` : scène II. Carte |
| `products/camelot-caramel-latte.jpg` | 778 × 865 | Gobelet, biscuit tenu à la pince | Très bonne | Accueil : paravent. `/creations` : scène IV. Carte (produit et ambiance Café, gros plan sur mobile) |
| `products/thai-milk-tea-iced-smoothie.jpg` | 850 × 931 | Gobelet, crème, perles | Très bonne | `/creations` : scène V. Carte : Thai Milk Tea. 14 px retirés en haut (reste de texte « MATCHA ») |
| `products/brown-sugar-coffee-iced-smoothie.jpg` | 864 × 960 | Gobelet, crème caramélisée, perles | Très bonne | `/creations` : scène V. Carte : ambiance Boba (gros plan sur mobile) |
| `products/latte.jpg` | 819 × 910 | Gobelet, deux couches | Très bonne | `/creations` : scène VI, table commune. Carte |
| `products/americano.jpg` | 774 × 860 | Gobelet, glaçons, la plus petite | Très bonne | `/creations` : scène VI, table commune. Carte |
| `products/matcha-tornado.jpg` | 853 × 948 | Même prise de vue que le fichier du Hero, en moins grand | Très bonne | Non utilisée : doublon |

## Règles appliquées

- **Jamais de déformation** : toutes les images passent par `object-fit`, dans un cadre au ratio choisi.
- **Jamais de produit tronqué** : les cadres `4/5` conservent toute la hauteur des photos de produits (ratio 0,9). Les bandeaux mobiles trop horizontaux pour un produit entier montent sur un gros plan de la garniture, volontaire, via `bandM`.
- **Décor et produit distincts** : les fondus au noir de `/creations` portent sur le décor et s'arrêtent avant le produit, sauf une légère atténuation tout en bas de l'image.
- **Découpe limitée** : une seule, celle du Hero, sur fond noir et contrôlée à fort contraste. Aucun autre détourage.

## Pour aller plus loin

À demander au photographe ou à la boutique, par ordre de priorité :

1. Les exports haute définition des photos de produits (3 000 px de large ou plus) : c'est ce qui manque pour un rendu natif sur écran 4K.
2. Une vraie photo de la façade ou de l'intérieur de la boutique : aucune n'existe dans le projet.
3. Des photos des produits de la carte qui n'en ont pas, surtout les crêpes et les boissons au matcha.
