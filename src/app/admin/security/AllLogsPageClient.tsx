
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { initializeFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import type { AdminLog } from "@/lib/types";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const { db } = initializeFirebase();

export default function AllLogsPageClient() {
  const [logs, setLogs] = React.useState<AdminLog[] | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const logsQuery = query(collection(db, 'admin_logs'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const logData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()
        } as AdminLog;
      });
      setLogs(logData);
    }, (error) => {
      console.error("Error fetching logs:", error);
      toast({
        variant: "destructive",
        title: "Failed to load logs",
        description: "Could not fetch activity logs."
      });
      setLogs([]);
    });

    return () => unsubscribe();
  }, [toast]);

  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Success': return 'secondary';
        case 'Failed': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/security"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Full Activity Log</h1>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText /> Admin Action Logs</CardTitle>
              <CardDescription>A complete log of all important actions performed by administrators.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {logs === null ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      </TableRow>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(log.status) as any}>{log.status}</Badge>
                        </TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.createdAt ? format(log.createdAt, 'PPp') : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No activity logs found.
                    </TableCell>
                  </TableRow>
                )}
                </TableBody>
              </Table>
          </CardContent>
      </Card>
    </>
  );
}
