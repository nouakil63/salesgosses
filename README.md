# Sales Gosses — site web

Site vitrine du bar **Sales Gosses**, 21 rue Breney, 14800 Deauville.
Bar à bières, cocktails & tapas.

Site statique : HTML, CSS et JavaScript natifs. Aucune dépendance, aucun build,
aucun framework. On ouvre `index.html` et ça marche.

---

## Arborescence

```
salesgosses/
├── index.html            Accueil (vidéo hero + mur des 11 becs)
├── carte.html            La carte
├── groupes.html          Groupes & privatisation
├── contact.html          Contact & accès
├── assets/
│   ├── css/style.css     Toute la charte, en un fichier commenté
│   ├── js/main.js        Navigation, apparitions, pastille horaires
│   ├── img/              Logo, poster, photos (voir LISEZMOI.md)
│   └── video/            hero.mp4 à déposer ici (voir LISEZMOI.md)
├── .gitignore
└── README.md
```

---

## Charte graphique

Toute la palette est dérivée du logo. Le vert est la couleur exacte échantillonnée
sur le fichier fourni.

| Jeton | Valeur | Usage |
|---|---|---|
| `--nuit` | `#11140E` | Fond général. Un noir olive, jamais du noir pur. |
| `--nuit-haut` | `#1B2016` | Sections en léger relief |
| `--nuit-bloc` | `#232A1C` | Plaques et bandes |
| `--sauge` | `#9AA279` | **Couleur du logo.** Accent principal, titres secondaires |
| `--sauge-fonce` | `#7B8460` | Blocs de numéro, liserés |
| `--sauge-clair` | `#C3CBA4` | Détails, degrés d'alcool |
| `--craie` | `#F4F3EC` | Texte principal |
| `--ambre` | `#D99B34` | Accent unique : la pression. Pastille « ouvert », survol des becs. À garder rare. |

### Direction : la plaque émaillée

Le logo est du blanc sur un aplat vert plein : c'est le vocabulaire des plaques
émaillées de bistrot. Le site en applique les règles, et elles sont strictes :

- **aucun filet à 1px.** Les sections se séparent par un changement d'aplat, les
  listes par une alternance de bandes, jamais par un trait.
- **keyline épaisse en retrait du bord** (`--keyline: 3px`, en `box-shadow: inset`)
  pour les plaques et les cadres, comme le liseré d'une vraie plaque émaillée.
- **inversion sauge.** Au moins un bloc par page passe en fond vert plein avec
  encre sombre. C'est le point de bascule visuel de la page.
- les étiquettes de section sont des **petites plaques pleines**, pas un mot en
  majuscules suivi d'un trait.

**Typographies** (Google Fonts, chargées par CDN)

- `Big Shoulders Display` — l'enseigne. Condensée, verticale, esprit lettrage
  peint. Réservée aux titres et aux chiffres.
- `Instrument Sans` — le texte courant, les libellés et les boutons.

Le lettrage majuscule très espacé (`.surtitre`) reprend celui de la ligne
« BAR À BIÈRES & COCKTAILS DEAUVILLE » du logo.

---

## L'élément signature : le mur des becs

La section « Onze pressions, jamais les mêmes » est le cœur de la page d'accueil.
La numérotation `01 → 11` n'est pas décorative : elle correspond aux tireuses
réelles du bar. C'est le point de différenciation du lieu (onze becs tournants,
c'est rare en Normandie), donc c'est ce que la page raconte en premier.

**Neuf becs, pas onze.** La communication publique du bar annonce onze becs
tournants ; la caisse n'en liste que neuf en 25/50 cl. Le site affiche neuf.
À trancher avec le gérant : soit deux becs manquent à la liste, soit le chiffre
communiqué est faux.

**Mise à jour à chaque rotation de fût** : ouvrir `index.html`, chercher
`<!-- SIGNATURE`, et modifier les blocs `.bec`. Trois champs par bec :

```html
<div class="bec apparait">
  <span class="bec__numero">01</span>
  <span class="bec__nom">La Chouffe</span>
  <span class="bec__style">Blonde belge</span>
  <span class="bec__degre">25 / 50 cl</span>
</div>
```

---

## Le triptyque vidéo

Les trois rushes fournis sont **carrés (1080 × 1080)** pour deux d'entre eux, et
**vertical basse définition (360 × 636)** pour le troisième. Aucun n'est
exploitable en fond de hero plein écran : l'étirement les rendrait flous et le
recadrage 16/9 couperait la moitié de l'image.

La page les présente donc comme **trois écrans côte à côte**, à leur format
natif, sous le bloc de titre. Le format contraint la mise en page au lieu d'être
subi.

| Emplacement | Fichier | Source |
|---|---|---|
| Écran 01 | `hero-2.mp4` | 1080 × 1080 |
| Écran 02 | `hero-3.mp4` | 1080 × 1080 |
| Écran 03 | `hero-1.mp4` | 360 × 636 — **le plus faible**, à remplacer en priorité |

Les vidéos ne se lisent que lorsqu'elles sont visibles à l'écran (trois lectures
simultanées font chauffer un téléphone), et pas du tout si le système demande un
mouvement réduit.

**Les légendes sont des suppositions.** « Au comptoir », « En salle », « Côté
cocktails » ont été écrites sans avoir vu les vidéos. À corriger dans les
`<figcaption>` de `index.html`.

**Les images d'attente `hero-1..3.jpg` sont provisoires.** Les remplacer par de
vraies extractions :

