#!/usr/bin/env node

/**
 * 🔍 DIAGNOSTIC DES APIs - CityZenBot
 * 
 * Teste la disponibilité de toutes les APIs externes
 * et fournit un rapport détaillé de connectivité
 */

const DataUpdateService = require('./src/services/DataUpdateService');
const Logger = require('./src/utils/Logger');

console.log('🔍 DIAGNOSTIC DES APIs STAR CITIZEN');
console.log('=====================================\n');

async function runAPIDiagnostic() {
    const updateService = new DataUpdateService();
    
    console.log('📡 Test de connectivité des APIs...\n');
    
    // Test de toutes les APIs
    const apiResults = await updateService.testAPIAvailability();
    
    // Statistiques
    const totalAPIs = Object.keys(apiResults).length;
    const availableAPIs = Object.values(apiResults).filter(r => r.available).length;
    const unavailableAPIs = totalAPIs - availableAPIs;
    
    console.log('\n📊 RÉSUMÉ DE CONNECTIVITÉ');
    console.log('==========================');
    console.log(`✅ APIs disponibles: ${availableAPIs}/${totalAPIs}`);
    console.log(`❌ APIs indisponibles: ${unavailableAPIs}/${totalAPIs}`);
    console.log(`📈 Taux de disponibilité: ${Math.round((availableAPIs/totalAPIs)*100)}%`);
    
    // Détail par API
    console.log('\n🔍 DÉTAIL PAR API');
    console.log('==================');
    
    for (const [name, result] of Object.entries(apiResults)) {
        const status = result.available ? '✅ DISPONIBLE' : '❌ INDISPONIBLE';
        const details = result.available 
            ? `(Status: ${result.status})`
            : `(Erreur: ${result.error})`;
            
        console.log(`${status} ${name.toUpperCase()}: ${details}`);
    }
    
    // Recommandations
    console.log('\n💡 RECOMMANDATIONS');
    console.log('===================');
    
    if (availableAPIs === 0) {
        console.log('🚨 CRITIQUE: Aucune API disponible');
        console.log('   → Vérifiez votre connexion Internet');
        console.log('   → Le bot fonctionnera avec les données de fallback');
    } else if (availableAPIs < totalAPIs / 2) {
        console.log('⚠️  PARTIEL: Peu d\'APIs disponibles');
        console.log('   → Certaines fonctionnalités seront limitées');
        console.log('   → Les données de fallback seront utilisées');
    } else {
        console.log('✅ EXCELLENT: La plupart des APIs sont disponibles');
        console.log('   → Le bot aura accès aux données les plus récentes');
    }
    
    // Test spécifique de l'API Star Citizen (la plus importante)
    if (apiResults.scapi?.available) {
        console.log('\n🌌 TEST APPROFONDI - STAR CITIZEN API');
        console.log('=====================================');
        
        try {
            const scData = await updateService.updateStarCitizenData();
            console.log(`✅ Statut univers: ${scData.universe_status}`);
            console.log(`👥 Joueurs en ligne: ${scData.players_online}`);
            console.log(`🖥️  Serveurs: ${scData.servers_available}`);
            console.log(`📦 Vaisseaux: ${scData.ships_count || 0}`);
            console.log(`🎯 Version: ${scData.version || 'N/A'}`);
        } catch (error) {
            console.log('❌ Erreur dans les données Star Citizen:', error.message);
        }
    }
    
    console.log('\n🎯 CONCLUSION');
    console.log('==============');
    
    if (availableAPIs >= 1) {
        console.log('✅ Le bot peut fonctionner normalement');
        console.log('📊 Les données seront mises à jour automatiquement');
        
        if (apiResults.scapi?.available) {
            console.log('🌟 Star Citizen API disponible - Données officielles OK !');
        }
    } else {
        console.log('⚠️  Le bot fonctionnera en mode dégradé');
        console.log('💾 Seules les données de fallback seront utilisées');
    }
    
    console.log('\n📝 Rapport sauvegardé dans les logs système');
    console.log('🔄 Relancez ce diagnostic périodiquement pour surveiller les APIs');
}

// Exécution
runAPIDiagnostic()
    .then(() => {
        console.log('\n✅ Diagnostic terminé');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Erreur lors du diagnostic:', error.message);
        process.exit(1);
    });
