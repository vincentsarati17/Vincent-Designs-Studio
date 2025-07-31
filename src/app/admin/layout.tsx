
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import AuthProvider from '@/components/AuthProvider';

// This is a server component, so we can't use hooks directly here for auth state.
// We delegate the client-side auth logic to the AuthProvider component.

async function handleSignOut() {
  'use server';
  await signOut(auth);
  // The AuthProvider will detect the sign-out and redirect.
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/admin/messages" className="font-headline text-lg font-bold">
              Admin Dashboard
            </Link>
            <form action={handleSignOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
