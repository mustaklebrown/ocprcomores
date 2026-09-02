const fs = require('fs');
const path = require('path');

/**
 * Script de préparation post-build pour le déploiement Hostinger (Standalone Node.js).
 * Copie automatiquement les dossiers `public` et `.next/static` dans `.next/standalone`
 * afin que l'application soit 100% autonome et prête à tourner avec PM2 ou Node.js sur Hostinger.
 */

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const destParent = path.dirname(dest);
    if (!fs.existsSync(destParent)) {
      fs.mkdirSync(destParent, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(standaloneDir)) {
  console.log('📦 [Hostinger Prep] Préparation du dossier autonome .next/standalone...');

  if (fs.existsSync(publicSrc)) {
    console.log('  -> Copie des assets statiques de `public/` vers `.next/standalone/public`...');
    copyRecursiveSync(publicSrc, publicDest);
  }

  if (fs.existsSync(staticSrc)) {
    console.log('  -> Copie des bundles de `.next/static` vers `.next/standalone/.next/static`...');
    copyRecursiveSync(staticSrc, staticDest);
  }

  console.log('✅ [Hostinger Prep] Bundle autonome prêt pour le serveur Hostinger !');
} else {
  console.log('ℹ️ [Hostinger Prep] Dossier .next/standalone non trouvé (peut-être un build Vercel).');
}
