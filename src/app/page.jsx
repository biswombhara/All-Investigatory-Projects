'use client';

import { HeroSection } from '../components/HeroSection.jsx';
import { PdfList } from '../components/PdfList.jsx';
import { Button } from '../components/ui/button.jsx';
import { getPdfs } from '../services/firestore.js';
import { ArrowRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '../hooks/use-toast.js';
import { Skeleton } from '../components/ui/skeleton.jsx';

export default function Home() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      const fetchedPdfs = await getPdfs();
      setPdfs(fetchedPdfs);
      setLoading(false);
    };

    fetchPdfs();
  }, []);

  useEffect(() => {
    if (searchParams.get('upload_success') === 'true') {
      toast({
        title: 'Upload Successful!',
        description: 'Your document has been added to the library.',
        variant: 'success',
      });
    }
  }, [searchParams, toast]);

  const featuredPdfs = pdfs.slice(0, 3);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <section className="py-16 sm:py-20 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Featured Documents
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore some of the most popular documents uploaded by our community.
            </p>
          </div>
          {loading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ) : (
            <PdfList pdfs={featuredPdfs} />
          )}
          {pdfs.length > 3 && (
            <div className="mt-12 text-center md:mt-16">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/pdfs">
                  View All Documents <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}