export const dynamic = 'force-dynamic';

/**
 * API Route: POST /api/votes
 *
 * Records votes in Firestore using Firebase Admin SDK
 * Environment variables:
 *   - FIREBASE_PROJECT_ID
 *   - FIREBASE_PRIVATE_KEY
 *   - FIREBASE_CLIENT_EMAIL
 */

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    } as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function POST(request: NextRequest) {
  try {
    const { nomineeId, categoryId, voteCount, transactionId, paymentStatus, amountXAF, userEmail } =
      await request.json();

    // Validation
    if (!nomineeId || !categoryId || !voteCount || !transactionId || !paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: nomineeId, categoryId, voteCount, transactionId, paymentStatus' },
        { status: 400 }
      );
    }

    if (voteCount < 1 || voteCount > 100) {
      return NextResponse.json({ error: 'Vote count must be 1-100' }, { status: 400 });
    }

    if (paymentStatus !== 'completed') {
      return NextResponse.json(
        { error: `Cannot record votes with status: ${paymentStatus}` },
        { status: 400 }
      );
    }

    // Verify nominee exists
    const nomineeDoc = await db.collection('nominees').doc(nomineeId).get();
    if (!nomineeDoc.exists) {
      return NextResponse.json({ error: 'Nominee not found' }, { status: 404 });
    }

    // Verify category exists
    const categoryDoc = await db.collection('categories').doc(categoryId).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check for duplicate transaction (idempotency)
    const existingVote = await db
      .collection('votes')
      .where('transactionId', '==', transactionId)
      .limit(1)
      .get();

    if (!existingVote.empty) {
      return NextResponse.json(
        { error: 'Vote already recorded with this transaction ID' },
        { status: 409 }
      );
    }

    // Create immutable vote record
    const voteRef = db.collection('votes').doc();
    const finalAmountXAF = amountXAF || voteCount * 100;

    await voteRef.set({
      id: voteRef.id,
      nomineeId,
      categoryId,
      voteCount,
      amountXAF: finalAmountXAF,
      transactionId,
      paymentStatus,
      userEmail: userEmail || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Increment nominee vote count
    const nomineeData = nomineeDoc.data();
    const currentVoteCount = nomineeData?.voteCount || 0;

    await db.collection('nominees').doc(nomineeId).update({
      voteCount: currentVoteCount + voteCount,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Vote recorded: ${voteCount} votes for ${nomineeId} (tx: ${transactionId})`);

    return NextResponse.json(
      {
        success: true,
        voteId: voteRef.id,
        message: `✅ ${voteCount} vote(s) recorded for ${nomineeId}`,
        voteData: {
          nomineeId,
          categoryId,
          voteCount,
          amountXAF: finalAmountXAF,
          transactionId,
          paymentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Vote error:', error);
    return NextResponse.json(
      {
        error: 'Failed to record vote',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    message: '🎯 Votes API (Production)',
    endpoint: 'POST /api/votes',
    status: 'ready',
  });
}
