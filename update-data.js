#!/usr/bin/env node

// Script de mise à jour manuelle des données Star Citizen
// Usage: node update-data.js [--force]

const DataUpdateService = require('./src/services/DataUpdateService');
const Logger = require('./src/utils/Logger');

async function main() {
    console.log('🚀 CityZenBot - Mise à jour des données Star Citizen\n');
    
    const force = process.argv.includes('--force');
    const updateService = new DataUpdateService();
    
    try {
        if (force) {
            console.log('⚡ Mode force activé - Mise à jour immédiate');
        }
        
        console.log('📡 Connexion aux APIs Star Citizen...');
        
        // Test de connectivité
        const axios = require('axios');
        const tests = [
            { name: 'Fleetyards', url: 'https://api.fleetyards.net/v1/ships?limit=1' },
            { name: 'UEX Corp', url: 'https://api.uexcorp.space/2.0/commodities?limit=1' },
            { name: 'SC Unpacked', url: 'https://api.scunpacked.com/locations?limit=1' }
        ];
        
        console.log('\n🔍 Test de connectivité des APIs:');
        for (const test of tests) {
            try {
                await axios.get(test.url, { timeout: 5000 });
                console.log(`✅ ${test.name}: Disponible`);
            } catch (error) {
                console.log(`❌ ${test.name}: Indisponible (${error.message})`);
            }
        }
        
        console.log('\n🔄 Début de la mise à jour...');
        const startTime = Date.now();
        
        await updateService.forceUpdate();
        
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        console.log(`\n🎉 Mise à jour terminée en ${duration} secondes !`);
        
        // Afficher les statistiques
        const status = updateService.getStatus();
        console.log('\n📊 Statistiques:');
        console.log(`   Dernière mise à jour: ${status.lastUpdate}`);
        console.log(`   Types de données: ${status.cachedTypes.join(', ')}`);
        console.log(`   Taille du cache: ${status.cacheSize} types`);
        
        // Afficher le détail des données
        console.log('\n📋 Détail des données mises à jour:');
        for (const type of status.cachedTypes) {
            const data = updateService.getCachedData(type);
            console.log(`   ${type}: ${Array.isArray(data) ? data.length : 'N/A'} éléments`);
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la mise à jour:', error.message);
        console.error('💡 Essayez avec --force pour forcer la mise à jour');
        process.exit(1);
    }
}

// Gestion des arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('📖 Aide - Script de mise à jour des données');
    console.log('');
    console.log('Usage: node update-data.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --force    Force la mise à jour même si les APIs sont indisponibles');
    console.log('  --help     Affiche cette aide');
    console.log('');
    console.log('Exemples:');
    console.log('  node update-data.js              # Mise à jour normale');
    console.log('  node update-data.js --force      # Mise à jour forcée');
    console.log('');
    process.exit(0);
}

// Lancer la mise à jour
main().catch(console.error);
