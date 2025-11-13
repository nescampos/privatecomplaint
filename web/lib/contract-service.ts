import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { NetworkId, setNetworkId, getZswapNetworkId, getLedgerNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { createBalancedTx } from '@midnight-ntwrk/midnight-js-types';
import { Transaction } from '@midnight-ntwrk/ledger';
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import { Contract as WhistleblowerContract } from '../../contracts/managed/compliants/contract/index.cjs';
import fs from 'fs';
import path from 'path';
import * as Rx from "rxjs";
import { EnvironmentManager } from "../../src/utils/environment.js";
import { MidnightProviders } from "../../src/providers/midnight-providers.js";
import { witnesses } from "../../src/witnesses.js";
// Configurar la red
export const NETWORK_ID = NetworkId.TestNet;
setNetworkId(NETWORK_ID);

export interface ContractService {
  submitReport: (institutionName: string, details: string, institutionType: number) => Promise<any>;
  //getReport: (reportId: number) => Promise<any>;
}

export async function initializeContract(): Promise<ContractService> {
  try {
    // Cargar el contrato
    
    EnvironmentManager.validateEnvironment();
    //contractInstance1.circuits.submitReport()

    const networkConfig = EnvironmentManager.getNetworkConfig();
    const contractName = process.env.CONTRACT_NAME || "compliants";

    // Conectar al contrato desplegado
    const deploymentData = fs.readFileSync('deployment.json', 'utf-8');
    const deployment = JSON.parse(deploymentData);
    
    
    if (!deployment.contractAddress) {
      throw new Error('No se encontró la dirección del contrato desplegado');
    }

    const wallet = await WalletBuilder.buildFromSeed(
        networkConfig.indexer,
        networkConfig.indexerWS,
        networkConfig.proofServer,
        networkConfig.node,
        process.env.WALLET_SEED!,
        getZswapNetworkId(),
        "info"
    );

    wallet.start();

    const contractPath = path.join('../../contracts/managed/compliants/contract/index.cjs');
    const contractModule = await import(contractPath);
    const contractInstance = new contractModule.Contract({});

    const walletState = await Rx.firstValueFrom(wallet.state());

    const contractInstance1 = new WhistleblowerContract(witnesses);

    const walletProvider = {
        coinPublicKey: walletState.coinPublicKey,
        encryptionPublicKey: walletState.encryptionPublicKey,
        balanceTx: async (tx: any, newCoins: any) => {
        const balanced = await wallet.balanceTransaction(
            ZswapTransaction.deserialize(
            tx.serialize(getLedgerNetworkId()),
            getZswapNetworkId()
            ),
            newCoins
        );
        const proven = await wallet.proveTransaction(balanced);
        const deserialized = Transaction.deserialize(
            proven.serialize(getZswapNetworkId()),
            getLedgerNetworkId()
        );
        return createBalancedTx(deserialized);
        },
        submitTx: (tx: any) => wallet.submitTransaction(tx),
    };

    const providers = MidnightProviders.create({
      contractName,
      walletProvider,
      networkConfig,
    });


    const deployed = await findDeployedContract(providers,
      {
        contractAddress: deployment.contractAddress,
        contract: contractInstance,
        privateStateId: 'whistleblowerState',
        initialPrivateState: {},
      }
    );
    
    
    

    return {
      submitReport: async (institutionName: string, details: string, institutionType: number) => {
        const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
        return await contractInstance1.circuits.submitReport(
        undefined,
          institutionName,
          details,
          institutionType,
          currentTimestamp
        );
      },
    //   getReport: async (reportId: number) => {
    //     return await deployed.callTx.getReport(BigInt(reportId));
    //   },
    };
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw error;
  }
}
