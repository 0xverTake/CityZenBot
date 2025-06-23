// Service d'Intelligence Artificielle pour conseils Star Citizen
// Utilise Hugging Face API pour donner des conseils aux débutants
// Intègre les guides officiels RSI Spectrum

const axios = require('axios');
const Logger = require('../utils/Logger');
const SpectrumService = require('./SpectrumService');

class AIService {
    constructor() {
        this.apiKey = process.env.HUGGINGFACE_TOKEN;
        this.apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
        this.model = 'microsoft/DialoGPT-medium'; // Modèle gratuit et efficace
        this.isEnabled = !!this.apiKey;
        
        // Initialiser le service Spectrum
        this.spectrumService = new SpectrumService();
        
        // Cache pour optimiser l'utilisation de l'API gratuite
        this.responseCache = new Map();
        this.usageStats = {
            requests: 0,
            cacheHits: 0,
            errors: 0,
            lastReset: new Date()
        };
        
        // Guides officiels Star Citizen
        this.officialGuides = {
            base_url: 'https://robertsspaceindustries.com/spectrum/guide',
            categories: [
                'Démarrage rapide',
                'Interface utilisateur',
                'Contrôles de vol',
                'Commerce et économie',
                'Combat et PvP',
                'Exploration',
                'Mining (minage)',
                'Transport de fret',
                'Organisations',
                'Univers persistant'
            ]
        };
        
        // Base de connaissances Star Citizen intégrée
        this.scKnowledge = {
            debutant: {
                'premier_vaisseau': 'Pour débuter, l\'Aurora MR ou le Mustang Alpha sont parfaits. Ils sont polyvalents et abordables.',
                'ou_commencer': 'Commencez par les missions de livraison simples depuis les stations Crusader ou ArcCorp.',
                'controles': 'Appuyez sur F1 pour voir tous les raccourcis clavier. TAB pour le mobiglas, F pour interagir.',
                'argent': 'Les missions de livraison et de transport donnent 8000-15000 aUEC. Évitez le combat au début.',
                'mort': 'Si vous mourez, vous respawnez au dernier hôpital visité. Vos objets restent sur votre corps.',
                'performance': 'Baissez les paramètres graphiques et fermez les autres programmes pour améliorer les FPS.'
            },
            commerce: {
                'routes_profitables': 'Laranite de Lyria vers ArcCorp (1,5M+ de profit), Aluminium de Daymar vers New Babbage.',
                'cargo': 'Commencez avec un Cutlass Black (46 SCU) puis passez au Freelancer MAX (120 SCU).',
                'risques': 'Évitez les zones de conflit (Kareah, GrimHex) avec du cargo précieux.',
                'stations': 'Utilisez UEX Corp (uexcorp.space) pour trouver les meilleurs prix en temps réel.'
            },
            combat: {
                'premier_chasseur': 'Arrow ou Gladius pour débuter, Hornet F7C pour plus de polyvalence.',
                'armes': 'Équipez des armes de même type (laser ou balistique) pour une gestion d\'énergie optimale.',
                'boucliers': 'Priorisez les boucliers de grade A. Rampart et Stronghold sont excellents.',
                'tactiques': 'Gardez vos distances, utilisez les missiles avec parcimonie, gérez votre vitesse.'
            },
            mining: {
                'equipement': 'Prospector pour débuter (solo), MOLE pour le minage en équipe.',
                'minerais': 'Quantainium = très profitable mais instable, Laranite = stable et rentable.',
                'lieux': 'Daymar et Lyria pour débuter, astéroïdes Aaron Halo pour les experts.',
                'outils': 'Module Helix pour stabilité, Hofstede S1 pour efficacité.'
            }
        };
          if (this.isEnabled) {
            Logger.info('🤖 Service IA activé avec Hugging Face API');
            this.initializeSpectrumService();
        } else {
            Logger.warn('⚠️ Service IA désactivé - Token Hugging Face manquant');
        }
    }

    // Initialiser le service Spectrum
    async initializeSpectrumService() {
        try {
            await this.spectrumService.initialize();
        } catch (error) {
            Logger.error('❌ Erreur initialisation SpectrumService:', error.message);
        }
    }

