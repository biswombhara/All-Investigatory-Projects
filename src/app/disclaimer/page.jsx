'use client';

import { AlertTriangle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DisclaimerPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Disclaimer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="mt-12 space-y-8 text-muted-foreground">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2"><FileText /> General Information</h2>
              <p>
                The information provided by All Investigatory Projects ("we," "us," or "our") on this website is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> Educational Disclaimer</h2>
              <p>
                The Site provides information for educational purposes only. The documents and materials found on this website are intended to be used as a resource for students and educators. They are not intended to be a substitute for professional academic advice or instruction. You should not act or refrain from acting on the basis of any content included in this site without seeking the appropriate educational or other professional advice.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> Errors and Omissions</h2>
              <p>
                While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, All Investigatory Projects is not responsible for any errors or omissions or for the results obtained from the use of this information. All information in this site is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> External Links Disclaimer</h2>
               <p>
                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
