const axios = require('axios');
const cheerio = require('cheerio');
const DatabaseService = require('./DatabaseService');
const DataUpdateService = require('./DataUpdateService');
const Logger = require('../utils/Logger');

class StarCitizenService {
    constructor() {
        this.lastUpdate = null;
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
        this.dataUpdateService = new DataUpdateService();
        
        // URLs des sources de données officielles SC-Open.dev
        this.dataSources = {
            fleetyards: 'https://api.fleetyards.net/v1',
            fleetyardsLive: 'https://api.fleetyards.net/live/v1',
            erkul: 'https://www.erkul.games',
            scUnpacked: 'https://api.scunpacked.com',
            starcitizenWiki: 'https://starcitizen.fandom.com/api.php'
        };
    }    async initialize() {
        try {
            Logger.info('Initialisation du service Star Citizen...');
            
            // Démarrer le service de mise à jour automatique
            this.dataUpdateService.startAutoUpdate();
            
            // Charger les données initiales
            await this.loadInitialData();
            
            Logger.info('Service Star Citizen initialisé');
        } catch (error) {
            Logger.error('Erreur lors de l\'initialisation du service Star Citizen:', error);
            throw error;
        }
    }async loadInitialData() {
        try {
            // Charger les données des vaisseaux depuis les sources
            await this.updateShipsData();
            await this.updateComponentsData();
            await this.updateMetaData();
            await this.loadInitialBuilds();
            
            this.lastUpdate = new Date();
        } catch (error) {
            Logger.error('Erreur lors du chargement des données initiales:', error);
            // Ne pas throw pour permettre au bot de démarrer même si les données ne sont pas à jour
        }
    }    async updateData() {
        try {
            Logger.info('Mise à jour des données Star Citizen...');
            
            // Utiliser le DataUpdateService pour la mise à jour complète
            await this.dataUpdateService.updateAllData();
            
            this.lastUpdate = new Date();
            this.cache.clear(); // Vider le cache après mise à jour
            
            Logger.info('Données mises à jour avec succès');
        } catch (error) {
            Logger.error('Erreur lors de la mise à jour des données:', error);
        }
    }    async updateShipsData() {
        try {
            Logger.info('Mise à jour des vaisseaux via API Fleetyards...');
            
            // Utiliser le DataUpdateService pour récupérer les données via l'API officielle
            const ships = await this.dataUpdateService.updateShipsData();
            
            if (ships && ships.length > 0) {
                // Sauvegarder en base de données
                for (const ship of ships) {
                    await DatabaseService.upsertShip(ship);
                }
                Logger.info(`✅ Mis à jour ${ships.length} vaisseaux depuis l'API Fleetyards`);
            } else {
                Logger.warn('⚠️ Aucun vaisseau récupéré depuis l\'API');
            }
        } catch (error) {
            Logger.error('❌ Erreur lors de la mise à jour des vaisseaux:', error);
            
            // Fallback vers les données locales si l'API échoue
            try {
                const { SHIPS_DATA } = require('../data/gameData');
                for (const ship of SHIPS_DATA) {
                    await DatabaseService.upsertShip(ship);
                }
                Logger.info(`📦 Fallback: Mis à jour ${SHIPS_DATA.length} vaisseaux depuis les données locales`);
            } catch (fallbackError) {
                Logger.error('❌ Erreur fallback vaisseaux:', fallbackError);
            }
        }
    }    async updateComponentsData() {
        try {
            Logger.info('Mise à jour des composants via API Fleetyards...');
            
            // Utiliser le DataUpdateService pour récupérer les données via l'API officielle
            const components = await this.dataUpdateService.updateComponentsData();
            
            if (components && components.length > 0) {
                // Sauvegarder en base de données (vous devrez peut-être créer cette méthode)
                // Pour l'instant, on utilise le cache du DataUpdateService
                Logger.info(`✅ Mis à jour ${components.length} composants depuis l'API Fleetyards`);
            } else {
                Logger.warn('⚠️ Aucun composant récupéré depuis l\'API');
            }
        } catch (error) {
            Logger.error('❌ Erreur lors de la mise à jour des composants:', error);
        }
    }async updateMetaData() {
        try {
            const { META_DATA } = require('../data/gameData');

            for (const meta of META_DATA) {
                await DatabaseService.updateMetaData(meta);
            }

            Logger.info(`Mis à jour ${META_DATA.length} entrées de meta`);
        } catch (error) {
            Logger.error('Erreur lors de la mise à jour des méta:', error);
        }
    }    async updatePurchaseLocations() {
        // Cette méthode serait implémentée pour mettre à jour les emplacements d'achat
        Logger.info('Mise à jour des emplacements d\'achat (placeholder)');
    }

