
'use client';

import { Section, SectionHeader } from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Metadata } from 'next';
import React from 'react';
import Autoplay from "embla-carousel-autoplay";

// Disabling metadata generation for client component
// export const metadata: Metadata = {
//     title: "Our Services",
//     description: "Discover the range of services offered by Vincent Designs Studio, including Web Design, Logo Design, UI/UX, and more. Let's build something amazing together.",
// };

const services = [
  {
    title: "Web Design",
    description: "Building beautiful, high-performance websites. We focus on intuitive user experiences, responsive design, and robust development to help you grow online.",
    href: "/services/web-design"
  },
  {
    title: "Logo Design",
    description: "Crafting unique logos that are the cornerstone of your brand identity, ensuring they are memorable and impactful.",
    href: "/services/logo-design"
  },
  {
    title: "Landing Page Creation",
    description: "Designing high-converting landing pages that capture your audience's attention and drive them to action.",
    href: "/services/landing-page-creation"
  },
  {
    title: "Banner/Graphics Design",
    description: "Creating stunning banners and graphics for your digital campaigns that grab attention and communicate your message effectively.",
    href: "/services/banner-graphics-design"
  },
  {
    title: "UI/UX Design",
    description: "Designing intuitive and engaging user interfaces that provide meaningful user experiences.",
    href: "/services/ui-ux-design"
  },
  {
    title: "Mobile App Design",
    description: "Creating beautiful and functional mobile app designs for iOS and Android that your users will love.",
    href: "/services/mobile-app-design"
  }
];

export default function ServicesPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <Section>
      <SectionHeader 
        title="Our Services"
        description="From a single logo to a comprehensive brand system, from a simple landing page to a complex e-commerce platform, we craft solutions that are as beautiful as they are effective."
      />
      <div className="mt-16 flex justify-center">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-sm md:max-w-xl lg:max-w-4xl"
        >
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    href={service.href}
                    className="h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </Section>
  );
}
