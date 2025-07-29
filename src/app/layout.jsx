'use client';

import './globals.css';
import { cn } from '../lib/utils.js';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Toaster } from '../components/ui/toaster.jsx';
import React, { useContext } from 'react';
import { Loader } from '../components/Loader.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { LoadingProvider, LoadingContext } from '../context/LoadingContext.jsx';
import Head from 'next/head.js';

function AppContent({ children }) {
  const { loading } = useContext(LoadingContext);

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

export default function RootLayout({
  children,
}) {
  const title = 'All Investigatory Projects - Your Source for Educational PDFs';
  const description =
    "Access and download investigatory project PDFs on various subjects, curated from our YouTube channel. Your ultimate resource for educational materials.";
  const imageUrl =
    'https://yt3.googleusercontent.com/4bUuIDk_BIXQEWPFuYoXGKd94hhTXLW6jrJDynplZD8vNIlPuvo6TiibXVJcsAAKdKQZsOMRtw=s160-c-k-c0x00ffffff-no-rj';

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageUrl} />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* AdSense Script - IMPORTANT: Replace ca-pub-XXXXXXXXXXXXXXXX with your real publisher ID */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <LoadingProvider>
            <AppContent>{children}</AppContent>
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
