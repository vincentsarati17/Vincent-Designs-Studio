
import { getProjectBySlug } from "@/actions/projects";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";
import { getSiteIdentitySettings } from "@/actions/settings";

type PortfolioDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
    const project = await getProjectBySlug(params.slug);
    const settings = await getSiteIdentitySettings();

    if (!project) {
        return {
            title: `Project Not Found | ${settings.siteName}`
        }
    }

    return {
        title: `${project.title} | ${settings.siteName}`,
        description: project.description,
        openGraph: {
            title: `${project.title} | ${settings.siteName}`,
            description: project.description,
            images: [
                {
                    url: project.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
    }
}


export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
