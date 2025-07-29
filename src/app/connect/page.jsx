
'use client';

import { Button } from '../../components/ui/button.jsx';
import { Mail, Send, Youtube, MessageSquare, Type, Loader2, ShieldCheck, LogIn, AlertCircle, FileQuestion, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React, { useContext, useState } from 'react';
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
import { useToast } from '../../hooks/use-toast.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { saveContactMessage } from '../../services/firestore.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.jsx';


const formSchema = z.object({
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  message: z.string().min(20, {
    message: 'Message must be at least 20 characters.',
  }),
});


export default function ConnectPage() {
    const { toast } = useToast();
    const { user, signIn } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: '',
            message: '',
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
          await saveContactMessage(values, user);
          toast({
            title: 'Message Sent!',
            description: "Thank you for contacting us. We'll get back to you shortly.",
          });
          form.reset();
        } catch (err) {
           setError({
            title: 'Submission Failed',
            message: 'Something went wrong. Please try again.',
          });
        }
    }
  
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

       <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

        <div className="mt-16 max-w-4xl mx-auto">
             <Card className="w-full mt-8 shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <Mail className="h-6 w-6" /> Send us a Message
                </CardTitle>
                <CardDescription>
                  Have a question or feedback? Fill out the form below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Type className="h-4 w-4" /> Subject
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Question about a PDF" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Your Message
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please write your message here..."
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
                ) : (
                    <Alert className="border-primary/50 bg-primary/10 text-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Authentication Required</AlertTitle>
                        <AlertDescription>
                        You need to be logged in to send a message. Please log in to continue.
                        </AlertDescription>
                        <Button onClick={() => signIn()} className="mt-4">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login with Google
                        </Button>
                    </Alert>
                )}
              </CardContent>
            </Card>
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
