# 🚀 Guide de Déploiement et Présentation - CityZenBot

Ce guide vous explique comment déployer votre CityZenBot et créer une présentation magnifique sur votre serveur Discord.

## 📦 Déploiement sur Raspberry Pi

### Option 1 : Script PowerShell (Windows)

```powershell
# Déploiement automatique
.\deploy-to-pi.ps1
```

### Option 2 : Script Bash (Linux/WSL/macOS)

```bash
# Rendre le script exécutable (Linux/macOS)
chmod +x deploy-to-pi.sh

# Déploiement automatique
./deploy-to-pi.sh --auto

# Ou avec menu interactif
./deploy-to-pi.sh
```

### Configuration personnalisée

Vous pouvez personnaliser les paramètres de déploiement :

```bash
# Variables d'environnement
export PI_HOST="192.168.1.100"
export PI_USER="pi"
export PI_PASSWORD="votremotdepasse"
export REMOTE_DIR="/home/pi/CityZenBot"

# Puis lancer le déploiement
./deploy-to-pi.sh --auto
```

## 🎨 Présentation Discord

### Présentation automatique

1. Configurez votre `.env` :
```env
PRESENTATION_CHANNEL_ID=123456789012345678
PRESENTATION_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

2. Lancez le script :
```bash
# Présentation embed (recommandée)
node post-presentation.js embed bot

# Présentation complète
node post-presentation.js full bot

# Via webhook
node post-presentation.js embed webhook
```

### Présentation manuelle

Copiez-collez ce message dans votre serveur Discord :

```
🚀 **CITYZENBOT - LE BOT ULTIME POUR STAR CITIZEN** 🚀

🌌 **Découvrez l'assistant parfait pour dominer l'univers de Star Citizen !**

**✨ FONCTIONNALITÉS PRINCIPALES ✨**

🚁 **VAISSEAUX & SPÉCIFICATIONS**
┣━ `/ship <nom>` - Infos complètes sur tous les vaisseaux
┣━ Statistiques détaillées (vitesse, armure, blindage)
┣━ Prix, disponibilité et recommandations d'usage
┗━ Base de données constamment mise à jour

⚔️ **MÉTA PVP/PVE OPTIMISÉE**
┣━ `/meta <pvp/pve> [ship]` - Stratégies gagnantes
┣━ Compositions d'équipe recommandées  
┣━ Counters et synergies
┗━ Méta actualisée selon les patchs

🔧 **BUILDS ULTRA-OPTIMISÉS**
┣━ `/build <vaisseau>` - Configurations parfaites
┣━ Loadouts PvP, PvE, Mining, Trading
┣━ Emplacements et statistiques des composants
┗━ Builds pour tous les styles de jeu

🛒 **GUIDE D'ACHAT INTELLIGENT**
┣━ `/buy <composant>` - Où acheter au meilleur prix
┣━ Localisation précise des vendeurs
┣━ Prix et disponibilité en temps réel
┗━ Optimisation des routes commerciales

❓ **AIDE & SUPPORT**
┗━ `/help` - Guide complet des commandes

**🎯 POURQUOI CITYZENBOT ?**
• 🎮 **Optimisé pour tous les joueurs** (débutants à experts)
• 📊 **Données ultra-précises** et mises à jour
• ⚡ **Réponses instantanées** et interface intuitive
• 🛠️ **Déployable partout** (PC, serveur, Raspberry Pi)
• 🔒 **Open Source** et personnalisable

**🌟 DÉMARRAGE RAPIDE**
1. Tapez `/help` pour voir toutes les commandes
2. Essayez `/ship Cutlass Black` pour commencer
3. Explorez les builds avec `/build Hornet`

**💎 Rejoignez l'élite des citoyens de l'espace ! 💎**

*Développé avec ❤️ pour la communauté Star Citizen*
```

## 🔧 Configuration Post-Déploiement

### Sur votre Raspberry Pi

1. **Connexion SSH :**
```bash
ssh trn@192.168.0.181
```

2. **Navigation vers le projet :**
```bash
cd /home/trn/CityZenBot
```

3. **Configuration du token Discord :**
```bash
nano .env
# Modifiez DISCORD_TOKEN avec votre token
```

4. **Déploiement des commandes slash :**
```bash
node deploy-commands.js
```

5. **Démarrage du bot :**
```bash
./start.sh
```

### Service systemd (démarrage automatique)

```bash
# Créer le service
sudo nano /etc/systemd/system/cityzenbot.service

# Contenu du fichier :
[Unit]
Description=CityZenBot Discord Bot
After=network.target

[Service]
Type=simple
User=trn
WorkingDirectory=/home/trn/CityZenBot
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target

# Activer le service
sudo systemctl enable cityzenbot
sudo systemctl start cityzenbot
sudo systemctl status cityzenbot
```

## 📊 Monitoring et Maintenance

### Vérification du statut

```bash
# Via systemd
sudo systemctl status cityzenbot

# Via les logs
journalctl -u cityzenbot -f

# Monitoring des ressources
htop
```

### Mise à jour du bot

```bash
# Sur votre PC, redéployez
.\deploy-to-pi.ps1

# Sur le Pi, redémarrez le service
sudo systemctl restart cityzenbot
```

## 🎯 Conseils pour une Présentation Réussie

### Timing optimal
- **Heures de pointe :** 18h-22h en semaine, 14h-20h le weekend
- **Éviter :** Heures de maintenance de Star Citizen

### Engagement
1. **Épinglez** le message de présentation
2. **Ajoutez des réactions** (🚀, ⚔️, 🌌, 🔧)
3. **Répondez rapidement** aux questions
4. **Créez un thread** pour les discussions

### Messages de suivi

**Après installation :**
```
✅ CityZenBot est maintenant en ligne !
Testez dès maintenant avec `/ship Aurora` ou `/help` 🚀
```

**Encouragement à l'utilisation :**
```
💡 **Astuce du jour** : Utilisez `/meta pvp Hornet` pour découvrir les meilleures stratégies de combat !
```

**Mises à jour :**
```
🔄 **CityZenBot mis à jour !** 
Nouvelles données du patch 3.XX intégrées ✨
```

## 🛠️ Dépannage

### Problèmes courants

**Bot hors ligne :**
```bash
# Vérifier le statut
sudo systemctl status cityzenbot

# Voir les logs d'erreur
journalctl -u cityzenbot --since "1 hour ago"

# Redémarrer
sudo systemctl restart cityzenbot
```

**Commandes slash non visibles :**
```bash
# Redéployer les commandes
node deploy-commands.js

# Vérifier les permissions du bot sur Discord
```

**Erreurs de base de données :**
```bash
# Vérifier l'existence de la base
ls -la database/

# Tester la connexion
node test.js
```

## 📞 Support

- **Documentation complète :** Consultez les fichiers `*.md` du projet
- **Logs détaillés :** Activez le mode debug dans `.env`
- **Community :** Rejoignez notre serveur Discord de support

## 🎉 Félicitations !

Votre CityZenBot est maintenant déployé et prêt à servir votre communauté Star Citizen ! 

**N'oubliez pas de :**
- ⭐ Star le projet sur GitHub
- 🔄 Maintenir le bot à jour
- 📢 Partager avec la communauté
- 🐛 Reporter les bugs découverts

*May the verse be with you, Citizen! 🌌*
