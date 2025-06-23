#!/usr/bin/env node

// Script de configuration rapide pour CityZenBot
// Usage: node quick-setup.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Configuration Rapide de CityZenBot\n');

// Configuration par défaut
const config = {
    DISCORD_TOKEN: '',
    CLIENT_ID: '',
    GUILD_ID: '',
    DB_PATH: './database/starcitizenbot.db',
    NODE_ENV: 'development',
    BOT_PREFIX: '!',
    UPDATE_INTERVAL: '3600000',
    STARCITIZEN_API_URL: 'https://api.starcitizen-api.com',
    ERKUL_API_URL: 'https://www.erkul.games',
    UPDATES_CHANNEL_ID: '',
    LOGS_CHANNEL_ID: '',
    PRESENTATION_CHANNEL_ID: '',
    PRESENTATION_WEBHOOK_URL: ''
};

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

function validateDiscordToken(token) {
    return token && token.length > 50 && token.includes('.');
}

function validateDiscordId(id) {
    return /^\d{15,20}$/.test(id);
}

async function main() {
    try {
        console.log('📝 Nous allons configurer votre bot étape par étape.\n');
        
        // 1. Discord Token
        console.log('1️⃣ TOKEN DISCORD');
        console.log('   Allez sur https://discord.com/developers/applications');
        console.log('   Sélectionnez votre bot → Section "Bot" → Copiez le Token\n');
        
        let token = '';
        while (!validateDiscordToken(token)) {
            token = await askQuestion('🔑 Entrez votre Discord Token: ');
            if (!validateDiscordToken(token)) {
                console.log('❌ Token invalide. Il doit contenir des points et faire plus de 50 caractères.\n');
            }
        }
        config.DISCORD_TOKEN = token;
        console.log('✅ Token Discord configuré\n');

        // 2. Application ID
        console.log('2️⃣ APPLICATION ID (CLIENT_ID)');
        console.log('   Dans la même page → Section "General Information" → Copiez l\'Application ID\n');
        
        let clientId = '';
        while (!validateDiscordId(clientId)) {
            clientId = await askQuestion('🆔 Entrez votre Application ID: ');
            if (!validateDiscordId(clientId)) {
                console.log('❌ ID invalide. Il doit être un nombre de 15-20 chiffres.\n');
            }
        }
        config.CLIENT_ID = clientId;
        console.log('✅ Application ID configuré\n');

        // 3. Guild ID
        console.log('3️⃣ GUILD ID (ID du serveur)');
        console.log('   Dans Discord → Paramètres → Avancé → Mode développeur ON');
        console.log('   Clic droit sur votre serveur → Copier l\'identifiant\n');
        
        let guildId = '';
        while (!validateDiscordId(guildId)) {
            guildId = await askQuestion('🏠 Entrez l\'ID de votre serveur: ');
            if (!validateDiscordId(guildId)) {
                console.log('❌ ID invalide. Il doit être un nombre de 15-20 chiffres.\n');
            }
        }
        config.GUILD_ID = guildId;
        console.log('✅ Guild ID configuré\n');

        // 4. Options avancées
        console.log('4️⃣ OPTIONS AVANCÉES (optionnel)');
        const advanced = await askQuestion('Voulez-vous configurer les options avancées ? (o/N): ');
        
        if (advanced.toLowerCase() === 'o' || advanced.toLowerCase() === 'oui') {
            console.log('\n📊 Canaux spéciaux (optionnel):');
            config.UPDATES_CHANNEL_ID = await askQuestion('ID du canal des mises à jour (Enter pour ignorer): ');
            config.LOGS_CHANNEL_ID = await askQuestion('ID du canal des logs (Enter pour ignorer): ');
            config.PRESENTATION_CHANNEL_ID = await askQuestion('ID du canal de présentation (Enter pour ignorer): ');
            
            console.log('\n🔧 Configuration du bot:');
            const prefix = await askQuestion('Préfixe du bot (défaut: !): ');
            if (prefix) config.BOT_PREFIX = prefix;
            
            const env = await askQuestion('Environnement (development/production, défaut: development): ');
            if (env) config.NODE_ENV = env;
        }

        // 5. Écriture du fichier .env
        console.log('\n📝 Création du fichier .env...');
        
        let envContent = '# Configuration CityZenBot\n';
        envContent += '# Généré automatiquement le ' + new Date().toISOString() + '\n\n';
        
        envContent += '# Configuration Discord\n';
        envContent += `DISCORD_TOKEN=${config.DISCORD_TOKEN}\n`;
        envContent += `CLIENT_ID=${config.CLIENT_ID}\n`;
        envContent += `GUILD_ID=${config.GUILD_ID}\n\n`;
        
        envContent += '# Configuration de la base de données\n';
        envContent += `DB_PATH=${config.DB_PATH}\n\n`;
        
        envContent += '# Configuration du bot\n';
        envContent += `NODE_ENV=${config.NODE_ENV}\n`;
        envContent += `BOT_PREFIX=${config.BOT_PREFIX}\n`;
        envContent += `UPDATE_INTERVAL=${config.UPDATE_INTERVAL}\n\n`;
        
        envContent += '# APIs externes\n';
        envContent += `STARCITIZEN_API_URL=${config.STARCITIZEN_API_URL}\n`;
        envContent += `ERKUL_API_URL=${config.ERKUL_API_URL}\n\n`;
        
        envContent += '# Canaux spéciaux\n';
        envContent += `UPDATES_CHANNEL_ID=${config.UPDATES_CHANNEL_ID}\n`;
        envContent += `LOGS_CHANNEL_ID=${config.LOGS_CHANNEL_ID}\n`;
        envContent += `PRESENTATION_CHANNEL_ID=${config.PRESENTATION_CHANNEL_ID}\n`;
        envContent += `PRESENTATION_WEBHOOK_URL=${config.PRESENTATION_WEBHOOK_URL}\n`;
        
        fs.writeFileSync('.env', envContent);
        console.log('✅ Fichier .env créé avec succès!\n');

        // 6. Vérification
        console.log('🔍 Vérification de la configuration...');
        const { spawn } = require('child_process');
        
        const checkProcess = spawn('node', ['check-config.js'], { stdio: 'inherit' });
        
        checkProcess.on('close', (code) => {
            if (code === 0) {
                console.log('\n🎉 Configuration terminée avec succès!');
                console.log('\n📋 Prochaines étapes:');
                console.log('1. Invitez votre bot sur votre serveur avec ce lien:');
                console.log(`   https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&permissions=2147483647&scope=bot%20applications.commands`);
                console.log('2. Déployez les commandes: node deploy-commands.js');
                console.log('3. Démarrez le bot: node src/index.js');
                console.log('\n🚀 Bon voyage dans l\'espace, Citizen!');
            } else {
                console.log('\n⚠️ Il y a encore des problèmes de configuration.');
                console.log('Consultez TROUBLESHOOTING.md pour plus d\'aide.');
            }
            rl.close();
        });

    } catch (error) {
        console.error('❌ Erreur lors de la configuration:', error.message);
        rl.close();
        process.exit(1);
    }
}

// Vérifier si .env existe déjà
if (fs.existsSync('.env')) {
    console.log('⚠️ Un fichier .env existe déjà.');
    rl.question('Voulez-vous le remplacer ? (o/N): ', (answer) => {
        if (answer.toLowerCase() === 'o' || answer.toLowerCase() === 'oui') {
            fs.copyFileSync('.env', '.env.backup');
            console.log('💾 Sauvegarde créée: .env.backup\n');
            main();
        } else {
            console.log('Configuration annulée.');
            rl.close();
        }
    });
} else {
    main();
}
