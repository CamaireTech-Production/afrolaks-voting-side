import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

/**
 * Hook CRUD pour gérer les catégories
 */
export const useAdminCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les catégories en temps réel
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Sans orderBy qui peut causer des problèmes d'index
      const q = query(collection(db, 'categories'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Category));

          // Trier manuellement par ordre
          const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));

          setCategories(sorted);
          setLoading(false);
        },
        (err) => {
          console.error('❌ Erreur lors du chargement des catégories:', err);
          setError(err.message || 'Erreur lors du chargement');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('❌ Erreur hook:', err);
      setError((err as Error).message || 'Erreur inattendue');
      setLoading(false);
    }
  }, []);

  // Ajouter une catégorie
  const addCategory = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      await addDoc(collection(db, 'categories'), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout:', err);
      setError((err as Error).message || 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  // Mettre à jour une catégorie
  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      setError(null);
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour:', err);
      setError((err as Error).message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
      setError((err as Error).message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};
