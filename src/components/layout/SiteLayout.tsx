
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageTransition from '@/components/PageTransition';
import { cn } from '@/lib/utils';
import type React from 'react';
import { SiteIdentitySettings, BrandingSettings } from '@/services/settings';

type SiteLayoutProps = {
  children: React.ReactNode;
  identitySettings: SiteIdentitySettings;
  brandingSettings: BrandingSettings;
};

export default function SiteLayout({ 
  children,
  identitySettings,
  brandingSettings,
}: SiteLayoutProps) {
  const pathname = usePathname();
  const isSiteRoute = !pathname.startsWith('/admin');

  // Removed problematic useEffect for page view tracking.
  // This logic is better handled in specific components if needed,
  // or with a dedicated analytics provider setup.

  return (
    <>
      {isSiteRoute && <Header settings={brandingSettings} />}
      <main className={cn("flex-grow", { "flex flex-col": !isSiteRoute })}>
        <PageTransition>{children}</PageTransition>
      </main>
      {isSiteRoute && (
        <>
          <Footer settings={identitySettings} />
          <WhatsAppButton />
        </>
      )}
    </>
  );
}
