import { expect } from "chai";
import * as rlp from "rlp";
import { zip, Dictionary } from "lodash";

import { EVMJS } from "./EVMJS";
import { VM, IEnvironment, IStepContext, IMachineState } from "../../lib/VM";
import { FakeBlockchain, ITransactionResult, IExternalTransaction } from "../../lib/FakeBlockchain";
import { byteStringToNumberArray } from "../../lib/utils/bytes";

export async function compareWithReferentialImpl(code: string, env?: Partial<IEnvironment>): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();

  const ethereumJsResult = await evmJs.runCode(code, env);
  const evmTsResult = runEvm(code, { value: env && env.value, data: env && env.data });

  expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.runState.stack.toString());
  expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.runState.memory.toString());
  expect(evmTsResult.storage).to.be.deep.eq(await getFullContractStorage(ethereumJsResult));
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

interface IEqualState {
  stack: string;
  memory: string;
  pc: number;
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

  const evmJsStates: IEqualState[][] = [];
  const evmTsStates: IEqualState[][] = [];

  function getLastArray(nestedArrays: any[][]): any[] {
    return nestedArrays[nestedArrays.length - 1];
  }

  // setup JS event listeners
  const evmJsStepListener = (data: any) => {
    getLastArray(evmJsStates).push({ stack: data.stack.toString(), memory: data.memory.toString(), pc: data.pc });
  };
  evmJs.vm.on("step", evmJsStepListener);

  // setup TS event listeners
  const evmTsStepListener = (data: IStepContext) => {
    getLastArray(evmTsStates).push({
      stack: data.previousState.stack.toString(),
      memory: data.previousState.memory.toString(),
      pc: data.previousState.pc,
    });
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
        data: byteStringToNumberArray(tx.data!),
        to: tx.to,
        value: tx.value,
      });
    },
  };
  await script(tsVmAdapter);

  //compare results
  let stepCounter = 0;
  for (let [evmJsResult, evmTsResult] of zip(evmJsStates, evmTsStates)) {
    expect(evmTsResult).to.deep.eq(evmJsResult, `Internal state doesnt match at tx no: ${stepCounter++}`);
  }
}

export function runEvm(bytecode: string, env?: Partial<IEnvironment>): IMachineState {
  const vm = new VM();

  vm.runCode({ ...env, code: byteStringToNumberArray(bytecode) });

  return vm.state;
}

//tslint:disable-next-line
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

function getFullContractStorage(ethereumJsResult: any): Promise<Dictionary<string>> {
  return new Promise((resolve, reject) => {
    ethereumJsResult.runState.stateManager._getStorageTrie(ethereumJsResult.runState.address, (err: any, res: any) => {
      if (err) {
        reject(err);
        return;
      }

      const storage: Dictionary<string> = {};

      const readStream = res.createReadStream();

      readStream.on("data", (data: any) => {
        const key: string = parseInt(data.key.toString("hex")).toString(); // @todo this is quite ugly and obviously won't work in any case. To fix when storage implementation in evm-ts gets better
        const value: string = rlp.decode(data.value).toString("hex");

        storage[key] = value;
      });

      readStream.on("end", () => {
        resolve(storage);
      });
    });
  });
}
