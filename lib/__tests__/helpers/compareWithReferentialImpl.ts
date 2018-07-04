import { expect } from "chai";
import { EVMJS } from "./EVMJS";

import { VM, IEnvironment } from "../../VM";
import { IMachineState } from "../../VM";
import { Blockchain, ITransactionResult } from "../../Blockchain";
import { byteStringToNumberArray } from "../../utils/bytes";

export async function compareWithReferentialImpl(code: string, env?: Partial<IEnvironment>): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();

  const ethereumJsResult = await evmJs.runTx(code, env);
  const evmTsResult = runEvm(code, { value: env && env.value });

  expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.vm.runState.stack.toString());
  expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.vm.runState.memory.toString());
}

export async function compareTransactionsWithReferentialImpl(
  codes: string[],
  env?: Partial<IEnvironment>,
): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();
  const evmTsBlockchain = new Blockchain();

  let deployedAddress: string | undefined = undefined;

  for (const code of codes) {
    const ethereumJsResult = await evmJs.runTx(code, env);
    const evmTsResult: ITransactionResult = evmTsBlockchain.runTx({
      data: byteStringToNumberArray(code),
      value: env && env.value,
      to: deployedAddress,
    });

    expect(evmTsResult.runState.stack.toString()).to.be.eq(ethereumJsResult.vm.runState.stack.toString());
    expect(evmTsResult.runState.memory.toString()).to.be.eq(ethereumJsResult.vm.runState.memory.toString());
    deployedAddress = evmTsResult.accountCreated;
  }
}

export function runEvm(bytecode: string, env?: Partial<IEnvironment>): IMachineState {
  const vm = new VM();

  vm.runCode({ ...env, code: byteStringToNumberArray(bytecode) });

  return vm.state;
}
