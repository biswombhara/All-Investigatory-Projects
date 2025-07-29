'use client';

import { Building, Target, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <Building className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            About All Investigatory Projects
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            We are dedicated to providing high-quality educational resources to students and learners everywhere. Our content is carefully curated and created to help you succeed in your academic journey.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                <span className="font-headline text-2xl">Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our mission is to make learning accessible and engaging. We believe that everyone deserves access to the best educational materials, which is why we offer a wide range of investigatory projects and study notes, primarily through our website and YouTube channel. We aim to simplify complex topics and provide practical knowledge that helps students excel.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Youtube className="h-8 w-8 text-destructive" />
                <span className="font-headline text-2xl">Our YouTube Channel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The heart of our content creation is our YouTube channel. We create detailed video explanations, tutorials, and project guides that complement the documents you find here. If you haven't already, we highly recommend you visit our channel and subscribe for the latest updates and in-depth content.
              </p>
              <Button asChild className="mt-4">
                <a href="https://www.youtube.com/@Allinvestigatoryprojects" target="_blank" rel="noopener noreferrer">
                  Visit YouTube Channel
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <h2 className="font-headline text-3xl font-bold">Start Exploring</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Ready to dive in? Browse our collection of PDFs or request a new one if you can't find what you're looking for.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/pdfs">Browse PDFs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/request-pdf">Request a PDF</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
