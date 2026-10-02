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

// 3. Vérification du mode Standalone si Next.js n'est pas dans les dépendances racine
let next;
try {
  next = require('next');
} catch (e) {
  const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(standaloneServer)) {
    console.log('📦 [cPanel] Démarrage automatique via le bundle autonome .next/standalone/server.js');
    require(standaloneServer);
    return;
  }
  console.error('❌ Impossible de charger le module "next" ou le bundle standalone.', e);
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
