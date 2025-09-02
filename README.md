# Formulaire avec SMS automatique et Cadeau

Une application React moderne avec envoi automatique de SMS et système de grattage pour révéler des cadeaux.

## Fonctionnalités

- 📱 **Validation automatique** du numéro de téléphone sénégalais
- 📨 **Envoi automatique de SMS** dès que l'utilisateur commence à remplir le deuxième champ
- 🎁 **Système de grattage** pour révéler le cadeau
- ✨ **Interface moderne** avec design responsive
- 🔄 **Feedback visuel** en temps réel

## Installation

### 1. Installer les dépendances du frontend
```bash
npm install
```

### 2. Installer les dépendances du serveur SMS
```bash
npm run server:install
```

## Lancement de l'application

### Option 1: Lancement complet (Frontend + Backend)
```bash
npm run dev:full
```

### Option 2: Lancement séparé

**Terminal 1 - Serveur SMS:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Configuration SMS

Le serveur SMS utilise l'API LAM SMS avec les paramètres suivants :
- **Account ID**: XAMLE_01
- **Password**: sihZPJrfwYVpNFt  
- **Sender**: Xamle
- **URL**: https://lamsms.lafricamobile.com/api

## Fonctionnement

1. **Saisie du numéro** : L'utilisateur entre son numéro de téléphone sénégalais
2. **Validation automatique** : Le système valide le format (77/78/70/75/76/33 + 7 chiffres)
3. **Déclenchement SMS** : Dès que l'utilisateur commence à taper dans le champ "Prénom", un SMS de confirmation est envoyé automatiquement
4. **Finalisation** : L'utilisateur complète le formulaire
5. **Cadeau** : Révélation du cadeau via le système de grattage

## Formats de numéros supportés

- `77 123 45 67` (format local)
- `+221 77 123 45 67` (format international)
- `00221 77 123 45 67` (format international alternatif)
- `221 77 123 45 67` (format sans +)

## Structure du projet

```
src/
├── components/
│   ├── Form.tsx          # Formulaire principal avec SMS
│   └── ScratchCard.tsx   # Carte à gratter
├── services/
│   └── smsService.ts     # Service d'envoi SMS
└── App.tsx               # Composant principal

server.js                 # Serveur Express pour SMS
```

## Technologies utilisées

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Axios
- **SMS**: API LAM SMS (Lafricamobile)
- **Icons**: Lucide React
