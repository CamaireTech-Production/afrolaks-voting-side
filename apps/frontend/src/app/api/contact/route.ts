export const dynamic = 'force-dynamic';

/**
 * API Route: POST /api/contact
 * Handles contact form submissions
 *
 * Deployed free on Vercel with Next.js
 */

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (reuses previous init if already done)
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: 'Missing required fields: name, email, subject, message',
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create contact submission record
    const contactRef = db.collection('contactSubmissions').doc();
    await contactRef.set({
      id: contactRef.id,
      name,
      email,
      subject,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'new',
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: contactRef.id,
        message: 'Contact submission received successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit contact form',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
