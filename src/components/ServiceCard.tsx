import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function ServiceCard({ title, description, href }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <h2 className="font-headline text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
        <Button asChild variant="link" className="p-0 mt-4 text-primary">
          <Link href={href}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
