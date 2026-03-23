# Firebase Directory - Afrolaks Voting Platform

This directory contains all Firebase configuration files for the Afrolaks voting platform.

## 📁 Files Overview

### Configuration Files

| File | Purpose |
|------|---------|
| `firestore.rules` | Firestore security rules (deploy to Firebase) |
| `firestore.indexes.json` | Firestore composite indexes (auto-generated) |
| `seed-data.json` | Initial data for collections (categories, nominees, etc) |

### Documentation & Scripts

| File | Purpose |
|------|---------|
| `FIREBASE_SETUP.md` | Complete Firebase setup guide (read this first!) |
| `seed-firestore.js` | Node.js script to populate Firestore with initial data |
| `README.md` | This file |

### API Keys & Secrets (⚠️ NOT in git)

These files should exist but are **gitignored**:
- `afrolaks-service-account.json` - Firebase Admin SDK key (backend/seeding)
- `.env` / `.env.local` - API credentials in app directories

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Read Firebase Setup Guide
```bash
cd firebase
cat FIREBASE_SETUP.md
```
⏱️ 5 minutes to understand the process

### 2️⃣ Setup Firebase Project
Follow the guide above to:
- Create Firebase project
- Create Firestore database
- Enable Authentication
- Deploy security rules
- Setup environment variables

⏱️ 30-45 minutes

### 3️⃣ Seed Initial Data
```bash
# Copy your service account key
# (Get from Firebase Console > Project Settings > Service Accounts)
cp /path/to/service-account-key.json firebase/afrolaks-service-account.json

# Run seed script
node firebase/seed-firestore.js
```

⏱️ 2 minutes

---

## 📝 Firestore Collections

### 🏷️ categories
Voting categories (4 documents)
```
- best-dj
- hype-mc
- influencer
- event-organizer
```

### 👤 nominees
Nominees in each category (~50 documents)
- id, name, bio, image, categoryId
- voteCount (incremented when voted)

### 🗳️ votes
Vote transactions (immutable audit trail)
- nomineeId, categoryId, voteCount
- amountXAF, transactionId, paymentStatus
- timestamp

### 🎙️ podcasts
Podcast episodes (list of guest interviews)
- episodeNumber, title, guest, duration
- spotifyLink, audioUrl (optional)

### 🖼️ galleryImages
Gallery images from events
- url, alt, category, order

### 📨 contactSubmissions
Contact form submissions from public
- name, email, subject, message
- status (new, read, replied)

---

## 🔐 Security Rules

Firestore security rules are in `firestore.rules`.

### Current Rules

| Collection | Read | Create | Update | Delete |
|-----------|------|--------|--------|--------|
| categories | ✅ Public | ❌ Admin only | ❌ Admin only | ❌ Admin only |
| nominees | ✅ Public | ❌ Admin only | ❌ Admin only | ❌ Admin only |
| votes | ✅ Auth required | ✅ Cloud Function | ❌ No | ❌ No |
| podcasts | ✅ Public | ❌ Admin only | ❌ Admin only | ❌ Admin only |
| gallery | ✅ Public | ❌ Admin only | ❌ Admin only | ❌ Admin only |
| contacts | ✅ Admin only | ✅ Public | ✅ Admin only | ✅ Admin only |

**Key Principle**: Only Firebase Cloud Functions and admins can modify data. Users can only create votes and contact submissions.

---

## 🔧 Seeding Data

### Manual Seeding (Firebase Console)

1. Go to www.firebase.google.com → your project
2. Click "Firestore Database"
3. Click "+ Create Collection"
4. Add documents from `seed-data.json`

**Time**: ~15 minutes

### Automated Seeding (Script)

1. Get service account key from Firebase Console
2. Save as `firebase/afrolaks-service-account.json`
3. Run script:
   ```bash
   node firebase/seed-firestore.js
   ```

**Time**: ~2 minutes

---

## 📋 Environment Variables

### Frontend (.env.local in apps/frontend/)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Admin (.env in apps/admin/)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**Get these from**: Firebase Console > Project Settings > Your apps > Web app config

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Security rules deployed
- [ ] Collections created (categories, nominees, etc)
- [ ] Sample data seeded
- [ ] Environment variables set in both apps
- [ ] Frontend loads without Firebase errors
- [ ] Admin loads without Firebase errors
- [ ] Can read categories from Firestore
- [ ] Cannot write to votes from frontend (as expected)

---

## 🐛 Troubleshooting

### "Cannot create collection"
→ Make sure Firestore Database is enabled in Firebase Console

### "Permission denied" on reads
→ Check security rules are deployed: `firebase deploy --only firestore:rules`

### Seed script fails
→ Check service account key path and permissions

### Frontend shows "Unknown Error"
→ Check .env.local has all required Firebase variables

---

## 🔗 Related Files

These files use Firebase configuration:

**Frontend**:
- `apps/frontend/src/lib/firebase.ts` - Firebase initialization
- `apps/frontend/src/hooks/useCategories.ts` - Firestore queries (to be created)
- `apps/frontend/src/hooks/useNominees.ts` - Firestore queries (to be created)

**Admin**:
- `apps/admin/src/lib/firebase.ts` - Firebase initialization
- `apps/admin/src/hooks/useAuthAdmin.ts` - Admin authentication (to be created)

**Configuration**:
- `.env.example` - Template for env variables
- `CLAUDE.md` - Project guidelines
- `PHASE1_ACTION_PLAN.md` - Implementation roadmap

---

## 📚 Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Security Rules**: https://firebase.google.com/docs/firestore/security/start
- **Admin SDK**: https://firebase.google.com/docs/admin/setup

---

## 🎯 Next Steps

After completing Firebase setup:

1. ✅ STAGE 1.1: Firebase project created
2. ⏭️ STAGE 1.2: Create Firestore collections & seed data
3. ⏭️ STAGE 1.3: Deploy security rules
4. ⏭️ STAGE 2: Frontend migration (remove mocks, use Firebase)

---

**Firebase Setup Status**: Ready for STAGE 1.1 execution
**Last Updated**: 2026-03-23
**Maintainer**: Cloud Infrastructure Team
