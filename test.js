// Test du bot sans connexion Discord
const DatabaseService = require('./src/services/DatabaseService');
const StarCitizenService = require('./src/services/StarCitizenService');
const Logger = require('./src/utils/Logger');

async function test() {
    try {
        Logger.info('🚀 Test du bot Star Citizen Discord');
        
        // Test de la base de données
        Logger.info('📊 Test de la base de données...');
        await DatabaseService.initialize();
        Logger.info('✅ Base de données initialisée');
        
        // Test du service Star Citizen
        Logger.info('🌌 Test du service Star Citizen...');
        await StarCitizenService.initialize();
        Logger.info('✅ Service Star Citizen initialisé');
        
        // Test de récupération de données
        Logger.info('🚀 Test de récupération de vaisseaux...');
        const ships = await DatabaseService.getAllShips();
        Logger.info(`✅ ${ships.length} vaisseaux chargés`);
        
        // Test d'un vaisseau spécifique
        const hornet = await StarCitizenService.getShipInfo('Hornet F7C');
        if (hornet) {
            Logger.info(`✅ Vaisseau trouvé: ${hornet.name} (${hornet.manufacturer})`);
        }
        
        // Test de recherche
        const searchResults = await StarCitizenService.searchShips('Aegis');
        Logger.info(`✅ Recherche 'Aegis': ${searchResults.length} résultats`);
        
        // Test des builds
        const builds = await DatabaseService.getBuildsByShip('Hornet F7C');
        Logger.info(`✅ Builds pour Hornet F7C: ${builds.length} trouvés`);
        
        // Test du méta
        const pvpMeta = await StarCitizenService.getMetaData('pvp');
        Logger.info(`✅ Méta PvP: ${pvpMeta.length} entrées`);
        
        Logger.info('🎉 Tous les tests sont passés avec succès !');
        Logger.info('');
        Logger.info('📝 Prochaines étapes:');
        Logger.info('1. Configurez votre token Discord dans .env');
        Logger.info('2. Définissez GUILD_ID pour votre serveur de test');
        Logger.info('3. Lancez: node deploy-commands.js');
        Logger.info('4. Démarrez le bot: npm start');
        
    } catch (error) {
        Logger.error('❌ Erreur lors du test:', error);
    } finally {
        await DatabaseService.close();
        process.exit(0);
    }
}

test();
