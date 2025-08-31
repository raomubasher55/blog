import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3010';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TechBlog';
const googleVerification = process.env.GOOGLE_VERIFICATION_CODE;
const twitterHandle = process.env.TWITTER_HANDLE || '@techblog';
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const viewport = 'width=device-width, initial-scale=1';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${siteName}`,
    default: `${siteName} - Latest Tech News & Insights`
  },
  description: 'Stay updated with the latest technology news, insights, and analysis. Covering AI, software development, and industry trends.',
  keywords: 'technology, tech news, AI, software development, programming, innovation',
  authors: [{ name: `${siteName} Team` }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(googleVerification && {
    verification: {
      google: googleVerification,
    },
  }),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Latest Tech News & Insights`,
    description: 'Stay updated with the latest technology news, insights, and analysis.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Latest Tech News & Insights`,
    description: 'Stay updated with the latest technology news, insights, and analysis.',
    creator: twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        
        <Theme>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          {children}
        </Theme>
      </body>
    </html>
  );
}
