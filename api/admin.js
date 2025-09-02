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

// Handler pour Vercel - Page d'administration
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
    
    // Générer une page HTML simple pour afficher les données
    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Administration - Données Utilisateurs</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
            }
            .stats {
                display: flex;
                justify-content: space-around;
                margin-bottom: 30px;
                background: #8B5CF6;
                color: white;
                padding: 20px;
                border-radius: 8px;
            }
            .stat-item {
                text-align: center;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #8B5CF6;
                color: white;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
            .prize {
                background-color: #10B981;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.9em;
            }
            .date {
                font-size: 0.9em;
                color: #666;
            }
            .no-data {
                text-align: center;
                color: #666;
                font-style: italic;
                padding: 40px;
            }
            .refresh-btn {
                background: #8B5CF6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 20px;
            }
            .refresh-btn:hover {
                background: #7C3AED;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎁 Administration - Scratch Card</h1>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">${users.length}</div>
                    <div>Total Participants</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${users.filter(u => u.prize).length}</div>
                    <div>Prix Attribués</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${new Set(users.map(u => u.prize)).size - (users.some(u => !u.prize) ? 1 : 0)}</div>
                    <div>Types de Prix</div>
                </div>
            </div>

            <button class="refresh-btn" onclick="window.location.reload()">🔄 Actualiser</button>
            
            ${users.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom Complet</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Profession</th>
                        <th>Prix Gagné</th>
                        <th>Date Inscription</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td><strong>${user.prenom} ${user.nom}</strong></td>
                        <td>${user.telephone}</td>
                        <td>${user.email}</td>
                        <td>${user.profession}</td>
                        <td>${user.prize ? `<span class="prize">${user.prize}</span>` : '-'}</td>
                        <td class="date">${user.createdAt ? new Date(user.createdAt).toLocaleString('fr-FR') : '-'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : `
            <div class="no-data">
                <h3>Aucune donnée disponible</h3>
                <p>Les participants n'ont pas encore soumis le formulaire ou les données n'ont pas été sauvegardées.</p>
                <p><strong>Localisation du fichier:</strong> ${DATA_FILE}</p>
            </div>
            `}
        </div>
        
        <script>
            // Auto-refresh toutes les 30 secondes
            setTimeout(() => {
                window.location.reload();
            }, 30000);
        </script>
    </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}
