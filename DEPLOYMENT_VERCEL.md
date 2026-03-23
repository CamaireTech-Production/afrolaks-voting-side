# 🚀 Deployment Guide - Vercel (Free Tier)

## Overview
Le backend (API routes) est maintenant dans **Next.js** et sera déployé gratuitement sur **Vercel**.
- ✅ Frontend + Backend dans un seul projet
- ✅ API routes déployées automatiquement
- ✅ Gratuit (Vercel hobby tier)

## 📋 Prérequis
1. Compte **Vercel** (créé gratuitement via GitHub)
2. Projet **GitHub** pour la synchronisation
3. Firebase Admin SDK credentials

## 🔧 Étape 1: Générer Firebase Admin Credentials

### 1.1 Aller dans Firebase Console
```
https://console.firebase.google.com/project/afrolaks-5eaaa/settings/serviceaccounts/adminsdk
```

### 1.2 Cliquer sur "Générer une nouvelle clé privée"
- Télécharger le fichier JSON
- **Ne pas le commit sur Git!**

### 1.3 Extraire les valeurs
Le fichier contient:
```json
{
  "type": "service_account",
  "project_id": "afrolaks-5eaaa",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-..@afrolaks-5eaaa.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "..."
}
```

## 🚀 Étape 2: Déployer sur Vercel

### 2.1 Installer Vercel CLI
```bash
npm install -g @vercel/cli
```

### 2.2 Depuis le répertoire racine du projet
```bash
cd /home/bello-dev/CamaireTech/afrolaks-voting-side
vercel
```

### 2.3 Suivre les instructions
- Connectez-vous avec GitHub
- Sélectionnez le dossier racine (.)
- Acceptez les paramètres proposés

### 2.4 Ajouter les variables d'environnement

Après déploiement initial, aller dans le dashboard Vercel:
1. Cliquez sur votre projet
2. Allez dans **Settings → Environment Variables**
3. Ajoutez ces variables:

```
FIREBASE_PROJECT_ID = afrolaks-5eaaa
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxx@afrolaks-5eaaa.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

⚠️ **Important**: Dans la clé privée, les `\n` (newlines) doivent être littérales `\n`, pas des vraies newlines.

## ✅ Vérification

Après déploiement, testez:

```bash
# Test de l'API votes
curl -X POST https://votre-url-vercel.vercel.app/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "nomineeId": "dj-spinall",
    "categoryId": "best-dj",
    "voteCount": 1,
    "transactionId": "test_001",
    "paymentStatus": "completed",
    "amountXAF": 100
  }'

# Test de l'API contact
curl -X POST https://votre-url-vercel.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "voting",
    "message": "This is a test"
  }'
```

## 🔄 Déploiements futurs
```bash
# Les déploiements suivants sont automatiques avec Git
git push origin main  # Auto-déploie sur Vercel
```

## 📱 Phase 2: CamPay Integration
Quand vous ajouterez CamPay:

1. Générez une clé API CamPay
2. Ajoutez dans Vercel Environment Variables:
   - `CAMPAY_API_KEY`
   - `CAMPAY_SECRET_KEY`
   - `CAMPAY_USERNAME`
   - `CAMPAY_WEBHOOK_SECRET`

3. Mettez à jour `/apps/frontend/src/app/api/payments/route.ts` (créer ce fichier)
4. Intégrez la vérification de paiement

## 🛡️ Sécurité
- ✅ Clés privées n'apparaissent **jamais** dans le repo Git
- ✅ Firestore rules bloquent les écritures non autorisées
- ✅ API routes tournent sur les serveurs Vercel (données sensibles sécurisées)
- ✅ Transaction ID empêche les doublons de votes

## 📞 Support
- Documentation Vercel: https://vercel.com/docs
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
