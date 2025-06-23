# Guide d'Installation - CityZenBot Star Citizen

## Prérequis

### 1. Node.js
- Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org/)
- Version recommandée : 18.x ou plus récente
- Vérifiez l'installation : `node --version` et `npm --version`

### 2. Bot Discord
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Dans l'onglet "Bot", créez un bot
4. Copiez le token du bot (gardez-le secret !)
5. Activez les "Privileged Gateway Intents" si nécessaire

### 3. Inviter le bot sur votre serveur
1. Dans l'onglet "OAuth2" > "URL Generator"
2. Cochez "bot" et "applications.commands"
3. Permissions recommandées :
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History
   - Add Reactions
4. Utilisez l'URL générée pour inviter le bot

## Installation

### Étape 1 : Télécharger le code
```bash
git clone <url-du-repo>
cd CityZenBot
```

### Étape 2 : Configuration
1. Copiez `.env.example` vers `.env`
2. Éditez `.env` avec vos informations :

```env
# Token de votre bot Discord (OBLIGATOIRE)
DISCORD_TOKEN=votre_token_bot_ici

# ID de votre serveur Discord pour les tests (OBLIGATOIRE)
GUILD_ID=id_de_votre_serveur

# ID de votre application Discord (pour le déploiement global)
CLIENT_ID=id_de_votre_application

# Configuration optionnelle
NODE_ENV=development
DB_PATH=./database/starcitizenbot.db
```

### Étape 3 : Installation des dépendances
```bash
npm install
```

### Étape 4 : Premier démarrage
```bash
# Sur Windows
start.bat

# Sur Linux/Mac
chmod +x start.sh
./start.sh

# Ou manuellement
node deploy-commands.js
npm start
```

## Configuration Avancée

### Variables d'environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DISCORD_TOKEN` | Token du bot Discord | ✅ |
| `GUILD_ID` | ID du serveur pour les tests | ✅ |
| `CLIENT_ID` | ID de l'application Discord | 🔄 |
| `NODE_ENV` | Environnement (development/production) | ❌ |
| `DB_PATH` | Chemin de la base de données | ❌ |
| `UPDATE_INTERVAL` | Intervalle de mise à jour (ms) | ❌ |

### Base de données
- Le bot utilise SQLite par défaut
- La base est créée automatiquement au premier démarrage
- Emplacement : `./database/starcitizenbot.db`

### Logs
- Les logs sont sauvegardés dans `./logs/`
- Un fichier par jour : `YYYY-MM-DD.log`
- Nettoyage automatique après 7 jours

## Commandes disponibles

### Scripts NPM
```bash
npm start          # Démarrer le bot
npm run dev        # Mode développement avec nodemon
```

### Scripts personnalisés
```bash
node deploy-commands.js    # Déployer les commandes slash
```

## Dépannage

### Le bot ne se connecte pas
1. Vérifiez que le token Discord est correct
2. Vérifiez que le bot a été invité sur le serveur
3. Consultez les logs dans `./logs/`

### Les commandes n'apparaissent pas
1. Assurez-vous que `deploy-commands.js` s'est exécuté sans erreur
2. Vérifiez que `GUILD_ID` est correct pour les tests
3. Les commandes globales prennent jusqu'à 1 heure pour apparaître

### Erreurs de base de données
1. Vérifiez les permissions d'écriture dans le dossier `./database/`
2. Supprimez le fichier de base si corrupted
3. Le bot recréera automatiquement la structure

### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problèmes de permissions
- Le bot doit avoir les permissions Discord appropriées
- Vérifiez la hiérarchie des rôles sur votre serveur

## Mise à jour

### Version locale
```bash
git pull origin main
npm install
node deploy-commands.js
npm start
```

### Nouvelle fonctionnalité
1. Arrêtez le bot
2. Mettez à jour le code
3. Redéployez les commandes si nécessaire
4. Redémarrez le bot

## Structure des dossiers

```
CityZenBot/
├── src/
│   ├── commands/          # Commandes Discord
│   │   ├── ships/         # Commandes vaisseaux
│   │   ├── meta/          # Commandes méta
│   │   ├── builds/        # Commandes builds
│   │   ├── purchase/      # Commandes achat
│   │   └── general/       # Commandes générales
│   ├── services/          # Services (DB, API, etc.)
│   ├── utils/             # Utilitaires
│   └── data/              # Données du jeu
├── database/              # Base de données SQLite
├── logs/                  # Fichiers de logs
├── .env                   # Configuration
├── package.json           # Dépendances NPM
└── README.md              # Documentation
```

## Support

### Logs et débogage
- Consultez les logs dans `./logs/`
- Mode debug : `NODE_ENV=development npm start`
- Logs en temps réel : `tail -f logs/$(date +%Y-%m-%d).log`

### Problèmes fréquents
1. **Bot hors ligne** : Vérifiez le token et la connexion internet
2. **Commandes lentes** : Base de données peut nécessiter un nettoyage
3. **Données obsolètes** : Mises à jour automatiques toutes les heures

### Contribution
- Reportez les bugs via GitHub Issues
- Proposez des améliorations via Pull Requests
- Consultez la documentation du code pour les détails techniques

## Sécurité

### Bonnes pratiques
- Ne partagez JAMAIS votre token Discord
- Gardez `.env` dans `.gitignore`
- Utilisez des permissions minimales pour le bot
- Sauvegardez régulièrement la base de données

### Environnement de production
```env
NODE_ENV=production
```

Cela active :
- Déploiement global des commandes
- Optimisations de performance
- Logs de production
- Désactivation du debug
