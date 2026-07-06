# ─── Deployment Operations Guide ────────────────────────────────────────

## 1. Wipe Git History (Create Clean Initial Commit)

```bash
# Navigate to the web subdirectory
cd web

# Remove existing .git history
rm -rf .git

# Initialize a fresh repository
git init
git checkout -b main

# Stage all files
git add -A

# Create the clean initial commit
git commit -m "Initial commit: Production release v1.0.0

Matir Rajjo (মাটির রাজ্য) - Premium Bangladeshi Clay Products E-commerce

- Next.js 14+ with TypeScript, Tailwind CSS, Framer Motion
- Firebase Auth, Firestore, Hosting
- Cloudinary Media Management
- Psychology-driven UX (Goal Gradient, Zeigarnik, Labor Illusion, Urgency)
- WhatsApp-based checkout flow"
```

## 2. Environment Variables for Deployment Pipeline

### Firebase Cloud Build / GitHub Actions

```bash
# Create .github/workflows/deploy.yml in the repository root
mkdir -p .github/workflows
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
    paths:
      - "web/**"
      - ".github/workflows/deploy.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./web

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
          cache-dependency-path: ./web/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Create .env.local from GitHub Secrets
        run: |
          echo "NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${{ secrets.FIREBASE_STORAGE_BUCKET }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.FIREBASE_APP_ID }}" >> .env.local
          echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${{ secrets.FIREBASE_MEASUREMENT_ID }}" >> .env.local
          echo "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${{ secrets.CLOUDINARY_CLOUD_NAME }}" >> .env.local
          echo "NEXT_PUBLIC_CLOUDINARY_API_KEY=${{ secrets.CLOUDINARY_API_KEY }}" >> .env.local
          echo "CLOUDINARY_API_SECRET=${{ secrets.CLOUDINARY_API_SECRET }}" >> .env.local

      - name: Build project
        run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          projectId: matirrajjo-5a6c5
          entryPoint: ./web
          channelId: live
```

### Required GitHub Secrets

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_API_KEY` | From Firebase Console > Project Settings |
| `FIREBASE_AUTH_DOMAIN` | matirrajjo-5a6c5.firebaseapp.com |
| `FIREBASE_PROJECT_ID` | matirrajjo-5a6c5 |
| `FIREBASE_STORAGE_BUCKET` | matirrajjo-5a6c5.firebasestorage.app |
| `FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console |
| `FIREBASE_APP_ID` | From Firebase Console |
| `FIREBASE_MEASUREMENT_ID` | From Firebase Console |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `FIREBASE_SERVICE_ACCOUNT` | JSON key from Firebase Admin SDK |

## 3. Firebase Hosting Deployment (Manual)

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Authenticate
firebase login

# Deploy to production
firebase deploy --only hosting

# Deploy Firestore rules + indexes
firebase deploy --only firestore:rules,firestore:indexes
```

## 4. Post-Deployment Checklist

- [ ] Verify custom domain resolves correctly
- [ ] Test Google OAuth login flow
- [ ] Test WhatsApp checkout flow
- [ ] Verify Cloudinary image uploads work
- [ ] Check Firestore rules are enforced
- [ ] Verify sitemap.xml renders at /sitemap.xml
- [ ] Test robots.txt blocks /admin/ and /api/
- [ ] Run Lighthouse audit (target: 90+ Performance, 100 Accessibility)
- [ ] Submit sitemap to Google Search Console
