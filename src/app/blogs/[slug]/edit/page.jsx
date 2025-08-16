
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect, useCallback } from 'react';
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
import { Send, AlertCircle, Loader2, CheckCircle, Save } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext.jsx';
import { Alert, AlertTitle, AlertDescription } from '../../../../components/ui/alert.jsx';
import { updateBlogPost, getBlogPostBySlug } from '../../../../services/firestore.js';
import { LoadingContext } from '../../../../context/LoadingContext.jsx';
import { useRouter, useParams } from 'next/navigation';
import { Loader } from '../../../../components/Loader.jsx';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import debounce from 'lodash.debounce';


const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
  content: z.string(),
});

export default function EditBlogPage() {
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const { hideLoader, showLoader } = useContext(LoadingContext);
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved', 'Saving...', 'Unsaved'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  
  const { watch, trigger } = form;

  const debouncedSave = useCallback(
    debounce(async (values) => {
      if (!post) return;
      setSaveStatus('Saving...');
      const isValid = await trigger();
      if (isValid) {
        try {
          await updateBlogPost(post.id, values);
          setSaveStatus('Saved');
        } catch (err) {
          toast({ title: 'Save Failed', description: 'Could not save changes.', variant: 'destructive' });
          setSaveStatus('Unsaved');
        }
      } else {
        setSaveStatus('Unsaved');
      }
    }, 1500), // 1.5-second debounce delay
    [post, trigger, toast]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      setSaveStatus('Unsaved');
      debouncedSave(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);


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
    if (user === undefined) return; // Wait for user state to be determined

    if (user) { 
        fetchPost();
    } else {
        setLoading(false);
        hideLoader();
    }
  }, [params, form, user, hideLoader]);


  const { isSubmitting } = form.formState;

  // Manual submit handler, though auto-save is primary
  async function onSubmit(values) {
    if (!user || user.uid !== post.authorId) {
      toast({ title: 'Authorization Error', description: 'You are not allowed to edit this post.', variant: 'destructive' });
      return;
    }
    
    showLoader();
    setSaveStatus('Saving...');
    try {
      await updateBlogPost(post.id, values);
      setSaveStatus('Saved');
      toast({
        title: 'Post Updated!',
        description: 'Your blog post has been successfully updated.',
      });
      router.push(`/blogs/${post.slug}`);
    } catch (err) {
       toast({ title: 'Update Failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
       setSaveStatus('Unsaved');
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

  const SaveStatusIcon = () => {
    switch (saveStatus) {
      case 'Saving...':
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
      case 'Saved':
        return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
      default:
        return <Save className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  };


  return (
    <div className="min-h-[calc(100vh-8rem)] w-full bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center text-sm text-muted-foreground">
                    <SaveStatusIcon />
                    <span>{saveStatus}</span>
                </div>
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || saveStatus === 'Saving...'}
                    >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Publishing...' : 'Publish'}
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
                            className="text-4xl font-extrabold h-auto p-2 border-0 border-b-2 rounded-none focus-visible:ring-0 focus:border-primary transition-colors bg-transparent" 
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
                            commands={['bold', 'italic', 'strikethrough', 'hr', 'title', 'link', 'quote', 'code', 'image']}
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
