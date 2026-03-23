import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Lire le fichier .env.local
const envFile = '/home/bello-dev/CamaireTech/afrolaks-voting-side/apps/frontend/.env.local';
const envContent = fs.readFileSync(envFile, 'utf-8');

// Parser le .env.local
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim();
    // Enlever les guillemets
    env[key.trim()] = value.replace(/^"(.+)"$/, '$1').replace(/\\n/g, '\n');
  }
});

console.log('📖 Variables chargées du .env.local:');
console.log(`  FIREBASE_PROJECT_ID: ${env.FIREBASE_PROJECT_ID}`);
console.log(`  FIREBASE_CLIENT_EMAIL: ${env.FIREBASE_CLIENT_EMAIL}`);
console.log(`  FIREBASE_PRIVATE_KEY: ${env.FIREBASE_PRIVATE_KEY ? 'OK' : 'MISSING'}`);

// Initialiser Firebase Admin
const credential = admin.credential.cert({
  projectId: env.FIREBASE_PROJECT_ID,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
  privateKey: env.FIREBASE_PRIVATE_KEY,
} as admin.ServiceAccount);

admin.initializeApp({
  credential,
  projectId: env.FIREBASE_PROJECT_ID,
});

const email = process.argv[2] || 'afrolaks.admin@test.com';

console.log(`\n🔐 Ajout du custom claim admin à: ${email}`);

admin.auth()
  .getUserByEmail(email)
  .then(user => {
    console.log(`👤 Utilisateur trouvé: ${user.uid}`);
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✅ Custom claim "admin: true" ajouté avec succès!`);
    console.log(`📝 L'utilisateur doit se déconnecter ET se reconnecter.`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  });
