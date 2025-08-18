
'use client';

import React from 'react';
import { LoadingContext } from '../context/LoadingContext.jsx';
import { Loader } from './Loader.jsx';
import { Header } from './layout/Header.jsx';
import { Footer } from './layout/Footer.jsx';
import { Toaster } from './ui/toaster.jsx';

export function AppContent({ children }) {
  const { loading } = React.useContext(LoadingContext);

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
