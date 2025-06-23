# 🛠️ Guide de Dépannage - Base de Données

## ❌ Erreur "Base de données fermée"

### 🔍 **Diagnostic Rapide**
```bash
# Vérifiez l'état de la base de données
npm run diagnose-db

# Test complet
npm test
```

### 🚨 **Causes Communes**

#### 1. **Connexion fermée prématurément**
```javascript
// ❌ Mauvais
DatabaseService.close();
const ships = await DatabaseService.getAllShips(); // Erreur !

// ✅ Bon
const ships = await DatabaseService.getAllShips();
await DatabaseService.close(); // Fermer à la fin
```

#### 2. **Permissions insuffisantes**
```bash
# Linux/macOS
chmod 755 database/
chmod 644 database/*.db

# Windows
# Vérifiez les permissions du dossier dans les propriétés
```

#### 3. **Base de données corrompue**
```bash
# Supprimez et recréez
rm database/starcitizenbot.db
npm test  # Recrée automatiquement
```

#### 4. **SQLite3 mal installé**
```bash
# Réinstallez sqlite3
npm uninstall sqlite3
npm install sqlite3

# Ou compilation native
npm rebuild sqlite3
```

### 🔧 **Solutions par Erreur**

#### "Database is locked"
```bash
# Fermez tous les processus qui utilisent la DB
pkill -f "node.*bot"  # Linux/macOS
taskkill /f /im node.exe  # Windows

# Redémarrez le bot
npm start
```

#### "Database file is encrypted or not a database"
```bash
# Base corrompue - recréez
mv database/starcitizenbot.db database/backup.db
npm test
```

#### "SQLITE_READONLY: attempt to write a readonly database"
```bash
# Permissions
chmod 664 database/starcitizenbot.db
chmod 755 database/

# Vérifiez l'espace disque
df -h .  # Linux/macOS
```

### 🧪 **Tests de Validation**

#### Test de connexion simple
```javascript
// test-db-simple.js
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database/starcitizenbot.db');

db.get("SELECT COUNT(*) as count FROM ships", (err, row) => {
    if (err) {
        console.error('❌ Erreur:', err);
    } else {
        console.log(`✅ ${row.count} vaisseaux trouvés`);
    }
    db.close();
});
```

#### Test de performance
```bash
# Vérifiez les performances
time npm test

# Surveillez l'utilisation mémoire
top -p $(pgrep -f "node.*test")
```

### 📊 **Monitoring de la DB**

#### Scripts de surveillance
```bash
# Taille de la DB
ls -lh database/

# Processus utilisant la DB
lsof database/starcitizenbot.db  # Linux/macOS

# Logs SQLite (si activés)
tail -f logs/database.log
```

#### Maintenance préventive
```bash
# Nettoyage hebdomadaire
npm run clean-db  # À implémenter si nécessaire

# Sauvegarde
cp database/starcitizenbot.db backup/starcitizenbot_$(date +%Y%m%d).db
```

### 🔄 **Récupération d'Urgence**

#### Si tout échoue
```bash
# 1. Sauvegardez la config
cp .env .env.backup

# 2. Nettoyage complet
rm -rf database/
rm -rf node_modules/
rm package-lock.json

# 3. Réinstallation
npm install

# 4. Test
npm test

# 5. Redémarrage
npm start
```

#### Scripts d'urgence
```bash
# Créez un script reset-db.sh
#!/bin/bash
echo "🚨 Réinitialisation d'urgence de la base de données"
rm -f database/*.db
mkdir -p database
node test.js
echo "✅ Base de données réinitialisée"
```

### 💡 **Prévention**

#### Bonnes pratiques
1. **Toujours fermer** les connexions DB
2. **Gérer les erreurs** avec try/catch
3. **Sauvegarder** régulièrement
4. **Monitorer** l'espace disque
5. **Tester** après chaque modification

#### Configuration recommandée
```javascript
// Dans DatabaseService.js
const dbConfig = {
    timeout: 30000,        // 30s timeout
    busyTimeout: 5000,     // 5s busy timeout
    maxConnections: 1,     // SQLite = 1 seule connexion
    retryDelay: 1000       // 1s entre les tentatives
};
```

### 📞 **Support**

Si les problèmes persistent :
1. Exécutez `npm run diagnose-db`
2. Consultez les logs dans `logs/`
3. Vérifiez l'espace disque
4. Testez avec une DB vide
5. Contactez le support avec les logs complets

---

**🎯 Dans 99% des cas, `npm run diagnose-db` suivi de `npm test` résout le problème !**
