const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const StarCitizenService = require('../../services/StarCitizenService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Commandes liées aux vaisseaux Star Citizen')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Affiche les informations détaillées d\'un vaisseau')
                .addStringOption(option =>
                    option
                        .setName('nom')
                        .setDescription('Nom du vaisseau')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Recherche des vaisseaux par nom ou fabricant')
                .addStringOption(option =>
                    option
                        .setName('terme')
                        .setDescription('Terme de recherche')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Affiche les vaisseaux recommandés pour un rôle')
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Type de rôle')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Combat Léger', value: 'Light Fighter' },
                            { name: 'Combat Lourd', value: 'Heavy Fighter' },
                            { name: 'Furtivité', value: 'Stealth Fighter' },
                            { name: 'Multi-rôle', value: 'Multi-role' },
                            { name: 'Cargo', value: 'Cargo' },
                            { name: 'Exploration', value: 'Exploration' },
                            { name: 'Minage', value: 'Mining' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('compare')
                .setDescription('Compare deux vaisseaux')
                .addStringOption(option =>
                    option
                        .setName('vaisseau1')
                        .setDescription('Premier vaisseau à comparer')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addStringOption(option =>
                    option
                        .setName('vaisseau2')
                        .setDescription('Deuxième vaisseau à comparer')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const ships = await StarCitizenService.searchShips(focusedValue);
        
        const choices = ships.slice(0, 25).map(ship => ({
            name: `${ship.name} (${ship.manufacturer})`,
            value: ship.name
        }));

        await interaction.respond(choices);
    },

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'info':
                    await this.handleShipInfo(interaction);
                    break;
                case 'search':
                    await this.handleShipSearch(interaction);
                    break;
                case 'role':
                    await this.handleShipsByRole(interaction);
                    break;
                case 'compare':
                    await this.handleShipCompare(interaction);
                    break;
            }
        } catch (error) {
            console.error('Erreur dans la commande ship:', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    },

    async handleShipInfo(interaction) {
        const shipName = interaction.options.getString('nom');
        
        await interaction.deferReply();
        
        const ship = await StarCitizenService.getShipInfo(shipName);
        
        if (!ship) {
            return await interaction.editReply({
                content: `❌ Aucun vaisseau trouvé avec le nom "${shipName}". Utilisez \`/ship search\` pour chercher des vaisseaux.`
            });
        }

        const embed = StarCitizenService.formatShipEmbed(ship);
        
        if (embed) {
            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({
                content: '❌ Erreur lors de la génération des informations du vaisseau.'
            });
        }
    },

    async handleShipSearch(interaction) {
        const searchTerm = interaction.options.getString('terme');
        
        await interaction.deferReply();
        
        const ships = await StarCitizenService.searchShips(searchTerm);
        
        if (ships.length === 0) {
            return await interaction.editReply({
                content: `❌ Aucun vaisseau trouvé pour "${searchTerm}".`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle(`🔍 Résultats de recherche pour "${searchTerm}"`)
            .setDescription(`${ships.length} vaisseau(x) trouvé(s)`)
            .setTimestamp();

        const shipList = ships.slice(0, 10).map(ship => {
            const price = StarCitizenService.formatPrice(ship.price_auec);
            return `**${ship.name}** (${ship.manufacturer})\n` +
                   `*${ship.role}* - ${price}`;
        }).join('\n\n');

        embed.addFields({
            name: 'Vaisseaux trouvés',
            value: shipList
        });

        if (ships.length > 10) {
            embed.setFooter({
                text: `... et ${ships.length - 10} autres. Affinez votre recherche pour voir plus de résultats.`
            });
        }

        await interaction.editReply({ embeds: [embed] });
    },

    async handleShipsByRole(interaction) {
        const role = interaction.options.getString('type');
        
        await interaction.deferReply();
        
        const ships = await StarCitizenService.getShipsByRole(role);
        
        if (ships.length === 0) {
            return await interaction.editReply({
                content: `❌ Aucun vaisseau trouvé pour le rôle "${role}".`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle(`🎯 Vaisseaux recommandés - ${role}`)
            .setDescription(`${ships.length} vaisseau(x) disponible(s) pour ce rôle`)
            .setTimestamp();

        const shipList = ships.slice(0, 8).map(ship => {
            const price = StarCitizenService.formatPrice(ship.price_auec);
            const status = ship.flight_ready ? '✅' : '🚧';
            return `${status} **${ship.name}** (${ship.manufacturer})\n` +
                   `*${ship.size}* - ${price}`;
        }).join('\n\n');

        embed.addFields({
            name: 'Vaisseaux disponibles',
            value: shipList
        });

        embed.setFooter({
            text: '✅ = Prêt au vol | 🚧 = En développement'
        });

        await interaction.editReply({ embeds: [embed] });
    },

    async handleShipCompare(interaction) {
        const ship1Name = interaction.options.getString('vaisseau1');
        const ship2Name = interaction.options.getString('vaisseau2');
        
        await interaction.deferReply();
        
        const [ship1, ship2] = await Promise.all([
            StarCitizenService.getShipInfo(ship1Name),
            StarCitizenService.getShipInfo(ship2Name)
        ]);
        
        if (!ship1) {
            return await interaction.editReply({
                content: `❌ Vaisseau "${ship1Name}" non trouvé.`
            });
        }
        
        if (!ship2) {
            return await interaction.editReply({
                content: `❌ Vaisseau "${ship2Name}" non trouvé.`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('⚖️ Comparaison de vaisseaux')
            .setDescription(`**${ship1.name}** vs **${ship2.name}**`)
            .setTimestamp();

        const ship1Data = typeof ship1.data === 'string' ? JSON.parse(ship1.data) : ship1.data || {};
        const ship2Data = typeof ship2.data === 'string' ? JSON.parse(ship2.data) : ship2.data || {};

        embed.addFields(
            {
                name: `🚀 ${ship1.name}`,
                value: `**Fabricant:** ${ship1.manufacturer}\n` +
                       `**Rôle:** ${ship1.role}\n` +
                       `**Taille:** ${ship1.size}\n` +
                       `**Équipage:** ${ship1.crew_min}-${ship1.crew_max}\n` +
                       `**Cargo:** ${ship1.cargo_capacity} SCU\n` +
                       `**Vitesse:** ${ship1.max_speed} m/s\n` +
                       `**Prix:** ${StarCitizenService.formatPrice(ship1.price_auec)}`,
                inline: true
            },
            {
                name: `🚀 ${ship2.name}`,
                value: `**Fabricant:** ${ship2.manufacturer}\n` +
                       `**Rôle:** ${ship2.role}\n` +
                       `**Taille:** ${ship2.size}\n` +
                       `**Équipage:** ${ship2.crew_min}-${ship2.crew_max}\n` +
                       `**Cargo:** ${ship2.cargo_capacity} SCU\n` +
                       `**Vitesse:** ${ship2.max_speed} m/s\n` +
                       `**Prix:** ${StarCitizenService.formatPrice(ship2.price_auec)}`,
                inline: true
            },
            {
                name: '📊 Analyse',
                value: this.generateComparison(ship1, ship2, ship1Data, ship2Data),
                inline: false
            }
        );

        await interaction.editReply({ embeds: [embed] });
    },

    generateComparison(ship1, ship2, data1, data2) {
        const comparisons = [];
        
        // Comparaison des prix
        if (ship1.price_auec && ship2.price_auec) {
            const cheaper = ship1.price_auec < ship2.price_auec ? ship1.name : ship2.name;
            const difference = Math.abs(ship1.price_auec - ship2.price_auec);
            comparisons.push(`💰 **${cheaper}** est moins cher de ${StarCitizenService.formatPrice(difference)}`);
        }
        
        // Comparaison des vitesses
        if (ship1.max_speed && ship2.max_speed) {
            const faster = ship1.max_speed > ship2.max_speed ? ship1.name : ship2.name;
            const difference = Math.abs(ship1.max_speed - ship2.max_speed);
            comparisons.push(`⚡ **${faster}** est plus rapide de ${difference} m/s`);
        }
        
        // Comparaison du cargo
        if (ship1.cargo_capacity && ship2.cargo_capacity) {
            const biggerCargo = ship1.cargo_capacity > ship2.cargo_capacity ? ship1.name : ship2.name;
            const difference = Math.abs(ship1.cargo_capacity - ship2.cargo_capacity);
            comparisons.push(`📦 **${biggerCargo}** a ${difference} SCU de cargo en plus`);
        }
        
        return comparisons.length > 0 ? comparisons.join('\n') : 'Aucune différence notable détectée.';
    },

    cooldown: 5
};
