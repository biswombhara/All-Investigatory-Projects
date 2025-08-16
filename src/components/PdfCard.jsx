import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from './ui/card.jsx';
import Image from 'next/image';

export function PdfCard({ pdf }) {
  return (
    <Link href={`/pdfs/${pdf.id}`} className="block group">
      <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/50 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative h-28 w-24 flex-shrink-0 bg-secondary/50">
            {pdf.publicId && (
              <Image
                src={`https://drive.google.com/thumbnail?id=${pdf.publicId}`}
                alt={`Thumbnail for ${pdf.title}`}
                fill
                sizes="(max-width: 768px) 30vw, 10vw"
                className="object-contain p-1"
              />
            )}
          </div>
          <div className="py-4 pr-4">
            <h3 className="font-headline text-lg font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {pdf.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
               <p>{pdf.subject}</p>
               {pdf.class && <p>{pdf.class}</p>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
