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
| `--nuit-haut` | `#191D14` | Sections en léger relief |
| `--nuit-carte` | `#1F2418` | Cartes et blocs |
| `--sauge` | `#9AA279` | **Couleur du logo.** Accent principal, titres secondaires |
| `--sauge-clair` | `#C3CBA4` | Détails, degrés d'alcool |
| `--craie` | `#F4F3EC` | Texte principal |
| `--ambre` | `#D99B34` | Accent unique : la pression. Pastille « ouvert », survol des becs. À garder rare. |

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

**Mise à jour à chaque rotation de fût** : ouvrir `index.html`, chercher
`<!-- SIGNATURE`, et modifier les blocs `.bec`. Trois champs par bec :

```html
<div class="bec apparait">
  <span class="bec__numero">01</span>
  <span class="bec__nom">La Chouffe</span>
  <span class="bec__style">Blonde belge</span>
  <span class="bec__degre">8,0°</span>
</div>
```

> Les bières listées actuellement sont reprises de la communication publique du
> bar. **À faire valider par le gérant avant mise en ligne** — la carte a pu
> changer.

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
