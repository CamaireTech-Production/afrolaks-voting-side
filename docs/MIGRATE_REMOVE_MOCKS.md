# Stage 2.3: Remove Mock Data & Integrate Firestore

**Duration**: 4-5 hours
**Status**: In Progress
**Objective**: Replace all hardcoded data with real Firestore queries

---

## Overview

Currently, the frontend has hardcoded data in components:
- **Categories**: hardcoded in `/awards/page.tsx`
- **Nominees**: hardcoded array in `/awards/page.tsx`
- **Podcasts**: hardcoded in `/page.tsx`
- **Gallery Images**: hardcoded paths in multiple pages

**Task**: Replace all with real Firestore queries using the new custom hooks.

---

## Files to Update

### 1. **`apps/frontend/src/app/awards/page.tsx`** (CRITICAL)

#### Current State
```typescript
// Lines 45-70: Hardcoded categories
const categories = [
  { id: 'best-dj', name: 'Best DJ', ... },
  { id: 'hype-mc', name: 'Hype MC of the Year', ... },
  ...
];

// Lines 72-93: Hardcoded nominees
const nominees = [
  { id: 'dj-spinall', name: 'DJ Spinall', categoryId: 'best-dj', ... },
  { id: 'dj-cuppy', name: 'DJ Cuppy', categoryId: 'best-dj', ... },
  ...
];

// Inside JSX: render hardcoded data
{categories.map(cat => <CategoryCard key={cat.id} {...cat} />)}
{selectedCategory && nominees
  .filter(n => n.categoryId === selectedCategory)
  .map(n => <NomineeCard key={n.id} {...n} />)}
```

#### Required Changes
1. Remove categories & nominees arrays
2. Import custom hooks: `useCategories()` & `useNominees()`
3. Add loading/error states
4. Fetch data from Firestore
5. Update vote modal to use `useVote()` hook

#### Implementation Steps

**Step 1: Add imports at top of file**
```typescript
'use client';

import { useCategories } from '@/hooks/useCategories';
import { useNominees } from '@/hooks/useNominees';
import { useVote } from '@/hooks/useVote';
import { useState } from 'react';
```

**Step 2: Replace component logic**
```typescript
export default function Awards() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { nominees, loading: nomineesLoading, error: nomineesError } = useNominees(selectedCategory || undefined);
  const { submit: submitVote, loading: voteLoading, error: voteError } = useVote();

  // Get nominees for selected category
  const selectedNominees = selectedCategory
    ? nominees.filter(n => n.categoryId === selectedCategory)
    : [];

  // Handle vote submission
  const handleVote = async (nomineeId: string) => {
    if (!selectedCategory) return;

    const result = await submitVote({
      nomineeId,
      categoryId: selectedCategory,
      voteCount: 1, // or get from vote modal
    });

    if (result.success) {
      // Show success screen with transactionId
      console.log('Vote successful:', result.transactionId);
    } else {
      // Show error
      console.error('Vote failed:', result.error);
    }
  };

  // Loading state
  if (categoriesLoading) return <LoadingSkeletons />;

  // Error state
  if (categoriesError) return <ErrorMessage error={categoriesError} />;

  // Render with real data
  return (
    <>
      {/* Categories */}
      {categories.map(cat => (
        <CategoryCard
          key={cat.id}
          {...cat}
          selected={selectedCategory === cat.id}
          onClick={() => setSelectedCategory(cat.id)}
        />
      ))}

      {/* Nominees for selected category */}
      {selectedCategory && (
        <>
          {nomineesLoading && <LoadingSkeletons />}
          {nomineesError && <ErrorMessage error={nomineesError} />}
          {!nomineesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedNominees.map(nominee => (
                <NomineeCard
                  key={nominee.id}
                  {...nominee}
                  onVote={() => openVoteModal(nominee)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Vote Modal */}
      <VoteModal
        isOpen={voteModalOpen}
        nominee={selectedNominee}
        onSubmit={handleVote}
        loading={voteLoading}
        error={voteError}
        onClose={() => setVoteModalOpen(false)}
      />
    </>
  );
}
```

**Step 3: Remove hardcoded arrays**
- Delete `const categories = [...]` (lines ~45-70)
- Delete `const nominees = [...]` (lines ~72-93)

---

### 2. **`apps/frontend/src/app/page.tsx`** (Home Page)

#### Current State
```typescript
// Hardcoded podcast episodes
const episodes = [
  { episodeNumber: 1, title: 'The Art of the DJ', guest: 'DJ Spinall', ... },
  ...
];

// Hardcoded gallery images
const images = [
  { src: '/image1.jpg', alt: '...' },
  ...
];
```

#### Required Changes
1. Import `usePodcasts()` & `useGalleryImages()`
2. Replace hardcoded data with Firestore queries
3. Update JSX to use real data

#### Implementation
```typescript
'use client';

import { usePodcasts } from '@/hooks/usePodcasts';
import { useGalleryImages } from '@/hooks/useGalleryImages';

export default function Home() {
  const { podcasts, loading: podcastsLoading } = usePodcasts();
  const { images, loading: imagesLoading } = useGalleryImages();

  // Render with real data
  return (
    <>
      {/* Podcast Section */}
      {podcastsLoading ? (
        <SkeletonLoader count={5} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {podcasts.map(episode => (
            <PodcastCard key={episode.id} {...episode} />
          ))}
        </div>
      )}

      {/* Gallery Section */}
      {imagesLoading ? (
        <ImageSkeletons />
      ) : (
        <Gallery images={images} />
      )}
    </>
  );
}
```

