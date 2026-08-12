# 🚀 Guide de Déploiement Vercel Production - OCPR Comores

Ce document détient toutes les instructions pour déployer le portail institutionnel de l'**OCPR Comores** sur **Vercel** avec une base de données PostgreSQL serverless en production.

---

## 📋 Prérequis

1. Un compte [Vercel](https://vercel.com)
2. Le dépôt GitHub connecté : `mustaklebrown/ocprcomores`
3. Une base de données PostgreSQL disponible sur cloud serverless (e.g. **Neon**, **Supabase**, **Vercel Postgres / Neon Storage**, ou **Railway**)

---

## 🛠️ Étape 1 : Préparation de la Base de Données PostgreSQL

1. **Créer une instance PostgreSQL** (sur Neon.tech, Supabase, ou Vercel Postgres).
2. Récupérer les deux URLs de connexion :
   - **`DATABASE_URL`** : URL avec gestionnaire de connexion (Connection Pooler / PgBouncer, ex: `...&pgbouncer=true`).
   - **`DIRECT_URL`** : URL de connexion directe (nécessaire pour les migrations Prisma).

---

## ⚡ Étape 2 : Configuration du Projet sur Vercel

1. Rendez-vous sur le tableau de bord [Vercel](https://vercel.com/dashboard).
2. Cliquez sur **Add New...** > **Project**.
3. Importez le projet GitHub **`mustaklebrown/ocprcomores`**.
4. Configurez les **Environment Variables** dans l'interface Vercel :

| Clé Variable | Description | Exemple / Valeur |
| :--- | :--- | :--- |
| `DATABASE_URL` | URL de connexion PostgreSQL (Poolée) | `postgresql://...&pgbouncer=true` |
| `DIRECT_URL` | URL de connexion PostgreSQL (Directe) | `postgresql://...` |
| `JWT_SECRET` | Clé secrète pour les jetons Admin JWT | Ex: `ocpr_super_secret_jwt_key_2026_x987123` |
| `ADMIN_DEFAULT_PASSWORD` | Mot de passe administrateur par défaut (seeding) | Ex: `Admin@OCPR2026!` |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application | `https://ocprcomores.vercel.app` |

---

## 📦 Étape 3 : Build & Initialisation de la Base de Données

Le projet contient un fichier `vercel.json` et un hook `postinstall` dans `package.json` qui génèrent automatiquement le client Prisma lors du build Vercel.

### Exécuter la structure et le seed initial de la base de données :

Depuis votre terminal local (ou via Vercel CLI) connecté à votre base de données de production :

```bash
# 1. Pousser le schéma Prisma sur la base de données de production
npx prisma db push

# 2. Insérer les données initiales (Produits, Actualités, Média, Compte Super Admin)
npx prisma db seed
```

---

## 🔒 Informations de Connexion Admin par Défaut

Après l'exécution du script `seed` :
- **URL Admin** : `https://<votre-app>.vercel.app/admin/login`
- **Email** : `admin@ocprcomores.com`
- **Mot de passe** : `Admin@OCPR2026!` *(ou la valeur définie dans `ADMIN_DEFAULT_PASSWORD`)*

---

## ⚡ Optimisations Vercel incluses

- **`regions: ["cdg1"]`** (Paris) : Faible latence pour l'Europe et l'océan Indien.
- **Rendu dynamique serverless** : Routes API (`/api/products`, `/api/news`, `/api/media`) configurées en `force-dynamic` pour garantir un rafraîchissement des données en temps réel.
- **En-têtes de Sécurité Avancés** : CSP, HSTS, X-Frame-Options DENY, Referrer Policy configurés via `next.config.js`.
- **Formats d'Images Modernes** : Support natif AVIF et WebP.
