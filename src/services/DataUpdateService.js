// Service de mise à jour des données Star Citizen
// Utilise les APIs officielles et communautaires pour maintenir les données à jour

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const Logger = require('../utils/Logger');

class DataUpdateService {    constructor() {
        this.apis = {
            // APIs officielles SC-Open.dev (dernières versions)
            fleetyards: 'https://api.fleetyards.net/v1',
            fleetyardsLive: 'https://api.fleetyards.net/live/v1',
            
            // APIs communautaires vérifiées
            uex: 'https://api.uexcorp.space/2.0',
            scapi: 'https://api.sc-api.com/v1',
            
            // APIs secondaires (peuvent être instables)
            erkul: 'https://api.erkul.games',
            scunpacked: 'https://scunpacked.com/api'
        };
        
        this.lastUpdate = null;
        this.updateInterval = 1000 * 60 * 60 * 6; // 6 heures
        this.dataCache = new Map();
    }

    // Démarrer les mises à jour automatiques
    startAutoUpdate() {
        Logger.info('🔄 Démarrage du service de mise à jour automatique');
        
        // Première mise à jour immédiate
        this.updateAllData();
        
        // Puis mise à jour régulière
        setInterval(() => {
            this.updateAllData();
        }, this.updateInterval);
    }

    // Mise à jour de toutes les données
    async updateAllData() {
        try {
            Logger.info('📡 Début de la mise à jour des données...');
              // Mise à jour en parallèle pour optimiser le temps
            const updates = await Promise.allSettled([
                this.updateShipsData(),
                this.updateComponentsData(),
                this.updatePricesData(),
                this.updateLocationsData(),
                this.updateBuildsData(),
                this.updateStarCitizenData(),
                this.updateCommoditiesData(),
                this.updateShopsData(),
                this.updateHangarsData(),
                this.updateStationsData()
            ]);

            // Analyser les résultats
            let successful = 0;
            let failed = 0;
            
            updates.forEach((result, index) => {
                const sources = ['Ships', 'Components', 'Prices', 'Locations', 'Builds', 'Star Citizen API', 'Commodities', 'Shops', 'Hangars', 'Stations'];
                if (result.status === 'fulfilled') {
                    Logger.info(`✅ ${sources[index]} mis à jour avec succès`);
                    successful++;
                } else {
                    Logger.error(`❌ Échec mise à jour ${sources[index]}:`, result.reason);
                    failed++;
                }
            });

            this.lastUpdate = new Date();
            Logger.info(`🎉 Mise à jour terminée: ${successful} succès, ${failed} échecs`);
            
            // Sauvegarder les données mises à jour
            await this.saveUpdatedData();
            
        } catch (error) {
            Logger.error('❌ Erreur lors de la mise à jour globale:', error);
        }
    }    // Mise à jour des données de vaisseaux
    async updateShipsData() {
        try {
            // Fleetyards API officielle (SC-Open.dev) - Endpoint correct : /models
            const response = await axios.get(`${this.apis.fleetyards}/models`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },                params: {
                    per_page: 50,
                    page: 1
                }
            });

            const ships = response.data.map(ship => ({
                id: ship.id,
                name: ship.name || 'Unknown',
                slug: ship.slug,
                manufacturer: ship.manufacturer?.name || 'Unknown',
                manufacturer_code: ship.manufacturer?.code,
                role: ship.classification?.name || ship.focus || 'Multi-role',
                size: ship.size || 'Unknown',
                crew_min: ship.minCrew || 1,
                crew_max: ship.maxCrew || ship.minCrew || 1,
                cargo_capacity: ship.cargo || 0,
                max_speed: ship.scmSpeed || 0,
                afterburner_speed: ship.afterburnerSpeed || 0,
                price_auec: ship.lastPledgePrice ? ship.lastPledgePrice * 45000 : null, // Taux de change mis à jour
                price_usd: ship.lastPledgePrice || null,
                flight_ready: ship.productionStatus === 'flight-ready',
                concept: ship.productionStatus === 'concept',
                production_status: ship.productionStatus,
                data: {
                    health: ship.health || 0,
                    shields: ship.shield?.health || 0,
                    weapons: ship.hardpoints?.weapons || 'Non spécifié',
                    missiles: ship.hardpoints?.missiles || 'Non spécifié',
                    length: ship.length,
                    beam: ship.beam,
                    height: ship.height,
                    mass: ship.mass,
                    description: ship.description,
                    slug: ship.slug,
                    store_image: ship.storeImage,
                    store_image_large: ship.storeImageLarge,
                    fleetchart_image: ship.fleetchartImage,
                    brochure: ship.brochure,
                    holo_colored: ship.holoColored,
                    angledView: ship.angledView,
                    sideView: ship.sideView,
                    topView: ship.topView,
                    last_pledge_price: ship.lastPledgePrice,
                    last_pledge_date: ship.lastPledgeDate,
                    rsi_id: ship.rsiId,
                    rsi_name: ship.rsiName,
                    rsi_slug: ship.rsiSlug
                }
            }));

