
'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingContext } from '../context/LoadingContext.jsx';
import { Loader } from './Loader.jsx';
import { Header } from './layout/Header.jsx';
import { Footer } from './layout/Footer.jsx';
import { Toaster } from './ui/toaster.jsx';
import { incrementVisitorCount } from '../services/firestore.js';
import * as gtag from '../lib/gtag.js';

export function AppContent({ children }) {
  const { loading } = React.useContext(LoadingContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();


  useEffect(() => {
    // Increment visitor count once per session for any visitor.
    if (typeof window !== 'undefined' && !sessionStorage.getItem('sessionVisited')) {
      incrementVisitorCount();
      sessionStorage.setItem('sessionVisited', 'true');
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    const url = pathname + searchParams.toString();
    handleRouteChange(url);
  }, [pathname, searchParams]);

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
