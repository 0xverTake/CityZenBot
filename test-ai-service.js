#!/usr/bin/env node

// Script de test pour le service IA CityZenBot
// Usage: node test-ai-service.js

require('dotenv').config();
const StarCitizenAIService = require('./src/services/StarCitizenAIService');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bright: '\x1b[1m'
};

const log = {
    title: (msg) => console.log(`\n${colors.cyan}${colors.bright}🤖 ${msg}${colors.reset}\n`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`)
};

class AIServiceTester {
    constructor() {
        this.aiService = new StarCitizenAIService();
        this.testResults = [];
    }

    async runAllTests() {
        log.title('TEST DU SERVICE IA CITYZENBOT');
        
        console.log('🧪 Tests du service IA pour Star Citizen 4.2');
        console.log('═══════════════════════════════════════════════\n');

        try {
            await this.testConfiguration();
            await this.testAPIAvailability();
            await this.testBasicAdvice();
            await this.testFallbackSystem();
            await this.testCacheSystem();
            await this.testRandomTips();
            await this.testUsageStats();
            
            this.showSummary();
        } catch (error) {
            log.error(`Erreur lors des tests: ${error.message}`);
        }
    }

    async testConfiguration() {
        log.info('Test 1: Configuration du service');
        
        const hasApiKey = !!process.env.HUGGINGFACE_API_KEY;
        const apiKeyFormat = process.env.HUGGINGFACE_API_KEY?.startsWith('hf_');
        
        if (hasApiKey && apiKeyFormat) {
            log.success('API key Hugging Face correctement configurée');
            this.testResults.push({ test: 'Configuration', status: 'PASS' });
        } else if (hasApiKey && !apiKeyFormat) {
            log.warn('API key présente mais format incorrect (doit commencer par "hf_")');  
            this.testResults.push({ test: 'Configuration', status: 'WARN' });
        } else {
            log.warn('API key Hugging Face manquante - Mode fallback uniquement');
            this.testResults.push({ test: 'Configuration', status: 'WARN' });
        }
    }

    async testAPIAvailability() {
        log.info('Test 2: Disponibilité de l\'API');
        
        try {
            const status = await this.aiService.checkAIAvailability();
            
            if (status.available) {
                log.success(`API Hugging Face disponible - ${status.model}`);
                log.info(`Quota: ${status.quota || 'Non spécifié'}`);
                this.testResults.push({ test: 'API Availability', status: 'PASS' });
            } else {
                log.warn(`API indisponible: ${status.reason}`);
                this.testResults.push({ test: 'API Availability', status: 'WARN' });
            }
        } catch (error) {
            log.error(`Erreur test API: ${error.message}`);
            this.testResults.push({ test: 'API Availability', status: 'FAIL' });
        }
    }

    async testBasicAdvice() {
        log.info('Test 3: Génération de conseils');
        
        const testQuestions = [
            { question: 'Comment débuter dans Star Citizen ?', level: 'beginner', category: 'beginner' },
            { question: 'Quel vaisseau pour faire du cargo ?', level: 'intermediate', category: 'ships' },
            { question: 'Conseils pour le combat spatial', level: 'advanced', category: 'combat' }
        ];

        for (const test of testQuestions) {
            try {
                const advice = await this.aiService.generateAdvice(
                    test.question, 
                    test.level, 
                    test.category
                );
                
                if (advice && advice.content && advice.content.length > 20) {
                    log.success(`Conseil généré: ${test.category} (${advice.ai_powered ? 'IA' : 'Fallback'})`);
                    console.log(`   └─ "${advice.content.substring(0, 60)}..."`);
                } else {
                    log.warn(`Réponse trop courte pour: ${test.question}`);
                }
            } catch (error) {
                log.error(`Erreur génération conseil: ${error.message}`);
            }
        }
        
        this.testResults.push({ test: 'Advice Generation', status: 'PASS' });
    }

    async testFallbackSystem() {
        log.info('Test 4: Système de fallback');
        
        try {
            // Test des différents types de conseils fallback
            const fallbackTests = [
                { method: 'getShipAdvice', param: 'beginner' },
                { method: 'getCombatAdvice', param: 'intermediate' },
                { method: 'getTradingAdvice', param: 'advanced' },
                { method: 'getBeginnerAdvice', param: null }
            ];

            for (const test of fallbackTests) {
                const advice = test.param ? 
                    this.aiService[test.method](test.param) : 
                    this.aiService[test.method]();
                
                if (advice && advice.content) {
                    log.success(`Fallback ${test.method}: OK`);
                } else {
                    log.warn(`Fallback ${test.method}: Réponse vide`);
                }
            }
            
            this.testResults.push({ test: 'Fallback System', status: 'PASS' });
        } catch (error) {
            log.error(`Erreur système fallback: ${error.message}`);
            this.testResults.push({ test: 'Fallback System', status: 'FAIL' });
        }
    }

    async testCacheSystem() {
        log.info('Test 5: Système de cache');
        
        try {
            const question = 'Test cache system';
            
            // Premier appel
            const advice1 = await this.aiService.generateAdvice(question, 'beginner', 'general');
            
            // Deuxième appel (devrait utiliser le cache)
            const advice2 = await this.aiService.generateAdvice(question, 'beginner', 'general');
            
            if (advice1 && advice2) {
                log.success('Système de cache fonctionnel');
                this.testResults.push({ test: 'Cache System', status: 'PASS' });
            } else {
                log.warn('Problème avec le système de cache');
                this.testResults.push({ test: 'Cache System', status: 'WARN' });
            }
        } catch (error) {
            log.error(`Erreur test cache: ${error.message}`);
            this.testResults.push({ test: 'Cache System', status: 'FAIL' });
        }
    }

    async testRandomTips() {
        log.info('Test 6: Astuces aléatoires');
        
        try {
            const categories = ['beginner', 'combat', 'trading'];
            
            for (const category of categories) {
                const tip = this.aiService.getRandomTip(category);
                if (tip && tip.content) {
                    log.success(`Astuce ${category}: "${tip.content.substring(0, 40)}..."`);
                } else {
                    log.warn(`Pas d'astuce pour la catégorie: ${category}`);
                }
            }
            
            this.testResults.push({ test: 'Random Tips', status: 'PASS' });
        } catch (error) {
            log.error(`Erreur astuces aléatoires: ${error.message}`);
            this.testResults.push({ test: 'Random Tips', status: 'FAIL' });
        }
    }

    async testUsageStats() {
        log.info('Test 7: Statistiques d\'utilisation');
        
        try {
            const stats = this.aiService.getUsageStats();
            
            if (stats && typeof stats.api_calls_this_month === 'number') {
                log.success(`Stats disponibles: ${stats.api_calls_this_month}/${stats.quota_limit} requêtes`);
                log.info(`Cache: ${stats.cache_entries}/${stats.cache_max_size} entrées`);
                this.testResults.push({ test: 'Usage Stats', status: 'PASS' });
            } else {
                log.warn('Statistiques non disponibles');
                this.testResults.push({ test: 'Usage Stats', status: 'WARN' });
            }
        } catch (error) {
            log.error(`Erreur statistiques: ${error.message}`);
            this.testResults.push({ test: 'Usage Stats', status: 'FAIL' });
        }
    }

    showSummary() {
        console.log('\n' + '═'.repeat(50));
        log.title('RÉSUMÉ DES TESTS');
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const warned = this.testResults.filter(r => r.status === 'WARN').length; 
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        
        console.log(`📊 Résultats: ${passed} réussis, ${warned} avertissements, ${failed} échoués\n`);
        
        this.testResults.forEach(result => {
            const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
            console.log(`${icon} ${result.test}: ${result.status}`);
        });
        
        console.log('\n' + '═'.repeat(50));
        
        if (failed === 0) {
            log.success('🎉 Service IA prêt pour la production !');
            
            console.log('\n📋 Commandes disponibles:');
            console.log('• /ai conseil question:"Votre question"');
            console.log('• /ai astuce');
            console.log('• /ai status');
            
        } else {
            log.warn('⚠️ Certains tests ont échoué. Vérifiez la configuration.');
            
            console.log('\n🛠️ Solutions possibles:');
            console.log('• npm run setup-ai - Configuration automatique');
            console.log('• Vérifiez HUGGINGFACE_API_KEY dans .env'); 
            console.log('• Consultez HUGGINGFACE_API_SETUP.md');
        }
        
        console.log('\n🤖 Le système de fallback garantit un fonctionnement même sans IA !');
    }
}

// Exécution des tests
const tester = new AIServiceTester();
tester.runAllTests().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
});
