import { expect } from "chai";
import * as VM from "ethereumjs-vm";

import { runEvm } from "../../runEvm";

export async function compareWithReferentialImpl(code: string): Promise<void> {
  const ethereumJsResult = await getEthereumJsResult(code);
  const evmTsResult = runEvm(code);

  expect(evmTsResult.stack.toString()).to.be.eq(ethereumJsResult.runState.stack.toString());
  expect(evmTsResult.memory.toString()).to.be.eq(ethereumJsResult.runState.memory.toString());
}

async function getEthereumJsResult(code: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const vm = new VM();

    vm.runCode(
      {
        code: Buffer.from(code, "hex"),
        gasLimit: Buffer.from("ffffffff", "hex"),
        value: 0,
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
