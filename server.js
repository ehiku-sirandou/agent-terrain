import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration SMS API
const SMS_CONFIG = {
  url: 'https://lamsms.lafricamobile.com/api',
  accountid: 'XAMLE_01',
  password: 'sihZPJrfwYVpNFt',
  sender: 'Xamle'
};

// Fonction pour envoyer un SMS
async function sendSMS(phoneNumber, message) {
  try {
    // Format du numéro : ajouter +221 si pas déjà présent
    let formattedNumber = phoneNumber.replace(/\s+/g, ''); // Supprimer les espaces
    if (!formattedNumber.startsWith('+221') && !formattedNumber.startsWith('00221')) {
      if (formattedNumber.startsWith('221')) {
        formattedNumber = '+' + formattedNumber;
      } else if (formattedNumber.startsWith('7') || formattedNumber.startsWith('3')) {
        formattedNumber = '+221' + formattedNumber;
      } else {
        formattedNumber = '+221' + formattedNumber;
      }
    }
    
    // Convertir +221 en 00221 pour l'API
    if (formattedNumber.startsWith('+221')) {
      formattedNumber = '00221' + formattedNumber.substring(4);
    }

    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<push
accountid="${SMS_CONFIG.accountid}"
password="${SMS_CONFIG.password}"
ret_id="Push_${Date.now()}"
sender="${SMS_CONFIG.sender}">
<message>
<text>${message}</text>
<to>${formattedNumber}</to>
</message>
</push>`;

    const response = await axios.post(SMS_CONFIG.url, xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Cookie': 'SIV50=e0bej601tc4g8gtpc8nv1ajud7'
      }
    });

    console.log('SMS Response:', response.data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
}

// Endpoint pour envoyer un SMS
app.post('/api/send-sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Numéro de téléphone et message requis' 
    });
  }

  const result = await sendSMS(phoneNumber, message);
  
  if (result.success) {
    res.json({ success: true, message: 'SMS envoyé avec succès' });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

// Route pour sauvegarder les utilisateurs (développement local)
app.post('/api/save-user', (req, res) => {
  const userData = req.body;
  
  // Validation basique
  if (!userData.telephone || !userData.nom || !userData.prenom || !userData.email || !userData.profession) {
    return res.status(400).json({
      success: false,
      error: 'Tous les champs sont requis'
    });
  }
  
  // Pour le développement, on simule juste la sauvegarde
  console.log('Données utilisateur reçues:', userData);
  
  const savedUser = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Utilisateur sauvegardé avec succès (mode développement)',
    userId: savedUser.id
  });
});

// Route pour récupérer les utilisateurs (développement)
app.get('/api/save-user', (req, res) => {
  res.json({
    success: true,
    users: [],
    count: 0,
    message: 'Mode développement - pas de persistance'
  });
});

// Endpoint de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur SMS opérationnel' });
});

app.listen(PORT, () => {
  console.log(`Serveur SMS démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);
});
