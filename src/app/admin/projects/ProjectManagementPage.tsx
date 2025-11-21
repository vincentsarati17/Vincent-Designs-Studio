
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React from "react";
import type { Project } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { handleDeleteProject } from "@/actions/projects";

const { db } = initializeFirebase();

type ProjectWithStatus = Project & { status: 'Featured' | 'Draft' };

export default function ProjectManagementPage() {
  const [projects, setProjects] = React.useState<ProjectWithStatus[] | null>(null);
  const [filter, setFilter] = React.useState('All');
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectList = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          status: data.isFeatured ? 'Featured' : 'Draft', 
        } as ProjectWithStatus;
      });
      setProjects(projectList);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: "There was an error fetching your projects. Please try again later."
      });
      setProjects([]);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const filteredProjects = React.useMemo(() => {
    if (!projects) return null;
    if (filter === 'All') return projects;
    return projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());
  }, [projects, filter]);

  const categories = ['All', 'Web Design', 'Graphic Design', 'UI/UX'];

  const handleDelete = (projectId: string) => {
    startDeleteTransition(async () => {
        const result = await handleDeleteProject(projectId);
        if (result.success) {
            toast({ title: "Project Deleted", description: "The project has been successfully removed." });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <div className="flex items-center gap-2 pt-2">
                {categories.map((category) => (
                    <Button 
                        key={category} 
                        variant={filter === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects === null ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`skeleton-${i}`}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></TableCell>
                        </TableRow>
                    ))
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>
                            <Badge variant={project.status === "Featured" ? "default" : "outline"}>
                                {project.status}
                            </Badge>
                            </TableCell>
                            <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isDeletePending}>
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/projects/edit/${project.id}`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the project.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(project.id)}>
                                                    Yes, delete project
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            No projects found for the selected filter.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
