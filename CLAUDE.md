# 🔥 AFROLAKS VOTING PLATFORM - Project Instructions

## Project Overview
**Afrolaks** is a comprehensive nightlife awards voting platform celebrating African excellence in DJ, MC, Influencer, and Event Organizer categories. Users can vote by paying via mobile money (XAF), with a goal of transparent, community-driven recognition.

**Stack**: Next.js 15 (Frontend) + Vite/React 18 (Admin) + Firebase (Backend) + CamPay (Payments)

---

## 🎯 Current Status & Roadmap

### ✅ Completed
- Frontend UI/UX (Next.js 15.5.12 with Turbopack)
- Admin dashboard structure (Vite + React 18)
- Design system & branding (Afrolaks colors + animations)
- Navigation & page layouts
- Mock data structures (categories, nominees, podcast episodes)

### 🔄 In Progress
- **Phase 1: Backend Infrastructure**
  - Replace Supabase with Firebase (Firestore + Auth)
  - Implement complete CRUD operations
  - Remove all mock data
  - Create API layer with proper validation

- **Phase 2: Payment Integration**
  - Integrate CamPay for XAF mobile money payments
  - Implement vote transaction recording
  - Payment status tracking & webhooks

---

## 📂 Project Structure

```
afrolaks-voting-side/
├── apps/
│   ├── frontend/               (Next.js 15 - Public App)
│   │   ├── src/
│   │   │   ├── app/            (Pages: home, awards, podcast, contact)
│   │   │   ├── components/     (UI + Business logic)
│   │   │   ├── lib/            (Utilities: supabase-->firebase)
│   │   │   └── styles/         (Global CSS, theme)
│   │   ├── next.config.ts      (static export: output: 'export')
│   │   └── package.json        (React 19.1.0)
│   │
│   └── admin/                  (Vite + React 18 - Admin Dashboard)
│       ├── src/
│       │   ├── app/            (Router, routes)
│       │   ├── pages/          (Login, Dashboard)
│       │   ├── components/     (UI components)
│       │   ├── hooks/          (useAuth)
│       │   └── lib/            (supabase-->firebase)
│       ├── vite.config.ts      (port: 2030)
│       └── package.json        (React 18.3.1)
│
└── CLAUDE.md                   (This file - Project instructions)
```

---

## 🏢 Data Models (Firebase Firestore)

### Collections & Documents

