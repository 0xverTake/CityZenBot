const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AIService = require('../../services/AIService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('🤖 Conseils IA pour Star Citizen 4.2 avec guides officiels RSI')
        .addSubcommand(subcommand =>
            subcommand
                .setName('conseil')
                .setDescription('Demander un conseil personnalisé avec IA')
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('Votre question sur Star Citizen')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('niveau')
                        .setDescription('Votre niveau de jeu')
                        .setRequired(false)
                        .addChoices(
                            { name: '🌱 Débutant', value: 'debutant' },
                            { name: '⚡ Intermédiaire', value: 'intermediaire' },
                            { name: '🏆 Avancé', value: 'avance' }
                        ))
                .addStringOption(option =>
                    option.setName('categorie')
                        .setDescription('Catégorie du conseil')
                        .setRequired(false)
                        .addChoices(
                            { name: '🌟 Débutant', value: 'debutant' },
                            { name: '⚔️ Combat', value: 'combat' },
                            { name: '💰 Commerce', value: 'commerce' },
                            { name: '⛏️ Minage', value: 'minage' },
                            { name: '🔍 Exploration', value: 'exploration' },
                            { name: 'ℹ️ Général', value: 'general' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('guides')
                .setDescription('Consulter les guides officiels RSI Spectrum')
                .addStringOption(option =>
                    option.setName('categorie')
                        .setDescription('Catégorie de guide')
                        .setRequired(false)
                        .addChoices(
                            { name: '🌟 Débutant', value: 'debutant' },
                            { name: '⚔️ Combat', value: 'combat' },
                            { name: '💰 Commerce', value: 'economie' },
                            { name: '⛏️ Minage', value: 'minage' },
                            { name: '🔍 Exploration', value: 'exploration' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nouveautes')
                .setDescription('Découvrir les nouveautés Star Citizen 4.2'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Statut du service IA et guides')),

    async execute(interaction) {
        const aiService = new AIService();
        const subcommand = interaction.options.getSubcommand();

        try {
            if (subcommand === 'conseil') {
                await this.handleAdviceRequest(interaction, aiService);
            } else if (subcommand === 'guides') {
                await this.handleGuidesRequest(interaction, aiService);
            } else if (subcommand === 'nouveautes') {
                await this.handleUpdatesRequest(interaction, aiService);
            } else if (subcommand === 'status') {
                await this.handleStatusRequest(interaction, aiService);
            }
        } catch (error) {
            console.error('Erreur commande IA:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur IA')
                .setDescription('Une erreur est survenue avec le service IA.')
                .addFields({
                    name: 'Solution',
                    value: 'Réessayez dans quelques instants ou utilisez `/help` pour les guides manuels.'
                });

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },

    async handleAdviceRequest(interaction, aiService) {
        await interaction.deferReply();

        const question = interaction.options.getString('question');
        const playerLevel = interaction.options.getString('niveau') || 'debutant';
        const category = interaction.options.getString('categorie') || 'general';

        // Générer le conseil IA enrichi avec guides Spectrum
        const advice = await aiService.getAdvice(question, category, playerLevel);

        const embed = new EmbedBuilder()
            .setColor('#00D4FF')
            .setTitle('🤖 Conseil IA Star Citizen 4.2')
            .setDescription(advice.ai_advice)
            .addFields([
                {
                    name: '📊 Détails',
                    value: `**Niveau:** ${this.getLevelEmoji(playerLevel)} ${playerLevel}\n**Catégorie:** ${this.getCategoryEmoji(advice.category)} ${advice.category}`,
                    inline: true
                },
                {
                    name: '🤖 Source',
                    value: advice.fallback ? '📚 Base de connaissances' : '✨ IA + Guides RSI',
                    inline: true
                }
            ]);

        // Ajouter les conseils Spectrum si disponibles
        if (advice.spectrum_tips && advice.spectrum_tips.length > 0) {
            embed.addFields({
                name: '📚 Conseils officiels RSI',
                value: advice.spectrum_tips.map(tip => `• ${tip}`).join('\n'),
                inline: false
            });
        }

        // Ajouter les nouveautés SC 4.2 si pertinentes
        if (advice.sc42_features && advice.sc42_features.length > 0) {
            embed.addFields({
                name: '🆕 Nouveautés Star Citizen 4.2',
                value: advice.sc42_features.map(feature => `• ${feature}`).join('\n'),
                inline: false
            });
        }

        // Ajouter les conseils rapides
        if (advice.quick_tips && advice.quick_tips.length > 0) {
            embed.addFields({
                name: '💡 Conseils rapides',
                value: advice.quick_tips.join('\n'),
                inline: false
            });
        }

        // Ajouter les commandes liées
        if (advice.related_commands && advice.related_commands.length > 0) {
            embed.addFields({
                name: '🔗 Commandes utiles',
                value: advice.related_commands.map(cmd => `\`${cmd}\``).join(' • '),
                inline: false
            });
        }

        embed.addFields({
            name: '📖 Guides officiels',
            value: advice.official_guides,
            inline: false
        });

        embed.setFooter({ 
            text: `CityZenBot v2.0.1 • IA Open Source + RSI Spectrum • SC ${advice.sc_version}` 
        })
        .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleGuidesRequest(interaction, aiService) {
        await interaction.deferReply();

        const category = interaction.options.getString('categorie');

        if (category) {
            // Guide spécifique
            const guide = aiService.spectrumService.getGuideByCategory(category);
            
            if (!guide) {
                const embed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('❓ Guide non trouvé')
                    .setDescription(`Aucun guide trouvé pour la catégorie "${category}".`)
                    .addFields({
                        name: '📚 Guides disponibles',
                        value: 'Utilisez `/ai guides` sans paramètre pour voir tous les guides.',
                        inline: false
                    });
                
                return await interaction.editReply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle(`📚 ${guide.title}`)
                .setDescription(`Guide officiel RSI Spectrum pour ${guide.category}`)
                .addFields([
                    {
                        name: '🎯 Catégorie',
                        value: `${this.getCategoryEmoji(guide.category)} ${guide.category}`,
                        inline: true
                    },
                    {
                        name: '🏷️ Tags',
                        value: guide.tags.map(tag => `\`${tag}\``).join(' '),
                        inline: true
                    },
                    {
                        name: '💡 Conseils essentiels',
                        value: guide.tips.map(tip => `• ${tip}`).join('\n'),
                        inline: false
                    },
                    {
                        name: '🔗 Lien officiel',
                        value: `[Consulter le guide complet](${guide.url})`,
                        inline: false
                    }
                ]);
        } else {
            // Liste de tous les guides
            const allGuides = aiService.spectrumService.getAllGuides();
            
            const embed = new EmbedBuilder()
                .setColor('#00D4FF')
                .setTitle('📚 Guides officiels RSI Spectrum')
                .setDescription('Guides officiels pour Star Citizen 4.2')
                .addFields(
                    allGuides.map(guide => ({
                        name: `${this.getCategoryEmoji(guide.category)} ${guide.title}`,
                        value: `**Catégorie:** ${guide.category}\n**Tags:** ${guide.tags.join(', ')}\n[Consulter le guide](${guide.url})`,
                        inline: true
                    }))
                );
        }

        embed.setFooter({ text: 'CityZenBot • Guides officiels RSI Spectrum • Star Citizen 4.2' })
             .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleUpdatesRequest(interaction, aiService) {
        await interaction.deferReply();

        const updates = aiService.spectrumService.getSC42Updates();

        const embed = new EmbedBuilder()
            .setColor('#00FF88')
            .setTitle('🆕 Star Citizen 4.2 - Nouveautés')
            .setDescription('Découvrez les dernières fonctionnalités et améliorations')
            .addFields([
                {
                    name: '✨ Nouvelles fonctionnalités',
                    value: updates.nouveautes.map(item => `• ${item}`).join('\n'),
                    inline: false
                },
                {
                    name: '🔧 Corrections importantes',
                    value: updates.corrections.map(item => `• ${item}`).join('\n'),
                    inline: false
                },
                {
                    name: '💡 Conseils pour la version 4.2',
                    value: updates.conseils.map(item => `• ${item}`).join('\n'),
                    inline: false
                }
            ])
            .setFooter({ text: `Mise à jour Star Citizen ${updates.version} • ${updates.lastUpdated}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleStatusRequest(interaction, aiService) {
        await interaction.deferReply();

        const stats = aiService.getUsageStats();
        const spectrumStats = aiService.spectrumService.getStats();

        const embed = new EmbedBuilder()
            .setColor(stats.enabled ? '#00FF00' : '#FFA500')
            .setTitle('🤖 Statut Service IA + Guides RSI')
            .setDescription(stats.enabled ? 
                '✅ **Service IA opérationnel** - Conseils intelligents + Guides officiels' : 
                '⚠️ **IA indisponible** - Guides RSI + Base de connaissances actifs');

        // Statut IA
        const aiStatus = stats.enabled ? 
            `✅ **${stats.api_provider}**\n📊 Modèle: ${stats.model}\n🎯 Taux de cache: ${stats.hit_rate}%` :
            `❌ **Indisponible**\n📚 Mode fallback actif`;

        embed.addFields([
            {
                name: '🤖 Intelligence Artificielle',
                value: aiStatus,
                inline: true
            },
            {
                name: '📚 Guides RSI Spectrum',
                value: `✅ **Opérationnel**\n📖 ${spectrumStats.totalGuides} guides disponibles\n🏷️ ${spectrumStats.categoriesAvailable.length} catégories`,
                inline: true
            },
            {
                name: '📊 Statistiques d\'utilisation',
                value: `🔄 **Requêtes:** ${stats.requests_total}\n💾 **Cache:** ${stats.cache_size} entrées\n⏱️ **Uptime:** ${stats.uptime_hours}h`,
                inline: false
            }
        ]);

        // Guides disponibles
        embed.addFields({
            name: '📚 Catégories de guides disponibles',
            value: spectrumStats.categoriesAvailable.map(cat => `• ${this.getCategoryEmoji(cat)} ${cat}`).join('\n'),
            inline: false
        });

        // Compatibilité
        embed.addFields({
            name: '🎮 Compatibilité',
            value: `✅ **Star Citizen 4.2**\n✅ **APIs publiques intégrées**\n✅ **Guides RSI Spectrum**\n✅ **IA open source gratuite**`,
            inline: false
        });

        embed.setFooter({ 
            text: `CityZenBot v${spectrumStats.version} • Open Source • Gratuit • SC 4.2 Compatible` 
        })
        .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    getLevelEmoji(level) {
        const emojis = {
            'debutant': '🌱',
            'intermediaire': '⚡',
            'avance': '🏆'
        };
        return emojis[level] || '❓';
    },

    getCategoryEmoji(category) {
        const emojis = {
            'debutant': '🌟',
            'combat': '⚔️',
            'commerce': '💰',
            'economie': '💰',
            'minage': '⛏️',
            'exploration': '🔍',
            'general': 'ℹ️'
        };
        return emojis[category] || '📝';
    }
};
