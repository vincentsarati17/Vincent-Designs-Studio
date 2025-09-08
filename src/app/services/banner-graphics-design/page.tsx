
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Section } from '@/components/Section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Banner & Graphics Design",
    description: "Get eye-catching banners and graphics for your website, social media, and ad campaigns. On-brand, engaging, and optimized for performance.",
};

const offerings = [
  "Social Media Banners",
  "Website Headers",
  "Ad Campaign Graphics",
  "Infographics",
  "Email Marketing Graphics",
  "Multiple Format Delivery"
];

export default function BannerGraphicsDesignPage() {
  return (
    <Section className="!py-16 md:!py-24">
      <div className="max-w-3xl mx-auto">
        <p className="font-headline text-primary font-semibold">Our Service</p>
        <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">Banner & Graphics Design</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Great visuals stop the scroll. We design eye-catching banners and graphics for your website, social media, and advertising campaigns that are on-brand and optimized for engagement.
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
          <Link href="/contact">Request Graphics</Link>
        </Button>
      </div>
    </Section>
  );
}
