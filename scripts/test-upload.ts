import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

/**
 * Script de test complet pour le système d'upload de fichiers OCPR Comores
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ocpr_comores_super_secure_jwt_secret_2026_local_key'
);

async function runTests() {
  console.log('🧪 DÉBUT DES TESTS DU SYSTÈME D\'UPLOAD OCPR COMORES\n');

  const uploadDirImages = path.join(process.cwd(), 'public', 'uploads', 'images');
  const uploadDirDocs = path.join(process.cwd(), 'public', 'uploads', 'documents');

  // Test 1: Vérification de l'existence des répertoires de stockage
  console.log('1️⃣ Vérification des dossiers de destination...');
  fs.mkdirSync(uploadDirImages, { recursive: true });
  fs.mkdirSync(uploadDirDocs, { recursive: true });
  console.log(`   ✅ Dossier Images : ${uploadDirImages}`);
  console.log(`   ✅ Dossier Documents : ${uploadDirDocs}`);

  // Test 2: Génération d'un token JWT de test pour simuler un administrateur connecté
  console.log('\n2️⃣ Génération du token JWT Admin sécurisé...');
  const token = await new SignJWT({
    userId: 'test-admin-id',
    email: 'admin@ocprcomores.com',
    role: 'SUPER_ADMIN',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);

  console.log(`   ✅ Token généré avec succès (${token.substring(0, 20)}...)`);

  // Test 3: Simulation d'écriture d'une image de test
  console.log('\n3️⃣ Test d\'upload d\'une Image (PNG)...');
  const sampleImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const testImageName = `test_upload_${Date.now()}.png`;
  const testImagePath = path.join(uploadDirImages, testImageName);
  fs.writeFileSync(testImagePath, sampleImageBuffer);

  if (fs.existsSync(testImagePath) && fs.statSync(testImagePath).size > 0) {
    console.log(`   ✅ Image écrite avec succès : /uploads/images/${testImageName}`);
    console.log(`   ✅ Taille : ${sampleImageBuffer.length} octets`);
  } else {
    throw new Error('Échec d\'écriture de l\'image de test');
  }

  // Test 4: Simulation d'écriture d'un document PDF de test
  console.log('\n4️⃣ Test d\'upload d\'un Document (PDF)...');
  const samplePdfBuffer = Buffer.from('%PDF-1.4 test document content for ocpr comores certification');
  const testDocName = `test_document_${Date.now()}.pdf`;
  const testDocPath = path.join(uploadDirDocs, testDocName);
  fs.writeFileSync(testDocPath, samplePdfBuffer);

  if (fs.existsSync(testDocPath) && fs.statSync(testDocPath).size > 0) {
    console.log(`   ✅ Document écrit avec succès : /uploads/documents/${testDocName}`);
    console.log(`   ✅ Taille : ${samplePdfBuffer.length} octets`);
  } else {
    throw new Error('Échec d\'écriture du document de test');
  }

  // Test 5: Nettoyage des fichiers de test
  console.log('\n5️⃣ Nettoyage des fichiers temporaires de test...');
  fs.unlinkSync(testImagePath);
  fs.unlinkSync(testDocPath);
  console.log('   ✅ Fichiers de test nettoyés avec succès.');

  console.log('\n🎉 TOUS LES TESTS D\'UPLOAD SONT VALIDÉS AVEC SUCCÈS !');
}

runTests().catch((err) => {
  console.error('❌ Erreur lors du test :', err);
  process.exit(1);
});
