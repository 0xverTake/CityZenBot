const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Logger = require('./src/utils/Logger');

async function deployCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'src', 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    // Charger toutes les commandes
    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                Logger.info(`Commande chargée: ${command.data.name}`);
            } else {
                Logger.warn(`Commande mal formatée: ${filePath}`);
            }
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        Logger.info(`Déploiement de ${commands.length} commandes slash...`);

        // Déployer les commandes
        if (process.env.NODE_ENV === 'production') {
            // Déploiement global (production)
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            Logger.info(`${data.length} commandes déployées globalement avec succès!`);
        } else {
            // Déploiement local (développement)
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            Logger.info(`${data.length} commandes déployées localement avec succès!`);
        }
    } catch (error) {
        Logger.error('Erreur lors du déploiement des commandes:', error);
        process.exit(1);
    }
}

// Exécuter le déploiement
deployCommands().catch(console.error);
