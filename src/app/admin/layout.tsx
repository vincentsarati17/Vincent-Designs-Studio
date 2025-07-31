
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    const isLoginPage = pathname === '/admin/login';

    if (!user && !isLoginPage) {
      router.push('/admin/login');
    } else if (user && isLoginPage) {
      router.push('/admin/messages');
    }
  }, [user, loading, pathname, router]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Show the login page if the user is not authenticated.
    // The effect above will redirect if they try to access other admin pages.
    return <>{children}</>;
  }

  // If the user is logged in, but the effect is still redirecting from /admin/login,
  // show a loader to prevent a flash of the login page.
  if (pathname === '/admin/login') {
     return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If the user is logged in and not on the login page, show the dashboard.
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
