import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import { saveUser } from './firestore.js';

const provider = new GoogleAuthProvider();
// Add the Google Drive scope to request permission to create files.
provider.addScope('https://www.googleapis.com/auth/drive.file');


export const signInWithGoogle = async () => {
  try {
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // The OAuth access token can be retrieved from the credential object.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    
    // You can now store this accessToken alongside the user if needed for server-side calls,
    // but for client-side uploads, the Firebase user object is often sufficient to re-authenticate.
    
    await saveUser(user);
    return { result, accessToken };
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      // This is a normal user action, so we can return null or handle it quietly.
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

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
