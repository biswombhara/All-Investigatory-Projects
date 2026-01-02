
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from './ui/card.jsx';
import Image from 'next/image';
import { Button } from './ui/button.jsx';
import { Eye } from 'lucide-react';

export function EbookCard({ ebook }) {
  const linkHref = `/ebooks/${ebook.id}`;

  return (
    <Link href={linkHref} className="block group">
      <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/50 overflow-hidden h-full flex flex-col">
        <div className="relative w-full aspect-[2/3] bg-secondary/50">
          {ebook.coverImage ? (
            <Image
              src={ebook.coverImage}
              alt={`Cover for ${ebook.title}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No Cover</p>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="font-headline text-lg font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors flex-grow">
            {ebook.title}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{ebook.views || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
