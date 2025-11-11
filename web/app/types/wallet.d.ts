import '@midnight-ntwrk/dapp-connector-api';

declare module '@midnight-ntwrk/dapp-connector-api' {
  interface DAppConnectorWalletAPI {
    getUnusedAddresses: () => Promise<string[]>;
    // Add other methods as needed
  }
}

declare global {
  interface Window {
    midnight: {
      mnLace: {
        enable: () => Promise<import('@midnight-ntwrk/dapp-connector-api').DAppConnectorWalletAPI>;
      };
    };
  }
}
