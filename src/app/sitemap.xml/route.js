import { getPdfs, getBlogPosts } from '../../services/firestore';

const URL = 'https://allinvestigatoryprojects.netlify.app';

function generateSiteMap(pdfs, posts) {
  const staticPages = [
    '',
    '/about',
    '/blogs',
    '/connect',
    '/copyright-removal',
    '/disclaimer',
    '/pdfs',
    '/privacy-policy',
    '/profile',
    '/request-pdf',
    '/reviews',
    '/terms-of-service',
    '/upload-pdf',
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     ${staticPages.map((page) => {
        return `
          <url>
              <loc>${`${URL}${page}`}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
          </url>
        `;
      }).join('')}

     <!-- PDF pages -->
     ${pdfs
       .map(({ id, createdAt }) => {
         const lastmod = createdAt?.toDate ? createdAt.toDate().toISOString() : new Date().toISOString();
         return `
           <url>
               <loc>${`${URL}/pdfs/${id}`}</loc>
                <lastmod>${lastmod}</lastmod>
               <changefreq>monthly</changefreq>
               <priority>0.7</priority>
           </url>
         `;
       })
       .join('')}

      <!-- Blog pages -->
      ${posts
       .map(({ slug, updatedAt, createdAt }) => {
         const lastmodDate = updatedAt?.toDate() || createdAt?.toDate() || new Date();
         const lastmod = lastmodDate.toISOString();
         return `
           <url>
               <loc>${`${URL}/blogs/${slug}`}</loc>
                <lastmod>${lastmod}</lastmod>
               <changefreq>daily</changefreq>
               <priority>0.9</priority>
           </url>
         `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  const pdfs = await getPdfs();
  const posts = await getBlogPosts();
  const body = generateSiteMap(pdfs, posts);

  return new Response(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml',
    },
  });
}
