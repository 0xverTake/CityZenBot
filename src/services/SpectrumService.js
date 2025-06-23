/**
 * Service pour intégrer les guides officiels RSI Spectrum
 * Compatible avec Star Citizen 4.2
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class SpectrumService {
    constructor() {
        this.baseURL = 'https://robertsspaceindustries.com/spectrum';
        this.guidesCache = new Map();
        this.cacheFile = path.join(__dirname, '../../data/spectrum_guides.json');
        this.lastUpdate = null;
        this.officialGuides = [
            {
                id: 'new-player-guide',
                title: 'Guide du nouveau joueur Star Citizen 4.2',
                url: 'https://robertsspaceindustries.com/spectrum/guide/1',
                category: 'debutant',
                tags: ['bases', 'premier-pas', 'tutoriel']
            },
            {
                id: 'ship-combat-guide',
                title: 'Guide de combat spatial - Star Citizen 4.2',
                url: 'https://robertsspaceindustries.com/spectrum/guide/2',
                category: 'combat',
                tags: ['combat', 'vaisseau', 'pvp']
            },
            {
                id: 'trading-guide',
                title: 'Guide du commerce et du trading',
                url: 'https://robertsspaceindustries.com/spectrum/guide/3',
                category: 'economie',
                tags: ['commerce', 'trading', 'economie']
            },
            {
                id: 'mining-guide',
                title: 'Guide du minage - Techniques et équipements',
                url: 'https://robertsspaceindustries.com/spectrum/guide/4',
                category: 'minage',
                tags: ['minage', 'extraction', 'ressources']
            },
            {
                id: 'exploration-guide',
                title: 'Guide d\'exploration spatiale',
                url: 'https://robertsspaceindustries.com/spectrum/guide/5',
                category: 'exploration',
                tags: ['exploration', 'decouverte', 'cartographie']
            }
        ];

        this.gameplayTips = {
            debutant: [
                'Commencez par les missions de livraison simples pour apprendre les bases',
                'Sauvegardez régulièrement votre progression dans les stations',
                'Rejoignez une organisation pour apprendre plus rapidement',
                'Utilisez le chat global pour demander de l\'aide aux autres joueurs',
                'Configurez vos touches de contrôle avant votre première mission'
            ],
            combat: [
                'Maîtrisez le vol couplé/découplé pour des manœuvres avancées',
                'Gérez votre énergie entre boucliers, armes et propulsion',
                'Utilisez les missiles avec parcimonie, ils sont coûteux',
                'Apprenez à utiliser les contre-mesures efficacement',
                'Entraînez-vous dans Arena Commander avant le PvP'
            ],
            economie: [
                'Surveillez les prix des commodités entre systèmes',
                'Diversifiez vos investissements pour réduire les risques',
                'Utilisez les outils communautaires comme UEX Corp pour les prix',
                'Planifiez vos routes commerciales pour maximiser les profits',
                'Gardez toujours de l\'argent de côté pour les urgences'
            ],
            minage: [
                'Commencez par le minage de surface avec un Prospector',
                'Apprenez à identifier les roches précieuses par leur signature',
                'Utilisez les bons outils pour chaque type de roche',
                'Travaillez en équipe pour optimiser les profits',
                'Surveillez la stabilité des roches pendant l\'extraction'
            ],
            exploration: [
                'Équipez-vous d\'un scanner longue portée de qualité',
                'Cartographiez les systèmes méthodiquement',
                'Documentez vos découvertes pour les autres joueurs',
                'Préparez-vous pour de longs voyages avec des provisions',
                'Utilisez les balises pour marquer les points d\'intérêt'
            ]
        };

        this.sc42Updates = {
            nouveautes: [
                'Nouveau système Pyro avec 6 planètes explorables',
                'Amélioration du système de reputation dynamique',
                'Nouveaux véhicules terrestres et spatiaux',
                'Système de crafting amélioré avec nouvelles recettes',
                'Interface utilisateur redessinée pour une meilleure UX'
            ],
            corrections: [
                'Correction des bugs de désynchronisation réseau',
                'Amélioration des performances sur les stations',
                'Stabilisation du système de trading',
                'Correction des problèmes de collision avec les objets',
                'Optimisation du rendu des planètes'
            ],
            conseils: [
                'Testez les nouvelles fonctionnalités dans l\'environnement PTU',
                'Sauvegardez vos configurations avant la mise à jour',
                'Rejoignez les canaux communautaires pour les dernières infos',
                'Signalez les bugs sur le Council Issue pour aider les développeurs',
                'Explorez les nouveaux systèmes avec d\'autres joueurs'
            ]
        };
    }

    /**
     * Initialise le service et charge le cache
     */
    async initialize() {
        try {
            await this.loadCache();
            console.log('✅ SpectrumService initialisé avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation SpectrumService:', error.message);
            return false;
        }
    }

    /**
     * Charge le cache des guides depuis le fichier
     */
    async loadCache() {
        try {
            const data = await fs.readFile(this.cacheFile, 'utf8');
            const parsed = JSON.parse(data);
            this.guidesCache = new Map(Object.entries(parsed.guides || {}));
            this.lastUpdate = new Date(parsed.lastUpdate || 0);
            console.log(`📚 Cache des guides chargé: ${this.guidesCache.size} guides`);
        } catch (error) {
            console.log('📚 Aucun cache trouvé, initialisation d\'un nouveau cache');
            this.guidesCache = new Map();
            this.lastUpdate = new Date(0);
        }
    }

    /**
     * Sauvegarde le cache des guides
     */
    async saveCache() {
        try {
            const data = {
                guides: Object.fromEntries(this.guidesCache),
                lastUpdate: new Date().toISOString(),
                version: '2.0.1'
            };
            
            await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
            await fs.writeFile(this.cacheFile, JSON.stringify(data, null, 2));
            console.log('💾 Cache des guides sauvegardé');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde du cache:', error.message);
        }
    }

    /**
     * Récupère un guide spécifique par catégorie
     */
    getGuideByCategory(category) {
        const guide = this.officialGuides.find(g => g.category === category);
        if (!guide) return null;

        return {
            ...guide,
            tips: this.gameplayTips[category] || [],
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Récupère tous les guides disponibles
     */
    getAllGuides() {
        return this.officialGuides.map(guide => ({
            ...guide,
            tips: this.gameplayTips[guide.category] || []
        }));
    }

    /**
     * Recherche des guides par mots-clés
     */
    searchGuides(query) {
        const searchTerm = query.toLowerCase();
        return this.officialGuides.filter(guide => 
            guide.title.toLowerCase().includes(searchTerm) ||
            guide.category.toLowerCase().includes(searchTerm) ||
            guide.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Récupère des conseils pour débutants
     */
    getBeginnerTips() {
        return {
            category: 'debutant',
            tips: this.gameplayTips.debutant,
            sc42Updates: this.sc42Updates.conseils,
            guides: this.officialGuides.filter(g => g.tags.includes('debutant') || g.tags.includes('tutoriel'))
        };
    }

    /**
     * Récupère les nouveautés de Star Citizen 4.2
     */
    getSC42Updates() {
        return {
            version: '4.2',
            nouveautes: this.sc42Updates.nouveautes,
            corrections: this.sc42Updates.corrections,
            conseils: this.sc42Updates.conseils,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Génère un guide contextuel basé sur une requête
     */
    generateContextualGuide(query) {
        const searchTerm = query.toLowerCase();
        let relevantGuides = [];
        let relevantTips = [];
        let category = 'general';

        // Détection de la catégorie basée sur les mots-clés
        if (searchTerm.includes('combat') || searchTerm.includes('pvp') || searchTerm.includes('combat')) {
            category = 'combat';
            relevantTips = this.gameplayTips.combat;
        } else if (searchTerm.includes('commerce') || searchTerm.includes('trading') || searchTerm.includes('economie')) {
            category = 'economie';
            relevantTips = this.gameplayTips.economie;
        } else if (searchTerm.includes('minage') || searchTerm.includes('extraction') || searchTerm.includes('ressources')) {
            category = 'minage';
            relevantTips = this.gameplayTips.minage;
        } else if (searchTerm.includes('exploration') || searchTerm.includes('decouverte')) {
            category = 'exploration';
            relevantTips = this.gameplayTips.exploration;
        } else if (searchTerm.includes('debutant') || searchTerm.includes('nouveau') || searchTerm.includes('commencer')) {
            category = 'debutant';
            relevantTips = this.gameplayTips.debutant;
        }

        // Recherche de guides pertinents
        relevantGuides = this.searchGuides(query);

        return {
            query,
            category,
            guides: relevantGuides,
            tips: relevantTips,
            sc42Features: category === 'debutant' ? this.sc42Updates.nouveautes.slice(0, 3) : [],
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Récupère les statistiques du service
     */
    getStats() {
        return {
            totalGuides: this.officialGuides.length,
            categoriesAvailable: [...new Set(this.officialGuides.map(g => g.category))],
            cacheSize: this.guidesCache.size,
            lastUpdate: this.lastUpdate,
            version: '2.0.1',
            sc42Compatible: true
        };
    }

    /**
     * Met à jour les données des guides (à appeler périodiquement)
     */
    async updateGuides() {
        try {
            console.log('🔄 Mise à jour des guides Spectrum...');
            
            // Simulation de mise à jour des guides
            // En production, ceci ferait des appels API réels
            const now = new Date();
            this.lastUpdate = now;
            
            // Sauvegarde du cache mis à jour
            await this.saveCache();
            
            console.log('✅ Guides mis à jour avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour des guides:', error.message);
            return false;
        }
    }
}

module.exports = SpectrumService;
