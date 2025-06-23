const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const SpectrumService = require('../../services/SpectrumService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guides')
        .setDescription('📚 Guides officiels RSI Spectrum pour Star Citizen 4.2')
        .addSubcommand(subcommand =>
            subcommand
                .setName('liste')
                .setDescription('Voir tous les guides disponibles'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('categorie')
                .setDescription('Guide par catégorie')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Catégorie de guide')
                        .setRequired(true)
                        .addChoices(
                            { name: '🌟 Guide débutant', value: 'debutant' },
                            { name: '⚔️ Combat spatial', value: 'combat' },
                            { name: '💰 Commerce & Trading', value: 'economie' },
                            { name: '⛏️ Minage & Ressources', value: 'minage' },
                            { name: '🔍 Exploration spatiale', value: 'exploration' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('recherche')
                .setDescription('Rechercher un guide spécifique')
                .addStringOption(option =>
                    option.setName('mots_cles')
                        .setDescription('Mots-clés de recherche')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nouveautes')
                .setDescription('Nouveautés et conseils Star Citizen 4.2')),

    async execute(interaction) {
        const spectrumService = new SpectrumService();
        await spectrumService.initialize();
        
        const subcommand = interaction.options.getSubcommand();

        try {
            if (subcommand === 'liste') {
                await this.handleListGuides(interaction, spectrumService);
            } else if (subcommand === 'categorie') {
                await this.handleCategoryGuide(interaction, spectrumService);
            } else if (subcommand === 'recherche') {
                await this.handleSearchGuides(interaction, spectrumService);
            } else if (subcommand === 'nouveautes') {
                await this.handleUpdatesGuide(interaction, spectrumService);
            }
        } catch (error) {
            console.error('Erreur commande guides:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur Guides')
                .setDescription('Une erreur est survenue lors de la récupération des guides.')
                .addFields({
                    name: 'Solution',
                    value: 'Réessayez dans quelques instants ou consultez directement le site RSI.'
                });

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    async handleListGuides(interaction, spectrumService) {
        await interaction.deferReply();

        const allGuides = spectrumService.getAllGuides();
        const stats = spectrumService.getStats();

        const embed = new EmbedBuilder()
            .setColor('#00D4FF')
            .setTitle('📚 Guides officiels RSI Spectrum')
            .setDescription(`Tous les guides disponibles pour Star Citizen 4.2\n📊 **${stats.totalGuides}** guides • **${stats.categoriesAvailable.length}** catégories`)
            .addFields(
                allGuides.map(guide => ({
                    name: `${this.getCategoryEmoji(guide.category)} ${guide.title}`,
                    value: `**Catégorie:** ${guide.category}\n**Tags:** ${guide.tags.join(', ')}\n**Conseils:** ${guide.tips.length} astuces disponibles`,
                    inline: true
                }))
            )
            .addFields({
                name: '🔍 Navigation',
                value: '• Utilisez `/guides categorie` pour un guide spécifique\\n• Utilisez `/guides recherche` pour chercher par mots-clés\\n• Utilisez `/ai conseil` pour des conseils personnalisés avec IA',
                inline: false
            })
            .setFooter({ text: 'CityZenBot • Guides officiels RSI • Star Citizen 4.2' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleCategoryGuide(interaction, spectrumService) {
        await interaction.deferReply();

        const category = interaction.options.getString('type');
        const guide = spectrumService.getGuideByCategory(category);

        if (!guide) {
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('❓ Guide non trouvé')
                .setDescription(`Aucun guide trouvé pour la catégorie "${category}".`)
                .addFields({
                    name: '📚 Guides disponibles',
                    value: 'Utilisez `/guides liste` pour voir tous les guides disponibles.',
                    inline: false
                });
            
            return await interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(`📚 ${guide.title}`)
            .setDescription(`Guide officiel RSI Spectrum • Mis à jour pour Star Citizen 4.2`)
            .addFields([
                {
                    name: '🎯 Informations',
                    value: `**Catégorie:** ${this.getCategoryEmoji(guide.category)} ${guide.category}\\n**Tags:** ${guide.tags.map(tag => `\`${tag}\``).join(' ')}\\n**Dernière MAJ:** ${guide.lastUpdated || 'Récemment'}`,
                    inline: false
                },
                {
                    name: '💡 Conseils essentiels',
                    value: guide.tips.map((tip, index) => `${index + 1}. ${tip}`).join('\\n'),
                    inline: false
                },
                {
                    name: '🔗 Ressources',
                    value: `[📖 Guide complet sur RSI](${guide.url})\\n[🤖 Conseil IA personnalisé](/ai conseil)\\n[📊 Données en temps réel](/meta ${category})`,
                    inline: false
                }
            ])
            .setThumbnail('https://robertsspaceindustries.com/favicon.ico')
            .setFooter({ text: `Guide officiel RSI Spectrum • CityZenBot v2.0.1` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleSearchGuides(interaction, spectrumService) {
        await interaction.deferReply();

        const keywords = interaction.options.getString('mots_cles');
        const results = spectrumService.searchGuides(keywords);

        if (results.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('🔍 Aucun résultat')
                .setDescription(`Aucun guide trouvé pour "${keywords}".`)
                .addFields([
                    {
                        name: '💡 Suggestions',
                        value: '• Essayez des mots-clés plus généraux\\n• Vérifiez l\'orthographe\\n• Utilisez `/guides liste` pour voir tous les guides',
                        inline: false
                    },
                    {
                        name: '🤖 Alternative IA',
                        value: `Essayez \`/ai conseil question:${keywords}\` pour une réponse personnalisée avec IA.`,
                        inline: false
                    }
                ]);
            
            return await interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF88')
            .setTitle(`🔍 Résultats de recherche: "${keywords}"`)
            .setDescription(`${results.length} guide(s) trouvé(s)`)
            .addFields(
                results.map(guide => ({
                    name: `${this.getCategoryEmoji(guide.category)} ${guide.title}`,
                    value: `**Catégorie:** ${guide.category}\\n**Tags pertinents:** ${guide.tags.join(', ')}\\n**Aperçu:** ${guide.tips[0] || 'Guide complet disponible'}`,
                    inline: false
                }))
            )
            .addFields({
                name: '📖 Pour aller plus loin',
                value: `• Utilisez \`/guides categorie\` pour un guide détaillé\\n• Utilisez \`/ai conseil question:${keywords}\` pour des conseils IA personnalisés`,
                inline: false
            })
            .setFooter({ text: 'CityZenBot • Recherche dans guides RSI • Star Citizen 4.2' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleUpdatesGuide(interaction, spectrumService) {
        await interaction.deferReply();

        const updates = spectrumService.getSC42Updates();

        const embed = new EmbedBuilder()
            .setColor('#00FF88')
            .setTitle('🆕 Star Citizen 4.2 - Guide des nouveautés')
            .setDescription('Découvrez tout ce qui est nouveau dans Star Citizen 4.2')
            .addFields([
                {
                    name: '✨ Principales nouveautés',
                    value: updates.nouveautes.map((item, index) => `${index + 1}. ${item}`).join('\\n'),
                    inline: false
                },
                {
                    name: '🔧 Corrections et améliorations',
                    value: updates.corrections.map((item, index) => `${index + 1}. ${item}`).join('\\n'),
                    inline: false
                },
                {
                    name: '💡 Conseils pour la transition vers 4.2',
                    value: updates.conseils.map((item, index) => `${index + 1}. ${item}`).join('\\n'),
                    inline: false
                },
                {
                    name: '🔗 Ressources utiles',
                    value: '• [📰 Notes de version officielles](https://robertsspaceindustries.com/spectrum)\\n• [🤖 Conseils IA personnalisés](/ai conseil)\\n• [📊 Données de jeu actualisées](/meta)',
                    inline: false
                }
            ])
            .setThumbnail('https://robertsspaceindustries.com/favicon.ico')
            .setFooter({ text: `Star Citizen ${updates.version} • Guide mis à jour le ${new Date().toLocaleDateString('fr-FR')}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    getCategoryEmoji(category) {
        const emojis = {
            'debutant': '🌟',
            'combat': '⚔️',
            'economie': '💰',
            'commerce': '💰',
            'minage': '⛏️',
            'exploration': '🔍',
            'general': 'ℹ️'
        };
        return emojis[category] || '📝';
    }
};
