/**
 * useCategories Hook
 *
 * Fetches all voting categories from Firestore in real-time.
 * Used on /awards page to display category selection.
 *
 * @returns {Object} { categories, loading, error }
 *
 * @example
 * const { categories, loading, error } = useCategories();
 *
 * if (loading) return <Skeleton />;
 * if (error) return <Error message={error} />;
 *
 * return categories.map(cat => <CategoryCard key={cat.id} {...cat} />);
 */

'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch categories with real-time updates
 */
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Query: get all active categories, ordered by order field
      const q = query(
        collection(db, 'categories'),
        orderBy('order', 'asc')
      );

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Category));

          setCategories(data);
          setLoading(false);
        },
        (err) => {
          console.error('❌ Error fetching categories:', err);
          setError(err.message || 'Failed to fetch categories');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Categories hook error:', err);
      setError((err as Error).message || 'Unexpected error');
      setLoading(false);
    }
  }, []);

  // Refetch function
  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'categories'),
        orderBy('order', 'asc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Category));

      setCategories(data);
    } catch (err) {
      console.error('❌ Refetch categories error:', err);
      setError((err as Error).message || 'Failed to refetch');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch };
};

export default useCategories;
