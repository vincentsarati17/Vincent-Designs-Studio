'use client';

import { getProjectBySlug, getProjects } from "@/services/projects";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

type PortfolioDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const fetchedProject = await getProjectBySlug(params.slug);
        if (!fetchedProject) {
          notFound();
        } else {
          setProject(fetchedProject);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        // Handle error state appropriately
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [params.slug]);


  if (isLoading) {
    return (
        <div className="container py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse mb-4"></div>
                <div className="h-12 w-3/4 bg-muted rounded-md animate-pulse mb-4"></div>
                <div className="h-8 w-full bg-muted rounded-md animate-pulse mb-12"></div>
                <div className="aspect-video w-full rounded-lg bg-muted animate-pulse mb-12"></div>
            </div>
        </div>
    );
  }

  if (!project) {
    // This will be caught by notFound() earlier, but as a fallback
    return null;
  }

  return (
    <div className="container py-16 md:py-24">
      <motion.div layoutId={`card-${project.id}`} className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Badge>{project.category}</Badge>
          <motion.h1 layoutId={`title-${project.id}`} className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">{project.title}</motion.h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
        </div>
        
        <motion.div layoutId={`image-${project.id}`} className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-12">
            <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
            />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-4">
                <h2 className="font-headline text-2xl font-bold">Project Details</h2>
                <div className="prose prose-lg text-muted-foreground max-w-none">
                  {project.details.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
            </div>
            <div>
                <h3 className="font-headline text-xl font-semibold">Services Provided</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Web Design</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Branding</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Development</li>
                </ul>
                <Button asChild className="mt-8 w-full">
                    <Link href="/contact">Start a Similar Project</Link>
                </Button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
