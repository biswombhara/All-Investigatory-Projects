

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useContext, useState, useEffect } from 'react';
import { Button } from '../ui/button.jsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form.jsx';
import { Input } from '../ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { UploadCloud, Type, Image as ImageIcon, Link as LinkIcon, School, FileText, Trash2, AlertTriangle, Loader2, Database } from 'lucide-react';
import { LoadingContext } from '../../context/LoadingContext.jsx';
import { saveEbook, getEbooks, deleteEbook, seedEbooksData } from '../../services/firestore.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import { Skeleton } from '../ui/skeleton.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog.jsx';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  coverImage: z.string().url({
    message: 'Please enter a valid image URL.',
  }),
  viewUrl: z.string().url({
      message: 'Please enter a valid view URL for the e-book.'
  }),
  subject: z.string().min(1, 'Please select a subject.'),
  class: z.string().min(1, 'Please select a class.'),
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

export function EbooksTab() {
  const { toast } = useToast();
  const { showLoader, hideLoader } = useContext(LoadingContext);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchEbooks = async () => {
    setLoading(true);
    const fetchedEbooks = await getEbooks();
    setEbooks(fetchedEbooks);
    setLoading(false);
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      coverImage: '',
      viewUrl: '',
      subject: '',
      class: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    showLoader();
    try {
      await saveEbook(values);
      toast({
        title: 'E-book Uploaded!',
        description: `${values.title} is now available.`,
      });
      form.reset();
      fetchEbooks();
    } catch (err) {
      toast({
        title: 'Upload Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      hideLoader();
    }
  }

  const handleDelete = async (ebookId, title) => {
    showLoader();
    try {
      await deleteEbook(ebookId);
      toast({ title: 'E-book Deleted', description: `${title} has been removed.` });
      fetchEbooks();
    } catch (error) {
      console.error("Failed to delete e-book", error);
      toast({ title: 'Error', description: 'Failed to delete the e-book.', variant: 'destructive' });
    } finally {
      hideLoader();
    }
  }

  const handleSeedData = async () => {
    showLoader();
    try {
      await seedEbooksData();
      toast({ title: 'Database Seeded', description: 'Demo e-books have been added.' });
      fetchEbooks(); // Refresh the list
    } catch (error) {
      console.error("Failed to seed data", error);
      toast({ title: 'Error', description: 'Failed to seed demo data.', variant: 'destructive' });
    } finally {
      hideLoader();
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New E-book</CardTitle>
          <CardDescription>Fill out the form to add a new e-book to the library.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Type /> Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E-book Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><ImageIcon /> Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/cover.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="viewUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><LinkIcon /> View Button URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/ebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileText /> Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                        <FormLabel className="flex items-center gap-2"><School /> Class</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Uploading...' : 'Upload E-book'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage E-books</CardTitle>
          <CardDescription>Review and delete existing e-books. You can also add demo data for testing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
              <Button onClick={handleSeedData} variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Seed Demo E-books (One-time)
              </Button>
          </div>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : ebooks.length > 0 ? (
            <div className="overflow-y-auto max-h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cover</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ebooks.map((ebook) => (
                            <TableRow key={ebook.id}>
                                <TableCell>
                                    <Image src={ebook.coverImage} alt={ebook.title} width={40} height={60} className="rounded-sm object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{ebook.title}</TableCell>
                                <TableCell className="text-right">
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle /> Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently delete the e-book "{ebook.title}". This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(ebook.id, ebook.title)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No e-books found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
