/**
 * useGalleryImages Hook
 *
 * Fetches gallery images from Firestore in real-time.
 * Used on homepage and gallery sections.
 *
 * @param category - Optional filter by category (e.g., 'event', 'awards')
 * @returns {Object} { images, loading, error }
 *
 * @example
 * const { images, loading } = useGalleryImages('event');
 * return images.map(img => <GalleryImage key={img.id} {...img} />);
 */

'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  category?: string;
  createdAt: string;
}

interface UseGalleryImagesReturn {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch gallery images with optional category filtering
 */
export const useGalleryImages = (category?: string): UseGalleryImagesReturn => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Build query based on category
      let q;
      if (category) {
        q = query(
          collection(db, 'galleryImages'),
          where('category', '==', category),
          orderBy('order', 'asc')
        );
      } else {
        q = query(
          collection(db, 'galleryImages'),
          orderBy('order', 'asc')
        );
      }

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as GalleryImage));

          setImages(data);
          setLoading(false);
        },
        (err) => {
          console.error('❌ Error fetching gallery images:', err);
          setError(err.message || 'Failed to fetch images');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Gallery images hook error:', err);
      setError((err as Error).message || 'Unexpected error');
      setLoading(false);
    }
  }, [category]);

  // Refetch function
  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      let q;
      if (category) {
        q = query(
          collection(db, 'galleryImages'),
          where('category', '==', category),
          orderBy('order', 'asc')
        );
      } else {
        q = query(
          collection(db, 'galleryImages'),
          orderBy('order', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as GalleryImage));

      setImages(data);
    } catch (err) {
      console.error('❌ Refetch gallery images error:', err);
      setError((err as Error).message || 'Failed to refetch');
    } finally {
      setLoading(false);
    }
  };

  return { images, loading, error, refetch };
};

export default useGalleryImages;
