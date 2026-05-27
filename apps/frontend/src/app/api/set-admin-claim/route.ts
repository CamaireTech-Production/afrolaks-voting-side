export const dynamic = 'force-dynamic';

import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

function getAdminApp() {
  if (getApps().length) return getApp();
  return initializeApp({
    credential: credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as admin.ServiceAccount),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const auth = getAuth(getAdminApp());
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { admin: true });

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
    console.error('Erreur set-admin-claim:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
