
'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { listenToVisitorCount, incrementVisitorCount } from '../services/firestore.js';

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0);

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

  if (visitorCount === 0) {
    return null; // Don't render until the count has been fetched
  }

  return (
    <div className="bg-secondary/50 py-4">
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
