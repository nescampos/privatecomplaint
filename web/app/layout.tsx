'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import WalletButton from './components/WalletButton';
import Head from 'next/head';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect to dashboard by default if on the root path
  useEffect(() => {
    if (pathname === '/') {
      window.location.href = '/dashboard';
    }
  }, [pathname]);

  // Don't render the layout if we're redirecting
  if (pathname === '/') {
    return (
      <html lang="en">
        <body className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <title>Sunset | Anonymous Reporting</title>
        <meta name="description" content="Secure and anonymous reporting system built on Midnight Network" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/@midnight-ntwrk/dapp-connector-api@latest/dist/index.min.js" async />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <div className="relative flex min-h-screen flex-col">
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}