
'use client';

import { useEffect, useState, useContext } from 'react';
import { getBlogPostBySlug, likeBlogPost, unlikeBlogPost, addCommentToPost, getCommentsForPost } from '../../../services/firestore.js';
import { Loader } from '../../../components/Loader.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx';
import { AlertCircle, User, Calendar, Heart, MessageCircle, Send, Trash2, Edit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Textarea } from '../../../components/ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar.jsx';
import Link from 'next/link';
import MDEditor from '@uiw/react-md-editor';

const Comment = ({ comment }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };
  
  const commentDate = comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'Just now';

  return (
    <div className="flex items-start gap-4">
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
    </div>
  );
};


export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { user } = useContext(AuthContext);

  const hasLiked = post?.likes?.includes(user?.uid);
  const isAuthor = post?.authorId === user?.uid;

  const fetchPostAndComments = async () => {
    const { slug } = params;
    if (!slug) return;

    setLoading(true);
    setError(null);
    try {
      const fetchedPost = await getBlogPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        const fetchedComments = await getCommentsForPost(fetchedPost.id);
        setComments(fetchedComments);
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

  useEffect(() => {
    fetchPostAndComments();
  }, [params]);

  const handleLike = async () => {
    if (!user) return;
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
    if (!user || !newComment.trim()) return;
    
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
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-foreground dark:prose-invert" data-color-mode="dark">
         <MDEditor.Markdown source={post.description} style={{ whiteSpace: 'pre-wrap', background: 'transparent' }} />
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
                comments.map(comment => <Comment key={comment.id} comment={comment} />)
            ) : (
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            )}
        </div>
      </div>
    </article>
  );
}
