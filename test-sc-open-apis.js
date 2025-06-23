// Script de test pour les nouvelles APIs SC-Open.dev
// Ce script valide que toutes les nouvelles APIs fonctionnent correctement

const DataUpdateService = require('./src/services/DataUpdateService');
const StarCitizenService = require('./src/services/StarCitizenService');
const Logger = require('./src/utils/Logger');

class SCOpenAPITester {
    constructor() {
        this.dataService = new DataUpdateService();
        this.scService = StarCitizenService;
        this.results = {};
    }

    async runAllTests() {
        console.log('🚀 Démarrage des tests des APIs SC-Open.dev...\n');

        try {
            // Test de disponibilité des endpoints
            console.log('📡 Test de disponibilité des endpoints...');
            await this.testEndpointAvailability();

            // Test des nouvelles méthodes de récupération de données
            console.log('\n📊 Test de récupération des données...');
            await this.testDataRetrieval();

            // Test des nouvelles méthodes de formatage
            console.log('\n🎨 Test de formatage des données...');
            await this.testDataFormatting();

            // Test de performance
            console.log('\n⚡ Test de performance...');
            await this.testPerformance();

            // Affichage des résultats
            console.log('\n📋 Résultats des tests:');
            this.displayResults();

        } catch (error) {
            console.error('❌ Erreur lors des tests:', error);
        }
    }

    async testEndpointAvailability() {
        try {
            const availability = await this.dataService.testOfficialEndpoints();
            this.results.endpoints = availability;

            let successCount = 0;
            let totalCount = 0;

            for (const [endpoint, result] of Object.entries(availability)) {
                totalCount++;
                if (result.status === 'available') {
                    successCount++;
                    console.log(`  ✅ ${endpoint}: ${result.count} éléments disponibles`);
                } else {
                    console.log(`  ❌ ${endpoint}: ${result.error}`);
                }
            }

            console.log(`\n📊 Endpoints disponibles: ${successCount}/${totalCount}`);
        } catch (error) {
            console.error('❌ Erreur test endpoints:', error.message);
        }
    }

    async testDataRetrieval() {
        const tests = [
            { name: 'Ships', method: () => this.dataService.updateShipsData() },
            { name: 'Components', method: () => this.dataService.updateComponentsData() },
            { name: 'Stations', method: () => this.dataService.updateStationsData() },
            { name: 'Commodities', method: () => this.dataService.updateCommoditiesData() },
            { name: 'Shops', method: () => this.dataService.updateShopsData() },
            { name: 'Hangars', method: () => this.dataService.updateHangarsData() }
        ];

        this.results.dataRetrieval = {};

        for (const test of tests) {
            try {
                console.log(`  🔄 Test ${test.name}...`);
                const startTime = Date.now();
                const data = await test.method();
                const endTime = Date.now();
                
                this.results.dataRetrieval[test.name] = {
                    success: true,
                    count: Array.isArray(data) ? data.length : 0,
                    time: endTime - startTime
                };
                
                console.log(`  ✅ ${test.name}: ${this.results.dataRetrieval[test.name].count} éléments en ${this.results.dataRetrieval[test.name].time}ms`);
            } catch (error) {
                this.results.dataRetrieval[test.name] = {
                    success: false,
                    error: error.message
                };
                console.log(`  ❌ ${test.name}: ${error.message}`);
            }
        }
    }

    async testDataFormatting() {
        try {
            // Test formatage des vaisseaux
            const ships = this.dataService.getCachedData('ships');
            if (ships && ships.length > 0) {
                const formattedShip = this.scService.formatShipEmbed(ships[0]);
                console.log(`  ✅ Formatage vaisseau: ${formattedShip ? 'OK' : 'Erreur'}`);
            }

            // Test formatage des stations
            const stations = this.dataService.getCachedData('stations');
            if (stations && stations.length > 0) {
                const formattedStation = this.scService.formatStationEmbed(stations[0]);
                console.log(`  ✅ Formatage station: ${formattedStation ? 'OK' : 'Erreur'}`);
            }

            // Test formatage des composants
            const components = this.dataService.getCachedData('components');
            if (components && components.length > 0) {
                const formattedComponent = this.scService.formatComponentEmbed(components[0]);
                console.log(`  ✅ Formatage composant: ${formattedComponent ? 'OK' : 'Erreur'}`);
            }

            // Test formatage des magasins
            const shops = this.dataService.getCachedData('shops');
            if (shops && shops.length > 0) {
                const formattedShop = this.scService.formatShopEmbed(shops[0]);
                console.log(`  ✅ Formatage magasin: ${formattedShop ? 'OK' : 'Erreur'}`);
            }

            // Test formatage des commodités
            const commodities = this.dataService.getCachedData('commodities');
            if (commodities && commodities.length > 0) {
                const formattedCommodity = this.scService.formatCommodityEmbed(commodities[0]);
                console.log(`  ✅ Formatage commodité: ${formattedCommodity ? 'OK' : 'Erreur'}`);
            }

        } catch (error) {
            console.error('❌ Erreur test formatage:', error.message);
        }
    }

    async testPerformance() {
        try {
            console.log('  🔄 Test de performance globale...');
            
            const startTime = Date.now();
            await this.dataService.updateAllData();
            const endTime = Date.now();
            
            const stats = await this.dataService.getAPIStatistics();
            
            this.results.performance = {
                totalTime: endTime - startTime,
                totalItems: stats.total_cached_items,
                itemsPerSecond: Math.round(stats.total_cached_items / ((endTime - startTime) / 1000))
            };

            console.log(`  ✅ Performance: ${this.results.performance.totalItems} éléments en ${this.results.performance.totalTime}ms`);
            console.log(`  📈 Vitesse: ${this.results.performance.itemsPerSecond} éléments/seconde`);

        } catch (error) {
            console.error('❌ Erreur test performance:', error.message);
        }
    }

    displayResults() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RAPPORT DE TEST SC-OPEN.DEV APIs');
        console.log('='.repeat(60));

        // Résultats endpoints
        if (this.results.endpoints) {
            console.log('\n🔗 ENDPOINTS:');
            for (const [endpoint, result] of Object.entries(this.results.endpoints)) {
                const status = result.status === 'available' ? '✅' : '❌';
                const count = result.count ? ` (${result.count} éléments)` : '';
                console.log(`  ${status} ${endpoint}${count}`);
            }
        }

        // Résultats récupération de données
        if (this.results.dataRetrieval) {
            console.log('\n📦 RÉCUPÉRATION DE DONNÉES:');
            for (const [type, result] of Object.entries(this.results.dataRetrieval)) {
                const status = result.success ? '✅' : '❌';
                const info = result.success ? 
                    ` ${result.count} éléments (${result.time}ms)` : 
                    ` ${result.error}`;
                console.log(`  ${status} ${type}:${info}`);
            }
        }

        // Résultats performance
        if (this.results.performance) {
            console.log('\n⚡ PERFORMANCE:');
            console.log(`  📊 Total d'éléments: ${this.results.performance.totalItems}`);
            console.log(`  ⏱️  Temps total: ${this.results.performance.totalTime}ms`);
            console.log(`  🚀 Vitesse: ${this.results.performance.itemsPerSecond} éléments/sec`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 Tests terminés !');
        console.log('='.repeat(60));
    }
}

// Exécution du script
if (require.main === module) {
    const tester = new SCOpenAPITester();
    tester.runAllTests().catch(console.error);
}

module.exports = SCOpenAPITester;
