'use client';

import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../../lib/wallet-context';

export default function WalletButton() {
  const { connected, isConnecting, error, connectWallet, disconnectWallet } = useWallet();

  if (connected) {
    return (
      <div className="relative group">
        <button
          onClick={disconnectWallet}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Wallet className="w-4 h-4 mr-2" />
          <span>Connected</span>
          <span className="ml-2 inline-flex items-center justify-center w-2 h-2 bg-green-400 rounded-full"></span>
        </button>
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
          <div className="py-1">
            <button
              onClick={disconnectWallet}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2 text-gray-500" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
          isConnecting ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isConnecting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </button>
      {error && (
        <div className="absolute left-0 mt-1 w-64 text-xs text-red-600 bg-red-50 p-2 rounded-md shadow-lg z-10">
          {error}
        </div>
      )}
    </div>
  );
}