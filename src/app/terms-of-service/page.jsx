'use client';

import { FileText, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="mt-12 space-y-8 text-muted-foreground">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2"><FileText /> 1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> 2. User Content</h2>
              <p>
                You are responsible for any content you upload, post, or otherwise make available on the Site ("User Content"). You retain all rights in, and are solely responsible for, the User Content you post. You grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, store, display, reproduce, modify, and distribute your User Content on the Site for the purposes of operating, developing, and providing the Site.
              </p>
              
              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> 3. Prohibited Conduct</h2>
              <p>
                You agree not to use the Site to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Post or transmit any material that is defamatory, obscene, fraudulent, or that infringes on any intellectual property rights of any person.</li>
                <li>Engage in any activity that would constitute a criminal offense or give rise to a civil liability.</li>
                <li>Interfere with or disrupt the Site or servers or networks connected to the Site.</li>
              </ul>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> 4. Disclaimer of Warranties</h2>
              <p>
                The site is provided on an "as is" and "as available" basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> 5. Limitation of Liability</h2>
               <p>
                In no event shall All Investigatory Projects be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the site or for the cost of procurement of substitute goods and services or resulting from any goods or services purchased or obtained or messages received or transactions entered into through the site.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> 6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
