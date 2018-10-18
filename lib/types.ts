import { BN } from "bn.js";

import { Opcode } from "./opcodes/common";
import { Stack } from "./utils/Stack";
import { VM } from "./VM";

export type IBlockchain = {
  getAddress(address: string): IAccount;
  setAddress(address: string, account: IAccount): void;
} & ILayered;

export interface ILayered {
  checkpoint(): void;
  revert(): void;
  commit(): void;
}

export interface IStepContext {
  previousState: IMachineState;
  previousEnv: IEnvironment;
  currentOpcode: Opcode;
  vm: VM;
}

export interface IVmEvents {
  step: IStepContext;
}

export interface IMachineState {
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
export interface IAccount {
  readonly address: string;
  readonly nonce: number;
  readonly value: BN;
  readonly code: ReadonlyArray<number>;
  readonly storage: ReadonlyDictionary<string>;
}

export interface IExternalTransaction {
  to?: string;
  data?: string; // @todo this is the only difference between this and ITransaction
  value?: BN;
}

// @todo this is too permissive
export interface ITransaction {
  from: string;
  to?: string;
  data?: number[];
  value?: BN;
}

export interface ITransactionResult {
  account: IAccount;
  runState: IMachineState;
  accountCreated?: string;
}

export type IEnvironment = {
  account: string; // @todo: we need a separate (opaque) type for addresses
  caller: string;
  code: ReadonlyArray<number>;
  data: ReadonlyArray<number>;
  value: BN;
  depth: number;
};

export declare type ReadonlyDictionary<T, K extends string | number = string> = { readonly [key in K]: T };
