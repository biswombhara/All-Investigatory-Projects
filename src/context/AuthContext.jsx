
'use client';

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { signInWithGoogle, saveUser } from '../services/auth.js';
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
        // On a fresh login, we might not have the access token yet.
        // It's better to handle getting it after the redirect result.
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check for redirect result on initial load
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          // This is the signed-in user
          const user = result.user;
          setUser(user);
          
          // Get the access token.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential) {
            setAccessToken(credential.accessToken);
          }

          // Save user to Firestore
          await saveUser(user);
        }
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);
  
  const signIn = async () => {
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
    accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
