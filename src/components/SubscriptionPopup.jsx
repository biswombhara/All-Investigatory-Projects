
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Youtube, ExternalLink } from 'lucide-react';

export function SubscriptionPopup({ redirectUrl, onClose }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      window.open(redirectUrl, '_blank');
      onClose();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, redirectUrl, onClose]);

  const handleSubscribeClick = () => {
    window.open('https://www.youtube.com/@Allinvestigatoryprojects?sub_confirmation=1', '_blank');
    window.open(redirectUrl, '_blank');
    onClose();
  };
  
  const handleSkip = () => {
     window.open(redirectUrl, '_blank');
     onClose();
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Support Our Work</DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Subscribe to our YouTube channel to get the latest project updates and tutorials.
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 flex flex-col items-center justify-center gap-4">
            <Button
                onClick={handleSubscribeClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12"
            >
                <Youtube className="mr-2 h-6 w-6" />
                Subscribe & Download
            </Button>
            
            <p className="text-sm text-muted-foreground animate-pulse">
                Auto-redirecting in {countdown}s...
            </p>

            <div className="w-full flex items-center justify-center gap-2 mt-2">
                <Button variant="outline" onClick={handleSkip} className="w-full">
                    Skip and View PDF
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
