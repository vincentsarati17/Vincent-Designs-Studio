'use client';

import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleUpdateProject } from '@/actions/projects';
import { ArrowLeft, CalendarIcon, Upload } from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { getProjectById } from '@/services/projects';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  details: z.string().min(20, 'Project details must be at least 20 characters.'),
  isFeatured: z.boolean().default(false),
  deadline: z.date().optional(),
  image: z.any().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const initialState = {
  success: false,
  message: '',
  slug: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [formState, setFormState] = useState(initialState);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      description: '',
      details: '',
      isFeatured: false,
    },
  });

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      const fetchedProject = await getProjectById(params.id);
      if (fetchedProject) {
        setProject(fetchedProject);
        form.reset({
          ...fetchedProject,
          details: Array.isArray(fetchedProject.details) ? fetchedProject.details.join('\n\n') : fetchedProject.details,
          deadline: fetchedProject.deadline?.toDate(),
        });
        setImagePreview(fetchedProject.imageUrl);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Project not found.',
        });
        router.push('/admin/projects');
      }
      setIsLoading(false);
    }
    fetchProject();
  }, [params.id, router, toast, form]);

  useEffect(() => {
    if (formState.success) {
      toast({
        title: 'Project Updated!',
        description: formState.message,
      });
      router.push(`/admin/projects`);
    } else if (formState.message && !formState.success && formState.message !== '') {
      toast({
        variant: 'destructive',
        title: 'Error updating project',
        description: formState.message,
      });
    }
  }, [formState, router, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: ProjectFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value instanceof File) {
            formData.append(key, value);
        } else if (typeof value === 'boolean') {
            formData.append(key, value ? 'on' : '');
        }
         else {
          formData.append(key, value as string);
        }
      }
    });
    // Add current image URL for backend logic
    if (project?.imageUrl) {
        formData.append('currentImageUrl', project.imageUrl);
    }
    if (project?.slug) {
        formData.append('currentSlug', project.slug);
    }
    
    const result = await handleUpdateProject(params.id, initialState, formData);
    setFormState(result);
  };
  
  if (isLoading) {
    return <EditProjectPageSkeleton />;
  }

  return (
    <>
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/projects"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
          >
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Title</FormLabel>
                                <FormControl><Input placeholder="e.g., Tech Innovate Website" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl><Input placeholder="e.g., tech-innovate-website" {...field} /></FormControl>
                                <FormDescription>This is the URL-friendly version of the title.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl><Input placeholder="e.g., Web Design" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Deadline</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Optional: Set a deadline for this project.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (

                            <FormItem>
                                <FormLabel>Short Description (for portfolio grid)</FormLabel>
                                <FormControl><Textarea placeholder="A brief summary of the project." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Image</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <div className="w-48 h-32 rounded-md border border-dashed flex items-center justify-center bg-muted/50">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Image preview" width={192} height={128} className="object-contain h-full w-full" unoptimized/>
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                    <Upload className="mx-auto h-8 w-8"/>
                                                    <p className="text-xs mt-1">Image Preview</p>
                                                </div>
                                            )}
                                        </div>
                                        <Input
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <Button type="button" variant="outline" asChild>
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Change Image
                                            </label>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>The main image for the project. Recommended aspect ratio is 3:2.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Details (for project page)</FormLabel>
                                <FormControl><Textarea placeholder="Describe the project in more detail..." className="min-h-32" {...field} /></FormControl>
                                <FormDescription>Separate paragraphs with a new line.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Feature on Homepage</FormLabel>
                                    <FormDescription>Enable to show this project on the homepage.</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch 
                                    name="isFeatured"
                                    checked={field.value} 
                                    onCheckedChange={field.onChange} 
                                  />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2">
                         <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                         <SubmitButton />
                    </div>
                </CardContent>
              </Card>
            </form>
        </Form>
    </>
  );
}


function EditProjectPageSkeleton() {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-9 w-48" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
          </div>
           <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
