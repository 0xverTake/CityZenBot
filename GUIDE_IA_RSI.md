# 🤖 Guide d'utilisation IA + Guides RSI - CityZenBot v2.0.1

## 🚀 Nouvelles fonctionnalités

CityZenBot v2.0.1 intègre désormais :
- **🤖 Intelligence Artificielle gratuite** (Hugging Face)
- **📚 Guides officiels RSI Spectrum** 
- **🌌 Compatibilité Star Citizen 4.2**

## 📋 Commandes disponibles

### 🤖 Conseils IA personnalisés
```
/ai conseil question:"Comment débuter dans Star Citizen ?"
/ai conseil question:"Quel vaisseau pour faire du minage ?" niveau:débutant
/ai conseil question:"Stratégies de combat PvP" categorie:combat
```

### 📚 Guides officiels RSI
```
/guides liste                    # Voir tous les guides
/guides categorie type:debutant  # Guide pour débutants
/guides recherche mots_cles:"combat"  # Rechercher "combat"
/guides nouveautes               # Nouveautés SC 4.2
```

### 📊 Statut et diagnostics
```
/ai status        # État de l'IA et des services
/ai nouveautes    # Nouveautés Star Citizen 4.2
```

## 🎯 Exemples d'utilisation

### Pour les débutants
```
/ai conseil question:"Je viens d'acheter le jeu, que faire en premier ?"
→ Conseil IA + guides RSI + conseils SC 4.2

/guides categorie type:debutant
→ Guide officiel RSI complet pour débutants
```

### Pour le combat
```
/ai conseil question:"Comment améliorer mes compétences de combat ?" categorie:combat
→ Conseils IA + stratégies officielles RSI

/guides recherche mots_cles:"pvp combat"
→ Guides RSI spécialisés en combat
```

### Pour le commerce
```
/ai conseil question:"Routes commerciales rentables SC 4.2" categorie:commerce
→ Conseils IA + données économiques actuelles

/guides categorie type:economie
→ Guide officiel RSI du commerce
```

## 🔧 Configuration IA (Optionnelle)

### L'IA fonctionne en mode "fallback" sans configuration
Le bot utilise sa base de connaissances locale + guides RSI même sans token IA.

### Pour activer l'IA complète (gratuit)
1. **Créer un compte Hugging Face** : https://huggingface.co (gratuit)
2. **Générer un token** : https://huggingface.co/settings/tokens (rôle "read")
3. **Ajouter dans .env** : `HUGGINGFACE_TOKEN=hf_votre_token`
4. **Redémarrer le bot** : `npm restart`

## 🎉 Avantages

### Avec IA activée
- ✅ Conseils personnalisés et contextuels
- ✅ Réponses adaptées à vos questions spécifiques
- ✅ Intégration guides RSI + IA
- ✅ Cache intelligent pour performance

### Mode fallback (sans IA)
- ✅ Guides officiels RSI Spectrum complets
- ✅ Base de connaissances locale étendue
- ✅ Conseils prédéfinis Star Citizen 4.2
- ✅ Réponses instantanées

## 📈 Conseils d'utilisation

### Questions efficaces pour l'IA
- **Spécifiques** : "Comment optimiser mon Prospector pour le minage ?"
- **Avec contexte** : "Je suis débutant, quel vaisseau combat sous 2M aUEC ?"
- **Catégorisées** : Utilisez le paramètre `categorie` pour des réponses ciblées

### Navigation dans les guides
- **Commencez par** `/guides liste` pour voir tous les guides
- **Utilisez** `/guides recherche` pour trouver des sujets spécifiques
- **Consultez** `/guides nouveautes` pour les infos SC 4.2

## 🆘 Dépannage

### L'IA ne répond pas
- ✅ **Normal** : Le bot utilise sa base de connaissances (tout aussi efficace)
- ✅ **Solution** : Configurez le token Hugging Face pour l'IA complète
- ✅ **Alternative** : Utilisez `/guides` pour les guides officiels RSI

### Réponses trop génériques
- ✅ **Soyez spécifique** dans vos questions
- ✅ **Utilisez les paramètres** `niveau` et `categorie`
- ✅ **Combinez** `/ai conseil` + `/guides categorie`

### Erreurs techniques
- ✅ **Vérifiez** `/ai status` pour l'état des services
- ✅ **Redémarrez** le bot si nécessaire
- ✅ **Consultez** les logs pour plus d'infos

## 🔗 Ressources

- **Site officiel RSI** : https://robertsspaceindustries.com/spectrum/guide
- **Hugging Face** : https://huggingface.co (pour token IA gratuit)
- **Documentation complète** : README.md du projet

---

*CityZenBot v2.0.1 - Intelligence artificielle + Guides officiels RSI - Star Citizen 4.2*
