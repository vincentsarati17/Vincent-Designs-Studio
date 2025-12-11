'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Fingerprint, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { initializeFirebase } from "@/firebase";
import type { AdminLog } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { updateSecuritySettings } from "@/actions/settings";
import type { SecuritySettings } from "@/services/settings";

const { db } = initializeFirebase();

type SecurityPageClientProps = {
  settings: SecuritySettings;
};

export default function SecurityPageClient({ settings }: SecurityPageClientProps) {
  const [is2faEnabled, setIs2faEnabled] = React.useState(settings.is2faEnabled);
  const [isLoaded, setIsLoaded] = React.useState(true); // Now loaded from server
  const [actionLogs, setActionLogs] = React.useState<AdminLog[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    // Fetch logs on client
    const logsQuery = query(
      collection(db, 'admin_logs'), 
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()
        } as AdminLog;
      });
      setActionLogs(logs);
    }, (error) => {
      console.error("Error fetching logs:", error);
      toast({
        variant: "destructive",
        title: "Failed to load logs",
        description: "Could not fetch activity logs."
      });
      setActionLogs([]);
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

  const handleUpdateSettings = () => {
    startTransition(async () => {
      const new2faState = !is2faEnabled;
      setIs2faEnabled(new2faState); // Optimistic update
      const result = await updateSecuritySettings({ is2faEnabled: new2faState });
      if (result.success) {
        toast({
          title: "Settings Updated",
          description: `Two-Factor Authentication has been ${new2faState ? 'enabled' : 'disabled'}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.message,
        });
        // Revert UI change on failure
        setIs2faEnabled(!new2faState);
      }
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Security &amp; Logs</h1>
      
      <div className="grid gap-8 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Admin Action Logs</CardTitle>
                    <CardDescription>A log of the most recent actions performed by administrators.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {actionLogs === null ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    </TableRow>
                                ))
                            ) : actionLogs.length > 0 ? (
                                actionLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell>{log.user}</TableCell>
                                        <TableCell>{log.createdAt ? `${formatDistanceToNow(log.createdAt)} ago` : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(log.status) as any}>{log.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No recent activity found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" asChild>
                            <Link href="/admin/security/logs">View All Logs</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield /> Security Settings</CardTitle>
                    <CardDescription>Manage security features for your admin panel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-0.5">
                            <Label htmlFor="2fa-switch" className="flex items-center gap-2 text-base"><Fingerprint /> Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Require a second verification step for all admins.</p>
                        </div>
                        {isLoaded ? (
                            <Switch id="2fa-switch" checked={is2faEnabled} onCheckedChange={handleUpdateSettings} disabled={isPending} />
                        ) : (
                            <Skeleton className="h-6 w-11 rounded-full" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
