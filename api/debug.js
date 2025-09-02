// API de debug pour comprendre le problème de persistance

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_REGION: process.env.VERCEL_REGION
      },
      memory: {
        globalUsersDB: global.usersDB || 'undefined',
        globalUsersDBLength: global.usersDB ? global.usersDB.length : 0
      },
      filesystem: {
        tmpExists: require('fs').existsSync('/tmp'),
        tmpWritable: (() => {
          try {
            require('fs').writeFileSync('/tmp/test.txt', 'test');
            require('fs').unlinkSync('/tmp/test.txt');
            return true;
          } catch (e) {
            return false;
          }
        })(),
        usersFileExists: require('fs').existsSync('/tmp/users.json')
      }
    };

    res.json(debugInfo);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
