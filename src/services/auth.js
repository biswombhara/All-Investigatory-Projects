

import { GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
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
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Save user to Firestore after successful sign-in
    await saveUser(user);

    // Get the access token.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      // The access token can be used to access the Google API.
      const accessToken = credential.accessToken;
      return { user, accessToken };
    }

    return { user, accessToken: null };
    
  } catch (error) {
    // Handle specific errors, like popup closed by user
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.log("Sign-in popup closed by user.");
      return null;
    }
    console.error("Error during sign in with Google popup: ", error);
    throw error;
  }
};


export const signOutUser = () => {
  return signOut(auth);
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
