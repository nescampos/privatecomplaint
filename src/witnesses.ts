import ContractModule, { Ledger } from '../contracts/managed/compliants/contract/index.cjs';
import type { Contract as ContractType, Witnesses } from '../contracts/managed/compliants/contract/index.cjs';
import { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export * from '../contracts/managed/compliants/contract/index.cjs';
export const ledger = ContractModule.ledger;
export const pureCircuits = ContractModule.pureCircuits;
export const { Contract } = ContractModule;
export type Contract<T, W extends Witnesses<T> = Witnesses<T>> = ContractType<T, W>;

export type PrivateState = {  
  readonly secretKey: Uint8Array; 
};

export const createPrivateState = () => ({
   secretKey : process.env.WALLET_SEED!, 
});

export const witnesses = {
  secretKey: ({
    privateState,
  }: WitnessContext<Ledger, PrivateState>): [ PrivateState, Uint8Array,] => [privateState, privateState.secretKey],
};