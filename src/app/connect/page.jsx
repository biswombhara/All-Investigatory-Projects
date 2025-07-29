'use client';

import { Button } from '../../components/ui/button.jsx';
import { FileQuestion, UploadCloud, Mail, Send, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';

export default function ConnectPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Connect With Us
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
          We'd love to hear from you! Whether you have a question, a suggestion, or just want to say hello, here are the best ways to reach out and get involved.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
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

      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="font-headline text-3xl font-bold text-center">Follow & Contact Us</h2>
        <div className="mt-8 p-8 border rounded-lg bg-secondary/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-headline text-xl font-semibold text-foreground">Social Media</h3>
              <p className="mt-2 text-muted-foreground">Follow us on our social channels to stay updated with the latest content and announcements.</p>
              <div className="mt-4 flex justify-center md:justify-start items-center gap-5">
                <a href="https://www.youtube.com/@Allinvestigatoryprojects" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-6 w-6" />
                  <span>YouTube</span>
                </a>
                <a href="https://t.me/allinvestigatoryprojects" aria-label="Telegram" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Send className="h-6 w-6" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
             <div>
              <h3 className="font-headline text-xl font-semibold text-foreground">Direct Contact</h3>
              <p className="mt-2 text-muted-foreground">For direct inquiries, feel free to send us an email. We'll get back to you as soon as possible.</p>
               <div className="mt-4 flex justify-center md:justify-start">
                  <a href="mailto:allinvestigatoryprojects@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-6 w-6" />
                    <span>allinvestigatoryprojects@gmail.com</span>
                  </a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
