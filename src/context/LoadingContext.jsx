'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const LoadingContext = createContext({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); 
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hide loader whenever the path or query params change
    setLoading(false);
  }, [pathname, searchParams]);
  
  useEffect(() => {
    // Initial load effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback(() => setLoading(false), []);

  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};