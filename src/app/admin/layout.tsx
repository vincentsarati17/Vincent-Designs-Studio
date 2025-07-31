
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
    await signOut(auth);
    router.push('/admin/login');
  };

  // While checking auth state, show a full-screen loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';

  // If user is NOT logged in
  if (!user) {
    // If they are on the login page, let them see it
    if (isLoginPage) {
      return <>{children}</>;
    }
    // Otherwise, redirect to login
    else {
      router.push('/admin/login');
      // Return loader while redirecting
      return (
         <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
  }

  // If user IS logged in
  if (user) {
     // If they are on the login page, redirect them to the dashboard
    if (isLoginPage) {
        router.push('/admin/messages');
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-4">Redirecting to your dashboard...</span>
            </div>
        );
    }
    
    // Otherwise, they are on a protected page, so show the dashboard layout
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

  // Fallback, should not be reached
  return null;
}
