
'use client';

import React, { useEffect } from 'react';
import { LoadingContext } from '../context/LoadingContext.jsx';
import { Loader } from './Loader.jsx';
import { Header } from './layout/Header.jsx';
import { Footer } from './layout/Footer.jsx';
import { Toaster } from './ui/toaster.jsx';
import { incrementVisitorCount } from '../services/firestore.js';

export function AppContent({ children }) {
  const { loading } = React.useContext(LoadingContext);

  useEffect(() => {
    // Increment visitor count once per session for any visitor.
    if (typeof window !== 'undefined' && !sessionStorage.getItem('sessionVisited')) {
      incrementVisitorCount();
      sessionStorage.setItem('sessionVisited', 'true');
    }
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
