
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getSubmissions } from '@/services/submissions';
import { format } from 'date-fns';

export default function MessagesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
        <CardDescription>Here are the messages you've received from your website.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SubmissionsTableSkeleton />}>
          <SubmissionsTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function SubmissionsTable() {
  const submissions = await getSubmissions();

  if (!submissions || submissions.length === 0) {
    return <p className="text-center text-muted-foreground py-8">You haven't received any messages yet.</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                {submission.isRead ? (
                  <Badge variant="secondary">Read</Badge>
                ) : (
                  <Badge>New</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">{submission.name}</div>
                <div className="text-sm text-muted-foreground">{submission.email}</div>
              </TableCell>
              <TableCell>{submission.service}</TableCell>
              <TableCell>
                {submission.createdAt ? format(submission.createdAt.toDate(), 'PPP') : 'N/A'}
              </TableCell>
              <TableCell className="max-w-[300px] truncate">{submission.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SubmissionsTableSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-6 w-12" /></TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
