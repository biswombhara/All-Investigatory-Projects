
'use client';

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { signInWithGoogle } from '../services/auth.js';
import { auth } from '../lib/firebase.js';
import { GoogleAuthProvider } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (error) {
        console.error("Sign in failed", error);
    } finally {
        setLoading(false);
    }
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
