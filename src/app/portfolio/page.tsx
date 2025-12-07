
'use client';

import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/projects";
import type { Project } from "@/lib/types";
import React from "react";

export default function PortfolioPage() {
  const [projects, setProjects] = React.useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects || []);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      }
      setIsLoading(false);
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
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card/50 rounded-lg p-6 space-y-4">
                <div className="aspect-[3/2] bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
              </div>
            ))
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
             <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                <h3 className="font-headline text-2xl font-bold">Our Portfolio is Growing</h3>
                <p className="text-muted-foreground mt-2">New and exciting projects are coming soon. Please check back later!</p>
             </div>
          )}
        </div>
      
    </div>
  );
}
