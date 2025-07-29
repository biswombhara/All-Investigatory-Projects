
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState } from 'react';
import { Button } from '../../components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { FileQuestion, UploadCloud, Send, MessageSquare, ShieldCheck, LogIn, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { useToast } from '../../hooks/use-toast.js';
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
import { saveContactSubmission } from '../../services/firestore.js';

const formSchema = z.object({
  topic: z.string().min(5, {
    message: 'Topic must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
});


export default function ConnectPage() {
    const { toast } = useToast();
    const { user, signIn } = useContext(AuthContext);
    const [error, setError] = useState(null);

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
            message: 'You must be logged in to send a message.',
        });
        return;
        }

        try {
            await saveContactSubmission(values, user);
            toast({
                title: 'Message Sent!',
                description: 'Thank you for reaching out. We will get back to you shortly.',
                variant: 'success',
            });
            form.reset();
        } catch (err) {
            setError({
                title: 'Submission Failed',
                message: 'Something went wrong. Please try again.',
            });
        }
    }
  
    const handleLogin = async () => {
        try {
            await signIn();
        } catch (error) {
            if (error.code !== 'auth/popup-closed-by-user') {
                console.error('Login failed:', error);
            }
        }
    };

  return (
    <>
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Connect With Us
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Help our community grow by requesting or uploading new educational materials, or send us a message directly.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                        <FileQuestion className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4">Request a PDF</CardTitle>
                    <CardDescription>
                    Can't find a document? Let us know what you're looking for and we might create it for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                    <Link href="/request-pdf">Make a Request</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4">Upload a PDF</CardTitle>
                    <CardDescription>
                    Have an investigatory project or notes to share? Upload them and help other students.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                    <Link href="/upload-pdf">Share Your Document</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="mt-16 w-full max-w-3xl mx-auto">
            {user ? (
                 <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-center">
                           Contact Us Directly
                        </CardTitle>
                        <CardDescription className="text-center">
                            Have a question or a message for us? Fill out the form below.
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
                                        <FileQuestion className="h-4 w-4" /> Topic / Subject
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Question about a specific PDF" {...field} />
                                    </FormControl>
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
                                        <MessageSquare className="h-4 w-4" /> Message
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Please provide details here..."
                                        rows={5}
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
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <Card className="p-8 text-center bg-secondary">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Contact Us</CardTitle>
                        <CardDescription>
                            You need to be logged in to send a message. Please log in with your Google account to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleLogin}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login with Google
                        </Button>
                    </CardContent>
                </Card>
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
