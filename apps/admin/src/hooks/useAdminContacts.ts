import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: any;
  status: 'new' | 'read' | 'replied';
  response?: string;
  responseDate?: any;
}

export function useAdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const contactsRef = collection(db, 'contactSubmissions');
      const q = query(contactsRef); // Sans orderBy qui peut nécessiter un index

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as ContactSubmission));
          // Trier manuellement par timestamp descendant
          const sorted = data.sort((a, b) => {
            const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
            const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
            return timeB.getTime() - timeA.getTime();
          });
          setContacts(sorted);
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

  const updateContact = async (id: string, data: Partial<ContactSubmission>) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', id);
      await updateDoc(contactRef, {
        ...data,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  return {
    contacts,
    loading,
    error,
    updateContact,
    deleteContact,
  };
}
