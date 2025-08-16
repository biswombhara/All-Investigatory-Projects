
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form.jsx';
import { Input } from '../../../../components/ui/input.jsx';
import { Textarea } from '../../../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card.jsx';
import { useToast } from '../../../../hooks/use-toast.js';
import { Send, AlertCircle, Loader2, Type, FileText } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext.jsx';
import { Alert, AlertTitle, AlertDescription } from '../../../../components/ui/alert.jsx';
import { updateBlogPost, getBlogPostBySlug } from '../../../../services/firestore.js';
import { LoadingContext } from '../../../../context/LoadingContext.jsx';
import { useRouter, useParams } from 'next/navigation';
import { Loader } from '../../../../components/Loader.jsx';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters.').max(200, 'Excerpt cannot exceed 200 characters.'),
  content: z.string().min(50, 'Content must be at least 50 characters.'),
});

export default function EditBlogPage() {
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoadingContext);
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { slug } = params;
      if (!slug) return;
      
      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
          form.reset({
            title: fetchedPost.title,
            excerpt: fetchedPost.excerpt,
            content: fetchedPost.content,
          });
          // Authorization check
          if (!user || user.uid !== fetchedPost.authorId) {
             setError("You are not authorized to edit this post.");
          }
        } else {
          setError("Blog post not found.");
        }
      } catch (err) {
        setError('Failed to load the blog post.');
      } finally {
        setLoading(false);
        hideLoader();
      }
    };
    if (user) { // Only fetch if user is loaded
        fetchPost();
    } else if (user === null) { // user state is loaded but no user
        setLoading(false);
        hideLoader();
    }
  }, [params, form, user, hideLoader]);


  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user || user.uid !== post.authorId) {
      toast({ title: 'Authorization Error', description: 'You are not allowed to edit this post.', variant: 'destructive' });
      return;
    }

    showLoader();

    try {
      await updateBlogPost(post.id, values);
      toast({
        title: 'Post Updated!',
        description: 'Your blog post has been successfully updated.',
      });
      router.push(`/blogs/${post.slug}`);
    } catch (err) {
       toast({ title: 'Update Failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      hideLoader();
    }
  }

  if (loading) return <Loader />;

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-12">
            <Alert variant="destructive" className="max-w-md mx-auto text-center">
                <AlertCircle className="mx-auto h-6 w-6" />
                <AlertTitle className="mt-2 text-xl font-bold">Access Denied</AlertTitle>
                <AlertDescription>You must be logged in to edit a post.</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (error) {
     return (
        <div className="container mx-auto px-4 py-12">
            <Alert variant="destructive" className="max-w-md mx-auto text-center">
                <AlertCircle className="mx-auto h-6 w-6" />
                <AlertTitle className="mt-2 text-xl font-bold">Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 w-full max-w-4xl text-center">
          <FileText className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Edit Blog Post
          </h1>
        </div>
        <Card className="w-full max-w-4xl shadow-xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    Editing: {post.title}
                </CardTitle>
                <CardDescription>
                    Make your changes below. Remember to save them!
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
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
