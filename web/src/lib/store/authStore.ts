import { create } from 'zustand';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, 'displayName' | 'phone' | 'address'>>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Listen to Firebase auth state changes
  if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let profileData: UserProfile;
        
        if (userDoc.exists()) {
          profileData = userDoc.data() as UserProfile;
        } else {
          // Create new user profile
          const isAdmin = firebaseUser.email === 'matirrajjo@gmail.com';
          profileData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            phone: null,
            address: null,
            role: isAdmin ? 'admin' : 'user'
          };
          await setDoc(userDocRef, profileData);
        }
        
        set({ user: profileData, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
  }

  return {
    user: null,
    loading: true,
    updateProfile: async (data) => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return;
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { ...data, updatedAt: Date.now() });
      useAuthStore.setState({ user: { ...currentUser, ...data } });
    },
    loginWithGoogle: async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Check role to return it for immediate redirection
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
           return userDoc.data().role;
        } else {
           return result.user.email === 'matirrajjo@gmail.com' ? 'admin' : 'user';
        }
      } catch (error) {
        console.error("Error logging in with Google:", error);
        return null;
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };
});
