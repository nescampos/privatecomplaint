'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface WalletContextType {
  connected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.midnight?.mnLace) {
      setError('Please install Midnight Lace wallet extension');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const api = await window.midnight.mnLace.enable();
      if (api) {
        setConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect. Please try again.');
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setError(null);
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.midnight?.mnLace) {
        try {
          const api = await window.midnight.mnLace.enable();
          if (api) {
            setConnected(true);
          }
        } catch (error) {
          console.log('No active wallet session');
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}