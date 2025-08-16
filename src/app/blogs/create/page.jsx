
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState } from 'react';
import { Button } from '../../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Textarea } from '../../../components/ui/textarea.jsx';
import { useToast } from '../../../hooks/use-toast.js';
import { Send, LogIn, AlertCircle, Loader2, Save, Eye, Image as ImageIcon, Tag, BookText } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert.jsx';
import { saveBlogPost } from '../../../services/firestore.js';
import { LoadingContext } from '../../../context/LoadingContext.jsx';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
  status: z.enum(['draft', 'published']),
  slug: z.string().optional(),
  coverImage: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  tags: z.string().optional(),
  excerpt: z.string().optional(),
});

const createSlug = (title) => {
  if (!title) return '';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      slug: '',
      coverImage: '',
      tags: '',
      excerpt: '',
    },
  });
  
  const { watch } = form;
  const titleValue = watch('title');

  async function onSubmit(values) {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to create a post.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    showLoader();

    const slug = values.slug || createSlug(values.title);
    const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

    const finalValues = { ...values, slug, tags: tagsArray };

    try {
      const postId = await saveBlogPost(finalValues, user);
      toast({
        title: `Post ${values.status === 'published' ? 'Published' : 'Saved as Draft'}!`,
        description: 'Your blog post has been successfully saved.',
      });
      // Redirect to the new post if published, otherwise to the edit page for the draft
      router.push(values.status === 'published' ? `/blogs/${slug}` : `/blogs/${slug}/edit`);
    } catch (err) {
       toast({ title: 'Saving Failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
       setIsSubmitting(false);
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
    <div className="min-h-screen bg-secondary/30">
      {!user ? (
          <div className="container mx-auto flex flex-col items-center justify-center h-[80vh]">
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
            <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold">Create New Post</h1>
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" onClick={() => setPreview(!preview)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {preview ? 'Editor' : 'Preview'}
                        </Button>
                        <Button type="submit" onClick={() => form.setValue('status', 'draft')} disabled={isSubmitting}>
                            {isSubmitting && form.getValues('status') === 'draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Draft
                        </Button>
                        <Button type="submit" onClick={() => form.setValue('status', 'published')} disabled={isSubmitting}>
                             {isSubmitting && form.getValues('status') === 'published' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Publish
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Post Title" {...field} className="text-4xl font-extrabold h-auto p-2 border-0 focus-visible:ring-0 bg-transparent" />
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
                            preview={preview ? 'preview' : 'edit'}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader><CardTitle>Post Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><BookText className="h-4 w-4" /> URL Slug</FormLabel>
                                <FormControl><Input placeholder={createSlug(titleValue)} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Cover Image URL</FormLabel>
                          <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tags (comma-separated)</FormLabel>
                          <FormControl><Input placeholder="e.g., tech, react, nextjs" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><BookText className="h-4 w-4" /> Excerpt</FormLabel>
                          <FormControl><Textarea placeholder="A short summary of the post for previews." {...field} /></FormControl>
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
  );
}
