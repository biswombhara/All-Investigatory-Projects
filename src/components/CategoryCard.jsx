
'use client';

import Link from 'next/link';
import Image from 'next/image';

export function CategoryCard({ category }) {
  return (
    <Link href={`/pdfs?subject=${encodeURIComponent(category.name)}`}>
      <div className="group relative block h-48 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={category.hint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <h3 className="font-headline text-2xl font-bold text-white text-center">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
