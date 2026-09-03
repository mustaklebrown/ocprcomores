# 🚀 Guide de Déploiement cPanel (Setup Node.js App) — OCPR Comores

Ce guide explique étape par étape comment déployer l'application **OCPR Comores (Next.js 16 + MariaDB / MySQL + Prisma)** sur n'importe quel hébergement web équipé de **cPanel** (CloudLinux / Phusion Passenger).

---

## 📋 Prérequis sur cPanel

1. Un compte d'hébergement cPanel avec la fonctionnalité **"Setup Node.js App"** (Node.js Selector).
2. Une base de données **MySQL / MariaDB** créée dans **Bases de données MySQL (MySQL Databases)** de cPanel.
3. Node.js version **18.x, 20.x ou 22.x**.

---

## 🛠️ Étape 1 : Créer la Base de Données MySQL sur cPanel

1. Rendez-vous sur votre tableau de bord cPanel > **Bases de données MySQL**.
2. Créez une nouvelle base de données (ex: `votrecompte_ocpr_db`).
3. Créez un nouvel utilisateur MySQL avec un mot de passe fort (ex: `votrecompte_admin`).
4. Associez l'utilisateur à la base de données et accordez **TOUS LES PRIVILÈGES** (*ALL PRIVILEGES*).

---

## 📁 Étape 2 : Transférer les Fichiers du Projet sur cPanel

1. Compressez les fichiers du projet en `.zip` (excluez `node_modules`, `.git` et `.next`).
2. Dans le **Gestionnaire de fichiers** (*File Manager*) de cPanel, téléversez le zip dans le dossier racine de votre application (ex: `/home/votrecompte/ocprcomores` ou `public_html`).
3. Extrayez l'archive zip.

---

## ⚙️ Étape 3 : Créer l'Application Node.js dans cPanel

1. Dans cPanel, cliquez sur **"Setup Node.js App"** (ou **Node.js Selector**).
2. Cliquez sur **"Create Application"**.
3. Remplissez les champs :
   - **Node.js version** : Sélectionnez `20.x` ou `22.x` (ou `18.x` minimum).
   - **Application mode** : `Production`.
   - **Application root** : Le dossier de votre projet (ex: `ocprcomores`).
   - **Application URL** : Votre nom de domaine ou sous-domaine (ex: `ocprcomores.com` ou `portail.ocprcomores.com`).
   - **Application startup file** : `server.js` (le fichier créé à la racine).
4. Cliquez sur **"Create"**.

---

## 🔐 Étape 4 : Configurer les Variables d'Environnement (.env)

Dans le formulaire de l'application Node.js cPanel (section **Environment variables**) OU dans un fichier `.env` à la racine de votre dossier :

```env
# 1. Base de données MySQL cPanel
DATABASE_URL="mysql://votrecompte_admin:VotreMotDePasseFort2026!@localhost:3306/votrecompte_ocpr_db"
DB_POOL_SIZE=10
DB_SSL=false

# 2. Sécurité JWT Admin (Clé secrète de 32+ caractères)
JWT_SECRET="votre_cle_secrete_ultra_securisee_pour_ocpr_comores_2026"

# 3. Super Administrateur
ADMIN_DEFAULT_EMAIL="admin@ocprcomores.com"
ADMIN_DEFAULT_NAME="Direction OCPR Comores"
ADMIN_DEFAULT_PASSWORD="VotreMotDePasseAdmin2026!"

# 4. Paramètres Serveur
NODE_ENV="production"
PORT=3000

# 5. Service Emails SMTP (Webmail cPanel)
SMTP_HOST="mail.votre-domaine.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="info@votre-domaine.com"
SMTP_PASS="VotreMotDePasseEmail2026!"
CONTACT_RECEIVER_EMAIL="info@votre-domaine.com"
SMTP_FROM='"Portail OCPR Comores" <info@votre-domaine.com>'
```

---

## 📦 Étape 5 : Installer les Dépendances & Initialiser la BDD

1. En haut de la page Node.js dans cPanel, copiez la commande pour entrer dans l'environnement virtuel (ex: `source /home/votrecompte/nodevenv/ocprcomores/20/bin/activate && cd /home/votrecompte/ocprcomores`).
2. Ouvrez le **Terminal cPanel** et collez cette commande.
3. Installez les packages :
   ```bash
   npm install
   ```
4. Initialisez la base de données et les tables Prisma :
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Compilez le projet Next.js :
   ```bash
   npm run build
   ```

---

## 🔄 Étape 6 : Démarrer l'Application

1. Dans **Setup Node.js App**, cliquez sur **"Restart"** pour redémarrer l'application.
2. Votre site est désormais en ligne et 100% opérationnel !
