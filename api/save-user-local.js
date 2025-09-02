// Version locale pour le développement avec server.js
import fs from 'fs';
import path from 'path';

const DATA_FILE = './users-data.json';

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

function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde fichier:', error);
    return false;
  }
}

export { readUsers, saveUsers };
