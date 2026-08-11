# Vidéo du hero

Déposer ici le fichier `hero.mp4` (et si possible `hero.webm`).

## Spécifications recommandées

| Paramètre | Valeur |
|---|---|
| Format | MP4 (H.264) + WebM (VP9) en secours |
| Résolution | 1920 × 1080, cadrage pensé pour un recadrage vertical sur mobile |
| Durée | 8 à 15 secondes, bouclable sans coupure visible |
| Poids | **moins de 4 Mo** — au-delà, le chargement mobile devient pénible |
| Son | **aucun** — la piste audio doit être supprimée, elle ne sera jamais lue |
| Débit | ~2 000 kbps |

## Commande FFmpeg de compression

```bash
ffmpeg -i rush.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart hero.mp4
ffmpeg -i rush.mov -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 hero.webm
```

## Image d'attente

`assets/img/hero-poster.jpg` s'affiche avant le chargement de la vidéo et sur les
appareils qui bloquent la lecture automatique. La remplacer par une vraie image
extraite de la vidéo :

```bash
ffmpeg -i hero.mp4 -ss 00:00:02 -vframes 1 -q:v 3 ../img/hero-poster.jpg
```

Tant que `hero.mp4` est absent, le site affiche l'image d'attente sans erreur.
