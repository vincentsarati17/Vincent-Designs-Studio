
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { Lora, Poppins } from 'next/font/google';

const VDS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Vincent Designs Studio',
  url: 'https://www.vincentdesigns.studio',
  logo: 'https://www.vincentdesigns.studio/image/VDS-logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+264-81-819-0591',
    contactType: 'Customer Service',
    email: 'vincentdesigns137@gmail.com',
    areaServed: 'NA',
    availableLanguage: 'en'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NA',
    addressLocality: 'Rundu'
  },
  sameAs: [
    // Add links to your social media profiles here
    // "https://www.facebook.com/your-profile",
    // "https://www.instagram.com/your-profile",
  ],
  description: "Leading graphic and web design agency in Namibia, specializing in bespoke branding, websites, and digital solutions for businesses.",
  serviceType: ["Graphic Design", "Web Design", "Web Development", "Branding", "UI/UX Design", "Mobile App Design"]
};

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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vincentdesigns.studio'),
  title: {
    default: "Graphic & Web Design in Namibia | Vincent Designs Studio",
    template: "%s | Vincent Designs Studio",
  },
  description:
    "Top-rated graphic and web design business in Namibia. Vincent Designs Studio offers bespoke branding, websites, and digital marketing for businesses looking to grow.",
  keywords: [
    "graphic design Namibia",
    "web design Namibia",
    "Vincent Designs Studio",
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
    title: 'Graphic & Web Design in Namibia | Vincent Designs Studio',
    description: 'Bespoke graphic and web design in Namibia. We build exceptional brands and websites for businesses ready to make their mark.',
    url: 'https://www.vincentdesigns.studio',
    siteName: 'Vincent Designs Studio',
    images: [
      {
        url: '/image/VDS-og-image.png', // Path to your default OG image
        width: 1200,
        height: 630,
        alt: 'Vincent Designs Studio - Graphic and Web Design Services in Namibia',
      },
    ],
    locale: 'en_NA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(VDS_JSON_LD) }}
        />
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
          <Header />
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
