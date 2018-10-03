import * as VMJS from "ethereumjs-vm";
import * as rlp from "rlp";
import * as Transaction from "ethereumjs-tx";
import * as Trie from "merkle-patricia-tree";
import * as Account from "ethereumjs-account";
import * as utils from "ethereumjs-util";

import invariant = require("invariant");
import { IEnvironment, IExternalTransaction, ITransactionResult } from "lib/types";
import { Dictionary } from "ts-essentials";
import { IEqualAccount } from "./compareWithReferentialImpl";
const keyPair = require("./keyPair");

const publicKeyBuf = Buffer.from(keyPair.publicKey, "hex");
export const commonAddress = utils.pubToAddress(publicKeyBuf, true);
export const commonAddressString = commonAddress.toString("hex");

export class EVMJS {
  private nonce = 0;
  public readonly vm: any;
  private stateTrie = new Trie();
  private stateManager: any;

  constructor() {
    this.vm = new VMJS({ state: this.stateTrie });
    this.stateManager = this.vm.stateManager;
  }

  public async setup(): Promise<void> {
    return new Promise<void>(res => {
      const account = new Account();
      account.balance = "0xf00000000000000001";

      this.stateTrie.put(commonAddress, account.serialize(), res);
    });
  }

  public async runCode(code: string, env: Partial<IEnvironment> = {}): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const data = env.data && Buffer.from(env.data as any);

      try {
        this.vm.runCode(
          {
            code: Buffer.from(code, "hex"),
            data,
            value: env.value,
            gasLimit: Buffer.from("ffffffff", "hex"),
          },
          (err: Error | undefined, results: any) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(results);
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  public async runTx(transaction: IExternalTransaction): Promise<ITransactionResult> {
    invariant(transaction.data, "Tx data is required");

    if (!transaction.data!.startsWith("0x")) {
      return this.runTx({
        data: "0x" + transaction.data!,
        to: transaction.to,
        value: transaction.value,
      });
    }

    const nonce = "0x" + this.nonce.toString(16);
    this.nonce += 1; // advance nonce for next tx;

    const tx = new Transaction({
      data: transaction.data,
      value: transaction.value,
      to: transaction.to,
      caller: commonAddress,
      nonce,
      gasPrice: "0x09184e72a000",
      gasLimit: "0x90710",
    });

    tx.sign(Buffer.from(keyPair.secretKey, "hex"));

    return new Promise<any>(async (resolve, reject) => {
      try {
        this.vm.runTx(
          {
            tx: tx,
          },
          (err: Error | undefined, results: any) => {
            if (err) {
              reject(err);
              return;
            }

            // @todo translating evmjs result to our internal type is not fully done
            resolve({
              account: {},
              runState: {},
              accountCreated: results.createdAddress && `0x${results.createdAddress.toString("hex")}`,
            });
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  getFullContractStorage(address: Buffer): Promise<Dictionary<string>> {
    return new Promise((resolve, reject) => {
      this.stateManager._getStorageTrie(address, (err: any, res: any) => {
        if (err) {
          reject(err);
          return;
        }

        const storage: Dictionary<string> = {};

        const readStream = res.createReadStream();

        readStream.on("data", (data: any) => {
          const key: string = parseInt(data.key.toString("hex")).toString(); // @todo this is quite ugly and obviously won't work in any case. To fix when storage implementation in evm-ts gets better
          const value: string = rlp.decode(data.value).toString("hex");

          // HACK: some differences between RLP decoded version and our current internal representation. Could be fragile :/
          const parsedValue = value.startsWith("0") ? value.slice(1) : value;

          storage[key] = parsedValue;
        });

        readStream.on("end", () => {
          resolve(storage);
        });
      });
    });
  }

  async getFullBlockchainDump(): Promise<Dictionary<IEqualAccount>> {
    const allAccounts = this.stateManager.allAccounts as Set<Buffer>;

    const dump: Dictionary<IEqualAccount> = {};
    for (const account of allAccounts) {
      dump[account.toString("hex")] = {
        storage: await this.getFullContractStorage(account),
      };
    }
    return dump;
  }
}
