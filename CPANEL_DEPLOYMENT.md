# 🚀 Guide Complet de Déploiement cPanel — OCPR Comores

Ce guide décrit la procédure pas-à-pas pour déployer et exécuter l'application **OCPR Comores (Next.js 16 + Prisma 7 + MySQL/MariaDB)** sur un hébergement **cPanel** (utilisant CloudLinux et Phusion Passenger via l'outil **"Setup Node.js App"**).

---

## 📋 1. Prérequis sur cPanel

1. **Version Node.js** : Node.js **18.x**, **20.x** ou **22.x** (disponible dans *Setup Node.js App*).
2. **Base de données** : MySQL ou MariaDB (disponible dans *Bases de données MySQL*).
3. **Accès au Terminal SSH ou au Terminal Web cPanel** (recommandé).

---

## 🗄️ 2. Création de la Base de Données MySQL dans cPanel

1. Connectez-vous à votre **cPanel**.
2. Allez dans **Bases de données MySQL** (ou *Assistant de base de données MySQL*).
3. Créez une nouvelle base de données : par exemple `votreuser_ocprdb`.
4. Créez un nouvel utilisateur de base de données : par exemple `votreuser_ocpruser` avec un mot de passe fort.
5. Associez l'utilisateur à la base de données et cochez **TOUS LES PRIVILÈGES** (*ALL PRIVILEGES*).
6. Notez précieusement :
   - Nom de la base : `votreuser_ocprdb`
   - Utilisateur : `votreuser_ocpruser`
   - Mot de passe : `votremotdepasse`
   - Hôte : `127.0.0.1` ou `localhost`

---

## ⚙️ 3. Configuration dans "Setup Node.js App"

