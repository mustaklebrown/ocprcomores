# 🌿 OCPR Comores — Office Comorien des Produits de Rente

> **Portail Numérique Institutionnel & Système de Gestion de Contenu (CMS)** pour l'encadrement, la régulation, le contrôle qualité et la promotion internationale des filières d'excellence de l'Union des Comores (**Vanille Bourbon**, **Girofle**, **Ylang-Ylang**).

![Logo OCPR Comores](/public/logo-blanc.png)

---

## 📑 Sommaire
1. [🌟 Présentation du Projet](#-présentation-du-projet)
2. [💻 Stack Technologique](#-stack-technologique)
3. [🗺️ Architecture de l'Application](#️-architecture-de-lapplication)
   - [Portail Public](#1-portail-public)
   - [Espace d'Administration Sécurisé](#2-espace-dadministration-sécurisé-admin)
4. [🗄️ Base de Données & Modèles Prisma (MySQL)](#️-base-de-données--modèles-prisma-mysql)
5. [📤 Système d'Upload de Fichiers & Médias](#-système-dupload-de-fichiers--médias)
6. [🚀 Installation & Démarrage](#-installation--démarrage)
   - [Environnement Local](#1-environnement-local)
   - [Déploiement Hostinger & Production](#2-déploiement-hostinger--production)
7. [🛠️ Commandes Disponibles](#️-commandes-disponibles)
8. [🔒 Sécurité & Audit](#-sécurité--audit)

---

## 🌟 Présentation du Projet

L'**Office Comorien des Produits de Rente (OCPR)** est l'organisme public de référence en Union des Comores garantissant la régulation économique, les normes phytosanitaires (ISO), l'agrément des exportateurs et la valorisation des filières de rente.

Cette plateforme web moderne répond à une double exigence :
- **Portail Citoyen & International** : Vitrine officielle pour les acheteurs internationaux, investisseurs, coopératives agricoles et producteurs comoriens.
- **Back-Office Exécutif (CMS Admin)** : Interface sécurisée pour gérer les fiches techniques des filières, les actualités éditoriales, les textes de lois / décrets téléchargeables, la médiathèque et la messagerie de contact.

---

## 💻 Stack Technologique

| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Framework Web** | **Next.js 16 (App Router)** | Rendu hybride SSR/SSG avec Turbopack & React 19 |
| **Langage** | **TypeScript** | Typage strict et validation robuste |
| **Styling & UI** | **Tailwind CSS & Vanilla CSS** | Charte graphique officielle (Vert Forêt `#184E2A`, Or Vanille `#DAA520`) |
| **Base de Données** | **MySQL / MariaDB** | Adapté pour Hostinger Cloud & VPS Linux |
| **ORM** | **Prisma 7** | Client avec `@prisma/adapter-mariadb` et pool résilient |
| **Sécurité** | **Jose (JWT) & BcryptJS** | Authentification par Cookie HttpOnly `SameSite=Strict` |
| **Icônes & Médias** | **Lucide React** | Bibliothèque d'icônes vectorielles modernes |

---

## 🗺️ Architecture de l'Application

### 1. Portail Public (`/`)
- **Héro & Identité Nationale** : Statistiques officielles des filières comoriennes et présentation de l'Union des Comores.
- **Missions & Vision** : Rôle régalien de l'OCPR, engagements de qualité et gouvernance.
- **Filières & Produits de Rente** : Fiches techniques interactives (Vanille Bourbon, Clous et Huile essentielle de Girofle, Huile essentielle d'Ylang-Ylang).
- **Laboratoire & Contrôle Qualité** : Certification aux normes internationales ISO (ISO 5565-1:1999, etc.).
- **Textes Réglementaires & Téléchargements** : Décrets, arrêtés, formulaires de demande d'agrément exportateur en format PDF/DOCX.
- **Journal Officiel & Actualités** : Articles avec lecteur immersif (*Magazine Reader*), citations, temps de lecture et partage.
- **Médiathèque & Photothèque** : Reportages photos et vidéos de la production insulaire.
- **Guichet de Contact** : Formulaire direct avec enregistrement en base de données et protection anti-abus.

### 2. Espace d'Administration Sécurisé (`/admin`)
- `/admin/login` : Authentification sécurisée par jeton chiffré.
- `/admin` : Tableau de bord exécutif avec indicateurs de performance en direct.
- `/admin/news` : Éditeur de presse avec téléversement d'illustrations et prévisualisation typographique.
- `/admin/products` : Édition des spécifications physico-chimiques et normes d'export.
- `/admin/documents` : Gestionnaire de décrets et formulaires PDF/Word téléchargeables.
- `/admin/media` : Gestionnaire de photographies et reportages vidéo.
- `/admin/messages` : Boîte de réception et traitement des demandes d'usagers.
- `/admin/audit` : Journal d'audit et traçabilité des opérations administrateurs.
- `/admin/settings` : État de la base de données et réglages système.

---

## 🗄️ Base de Données & Modèles Prisma (MySQL)

Les modèles de données sont définis dans [`prisma/schema.prisma`](file:///d:/OCPRCOMORES/prisma/schema.prisma) :

- **`User`** : Administrateurs et Super Administrateurs de la plateforme.
- **`Product`** : Filières de rente, normes ISO, taux de vanilline, spécifications d'export.
- **`News`** : Articles de presse, communiqués officiels, slugs et temps de lecture.
- **`Document`** : Textes réglementaires, décrets et fichiers administratifs téléchargeables.
- **`Media`** : Galerie d'images et vidéos avec filtres par filière.
- **`ContactMessage`** : Messages d'usagers et demandes de partenariat.
- **`AuditLog`** : Journal de sécurité (adresse IP, administrateur, action effectuée, horodatage).

---

## 📤 Système d'Upload de Fichiers & Médias

Le système d'upload intégré gère automatiquement :
1. **Les Images** : Enregistrées dans `public/uploads/images/` (JPG, PNG, WEBP, SVG).
2. **Les Documents** : Enregistrés dans `public/uploads/documents/` (PDF, DOCX, XLSX).
3. **Import Automatique d'URL** : Téléchargement et stockage local en un clic depuis n'importe quelle URL externe.
4. **Assainissement** : Nettoyage automatique des noms de fichiers et attribution d'un horodatage unique (`timestamp`).

Pour vérifier le bon fonctionnement du téléversement :
```bash
npm run test:upload
```

---

## 🚀 Installation & Démarrage

### 1. Environnement Local
```bash
# 1. Cloner le projet et installer les dépendances
npm install
# ou avec bun
bun install

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Synchroniser la base de données MySQL
npx prisma db push

# 4. Injecter les données de départ (Admin, Filières, Documents)
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

Accédez ensuite à l'application sur [http://localhost:3000](http://localhost:3000) et à l'administration sur [http://localhost:3000/admin](http://localhost:3000/admin).

### 2. Déploiement Hostinger & Production
Le projet est optimisé pour **Hostinger Hébergement Web (hPanel)** et **Hostinger VPS Linux**.

Consultez le guide détaillé dédié : **[`HOSTINGER_DEPLOYMENT.md`](file:///d:/OCPRCOMORES/HOSTINGER_DEPLOYMENT.md)**.

---

## 🛠️ Commandes Disponibles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement avec Turbopack |
| `npm run build` | Génère le client Prisma, compile Next.js et prépare le lot standalone pour Hostinger |
| `npm run start` | Démarre le serveur Next.js compilé en production |
| `npm run db:push` | Applique directement le schéma Prisma sur la base MySQL |
| `npm run db:seed` | Remplit la base avec le Super Admin et le contenu officiel initial |
| `npm run test:upload` | Exécute les tests automatisés du système de téléversement |

---

## 🔒 Sécurité & Audit

1. **Protection contre l'Injection SQL** : Requêtes paramétrées via Prisma ORM.
2. **Protection CSRF & XSS** : Tokens JWT stockés dans des cookies `HttpOnly`, `SameSite=Strict`, `Secure`.
3. **Limiteur de Débit (Rate Limiting)** : Protection anti-brute-force sur l'authentification admin.
4. **En-têtes HTTP de Sécurité** : HSTS, CSP (Content Security Policy), X-Frame-Options (anti-clickjacking), X-Content-Type-Options.
5. **Traçabilité Complète** : Journal d'audit conservant l'adresse IP et les actions de chaque administrateur.

---

© 2026 **Office Comorien des Produits de Rente (OCPR)** — Union des Comores. Tous droits réservés.
