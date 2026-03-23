import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
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

export interface Nominee {
  id: string;
  name: string;
  image: string;
  categoryId: string;
  voteCount: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseAdminNomineesReturn {
  nominees: Nominee[];
  loading: boolean;
  error: string | null;
  addNominee: (data: Omit<Nominee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNominee: (id: string, data: Partial<Nominee>) => Promise<void>;
  deleteNominee: (id: string) => Promise<void>;
}

/**
 * Hook CRUD pour gérer les nominations (nominees)
 */
export const useAdminNominees = (categoryId?: string): UseAdminNomineesReturn => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les nominees en temps réel
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔷 useAdminNominees: Initialisation avec categoryId:', categoryId);

      // Construire la requête: avec ou sans filtre par catégorie
      // IMPORTANT: Sans orderBy d'abord pour tester si les données existent
      const q = categoryId
        ? query(
            collection(db, 'nominees'),
            where('categoryId', '==', categoryId)
          )
        : query(collection(db, 'nominees'));

      console.log('🔷 useAdminNominees: Query configurée, attachement du listener...');

      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          console.log('✅ useAdminNominees: Snapshot reçu!');
          console.log(`📊 Nombre de documents: ${snapshot.docs.length}`);

        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          console.log(`  📄 Doc ID: ${doc.id}, Data:`, docData);

          // Important: utiliser l'ID du document (doc.id), pas l'ID potentiellement vide dans les données
          return {
            id: doc.id,
            name: docData.name || '',
            image: docData.image || '',
            categoryId: docData.categoryId || '',
            voteCount: docData.voteCount || 0,
            order: docData.order ?? 0,
            isActive: docData.isActive ?? true,
            createdAt: docData.createdAt || '',
            updatedAt: docData.updatedAt || '',
          } as Nominee;
        });

          // Trier par ordre d'affichage
          const sorted = data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

          console.log(`✅ useAdminNominees: ${sorted.length} nominees chargés et triés par order`);
          setNominees(sorted);
          setLoading(false);
        },
        (err) => {
          console.error('❌ Erreur Firestore lors du chargement des nominees:', err);
          console.error('   Code erreur:', (err as any).code);
          console.error('   Message:', (err as any).message);
          setError(err.message || 'Erreur lors du chargement');
          setLoading(false);
        }
      );

      return () => {
        console.log('🔷 useAdminNominees: Nettoyage du listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ Erreur critique hook useAdminNominees:', err);
      console.error('   Stack:', (err as Error).stack);
      setError((err as Error).message || 'Erreur inattendue');
      setLoading(false);
    }
  }, [categoryId]);

  // Ajouter un nominee
  const addNominee = async (data: Omit<Nominee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      await addDoc(collection(db, 'nominees'), {
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

  // Mettre à jour un nominee
  const updateNominee = async (id: string, data: Partial<Nominee>) => {
    try {
      setError(null);
      const nomineeRef = doc(db, 'nominees', id);
      await updateDoc(nomineeRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour:', err);
      setError((err as Error).message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer un nominee
  const deleteNominee = async (id: string) => {
    try {
      setError(null);
      console.log('🗑️ deleteNominee appelé avec ID:', id);
      console.log('   Type:', typeof id);
      console.log('   Longueur:', id.length);

      if (!id || id.trim() === '') {
        throw new Error('ID vide lors de la suppression');
      }

      await deleteDoc(doc(db, 'nominees', id));
      console.log('✅ Nominee supprimé avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
      setError((err as Error).message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  return { nominees, loading, error, addNominee, updateNominee, deleteNominee };
};
