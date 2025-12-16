'use client';

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

export default function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Badge>{project.category}</Badge>
          <motion.h1 layoutId={`title-${project.id}`} className="font-headline text-4xl md:text-5xl font-bold mt-2 text-balance">{project.title}</motion.h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
        </div>
        
        <motion.div 
          layoutId={`image-${project.id}`} 
          className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-12"
        >
            <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
            />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-4">
                <h2 className="font-headline text-2xl font-bold">Project Details</h2>
                <div className="prose prose-lg text-muted-foreground max-w-none">
                  {Array.isArray(project.details) ? project.details.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  )) : <p>{project.details}</p>}
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
      </div>
    </div>
  );
}
