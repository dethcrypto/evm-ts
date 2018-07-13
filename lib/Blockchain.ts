import { BN } from "bn.js";
import * as invariant from "invariant";

import { VM, IMachineState, TStorage } from "./VM";
import { TDictionary } from "../@types/std";

export interface IAccount {
  value: BN;
  code?: ReadonlyArray<number>;
  storage?: TStorage;
}

// @todo this is too permissive
export interface ITransaction {
  to?: string;
  data?: number[];
  value?: BN;
}

export interface ITransactionResult {
  account: IAccount;
  runState: IMachineState;
  accountCreated?: string;
}

export class Blockchain {
  public readonly vm = new VM();
  private accounts: TDictionary<IAccount> = {};
  private nextAccountId = 0x0; // for now we dont implement priv/pub keys or anything

  // @todo REFACTOR
  public runTx(tx: ITransaction): ITransactionResult {
    invariant(tx.data || tx.to || tx.value, "Tx is empty");

    if (!tx.to) {
      const result = this.vm.runCode({ code: tx.data, value: tx.value || new BN(0) });
      invariant(result.state.return, "Code deployment has to return code");

      this.accounts[this.nextAccountId++] = {
        value: new BN(0), // @todo tx value always 0.
        code: result.state.return,
        storage: result.state.storage,
      };

      return {
        account: this.accounts[this.nextAccountId],
        runState: result.state,
        accountCreated: (this.nextAccountId - 1).toString(),
      };
    } else {
      const contract = this.accounts[tx.to];
      invariant(contract, `Account ${tx.to} not found!`);

      const result = this.vm.runCode(
        { code: contract.code, value: tx.value || new BN(0), data: tx.data },
        contract.storage,
      );

      this.accounts[tx.to] = {
        ...contract,
        storage: result.state.storage,
      };

      return {
        account: contract,
        runState: result.state,
      };
    }
  }
}
