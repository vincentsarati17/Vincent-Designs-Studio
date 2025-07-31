
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

  // This effect handles all redirection logic.
  useEffect(() => {
    if (loading) return; // Don't do anything until we have the auth state.

    const isLoginPage = pathname === '/admin/login';

    // If user is not logged in and not on the login page, redirect them there.
    if (!user && !isLoginPage) {
      router.push('/admin/login');
    }
    // If user is logged in and on the login page, redirect them to the dashboard.
    else if (user && isLoginPage) {
      router.push('/admin/messages');
    }
  }, [user, loading, pathname, router]);

  // While loading authentication state, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there's no user, we show the children.
  // The effect above ensures this only happens on the login page.
  // For any other admin route, it would have already redirected.
  if (!user) {
    return <>{children}</>;
  }

  // If the user is logged in, but the redirect from /admin/login is still
  // in progress, show a loader to avoid a screen flash.
  if (pathname === '/admin/login') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If we have a user and we are not on the login page, show the dashboard layout.
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
