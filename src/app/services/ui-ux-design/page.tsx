import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

const offerings = [
  "User Research & Analysis",
  "Wireframing & Prototyping",
  "Information Architecture",
  "Interaction Design",
  "Usability Testing",
  "Visual UI Design"
];

export default function UiUxDesignPage() {
  return (
    <div className="">
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
            <p className="font-headline text-primary font-semibold">Our Service</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">UI/UX Design</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We focus on creating intuitive, efficient, and enjoyable user experiences. Our UI/UX design process is centered around understanding user needs to build products that are not only visually stunning but also easy to use.
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
              <Link href="/contact">Discuss Your Project</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
