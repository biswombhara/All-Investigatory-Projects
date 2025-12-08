
import './globals.css';
import { cn } from '../lib/utils.js';
import React from 'react';
import { AuthProvider } from '../context/AuthContext.jsx';
import { LoadingProvider } from '../context/LoadingContext.jsx';
import { ThemeProvider } from '../components/layout/ThemeProvider.jsx';
import { AppContent } from '../components/AppContent.jsx';
import { GA_TRACKING_ID } from '../lib/gtag.js';

const title = 'All Investigatory Projects';
const description =
  'Download free project PDFs of physics, chemistry, biology, mathematics, english and many more. Class 6th to 12th and for college projects also.';
const imageUrl = '/category-card/logo.png';
const keywords =
  'Biswombhara Patra, all investigatory projects, investigatory projects, physics investigatory project, chemistry investigatory project, biology investigatory project, mathematics investigatory project, computer science investigatory project, english investigatory project, class 12 physics project file pdf download, class 12 investigatory project, class 12 investigatory project chemistry';


export const metadata = {
  title: title,
  description: description,
  keywords: keywords,
  icons: {
    icon: imageUrl,
    shortcut: imageUrl,
    apple: imageUrl,
  },
  openGraph: {
    title: title,
    description: description,
    images: [
      {
        url: imageUrl,
        width: 160,
        height: 160,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [imageUrl],
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
        
        {/* Google Analytics Scripts - Loaded from environment variable */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
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
