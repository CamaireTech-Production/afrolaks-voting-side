# Firebase SDK Installation & Setup - Frontend

## Step 1: Remove Supabase Dependencies

```bash
cd apps/frontend

# Remove Supabase packages
npm uninstall @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

## Step 2: Install Firebase SDK

```bash
npm install firebase
```

This installs the Firebase SDK with all necessary modules:
- `firebase/app` - Core Firebase
- `firebase/firestore` - Firestore database
- `firebase/auth` - Authentication
- `firebase/functions` - Cloud Functions client

## Step 3: Create Firebase Configuration File

Create `src/lib/firebase.ts` with your Firebase config (see next section)

## Step 4: Update Environment Variables

Copy your Firebase config from console.firebase.google.com into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Step 5: Verify Installation

```bash
# Check package.json
npm list firebase

# Try running dev server
npm run dev
```

You should see no errors and see "firebase" in node_modules.

---

## Troubleshooting

**Q: "firebase module not found"?**
A: Run `npm install firebase` again

**Q: "process.env variables undefined"?**
A: Make sure `.env.local` exists and variables start with `NEXT_PUBLIC_`

**Q: Dev server errors about Next.js?**
A: Run `npm run dev` from `apps/frontend` directory, not root

---

**Estimated Time**: 5 minutes
**Next Task**: 2.2 - Create custom Firebase hooks
