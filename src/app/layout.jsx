
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
import { ThemeProvider } from 'next-themes';

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
    "Download free project PDFs on physics, chemistry, biology, mathematics, english and many more subjects. Class 6th to 12th and for college projects also.";
  const imageUrl =
    'https://yt3.googleusercontent.com/4bUuIDk_BIXQEWPFuYoXGKd94hhTXLW6jrJDynplZD8vNIlPuvo6TiibXVJcsAAKdKQZsOMRtw=s160-c-k-c0x00ffffff-no-rj'; 
  const keywords = "Biswombhara Patra, all investigatory projects, investigatory projects, study notes, physics investigatory project, chemistry investigatory project, biology investigatory project, mathematics investigatory project, computer science investigatory project, english investigatory project, class 12 physics project file pdf download, class 12 investigatory project, class 12 investigatory project chemistry";

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="icon" href={imageUrl} sizes="any" />
        <link rel="canonical" href="https://allinvestigatoryprojects.netlify.app"></link>
        
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
        <link rel="preconnect" href="https/fonts.gstatic.com" crossOrigin="anonymous" />
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
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
        >
          <AuthProvider>
            <LoadingProvider>
              <AppContent>{children}</AppContent>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
