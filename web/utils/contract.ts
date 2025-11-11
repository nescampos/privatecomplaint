// Contract interaction utilities
// This file will contain the actual logic to connect to the Midnight Network contracts

import "dotenv/config";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import { WebSocket } from "ws";
import * as fs from 'fs';
import * as path from 'path';
import * as Rx from 'rxjs';

// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

// Configure for Midnight Testnet
setNetworkId(NetworkId.TestNet);

let deployedContractInstance: any = null;
let walletInstance: any = null;
let contractModule: any = null;

interface Report {
  report_id: number;
  institution_name: string;
  report_details: string;
  institution_type: string;
  timestamp: number;
  informer: string;
}

// Initialize the contract and wallet - this will be called on the server side
export async function initializeContract() {
  try {
    console.log('Initializing contract and wallet...');

    // Check for deployment file
    if (!fs.existsSync('deployment.json')) {
      console.error('❌ No deployment.json found! Run npm run deploy first.');
      throw new Error('Deployment file not found');
    }

    const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    console.log(`Contract Address: ${deployment.contractAddress}`);

    // Get network config from environment (similar to the original web-server.ts)
    const networkConfig = {
      indexer: process.env.INDEXER_URL || 'http://localhost:6301',
      indexerWS: process.env.INDEXER_WS_URL || 'ws://localhost:6302',
      proofServer: process.env.PROOF_SERVER_URL || 'http://localhost:6300',
      node: process.env.NODE_URL || 'http://localhost:6303',
      name: process.env.MIDNIGHT_NETWORK || 'testnet'
    };

    const contractName = deployment.contractName || process.env.CONTRACT_NAME || 'compliants';
    const walletSeed = process.env.WALLET_SEED!;

    if (!walletSeed) {
      throw new Error('WALLET_SEED not found in environment variables');
    }

    // Build wallet
    walletInstance = await WalletBuilder.buildFromSeed(
      networkConfig.indexer,
      networkConfig.indexerWS,
      networkConfig.proofServer,
      networkConfig.node,
      walletSeed,
      getZswapNetworkId(),
      'info'
    );

    walletInstance.start();

    // Wait for sync
    const walletSyncedState: any = await Rx.firstValueFrom(
      walletInstance.state().pipe(Rx.filter((s: any) => s.syncProgress?.synced === true))
    );

    console.log(`Wallet address: ${walletSyncedState.address}`);

    // Load contract module
    const modulePath = path.join(process.cwd(), 'contracts', 'managed', contractName, 'contract', 'index.cjs');
    const fileUrl = path.isAbsolute(modulePath) ? new URL(`file://${modulePath}`).href : modulePath;
    contractModule = await import(fileUrl);
    const contractInstance = new contractModule.Contract({});

    // Create wallet provider
    const walletState: any = await Rx.firstValueFrom(walletInstance.state());

    const walletProvider = {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx: (tx: any, newCoins: any) => {
        return walletInstance
          .balanceTransaction(
            ZswapTransaction.deserialize(
              tx.serialize(getLedgerNetworkId()),
              getZswapNetworkId()
            ),
            newCoins
          )
          .then((tx: any) => walletInstance.proveTransaction(tx))
          .then((zswapTx: any) =>
            Transaction.deserialize(
              zswapTx.serialize(getZswapNetworkId()),
              getLedgerNetworkId()
            )
          )
          .then(createBalancedTx);
      },
      submitTx: (tx: any) => {
        return walletInstance.submitTransaction(tx);
      },
    };

    // Connect to deployed contract
    deployedContractInstance = await findDeployedContract({
      indexer: networkConfig.indexer,
      proofServer: networkConfig.proofServer,
      node: networkConfig.node,
    }, {
      contractAddress: deployment.contractAddress,
      contract: contractInstance,
      privateStateId: 'compliantsState',
      initialPrivateState: {},
    });

    console.log('✅ Contract and wallet initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing contract:', error);
    throw error;
  }
}

export async function getReport(reportId: number): Promise<Report> {
  if (!deployedContractInstance) {
    await initializeContract();
  }

  try {
    // Call the getReport method on the contract
    // This is a placeholder - the actual method might be different
    const report: any = await deployedContractInstance.callTx.getReport(reportId);

    return {
      report_id: report.report_id,
      institution_name: report.institution_name,
      report_details: report.report_details,
      institution_type: report.institution_type,
      timestamp: report.timestamp,
      informer: report.informer
    };
  } catch (error) {
    console.error('Error getting report:', error);
    throw error;
  }
}

export async function submitReport(
  institution_name: string,
  report_details: string,
  institution_type: string, // This should be the enum value
  timestamp: number
): Promise<any> {
  if (!deployedContractInstance) {
    await initializeContract();
  }

  try {
    // Call the submitReport method on the contract
    const tx = await deployedContractInstance.callTx.submitReport(
      institution_name,
      report_details,
      institution_type, // The enum should be passed directly
      timestamp
    );

    return {
      success: true,
      transactionId: tx.public.txId,
      message: 'Report submitted successfully',
      reportId: 1 // Actual implementation would return the real report ID
    };
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

export async function updateCaseStatus(
  report_id: number,
  new_status: string
): Promise<any> {
  if (!deployedContractInstance) {
    await initializeContract();
  }

  try {
    // Call the updateCaseStatus method on the contract
    const tx = await deployedContractInstance.callTx.updateCaseStatus(report_id, new_status);

    return {
      success: true,
      transactionId: tx.public.txId,
      message: 'Case status updated successfully'
    };
  } catch (error) {
    console.error('Error updating case status:', error);
    throw error;
  }
}

export async function sendFeedback(
  report_id: number,
  feedback_message: string
): Promise<any> {
  if (!deployedContractInstance) {
    await initializeContract();
  }

  try {
    // Call the sendFeedback method on the contract
    const tx = await deployedContractInstance.callTx.sendFeedback(report_id, feedback_message);

    return {
      success: true,
      transactionId: tx.public.txId,
      message: 'Feedback sent successfully'
    };
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
}

export async function getWalletData() {
  if (!walletInstance) {
    await initializeContract();
  }

  try {
    const walletState: any = await Rx.firstValueFrom(walletInstance.state());
    const balance = walletState.balances[nativeToken()] || 0n;

    return {
      walletAddress: walletState.address,
      balance: balance.toString()
    };
  } catch (error) {
    console.error('Error getting wallet data:', error);
    throw error;
  }
}