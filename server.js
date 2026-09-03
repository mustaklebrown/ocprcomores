const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

/**
 * ==============================================================================
 * OCPR COMORES — Serveur d'Exécution de Production pour cPanel / CloudLinux
 * ==============================================================================
 * Ce fichier est le point d'entrée officiel pour le gestionnaire "Setup Node.js App"
 * (Phusion Passenger / cPanel).
 *
 * Configuration cPanel recommandée :
 * - Node.js Version      : 18.x, 20.x ou 22.x
 * - Application Mode     : Production
 * - Application Root     : /home/votre_utilisateur/votre_dossier
 * - Application Startup  : server.js
 * ==============================================================================
 */

// 1. Forcer l'environnement en mode Production par défaut
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const dev = process.env.NODE_ENV === 'development';

// 2. Définition du Port et du Hostname (Passenger transmet process.env.PORT automatiquement)
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// 3. Initialisation de l'application Next.js
const app = next({
  dev,
  dir: __dirname,
  hostname,
  port: typeof port === 'number' ? port : parseInt(port, 10) || 3000,
});

const handle = app.getRequestHandler();

// 4. Démarrage du serveur HTTP
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

    // Écoute sur le port ou la socket Unix fournie par Phusion Passenger
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`🚀 [OCPR Comores] Serveur opérationnel sur cPanel / Passenger (Port/Socket: ${port})`);
      console.log(`🌿 Environnement : ${process.env.NODE_ENV}`);
    });

    // 5. Gestion de l'arrêt propre (Graceful Shutdown)
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
    console.error('❌ Échec critique lors du démarrage de l’application Next.js sur cPanel :', err);
    process.exit(1);
  });
