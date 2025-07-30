
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user && isLoginPage) {
    return <>{children}</>;
  }

  if (user && !isLoginPage) {
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

  // This state covers a few redirecting scenarios:
  // 1. Logged-in user on the login page -> redirecting to /admin/messages
  // 2. Logged-out user on a protected page -> redirecting to /admin/login
  // We show a loader to prevent flashes of incorrect content.
  return (
    <div className="flex h-screen items-center justify-center bg-muted/40">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
