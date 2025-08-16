
'use client';

import { useEffect, useState, useContext } from 'react';
import { getBlogPostBySlug, deleteBlogPost } from '../../../services/firestore.js';
import { Loader } from '../../../components/Loader.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Badge } from '../../../components/ui/badge.jsx';
import { AlertCircle, User, Calendar, Edit, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { LoadingContext } from '../../../context/LoadingContext.jsx';
import { useParams, useRouter } from 'next/navigation.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar.jsx';
import Link from 'next/link.js';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { useToast } from '../../../hooks/use-toast.js';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog.jsx';

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hideLoader, showLoader } = useContext(LoadingContext);
  const { user } = useContext(AuthContext);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

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
          setError('Blog post not found or it is still a draft.');
        }
      } catch (err) {
        setError('Failed to load the blog post.');
        console.error(err);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchPost();
  }, [params, hideLoader]);

  const handleDelete = async () => {
    if (!post) return;
    showLoader();
    try {
        await deleteBlogPost(post.id);
        toast({ title: "Post Deleted", description: "The blog post has been successfully removed." });
        router.push('/blogs');
    } catch (err) {
        toast({ title: "Error", description: "Failed to delete the post.", variant: "destructive" });
        hideLoader();
    }
  }
  
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
  };

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

  const isAuthor = user && user.uid === post.authorId;

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-16">
        <article>
          <header className="mb-8">
            <Button asChild variant="outline" className="mb-8">
              <Link href="/blogs">
                 <ArrowLeft className="mr-2 h-4 w-4" />
                 Back to Blog
              </Link>
            </Button>
            
            {post.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8 shadow-lg">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                        <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                    </Avatar>
                    <span>{post.authorName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.createdAt?.seconds * 1000}>{formatDate(post.createdAt)}</time>
                </div>
            </div>
             {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            )}
            {isAuthor && (
                <div className="mt-6 flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/blogs/${post.slug}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this blog post.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
          </header>
          <div className="prose prose-lg dark:prose-invert max-w-none" data-color-mode="light">
             <MDEditor.Markdown source={post.content} style={{ whiteSpace: 'pre-wrap' }} />
          </div>
        </article>
      </div>
    </div>
  );
}
