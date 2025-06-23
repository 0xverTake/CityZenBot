const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const StarCitizenAIService = require('../../services/StarCitizenAIService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('🤖 Conseils IA pour Star Citizen 4.2')
        .addSubcommand(subcommand =>
            subcommand
                .setName('conseil')
                .setDescription('Demander un conseil personnalisé')
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('Votre question sur Star Citizen')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('niveau')
                        .setDescription('Votre niveau de jeu')
                        .setRequired(false)
                        .addChoices(
                            { name: '🌱 Débutant', value: 'beginner' },
                            { name: '⚡ Intermédiaire', value: 'intermediate' },
                            { name: '🏆 Avancé', value: 'advanced' }
                        ))
                .addStringOption(option =>
                    option.setName('categorie')
                        .setDescription('Catégorie du conseil')
                        .setRequired(false)
                        .addChoices(
                            { name: '🚀 Vaisseaux', value: 'ships' },
                            { name: '⚔️ Combat', value: 'combat' },
                            { name: '💰 Commerce', value: 'trading' },
                            { name: '📋 Missions', value: 'missions' },
                            { name: '🌟 Débutant', value: 'beginner' },
                            { name: 'ℹ️ Général', value: 'general' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('astuce')
                .setDescription('Astuce aléatoire du jour')
                .addStringOption(option =>
                    option.setName('categorie')
                        .setDescription('Type d\'astuce')
                        .setRequired(false)
                        .addChoices(
                            { name: '🌟 Débutant', value: 'beginner' },
                            { name: '⚔️ Combat', value: 'combat' },
                            { name: '💰 Trading', value: 'trading' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Statut du service IA')),

    async execute(interaction) {
        const aiService = new StarCitizenAIService();
        const subcommand = interaction.options.getSubcommand();

        try {
            if (subcommand === 'conseil') {
                await this.handleAdviceRequest(interaction, aiService);
            } else if (subcommand === 'astuce') {
                await this.handleTipRequest(interaction, aiService);
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
        const playerLevel = interaction.options.getString('niveau') || 'beginner';
        const category = interaction.options.getString('categorie') || 'general';

        // Générer le conseil IA
        const advice = await aiService.generateAdvice(question, playerLevel, category);

        const embed = new EmbedBuilder()
            .setColor('#00D4FF')
            .setTitle(advice.title)
            .setDescription(advice.content)
            .addFields([
                {
                    name: '📊 Détails',
                    value: `**Niveau:** ${this.getLevelEmoji(playerLevel)} ${playerLevel}\n**Catégorie:** ${this.getCategoryEmoji(advice.category)} ${advice.category}`,
                    inline: true
                },
                {
                    name: '🤖 Source',
                    value: advice.ai_powered ? '✨ IA Hugging Face' : '📚 Base de connaissances',
                    inline: true
                }
            ])
            .setFooter({ 
                text: advice.ai_powered && advice.disclaimer ? advice.disclaimer : 'CityZenBot - Conseils Star Citizen 4.2' 
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async handleTipRequest(interaction, aiService) {
        await interaction.deferReply();

        const category = interaction.options.getString('categorie') || 'beginner';
        const tip = aiService.getRandomTip(category);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(tip.title)
            .setDescription(tip.content)
            .addFields({
                name: '🎯 Catégorie',
                value: `${this.getCategoryEmoji(tip.category)} ${tip.category}`,
                inline: true
            })
            .setFooter({ text: 'Astuce générée aléatoirement • Star Citizen 4.2' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },    async handleStatusRequest(interaction, aiService) {
        await interaction.deferReply();

        const status = await aiService.checkAIAvailability();
        const stats = aiService.getUsageStats();

        const embed = new EmbedBuilder()
            .setColor(status.available ? '#00FF00' : '#FFA500')
            .setTitle('🤖 Statut Service IA CityZenBot')
            .setDescription(status.available ? 
                '✅ **Service IA opérationnel** - Réponses intelligentes activées' : 
                '⚠️ **IA indisponible** - Fallback base de connaissances actif');

        // API Status
        const apiStatus = status.available ? 
            `✅ **Hugging Face API**\n📊 Modèle: ${status.model || 'facebook/blenderbot-400M-distill'}\n🔄 Statut: ${status.status}` :
            `❌ **Indisponible**\n💬 Raison: ${status.reason}`;

        embed.addFields([
            {
                name: '🌐 API Intelligence Artificielle',
                value: apiStatus,
                inline: true
            },
            {
                name: '📚 Système de Fallback',
                value: '✅ **Base de connaissances**\n📖 Star Citizen 4.2\n🎯 Conseils prédéfinis',
                inline: true
            },
            {
                name: '📊 Utilisation API (Gratuite)',
                value: `**${stats.api_calls_this_month}** / **${stats.quota_limit}** requêtes\n🔄 Reset: ${stats.quota_reset_date}\n💾 Cache: ${stats.cache_entries}/${stats.cache_max_size}`,
                inline: false
            }
        ]);

        // Ajouter des infos de configuration si API indisponible
        if (!status.available) {
            let helpText = '**Solutions possibles:**\n';
            
            if (status.reason.includes('API key')) {
                helpText += '🔑 Configurez HUGGINGFACE_API_KEY (gratuit)\n';
                helpText += '📖 Consultez `HUGGINGFACE_API_SETUP.md`\n';
            }
            
            if (status.reason.includes('Quota')) {
                helpText += `🕒 Quota reset le: ${status.reset_date}\n`;
            }
            
            helpText += '📚 Le fallback reste pleinement fonctionnel !';
            
            embed.addFields({
                name: '🛠️ Configuration',
                value: helpText,
                inline: false
            });
        }

        // Features disponibles
        const features = status.available ? 
            '🤖 **Avec IA:**\n• Conseils personnalisés\n• Réponses contextuelles\n• Analyse de questions complexes\n• Cache intelligent' :
            '📚 **Mode Fallback:**\n• Conseils prédéfinis\n• Astuces Star Citizen 4.2\n• Réponses instantanées\n• Base de connaissances complète';

        embed.addFields({
            name: '🎯 Fonctionnalités Actives',
            value: features,
            inline: false
        });

        embed.setFooter({ 
            text: `CityZenBot v2.0.1 • IA Open Source • Star Citizen 4.2 ${status.available ? '• API Active' : '• Mode Fallback'}` 
        })
        .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    getLevelEmoji(level) {
        const emojis = {
            'beginner': '🌱',
            'intermediate': '⚡',
            'advanced': '🏆'
        };
        return emojis[level] || '❓';
    },

    getCategoryEmoji(category) {
        const emojis = {
            'ships': '🚀',
            'combat': '⚔️',
            'trading': '💰',
            'missions': '📋',
            'beginner': '🌟',
            'general': 'ℹ️'
        };
        return emojis[category] || '📝';
    }
};