1. Dans cPanel, recherchez et ouvrez **Setup Node.js App** (ou *Configuration de l'application Node.js*).
2. Cliquez sur le bouton **Create Application** (Créer une application).
3. Remplissez les champs comme suit :
   - **Node.js version** : Sélectionnez `20.x` ou `22.x` (ou au minimum `18.x`).
   - **Application mode** : `Production`
   - **Application root** : Le chemin vers votre dossier d'application (ex: `ocpr` ou `app_ocpr`).
   - **Application URL** : Choisissez votre nom de domaine ou sous-domaine (ex: `ocprcomores.com`).
   - **Application startup file** : `server.js` (déjà inclus et optimisé pour Passenger).
4. Cliquez sur **Create** en haut à droite.
5. Une fois créée, cPanel affiche en haut une commande pour entrer dans l'environnement virtuel Node.js, par exemple :
   ```bash
   source /home/votreuser/nodevenv/ocpr/20/bin/activate && cd /home/votreuser/ocpr
   ```

---

## 📁 4. Méthodes de Déploiement des Fichiers

### Méthode A : Déploiement Standalone (Recommandé pour hébergement mutualisé)
*Idéal si votre serveur cPanel a une limite de mémoire RAM (ex: 1 Go ou 2 Go) empêchant de faire le build lourd directement sur le serveur.*

1. **Sur votre machine locale :**
   ```bash
   # 1. Générer le client Prisma et compiler
   bun run build
   # (ou npm run build)
   ```
2. Un dossier `.next/standalone` est créé et automatiquement préparé par le script `scripts/prepare-standalone.js` (incluant les assets `public/`, `.next/static/` et `.htaccess`).
3. Compressez le contenu du projet ou de `.next/standalone` en ZIP.
4. Téléversez et extrayez le ZIP dans votre **Application root** sur cPanel.
5. Déposez votre fichier `.env` à la racine de l'application.

---

### Méthode B : Déploiement direct avec Git / Terminal cPanel
1. Dans cPanel, ouvrez **Git Version Control** ou utilisez le **Terminal cPanel**.
2. Clonez le dépôt dans votre dossier d'application :
   ```bash
   git clone https://github.com/megaecom26/ocprcomores.git /home/votreuser/ocpr
   ```
3. Activez l'environnement virtuel cPanel :
   ```bash
   source /home/votreuser/nodevenv/ocpr/20/bin/activate && cd /home/votreuser/ocpr
   ```
4. Installez les dépendances :
   ```bash
   npm install --production=false
   ```
5. Configurez le fichier `.env` (voir section 5).
6. Lancez la migration de la base et compilez :
   ```bash
   npx prisma db push
   npm run build
   ```

---

## 🔑 5. Variables d'Environnement (.env)

Créez un fichier `.env` à la racine de votre application dans cPanel (via le *Gestionnaire de fichiers* ou l'éditeur cPanel) :

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# URL de votre site
NEXT_PUBLIC_APP_URL=https://ocprcomores.com

# Clé secrète JWT obligatoire (générée aléatoirement)
JWT_SECRET=27075e9f42b29919006052e680c8037f61d442cf7532a43e4a8bc499c5b839cb

# Connexion MySQL cPanel
DATABASE_URL="mysql://votreuser_ocpruser:votremotdepasse@127.0.0.1:3306/votreuser_ocprdb"

# (Optionnel si socket Unix au lieu de TCP)
# DB_SOCKET=/var/lib/mysql/mysql.sock

# Configuration Email SMTP (cPanel Webmail)
SMTP_HOST=mail.ocprcomores.com
SMTP_PORT=465
SMTP_USER=contact@ocprcomores.com
SMTP_PASS=votremotdepasse_email
SMTP_FROM="OCPR Comores <contact@ocprcomores.com>"
```

> **Sécurité** : Le fichier `.htaccess` fourni à la racine bloque automatiquement tout accès web direct aux fichiers `.env`, `.git` et `prisma/`.

---

## 🚀 6. Démarrage et Redémarrage

1. Dans **Setup Node.js App** :
   - Cliquez sur **Restart** (Redémarrer).
2. Pour forcer un redémarrage instantané via le Terminal ou FTP sans passer par l'interface cPanel :
   ```bash
   mkdir -p tmp && touch tmp/restart.txt
   ```
   *(Phusion Passenger détecte la modification de `tmp/restart.txt` et recharge automatiquement l'application).*

---

## 🛡️ 7. Optimisations Intégrées Spécial cPanel

- **Fichier `server.js`** : Détecte automatiquement l'environnement `PhusionPassenger` et ses sockets Unix (`/tmp/passenger.xxx.sock`) sans aucun conflit de port.
- **Fichier `.htaccess` (Racine)** :
  - Active la compression **GZIP/Deflate** pour une vitesse de chargement maximale.
  - Active le cache navigateur longue durée (1 an) pour les assets statiques et images (`_next/static`).
  - Bloque le téléchargement direct des fichiers de configuration et répertoires de code.
- **Fichier `public/uploads/.htaccess`** :
  - Empêche strictement l'exécution de tout script (PHP, CGI, Python, shell) dans le répertoire des fichiers téléversés, éliminant tout risque de faille RCE par téléversement.
- **Support Prisma 7 / MariaDB** :
  - Prise en charge du pool de connexion MariaDB optimisé pour mutualisé.
  - Support natif de la connexion par Socket Unix MySQL en cas de restriction TCP sur le serveur cPanel.

---

## ❓ 8. Dépannage (Troubleshooting)

### Erreur `503 Service Unavailable`
- Ouvrez le journal des erreurs dans cPanel (*Métriques > Erreurs*) ou visualisez le fichier de log de l'application (généralement dans `/home/votreuser/logs/` ou affiché dans l'interface *Setup Node.js App*).
- Vérifiez que `server.js` est bien sélectionné comme **Application startup file**.
- Assurez-vous que le build a bien été effectué (`.next` doit être présent).

### Erreur `EBADENGINE` ou échec de `prisma generate` lors de `npm install`
- **Cause** : Prisma 7 CLI nécessite **Node.js >= 22.0.0**. Sur cPanel configuré avec Node 20, le script `prisma generate` échouait lors de l'installation des paquets.
- **Résolution** :
  1. Le script `postinstall` a été retiré de `package.json` pour que `npm install` réussisse sans encombre.
  2. Le fichier `.npmrc` ignore les alertes strictes de versions (`engine-strict=false`).
  3. Si vous avez accès à **Node.js 22.x** dans cPanel ("Setup Node.js App"), passez l'application sur **Node 22**.
  4. Si vous êtes sur Node 20, utilisez le mode **Standalone** (`bun run build` en local puis téléversement du dossier `.next/standalone`), ce qui évite toute compilation lourde ou exécution de Prisma CLI sur le serveur.

### Erreur de connexion `DATABASE_URL` (ECONNREFUSED)
- Si `127.0.0.1:3306` est refusé, essayez d'utiliser le socket Unix MySQL :
  ```env
  DATABASE_URL="mysql://votreuser_ocpruser:votremotdepasse@localhost/votreuser_ocprdb?socket=/var/lib/mysql/mysql.sock"
  ```
- Vérifiez dans cPanel que l'utilisateur MySQL a bien reçu **tous les privilèges** sur la base.

### Problème de permissions de fichiers
- Dossiers : `chmod 755`
- Fichiers : `chmod 644`
- Le dossier `public/uploads` doit être accessible en écriture par le processus Node.js (`chmod 775` ou `chmod 755` selon la configuration cPanel).
