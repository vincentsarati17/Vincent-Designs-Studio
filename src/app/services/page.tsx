import { Section, SectionHeader } from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';

export default function ServicesPage() {
  return (
    <Section>
      <SectionHeader 
        title="Our Services"
        description="From a single logo to a comprehensive brand system, from a simple landing page to a complex e-commerce platform, we craft solutions that are as beautiful as they are effective."
      />
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
    </Section>
  );
}
