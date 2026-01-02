
'use client';

import { BookOpen } from 'lucide-react';

export default function EBooksPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center">
        <BookOpen className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          E-Books
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
          This section is coming soon. Stay tuned for our collection of e-books!
        </p>
      </div>
    </div>
  );
}
