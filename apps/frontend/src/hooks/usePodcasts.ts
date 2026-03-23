/**
 * usePodcasts Hook
 *
 * Fetches all podcast episodes from Firestore in real-time.
 * Used on /podcast page to display episode listings.
 *
 * @returns {Object} { podcasts, loading, error }
 *
 * @example
 * const { podcasts, loading } = usePodcasts();
 * return podcasts.map(ep => <PodcastEpisode key={ep.id} {...ep} />);
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

export interface Podcast {
  id: string;
  episodeNumber: number;
  title: string;
  guest: string;
  duration: string;
  description?: string;
  audioUrl?: string;
  spotifyLink?: string;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

interface UsePodcastsReturn {
  podcasts: Podcast[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch podcast episodes with real-time updates
 */
export const usePodcasts = (): UsePodcastsReturn => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Query: get all podcasts, ordered by episode number DESC (newest first)
      const q = query(
        collection(db, 'podcasts'),
        orderBy('order', 'desc')
      );

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Podcast));

          setPodcasts(data);
          setLoading(false);
        },
        (err) => {
          console.error('❌ Error fetching podcasts:', err);
          setError(err.message || 'Failed to fetch podcasts');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Podcasts hook error:', err);
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
        collection(db, 'podcasts'),
        orderBy('order', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Podcast));

      setPodcasts(data);
    } catch (err) {
      console.error('❌ Refetch podcasts error:', err);
      setError((err as Error).message || 'Failed to refetch');
    } finally {
      setLoading(false);
    }
  };

  return { podcasts, loading, error, refetch };
};

export default usePodcasts;