    async loadInitialBuilds() {
        try {
            const { BUILDS_DATA } = require('../data/gameData');

            for (const build of BUILDS_DATA) {
                // Vérifier si le build existe déjà
                const existingBuilds = await DatabaseService.getBuildsByShip(build.ship_name);
                const buildExists = existingBuilds.some(existing => 
                    existing.build_name === build.build_name && 
                    existing.build_type === build.build_type
                );

                if (!buildExists) {
                    await DatabaseService.insertBuild(build);
                }
            }

            Logger.info(`Chargé ${BUILDS_DATA.length} builds de base`);
        } catch (error) {
            Logger.error('Erreur lors du chargement des builds:', error);
        }
    }

    // Méthodes de récupération de données avec cache
    async getShipInfo(shipName) {
        const cacheKey = `ship_${shipName.toLowerCase()}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const ship = await DatabaseService.getShip(shipName);
        
        if (ship) {
            this.cache.set(cacheKey, {
                data: ship,
                timestamp: Date.now()
            });
        }

        return ship;
    }

    async searchShips(searchTerm) {
        const cacheKey = `search_${searchTerm.toLowerCase()}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const ships = await DatabaseService.searchShips(searchTerm);
        
        this.cache.set(cacheKey, {
            data: ships,
            timestamp: Date.now()
        });

        return ships;
    }

    async getShipsByRole(role) {
        const cacheKey = `role_${role.toLowerCase()}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const ships = await DatabaseService.getShipsByRole(role);
        
        this.cache.set(cacheKey, {
            data: ships,
            timestamp: Date.now()
        });

        return ships;
    }    async getMetaData(category) {
        const cacheKey = `meta_${category.toLowerCase()}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const meta = await DatabaseService.getMetaByCategory(category);
        
        this.cache.set(cacheKey, {
            data: meta,
            timestamp: Date.now()
        });

        return meta;
    }

    // Nouvelles méthodes pour les données SC-Open.dev

