
'use client';

import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/projects";
import type { Metadata } from 'next';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import placeholderImages from '@/app/lib/placeholder-images.json';
import type { Project } from "@/lib/types";
import { motion } from 'framer-motion';
import React from "react";
import { Button } from "@/components/ui/button";

export default function PortfolioPage() {
  const [projects, setProjects] = React.useState<Project[] | null>(null);

  React.useEffect(() => {
    async function loadProjects() {
      const fetchedProjects = await getProjects();
      if (fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      } else {
        // If no projects from DB, use placeholders
        setProjects(placeholderProjects);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-balance">Our Work</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          We take pride in our work. Here's a selection of projects that showcase our dedication to quality, creativity, and impact.
        </p>
      </div>
      
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects ? (
            projects.map((project) => (
              project.slug === '#' 
                ? <PlaceholderProjectCard key={project.id} project={project} />
                : <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            // Skeleton loaders
            Array.from({ length: 1 }).map((_, i) => (
              <div key={i} className="bg-card/50 rounded-lg p-6 space-y-4">
                <div className="h-40 bg-muted/50 rounded-md animate-pulse"></div>
                <div className="h-4 w-1/4 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
              </div>
            ))
          )}
        </div>
      
    </div>
  );
}


const placeholderProjects: Project[] = [
  {
    id: "placeholder-1",
    title: "Professional Flyer Design",
    description: "We designed a professional flyer for Dyax's Electrical Company.",
    category: "Graphic Design",
    imageUrl: "/image/Dyax-electrical-cc.jpg",
    isFeatured: true,
    slug: "#",
    details: [],
  },
];


const PlaceholderProjectCard = ({ project }: { project: Project }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const cardVariants = {
    unflipped: { rotateY: 0 },
    flipped: { rotateY: 180 },
  };

  return (
    <div 
      className="relative w-full h-[250px] [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d' }}
        variants={cardVariants}
        animate={isFlipped ? 'flipped' : 'unflipped'}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          <Card className="overflow-hidden group transition-all duration-300 block rounded-lg bg-card/50 backdrop-blur-sm border border-white/10 w-full h-full">
            {project.imageUrl && (
                <div className="relative aspect-video w-full bg-muted/50">
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-contain transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            )}
            <div className="p-6">
                <Badge variant="secondary">{project.category}</Badge>
                <h3 className="font-headline text-xl font-bold mt-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            </div>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
           <Card className="overflow-hidden group transition-all duration-300 block rounded-lg bg-card/50 backdrop-blur-sm border border-white/10 w-full h-full flex flex-col items-center justify-center p-6">
              <h3 className="font-headline text-xl font-bold text-center">Vincent Designs Studio</h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">High-quality design services.</p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/contact">
                  Get a quote
                </Link>
              </Button>
            </Card>
        </div>
      </motion.div>
    </div>
  );
};
