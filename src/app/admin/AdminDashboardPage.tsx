
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckCircle, Mail, Calendar, Bell, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import type { ContactSubmission, Project, AdminLog } from "@/lib/types";
import { initializeFirebase } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs, where, Timestamp } from "firebase/firestore";
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const { db } = initializeFirebase();

type Notification = {
  id: string;
  type: 'submission' | 'log';
  text: string;
  user: string;
  createdAt: Date;
  icon: React.ReactNode;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<{totalClients: number, totalProjects: number, completedProjects: number} | null>(null);
  const [submissions, setSubmissions] = React.useState<ContactSubmission[] | null>(null);
  const [deadlines, setDeadlines] = React.useState<Project[] | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[] | null>(null);

  const unreadSubmissions = submissions?.filter(s => !s.isRead).length ?? 0;

  React.useEffect(() => {
    async function fetchStats() {
        const projectsQuery = query(collection(db, "projects"));
        const clientsQuery = query(collection(db, "clients"));
        
        const [projectsSnapshot, clientsSnapshot] = await Promise.all([
          getDocs(projectsQuery),
          getDocs(clientsQuery)
        ]);

        const projects = projectsSnapshot.docs.map(doc => doc.data() as Project);
        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.deadline && p.deadline.toDate() < new Date()).length;
        const clientsCount = clientsSnapshot.size; 

        setStats({
            totalClients: clientsCount,
            totalProjects: totalProjects,
            completedProjects: completedProjects,
        });
    }

    fetchStats();

    // Listener for recent submissions (also used for notifications)
    const submissionsQuery = query(collection(db, "submissions"), orderBy("createdAt", "desc"), limit(5));
    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as ContactSubmission;
      });
      setSubmissions(submissionData);
    }, (error) => {
      console.error("Error fetching submissions:", error);
      setSubmissions([]);
    });

    // Listener for upcoming deadlines
    const deadlinesQuery = query(
      collection(db, "projects"), 
      where('deadline', '>=', Timestamp.now()),
      orderBy("deadline", "asc"), 
      limit(3)
    );
    const unsubscribeDeadlines = onSnapshot(deadlinesQuery, (snapshot) => {
      const deadlineData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          deadline: data.deadline?.toDate(),
        } as Project;
      });
      setDeadlines(deadlineData);
    }, (error) => {
      console.error("Error fetching deadlines:", error);
      setDeadlines([]);
    });
    
    // Combined listener for notifications
    const logsQuery = query(collection(db, 'admin_logs'), orderBy('createdAt', 'desc'), limit(5));
    const subsForNotifsQuery = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'), limit(5));

    const unsubscribeLogs = onSnapshot(logsQuery, (logSnapshot) => {
      const logNotifs = logSnapshot.docs.map(doc => {
        const data = doc.data() as AdminLog;
        return {
          id: doc.id,
          type: 'log',
          text: data.action,
          user: data.user,
          createdAt: data.createdAt?.toDate(),
          icon: <UserCheck className="h-4 w-4 text-muted-foreground" />
        } as Notification;
      });

      // We need to re-fetch submissions here to combine and sort them
      const unsubscribeCombined = onSnapshot(subsForNotifsQuery, (subSnapshot) => {
        const subNotifs = subSnapshot.docs.map(doc => {
          const data = doc.data() as ContactSubmission;
          return {
            id: doc.id,
            type: 'submission',
            text: `New message from ${data.name}`,
            user: data.email,
            createdAt: data.createdAt?.toDate(),
            icon: <Mail className="h-4 w-4 text-muted-foreground" />
          } as Notification;
        });
        
        const combined = [...logNotifs, ...subNotifs]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 7);
          
        setNotifications(combined);
      });
      
      return () => unsubscribeCombined();
    }, (error) => {
      console.error("Error fetching logs for notifications:", error);
      setNotifications([]);
    });

    return () => {
      unsubscribeSubmissions();
      unsubscribeDeadlines();
      unsubscribeLogs();
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats ? <div className="text-2xl font-bold">{stats.totalClients}</div> : <Skeleton className="h-8 w-10" />}
            <p className="text-xs text-muted-foreground">
              All active clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats ? <div className="text-2xl font-bold">{stats.totalProjects}</div> : <Skeleton className="h-8 w-10" />}
            <p className="text-xs text-muted-foreground">
              Total projects ever created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats ? <div className="text-2xl font-bold">{stats.completedProjects}</div> : <Skeleton className="h-8 w-10" />}
            <p className="text-xs text-muted-foreground">
              Projects with past deadlines
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {submissions === null ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">+{unreadSubmissions}</div>}
            <p className="text-xs text-muted-foreground">
              New contact form submissions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5"/> Notification Center</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    {notifications === null ? (
                        <div className="space-y-4 p-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : notifications.length > 0 ? (
                         <div className="space-y-4">
                           {notifications.map((notification) => (
                             <div key={notification.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
                               <div className="bg-muted rounded-full p-2">
                                 {notification.icon}
                               </div>
                               <div className="flex-grow">
                                 <p className="text-sm">
                                   <span className="font-semibold">{notification.user}</span> {notification.type === 'log' ? notification.text.toLowerCase() : ''}
                                 </p>
                                 {notification.type === 'submission' && <p className="text-sm font-medium">{notification.text}</p>}
                                 <p className="text-xs text-muted-foreground">
                                   {notification.createdAt ? `${formatDistanceToNow(notification.createdAt)} ago` : 'N/A'}
                                 </p>
                               </div>
                             </div>
                           ))}
                         </div>
                    ) : (
                        <div className="text-center text-muted-foreground h-24 flex items-center justify-center">
                            <p>No recent activity found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5"/> Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {submissions === null ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                            </TableRow>
                        ))
                      ) : submissions.length > 0 ? (
                        submissions.slice(0,3).map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell>
                              <div className="font-medium">{submission.name}</div>
                              <div className="text-sm text-muted-foreground">{submission.email}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={submission.isRead ? "outline" : "default"}>
                                {submission.isRead ? "Read" : "New"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No messages yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5"/> Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    {deadlines === null ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : deadlines.length > 0 ? (
                        <div className="space-y-4">
                            {deadlines.map(project => (
                                <div key={project.id} className="flex items-center">
                                    <div className="flex flex-col items-center px-4">
                                        <p className="text-sm text-muted-foreground">{project.deadline ? format(project.deadline, "MMM") : ''}</p>
                                        <p className="text-xl font-bold">{project.deadline ? format(project.deadline, "dd") : ''}</p>
                                    </div>
                                    <div className="flex-grow">
                                        <Link href={`/admin/projects`} className="font-medium hover:underline">{project.title}</Link>
                                        <p className="text-sm text-muted-foreground">{project.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground h-24 flex items-center justify-center">
                            <p>No upcoming deadlines.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}

    