    // Obtenir des conseils IA pour Star Citizen
    async getAdvice(question, category = 'general', userLevel = 'debutant') {
        if (!this.isEnabled) {
            return this.getFallbackAdvice(question, category);
        }

        try {
            // Vérifier le cache d'abord
            const cacheKey = `${category}_${question.toLowerCase().substring(0, 50)}`;
            if (this.responseCache.has(cacheKey)) {
                this.usageStats.cacheHits++;
                Logger.info('🎯 Réponse IA depuis le cache');
                return this.responseCache.get(cacheKey);
            }

            // Construire le prompt avec contexte Star Citizen
            const prompt = this.buildStarCitizenPrompt(question, category, userLevel);
            
            // Faire la requête à Hugging Face
            const response = await this.makeHuggingFaceRequest(prompt);
            
            // Traiter et enrichir la réponse
            const enrichedResponse = this.enrichResponseWithSCData(response, category);
            
            // Mettre en cache (max 100 entrées)
            if (this.responseCache.size >= 100) {
                const firstKey = this.responseCache.keys().next().value;
                this.responseCache.delete(firstKey);
            }
            this.responseCache.set(cacheKey, enrichedResponse);
            
            this.usageStats.requests++;
            Logger.info('🤖 Conseil IA généré avec succès');
            
            return enrichedResponse;
            
        } catch (error) {
            this.usageStats.errors++;
            Logger.error('❌ Erreur service IA:', error.message);
            return this.getFallbackAdvice(question, category);
        }
    }

    // Construire un prompt optimisé pour Star Citizen
    buildStarCitizenPrompt(question, category, userLevel) {
        const contextMap = {
            'combat': 'Tu es un pilote expert en combat spatial dans Star Citizen',
            'commerce': 'Tu es un trader expérimenté dans l\'univers Star Citizen',
            'mining': 'Tu es un mineur professionnel dans Star Citizen',
            'exploration': 'Tu es un explorateur chevronné de l\'univers Star Citizen',
            'debutant': 'Tu es un mentor bienveillant pour les nouveaux joueurs Star Citizen'
        };
        
        const context = contextMap[category] || 'Tu es un guide expert Star Citizen';
        
        return `${context}. Version actuelle: Star Citizen 4.2.
        
Niveau du joueur: ${userLevel}
Catégorie: ${category}
        
Question: ${question}

Réponds en français, de manière concise (max 200 mots), avec des conseils pratiques et précis pour Star Citizen 4.2. Include des informations sur les coûts en aUEC si pertinent.

Guides officiels disponibles: ${this.officialGuides.base_url}`;
    }

