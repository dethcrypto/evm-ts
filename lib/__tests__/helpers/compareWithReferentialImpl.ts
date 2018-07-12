import { expect } from "chai";
import { EVMJS } from "./EVMJS";

import { VM, IEnvironment, IStepContext } from "../../VM";
import { IMachineState } from "../../VM";
import { Blockchain } from "../../Blockchain";
import { byteStringToNumberArray } from "../../utils/bytes";
import { zip } from "lodash";

export async function compareWithReferentialImpl(code: string, env?: Partial<IEnvironment>): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();

  const ethereumJsResult = await evmJs.runCode(code, env);
  const evmTsResult = runEvm(code, { value: env && env.value, data: env && env.data });

  expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.runState.stack.toString());
  expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.runState.memory.toString());
}

interface IEqualState {
  stack: string;
  memory: string;
  pc: number;
}

export async function compareTransactionsWithReferentialImpl(
  codes: string[],
  env?: Partial<IEnvironment>,
  options?: { debug: boolean },
): Promise<void> {
  const debug = options && options.debug;

  const evmJs = new EVMJS();
  await evmJs.setup();
  const evmTsBlockchain = new Blockchain();

  if (debug) {
    setupDebuggingLogs(evmJs, evmTsBlockchain);
  }

  let deployedAddress: string | undefined = undefined;

  for (const code of codes) {
    const evmJsStates: IEqualState[] = [];
    const evmTsStates: IEqualState[] = [];

    const evmJsStepListener = (data: any) => {
      evmJsStates.push({ stack: data.stack.toString(), memory: data.memory.toString(), pc: data.pc });
    };
    evmJs.vm.on("step", evmJsStepListener);

    const evmTsStepListener = (data: IStepContext) => {
      evmTsStates.push({
        stack: data.previousState.stack.toString(),
        memory: data.previousState.memory.toString(),
        pc: data.previousState.pc,
      });
    };
    evmTsBlockchain.vm.on("step", evmTsStepListener);

    await evmJs.runTx(code, env);
    const evmTsResult = evmTsBlockchain.runTx({
      data: byteStringToNumberArray(code),
      value: env && env.value,
      to: deployedAddress,
    });

    let stepCounter = 0;
    for (let [evmJsResult, evmTsResult] of zip(evmJsStates, evmTsStates)) {
      expect(evmTsResult).to.deep.eq(evmJsResult, `Internal state doesnt match at step no: ${stepCounter++}`);
    }

    deployedAddress = evmTsResult.accountCreated;

    evmJs.vm.removeListener("step", evmJsStepListener);
    evmTsBlockchain.vm.removeListener("step", evmTsStepListener);
  }
}

export function runEvm(bytecode: string, env?: Partial<IEnvironment>): IMachineState {
  const vm = new VM();

  vm.runCode({ ...env, code: byteStringToNumberArray(bytecode) });

  return vm.state;
}

function setupDebuggingLogs(evmJs: EVMJS, evmTsBlockchain: Blockchain): void {
  evmTsBlockchain.vm.on("step", ctx => {
    // tslint:disable-next-line
    console.log(`TS: ${ctx.previousState.pc} => ${ctx.currentOpcode.type}`);
  });

  evmJs.vm.on("step", (data: any) => {
    // tslint:disable-next-line
    console.log(`JS: ${data.pc} => ${data.opcode.name}`);
  });
}
