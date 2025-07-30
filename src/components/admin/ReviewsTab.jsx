
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
import { getReviews } from '../../services/firestore.js';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import { Star } from 'lucide-react';

export function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const fetchedReviews = await getReviews();
      setReviews(fetchedReviews);
      setLoading(false);
    };
    fetchReviews();
  }, []);

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
            <div key={review.id} className="rounded-lg border p-4">
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
