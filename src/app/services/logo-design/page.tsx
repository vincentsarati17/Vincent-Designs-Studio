import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

const offerings = [
  "Discovery & Research",
  "Concept Sketching",
  "Vector Design",
  "Color Palette Selection",
  "Typography Pairing",
  "Final Logo Files"
];

export default function LogoDesignPage() {
  return (
    <div className="">
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <p className="font-headline text-primary font-semibold">Our Service</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">Logo Design</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A logo is the face of your brand. We design memorable logos that capture the essence of your business, creating a timeless mark that builds recognition and trust with your audience.
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
              <Link href="/contact">Get a Logo Quote</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
