
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from './ui/card.jsx';
import Image from 'next/image';
import { Button } from './ui/button.jsx';
import { Eye } from 'lucide-react';
import { Badge } from './ui/badge.jsx';

export function EbookCard({ ebook }) {
  const linkHref = ebook.viewUrl || `/ebooks/${ebook.id}`;
  const isExternal = ebook.viewUrl;

  const CardBody = () => (
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
          <h3 className="font-headline text-lg font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {ebook.title}
          </h3>
           <div className="mt-2 flex flex-wrap items-center gap-2">
            {ebook.subject && <Badge variant="secondary">{ebook.subject}</Badge>}
            {ebook.class && <Badge variant="outline">{ebook.class}</Badge>}
          </div>
          <div className="mt-4 flex items-center justify-between pt-4 border-t flex-grow">
            <Button variant="outline" size="sm" asChild>
                <div className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </div>
            </Button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{ebook.views || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
  );

  if (isExternal) {
    return (
      <a href={linkHref} target="_blank" rel="noopener noreferrer" className="block group">
        <CardBody />
      </a>
    );
  }

  return (
    <Link href={linkHref} className="block group">
        <CardBody />
    </Link>
  );
}
