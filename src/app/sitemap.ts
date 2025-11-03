
import { MetadataRoute } from 'next';
import { getProjects } from '@/services/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vvincent-designs-studio.vercel.app'; // Replace with your actual domain

  // Static pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/portfolio',
    '/services',
    '/services/banner-graphics-design',
    '/services/graphic-design',
    '/services/landing-page-creation',
    '/services/logo-design',
    '/services/mobile-app-design',
    '/services/ui-ux-design',
    '/services/web-design',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic project pages
  const projects = await getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
