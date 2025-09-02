// Système de base de données simple pour Vercel
// Utilise une approche de stockage distribuée avec fallback

let usersCache = [];
let lastSync = 0;
const CACHE_DURATION = 5000; // 5 secondes

// Fonction pour obtenir une clé unique pour cette instance
function getInstanceKey() {
  return `users_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Simuler une base de données distribuée simple
const STORAGE_KEY = 'scratch_card_users';

// Fonctions de stockage
export function saveUsers(users) {
  try {
    usersCache = [...users];
    lastSync = Date.now();
    
    // Essayer de sauvegarder dans différents endroits
    const dataToStore = {
      users,
      timestamp: Date.now(),
      instance: getInstanceKey()
    };
    
    // 1. Variable globale
    global.scratchCardUsers = dataToStore;
    
    // 2. Fichier temporaire
    try {
      const fs = require('fs');
      const path = '/tmp/scratch_users.json';
      fs.writeFileSync(path, JSON.stringify(dataToStore, null, 2));
    } catch (e) {
      console.warn('Cannot write to file:', e.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

export function getUsers() {
  try {
    // Vérifier le cache en mémoire d'abord
    if (usersCache.length > 0 && (Date.now() - lastSync) < CACHE_DURATION) {
      return usersCache;
    }
    
    // Essayer de récupérer depuis différentes sources
    let data = null;
    
    // 1. Variable globale
    if (global.scratchCardUsers) {
      data = global.scratchCardUsers;
    }
    
    // 2. Fichier temporaire
    if (!data) {
      try {
        const fs = require('fs');
        const path = '/tmp/scratch_users.json';
        if (fs.existsSync(path)) {
          const fileData = fs.readFileSync(path, 'utf8');
          data = JSON.parse(fileData);
        }
      } catch (e) {
        console.warn('Cannot read from file:', e.message);
      }
    }
    
    if (data && data.users) {
      usersCache = data.users;
      lastSync = Date.now();
      return data.users;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting users:', error);
    return usersCache || [];
  }
}

export function addUser(userData) {
  try {
    const users = getUsers();
    const newUser = {
      ...userData,
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, error: error.message };
  }
}
