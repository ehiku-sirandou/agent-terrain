import fs from 'fs';

// Base de données en mémoire partagée avec save-user.js
global.usersDB = global.usersDB || [];

// Fichier de données Vercel
const DATA_FILE = '/tmp/users.json';

// Fonction pour lire les données existantes
function readUsers() {
  try {
    // D'abord essayer de lire le fichier
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const fileUsers = JSON.parse(data);
      // Synchroniser avec la mémoire
      global.usersDB = fileUsers;
      return fileUsers;
    }
    // Sinon utiliser les données en mémoire
    return global.usersDB || [];
  } catch (error) {
    console.error('Erreur lecture fichier, utilisation mémoire:', error);
    return global.usersDB || [];
  }
}

// Handler pour Vercel - API simple pour récupérer les utilisateurs
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const users = readUsers();
    
    res.json({ 
      success: true, 
      users: users,
      count: users.length,
      location: DATA_FILE,
      timestamp: new Date().toISOString()
    });
    
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}