---

### 3. **`apps/frontend/src/app/contact/page.tsx`** (Contact Page)

#### Current State
```typescript
const handleSubmit = (e) => {
  e.preventDefault();
  // Simulate form submission (2s timeout)
  setSubmitted(true);
  setTimeout(() => { ... }, 3000);
};
```

#### Required Changes
1. Create `useContact()` hook OR call Cloud Function directly
2. Replace mock submission with real Firestore write

#### Implementation
```typescript
'use client';

import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Call Cloud Function
      const submitContact = httpsCallable(functions, 'submitContact');
      const result = await submitContact(formData);

      if (result.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Auto-reset after 3s
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        setError(result.data.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('Failed to submit contact form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ... rest of component
}
```

---

### 4. **`apps/frontend/src/components/VoteModal.tsx`** (Vote Modal)

#### Current State
```typescript
const handleSubmit = (e) => {
  e.preventDefault();
  // Mock payment: setTimeout(2s) then show success
  setLoading(true);
  setTimeout(() => {
    setSuccess(true);
    // ...
  }, 2000);
};
```

#### Required Changes
1. Replace mock setTimeout with real `useVote()` call
2. Handle actual payment flow (placeholder for Phase 2)

#### Implementation
```typescript
'use client';

import { useState } from 'react';
import { useVote } from '@/hooks/useVote';

interface VoteModalProps {
  isOpen: boolean;
  nominee: { id: string; categoryId: string; name: string };
  onClose: () => void;
  onSuccess?: (transactionId: string) => void;
}

export function VoteModal({ isOpen, nominee, onClose, onSuccess }: VoteModalProps) {
  const [voteCount, setVoteCount] = useState(1);
  const [step, setStep] = useState<'amount' | 'success' | 'error'>('amount');
  const { submit, loading, error, success } = useVote();

  const handleVote = async () => {
    const result = await submit({
      nomineeId: nominee.id,
      categoryId: nominee.categoryId,
      voteCount,
    });

    if (result.success) {
      setStep('success');
      onSuccess?.(result.transactionId);
    } else {
      setStep('error');
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {step === 'amount' && (
          <div className="space-y-6">
            <h2>Vote for {nominee.name}</h2>
            <p>Select number of votes (100 XAF each)</p>
            <input
              type="number"
              min="1"
              max="100"
              value={voteCount}
              onChange={(e) => setVoteCount(parseInt(e.target.value))}
            />
            <p className="text-lg font-bold">
              Total: {voteCount * 100} XAF
            </p>
            <button
              onClick={handleVote}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#FF0000] to-[#FFBD01]"
            >
              {loading ? 'Submitting...' : `Pay ${voteCount * 100} XAF`}
            </button>
            {error && <ErrorAlert message={error} />}
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <h2>Vote Submitted!</h2>
            <p>Thank you for voting for {nominee.name}</p>
            <p className="text-sm text-gray-500">
              Transaction ID: {success ? 'generated' : 'pending'}
            </p>
            <button onClick={onClose} className="w-full py-3 bg-green-500">
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## Checklist

After updating each file:

- [ ] **awards/page.tsx**
  - [ ] Removed hardcoded categories
  - [ ] Removed hardcoded nominees
  - [ ] Added useCategories() hook
  - [ ] Added useNominees() hook
  - [ ] Loading states working
  - [ ] Error states working
  - [ ] Vote submission works

- [ ] **page.tsx (Home)**
  - [ ] Removed hardcoded podcasts
  - [ ] Removed hardcoded gallery images
  - [ ] Added usePodcasts() hook
  - [ ] Added useGalleryImages() hook
  - [ ] Data displays correctly

- [ ] **contact/page.tsx**
  - [ ] Form submission calls Cloud Function
  - [ ] Data saved to Firestore
  - [ ] Success/error feedback shown

- [ ] **VoteModal.tsx**
  - [ ] Uses useVote() hook
  - [ ] Calls submitVote() function
  - [ ] Shows loading state
  - [ ] Handles errors properly
  - [ ] Shows success with transaction ID

---

## Verification

After completing all updates, verify:

```bash
cd apps/frontend

# Check for build errors
npm run build

# Or start dev server and test manually
npm run dev

# Visit: http://localhost:3000
# Check:
# - /awards loads and shows real categories/nominees
# - /podcast shows real episodes
# - / shows real gallery images
# - Contact form can submit
# - Voting modal works
```

---

## Common Issues & Solutions

**Q: "TS2339: Property 'categoryId' does not exist"**
A: Make sure your Firestore document has `categoryId` field. Check `firebase-seed-data.json`

**Q: "Cannot find module '@/hooks/useCategories'"**
A: Make sure file path is correct: `apps/frontend/src/hooks/useCategories.ts`

**Q: Data not loading (infinite loading state)**
A: Check Firebase config in `.env.local`. Verify Firestore collections exist with correct data.

**Q: Vote submission fails**
A: Cloud Function may not be deployed yet. Check Stage 4 tasks.

---

**Estimated Time**: 4-5 hours
**Next Task**: Stage 3.1 - Migrate Admin to Firebase

