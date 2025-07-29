import { Youtube, Mail, Send } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">All Investigatory Projects</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your ultimate resource for educational materials, curated from our YouTube channel.
            </p>
             <p className="mt-2 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/copyright-removal" className="text-muted-foreground hover:text-primary transition-colors">Copyright Removal Request</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-headline text-lg font-semibold text-foreground">Follow Us</h3>
            <div className="mt-2 flex justify-center md:justify-start items-center gap-5">
                <a href="https://www.youtube.com/@Allinvestigatoryprojects" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                </a>
                <a href="https://t.me/allinvestigatoryprojects" aria-label="Telegram">
                  <Send className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                </a>
              </div>
               <p className="mt-4 text-sm text-muted-foreground">
                Proudly created with Biswombhara Patra
              </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
