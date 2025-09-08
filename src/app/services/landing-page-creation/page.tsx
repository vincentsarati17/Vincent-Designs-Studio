
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Section } from '@/components/Section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Landing Page Creation",
    description: "Turn visitors into customers with high-converting landing pages. We design focused, strategic pages for campaigns, products, and events.",
};

const offerings = [
  "Strategic Copywriting",
  "Compelling Visuals",
  "Clear Call-to-Action",
  "Responsive Design",
  "A/B Testing Readiness",
  "Lead Capture Forms"
];

export default function LandingPageCreationPage() {
  return (
    <Section className="!py-16 md:!py-24">
      <div className="max-w-3xl mx-auto">
          <p className="font-headline text-primary font-semibold">Our Service</p>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">Landing Page Creation</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We create focused, high-converting landing pages designed for one purpose: to turn visitors into customers. Whether for a campaign, product, or event, our landing pages make an impact.
          </p>
          <div className="mt-8">
            <h3 className="font-headline text-xl font-semibold">What's Included:</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-muted-foreground">
              {offerings.map(item => <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                {item}
              </li>)}
            </ul>
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Start Your Landing Page</Link>
          </Button>
      </div>
    </Section>
  );
}
