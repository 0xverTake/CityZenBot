const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const StarCitizenService = require('../../services/StarCitizenService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meta')
        .setDescription('Informations sur les méta actuels de Star Citizen')
        .addSubcommand(subcommand =>
            subcommand
                .setName('current')
                .setDescription('Affiche le méta actuel pour PvP et PvE')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tier')
                .setDescription('Affiche la tier list pour un type de gameplay')
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Type de gameplay')
                        .setRequired(true)
                        .addChoices(
                            { name: 'PvP (Joueur vs Joueur)', value: 'pvp' },
                            { name: 'PvE (Joueur vs IA)', value: 'pve' },
                            { name: 'Mining (Minage)', value: 'mining' },
                            { name: 'Cargo (Transport)', value: 'cargo' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('patch')
                .setDescription('Informations sur les changements de la dernière mise à jour')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'current':
                    await this.handleCurrentMeta(interaction);
                    break;
                case 'tier':
                    await this.handleTierList(interaction);
                    break;
                case 'patch':
                    await this.handlePatchNotes(interaction);
                    break;
            }
        } catch (error) {
            console.error('Erreur dans la commande meta:', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    },

    async handleCurrentMeta(interaction) {
        await interaction.deferReply();

        const [pvpMeta, pveMeta] = await Promise.all([
            StarCitizenService.getMetaData('pvp'),
            StarCitizenService.getMetaData('pve')
        ]);

        const embed = new EmbedBuilder()
            .setColor(0xff6b6b)
            .setTitle('🔥 Méta Actuel - Star Citizen')
            .setDescription('Tier lists actuelles pour PvP et PvE')
            .setThumbnail('https://i.imgur.com/star-citizen-logo.png')
            .setTimestamp();

        if (pvpMeta.length > 0) {
            const pvpTiers = this.organizeTiers(pvpMeta);
            const pvpText = this.formatTierList(pvpTiers);
            embed.addFields({
                name: '⚔️ PvP (Joueur vs Joueur)',
                value: pvpText,
                inline: true
            });
        }

        if (pveMeta.length > 0) {
            const pveTiers = this.organizeTiers(pveMeta);
            const pveText = this.formatTierList(pveTiers);
            embed.addFields({
                name: '🤖 PvE (Joueur vs IA)',
                value: pveText,
                inline: true
            });
        }

        embed.addFields({
            name: '📊 Légende',
            value: '**S-Tier:** Méta dominant\n**A-Tier:** Très viable\n**B-Tier:** Solide\n**C-Tier:** Situationnel\n**D-Tier:** À éviter',
            inline: false
        });

        embed.setFooter({
            text: 'Méta basé sur la patch 3.21 | Mis à jour régulièrement'
        });

        await interaction.editReply({ embeds: [embed] });
    },

    async handleTierList(interaction) {
        const type = interaction.options.getString('type');
        
        await interaction.deferReply();

        const metaData = await StarCitizenService.getMetaData(type);

        if (metaData.length === 0) {
            return await interaction.editReply({
                content: `❌ Aucune donnée de méta disponible pour le type "${type}".`
            });
        }

        const tiers = this.organizeTiers(metaData);
        const typeNames = {
            'pvp': '⚔️ PvP (Joueur vs Joueur)',
            'pve': '🤖 PvE (Joueur vs IA)',
            'mining': '⛏️ Mining (Minage)',
            'cargo': '📦 Cargo (Transport)'
        };

        const embed = new EmbedBuilder()
            .setColor(StarCitizenService.getTierColor('S'))
            .setTitle(`${typeNames[type] || type.toUpperCase()} - Tier List`)
            .setDescription('Classement des vaisseaux par efficacité')
            .setTimestamp();

        Object.keys(tiers).forEach(tier => {
            if (tiers[tier].length > 0) {
                const shipList = tiers[tier].map(meta => {
                    const ship = meta.ship_name;
                    const reason = meta.reasoning ? `\n*${meta.reasoning}*` : '';
                    return `**${ship}**${reason}`;
                }).join('\n\n');

                embed.addFields({
                    name: `${this.getTierEmoji(tier)} ${tier}-Tier`,
                    value: shipList,
                    inline: false
                });
            }
        });

        embed.setFooter({
            text: `Basé sur la patch ${metaData[0]?.patch_version || '3.21'}`
        });

        await interaction.editReply({ embeds: [embed] });
    },

    async handlePatchNotes(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('📋 Changements de la Patch 3.21')
            .setDescription('Principaux changements affectant le méta')
            .setTimestamp();

        embed.addFields(
            {
                name: '⚔️ Combat',
                value: '• Rééquilibrage des boucliers\n• Amélioration des dégâts énergétiques\n• Correction des missiles\n• Nouvelles armes disponibles',
                inline: false
            },
            {
                name: '🚀 Vaisseaux',
                value: '• Hornet Mk II ajouté\n• Améliorations du Cutlass Black\n• Corrections sur le Constellation\n• Optimisations de performance',
                inline: false
            },
            {
                name: '🛠️ Composants',
                value: '• Nouveaux boucliers de grade A\n• Moteurs Quantum plus rapides\n• Radiateurs améliorés\n• Nouvelles options de refroidissement',
                inline: false
            },
            {
                name: '🌍 Emplacements',
                value: '• Nouveaux magasins sur ArcCorp\n• Prix réajustés sur Lorville\n• Nouvelle station de vente d\'armes\n• Mise à jour des inventaires',
                inline: false
            }
        );

        embed.setFooter({
            text: 'Pour plus de détails, consultez les notes de patch officielles'
        });

        await interaction.editReply({ embeds: [embed] });
    },

    organizeTiers(metaData) {
        const tiers = { S: [], A: [], B: [], C: [], D: [] };
        
        metaData.forEach(meta => {
            if (tiers[meta.tier]) {
                tiers[meta.tier].push(meta);
            }
        });

        return tiers;
    },

    formatTierList(tiers) {
        const lines = [];
        
        Object.keys(tiers).forEach(tier => {
            if (tiers[tier].length > 0) {
                const ships = tiers[tier].map(meta => meta.ship_name).join(', ');
                lines.push(`**${tier}:** ${ships}`);
            }
        });

        return lines.join('\n') || 'Aucune donnée disponible';
    },

    getTierEmoji(tier) {
        const emojis = {
            'S': '🔥',
            'A': '⭐',
            'B': '👍',
            'C': '👌',
            'D': '👎'
        };
        
        return emojis[tier] || '❓';
    },

    cooldown: 10
};
