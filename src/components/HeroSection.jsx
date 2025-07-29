'use client';

import Link from 'next/link';
import { Button } from './ui/button.jsx';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 py-24 md:grid-cols-2 md:py-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="z-10 text-center md:text-left"
          >
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
              Welcome to All Investigatory Projects
            </h1>
            <p className="mt-6 text-lg text-foreground/80 md:text-xl max-w-xl mx-auto md:mx-0">
              Your ultimate resource for educational materials. Access and download PDFs on various subjects with ease, all curated from our YouTube channel.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/pdfs">Browse PDFs</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/request-pdf">Request a PDF</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/ZrVT_8B6oGA"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
