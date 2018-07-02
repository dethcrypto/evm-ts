import { expect } from "chai";
import { EVMJS } from "./EVMJS";

import { VM, IEnvironment } from "../../VM";
import { IMachineState } from "../../VM";
import { decodeBytecode } from "../../decodeBytecode";

export async function compareWithReferentialImpl(code: string, env?: Partial<IEnvironment>): Promise<void> {}

export async function compareWithReferentialImpl2(codes: string[], env?: Partial<IEnvironment>): Promise<void> {
  const evmJs = new EVMJS();
  await evmJs.setup();
  // const evmTs = new EvmJs()

  for (const code of codes) {
    const ethereumJsResult = await evmJs.runTx(code, env);
    const evmTsResult = runEvm(code, env);

    expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.runState.stack.toString());
    expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.runState.memory.toString());
  }
}

export function runEvm(bytecode: string, env?: Partial<IEnvironment>): IMachineState {
  const bytecodeRunner = new VM(decodeBytecode(bytecode), env);

  bytecodeRunner.run();

  return bytecodeRunner.state;
}
