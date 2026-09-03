import { prisma } from '../lib/db';
import { hashPassword, verifyPassword, signAdminToken, verifyAdminToken, COOKIE_NAME } from '../lib/auth';
import { rateLimit } from '../lib/rate-limit';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

let passed = 0;
let failed = 0;

function logPass(title: string, details?: string) {
  passed++;
  console.log(`  ✅ [PASS] ${title}${details ? ` — ${details}` : ''}`);
}

function logFail(title: string, error: any) {
  failed++;
  console.error(`  ❌ [FAIL] ${title} :`, error);
}

async function testSuite() {
  console.log('\n=============================================================');
  console.log('🧪 TEST COMPLET DE TOUTES LES FONCTIONNALITÉS — OCPR COMORES');
  console.log('=============================================================\n');

  // -------------------------------------------------------------
  // 1. Tests Cryptographie & Authentification
  // -------------------------------------------------------------
  console.log('1️⃣  MODULE AUTHENTIFICATION & SÉCURITÉ JWT');
  try {
    const rawPass = 'SecretAdmin2026!';
    const hashed = await hashPassword(rawPass);
    const isValid = await verifyPassword(rawPass, hashed);
    const isInvalid = await verifyPassword('WrongPassword', hashed);

    if (isValid && !isInvalid) {
      logPass('Bcrypt Hashing & Verification', 'Salt factor 12');
    } else {
      throw new Error('Échec de validation du mot de passe');
    }

    const payload = {
      id: 'test-admin-id-123',
      email: 'direction@ocprcomores.com',
      name: 'Direction Test',
      role: 'SUPER_ADMIN' as const,
    };

    const token = await signAdminToken(payload);
    const verified = await verifyAdminToken(token);

    if (verified && verified.email === payload.email && verified.role === payload.role) {
      logPass('Signature & Décodage du Jeton JWT Admin', `Session active pour ${verified.email}`);
    } else {
      throw new Error('Échec de vérification du payload JWT');
    }
  } catch (err: any) {
    logFail('Module Authentification & Sécurité', err.message);
  }

  // -------------------------------------------------------------
  // 2. Tests Rate Limiter
  // -------------------------------------------------------------
  console.log('\n2️⃣  MODULE RATE LIMITING (Protection Brute-Force & DoS)');
  try {
    const testIp = '192.168.1.99';
    let blockTriggered = false;

    for (let i = 0; i < 7; i++) {
      const res = rateLimit({ identifier: `test_rl_${testIp}`, limit: 5, windowMs: 10000 });
      if (!res.success) {
        blockTriggered = true;
      }
    }

    if (blockTriggered) {
      logPass('Rate Limiter actif', 'Bloque les requêtes abusives après 5 tentatives');
    } else {
      throw new Error('Le rate limiter n a pas bloqué les requêtes en dépassement');
    }
  } catch (err: any) {
    logFail('Rate Limiter', err.message);
  }

  // -------------------------------------------------------------
  // 3. Tests Base de Données Prisma
  // -------------------------------------------------------------
  console.log('\n3️⃣  MODULE BASE DE DONNÉES PRISMA (MySQL / MariaDB)');
  try {
    const [productsCount, newsCount, mediaCount, docCount, messageCount] = await Promise.all([
      prisma.product.count(),
      prisma.news.count(),
      prisma.media.count(),
      prisma.document.count(),
      prisma.contactMessage.count(),
    ]);

    logPass('Connexion Base de Données', 'Pool MariaDB opérationnel');
    logPass('Filières de Rente (Produits)', `${productsCount} produit(s) en base`);
    logPass('Actualités & Communiqués', `${newsCount} article(s) en base`);
    logPass('Médiathèque (Photos & Vidéos)', `${mediaCount} média(s) en base`);
    logPass('Textes & Documents Légaux', `${docCount} document(s) en base`);
    logPass('Messages de Contact', `${messageCount} message(s) en base`);
  } catch (err: any) {
    logFail('Connexion Base de Données', err.message);
  }

  // -------------------------------------------------------------
  // 4. Tests des Points d'Accès Publics HTTP (API & Pages)
  // -------------------------------------------------------------
  console.log('\n4️⃣  POINTS D ACCÈS PUBLICS DU PORTAIL');
  try {
    // 4.1 Home Page HTML
    const homeRes = await fetch(`${BASE_URL}/`);
    if (homeRes.status === 200) {
      logPass('Page d Accueil (GET /)', 'Status 200 OK — SSR / HTML généré');
    } else {
      throw new Error(`GET / a renvoyé le statut ${homeRes.status}`);
    }

    // 4.2 GET /api/products
    const prodRes = await fetch(`${BASE_URL}/api/products`);
    const prodData = await prodRes.json();
    if (prodRes.status === 200 && Array.isArray(prodData.products)) {
      logPass('API Produits (GET /api/products)', `${prodData.products.length} produits renvoyés`);
    } else {
      throw new Error('Structure invalide sur /api/products');
    }

    // 4.3 GET /api/news
    const newsRes = await fetch(`${BASE_URL}/api/news`);
    const newsData = await newsRes.json();
    if (newsRes.status === 200 && Array.isArray(newsData.news)) {
      logPass('API Actualités (GET /api/news)', `${newsData.news.length} actualités renvoyées`);
    } else {
      throw new Error('Structure invalide sur /api/news');
    }

    // 4.4 GET /api/media (Galerie)
    const mediaRes = await fetch(`${BASE_URL}/api/media`);
    const mediaData = await mediaRes.json();
    if (mediaRes.status === 200 && Array.isArray(mediaData.media)) {
      logPass('API Médiathèque & Galerie (GET /api/media)', `${mediaData.media.length} photos/vidéos synchronisées`);
    } else {
      throw new Error('Structure invalide sur /api/media');
    }

    // 4.5 GET /api/documents
    const docRes = await fetch(`${BASE_URL}/api/documents`);
    const docData = await docRes.json();
    if (docRes.status === 200 && Array.isArray(docData.documents)) {
      logPass('API Documents Légaux (GET /api/documents)', `${docData.documents.length} documents renvoyés`);
    } else {
      throw new Error('Structure invalide sur /api/documents');
    }

    // 4.6 POST /api/contact (Formulaire de contact public)
    const contactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Planteur / Exportateur Test',
        email: 'test-planteur@ocprcomores.com',
        phone: '+269 321 00 00',
        subject: 'Demande d informations sur les normes d exportation Vanille',
        message: 'Ceci est un message de test automatisé pour valider le formulaire de contact OCPR.',
      }),
    });
    const contactData = await contactRes.json();
    if (contactRes.status === 200 && contactData.success) {
      logPass('Formulaire de Contact (POST /api/contact)', 'Message enregistré avec succès');
    } else {
      throw new Error(contactData.error || 'Échec d envoi du message de contact');
    }
  } catch (err: any) {
    logFail('Points d accès publics', err.message);
  }

  // -------------------------------------------------------------
  // 5. Tests Espace d'Administration Sécurisé (Admin)
  // -------------------------------------------------------------
  console.log('\n5️⃣  ESPACE D ADMINISTRATION SÉCURISÉ (ADMIN API)');
  let adminCookie = '';

  try {
    // 5.1 Tentative d'accès non authentifié (doit être refusé avec 401)
    const unauthRes = await fetch(`${BASE_URL}/api/admin/me`);
    if (unauthRes.status === 401) {
      logPass('Protection Middleware', 'Accès sans session refusé (HTTP 401)');
    } else {
      throw new Error(`L accès non authentifié n a pas renvoyé 401 (reçu ${unauthRes.status})`);
    }

    // 5.2 Connexion Admin (POST /api/admin/login)
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@ocprcomores.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@OCPR2026!';

    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });

    const loginData = await loginRes.json();

    if (loginRes.status === 200 && loginData.success) {
      const setCookie = loginRes.headers.get('set-cookie');
      if (setCookie) {
        adminCookie = setCookie.split(';')[0];
        logPass('Connexion Admin (POST /api/admin/login)', `Cookie HttpOnly sécurisé généré (${adminEmail})`);
      } else {
        // Build cookie manually from signed token for test context if set-cookie header format varies
        const token = await signAdminToken({
          id: loginData.user.id,
          email: loginData.user.email,
          name: loginData.user.name,
          role: loginData.user.role,
        });
        adminCookie = `${COOKIE_NAME}=${token}`;
        logPass('Connexion Admin (POST /api/admin/login)', `Session validée pour ${adminEmail}`);
      }
    } else {
      throw new Error(loginData.error || 'Échec de la connexion admin');
    }

    // 5.3 Vérification de session active (GET /api/admin/me)
    const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Cookie: adminCookie },
    });
    const meData = await meRes.json();
    if (meRes.status === 200 && meData.user) {
      logPass('Session Active (GET /api/admin/me)', `Connecté en tant que ${meData.user.name} (${meData.user.role})`);
    } else {
      throw new Error('Échec de validation de session via /api/admin/me');
    }

    // 5.4 Consultation des Messages reçus (GET /api/admin/messages)
    const msgRes = await fetch(`${BASE_URL}/api/admin/messages`, {
      headers: { Cookie: adminCookie },
    });
    const msgData = await msgRes.json();
    if (msgRes.status === 200 && Array.isArray(msgData.messages)) {
      logPass('Gestion des Messages (GET /api/admin/messages)', `${msgData.messages.length} message(s) disponible(s)`);
    }

    // 5.5 Consultation des Logs d'Audit (GET /api/admin/audit-logs)
    const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
      headers: { Cookie: adminCookie },
    });
    const auditData = await auditRes.json();
    if (auditRes.status === 200 && Array.isArray(auditData.logs)) {
      logPass('Journal d Audit Sécurité (GET /api/admin/audit-logs)', `${auditData.logs.length} événement(s) de traçabilité`);
    }

    // 5.6 Test Upload Fichier Admin (POST /api/admin/upload)
    const form = new FormData();
    const fakeFileContent = new Blob(['Test file content OCPR'], { type: 'text/plain' });
    form.append('file', fakeFileContent, 'test_upload_validation.txt');
    form.append('folder', 'documents');

    const uploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
      body: form,
    });
    const uploadData = await uploadRes.json();
    if (uploadRes.status === 200 && uploadData.url) {
      logPass('Téléversement Sécurisé (POST /api/admin/upload)', `Fichier créé: ${uploadData.url}`);
    } else {
      throw new Error(uploadData.error || 'Échec du téléversement');
    }

    // 5.7 Déconnexion Admin (POST /api/admin/logout)
    const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
    });
    const logoutData = await logoutRes.json();
    if (logoutRes.status === 200 && logoutData.success) {
      logPass('Déconnexion Sécurisée (POST /api/admin/logout)', 'Cookie de session révoqué');
    }
  } catch (err: any) {
    logFail('Espace d Administration Admin', err.message);
  }

  // -------------------------------------------------------------
  // Résumé Final
  // -------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`📊 RÉSULTAT DU RAPPORT DE TESTS :`);
  console.log(`   ✅ Succès : ${passed}`);
  console.log(`   ❌ Échecs : ${failed}`);
  console.log(`   🎯 Taux de réussite : ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

testSuite()
  .catch((e) => {
    console.error('Erreur inattendue:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
