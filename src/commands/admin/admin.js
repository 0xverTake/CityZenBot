const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const DataUpdateService = require('../../services/DataUpdateService');

let updateService = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Commandes d\'administration du bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Forcer la mise à jour des données')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Voir le statut des mises à jour')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cache')
                .setDescription('Gérer le cache des données')
                .addStringOption(option =>
                    option
                        .setName('action')
                        .setDescription('Action à effectuer')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Vider', value: 'clear' },
                            { name: 'Recharger', value: 'reload' },
                            { name: 'Informations', value: 'info' }
                        )
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Vérifier les permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Vous devez être administrateur pour utiliser cette commande.',
                ephemeral: true
            });
        }

        // Initialiser le service si nécessaire
        if (!updateService) {
            updateService = new DataUpdateService();
        }

        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'update':
                    await handleForceUpdate(interaction);
                    break;
                case 'status':
                    await handleStatus(interaction);
                    break;
                case 'cache':
                    await handleCache(interaction);
                    break;
                default:
                    await interaction.reply({
                        content: '❌ Sous-commande inconnue.',
                        ephemeral: true
                    });
            }
        } catch (error) {
            console.error('Erreur commande admin:', error);
            await interaction.followUp({
                content: '❌ Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    }
};

async function handleForceUpdate(interaction) {
    await interaction.reply({
        content: '🔄 Mise à jour des données en cours... Cela peut prendre quelques minutes.',
        ephemeral: true
    });

    try {
        await updateService.forceUpdate();
        
        const embed = new EmbedBuilder()
            .setTitle('✅ Mise à jour terminée')
            .setDescription('Les données ont été mises à jour avec succès.')
            .setColor(0x00FF00)
            .setTimestamp();

        await interaction.followUp({ embeds: [embed], ephemeral: true });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Échec de la mise à jour')
            .setDescription(`Erreur: ${error.message}`)
            .setColor(0xFF0000)
            .setTimestamp();

        await interaction.followUp({ embeds: [embed], ephemeral: true });
    }
}

async function handleStatus(interaction) {
    const status = updateService.getStatus();
    
    const embed = new EmbedBuilder()
        .setTitle('📊 Statut des Mises à Jour')
        .addFields(
            {
                name: '🕐 Dernière mise à jour',
                value: status.lastUpdate ? 
                    `<t:${Math.floor(status.lastUpdate.getTime() / 1000)}:R>` : 
                    'Jamais',
                inline: true
            },
            {
                name: '⏰ Prochaine mise à jour',
                value: status.nextUpdate !== 'En attente' ? 
                    `<t:${Math.floor(status.nextUpdate.getTime() / 1000)}:R>` : 
                    'En attente',
                inline: true
            },
            {
                name: '💾 Types en cache',
                value: status.cachedTypes.length > 0 ? 
                    status.cachedTypes.join(', ') : 
                    'Aucun',
                inline: false
            },
            {
                name: '📈 Taille du cache',
                value: `${status.cacheSize} types de données`,
                inline: true
            }
        )
        .setColor(0x3498DB)
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleCache(interaction) {
    const action = interaction.options.getString('action');
    
    switch (action) {
        case 'clear':
            // Vider le cache
            updateService.dataCache.clear();
            await interaction.reply({
                content: '🗑️ Cache vidé avec succès.',
                ephemeral: true
            });
            break;
            
        case 'reload':
            await interaction.reply({
                content: '🔄 Rechargement du cache en cours...',
                ephemeral: true
            });
            
            try {
                await updateService.forceUpdate();
                await interaction.followUp({
                    content: '✅ Cache rechargé avec succès.',
                    ephemeral: true
                });
            } catch (error) {
                await interaction.followUp({
                    content: `❌ Erreur lors du rechargement: ${error.message}`,
                    ephemeral: true
                });
            }
            break;
            
        case 'info':
            const cacheInfo = [];
            for (const [type, data] of updateService.dataCache) {
                cacheInfo.push(`**${type}**: ${Array.isArray(data) ? data.length : 'N/A'} éléments`);
            }
            
            const embed = new EmbedBuilder()
                .setTitle('📋 Informations du Cache')
                .setDescription(cacheInfo.length > 0 ? cacheInfo.join('\n') : 'Cache vide')
                .setColor(0x9B59B6)
                .setTimestamp();
                
            await interaction.reply({ embeds: [embed], ephemeral: true });
            break;
    }
}
