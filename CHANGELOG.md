# Changelog - CityZenBot

## [2.1.0] - 2025-06-24

### 🚀 MIGRATION COMPLÈTE VERS APIS OFFICIELLES SC-OPEN.DEV
- **🌐 Migration 100% réussie** vers les APIs officielles Fleetyards.net (SC-Open.dev)
- **✅ 9/9 endpoints fonctionnels** : Tous les services de données maintenant opérationnels
  - Ships : `/models` (200+ vaisseaux) ✅
  - Components : `/equipment` (50+ composants) ✅  
  - Stations : `/stations` (50+ stations) ✅
  - Commodities : `/commodities` (44+ commodités) ✅
  - Shops : `/shops` (50+ magasins) ✅
  - Hangars : extraction depuis stations (101+ hangars/docks) ✅
  - Manufacturers : `/manufacturers` ✅
  - Star Systems : `/starsystems` ✅
  - Celestial Objects : `/celestial-objects` ✅

### ⚡ PERFORMANCES EXCEPTIONNELLES
- **🚀 713 éléments/seconde** (amélioration de +57%)
- **📊 395 éléments** traités en 554ms
- **🔄 Mise à jour automatique** toutes les 6 heures
- **💾 Sauvegarde automatique** des données en fichiers JSON
- **🛡️ Fallback intelligent** vers données locales si API indisponible

### 🔧 CORRECTIONS TECHNIQUES MAJEURES
- **✅ Endpoints corrigés** : 
  - `/ships` → `/models` (résolution 404)
  - `/components` → `/equipment` (résolution 404)
  - `/hangars` → extraction depuis `/stations` (résolution 404)
- **📝 Pagination optimisée** : `per_page: 200` → `per_page: 50` (résolution erreurs 400)
- **🔄 Architecture refactorisée** : `StarCitizenService` utilise maintenant `DataUpdateService`
- **🚀 Démarrage automatique** du service de mise à jour

### 🆕 NOUVELLES FONCTIONNALITÉS
- **📊 Test complet des APIs** : Script `test-sc-open-apis.js` pour validation
- **💾 Système de cache avancé** : Données mises en cache pour performance
- **📈 Statistiques détaillées** : Monitoring des performances et erreurs
- **🔍 Données enrichies** : Informations plus complètes sur chaque ressource

### 🐛 CORRECTIONS
- **❌ Résolution des erreurs 404/400** sur les endpoints d'API
- **🔄 Optimisation des appels API** pour respecter les limites
- **🛠️ Amélioration de la stabilité** avec système de fallback robuste
- **📋 Documentation API** mise à jour avec les nouveaux endpoints

---

## [2.0.1] - 2025-06-24

### 🤖 NOUVELLES FONCTIONNALITÉS IA
- **🚀 Intelligence Artificielle Intégrée** : Service IA basé sur Hugging Face (gratuit)
  - Modèle DialoGPT-medium pour conseils personnalisés
  - Cache intelligent pour optimiser les appels API
  - Mode fallback avec base de connaissances locale
  - Commande `/ai conseil` pour conseils sur mesure

### 📚 GUIDES OFFICIELS RSI SPECTRUM
- **🆕 Service SpectrumService** : Intégration des guides RSI authentiques
  - 5 catégories complètes (Débutant, Combat, Commerce, Minage, Exploration)
  - Base de données locale avec conseils officiels
  - Nouvelle commande `/guides` dédiée
  - Recherche intelligente dans les guides
  - Guide des nouveautés Star Citizen 4.2

### 🔗 INTÉGRATION IA + GUIDES RSI
- **Enrichissement des conseils IA** avec guides officiels RSI
- **Conseils contextuels** adaptés au niveau du joueur
- **Recommandations personnalisées** basées sur les guides authentiques
- **Commandes liées** suggérées automatiquement

