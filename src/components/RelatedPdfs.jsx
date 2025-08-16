
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function RelatedPdfs({ pdfs }) {
  if (!pdfs || pdfs.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">You might also like</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pdfs.map((pdf) => (
          <Link key={pdf.id} href={`/pdfs/${pdf.id}`} className="block group">
            <div className="flex items-start gap-4 p-2 rounded-lg group-hover:bg-accent/50 transition-colors">
              <div className="relative h-16 w-12 flex-shrink-0">
                 <Image
                    src={`https://drive.google.com/thumbnail?id=${pdf.publicId}`}
                    alt={pdf.title}
                    fill
                    sizes="50vw"
                    className="rounded-md object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {pdf.title}
                </h3>
                <p className="text-xs text-muted-foreground">{pdf.subject}</p>
                 {pdf.class && <p className="text-xs text-muted-foreground">{pdf.class}</p>}
              </div>
            </div>
          </Link>
        ))}
        <Button asChild variant="outline" className="w-full mt-4">
          <Link href="/pdfs">
            View All Documents <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
