"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { BrandingSettings } from "@/services/settings";
import dynamic from 'next/dynamic';

const ClientThemeToggleButton = dynamic(() => import('./ClientThemeToggleButton'), {
  ssr: false,
});

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/about", label: "Our Story" },
];

export default function Header({ settings }: { settings: BrandingSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { logoUrl, logoWidth } = settings;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative transition-all" style={{ width: `${logoWidth}px`, height: 'auto', aspectRatio: '4/1' }}>
            <Image 
              src={logoUrl} 
              alt="Vincent Designs Studio Logo" 
              fill
              className="object-contain" 
              priority 
              unoptimized
              sizes={`${logoWidth}px`}
            />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-headline text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {mounted && <ClientThemeToggleButton />}
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </nav>
        
        {/* Mobile Menu Toggle and Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <>
              <ClientThemeToggleButton />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-background border-b pb-4 animate-in fade-in-20 slide-in-from-top-4">
          <nav className="flex flex-col items-center gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-headline text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild onClick={() => setIsOpen(false)} className="mt-4">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