    // Faire une requête à Hugging Face API
    async makeHuggingFaceRequest(prompt) {
        const response = await axios.post(
            this.apiUrl,
            {
                inputs: prompt,
                parameters: {
                    max_length: 200,
                    temperature: 0.7,
                    do_sample: true,
                    top_p: 0.9
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        if (response.data && response.data[0] && response.data[0].generated_text) {
            return response.data[0].generated_text;
        } else {
            throw new Error('Réponse API invalide');
        }
    }    // Enrichir la réponse avec des données Star Citizen
    enrichResponseWithSCData(aiResponse, category) {
        // Récupérer les guides Spectrum pertinents
        const spectrumGuide = this.spectrumService.getGuideByCategory(category);
        
        let enrichedResponse = {
            ai_advice: aiResponse,
            category: category,
            official_guides: spectrumGuide ? `📚 Guide officiel: ${spectrumGuide.title}` : `📚 Guides officiels: ${this.officialGuides.base_url}`,
            spectrum_tips: spectrumGuide ? spectrumGuide.tips.slice(0, 3) : [],
            quick_tips: [],
            related_commands: [],
            sc_version: '4.2'
        };

        // Ajouter des conseils rapides selon la catégorie
        if (category === 'debutant' || category === 'general') {
            const beginnerData = this.spectrumService.getBeginnerTips();
            enrichedResponse.quick_tips = beginnerData.tips.slice(0, 4);
            enrichedResponse.related_commands = ['/ship', '/meta', '/buy'];
            enrichedResponse.sc42_features = beginnerData.sc42Updates.slice(0, 2);
        }

        if (category === 'combat') {
            enrichedResponse.quick_tips = [
                '⚔️ Utilisez `/meta pvp` pour voir les meilleurs vaisseaux',
                '⚔️ Gérez votre énergie entre armes/boucliers/moteurs',
                '⚔️ Entraînez-vous dans Arena Commander'
            ];
            enrichedResponse.related_commands = ['/meta pvp', '/build'];
        }

        if (category === 'commerce') {
            enrichedResponse.quick_tips = [
                '💰 Vérifiez UEX Corp pour les prix actuels',
                '💰 Commencez petit avec un Cutlass Black',
                '💰 Évitez les zones de conflit avec du cargo'
            ];
            enrichedResponse.related_commands = ['/buy', '/ship cargo'];
        }

        if (category === 'minage') {
            enrichedResponse.quick_tips = [
                '⛏️ Commencez avec un Prospector pour apprendre',
                '⛏️ Utilisez les outils de minage appropriés',
                '⛏️ Surveillez la stabilité des roches'
            ];
            enrichedResponse.related_commands = ['/ship mining', '/meta'];
        }

        if (category === 'exploration') {
            enrichedResponse.quick_tips = [
                '🔍 Équipez-vous d\'un scanner longue portée',
                '🔍 Cartographiez méthodiquement les systèmes',
                '🔍 Documentez vos découvertes'
            ];
            enrichedResponse.related_commands = ['/ship exploration', '/meta'];
        }

        return enrichedResponse;
    }

    // Réponse de secours sans IA
    getFallbackAdvice(question, category) {
        const categoryAdvice = this.scKnowledge[category] || this.scKnowledge.debutant;
        
        // Chercher dans la base de connaissances
        for (const [key, advice] of Object.entries(categoryAdvice)) {
            if (question.toLowerCase().includes(key) || 
                question.toLowerCase().includes(key.replace('_', ' '))) {
                return {
                    ai_advice: advice,
                    category: category,
                    source: 'Base de connaissances locale',
                    official_guides: `📚 Guides officiels: ${this.officialGuides.base_url}`,
                    quick_tips: ['💡 Consultez les guides officiels pour plus de détails'],
                    related_commands: ['/help'],
                    sc_version: '4.2',
                    fallback: true
                };
            }
        }

        // Conseil générique
        return {
            ai_advice: `Pour cette question sur ${category}, je recommande de consulter les guides officiels Star Citizen. Ils contiennent des informations détaillées et à jour pour la version 4.2.`,
            category: category,
            source: 'Conseil générique',
            official_guides: `📚 Guides officiels: ${this.officialGuides.base_url}`,
            quick_tips: [
                '📖 Consultez les guides officiels RSI',
                '🎮 Entraînez-vous dans Arena Commander',
                '👥 Rejoignez une organisation d\'aide aux débutants'
            ],
            related_commands: ['/help', '/ship', '/meta'],
            sc_version: '4.2',
            fallback: true
        };
    }

    // Obtenir des conseils spécifiques pour débutants
    async getBeginnerTips(topic) {
        const beginnerQuestions = {
            'premier-pas': 'Que dois-je faire en premier dans Star Citizen ?',
            'vaisseau': 'Quel vaisseau choisir pour débuter ?',
            'argent': 'Comment gagner de l\'argent rapidement ?',
            'controles': 'Quels sont les contrôles essentiels ?',
            'performance': 'Comment améliorer les performances ?',
            'missions': 'Quelles missions pour débuter ?'
        };

        const question = beginnerQuestions[topic] || `Conseils pour ${topic}`;
        return await this.getAdvice(question, 'debutant', 'nouveau_joueur');
    }

    // Statistiques d'utilisation
    getUsageStats() {
        const uptime = Date.now() - this.usageStats.lastReset.getTime();
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        
        return {
            enabled: this.isEnabled,
            model: this.model,
            requests_total: this.usageStats.requests,
            cache_hits: this.usageStats.cacheHits,
            errors: this.usageStats.errors,
            cache_size: this.responseCache.size,
            hit_rate: this.usageStats.requests > 0 ? 
                Math.round((this.usageStats.cacheHits / (this.usageStats.requests + this.usageStats.cacheHits)) * 100) : 0,
            uptime_hours: hours,
            api_provider: 'Hugging Face (Gratuit)',
            guides_source: this.officialGuides.base_url
        };
    }

    // Vider le cache
    clearCache() {
        this.responseCache.clear();
        Logger.info('🧹 Cache IA vidé');
    }

    // Réinitialiser les statistiques
    resetStats() {
        this.usageStats = {
            requests: 0,
            cacheHits: 0,
            errors: 0,
            lastReset: new Date()
        };
        Logger.info('📊 Statistiques IA réinitialisées');
    }
}

module.exports = AIService;
