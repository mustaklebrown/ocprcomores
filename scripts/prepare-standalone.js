const fs = require('fs');
const path = require('path');

/**
 * Script de préparation post-build pour le déploiement cPanel & Production (Standalone Node.js).
 * Copie automatiquement les dossiers `public` et `.next/static` dans `.next/standalone`
 * afin que l'application soit 100% autonome et prête à tourner avec Passenger ou Node.js sur cPanel.
 */

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const htaccessSrc = path.join(rootDir, '.htaccess');
const htaccessDest = path.join(standaloneDir, '.htaccess');

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
  console.log('📦 [cPanel / Standalone Prep] Préparation du dossier autonome .next/standalone...');

  if (fs.existsSync(publicSrc)) {
    console.log('  -> Copie des assets statiques de `public/` vers `.next/standalone/public`...');
    copyRecursiveSync(publicSrc, publicDest);
  }

  if (fs.existsSync(staticSrc)) {
    console.log('  -> Copie des bundles de `.next/static` vers `.next/standalone/.next/static`...');
    copyRecursiveSync(staticSrc, staticDest);
  }

  if (fs.existsSync(htaccessSrc)) {
    console.log('  -> Copie de `.htaccess` vers `.next/standalone/.htaccess`...');
    fs.copyFileSync(htaccessSrc, htaccessDest);
  }

  // S'assurer que les dossiers d'upload existent dans standalone
  const uploadDirs = ['documents', 'images', 'videos'];
  uploadDirs.forEach((dir) => {
    const dirPath = path.join(publicDest, 'uploads', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  console.log('✅ [cPanel / Standalone Prep] Bundle autonome prêt pour cPanel ou serveur dédié !');
} else {
  console.log('ℹ️ [cPanel / Standalone Prep] Dossier .next/standalone non trouvé (peut-être un build Vercel).');
}
