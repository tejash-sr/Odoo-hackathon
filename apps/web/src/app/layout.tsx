import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://globetrotter.vercel.app'),
  title: {
    default: 'GlobeTrotter - Your AI Travel Companion',
    template: '%s | GlobeTrotter',
  },
  description:
    'Plan your perfect trip with AI-powered recommendations, smart itineraries, and real-time travel assistance. Your journey starts here.',
  keywords: [
    'travel',
    'trip planning',
    'AI travel',
    'vacation planner',
    'itinerary',
    'travel companion',
    'road trip',
    'adventure',
  ],
  authors: [{ name: 'GlobeTrotter Team' }],
  creator: 'GlobeTrotter',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://globetrotter.app',
    title: 'GlobeTrotter - Your AI Travel Companion',
    description:
      'Plan your perfect trip with AI-powered recommendations, smart itineraries, and real-time travel assistance.',
    siteName: 'GlobeTrotter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GlobeTrotter - AI Travel Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobeTrotter - Your AI Travel Companion',
    description:
      'Plan your perfect trip with AI-powered recommendations and smart itineraries.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
