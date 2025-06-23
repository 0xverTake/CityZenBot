/**
 * Script de test pour les nouveaux services IA et Spectrum
 * CityZenBot v2.0.1 - Star Citizen 4.2
 */

const AIService = require('./src/services/AIService');
const SpectrumService = require('./src/services/SpectrumService');

console.log('🤖 TEST DES NOUVEAUX SERVICES - CityZenBot v2.0.1');
console.log('=======================================================');

async function testSpectrumService() {
    console.log('📚 Test du service Spectrum...');
    
    try {
        const spectrumService = new SpectrumService();
        await spectrumService.initialize();
        
        // Test des stats
        const stats = spectrumService.getStats();
        console.log(`✅ SpectrumService initialisé: ${stats.totalGuides} guides, ${stats.categoriesAvailable.length} catégories`);
        
        // Test guide par catégorie
        const combatGuide = spectrumService.getGuideByCategory('combat');
        if (combatGuide) {
            console.log(`✅ Guide combat: "${combatGuide.title}" avec ${combatGuide.tips.length} conseils`);
        }
        
        // Test conseils débutant
        const beginnerTips = spectrumService.getBeginnerTips();
        console.log(`✅ Conseils débutant: ${beginnerTips.tips.length} conseils disponibles`);
        
        // Test recherche
        const searchResults = spectrumService.searchGuides('débutant');
        console.log(`✅ Recherche "débutant": ${searchResults.length} résultats`);
        
        // Test nouveautés SC 4.2
        const sc42Updates = spectrumService.getSC42Updates();
        console.log(`✅ Nouveautés SC 4.2: ${sc42Updates.nouveautes.length} nouvelles fonctionnalités`);
        
        return true;
    } catch (error) {
        console.error('❌ Erreur SpectrumService:', error.message);
        return false;
    }
}

async function testAIService() {
    console.log('🤖 Test du service IA...');
    
    try {
        const aiService = new AIService();
        
        // Test des stats
        const stats = aiService.getUsageStats();
        console.log(`✅ AIService initialisé: ${stats.enabled ? 'IA activée' : 'Mode fallback'} (${stats.api_provider})`);
        
        // Test conseil simple
        const advice = await aiService.getAdvice('Comment commencer dans Star Citizen ?', 'debutant', 'nouveau_joueur');
        console.log(`✅ Conseil généré: ${advice.ai_advice.substring(0, 100)}...`);
        console.log(`   📊 Source: ${advice.fallback ? 'Fallback' : 'IA'}, Catégorie: ${advice.category}`);
        
        if (advice.spectrum_tips && advice.spectrum_tips.length > 0) {
            console.log(`   📚 Conseils Spectrum: ${advice.spectrum_tips.length} conseils intégrés`);
        }
        
        // Test conseil combat
        const combatAdvice = await aiService.getAdvice('Quel vaisseau pour débuter en combat ?', 'combat', 'debutant');
        console.log(`✅ Conseil combat: ${combatAdvice.ai_advice.substring(0, 80)}...`);
        
        // Test statistiques usage
        const newStats = aiService.getUsageStats();
        console.log(`✅ Statistiques usage: ${newStats.requests_total} requêtes, ${newStats.cache_size} en cache`);
        
        return true;
    } catch (error) {
        console.error('❌ Erreur AIService:', error.message);
        return false;
    }
}

async function testIntegration() {
    console.log('🔗 Test d\'intégration IA + Spectrum...');
    
    try {
        const aiService = new AIService();
        
        // Test conseil avec enrichissement Spectrum
        const enrichedAdvice = await aiService.getAdvice('Je veux faire du minage', 'minage', 'debutant');
        
        console.log(`✅ Conseil enrichi généré pour minage`);
        console.log(`   🤖 IA: ${enrichedAdvice.ai_advice.substring(0, 60)}...`);
        
        if (enrichedAdvice.spectrum_tips) {
            console.log(`   📚 Conseils Spectrum: ${enrichedAdvice.spectrum_tips.length} conseils`);
        }
        
        if (enrichedAdvice.quick_tips) {
            console.log(`   💡 Conseils rapides: ${enrichedAdvice.quick_tips.length} conseils`);
        }
        
        if (enrichedAdvice.related_commands) {
            console.log(`   🔗 Commandes liées: ${enrichedAdvice.related_commands.join(', ')}`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erreur intégration:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('⏳ Lancement des tests...\n');
    
    const results = {
        spectrum: await testSpectrumService(),
        ai: await testAIService(),
        integration: await testIntegration()
    };
    
    console.log('\n=======================================================');
    console.log('📊 RÉSULTATS DES TESTS');
    console.log('=======================================================');
    
    console.log(`📚 Service Spectrum: ${results.spectrum ? '✅ PASSÉ' : '❌ ÉCHEC'}`);
    console.log(`🤖 Service IA: ${results.ai ? '✅ PASSÉ' : '❌ ÉCHEC'}`);
    console.log(`🔗 Intégration: ${results.integration ? '✅ PASSÉ' : '❌ ÉCHEC'}`);
    
    const passedTests = Object.values(results).filter(r => r).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📈 Taux de réussite: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
        console.log('✨ CityZenBot v2.0.1 est prêt avec:');
        console.log('   🤖 IA Hugging Face gratuite');
        console.log('   📚 Guides officiels RSI Spectrum');
        console.log('   🔗 Intégration complète');
        console.log('   🌌 Compatibilité Star Citizen 4.2');
        
        console.log('\n🚀 Prochaines étapes:');
        console.log('   1. npm run deploy (déployer les commandes)');
        console.log('   2. npm start (démarrer le bot)');
        console.log('   3. Tester /ai conseil et /guides sur Discord');
    } else {
        console.log('\n⚠️ Certains tests ont échoué. Vérifiez la configuration.');
    }
    
    console.log('\n📄 Commandes disponibles:');
    console.log('   /ai conseil - Conseils IA personnalisés');
    console.log('   /ai guides - Guides RSI Spectrum');
    console.log('   /ai nouveautes - Nouveautés SC 4.2');
    console.log('   /ai status - Statut des services');
    console.log('   /guides liste - Tous les guides');
    console.log('   /guides categorie - Guide par catégorie');
    console.log('   /guides recherche - Recherche de guides');
}

// Lancer les tests
runTests().catch(console.error);