#### 1. **categories**
```typescript
{
  id: string;              // 'best-dj', 'hype-mc', 'influencer', 'event-organizer'
  name: string;            // 'Best DJ', 'Hype MC of the Year', etc
  description: string;     // 'Recognizing the finest turntable maestros'
  icon: string;            // Icon name or emoji (store as string)
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### 2. **nominees**
```typescript
{
  id: string;              // unique ID
  name: string;            // 'DJ Spinall', 'Toke Makinwa', etc
  bio: string;             // 'The Party Starter', 'Media Mogul'
  image: string;           // URL to image (Unsplash or CDN)
  categoryId: string;      // reference to categories.id
  voteCount: number;       // total votes received (default: 0)
  createdAt: timestamp;
  updatedAt: timestamp;
  isActive: boolean;       // for soft deletes/management
}
```

#### 3. **votes**
```typescript
{
  id: string;              // unique vote ID
  nomineeId: string;       // reference to nominees.id
  categoryId: string;      // reference to categories.id
  voteCount: number;       // number of votes cast (1 or more)
  amountXAF: number;       // total amount paid (voteCount * 100)
  transactionId: string;   // CamPay transaction ID
  paymentStatus: enum;     // 'pending' | 'completed' | 'failed'
  userEmail?: string;      // optional user identifier
  timestamp: timestamp;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  };
}
```

#### 4. **podcasts**
```typescript
{
  id: string;
  episodeNumber: number;
  title: string;
  guest: string;
  duration: string;        // '45 min'
  description?: string;
  audioUrl?: string;       // for future audio hosting
  spotifyLink?: string;
  order: number;           // for sorting
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### 5. **galleryImages** (Optional)
```typescript
{
  id: string;
  url: string;
  alt: string;
  order: number;           // for sorting
  category?: string;       // 'event', 'gallery', etc
  createdAt: timestamp;
}
```

#### 6. **contactSubmissions**
```typescript
{
  id: string;
  name: string;
  email: string;
  subject: string;         // 'voting', 'partnership', 'media', etc
  message: string;
  timestamp: timestamp;
  status: enum;            // 'new' | 'read' | 'replied'
  response?: string;
}
```

---

## 🔑 Key Features & Flows

### 1. Voting Flow (NO LOGIN REQUIRED!)
```
User visits /awards (NO LOGIN NEEDED!)
  ↓
Select Category (Best DJ, Hype MC, Influencer, Event Organizer)
  ↓
Browse nominees in category
  ↓
Click "Vote" on nominee
  ↓
VoteModal opens with payment flow:
   - Select vote quantity (1, 2, 3, ... n votes)
   - Calculate total: voteCount × 100 XAF
   - Click "Pay X XAF"
  ↓
Redirect to CamPay payment gateway
  ↓
User completes payment via mobile money (XAF)
  ↓
CamPay webhook → Backend records vote if payment successful
  ↓
Success screen with share options (Instagram, TikTok)

IMPORTANT:
- Any visitor can vote without login/registration
- A single person can vote unlimited times if they pay each time
- No login limits = transparent, no barriers to participation
- CamPay payment is the only requirement
```

### 2. Admin Functions
- View all votes in real-time
- Manage categories
- Add/edit nominees
- View voting analytics
- Moderate contact submissions

### 3. Public Pages
- **/** - Home hero + features + podcast + call-to-action
- **/awards** - Category selection + nominee voting
- **/podcast** - Podcast episode listings
- **/contact** - Contact form submission

---

## 🔐 Firebase Setup Requirements

### 1. Firestore Database
- Create project in Firebase Console
- Enable Firestore in native mode (not datastore)
- Set security rules (allow public reads except votes)

### 2. Authentication
- **Voters**: NO LOGIN REQUIRED - Anyone can vote without authentication
- **Admin**: Email/Password auth required to access admin dashboard
- **Custom Claims**: Admin users get `admin: true` custom claim
- **No Session Storage**: Voters don't need cookies/sessions
- **Important**: Vote validation happens via CamPay payment confirmation

### 3. Environment Variables
**Frontend (.env.local)**:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Admin (.env)**:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**Backend/API Routes (.env for Vercel)**:
```
# Firebase Admin SDK (for Next.js API routes)
FIREBASE_PRIVATE_KEY=...         # From Firebase Service Account
FIREBASE_CLIENT_EMAIL=...        # From Firebase Service Account

# CamPay Integration (Phase 2)
CAMPAY_API_KEY=...
CAMPAY_SECRET_KEY=...
CAMPAY_USERNAME=...
CAMPAY_WEBHOOK_SECRET=...
```

---

## 💳 CamPay Integration Details

### Payment Flow
1. **Frontend**: User clicks "Pay X XAF"
2. **Backend**: Create CamPay payment request
3. **CamPay**: Redirect user to payment UI or mobile money app
4. **Backend**: Receive webhook callback with status
5. **Firestore**: Record vote when payment confirmed
6. **Frontend**: Show success screen

### CamPay Endpoints
- **Create Payment**: POST `/api/payments` → CamPay API
- **Webhook Handler**: POST `/api/webhooks/campay` ← CamPay
- **Check Status**: GET `/api/payments/{transactionId}/status`

---

## 🛠️ Development Workflow

### Frontend Development
```bash
cd apps/frontend
npm run dev          # Dev server on localhost:3000 (Turbopack)
npm run build        # Build static export
npm run lint         # Check code quality
```

### Admin Development
```bash
cd apps/admin
npm run dev          # Dev server on localhost:2030
npm run build        # Build for production
```

### Important Notes
- Frontend uses **Server-Side Rendering** for API routes support (removed static export)
- API routes deployed **free on Vercel** (no Cloud Functions costs)
- All server operations use Firebase Admin SDK in API routes
- Admin dashboard has server-side auth verification

---

## 📋 Naming Conventions & Standards

### Files & Folders
- UPPERCASE for directories: `/components/UI`, `/pages/Admin`
- kebab-case for component files: `vote-modal.tsx`, `image-with-fallback.tsx`
- PascalCase for React components (export): `export function VoteModal() {}`
- camelCase for utilities: `useAuth.ts`, `formatVotes.ts`

### Database
- Collection names: **lowercase plural** → `nominees`, `categories`, `votes`
- Document IDs: **auto-generated or meaningful** → `best-dj`, `dj-spinall-001`
- Field names: **camelCase** → `voteCount`, `createdAt`, `isActive`

### Components
- UI components: `@/components/UI/button.tsx`
- Business logic: `@/components/VoteModal.tsx`
- Hooks: `@/hooks/useAuth.ts`, `@/hooks/useVotes.ts`
- Types: declare inline or in `@/types/index.ts`

### Colors (Afrolaks Branding)
```
Primary Red:    #FF0000
Primary Orange: #FF6A01
Primary Gold:   #FFBD01
Background:     #000000 (black)
Text:           #FFFFFF (white)
Muted:          #CCCCCC (light gray)
```

---

## 🚀 Deployment Strategy

### Frontend (Next.js with API Routes)
- **Platform**: Vercel (fully free tier)
- **Command**: `npm run build` → outputs `.next/` directory
- **API Routes**: Included (no extra cost)
- **Features**: Server-side rendering + static optimization

### Admin Dashboard (Vite)
- **Platform**: Vercel, Netlify, or Firebase Hosting
- **Command**: `npm run build` → outputs `dist/` directory

### Backend (Next.js API Routes)
- **Platform**: Vercel (same deployment as frontend)
- **Runtime**: Node.js (managed by Vercel)
- **Endpoints**:
  - `POST /api/votes` - Record votes in Firestore
  - `POST /api/contact` - Save contact submissions
  - `POST /api/payments` - CamPay integration (Phase 2)
- **Credentials**: Added via Vercel dashboard environment variables

### CamPay Webhooks
- **Endpoint**: `https://api.afrolaks.com/webhooks/campay`
- **Auth**: HMAC-SHA256 verification against `CAMPAY_WEBHOOK_SECRET`

---

## ⚠️ Critical Notes

### Things to Remember
1. ✅ **Remove mock data** completely from components
2. ✅ **Fetch data from Firestore** via custom hooks
3. ✅ **Validate all inputs** on frontend + backend
4. ✅ **Use Cloud Functions for sensitive operations** (payment handling, vote recording)
5. ✅ **NEVER expose private keys** in frontend code
6. ✅ **Test CamPay integration** in sandbox mode first
7. ✅ **Implement proper error handling** for payment failures
8. ✅ **Use rate limiting** on vote endpoints to prevent abuse

### Security Checklist
- [ ] Firebase security rules restrict vote creation
- [ ] Only Cloud Functions can write to votes collection
- [ ] CamPay webhook signature is verified
- [ ] Admin users have custom claims in Firebase Auth
- [ ] Contact form submissions are rate-limited
- [ ] Sensitive environment variables use Cloud Build secrets

---

## 📞 Contact & Support
- **Email**: Afrolaks.cm@gmail.com
- **Instagram**: @afrolaks.cm
- **TikTok**: @afrolaks.cameroon

---

## 📝 Version History
- **v0.1.0** - Initial project setup with mock data
- **v0.2.0** - Phase 1: Backend infrastructure (Firebase + CRUD)
- **v0.3.0** - Phase 2: Payment integration (CamPay)
- **v1.0.0** - Production launch

---

**Last Updated**: 2026-03-23
**Maintained By**: Claude AI Code Assistant
