
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    if (loading) return;

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

  // While loading authentication state, show a loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is not logged in and not on the login page, show a loader while redirecting
  if (!user && !isLoginPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is logged in, show the protected content (dashboard)
  if (user) {
    // If they happen to be on the login page, show a loader while redirecting
     if (isLoginPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
     }
    // Otherwise, show the dashboard layout and content
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="bg-background border-b">
          <div className="container flex items-center justify-between h-16">
            <Link href="/admin/messages" className="font-headline font-bold text-lg">
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
  
  // If no user and on the login page, just render the login page
  return <>{children}</>;
}
