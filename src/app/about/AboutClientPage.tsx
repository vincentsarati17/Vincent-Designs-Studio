
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PenTool } from 'lucide-react';
import { motion } from "framer-motion";

const tools = [
    { name: 'figma', src: "/image/figma-logo.png" },
    { name: 'framer', src: "/image/framer-logo.png" },
    { name: 'react', src: "/image/react-logo.png" },
    { name: 'next.js', src: "/image/next.js-logo.png" },
    { name: 'affinity', src: "/image/affinity-logo.png" },
];

export default function AboutClientPage() {
  return (
    <div>
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-balance">
              Meet Vincent, the heart of the studio.
            </h1>
            <div className="mt-6 space-y-4 text-lg text-muted-foreground">
              <p>
                Vincent Designs Studio was born from a simple idea: that world-class design should feel both globally resonant and locally inspired. Founded by Vincent, a designer with a deep passion for digital art, our studio is more than just a business—it's a celebration of creative expression.
              </p>
              <p>
                Vincent believes that great design is about clarity, purpose, and making a bold statement with elegance and subtlety. Every project is an opportunity to forge a connection and tell a unique story.
              </p>
            </div>
          </div>
          <motion.div 
            className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src="/image/creative studio.jpg"
              alt="Creative studio environment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>

      <div className="bg-card">
        <div className="container py-16 md:py-24 text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-balance">Our Mission & Vision</h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Our mission is to empower businesses with design that not only competes globally but also speaks authentically to their audience. We envision a world where every brand, no matter its size, has access to design that is both beautiful and effective. We're here to help build brands that last.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Work With Us</Link>
          </Button>
        </div>
      </div>

      <div className="py-16 md:py-24">
        <div className="container text-center max-w-6xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-balance">Our Toolkit</h2>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
                We use industry-leading tools and technologies to bring your vision to life, ensuring a modern, efficient, and high-quality result.
            </p>
            <div className="mt-12 relative w-full overflow-hidden">
                <div className="flex w-max animate-scroll">
                    {[...tools, ...tools].map((tool, index) => (
                        <div key={`${tool.name}-${index}`} className="flex flex-col items-center gap-2 mx-6 flex-shrink-0">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted text-primary">
                                <div className="relative w-10 h-10">
                                    <Image src={tool.src} alt={`${tool.name} Logo`} fill className="object-contain" />
                                </div>
                            </div>
                            <span className="font-semibold">{tool.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
