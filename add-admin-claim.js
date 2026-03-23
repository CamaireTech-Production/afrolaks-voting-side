const admin = require('firebase-admin');
require('dotenv').config({ path: './apps/frontend/.env.local' });

// Créer un objet service account avec les credentials du .env
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: 'key',
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: 'client',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
};

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const email = process.argv[2] || 'afrolaks.admin@test.com';

console.log(`🔐 Ajout du custom claim admin à: ${email}`);

admin.auth().getUserByEmail(email)
  .then(user => {
    console.log(`👤 Utilisateur trouvé: ${user.uid}`);
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✅ Custom claim "admin: true" ajouté!`);
    console.log(`📝 L'utilisateur doit se déconnecter et se reconnecter pour que ça prenne effet.`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  });
