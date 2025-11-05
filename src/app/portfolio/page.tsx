
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/projects";
import type { Metadata } from 'next';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import placeholderImages from '@/app/lib/placeholder-images.json';
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
    title: "Our Work",
    description: "Explore a selection of our best work. See how we've helped businesses with web design, branding, and graphic design to make their mark.",
};

const placeholderProjects: Project[] = [
  {
    id: "placeholder-1",
    title: "Modern E-Commerce Platform",
    description: "A sleek and fast e-commerce site for a local fashion brand.",
    category: "Web Design",
    imageUrl: placeholderImages.portfolio.project1.src,
    isFeatured: true,
    slug: "#",
    details: [],
  },
  {
    id: "placeholder-2",
    title: "Corporate Branding Refresh",
    description: "A complete brand identity overhaul for a financial services company.",
    category: "Branding",
    imageUrl: placeholderImages.portfolio.project2.src,
    isFeatured: true,
    slug: "#",
    details: [],
  },
  {
    id: "placeholder-3",
    title: "Mobile App for a Startup",
    description: "An intuitive and engaging mobile app for a new tech startup.",
    category: "UI/UX Design",
    imageUrl: placeholderImages.portfolio.project3.src,
    isFeatured: false,
    slug: "#",
    details: [],
  },
    {
    id: "placeholder-4",
    title: "Marketing Website for SaaS",
    description: "A high-converting landing page and website for a software product.",
    category: "Web Development",
    imageUrl: placeholderImages.portfolio.project4.src,
    isFeatured: false,
    slug: "#",
    details: [],
  },
];


const PlaceholderProjectCard = ({ project }: { project: Project }) => {
  const image = placeholderImages.portfolio[`project${project.id.split('-')[1]}` as keyof typeof placeholderImages.portfolio]
  return (
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block bg-card rounded-lg">
        <div className="relative aspect-video w-full">
            <div className="relative w-full h-full">
            <Image
                src={image.src}
                alt={project.title}
                data-ai-hint={image.hint}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
            </div>
        </div>
        <div className="p-4">
            <Badge variant="secondary">{project.category}</Badge>
            <h3 className="font-headline text-xl font-bold mt-2">{project.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
      </Card>
  );
};


export default async function PortfolioPage() {
  const projects = (await getProjects()) || [];

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-balance">Our Work</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          We take pride in our work. Here's a selection of projects that showcase our dedication to quality, creativity, and impact.
        </p>
      </div>
      
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            placeholderProjects.map((project) => (
              <PlaceholderProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      
    </div>
  );
}
