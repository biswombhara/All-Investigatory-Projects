
'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBlogPost, addComment, getComments, toggleLike } from '../../../services/firestore.js';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { Loader } from '../../../components/Loader.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Textarea } from '../../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader } from '../../../components/ui/card.jsx';
import { ThumbsUp, MessageSquare, Send, LogIn, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../../hooks/use-toast.js';

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.map((n) => n[0]).join('');
};

function Comment({ comment }) {
  const formattedDate = comment.createdAt?.toDate ? format(comment.createdAt.toDate(), 'PPP') : 'Date not available';
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={comment.authorPhotoURL} alt={comment.authorName} />
        <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
        <p className="mt-1 text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { id: postId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, signIn } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real-time listener for post updates (likes)
  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
        try {
            const fetchedPost = await getBlogPost(postId);
            if (!fetchedPost) {
                router.push('/404');
            } else {
                setPost(fetchedPost);
            }
        } catch (error) {
            console.error("Failed to fetch post:", error);
            router.push('/404');
        } finally {
            setLoading(false);
        }
    };
    fetchPost();
  }, [postId, router]);

  // Real-time listener for comments
  useEffect(() => {
    if (!postId) return;
    const unsubscribe = getComments(postId, (fetchedComments) => {
      setComments(fetchedComments);
    });
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
        toast({ title: "Please log in to comment.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
        await addComment(postId, newComment, user);
        setNewComment('');
    } catch (error) {
        toast({ title: "Failed to post comment.", description: error.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
        toast({ title: "Please log in to like posts.", variant: "destructive" });
        return;
    }
    try {
        await toggleLike(postId, user.uid);
        // Optimistically update the UI, or wait for the snapshot listener
        const newLikes = post.likes.includes(user.uid) 
            ? post.likes.filter(uid => uid !== user.uid)
            : [...post.likes, user.uid];
        setPost({ ...post, likes: newLikes });
    } catch (error) {
        toast({ title: "Failed to update like.", description: error.message, variant: "destructive" });
    }
  };
  
  if (loading) return <Loader />;
  if (!post) return null;

  const formattedDate = post.createdAt?.toDate ? format(post.createdAt.toDate(), 'PPP') : 'Date not available';
  const hasLiked = user && post.likes.includes(user.uid);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <article>
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <Avatar>
              <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
              <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.authorName}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-foreground/90">
            {post.body}
        </div>
      </article>

      <div className="mt-12 flex items-center gap-6 border-t border-b py-4">
        <Button variant={hasLiked ? "default" : "outline"} onClick={handleLike} className="flex items-center gap-2">
            <ThumbsUp className={`h-5 w-5 ${hasLiked ? '' : 'text-primary'}`} />
            <span>{post.likes.length} Like{post.likes.length !== 1 && 's'}</span>
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
            <span>{comments.length} Comment{comments.length !== 1 && 's'}</span>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline mb-6">Comments</h2>
        {user ? (
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                <Textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={4}
                />
                <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="self-end">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Post Comment
                </Button>
            </form>
        ) : (
            <Card className="text-center p-6 bg-secondary">
                <p className="text-muted-foreground">You must be logged in to post a comment.</p>
                <Button onClick={() => signIn()} className="mt-4">
                    <LogIn className="mr-2 h-4 w-4" /> Login to Comment
                </Button>
            </Card>
        )}

        <div className="mt-8 space-y-8">
            {comments.length > 0 ? (
                comments.map((comment) => <Comment key={comment.id} comment={comment} />)
            ) : (
                <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            )}
        </div>
      </div>
    </div>
  );
}
