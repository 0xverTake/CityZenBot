// Script de vérification de configuration
// Usage: node check-config.js

require('dotenv').config();
const Logger = require('./src/utils/Logger');

console.log('🔍 Vérification de la configuration...\n');

const requiredVars = [
    'DISCORD_TOKEN',
    'CLIENT_ID',
    'GUILD_ID'
];

const optionalVars = [
    'DB_PATH',
    'NODE_ENV',
    'STARCITIZEN_API_URL',
    'ERKUL_API_URL',
    'BOT_PREFIX',
    'UPDATE_INTERVAL'
];

let hasErrors = false;

// Vérifier les variables requises
console.log('📋 Variables requises:');
for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value === 'your_discord_bot_token_here' || value === 'your_discord_application_id_here' || value === 'your_guild_id_here') {
        console.log(`❌ ${varName}: MANQUANT ou non configuré`);
        hasErrors = true;
    } else {
        // Masquer partiellement les tokens pour la sécurité
        let displayValue = value;
        if (varName === 'DISCORD_TOKEN') {
            displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 5);
        } else if (varName === 'CLIENT_ID' || varName === 'GUILD_ID') {
            displayValue = value.length > 10 ? value.substring(0, 8) + '...' + value.substring(value.length - 4) : value;
        }
        console.log(`✅ ${varName}: ${displayValue}`);
    }
}

console.log('\n📋 Variables optionnelles:');
for (const varName of optionalVars) {
    const value = process.env[varName];
    if (!value) {
        console.log(`⚠️  ${varName}: non défini (utilise la valeur par défaut)`);
    } else {
        console.log(`✅ ${varName}: ${value}`);
    }
}

// Vérifications spécifiques
console.log('\n🔧 Vérifications spécifiques:');

// Vérifier le format du token Discord
if (process.env.DISCORD_TOKEN) {
    const token = process.env.DISCORD_TOKEN;
    if (!token.includes('.')) {
        console.log('❌ DISCORD_TOKEN: Format invalide (doit contenir des points)');
        hasErrors = true;
    } else {
        console.log('✅ DISCORD_TOKEN: Format correct');
    }
} else {
    console.log('❌ DISCORD_TOKEN: Manquant');
    hasErrors = true;
}

// Vérifier CLIENT_ID (doit être numérique)
if (process.env.CLIENT_ID) {
    const clientId = process.env.CLIENT_ID;
    if (!/^\d+$/.test(clientId)) {
        console.log('❌ CLIENT_ID: Doit être un nombre (ID Discord)');
        hasErrors = true;
    } else if (clientId.length < 15 || clientId.length > 20) {
        console.log('❌ CLIENT_ID: Longueur incorrecte pour un ID Discord');
        hasErrors = true;
    } else {
        console.log('✅ CLIENT_ID: Format correct');
    }
} else {
    console.log('❌ CLIENT_ID: Manquant');
    hasErrors = true;
}

// Vérifier GUILD_ID (doit être numérique)
if (process.env.GUILD_ID) {
    const guildId = process.env.GUILD_ID;
    if (!/^\d+$/.test(guildId)) {
        console.log('❌ GUILD_ID: Doit être un nombre (ID Discord)');
        hasErrors = true;
    } else if (guildId.length < 15 || guildId.length > 20) {
        console.log('❌ GUILD_ID: Longueur incorrecte pour un ID Discord');
        hasErrors = true;
    } else {
        console.log('✅ GUILD_ID: Format correct');
    }
} else {
    console.log('❌ GUILD_ID: Manquant');
    hasErrors = true;
}

// Vérifier l'existence du fichier .env
const fs = require('fs');
if (fs.existsSync('.env')) {
    console.log('✅ Fichier .env: Trouvé');
} else {
    console.log('❌ Fichier .env: Introuvable');
    console.log('💡 Copiez .env.example vers .env et configurez-le');
    hasErrors = true;
}

// Vérifier la structure des dossiers
const requiredDirs = ['src', 'src/commands', 'src/services', 'src/utils', 'src/data'];
console.log('\n📁 Structure des dossiers:');
for (const dir of requiredDirs) {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir}/: Existe`);
    } else {
        console.log(`❌ ${dir}/: Manquant`);
        hasErrors = true;
    }
}

// Résumé final
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Configuration INCOMPLÈTE');
    console.log('\n💡 Comment corriger:');
    console.log('1. Copiez .env.example vers .env si pas déjà fait');
    console.log('2. Éditez .env avec vos vraies valeurs:');
    console.log('   - DISCORD_TOKEN: Token de votre bot Discord');
    console.log('   - CLIENT_ID: ID de l\'application Discord (Application ID)');
    console.log('   - GUILD_ID: ID de votre serveur Discord');
    console.log('\n🔗 Ressources:');
    console.log('   • Portal développeur Discord: https://discord.com/developers/applications');
    console.log('   • Comment obtenir un ID Discord: https://support.discord.com/hc/en-us/articles/206346498');
} else {
    console.log('✅ Configuration COMPLÈTE et valide!');
    console.log('🚀 Vous pouvez maintenant déployer les commandes et démarrer le bot');
}

console.log('='.repeat(50));

// Test de connexion Discord (optionnel)
if (!hasErrors && process.argv.includes('--test-connection')) {
    console.log('\n🔌 Test de connexion Discord...');
    testDiscordConnection();
}

async function testDiscordConnection() {
    try {
        const { Client, GatewayIntentBits } = require('discord.js');
        const client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });

        const timeout = setTimeout(() => {
            console.log('⏱️  Timeout de connexion (30s)');
            process.exit(1);
        }, 30000);

        client.once('ready', () => {
            clearTimeout(timeout);
            console.log(`✅ Connexion réussie! Bot connecté comme: ${client.user.tag}`);
            console.log(`🎯 Serveurs: ${client.guilds.cache.size}`);
            console.log(`👥 Utilisateurs: ${client.users.cache.size}`);
            client.destroy();
            process.exit(0);
        });

        client.on('error', (error) => {
            clearTimeout(timeout);
            console.log('❌ Erreur de connexion:', error.message);
            process.exit(1);
        });

        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.log('❌ Test de connexion échoué:', error.message);
        process.exit(1);
    }
}
