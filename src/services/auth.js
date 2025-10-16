
import { GoogleAuthProvider, signInWithPopup, signOut, updateProfile, getRedirectResult, reauthenticateWithPopup } from 'firebase/auth';
import { auth, db } from '../lib/firebase.js';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

const provider = new GoogleAuthProvider();
// Add the Google Drive scope to request permission to create files.
provider.addScope('https://www.googleapis.com/auth/drive.file');

export const saveUser = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL, uid } = user;
    try {
      await setDoc(userRef, {
        uid,
        displayName,
        email,
        photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving user to Firestore: ", error);
    }
  }
};

export const updateUserInFirestore = async (userId, data) => {
  if (!userId) return;
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user in Firestore: ", error);
    throw error;
  }
};


export const signInWithGoogle = async () => {
  try {
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    
    await saveUser(user);
    return { user: result.user, accessToken };
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      return null;
    }
    
    console.error("Error signing in with Google: ", error);
    if (error.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      console.error(`This domain (${currentDomain}) is not authorized for OAuth operations. Please visit your Firebase console, go to Authentication > Settings > Authorized domains, and add this exact domain.`);
    }
    throw error;
  }
};

/**
 * Gets a fresh OAuth access token for Google services.
 * This should be called before making an API call to Google Drive.
 * It forces a re-authentication if necessary to get a valid token.
 */
export const getGoogleOAuthToken = async () => {
  if (!auth.currentUser) {
    throw new Error("User is not signed in.");
  }

  try {
    // Re-authenticating with a popup is a reliable way to get a fresh token and
    // handle expired credentials.
    const result = await reauthenticateWithPopup(auth.currentUser, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    return credential.accessToken;
  } catch (error) {
    console.error("Error getting fresh Google OAuth token:", error);
    if (error.code === 'auth/popup-closed-by-user') {
        return null; // User cancelled the process
    }
    // You could throw a more specific error or let the original one bubble up
    throw new Error('Failed to obtain authentication token for Google Drive.');
  }
};


export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export const updateUserProfile = async (user, profileData) => {
  if (!user) throw new Error("User not authenticated");

  try {
    // Update Firebase Auth profile
    await updateProfile(user, {
      displayName: profileData.displayName,
    });

    // Update user data in Firestore
    await updateUserInFirestore(user.uid, {
      displayName: profileData.displayName,
    });
    
     // Important: Reload the user to get the updated profile information
    await user.reload();

  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

    