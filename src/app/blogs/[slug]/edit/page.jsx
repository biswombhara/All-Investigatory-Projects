
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../../components/ui/form.jsx';
import { Input } from '../../../../components/ui/input.jsx';
import { useToast } from '../../../../hooks/use-toast.js';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext.jsx';
import { Alert, AlertTitle, AlertDescription } from '../../../../components/ui/alert.jsx';
import { updateBlogPost, getBlogPostBySlug } from '../../../../services/firestore.js';
import { LoadingContext } from '../../../../context/LoadingContext.jsx';
import { useRouter, useParams } from 'next/navigation';
import { Loader } from '../../../../components/Loader.jsx';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';


const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
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
  const { theme } = useTheme();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
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
      await updateBlogPost(post.id, {
        title: values.title,
        content: values.content,
      });
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

  if (error || !user) {
     return (
        <div className="container mx-auto px-4 py-12">
            <Alert variant="destructive" className="max-w-md mx-auto text-center">
                <AlertCircle className="mx-auto h-6 w-6" />
                <AlertTitle className="mt-2 text-xl font-bold">Error</AlertTitle>
                <AlertDescription>{error || "You must be logged in to edit this post."}</AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <div className="min-h-[calc(100vh-8rem)] w-full bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-headline text-3xl font-bold">Edit Post</h1>
                    <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
            </div>
            <div className="space-y-6">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                         <Input 
                            placeholder="Title" 
                            {...field} 
                            className="text-4xl font-extrabold h-auto p-2 border-0 border-b-2 rounded-none focus-visible:ring-0 focus:border-primary transition-colors" 
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
                    <FormControl>
                        <div data-color-mode={theme}>
                        <MDEditor
                            value={field.value}
                            onChange={field.onChange}
                            height={600}
                            preview="edit"
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            </form>
        </Form>
      </div>
    </div>
  );
}
