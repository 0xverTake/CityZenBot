// Données des vaisseaux Star Citizen
// Cette data sera utilisée pour peupler la base de données

const SHIPS_DATA = [
    {
        name: 'Aurora MR',
        manufacturer: 'Roberts Space Industries',
        role: 'Starter',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 4,
        max_speed: 1050,
        price_auec: 220000,
        price_usd: 25,
        flight_ready: true,
        concept: false,
        data: {
            health: 4200,
            shields: 3840,
            weapons: '2x S1 weapon hardpoints',
            missiles: '2x S1 missile racks'
        }
    },
    {
        name: 'Mustang Alpha',
        manufacturer: 'Consolidated Outland',
        role: 'Starter',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 2,
        max_speed: 1200,
        price_auec: 305000,
        price_usd: 30,
        flight_ready: true,
        concept: false,
        data: {
            health: 3800,
            shields: 3200,
            weapons: '2x S1 weapon hardpoints',
            missiles: '2x S1 missile racks'
        }
    },
    {
        name: 'Avenger Titan',
        manufacturer: 'Aegis Dynamics',
        role: 'Light Fighter',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 8,
        max_speed: 1150,
        price_auec: 785600,
        price_usd: 70,
        flight_ready: true,
        concept: false,
        data: {
            health: 6200,
            shields: 5760,
            weapons: '1x S3 + 2x S2 weapon hardpoints',
            missiles: '2x S2 missile racks'
        }
    },
    {
        name: '300i',
        manufacturer: 'Origin Jumpworks',
        role: 'Touring',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 8,
        max_speed: 1350,
        price_auec: 1019600,
        price_usd: 80,
        flight_ready: true,
        concept: false,
        data: {
            health: 5400,
            shields: 7680,
            weapons: '2x S3 weapon hardpoints',
            missiles: '2x S2 missile racks'
        }
    },
    {
        name: 'Freelancer',
        manufacturer: 'Misc',
        role: 'Multi-role',
        size: 'Medium',
        crew_min: 1,
        crew_max: 4,
        cargo_capacity: 66,
        max_speed: 1050,
        price_auec: 1695600,
        price_usd: 125,
        flight_ready: true,
        concept: false,
        data: {
            health: 28000,
            shields: 15360,
            weapons: '4x S3 weapon hardpoints',
            missiles: '4x S2 missile racks'
        }
    },
    {
        name: 'Gladius',
        manufacturer: 'Aegis Dynamics',
        role: 'Light Fighter',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 2,
        max_speed: 1323,
        price_auec: 1246400,
        price_usd: 90,
        flight_ready: true,
        concept: false,
        data: {
            health: 7200,
            shields: 7680,
            weapons: '3x S3 weapon hardpoints',
            missiles: '2x S2 missile racks'
        }
    },
    {
        name: 'Arrow',
        manufacturer: 'Anvil Aerospace',
        role: 'Light Fighter',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 0,
        max_speed: 1420,
        price_auec: 972000,
        price_usd: 75,
        flight_ready: true,
        concept: false,
        data: {
            health: 6800,
            shields: 6400,
            weapons: '3x S3 weapon hardpoints',
            missiles: '2x S2 missile racks'
        }
    },
    {
        name: 'Buccaneer',
        manufacturer: 'Drake Interplanetary',
        role: 'Light Fighter',
        size: 'Small',
        crew_min: 1,
        crew_max: 1,
        cargo_capacity: 2,
        max_speed: 1350,
        price_auec: 1407600,
        price_usd: 115,
        flight_ready: true,
        concept: false,
        data: {
            health: 7600,
            shields: 5120,
            weapons: '4x S3 weapon hardpoints',
            missiles: '2x S2 missile racks'
        }
    },
    {
        name: 'Cutlass Blue',
        manufacturer: 'Drake Interplanetary',
        role: 'Interdiction',
        size: 'Medium',
        crew_min: 1,
        crew_max: 3,
        cargo_capacity: 16,
        max_speed: 1100,
        price_auec: 2156000,
        price_usd: 175,
        flight_ready: true,
        concept: false,
        data: {
            health: 23000,
            shields: 15360,
            weapons: '6x weapon hardpoints',
            missiles: '4x S2 missile racks'
        }
    },
    {
        name: 'Constellation Aquila',
        manufacturer: 'Roberts Space Industries',
        role: 'Exploration',
        size: 'Large',
        crew_min: 1,
        crew_max: 4,
        cargo_capacity: 96,
        max_speed: 950,
        price_auec: 5061500,
        price_usd: 310,
        flight_ready: true,
        concept: false,
        data: {
            health: 55000,
            shields: 25600,
            weapons: '4x S4 + 2x S2 weapon hardpoints',
            missiles: '4x S2 missile racks'
        }
    },
    {
        name: 'Retaliator Bomber',
        manufacturer: 'Aegis Dynamics',
        role: 'Heavy Bomber',
        size: 'Large',
        crew_min: 1,
        crew_max: 7,
        cargo_capacity: 0,
        max_speed: 950,
        price_auec: 4218000,
        price_usd: 275,
        flight_ready: true,
        concept: false,
        data: {
            health: 85000,
            shields: 38400,
            weapons: '6x S2 turrets',
            missiles: '6x S9 torpedoes'
        }
    },
    {
        name: 'Hammerhead',
        manufacturer: 'Aegis Dynamics',
        role: 'Corvette',
        size: 'Large',
        crew_min: 1,
        crew_max: 9,
        cargo_capacity: 40,
        max_speed: 900,
        price_auec: 12230000,
        price_usd: 725,
        flight_ready: true,
        concept: false,
        data: {
            health: 120000,
            shields: 76800,
            weapons: '6x S4 turrets + 4x S3 turrets',
            missiles: '6x S3 missile racks'
        }
    },
    {
        name: 'Carrack',
        manufacturer: 'Anvil Aerospace',
        role: 'Exploration',
        size: 'Large',
        crew_min: 1,
        crew_max: 6,
        cargo_capacity: 456,
        max_speed: 950,
        price_auec: 26954000,
        price_usd: 600,
        flight_ready: true,
        concept: false,
        data: {
            health: 180000,
            shields: 76800,
            weapons: '4x S4 turrets + 2x S3 turrets',
            missiles: '4x S3 missile racks'
        }
    }
];

