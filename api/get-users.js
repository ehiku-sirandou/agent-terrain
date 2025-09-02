import { getUsers } from './users-db.js';

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
    const users = getUsers();
    
    res.json({ 
      success: true, 
      users: users,
      count: users.length,
      location: 'distributed-storage',
      timestamp: new Date().toISOString()
    });
    
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}
