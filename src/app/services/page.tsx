import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-balance">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          From a single logo to a comprehensive brand system, from a simple landing page to a complex e-commerce platform, we craft solutions that are as beautiful as they are effective.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <ServiceCard
          title="Web Design"
          description="Building beautiful, high-performance websites. We focus on intuitive user experiences, responsive design, and robust development to help you grow online."
          href="/services/web-design"
        />
        <ServiceCard
          title="Logo Design"
          description="Crafting unique logos that are the cornerstone of your brand identity, ensuring they are memorable and impactful."
          href="/services/logo-design"
        />
        <ServiceCard
          title="Landing Page Creation"
          description="Designing high-converting landing pages that capture your audience's attention and drive them to action."
          href="/services/landing-page-creation"
        />
        <ServiceCard
          title="Banner/Graphics Design"
          description="Creating stunning banners and graphics for your digital campaigns that grab attention and communicate your message effectively."
          href="/services/banner-graphics-design"
        />
        <ServiceCard
          title="UI/UX Design"
          description="Designing intuitive and engaging user interfaces that provide meaningful user experiences."
          href="/services/ui-ux-design"
        />
        <ServiceCard
          title="Mobile App Design"
          description="Creating beautiful and functional mobile app designs for iOS and Android that your users will love."
          href="/services/mobile-app-design"
        />
      </div>
    </div>
  );
}

function ServiceCard({ title, description, href }: { title: string; description: string; href: string; }) {
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
  )
}
