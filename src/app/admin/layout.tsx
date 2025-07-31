
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Wait until authentication check is complete

    const isLoginPage = pathname === '/admin/login';

    if (user && isLoginPage) {
      // If user is logged in and on the login page, redirect them to the dashboard.
      router.push('/admin/messages');
    } else if (!user && !isLoginPage) {
      // If user is not logged in and not on the login page, redirect them to login.
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    // After sign out, the effect above will handle redirecting to login.
  };

  // While checking for user auth, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there is no user, we should only be on the login page.
  // The effect handles redirection from other pages, so we can just render the children (the login page itself).
  if (!user) {
    return <>{children}</>;
  }
  
  // If we have a user and we are stuck on the login page, show a loading state while we redirect.
  if (pathname === '/admin/login') {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we have a user and are on any page other than login, show the dashboard layout with the content.
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/messages" className="font-headline text-lg font-bold">
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
