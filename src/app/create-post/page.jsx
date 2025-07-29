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
import { Input } from '../../components/ui/input.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { Send, FileText, Type, ShieldCheck, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.jsx';
import { useRouter } from 'next/navigation';
import { createBlogPost } from '../../services/firestore.js';

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }).max(100, {
    message: 'Title cannot exceed 100 characters.'
  }),
  body: z.string().min(100, {
    message: 'Body must be at least 100 characters.',
  }),
});

export default function CreatePostPage() {
  const { toast } = useToast();
  const { user, loading: authLoading, signIn } = useContext(AuthContext);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const { isSubmitting } = form.formState;
  
  // Redirect if not logged in after auth state is determined
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  async function onSubmit(values) {
    if (!user) {
      toast({
          title: 'Authentication Error',
          description: 'You must be logged in to create a post.',
          variant: 'destructive',
      });
      return;
    }

    try {
      const postId = await createBlogPost(values, user);
      toast({
        title: 'Post Created!',
        description: 'Your blog post has been successfully published.',
      });
      router.push(`/blogs/${postId}`);
    } catch (err) {
       toast({
        title: 'Creation Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }

  // Show a loading state or nothing while checking auth
  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  return (
    <>
      <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 w-full max-w-3xl text-center">
            <FileText className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Create a New Post
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Share your thoughts and knowledge with the community.
            </p>
          </div>

          <Card className="w-full max-w-3xl shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                New Blog Post
              </CardTitle>
              <CardDescription>
                Fill in the details below to publish your article.
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
                          <Input placeholder="e.g., A Guide to Modern Physics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Post Body
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your post content here. Markdown is supported."
                            rows={15}
                            {...field}
                          />
                        </FormControl>
                         <FormDescription>
                          Be detailed and clear. The community appreciates quality content!
                        </FormDescription>
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
        </div>
      </div>
    </>
  );
}
