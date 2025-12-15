"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";
import { motion } from "framer-motion";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="block group">
      <motion.div
        layoutId={`card-${project.id}`}
        className="overflow-hidden relative transition-all duration-300 hover:shadow-lg block bg-card rounded-lg aspect-video"
      >
        <motion.div layoutId={`image-${project.id}`} className="relative w-full h-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Badge>{project.category}</Badge>
            <motion.h3 layoutId={`title-${project.id}`} className="font-headline text-xl font-bold mt-2 text-white">{project.title}</motion.h3>
            <p className="text-sm text-white mt-1 font-semibold">{project.description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
