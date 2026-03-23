/**
 * useAuth Hook
 *
 * Manages Firebase Authentication state and operations.
 * Provides sign in, sign out, and session management.
 *
 * @returns {Object} { user, loading, isAdmin, signIn, signOut, session }
 *
 * @example
 * const { user, isAdmin, signIn, signOut } = useAuth();
 *
 * const handleLogin = async () => {
 *   const result = await signIn(email, password);
 *   if (result.success) {
 *     // Redirect to dashboard
 *   }
 * };
 */

'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthUser extends User {
  isAdmin?: boolean;
  adminClaims?: {
    admin: boolean;
  };
}

interface SignInResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

/**
 * Monitor authentication state and provide auth methods
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          // Get custom claims (admin role)
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const admin = idTokenResult.claims.admin === true;

          const authUser: AuthUser = {
            ...firebaseUser,
            isAdmin: admin,
            adminClaims: {
              admin,
            },
          };

          setUser(authUser);
          setIsAdmin(admin);

          console.log('✅ User authenticated:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: admin,
          });
        } else {
          // User is signed out
          setUser(null);
          setIsAdmin(false);

          if (typeof window !== 'undefined' && window.location.pathname.includes('dashboard')) {
            // Redirect to login if trying to access protected route
            console.log('Redirecting to login: not authenticated');
          }
        }
      } catch (error) {
        console.error('❌ Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get custom claims
      const idTokenResult = await firebaseUser.getIdTokenResult();
      const admin = idTokenResult.claims.admin === true;

      const authUser: AuthUser = {
        ...firebaseUser,
        isAdmin: admin,
        adminClaims: {
          admin,
        },
      };

      setUser(authUser);
      setIsAdmin(admin);

      console.log('✅ Sign in successful:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      return {
        success: true,
        user: authUser,
      };
    } catch (error) {
      let errorMessage = 'Sign in failed';

      if (error instanceof Error) {
        if ('code' in error) {
          const code = (error as { code: string }).code;
          if (code === 'auth/user-not-found') {
            errorMessage = 'User not found';
          } else if (code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password';
          } else if (code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          } else if (code === 'auth/user-disabled') {
            errorMessage = 'User account has been disabled';
          } else if (code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed login attempts. Please try again later';
          }
        } else {
          errorMessage = error.message;
        }
      }

      console.error('❌ Sign in error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      if (user) {
        const newIdTokenResult = await user.getIdTokenResult(true);
        const admin = newIdTokenResult.claims.admin === true;
        setIsAdmin(admin);
        console.log('✅ Token refreshed');
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refreshToken,
  };
};

export default useAuth;
