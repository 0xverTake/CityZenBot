// Script pour poster automatiquement la présentation du bot sur Discord
// Usage: node post-presentation.js

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration
const CHANNEL_ID = process.env.PRESENTATION_CHANNEL_ID; // ID du canal où poster
const WEBHOOK_URL = process.env.PRESENTATION_WEBHOOK_URL; // URL du webhook (optionnel)

// Création de l'embed de présentation
function createPresentationEmbed() {
    return new EmbedBuilder()
        .setTitle('🚀 CityZenBot - Assistant Star Citizen')
        .setDescription('L\'outil ultime pour optimiser votre expérience Star Citizen')
        .setColor(0x3465A3)
        .setThumbnail('https://cdn.discordapp.com/attachments/your-image-url.png')
        .addFields(
            {
                name: '🚁 Vaisseaux',
                value: '`/ship <nom>` - Toutes les spécifications détaillées',
                inline: true
            },
            {
                name: '⚔️ Méta PvP/PvE',
                value: '`/meta <type>` - Stratégies et compositions gagnantes',
                inline: true
            },
            {
                name: '🔧 Builds',
                value: '`/build <vaisseau>` - Configurations optimisées',
                inline: true
            },
            {
                name: '🛒 Guide d\'achat',
                value: '`/buy <composant>` - Meilleurs prix et emplacements',
                inline: true
            },
            {
                name: '❓ Aide',
                value: '`/help` - Guide complet des commandes',
                inline: true
            },
            {
                name: '🌟 Bonus',
                value: 'Déployable sur Raspberry Pi !',
                inline: true
            }
        )
        .addFields(
            {
                name: '🎯 Pourquoi CityZenBot ?',
                value: '• **Optimisé** pour tous les joueurs\\n' +
                       '• **Données précises** et mises à jour\\n' +
                       '• **Réponses instantanées**\\n' +
                       '• **Open Source** et personnalisable',
                inline: false
            },
            {
                name: '🌟 Démarrage rapide',
                value: '1. Tapez `/help` pour voir toutes les commandes\\n' +
                       '2. Essayez `/ship Cutlass Black` pour commencer\\n' +
                       '3. Explorez les builds avec `/build Hornet`',
                inline: false
            }
        )
        .setFooter({
            text: 'Développé avec ❤️ pour la communauté Star Citizen',
            iconURL: ''
        })
        .setTimestamp();
}

// Messages de présentation alternatifs
const presentationMessages = [
    {
        content: `🚀 **CITYZENBOT - LE BOT ULTIME POUR STAR CITIZEN** 🚀

🌌 **Découvrez l'assistant parfait pour dominer l'univers de Star Citizen !**

**✨ FONCTIONNALITÉS PRINCIPALES ✨**

🚁 **VAISSEAUX & SPÉCIFICATIONS**
┣━ \`/ship <nom>\` - Infos complètes sur tous les vaisseaux
┣━ Statistiques détaillées (vitesse, armure, blindage)
┣━ Prix, disponibilité et recommandations d'usage
┗━ Base de données constamment mise à jour

⚔️ **MÉTA PVP/PVE OPTIMISÉE**
┣━ \`/meta <pvp/pve> [ship]\` - Stratégies gagnantes
┣━ Compositions d'équipe recommandées  
┣━ Counters et synergies
┗━ Méta actualisée selon les patchs

🔧 **BUILDS ULTRA-OPTIMISÉS**
┣━ \`/build <vaisseau>\` - Configurations parfaites
┣━ Loadouts PvP, PvE, Mining, Trading
┣━ Emplacements et statistiques des composants
┗━ Builds pour tous les styles de jeu

🛒 **GUIDE D'ACHAT INTELLIGENT**
┣━ \`/buy <composant>\` - Où acheter au meilleur prix
┣━ Localisation précise des vendeurs
┣━ Prix et disponibilité en temps réel
┗━ Optimisation des routes commerciales

❓ **AIDE & SUPPORT**
┗━ \`/help\` - Guide complet des commandes

**🎯 POURQUOI CITYZENBOT ?**
• 🎮 **Optimisé pour tous les joueurs** (débutants à experts)
• 📊 **Données ultra-précises** et mises à jour
• ⚡ **Réponses instantanées** et interface intuitive
• 🛠️ **Déployable partout** (PC, serveur, Raspberry Pi)
• 🔒 **Open Source** et personnalisable

**🌟 DÉMARRAGE RAPIDE**
1. Tapez \`/help\` pour voir toutes les commandes
2. Essayez \`/ship Cutlass Black\` pour commencer
3. Explorez les builds avec \`/build Hornet\`

**💎 Rejoignez l'élite des citoyens de l'espace ! 💎**

*Développé avec ❤️ pour la communauté Star Citizen*`
    },
    {
        content: `🚀 **CityZenBot** - Votre copilote Star Citizen ! 

⚔️ Méta PvP/PvE • 🚁 Specs vaisseaux • 🔧 Builds optimisés • 🛒 Guide d'achat

Tapez \`/help\` pour commencer votre aventure ! 🌌`
    }
];

