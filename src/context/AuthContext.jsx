'use client';

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithGoogle } from '../services/auth.js';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      // When auth state changes, we don't get a new OAuth token automatically.
      // It's best captured at sign-in.
      if (!user) {
        setAccessToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // This sign-in wrapper is crucial. It calls the original signInWithGoogle,
  // then captures the accessToken from the result and stores it in our state.
  const signIn = async () => {
    const result = await signInWithGoogle();
    if (result && result.accessToken) {
       setAccessToken(result.accessToken);
    }
  };
  
  const reloadUser = async () => {
    await auth.currentUser?.reload();
    setUser(auth.currentUser);
  }


  const value = {
    user,
    loading,
    accessToken,
    signIn, // Expose the new signIn function
    reloadUser,
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
