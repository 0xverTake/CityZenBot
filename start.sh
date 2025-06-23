#!/bin/bash

echo "Démarrage du bot Star Citizen Discord..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé"
    echo "Veuillez installer Node.js depuis https://nodejs.org/"
    exit 1
fi

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "ERREUR: Fichier .env non trouvé"
    echo "Copiez .env.example vers .env et configurez vos tokens"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
fi

# Déployer les commandes slash
echo "Déploiement des commandes slash..."
node deploy-commands.js

# Démarrer le bot
echo "Démarrage du bot..."
npm start
