const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const DatabaseService = require('../../services/DatabaseService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Informations sur où acheter vaisseaux et composants')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ship')
                .setDescription('Où acheter un vaisseau')
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
                .setName('component')
                .setDescription('Où acheter un composant')
                .addStringOption(option =>
                    option
                        .setName('nom')
                        .setDescription('Nom du composant')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('location')
                .setDescription('Que peut-on acheter à cet endroit')
                .addStringOption(option =>
                    option
                        .setName('lieu')
                        .setDescription('Nom du lieu')
                        .setRequired(true)
                        .addChoices(
                            { name: 'New Babbage (microTech)', value: 'New Babbage' },
                            { name: 'Lorville (Hurston)', value: 'Lorville' },
                            { name: 'Area18 (ArcCorp)', value: 'Area18' },
                            { name: 'Orison (Crusader)', value: 'Orison' },
                            { name: 'Port Olisar', value: 'Port Olisar' },
                            { name: 'Grim HEX', value: 'Grim HEX' },
                            { name: 'Everus Harbor', value: 'Everus Harbor' },
                            { name: 'Baijini Point', value: 'Baijini Point' }
                        )
                )
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        
        // Pour l'instant, on propose quelques vaisseaux populaires
        // Dans une vraie implémentation, on rechercherait dans la base de données
        const ships = [
            'Hornet F7C', 'Cutlass Black', 'Constellation Andromeda', 
            'Sabre', 'Vanguard Warden', 'Freelancer', 'Avenger Titan',
            'Aurora MR', 'Mustang Alpha', '300i'
        ];
        
        const filtered = ships.filter(ship => 
            ship.toLowerCase().includes(focusedValue.toLowerCase())
        );
        
        const choices = filtered.slice(0, 25).map(ship => ({
            name: ship,
            value: ship
        }));

        await interaction.respond(choices);
    },

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'ship':
                    await this.handleShipPurchase(interaction);
                    break;
                case 'component':
                    await this.handleComponentPurchase(interaction);
                    break;
                case 'location':
                    await this.handleLocationInventory(interaction);
                    break;
            }
        } catch (error) {
            console.error('Erreur dans la commande buy:', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    },

    async handleShipPurchase(interaction) {
        const shipName = interaction.options.getString('nom');
        
        await interaction.deferReply();

        // Données hardcodées pour les emplacements d'achat de vaisseaux
        const shipLocations = this.getShipPurchaseLocations();
        const locations = shipLocations[shipName.toLowerCase()];

        if (!locations) {
            return await interaction.editReply({
                content: `❌ Informations d'achat non disponibles pour "${shipName}". Ce vaisseau pourrait être uniquement disponible sur le pledge store.`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`💰 Où acheter - ${shipName}`)
            .setDescription('Emplacements où vous pouvez acheter ce vaisseau')
            .setTimestamp();

        locations.forEach(location => {
            embed.addFields({
                name: `📍 ${location.location}`,
                value: `**Système:** ${location.system}\n` +
                       `**Station/Planète:** ${location.station}\n` +
                       `**Magasin:** ${location.shop}\n` +
                       `**Prix:** ${this.formatPrice(location.price)}\n` +
                       `**Stock:** ${location.stock}`,
                inline: true
            });
        });

        embed.addFields({
            name: '💡 Conseils d\'achat',
            value: '• Vérifiez votre solde aUEC avant de vous déplacer\n' +
                   '• Certains vaisseaux ont un stock limité\n' +
                   '• Les prix peuvent varier selon les événements\n' +
                   '• Pensez à l\'assurance avant d\'acheter',
            inline: false
        });

        embed.setFooter({
            text: 'Informations mises à jour pour la patch 3.21'
        });

        await interaction.editReply({ embeds: [embed] });
    },

    async handleComponentPurchase(interaction) {
        const componentName = interaction.options.getString('nom');
        
        await interaction.deferReply();

        const componentLocations = this.getComponentPurchaseLocations();
        const locations = componentLocations[componentName.toLowerCase()];

        if (!locations) {
            // Donner des informations générales sur où acheter des composants
            const embed = new EmbedBuilder()
                .setColor(0xffaa00)
                .setTitle(`🔧 Recherche de composant - ${componentName}`)
                .setDescription('Composant spécifique non trouvé, voici les emplacements généraux')
                .setTimestamp();

            embed.addFields(
                {
                    name: '🏪 Magasins de composants principaux',
                    value: '• **Dumper\'s Depot** (Area18, ArcCorp)\n' +
                           '• **Cousin Crow\'s Custom Craft** (Orison)\n' +
                           '• **New Deal Ship Shop** (Lorville)\n' +
                           '• **Astro Armada** (New Babbage)',
                    inline: false
                },
                {
                    name: '⚔️ Armes et équipements militaires',
                    value: '• **Centermass** (Area18, ArcCorp)\n' +
                           '• **Hurston Dynamics** (Lorville)\n' +
                           '• **Kastak Arms** (Port Olisar)\n' +
                           '• **Grim HEX** (Station pirate)',
                    inline: false
                }
            );

            return await interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle(`🔧 Où acheter - ${componentName}`)
            .setDescription('Emplacements où vous pouvez acheter ce composant')
            .setTimestamp();

        locations.forEach(location => {
            embed.addFields({
                name: `📍 ${location.shop}`,
                value: `**Lieu:** ${location.location}\n` +
                       `**Système:** ${location.system}\n` +
                       `**Prix:** ${this.formatPrice(location.price)}\n` +
                       `**Disponibilité:** ${location.availability}`,
                inline: true
            });
        });

        await interaction.editReply({ embeds: [embed] });
    },

    async handleLocationInventory(interaction) {
        const location = interaction.options.getString('lieu');
        
        await interaction.deferReply();

        const inventory = this.getLocationInventory(location);

        if (!inventory) {
            return await interaction.editReply({
                content: `❌ Aucune information d'inventaire disponible pour "${location}".`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x9900ff)
            .setTitle(`🏪 Inventaire - ${location}`)
            .setDescription(`Ce que vous pouvez acheter à ${location}`)
            .setTimestamp();

        if (inventory.ships && inventory.ships.length > 0) {
            const shipsList = inventory.ships.map(ship => 
                `• **${ship.name}** - ${this.formatPrice(ship.price)}`
            ).join('\n');

            embed.addFields({
                name: '🚀 Vaisseaux disponibles',
                value: shipsList,
                inline: false
            });
        }

        if (inventory.weapons && inventory.weapons.length > 0) {
            const weaponsList = inventory.weapons.slice(0, 10).map(weapon => 
                `• ${weapon.name} - ${this.formatPrice(weapon.price)}`
            ).join('\n');

            embed.addFields({
                name: '⚔️ Armes',
                value: weaponsList,
                inline: true
            });
        }

        if (inventory.components && inventory.components.length > 0) {
            const componentsList = inventory.components.slice(0, 10).map(comp => 
                `• ${comp.name} - ${this.formatPrice(comp.price)}`
            ).join('\n');

            embed.addFields({
                name: '🔧 Composants',
                value: componentsList,
                inline: true
            });
        }

        embed.addFields({
            name: '📍 Informations de localisation',
            value: inventory.info || 'Informations détaillées disponibles en jeu',
            inline: false
        });

        embed.setFooter({
            text: 'Inventaire approximatif - peut varier en jeu'
        });

        await interaction.editReply({ embeds: [embed] });
    },

    formatPrice(price) {
        if (!price) return 'Prix variable';
        if (typeof price === 'string') return price;
        return new Intl.NumberFormat('fr-FR').format(price) + ' aUEC';
    },

    getShipPurchaseLocations() {
        return {
            'hornet f7c': [
                {
                    location: 'New Deal Ship Shop',
                    system: 'Stanton',
                    station: 'Lorville, Hurston',
                    shop: 'New Deal',
                    price: 1449600,
                    stock: 'Généralement disponible'
                }
            ],
            'cutlass black': [
                {
                    location: 'Astro Armada',
                    system: 'Stanton',
                    station: 'New Babbage, microTech',
                    shop: 'Astro Armada',
                    price: 1385600,
                    stock: 'Toujours en stock'
                }
            ],
            'constellation andromeda': [
                {
                    location: 'New Deal Ship Shop',
                    system: 'Stanton',
                    station: 'Lorville, Hurston',
                    shop: 'New Deal',
                    price: 4991500,
                    stock: 'Stock limité'
                }
            ],
            'sabre': [
                {
                    location: 'Astro Armada',
                    system: 'Stanton',
                    station: 'New Babbage, microTech',
                    shop: 'Astro Armada',
                    price: 2075500,
                    stock: 'Disponible'
                }
            ]
        };
    },

    getComponentPurchaseLocations() {
        return {
            'fr-86 shield generator': [
                {
                    shop: 'Dumper\'s Depot',
                    location: 'Area18, ArcCorp',
                    system: 'Stanton',
                    price: 45000,
                    availability: 'Toujours disponible'
                }
            ],
            'laser repeater': [
                {
                    shop: 'Centermass',
                    location: 'Area18, ArcCorp',
                    system: 'Stanton',
                    price: 25000,
                    availability: 'Stock variable'
                }
            ]
        };
    },

    getLocationInventory(location) {
        const inventories = {
            'New Babbage': {
                ships: [
                    { name: 'Cutlass Black', price: 1385600 },
                    { name: 'Sabre', price: 2075500 },
                    { name: 'Freelancer', price: 1695600 }
                ],
                weapons: [
                    { name: 'M5A Laser Canon', price: 15000 },
                    { name: 'CF-337 Panther', price: 12000 }
                ],
                components: [
                    { name: 'FR-86 Shield Generator', price: 45000 },
                    { name: 'Bracer Power Plant', price: 35000 }
                ],
                info: 'Astro Armada - Principal revendeur de vaisseaux sur microTech'
            },
            'Lorville': {
                ships: [
                    { name: 'Hornet F7C', price: 1449600 },
                    { name: 'Constellation Andromeda', price: 4991500 },
                    { name: 'Avenger Titan', price: 785600 }
                ],
                weapons: [
                    { name: 'Attrition-3', price: 18000 },
                    { name: 'Omnisky VI', price: 22000 }
                ],
                components: [
                    { name: 'Sukoran Shield Generator', price: 38000 },
                    { name: 'Atlas Quantum Drive', price: 42000 }
                ],
                info: 'New Deal Ship Shop - Grande sélection de vaisseaux Hurston Dynamics'
            }
        };

        return inventories[location];
    },

    cooldown: 5
};
