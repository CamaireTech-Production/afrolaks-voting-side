import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  category?: string;
  createdAt: any;
}

export function useAdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const galleryRef = collection(db, 'galleryImages');
      const q = query(galleryRef); // Sans orderBy qui peut nécessiter un index

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as GalleryImage));
          // Trier manuellement par order
          const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
          setImages(sorted);
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

  const addImage = async (data: Omit<GalleryImage, 'id' | 'createdAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'galleryImages'), {
        ...data,
        createdAt: now,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const updateImage = async (id: string, data: Partial<GalleryImage>) => {
    try {
      const imageRef = doc(db, 'galleryImages', id);
      await updateDoc(imageRef, data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'galleryImages', id));
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  return {
    images,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
  };
}
