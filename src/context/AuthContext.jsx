
'use client';

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithGoogle, saveUser } from '../services/auth.js';
import { GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { auth } from '../lib/firebase.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        // This case is important for when the app first loads before redirect result is processed.
        // We check for the redirect result here.
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            // User just signed in via redirect.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential) {
              setAccessToken(credential.accessToken);
            }
            await saveUser(result.user);
            setUser(result.user);
          }
        } catch (error) {
          console.error("Error processing redirect result:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signIn = async () => {
    // This now just initiates the redirect.
    setLoading(true);
    await signInWithGoogle();
  };
  
  const reloadUser = async () => {
    await auth.currentUser?.reload();
    setUser(auth.currentUser);
  }


  const value = {
    user,
    loading,
    signIn,
    reloadUser,
    accessToken, // Expose the access token
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
