// Utiliser l'API Vercel en production, localhost en développement
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface UserData {
  telephone: string;
  nom: string;
  prenom: string;
  email: string;
  profession: string;
  prize?: string;
}

export interface SaveUserResponse {
  success: boolean;
  message?: string;
  error?: string;
  userId?: string;
}

// Fonction pour sauvegarder un utilisateur
export async function saveUser(userData: UserData): Promise<SaveUserResponse> {
  try {
    const response = await fetch(`${API_BASE}/save-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return {
      success: false,
      error: 'Erreur de connexion au serveur'
    };
  }
}

// Fonction pour récupérer tous les utilisateurs (admin)
export async function getUsers(): Promise<{ success: boolean; users?: UserData[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/save-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return {
      success: false,
      error: 'Erreur de connexion au serveur'
    };
  }
}
