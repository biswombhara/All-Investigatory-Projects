import { HeroSection } from '../components/HeroSection.jsx';
import { PdfList } from '../components/PdfList.jsx';
import { Button } from '../components/ui/button.jsx';
import { getPdfs } from '../services/firestore.js';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'All Investigatory Projects - Home',
  description: 'Welcome to All Investigatory Projects. Your ultimate resource for educational materials. Access and download PDFs on various subjects with ease, all curated from our YouTube channel.',
};

export default async function Home() {
  const allPdfs = await getPdfs();
  const featuredPdfs = allPdfs.slice(0, 3);

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
          <PdfList pdfs={featuredPdfs} />
          {allPdfs.length > 3 && (
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
