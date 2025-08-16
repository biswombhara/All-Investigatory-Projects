
'use client';

import { useEffect, useState, useContext } from 'react';
import { Users } from 'lucide-react';
import { listenToVisitorCount, incrementVisitorCount } from '../services/firestore.js';
import { AuthContext } from '../context/AuthContext.jsx';


const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Increment count only once per session
    if (!sessionStorage.getItem('sessionVisited')) {
      incrementVisitorCount();
      sessionStorage.setItem('sessionVisited', 'true');
    }

    // Set up a real-time listener for the visitor count
    const unsubscribe = listenToVisitorCount((count) => {
      setVisitorCount(count);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  
  const isAdmin = user && user.email === ADMIN_EMAIL;

  if (visitorCount === 0 || !isAdmin) {
    return null; // Don't render until the count has been fetched or if user is not admin
  }

  return (
    <div className="bg-secondary/50 py-4 mb-8 rounded-lg">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <div className="text-center">
          <p className="font-headline text-2xl font-bold text-foreground">
            {visitorCount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Our Reach</p>
        </div>
      </div>
    </div>
  );
}
