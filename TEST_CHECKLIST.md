# 📋 Test Checklist - Image Upload (Base64) & Nominations Fix

## ✅ Changes Made This Session

### 1. Base64 Image Conversion (NEW APPROACH)
- **No API endpoint needed!**
- **Method**: Convert images to base64 directly in the browser
- **Storage**: Base64 strings stored directly in Firestore `image` field
- **Benefit**: No files on server, no Firebase Storage subscription needed

### 2. Updated Image Upload Hook
- **File**: `/apps/admin/src/hooks/useImageUpload.ts`
- **Change**: Converts image files to base64 using FileReader API
- **Returns**: `{ url: "data:image/png;base64,..." , fileName: "..." }`
- **Storage**: Base64 URL stored directly in Firestore

### 3. Added Diagnostics to Dashboard
- **New Component**: `/apps/admin/src/components/FirestoreDiagnostics.tsx`
- **Shows**: Count of nominees, categories, and votes in Firestore
- **Helps**: Debug if data exists in Firestore or not

### 4. Added Detailed Logging
- **File**: `/apps/admin/src/hooks/useAdminNominees.ts`
- **Logs**: When hook initializes, when snapshot arrives, error details
- **Helps**: See in browser console what's happening with Firestore queries

---

## 🧪 Testing Instructions

### Step 1: Start Dev Servers
```bash
# Terminal 1: Frontend
cd apps/frontend
npm run dev        # Should start on http://localhost:3000

# Terminal 2: Admin Dashboard
cd apps/admin
npm run dev        # Should start on http://localhost:2030
```

### Step 2: Check Diagnostics
1. Open admin dashboard: http://localhost:2030
2. Login with your credentials
3. Go to **Dashboard** (home page)
4. Look for **"🔍 Diagnostics Firestore"** section
5. Check the counts:
   - **Nominees**: Should show > 0 if nominations exist
   - **Categories**: Should show > 0
   - **Votes**: Should show > 0

### Step 3: Test Image Upload
1. Go to **Admin > Nominations** (AdminNominees page)
2. Click **"Ajouter une Nomination"** button
3. Try to upload an image:
   - Click the upload area
   - Select a `.jpg` or `.png` file (file size: any size up to 5MB)
   - Wait for conversion to base64
   - Should show preview after conversion
   - Should NOT show any error

### Step 4: Check Browser Console
1. Open Browser DevTools: **F12**
2. Go to **Console** tab
3. Look for logs starting with:
   - 📤 `Conversion en base64: filename.jpg`
   - ✅ `Conversion réussie: filename.jpg`
   - 🔷 `useAdminNominees: Initialisation avec categoryId:`
   - ✅ `useAdminNominees: Snapshot reçu!`
   - 📊 `Nombre de documents: N`
4. **If you see ❌ errors**, note them and share

### Step 5: Check if Nominations Display
1. Go to **AdminNominees** page
2. Should see a grid of nomination cards with images
3. If empty, check Diagnostics count:
   - If count > 0 but grid is empty → display issue
   - If count = 0 → nominees don't exist yet

### Step 6: Test Full Cycle - Create Nomination with Image
1. Click **"Ajouter une Nomination"** button
2. Fill in the form:
   - **Name**: "Test Nominee"
   - **Bio**: "Test bio"
   - **Category**: Select one (or create new)
   - **Image**: Upload a small test image (JPG or PNG)
3. Image should convert to base64 and show preview
4. Click **"Enregistrer"** button
5. New nomination should appear in the grid
6. Image should display correctly

---

## 🔧 Troubleshooting

### Scenario A: Image upload shows spinner forever
**Problem**: Base64 conversion hanging
**Solution**:
- Try a smaller image file (< 1MB)
- Check browser console for errors
- Try a different file format (JPG instead of PNG)

### Scenario B: Image preview shows nothing
**Problem**: Base64 conversion worked but image not displaying
**Solution**:
- Check browser console for image load errors
- Verify base64 string starts with `data:image/`
- Try refreshing the page

### Scenario C: Diagnostics shows Nominees = 0
**Problem**: No nominees in Firestore yet
**Solution**:
- Create test nominations via the form
- Image upload is a required step in the form

### Scenario D: Diagnostics shows Nominees > 0, but grid empty
**Problem**: Data exists but not displaying
**Action**:
- Share browser console logs
- Check if there are any JavaScript errors

### Scenario E: Browser runs slow with images
**Problem**: Base64 strings are large in memory
**Note**: This is expected behavior - base64 is ~33% larger than binary
**Optimize**: Use smaller/compressed images

---

## 📝 Important Technical Details

### Base64 Approach
- ✅ **Pros**: No server files, no Firebase Storage, simple, self-contained
- ⚠️ **Cons**: Base64 is ~33% larger than binary, slower to transfer, slower to load

### Firestore Storage
With base64, your `nominees` & `gallery` documents will look like:
```json
{
  "id": "dj-spinall-001",
  "name": "DJ Spinall",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "categoryId": "best-dj"
}
```

### Browser Console Logs
Always check console (F12) to see:
- Image conversion progress
- Firestore data loading
- Any errors or warnings

---

## ✅ Success Indicators

- ✅ Diagnostics shows nominees > 0
- ✅ AdminNominees page displays grid with images
- ✅ Image upload converts to base64 without errors
- ✅ Can create nominations with image upload
- ✅ Images display correctly in preview and in cards
- ✅ Console shows no JavaScript errors

---

## 🚀 Next Steps

After confirming these tests work:
1. **Test all CRUD operations**: Categories, Podcasts, Gallery, Contacts
2. **Verify Firestore data**: Check Firestore console to see base64 fields
3. **Move to Phase 2**: CamPay Payment Integration

---

**Rate Limiting Note**: Images are converted client-side, so there's no server rate-limiting. Each image upload is instant (once conversion is done).
