
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}`}>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block">
        <div className="relative aspect-video w-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-4">
          <Badge variant="secondary">{project.category}</Badge>
          <h3 className="font-headline text-xl font-bold mt-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
      </Card>
    </Link>
  );
}
