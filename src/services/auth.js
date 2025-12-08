

import { GoogleAuthProvider, signInWithPopup, signOut, updateProfile, getRedirectResult, reauthenticateWithPopup, signInWithRedirect } from 'firebase/auth';
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
    // We use signInWithRedirect which is more reliable and avoids popup blockers.
    await signInWithRedirect(auth, provider);
    // The rest of the logic (getting user, token, and saving) will be handled 
    // by the onAuthStateChanged listener and getRedirectResult in the AuthProvider.
  } catch (error) {
    console.error("Error starting sign in with Google redirect: ", error);
    throw error;
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

    
