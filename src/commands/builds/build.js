const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const DatabaseService = require('../../services/DatabaseService');
const StarCitizenService = require('../../services/StarCitizenService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('build')
        .setDescription('Commandes liées aux builds de vaisseaux')
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Affiche les builds disponibles pour un vaisseau')
                .addStringOption(option =>
                    option
                        .setName('vaisseau')
                        .setDescription('Nom du vaisseau')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pvp')
                .setDescription('Affiche le build PvP optimisé pour un vaisseau')
                .addStringOption(option =>
                    option
                        .setName('vaisseau')
                        .setDescription('Nom du vaisseau')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pve')
                .setDescription('Affiche le build PvE optimisé pour un vaisseau')
                .addStringOption(option =>
                    option
                        .setName('vaisseau')
                        .setDescription('Nom du vaisseau')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crée un nouveau build personnalisé')
                .addStringOption(option =>
                    option
                        .setName('vaisseau')
                        .setDescription('Nom du vaisseau')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addStringOption(option =>
                    option
                        .setName('nom')
                        .setDescription('Nom du build')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Type de build')
                        .setRequired(true)
                        .addChoices(
                            { name: 'PvP', value: 'pvp' },
                            { name: 'PvE', value: 'pve' },
                            { name: 'Exploration', value: 'exploration' },
                            { name: 'Cargo', value: 'cargo' },
                            { name: 'Racing', value: 'racing' }
                        )
                )
                .addStringOption(option =>
                    option
                        .setName('description')
                        .setDescription('Description du build')
                        .setRequired(true)
                )
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const ships = await StarCitizenService.searchShips(focusedValue);
        
        const choices = ships.slice(0, 25).map(ship => ({
            name: ship.name,
            value: ship.name
        }));

        await interaction.respond(choices);
    },

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'show':
                    await this.handleShowBuilds(interaction);
                    break;
                case 'pvp':
                    await this.handlePvPBuild(interaction);
                    break;
                case 'pve':
                    await this.handlePvEBuild(interaction);
                    break;
                case 'create':
                    await this.handleCreateBuild(interaction);
                    break;
            }
        } catch (error) {
            console.error('Erreur dans la commande build:', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    },

    async handleShowBuilds(interaction) {
        const shipName = interaction.options.getString('vaisseau');
        
        await interaction.deferReply();

        // Vérifier que le vaisseau existe
        const ship = await StarCitizenService.getShipInfo(shipName);
        if (!ship) {
            return await interaction.editReply({
                content: `❌ Vaisseau "${shipName}" non trouvé.`
            });
        }

        const builds = await DatabaseService.getBuildsByShip(shipName);

        if (builds.length === 0) {
            return await interaction.editReply({
                content: `❌ Aucun build disponible pour le ${shipName}. Utilisez \`/build create\` pour en créer un !`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle(`🔧 Builds disponibles - ${shipName}`)
            .setDescription(`${builds.length} build(s) trouvé(s)`)
            .setTimestamp();

        builds.slice(0, 5).forEach(build => {
            const components = JSON.parse(build.components || '{}');
            const componentsList = Object.keys(components).map(key => 
                `**${key}:** ${components[key]}`
            ).join('\n');

            embed.addFields({
                name: `${this.getBuildTypeEmoji(build.build_type)} ${build.build_name}`,
                value: `**Type:** ${build.build_type.toUpperCase()}\n` +
                       `**Coût:** ${StarCitizenService.formatPrice(build.total_cost)}\n` +
                       `**Description:** ${build.description || 'Aucune description'}\n` +
                       `**Composants principaux:**\n${componentsList || 'Non spécifiés'}`,
                inline: false
            });
        });

        if (builds.length > 5) {
            embed.setFooter({
                text: `... et ${builds.length - 5} autres builds. Utilisez des filtres pour voir plus.`
            });
        }

        await interaction.editReply({ embeds: [embed] });
    },

    async handlePvPBuild(interaction) {
        const shipName = interaction.options.getString('vaisseau');
        
        await interaction.deferReply();

        const ship = await StarCitizenService.getShipInfo(shipName);
        if (!ship) {
            return await interaction.editReply({
                content: `❌ Vaisseau "${shipName}" non trouvé.`
            });
        }

        // Récupérer le meilleur build PvP
        const builds = await DatabaseService.getBuildsByType('pvp');
        const shipBuild = builds.find(build => 
            build.ship_name.toLowerCase() === shipName.toLowerCase()
        );

        if (!shipBuild) {
            // Créer un build PvP générique basé sur le type de vaisseau
            const genericBuild = this.generateGenericPvPBuild(ship);
            return await interaction.editReply({ embeds: [genericBuild] });
        }

        const embed = this.formatBuildEmbed(shipBuild, ship);
        await interaction.editReply({ embeds: [embed] });
    },

    async handlePvEBuild(interaction) {
        const shipName = interaction.options.getString('vaisseau');
        
        await interaction.deferReply();

        const ship = await StarCitizenService.getShipInfo(shipName);
        if (!ship) {
            return await interaction.editReply({
                content: `❌ Vaisseau "${shipName}" non trouvé.`
            });
        }

        const builds = await DatabaseService.getBuildsByType('pve');
        const shipBuild = builds.find(build => 
            build.ship_name.toLowerCase() === shipName.toLowerCase()
        );

        if (!shipBuild) {
            const genericBuild = this.generateGenericPvEBuild(ship);
            return await interaction.editReply({ embeds: [genericBuild] });
        }

        const embed = this.formatBuildEmbed(shipBuild, ship);
        await interaction.editReply({ embeds: [embed] });
    },

    async handleCreateBuild(interaction) {
        const shipName = interaction.options.getString('vaisseau');
        const buildName = interaction.options.getString('nom');
        const buildType = interaction.options.getString('type');
        const description = interaction.options.getString('description');

        await interaction.deferReply();

        // Vérifier que le vaisseau existe
        const ship = await StarCitizenService.getShipInfo(shipName);
        if (!ship) {
            return await interaction.editReply({
                content: `❌ Vaisseau "${shipName}" non trouvé.`
            });
        }

        // Créer le build
        const buildData = {
            ship_name: shipName,
            build_name: buildName,
            build_type: buildType,
            total_cost: 0, // À calculer plus tard
            components: {},
            description: description,
            author: interaction.user.username
        };

        try {
            await DatabaseService.insertBuild(buildData);
            
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('✅ Build créé avec succès!')
                .setDescription(`Le build **${buildName}** pour le **${shipName}** a été créé.`)
                .addFields(
                    { name: 'Type', value: buildType.toUpperCase(), inline: true },
                    { name: 'Auteur', value: interaction.user.username, inline: true },
                    { name: 'Description', value: description, inline: false }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la création du build:', error);
            await interaction.editReply({
                content: '❌ Erreur lors de la création du build. Veuillez réessayer.'
            });
        }
    },

    formatBuildEmbed(build, ship) {
        const components = JSON.parse(build.components || '{}');
        
        const embed = new EmbedBuilder()
            .setColor(this.getBuildTypeColor(build.build_type))
            .setTitle(`${this.getBuildTypeEmoji(build.build_type)} ${build.build_name}`)
            .setDescription(`Build ${build.build_type.toUpperCase()} pour le **${ship.name}**`)
            .setTimestamp();

        embed.addFields(
            {
                name: '🚀 Vaisseau',
                value: `**${ship.name}** (${ship.manufacturer})\n*${ship.role}*`,
                inline: true
            },
            {
                name: '💰 Coût total',
                value: StarCitizenService.formatPrice(build.total_cost),
                inline: true
            },
            {
                name: '📝 Description',
                value: build.description || 'Aucune description disponible',
                inline: false
            }
        );

        if (Object.keys(components).length > 0) {
            const componentsList = Object.keys(components).map(key => 
                `**${key}:** ${components[key]}`
            ).join('\n');

            embed.addFields({
                name: '🔧 Composants',
                value: componentsList,
                inline: false
            });
        }

        embed.setFooter({
            text: `Créé par ${build.author || 'Inconnu'} | Utilisez /buy pour trouver les composants`
        });

        return embed;
    },

    generateGenericPvPBuild(ship) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(`⚔️ Build PvP Recommandé - ${ship.name}`)
            .setDescription(`Build PvP générique pour le **${ship.name}**`)
            .setTimestamp();

        const recommendations = this.getPvPRecommendations(ship);
        
        embed.addFields(
            {
                name: '🎯 Stratégie PvP',
                value: recommendations.strategy,
                inline: false
            },
            {
                name: '🔧 Composants Recommandés',
                value: recommendations.components,
                inline: false
            },
            {
                name: '💡 Conseils',
                value: recommendations.tips,
                inline: false
            }
        );

        embed.setFooter({
            text: 'Build générique basé sur le rôle du vaisseau'
        });

        return embed;
    },

    generateGenericPvEBuild(ship) {
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`🤖 Build PvE Recommandé - ${ship.name}`)
            .setDescription(`Build PvE générique pour le **${ship.name}**`)
            .setTimestamp();

        const recommendations = this.getPvERecommendations(ship);
        
        embed.addFields(
            {
                name: '🎯 Stratégie PvE',
                value: recommendations.strategy,
                inline: false
            },
            {
                name: '🔧 Composants Recommandés',
                value: recommendations.components,
                inline: false
            },
            {
                name: '💡 Conseils',
                value: recommendations.tips,
                inline: false
            }
        );

        embed.setFooter({
            text: 'Build générique basé sur le rôle du vaisseau'
        });

        return embed;
    },

    getPvPRecommendations(ship) {
        const role = ship.role.toLowerCase();
        
        if (role.includes('fighter')) {
            return {
                strategy: 'Maximiser les dégâts et la mobilité. Priorité aux armes énergétiques.',
                components: '• **Armes:** Laser Repeaters S3/S4\n• **Boucliers:** FR-86 Shield Generator\n• **Moteur:** Maximal performance',
                tips: '• Gardez vos distances\n• Utilisez la vitesse à votre avantage\n• Gérez votre énergie'
            };
        } else if (role.includes('multi')) {
            return {
                strategy: 'Équilibre entre survivabilité et dégâts. Polyvalence avant tout.',
                components: '• **Armes:** Mix ballistic/energy\n• **Boucliers:** Renforcés\n• **Utilitaires:** Points de vie supplémentaires',
                tips: '• Adaptez votre style selon l\'adversaire\n• Utilisez votre cargo pour des tactiques de hit-and-run\n• Coopérez avec votre équipage'
            };
        } else {
            return {
                strategy: 'Adapter selon le rôle spécifique du vaisseau.',
                components: '• Consultez la communauté pour des builds spécialisés\n• Testez différentes configurations',
                tips: '• Chaque vaisseau a ses spécificités\n• Expérimentez dans l\'Arena Commander'
            };
        }
    },

    getPvERecommendations(ship) {
        const role = ship.role.toLowerCase();
        
        if (role.includes('fighter')) {
            return {
                strategy: 'Optimiser pour les missions de combat contre IA. Priorité à la consistance.',
                components: '• **Armes:** Ballistic weapons pour l\'efficacité\n• **Boucliers:** Balance protection/regen\n• **Refroidissement:** Optimisé pour les longs combats',
                tips: '• Les NPCs ont des patterns prévisibles\n• Économisez les munitions\n• Réparez entre les missions'
            };
        } else if (role.includes('multi')) {
            return {
                strategy: 'Configuration polyvalente pour missions variées. Équilibre entre combat et utilité.',
                components: '• **Armes:** Polyvalentes\n• **Cargo:** Maximisé si possible\n• **Survie:** Équipement médical et nourriture',
                tips: '• Parfait pour les missions de livraison\n• Bon pour débuter le PvE\n• Peut faire du transport d\'équipiers'
            };
        } else {
            return {
                strategy: 'Optimiser selon le rôle principal du vaisseau.',
                components: '• Spécialisez selon votre activité principale\n• Consultez les guides communautaires',
                tips: '• Chaque type de mission a ses requis\n• Adaptez votre équipement'
            };
        }
    },

    getBuildTypeEmoji(type) {
        const emojis = {
            'pvp': '⚔️',
            'pve': '🤖',
            'exploration': '🌌',
            'cargo': '📦',
            'racing': '🏁',
            'mining': '⛏️'
        };
        
        return emojis[type] || '🔧';
    },

    getBuildTypeColor(type) {
        const colors = {
            'pvp': 0xff0000,
            'pve': 0x00ff00,
            'exploration': 0x9900ff,
            'cargo': 0xff9900,
            'racing': 0xffff00,
            'mining': 0x8b4513
        };
        
        return colors[type] || 0x00aaff;
    },

    cooldown: 5
};
