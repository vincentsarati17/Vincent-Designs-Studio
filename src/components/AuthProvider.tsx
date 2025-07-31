
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Toaster } from './ui/toaster';

export default function AuthProvider({ children }: { children: ReactNode }) {
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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';

  if (!user) {
    if (isLoginPage) {
      return (
        <>
          {children}
          <Toaster />
        </>
      );
    } else {
      router.push('/admin/login');
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
  }

  if (user) {
    if (isLoginPage) {
      router.push('/admin/messages');
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-4">Redirecting to your dashboard...</span>
        </div>
      );
    }
    return <>{children}</>;
  }

  return null;
}
