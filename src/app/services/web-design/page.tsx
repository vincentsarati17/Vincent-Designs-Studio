
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Section } from '@/components/Section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Web Design & Development in Namibia",
    description: "Professional web design and development in Namibia. We build fast, responsive, and user-friendly websites that serve as powerful marketing tools and convert visitors into customers.",
};

const processSteps = [
  { name: "Discover", description: "Understanding your goals and audience." },
  { name: "Design", description: "Crafting wireframes and visual designs." },
  { name: "Develop", description: "Bringing designs to life with clean code." },
  { name: "Deploy", description: "Launching your site for the world to see." }
];

export default function WebDesignPage() {
  return (
    <Section className="!py-16 md:!py-24">
      <div className="max-w-3xl mx-auto">
        <p className="font-headline text-primary font-semibold">Web Design Services in Namibia</p>
        <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">Web Design & Development</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          As a leading web design business in Namibia, we build fast, responsive, and user-friendly websites that serve as powerful marketing tools. Our focus is on creating a seamless digital experience that converts visitors into loyal customers for your Namibian business.
        </p>
        <div className="mt-8">
          <h3 className="font-headline text-xl font-semibold">Our Four-Step Process:</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {processSteps.map((step, i) => (
              <div key={step.name}>
                <p className="font-headline font-semibold"><span className="text-primary">0{i+1}.</span> {step.name}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        <Button asChild size="lg" className="mt-8">
          <Link href="/contact">Start Your Project</Link>
        </Button>
      </div>
    </Section>
  );
}
