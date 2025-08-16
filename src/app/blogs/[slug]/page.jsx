
import { getBlogPostBySlug } from '../../../services/firestore.js';
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

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const initialPost = await getBlogPostBySlug(slug);

  return <BlogPostPageClient slug={slug} initialPost={initialPost} />;
}
