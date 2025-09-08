
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

const VDS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Vincent Designs Studio',
  url: 'https://www.vincentdesigns.studio', // Replace with your actual domain
  logo: 'https://www.vincentdesigns.studio/image/VDS-logo.png', // Replace with your actual domain
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+264-81-819-0591',
    contactType: 'Customer Service',
    email: 'vincentdesigns137@gmail.com',
  },
  sameAs: [
    // Add links to your social media profiles here
    // "https://www.facebook.com/your-profile",
    // "https://www.instagram.com/your-profile",
  ],
};


export const metadata: Metadata = {
  metadataBase: new URL('https://www.vincentdesigns.studio'), // Replace with your actual domain
  title: {
    default: "Vincent Designs Studio | Digital Craftsmanship, Inspired Design",
    template: "%s | Vincent Designs Studio",
  },
  description:
    "Bespoke graphic and web design. We build exceptional brands and websites for businesses ready to make their mark.",
  keywords: [
    "Vincent Designs Studio",
    "web design",
    "graphic design",
    "branding",
    "digital agency",
    "Namibia"
  ],
  icons: {
    icon: "/image/VDS icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(VDS_JSON_LD) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&display=swap"
          rel="stylesheet"
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
