import fs from 'fs';

// Fichier de données Vercel
const DATA_FILE = '/tmp/users.json';

// Fonction pour lire les données existantes
function readUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erreur lecture fichier:', error);
    return [];
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
