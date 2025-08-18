
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/projects";

export default async function PortfolioPage() {
  let projects = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // You could return a message here to be displayed on the page
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-balance">Our Work</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          We take pride in our work. Here's a selection of projects that showcase our dedication to quality, creativity, and impact.
        </p>
      </div>
      {projects.length > 0 ? (
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Could not load projects. Please check your connection or try again later.</p>
        </div>
      )}
    </div>
  );
}
