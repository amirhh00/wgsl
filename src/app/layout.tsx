import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import Navigation from '@/components/global/layout/Navigation';
import Footer from '@/components/global/layout/Footer';

import '@/styles/globals.css';
import { auth } from '@/lib/utils/auth';
import { ThemeProvider } from '../components/theme-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'WGSL101',
  description: 'WebGPU Shading Language 101',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn('bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navigation session={session} />
            <div className="mainWrapper w-full flex flex-1">
              <main className="w-full flex">{children}</main>
            </div>
            <Footer session={session} pathname={typeof window !== 'undefined' ? window.location.pathname : ''} />
          </div>
          <Toaster />
        </ThemeProvider>
        <Analytics disableAutoTrack={process.env.NODE_ENV === 'development'} debug={false} />
      </body>
    </html>
  );
}
