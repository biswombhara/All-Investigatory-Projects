
'use client';

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '../../services/firestore.js';
import { Loader } from '../../components/Loader.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx';
import { PlusCircle, BookOpen } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';

function BlogPostCard({ post }) {
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };


  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50">
        <CardHeader>
           {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                 data-ai-hint="blog cover"
              />
            </div>
          )}
          <CardTitle className="font-headline text-xl mt-4">{post.title}</CardTitle>
          <CardDescription className="line-clamp-3 text-base">{post.excerpt}</CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.authorName}</p>
            <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}


export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

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
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Community Blog
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Insights, stories, and updates from our community.
            </p>
        </div>
        {user && (
          <Button asChild size="lg">
            <Link href="/blogs/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Write a Post
            </Link>
          </Button>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
            <BookOpen className="mx-auto h-12 w-12" />
          <p className="mt-4 text-xl">No blog posts yet.</p>
          <p className="mt-2">Be the first to share something with the community!</p>
        </div>
      )}
    </div>
  );
}
