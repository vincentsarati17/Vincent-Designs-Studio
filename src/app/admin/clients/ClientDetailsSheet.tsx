
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Client, ClientNote, ClientRequest } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import React, { useCallback, useEffect, useTransition } from "react";
import { getNotesForClient, getRequestsForClient } from "@/services/clients";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { handleAddNote, handleAddRequest } from "@/actions/clients";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ClientDetailsSheetProps = {
  client: Client | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};


function AddRequestDialog({ clientId, onOpenChange }: { clientId: string, onOpenChange: (isOpen: boolean) => void }) {
    const [title, setTitle] = React.useState('');
    const [status, setStatus] = React.useState<'New' | 'In Progress' | 'Completed'>('New');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSubmit = () => {
        startTransition(async () => {
            const result = await handleAddRequest({ title, status, clientId });
            if (result.success) {
                toast({ title: "Request Added" });
                setTitle('');
                setStatus('New');
                onOpenChange(false);
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        });
    }

    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Request
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Request</DialogTitle>
                    <DialogDescription>
                        Log a new request or inquiry for this client.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="req-title">Request Title</Label>
                        <Input id="req-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Logo redesign inquiry" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="req-status">Status</Label>
                         <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                            <SelectTrigger id="req-status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>{isPending ? "Adding..." : "Add Request"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ClientDetailsSheet({ client, isOpen, onOpenChange }: ClientDetailsSheetProps) {
    const [notes, setNotes] = React.useState<ClientNote[] | null>(null);
    const [requests, setRequests] = React.useState<ClientRequest[] | null>(null);
    const [newNoteContent, setNewNoteContent] = React.useState('');
    
    const [isNotePending, startNoteTransition] = useTransition();
    const [isAddRequestOpen, setIsAddRequestOpen] = React.useState(false);

    const { toast } = useToast();

    const fetchClientData = useCallback(async () => {
        if (!client) return;
        setNotes(null);
        setRequests(null);
        try {
            const [clientNotes, clientRequests] = await Promise.all([
                getNotesForClient(client.id),
                getRequestsForClient(client.id)
            ]);
            setNotes(clientNotes);
            setRequests(clientRequests);
        } catch (error) {
            console.error("Failed to fetch client details:", error);
            setNotes([]);
            setRequests([]);
        }
    }, [client]);

    useEffect(() => {
        if (isOpen && client) {
            fetchClientData();
        }
    }, [isOpen, client, fetchClientData]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'secondary';
            case 'In Progress': return 'default';
            case 'New': return 'destructive';
            default: return 'outline';
        }
    }

    const handleAddNote = () => {
        if (!client || !newNoteContent.trim()) return;
        startNoteTransition(async () => {
            const result = await handleAddNote({ content: newNoteContent, clientId: client.id });
            if (result.success) {
                toast({ title: "Note Added" });
                setNewNoteContent('');
                fetchClientData(); // Re-fetch notes
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        });
    }

  if (!client) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
          <SheetTitle>Client Details</SheetTitle>
          <SheetDescription>
            View client information, notes, and requests.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-2xl">{client.name ? client.name.charAt(0) : 'C'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xl font-semibold">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
            </div>

            <Separator />
            
            <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Private Notes</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="mt-4">
                    <h4 className="font-semibold mb-4">Internal Notes</h4>
                    <div className="space-y-4">
                        <ScrollArea className="h-48 pr-4">
                            <div className="space-y-4">
                                {notes === null ? (
                                    Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                                ) : notes.length > 0 ? (
                                    notes.map(note => (
                                        <div key={note.id} className="text-sm p-3 rounded-md bg-muted/50">
                                            <p>{note.content}</p>
                                            <p className="text-xs text-muted-foreground mt-2">- {note.author}, {formatDistanceToNow(note.createdAt)} ago</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-muted-foreground py-10">No notes yet.</div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="space-y-2">
                            <Textarea 
                                placeholder="Add a new note..." 
                                value={newNoteContent} 
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                disabled={isNotePending}
                            />
                            <Button size="sm" onClick={handleAddNote} disabled={isNotePending || !newNoteContent.trim()}>
                                {isNotePending ? 'Adding...' : 'Add Note'}
                            </Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="requests" className="mt-4">
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Inquiries & Requests</h4>
                        <AddRequestDialog clientId={client.id} onOpenChange={setIsAddRequestOpen} />
                     </div>
                    <ScrollArea className="h-64 pr-4">
                        <div className="space-y-3">
                           {requests === null ? (
                                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                            ) : requests.length > 0 ? (
                                requests.map(req => (
                                    <div key={req.id} className="text-sm p-3 rounded-md border flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{req.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(req.createdAt)} ago</p>
                                        </div>
                                        <Badge variant={getStatusVariant(req.status) as any}>{req.status}</Badge>
                                    </div>
                                ))
                             ) : (
                                <div className="text-center text-sm text-muted-foreground py-10">No requests yet.</div>
                             )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
