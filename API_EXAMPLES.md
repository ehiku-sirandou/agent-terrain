# Exemples d'utilisation des API

## 🔗 URLs de base

- **Développement** : `http://localhost:3001/api`
- **Production** : `https://votre-app.vercel.app/api`

## 📱 API SMS

### Envoyer un SMS
```bash
curl -X POST https://votre-app.vercel.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "77 123 45 67",
    "message": "Merci pour votre participation ! Découvrez votre cadeau surprise 🎁"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "SMS envoyé avec succès"
}
```

## 💾 API Sauvegarde Utilisateur

### Sauvegarder un utilisateur
```bash
curl -X POST https://votre-app.vercel.app/api/save-user \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "77 123 45 67",
    "nom": "Diop",
    "prenom": "Moussa",
    "email": "moussa@example.com",
    "profession": "Développeur",
    "prize": "Thé Earl Grey Premium"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur sauvegardé avec succès",
  "userId": "1703123456789"
}
```

### Récupérer tous les utilisateurs
```bash
curl https://votre-app.vercel.app/api/save-user
```

**Réponse :**
```json
{
  "success": true,
  "users": [
    {
      "id": "1703123456789",
      "telephone": "77 123 45 67",
      "nom": "Diop",
      "prenom": "Moussa",
      "email": "moussa@example.com",
      "profession": "Développeur",
      "prize": "Thé Earl Grey Premium",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

## 🏥 API Santé

### Vérifier l'état du serveur
```bash
curl https://votre-app.vercel.app/api/health
```

**Réponse :**
```json
{
  "status": "OK",
  "message": "Serveur SMS opérationnel"
}
```

## 🔄 Flux complet d'utilisation

1. **L'utilisateur saisit son numéro** → Validation automatique
2. **L'utilisateur tape dans "Prénom"** → Déclenchement automatique du SMS
3. **L'utilisateur soumet le formulaire** → Sauvegarde des données + Attribution du prix
4. **Grattage du cadeau** → Révélation du prix

## ⚠️ Codes d'erreur

- **400** : Données manquantes ou invalides
- **409** : Utilisateur déjà existant (même téléphone/email)
- **405** : Méthode HTTP non autorisée
- **500** : Erreur serveur

## 🧪 Tests avec JavaScript

```javascript
// Test SMS
const testSMS = async () => {
  const response = await fetch('/api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber: '77 123 45 67',
      message: 'Test SMS depuis l\'application'
    })
  });
  const result = await response.json();
  console.log(result);
};

// Test sauvegarde
const testSave = async () => {
  const response = await fetch('/api/save-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telephone: '77 123 45 67',
      nom: 'Test',
      prenom: 'User',
      email: 'test@example.com',
      profession: 'Testeur',
      prize: 'Cadeau Test'
    })
  });
  const result = await response.json();
  console.log(result);
};
```
