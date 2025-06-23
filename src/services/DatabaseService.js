const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const Logger = require('../utils/Logger');

class DatabaseService {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/starcitizenbot.db');
    }

    async initialize() {
        try {
            // Créer le dossier database s'il n'existe pas
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Ouvrir la base de données
            this.db = new sqlite3.Database(this.dbPath);
            
            // Créer les tables
            await this.createTables();
            
            Logger.info('Base de données initialisée avec succès');
        } catch (error) {
            Logger.error('Erreur lors de l\'initialisation de la base de données:', error);
            throw error;
        }
    }

    async createTables() {
        const tables = [
            // Table des vaisseaux
            `CREATE TABLE IF NOT EXISTS ships (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                manufacturer TEXT NOT NULL,
                role TEXT NOT NULL,
                size TEXT NOT NULL,
                crew_min INTEGER,
                crew_max INTEGER,
                cargo_capacity INTEGER,
                max_speed INTEGER,
                price_auec INTEGER,
                price_usd REAL,
                flight_ready BOOLEAN DEFAULT 0,
                concept BOOLEAN DEFAULT 0,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Table des composants
            `CREATE TABLE IF NOT EXISTS components (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                type TEXT NOT NULL,
                size TEXT NOT NULL,
                grade TEXT NOT NULL,
                manufacturer TEXT,
                price_auec INTEGER,
                stats TEXT,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Table des builds
            `CREATE TABLE IF NOT EXISTS builds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ship_name TEXT NOT NULL,
                build_name TEXT NOT NULL,
                build_type TEXT NOT NULL, -- 'pvp', 'pve', 'exploration', etc.
                total_cost INTEGER,
                components TEXT, -- JSON des composants
                description TEXT,
                rating REAL DEFAULT 0,
                votes INTEGER DEFAULT 0,
                author TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ship_name) REFERENCES ships(name)
            )`,

            // Table des emplacements d'achat
            `CREATE TABLE IF NOT EXISTS purchase_locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_name TEXT NOT NULL,
                item_type TEXT NOT NULL, -- 'ship' ou 'component'
                location TEXT NOT NULL,
                system TEXT NOT NULL,
                planet TEXT,
                station TEXT,
                shop TEXT,
                price_auec INTEGER,
                stock_status TEXT DEFAULT 'unknown',
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Table des méta et tier lists
            `CREATE TABLE IF NOT EXISTS meta_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL, -- 'pvp', 'pve', 'exploration', etc.
                tier TEXT NOT NULL, -- 'S', 'A', 'B', 'C', 'D'
                ship_name TEXT NOT NULL,
                reasoning TEXT,
                patch_version TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ship_name) REFERENCES ships(name)
            )`,

            // Table des utilisateurs pour les préférences
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                discord_id TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                favorite_ships TEXT, -- JSON array
                preferred_role TEXT,
                settings TEXT, -- JSON des paramètres
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const tableSQL of tables) {
            await this.runAsync(tableSQL);
        }

        // Créer les index pour les performances
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_ships_name ON ships(name)',
            'CREATE INDEX IF NOT EXISTS idx_ships_role ON ships(role)',
            'CREATE INDEX IF NOT EXISTS idx_ships_manufacturer ON ships(manufacturer)',
            'CREATE INDEX IF NOT EXISTS idx_components_type ON components(type)',
            'CREATE INDEX IF NOT EXISTS idx_builds_ship ON builds(ship_name)',
            'CREATE INDEX IF NOT EXISTS idx_builds_type ON builds(build_type)',
            'CREATE INDEX IF NOT EXISTS idx_locations_item ON purchase_locations(item_name)',
            'CREATE INDEX IF NOT EXISTS idx_meta_category ON meta_data(category)',
            'CREATE INDEX IF NOT EXISTS idx_users_discord ON users(discord_id)'
        ];

        for (const indexSQL of indexes) {
            await this.runAsync(indexSQL);
        }
    }

    // Wrapper pour promisifier les requêtes SQLite
    runAsync(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    getAsync(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    allAsync(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Méthodes pour les vaisseaux
    async getShip(name) {
        return await this.getAsync(
            'SELECT * FROM ships WHERE name = ? COLLATE NOCASE',
            [name]
        );
    }

    async getAllShips() {
        return await this.allAsync('SELECT * FROM ships ORDER BY name');
    }

    async getShipsByRole(role) {
        return await this.allAsync(
            'SELECT * FROM ships WHERE role = ? COLLATE NOCASE ORDER BY name',
            [role]
        );
    }

    async searchShips(searchTerm) {
        return await this.allAsync(
            'SELECT * FROM ships WHERE name LIKE ? OR manufacturer LIKE ? ORDER BY name',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
    }

    async upsertShip(shipData) {
        const sql = `
            INSERT OR REPLACE INTO ships 
            (name, manufacturer, role, size, crew_min, crew_max, cargo_capacity, 
             max_speed, price_auec, price_usd, flight_ready, concept, data, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        return await this.runAsync(sql, [
            shipData.name,
            shipData.manufacturer,
            shipData.role,
            shipData.size,
            shipData.crew_min,
            shipData.crew_max,
            shipData.cargo_capacity,
            shipData.max_speed,
            shipData.price_auec,
            shipData.price_usd,
            shipData.flight_ready,
            shipData.concept,
            JSON.stringify(shipData.data || {})
        ]);
    }

    // Méthodes pour les builds
    async getBuildsByShip(shipName) {
        return await this.allAsync(
            'SELECT * FROM builds WHERE ship_name = ? COLLATE NOCASE ORDER BY rating DESC',
            [shipName]
        );
    }

    async getBuildsByType(buildType) {
        return await this.allAsync(
            'SELECT * FROM builds WHERE build_type = ? COLLATE NOCASE ORDER BY rating DESC',
            [buildType]
        );
    }

    async insertBuild(buildData) {
        const sql = `
            INSERT INTO builds 
            (ship_name, build_name, build_type, total_cost, components, description, author)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        return await this.runAsync(sql, [
            buildData.ship_name,
            buildData.build_name,
            buildData.build_type,
            buildData.total_cost,
            JSON.stringify(buildData.components),
            buildData.description,
            buildData.author
        ]);
    }

    // Méthodes pour les emplacements d'achat
    async getPurchaseLocations(itemName, itemType) {
        return await this.allAsync(
            'SELECT * FROM purchase_locations WHERE item_name = ? AND item_type = ? COLLATE NOCASE',
            [itemName, itemType]
        );
    }

    async getLocationInventory(location) {
        return await this.allAsync(
            'SELECT * FROM purchase_locations WHERE location = ? COLLATE NOCASE',
            [location]
        );
    }

    // Méthodes pour les méta données
    async getMetaByCategory(category) {
        return await this.allAsync(
            'SELECT * FROM meta_data WHERE category = ? COLLATE NOCASE ORDER BY tier, ship_name',
            [category]
        );
    }

    async updateMetaData(metaData) {
        const sql = `
            INSERT OR REPLACE INTO meta_data 
            (category, tier, ship_name, reasoning, patch_version, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        return await this.runAsync(sql, [
            metaData.category,
            metaData.tier,
            metaData.ship_name,
            metaData.reasoning,
            metaData.patch_version
        ]);
    }

    // Méthodes utilitaires
    async cleanup() {
        // Supprimer les données anciennes
        await this.runAsync('DELETE FROM purchase_locations WHERE last_updated < datetime("now", "-7 days")');
        await this.runAsync('DELETE FROM meta_data WHERE updated_at < datetime("now", "-30 days")');
        
        // Optimiser la base de données
        await this.runAsync('VACUUM');
        
        Logger.info('Nettoyage de la base de données terminé');
    }

    async close() {
        if (this.db) {
            return new Promise((resolve) => {
                this.db.close((err) => {
                    if (err) {
                        Logger.error('Erreur lors de la fermeture de la base de données:', err);
                    } else {
                        Logger.info('Base de données fermée');
                    }
                    resolve();
                });
            });
        }
    }
}

module.exports = new DatabaseService();
