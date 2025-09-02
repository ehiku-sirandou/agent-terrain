// Utiliser l'API Vercel en production, localhost en développement
const SMS_API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface SMSResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Fonction pour valider un numéro de téléphone sénégalais
export function validateSenegalPhone(phone: string): boolean {
  // Supprimer tous les espaces et caractères spéciaux
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Patterns pour les numéros sénégalais
  const patterns = [
    /^(\+221|00221)?[73][0-9]{8}$/, // Format standard avec 7 ou 3 comme premier chiffre
    /^221[73][0-9]{8}$/, // Sans + mais avec 221
    /^[73][0-9]{8}$/ // Format local sans indicatif
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
}

// Fonction pour formater un numéro de téléphone
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Si c'est déjà au bon format, retourner tel quel
  if (cleanPhone.startsWith('+221') || cleanPhone.startsWith('00221')) {
    return cleanPhone;
  }
  
  // Si c'est un numéro local (commence par 7 ou 3)
  if (/^[73][0-9]{8}$/.test(cleanPhone)) {
    return `+221${cleanPhone}`;
  }
  
  // Si c'est avec 221 mais sans +
  if (cleanPhone.startsWith('221') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  }
  
  return cleanPhone;
}

// Fonction pour envoyer un SMS
export async function sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
  try {
    if (!validateSenegalPhone(phoneNumber)) {
      return {
        success: false,
        error: 'Numéro de téléphone invalide. Veuillez entrer un numéro sénégalais valide.'
      };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const response = await fetch(`${SMS_API_BASE}/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: formattedPhone,
        message: message
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error);
    return {
      success: false,
      error: 'Erreur de connexion au serveur SMS'
    };
  }
}

// Message par défaut à envoyer
export const DEFAULT_SMS_MESSAGE = "Merci de télécharger l'app Xamle via le lien https://blog.me-qr.com/page/the-top-video-game-soundtracks-of-all-time-music-that-stays-with-you";
