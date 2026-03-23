import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

export interface AuthUser {
    uid: string;
    email: string | null;
    isAdmin: boolean;
}

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser: User | null) => {
                try {
                    if (firebaseUser) {
                        const idTokenResult = await firebaseUser.getIdTokenResult();
                        const isAdmin = idTokenResult.claims.admin === true;
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            isAdmin,
                        });
                    } else {
                        setUser(null);
                    }
                    setError(null);
                } catch (err) {
                    console.error('Erreur auth:', err);
                    setError((err as Error).message);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            setLoading(true);
            await firebaseSignOut(auth);
            setUser(null);
            setError(null);
        } catch (err) {
            console.error('Erreur logout:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, signOut };
}



