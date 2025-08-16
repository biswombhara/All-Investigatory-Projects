
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
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';


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
  const { theme } = useTheme();


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
    <div className="min-h-[calc(100vh-8rem)] w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {!user ? (
           <div className="flex flex-col items-center justify-center h-[60vh]">
            <Alert className="max-w-md border-primary/50 bg-primary/10 text-center">
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
          </div>
        ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="font-headline text-3xl font-bold">Create Post</h1>
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
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                      <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Title" {...field} className="text-2xl font-bold h-14 border-0 shadow-none focus-visible:ring-0 px-0" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div data-color-mode={theme}>
                                    <MDEditor
                                      value={field.value}
                                      onChange={field.onChange}
                                      height={500}
                                      preview="edit"
                                    />
                                  </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                  </div>
                  <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                            <CardTitle>Post settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name="excerpt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Search Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="A short summary of your post for search results..."
                                      rows={4}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    This will be shown on the main blog page and in search engine results.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </CardContent>
                      </Card>
                  </div>
                </div>
              </form>
            </Form>
        )}
      </div>
    </div>
  );
}
