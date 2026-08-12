# 🚀 Guide de Déploiement Hostinger & PostgreSQL — OCPR Comores

Guide complet pour le déploiement de l'application **Next.js** avec le tableau de bord d'administration sécurisé et la base de données **PostgreSQL** sur **Hostinger** (VPS Linux ou Hébergement Node.js).

---

## 📋 Prérequis sur Hostinger

1. **Serveur Hostinger** : Un VPS Linux (Ubuntu 22.04 / 24.04 LTS recommandé) ou un plan d'Hébergement Web Cloud/Node.js Hostinger.
2. **Base de Données PostgreSQL** :
   - Soit la base de données PostgreSQL gérée directement sur le VPS.
   - Soit la base de données PostgreSQL fournie par Hostinger.
3. **Domaine & SSL** : Le nom de domaine `ocprcomores.com` (ou sous-domaine) avec certificat SSL (HTTPS) gratuit Let's Encrypt / Hostinger.

---

## ⚙️ Étape 1 : Variables d'Environnement (`.env`)

Créez le fichier `.env` à la racine de votre projet sur le serveur :

```env
# Connexion PostgreSQL (Hostinger VPS ou Hostinger Database)
DATABASE_URL="postgresql://ocpr_admin:VoteMotDePasseTresSecurise2026!@localhost:5432/ocpr_db?schema=public"

# Clé Secrète pour Signature des Jetons JWT Admin
JWT_SECRET="ocpr_comores_super_secure_jwt_secret_2026_hostinger_key"

# Mot de passe par défaut pour l'initialisation du Super Admin
ADMIN_DEFAULT_PASSWORD="Admin@OCPR2026!"

# Node Environment
NODE_ENV="production"
PORT=3000
```

---

## 📦 Étape 2 : Installation des Dépendances & Migration PostgreSQL

Sur le serveur Hostinger :

```bash
# 1. Installer les dépendances
npm install
# ou avec bun
bun install

# 2. Générer le client Prisma
npx prisma generate

# 3. Créer la structure des tables dans PostgreSQL
npx prisma db push

# 4. Exécuter la graine de données initiale (Création du Super Admin et des produits/actualités)
npx prisma db seed
```

---

## 🏗 Étape 3 : Compilation Production (Mode Standalone)

Grâce à la configuration `output: 'standalone'` dans `next.config.js`, Next.js produit un lot ultra-léger et autonome prêt à tourner sur Node.js :

```bash
npm run build
# ou
bun run build
```

---

## 🚀 Étape 4 : Lancement du Serveur Web avec PM2

Pour maintenir l'application en cours d'exécution 24/7 sur Hostinger :

```bash
# Installer PM2 globalement
npm install -g pm2

# Lancer l'application autonome
pm2 start server.js --name "ocpr-comores"

# Sauvegarder la configuration PM2 pour redémarrage automatique après reboot serveur
pm2 save
pm2 startup
```

---

## 🔒 Étape 5 : Configuration Nginx (Reverse Proxy & HTTPS)

Créez un fichier de configuration Nginx dans `/etc/nginx/sites-available/ocprcomores.conf` :

```nginx
server {
    server_name ocprcomores.com www.ocprcomores.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer le site et SSL avec Certbot :
```bash
sudo ln -s /etc/nginx/sites-available/ocprcomores.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d ocprcomores.com -d www.ocprcomores.com
```

---

## 🛡 Éléments de Sécurité Intégrés

1. **Aucun CMS Externe & Aucun CDN Tiers** : L'ensemble du code et des styles est servi directement depuis votre propre serveur Next.js.
2. **Authentification JWT dans Cookies HttpOnly & SameSite=Strict** : Totalement protégée contre les attaques XSS et CSRF.
3. **Protection contre l'Injection SQL** : Toutes les requêtes vers PostgreSQL passent par Prisma ORM avec requêtes paramétrées.
4. **En-têtes de Sécurité HTTP** : HSTS, CSP, X-Frame-Options (Clickjacking defense) et X-Content-Type-Options intégrés dans `next.config.js`.
5. **Protection Anti Brute-Force** : Limiteur de débit (Rate Limit) actif sur l'API de connexion admin.
6. **Journal de Sécurité (Audit Logs)** : Toutes les actions d'administration sont conservées avec adresse IP, e-mail et horodatage.
