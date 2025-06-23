# 🚨 SOLUTION RAPIDE - Erreur APPLICATION_ID

## ❌ Votre Erreur
```
DiscordAPIError[50035]: Invalid Form Body
application_id[NUMBER_TYPE_COERCE]: Value "undefined" is not snowflake.
```

## ✅ SOLUTION EN 3 ÉTAPES

### 1️⃣ **Configurez CLIENT_ID dans .env**

Éditez votre fichier `.env` sur le Raspberry Pi :
```bash
ssh trn@192.168.0.181
cd /home/trn/CityZenBot
nano .env
```

Ajoutez cette ligne (remplacez par votre vraie valeur) :
```env
DISCORD_TOKEN=votre_token_discord
CLIENT_ID=123456789012345678
GUILD_ID=votre_serveur_id
```

### 2️⃣ **Trouvez votre APPLICATION ID**

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre bot
3. Section "General Information"
4. Copiez "Application ID" (nombre de ~18 chiffres)
5. Collez-le dans `CLIENT_ID=`

### 3️⃣ **Redéployez les commandes**

```bash
# Sur le Pi
cd /home/trn/CityZenBot
node deploy-commands.js
```

## 🔧 Script Automatique

Pour éviter les erreurs, utilisez notre script de configuration :

```bash
# Sur votre PC
node quick-setup.js

# Puis redéployez sur le Pi
.\deploy-to-pi.ps1
```

## ✅ Vérification

```bash
# Vérifiez la config
node check-config.js

# Testez la connexion
node check-config.js --test-connection
```

---

**🎯 En résumé : Il vous manque juste `CLIENT_ID=` dans votre .env !**
