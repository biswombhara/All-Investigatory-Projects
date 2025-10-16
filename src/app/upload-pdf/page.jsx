
'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form.jsx';
import { Input } from '../../components/ui/input.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.jsx';
import { uploadPdfToGoogleDrive } from '../../services/storage.js'; 
import { savePdfDocument } from '../../services/firestore.js'; 
import { LogIn, UploadCloud, FileText, Type, ShieldCheck, AlertCircle, Loader2, School } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoadingContext } from '../../context/LoadingContext.jsx';
import { getGoogleOAuthToken } from '../../services/auth.js';


const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  subject: z.string({
    required_error: 'Please select a subject.',
  }),
  class: z.string({
    required_error: 'Please select a class.',
  }),
  file: z.instanceof(File).refine((file) => file?.size > 0, 'A file is required.').refine((file) => file.size <= 100 * 1024 * 1024, `File size should not exceed 100MB.`),
});

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Science',
  'Physical Education',
  'Economics',
  'Computer science',
];

const classes = [
  '9th',
  '10th',
  '11th',
  '12th',
  'College ( Any UG & PG )',
  'School ( 4th - 8th )',
];

export default function UploadPdfPage() {
  const { user, signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { showLoader, hideLoader } = useContext(LoadingContext);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subject: '',
      class: '',
      file: undefined,
    },
  });

  async function onSubmit(values) {
    if (!user) {
      setError({
        title: 'Authentication Error',
        message: 'You must be logged in to upload a PDF.',
      });
      return;
    }
    
    setIsUploading(true);
    showLoader();
    setError(null);

    try {
      // Get a fresh access token right before the upload
      const accessToken = await getGoogleOAuthToken();
      if (!accessToken) {
        throw new Error('Could not obtain Google Drive authentication token. Please try signing in again.');
      }

      const driveFile = await uploadPdfToGoogleDrive(values.file, values.title, accessToken);
      
      const pdfData = {
        title: values.title,
        subject: values.subject,
        class: values.class,
        url: driveFile.webViewLink,
        publicId: driveFile.id,
        uploadedBy: user.uid,
        uploaderEmail: user.email,
        uploadedAt: new Date().toISOString(),
      };
      
      await savePdfDocument(pdfData, user);
      
      router.push('/?upload_success=true');

    } catch (err) {
      console.error('Frontend (UploadPdfPage): Upload process caught error:', err);
      setError({
        title: 'Upload Failed',
        message: err.message || 'Something went wrong during the upload. Please try again.',
      });
    } finally {
      setIsUploading(false);
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
         setError({
           title: 'Login Failed',
           message: error.message || 'Could not log in with Google.',
         });
       }
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 w-full max-w-3xl text-center">
            <UploadCloud className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Upload a PDF
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Share your educational materials with the community via Google Drive.
            </p>
          </div>

          {user ? (
            <Card className="w-full max-w-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Document Details
                </CardTitle>
                <CardDescription>
                  Provide the file and some information about it.
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
                            <Type className="h-4 w-4" /> Document Title
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Advanced Calculus Workbook" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Subject
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <School className="h-4 w-4" /> Class
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <UploadCloud className="h-4 w-4" /> PDF File
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept=".pdf"
                              onChange={(e) => onChange(e.target.files[0])}
                              {...rest}
                              className="file:text-primary"
                            />
                          </FormControl>
                            <FormDescription>
                            Please select a PDF file to upload (max 100MB).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isUploading}
                      className="w-full md:w-auto"
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="mr-2 h-4 w-4" />
                      )}
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
              <Alert className="mt-8 max-w-3xl border-primary/50 bg-primary/10 text-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Authentication Required</AlertTitle>
              <AlertDescription>
                You need to be logged in to upload a document. Please log in to continue.
              </AlertDescription>
              <Button onClick={handleLogin} className="mt-4">
                <LogIn className="mr-2 h-4 w-4" />
                Login with Google
              </Button>
            </Alert>
          )}
        </div>
      </div>
      {error && (
        <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                {error.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {error.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

    