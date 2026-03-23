import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export function FirestoreDiagnostics() {
  const [nomineesCount, setNomineesCount] = useState<number | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
  const [votesCount, setVotesCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCollections = async () => {
      try {
        console.log('📊 Diagnostics: Vérification des collections Firestore...');

        // Check nominees
        const nomineesSnapshot = await getDocs(query(collection(db, 'nominees')));
        const nCount = nomineesSnapshot.docs.length;
        setNomineesCount(nCount);
        console.log(`  📋 nominees: ${nCount} documents`);
        nomineesSnapshot.docs.forEach((doc) => {
          console.log(`    - ${doc.id}:`, doc.data());
        });

        // Check categories
        const categoriesSnapshot = await getDocs(query(collection(db, 'categories')));
        const cCount = categoriesSnapshot.docs.length;
        setCategoriesCount(cCount);
        console.log(`  📂 categories: ${cCount} documents`);

        // Check votes
        const votesSnapshot = await getDocs(query(collection(db, 'votes')));
        const vCount = votesSnapshot.docs.length;
        setVotesCount(vCount);
        console.log(`  🗳️  votes: ${vCount} documents`);

        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur diagnostics:', err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    checkCollections();
  }, []);

  if (loading) return <p className="text-gray-400">Chargement des diagnostics...</p>;

  return (
    <div className="p-4 rounded-4xl bg-white/5 border border-white/10 space-y-4">
      <h3 className="font-bold text-white">🔍 Diagnostics Firestore</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Nominees</p>
          <p className="text-2xl font-bold text-[#FFBD01]">{nomineesCount ?? '?'}</p>
        </div>
        <div>
          <p className="text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-[#FF6A01]">{categoriesCount ?? '?'}</p>
        </div>
        <div>
          <p className="text-gray-500">Votes</p>
          <p className="text-2xl font-bold text-[#FF0000]">{votesCount ?? '?'}</p>
        </div>
      </div>
      {error && (
        <p className="text-[#FF0000] mt-2">❌ {error}</p>
      )}
    </div>
  );
}
