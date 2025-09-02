#!/bin/bash

echo "🚀 Installation du projet Formulaire SMS..."

# Installer les dépendances frontend
echo "📦 Installation des dépendances frontend..."
npm install

# Installer les dépendances backend
echo "📦 Installation des dépendances backend..."
npm install express cors axios xml2js nodemon concurrently --save

echo "✅ Installation terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "  npm run dev:full    # Frontend + Backend"
echo ""
echo "Ou séparément :"
echo "  npm run server:dev  # Serveur SMS seulement"
echo "  npm run dev         # Frontend seulement"
