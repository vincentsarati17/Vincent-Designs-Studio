
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ServicesSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
            We are a creative agency.
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-balance">
            Specializing in bespoke graphic and web design, we build exceptional brands and websites for businesses ready to make their mark.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button asChild size="lg">
                <Link href="/services">
                  View Services
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  Book Now
                </Link>
              </Button>
          </div>
        </div>
        <motion.div
          className="relative w-full max-w-lg mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="relative aspect-square">
            <Image
              src="/image/mockup.png"
              alt="Creative agency workspace"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-ai-hint="creative workspace"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-balance">
              What We Do
            </h2>
            <p className="text-muted-foreground text-lg">
              We specialize in creating unique brand identities and
              high-performance websites that capture the essence of your
              business.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/services/graphic-design">Graphic Design</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services/web-design">Web Design</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="relative aspect-square"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <Image
                src="/image/Graphic Design.jpg"
                alt="Graphic Design Example"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div 
              className="relative aspect-square mt-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            >
              <Image
                src="/image/Web Design.jpg"
                alt="Web Design Example"
                data-ai-hint="website mockup"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-balance">
          Ready to tell your story?
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Let's collaborate to create a brand and website that truly represents
          you.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </section>
  );
}