    async getCommodities(searchTerm = null) {
        const cacheKey = searchTerm ? `commodities_${searchTerm.toLowerCase()}` : 'commodities_all';
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }        try {
            let commodities = this.dataUpdateService.getCachedData('commodities') || [];
            
            if (searchTerm) {
                commodities = commodities.filter(commodity => 
                    commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    commodity.commodity_type.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            this.cache.set(cacheKey, {
                data: commodities,
                timestamp: Date.now()
            });

            return commodities;
        } catch (error) {
            Logger.error('Erreur lors de la récupération des commodités:', error);
            return [];
        }
    }

    async getShops(searchTerm = null, shopType = null) {
        const cacheKey = `shops_${searchTerm || 'all'}_${shopType || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }        try {
            let shops = this.dataUpdateService.getCachedData('shops') || [];
            
            if (searchTerm) {
                shops = shops.filter(shop => 
                    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (shop.station && shop.station.name.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            if (shopType) {
                shops = shops.filter(shop => 
                    shop.shop_type && shop.shop_type.toLowerCase().includes(shopType.toLowerCase())
                );
            }

            this.cache.set(cacheKey, {
                data: shops,
                timestamp: Date.now()
            });

            return shops;
        } catch (error) {
            Logger.error('Erreur lors de la récupération des magasins:', error);
            return [];
        }
    }

    async getStations(searchTerm = null, stationType = null) {
        const cacheKey = `stations_${searchTerm || 'all'}_${stationType || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {            let stations = this.dataUpdateService.getCachedData('stations') || [];
            
            if (searchTerm) {
                stations = stations.filter(station => 
                    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (station.starsystem && station.starsystem.name.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            if (stationType) {
                stations = stations.filter(station => 
                    station.station_type && station.station_type.toLowerCase().includes(stationType.toLowerCase())
                );
            }

            this.cache.set(cacheKey, {
                data: stations,
                timestamp: Date.now()
            });

            return stations;
        } catch (error) {
            Logger.error('Erreur lors de la récupération des stations:', error);
            return [];
        }
    }

    async getComponents(searchTerm = null, componentType = null) {
        const cacheKey = `components_${searchTerm || 'all'}_${componentType || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }        try {
            let components = this.dataUpdateService.getCachedData('components') || [];
            
            if (searchTerm) {
                components = components.filter(component => 
                    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (component.manufacturer && component.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            if (componentType) {
                components = components.filter(component => 
                    component.component_class && component.component_class.toLowerCase().includes(componentType.toLowerCase())
                );
            }

            this.cache.set(cacheKey, {
                data: components,
                timestamp: Date.now()
            });

            return components;
        } catch (error) {
            Logger.error('Erreur lors de la récupération des composants:', error);
            return [];
        }
    }

    async getHangars() {
        const cacheKey = 'hangars_all';
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }        try {
            const hangars = this.dataUpdateService.getCachedData('hangars') || [];

            this.cache.set(cacheKey, {
                data: hangars,
                timestamp: Date.now()
            });

            return hangars;
        } catch (error) {
            Logger.error('Erreur lors de la récupération des hangars:', error);
            return [];
        }
    }

    // Utilitaires
    formatPrice(price) {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('fr-FR').format(price) + ' aUEC';
    }    formatShipEmbed(ship) {
        if (!ship) return null;

        const data = typeof ship.data === 'string' ? JSON.parse(ship.data) : ship.data || {};
        
        return {
            color: this.getManufacturerColor(ship.manufacturer),
            title: `🚀 ${ship.name}`,
            description: `**${ship.manufacturer}** - ${ship.role}`,
            fields: [
                {
                    name: '📊 Spécifications',
                    value: `**Taille:** ${ship.size}\n**Équipage:** ${ship.crew_min}-${ship.crew_max}\n**Cargo:** ${ship.cargo_capacity} SCU\n**Vitesse max:** ${ship.max_speed} m/s`,
                    inline: true
                },
                {
                    name: '💰 Prix',
                    value: `**aUEC:** ${this.formatPrice(ship.price_auec)}\n**USD:** $${ship.price_usd || 'N/A'}`,
                    inline: true
                },
                {
                    name: '⚔️ Combat',
                    value: `**Santé:** ${data.health || 'N/A'}\n**Boucliers:** ${data.shields || 'N/A'}\n**Armes:** ${data.weapons || 'N/A'}`,
                    inline: false
                }
            ],
            footer: {
                text: `${ship.flight_ready ? '✅ Prêt au vol' : '🚧 En développement'} | Dernière MAJ: ${new Date(ship.updated_at).toLocaleDateString('fr-FR')}`
            },
            timestamp: new Date().toISOString()
        };
    }

    // Nouvelles méthodes de formatage pour les données SC-Open.dev

    formatStationEmbed(station) {
        if (!station) return null;

        return {
            color: this.getStationColor(station.station_type),
            title: `🚉 ${station.name}`,
            description: `**${station.station_type || 'Station'}** - ${station.classification || 'Non classifiée'}`,
            fields: [
                {
                    name: '📍 Localisation',
                    value: `**Système:** ${station.starsystem?.name || 'Inconnu'}\n**Planète:** ${station.celestial_object?.name || 'Inconnu'}\n**Taille:** ${station.size || 'N/A'}`,
                    inline: true
                },
                {
                    name: '🏪 Services',
                    value: `**Magasins:** ${station.shops?.length || 0}\n**Docks:** ${station.docks?.length || 0}\n**Hub Cargo:** ${station.cargo_hub ? '✅' : '❌'}\n**Raffinerie:** ${station.refinery ? '✅' : '❌'}`,
                    inline: true
                },
                {
                    name: '🏠 Habitat',
                    value: `**Habitable:** ${station.habitable ? '✅ Oui' : '❌ Non'}\n**Description:** ${station.description ? station.description.substring(0, 100) + '...' : 'Non disponible'}`,
                    inline: false
                }
            ],
            thumbnail: station.store_image ? { url: station.store_image } : null,
            footer: {
                text: `Données officielles SC-Open.dev | MAJ: ${new Date(station.updated_at).toLocaleDateString('fr-FR')}`
            },
            timestamp: new Date().toISOString()
        };
    }

    formatComponentEmbed(component) {
        if (!component) return null;

        return {
            color: this.getComponentColor(component.component_class),
            title: `🔧 ${component.name}`,
            description: `**${component.manufacturer?.name || 'Inconnu'}** - ${component.component_class || component.type}`,
            fields: [
                {
                    name: '📊 Spécifications',
                    value: `**Type:** ${component.component_class || 'N/A'}\n**Taille:** ${component.size}\n**Grade:** ${component.grade}\n**Classe:** ${component.item_class || 'N/A'}`,
                    inline: true
                },
                {
                    name: '💰 Prix',
                    value: `**aUEC:** ${this.formatPrice(component.price_auec)}\n**USD:** $${component.price_usd || 'N/A'}`,
                    inline: true
                },
                {
                    name: '📝 Description',
                    value: component.description ? component.description.substring(0, 200) + '...' : 'Non disponible',
                    inline: false
                }
            ],
            thumbnail: component.store_image ? { url: component.store_image } : null,
            footer: {
                text: `Données officielles SC-Open.dev | MAJ: ${new Date(component.updated_at).toLocaleDateString('fr-FR')}`
            },
            timestamp: new Date().toISOString()
        };
    }

    formatShopEmbed(shop) {
        if (!shop) return null;

        return {
            color: this.getShopColor(shop.shop_type),
            title: `🛒 ${shop.name}`,
            description: `**${shop.shop_type || 'Magasin'}**`,
            fields: [
                {
                    name: '📍 Localisation',
                    value: `**Station:** ${shop.station?.name || 'Inconnu'}\n**Système:** ${shop.starsystem?.name || 'Inconnu'}\n**Planète:** ${shop.celestial_object?.name || 'Inconnu'}`,
                    inline: true
                },
                {
                    name: '🛍️ Services',
                    value: `**Achat:** ${shop.buying ? '✅' : '❌'}\n**Vente:** ${shop.selling ? '✅' : '❌'}\n**Location:** ${shop.rental ? '✅' : '❌'}`,
                    inline: true
                }
            ],
            thumbnail: shop.store_image ? { url: shop.store_image } : null,
            footer: {
                text: `Données officielles SC-Open.dev | MAJ: ${new Date(shop.updated_at).toLocaleDateString('fr-FR')}`
            },
            timestamp: new Date().toISOString()
        };
    }

    formatCommodityEmbed(commodity) {
        if (!commodity) return null;

        return {
            color: this.getCommodityColor(commodity.commodity_type),
            title: `📦 ${commodity.name}`,
            description: `**${commodity.commodity_type || 'Commodité'}**`,
            fields: [
                {
                    name: '📝 Description',
                    value: commodity.description ? commodity.description.substring(0, 300) + '...' : 'Non disponible',
                    inline: false
                }
            ],
            thumbnail: commodity.store_image ? { url: commodity.store_image } : null,
            footer: {
                text: `Données officielles SC-Open.dev | MAJ: ${new Date(commodity.updated_at).toLocaleDateString('fr-FR')}`
            },
            timestamp: new Date().toISOString()
        };
    }

    getManufacturerColor(manufacturer) {
        const colors = {
            'Anvil Aerospace': 0x00ff00,
            'Drake Interplanetary': 0xff6600,
            'Roberts Space Industries': 0x0066ff,
            'Aegis Dynamics': 0xff0000,
            'Origin Jumpworks': 0xffffff,
            'Crusader Industries': 0xffff00,
            'MISC': 0x9900ff
        };
        
        return colors[manufacturer] || 0x00aaff;
    }    getTierColor(tier) {
        const colors = {
            'S': 0xff6b6b, // Rouge
            'A': 0xff9f43, // Orange
            'B': 0xfeca57, // Jaune
            'C': 0x48dbfb, // Bleu
            'D': 0x0abde3  // Bleu foncé
        };
        
        return colors[tier] || 0x777777;
    }

    // Nouvelles méthodes de couleur pour les données SC-Open.dev

    getStationColor(stationType) {
        const colors = {
            'spaceport': 0x00ff00,      // Vert
            'outpost': 0xffaa00,        // Orange
            'station': 0x0066ff,        // Bleu
            'asteroid-station': 0x666666, // Gris
            'city': 0xffd700,           // Or
            'settlement': 0x8b4513,     // Marron
            'aid-shelter': 0xff0000,    // Rouge
            'cargo-center': 0x800080    // Violet
        };
        
        return colors[stationType?.toLowerCase()] || 0x00aaff;
    }

    getComponentColor(componentClass) {
        const colors = {
            'weapon': 0xff0000,         // Rouge
            'shield': 0x0066ff,         // Bleu
            'power-plant': 0xffff00,    // Jaune
            'quantum-drive': 0x9900ff,  // Violet
            'cooler': 0x00ffff,         // Cyan
            'thruster': 0xff6600,       // Orange
            'fuel-tank': 0x00ff00,      // Vert
            'cargo': 0x8b4513,          // Marron
            'scanner': 0xff00ff,        // Magenta
            'computer': 0x00aa00        // Vert foncé
        };
        
        return colors[componentClass?.toLowerCase()] || 0x777777;
    }

    getShopColor(shopType) {
        const colors = {
            'weapons': 0xff0000,        // Rouge
            'armor': 0x666666,          // Gris
            'components': 0x0066ff,     // Bleu
            'ships': 0x00ff00,          // Vert
            'clothing': 0xffa500,       // Orange
            'items': 0x800080,          // Violet
            'food': 0xffd700,           // Or
            'medical': 0xff69b4,        // Rose
            'refinery': 0x8b4513,       // Marron
            'cargo': 0x00ffff           // Cyan
        };
        
        return colors[shopType?.toLowerCase()] || 0x00aaff;
    }

    getCommodityColor(commodityType) {
        const colors = {
            'metals': 0x666666,         // Gris
            'gases': 0x00ffff,          // Cyan
            'minerals': 0x8b4513,       // Marron
            'food': 0xffd700,           // Or
            'medical': 0xff69b4,        // Rose
            'waste': 0x654321,          // Marron foncé
            'scrap': 0x808080,          // Gris moyen
            'processed-goods': 0x0066ff, // Bleu
            'consumer-goods': 0xff6600,  // Orange
            'weapons': 0xff0000         // Rouge
        };
        
        return colors[commodityType?.toLowerCase()] || 0x00aaff;
    }
}

module.exports = new StarCitizenService();
