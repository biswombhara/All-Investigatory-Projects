
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Youtube } from 'lucide-react';

export function SubscriptionPopup({ redirectUrl, onClose }) {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (countdown <= 0) {
      window.open(redirectUrl, '_blank');
      onClose();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    // Cleanup function to redirect if the component is unmounted (dialog is closed)
    return () => {
      clearTimeout(timer);
      if (countdown > 0) { // Only redirect if countdown wasn't finished
        // This part has a side-effect on unmount. A better pattern might be needed if it causes issues,
        // but for this use case, it ensures redirection.
        // window.open(redirectUrl, '_blank');
      }
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
          <DialogTitle className="font-headline text-2xl text-center">Please Support Us!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Like our content? Please subscribe to our YouTube channel to help us grow.
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 flex flex-col items-center justify-center gap-4">
            <Button
                onClick={handleSubscribeClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
            >
                <Youtube className="mr-2 h-6 w-6" />
                Subscribe to YouTube
            </Button>
            <p className="text-sm text-muted-foreground">
                You will be redirected in {countdown} seconds...
            </p>
        </div>
         <Button variant="link" onClick={handleSkip} className="mx-auto">
            Skip and Go to PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
}
