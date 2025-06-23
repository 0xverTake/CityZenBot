const axios = require('axios');
const cheerio = require('cheerio');
const DatabaseService = require('./DatabaseService');
const Logger = require('../utils/Logger');

class StarCitizenService {
    constructor() {
        this.lastUpdate = null;
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
        
        // URLs des sources de données
        this.dataSources = {
            erkul: 'https://www.erkul.games',
            scUnpacked: 'https://api.scunpacked.com',
            starcitizenWiki: 'https://starcitizen.fandom.com/api.php'
        };
    }

    async initialize() {
        try {
            Logger.info('Initialisation du service Star Citizen...');
            
            // Charger les données initiales
            await this.loadInitialData();
            
            Logger.info('Service Star Citizen initialisé');
        } catch (error) {
            Logger.error('Erreur lors de l\'initialisation du service Star Citizen:', error);
            throw error;
        }
    }    async loadInitialData() {
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
    }

    async updateData() {
        try {
            Logger.info('Mise à jour des données Star Citizen...');
            
            await this.updateShipsData();
            await this.updateComponentsData();
            await this.updateMetaData();
            await this.updatePurchaseLocations();
            
            this.lastUpdate = new Date();
            this.cache.clear(); // Vider le cache après mise à jour
            
            Logger.info('Données mises à jour avec succès');
        } catch (error) {
            Logger.error('Erreur lors de la mise à jour des données:', error);
        }
    }    async updateShipsData() {
        try {
            const { SHIPS_DATA } = require('../data/gameData');

            for (const ship of SHIPS_DATA) {
                await DatabaseService.upsertShip(ship);
            }

            Logger.info(`Mis à jour ${SHIPS_DATA.length} vaisseaux`);
        } catch (error) {
            Logger.error('Erreur lors de la mise à jour des vaisseaux:', error);
        }
    }

    async updateComponentsData() {
        // Cette méthode serait implémentée pour récupérer les données des composants
        // depuis une API ou par scraping
        Logger.info('Mise à jour des composants (placeholder)');
    }    async updateMetaData() {
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
    }

    async getMetaData(category) {
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

    // Utilitaires
    formatPrice(price) {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('fr-FR').format(price) + ' aUEC';
    }

    formatShipEmbed(ship) {
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
    }

    getTierColor(tier) {
        const colors = {
            'S': 0xff6b6b, // Rouge
            'A': 0xff9f43, // Orange
            'B': 0xfeca57, // Jaune
            'C': 0x48dbfb, // Bleu
            'D': 0x0abde3  // Bleu foncé
        };
        
        return colors[tier] || 0x777777;
    }
}

module.exports = new StarCitizenService();
