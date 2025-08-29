
'use client';

import { useEffect, useState, useContext } from 'react';
import { getBlogPostBySlug, likeBlogPost, unlikeBlogPost, addCommentToPost, getCommentsForPost, deleteComment, getRelatedBlogPosts } from '../services/firestore.js';
import { Loader } from './Loader.jsx';
import { Alert, AlertDescription, AlertTitle } from './ui/alert.jsx';
import { AlertCircle, User, Calendar, Heart, MessageCircle, Send, Trash2, Edit, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { AuthContext } from '../context/AuthContext.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import Link from 'next/link';
import MDEditor from '@uiw/react-md-editor';
import { useToast } from '../hooks/use-toast.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { incrementBlogPostView } from '../actions/update-views.js';


const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
};

const RelatedPosts = ({ currentPostId, authorId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (currentPostId && authorId) {
      getRelatedBlogPosts(currentPostId, authorId).then(setRelatedPosts);
    }
  }, [currentPostId, authorId]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t pt-8">
      <h2 className="font-headline text-2xl font-bold mb-6">More From This Author</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <Link href={`/blogs/${post.slug}`} key={post.id}>
            <Card className="group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full">
              {post.coverImage && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="blog cover"
                  />
                </div>
              )}
              <CardContent className="flex flex-col flex-grow p-4">
                <h3 className="font-headline text-lg font-bold group-hover:text-primary flex-grow line-clamp-2">{post.title}</h3>
                <div className="mt-2 text-sm text-muted-foreground">
                  {format(post.createdAt.toDate(), 'PPP')}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};


const Comment = ({ comment, isAdmin, onDelete }) => {
  const { toast } = useToast();
  
  const commentDate = comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'Just now';

  const handleDelete = () => {
    onDelete(comment.id);
    toast({ title: "Comment Deleted", description: "The comment has been removed." });
  }

  return (
    <div className="flex items-start gap-4 group">
      <Avatar>
        <AvatarImage src={comment.authorPhotoURL} alt={comment.authorName} />
        <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">{commentDate}</p>
        </div>
        <p className="mt-1 text-foreground/90">{comment.text}</p>
      </div>
      {isAdmin && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete this comment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default function BlogPostPageClient({ slug, initialPost }) {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const hasLiked = post?.likes?.includes(user?.uid);
  const isAuthor = post?.authorId === user?.uid;
  const isAdmin = user && user.email === ADMIN_EMAIL;
  
  useEffect(() => {
    const fetchPostData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);

        // Safely increment view count via server action
        if (initialPost?.id) {
          await incrementBlogPostView(initialPost.id);
        }
        
        const fetchedPostData = await getBlogPostBySlug(slug);

        if (fetchedPostData) {
            const serializedPost = { ...fetchedPostData };
            if (fetchedPostData.createdAt && typeof fetchedPostData.createdAt.toDate === 'function') {
              serializedPost.createdAt = fetchedPostData.createdAt.toDate().toISOString();
            }
            if (fetchedPostData.updatedAt && typeof fetchedPostData.updatedAt.toDate === 'function') {
              serializedPost.updatedAt = fetchedPostData.updatedAt.toDate().toISOString();
            }
            setPost(serializedPost);

            const fetchedComments = await getCommentsForPost(fetchedPostData.id);
            setComments(fetchedComments);
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
          setError('Failed to load blog post.');
          console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [slug, initialPost?.id]);

  const handleLike = async () => {
    if (!user || !post) return;
    try {
      if (hasLiked) {
        await unlikeBlogPost(post.id, user.uid);
        setPost(prev => ({ ...prev, likes: prev.likes.filter(id => id !== user.uid) }));
      } else {
        await likeBlogPost(post.id, user.uid);
        setPost(prev => ({ ...prev, likes: [...(prev.likes || []), user.uid] }));
      }
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !post) return;
    
    setIsSubmittingComment(true);
    try {
        await addCommentToPost(post.id, { text: newComment }, user);
        setNewComment('');
        // Refresh comments
        const fetchedComments = await getCommentsForPost(post.id);
        setComments(fetchedComments);
    } catch (error) {
        console.error("Failed to add comment", error);
    } finally {
        setIsSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!post) return;
    try {
      await deleteComment(post.id, commentId);
      // Refresh comments list
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };
  
  const generateStructuredData = () => {
    if (!post) return null;
    
    const postDate = post.createdAt ? (typeof post.createdAt === 'string' ? post.createdAt : new Date(post.createdAt.seconds * 1000).toISOString()) : new Date().toISOString();
    const modifiedDate = post.updatedAt ? (typeof post.updatedAt === 'string' ? post.updatedAt : new Date(post.updatedAt.seconds * 1000).toISOString()) : postDate;

    // Combine title, author, and custom keywords
    const fullKeywords = [
      post.title,
      post.authorName,
      ...(post.keywords ? post.keywords.split(',').map(k => k.trim()) : [])
    ].join(', ');

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description.substring(0, 150),
      image: post.coverImage,
      keywords: fullKeywords,
      author: {
        '@type': 'Person',
        name: post.authorName || 'Anonymous',
      },
      publisher: {
        '@type': 'Organization',
        name: 'All Investigatory Projects',
        logo: {
          '@type': 'ImageObject',
          url: 'https://yt3.googleusercontent.com/4bUuIDk_BIXQEWPFuYoXGKd94hhTXLW6jrJDynplZD8vNIlPuvo6TiibXVJcsAAKdKQZsOMRtw=s160-c-k-c0x00ffffff-no-rj',
        },
      },
      datePublished: postDate,
      dateModified: modifiedDate,
    };
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

  if (!post) {
    return null;
  }

  const postDate = post.createdAt ? format(typeof post.createdAt === 'string' ? parseISO(post.createdAt) : new Date(post.createdAt.seconds * 1000), 'PPP') : 'Just now';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />
      <Card>
        <CardContent className="pt-6">
          <article>
            <header className="mb-8">
              <h1 className="font-headline text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                   <Avatar className="h-6 w-6">
                    <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                    <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                  </Avatar>
                  <span>{post.authorName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{postDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views || 0} views</span>
                </div>
                {isAuthor && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/blogs/${post.slug}/edit`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Post
                    </Link>
                  </Button>
                )}
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
                  priority
                />
              </div>
            )}

            <div className="prose max-w-none text-foreground dark:prose-invert" >
              <MDEditor.Markdown source={post.description} style={{ background: 'transparent' }} />
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center gap-6">
                <Button variant="ghost" onClick={handleLike} disabled={!user} className="flex items-center gap-2">
                  <Heart className={`h-5 w-5 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{post.likes?.length || 0} Likes</span>
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span>{comments.length} Comments</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-8">
              <h2 className="font-headline text-2xl font-bold">Comments</h2>
              {user ? (
                  <form onSubmit={handleCommentSubmit} className="mt-4 flex flex-col gap-4">
                      <Textarea 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add your comment..."
                          rows={3}
                      />
                      <Button type="submit" disabled={isSubmittingComment} className="self-start">
                          {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
                          <Send className="ml-2 h-4 w-4" />
                      </Button>
                  </form>
              ) : (
                  <p className="mt-4 text-muted-foreground">You must be logged in to comment.</p>
              )}

              <div className="mt-8 space-y-6">
                  {comments.length > 0 ? (
                      comments.map(comment => <Comment key={comment.id} comment={comment} isAdmin={isAdmin} onDelete={handleCommentDelete} />)
                  ) : (
                      <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                  )}
              </div>
            </div>
            <RelatedPosts currentPostId={post.id} authorId={post.authorId} />
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
