/**
 * Firestore Data Seeding Script
 *
 * Purpose: Populate Firestore with initial data (categories, nominees, podcasts)
 *
 * Usage:
 *   1. Make sure .env variables are set
 *   2. Run: node firebase/seed-firestore.js
 *
 * What it does:
 *   - Reads seed-data.json
 *   - Creates collections and documents in Firestore
 *   - Checks for duplicates before writing
 *   - Logs progress and results
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION
// ==========================================

// Make sure you have GOOGLE_APPLICATION_CREDENTIALS set
// OR uncomment the line below and provide the path to your service account key
// const serviceAccount = require('./path/to/service-account-key.json');

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? null
  : require('./afrolaks-service-account.json'); // Create this file if not using env var

// ==========================================
// INIT FIREBASE
// ==========================================

try {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    throw new Error(
      'Firebase credentials not found!\n' +
      'Please set GOOGLE_APPLICATION_CREDENTIALS env var or create firebase/afrolaks-service-account.json\n' +
      'Get service account key from Firebase Console > Project Settings > Service Accounts > Generate New Private Key'
    );
  }

  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// ==========================================
// SEED DATA
// ==========================================

const seedDataPath = path.join(__dirname, 'seed-data.json');
let seedData;

try {
  const rawData = fs.readFileSync(seedDataPath, 'utf-8');
  seedData = JSON.parse(rawData);
  console.log('✅ Seed data loaded');
} catch (error) {
  console.error('❌ Failed to load seed data:', error.message);
  process.exit(1);
}

// ==========================================
// SEEDING FUNCTIONS
// ==========================================

/**
 * Seed a collection with documents
 * @param {string} collectionName - Name of the collection
 * @param {Array} documents - Array of documents to add
 * @param {string} idField - Field to use as document ID (if any)
 */
async function seedCollection(collectionName, documents, idField = null) {
  try {
    if (!documents || documents.length === 0) {
      console.log(`⏭️  ${collectionName} - No data to seed`);
      return;
    }

    const collection = db.collection(collectionName);
    let addedCount = 0;
    let skippedCount = 0;

    for (const doc of documents) {
      const docId = idField ? doc[idField] : null;

      try {
        if (docId) {
          // Check if document already exists
          const existingDoc = await collection.doc(docId).get();
          if (existingDoc.exists) {
            console.log(`  ⏭️  ${collectionName}/${docId} - Already exists, skipping`);
            skippedCount++;
            continue;
          }

          // Create with custom ID
          await collection.doc(docId).set(doc);
          console.log(`  ✅ ${collectionName}/${docId} - Created`);
        } else {
          // Auto-generate ID
          await collection.add(doc);
          console.log(`  ✅ ${collectionName} - Document added`);
        }
        addedCount++;
      } catch (error) {
        console.error(`  ❌ ${collectionName} - Error:`, error.message);
      }
    }

    console.log(`✅ ${collectionName}: ${addedCount} added, ${skippedCount} skipped\n`);
  } catch (error) {
    console.error(`❌ Error seeding ${collectionName}:`, error.message);
  }
}

// ==========================================
// MAIN SEEDING PROCESS
// ==========================================

async function seedDatabase() {
  console.log('\n🌱 Starting Firestore seeding...\n');

  try {
    // Seed each collection
    // Categories
    await seedCollection('categories', seedData.categories, 'id');

    // Nominees
    await seedCollection('nominees', seedData.nominees, 'id');

    // Podcasts
    await seedCollection('podcasts', seedData.podcasts, 'id');

    // Gallery Images
    await seedCollection('galleryImages', seedData.galleryImages, 'id');

    // Note: contacts and votes collections are seeded by users/functions

    console.log('✅ Firestore seeding completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Verify data in Firebase Console');
    console.log('  2. Test frontend/admin connections');
    console.log('  3. Continue with Stage 1.2 setup\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// ==========================================
// RUN SEEDING
// ==========================================

// Confirm before seeding
console.log('📝 Seed Configuration:');
console.log('  Collections to seed:');
console.log('    - categories');
console.log('    - nominees');
console.log('    - podcasts');
console.log('    - galleryImages');
console.log('\n⚠️  Make sure you have the right Firebase project selected!\n');

// For automated seeding, just run directly
// For interactive, uncomment the confirmation below:
//
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
//
// rl.question('Proceed with seeding? (yes/no): ', (answer) => {
//   rl.close();
//   if (answer.toLowerCase() === 'yes') {
//     seedDatabase();
//   } else {
//     console.log('Seeding cancelled.');
//     process.exit(0);
//   }
// });

// Auto-run for simplicity
seedDatabase();
