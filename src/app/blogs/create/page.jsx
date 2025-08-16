
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState } from 'react';
import { Button } from '../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { Send, Image as ImageIcon, Type, MessageSquare, LogIn, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
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
import { saveBlogPost } from '../../services/firestore.js';
import { LoadingContext } from '../../context/LoadingContext.jsx';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }),
  description: z.string().min(50, {
    message: 'Description must be at least 50 characters.',
  }),
  coverImage: z.string().url({
    message: 'Please enter a valid image URL.',
  }),
});

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove multiple hyphens
    .trim();
};

export default function CreateBlogPage() {
  const { toast } = useToast();
  const { user, signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { showLoader, hideLoader } = useContext(LoadingContext);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      coverImage: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user) {
      setError({
        title: 'Authentication Error',
        message: 'You must be logged in to create a post.',
      });
      return;
    }

    showLoader();
    
    const slug = generateSlug(values.title);
    
    try {
      await saveBlogPost({ ...values, slug }, user);
      toast({
        title: 'Blog Post Published!',
        description: 'Your new post is now live.',
      });
      form.reset();
      router.push(`/blogs/${slug}`);
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

  return (
    <>
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create a New Post
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Share your thoughts and insights with the community.
          </p>
        </div>

        <div className="mt-16 w-full max-w-3xl mx-auto">
          {user ? (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-center">
                  New Blog Post
                </CardTitle>
                <CardDescription className="text-center">
                  Fill out the details below to publish your post.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Type className="h-4 w-4" /> Post Title
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your Awesome Blog Post Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Cover Image URL
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write a short description or the main content of your post here..."
                              rows={8}
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
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
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
                You need to be logged in to create a blog post. Please log in with your Google account to continue.
              </AlertDescription>
              <Button onClick={handleLogin} className="mt-4">
                <LogIn className="mr-2 h-4 w-4" />
                Login with Google
              </Button>
            </Alert>
          )}
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
