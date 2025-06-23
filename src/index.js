const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DatabaseService = require('./services/DatabaseService');
const StarCitizenService = require('./services/StarCitizenService');
const Logger = require('./utils/Logger');

class StarCitizenBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        this.commands = new Collection();
        this.cooldowns = new Collection();
        
        this.initializeServices();
        this.loadCommands();
        this.setupEventHandlers();
    }

    async initializeServices() {
        try {
            // Initialiser la base de données
            await DatabaseService.initialize();
            Logger.info('Base de données initialisée');

            // Initialiser le service Star Citizen
            await StarCitizenService.initialize();
            Logger.info('Service Star Citizen initialisé');

            // Démarrer les tâches périodiques
            this.startPeriodicTasks();
        } catch (error) {
            Logger.error('Erreur lors de l\'initialisation des services:', error);
            process.exit(1);
        }
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const commandFiles = fs.readdirSync(folderPath)
                .filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    Logger.info(`Commande chargée: ${command.data.name}`);
                } else {
                    Logger.warn(`Commande mal formatée: ${filePath}`);
                }
            }
        }
    }

    setupEventHandlers() {
        this.client.once('ready', () => {
            Logger.info(`Bot connecté en tant que ${this.client.user.tag}`);
            this.client.user.setActivity('Star Citizen - /help', { type: 'PLAYING' });
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            // Système de cooldown
            if (!this.cooldowns.has(command.data.name)) {
                this.cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = this.cooldowns.get(command.data.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({
                        content: `⏰ Veuillez attendre ${timeLeft.toFixed(1)} seconde(s) avant de réutiliser cette commande.`,
                        ephemeral: true
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
            } catch (error) {
                Logger.error(`Erreur lors de l'exécution de ${command.data.name}:`, error);
                
                const errorEmbed = {
                    color: 0xff0000,
                    title: '❌ Erreur',
                    description: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                    timestamp: new Date().toISOString()
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            }
        });

        this.client.on('error', (error) => {
            Logger.error('Erreur du client Discord:', error);
        });
    }

    startPeriodicTasks() {
        const cron = require('node-cron');
        
        // Mise à jour des données toutes les heures
        cron.schedule('0 * * * *', async () => {
            try {
                Logger.info('Mise à jour des données périodique...');
                await StarCitizenService.updateData();
                Logger.info('Mise à jour terminée');
            } catch (error) {
                Logger.error('Erreur lors de la mise à jour périodique:', error);
            }
        });

        // Nettoyage de la base de données tous les jours à 2h
        cron.schedule('0 2 * * *', async () => {
            try {
                Logger.info('Nettoyage de la base de données...');
                await DatabaseService.cleanup();
                Logger.info('Nettoyage terminé');
            } catch (error) {
                Logger.error('Erreur lors du nettoyage:', error);
            }
        });
    }

    async start() {
        try {
            await this.client.login(process.env.DISCORD_TOKEN);
        } catch (error) {
            Logger.error('Erreur lors de la connexion:', error);
            process.exit(1);
        }
    }

    async stop() {
        Logger.info('Arrêt du bot...');
        await DatabaseService.close();
        this.client.destroy();
    }
}

// Gestion des signaux pour un arrêt propre
process.on('SIGINT', async () => {
    Logger.info('Signal SIGINT reçu, arrêt du bot...');
    if (global.bot) {
        await global.bot.stop();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    Logger.info('Signal SIGTERM reçu, arrêt du bot...');
    if (global.bot) {
        await global.bot.stop();
    }
    process.exit(0);
});

// Démarrage du bot
const bot = new StarCitizenBot();
global.bot = bot;
bot.start().catch(console.error);

module.exports = StarCitizenBot;
