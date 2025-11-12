
'use client';

import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
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
  return (
    <Card className="overflow-hidden group transition-all duration-300 block rounded-lg bg-card/50 backdrop-blur-sm border border-white/10 w-full relative h-96">
      {project.imageUrl && (
          <div className="relative w-full h-full bg-muted/50">
              <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-contain transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
              />
          </div>
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Badge variant="secondary">{project.category}</Badge>
            <h3 className="font-headline text-xl font-bold mt-2 text-white">{project.title}</h3>
            <p className="text-sm text-white/80 mt-1">{project.description}</p>
          </div>
      </div>
    </Card>
  );
};
