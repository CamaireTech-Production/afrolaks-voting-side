# Firebase Setup Guide - STAGE 1.1

## Overview
This guide walks you through setting up Firebase for Afrolaks voting platform.

**Time**: ~30-45 minutes
**Prerequisites**: Google account, Firebase project

---

## Step 1: Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com)**
2. Click **"Create a project"**
3. Enter project name: `afrolaks-voting` (or similar)
4. Click **"Continue"**
5. Disable Google Analytics (optional, for MVP)
6. Click **"Create project"**
7. Wait for provisioning (~1-2 minutes)

---

## Step 2: Create Web App

1. In Firebase Console, click **"+ Add app"** → **"Web"**
2. App nickname: `Afrolaks Frontend`
3. Check "Also set up Firebase Hosting"
4. Click **"Register app"**
5. **COPY ALL CREDENTIALS** (you'll see a config object)
6. Paste into `.env.local` template below

### Example Config to Copy:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxx",
  authDomain: "afrolaks-voting.firebaseapp.com",
  projectId: "afrolaks-voting",
  storageBucket: "afrolaks-voting.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890"
};
```

---

## Step 3: Enable Firestore Database

1. In Firebase Console, click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose location: **"europe-west1"** (or closest to your users)
5. Click **"Create"**
6. Wait for creation (~1 minute)

---

## Step 4: Deploy Firestore Security Rules

1. Install Firebase CLI (if not already)
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project root
   ```bash
   firebase init firestore
   ```
   - Choose your Firebase project
   - Accept default `firestore.rules` path
   - Accept default `firestore.indexes.json` path

4. **IMPORTANT**: Copy security rules from `/firebase/firestore.rules` to your project root `firestore.rules`

5. Deploy rules
   ```bash
   firebase deploy --only firestore:rules
   ```

✅ Rules deployed successfully!

---

## Step 5: Enable Firebase Authentication

1. In Firebase Console, click **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Select **"Email/Password"** provider
4. Toggle **"Enable"** → **"Save"**
5. (Optional) Add test user credentials for testing

---

## Step 6: Setup Environment Variables

### Frontend (Next.js)

Create `.env.local` in `apps/frontend/`:

```env
# .env.local - NEXT.JS FRONTEND
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

### Admin (Vite)

Create `.env` in `apps/admin/`:

```env
# .env - ADMIN DASHBOARD (VITE)
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

❌ **NEVER commit these files to git!** (Already in .gitignore)

---

## Step 7: Create Firestore Collections & Seed Data

### Option A: Firebase Console (Manual - 10 minutes)

1. Go to **Firestore Database** → **Collections**
2. Click **"+ Create collection"**
3. Create these collections:
   - `categories`
   - `nominees`
   - `votes`
   - `podcasts`
   - `galleryImages`
   - `contactSubmissions`

4. For each collection except `votes`:
   - Click **"+ Start collection"**
   - Accept auto-generated IDs
   - Add sample documents from `/firebase/seed-data.json`

### Option B: Firebase Admin SDK (Automated - 2 minutes)

Coming in next task! We'll create a seeding script.

---

## Step 8: Verify Setup

### Test Firestore Access

1. Open Firebase Console → Firestore
2. Try to read a document (should succeed)
3. Try to write a document from console (might fail due to security rules - that's correct!)

### Test Environment Variables

Frontend:
```bash
cd apps/frontend
npm install  # if not done yet
# Open browser console, Firebase should load
```

Admin:
```bash
cd apps/admin
npm install  # if not done yet
npm run dev
# Should not show Firebase config errors
```

---

## Step 9: (Optional) Setup Emulator for Development

Firebase Emulator allows local testing without hitting production database.

### Install Emulator
```bash
npm install -g firebase-tools
firebase emulators:start
```

This starts:
- Firestore Emulator: `localhost:8080`
- Auth Emulator: `localhost:9099`

### Use Emulator in Code

In `src/lib/firebase.ts`:
```typescript
if (process.env.NODE_ENV === 'development') {
  enableEmulators();
}
```

---

## Troubleshooting

### "Cannot find module 'firebase'"
```bash
# Install Firebase SDK
cd apps/frontend  # or apps/admin
npm install firebase
```

### "Firebase not initialized"
- Check `.env.local` or `.env` has all required variables
- Verify projectId and authDomain are set
- Restart dev server after .env changes

### "Permission denied" on Firestore reads
- Security rules may be blocking reads
- Check `/firebase/firestore.rules` is deployed
- Rule should allow public reads for categories/nominees

### "Firestore API not enabled"
- Go to Firebase Console
- Search "Firestore API"
- Click "Enable"

---

## Next Steps

After setup is complete:

1. ✅ Firebase project created
2. ✅ Firestore collections exist
3. ✅ Security rules deployed
4. ⏭️ **Next**: Seed data & create custom hooks (Stage 1.2)

---

## Quick Reference

**Firebase Console**: https://console.firebase.google.com/project/YOUR_PROJECT_ID

**Key Credentials Location**:
- Project Settings → Service Accounts → Generate new private key (for Cloud Functions)
- Project Settings → General → Web app config (for frontend/admin)

**File Locations**:
- Frontend env: `apps/frontend/.env.local`
- Admin env: `apps/admin/.env`
- Firestore rules: `firebase/firestore.rules`
- Seed data: `firebase/seed-data.json`

---

**Setup Time**: ~45 minutes
**Status**: Ready to proceed to Stage 1.2

For questions, refer to:
- [Firebase Docs](https://firebase.google.com/docs)
- [PHASE1_ACTION_PLAN.md](../../PHASE1_ACTION_PLAN.md)
