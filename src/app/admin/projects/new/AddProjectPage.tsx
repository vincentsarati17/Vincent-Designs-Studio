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
import React, { useEffect, useRef, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { handleAddProject } from '@/actions/projects';
import { ArrowLeft, CalendarIcon, Upload } from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  details: z.string().min(20, 'Project details must be at least 20 characters.'),
  isFeatured: z.boolean().default(false),
  deadline: z.date().optional(),
  image: z.any().refine((file) => file instanceof File && file.size > 0, 'Project image is required.'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Project'}
    </Button>
  );
}

export default function AddProjectPage() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction] = useActionState(handleAddProject, initialState);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      description: '',
      image: undefined,
      details: '',
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (formState.success) {
      toast({
        title: 'Project Added!',
        description: formState.message,
      });
      router.push('/admin/projects');
    } else if (formState.message) {
      toast({
        variant: 'destructive',
        title: 'Error adding project',
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

  const onFormSubmit = (data: ProjectFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value);
        }
      }
    });
    formAction(formData);
  };


  return (
    <>
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/projects"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
        </div>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
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
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
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
                                                <Image src={imagePreview} alt="Image preview" width={192} height={128} className="object-contain h-full w-full" />
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                    <Upload className="mx-auto h-8 w-8"/>
                                                    <p className="text-xs mt-1">Image Preview</p>
                                                </div>
                                            )}
                                        </div>
                                        <Input
                                            name={field.name}
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <Button type="button" variant="outline" asChild>
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Image
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
                                    name={field.name}
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
