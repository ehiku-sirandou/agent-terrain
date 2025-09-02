import fs from 'fs';
import path from 'path';

// Pour le développement local, utiliser un fichier JSON
// En production, vous pouvez utiliser une vraie base de données
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

// Fonction pour sauvegarder les données
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde fichier:', error);
    return false;
  }
}

// Fonction pour valider les données
function validateUserData(data) {
  const required = ['telephone', 'nom', 'prenom', 'email', 'profession'];
  for (let field of required) {
    if (!data[field] || data[field].trim() === '') {
      return { valid: false, error: `Le champ ${field} est requis` };
    }
  }
  
  // Validation email basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Adresse email invalide' };
  }
  
  // Validation téléphone sénégalais
  const phoneRegex = /^(\+221|00221)?[73][0-9]{8}$/;
  const cleanPhone = data.telephone.replace(/[\s\-\(\)\.]/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Numéro de téléphone sénégalais invalide' };
  }
  
  return { valid: true };
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

  if (req.method === 'POST') {
    // Sauvegarder un nouvel utilisateur
    const userData = req.body;
    
    // Validation
    const validation = validateUserData(userData);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: validation.error 
      });
    }
    
    // Lire les utilisateurs existants
    const users = readUsers();
    
    // Vérifier si l'utilisateur existe déjà (par téléphone ou email)
    const existingUser = users.find(user => 
      user.telephone === userData.telephone || user.email === userData.email
    );
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Un utilisateur avec ce téléphone ou email existe déjà'
      });
    }
    
    // Ajouter les métadonnées
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      prize: userData.prize || null
    };
    
    users.push(newUser);
    
    // Sauvegarder
    if (saveUsers(users)) {
      res.json({ 
        success: true, 
        message: 'Utilisateur sauvegardé avec succès',
        userId: newUser.id 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la sauvegarde' 
      });
    }
    
  } else if (req.method === 'GET') {
    // Récupérer tous les utilisateurs (pour admin)
    const users = readUsers();
    res.json({ 
      success: true, 
      users: users,
      count: users.length 
    });
    
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}
