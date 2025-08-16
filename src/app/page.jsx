
'use client';

import { HeroSection } from '../components/HeroSection.jsx';
import { Button } from '../components/ui/button.jsx';
import { ArrowRight, FileQuestion, UploadCloud, Star } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.jsx';
import { CategoryCard } from '../components/CategoryCard.jsx';
import { FaqSection } from '../components/FaqSection.jsx';
import { useEffect, useState } from 'react';
import { getPdfs } from '../services/firestore.js';
import { PdfList } from '../components/PdfList.jsx';


const categories = [
  { name: 'Mathematics', imageUrl: '/category-card/math.jpg', hint: 'mathematics equation' },
  { name: 'Physics', imageUrl: '/category-card/physics.jpg', hint: 'physics atoms' },
  { name: 'Chemistry', imageUrl: '/category-card/chemistry.jpg', hint: 'chemistry beakers' },
  { name: 'Biology', imageUrl: '/category-card/biology.jpg', hint: 'biology dna' },
  { name: 'Computer science', imageUrl: '/category-card/computer-science.jpg', hint: 'computer code' },
  { name: 'English', imageUrl: '/category-card/english.jpg', hint: 'english books' },
];

function FeaturedDocuments() {
  const [featuredPdfs, setFeaturedPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPdfs = async () => {
      setLoading(true);
      try {
        const allPdfs = await getPdfs();
        // Get the 4 most recent documents
        setFeaturedPdfs(allPdfs.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured PDFs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedPdfs();
  }, []);

  if (loading) {
    return null; // Or a loading skeleton
  }
  
  if (featuredPdfs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Featured Documents
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Check out the latest additions to our library.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
           <PdfList pdfs={featuredPdfs} />
        </div>
      </div>
    </section>
  );
}


export default function Home() {

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedDocuments />
       <section className="py-16 sm:py-20 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Browse by Category
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our documents organized by subject.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {categories.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
          </div>

          <div className="mt-12 text-center md:mt-16">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/pdfs">
                  View All Documents <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Contribute to Our Library
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Help our community grow by requesting or uploading new educational materials.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
        </div>
      </section>
      <FaqSection />
    </div>
  );
}
