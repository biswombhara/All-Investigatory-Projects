
'use client';

import { useState, useEffect } from 'react';
import { getBlogPosts } from '../../services/firestore.js';
import { Loader } from '../../components/Loader.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import Link from 'next/link.js';
import Image from 'next/image.js';
import { Button } from '../../components/ui/button.jsx';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar.jsx';

const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
};

function BlogPostCard({ post }) {
  const postDate = post.createdAt?.toDate ? format(post.createdAt.toDate(), 'PPP') : 'Just now';

  return (
    <Link href={`/blogs/${post.slug}`}>
      <Card className="group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full">
        <div className="relative aspect-video w-full">
          <Image
            src={post.coverImage || 'https://placehold.co/600x400.png'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="blog cover"
          />
        </div>
        <CardContent className="flex flex-col flex-grow p-6">
          <h2 className="font-headline text-2xl font-bold group-hover:text-primary flex-grow">{post.title}</h2>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground pt-4 border-t">
             <Avatar className="h-8 w-8">
                <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="font-semibold">{post.authorName}</p>
                <p>{postDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Thoughts, stories, and ideas from our community.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/blogs/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Post
          </Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-xl">No blog posts found.</p>
          <p className="mt-2">Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}
