
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState } from 'react';
import { Button } from '../../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Textarea } from '../../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.jsx';
import { useToast } from '../../../hooks/use-toast.js';
import { Send, LogIn, AlertCircle, Loader2, Type, FileText } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert.jsx';
import { saveBlogPost } from '../../../services/firestore.js';
import { LoadingContext } from '../../../context/LoadingContext.jsx';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters.').max(200, 'Excerpt cannot exceed 200 characters.'),
  content: z.string().min(50, 'Content must be at least 50 characters.'),
});

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};


export default function CreateBlogPage() {
  const { toast } = useToast();
  const { user, signIn } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoadingContext);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to create a post.', variant: 'destructive' });
      return;
    }

    showLoader();
    const slug = createSlug(values.title);

    try {
      await saveBlogPost({ ...values, slug }, user);
      toast({
        title: 'Post Published!',
        description: 'Your blog post is now live.',
      });
      router.push(`/blogs/${slug}`);
    } catch (err) {
       toast({ title: 'Publishing Failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
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
    <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 w-full max-w-4xl text-center">
          <FileText className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Create a New Blog Post
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Share your knowledge and insights with the community.
          </p>
        </div>

        {user ? (
          <Card className="w-full max-w-4xl shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                New Post
              </CardTitle>
              <CardDescription>
                Fill in the details below. You can use Markdown for formatting the content.
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
                        <FormLabel className="flex items-center gap-2 text-lg"><Type className="h-5 w-5" /> Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Post Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg">Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A short summary of your post..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                         <FormDescription>
                           This will be shown on the main blog page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg">Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your post here. Markdown is supported."
                            rows={15}
                            {...field}
                          />
                        </FormControl>
                         <FormDescription>
                          You can use markdown for headings, lists, links, etc.
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
        ) : (
          <Alert className="mt-8 max-w-3xl border-primary/50 bg-primary/10 text-center">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in to create a blog post.
            </AlertDescription>
            <Button onClick={handleLogin} className="mt-4">
              <LogIn className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </Alert>
        )}
      </div>
    </div>
  );
}
