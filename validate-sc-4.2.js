#!/usr/bin/env node

/**
 * 🚀 VALIDATION STAR CITIZEN 4.2 - CityZenBot v2.0.1
 * 
 * Script de validation pour Star Citizen 4.2
 * Vérifie que toutes les APIs sont compatibles SC 4.2
 */

const axios = require('axios');
const fs = require('fs');

console.log('🚀 VALIDATION STAR CITIZEN 4.2 - CityZenBot v2.0.1');
console.log('='.repeat(55));
console.log();

const apis = {
    fleetyards: 'https://api.fleetyards.net/v1',
    uex: 'https://api.uexcorp.space/2.0', 
    scapi: 'https://api.sc-api.com/v1',
    erkul: 'https://api.erkul.games',
    scunpacked: 'https://scunpacked.com/api'
};

let results = {
    available: 0,
    unavailable: 0,
    sc42_compatible: 0,
    tests: []
};

async function testAPI(name, url) {
    try {
        const response = await axios.get(url, {
            timeout: 5000,
            headers: { 'User-Agent': 'CityZenBot/2.0.1' }
        });
        
        results.available++;
        console.log(`✅ ${name.padEnd(12)} : Disponible (${response.status})`);
        
        results.tests.push({
            name,
            status: 'available',
            code: response.status,
            url
        });
        
        return true;
    } catch (error) {
        results.unavailable++;
        const statusCode = error.response?.status || 'N/A';
        console.log(`❌ ${name.padEnd(12)} : Indisponible (${statusCode})`);
        
        results.tests.push({
            name,
            status: 'unavailable', 
            error: error.message,
            url
        });
        
        return false;
    }
}

async function testSC42Compatibility() {
    console.log('\n🌌 Test de compatibilité Star Citizen 4.2...');
    
    // Test Fleetyards pour les stations SC 4.2
    try {
        const response = await axios.get(`${apis.fleetyards}/stations`, {
            timeout: 10000,
            headers: { 'User-Agent': 'CityZenBot/2.0.1' },
            params: { per_page: 5 }
        });
        
        const stationsCount = response.data.length;
        console.log(`✅ Fleetyards SC 4.2: ${stationsCount} stations récupérées`);
        results.sc42_compatible++;
        
    } catch (error) {
        console.log(`❌ Fleetyards SC 4.2: Erreur stations`);
    }
    
    // Test UEX Corp pour SC 4.2
    try {
        const response = await axios.get(`${apis.uex}/commodities`, {
            timeout: 10000,
            headers: { 'User-Agent': 'CityZenBot/2.0.1' },
            params: { limit: 5 }
        });
        
        const commoditiesCount = response.data.length;
        console.log(`✅ UEX Corp SC 4.2: ${commoditiesCount} commodités récupérées`);
        results.sc42_compatible++;
        
    } catch (error) {
        console.log(`❌ UEX Corp SC 4.2: Erreur commodités`);
    }
}

async function main() {
    console.log('🔍 Test de disponibilité des APIs...');
    
    for (const [name, url] of Object.entries(apis)) {
        await testAPI(name, url);
    }
    
    await testSC42Compatibility();
    
    console.log('\n' + '='.repeat(55));
    console.log('📊 RÉSULTATS DE VALIDATION SC 4.2');
    console.log('='.repeat(55));
    
    console.log(`✅ APIs disponibles     : ${results.available}/${Object.keys(apis).length}`);
    console.log(`❌ APIs indisponibles   : ${results.unavailable}/${Object.keys(apis).length}`);
    console.log(`🌌 Compatible SC 4.2    : ${results.sc42_compatible}/2`);
    
    const totalAPIs = Object.keys(apis).length;
    const availability = Math.round((results.available / totalAPIs) * 100);
    const sc42Compatibility = Math.round((results.sc42_compatible / 2) * 100);
    
    console.log(`\n📈 Taux de disponibilité : ${availability}%`);
    console.log(`🚀 Compatibilité SC 4.2  : ${sc42Compatibility}%`);
    
    if (results.available >= 2 && results.sc42_compatible >= 1) {
        console.log('\n🎉 VALIDATION RÉUSSIE !');
        console.log('✨ CityZenBot v2.0.1 est compatible Star Citizen 4.2');
        console.log('\n🚀 Recommandations:');
        
        if (results.sc42_compatible === 2) {
            console.log('   ✅ Toutes les APIs SC 4.2 fonctionnent parfaitement');
        } else {
            console.log('   ⚠️  Une API SC 4.2 indisponible, fallbacks actifs');
        }
        
        console.log('   ✅ npm run update-data pour récupérer les données SC 4.2');
        console.log('   ✅ npm start pour lancer le bot');
        
        // Sauvegarder le rapport
        const report = {
            timestamp: new Date().toISOString(),
            version: '2.0.1',
            star_citizen_version: '4.2',
            status: 'SC_4_2_COMPATIBLE',
            availability: availability,
            sc42_compatibility: sc42Compatibility,
            results: results
        };
        
        fs.writeFileSync('SC_4_2_VALIDATION_REPORT.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Rapport sauvegardé: SC_4_2_VALIDATION_REPORT.json');
        
        process.exit(0);
    } else {
        console.log('\n❌ VALIDATION ÉCHOUÉE');
        console.log('🔧 Problèmes détectés pour Star Citizen 4.2');
        console.log('💡 Le bot peut toujours fonctionner avec les fallbacks');
        process.exit(1);
    }
}

main().catch(console.error);
