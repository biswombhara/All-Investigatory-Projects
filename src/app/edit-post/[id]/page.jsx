
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect } from 'react';
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
import { Save, FileText, Type, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { useRouter, useParams, notFound } from 'next/navigation';
import { getBlogPost, updateBlogPost } from '../../../services/firestore.js';
import { uploadImageToGoogleDrive } from '../../../services/storage.js';
import { Loader } from '../../../components/Loader.jsx';
import Image from 'next/image';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }).max(100, {
    message: 'Title cannot exceed 100 characters.'
  }),
  body: z.string().min(100, {
    message: 'Body must be at least 100 characters.',
  }),
  image: z
    .any()
    .optional()
    .refine((files) => !files || (files instanceof File && files.size <= MAX_FILE_SIZE), `Max image size is 5MB.`)
    .refine(
      (files) => !files || (files instanceof File && ACCEPTED_IMAGE_TYPES.includes(files.type)),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export default function EditPostPage() {
  const { toast } = useToast();
  const { user, accessToken, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      image: undefined,
    },
  });
  
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast({ title: "You must be logged in to edit posts.", variant: "destructive" });
      router.push('/blogs');
      return;
    }

    const fetchPost = async () => {
        try {
            const fetchedPost = await getBlogPost(postId);
            if (!fetchedPost || fetchedPost.authorId !== user.uid) {
                notFound();
                return;
            }
            setPost(fetchedPost);
            form.reset({
                title: fetchedPost.title,
                body: fetchedPost.body,
            });
            setCurrentImageUrl(fetchedPost.imageUrl);
        } catch (error) {
            notFound();
        } finally {
            setLoadingPost(false);
        }
    }
    fetchPost();

  }, [postId, user, authLoading, router, toast, form]);

  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user || !post) return;
    if (!accessToken) {
       toast({ title: 'Authentication Error', description: 'Please log in again.', variant: 'destructive'});
       return;
    }

    try {
      let imageUrl = post.imageUrl;
      // Check if a new file is being uploaded
      if (values.image instanceof File) {
        const driveFile = await uploadImageToGoogleDrive(values.image, values.title, accessToken);
        imageUrl = driveFile.webViewLink.replace("/view?usp=drivesdk", "");
      }

      const postData = {
          title: values.title,
          body: values.body,
          imageUrl,
      };

      await updateBlogPost(postId, postData, user.uid);
      toast({
        title: 'Post Updated!',
        description: 'Your blog post has been successfully saved.',
      });
      router.push(`/blogs/${postId}`);
    } catch (err) {
       toast({
        title: 'Update Failed',
        description: err.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (authLoading || loadingPost) {
    return <Loader />;
  }
  
  return (
    <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 w-full max-w-3xl text-center">
          <FileText className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Edit Post
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Make changes to your post and save them.
          </p>
        </div>

        <Card className="w-full max-w-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
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
                
                {currentImageUrl && (
                    <div className="space-y-2">
                        <FormLabel>Current Image</FormLabel>
                        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg">
                            <Image src={currentImageUrl} alt="Current post image" layout="fill" objectFit="cover" />
                        </div>
                    </div>
                )}

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> Change Featured Image (Optional)
                      </FormLabel>
                      <FormControl>
                         <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            {...rest}
                            className="file:text-primary"
                          />
                      </FormControl>
                      <FormDescription>
                        Upload a new image to replace the current one (max 5MB).
                      </FormDescription>
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
                          rows={15}
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        You can edit the content of your post here.
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
                    <Save className="mr-2 h-4 w-4" />
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