            this.dataCache.set('ships', ships);
            Logger.info(`📊 ${ships.length} vaisseaux mis à jour depuis Fleetyards API officielle (SC-Open.dev)`);
            
            return ships;
        } catch (error) {
            Logger.warn('⚠️ Fleetyards API officielle indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return this.getFallbackShipsData();        }
    }

    // Mise à jour des composants
    async updateComponentsData() {
        try {
            // Fleetyards API pour l'équipement (SC-Open.dev officielle) - Endpoint correct : /equipment
            const response = await axios.get(`${this.apis.fleetyards}/equipment`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },
                params: {
                    per_page: 50
                }
            });

            const components = response.data.map(comp => ({
                id: comp.id,
                name: comp.name || 'Unknown',
                slug: comp.slug,
                component_class: comp.componentClass,
                type: comp.type || 'Unknown',
                size: comp.size || 'Unknown',
                grade: comp.grade || 'Unknown',
                manufacturer: comp.manufacturer ? {
                    id: comp.manufacturer.id,
                    name: comp.manufacturer.name,
                    slug: comp.manufacturer.slug,
                    code: comp.manufacturer.code
                } : null,
                price_auec: comp.pledgePrice ? comp.pledgePrice * 45000 : null,
                price_usd: comp.pledgePrice || null,
                stats: comp.stats || {},
                description: comp.description,
                store_image: comp.storeImage,
                store_image_large: comp.storeImageLarge,
                item_type: comp.itemType,
                item_class: comp.itemClass,
                version: '4.2',
                created_at: comp.createdAt,
                updated_at: comp.updatedAt
            }));

            this.dataCache.set('components', components);
            Logger.info(`🔧 ${components.length} composants mis à jour depuis Fleetyards API officielle (SC-Open.dev)`);
            
            return components;
        } catch (error) {
            Logger.warn('⚠️ Fleetyards composants API indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return this.getFallbackComponentsData();
        }
    }

    // Mise à jour des prix
    async updatePricesData() {
        try {
            // UEX Corp API pour les prix (SC 4.2 confirmé)
            const response = await axios.get(`${this.apis.uex}/commodities`, {
                timeout: 15000,
                headers: { 'User-Agent': 'CityZenBot/2.0' }
            });

            const prices = response.data.map(item => ({
                name: item.name || item.commodity_name,
                category: item.category || item.type,
                buy_price: item.price_buy || item.priceMAX,
                sell_price: item.price_sell || item.priceMIN,
                best_buy_location: item.best_buy_location || item.bestBuyLocation,
                best_sell_location: item.best_sell_location || item.bestSellLocation,
                last_updated: item.date_modified || item.dateModified || new Date().toISOString(),
                scu_price: item.price_per_scu || item.price,
                availability: item.availability || 'unknown',
                version: '4.2'
            }));

            this.dataCache.set('prices', prices);
            Logger.info(`💰 ${prices.length} prix mis à jour depuis UEX Corp (SC 4.2)`);
            
            return prices;
        } catch (error) {
            Logger.warn('⚠️ UEX Corp indisponible, utilisation des données de secours');
            return this.getFallbackPricesData();
        }
    }    // Mise à jour des emplacements
    async updateLocationsData() {
        try {
            // Fleetyards pour les stations (SC-Open.dev API officielle)
            const response = await axios.get(`${this.apis.fleetyards}/stations`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },
                params: {
                    per_page: 50
                }
            });

            const locations = response.data.map(station => ({
                id: station.id,
                name: station.name || 'Unknown',
                slug: station.slug,
                type: station.stationType || 'Station',
                classification: station.classification,
                size: station.size,
                system: station.starsystem?.name || 'Unknown',
                system_slug: station.starsystem?.slug,
                planet: station.celestialObject?.name || 'Unknown',
                planet_slug: station.celestialObject?.slug,
                description: station.description || '',
                services: station.docks?.map(dock => dock.name) || [],
                coordinates: null,
                shops: station.shops || [],
                docks: station.docks || [],
                cargo_hub: station.cargoHub || false,
                refinery: station.refinery || false,
                habitable: station.habitable || false,
                store_image: station.storeImage,
                store_image_large: station.storeImageLarge,
                version: '4.2',
                created_at: station.createdAt,
                updated_at: station.updatedAt
            }));

            this.dataCache.set('locations', locations);
            Logger.info(`📍 ${locations.length} stations mises à jour depuis Fleetyards API officielle (SC-Open.dev)`);
            
            return locations;
        } catch (error) {
            Logger.warn('⚠️ Fleetyards stations API indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return this.getFallbackLocationsData();
        }
    }

    // Mise à jour des builds
    async updateBuildsData() {
        try {
            // Données de builds - fallback vers données statiques
            Logger.warn('⚠️ Builds depuis APIs externes non fiables, utilisation des données de secours');
            return this.getFallbackBuildsData();
        } catch (error) {
            Logger.warn('⚠️ Builds indisponibles, utilisation des données de secours');
            return this.getFallbackBuildsData();
        }
    }    // Mise à jour des données Star Citizen API
    async updateStarCitizenData() {
        try {
            // SC-API pour les données officielles SC 4.2
            const response = await axios.get(`${this.apis.scapi}/live/status`, {
                timeout: 10000,
                headers: { 'User-Agent': 'CityZenBot/2.0' }
            });

            const scData = {
                universe_status: response.data.status || 'unknown',
                players_online: response.data.players || 0,
                servers_available: response.data.servers || 0,
                version: response.data.version || '4.2',
                last_update: new Date().toISOString()
            };

            this.dataCache.set('star_citizen_official', scData);
            Logger.info(`🌌 Données SC API mises à jour - Version: ${scData.version}, Statut: ${scData.universe_status}`);
            
            return scData;
        } catch (error) {
            Logger.warn('⚠️ SC API indisponible, utilisation des données de secours');
            return this.getFallbackStarCitizenData();
        }
    }

    // Nouvelle méthode : Mise à jour des commodités
    async updateCommoditiesData() {
        try {
            const response = await axios.get(`${this.apis.fleetyards}/commodities`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },
                params: {
                    per_page: 50
                }
            });

            const commodities = response.data.map(commodity => ({
                id: commodity.id,
                name: commodity.name,
                slug: commodity.slug,
                commodity_type: commodity.commodityType,
                store_image: commodity.storeImage,
                description: commodity.description,
                created_at: commodity.createdAt,
                updated_at: commodity.updatedAt
            }));

            this.dataCache.set('commodities', commodities);
            Logger.info(`📦 ${commodities.length} commodités mises à jour depuis Fleetyards API officielle`);
            
            return commodities;
        } catch (error) {
            Logger.warn('⚠️ Commodités API indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return [];
        }
    }

    // Nouvelle méthode : Mise à jour des magasins
    async updateShopsData() {
        try {
            const response = await axios.get(`${this.apis.fleetyards}/shops`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },
                params: {
                    per_page: 50
                }
            });

            const shops = response.data.map(shop => ({
                id: shop.id,
                name: shop.name,
                slug: shop.slug,
                shop_type: shop.shopType,
                station: shop.station ? {
                    id: shop.station.id,
                    name: shop.station.name,
                    slug: shop.station.slug
                } : null,
                celestial_object: shop.celestialObject ? {
                    id: shop.celestialObject.id,
                    name: shop.celestialObject.name,
                    slug: shop.celestialObject.slug
                } : null,
                starsystem: shop.starsystem ? {
                    id: shop.starsystem.id,
                    name: shop.starsystem.name,
                    slug: shop.starsystem.slug
                } : null,
                buying: shop.buying || false,
                selling: shop.selling || false,
                rental: shop.rental || false,
                store_image: shop.storeImage,
                created_at: shop.createdAt,
                updated_at: shop.updatedAt
            }));

            this.dataCache.set('shops', shops);
            Logger.info(`🛒 ${shops.length} magasins mis à jour depuis Fleetyards API officielle`);
            
            return shops;
        } catch (error) {
            Logger.warn('⚠️ Magasins API indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return [];
        }
    }    // Nouvelle méthode : Mise à jour des hangars (basée sur les docks des stations)
    async updateHangarsData() {
        try {
            // Les hangars/docks sont maintenant intégrés dans les données des stations
            // Récupérer toutes les stations avec leurs docks/hangars
            const response = await axios.get(`${this.apis.fleetyards}/stations`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },
                params: {
                    per_page: 50
                }
            });

            const hangars = [];
            
            // Extraire les informations de hangars/docks depuis chaque station
            response.data.forEach(station => {
                if (station.dockCounts && station.dockCounts.length > 0) {
                    station.dockCounts.forEach(dock => {
                        hangars.push({
                            id: `${station.slug}-${dock.type}-${dock.size}`,
                            name: `${station.name} - ${dock.typeLabel} ${dock.sizeLabel || dock.size}`,
                            slug: `${station.slug}-${dock.type}-${dock.size}`,
                            hangar_type: dock.type,
                            classification: dock.typeLabel,
                            size: dock.size,
                            count: dock.count,
                            station_name: station.name,
                            station_slug: station.slug,
                            location_label: station.locationLabel,
                            station_type: station.type,
                            store_image: station.storeImage,
                            created_at: station.createdAt,
                            updated_at: station.updatedAt
                        });
                    });
                }
                
                // Ajouter également les docks détaillés s'ils existent
                if (station.docks && station.docks.length > 0) {
                    station.docks.forEach(dock => {
                        hangars.push({
                            id: `${station.slug}-dock-${dock.name}`,
                            name: `${station.name} - Dock ${dock.name}`,
                            slug: `${station.slug}-dock-${dock.name}`,
                            hangar_type: dock.type,
                            classification: dock.typeLabel || dock.type,
                            size: dock.size,
                            dock_name: dock.name,
                            station_name: station.name,
                            station_slug: station.slug,
                            location_label: station.locationLabel,
                            station_type: station.type,
                            store_image: station.storeImage,
                            created_at: station.createdAt,
                            updated_at: station.updatedAt
                        });
                    });
                }
            });

            this.dataCache.set('hangars', hangars);
            Logger.info(`🏢 ${hangars.length} hangars/docks mis à jour depuis les stations Fleetyards API`);
            
            return hangars;
        } catch (error) {
            Logger.warn('⚠️ Hangars API indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return [];
        }
    }

    // Nouvelle méthode : Mise à jour des stations (version améliorée)
    async updateStationsData() {
        try {
            const response = await axios.get(`${this.apis.fleetyards}/stations`, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'CityZenBot/2.0',
                    'Accept': 'application/json'
                },
                params: {
                    per_page: 50
                }
            });

            const stations = response.data.map(station => ({
                id: station.id,
                name: station.name,
                slug: station.slug,
                station_type: station.stationType,
                classification: station.classification,
                size: station.size,
                cargo_hub: station.cargoHub || false,
                refinery: station.refinery || false,
                celestial_object: station.celestialObject ? {
                    id: station.celestialObject.id,
                    name: station.celestialObject.name,
                    slug: station.celestialObject.slug,
                    designation: station.celestialObject.designation
                } : null,
                starsystem: station.starsystem ? {
                    id: station.starsystem.id,
                    name: station.starsystem.name,
                    slug: station.starsystem.slug
                } : null,
                description: station.description,
                habitable: station.habitable || false,
                shops: station.shops || [],
                docks: station.docks || [],
                store_image: station.storeImage,
                store_image_large: station.storeImageLarge,
                created_at: station.createdAt,
                updated_at: station.updatedAt
            }));

            this.dataCache.set('stations', stations);
            Logger.info(`🚉 ${stations.length} stations mises à jour depuis Fleetyards API officielle`);
            
            return stations;
        } catch (error) {
            Logger.warn('⚠️ Stations API indisponible, utilisation des données de secours');
            Logger.error('Détails erreur:', error.message);
            return [];
        }
    }

    // Sauvegarder les données mises à jour
    async saveUpdatedData() {
        try {
            const dataPath = path.join(__dirname, '..', 'data');
            
            // Créer le répertoire s'il n'existe pas
            await fs.mkdir(dataPath, { recursive: true });
            
            // Sauvegarder chaque type de données
            for (const [type, data] of this.dataCache) {
                const filename = `${type}_updated.json`;
                const filepath = path.join(dataPath, filename);
                
                await fs.writeFile(filepath, JSON.stringify({
                    last_updated: this.lastUpdate,
                    count: data.length,
                    version: '4.2',
                    data: data
                }, null, 2));
                
                Logger.info(`💾 Données ${type} sauvegardées dans ${filename}`);
            }
            
        } catch (error) {
            Logger.error('❌ Erreur lors de la sauvegarde:', error);
        }
    }

    // Données de secours si APIs indisponibles
    getFallbackShipsData() {
        try {
            const gameData = require('../data/gameData');
            return gameData.SHIPS_DATA || [];
        } catch (error) {
            return [];
        }
    }

    getFallbackComponentsData() {
        return [];
    }

    getFallbackPricesData() {
        return [];
    }

    getFallbackLocationsData() {
        try {
            const gameData = require('../data/gameData');
            return gameData.PURCHASE_LOCATIONS || [];
        } catch (error) {
            return [];
        }
    }

    getFallbackBuildsData() {
        try {
            const gameData = require('../data/gameData');
            return gameData.SHIP_BUILDS || [];
        } catch (error) {
            return [];
        }
    }

    getFallbackStarCitizenData() {
        return {
            universe_status: 'unknown',
            players_online: 0,
            servers_available: 0,
            ships_count: 0,
            official_ships: [],
            version: '4.2',
            last_update: new Date().toISOString(),
            fallback: true
        };
    }

    // Obtenir les données en cache
    getCachedData(type) {
        return this.dataCache.get(type) || [];
    }

    // Forcer une mise à jour immédiate
    async forceUpdate() {
        Logger.info('🔄 Mise à jour forcée demandée');
        await this.updateAllData();
    }

    // Obtenir le statut du service
    getStatus() {
        return {
            lastUpdate: this.lastUpdate,
            cacheSize: this.dataCache.size,
            nextUpdate: this.lastUpdate ? 
                new Date(this.lastUpdate.getTime() + this.updateInterval) : 
                'En attente',
            cachedTypes: Array.from(this.dataCache.keys()),
            version: '4.2'
        };
    }    // Tester la disponibilité des APIs
    async testAPIAvailability() {
        const results = {};
        
        for (const [name, url] of Object.entries(this.apis)) {
            try {
                const response = await axios.get(url, {
                    timeout: 5000,
                    headers: { 'User-Agent': 'CityZenBot/2.0' }
                });
                
                results[name] = {
                    status: 'available',
                    code: response.status,
                    url: url
                };
            } catch (error) {
                results[name] = {
                    status: 'unavailable',
                    error: error.message,
                    url: url
                };
            }
        }
        
        return results;    }

    // Nouvelle méthode : Tester les nouveaux endpoints officiels SC-Open.dev
    async testOfficialEndpoints() {        const endpoints = {
            ships: `${this.apis.fleetyards}/models?per_page=1`, // Endpoint correct pour les vaisseaux
            components: `${this.apis.fleetyards}/equipment?per_page=1`, // Endpoint pour l'équipement/composants
            stations: `${this.apis.fleetyards}/stations?per_page=1`,
            commodities: `${this.apis.fleetyards}/commodities?per_page=1`,
            shops: `${this.apis.fleetyards}/shops?per_page=1`,
            hangars: `${this.apis.fleetyards}/stations?per_page=1`, // Les hangars sont dans les stations
            manufacturers: `${this.apis.fleetyards}/manufacturers?per_page=1`,
            starsystems: `${this.apis.fleetyards}/starsystems?per_page=1`,
            celestial_objects: `${this.apis.fleetyards}/celestial-objects?per_page=1`
        };

        const results = {};
        
        for (const [name, url] of Object.entries(endpoints)) {
            try {
                const response = await axios.get(url, {
                    timeout: 10000,
                    headers: { 
                        'User-Agent': 'CityZenBot/2.0',
                        'Accept': 'application/json'
                    }
                });
                
                results[name] = {
                    status: 'available',
                    code: response.status,
                    count: Array.isArray(response.data) ? response.data.length : 'N/A',
                    sample_data: Array.isArray(response.data) && response.data.length > 0 ? 
                        Object.keys(response.data[0]).slice(0, 5) : 'N/A',
                    url: url
                };
                
                Logger.info(`✅ ${name}: ${results[name].count} éléments disponibles`);
            } catch (error) {
                results[name] = {
                    status: 'unavailable',
                    error: error.message,
                    url: url
                };
                
                Logger.error(`❌ ${name}: ${error.message}`);
            }
        }
        
        return results;
    }

    // Nouvelle méthode : Obtenir les statistiques des nouvelles APIs
    async getAPIStatistics() {
        const stats = {
            ships: this.dataCache.get('ships')?.length || 0,
            components: this.dataCache.get('components')?.length || 0,
            stations: this.dataCache.get('stations')?.length || 0,
            locations: this.dataCache.get('locations')?.length || 0,
            commodities: this.dataCache.get('commodities')?.length || 0,
            shops: this.dataCache.get('shops')?.length || 0,
            hangars: this.dataCache.get('hangars')?.length || 0,
            total_cached_items: 0,
            last_update: this.lastUpdate,
            api_version: 'SC-Open.dev v1',
            star_citizen_version: '4.2+'
        };

        stats.total_cached_items = Object.values(stats).reduce((sum, val) => 
            typeof val === 'number' ? sum + val : sum, 0
        );

        return stats;
    }
}

module.exports = DataUpdateService;
