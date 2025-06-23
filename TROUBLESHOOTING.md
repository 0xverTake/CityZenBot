# 🚨 Guide de Dépannage - CityZenBot

## ❌ Erreur : "application_id[NUMBER_TYPE_COERCE]: Value "undefined" is not snowflake"

### 🔍 **Problème**
Cette erreur signifie que `CLIENT_ID` n'est pas défini dans votre fichier `.env`.

### ✅ **Solution**

1. **Vérifiez votre fichier `.env`** :
```bash
# Votre .env doit contenir :
DISCORD_TOKEN=votre_token_discord
CLIENT_ID=votre_application_id
GUILD_ID=votre_serveur_id
```

2. **Trouvez votre APPLICATION ID (CLIENT_ID)** :
   - Allez sur https://discord.com/developers/applications
   - Sélectionnez votre application/bot
   - Copiez l'**Application ID** (pas le token !)
   - Collez-le dans `CLIENT_ID=`

3. **Vérifiez avec** :
```bash
node check-config.js
```

### 📋 **Comment obtenir les IDs Discord**

#### 🤖 Application ID (CLIENT_ID)
1. https://discord.com/developers/applications
2. Sélectionnez votre bot
3. Section "General Information"
4. Copiez "Application ID"

#### 🏠 Guild ID (GUILD_ID)
1. Activez le mode développeur Discord :
   - Paramètres utilisateur → Avancé → Mode développeur
2. Clic droit sur votre serveur → Copier l'identifiant

#### 🔑 Bot Token (DISCORD_TOKEN)
1. https://discord.com/developers/applications
2. Sélectionnez votre bot
3. Section "Bot" → Token → Copy

---

## ❌ Erreur : "DiscordAPIError[50001]: Missing Access"

### 🔍 **Problème**
Le bot n'a pas les permissions nécessaires sur votre serveur.

### ✅ **Solution**

1. **Réinvitez le bot avec les bonnes permissions** :
```
https://discord.com/api/oauth2/authorize?client_id=VOTRE_CLIENT_ID&permissions=2147483647&scope=bot%20applications.commands
```

2. **Remplacez `VOTRE_CLIENT_ID`** par votre Application ID

3. **Permissions minimales requises** :
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History

---

## ❌ Erreur : "connect ECONNREFUSED" ou timeout

### 🔍 **Problème**
Problème de connexion réseau ou token invalide.

### ✅ **Solution**

1. **Vérifiez votre connexion internet**

2. **Vérifiez le token Discord** :
```bash
node check-config.js --test-connection
```

3. **Régénérez le token si nécessaire** :
   - Discord Developer Portal → Bot → Reset Token

---

## ❌ Erreur : "Cannot find module"

### 🔍 **Problème**
Dépendances Node.js manquantes.

### ✅ **Solution**

```bash
# Supprimez node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstallez
npm install
```

---

## ❌ Erreur de base de données SQLite

### 🔍 **Problème**
Problème avec la base de données.

### ✅ **Solution**

1. **Vérifiez les permissions** :
```bash
# Sur Linux/Pi
chmod 755 database/
chmod 644 database/*.db
```

2. **Recréez la base** :
```bash
# Supprimez l'ancienne base
rm database/starcitizenbot.db

# Redémarrez le bot (recrée automatiquement)
node src/index.js
```

---

## 🍓 Problèmes spécifiques Raspberry Pi

### ❌ "Permission denied" lors du déploiement

**Solution** :
```bash
# Sur votre PC
.\deploy-to-pi.ps1

# Si ça échoue, connexion manuelle :
ssh trn@192.168.0.181
cd CityZenBot
chmod +x start.sh
sudo chown -R trn:trn /home/trn/CityZenBot
```

### ❌ "npm install" échoue sur Pi

**Solution** :
```bash
# Sur le Pi
sudo apt update
sudo apt install build-essential python3-dev
npm install --verbose
```

### ❌ Service systemd ne démarre pas

**Solution** :
```bash
# Vérifiez les logs
sudo journalctl -u cityzenbot -f

# Vérifiez le service
sudo systemctl status cityzenbot

# Redémarrez
sudo systemctl restart cityzenbot
```

---

## 🔧 Outils de Diagnostic

### 1. Vérification complète
```bash
node check-config.js --test-connection
```

### 2. Test des components
```bash
node test.js
```

### 3. Logs détaillés
```bash
# Mode développement
set NODE_ENV=development
node src/index.js
```

### 4. Test des commandes
```bash
# Test manuel
node deploy-commands.js
```

---

## 📞 Checklist de Dépannage

### ✅ **Avant de demander de l'aide** :

- [ ] J'ai vérifié le fichier `.env`
- [ ] J'ai exécuté `node check-config.js`
- [ ] J'ai testé `node test.js`
- [ ] J'ai vérifié les permissions du bot sur Discord
- [ ] J'ai regardé les logs d'erreur complets
- [ ] J'ai essayé de redémarrer le bot
- [ ] J'ai vérifié ma connexion internet

### 📋 **Informations à fournir** :

1. **Système d'exploitation** : Windows/Linux/Pi/macOS
2. **Version Node.js** : `node --version`
3. **Message d'erreur complet**
4. **Étapes pour reproduire**
5. **Configuration** (sans révéler les tokens !)

---

## 🆘 Support d'Urgence

### Si rien ne fonctionne :

1. **Réinstallation complète** :
```bash
# Sauvegardez votre .env
copy .env .env.backup

# Réinstallez tout
rm -rf node_modules package-lock.json database/
npm install
node deploy-commands.js
```

2. **Configuration manuelle** :
   - Vérifiez chaque variable du `.env` une par une
   - Testez avec un bot minimal
   - Vérifiez les permissions Discord

3. **Mode minimal** :
```javascript
// test-minimal.js
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log('✅ Bot connecté !');
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
```

---

## 💡 Conseils de Prévention

1. **Sauvegardez votre `.env`** régulièrement
2. **Testez après chaque modification**
3. **Gardez les logs** pour diagnostic
4. **Mettez à jour** Discord.js régulièrement
5. **Surveillez** les changements d'API Discord

---

*🚀 La plupart des problèmes se résolvent en vérifiant la configuration !*
