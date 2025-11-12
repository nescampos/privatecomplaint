'use client';

import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { useWallet } from '../lib/wallet-context';

export default function HomePage() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sunset</h1>
            <p className="text-gray-600">Anonymous Reporting Platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Anonymous Reporting for <span className="text-indigo-600">Transparency</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Sunset provides a secure platform for reporting corruption and misconduct in both public and private institutions, protecting your identity with advanced privacy technology.
          </p>
          
          {!connected ? (
            <div className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed">
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Get Started
            </div>
          ) : (
            <Link 
              href="/dashboard/submit" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Submit Anonymous Report
            </Link>
          )}
        </section>

        {/* About Section */}
        <section className="py-12 bg-white rounded-xl shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Secure and Anonymous Reporting</h2>
              <p className="text-gray-600 mb-4">
                Sunset is built on the Midnight Network, leveraging zero-knowledge proofs to ensure your identity remains protected while reporting corruption and misconduct.
              </p>
              <p className="text-gray-600 mb-4">
                Our platform allows citizens to report issues in public institutions (government offices, public services, public contracts) and private organizations (corporate fraud, unethical practices) without fear of retaliation.
              </p>
              <p className="text-gray-600">
                All reports are securely stored on the blockchain with privacy-preserving technology, ensuring transparency while protecting whistleblowers.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Reporting Corruption Matters</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Prevents misuse of public funds and resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Promotes accountability in public and private sectors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Protects public interest and welfare</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Helps build trust in institutions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Contributes to a more transparent and just society</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How Sunset Protects You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Complete Anonymity</h3>
              <p className="text-gray-600">
                Your identity is protected using advanced cryptographic techniques. No personal information is linked to your reports.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-indigo-600 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Reports are stored on a blockchain with zero-knowledge proofs, ensuring data integrity while preserving privacy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-indigo-600 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Process</h3>
              <p className="text-gray-600">
                Reports are processed by authorized entities while maintaining the whistleblower's anonymity throughout the process.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Make a Difference?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Your courage to report misconduct helps create a more transparent and accountable society. Join us in fighting corruption while staying protected.
          </p>
          
          {!connected ? (
            <div className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed">
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Submit Report
            </div>
          ) : (
            <Link 
              href="/dashboard/submit" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Submit Anonymous Report Now
            </Link>
          )}
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sunset - Anonymous Reporting Platform. Built on Midnight Network.</p>
        </footer>
      </div>
    </div>
  );
}