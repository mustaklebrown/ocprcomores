# 🚀 Guide Complet de Déploiement Hostinger & MySQL — OCPR Comores

Guide complet et optimisé pour le déploiement en production du site **OCPR Comores** (**Next.js 16**, **Prisma ORM**, **MySQL / MariaDB**) sur l'infrastructure **Hostinger** (Hébergement Web / Cloud Node.js hPanel ou VPS Linux KVM).

---

## 📑 Sommaire
1. [Architecture & Optimisations Hostinger](#-architecture--optimisations-hostinger)
2. [Option A : Déploiement sur Hébergement Web / Cloud Hostinger (hPanel)](#-option-a--déploiement-sur-hébergement-web--cloud-hostinger-hpanel)
3. [Option B : Déploiement sur Hostinger VPS Linux (Ubuntu / Debian)](#-option-b--déploiement-sur-hostinger-vps-linux-ubuntu--debian)
4. [Configuration MySQL & Migration des Tables](#-configuration-mysql--migration-des-tables)
5. [Maintenance, Sauvegardes & Dépannage](#-maintenance-sauvegardes--dépannage)

---

## ⚡ Architecture & Optimisations Hostinger

Le projet a été spécialement configuré pour les particularités des serveurs Hostinger :
- **Mode Standalone Ultra-léger** : Next.js génère `.next/standalone`, minimisant la consommation de RAM et d'espace disque.
- **Pool de Connexions MySQL Adaptatif** (`lib/db.ts`) :
  - Gestion des timeouts d'inactivité (`idleTimeout: 60000`) pour éviter les erreurs `ECONNRESET` et `ER_SOCKET_UNEXPECTED_CLOSE` fréquentes sur les serveurs MySQL mutualisés.
  - Encodage complet des caractères `utf8mb4` pour supporter les accents français et emojis.
  - Décodage sécurisé des caractères spéciaux dans les mots de passe.
  - Support natif du SSL MySQL (`DB_SSL=true`).
- **Compression & Sécurité Serveur** :
  - `compress: true` et masquage du header `X-Powered-By`.
  - En-têtes HTTP de sécurité intégrés (HSTS, CSP, X-Frame-Options, Permissions-Policy).
- **Script Automatisé d'Assets** : Le script `scripts/prepare-standalone.js` rassemble automatiquement les assets statiques (`public/` et `.next/static/`) dans le build prêt à l'emploi.

---

## 🗄️ Configuration de la Base MySQL sur Hostinger

### 1. Créer la base de données sur Hostinger (hPanel)
1. Rendez-vous sur votre panneau **Hostinger hPanel** > **Bases de données** > **Gestion des bases de données MySQL**.
2. Créez une nouvelle base :
   - **Nom de la base** : `ocpr_db` (Hostinger va préfixer, ex: `u123456789_ocpr_db`).
   - **Nom d'utilisateur** : `ocpr_admin` (ex: `u123456789_ocpr_admin`).
   - **Mot de passe** : Générez un mot de passe fort (ex: `OcprSecure2026!#Host`).
3. Notez ces informations pour votre fichier `.env`.

---

## 🌐 Option A : Déploiement sur Hébergement Web / Cloud Hostinger (hPanel)

Pour les forfaits **Cloud Startup/Professional** ou hébergements avec l'outil **Node.js** activé :

### Étape 1 : Configurer l'application Node.js dans hPanel
1. Allez dans **hPanel** > **Avancé** / **Sites web** > **Node.js**.
2. Créez une application :
   - **Version Node.js** : `20.x` ou `22.x` (LTS recommandée).
   - **Mode** : `Production`.
   - **Racine de l'application** : `/public_html` (ou sous-dossier de votre domaine).
   - **Fichier de démarrage** : `.next/standalone/server.js` (ou `server.js`).

### Étape 2 : Déposer les fichiers et variables d'environnement
1. Transférez les fichiers de votre projet via Git ou le Gestionnaire de fichiers Hostinger.
2. Créez le fichier `.env` à la racine :
   ```env
   DATABASE_URL="mysql://u123456789_ocpr_admin:OcprSecure2026!#Host@localhost:3306/u123456789_ocpr_db"
   DB_POOL_SIZE=5
   JWT_SECRET="votre_cle_jwt_tres_longue_et_aleatoire_2026"
   ADMIN_DEFAULT_PASSWORD="Admin@OCPR2026!"
   NODE_ENV="production"
   PORT=3000
   ```

### Étape 3 : Installer & Compiler via le terminal SSH hPanel
Connectez-vous en SSH à votre compte Hostinger :
```bash
# 1. Accéder au répertoire du site
cd ~/public_html

# 2. Installer les dépendances
npm install

# 3. Créer la structure des tables MySQL
npx prisma db push

# 4. Injecter les données initiales (Admin, Produits de rente, Actualités)
npm run db:seed

# 5. Compiler pour la production
npm run build
```

### Étape 4 : Redémarrer l'application
Dans hPanel, cliquez sur le bouton **"Redémarrer l'application"** (Restart Application).

---

## 🖥️ Option B : Déploiement sur Hostinger VPS Linux (Ubuntu / Debian)

C'est la solution recommandée pour des performances maximales et un contrôle total.

### Étape 1 : Préparation du VPS
Connectez-vous en SSH à votre VPS Hostinger :
```bash
sudo apt update && sudo apt upgrade -y

# 1. Installer Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx git mysql-server

# 2. Installer PM2 globalement
sudo npm install -g pm2
```

### Étape 2 : Configuration de MySQL sur le VPS
```bash
sudo mysql -u root

# Dans la console MySQL :
CREATE DATABASE ocpr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ocpr_user'@'localhost' IDENTIFIED BY 'VotreMotDePasseTresSecurise2026!';
GRANT ALL PRIVILEGES ON ocpr_db.* TO 'ocpr_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Étape 3 : Cloner et Configurer le Projet
```bash
# Cloner le projet dans /var/www/
sudo mkdir -p /var/www/ocpr-comores
sudo chown -R $USER:$USER /var/www/ocpr-comores
cd /var/www/ocpr-comores

git clone <URL_DE_VOTRE_DEPOT_GIT> .

# Créer le fichier .env
nano .env
```

Contenu du `.env` :
```env
DATABASE_URL="mysql://ocpr_user:VotreMotDePasseTresSecurise2026!@127.0.0.1:3306/ocpr_db"
DB_POOL_SIZE=15
DB_SSL=false
JWT_SECRET="generer_cle_secrete_aleatoire_de_64_caracteres"
ADMIN_DEFAULT_PASSWORD="Admin@OCPR2026!"
NODE_ENV="production"
PORT=3000
```

### Étape 4 : Déploiement & Initialisation de la Base de Données
```bash
# Installer les dépendances
npm install

# Appliquer le schéma Prisma sur MySQL
npx prisma db push

# Initialiser les données de départ (Super Admin, Filières, Documents)
npm run db:seed

# Compiler le projet avec Next.js Standalone
npm run build
```

### Étape 5 : Lancement avec PM2 (Cluster Mode)
Le projet inclut le fichier `ecosystem.config.js` préconfiguré :
```bash
# Lancer l'application en mode cluster
pm2 start ecosystem.config.js --env production

# Configurer le démarrage automatique au boot du serveur
pm2 save
pm2 startup
```

### Étape 6 : Configuration Nginx & SSL HTTPS (Certbot)
Créez le fichier `/etc/nginx/sites-available/ocprcomores.conf` :
```bash
sudo nano /etc/nginx/sites-available/ocprcomores.conf
```

Ajoutez la configuration :
```nginx
server {
    server_name ocprcomores.com www.ocprcomores.com;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

Activez le site et le certificat SSL gratuit :
```bash
sudo ln -s /etc/nginx/sites-available/ocprcomores.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Activer le certificat SSL Let's Encrypt automatique
sudo certbot --nginx -d ocprcomores.com -d www.ocprcomores.com
```

---

## 🛠️ Maintenance & Dépannage Hostinger MySQL

### Commandes utiles en production
| Action | Commande |
| :--- | :--- |
| **Voir les logs de l'application** | `pm2 logs ocpr-comores` |
| **Redémarrer sans coupure** | `pm2 reload ocpr-comores` |
| **Mettre à jour le code** | `git pull && npm install && npm run build && pm2 reload ocpr-comores` |
| **Synchroniser le schéma DB** | `npx prisma db push` |
| **Sauvegarder la base MySQL** | `mysqldump -u ocpr_user -p ocpr_db > backup_$(date +%F).sql` |

### Problèmes fréquents résolus :
1. **Erreur `ECONNRESET` ou `Connection Lost` sur MySQL Hostinger :**
   - Résolu grâce au pool avec `idleTimeout: 60000` et `acquireTimeout: 30000` configuré dans `lib/db.ts`.
2. **Caractères spéciaux dans le mot de passe MySQL :**
   - Résolu automatiquement grâce au `decodeURIComponent` intégré dans notre client Prisma.
3. **Images statiques manquantes en mode Standalone :**
   - Résolu grâce à `scripts/prepare-standalone.js` exécuté automatiquement à chaque `npm run build`.
