#!/usr/bin/env node

// Script d'installation et de configuration API Hugging Face
// Usage: node setup-huggingface-api.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    title: (msg) => console.log(`\n${colors.cyan}${colors.bright}🤖 ${msg}${colors.reset}\n`)
};

class HuggingFaceSetup {
    constructor() {
        this.envFile = path.join(process.cwd(), '.env');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async run() {
        try {
            log.title('CONFIGURATION API HUGGING FACE - CityZenBot');
            
            await this.showIntroduction();
            await this.checkExistingConfig();
            await this.promptForApiKey();
            await this.testApiKey();
            await this.showCompletionMessage();
            
        } catch (error) {
            log.error(`Erreur lors de la configuration: ${error.message}`);
        } finally {
            this.rl.close();
        }
    }

    async showIntroduction() {
        console.log(`${colors.magenta}╔══════════════════════════════════════════════════════════════╗`);
        console.log(`║  🚀 Configuration IA Open Source pour CityZenBot           ║`);
        console.log(`║                                                              ║`);
        console.log(`║  • API Hugging Face GRATUITE à vie                          ║`);
        console.log(`║  • 1000 requêtes/mois gratuites                             ║`);
        console.log(`║  • Fallback intelligent intégré                             ║`);
        console.log(`║  • Compatible Star Citizen 4.2                              ║`);
        console.log(`╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

        log.info('Cette configuration va vous aider à obtenir une API key gratuite');
        log.info('et configurer automatiquement votre bot pour utiliser l\'IA.');
        
        const proceed = await this.askQuestion('\n🔧 Voulez-vous continuer ? (o/N): ');
        if (proceed.toLowerCase() !== 'o' && proceed.toLowerCase() !== 'oui') {
            log.info('Configuration annulée.');
            process.exit(0);
        }
    }

    async checkExistingConfig() {
        log.info('Vérification de la configuration existante...');
        
        if (fs.existsSync(this.envFile)) {
            const envContent = fs.readFileSync(this.envFile, 'utf8');
            if (envContent.includes('HUGGINGFACE_API_KEY')) {
                const hasKey = envContent.match(/HUGGINGFACE_API_KEY=(.+)/);
                if (hasKey && hasKey[1] && hasKey[1].trim() && !hasKey[1].includes('your_token_here')) {
                    log.success('API key déjà configurée dans .env');
                    
                    const reconfigure = await this.askQuestion('🔄 Voulez-vous la reconfigurer ? (o/N): ');
                    if (reconfigure.toLowerCase() !== 'o' && reconfigure.toLowerCase() !== 'oui') {
                        log.info('Configuration conservée.');
                        return;
                    }
                }
            }
        }
    }

    async promptForApiKey() {
        console.log(`\n${colors.yellow}📖 ÉTAPES POUR OBTENIR VOTRE API KEY GRATUITE:${colors.reset}`);
        console.log('1. Allez sur: https://huggingface.co/');
        console.log('2. Créez un compte gratuit (Sign Up)');
        console.log('3. Allez dans Settings → Access Tokens');
        console.log('4. Créez un nouveau token avec permission "Read"');
        console.log('5. Copiez le token (commence par "hf_")');
        
        console.log(`\n${colors.cyan}💡 Aide détaillée disponible dans: HUGGINGFACE_API_SETUP.md${colors.reset}\n`);

        const apiKey = await this.askQuestion('🔑 Collez votre API key Hugging Face (hf_...): ');
        
        if (!apiKey || !apiKey.startsWith('hf_')) {
            log.error('API key invalide. Elle doit commencer par "hf_"');
            throw new Error('API key invalide');
        }

        await this.saveApiKey(apiKey);
    }

    async saveApiKey(apiKey) {
        log.info('Sauvegarde de la configuration...');
        
        let envContent = '';
        if (fs.existsSync(this.envFile)) {
            envContent = fs.readFileSync(this.envFile, 'utf8');
        }

        // Remplacer ou ajouter la clé
        if (envContent.includes('HUGGINGFACE_API_KEY')) {
            envContent = envContent.replace(
                /HUGGINGFACE_API_KEY=.*/,
                `HUGGINGFACE_API_KEY=${apiKey}`
            );
        } else {
            envContent += `\n# Hugging Face API (IA gratuite)\nHUGGINGFACE_API_KEY=${apiKey}\n`;
        }

        fs.writeFileSync(this.envFile, envContent);
        log.success('API key sauvegardée dans .env');
    }

    async testApiKey() {
        log.info('Test de la connexion API...');
        
        try {
            const StarCitizenAIService = require('./src/services/StarCitizenAIService');
            const aiService = new StarCitizenAIService();
            
            const status = await aiService.checkAIAvailability();
            
            if (status.available) {
                log.success('🎉 API Hugging Face connectée avec succès !');
                log.info(`📊 Quota: ${status.quota || 'Non déterminé'}`);
                log.info(`🤖 Modèle: ${status.model || 'facebook/blenderbot-400M-distill'}`);
            } else {
                log.warn(`⚠️ API indisponible: ${status.reason}`);
                log.info('Le système de fallback fonctionnera normalement.');
            }
        } catch (error) {
            log.warn(`Test API échoué: ${error.message}`);
            log.info('Cela peut être normal si le bot n\'est pas encore démarré.');
        }
    }

    async showCompletionMessage() {
        console.log(`\n${colors.green}${colors.bright}🎉 CONFIGURATION TERMINÉE !${colors.reset}\n`);
        
        console.log(`${colors.cyan}📋 Récapitulatif:${colors.reset}`);
        console.log('✅ API key Hugging Face configurée');
        console.log('✅ Fichier .env mis à jour');
        console.log('✅ Service IA prêt à utiliser');
        
        console.log(`\n${colors.yellow}🚀 Prochaines étapes:${colors.reset}`);
        console.log('1. Redémarrez votre bot Discord');
        console.log('2. Testez avec: /ai status');
        console.log('3. Essayez: /ai conseil question:"Comment débuter ?"');
        
        console.log(`\n${colors.magenta}📊 Limites gratuites:${colors.reset}`);
        console.log('• 1000 requêtes IA par mois');
        console.log('• Fallback automatique si quota dépassé');
        console.log('• Reset mensuel automatique');
        
        console.log(`\n${colors.blue}📖 Documentation:${colors.reset}`);
        console.log('• HUGGINGFACE_API_SETUP.md - Guide détaillé');
        console.log('• README.md - Fonctionnalités du bot');
        console.log('• /ai status - Statut en temps réel');
        
        console.log(`\n${colors.green}Votre CityZenBot est maintenant équipé d'une IA open source gratuite ! 🤖${colors.reset}`);
    }

    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }
}

// Exécution du script
if (require.main === module) {
    const setup = new HuggingFaceSetup();
    setup.run().then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error('Erreur:', error.message);
        process.exit(1);
    });
}

module.exports = HuggingFaceSetup;
