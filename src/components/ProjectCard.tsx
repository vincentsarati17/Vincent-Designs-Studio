
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";
import { motion } from "framer-motion";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="block">
      <motion.div
        layoutId={`card-${project.id}`}
        className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block bg-card rounded-lg"
      >
        <div className="relative aspect-video w-full">
          <motion.div layoutId={`image-${project.id}`} className="relative w-full h-full">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
        <div className="p-4">
          <Badge variant="secondary">{project.category}</Badge>
          <motion.h3 layoutId={`title-${project.id}`} className="font-headline text-xl font-bold mt-2">{project.title}</motion.h3>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
