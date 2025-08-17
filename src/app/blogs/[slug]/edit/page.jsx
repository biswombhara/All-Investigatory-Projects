
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
import { Send, Image as ImageIcon, Type, MessageSquare, AlertCircle, Loader2, Tags } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert.jsx';
import { getBlogPostBySlug, updateBlogPost } from '../../../../services/firestore.js';
import { LoadingContext } from '../../../../context/LoadingContext.jsx';
import { useRouter, useParams } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Loader } from '../../../../components/Loader.jsx';


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
  keywords: z.string().optional(),
});


export default function EditBlogPage() {
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { showLoader, hideLoader } = useContext(LoadingContext);
  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      coverImage: '',
      keywords: '',
    },
  });
  
  useEffect(() => {
    const fetchPost = async () => {
      showLoader();
      try {
        const fetchedPost = await getBlogPostBySlug(params.slug);
        if (fetchedPost) {
          if (fetchedPost.authorId !== user?.uid) {
             setError('You are not authorized to edit this post.');
             return;
          }
          setPost(fetchedPost);
          form.reset({
            title: fetchedPost.title,
            description: fetchedPost.description,
            coverImage: fetchedPost.coverImage,
            keywords: fetchedPost.keywords || '',
          });
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
        setError('Failed to load post data.');
      } finally {
        hideLoader();
      }
    };

    if (params.slug && user) {
      fetchPost();
    }
  }, [params.slug, user, form, showLoader, hideLoader]);


  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to update a post.', variant: 'destructive' });
      return;
    }
    
    if (!post) {
      toast({ title: 'Error', description: 'Post data not loaded.', variant: 'destructive' });
      return;
    }

    showLoader();
    
    try {
      await updateBlogPost(post.id, values);
      toast({
        title: 'Blog Post Updated!',
        description: 'Your post has been successfully updated.',
      });
      router.push(`/blogs/${post.slug}`);
    } catch (err) {
       toast({
        title: 'Update Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      hideLoader();
    }
  }

  if (!user || !post) {
    return <Loader />;
  }
  
  if (error) {
      return (
      <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <AlertCircle className="mx-auto h-6 w-6" />
          <AlertTitle className="mt-2 text-xl font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Edit Your Post
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
          Make changes to your post and save them.
        </p>
      </div>

      <div className="mt-16 w-full max-w-3xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">
              Editing: {post.title}
            </CardTitle>
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
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Please use a copyright-free image URL.
                      </FormDescription>
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
                         <div data-color-mode="light">
                           <MDEditor
                              value={field.value || ''}
                              onChange={field.onChange}
                              preview="edit"
                              height={300}
                            />
                          </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tags className="h-4 w-4" /> SEO Keywords
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., physics, quantum mechanics, class 12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Separate keywords with a comma.
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
