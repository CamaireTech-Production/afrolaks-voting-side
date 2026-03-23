# Firebase Project Setup Guide

## Step 1: Create Firebase Project

### 1.1 Create on Firebase Console
1. Go to: https://console.firebase.google.com
2. Click "Create a new project"
3. **Project Name**: `afrolaks-voting` (or similar)
4. **Location**: Select your region (recommend closest to Cameroon)
5. Accept terms and create project
6. **Important**: Take note of your **Project ID** - you'll need this

### 1.2 Create Web App
1. In Firebase Console, click the **Web icon** (</> symbol)
2. **App nickname**: `afrolaks-frontend`
3. Check "Also set up Firebase Cloud Functions"
4. Copy your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "afrolaks-voting.firebaseapp.com",
  projectId: "afrolaks-voting",
  storageBucket: "afrolaks-voting.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**Save this config** - you'll paste it into `.env.local`

### 1.3 Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. **Location**: Select same region as project
4. **Security Rules**: Choose "Start in test mode" (we'll secure later)
5. Click **Enable**

### 1.4 Enable Authentication
1. Go to **Authentication** tab
2. Click **Get started**
3. Enable **Email/Password** provider
4. Enable **Anonymous** (optional, for testing)
5. Save

### 1.5 Enable Cloud Functions
1. Go to **Cloud Functions** in Firebase Console
2. Click **Get started**
3. This will enable billing (but free tier covers MVP)

### 1.6 Create Admin SDK Credentials
1. Go to **Project Settings** (⚙️ icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Download the JSON file
5. **WARNING**: Keep this file PRIVATE - never commit to git
6. Rename to `firebase-admin-key.json`
7. Add to `.gitignore`

---

## Step 2: Create Admin App (Optional Admin Access)

If you want separate admin web app credentials:
1. In Firebase Console, create another Web App
   - **App nickname**: `afrolaks-admin`
2. Same process as 1.2 - copy config

---

## Step 3: Local Development Setup

### 3.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase
```bash
firebase login
```

### 3.3 Initialize Firebase in Project Root
```bash
firebase init
```

When prompted:
- **Which features?** Select: `Firestore`, `Functions`, `Hosting`
- **Project**: Select your `afrolaks-voting` project
- **Firestore rules file**: Accept default (`firestore.rules`)
- **Firestore indexes**: Accept default
- **Functions language**: Choose `TypeScript`
- **ESLint**: Choose `Yes`
- **Hosting**: Accept defaults

---

## ✅ Verification

After completing steps above, verify:

```bash
# Check Firebase config
firebase projects:list

# Should show your project
# Project: afrolaks-voting

# Login credentials
firebase auth:import # to manage users later

# Check Firestore is accessible
firebase firestore:locations
```

---

## 🔑 Environment Variables

Once you have configs, create:

### `.env.local` (Frontend)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### `.env` (Admin)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### `functions/.env.local` (Cloud Functions)
```
FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_KEY_PATH=./firebase-admin-key.json
```

---

## ⚠️ Important Security Notes

1. **Never commit** `firebase-admin-key.json` to git
2. **Never commit** `.env.local` or `.env` files
3. Use `.env.example` as template for team
4. Keep API keys private (they're public keys but restrict them in Firebase Console)

---

## 🚀 Next Steps

After completing this guide:
1. You'll have Firebase project ready
2. Move to **Task 1.2**: Create Firestore collections & seed data
3. Then **Task 1.3**: Setup security rules

**Expected Time**: 15-20 minutes

---

## 🆘 Troubleshooting

**Q: Can't login to Firebase CLI?**
A: Run `firebase logout` then `firebase login` again

**Q: Firestore not showing in Console?**
A: Refresh page or create first collection manually

**Q: Get "Project not found" error?**
A: Run `firebase use --add` and select correct project

**Q: Need different project IDs for dev/prod?**
A: Run `firebase use <project-id>` to switch

---

**Estimated Time**: 20 minutes
**Difficulty**: Easy
**Next Task**: 1.2 - Create Firestore Collections
