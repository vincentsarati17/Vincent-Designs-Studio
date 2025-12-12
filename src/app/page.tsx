
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/Section";
import TypingEffect from "@/components/TypingEffect";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <WhatWeDoSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const heroDescription = "Specializing in bespoke graphic and web design. We build exceptional brands and websites for businesses ready to make their mark.";
  return (
    <Section className="!pt-16 md:!pt-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
            Web &amp; Graphic Design Agency
          </h1>
          <div className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-balance min-h-[112px] md:min-h-[96px]">
            {isClient ? (
              <TypingEffect text={heroDescription} />
            ) : (
              <p>{heroDescription}</p>
            )}
          </div>
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
              alt="Creative agency workspace with laptop showing website mockup"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

const HurricaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" {...props}>
        <defs>
            <linearGradient id="SVGGAnF5b5v" x1="175.8" x2="336.2" y1="117" y2="395" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#e6991f" />
                <stop offset=".5" stopColor="#e6991f" />
                <stop offset="1" stopColor="#f79c0d" />
            </linearGradient>
        </defs>
        <path fill="none" stroke="url(#SVGGAnF5b5v)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="24" d="M344 256a88 88 0 1 1-88-88a88 88 0 0 1 88 88ZM200 116.9l-3.8 7.7A269.7 269.7 0 0 0 169 267h0m143.1 128l3.8-7.7A269.7 269.7 0 0 0 343.2 245h0">
            <animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="1440 256 256; 0 256 256" />
        </path>
    </svg>
);


function WhatWeDoSection() {
  return (
    <Section className="bg-card">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-balance">
              Our Web &amp; Graphic Design Services
            </h2>
            <p className="text-muted-foreground text-lg">
              We specialize in creating unique brand identities and
              high-performance websites that capture the essence of your
              business and connect with your audience.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/services/graphic-design">Graphic Design</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services/web-design" className="flex items-center gap-2">
                  Web Design
                  <HurricaneIcon className="w-5 h-5" />
                </Link>
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
                alt="Example of professional graphic design work"
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
                alt="Example of modern web design on a laptop screen"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </div>
    </Section>
  );
}

function CTASection() {
  return (
    <Section className="bg-card">
        <SectionHeader
          title="Ready to grow your business?"
          description="Let's collaborate to create a brand and website that truly represents you. Contact our design studio today."
        />
        <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
        </div>
    </Section>
  );
}
