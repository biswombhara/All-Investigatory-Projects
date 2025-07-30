
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion.jsx';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How can I find a specific document?',
    answer:
      'You can use the search bar on the PDFs page to search by title. You can also filter documents by subject and class to narrow down your results.',
  },
  {
    question: 'Can I upload my own investigatory projects?',
    answer:
      'Yes! We encourage users to contribute. Just go to the "Upload a PDF" page, fill in the details, and select your file. Your document will be reviewed by our team before it is published.',
  },
  {
    question: "What should I do if I can't find a document I'm looking for?",
    answer:
      'If you can\'t find a specific document, you can use the "Request a PDF" page to suggest new content. We will do our best to create and upload the requested material.',
  },
   {
    question: 'How do I report a copyright issue?',
    answer:
      'If you believe any content on our site infringes on your copyright, please visit the "Copyright Removal" page from the footer and fill out the form. We take these requests very seriously.',
  },
  {
    question: 'Is there a cost to use this website?',
    answer:
      'No, our website is completely free to use. All documents are available for viewing and downloading at no charge. The platform is supported by ads.',
  },
];

export function FaqSection() {
  return (
    <section className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:mb-16">
           <HelpCircle className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Have questions? We have answers.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
