
'use client';

import { useEffect, useState, useContext } from 'react';
import { getBlogPostBySlug } from '../../../services/firestore.js';
import { Loader } from '../../../components/Loader.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx';
import { AlertCircle, User, Calendar } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const { slug } = params;
      if (!slug) return;

      setLoading(true);
      setError(null);
      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
        setError('Failed to load the blog post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <AlertCircle className="mx-auto h-6 w-6" />
          <AlertTitle className="mt-2 text-xl font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const postDate = post.createdAt?.toDate ? format(post.createdAt.toDate(), 'PPP') : 'Just now';

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>By {post.authorName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{postDate}</span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="relative mb-8 h-80 w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="blog cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
        <p className="whitespace-pre-wrap">{post.description}</p>
      </div>
    </article>
  );
}
