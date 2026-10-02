const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

/**
 * ==============================================================================
 * OCPR COMORES — Serveur d'Exécution Optimisé pour cPanel / CloudLinux / Passenger
 * ==============================================================================
 * Ce fichier est le point d'entrée officiel pour le gestionnaire "Setup Node.js App"
 * de cPanel (utilisant Phusion Passenger sous CloudLinux/CentOS/AlmaLinux).
 *
 * Compatible avec :
 * 1. Mode Classique (Next.js avec node_modules complets)
 * 2. Mode Standalone (.next/standalone) pour hébergement mutualisé cPanel léger
 * 3. Sockets Unix de Phusion Passenger (/tmp/passenger.xxx.sock)
 * 4. Ports TCP standard (PORT=3000, etc.)
 * ==============================================================================
 */

// 1. Forcer l'environnement en mode Production par défaut
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const dev = process.env.NODE_ENV === 'development';

// 2. Détection de Phusion Passenger (cPanel CloudLinux)
const isPassenger = typeof PhusionPassenger !== 'undefined' || !!process.env.PASSENGER_APP_ENV;
const rawPort = process.env.PORT || 3000;
const isUnixSocket = typeof rawPort === 'string' && (rawPort.startsWith('/') || rawPort.startsWith('\\\\.\\pipe'));
const nextPort = !isUnixSocket && !isNaN(Number(rawPort)) ? Number(rawPort) : 3000;
const nextHost = isUnixSocket ? 'localhost' : (process.env.HOSTNAME || '0.0.0.0');

// 3. Vérification de l'existence du build de production Next.js (.next)
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');

// Cas A : Le bundle Standalone existe (déploiement optimisé cPanel)
if (!fs.existsSync(buildIdPath) && fs.existsSync(standaloneServerPath)) {
  console.log('📦 [cPanel] Démarrage automatique via le bundle autonome .next/standalone/server.js');
  require(standaloneServerPath);
  return;
}

// Cas B : Aucun build présent dans .next (l'application n'a pas encore été compilée)
if (!fs.existsSync(buildIdPath)) {
  console.warn("⚠️ [cPanel] Aucun build de production trouvé dans '.next'.");
  console.warn("👉 Exécutez 'npm run build' dans le terminal cPanel ou téléversez le dossier .next compilé.");

  const fallbackServer = createServer((req, res) => {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Retry-After', '30');
    res.end(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>OCPR Comores — Build Requis</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; max-width: 640px; width: 100%; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; font-size: 22px; margin-top: 0; display: flex; align-items: center; gap: 10px; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    code { background: #0f172a; color: #34d399; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 14px; border: 1px solid #334155; }
    pre { background: #0f172a; color: #34d399; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 14px; overflow-x: auto; border: 1px solid #334155; }
    ol { padding-left: 20px; color: #cbd5e1; }
    li { margin-bottom: 12px; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 13px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚙️ OCPR Comores — Finalisation du Déploiement</h1>
    <p>Le serveur Node.js est démarré avec succès sur cPanel, mais le dossier de build de production (<code>.next</code>) n'est pas encore présent.</p>
    <p><strong>Pour finaliser le démarrage (choisir une option) :</strong></p>
    <ol>
      <li><strong>Option 1 (Téléversement - Recommandé) :</strong> Compressez votre dossier local <code>.next</code> en ZIP, téléversez-le dans le dossier de l'application sur cPanel et extrayez-le.</li>
      <li><strong>Option 2 (Terminal cPanel) :</strong> Ouvrez le terminal cPanel et lancez :
        <pre>npx next build</pre>
      </li>
    </ol>
    <p>Une fois les fichiers présents, cliquez sur <strong>Restart</strong> dans l'interface cPanel <em>"Setup Node.js App"</em>.</p>
    <div class="footer">Office Comorien des Produits de Rente — Serveur cPanel</div>
  </div>
</body>
</html>`);
  });

  if (typeof PhusionPassenger !== 'undefined') {
    fallbackServer.listen('passenger');
  } else {
    fallbackServer.listen(rawPort);
  }
  return;
}

// 4. Chargement de Next.js si le build .next est bien présent
let next;
try {
  next = require('next');
} catch (e) {
  console.error('❌ Impossible de charger le module "next". Vérifiez que npm install a été exécuté.', e);
  process.exit(1);
}

// 4. Initialisation de Next.js
const app = next({
  dev,
  dir: __dirname,
  hostname: nextHost,
  port: nextPort,
});

const handle = app.getRequestHandler();

// 5. Démarrage du serveur HTTP
app.prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('❌ Erreur lors du traitement de la requête :', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Erreur Interne du Serveur (OCPR Comores)');
        }
      }
    });

    // Écoute : Passenger intercepte soit 'passenger', soit le socket/port via process.env.PORT
    if (typeof PhusionPassenger !== 'undefined') {
      server.listen('passenger', () => {
        console.log('🚀 [OCPR Comores] Serveur opérationnel via Phusion Passenger (cPanel)');
        console.log(`🌿 Environnement : ${process.env.NODE_ENV}`);
      });
    } else {
      server.listen(rawPort, () => {
        console.log(`🚀 [OCPR Comores] Serveur opérationnel sur : ${rawPort}`);
        console.log(`🌿 Environnement : ${process.env.NODE_ENV}`);
      });
    }

    // 6. Gestion propre de l'arrêt (Graceful Shutdown)
    const handleShutdown = () => {
      console.log('🛑 [OCPR Comores] Arrêt du serveur en cours...');
      server.close(() => {
        console.log('✅ Serveur arrêté proprement.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  })
  .catch((err) => {
    console.error('❌ Échec critique lors du démarrage de l’application sur cPanel :', err);
    process.exit(1);
  });
