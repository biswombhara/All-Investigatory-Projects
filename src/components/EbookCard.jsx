
import React from 'react';
import Link from 'next/link';
import { Card } from './ui/card.jsx';
import Image from 'next/image';
import { Eye } from 'lucide-react';

export function EbookCard({ ebook }) {
  // Assuming ebook link will be different, maybe to a details page
  // For now, let's assume a similar structure to PDFs
  const linkHref = `/ebooks/${ebook.id}`;

  return (
    <Link href={linkHref} className="block group">
      <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/50 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative h-28 w-24 flex-shrink-0 bg-secondary/50">
            {/* E-books might have a cover image URL instead of a publicId for a thumbnail */}
            {ebook.coverImage ? (
              <Image
                src={ebook.coverImage}
                alt={`Cover for ${ebook.title}`}
                fill
                sizes="(max-width: 768px) 30vw, 10vw"
                className="object-cover"
              />
            ) : ebook.publicId ? (
                 <Image
                    src={`https://drive.google.com/thumbnail?id=${ebook.publicId}`}
                    alt={`Thumbnail for ${ebook.title}`}
                    fill
                    sizes="(max-width: 768px) 30vw, 10vw"
                    className="object-contain p-1"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground">No Image</p>
                </div>
            )}
          </div>
          <div className="py-4 pr-4">
            <h3 className="font-headline text-lg font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {ebook.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
               <p>{ebook.subject}</p>
               {ebook.class && <p>{ebook.class}</p>}
                <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{ebook.views || 0}</span>
                </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
