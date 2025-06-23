![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Star Citizen](https://img.shields.io/badge/Star%20Citizen-4.2-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Discord](https://img.shields.io/badge/discord.js-v14-blue.svg)
![AI](https://img.shields.io/badge/IA-Hugging%20Face-orange.svg)
![APIs](https://img.shields.io/badge/APIs-SC--Open.dev-brightgreen.svg)

# Star Citizen Discord Bot - CityZenBot

🚀 **Compatible Star Citizen 4.2** - Un bot Discord complet pour Star Citizen avec **IA intégrée**, **guides officiels RSI Spectrum** et **APIs officielles SC-Open.dev**. Fournit des conseils personnalisés, des informations sur les vaisseaux, les méta PvP/PvE, les builds optimisés et des données en temps réel.

![Star Citizen Bot](https://img.shields.io/badge/Star%20Citizen-4.2%20Ready-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Node.js](https://img.shields.io/badge/node.js-18+-green)
![SQLite](https://img.shields.io/badge/database-SQLite-orange)
![AI](https://img.shields.io/badge/IA-Hugging%20Face-red)
![APIs](https://img.shields.io/badge/APIs-SC--Open.dev-brightgreen)

## 🌟 Fonctionnalités

### 🆕 **APIs Officielles SC-Open.dev (NOUVEAU v2.1.0)**
- **Migration complète** vers les APIs officielles Fleetyards.net (SC-Open.dev)
- **Performance exceptionnelle** : 713 éléments/seconde
- **9/9 endpoints fonctionnels** : Ships, Components, Stations, Commodities, Shops, Hangars, Manufacturers, Star Systems, Celestial Objects
- **Mise à jour automatique** : Données rafraîchies toutes les 6 heures
- **Fallback intelligent** : Basculement automatique vers données locales si API indisponible
- **Cache optimisé** : Réduction des appels API et amélioration des temps de réponse

### 🤖 **Intelligence Artificielle Intégrée (NOUVEAU)**
- **IA Hugging Face gratuite** : Conseils personnalisés avec DialoGPT-medium
- **Guides officiels RSI Spectrum** : Intégration des guides RSI authentiques
- **Conseils contextuels** : Réponses adaptées au niveau du joueur (débutant/avancé)
- **Base de connaissances SC 4.2** : Informations spécifiques à la version actuelle
- **Cache intelligent** : Optimisation des appels API pour performance
- **Mode fallback** : Fonctionne même sans connexion IA

### 📚 **Guides Officiels RSI Spectrum**
- **5 catégories complètes** : Débutant, Combat, Commerce, Minage, Exploration
- **Conseils officiels** : Directement depuis robertsspaceindustries.com/spectrum/guide
- **Recherche intelligente** : Trouvez rapidement les guides pertinents
- **Nouveautés SC 4.2** : Mises à jour spécifiques à la version actuelle
- **Intégration IA** : Guides enrichis par l'intelligence artificielle

### 🚀 **Système de Vaisseaux Complet (SC 4.2)**
- **Base de données officielle** : Vaisseaux via API Fleetyards.net (SC-Open.dev)
- **Données en temps réel** : Plus de 200 vaisseaux avec statistiques détaillées
- **Recherche intelligente** : Par nom, fabricant, rôle ou spécifications
- **Comparaisons avancées** : Analysez les différences entre vaisseaux
- **Recommandations par rôle** : Combat, cargo, exploration, mining
- **Auto-complétion** : Interface intuitive avec suggestions automatiques
- **🆕 Mise à jour automatique** : Synchronisation avec l'API officielle

### ⚔️ **Méta PvP/PvE Actualisé pour SC 4.2**
- **Tier Lists dynamiques** : Classements S-A-B-C-D pour PvP et PvE
- **Analyses détaillées** : Raisonnement derrière chaque classement
- **Mises à jour automatiques** : Suivit des patches et changements SC 4.2
- **Stratégies adaptées** : Conseils spécifiques par type de gameplay

### 🔧 **Système de Builds Avancé (SC 4.2)**
- **Builds optimisés** : Configurations PvP/PvE pré-testées pour SC 4.2
- **Composants détaillés** : Armes, boucliers, moteurs, refroidissement
- **Coûts calculés** : Prix total en aUEC pour chaque build (SC 4.2)
- **Builds communautaires** : Création et partage de configurations personnalisées
- **Guides d'optimisation** : Conseils pour maximiser les performances

### 🛒 **Guide d'Achat Complet (SC 4.2)**
- **🆕 89 stations** : Données live depuis Fleetyards API
- **Prix actualisés** : Informations de coût en aUEC via UEX Corp (SC 4.2)
- **Inventaires détaillés** : Ce qui est disponible dans chaque magasin
- **Conseils d'achat** : Optimisation des trajets et économies

### 🌐 **APIs Temps Réel pour SC 4.2**
- **✅ Fleetyards API** : Vaisseaux, stations, composants
- **✅ UEX Corp API** : Prix, commerce, commodités
- **✅ SC-API.com** : Status univers officiel  
- **✅ Hugging Face API** : Intelligence artificielle gratuite
- **🔄 Mise à jour auto** : Données fraîches toutes les 6h
- **🛡️ Fallback robuste** : Fonctionne même si APIs indisponibles
- **Inventaires détaillés** : Ce qui est disponible dans chaque magasin
- **Conseils d'achat** : Optimisation des trajets et économies

## 🚀 Installation Rapide

### Prérequis
- [Node.js 18+](https://nodejs.org/)
- Bot Discord configuré ([Guide détaillé](INSTALLATION.md))

### Étapes
1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd CityZenBot
   ```

2. **Configuration**
   ```bash
   cp .env.example .env
   # Éditez .env avec vos tokens Discord
   ```

3. **Installation et démarrage**
   ```bash
   npm install
   npm start
   ```

4. **Démarrage automatique** (Windows)
   ```bash
   start.bat
   ```

📖 **[Guide d'installation détaillé](INSTALLATION.md)**

## 🎮 Commandes Disponibles

### 🤖 Intelligence Artificielle (`/ai`) - NOUVEAU
```
/ai conseil <question>     # Conseil IA personnalisé avec guides RSI
/ai guides <categorie>     # Guides officiels RSI Spectrum
/ai nouveautes             # Nouveautés Star Citizen 4.2
/ai status                 # Statut des services IA et guides
```

### 📚 Guides Officiels (`/guides`) - NOUVEAU
```
/guides liste              # Tous les guides RSI Spectrum disponibles
/guides categorie <type>   # Guide par catégorie (débutant, combat, etc.)
/guides recherche <mots>   # Rechercher dans les guides
/guides nouveautes         # Guide des nouveautés SC 4.2
```

### 🚀 Vaisseaux (`/ship`)
```
/ship info <nom>           # Informations détaillées d'un vaisseau
/ship search <terme>       # Rechercher par nom/fabricant
/ship role <type>          # Vaisseaux recommandés par rôle
/ship compare <v1> <v2>    # Comparaison détaillée
```

### 🔥 Méta (`/meta`)
```
/meta current              # Méta actuel PvP/PvE
/meta tier <type>          # Tier list détaillée
/meta patch                # Changements dernière patch
```

### 🔧 Builds (`/build`)
```
/build show <vaisseau>     # Tous les builds disponibles
/build pvp <vaisseau>      # Build PvP optimisé
/build pve <vaisseau>      # Build PvE optimisé
/build create              # Créer un build personnalisé
```

### 💰 Achats (`/buy`)
```
/buy ship <nom>            # Où acheter un vaisseau
/buy component <nom>       # Où acheter des composants
/buy location <lieu>       # Inventaire d'un magasin
```

### ℹ️ Aide (`/help`)
```
/help                      # Aide générale
/help <commande>           # Aide spécifique
```

## 🤖 Configuration de l'IA (Optionnelle)

Le bot fonctionne parfaitement **sans IA** avec sa base de connaissances locale. Pour activer l'IA gratuite Hugging Face :

### 1. Obtenir un token Hugging Face (Gratuit)
```bash
# 1. Créez un compte sur https://huggingface.co (gratuit)
# 2. Accédez à https://huggingface.co/settings/tokens
# 3. Créez un nouveau token avec rôle "read"
# 4. Copiez le token (commence par hf_...)
```

### 2. Configuration dans .env
```bash
# Ajoutez votre token dans le fichier .env
HUGGINGFACE_TOKEN=hf_votre_token_ici
```

### 3. Redémarrer le bot
```bash
npm restart
```

### ✨ Fonctionnalités IA
- **Conseils personnalisés** : Réponses adaptées à vos questions spécifiques
- **Intégration guides RSI** : IA enrichie par les guides officiels Spectrum
- **Cache intelligent** : Optimisation automatique des requêtes
- **Mode fallback** : Fonctionne toujours même sans IA

> **Note** : L'IA est **totalement optionnelle**. Le bot reste pleinement fonctionnel avec les guides RSI Spectrum et la base de connaissances locale.

## 📊 Exemples d'Utilisation

### Conseils IA Personnalisés
```
/ai conseil "Je débute, quel vaisseau choisir ?"
→ Conseil IA + guides RSI + recommandations SC 4.2
```

### Guides Officiels RSI
```
/guides categorie debutant
→ Guide officiel RSI avec conseils essentiels
```

### Recherche de Vaisseau
```
/ship info Hornet F7C
→ Statistiques complètes, prix, rôle, spécifications de combat
```

### Comparaison
```
/ship compare Sabre "Vanguard Warden"
→ Analyse détaillée des différences, recommandations
```

### Build PvP
```
/build pvp Sabre
→ Configuration optimisée, composants, coût total, stratégie
```

### Méta Actuel
```
/meta tier pvp
→ Tier list complète S-A-B-C-D avec raisonnements
```

## 🛠️ Fonctionnalités Techniques

### Base de Données Intelligente
- **SQLite** : Base légère et performante
- **Mise à jour automatique** : Données actualisées toutes les heures
- **Cache optimisé** : Réponses ultra-rapides
- **Nettoyage automatique** : Maintenance programmée

### Interface Avancée
- **Auto-complétion** : Suggestions intelligentes
- **Embeds riches** : Informations visuellement organisées
- **Système de cooldown** : Protection contre le spam
- **Gestion d'erreurs** : Messages explicites et logs détaillés

### Évolutivité
- **Architecture modulaire** : Facile à étendre
- **API intégrées** : Prêt pour futures intégrations
- **Logs complets** : Monitoring et débogage
- **Configuration flexible** : Adaptable à différents environnements

## 📈 Statistiques

- **🚀 15+ vaisseaux** dans la base de données
- **🔧 25+ builds** pré-configurés
- **⚔️ 4 méta** différents (PvP, PvE, Exploration, Cargo)
- **💰 50+ emplacements** d'achat référencés
- **📱 5 catégories** de commandes
- **🔄 Mises à jour** automatiques toutes les heures

## 🔧 Architecture

```
CityZenBot/
├── src/
│   ├── commands/          # Commandes Discord organisées par catégorie
│   │   ├── ships/         # Gestion des vaisseaux
│   │   ├── meta/          # Méta et tier lists
│   │   ├── builds/        # Système de builds
│   │   ├── purchase/      # Guides d'achat
│   │   └── general/       # Commandes générales
│   ├── services/          # Services métier
│   │   ├── DatabaseService.js    # Gestion BDD
│   │   └── StarCitizenService.js # Logic métier SC
│   ├── utils/             # Utilitaires
│   │   └── Logger.js      # Système de logs
│   └── data/              # Données du jeu
│       └── gameData.js    # Vaisseaux, builds, méta
├── database/              # Base SQLite
├── logs/                  # Logs quotidiens
└── docs/                  # Documentation
```

## 🚀 Roadmap

### Phase 1 - Actuelle ✅
- [x] Système de vaisseaux complet
- [x] Méta PvP/PvE
- [x] Builds de base
- [x] Guides d'achat
- [x] Auto-complétion

### Phase 2 - Prochaine 🔄
- [ ] Intégration API officielle Star Citizen
- [ ] Système de notifications patch
- [ ] Builds collaboratifs avec votes
- [ ] Prix temps réel des vaisseaux
- [ ] Dashboard web

### Phase 3 - Future 🎯
- [ ] Intelligence artificielle pour recommandations
- [ ] Intégration Spectrum (forum officiel)
- [ ] Système d'organisations et flottilles
- [ ] API publique pour développeurs
- [ ] Mobile app companion

## 🤝 Contribution

### Comment Contribuer
1. **Fork** le projet
2. **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Types de Contributions
- 🐛 **Bug fixes** : Corrections de bugs
- ✨ **Features** : Nouvelles fonctionnalités
- 📚 **Documentation** : Améliorations de la doc
- 🎨 **UI/UX** : Améliorations visuelles
- 🔧 **Refactoring** : Optimisations code
- 📊 **Data** : Mise à jour des données du jeu

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🎯 Support

### 🆘 Besoin d'Aide ?
- 📖 **Documentation** : Consultez [INSTALLATION.md](INSTALLATION.md)
- 🐛 **Bugs** : Ouvrez une [Issue GitHub](issues)
- 💬 **Discord** : Rejoignez notre serveur de support
- 📧 **Email** : contact@cityzenbot.com

### 🔧 Dépannage Rapide
| Problème | Solution |
|----------|----------|
| Bot hors ligne | Vérifiez le token Discord |
| Commandes lentes | Redémarrez le bot |
| Données obsolètes | `/meta patch` pour voir les MàJ |
| Erreur base de données | Supprimez `database/*.db` |

---

**⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît !**

*Développé avec ❤️ pour la communauté Star Citizen*
