// Test du bot sans connexion Discord
const DatabaseService = require('./src/services/DatabaseService');
const StarCitizenService = require('./src/services/StarCitizenService');
const Logger = require('./src/utils/Logger');

async function test() {
    try {
        Logger.info('🚀 Test du bot Star Citizen Discord');
        Logger.info('📋 Vérification de l\'environnement...');
        
        // Vérifier les variables d'environnement essentielles
        if (!process.env.DB_PATH && !process.env.DATABASE_URL) {
            Logger.info('ℹ️ Utilisation de la base de données par défaut');
        }
        
        // Test de la base de données
        Logger.info('📊 Test de la base de données...');
        await DatabaseService.initialize();
        
        // Vérifier que la connexion DB est active
        if (!DatabaseService.db) {
            throw new Error('La base de données n\'est pas connectée après initialisation');
        }
        Logger.info('✅ Base de données initialisée et connectée');
        
        // Test du service Star Citizen
        Logger.info('🌌 Test du service Star Citizen...');
        await StarCitizenService.initialize();
        Logger.info('✅ Service Star Citizen initialisé');
        
        // Test de récupération de données
        Logger.info('🚀 Test de récupération de vaisseaux...');
        const ships = await DatabaseService.getAllShips();
        Logger.info(`✅ ${ships.length} vaisseaux chargés`);
          // Test d'un vaisseau spécifique
        Logger.info('🔍 Test de recherche de vaisseau spécifique...');
        const hornet = await StarCitizenService.getShipInfo('Hornet F7C');
        if (hornet) {
            Logger.info(`✅ Vaisseau trouvé: ${hornet.name} (${hornet.manufacturer})`);
        } else {
            Logger.warn('⚠️ Vaisseau Hornet F7C non trouvé, test avec un autre...');
            const firstShip = ships[0];
            if (firstShip) {
                const shipInfo = await StarCitizenService.getShipInfo(firstShip.name);
                Logger.info(`✅ Test avec ${firstShip.name}: ${shipInfo ? 'Trouvé' : 'Non trouvé'}`);
            }
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
        Logger.info('📊 Résumé des tests:');
        Logger.info(`   ✅ Base de données: ${ships.length} vaisseaux`);
        Logger.info(`   ✅ Recherche: ${searchResults.length} résultats Aegis`);
        Logger.info(`   ✅ Builds: ${builds.length} builds trouvés`);
        Logger.info(`   ✅ Méta: ${pvpMeta.length} entrées PvP`);
        Logger.info('');
        Logger.info('📝 Prochaines étapes:');
        Logger.info('1. Configurez votre token Discord dans .env');
        Logger.info('2. Définissez CLIENT_ID et GUILD_ID pour votre serveur');
        Logger.info('3. Lancez: npm run deploy');
        Logger.info('4. Démarrez le bot: npm start');
          } catch (error) {
        Logger.error('❌ Erreur lors du test:', error);
        Logger.error('💡 Suggestions:');
        Logger.error('   - Vérifiez que le dossier database/ existe');
        Logger.error('   - Vérifiez les permissions d\'écriture');
        Logger.error('   - Assurez-vous que SQLite3 est installé');
        Logger.error('   - Essayez: npm run clean && npm install');
        process.exit(1);
    } finally {
        Logger.info('🔄 Fermeture de la base de données...');
        try {
            await DatabaseService.close();
            Logger.info('✅ Base de données fermée proprement');
        } catch (closeError) {
            Logger.warn('⚠️ Erreur lors de la fermeture:', closeError.message);
        }
        process.exit(0);
    }
}

test();
