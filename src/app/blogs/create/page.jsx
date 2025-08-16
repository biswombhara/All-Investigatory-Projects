
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../components/ui/form.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { useToast } from '../../../hooks/use-toast.js';
import { Send, LogIn, AlertCircle, Loader2, CheckCircle, Save } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert.jsx';
import { saveBlogPost, updateBlogPost } from '../../../services/firestore.js';
import { LoadingContext } from '../../../context/LoadingContext.jsx';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import debounce from 'lodash.debounce';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
  content: z.string(),
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
  const [postId, setPostId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Unsaved'); // 'Saved', 'Saving...', 'Unsaved'


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
      if (!user) return;
      setSaveStatus('Saving...');
      const isValid = await trigger();
      if (!isValid) {
        setSaveStatus('Unsaved');
        return;
      }
      
      const slug = createSlug(values.title);

      try {
        if (postId) {
          // If we have a post ID, we're updating an existing draft
          await updateBlogPost(postId, { ...values, slug });
        } else {
          // Otherwise, we're creating the first version of the post
          const newPostId = await saveBlogPost({ ...values, slug }, user);
          setPostId(newPostId); // Store the new ID for subsequent saves
        }
        setSaveStatus('Saved');
      } catch (err) {
        toast({ title: 'Save Failed', description: 'Could not save changes.', variant: 'destructive' });
        setSaveStatus('Unsaved');
      }
    }, 1500), // 1.5-second debounce delay
    [user, postId, trigger, toast]
  );
  
  useEffect(() => {
    if (!user) return;
    const subscription = watch((values) => {
      if (values.title.length > 4) { // Only start saving when there's a title
        setSaveStatus('Unsaved');
        debouncedSave(values);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave, user]);


  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to create a post.', variant: 'destructive' });
      return;
    }

    showLoader();
    const slug = createSlug(values.title);

    try {
       if (postId) {
        await updateBlogPost(postId, { ...values, slug });
      } else {
        const newPostId = await saveBlogPost({ ...values, slug }, user);
        setPostId(newPostId);
      }

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
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <SaveStatusIcon />
                      <span>{saveStatus}</span>
                    </div>
                     <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || saveStatus !== 'Saved'}
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
        )}
      </div>
    </div>
  );
}
