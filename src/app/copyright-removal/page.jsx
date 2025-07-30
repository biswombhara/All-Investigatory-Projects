
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
import { Send, Shield, MessageSquare, ShieldCheck, LogIn, AlertCircle, Loader2, Link } from 'lucide-react';
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
import { signInWithGoogle } from '../../services/auth.js';
import { saveCopyrightRemovalRequest } from '../../services/firestore.js';
import { LoadingContext } from '../../context/LoadingContext.jsx';


const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
});

export default function CopyrightRemovalPage() {
  const { toast } = useToast();
  const { user, signIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { showLoader, hideLoader } = useContext(LoadingContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
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
      await saveCopyrightRemovalRequest(values, user);
      toast({
        title: 'Request Sent!',
        description: 'Thank you for your submission. We will review it shortly.',
        variant: 'success',
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
      <div className="min-h-[calc(100vh-14rem)] w-full bg-gradient-to-br from-destructive/10 via-background to-background">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 w-full max-w-3xl text-center">
            <Shield className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Copyright Removal Request
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Please provide the necessary information to report a copyright infringement.
            </p>
          </div>

          {user ? (
            <Card className="w-full max-w-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Infringement Details
                </CardTitle>
                <CardDescription>
                  Fill out the form below to submit your claim.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Link className="h-4 w-4" /> URL of Infringing Content
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide the direct link to the content on our site you believe is infringing.
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
                            <MessageSquare className="h-4 w-4" /> Description of Infringement
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe why you believe this content infringes on your copyright. Include details of your original work."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                           <FormDescription>
                             Provide a detailed explanation to help us process your request quickly.
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
                      variant="destructive"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Alert className="mt-8 max-w-3xl border-destructive/50 bg-destructive/10 text-center">
              <ShieldCheck className="h-4 w-4 text-destructive" />
              <AlertTitle className="text-destructive">Authentication Required</AlertTitle>
              <AlertDescription>
                You need to be logged in to submit a copyright claim. This helps us prevent fraudulent requests. Please log in to continue.
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
