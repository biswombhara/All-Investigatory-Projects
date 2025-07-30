
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { Send, Star, ShieldCheck, LogIn, AlertCircle, Loader2, MessageSquare, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.jsx';
import { saveReview, getReviews } from '../../services/firestore.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { LoadingContext } from '../../context/LoadingContext.jsx';

const formSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, {
    message: 'Comment must be at least 10 characters.',
  }).max(500, 'Comment cannot exceed 500 characters.'),
});

const StarRatingInput = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  const { toast } = useToast();
  const { user, signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { showLoader, hideLoader } = useContext(LoadingContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      const fetchedReviews = await getReviews();
      setReviews(fetchedReviews);
      setLoadingReviews(false);
    };
    fetchReviews();
  }, []);

  async function onSubmit(values) {
    if (!user) {
      setError({
        title: 'Authentication Error',
        message: 'You must be logged in to submit a review.',
      });
      return;
    }
    
    showLoader();

    try {
      await saveReview(values, user);
      toast({
        title: 'Review Submitted!',
        description: 'Thank you for your feedback.',
        variant: 'success'
      });
      form.reset();
       // Refresh reviews list
      const fetchedReviews = await getReviews();
      setReviews(fetchedReviews);
    } catch (err) {
      setError({
        title: 'Submission Failed',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      hideLoader();
    }
  }

  const handleLogin = async () => {
    showLoader();
    try {
      await signIn();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Login failed:', error);
      }
    } finally {
      hideLoader();
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  return (
    <>
      <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-accent/20 via-background to-background">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 w-full max-w-3xl text-center">
            <Star className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Leave a Review
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We'd love to hear your thoughts on our website!
            </p>
          </div>

          {user ? (
            <Card className="w-full max-w-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Review</CardTitle>
                <CardDescription>
                  Rate your experience and share your feedback with us.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-lg">
                             Rating
                          </FormLabel>
                          <FormControl>
                            <StarRatingInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-lg">
                            <MessageSquare className="h-5 w-5" /> Comment
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us what you liked or what we can improve..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Alert className="mt-8 max-w-3xl border-primary/50 bg-primary/10 text-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Authentication Required</AlertTitle>
              <AlertDescription>
                You need to be logged in to leave a review. Please log in to continue.
              </AlertDescription>
              <Button onClick={handleLogin} className="mt-4">
                <LogIn className="mr-2 h-4 w-4" />
                Login with Google
              </Button>
            </Alert>
          )}

          <div className="mt-16 w-full max-w-3xl">
            <h2 className="text-center font-headline text-3xl font-bold">What Others Are Saying</h2>
             {loadingReviews ? (
                <div className="mt-8 space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
            ) : reviews.length > 0 ? (
                <div className="mt-8 space-y-6">
                    {reviews.map((review) => (
                        <Card key={review.id} className="shadow-md">
                        <CardContent className="p-6">
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
                        </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="mt-8 text-center text-muted-foreground">Be the first to leave a review!</p>
            )}
          </div>
        </div>
      </div>
      {error && (
        <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                {error.title}
              </AlertDialogTitle>
              <AlertDialogDescription>{error.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

