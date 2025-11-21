
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageTransition from '@/components/PageTransition';
import { cn } from '@/lib/utils';
import type React from 'react';
import { getBrandingSettings, getSiteIdentitySettings, SiteIdentitySettings, BrandingSettings } from '@/services/settings';
import { useEffect, useState } from 'react';
import { trackPageView } from '@/services/tracking';

type CombinedSettings = {
  identity: SiteIdentitySettings;
  branding: BrandingSettings;
}

const initialSettings: CombinedSettings = {
  identity: {
    siteName: 'Namib Essence Designs',
    publicEmail: 'vincentdesigns137@gmail.com',
  },
  branding: {
    logoUrl: '/image/VINCEDSTUDIO.icon.png',
    logoWidth: 220,
  }
};


export default function SiteLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const pathname = usePathname();
  const isSiteRoute = !pathname.startsWith('/admin');
  const [settings, setSettings] = useState<CombinedSettings>(initialSettings);

  useEffect(() => {
    async function fetchSettings() {
      if (isSiteRoute) {
        const [identity, branding] = await Promise.all([
          getSiteIdentitySettings(),
          getBrandingSettings(),
        ]);
        setSettings({ identity, branding });
      }
    }
    fetchSettings();
  }, [isSiteRoute]);

  useEffect(() => {
    if (isSiteRoute && process.env.NODE_ENV === 'production') {
      trackPageView(pathname);
    }
  }, [pathname, isSiteRoute]);

  return (
    <>
      {isSiteRoute && <Header settings={settings.branding} />}
      <main className={cn("flex-grow", { "flex flex-col": !isSiteRoute })}>
        <PageTransition>{children}</PageTransition>
      </main>
      {isSiteRoute && (
        <>
          <Footer settings={settings.identity} />
          <WhatsAppButton />
        </>
      )}
    </>
  );
}
