import 'dotenv/config';
import express from 'express';
import path from 'path';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId,
} from '@midnight-ntwrk/midnight-js-network-id';
import { createBalancedTx } from '@midnight-ntwrk/midnight-js-types';
import { nativeToken, Transaction } from '@midnight-ntwrk/ledger';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { WebSocket } from 'ws';
import * as fs from 'fs';
import * as Rx from 'rxjs';
import { MidnightProviders } from './providers/midnight-providers.js';
import { EnvironmentManager } from './utils/environment.js';

// Fix WebSocket for Node.js environment - cast to any to avoid type conflicts
(globalThis as any).WebSocket = WebSocket;

// Configure for Midnight Testnet
setNetworkId(NetworkId.TestNet);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('web'));
app.use('/contracts', express.static('contracts'));

// Store the wallet and contract instances globally for this demo
// In production, you'd want to implement proper session management
let deployedContractInstance: any = null;
let walletInstance: any = null;
let contractModule: any = null;

// Initialize contract and wallet on startup
async function initializeContract() {
  try {
    console.log('Initializing contract and wallet...');

    // Validate environment
    EnvironmentManager.validateEnvironment();

    // Check for deployment file
    if (!fs.existsSync('deployment.json')) {
      console.error('❌ No deployment.json found! Run npm run deploy first.');
      return;
    }

    const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    console.log(`Contract Address: ${deployment.contractAddress}`);

    const networkConfig = EnvironmentManager.getNetworkConfig();
    const contractName = deployment.contractName || process.env.CONTRACT_NAME || 'compliants';
    const walletSeed = process.env.WALLET_SEED!;

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
    contractModule = await import(modulePath);
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

    // Configure providers
    const providers = MidnightProviders.create({
      contractName,
      walletProvider,
      networkConfig,
    });

    // Connect to deployed contract
    deployedContractInstance = await findDeployedContract(providers, {
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

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    contractInitialized: !!deployedContractInstance,
    walletConnected: !!walletInstance
  });
});

app.get('/api/dashboard', async (req, res) => {
  try {
    if (!walletInstance) {
      throw new Error('Wallet not initialized');
    }

    const walletState: any = await Rx.firstValueFrom(walletInstance.state());
    const balance = walletState.balances[nativeToken()] || 0n;

    // In a real app, we'd query the actual ledger state to get report counts
    // For now, return basic info
    res.json({
      totalReports: 0, // Would query the reports counter from the contract
      openReports: 0,
      closedReports: 0,
      pendingFeedback: 0,
      walletAddress: walletState.address,
      balance: balance.toString()
    });
  } catch (error: any) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports/submit', async (req, res) => {
  try {
    const { institution_name, report_details, institution_type, timestamp } = req.body;

    if (!deployedContractInstance) {
      throw new Error('Contract not initialized');
    }

    // Call the submitReport method on the contract
    const tx = await deployedContractInstance.callTx.submitReport(
      institution_name,
      report_details,
      institution_type, // The enum should be passed directly
      timestamp || Math.floor(Date.now() / 1000)
    );

    res.json({ 
      success: true, 
      transactionId: tx.public.txId,
      message: 'Report submitted successfully',
      reportId: 1// (await Rx.firstValueFrom(walletInstance.state() as any)).reportsCount // This is illustrative - actual report ID logic would be in the contract
    });
  } catch (error: any) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    // This would query the contract's report list
    // Since we can't directly query maps in the ledger state via the SDK easily,
    // we would need to implement a way to track reports locally or use an indexer
    // For now, return an empty array
    res.json({ reports: [] });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contralor/report/:id', async (req, res) => {
  try {
    const reportId = parseInt(req.params.id);

    if (!deployedContractInstance) {
      throw new Error('Contract not initialized');
    }

    // Call the getReport method on the contract
    const report: any = await deployedContractInstance.callTx.getReport(reportId);

    res.json({ report });
  } catch (error: any) {
    console.error('Error getting report:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contralor/update-status', async (req, res) => {
  try {
    const { report_id, new_status } = req.body;

    if (!deployedContractInstance) {
      throw new Error('Contract not initialized');
    }

    // Call the updateCaseStatus method on the contract
    const tx = await deployedContractInstance.callTx.updateCaseStatus(report_id, new_status);

    res.json({ 
      success: true, 
      transactionId: tx.public.txId,
      message: 'Case status updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating case status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contralor/send-feedback', async (req, res) => {
  try {
    const { report_id, feedback_message } = req.body;

    if (!deployedContractInstance) {
      throw new Error('Contract not initialized');
    }

    // Call the sendFeedback method on the contract
    const tx = await deployedContractInstance.callTx.sendFeedback(report_id, feedback_message);

    res.json({ 
      success: true, 
      transactionId: tx.public.txId,
      message: 'Feedback sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve the main page and deployment file
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'web', 'index.html'));
});

app.get('/deployment.json', (req, res) => {
  if (fs.existsSync('deployment.json')) {
    res.sendFile(path.join(process.cwd(), 'deployment.json'));
  } else {
    res.status(404).json({ error: 'Deployment file not found. Please deploy the contract first.' });
  }
});

// Initialize the contract and start the server
async function startServer() {
  try {
    await initializeContract();
    
    app.listen(PORT, () => {
      console.log(`🌙 Compliants Web App listening at http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error);
  }
}

startServer();