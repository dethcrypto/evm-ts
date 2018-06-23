import { expect } from "chai";
import * as VMJS from "ethereumjs-vm";
import { VM, IEnvironment } from "../../VM";
import { IMachineState } from "../../VM";
import { decodeBytecode } from "../../decodeBytecode";

export async function compareWithReferentialImpl(code: string): Promise<void> {
  const ethereumJsResult = await getEthereumJsResult(code);
  const evmTsResult = runEvm(code);

  expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.runState.stack.toString());
  expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.runState.memory.toString());
}

async function getEthereumJsResult(code: string, env?: IEnvironment): Promise<any> {
  const options = {
    code: Buffer.from(code, "hex"),
    gasLimit: Buffer.from("ffffffff", "hex"),
    value: env && env.value,
  };

  return new Promise<any>((resolve, reject) => {
    const vm = new VMJS();

    vm.runCode(options, (err: any, results: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });

    // useful for debugging purposes
    // vm.on("step", function(data: any) {
    //   debugger;
    // });
  });
}

export function runEvm(bytecode: string, env?: Partial<IEnvironment>): IMachineState {
  const bytecodeRunner = new VM(decodeBytecode(bytecode), env);

  bytecodeRunner.run();

  return bytecodeRunner.state;
}
