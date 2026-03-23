/**
 * useNominees Hook
 *
 * Fetches nominees by category ID from Firestore with real-time updates.
 * Used on /awards page to display nominees for selected category.
 *
 * @param categoryId - Filter nominees by this category ID (optional)
 * @returns {Object} { nominees, loading, error, nomineesByCategory }
 *
 * @example
 * // Get nominees for specific category
 * const { nominees, loading } = useNominees('best-dj');
 *
 * // Get all nominees
 * const { nominees } = useNominees();
 */

'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Nominee {
  id: string;
  name: string;
  bio: string;
  image: string;
  categoryId: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface UseNomineesReturn {
  nominees: Nominee[];
  loading: boolean;
  error: string | null;
  nomineesByCategory: (categoryId: string) => Nominee[];
  refetch: () => Promise<void>;
}

/**
 * Fetch nominees with optional filtering by category
 */
export const useNominees = (categoryId?: string): UseNomineesReturn => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Build query based on categoryId
      let q;
      if (categoryId) {
        q = query(
          collection(db, 'nominees'),
          where('categoryId', '==', categoryId),
          where('isActive', '==', true),
          orderBy('name', 'asc')
        );
      } else {
        q = query(
          collection(db, 'nominees'),
          where('isActive', '==', true),
          orderBy('categoryId', 'asc')
        );
      }

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Nominee));

          setNominees(data);
          setLoading(false);
        },
        (err) => {
          console.error('❌ Error fetching nominees:', err);
          setError(err.message || 'Failed to fetch nominees');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Nominees hook error:', err);
      setError((err as Error).message || 'Unexpected error');
      setLoading(false);
    }
  }, [categoryId]);

  // Helper function: get nominees for a specific category
  const nomineesByCategory = (catId: string): Nominee[] => {
    return nominees.filter((n) => n.categoryId === catId);
  };

  // Refetch function
  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      let q;
      if (categoryId) {
        q = query(
          collection(db, 'nominees'),
          where('categoryId', '==', categoryId),
          where('isActive', '==', true),
          orderBy('name', 'asc')
        );
      } else {
        q = query(
          collection(db, 'nominees'),
          where('isActive', '==', true),
          orderBy('categoryId', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Nominee));

      setNominees(data);
    } catch (err) {
      console.error('❌ Refetch nominees error:', err);
      setError((err as Error).message || 'Failed to refetch');
    } finally {
      setLoading(false);
    }
  };

  return { nominees, loading, error, nomineesByCategory, refetch };
};

// Import needed for refetch
import { getDocs } from 'firebase/firestore';

export default useNominees;