// Fonction pour poster via un webhook
async function postViaWebhook(webhookUrl, messageType = 'embed') {
    const { WebhookClient } = require('discord.js');
    
    try {
        const webhook = new WebhookClient({ url: webhookUrl });
        
        if (messageType === 'embed') {
            const embed = createPresentationEmbed();
            await webhook.send({
                username: 'CityZenBot Presentation',
                avatarURL: 'https://cdn.discordapp.com/attachments/your-bot-avatar.png',
                embeds: [embed]
            });
        } else {
            await webhook.send({
                username: 'CityZenBot Presentation',
                avatarURL: 'https://cdn.discordapp.com/attachments/your-bot-avatar.png',
                content: presentationMessages[0].content
            });
        }
        
        console.log('✅ Présentation postée via webhook avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors du post via webhook:', error);
    }
}

// Fonction pour poster via le bot
async function postViaBot(channelId, messageType = 'embed') {
    try {
        const channel = await client.channels.fetch(channelId);
        
        if (!channel) {
            console.error('❌ Canal introuvable');
            return;
        }
        
        if (messageType === 'embed') {
            const embed = createPresentationEmbed();
            await channel.send({ embeds: [embed] });
        } else if (messageType === 'full') {
            await channel.send(presentationMessages[0]);
        } else {
            await channel.send(presentationMessages[1]);
        }
        
        console.log('✅ Présentation postée avec succès !');
        
        // Ajouter des réactions pour encourager l'interaction
        const message = await channel.send('React avec 🚀 si vous êtes prêts à explorer l\'espace !');
        await message.react('🚀');
        await message.react('🌌');
        await message.react('⚔️');
        await message.react('🔧');
        
    } catch (error) {
        console.error('❌ Erreur lors du post:', error);
    }
}

// Fonction principale
async function main() {
    console.log('🚀 Démarrage du script de présentation...');
    
    const args = process.argv.slice(2);
    const messageType = args[0] || 'embed'; // embed, full, short
    const method = args[1] || 'bot'; // bot, webhook
    
    if (method === 'webhook' && WEBHOOK_URL) {
        await postViaWebhook(WEBHOOK_URL, messageType);
    } else if (method === 'bot' && process.env.DISCORD_TOKEN) {
        client.once('ready', async () => {
            console.log(`🤖 Bot connecté en tant que ${client.user.tag}`);
            
            if (CHANNEL_ID) {
                await postViaBot(CHANNEL_ID, messageType);
            } else {
                console.log('❌ PRESENTATION_CHANNEL_ID non défini dans .env');
            }
            
            await client.destroy();
        });
        
        await client.login(process.env.DISCORD_TOKEN);
    } else {
        console.log('📋 Pour utiliser ce script, configurez dans votre .env :');
        console.log('   PRESENTATION_CHANNEL_ID=ID_DU_CANAL');
        console.log('   PRESENTATION_WEBHOOK_URL=URL_DU_WEBHOOK (optionnel)');
        console.log('');
        console.log('🎯 Usage:');
        console.log('   node post-presentation.js [embed|full|short] [bot|webhook]');
        console.log('');
        console.log('📄 Exemples:');
        console.log('   node post-presentation.js embed bot');
        console.log('   node post-presentation.js full webhook');
        console.log('   node post-presentation.js short');
        
        // Afficher les messages à copier-coller manuellement
        console.log('');
        console.log('📋 Message à copier-coller (version embed) :');
        console.log('');
        console.log(JSON.stringify({
            embeds: [createPresentationEmbed().toJSON()]
        }, null, 2));
        
        console.log('');
        console.log('📋 Message à copier-coller (version complète) :');
        console.log('');
        console.log(presentationMessages[0].content);
    }
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
    console.error('❌ Erreur non gérée:', error);
});

// Lancer le script
main().catch(console.error);
