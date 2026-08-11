#!/usr/bin/env bash
# Envoie le site sur GitHub. À lancer une seule fois depuis ce dossier.
set -e

DEPOT="https://github.com/nouakil63/salesgosses.git"

git remote remove origin 2>/dev/null || true
git remote add origin "$DEPOT"
git branch -M main
git push -u origin main

echo
echo "Site poussé sur $DEPOT"
echo "Pour la mise en ligne : Settings > Pages > Source = GitHub Actions"
