
'use client';

import { useState, useEffect, useContext } from 'react';
import { getBlogPosts } from '../../services/firestore.js';
import { Loader } from '../../components/Loader.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx';
import { Button } from '../../components/ui/button.jsx';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Calendar, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { AuthContext } from '../../context/AuthContext.jsx';

function BlogPostCard({ post }) {
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };
  
  const formattedDate = post.createdAt?.toDate ? format(post.createdAt.toDate(), 'PPP') : 'Date not available';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl leading-tight font-bold">{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{post.authorName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-muted-foreground">{post.body}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-secondary/50 p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
           <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount || 0}</span>
          </div>
           <div className="hidden sm:flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href={`/blogs/${post.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Our Community Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, stories, and updates from our community members.
        </p>
        {user && (
            <div className="mt-6">
                <Button asChild>
                    <Link href="/create-post">
                        <Edit className="mr-2 h-4 w-4" />
                        Create New Post
                    </Link>
                </Button>
            </div>
        )}
      </div>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-xl">No blog posts yet.</p>
          <p className="mt-2">Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}
