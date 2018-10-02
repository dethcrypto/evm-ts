import { BN } from "bn.js";
import { Dictionary } from "ts-essentials";

import { Opcode } from "./opcodes/common";
import { Stack } from "./utils/Stack";
import { VM } from "./VM";

export interface IBlockchain {
  getAddress(address: string): IAccount;
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

export type TStorage = Dictionary<string>;

export interface IMachineState {
  pc: number;
  stack: Stack<BN>;
  memory: number[];
  storage: TStorage;
  stopped: boolean;
  return?: ReadonlyArray<number>;
  lastReturned: ReadonlyArray<number>; // EIP-211
}

// @todo
// this should be union type ContractAccount | PersonalAccount
// and should be immutable
export interface IAccount {
  address: string;
  nonce: number;
  value: BN;
  code: ReadonlyArray<number>;
  storage: TStorage;
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
  account: IAccount;
  caller: IAccount;
  code: ReadonlyArray<number>;
  data: ReadonlyArray<number>;
  value: BN;
  depth: number;
};
