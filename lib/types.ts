import { BN } from "bn.js";

import { Opcode } from "./opcodes/common";
import { Stack } from "./utils/Stack";
import { VM } from "./VM";

// based on ethereum yellowpaper
type Block = {
  parentHash: string;
  unclesHash: string; // ommersHash
  beneficiary: string;
  stateRoot: string;
  transactionsRoot: string;
  receiptsRoot: string;
  logsBloom: string;
  difficulty: number;
  ancestorBlocksNo: number; // number
  gasLimit: number;
  gasUser: number;
  timestamp: number;
  extraData: string;
  mixHash: string;
};

export type Blockchain = {
  getAddress(address: string): Account;
  setAddress(address: string, account: Account): void;
} & Layered;

export interface Layered {
  checkpoint(): void;
  revert(): void;
  commit(): void;
}

export interface StepContext {
  previousState: MachineState;
  previousEnv: Environment;
  currentOpcode: Opcode;
  vm: VM;
}

export interface VmEvents {
  step: StepContext;
}

export interface MachineState {
  pc: number;
  stack: Stack<BN>;
  memory: number[];
  stopped: boolean;
  reverted: boolean;
  return?: ReadonlyArray<number>;
  lastReturned: ReadonlyArray<number>; // EIP-211
}

// @todo
// this should be union type ContractAccount | PersonalAccount
export interface Account {
  readonly address: string;
  readonly nonce: number;
  readonly value: BN;
  readonly code: ReadonlyArray<number>;
  readonly storage: ReadonlyDictionary<string>;
}

export interface ExternalTransaction {
  to?: string;
  data?: string; // @todo this is the only difference between this and ITransaction
  value?: BN;
}

// @todo this is too permissive
export interface Transaction {
  from: string;
  to?: string;
  data?: number[];
  value?: BN;
}

export interface TransactionResult {
  account: Account;
  runState: MachineState;
  accountCreated?: string;
}

export type Environment = {
  account: string; // @todo: we need a separate (opaque) type for addresses
  caller: string;
  code: ReadonlyArray<number>;
  data: ReadonlyArray<number>;
  value: BN;
  depth: number;
};

export declare type ReadonlyDictionary<T, K extends string | number = string> = { readonly [key in K]: T };
