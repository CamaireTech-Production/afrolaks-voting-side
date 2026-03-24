import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Podcast {
  id: string;
  title: string;
  spotifyLink: string;
  episodeNumber?: number;
  guest?: string;
  duration?: string;
  description?: string;
  image?: string;
  audioUrl?: string;
  order?: number;
  createdAt: any;
  updatedAt: any;
}

export function useAdminPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const podcastsRef = collection(db, 'podcasts');
      const q = query(podcastsRef); // Sans orderBy qui peut nécessiter un index

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Podcast));
          // Trier par date (plus récent en premier)
          const sorted = data.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
          setPodcasts(sorted);
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

  const addPodcast = async (data: Omit<Podcast, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'podcasts'), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const updatePodcast = async (id: string, data: Partial<Podcast>) => {
    try {
      const podcastRef = doc(db, 'podcasts', id);
      await updateDoc(podcastRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const deletePodcast = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'podcasts', id));
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  return {
    podcasts,
    loading,
    error,
    addPodcast,
    updatePodcast,
    deletePodcast,
  };
}
