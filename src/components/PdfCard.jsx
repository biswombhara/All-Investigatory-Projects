import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Eye, User, BrainCircuit, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog.jsx';
import { Alert, AlertTitle, AlertDescription } from './ui/alert.jsx';


function SummaryDialog({ pdf, isOpen, onOpenChange }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isOpen && !summary) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: pdf.title, subject: pdf.subject }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch summary.');
          }

          const data = await response.json();
          setSummary(data.summary);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSummary();
    }
  }, [isOpen, pdf, summary]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            AI Summary
          </DialogTitle>
          <DialogDescription>
            A quick overview of "{pdf.title}". This summary is AI-generated and may not be perfect.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating summary...</span>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary && <p className="text-sm text-foreground">{summary}</p>}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function PdfCard({ pdf }) {
  const [isSummaryOpen, setSummaryOpen] = useState(false);

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
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 px-3 text-xs"
            onClick={() => setSummaryOpen(true)}
          >
            <BrainCircuit className="mr-1.5 h-3 w-3" />
            Summarize
          </Button>
          <Button asChild size="sm" className="rounded-full h-8 px-3 text-xs">
            <a href={pdf.url} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-1.5 h-3 w-3" />
              View
            </a>
          </Button>
        </CardFooter>
      </Card>
      <SummaryDialog pdf={pdf} isOpen={isSummaryOpen} onOpenChange={setSummaryOpen} />
    </>
  );
}
