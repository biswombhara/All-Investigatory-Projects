import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Eye, User } from 'lucide-react';

export function PdfCard({ pdf }) {

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-xl">
        <CardHeader className="p-3">
          <CardTitle className="font-headline text-base font-semibold leading-tight line-clamp-2">
            {pdf.title}
          </CardTitle>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <User className="mr-1.5 h-3 w-3" />
            <span>{pdf.authorName || 'Anonymous'}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-3 pt-0">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">{pdf.subject}</Badge>
            {pdf.class && <Badge variant="outline" className="text-xs">{pdf.class}</Badge>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-secondary/50 p-2">
          <Button asChild size="sm" className="rounded-full h-8 px-3 text-xs">
            <Link href={`/pdfs/${pdf.id}`}>
                <Eye className="mr-1.5 h-3 w-3" />
                View
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
