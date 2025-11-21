
"use client";

import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ClientDetailsSheet from "./ClientDetailsSheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { handleAddClient, handleDeleteClient, handleUpdateClient } from "@/actions/clients";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { initializeFirebase } from "@/firebase";
import type { Client } from "@/lib/types";

const { db } = initializeFirebase();

const clientFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email."),
    company: z.string().min(2, "Company name is required."),
});
type ClientFormValues = z.infer<typeof clientFormSchema>;

function AddClientDialog() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: { name: "", email: "", company: "" },
    });

    const onSubmit = (values: ClientFormValues) => {
        startTransition(async () => {
            const result = await handleAddClient(values);
            if (result.success) {
                toast({ title: "Client Added", description: "The new client has been saved." });
                form.reset();
                setIsOpen(false);
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>Enter the details for the new client.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="add-client-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="company" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl><Input placeholder="Acme Inc." {...field} disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="add-client-form" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Client"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditClientDialog({ client, children }: { client: Client, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: { name: client.name, email: client.email, company: client.company },
    });

    const onSubmit = (values: ClientFormValues) => {
        startTransition(async () => {
            if (!client?.id) return;
            const result = await handleUpdateClient(client.id, values);
            if (result.success) {
                toast({ title: "Client Updated", description: "The client's details have been saved." });
                setIsOpen(false);
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogDescription>Update the details for this client.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="edit-client-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="company" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl><Input placeholder="Acme Inc." {...field} disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="edit-client-form" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function ClientManagementPage() {
  const [clients, setClients] = React.useState<Client[] | null>(null);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const clientList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        } as Client));
        setClients(clientList);
    }, (error) => {
        console.error("Error fetching clients:", error);
        toast({
            variant: "destructive",
            title: "Failed to load clients",
            description: "There was an error fetching clients. Please try again."
        });
        setClients([]);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsSheetOpen(true);
  };

  const handleDelete = (clientId: string) => {
    startDeleteTransition(async () => {
        const result = await handleDeleteClient(clientId);
        if (result.success) {
            toast({ title: "Client Deleted", description: "The client has been successfully removed." });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    });
  }
  
  React.useEffect(() => {
      if (!isSheetOpen) {
          setSelectedClient(null);
      }
  }, [isSheetOpen]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <AddClientDialog />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients === null ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`skeleton-${i}`}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></TableCell>
                        </TableRow>
                    ))
                ) : clients.length > 0 ? (
                    clients.map((client) => (
                    <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.company}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isDeletePending}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(client)}>View Details</DropdownMenuItem>
                            <EditClientDialog client={client}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
                            </EditClientDialog>
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
                                            This action cannot be undone. This will permanently delete the client and all associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(client.id)}>
                                            Yes, delete client
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
                            No clients have been added yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      
      <ClientDetailsSheet
          client={selectedClient}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
      />
      
    </>
  );
}
