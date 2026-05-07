
'use client';

import { Card, CardContent } from './ui/card.jsx';
import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';

const ADMIN_EMAIL = 'allinvestigatoryprojects@gmail.com';

const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
};

const getDisplayAuthorName = (post) => {
  if (post.authorEmail === ADMIN_EMAIL || post.authorName === 'All Investigatory Projects' || post.authorName === 'All_Investigatory Projects') {
    return 'Admin';
  }
  return post.authorName || 'Anonymous';
};

export function BlogPostCard({ post }) {
  const postDate = post.createdAt?.toDate ? format(post.createdAt.toDate(), 'PPP') : 'Just now';
  const displayAuthorName = getDisplayAuthorName(post);

  return (
    <Link href={`/blogs/${post.slug}`}>
      <Card className="group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full">
        <div className="relative aspect-video w-full">
          <Image
            src={post.coverImage || 'https://placehold.co/600x400.png'}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="blog cover"
          />
        </div>
        <CardContent className="flex flex-col flex-grow p-6">
          <h2 className="font-headline text-2xl font-bold group-hover:text-primary flex-grow">{post.title}</h2>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={post.authorPhotoURL} alt={displayAuthorName} />
                    <AvatarFallback>{getInitials(displayAuthorName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="font-semibold">{displayAuthorName}</p>
                    <p>{postDate}</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.views || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