const BUILDS_DATA = [
    {
        ship_name: 'Hornet F7C',
        build_name: 'PvP Dominator',
        build_type: 'pvp',
        total_cost: 180000,
        components: {
            'Armes': '4x Attrition-3 Laser Repeaters',
            'Boucliers': 'FR-86 Shield Generator',
            'Moteur': 'Crossfield Quantum Drive',
            'Refroidissement': '2x Zero-Rush Coolers',
            'Génération': 'JS-400 Power Plant'
        },
        description: 'Configuration PvP optimisée pour la mobilité et les dégâts soutenus. Excellent pour les duels et les combats rapprochés.',
        author: 'CityZenBot'
    },
    {
        ship_name: 'Cutlass Black',
        build_name: 'Polyvalent ERT',
        build_type: 'pve',
        total_cost: 220000,
        components: {
            'Armes': '4x CF-337 Panthers + 2x Attrition-3',
            'Boucliers': 'Sukoran Shield Generator',
            'Moteur': 'Atlas Quantum Drive',
            'Refroidissement': '3x Polar Coolers',
            'Génération': 'Maelstrom Power Plant'
        },
        description: 'Build parfait pour les missions ERT et les bounties. Équilibre entre dégâts, survie et efficacité énergétique.',
        author: 'CityZenBot'
    },
    {
        ship_name: 'Sabre',
        build_name: 'Assassin Furtif',
        build_type: 'pvp',
        total_cost: 195000,
        components: {
            'Armes': '4x Attrition-3 Laser Repeaters',
            'Boucliers': 'Mirage Shield Generator',
            'Moteur': 'Drift Quantum Drive',
            'Refroidissement': '2x Frost Star Coolers',
            'Génération': 'Slipstream Power Plant'
        },
        description: 'Configuration furtive pour les approches silencieuses et les attaques surprises. Signature réduite et dégâts élevés.',
        author: 'CityZenBot'
    },
    {
        ship_name: 'Vanguard Warden',
        build_name: 'Forteresse Volante',
        build_type: 'pve',
        total_cost: 350000,
        components: {
            'Armes': '1x M7A Laser Canon + 4x CF-337 Panthers',
            'Boucliers': '2x FR-86 Shield Generators',
            'Moteur': 'Bolon Quantum Drive',
            'Refroidissement': '3x ArcCorp Coolers',
            'Génération': 'Durango Power Plant'
        },
        description: 'Tank ultime pour les missions les plus difficiles. Survie maximale et dégâts soutenus pour les longs combats.',
        author: 'CityZenBot'
    },
    {
        ship_name: 'Gladius',
        build_name: 'Intercepteur Rapide',
        build_type: 'pvp',
        total_cost: 145000,
        components: {
            'Armes': '3x Badger Repeaters',
            'Boucliers': 'Palisade Shield Generator',
            'Moteur': 'XL-1 Quantum Drive',
            'Refroidissement': '2x Thermal Throttle Coolers',
            'Génération': 'Aegis Power Plant'
        },
        description: 'Build axé sur la vitesse et la manœuvrabilité. Parfait pour les hit-and-run et les combats mobiles.',
        author: 'CityZenBot'
    }
];

