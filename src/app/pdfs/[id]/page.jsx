
'use client';

import { useEffect, useState, useContext } from 'react';
import { getPdfById, getPdfs } from '../../../services/firestore.js';
import { Loader } from '../../../components/Loader.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx';
import { Badge } from '../../../components/ui/badge.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Download, AlertCircle, Book, Tag, User } from 'lucide-react';
import { RelatedPdfs } from '../../../components/RelatedPdfs.jsx';
import { LoadingContext } from '../../../context/LoadingContext.jsx';
import { useParams } from 'next/navigation.js';


export default function PdfViewerPage() {
  const [pdf, setPdf] = useState(null);
  const [relatedPdfs, setRelatedPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hideLoader } = useContext(LoadingContext);
  const params = useParams();


  useEffect(() => {
    const fetchPdf = async () => {
      const { id } = params;
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const fetchedPdf = await getPdfById(id);
        if (fetchedPdf) {
          setPdf(fetchedPdf);
          // Fetch related PDFs
          const allPdfs = await getPdfs();
          const related = allPdfs.filter(p => p.subject === fetchedPdf.subject && p.id !== id).slice(0, 5);
          setRelatedPdfs(related);
        } else {
          setError('Document not found.');
        }
      } catch (err) {
        setError('Failed to load the document.');
        console.error(err);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchPdf();
  }, [params, hideLoader]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <AlertCircle className="mx-auto h-6 w-6" />
          <AlertTitle className="mt-2 text-xl font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Modify the URL for embedding and removing the pop-out button
  const embedUrl = pdf.url.replace('/view?usp=sharing', '/preview?embedded=true').replace('/view', '/preview?embedded=true');


  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <div className="mb-6 rounded-lg bg-background p-6 shadow-md">
                <h1 className="font-headline text-3xl font-bold">{pdf.title}</h1>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{pdf.authorName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                    <Book className="h-4 w-4" />
                    <Badge variant="secondary">{pdf.subject}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <Badge variant="outline">{pdf.class}</Badge>
                    </div>
                </div>
                <Button asChild>
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                    </a>
                </Button>
                </div>

                <div className="relative aspect-[8.5/11] w-full rounded-lg bg-background shadow-lg overflow-hidden">
                    <iframe
                        src={embedUrl}
                        className="h-full w-full border-0"
                        allow="fullscreen"
                        title={pdf.title}
                    ></iframe>
                    {/* This div is the overlay to hide the pop-out button */}
                    <div className="absolute top-0 right-0 h-14 w-14 bg-transparent"></div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <RelatedPdfs pdfs={relatedPdfs} />
            </div>
            </div>
        </div>
    </div>
  );
}
