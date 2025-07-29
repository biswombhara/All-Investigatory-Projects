'use client';

import { ShieldCheck, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);
  
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-16 w-16 text-primary" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="mt-12 space-y-8 text-muted-foreground">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2"><FileText /> Introduction</h2>
              <p>
                Welcome to All Investigatory Projects. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as requesting or uploading a document.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                </li>
              </ul>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Create and manage your account.</li>
                <li>Fulfill and manage requests, and other transactions related to the Site.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                <li>Notify you of updates to the Site.</li>
              </ul>
              
              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>

              <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center gap-2 mt-8"><FileText /> Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at: [Your Contact Email Address]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