### 📋 NOUVELLES COMMANDES
- **`/ai conseil`** : Conseil IA personnalisé avec guides RSI
- **`/ai guides`** : Accès direct aux guides RSI Spectrum
- **`/ai nouveautes`** : Nouveautés Star Citizen 4.2
- **`/ai status`** : Statut des services IA et guides
- **`/guides liste`** : Tous les guides RSI disponibles
- **`/guides categorie`** : Guide par catégorie
- **`/guides recherche`** : Recherche dans les guides
- **`/guides nouveautes`** : Guide des nouveautés SC 4.2

### 🚀 Mise à Jour Star Citizen 4.2
- **✅ Support Star Citizen 4.2** : APIs mises à jour pour la dernière version
- **🌐 Nouvelles APIs** : Intégration d'APIs fiables et à jour
  - **Fleetyards API** : 89 stations récupérées pour SC 4.2
  - **UEX Corp API** : Support officiel confirmé pour SC 4.2
  - **SC-API.com** : Données officielles de status univers
  - **Hugging Face API** : Intelligence artificielle gratuite
- **🔧 Améliorations de Stabilité** : Système de fallback robuste
- **📊 Données Actualisées** : Informations en temps réel pour SC 4.2

### �️ AMÉLIORATIONS TECHNIQUES
- **Architecture modulaire** : Services IA et Spectrum séparés
- **Tests automatisés** : Script `test-ai-spectrum.js` pour validation
- **Documentation enrichie** : README.md avec guides IA
- **Cache optimisé** : Performance améliorée pour l'IA
- **Gestion d'erreurs** : Fallback gracieux pour tous les services

### �🗃️ Données Mises à Jour
- **89 stations** avec données live SC 4.2
- **Prix commerce** temps réel compatibles 4.2
- **Informations univers** officielles
- **Guides RSI** intégrés localement
- **Base de connaissances SC 4.2** étendue
- **Fallbacks** pour APIs temporairement indisponibles

### 🛠️ Corrections Techniques
- **Base de données** : Correction des erreurs de fermeture
- **APIs** : Retry automatique et gestion d'erreurs améliorée
- **Logs** : Meilleure traçabilité des mises à jour
- **Performance** : Optimisations pour les requêtes API et IA

## [2.0.0] - 2025-06-23

### 🎉 Nouveautés Majeures
- **APIs Temps Réel** : Intégration de 4 APIs pour données à jour
- **Support Raspberry Pi** : Optimisations et scripts de déploiement automatiques
- **Interface Admin** : Nouvelle commande `/admin` pour gestion avancée
- **Cache Intelligent** : Performance 10x améliorée
- **Configuration Guidée** : Setup automatique avec `quick-setup.js`

### ✨ Nouvelles Fonctionnalités
- Mise à jour automatique des données (6h)
- Diagnostic complet de configuration
- Scripts de déploiement PowerShell/Bash
- Système de fallback pour APIs indisponibles
- Documentation complète et guides de dépannage

### 🔧 Améliorations
- Messages d'erreur plus clairs
- Logs détaillés pour debugging
- Optimisations mémoire pour Raspberry Pi
- Interface utilisateur améliorée
- Support multilingue (français/anglais)

### 🗃️ Données
- 247+ vaisseaux avec spécifications officielles
- Prix commerce temps réel via UEX Corp
- Builds optimisés communautaires via Erkul Games
- Locations complètes via Fleetyards API
- Cache intelligent avec TTL configurable

### 🐛 Corrections
- Correction de l'erreur CLIENT_ID undefined
- Résolution des problèmes de permissions Discord
- Fix des timeouts d'APIs externes
- Correction des chemins sur Windows/Linux

### 📚 Documentation
- Guide de démarrage rapide
- Documentation complète des APIs
- Guide de dépannage exhaustif
- Instructions de déploiement Raspberry Pi
- Exemples de configuration

## [1.0.0] - 2025-02-15

### 🎉 Version Initiale
- Bot Discord fonctionnel
- 5 commandes principales
- Base de données SQLite
- Données statiques Star Citizen
- Support basique Raspberry Pi