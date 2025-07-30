
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState } from 'react';
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
import { Textarea } from '../../components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { Send, FileText, MessageSquare, ShieldCheck, LogIn, AlertCircle, Loader2 } from 'lucide-react';
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
import { savePdfRequest } from '../../services/firestore.js';
import { LoadingContext } from '../../context/LoadingContext.jsx';


const formSchema = z.object({
  topic: z.string().min(5, {
    message: 'Topic must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
});

export default function RequestPdfPage() {
  const { toast } = useToast();
  const { user, signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { showLoader, hideLoader } = useContext(LoadingContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      description: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    if (!user) {
      setError({
        title: 'Authentication Error',
        message: 'You must be logged in to submit a request.',
      });
      return;
    }

    showLoader();

    try {
      await savePdfRequest(values, user);
      toast({
        title: 'Request Sent!',
        description: "Thank you for your suggestion. We'll review it shortly.",
      });
      form.reset();
    } catch (err) {
       setError({
        title: 'Submission Failed',
        message: 'Something went wrong. Please try again.',
      });
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
    <>
      <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 w-full max-w-3xl text-center">
            <FileText className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Request a New PDF
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have an idea for a document you'd like to see? Let us know!
            </p>
          </div>

          {user ? (
            <Card className="w-full max-w-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Your Suggestion
                </CardTitle>
                <CardDescription>
                  Provide details about the document you want us to create.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Topic / Title
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., The History of Artificial Intelligence" {...field} />
                          </FormControl>
                          <FormDescription>
                            What should the main topic of the PDF be?
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
                            <Textarea
                              placeholder="Describe the content you'd like to see in the document. What key points should be covered?"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                           <FormDescription>
                            The more detail you provide, the better we can fulfill your request.
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
                      {isSubmitting ? 'Sending...' : 'Send Request'}
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
                You need to be logged in to request a document. Please log in with your Google account to continue.
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
