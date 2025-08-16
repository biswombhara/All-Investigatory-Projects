
import { Youtube, Mail, Send } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/connect', label: 'Connect' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/copyright-removal', label: 'Copyright Removal' },
  ];

  return (
    <footer className="mt-auto border-t bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-headline text-lg font-semibold text-foreground">All Investigatory Projects</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your ultimate resource for educational materials, curated from our YouTube channel.
            </p>
             <p className="mt-4 text-sm text-muted-foreground">
                Proudly created with Biswombhara Patra
              </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Follow Us</h3>
            <div className="mt-2 flex flex-col items-center gap-2 md:items-start">
               <a href="https://www.youtube.com/@Allinvestigatoryprojects" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                  <span className="text-sm">YouTube</span>
                </a>
                <a href="https://t.me/allinvestigatoryprojects" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Send className="h-5 w-5" />
                  <span className="text-sm">Telegram</span>
                </a>
                 <a href="mailto:allinvestigatoryprojects@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">Email</span>
                  </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center">
            <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {quickLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                    </Link>
                ))}
            </div>
             <div className="my-6 border-t border-border"></div>
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} All Investigatory Projects. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
