/**
 * useVote Hook
 *
 * Handles vote submission to Next.js API routes.
 * API routes are deployed free on Vercel.
 *
 * Flow:
 * 1. User selects vote count
 * 2. Calculate amountXAF = voteCount × 100
 * 3. Call submitVote() with nominee/category data
 * 4. Vote sent to API route → Firestore
 * 5. Return success/error
 *
 * In Phase 2: Add CamPay payment verification before vote recording
 *
 * @returns {Object} { submit, loading, error, success, transactionId }
 *
 * @example
 * const { submit, loading } = useVote();
 *
 * const handleVote = async () => {
 *   const result = await submit({
 *     nomineeId: 'dj-spinall',
 *     categoryId: 'best-dj',
 *     voteCount: 2,
 *   });
 *   if (result.success) showSuccess();
 * };
 */

'use client';

import { useState } from 'react';

export interface VoteRequest {
  nomineeId: string;
  categoryId: string;
  voteCount: number;
  userEmail?: string;
  transactionId?: string; // from CamPay (Phase 2)
  paymentStatus?: string; // 'completed' | 'pending' | 'failed'
}

export interface VoteResponse {
  success: boolean;
  voteId?: string;
  message: string;
  error?: string;
  nomineeId: string;
  voteCount: number;
  amountXAF: number;
}

interface UseVoteReturn {
  submit: (data: VoteRequest) => Promise<VoteResponse>;
  loading: boolean;
  error: string | null;
  success: boolean;
  transactionId: string | null;
  reset: () => void;
}

const VOTE_PRICE_XAF = 100; // Each vote costs 100 XAF

/**
 * Submit a vote through Next.js API routes
 * Routes deployed free on Vercel
 */
export const useVote = (): UseVoteReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const submit = async (voteData: VoteRequest): Promise<VoteResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setTransactionId(null);

    try {
      // Validate input
      if (!voteData.nomineeId) {
        throw new Error('Nominee ID is required');
      }
      if (!voteData.categoryId) {
        throw new Error('Category ID is required');
      }
      if (voteData.voteCount < 1) {
        throw new Error('Vote count must be at least 1');
      }
      if (voteData.voteCount > 100) {
        throw new Error('Maximum 100 votes per transaction');
      }

      // Calculate total amount
      const amountXAF = voteData.voteCount * VOTE_PRICE_XAF;

      // For now: Mock transaction ID (Phase 2 will use real CamPay)
      const mockTransactionId = `vote_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      console.log('🔄 Preparing vote for recording:', {
        nomineeId: voteData.nomineeId,
        categoryId: voteData.categoryId,
        voteCount: voteData.voteCount,
        amountXAF,
      });

      // Simulate payment delay (will be replaced with real CamPay in Phase 2)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send vote to API route
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomineeId: voteData.nomineeId,
          categoryId: voteData.categoryId,
          voteCount: voteData.voteCount,
          transactionId: mockTransactionId,
          paymentStatus: 'completed', // Phase 2: verify via CamPay first
          amountXAF,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record vote');
      }

      setSuccess(true);
      setTransactionId(mockTransactionId);

      console.log('✅ Vote recorded successfully:', {
        voteId: data.voteId,
        nomineeId: voteData.nomineeId,
        voteCount: voteData.voteCount,
        amountXAF,
      });

      return {
        success: true,
        voteId: data.voteId,
        message: data.message,
        nomineeId: voteData.nomineeId,
        voteCount: voteData.voteCount,
        amountXAF,
      };
    } catch (err) {
      let errorMessage = 'Failed to record vote';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('❌ Vote error:', errorMessage);
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
        nomineeId: voteData.nomineeId,
        voteCount: voteData.voteCount,
        amountXAF: voteData.voteCount * VOTE_PRICE_XAF,
      };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setTransactionId(null);
  };

  return {
    submit,
    loading,
    error,
    success,
    transactionId,
    reset,
  };
};

export default useVote;


