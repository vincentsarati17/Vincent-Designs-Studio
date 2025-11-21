
'use client';

import Link from "next/link";
import { FolderKanban, LayoutDashboard, Home, Users, Mail, Settings, LineChart, ShieldCheck, LogOut } from "lucide-react";
import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const onLogout = async () => {
    const result = await handleLogout();
    if (result.success) {
      router.push('/admin/login');
    } else {
      // Handle logout error, maybe show a toast
      console.error(result.message);
    }
  };

  const navLinks = [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/clients", label: "Clients", icon: Users },
      { href: "/admin/inbox", label: "Inbox", icon: Mail },
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
      { href: "/admin/security", label: "Security", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col border-r bg-primary sm:flex">
          <div className="flex flex-col gap-2 px-4 sm:py-5 flex-grow">
            <Link
              href="/"
              className="group flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-foreground text-lg font-semibold text-primary md:h-8  md:text-base mb-4"
            >
              <Home className="h-5 w-5 transition-all group-hover:scale-110" />
              <span>Back to Site</span>
            </Link>
            
            {navLinks.map((link) => {
                const isActive = (link.href === '/admin' && pathname === '/admin') || (link.href !== '/admin' && pathname.startsWith(link.href));
                return (
                    <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground hover:bg-black/10",
                        isActive && "bg-black/20 text-primary-foreground"
                    )}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </Link>
                )
            })}
          </div>
          <div className="mt-auto p-4">
            <Button variant="ghost" className="w-full justify-start gap-3 text-primary-foreground/80 hover:bg-black/10 hover:text-primary-foreground" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-56">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
