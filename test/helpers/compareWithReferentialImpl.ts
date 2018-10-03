import { expect } from "chai";
import { zip, mapValues } from "lodash";

import { EVMJS, commonAddressString } from "./EVMJS";
import { FakeBlockchain } from "../../lib/FakeBlockchain";
import { byteStringToNumberArray } from "../../lib/utils/bytes";
import { BN } from "bn.js";
import { IEnvironment, IExternalTransaction, ITransactionResult, IStepContext, IMachineState } from "lib/types";
import { Dictionary } from "ts-essentials";

export async function compareWithReferentialImpl(code: string, env?: Partial<IEnvironment>): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();

  const ethereumJsResult = await evmJs.runCode(code, env);
  const evmTsResult = runEvm(code, env);

  expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.runState.stack.toString());
  expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.runState.memory.toString());
  expect(evmTsResult.storage).to.be.deep.eq(await evmJs.getFullContractStorage(ethereumJsResult.runState.address));
}

export async function compareInvalidCodeWithReferentialImpl(
  code: string,
  jsError: string,
  tsError: string,
  env?: Partial<IEnvironment>,
): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();

  const jsAsyncResult = await evmJs.runCode(code, env).catch(e => e);

  expect(jsAsyncResult.error).to.be.eq(jsError);

  expect(() => runEvm(code, { value: env && env.value, data: env && env.data })).to.throw(tsError);
}

export interface IEqualAccount {
  storage: Dictionary<string>;
}

export interface IEqualState {
  opcode: string;
  stack: string;
  memory: string;
  pc: number;
  address: string;
  code: string;
  data: string;
}

interface IVm {
  type: "js" | "ts";
  runTx(tx: IExternalTransaction): Promise<ITransactionResult>;
}

/**
 * Runs `script` twice. Once with JS impl and once with TS one.
 * When we reach higher compatibility with EthereumJS this can be greatly simplified just by running script once and basically everything should be the same on both implementations.
 * Currently evm-ts returns totally different addresses etc.
 */
export async function compareTransactionsWithReferentialImpl(script: (vm: IVm) => Promise<void>): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();
  const evmTsBlockchain = new FakeBlockchain();

  if (process.env.DEBUG === "1") {
    setupDebuggingLogs(evmJs, evmTsBlockchain);
  }

  const evmJsStates: IEqualState[][] = [];
  const evmTsStates: IEqualState[][] = [];

  // HACK: this is a function injected only during tests that allow not implemented correctly opcodes access value from referential impl in JS so all values match
  (global as any).getStackValueFromJsEVM = (): any => {
    const stepIndex = evmTsStates.length - 1;
    const instructionIndex = evmTsStates[stepIndex].length - 1;

    return getLastElement(evmJsStates[stepIndex][instructionIndex + 1].stack.split(","));
  };

  function getLastElement<T>(array: T[]): T {
    return array[array.length - 1];
  }

  // setup JS event listeners
  const evmJsStepListener = (data: any) => {
    getLastElement(evmJsStates).push({
      opcode: data.opcode.name,
      stack: data.stack.toString(),
      memory: data.memory.toString(),
      pc: data.pc,
      address: data.address.toString("hex"),
      code: [...data.code].toString(),
      data: data.data.length === 1 ? "" : [...data.data].toString(), // otherwise empty buffer gets serialized to string incorrectly
    });
  };
  evmJs.vm.on("step", evmJsStepListener);

  // setup TS event listeners
  const evmTsStepListener = (ctx: IStepContext) => {
    getLastElement(evmTsStates).push({
      opcode: ctx.currentOpcode.type,
      stack: ctx.previousState.stack.toString(),
      memory: ctx.previousState.memory.toString(),
      pc: ctx.previousState.pc,
      address: ctx.previousEnv.account.address,
      code: ctx.previousEnv.code.toString(),
      data: ctx.previousEnv.data.toString(),
    });

    //we can already compare states here:
    const stepIndex = evmTsStates.length - 1;
    const instructionIndex = evmTsStates[stepIndex].length - 1;

    try {
      expect(evmTsStates[stepIndex][instructionIndex]).to.be.deep.eq(
        evmJsStates[stepIndex][instructionIndex],
        `Failed at STEP ${stepIndex}, instruction ${instructionIndex}`,
      );
    } catch (e) {
      //tslint:disable-next-line
      console.log("Previous frame JS:", JSON.stringify(evmJsStates[stepIndex][instructionIndex - 1]));
      //tslint:disable-next-line
      console.log("Previous frame TS:", JSON.stringify(evmTsStates[stepIndex][instructionIndex - 1]));
      throw e;
    }
  };
  evmTsBlockchain.vm.on("step", evmTsStepListener);

  // run js impl
  const jsVmAdapter: IVm = {
    type: "js",
    async runTx(tx: IExternalTransaction): Promise<ITransactionResult> {
      evmJsStates.push([]); // prepare empty state for listeners
      return await evmJs.runTx(tx);
    },
  };
  await script(jsVmAdapter);

  // run ts impl
  const tsVmAdapter: IVm = {
    type: "ts",
    async runTx(tx: IExternalTransaction): Promise<ITransactionResult> {
      evmTsStates.push([]); // prepare empty state for listeners
      return evmTsBlockchain.runTx({
        from: commonAddressString,
        data: byteStringToNumberArray(tx.data!),
        to: tx.to,
        value: tx.value || new BN(0),
      });
    },
  };
  await script(tsVmAdapter);

  //compare results
  let stepCounter = 0;
  for (let [evmJsResult, evmTsResult] of zip(evmJsStates, evmTsStates)) {
    expect(evmTsResult).to.deep.eq(evmJsResult, `Internal state doesnt match at tx no: ${stepCounter++}`);
  }

  const jsBlockchainState = await evmJs.getFullBlockchainDump();
  const tsBlockchainState: Dictionary<IEqualAccount> = mapValues(evmTsBlockchain.accounts, acc => ({
    storage: acc.storage,
  }));
  expect(tsBlockchainState).to.deep.eq(jsBlockchainState);
}

export function runEvm(bytecode: string, env?: Partial<IEnvironment>): IMachineState {
  const fakeBlockchain = new FakeBlockchain();

  const result = fakeBlockchain.vm.runCode({
    data: [],
    value: new BN(0),
    account: {
      address: commonAddressString,
      nonce: 0,
      value: new BN(0),
      storage: {},
      code: byteStringToNumberArray(bytecode),
    },
    caller: {
      address: commonAddressString,
      nonce: 0,
      value: new BN(0),
      storage: {},
      code: byteStringToNumberArray(bytecode),
    },
    code: byteStringToNumberArray(bytecode),
    depth: 0,
    ...env,
  });

  return result.state;
}

function setupDebuggingLogs(evmJs: EVMJS, evmTsBlockchain: FakeBlockchain): void {
  evmTsBlockchain.vm.on("step", ctx => {
    // tslint:disable-next-line
    console.log(`TS: ${ctx.previousState.pc} => ${ctx.currentOpcode.type}`);
  });

  evmJs.vm.on("step", (data: any) => {
    // tslint:disable-next-line
    console.log(`JS: ${data.pc} => ${data.opcode.name}`);
  });
}
