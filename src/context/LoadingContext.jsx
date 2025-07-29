'use client';

import React, { createContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const LoadingContext = createContext({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // Start with loader on for initial load
  const pathname = usePathname();

  useEffect(() => {
    // Hide loader whenever the path changes
    setLoading(false);
  }, [pathname]);
  
  useEffect(() => {
    // Initial load effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Or your preferred duration

    return () => clearTimeout(timer);
  }, []);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};
