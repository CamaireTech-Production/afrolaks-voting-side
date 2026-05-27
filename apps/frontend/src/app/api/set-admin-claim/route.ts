export const dynamic = 'force-dynamic';

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as admin.ServiceAccount),
    });

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    console.log(`🔐 Ajout du custom claim admin à: ${email}`);

    const auth = getAuth(adminApp);

    // Obtenir l'utilisateur par email et ajouter le custom claim
    const user = await auth.getUserByEmail(email);

    await auth.setCustomUserClaims(user.uid, { admin: true });

    console.log(`✅ Custom claim admin ajouté à ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: `Admin claim ajouté à ${email}. L'utilisateur doit se reconnecter.`,
        uid: user.uid,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erreur:', error);
    const errorMessage = (error as Error).message || 'Erreur serveur';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
