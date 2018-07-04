import * as VMJS from "ethereumjs-vm";
import * as Transaction from "ethereumjs-tx";
import * as Trie from "merkle-patricia-tree";
import * as Account from "ethereumjs-account";
import * as utils from "ethereumjs-util";

import { IEnvironment } from "../../VM";
const keyPair = require("./keyPair");

export class EVMJS {
  private nonce = 0;
  private vm: any;
  private lastDeployedAddress?: string;
  private stateTrie = new Trie();

  constructor() {
    this.vm = new VMJS({ state: this.stateTrie });

    // useful for debugging purposes
    // this.vm.on("step", function(data: any) {
    //   console.log(`${data.pc} -> ${data.opcode.name}`);
    // });
  }

  public async setup(): Promise<void> {
    return new Promise<void>(res => {
      const publicKeyBuf = Buffer.from(keyPair.publicKey, "hex");
      const address = utils.pubToAddress(publicKeyBuf, true);

      const account = new Account();
      account.balance = "0xf00000000000000001";

      this.stateTrie.put(address, account.serialize(), res);
    });
  }

  public async runTx(data: string, env?: Partial<IEnvironment>): Promise<any> {
    if (!data.startsWith("0x")) {
      return this.runTx("0x" + data, env);
    }

    const nonce = "0x" + this.nonce.toString(16);
    this.nonce += 1; // advance nonce for next tx;

    const tx = new Transaction({
      data,
      value: env && env.value,
      to: this.lastDeployedAddress,
      nonce,
      gasPrice: "0x09184e72a000",
      gasLimit: "0x90710",
    });

    tx.sign(Buffer.from(keyPair.secretKey, "hex"));

    return new Promise<any>(async (resolve, reject) => {
      try {
        await this.vm.runTx(
          {
            tx: tx,
          },
          (err: Error | undefined, results: any) => {
            if (err) {
              reject(err);
              return;
            }

            if (results.createdAddress) {
              // tslint:disable-next-line
              this.lastDeployedAddress = "0x" + results.createdAddress.toString("hex");
            }

            resolve(results);
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
