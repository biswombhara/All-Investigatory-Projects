'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Loader2, User, Save, LogIn, ShieldCheck } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext.jsx';
import { LoadingContext } from '@/context/LoadingContext.jsx';
import { updateUserProfile } from '@/services/auth.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert.jsx';


const formSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, loading: authLoading, signIn, reloadUser } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoadingContext);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
    },
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || '',
      });
    }
  }, [user, form]);

  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    showLoader();
    try {
      await updateUserProfile(user, values);
      await reloadUser(); // Refresh user state from AuthContext
      toast({
        title: 'Profile Updated!',
        description: 'Your name has been successfully updated.',
      });
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
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
  
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };
  
  if (authLoading) {
    return <div className="h-screen"></div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
       <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Profile
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            View and manage your account details.
          </p>
        </div>
      
      <div className="mt-16 w-full max-w-2xl mx-auto">
        {user ? (
          <Card className="shadow-xl">
             <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">
                {user.displayName}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Full Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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
              You need to be logged in to view your profile.
            </AlertDescription>
            <Button onClick={handleLogin} className="mt-4">
              <LogIn className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </Alert>
        )}
      </div>
    </div>
  );
}
