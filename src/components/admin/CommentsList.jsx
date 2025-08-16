
'use client';

import React, { useState, useEffect, useContext } from 'react';
import { getAllCommentsForPost, deleteComment } from '../../services/firestore.js';
import { Skeleton } from '../ui/skeleton.jsx';
import { Button } from '../ui/button.jsx';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '../../hooks/use-toast.js';
import { LoadingContext } from '../../context/LoadingContext.jsx';
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
} from '../ui/alert-dialog.jsx';

export function CommentsList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { showLoader, hideLoader } = useContext(LoadingContext);

  const fetchComments = async () => {
    setLoading(true);
    const fetchedComments = await getAllCommentsForPost(postId);
    setComments(fetchedComments);
    setLoading(false);
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);
  
  const handleDeleteComment = async (commentId) => {
    showLoader();
    try {
      await deleteComment(postId, commentId);
      toast({ title: 'Comment Deleted' });
      fetchComments(); // Refresh list
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({ title: 'Error', description: 'Failed to delete comment.', variant: 'destructive' });
    } finally {
      hideLoader();
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (comments.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No comments on this post.</p>;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Comments</h4>
      {comments.map((comment) => {
        const commentDate = comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'Just now';
        return (
          <div key={comment.id} className="flex items-start justify-between rounded-md border bg-background p-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorPhotoURL} alt={comment.authorName} />
                <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground">{commentDate}</p>
                </div>
                <p className="mt-1 text-sm text-foreground/90">{comment.text}</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this comment. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteComment(comment.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      })}
    </div>
  );
}
