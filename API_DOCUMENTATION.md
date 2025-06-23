# 🌐 Configuration des APIs Star Citizen

## 📡 Sources de Données Intégrées

### 🚀 **Fleetyards** (Données des vaisseaux)
- **URL**: https://api.fleetyards.net/v1
- **Type**: Vaisseaux, spécifications, prix
- **Fréquence**: Mise à jour quotidienne
- **Fiabilité**: ⭐⭐⭐⭐⭐
- **Documentation**: https://fleetyards.net/api

**Données disponibles:**
- Spécifications complètes des vaisseaux
- Prix en $USD et aUEC estimés
- Status de production (concept/flight-ready)
- Dimensions et caractéristiques techniques

### 💰 **UEX Corp** (Prix et commerce)
- **URL**: https://api.uexcorp.space/2.0
- **Type**: Prix des commodités, stations
- **Fréquence**: Mise à jour temps réel
- **Fiabilité**: ⭐⭐⭐⭐⭐
- **Documentation**: https://uexcorp.space/api

**Données disponibles:**
- Prix d'achat/vente des commodités
- Meilleures routes commerciales
- Stock des stations
- Données de trading en temps réel

### 🔧 **Erkul Games** (Builds et composants)
- **URL**: https://www.erkul.games/api
- **Type**: Builds optimisés, composants
- **Fréquence**: Mise à jour hebdomadaire
- **Fiabilité**: ⭐⭐⭐⭐⭐
- **Documentation**: Communautaire

**Données disponibles:**
- Builds populaires et optimisés
- Composants et leurs statistiques
- Configurations PvP/PvE/Mining
- Calculateur de loadouts

### 📍 **SC Unpacked** (Données de jeu extraites)
- **URL**: https://api.scunpacked.com
- **Type**: Locations, objets, données brutes
- **Fréquence**: Après chaque patch
- **Fiabilité**: ⭐⭐⭐⭐
- **Documentation**: https://scunpacked.com/api

**Données disponibles:**
- Emplacements et stations
- Données extraites du jeu
- Objets et items
- Coordonnées des locations

## ⚙️ Configuration du Bot

### Variables d'environnement
```env
# APIs externes (optionnel - URLs par défaut intégrées)
FLEETYARDS_API_URL=https://api.fleetyards.net/v1
UEX_API_URL=https://api.uexcorp.space/2.0
ERKUL_API_URL=https://www.erkul.games/api
SCUNPACKED_API_URL=https://api.scunpacked.com

# Configuration de mise à jour
DATA_UPDATE_INTERVAL=21600000  # 6 heures en millisecondes
DATA_UPDATE_ON_START=true      # Mise à jour au démarrage
DATA_FALLBACK_MODE=true        # Utiliser les données de secours si APIs indisponibles

# Cache
DATA_CACHE_SIZE=1000           # Nombre max d'éléments en cache
DATA_CACHE_TTL=3600000         # Durée de vie du cache (1h)
```

## 🔄 Système de Mise à Jour

### Automatique
- **Démarrage**: Mise à jour initiale au lancement du bot
- **Périodique**: Toutes les 6 heures par défaut
- **Intelligente**: Évite les mises à jour inutiles

### Manuelle
```bash
# Mise à jour via commande Discord
/admin update

# Mise à jour via script
node update-data.js

# Mise à jour forcée
node update-data.js --force
```

### Stratégie de secours
1. **API principale indisponible** → API secondaire
2. **Toutes les APIs indisponibles** → Données de secours
3. **Échec total** → Données statiques existantes

## 📊 Monitoring et Logs

### Logs de mise à jour
```
[INFO] 📡 Début de la mise à jour des données...
[INFO] ✅ Ships mis à jour avec succès (247 vaisseaux)
[INFO] ✅ Components mis à jour avec succès (1,543 composants)
[WARN] ⚠️ UEX indisponible, utilisation des données de secours
[INFO] 🎉 Mise à jour terminée: 4 succès, 1 échec
```

### Métriques disponibles
- Nombre de données par type
- Temps de réponse des APIs
- Taux de succès des mises à jour
- Dernière mise à jour réussie

## 🛠️ Maintenance

### Ajout d'une nouvelle API
1. Modifier `DataUpdateService.js`
2. Ajouter la méthode `updateXxxData()`
3. Intégrer dans `updateAllData()`
4. Tester avec `node update-data.js`

### Dépannage des APIs
```bash
# Tester la connectivité
curl -X GET "https://api.fleetyards.net/v1/ships?limit=1"

# Vérifier les données en cache
node -e "console.log(require('./src/services/DataUpdateService').prototype.getCachedData('ships'))"

# Forcer un rechargement
node update-data.js --force
```

## 🎯 Roadmap des Données

### Phase 1 ✅ (Actuelle)
- Vaisseaux complets (Fleetyards)
- Prix temps réel (UEX)
- Builds optimisés (Erkul)
- Locations (SC Unpacked)

### Phase 2 (À venir)
- Données des patches en temps réel
- Intégration Spectrum (forums)
- Alertes de changements importants
- Historique des prix

### Phase 3 (Futur)
- Machine Learning pour prédictions
- API RSI officielle (quand disponible)
- Données de performance des joueurs
- Recommandations personnalisées

## 🔒 Sécurité et Limites

### Rate Limiting
- Maximum 60 requêtes/minute par API
- Backoff exponentiel en cas d'erreur
- Cache pour éviter les requêtes répétées

### Données Sensibles
- Aucun token API requis actuellement
- Pas de données personnelles stockées
- Logs anonymisés

### Limitations Connues
- Erkul API parfois instable
- UEX peut avoir des données obsolètes
- Fleetyards manque certains vaisseaux récents

---

**🎉 Votre bot dispose maintenant d'un système de données ultra-moderne et automatisé !**
