import { BN } from "bn.js";
import * as invariant from "invariant";
import { Dictionary } from "ts-essentials";

import { VM, IMachineState, TStorage } from "./VM";

// @todo
// this should be union type ContractAccount | PersonalAccount
// and should be immutable
export interface IAccount {
  id: string; // @todo this should be BN
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

export class FakeBlockchain {
  public readonly vm = new VM();
  private accounts: Dictionary<IAccount> = {};
  private nextAccountId = 0x0; // for now we dont implement priv/pub keys or anything

  private createNewAccount(): IAccount {
    const account = {
      id: (this.nextAccountId++).toString(),
      value: new BN(0),
    };

    this.accounts[account.id] = account;

    return account;
  }

  public runTx(tx: ITransaction): ITransactionResult {
    invariant(tx.data || tx.to || tx.value, "Tx is empty");

    const deployingNewContract = !tx.to;

    const account = deployingNewContract ? this.createNewAccount() : this.accounts[tx.to!];
    invariant(account, `Account ${tx.to} not found!`);

    const codeToExecute = deployingNewContract ? tx.data : account.code;

    const result = this.vm.runCode({ code: codeToExecute, data: tx.data, value: tx.value }, account.storage);

    account.storage = result.state.storage;
    if (deployingNewContract) {
      account.code = result.state.return;
    }

    return {
      account,
      runState: result.state,
      accountCreated: deployingNewContract ? account.id : undefined,
    };
  }
}
