

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { cn } from "@/lib/utils";
import { Lora, Poppins } from 'next/font/google';
import Script from "next/script";
import SiteLayout from "@/components/layout/SiteLayout";
import { getBrandingSettings, getSiteIdentitySettings } from "@/actions/settings";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700']
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '700']
});

// This function fetches settings that are used to generate dynamic metadata for the site.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteIdentitySettings();
  
  return {
    metadataBase: new URL('https://vvincent-designs-studio.vercel.app'),
    title: {
      default: `Graphic & Web Design in Namibia | ${settings.siteName}`,
      template: `%s | ${settings.siteName}`,
    },
    description:
      `Top-rated graphic and web design business in Namibia. ${settings.siteName} offers bespoke branding, websites, and digital marketing for businesses looking to grow.`,
    keywords: [
      "graphic design Namibia",
      "web design Namibia",
      settings.siteName,
      "branding Namibia",
      "digital agency Namibia",
      "website development Namibia",
      "logo design Namibia",
      "UI/UX design Namibia",
      "Rundu web design",
      "Namibia web design company",
      "small business website Namibia"
    ],
    icons: {
      icon: "/image/VINCEDSTUDIO.icon.png",
    },
    openGraph: {
      title: `Graphic & Web Design in Namibia | ${settings.siteName}`,
      description: 'Bespoke graphic and web design in Namibia. We build exceptional brands and websites for businesses ready to make their mark.',
      url: 'https://vvincent-designs-studio.vercel.app',
      siteName: settings.siteName,
      images: [
        {
          url: '/image/VDS-og-image.png',
          width: 1200,
          height: 630,
          alt: `${settings.siteName} - Graphic and Web Design Services in Namibia`,
        },
      ],
      locale: 'en_NA',
      type: 'website',
    },
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identitySettings, brandingSettings] = await Promise.all([
    getSiteIdentitySettings(),
    getBrandingSettings(),
  ]);

  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable} scroll-smooth`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
      </head>
      <body className={cn("font-body", "antialiased bg-background text-foreground min-h-screen flex flex-col")}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <SiteLayout 
              identitySettings={identitySettings}
              brandingSettings={brandingSettings}
            >
              {children}
            </SiteLayout>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
        <Script 
            src="//code.tidio.co/mpvkt5ph0fqhszh4dhggtm0dhm2le4qn.js"
            strategy="afterInteractive" 
          />
      </body>
    </html>
  );
}
