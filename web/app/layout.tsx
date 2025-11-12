'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { WalletProvider } from '../lib/wallet-context';
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

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <title>Sunset | Anonymous Reporting</title>
        <meta name="description" content="Secure and anonymous reporting system built on Midnight Network" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/@midnight-ntwrk/dapp-connector-api@latest/dist/index.min.js" async />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <WalletProvider>
          <div className="relative flex min-h-screen flex-col">
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}