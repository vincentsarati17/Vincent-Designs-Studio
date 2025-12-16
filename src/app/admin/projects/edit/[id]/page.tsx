import type { Metadata } from 'next';
import { getProjectById } from '@/actions/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditProjectForm from './EditProjectForm';


export const metadata: Metadata = {
  title: 'Edit Project',
  description: 'Edit an existing project in your portfolio.',
};

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Editing: {project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProjectForm project={project} />
        </CardContent>
      </Card>
    </>
  );
}
