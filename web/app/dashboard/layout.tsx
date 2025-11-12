'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from '../components/WalletButton';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Submit',
      href: '/dashboard/submit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 h-full bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-lg font-bold text-gray-800">Sunset</span>
            </div>
            
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-5">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-200">
            <p>© {new Date().getFullYear()} Midnight Network</p>
          </div>
        </div>
      </div>

      {/* Main content area positioned to the right of sidebar */}
      <div className="h-full" style={{ marginLeft: '0' }}>
        <div className="h-full flex flex-col" style={{ marginLeft: '0', paddingLeft: '16rem' }}>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 z-10 sticky top-0">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                
                <h1 className="text-lg font-semibold text-gray-800 capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <WalletButton />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}