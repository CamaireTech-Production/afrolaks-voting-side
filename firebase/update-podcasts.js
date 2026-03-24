const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./afrolaks-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updatePodcasts() {
  const seedDataPath = path.join(__dirname, 'seed-data.json');
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

  console.log('🎙️  Updating podcasts with base64 images...\n');

  for (const podcast of seedData.podcasts) {
    try {
      await db.collection('podcasts').doc(podcast.id).update(podcast);
      const imgSize = podcast.image ? Math.round(podcast.image.length / 1024) + 'KB' : 'none';
      console.log(`✅ ${podcast.id} - Updated (image: ${imgSize})`);
    } catch (error) {
      console.error(`❌ ${podcast.id} - Error:`, error.message);
    }
  }

  console.log('\n✅ All podcasts updated with base64 images!');
  process.exit(0);
}

updatePodcasts().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
