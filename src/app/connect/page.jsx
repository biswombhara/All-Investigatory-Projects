
'use client';

import { Button } from '../../components/ui/button.jsx';
import { FileQuestion, UploadCloud } from 'lucide-react';
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
          Help our community grow by requesting or uploading new educational materials.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
  );
}
