# Guide de déploiement sur Vercel

## 🚀 Déploiement automatique

### 1. Préparation du projet

Le projet est déjà configuré pour Vercel avec :
- ✅ API serverless dans `/api/`
- ✅ Configuration `vercel.json`
- ✅ Scripts de build configurés
- ✅ CORS configuré pour la production

### 2. Déploiement sur Vercel

#### Option A: Via GitHub (Recommandé)

1. **Créer un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Formulaire SMS avec sauvegarde"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
   git push -u origin main
   ```

2. **Connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter avec GitHub
   - Cliquer "New Project"
   - Importer le repository
   - Vercel détectera automatiquement la configuration

#### Option B: Via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter et déployer**
   ```bash
   vercel login
   vercel --prod
   ```

### 3. Configuration post-déploiement

Après le déploiement, votre application sera disponible sur :
- Frontend : `https://votre-app.vercel.app`
- API SMS : `https://votre-app.vercel.app/api/send-sms`
- API Sauvegarde : `https://votre-app.vercel.app/api/save-user`

## 📊 Fonctionnalités déployées

### API Endpoints

#### 1. `/api/send-sms` (POST)
Envoie un SMS automatiquement
```json
{
  "phoneNumber": "77 123 45 67",
  "message": "Votre message"
}
```

#### 2. `/api/save-user` (POST)
Sauvegarde les données utilisateur
```json
{
  "telephone": "77 123 45 67",
  "nom": "Diop",
  "prenom": "Moussa",
  "email": "moussa@example.com",
  "profession": "Développeur",
  "prize": "Thé Earl Grey Premium"
}
```

#### 3. `/api/save-user` (GET)
Récupère tous les utilisateurs (admin)

### Flux complet

1. **Saisie téléphone** → Validation automatique
2. **Début prénom** → SMS envoyé automatiquement
3. **Soumission formulaire** → Données sauvegardées + Prix attribué
4. **Grattage** → Révélation du cadeau

## 🔧 Variables d'environnement

Aucune variable d'environnement requise, tout est configuré dans le code.

## 📱 Test en production

Une fois déployé, testez :
1. Saisir un numéro sénégalais valide (77 123 45 67)
2. Commencer à taper le prénom
3. Vérifier la réception du SMS
4. Compléter et soumettre le formulaire
5. Vérifier que les données sont sauvegardées

## 🛠 Maintenance

### Voir les logs
```bash
vercel logs
```

### Redéployer
```bash
vercel --prod
```

### Voir les données sauvegardées
Faire un GET sur `https://votre-app.vercel.app/api/save-user`

## 🔒 Sécurité

- CORS configuré pour toutes les origines (à restreindre si nécessaire)
- Validation des données côté serveur
- Pas de données sensibles exposées
- Stockage temporaire en `/tmp` sur Vercel (données perdues au redémarrage)
