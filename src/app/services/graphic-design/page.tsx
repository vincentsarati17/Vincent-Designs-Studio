import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

const offerings = [
  "Branding & Identity",
  "Logo Design",
  "Print & Editorial Design",
  "Packaging Design",
  "Digital Graphics",
  "Brand Style Guides"
];

export default function GraphicDesignPage() {
  return (
    <div className="">
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <p className="font-headline text-primary font-semibold">Our Service</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">Graphic Design</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We translate your brand's essence into compelling visuals. Our design philosophy combines modern aesthetics with strategic thinking to create identities that are not only beautiful but also meaningful and memorable.
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
              <Link href="/contact">Request a Quote</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
