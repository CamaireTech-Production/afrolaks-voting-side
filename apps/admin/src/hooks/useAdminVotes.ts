import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Vote {
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

export function useAdminVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const votesRef = collection(db, 'votes');
      const q = query(votesRef); // Sans orderBy qui peut nécessiter un index

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Vote));
          // Trier manuellement par timestamp descendant
          const sorted = data.sort((a, b) => {
            const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
            const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
            return timeB.getTime() - timeA.getTime();
          });
          setVotes(sorted);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }, []);

  return {
    votes,
    loading,
    error,
  };
}
