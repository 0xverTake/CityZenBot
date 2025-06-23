# 🤖 Configuration API Hugging Face - Guide Complet

## 📋 Étapes pour obtenir votre API Key GRATUITE

### 1. Créer un compte Hugging Face
1. Allez sur https://huggingface.co/
2. Cliquez sur "Sign Up" (Inscription gratuite)
3. Créez votre compte avec email/mot de passe
4. Vérifiez votre email

### 2. Générer votre API Token
1. Connectez-vous à votre compte
2. Allez dans **Settings** → **Access Tokens**
   - URL directe: https://huggingface.co/settings/tokens
3. Cliquez sur **"New token"**
4. Donnez un nom : `CityZenBot-SC-AI`
5. Sélectionnez **"Read"** (suffisant pour l'inférence)
6. Cliquez sur **"Generate"**
7. **COPIEZ** votre token (commence par `hf_`)

### 3. Configuration dans CityZenBot

#### Option A: Fichier .env (Recommandé)
```bash
# Dans votre fichier .env
HUGGINGFACE_API_KEY=hf_votre_token_ici
```

#### Option B: Variable d'environnement Windows
```powershell
# PowerShell (permanent)
[Environment]::SetEnvironmentVariable("HUGGINGFACE_API_KEY", "hf_votre_token_ici", "User")
```

#### Option C: Configuration temporaire
```powershell
# PowerShell (session courante)
$env:HUGGINGFACE_API_KEY="hf_votre_token_ici"
```

## ✅ Limites de l'API Gratuite

### 🟢 **Ce qui est GRATUIT à vie :**
- **1000 requêtes/mois** sur l'Inference API
- Accès à tous les modèles publics
- Pas de limite de temps
- Pas de carte de crédit requise

### 📊 **Modèles utilisés par CityZenBot :**
- `facebook/blenderbot-400M-distill` - Conseils
- `microsoft/DialoGPT-medium` - Conversations  
- `gpt2` - Fallback simple

### 🔄 **Système de Fallback Intelligent :**
- Si API indisponible → Base de connaissances locale
- Si quota dépassé → Conseils pré-définis Star Citizen
- **Toujours** une réponse utile garantie !

## 🧪 Test de Fonctionnement

### Test rapide API :
```javascript
// Test dans Node.js
const service = new StarCitizenAIService();
service.checkAIAvailability().then(status => {
    console.log('Status IA:', status);
});
```

### Test commande Discord :
```
/ai conseil question: Comment débuter dans Star Citizen ?
/ai astuce
/ai status
```

## 🛠️ Dépannage

### ❌ "API key manquante"
- Vérifiez que la variable d'environnement est définie
- Redémarrez le bot après avoir ajouté la clé

### ❌ "API indisponible" 
- Vérifiez votre connexion internet
- Le service fallback prend automatiquement le relais

### ❌ "Quota dépassé"
- Limite mensuelle atteinte (1000 requêtes)
- Le fallback local fonctionne normalement
- Se réinitialise chaque mois

## 🎯 Optimisation

### Pour économiser les requêtes API :
1. **Questions simples** → Fallback direct
2. **Questions complexes** → IA Hugging Face
3. **Cache intelligent** des réponses fréquentes

### Surveillance du quota :
- Logs automatiques des appels API
- Compteur intégré dans `/ai status`
- Basculement transparent vers fallback

## 🔒 Sécurité

### ✅ Bonnes pratiques :
- ❌ Jamais commit l'API key dans Git
- ✅ Utilisez les variables d'environnement
- ✅ Limitez les permissions du token (Read only)
- ✅ Régénérez la clé si compromise

### 🛡️ Protection intégrée :
- Timeout des requêtes (10s max)
- Gestion d'erreurs robuste
- Logs sécurisés (API key masquée)

---

## 🚀 Résultat Final

Avec cette configuration, votre CityZenBot dispose de :

✅ **IA gratuite permanente** (Hugging Face)  
✅ **Fallback robuste** (base de connaissances locale)  
✅ **1000 réponses IA/mois** gratuites  
✅ **Conseils Star Citizen 4.2** toujours à jour  
✅ **Zero downtime** garanti  

*Votre bot est maintenant équipé d'une IA open source gratuite et fiable !*
