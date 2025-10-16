
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
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
       if (!user) {
        setAccessToken(null);
      }
      setLoading(false);
    });

    // Check for redirect result
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          setAccessToken(credential.accessToken);
          await saveUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);
  
  const signIn = async () => {
    // This now just initiates the redirect.
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
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

    