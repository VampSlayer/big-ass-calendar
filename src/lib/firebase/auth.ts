import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

// Google Auth Provider with Calendar scope
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');

/**
 * Sign in with Google using Firebase Auth
 * Requests Google Calendar read-only permissions
 * Returns both the user and the OAuth access token
 */
export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!accessToken) {
      throw new Error('Failed to get access token from Google sign-in');
    }

    // Store access token in sessionStorage for later use
    sessionStorage.setItem('google_access_token', accessToken);

    return { user: result.user, accessToken };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Get the stored Google OAuth access token
 */
export const getGoogleAccessToken = (): string | null => {
  return sessionStorage.getItem('google_access_token');
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    // Clear the stored access token
    sessionStorage.removeItem('google_access_token');
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
