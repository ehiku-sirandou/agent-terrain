#!/bin/bash

echo "🚀 Préparation du déploiement Vercel..."

# Vérifier si git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository Git..."
    git init
    git add .
    git commit -m "Initial commit - Formulaire SMS avec sauvegarde et déploiement Vercel"
    
    echo "ℹ️  Pour connecter à GitHub :"
    echo "  git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    echo ""
fi

# Build de test
echo "🔨 Test du build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    echo ""
    echo "🌐 Options de déploiement :"
    echo ""
    echo "1. Via GitHub (Recommandé) :"
    echo "   - Créer un repo sur GitHub"
    echo "   - Pousser le code : git push origin main"
    echo "   - Aller sur vercel.com → New Project → Importer le repo"
    echo ""
    echo "2. Via Vercel CLI :"
    echo "   npm i -g vercel"
    echo "   vercel login"
    echo "   vercel --prod"
    echo ""
    echo "📊 Fonctionnalités incluses :"
    echo "   ✅ Envoi SMS automatique"
    echo "   ✅ Sauvegarde des données utilisateur"
    echo "   ✅ API serverless Vercel"
    echo "   ✅ Interface responsive"
    echo "   ✅ Système de grattage pour cadeaux"
else
    echo "❌ Erreur lors du build. Vérifiez les erreurs ci-dessus."
    exit 1
fi
