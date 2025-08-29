
import { getBlogPostBySlug, incrementBlogPostViewCount } from '../../../services/firestore.js';
import BlogPostPageClient from '../../../components/BlogPostPageClient.jsx';

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = 'https://allinvestigatoryprojects.netlify.app';
  const postUrl = `${siteUrl}/blogs/${post.slug}`;
  const description = post.description.substring(0, 160);

  // Combine title, author, and custom keywords for better SEO
  const keywords = [
    post.title,
    post.authorName,
    ...(post.keywords ? post.keywords.split(',').map(k => k.trim()) : [])
  ].join(', ');

  return {
    title: `${post.title} | All Investigatory Projects`,
    description: description,
    keywords: keywords,
    openGraph: {
      title: post.title,
      description: description,
      url: postUrl,
      siteName: 'All Investigatory Projects',
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.createdAt?.toDate().toISOString(),
      modifiedTime: post.updatedAt?.toDate().toISOString() || post.createdAt?.toDate().toISOString(),
      author: post.authorName,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [post.coverImage],
      creator: '@yourtwitterhandle', // Replace with your actual Twitter handle
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

// Helper function to serialize Firestore Timestamps
const serializePost = (post) => {
  if (!post) return null;
  const serializedPost = { ...post };
  if (post.createdAt && typeof post.createdAt.toDate === 'function') {
    serializedPost.createdAt = post.createdAt.toDate().toISOString();
  }
  if (post.updatedAt && typeof post.updatedAt.toDate === 'function') {
    serializedPost.updatedAt = post.updatedAt.toDate().toISOString();
  }
  return serializedPost;
};


export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const postData = await getBlogPostBySlug(slug);

  // Increment view count on the server for every visit
  if (postData) {
    await incrementBlogPostViewCount(postData.id);
  }
  
  const initialPost = serializePost(postData);

  return <BlogPostPageClient slug={slug} initialPost={initialPost} />;
}
