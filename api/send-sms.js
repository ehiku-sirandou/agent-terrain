import axios from 'axios';

// Configuration SMS API
const SMS_CONFIG = {
  url: 'https://lamsms.lafricamobile.com/api',
  accountid: 'XAMLE_01',
  password: 'sihZPJrfwYVpNFt',
  sender: 'Xamle'
};

// Fonction pour valider un numéro de téléphone sénégalais
function validateSenegalPhone(phone) {
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  const patterns = [
    /^(\+221|00221)?[73][0-9]{8}$/,
    /^221[73][0-9]{8}$/,
    /^[73][0-9]{8}$/
  ];
  return patterns.some(pattern => pattern.test(cleanPhone));
}

// Fonction pour formater un numéro de téléphone
function formatPhoneNumber(phone) {
  let cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  
  if (!cleanPhone.startsWith('+221') && !cleanPhone.startsWith('00221')) {
    if (cleanPhone.startsWith('221')) {
      cleanPhone = '+' + cleanPhone;
    } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('3')) {
      cleanPhone = '+221' + cleanPhone;
    } else {
      cleanPhone = '+221' + cleanPhone;
    }
  }
  
  if (cleanPhone.startsWith('+221')) {
    cleanPhone = '00221' + cleanPhone.substring(4);
  }
  
  return cleanPhone;
}

// Fonction pour envoyer un SMS
async function sendSMS(phoneNumber, message) {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

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

// Handler pour Vercel
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Numéro de téléphone et message requis' 
    });
  }

  if (!validateSenegalPhone(phoneNumber)) {
    return res.status(400).json({
      success: false,
      error: 'Numéro de téléphone invalide. Veuillez entrer un numéro sénégalais valide.'
    });
  }

  const result = await sendSMS(phoneNumber, message);
  
  if (result.success) {
    res.json({ success: true, message: 'SMS envoyé avec succès' });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
}
