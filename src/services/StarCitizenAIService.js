// Service d'IA pour conseils et astuces Star Citizen
// Utilise Hugging Face Inference API (gratuite)

const axios = require('axios');
const Logger = require('../utils/Logger');

class StarCitizenAIService {
    constructor() {
        // Hugging Face - API gratuite pour toujours
        this.apiUrl = 'https://api-inference.huggingface.co/models';
        this.apiKey = process.env.HUGGINGFACE_API_KEY || null;
        
        // Modèles recommandés (gratuits)
        this.models = {
            chat: 'microsoft/DialoGPT-medium', // Bon pour conversations
            advice: 'facebook/blenderbot-400M-distill', // Conseils généraux
            text: 'gpt2', // Fallback simple
        };
        
        // Cache intelligent pour économiser l'API
        this.cache = new Map();
        this.cacheMaxSize = 100;
        this.cacheExpiry = 60 * 60 * 1000; // 1 heure
        
        // Compteur d'utilisation API (reset mensuel)
        this.apiUsage = {
            count: parseInt(process.env.API_USAGE_COUNT || '0'),
            month: new Date().getMonth(),
            limit: 1000 // Limite gratuite Hugging Face
        };
        
        // Base de connaissances Star Citizen
        this.scKnowledge = {
            ships: {
                beginner: ['Aurora', '300i', 'Mustang', 'Avenger Titan'],
                cargo: ['Freelancer', 'Caterpillar', 'Hull Series'],
                combat: ['Hornet', 'Sabre', 'Vanguard', 'Gladius'],
                mining: ['Prospector', 'Orion', 'ROC']
            },
            tips: {
                beginner: [
                    "Commencez par les missions de livraison pour apprendre les bases",
                    "L'Aurora et la 300i sont parfaites pour débuter",
                    "Sauvegardez régulièrement vos aUEC dans votre compte",
                    "Rejoignez un org pour apprendre plus vite",
                    "Les missions de investigation sont lucratives pour débuter"
                ],
                combat: [
                    "Maîtrisez le vol en mode couplé/découplé",
                    "Gérez votre signature thermique pendant le combat",
                    "Les missiles sont efficaces mais coûteux",
                    "Apprenez les points faibles de chaque vaisseau"
                ],
                trading: [
                    "Vérifiez les prix sur UEX Corp avant d'acheter",
                    "Commencez avec des petites cargaisons",
                    "Évitez les zones de conflit pour le commerce",
                    "Diversifiez vos routes commerciales"
                ]
            },
            locations: {
                starter: ['Area18', 'Lorville', 'New Babbage', 'Orison'],
                trading: ['Port Olisar', 'Grimhex', 'Levski'],
                missions: ['Hurston', 'ArcCorp', 'microTech', 'Crusader']
            }
        };
    }    // Générer des conseils IA personnalisés
    async generateAdvice(question, playerLevel = 'beginner', category = 'general') {
        try {
            // Vérifier le cache d'abord
            const cacheKey = this.getCacheKey(question, playerLevel, category);
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                Logger.info('📋 Réponse servie depuis le cache');
                return cached;
            }
            
            // Préparer le contexte Star Citizen
            const context = this.buildContext(category, playerLevel);
            
            // Construire le prompt optimisé
            const prompt = this.buildPrompt(question, context, playerLevel);
            
            // Vérifier si on doit utiliser l'IA ou le fallback directement
            const shouldUseAI = this.shouldUseAI(question, category);
            
            // Essayer avec l'IA si disponible et pertinent
            if (this.apiKey && shouldUseAI && this.canUseAPI()) {
                const aiResponse = await this.callHuggingFaceAPI(prompt);
                if (aiResponse) {
                    const formattedResponse = this.formatResponse(aiResponse, category, playerLevel);
                    this.addToCache(cacheKey, formattedResponse);
                    return formattedResponse;
                }
            }
            
            // Fallback : réponse basée sur la base de connaissances
            const fallbackResponse = this.generateFallbackAdvice(question, category, playerLevel);
            this.addToCache(cacheKey, fallbackResponse);
            return fallbackResponse;
            
        } catch (error) {
            Logger.warn('⚠️ Erreur IA, utilisation du fallback:', error.message);
            return this.generateFallbackAdvice(question, category, playerLevel);
        }
    }

    // Déterminer si l'IA est nécessaire ou si le fallback suffit
    shouldUseAI(question, category) {
        const lowerQuestion = question.toLowerCase();
        
        // Questions simples → Fallback direct (économise l'API)
        const simpleKeywords = [
            'vaisseau recommandé', 'meilleur ship', 'comment débuter',
            'première mission', 'où aller', 'quoi faire'
        ];
        
        if (simpleKeywords.some(keyword => lowerQuestion.includes(keyword))) {
            return false; // Fallback direct
        }
        
        // Questions complexes → IA
        const complexKeywords = [
            'stratégie', 'optimiser', 'problème avec', 'bug', 'erreur',
            'configuration', 'performance', 'pourquoi', 'comment exactement'
        ];
        
        return complexKeywords.some(keyword => lowerQuestion.includes(keyword));
    }

    // Vérifier si on peut utiliser l'API (quota disponible)
    canUseAPI() {
        // Reset mensuel
        const currentMonth = new Date().getMonth();
        if (currentMonth !== this.apiUsage.month) {
            this.apiUsage.count = 0;
            this.apiUsage.month = currentMonth;
        }
        
        return this.apiUsage.count < this.apiUsage.limit;
    }

    // Gestion du cache
    getCacheKey(question, playerLevel, category) {
        return `${category}-${playerLevel}-${question.toLowerCase().slice(0, 50)}`;
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    addToCache(key, data) {
        // Nettoyer le cache si trop plein
        if (this.cache.size >= this.cacheMaxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Construire le contexte selon la catégorie
    buildContext(category, playerLevel) {
        let context = `Star Citizen 4.2 - Guide pour niveau: ${playerLevel}\n`;
        
        switch (category) {
            case 'ships':
                context += `Vaisseaux recommandés: ${this.scKnowledge.ships[playerLevel]?.join(', ') || 'Variés'}\n`;
                break;
            case 'combat':
                context += `Conseils combat: ${this.scKnowledge.tips.combat.slice(0, 2).join('. ')}\n`;
                break;
            case 'trading':
                context += `Commerce: ${this.scKnowledge.tips.trading.slice(0, 2).join('. ')}\n`;
                break;
            case 'beginner':
                context += `Conseils débutant: ${this.scKnowledge.tips.beginner.slice(0, 3).join('. ')}\n`;
                break;
        }
        
        return context;
    }

    // Construire un prompt optimisé
    buildPrompt(question, context, playerLevel) {
        return `${context}

Question du joueur ${playerLevel}: ${question}

Réponds avec un conseil pratique et spécifique pour Star Citizen 4.2 en français. 
Sois concret, utile et encourage le joueur. Maximum 150 mots.

Réponse:`;
    }    // Appeler l'API Hugging Face
    async callHuggingFaceAPI(prompt) {
        try {
            // Incrémenter le compteur d'utilisation
            this.apiUsage.count++;
            
            Logger.info(`🤖 Appel IA Hugging Face (${this.apiUsage.count}/${this.apiUsage.limit})`);
            
            const response = await axios.post(
                `${this.apiUrl}/${this.models.advice}`,
                {
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.7,
                        return_full_text: false,
                        do_sample: true
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 12000 // Augmenté pour plus de stabilité
                }
            );

            const aiText = response.data[0]?.generated_text?.trim();
            if (aiText && aiText.length > 20) {
                Logger.info('✅ Réponse IA générée avec succès');
                return aiText;
            } else {
                Logger.warn('⚠️ Réponse IA trop courte, utilisation du fallback');
                return null;
            }
        } catch (error) {
            // Décrémenter si erreur (pour ne pas gaspiller le quota)
            this.apiUsage.count = Math.max(0, this.apiUsage.count - 1);
            
            if (error.response?.status === 429) {
                Logger.warn('⚠️ Quota API Hugging Face dépassé');
            } else {
                Logger.warn('⚠️ Hugging Face API indisponible:', error.message);
            }
            return null;
        }
    }

    // Réponse de fallback basée sur les connaissances
    generateFallbackAdvice(question, category, playerLevel) {
        const lowerQuestion = question.toLowerCase();
        
        // Détection de mots-clés pour conseils ciblés
        if (lowerQuestion.includes('vaisseau') || lowerQuestion.includes('ship')) {
            return this.getShipAdvice(playerLevel);
        }
        
        if (lowerQuestion.includes('combat') || lowerQuestion.includes('arme')) {
            return this.getCombatAdvice(playerLevel);
        }
        
        if (lowerQuestion.includes('commerce') || lowerQuestion.includes('trading') || lowerQuestion.includes('argent')) {
            return this.getTradingAdvice(playerLevel);
        }
        
        if (lowerQuestion.includes('débutant') || lowerQuestion.includes('commencer') || lowerQuestion.includes('nouveau')) {
            return this.getBeginnerAdvice();
        }
        
        if (lowerQuestion.includes('mission')) {
            return this.getMissionAdvice(playerLevel);
        }
        
        // Conseil général
        return this.getGeneralAdvice(playerLevel);
    }

    // Conseils spécialisés
    getShipAdvice(playerLevel) {
        const ships = this.scKnowledge.ships[playerLevel] || this.scKnowledge.ships.beginner;
        return {
            title: "🚀 Conseils Vaisseaux",
            content: `Pour votre niveau (${playerLevel}), je recommande ces vaisseaux : **${ships.join(', ')}**. 

${playerLevel === 'beginner' ? 
    "L'**Aurora MR** est parfaite pour débuter : polyvalente, abordable et facile à piloter. La **300i** offre plus de confort avec un lit et une kitchenette." :
    "Concentrez-vous sur des vaisseaux spécialisés selon votre activité favorite : cargo, combat ou exploration."}

💡 **Astuce** : Louez avant d'acheter pour tester le vaisseau !`,
            ai_powered: false,
            category: 'ships'
        };
    }

    getCombatAdvice(playerLevel) {
        const tips = this.scKnowledge.tips.combat;
        return {
            title: "⚔️ Conseils Combat",
            content: `**Combat en Star Citizen 4.2 :**

• ${tips[0]}
• ${tips[1]}
• Commencez par des missions de sécurité faciles (VLT)
• Utilisez le mode **couplé** pour les débutants

${playerLevel === 'beginner' ? 
    '🎯 **Pour débuter** : Missions "Eliminate Threat" autour de Crusader sont parfaites pour s\'entraîner.' :
    '⚡ **Avancé** : Maîtrisez le vol en mode découplé et les manœuvres d\'évasion.'}`,
            ai_powered: false,
            category: 'combat'
        };
    }

    getTradingAdvice(playerLevel) {
        const tips = this.scKnowledge.tips.trading;
        return {
            title: "💰 Conseils Commerce",
            content: `**Trading rentable en SC 4.2 :**

• ${tips[0]}
• ${tips[1]}
• **Route débutant** : Medical Supplies de Area18 vers Hurston
• **Outils** : Utilisez UEX Corp pour les prix actuels

${playerLevel === 'beginner' ? 
    '📦 **Commencez petit** : 10-20 SCU max pour limiter les risques.' :
    '🚛 **Optimisez** : Caterpillar ou Freelancer MAX pour de gros volumes.'}

⚠️ **Attention** : Évitez les zones de conflit pour vos livraisons !`,
            ai_powered: false,
            category: 'trading'
        };
    }

    getBeginnerAdvice() {
        const tips = this.scKnowledge.tips.beginner;
        return {
            title: "🌟 Guide Débutant",
            content: `**Bienvenue dans Star Citizen 4.2 !**

**Premiers pas essentiels :**
• ${tips[0]}
• ${tips[1]}
• ${tips[2]}
• ${tips[3]}

**Progression recommandée :**
1. **Missions de livraison** (faciles, sûres)
2. **Missions d'investigation** (lucratives)
3. **Commerce de base** (Medical Supplies)
4. **Combat simple** (Eliminate Threat)

🎮 **Conseil #1** : Configurez vos contrôles avant tout !`,
            ai_powered: false,
            category: 'beginner'
        };
    }

    getMissionAdvice(playerLevel) {
        return {
            title: "📋 Conseils Missions",
            content: `**Missions recommandées pour ${playerLevel} :**

**🟢 Faciles & Lucratives :**
• **Investigation** : 45k aUEC, peu de risques
• **Livraison de cargaison** : Revenus stables
• **Maintenance** : Simple et bien payé

**🟡 Intermédiaires :**
• **Eliminate Threat** : Combat contre IA
• **Cave missions** : Exploration + loot

**🔴 Difficiles :**
• **Bunker missions** : PvP possible
• **Group missions** : Équipe requise

💡 **Astuce** : Commencez toujours par lire entièrement la description !`,
            ai_powered: false,
            category: 'missions'
        };
    }

    getGeneralAdvice(playerLevel) {
        return {
            title: "ℹ️ Conseil Général",
            content: `**Star Citizen 4.2 - Conseil personnalisé :**

Selon votre niveau (${playerLevel}), concentrez-vous sur :

${playerLevel === 'beginner' ? 
    '• **Maîtriser les bases** : Vol, atterrissage, navigation\n• **Missions simples** : Investigation et livraison\n• **Économiser** : Construisez votre capital progressivement' :
    '• **Spécialisation** : Choisissez votre domaine favori\n• **Optimisation** : Perfectionnez vos techniques\n• **Coopération** : Rejoignez des missions de groupe'}

🌌 **Remember** : Star Citizen récompense la patience et la persévérance !

*Besoin d'aide spécifique ? Demandez-moi des conseils sur les vaisseaux, combat, commerce ou missions.*`,
            ai_powered: false,
            category: 'general'
        };
    }

    // Formater la réponse finale
    formatResponse(aiText, category, playerLevel) {
        return {
            title: "🤖 Conseil IA Star Citizen",
            content: aiText,
            ai_powered: true,
            category: category,
            player_level: playerLevel,
            disclaimer: "Réponse générée par IA - Vérifiez les infos in-game"
        };
    }

    // Obtenir des astuces aléatoires
    getRandomTip(category = 'beginner') {
        const tips = this.scKnowledge.tips[category] || this.scKnowledge.tips.beginner;
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        return {
            title: "💡 Astuce du Jour",
            content: randomTip,
            category: category
        };
    }    // Vérifier si l'API IA est disponible
    async checkAIAvailability() {
        if (!this.apiKey) {
            return {
                available: false,
                reason: 'API key manquante - Ajoutez HUGGINGFACE_API_KEY dans .env',
                fallback: true,
                setup_guide: 'Voir HUGGINGFACE_API_SETUP.md pour obtenir une clé gratuite'
            };
        }

        // Vérifier le quota
        if (!this.canUseAPI()) {
            return {
                available: false,
                reason: `Quota mensuel dépassé (${this.apiUsage.count}/${this.apiUsage.limit})`,
                fallback: true,
                reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('fr-FR')
            };
        }

        try {
            const response = await axios.get(`${this.apiUrl}/gpt2`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                timeout: 5000
            });
            
            return {
                available: true,
                model: 'Hugging Face Inference API',
                status: response.status,
                quota: `${this.apiUsage.count}/${this.apiUsage.limit} utilisées ce mois`,
                cache_size: this.cache.size
            };
        } catch (error) {
            let reason = 'Erreur de connexion';
            if (error.response?.status === 401) {
                reason = 'API key invalide';
            } else if (error.response?.status === 429) {
                reason = 'Limite de taux dépassée';
            }
            
            return {
                available: false,
                reason: reason,
                fallback: true,
                error_details: error.message
            };
        }
    }

    // Obtenir les statistiques d'utilisation
    getUsageStats() {
        return {
            api_calls_this_month: this.apiUsage.count,
            quota_limit: this.apiUsage.limit,
            quota_remaining: this.apiUsage.limit - this.apiUsage.count,
            cache_entries: this.cache.size,
            cache_max_size: this.cacheMaxSize,
            quota_reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('fr-FR')
        };
    }
}

module.exports = StarCitizenAIService;
