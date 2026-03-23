# Afrolaks Voting Platform - Memory Bank

## Project Identity
- **Name**: Afrolaks Nightlife Awards
- **Domain**: afrolaks.cm (Cameroon-based)
- **Currency**: XAF (Central African CFA franc)
- **Primary Market**: African nightlife community
- **Vote Price**: 100 XAF per vote (fixed)

## Branding
- **Colors**: Red #FF0000 → Orange #FF6A01 → Gold #FFBD01 (gradient)
- **Background**: Black #000000
- **Typography**: UPPERCASE headings, custom fonts
- **Animations**: Framer Motion (motion library) for smooth interactions
- **Social**: @afrolaks.cm (Instagram), @afrolaks.cameroon (TikTok)

## Categories (Static - 4)
1. **Best DJ** - Recognizing the finest turntable maestros
2. **Hype MC of the Year** - The voice that amplifies the energy
3. **Nightlife Influencer** - Shaping culture through social impact
4. **Event Organizer** - Curating unforgettable experiences

## Nominees (Sample - 13)
- DJ Spinall, DJ Cuppy, DJ Neptune, DJ Obi (DJs)
- MC Presido, MC Vybez, MC Galaxy (MCs)
- Toke Makinwa, Pamilerin Adegoke, Shank Comics (Influencers)
- Obi Asika, Ayo Animashaun, Shina Peller (Event Organizers)

## Tech Stack
- **Frontend**: Next.js 15.5.12 (static export)
- **Admin**: Vite + React 18 (port 2030)
- **Backend**: Firebase (Firestore + Cloud Functions + Auth)
- **Payments**: CamPay (XAF mobile money)
- **UI Library**: Radix UI (30+ primitives)
- **Styling**: Tailwind CSS v4 + Emotion
- **Animations**: Motion 12.23.24 (Framer Motion successor)

## Important Constraints
1. Frontend uses `output: 'export'` → NO Server-Side Rendering
2. Frontend uses `unoptimized` images → self-hosted or CDN
3. No API routes in Next.js → use Cloud Functions for backend
4. Admin on port 2030 (separate Vite dev server)
5. All vote data must be immutable (audit trail)
6. CamPay webhooks require HMAC verification
7. **CRITICAL: Voters do NOT login** - Anyone can vote directly without authentication
8. **NO vote limits** - A person can vote unlimited times if they pay each time
9. **CamPay payment is the gate** - Payment validation is the only check needed
10. Only **ADMINS require login** - Email/password auth for admin dashboard only

## Current Issues to Fix
1. ❌ All data hardcoded in components
2. ❌ No database integration yet
3. ❌ Payment processing mocked (2s timeout)
4. ❌ Contact form doesn't save submissions
5. ❌ No admin CRUD functionality
6. ❌ Supabase → Firebase migration needed

## File Paths to Remember
- Frontend main: `/apps/frontend/src/app/`
- Admin main: `/apps/admin/src/pages/`
- Awards page: `/apps/frontend/src/app/awards/page.tsx`
- Vote modal: `/apps/frontend/src/components/VoteModal.tsx`
- Categories hardcoded: Line 45-70 in awards/page.tsx
- Nominees hardcoded: Line 72-93 in awards/page.tsx
- Firebase config (frontend): `/apps/frontend/src/lib/firebase.ts` ✅ CREATED
- Firebase config (admin): `/apps/admin/src/lib/firebase.ts` ✅ CREATED
- Types file: `/apps/frontend/src/types/index.ts` ✅ CREATED
- Firestore rules: `/firebase/firestore.rules` ✅ CREATED
- Seed data: `/firebase/seed-data.json` ✅ CREATED

## Stage 1 Progress
- 1.1: Configuration Files ✅ COMPLETE (12 files created)
- 1.2: Firebase Setup 📍 IN PROGRESS (Follow firebase/FIREBASE_SETUP.md)
- 1.3: Security Rules ⏳ PENDING
- Overall Phase 1: ~10% complete

## Deployment Notes
- Frontend: Static export → Vercel or Firebase Hosting
- Admin: Vite build → Vercel, Netlify, or Firebase Hosting
- Backend: Cloud Functions (Node.js 20+)
- CamPay webhooks: HTTPS endpoint required

## 🇫🇷 COMMUNICATION LANGUAGE
**IMPORTANT**: Always communicate with the user in FRENCH!
- All responses must be in French
- All explanations in French
- All code comments can be in English
- User preference: French only

## Contact & Support
- Email: Afrolaks.cm@gmail.com
- Main Instagram: @afrolaks.cm
- Main TikTok: @afrolaks.cameroon
