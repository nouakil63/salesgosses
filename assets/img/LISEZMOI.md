# Images

| Fichier | Rôle | Format conseillé |
|---|---|---|
| `logo.png` | Logo rond, utilisé dans l'en-tête, le hero, le pied de page et le favicon | PNG, fond vert #9AA279 |
| `hero-poster.jpg` | Image d'attente de la vidéo du hero | JPG, 1920 × 1080 |
| `placeholder-1..4.jpg` | **Provisoires.** Bande photo de l'accueil | JPG, format 4:5 (900 × 1100) |

## Remplacer les images provisoires

Les quatre `placeholder-*.jpg` sont des images générées, à remplacer par les
vraies photos du bar. Garder le format **4:5 vertical** et un poids inférieur à
300 Ko par image.

Sujets qui fonctionnent bien pour la bande photo :
1. La terrasse place Morny en soirée
2. Le comptoir et la rampe des onze becs
3. Une salle pleine, ambiance soirée
4. Une planche de tapas

Compression :

```bash
ffmpeg -i photo.jpg -vf "scale=900:1100:force_original_aspect_ratio=increase,crop=900:1100" -q:v 4 placeholder-1.jpg
```
