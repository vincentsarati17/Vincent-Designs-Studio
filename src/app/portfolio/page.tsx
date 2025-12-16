
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/actions/projects";
import type { Project } from "@/lib/types";

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-balance">Our Work</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          We take pride in our work. Here's a selection of projects that showcase our dedication to quality, creativity, and impact.
        </p>
      </div>
      
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects && projects.length > 0 ? (
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
