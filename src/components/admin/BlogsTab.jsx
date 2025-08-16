
'use client';

import { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card.jsx';
import { Skeleton } from '../ui/skeleton.jsx';
import { getBlogPosts, deleteBlogPost } from '../../services/firestore.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Button } from '../ui/button.jsx';
import { Trash2, AlertTriangle, MessageSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { LoadingContext } from '../../context/LoadingContext.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible.jsx';
import { CommentsList } from './CommentsList.jsx';


export function BlogsTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { showLoader, hideLoader } = useContext(LoadingContext);

  const fetchPosts = async () => {
    setLoading(true);
    const fetchedPosts = await getBlogPosts();
    setPosts(fetchedPosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    showLoader();
    try {
      await deleteBlogPost(postId);
      toast({ title: 'Blog Post Deleted', description: 'The post and its comments have been removed.' });
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete blog post", error);
      toast({ title: 'Error', description: 'Failed to delete the post.', variant: 'destructive' });
    } finally {
      hideLoader();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Blog Posts</CardTitle>
        <CardDescription>
          Review, manage comments for, and delete blog posts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Collapsible key={post.id} className="rounded-lg border">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-sm text-muted-foreground">by {post.authorName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Manage Comments
                      </Button>
                    </CollapsibleTrigger>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle /> Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the blog post and all its comments. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="border-t bg-muted/50 p-4">
                     <CommentsList postId={post.id} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            No blog posts found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
