
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card.jsx';
import { Skeleton } from '../ui/skeleton.jsx';
import { getReviews, deleteReview } from '../../services/firestore.js';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import { Star, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button.jsx';
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
import { useToast } from '../../hooks/use-toast.js';

export function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    const fetchedReviews = await getReviews();
    setReviews(fetchedReviews);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
     try {
      await deleteReview(reviewId);
      toast({ title: 'Review Deleted', description: 'The review has been removed.' });
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete review", error);
      toast({ title: 'Error', description: 'Failed to delete the review.', variant: 'destructive' });
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reviews</CardTitle>
        <CardDescription>
          Here are the latest reviews submitted by your users.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border p-4 relative group">
               <div className="flex items-start gap-4">
                  <Avatar>
                      <AvatarImage src={review.reviewerPhotoURL} alt={review.reviewerName} />
                      <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{review.reviewerName}</h3>
                        <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 text-muted-foreground" />
                            ))}
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                  </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle /> Are you sure?
                        </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this review.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(review.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No reviews have been submitted yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
