
'use client';

import React, { useTransition } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContactSubmission } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SubmissionDetailsSheet from './SubmissionDetailsSheet';
import { handleDeleteSubmission } from '@/actions/send-email';

const { db } = initializeFirebase();

export default function InboxPageClient() {
  const [submissions, setSubmissions] = React.useState<ContactSubmission[] | null>(null);
  const [selectedSubmission, setSelectedSubmission] = React.useState<ContactSubmission | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
        } as ContactSubmission;
      });
      setSubmissions(subs);
    }, (error) => {
        console.error("Failed to fetch submissions:", error);
        toast({
            variant: "destructive",
            title: "Error fetching messages",
            description: "Could not load messages. Please try again later.",
        });
        setSubmissions([]);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleMarkAsRead = async (id: string) => {
    const docRef = doc(db, 'submissions', id);
    try {
      await updateDoc(docRef, { isRead: true });
      toast({
        title: "Marked as Read",
        description: "The message has been updated.",
      });
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not mark the message as read.",
      });
    }
  };

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsSheetOpen(true);
  };
  
  const handleDelete = (submissionId: string) => {
    startDeleteTransition(async () => {
      const result = await handleDeleteSubmission(submissionId);
      if (result.success) {
        toast({ title: "Message Deleted", description: "The message has been successfully removed." });
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Form Messages</CardTitle>
          <CardDescription>
            Here are the latest messages from your website's contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Status
                </TableHead>
                <TableHead>From</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions === null ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32 mb-2" /><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></TableCell>
                    </TableRow>
                ))
              ) : submissions.length > 0 ? (
                submissions.map((sub) => (
                  <TableRow key={sub.id} className={!sub.isRead ? "bg-accent/50" : ""}>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={sub.isRead ? 'outline' : 'default'}>
                        {sub.isRead ? 'Read' : 'New'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                        <div className="font-semibold">{sub.name}</div>
                        <div className="text-xs text-muted-foreground">{sub.email}</div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                        <p className="font-medium">{sub.service}</p>
                        <p className="text-sm text-muted-foreground">{sub.message}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sub.createdAt ? format(sub.createdAt, 'PPp') : 'N/A'}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" disabled={isDeletePending}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {!sub.isRead && (
                                    <DropdownMenuItem onClick={() => handleMarkAsRead(sub.id)}>Mark as Read</DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleViewDetails(sub)}>View Details</DropdownMenuItem>
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
                                                This action cannot be undone. This will permanently delete this message.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(sub.id)}>
                                                Yes, delete message
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
                  <TableCell colSpan={5} className="h-24 text-center">
                    No messages have been received yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSubmission && (
        <SubmissionDetailsSheet
          submission={selectedSubmission}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      )}
    </>
  );
}
