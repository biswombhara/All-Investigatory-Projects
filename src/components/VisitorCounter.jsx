
'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // This logic runs only on the client-side
    const getVisitorCount = () => {
      let count = parseInt(localStorage.getItem('visitorCount') || '0', 10);
      
      // A simple way to check if it's a "new" visit for this session
      if (!sessionStorage.getItem('sessionVisited')) {
        count += 1;
        localStorage.setItem('visitorCount', count.toString());
        sessionStorage.setItem('sessionVisited', 'true');
      }
      
      // Add a random base to make the number seem larger for demonstration
      const baseCount = 12345;
      return baseCount + count;
    };
    
    setVisitorCount(getVisitorCount());

  }, []);

  if (visitorCount === 0) {
    return null; // Don't render on the server or before the count is determined
  }

  return (
    <div className="bg-secondary/50 py-4">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <div className="text-center">
          <p className="font-headline text-2xl font-bold text-foreground">
            {visitorCount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Community Members</p>
        </div>
      </div>
    </div>
  );
}
