import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Section } from '@/components/Section';

const offerings = [
  "iOS App Design",
  "Android App Design",
  "Interactive Prototypes",
  "User Flow Mapping",
  "App Icon & Splash Screen",
  "Full Asset Delivery"
];

export default function MobileAppDesignPage() {
  return (
    <Section className="!py-16 md:!py-24">
      <div className="max-w-3xl mx-auto">
          <p className="font-headline text-primary font-semibold">Our Service</p>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">Mobile App Design</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We design beautiful and functional mobile apps for iOS and Android that offer a seamless user experience. From initial concept to final polish, we ensure your app not only looks great but is also a joy to use.
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
            <Link href="/contact">Design Your App</Link>
          </Button>
      </div>
    </Section>
  );
}
