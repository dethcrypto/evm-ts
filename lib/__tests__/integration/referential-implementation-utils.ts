import { expect } from "chai";
import * as VM from "ethereumjs-vm";

import { runEvm } from "../../runEvm";

export async function compareWithReferentialImpl(code: string): Promise<void> {
  const ethereumJsResult = await getEthereumJsResult(code);
  const evmTsResult = runEvm(code);

  expect(ethereumJsResult.runState.stack.toString()).to.be.eq(evmTsResult.stack.toString());
  expect(ethereumJsResult.runState.memory.toString()).to.be.eq(evmTsResult.memory.toString());
}

async function getEthereumJsResult(code: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const vm = new VM();

    vm.runCode(
      {
        code: Buffer.from(code, "hex"),
        gasLimit: Buffer.from("ffffffff", "hex"),
      },
      (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      },
    );

    // useful for debugging purposes
    // vm.on("step", function(data: any) {
    //   debugger;
    // });
  });
}
