const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche l\'aide et la liste des commandes disponibles')
        .addStringOption(option =>
            option
                .setName('commande')
                .setDescription('Obtenir de l\'aide sur une commande spécifique')
                .setRequired(false)
                .addChoices(
                    { name: 'ship - Informations sur les vaisseaux', value: 'ship' },
                    { name: 'meta - Méta et tier lists', value: 'meta' },
                    { name: 'build - Builds et configurations', value: 'build' },
                    { name: 'buy - Où acheter vaisseaux et composants', value: 'buy' }
                )
        ),

    async execute(interaction) {
        const specificCommand = interaction.options.getString('commande');

        if (specificCommand) {
            await this.showSpecificHelp(interaction, specificCommand);
        } else {
            await this.showGeneralHelp(interaction);
        }
    },

    async showGeneralHelp(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('🚀 CityZenBot - Aide Star Citizen')
            .setDescription('Bot Discord complet pour Star Citizen avec informations sur les vaisseaux, méta, builds et achats')
            .setThumbnail('https://i.imgur.com/star-citizen-logo.png')
            .setTimestamp();

        embed.addFields(
            {
                name: '🚀 Commandes Vaisseaux (/ship)',
                value: '• `/ship info <nom>` - Infos détaillées\n' +
                       '• `/ship search <terme>` - Rechercher\n' +
                       '• `/ship role <type>` - Par rôle\n' +
                       '• `/ship compare <v1> <v2>` - Comparer',
                inline: true
            },
            {
                name: '🔥 Commandes Méta (/meta)',
                value: '• `/meta current` - Méta actuel\n' +
                       '• `/meta tier <type>` - Tier lists\n' +
                       '• `/meta patch` - Changements patch',
                inline: true
            },
            {
                name: '🔧 Commandes Builds (/build)',
                value: '• `/build show <vaisseau>` - Voir builds\n' +
                       '• `/build pvp <vaisseau>` - Build PvP\n' +
                       '• `/build pve <vaisseau>` - Build PvE\n' +
                       '• `/build create` - Créer un build',
                inline: true
            },
            {
                name: '💰 Commandes Achat (/buy)',
                value: '• `/buy ship <nom>` - Où acheter\n' +
                       '• `/buy component <nom>` - Composants\n' +
                       '• `/buy location <lieu>` - Inventaire lieu',
                inline: true
            },
            {
                name: '📊 Fonctionnalités',
                value: '✅ Base de données complète des vaisseaux\n' +
                       '✅ Méta PvP/PvE mis à jour\n' +
                       '✅ Builds optimisés\n' +
                       '✅ Emplacements d\'achat\n' +
                       '✅ Comparaisons détaillées\n' +
                       '✅ Auto-complétion intelligente',
                inline: true
            },
            {
                name: '🆘 Support',
                value: '• Utilisez `/help <commande>` pour plus de détails\n' +
                       '• Reportez les bugs sur GitHub\n' +
                       '• Rejoignez notre serveur de support',
                inline: true
            }
        );

        embed.setFooter({
            text: 'CityZenBot v1.0 - Mise à jour automatique des données | Patch 3.21'
        });

        await interaction.reply({ embeds: [embed] });
    },

    async showSpecificHelp(interaction, command) {
        const helpData = {
            ship: {
                title: '🚀 Aide - Commandes Vaisseaux',
                description: 'Toutes les informations sur les vaisseaux Star Citizen',
                fields: [
                    {
                        name: '/ship info <nom>',
                        value: 'Affiche les informations détaillées d\'un vaisseau :\n' +
                               '• Statistiques complètes\n' +
                               '• Prix aUEC et USD\n' +
                               '• Rôle et spécifications\n' +
                               '• État de développement\n\n' +
                               '**Exemple :** `/ship info Hornet F7C`'
                    },
                    {
                        name: '/ship search <terme>',
                        value: 'Recherche des vaisseaux par nom ou fabricant :\n' +
                               '• Recherche flexible\n' +
                               '• Résultats avec prix\n' +
                               '• Jusqu\'à 10 résultats\n\n' +
                               '**Exemple :** `/ship search Aegis`'
                    },
                    {
                        name: '/ship role <type>',
                        value: 'Vaisseaux recommandés par rôle :\n' +
                               '• Combat léger/lourd\n' +
                               '• Multi-rôle\n' +
                               '• Cargo, exploration, minage\n\n' +
                               '**Exemple :** `/ship role Light Fighter`'
                    },
                    {
                        name: '/ship compare <v1> <v2>',
                        value: 'Compare deux vaisseaux côte à côte :\n' +
                               '• Spécifications détaillées\n' +
                               '• Analyse des différences\n' +
                               '• Recommandations\n\n' +
                               '**Exemple :** `/ship compare "Hornet F7C" Sabre`'
                    }
                ]
            },
            meta: {
                title: '🔥 Aide - Commandes Méta',
                description: 'Méta actuels et tier lists pour PvP/PvE',
                fields: [
                    {
                        name: '/meta current',
                        value: 'Affiche les méta actuels :\n' +
                               '• Tier list PvP\n' +
                               '• Tier list PvE\n' +
                               '• Raisonnement des choix\n' +
                               '• Basé sur la patch actuelle'
                    },
                    {
                        name: '/meta tier <type>',
                        value: 'Tier list détaillée par type :\n' +
                               '• PvP (Joueur vs Joueur)\n' +
                               '• PvE (Joueur vs IA)\n' +
                               '• Mining, Cargo, etc.\n\n' +
                               '**Exemple :** `/meta tier pvp`'
                    },
                    {
                        name: '/meta patch',
                        value: 'Changements de la dernière patch :\n' +
                               '• Modifications de gameplay\n' +
                               '• Nouveaux vaisseaux\n' +
                               '• Rééquilibrages\n' +
                               '• Impact sur le méta'
                    }
                ]
            },
            build: {
                title: '🔧 Aide - Commandes Builds',
                description: 'Builds optimisés et configurations personnalisées',
                fields: [
                    {
                        name: '/build show <vaisseau>',
                        value: 'Affiche tous les builds disponibles :\n' +
                               '• Builds communautaires\n' +
                               '• Coûts détaillés\n' +
                               '• Descriptions et conseils\n\n' +
                               '**Exemple :** `/build show "Cutlass Black"`'
                    },
                    {
                        name: '/build pvp <vaisseau>',
                        value: 'Build PvP optimisé :\n' +
                               '• Configuration pour le combat joueur\n' +
                               '• Composants recommandés\n' +
                               '• Stratégies de combat\n\n' +
                               '**Exemple :** `/build pvp Sabre`'
                    },
                    {
                        name: '/build pve <vaisseau>',
                        value: 'Build PvE optimisé :\n' +
                               '• Configuration pour missions PvE\n' +
                               '• Efficacité contre IA\n' +
                               '• Conseils d\'utilisation\n\n' +
                               '**Exemple :** `/build pve "Vanguard Warden"`'
                    },
                    {
                        name: '/build create',
                        value: 'Créer un build personnalisé :\n' +
                               '• Partagez vos configurations\n' +
                               '• Ajoutez descriptions et conseils\n' +
                               '• Contribuez à la communauté'
                    }
                ]
            },
            buy: {
                title: '💰 Aide - Commandes Achat',
                description: 'Où acheter vaisseaux, armes et composants',
                fields: [
                    {
                        name: '/buy ship <nom>',
                        value: 'Où acheter un vaisseau :\n' +
                               '• Emplacements exacts\n' +
                               '• Prix actuels\n' +
                               '• Informations de stock\n\n' +
                               '**Exemple :** `/buy ship "Hornet F7C"`'
                    },
                    {
                        name: '/buy component <nom>',
                        value: 'Où acheter des composants :\n' +
                               '• Armes, boucliers, moteurs\n' +
                               '• Magasins spécialisés\n' +
                               '• Prix et disponibilité\n\n' +
                               '**Exemple :** `/buy component "FR-86 Shield"`'
                    },
                    {
                        name: '/buy location <lieu>',
                        value: 'Inventaire d\'un lieu :\n' +
                               '• Vaisseaux disponibles\n' +
                               '• Composants en stock\n' +
                               '• Armes et équipements\n\n' +
                               '**Exemple :** `/buy location "New Babbage"`'
                    }
                ]
            }
        };

        const help = helpData[command];
        if (!help) {
            return await interaction.reply({
                content: '❌ Commande d\'aide non trouvée.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle(help.title)
            .setDescription(help.description)
            .setTimestamp();

        help.fields.forEach(field => {
            embed.addFields({
                name: field.name,
                value: field.value,
                inline: false
            });
        });

        embed.setFooter({
            text: 'Astuce : Utilisez l\'auto-complétion pour faciliter la saisie'
        });

        await interaction.reply({ embeds: [embed] });
    },

    cooldown: 3
};