const META_DATA = [
    // PvP Meta
    { category: 'pvp', tier: 'S', ship_name: 'Sabre', reasoning: 'Furtivité exceptionnelle et dégâts élevés', patch_version: '3.21' },
    { category: 'pvp', tier: 'S', ship_name: 'Vanguard Warden', reasoning: 'Tanking supérieur et armement lourd', patch_version: '3.21' },
    { category: 'pvp', tier: 'S', ship_name: 'Gladius', reasoning: 'Mobilité et simplicité d\'utilisation', patch_version: '3.21' },
    { category: 'pvp', tier: 'A', ship_name: 'Hornet F7C', reasoning: 'Équilibre parfait pour tous les styles', patch_version: '3.21' },
    { category: 'pvp', tier: 'A', ship_name: 'Arrow', reasoning: 'Vitesse et agilité remarquables', patch_version: '3.21' },
    { category: 'pvp', tier: 'A', ship_name: 'Buccaneer', reasoning: 'Puissance de feu impressionnante', patch_version: '3.21' },
    { category: 'pvp', tier: 'B', ship_name: 'Cutlass Black', reasoning: 'Polyvalent mais moins spécialisé', patch_version: '3.21' },
    { category: 'pvp', tier: 'B', ship_name: 'Avenger Titan', reasoning: 'Bon rapport qualité-prix pour débuter', patch_version: '3.21' },
    
    // PvE Meta
    { category: 'pve', tier: 'S', ship_name: 'Constellation Andromeda', reasoning: 'Excellent pour les ERT et HRT', patch_version: '3.21' },
    { category: 'pve', tier: 'S', ship_name: 'Vanguard Warden', reasoning: 'Tank ultime contre les NPCs', patch_version: '3.21' },
    { category: 'pve', tier: 'S', ship_name: 'Retaliator Bomber', reasoning: 'Idéal pour les missions de groupe', patch_version: '3.21' },
    { category: 'pve', tier: 'A', ship_name: 'Cutlass Black', reasoning: 'Polyvalence et prix abordable', patch_version: '3.21' },
    { category: 'pve', tier: 'A', ship_name: 'Freelancer', reasoning: 'Bon compromis combat/cargo', patch_version: '3.21' },
    { category: 'pve', tier: 'A', ship_name: 'Hornet F7C', reasoning: 'Solide pour les bounties moyens', patch_version: '3.21' },
    { category: 'pve', tier: 'B', ship_name: 'Gladius', reasoning: 'Bon pour débuter le PvE', patch_version: '3.21' },
    { category: 'pve', tier: 'B', ship_name: 'Avenger Titan', reasoning: 'Starter viable pour les petites missions', patch_version: '3.21' },
    
    // Exploration Meta
    { category: 'exploration', tier: 'S', ship_name: 'Carrack', reasoning: 'Le roi de l\'exploration', patch_version: '3.21' },
    { category: 'exploration', tier: 'S', ship_name: 'Constellation Aquila', reasoning: 'Excellent rapport exploration/combat', patch_version: '3.21' },
    { category: 'exploration', tier: 'A', ship_name: 'Freelancer', reasoning: 'Bon pour débuter l\'exploration', patch_version: '3.21' },
    { category: 'exploration', tier: 'A', ship_name: '300i', reasoning: 'Exploration solo élégante', patch_version: '3.21' }
];

module.exports = {
    SHIPS_DATA,
    BUILDS_DATA,
    META_DATA
};
