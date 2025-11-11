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
  
  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Reports', href: '/reports' },
    { name: 'Submit', href: '/submit' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <html lang="en" className={cn('h-full', inter.variable)} suppressHydrationWarning>
      <head>
        <title>Sunset | Anonymous Reporting</title>
        <meta name="description" content="Secure and anonymous reporting system built on Midnight Network" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/@midnight-ntwrk/dapp-connector-api@latest/dist/index.min.js" async />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200">
        <div className="relative flex min-h-screen flex-col">
          {/* Animated background */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          </div>

          {/* Navigation */}
          <header 
            className={cn(
              'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
              scrolled ? 'backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-sm' : 'bg-transparent'
            )}
          >
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Sunset
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        pathname === item.href 
                          ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Wallet & Mobile Menu Button */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:block">
                    <WalletButton />
                  </div>
                  <button 
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    aria-label="Toggle menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {mobileOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
              <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-3 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-2 px-4">
                    <WalletButton />
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 pt-20">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    S
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Sunset Complaints
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
                  &copy; {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}