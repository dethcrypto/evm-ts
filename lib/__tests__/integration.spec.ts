import * as fs from "fs";
import { join } from "path";
import * as Web3 from "web3";
const web3 = new Web3();

import {
  compareWithReferentialImpl,
  compareTransactionsWithReferentialImpl,
} from "./helpers/compareWithReferentialImpl";

describe("EMV-TS", () => {
  it("should work", () => compareWithReferentialImpl("60606040523415600e"));

  it("should work with more complicated bytecode", () => {
    const bin = fs.readFileSync(join(__dirname, "./contracts/DumbContract.bin"), "utf-8");
    const abi = JSON.parse(fs.readFileSync(join(__dirname, "./contracts/DumbContract.abi"), "utf-8"));
    const contract = web3.eth.contract(abi).at("0x0");

    const callTestFunctionData = contract.test.getData().slice(2);

    return compareTransactionsWithReferentialImpl([bin, callTestFunctionData, callTestFunctionData], undefined);
  });
});
