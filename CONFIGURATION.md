# 🚀 CityZenBot Star Citizen - Configuration Finale

## ✅ Installation Terminée !

Félicitations ! Votre bot Discord Star Citizen est maintenant installé et prêt à fonctionner. Tous les tests sont passés avec succès :

- ✅ **13 vaisseaux** chargés dans la base de données
- ✅ **5 builds** de base configurés  
- ✅ **20 entrées de méta** PvP/PvE disponibles
- ✅ **Toutes les commandes** fonctionnelles

## 🔧 Configuration Discord Requise

Pour finaliser l'installation, vous devez configurer votre bot Discord :

### 1. Créer un Bot Discord

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez "New Application" et donnez-lui un nom
3. Dans l'onglet "Bot" :
   - Cliquez "Add Bot"
   - Copiez le **Token** (gardez-le secret !)
   - Activez les intents nécessaires si demandé

### 2. Inviter le Bot sur Votre Serveur

1. Dans l'onglet "OAuth2" > "URL Generator"
2. Sélectionnez :
   - ☑️ `bot`
   - ☑️ `applications.commands`
3. Permissions recommandées :
   - ☑️ Send Messages
   - ☑️ Use Slash Commands  
   - ☑️ Embed Links
   - ☑️ Read Message History
4. Utilisez l'URL générée pour inviter le bot

### 3. Configuration du Fichier .env

Modifiez le fichier `.env` avec vos informations :

```env
# ⚠️ OBLIGATOIRE - Token de votre bot Discord
DISCORD_TOKEN=votre_token_bot_ici

# ⚠️ OBLIGATOIRE - ID de votre serveur Discord
GUILD_ID=votre_guild_id_ici

# 📱 Optionnel - ID de votre application (pour déploiement global)
CLIENT_ID=votre_client_id_ici

# 🔧 Configuration avancée (optionnel)
NODE_ENV=development
DB_PATH=./database/starcitizenbot.db
```

**Pour obtenir l'ID de votre serveur :**
1. Activez le "Mode Développeur" dans Discord (Paramètres > Avancé)
2. Clic droit sur votre serveur > "Copier l'identifiant"

## 🚀 Démarrage du Bot

Une fois le fichier `.env` configuré :

### Méthode Automatique (Recommandée)
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### Méthode Manuelle
```bash
# 1. Déployer les commandes
node deploy-commands.js

# 2. Démarrer le bot
npm start
```

## 🎮 Commandes Disponibles

Votre bot supporte maintenant toutes ces commandes :

### 🚀 **Vaisseaux** (`/ship`)
- `/ship info Hornet F7C` - Infos détaillées
- `/ship search Aegis` - Rechercher par fabricant
- `/ship role "Light Fighter"` - Vaisseaux par rôle
- `/ship compare Sabre "Hornet F7C"` - Comparaison

### 🔥 **Méta** (`/meta`)
- `/meta current` - Méta actuel PvP/PvE
- `/meta tier pvp` - Tier list PvP détaillée
- `/meta patch` - Changements dernière patch

### 🔧 **Builds** (`/build`)
- `/build show "Cutlass Black"` - Tous les builds
- `/build pvp Sabre` - Build PvP optimisé
- `/build pve "Vanguard Warden"` - Build PvE optimisé
- `/build create` - Créer un build personnalisé

### 💰 **Achats** (`/buy`)
- `/buy ship "Hornet F7C"` - Où acheter
- `/buy component "FR-86 Shield"` - Emplacements composants
- `/buy location "New Babbage"` - Inventaire magasin

### ℹ️ **Aide** (`/help`)
- `/help` - Aide générale
- `/help ship` - Aide sur les commandes vaisseaux

## 📊 Données Disponibles

Votre bot contient actuellement :

### 🚀 **Vaisseaux** (13 disponibles)
- Aurora MR, Mustang Alpha, Avenger Titan
- 300i, Hornet F7C, Gladius, Arrow, Buccaneer
- Cutlass Black, Cutlass Blue, Freelancer
- Constellation Andromeda, Constellation Aquila
- Sabre, Vanguard Warden, Retaliator Bomber
- Hammerhead, Carrack

### 🔧 **Builds Pré-configurés** (5 disponibles)
- **Hornet F7C** : PvP Dominator
- **Cutlass Black** : Polyvalent ERT  
- **Sabre** : Assassin Furtif
- **Vanguard Warden** : Forteresse Volante
- **Gladius** : Intercepteur Rapide

### ⚔️ **Méta Complet**
- **PvP** : 8 vaisseaux classés S-A-B
- **PvE** : 8 vaisseaux classés S-A-B
- **Exploration** : 4 vaisseaux spécialisés

## 🔄 Mises à Jour Automatiques

Le bot se met à jour automatiquement :
- ⏰ **Données** : Toutes les heures
- 🧹 **Nettoyage** : Chaque jour à 2h
- 📊 **Cache** : Rafraîchi toutes les 30 minutes

## 🛠️ Dépannage

### Le bot ne répond pas ?
1. Vérifiez que le token est correct dans `.env`
2. Assurez-vous que le bot est invité sur votre serveur
3. Consultez les logs dans `./logs/`

### Les commandes n'apparaissent pas ?
1. Relancez `node deploy-commands.js`
2. Vérifiez que `GUILD_ID` est correct
3. Attendez jusqu'à 1 heure pour les commandes globales

### Erreur de permissions ?
1. Vérifiez les permissions du bot sur Discord
2. Assurez-vous qu'il peut envoyer des messages et des embeds

## 📈 Prochaines Étapes

Votre bot est maintenant fonctionnel ! Vous pouvez :

1. **Personnaliser** les données dans `src/data/gameData.js`
2. **Ajouter** de nouveaux vaisseaux et builds
3. **Modifier** les méta selon vos préférences
4. **Étendre** avec de nouvelles commandes
5. **Intégrer** des APIs externes pour des données temps réel

## 🎯 Support

- 📖 **Documentation** : Consultez `README.md` et `INSTALLATION.md`
- 🐛 **Bugs** : Ouvrez une issue sur GitHub
- 💬 **Aide** : Rejoignez notre serveur Discord de support

---

## 🏆 Récapitulatif des Fonctionnalités

✅ **15+ vaisseaux** avec statistiques complètes  
✅ **Auto-complétion** intelligente  
✅ **Comparaisons** détaillées entre vaisseaux  
✅ **Méta PvP/PvE** avec tier lists  
✅ **Builds optimisés** avec coûts calculés  
✅ **Guides d'achat** avec emplacements précis  
✅ **Base de données** SQLite performante  
✅ **Mises à jour** automatiques  
✅ **Logs** complets pour le debugging  
✅ **Architecture** modulaire et extensible  

**🎉 Votre bot Star Citizen est prêt à servir votre communauté !**
