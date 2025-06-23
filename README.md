# Star Citizen Discord Bot - CityZenBot

Un bot Discord complet pour Star Citizen qui fournit des informations sur les vaisseaux, les méta PvP/PvE, les builds optimisés et les emplacements d'achat.

![Star Citizen Bot](https://img.shields.io/badge/Star%20Citizen-Bot-blue)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Node.js](https://img.shields.io/badge/node.js-18+-green)
![SQLite](https://img.shields.io/badge/database-SQLite-orange)

## 🌟 Fonctionnalités

### 🚀 **Système de Vaisseaux Complet**
- **Base de données étendue** : Plus de 15 vaisseaux avec statistiques détaillées
- **Recherche intelligente** : Par nom, fabricant, rôle ou spécifications
- **Comparaisons avancées** : Analysez les différences entre vaisseaux
- **Recommandations par rôle** : Combat, cargo, exploration, mining
- **Auto-complétion** : Interface intuitive avec suggestions automatiques

### ⚔️ **Méta PvP/PvE Actualisé**
- **Tier Lists dynamiques** : Classements S-A-B-C-D pour PvP et PvE
- **Analyses détaillées** : Raisonnement derrière chaque classement
- **Mises à jour automatiques** : Suivit des patches et changements
- **Stratégies adaptées** : Conseils spécifiques par type de gameplay

### 🔧 **Système de Builds Avancé**
- **Builds optimisés** : Configurations PvP/PvE pré-testées
- **Composants détaillés** : Armes, boucliers, moteurs, refroidissement
- **Coûts calculés** : Prix total en aUEC pour chaque build
- **Builds communautaires** : Création et partage de configurations personnalisées
- **Guides d'optimisation** : Conseils pour maximiser les performances

### � **Guide d'Achat Complet**
- **Emplacements précis** : Où acheter chaque vaisseau et composant
- **Prix actualisés** : Informations de coût en aUEC
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

## 📊 Exemples d'Utilisation

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