```bash
ffmpeg -y -i hero-1.mp4 -ss 00:00:02 -vframes 1 -q:v 4 ../img/hero-1.jpg
```

---

## Page d'accueil : ce qu'on évite

Trois automatismes rendent une page immédiatement reconnaissable comme
générique. Ils sont bannis de l'accueil :

1. **Les cartes à gros chiffres** (« 100+ Bières », « 3 Formules »). Remplacées
   par un extrait de la vraie carte, avec de vrais noms de produits.
2. **La vidéo plein écran en fond de hero**, avec texte blanc par-dessus. Le
   bloc d'ouverture est purement typographique ; les vidéos ont leur section.
3. **Le motif étiquette / titre / chapo** répété à l'identique dans chaque
   section. Remplacé par le titre en drapeau (`.drapeau`), où le sous-titre se
   cale contre le bas du grand titre.

Si une future section a besoin d'un de ces trois motifs, c'est probablement que
son contenu est trop faible pour tenir seul.

### Faits supprimés du site

Le bar ne fait **pas** 200 m², n'a **pas** de terrasse de 100 m² et la capacité
de 150 personnes n'est pas confirmée. Ces chiffres circulent sur PagesJaunes et
Privateaser mais sont périmés. Ils ont été retirés de toutes les pages. Ne pas
les réintroduire sans confirmation du gérant.

---

## La carte

`carte.html` contient **129 entrées** réparties en neuf familles, saisies depuis
les écrans de la caisse du bar. Une barre de navigation collante permet de sauter
d'une famille à l'autre, et la famille en cours de lecture est surlignée.

**Aucun prix n'est affiché.** Ils n'ont pas été fournis. Deux options : les
ajouter dans le `<span class="ligne__detail">` de chaque ligne, ou assumer une
carte sans prix (courant pour un bar, mais discutable côté client).

Les créations maison (`Mojito Sales Gosses`, `Sales Gosses`, `Planche mixte`)
portent la classe `ligne--maison` et sont surlignées en ambre.

### Corrections d'orthographe appliquées

Les intitulés de caisse ont été corrigés pour l'affichage public. Si le gérant
préfère l'orthographe de la caisse, il faut les remettre :

| Caisse | Site |
|---|---|
| Chardonay | Chardonnay |
| Cote de bergerac / Gascongne | Côtes de Bergerac / Gascogne |
| Les Falendiere | Les Falendières |
| Planche Frommage | Planche fromage |
| Camambert Fondu | Camembert fondu |
| Guacamol | Guacamole |
| annanas / cramberry | ananas / cranberry |
| Jack Daniel's Strawsberry | Jack Daniel's Strawberry |
| Havana Espécial | Havana Especial |
| Zubrowka | Żubrówka |

### Points à faire valider

- **« Sécha da Silva »** (rhum) n'a pas été repris : l'intitulé ne correspond à
  aucune marque identifiable. À vérifier auprès du bar.
- Les mentions **« Bordeaux »**, **« Art de Vivre »** et **« Les Falendières »**
  en rosé : appellations ou noms de cuvées ? Le classement peut être faux.
- **Happy hour** : mentionné sur la caisse, horaires inconnus. L'encart en bas de
  la carte reste volontairement vague.

---

## À faire avant la mise en ligne

- [ ] Déposer `assets/video/hero.mp4` (specs dans `assets/video/LISEZMOI.md`)
- [ ] Remplacer les 4 `placeholder-*.jpg` par les vraies photos
- [ ] Extraire un vrai `hero-poster.jpg` depuis la vidéo
- [ ] Faire valider la liste des 11 becs
- [ ] Remplir la carte complète (`carte.html`) : intitulés et prix
- [ ] Vérifier le numéro de téléphone affiché (06 42 41 81 67, source publique)
- [ ] Ajouter mentions légales et politique de confidentialité
- [ ] Vérifier le rendu sur iPhone (Safari) et Android (Chrome)

---

## Réglages courants

**Horaires.** La pastille « Ouvert maintenant » est calculée dans
`assets/js/main.js` :

```js
var OUVERTURE = 17; // 17h
var FERMETURE = 1;  // 1h du matin
```

Les horaires publics divergent selon les sources (1h sur Google, 2h sur
PagesJaunes et Privateaser). Valeur retenue : 1h. À corriger si besoin, ici **et**
dans les quatre fichiers HTML.

**Coordonnées.** Adresse, téléphone et liens sociaux sont répétés dans le pied de
page des quatre pages. Une modification demande quatre remplacements.

---

## Développement local

Un double-clic sur `index.html` suffit. Pour un environnement plus proche de la
production (chemins absolus, lecture vidéo) :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

---

## Mise en ligne

Site 100 % statique, donc compatible avec n'importe quel hébergement :

- **GitHub Pages** — Settings → Pages → Branch `main`, dossier `/root`
- **Netlify / Vercel** — glisser-déposer le dossier, aucun build à configurer
- **OVH / hébergement mutualisé** — déposer le contenu du dossier en FTP dans `www/`

---

## Accessibilité et performance

- Lien d'évitement vers le contenu principal
- Mise au point clavier visible sur tous les éléments interactifs
- Menu mobile pilotable au clavier, fermeture avec Échap
- `prefers-reduced-motion` respecté : animations et bandeau défilant désactivés
- Vidéo `muted` + `playsinline`, avec repli sur l'image d'attente
- Données structurées `schema.org/BarOrPub` pour le référencement local

---

Développé par **NOK'S Consulting**.
