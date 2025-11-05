import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  className?: string;
};

export default function ServiceCard({ title, description, href, className }: ServiceCardProps) {
  return (
    <Card className={cn("overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col rounded-2xl", className)}>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="font-headline text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-muted-foreground flex-grow">{description}</p>
        <Button asChild variant="link" className="p-0 mt-4 text-primary self-start">
          <Link href={href}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
