import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export type UserRole = 'admin' | 'minister' | 'analyst' | 'public';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  ministry?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;

  // For compatibility — sets user directly (used by auth listener)
  _setUser: (user: User | null) => void;
}

// Helper: map Firebase user to our User model
async function mapFirebaseUser(fbUser: FirebaseUser): Promise<User> {
  // Try to read user profile from Firestore
  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: data.displayName || fbUser.displayName || 'User',
      role: data.role || 'analyst',
      ministry: data.ministry || undefined,
      avatarUrl: data.avatarUrl || fbUser.photoURL || undefined,
    };
  }

  // First time login — create a profile in Firestore
  const newUser: User = {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || 'User',
    role: 'analyst', // default role
    avatarUrl: fbUser.photoURL || undefined,
  };

  await setDoc(userDocRef, {
    ...newUser,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });

  return newUser;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading until auth listener fires
  error: null,

  loginWithEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = await mapFirebaseUser(cred.user);
      // Update last login
      await setDoc(doc(db, 'users', user.uid), { lastLogin: serverTimestamp() }, { merge: true });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : err.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = await mapFirebaseUser(cred.user);
      await setDoc(doc(db, 'users', user.uid), { lastLogin: serverTimestamp() }, { merge: true });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        set({ isLoading: false });
        return;
      }
      set({ error: err.message || 'Google sign-in failed', isLoading: false });
      throw err;
    }
  },

  signupWithEmail: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      const user = await mapFirebaseUser(cred.user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : err.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : err.message || 'Signup failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  clearError: () => set({ error: null }),

  _setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
}));

// ─── Firebase Auth State Listener ─────────────────────────────────────
// This runs once when the module loads and keeps auth state in sync
onAuthStateChanged(auth, async (fbUser) => {
  if (fbUser) {
    try {
      const user = await mapFirebaseUser(fbUser);
      useAuthStore.getState()._setUser(user);
    } catch {
      useAuthStore.getState()._setUser(null);
    }
  } else {
    useAuthStore.getState()._setUser(null);
  }
});

// Legacy demo login (kept for backward compatibility / demo mode)
export function demoLogin() {
  useAuthStore.getState()._setUser({
    uid: 'demo-001',
    email: 'admin@bharat-os.gov.in',
    displayName: 'Dr. Ananya Sharma',
    role: 'admin',
    ministry: 'Ministry of Finance',
  });
}
