#!/usr/bin/env node

// Script de diagnostic de la base de données
// Usage: node diagnose-db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const Logger = require('./src/utils/Logger');

async function diagnoseDatabase() {
    console.log('🔍 Diagnostic de la base de données CityZenBot\n');
    
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'database/starcitizenbot.db');
    const dbDir = path.dirname(dbPath);
    
    try {
        // 1. Vérifier l'existence du répertoire
        console.log('📁 Vérification du répertoire...');
        if (!fs.existsSync(dbDir)) {
            console.log(`❌ Répertoire manquant: ${dbDir}`);
            console.log('💡 Création du répertoire...');
            fs.mkdirSync(dbDir, { recursive: true });
            console.log('✅ Répertoire créé');
        } else {
            console.log(`✅ Répertoire existe: ${dbDir}`);
        }
        
        // 2. Vérifier l'existence du fichier DB
        console.log('\n💾 Vérification du fichier de base de données...');
        if (!fs.existsSync(dbPath)) {
            console.log(`❌ Base de données manquante: ${dbPath}`);
            console.log('💡 La base sera créée automatiquement au premier démarrage');
        } else {
            console.log(`✅ Base de données existe: ${dbPath}`);
            
            // Vérifier la taille
            const stats = fs.statSync(dbPath);
            console.log(`📊 Taille: ${Math.round(stats.size / 1024)} KB`);
            console.log(`📅 Modifiée: ${stats.mtime.toLocaleString()}`);
        }
        
        // 3. Test de connexion
        console.log('\n🔌 Test de connexion...');
        const db = new sqlite3.Database(dbPath);
        
        await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Connexion SQLite réussie');
                    resolve();
                }
            });
        });
        
        // 4. Lister les tables
        console.log('\n📋 Tables disponibles:');
        const tables = await new Promise((resolve, reject) => {
            db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        if (tables.length === 0) {
            console.log('❌ Aucune table trouvée - Base de données non initialisée');
        } else {
            for (const table of tables) {
                console.log(`✅ Table: ${table.name}`);
                
                // Compter les enregistrements
                const count = await new Promise((resolve, reject) => {
                    db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, row) => {
                        if (err) reject(err);
                        else resolve(row.count);
                    });
                });
                console.log(`   📊 ${count} enregistrements`);
            }
        }
        
        // 5. Test d'écriture
        console.log('\n✏️ Test d\'écriture...');
        await new Promise((resolve, reject) => {
            db.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, test_data TEXT)", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            db.run("INSERT INTO test_table (test_data) VALUES (?)", ['test_diagnostic'], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            db.run("DELETE FROM test_table WHERE test_data = ?", ['test_diagnostic'], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        console.log('✅ Test d\'écriture réussi');
        
        // 6. Fermeture
        await new Promise((resolve) => {
            db.close((err) => {
                if (err) {
                    console.log('⚠️ Erreur lors de la fermeture:', err.message);
                } else {
                    console.log('✅ Base de données fermée proprement');
                }
                resolve();
            });
        });
        
        console.log('\n🎉 Diagnostic terminé - Base de données OK !');
        
    } catch (error) {
        console.error('\n❌ Erreur lors du diagnostic:', error.message);
        console.log('\n💡 Solutions possibles:');
        console.log('1. Vérifiez les permissions du répertoire');
        console.log('2. Réinstallez sqlite3: npm install sqlite3');
        console.log('3. Supprimez et recréez la base: rm database/*.db');
        console.log('4. Vérifiez l\'espace disque disponible');
        process.exit(1);
    }
}

// Lancer le diagnostic
diagnoseDatabase();
