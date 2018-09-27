import * as fs from "fs";
import { join } from "path";
import * as Web3 from "web3";
const web3 = new Web3();

import {
  compareWithReferentialImpl,
  compareTransactionsWithReferentialImpl,
} from "./helpers/compareWithReferentialImpl";

function loadContract(fullName: string): { bin: string; abi: any; wrapper: any } {
  const bin = fs.readFileSync(join(__dirname, "./contracts-compiled/", `${fullName}.bin`), "utf-8");
  const abi = JSON.parse(fs.readFileSync(join(__dirname, "./contracts-compiled", `${fullName}.abi`), "utf-8"));
  const wrapper = web3.eth.contract(abi).at("0x0");

  return { bin, abi, wrapper };
}

describe("EMV-TS", () => {
  it("should work", () => compareWithReferentialImpl("60606040523415600e"));

  it("should work with more complicated bytecode", () => {
    const { bin, wrapper } = loadContract("simple/Simple");
    const callTestFunctionData: string = wrapper.test.getData().slice(2);

    return compareTransactionsWithReferentialImpl(async vm => {
      const deploymentResult = await vm.runTx({ data: bin });
      const contractAddress = deploymentResult.accountCreated;

      await vm.runTx({ data: callTestFunctionData, to: contractAddress });
      await vm.runTx({ data: callTestFunctionData, to: contractAddress });
    });
  });
});
