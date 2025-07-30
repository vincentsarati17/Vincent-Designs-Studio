
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // We can now safely import auth here
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
    // onAuthStateChanged is a client-side observer.
    // It's safe to use in useEffect.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Redirecting to login...</p>
      </div>
    );
  }
  
  if (user && pathname === '/admin/login') {
    router.push('/admin/messages');
    return (
       <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }


  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b">
        <div className="container flex items-center justify-between h-16">
          <Link href="/admin/messages" className="font-headline font-bold text-lg">
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
}
