import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export interface Vote {
  id: string;
  nomineeId: string;
  categoryId: string;
  voteCount: number;
  amountXAF: number;
  transactionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  userEmail?: string;
  timestamp: any;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  };
}

export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const votesQuery = query(collection(db, 'votes'));

      const unsubscribe = onSnapshot(
        votesQuery,
        (snapshot) => {
          const votesData: Vote[] = [];
          snapshot.forEach((doc) => {
            votesData.push({
              id: doc.id,
              ...doc.data(),
            } as Vote);
          });
          setVotes(votesData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching votes:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load votes';
      console.error('Error setting up votes listener:', err);
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  return { votes, loading, error };
}
